"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { ExportService } from "@/services/exportService";
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
} from "lucide-react";

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allowAI, setAllowAI] = useState(true);
  const [allowHealth, setAllowHealth] = useState(true);
  const [allowJournalAI, setAllowJournalAI] = useState(false);

  useEffect(() => {
    setProfile(DataStoreRepository.getUserProfile());
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200/80 dark:border-surface-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold">
            SYSTEM PROFILE & SETTINGS
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Personal OS Profile & Privacy
          </h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
            Manage your initial assumptions, data exports, privacy thresholds, and AI context access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJSON}
            className="text-xs gap-1.5"
          >
            <Download size={14} /> Export JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5"
          >
            <Download size={14} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg">
              {profile.preferredName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {profile.fullName || profile.preferredName}
              </h3>
              <p className="text-xs text-surface-400 capitalize">
                {profile.occupation} • {profile.country} • {profile.timezone}
              </p>
            </div>
          </div>
          <Badge variant="brand">Day {profile.transformationDay || 24} / 90</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-200/60 dark:border-surface-700/60">
            <span className="font-semibold text-surface-400 block mb-0.5">Primary Bottleneck</span>
            <span className="font-medium text-foreground">{profile.primaryBottleneck}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-200/60 dark:border-surface-700/60">
            <span className="font-semibold text-surface-400 block mb-0.5">Preferred Work Window</span>
            <span className="font-medium text-foreground">{profile.routine.preferredWorkHours}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-200/60 dark:border-surface-700/60">
            <span className="font-semibold text-surface-400 block mb-0.5">Coach Communication Style</span>
            <span className="font-medium text-foreground">{profile.coachStyle}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-200/60 dark:border-surface-700/60">
            <span className="font-semibold text-surface-400 block mb-0.5">Accountability Protocol</span>
            <span className="font-medium text-foreground">{profile.accountabilityStyle}</span>
          </div>
        </div>

        {/* 90-Day Definition of Success */}
        <div className="p-3.5 rounded-xl bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-700 text-xs">
          <span className="font-semibold text-brand-600 dark:text-brand-400 block mb-1">
            Personal Definition of Success
          </span>
          <p className="text-surface-600 dark:text-surface-300">
            "{profile.personalDefinitionOfSuccess}"
          </p>
        </div>
      </Card>

      {/* Privacy & AI Context Controls (Section 74 & 113) */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-brand-500" />
          <h3 className="text-sm font-bold text-foreground">
            Privacy & AI Context Access Controls
          </h3>
        </div>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          You own your data. Control exactly which data streams are permitted into the AI coaching context.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200/80 dark:border-surface-700/60 bg-surface-50/50 dark:bg-surface-800/40 text-xs">
            <div>
              <div className="font-semibold text-foreground">Allow AI Task & Goal Context</div>
              <div className="text-[11px] text-surface-400">Used for task decomposition and recommendations</div>
            </div>
            <input
              type="checkbox"
              checked={allowAI}
              onChange={(e) => setAllowAI(e.target.checked)}
              className="accent-brand-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200/80 dark:border-surface-700/60 bg-surface-50/50 dark:bg-surface-800/40 text-xs">
            <div>
              <div className="font-semibold text-foreground">Allow Lifestyle & Sleep Data</div>
              <div className="text-[11px] text-surface-400">Used for correlating rest with focus performance</div>
            </div>
            <input
              type="checkbox"
              checked={allowHealth}
              onChange={(e) => setAllowHealth(e.target.checked)}
              className="accent-brand-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-surface-200/80 dark:border-surface-700/60 bg-surface-50/50 dark:bg-surface-800/40 text-xs">
            <div>
              <div className="font-semibold text-foreground">Allow Frustration & Journal Analysis</div>
              <div className="text-[11px] text-surface-400">Permit AI to identify emotional triggers and resistance</div>
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
      <Card className="p-6 space-y-4 border-rose-500/30">
        <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <Trash2 size={16} /> Danger Zone
        </h3>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          Reset sample data or wipe all local database records.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetData}
            className="text-xs gap-1.5"
          >
            <RefreshCw size={13} />
            <span>Reset Demo Data</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleClearAll}
            className="text-xs gap-1.5"
          >
            <Trash2 size={13} />
            <span>Delete All Data & Re-Onboard</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
