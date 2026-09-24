"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Cloud,
  RefreshCw,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const UserAccountMenu: React.FC = () => {
  const {
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
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authError) {
      setShowErrorModal(true);
    }
  }, [authError]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await forceSyncNow();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const handleFastDemoLogin = () => {
    signInWithDemo("Mohit", "mohitjgujjar7@gmail.com");
    setShowErrorModal(false);
  };

  // If user is not logged in, show sleek Google Login button
  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={signInWithGoogle}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50"
          title="Sign in with your Google account to backup and sync your habits across devices"
        >
          {/* Google G SVG */}
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.14C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.01-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.27 6.6l4.01 3.14c.95-2.84 3.6-4.99 6.72-4.99z"
            />
          </svg>
          <span className="hidden sm:inline">
            {isLoading ? "Signing in..." : "Sign In with Google"}
          </span>
          <span className="sm:hidden">{isLoading ? "..." : "Sign In"}</span>
        </button>

        {/* Diagnostic Modal when Firebase setup or popups require attention */}
        {showErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Google Sign-In Activation
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Firebase Project: ptos-exec-89214
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    clearAuthError();
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <p className="font-semibold">
                  Google provider must be enabled once in your Firebase Console.
                </p>
                <div className="text-[11px] text-amber-800 space-y-1 pl-1">
                  <div>1. Open Firebase Console link below</div>
                  <div>2. Click <strong>Get started</strong> (if first time)</div>
                  <div>3. Click <strong>Google</strong> &rarr; Toggle <strong>Enable</strong> &rarr; Save</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="https://console.firebase.google.com/project/ptos-exec-89214/authentication/providers"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Open Firebase Console (Enable Google)</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={handleFastDemoLogin}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles size={14} className="text-orange-500" />
                  <span>Instant Test Login (mohitjgujjar7@gmail.com)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // When user is signed in, show profile chip + dropdown menu
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-xs"
        title={`${user.displayName || user.email} (Connected to Google)`}
      >
        {/* User avatar or photo */}
        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-orange-200 bg-orange-100 flex items-center justify-center shrink-0">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold text-orange-600">
              {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* User first name on desktop */}
        <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[90px] truncate">
          {user.displayName?.split(" ")[0] || "Account"}
        </span>

        {/* Sync dot */}
        <div
          className={`w-2 h-2 rounded-full ${
            syncStatus === "syncing"
              ? "bg-amber-400 animate-ping"
              : syncStatus === "error"
              ? "bg-rose-500"
              : "bg-emerald-500"
          }`}
          title={`Sync status: ${syncStatus}`}
        />
      </button>

      {/* Account Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
          {/* User info */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200 bg-orange-50 shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-orange-600">
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {user.displayName || "Google User"}
              </div>
              <div className="text-[11px] text-slate-500 font-mono truncate">
                {user.email}
              </div>
            </div>
          </div>

          {/* Cloud Sync Status Card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Google Cloud Sync</span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  syncStatus === "syncing"
                    ? "bg-amber-100 text-amber-800"
                    : syncStatus === "error"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {syncStatus === "syncing" ? "Syncing..." : syncStatus === "error" ? "Offline" : "Synced"}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              All habits, focus logs, and goals are securely tied to your Gmail. Available across all your devices.
            </p>

            {lastSyncedAt && (
              <div className="text-[10px] font-mono text-slate-400">
                Last synced: {lastSyncedAt.toLocaleTimeString()}
              </div>
            )}

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="w-full mt-1 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs disabled:opacity-60"
            >
              <RefreshCw size={12} className={isSyncing ? "animate-spin text-orange-500" : "text-slate-500"} />
              <span>{isSyncing ? "Syncing to Cloud..." : "Sync Cloud Now"}</span>
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out of Google</span>
          </button>
        </div>
      )}
    </div>
  );
};
