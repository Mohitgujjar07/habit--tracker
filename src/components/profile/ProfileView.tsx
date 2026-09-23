"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { ExportService } from "@/services/exportService";
import { NotificationService, NotificationSettings } from "@/services/notificationService";
import { UserProfile } from "@/types";
import {
  User,
  Shield,
  Download,
  Trash2,
  RefreshCw,
  Sliders,
  Sparkles,
  Lock,
  Bell,
  Check,
  Smartphone,
  Sun,
  Clock,
} from "lucide-react";

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allowAI, setAllowAI] = useState(true);
  const [allowHealth, setAllowHealth] = useState(true);
  const [allowJournalAI, setAllowJournalAI] = useState(false);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(() => NotificationService.getSettings());
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | "unsupported">("default");
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setProfile(DataStoreRepository.getUserProfile());
    setNotifPermission(NotificationService.getPermission());
  }, []);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled && NotificationService.isSupported() && Notification.permission !== "granted") {
      const p = await NotificationService.requestPermission();
      setNotifPermission(p);
    }
    const updated = NotificationService.saveSettings({ enabled });
    setNotifSettings(updated);
  };

  const handleTimeChange = (time: string) => {
    const updated = NotificationService.saveSettings({ time });
    setNotifSettings(updated);
  };

  const handleSendTestNotification = async () => {
    if (NotificationService.isSupported() && Notification.permission !== "granted") {
      const p = await NotificationService.requestPermission();
      setNotifPermission(p);
    }
    await NotificationService.testNotificationNow();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  };

  const handleExportJSON = () => {
    ExportService.exportAsJSON();
  };

  const handleExportCSV = () => {
    ExportService.exportTasksAsCSV();
  };

  const handleResetData = () => {
    if (confirm("Reset to clean 30-day realistic demo state?")) {
      DataStoreRepository.resetToDemoData();
      window.location.reload();
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure? This permanently deletes all your local logs, tasks, and data.")) {
      DataStoreRepository.clearAllData();
      window.location.href = "/onboarding";
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 font-bold">
            SYSTEM PROFILE & SETTINGS
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Personal OS Profile & Privacy
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Manage your initial assumptions, data exports, privacy thresholds, and AI context access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJSON}
            className="text-xs gap-1.5 shadow-sm"
          >
            <Download size={14} /> Export JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5 shadow-sm"
          >
            <Download size={14} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card className="p-6 space-y-4 bg-white border-surface-200/80 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-lg border border-brand-500/20">
              {profile.preferredName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {profile.fullName || profile.preferredName}
              </h3>
              <p className="text-xs text-surface-500 capitalize">
                {profile.occupation} • {profile.country} • {profile.timezone}
              </p>
            </div>
          </div>
          <Badge variant="brand">Day {profile.transformationDay || 24} • Perpetual Momentum</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-surface-50 border border-surface-200">
            <span className="font-semibold text-surface-500 block mb-0.5">Primary Bottleneck</span>
            <span className="font-medium text-foreground">{profile.primaryBottleneck}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-50 border border-surface-200">
            <span className="font-semibold text-surface-500 block mb-0.5">Preferred Work Window</span>
            <span className="font-medium text-foreground">{profile.routine.preferredWorkHours}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-50 border border-surface-200">
            <span className="font-semibold text-surface-500 block mb-0.5">Coach Communication Style</span>
            <span className="font-medium text-foreground">{profile.coachStyle}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-50 border border-surface-200">
            <span className="font-semibold text-surface-500 block mb-0.5">Accountability Protocol</span>
            <span className="font-medium text-foreground">{profile.accountabilityStyle}</span>
          </div>
        </div>

        {/* North Star & Strategic Definition of Success */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80">
            <span className="font-semibold text-orange-700 block mb-1">
              North Star Vision (1–3 Years)
            </span>
            <p className="text-slate-800 font-medium italic">
              "{profile.northStarVision || "Build a sovereign, high-impact enterprise that yields complete financial, intellectual, and location independence."}"
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200">
            <span className="font-semibold text-brand-600 block mb-1">
              Personal Definition of Success
            </span>
            <p className="text-surface-700">
              "{profile.personalDefinitionOfSuccess}"
            </p>
          </div>
        </div>
      </Card>

      {/* Morning Motivational Alert Engine (6:00 AM) */}
      <Card className="p-6 space-y-4 bg-white border-orange-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Sun size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  Daily Morning Motivational Alert
                </h3>
                <Badge variant={notifSettings.enabled ? "brand" : "default"} size="sm">
                  {notifSettings.enabled ? "Active" : "Disabled"}
                </Badge>
              </div>
              <p className="text-xs text-surface-500 mt-0.5">
                Delivers your morning motivational quote & focus anchor on top of your mobile device.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifSettings.enabled}
              onChange={(e) => handleToggleNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          {/* Time Picker */}
          <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80 space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock size={14} className="text-orange-600" />
              <span>Morning Alert Time</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={notifSettings.time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
              />
              <span className="text-[11px] text-slate-500">
                Default: 06:00 AM daily
              </span>
            </div>
          </div>

          {/* Device Push Status */}
          <div className="p-3 rounded-xl bg-surface-50 border border-surface-200 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Smartphone size={14} className="text-slate-600" />
              <span>Mobile Notification Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold text-xs px-2 py-0.5 rounded-md ${
                  notifPermission === "granted"
                    ? "bg-emerald-100 text-emerald-700"
                    : notifPermission === "denied"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {notifPermission === "granted"
                  ? "Permission Granted ✓"
                  : notifPermission === "denied"
                  ? "Blocked in Browser"
                  : "Tap Test to Enable"}
              </span>
            </div>
          </div>
        </div>

        {/* Instant Test Action Banner */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Bell size={14} className="text-orange-500" />
              <span>Test Morning Alert on Your Device</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Instantly sends today's highlighted quote so you can see how it appears on top of your screen.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSendTestNotification}
            className="gap-1.5 shrink-0 shadow-sm"
          >
            {testSent ? (
              <>
                <Check size={14} />
                <span>Alert Sent!</span>
              </>
            ) : (
              <>
                <Bell size={14} />
                <span>Send Test Alert Now</span>
              </>
            )}
          </Button>
        </div>

        {/* PWA Tip */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500">
          💡 <strong>Pro Tip for Mobile:</strong> To receive notifications like a native app, open this page in Chrome or Safari on your phone, tap <strong>Share</strong> (or the browser menu) and select <strong>"Add to Home Screen"</strong>.
        </div>
      </Card>

      {/* Privacy & AI Context Controls (Section 74 & 113) */}
      <Card className="p-6 space-y-4 bg-white border-surface-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-brand-500" />
          <h3 className="text-sm font-bold text-foreground">
            Privacy & AI Context Access Controls
          </h3>
        </div>
        <p className="text-xs text-surface-500">
          You own your data. Control exactly which data streams are permitted into the AI coaching context.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 bg-surface-50/70 text-xs">
            <div>
              <div className="font-semibold text-foreground">Allow AI Task & Goal Context</div>
              <div className="text-[11px] text-surface-500">Used for task decomposition and recommendations</div>
            </div>
            <input
              type="checkbox"
              checked={allowAI}
              onChange={(e) => setAllowAI(e.target.checked)}
              className="accent-brand-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 bg-surface-50/70 text-xs">
            <div>
              <div className="font-semibold text-foreground">Allow Lifestyle & Sleep Data</div>
              <div className="text-[11px] text-surface-500">Used for correlating rest with focus performance</div>
            </div>
            <input
              type="checkbox"
              checked={allowHealth}
              onChange={(e) => setAllowHealth(e.target.checked)}
              className="accent-brand-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200 bg-surface-50/70 text-xs">
            <div>
              <div className="font-semibold text-foreground">Allow Frustration & Journal Analysis</div>
              <div className="text-[11px] text-surface-500">Permit AI to identify emotional triggers and resistance</div>
            </div>
            <input
              type="checkbox"
              checked={allowJournalAI}
              onChange={(e) => setAllowJournalAI(e.target.checked)}
              className="accent-brand-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 space-y-4 bg-white border-rose-200 shadow-sm">
        <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2">
          <Trash2 size={16} /> Danger Zone
        </h3>
        <p className="text-xs text-surface-500">
          Reset sample data or wipe all local database records.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetData}
            className="text-xs gap-1.5 shadow-sm"
          >
            <RefreshCw size={13} />
            <span>Reset Demo Data</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleClearAll}
            className="text-xs gap-1.5 shadow-sm"
          >
            <Trash2 size={13} />
            <span>Delete All Data & Re-Onboard</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
