import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type CloudSyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

const SYNC_COLLECTIONS = [
  "ptos_user_profile",
  "ptos_goals",
  "ptos_projects",
  "ptos_tasks",
  "ptos_focus_sessions",
  "ptos_stuck_logs",
  "ptos_sleep_logs",
  "ptos_mood_logs",
  "ptos_workouts",
  "ptos_digital_logs",
  "ptos_distractions",
  "ptos_daily_mission",
  "ptos_frustrations",
  "ptos_lessons",
  "ptos_wins",
  "ptos_identity_evidence",
  "ptos_experiments",
  "ptos_operating_manual",
  "ptos_timeline",
  "ptos_weekly_reviews",
  "ptos_urge_logs",
  "ptos_daily_checkins",
  "ptos_water_logs",
  "ptos_expense_logs",
  "ptos_impulse_items",
  "ptos_daily_streaks",
  "ptos_knowledge_logs",
];

export class CloudSyncService {
  private static status: CloudSyncStatus = "idle";
  private static lastSyncedAt: Date | null = null;
  private static debounceTimer: NodeJS.Timeout | null = null;
  private static isSyncingInProgress = false;

  static getStatus(): { status: CloudSyncStatus; lastSyncedAt: Date | null } {
    return {
      status: this.status,
      lastSyncedAt: this.lastSyncedAt,
    };
  }

  private static notifyStatusChange(status: CloudSyncStatus) {
    this.status = status;
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ptos-sync-status", {
          detail: { status, lastSyncedAt: this.lastSyncedAt },
        })
      );
    }
  }

  /**
   * Syncs all local device data into the user's secure Google Cloud Firestore
   */
  static async uploadLocalDataToCloud(userId: string): Promise<boolean> {
    if (!db || !userId || typeof window === "undefined") {
      return false;
    }

    try {
      this.notifyStatusChange("syncing");

      const payloadBatch: Record<string, string> = {};
      for (const key of SYNC_COLLECTIONS) {
        const item = window.localStorage.getItem(key);
        if (item) {
          payloadBatch[key] = item;
        }
      }

      // Save each collection to Firestore doc under /users/{userId}/store/{key}
      const syncPromises = Object.entries(payloadBatch).map(async ([key, dataStr]) => {
        const docRef = doc(db as any, "users", userId, "store", key);
        return setDoc(
          docRef,
          {
            key,
            data: dataStr,
            userId,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      });

      await Promise.all(syncPromises);

      // Also record root sync metadata
      const userMetaRef = doc(db as any, "users", userId);
      await setDoc(
        userMetaRef,
        {
          userId,
          lastSyncTime: new Date().toISOString(),
          clientPlatform: "web_local_first",
        },
        { merge: true }
      );

      this.lastSyncedAt = new Date();
      this.notifyStatusChange("synced");
      return true;
    } catch (error) {
      console.error("Error uploading data to Firestore:", error);
      this.notifyStatusChange("error");
      return false;
    }
  }

  /**
   * Pulls user's cloud data from Firestore down into local storage
   */
  static async downloadCloudDataToLocal(userId: string): Promise<boolean> {
    if (!db || !userId || typeof window === "undefined") {
      return false;
    }

    try {
      this.notifyStatusChange("syncing");

      const storeColRef = collection(db as any, "users", userId, "store");
      const snapshot = await getDocs(storeColRef);

      const ACTIVE_UID_KEY = "ptos_active_account_uid";
      const previousActiveUid = window.localStorage.getItem(ACTIVE_UID_KEY);
      const isAccountSwitched = previousActiveUid && previousActiveUid !== userId;

      if (snapshot.empty) {
        // If an existing user on this machine was switched out, clear local cache for the new user
        if (isAccountSwitched) {
          for (const key of SYNC_COLLECTIONS) {
            window.localStorage.removeItem(key);
          }
        }
        // Save initial seed to cloud for this new user
        await this.uploadLocalDataToCloud(userId);
        window.localStorage.setItem(ACTIVE_UID_KEY, userId);
        return true;
      }

      // If user switched accounts, purge previous user's local entries before restoring
      if (isAccountSwitched) {
        for (const key of SYNC_COLLECTIONS) {
          window.localStorage.removeItem(key);
        }
      }

      let restoredCount = 0;
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data();
        if (docData && docData.key && docData.data) {
          window.localStorage.setItem(docData.key, docData.data);
          restoredCount++;
        }
      });

      window.localStorage.setItem(ACTIVE_UID_KEY, userId);
      this.lastSyncedAt = new Date();
      this.notifyStatusChange("synced");

      // Notify entire app of the loaded state
      window.dispatchEvent(new Event("ptos-data-change"));
      return true;
    } catch (error) {
      console.error("Error downloading cloud data:", error);
      this.notifyStatusChange("error");
      return false;
    }
  }

  /**
   * Queue debounced cloud sync whenever local data changes
   */
  static queueAutoSync(userId: string | null) {
    if (!userId || !db) return;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      if (this.isSyncingInProgress) return;
      this.isSyncingInProgress = true;
      try {
        await this.uploadLocalDataToCloud(userId);
      } finally {
        this.isSyncingInProgress = false;
      }
    }, 2500); // 2.5 second debounce for quiet network saving
  }
}
