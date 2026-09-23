// comeback.mjg Focus & Urge Shield - Background Service Worker (Manifest V3)

const DEFAULT_DOMAINS = [
  "youtube.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "reddit.com",
  "tiktok.com",
  "facebook.com",
  "netflix.com",
  "twitch.tv"
];

const REDIRECT_BASE_URL = "https://ptos-exec-89214.web.app/focus?blocked=true&source=chrome_extension";

// Initialize state
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(["shieldActive", "domains", "durationMinutes"]);
  const shieldActive = data.shieldActive !== undefined ? data.shieldActive : false;
  const domains = data.domains || DEFAULT_DOMAINS;
  
  await chrome.storage.local.set({
    shieldActive,
    domains,
    durationMinutes: data.durationMinutes || 45,
    shieldExpiresAt: null
  });

  await updateBlockingRules(shieldActive, domains);
});

// Alarm for auto-expiration of focus shield blocks
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "focus_shield_timer") {
    await chrome.storage.local.set({ shieldActive: false, shieldExpiresAt: null });
    const { domains } = await chrome.storage.local.get("domains");
    await updateBlockingRules(false, domains || DEFAULT_DOMAINS);
    chrome.action.setBadgeText({ text: "" });
  }
});

// Handle messages from popup or external tabs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggle_shield") {
    handleToggleShield(message.active, message.durationMinutes).then(sendResponse);
    return true; // async response
  }
  if (message.action === "update_domains") {
    handleUpdateDomains(message.domains).then(sendResponse);
    return true;
  }
  if (message.action === "get_status") {
    chrome.storage.local.get(["shieldActive", "domains", "shieldExpiresAt"]).then(sendResponse);
    return true;
  }
});

async function handleToggleShield(active, durationMinutes = 45) {
  let expiresAt = null;
  if (active) {
    expiresAt = Date.now() + durationMinutes * 60 * 1000;
    chrome.alarms.create("focus_shield_timer", { delayInMinutes: durationMinutes });
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#ea580c" }); // Orange
  } else {
    chrome.alarms.clear("focus_shield_timer");
    chrome.action.setBadgeText({ text: "" });
  }

  await chrome.storage.local.set({ shieldActive: active, shieldExpiresAt: expiresAt });
  const { domains } = await chrome.storage.local.get("domains");
  await updateBlockingRules(active, domains || DEFAULT_DOMAINS);

  return { success: true, shieldActive: active, expiresAt };
}

async function handleUpdateDomains(domains) {
  await chrome.storage.local.set({ domains });
  const { shieldActive } = await chrome.storage.local.get("shieldActive");
  await updateBlockingRules(!!shieldActive, domains);
  return { success: true, domains };
}

async function updateBlockingRules(active, domains) {
  // Existing rule IDs to remove: 1..100
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existingRules.map((r) => r.id);

  if (!active || !domains || domains.length === 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules: []
    });
    return;
  }

  const addRules = domains.map((domain, index) => {
    return {
      id: index + 1,
      priority: 1,
      action: {
        type: "redirect",
        redirect: {
          url: `${REDIRECT_BASE_URL}&site=${encodeURIComponent(domain)}`
        }
      },
      condition: {
        urlFilter: `||${domain}`,
        resourceTypes: ["main_frame"]
      }
    };
  });

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules
  });
}
