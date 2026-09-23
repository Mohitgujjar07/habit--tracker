"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { MoodEnergyLog, FrustrationLog, Lesson, IdentityEvidence, UrgeSurfingLog } from "@/types";
import {
  Brain,
  Smile,
  Flame,
  BookOpen,
  Plus,
  ShieldCheck,
  CheckCircle,
  Lightbulb,
  Waves,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { QuickActionModal } from "@/components/layout/QuickActionModal";
import { UrgeSurferModal } from "@/components/modals/UrgeSurferModal";

export const MindView: React.FC = () => {
  const [moodLogs, setMoodLogs] = useState<MoodEnergyLog[]>([]);
  const [frustrations, setFrustrations] = useState<FrustrationLog[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [evidenceList, setEvidenceList] = useState<IdentityEvidence[]>([]);
  const [urgeLogs, setUrgeLogs] = useState<UrgeSurfingLog[]>([]);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isUrgeModalOpen, setIsUrgeModalOpen] = useState(false);
  const [quickTab, setQuickTab] = useState("mood");

  const loadData = () => {
    setMoodLogs(DataStoreRepository.getMoodLogs());
    setFrustrations(DataStoreRepository.getFrustrations());
    setLessons(DataStoreRepository.getLessons());
    setEvidenceList(DataStoreRepository.getIdentityEvidence());
    setUrgeLogs(DataStoreRepository.getUrgeLogs());
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

  const totalSurfed = urgeLogs.filter((u) => u.surfedSuccessfully).length;
  const avgInitial = urgeLogs.length
    ? (urgeLogs.reduce((acc, u) => acc + u.intensityInitial, 0) / urgeLogs.length).toFixed(1)
    : "0";
  const avgFinal = urgeLogs.length
    ? (urgeLogs.reduce((acc, u) => acc + u.intensityFinal, 0) / urgeLogs.length).toFixed(1)
    : "0";
  const dropPct =
    Number(avgInitial) > 0
      ? Math.round(((Number(avgInitial) - Number(avgFinal)) / Number(avgInitial)) * 100)
      : 0;
  const totalSeconds = urgeLogs.reduce((acc, u) => acc + (u.durationSeconds || 90), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 font-bold">
            COGNITIVE & EMOTIONAL RESILIENCE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Mind, Reflection & Identity
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Turn emotional resistance into behavioral data. Build proof of your capability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUrgeModalOpen(true)}
            className="text-xs gap-1.5 shadow-sm bg-orange-600 hover:bg-orange-500 font-bold"
          >
            <Waves size={14} /> Resist Urge (90s)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openLog("mood")}
            className="text-xs gap-1.5 shadow-sm"
          >
            <Smile size={14} className="text-amber-500" /> Log State
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openLog("frustration")}
            className="text-xs gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            <Flame size={14} className="text-rose-500" /> Frustration
          </Button>
        </div>
      </div>

      {/* OPTION A: URGE SURFER & CRUSHING CRAVINGS */}
      <Card className="p-5 space-y-4 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 border border-orange-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-xs">
              <Waves size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 font-bold">
                  OPTION A • NEUROSCIENCE CRAVING BREAKER
                </span>
                <Badge variant="brand" size="sm">
                  {totalSurfed} Waves Surfed
                </Badge>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Urge Surfer & Dopamine Regulation
              </h3>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUrgeModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-500 text-xs font-bold gap-1.5 shadow-xs"
          >
            <Waves size={14} /> Launch 90s Protocol
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Craving Waves Defeated</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-0.5 block">{totalSurfed}</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <ShieldCheck size={12} /> 100% Prefrontal Control
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Average Craving Reduction</span>
            <span className="text-2xl font-black text-emerald-600 font-mono mt-0.5 block">
              -{dropPct}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              From {avgInitial} → {avgFinal} / 10 intensity
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 block">Dopamine Reset Time</span>
            <span className="text-2xl font-black text-orange-600 font-mono mt-0.5 block">{totalSeconds}s</span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              Physiological Sigh Breathwork
            </span>
          </div>
        </div>

        {/* Recent Urges Surfed */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Recent Cravings Surfed
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {urgeLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-white border border-orange-100 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Waves size={13} className="text-orange-500" />
                    {log.triggerCategory}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">
                      {log.intensityInitial} → {log.intensityFinal}
                    </span>
                    <Badge variant="success" size="sm">
                      Surfed ({log.durationSeconds}s)
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-700">Channeled into:</strong>{" "}
                  {log.replacementActionTaken}
                </p>
                {log.notes && (
                  <p className="text-[11px] text-slate-500 italic">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Identity Evidence Bank (Section 51) */}
      <Card className="p-5 space-y-3 bg-gradient-to-r from-brand-500/[0.06] to-purple-500/[0.06] border-brand-500/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 font-bold block">
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
              className="p-3 rounded-lg border border-surface-200 bg-white/90 text-xs space-y-1 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                <span className="font-bold text-foreground">
                  Evidence for: "{ev.identityStatement}"
                </span>
              </div>
              <p className="text-surface-600 pl-5">
                {ev.evidenceAction}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Two columns: Frustration Journal & Lessons Learned Library */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frustration Journal (Section 38) */}
        <Card className="p-5 space-y-4 bg-white border-surface-200/80 shadow-sm">
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
                  className="p-3 rounded-lg border border-surface-200 bg-surface-50/70 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      Intensity: {f.frustrationLevel}/10
                    </span>
                    <Badge variant={f.didQuit ? "critical" : "success"} size="sm">
                      {f.didQuit ? "Interrupted" : "Persisted"}
                    </Badge>
                  </div>
                  <p className="text-surface-700">{f.whatHappened}</p>
                  {f.actionTaken && (
                    <div className="text-[11px] text-surface-500">
                      <strong>Action:</strong> {f.actionTaken}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Lessons Learned Library (Section 48) */}
        <Card className="p-5 space-y-4 bg-white border-surface-200/80 shadow-sm">
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
                className="p-3.5 rounded-lg border border-surface-200 bg-surface-50/70 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{les.title}</span>
                  <Badge variant="warning" size="sm">{les.category}</Badge>
                </div>
                <p className="text-surface-600">{les.context}</p>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-medium">
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
        onOpenUrgeSurfer={() => setIsUrgeModalOpen(true)}
      />

      <UrgeSurferModal
        isOpen={isUrgeModalOpen}
        onClose={() => setIsUrgeModalOpen(false)}
      />
    </div>
  );
};
