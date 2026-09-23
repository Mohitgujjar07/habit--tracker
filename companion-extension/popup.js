let currentShieldActive = false;
let currentDomains = [];
let currentDuration = 45;

document.addEventListener("DOMContentLoaded", async () => {
  const badgeStatus = document.getElementById("badgeStatus");
  const statusCard = document.getElementById("statusCard");
  const statusTitle = document.getElementById("statusTitle");
  const timerText = document.getElementById("timerText");
  const toggleBtn = document.getElementById("toggleBtn");
  const domainList = document.getElementById("domainList");
  const domainCount = document.getElementById("domainCount");
  const domainInput = document.getElementById("domainInput");
  const addDomainBtn = document.getElementById("addDomainBtn");
  const presetPills = document.querySelectorAll(".preset-pill");

  // Load state
  chrome.runtime.sendMessage({ action: "get_status" }, (data) => {
    if (!data) return;
    currentShieldActive = !!data.shieldActive;
    currentDomains = data.domains || [];
    renderUI();
  });

  presetPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      presetPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentDuration = parseInt(pill.getAttribute("data-min"), 10) || 45;
      if (!currentShieldActive) {
        toggleBtn.textContent = `Engage ${currentDuration}m Focus Block`;
      }
    });
  });

  toggleBtn.addEventListener("click", () => {
    const nextState = !currentShieldActive;
    chrome.runtime.sendMessage(
      { action: "toggle_shield", active: nextState, durationMinutes: currentDuration },
      (res) => {
        if (res && res.success) {
          currentShieldActive = res.shieldActive;
          renderUI();
        }
      }
    );
  });

  addDomainBtn.addEventListener("click", () => {
    const rawVal = domainInput.value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!rawVal) return;
    if (!currentDomains.includes(rawVal)) {
      currentDomains.push(rawVal);
      chrome.runtime.sendMessage({ action: "update_domains", domains: currentDomains }, () => {
        domainInput.value = "";
        renderDomainList();
      });
    }
  });

  function renderUI() {
    if (currentShieldActive) {
      statusCard.classList.add("active");
      badgeStatus.className = "badge badge-on";
      badgeStatus.textContent = "ACTIVE";
      statusTitle.textContent = "Distraction Shield: ENGAGED";
      toggleBtn.className = "switch-btn btn-disengage";
      toggleBtn.textContent = "Disengage Focus Shield";
      timerText.textContent = "● Blocking Sites";
    } else {
      statusCard.classList.remove("active");
      badgeStatus.className = "badge badge-off";
      badgeStatus.textContent = "IDLE";
      statusTitle.textContent = "Distraction Shield: OFF";
      toggleBtn.className = "switch-btn btn-engage";
      toggleBtn.textContent = `Engage ${currentDuration}m Focus Block`;
      timerText.textContent = "";
    }
    renderDomainList();
  }

  function renderDomainList() {
    domainCount.textContent = `${currentDomains.length} Sites`;
    domainList.innerHTML = "";
    currentDomains.forEach((domain, idx) => {
      const item = document.createElement("div");
      item.className = "domain-item";
      item.innerHTML = `
        <span>${domain}</span>
        <button class="del-btn" data-idx="${idx}">&times;</button>
      `;
      domainList.appendChild(item);
    });

    domainList.querySelectorAll(".del-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        currentDomains.splice(idx, 1);
        chrome.runtime.sendMessage({ action: "update_domains", domains: currentDomains }, () => {
          renderDomainList();
        });
      });
    });
  }
});
