"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { MoodEnergyLog, FrustrationLog, Lesson, IdentityEvidence } from "@/types";
import {
  Brain,
  Smile,
  Flame,
  BookOpen,
  Plus,
  ShieldCheck,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { QuickActionModal } from "@/components/layout/QuickActionModal";

export const MindView: React.FC = () => {
  const [moodLogs, setMoodLogs] = useState<MoodEnergyLog[]>([]);
  const [frustrations, setFrustrations] = useState<FrustrationLog[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [evidenceList, setEvidenceList] = useState<IdentityEvidence[]>([]);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickTab, setQuickTab] = useState("mood");

  const loadData = () => {
    setMoodLogs(DataStoreRepository.getMoodLogs());
    setFrustrations(DataStoreRepository.getFrustrations());
    setLessons(DataStoreRepository.getLessons());
    setEvidenceList(DataStoreRepository.getIdentityEvidence());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("ptos-data-change", loadData);
    return () => window.removeEventListener("ptos-data-change", loadData);
  }, []);

  const openLog = (tab: string) => {
    setQuickTab(tab);
    setIsQuickActionOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200/80 dark:border-surface-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">
            COGNITIVE & EMOTIONAL RESILIENCE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Mind, Reflection & Identity
          </h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
            Turn emotional resistance into behavioral data. Build proof of your capability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openLog("mood")}
            className="text-xs gap-1.5"
          >
            <Smile size={14} /> Log State
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openLog("frustration")}
            className="text-xs gap-1.5"
          >
            <Flame size={14} /> Frustration Journal
          </Button>
        </div>
      </div>

      {/* Identity Evidence Bank (Section 51) */}
      <Card className="p-5 space-y-3 bg-gradient-to-r from-brand-500/[0.04] to-purple-500/[0.04] border-brand-500/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400 font-bold block">
              IDENTITY / EVIDENCE ENGINE
            </span>
            <h3 className="text-sm font-bold text-foreground">
              Accumulated Behavioral Proof
            </h3>
          </div>
          <Badge variant="brand" size="sm">
            {evidenceList.length} Proof Points
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {evidenceList.map((ev) => (
            <div
              key={ev.id}
              className="p-3 rounded-lg border border-surface-200/80 dark:border-surface-700/60 bg-white/70 dark:bg-surface-800/50 text-xs space-y-1"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                <span className="font-bold text-foreground">
                  Evidence for: "{ev.identityStatement}"
                </span>
              </div>
              <p className="text-surface-500 dark:text-surface-400 pl-5">
                {ev.evidenceAction}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Two columns: Frustration Journal & Lessons Learned Library */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frustration Journal (Section 38) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Flame size={16} className="text-rose-500" />
              <span>Frustration & Resistance Logs</span>
            </h3>
            <span className="text-[10px] font-mono text-surface-400">Non-Clinical</span>
          </div>

          <div className="space-y-2">
            {frustrations.length === 0 ? (
              <p className="text-xs text-surface-400 text-center py-6">
                No frustrations logged. When you hit friction, record it here instead of quitting.
              </p>
            ) : (
              frustrations.map((f) => (
                <div
                  key={f.id}
                  className="p-3 rounded-lg border border-surface-200/80 dark:border-surface-700/60 bg-surface-50/50 dark:bg-surface-800/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      Intensity: {f.frustrationLevel}/10
                    </span>
                    <Badge variant={f.didQuit ? "critical" : "success"} size="sm">
                      {f.didQuit ? "Interrupted" : "Persisted"}
                    </Badge>
                  </div>
                  <p className="text-surface-600 dark:text-surface-300">{f.whatHappened}</p>
                  {f.actionTaken && (
                    <div className="text-[11px] text-surface-400">
                      <strong>Action:</strong> {f.actionTaken}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Lessons Learned Library (Section 48) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BookOpen size={16} className="text-amber-500" />
              <span>Lessons Learned Library</span>
            </h3>
            <span className="text-[10px] font-mono text-surface-400">Execution Wisdom</span>
          </div>

          <div className="space-y-2">
            {lessons.map((les) => (
              <div
                key={les.id}
                className="p-3.5 rounded-lg border border-surface-200/80 dark:border-surface-700/60 bg-surface-50/50 dark:bg-surface-800/40 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{les.title}</span>
                  <Badge variant="warning" size="sm">{les.category}</Badge>
                </div>
                <p className="text-surface-500 dark:text-surface-400">{les.context}</p>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-medium">
                  <strong>Rule to remember: </strong>
                  {les.actionRule}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultTab={quickTab}
      />
    </div>
  );
};
