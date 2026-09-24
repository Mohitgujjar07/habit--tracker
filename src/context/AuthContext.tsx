"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { AuthService } from "@/lib/firebase/authService";
import { CloudSyncService, CloudSyncStatus } from "@/services/cloudSyncService";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  syncStatus: CloudSyncStatus;
  lastSyncedAt: Date | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  forceSyncNow: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    // 1. Check redirect login result if any
    AuthService.checkRedirectResult().then((redirectUser) => {
      if (redirectUser) {
        setUser(redirectUser);
      }
    });

    // 2. Listen to sync status events from CloudSyncService
    const handleSyncStatus = (e: Event) => {
      const customEvent = e as CustomEvent<{ status: CloudSyncStatus; lastSyncedAt: Date | null }>;
      if (customEvent.detail) {
        setSyncStatus(customEvent.detail.status);
        if (customEvent.detail.lastSyncedAt) {
          setLastSyncedAt(customEvent.detail.lastSyncedAt);
        }
      }
    };
    window.addEventListener("ptos-sync-status", handleSyncStatus);

    // 3. Listen to Firebase auth state changes
    const unsubscribeAuth = AuthService.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      if (currentUser) {
        // User logged in: pull their cloud data to local device
        await CloudSyncService.downloadCloudDataToLocal(currentUser.uid);
      } else {
        setSyncStatus("idle");
      }
    });

    return () => {
      window.removeEventListener("ptos-sync-status", handleSyncStatus);
      unsubscribeAuth();
    };
  }, []);

  // 4. Auto-sync whenever local data changes and a user is signed in
  useEffect(() => {
    if (!user) return;

    const handleLocalDataChange = () => {
      CloudSyncService.queueAutoSync(user.uid);
    };

    window.addEventListener("ptos-data-change", handleLocalDataChange);
    return () => {
      window.removeEventListener("ptos-data-change", handleLocalDataChange);
    };
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const signedInUser = await AuthService.signInWithGoogle();
      if (signedInUser) {
        setUser(signedInUser);
        await CloudSyncService.downloadCloudDataToLocal(signedInUser.uid);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await AuthService.signOut();
      setUser(null);
      setSyncStatus("idle");
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("ptos_active_account_uid");
      }
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const forceSyncNow = async () => {
    if (!user) return;
    await CloudSyncService.uploadLocalDataToCloud(user.uid);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        syncStatus,
        lastSyncedAt,
        signInWithGoogle,
        signOut,
        forceSyncNow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
