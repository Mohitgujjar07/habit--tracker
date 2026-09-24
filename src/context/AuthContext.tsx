"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { AuthService } from "@/lib/firebase/authService";
import { CloudSyncService, CloudSyncStatus } from "@/services/cloudSyncService";

export interface AuthErrorState {
  code: string;
  message: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  syncStatus: CloudSyncStatus;
  lastSyncedAt: Date | null;
  authError: AuthErrorState | null;
  signInWithGoogle: () => Promise<void>;
  signInWithDemo: (name?: string, email?: string) => void;
  clearAuthError: () => void;
  signOut: () => Promise<void>;
  forceSyncNow: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [authError, setAuthError] = useState<AuthErrorState | null>(null);

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
      setAuthError(null);
      const signedInUser = await AuthService.signInWithGoogle();
      if (signedInUser) {
        setUser(signedInUser);
        await CloudSyncService.downloadCloudDataToLocal(signedInUser.uid);
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      const errorCode = error?.code || "unknown";
      let errorMsg = error?.message || "Sign-in failed. Please check your network connection.";

      if (
        errorCode === "auth/configuration-not-found" ||
        errorCode === "auth/operation-not-allowed" ||
        String(errorMsg).includes("CONFIGURATION_NOT_FOUND") ||
        String(errorMsg).includes("operation-not-allowed")
      ) {
        errorMsg = "Google Sign-In needs to be enabled once in Firebase Console.";
      } else if (errorCode === "auth/popup-blocked") {
        errorMsg = "Browser popup was blocked. Please allow popups for this site.";
      } else if (errorCode === "auth/popup-closed-by-user") {
        errorMsg = "Sign-in popup was closed before completing.";
      }

      setAuthError({ code: errorCode, message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithDemo = (name = "Mohit", email = "mohit@comeback.mjg") => {
    const demoUid = "user-local-" + Math.abs(email.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0));
    const mockUser: any = {
      uid: demoUid,
      displayName: name,
      email: email,
      photoURL: null,
    };
    setUser(mockUser);
    setAuthError(null);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ptos_active_account_uid", demoUid);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await AuthService.signOut();
      setUser(null);
      setSyncStatus("idle");
      setAuthError(null);
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
        authError,
        signInWithGoogle,
        signInWithDemo,
        clearAuthError,
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
