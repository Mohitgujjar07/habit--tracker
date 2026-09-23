import { getDailyQuote, MotivationalQuote } from "@/lib/quotes";

export interface NotificationSettings {
  enabled: boolean;
  time: string; // e.g. "06:00"
  lastDeliveredDate?: string; // YYYY-MM-DD
  soundEnabled: boolean;
}

const SETTINGS_KEY = "comeback-notification-settings";

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  time: "06:00",
  soundEnabled: true,
};

export class NotificationService {
  /**
   * Retrieve notification settings from local storage
   */
  static getSettings(): NotificationSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Error reading notification settings", e);
    }
    return DEFAULT_SETTINGS;
  }

  /**
   * Save partial notification settings
   */
  static saveSettings(settings: Partial<NotificationSettings>): NotificationSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("comeback-notification-settings-change", { detail: updated }));
      } catch (e) {
        console.error("Error saving notification settings", e);
      }
    }
    return updated;
  }

  /**
   * Check if web notifications are supported on this device/browser
   */
  static isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return "Notification" in window;
  }

  /**
   * Get current browser notification permission
   */
  static getPermission(): NotificationPermission | "unsupported" {
    if (!this.isSupported()) return "unsupported";
    return Notification.permission;
  }

  /**
   * Request native notification permission from the user
   */
  static async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return "denied";
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.error("Error requesting notification permission", e);
      return "denied";
    }
  }

  /**
   * Register service worker for push and notification background handling
   */
  static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return null;
    }
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      return reg;
    } catch (e) {
      console.warn("ServiceWorker registration skipped or failed:", e);
      return null;
    }
  }

  /**
   * Fires a native system notification with high-impact motivational theme
   */
  static async showNotification(
    quote: MotivationalQuote = getDailyQuote(),
    isTest = false
  ): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // 1. Dispatch custom event for in-app heads-up banner display
    window.dispatchEvent(
      new CustomEvent("comeback-in-app-notification", {
        detail: { quote, isTest, timestamp: new Date().toISOString() },
      })
    );

    // 2. If Notification permission is granted, fire system/mobile notification
    if (this.isSupported() && Notification.permission === "granted") {
      const title = isTest
        ? "comeback.mjg 🌅 Morning Kickstart (Test)"
        : "comeback.mjg 🌅 Morning Kickstart (6:00 AM)";

      const body = `"${quote.text}" — ${quote.author}\n\n👉 Today's Micro-Step: ${quote.actionAdvice}`;

      try {
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          if (reg && reg.showNotification) {
            await reg.showNotification(title, {
              body,
              icon: "/logo.png",
              badge: "/logo.png",
              tag: `comeback-morning-${isTest ? Date.now() : new Date().toISOString().slice(0, 10)}`,
              vibrate: [200, 100, 200, 100, 200],
              data: {
                url: "/dashboard",
                quoteId: quote.id,
              },
            } as any);
            return true;
          }
        }

        // Direct fallback
        new Notification(title, {
          body,
          icon: "/logo.png",
          badge: "/logo.png",
        });
        return true;
      } catch (err) {
        console.warn("Native notification display failed, fallback to in-app banner:", err);
      }
    }

    return false;
  }

  /**
   * Check if morning notification is due right now
   */
  static checkAndTriggerScheduledMorning(): boolean {
    const settings = this.getSettings();
    if (!settings.enabled) return false;

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    // If already delivered today, skip
    if (settings.lastDeliveredDate === todayStr) {
      return false;
    }

    // Parse target time (e.g. "06:00")
    const [targetHour, targetMinute] = settings.time.split(":").map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check if current time is past or at target time on the current day
    const isPastOrAtTarget =
      currentHour > targetHour ||
      (currentHour === targetHour && currentMinute >= targetMinute);

    if (isPastOrAtTarget) {
      const quote = getDailyQuote(now);
      this.showNotification(quote, false);
      this.saveSettings({ lastDeliveredDate: todayStr });
      return true;
    }

    return false;
  }

  /**
   * Instantly trigger a test notification with today's highlighted quote
   */
  static async testNotificationNow(): Promise<boolean> {
    const quote = getDailyQuote();
    return await this.showNotification(quote, true);
  }

  /**
   * Calculates milliseconds until the next scheduled alarm (e.g. tomorrow at 06:00 AM)
   */
  static getMsUntilNextAlarm(): number {
    const settings = this.getSettings();
    const [targetHour, targetMinute] = settings.time.split(":").map(Number);

    const now = new Date();
    const nextAlarm = new Date(now);
    nextAlarm.setHours(targetHour, targetMinute, 0, 0);

    // If target time has already passed today, set for tomorrow
    if (nextAlarm.getTime() <= now.getTime()) {
      nextAlarm.setDate(nextAlarm.getDate() + 1);
    }

    return nextAlarm.getTime() - now.getTime();
  }
}
