"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { ScoringEngine } from "@/lib/engines/scoringEngine";
import {
  TransformationScore,
  ConsistencyMetrics,
  PersonalExperiment,
  PersonalOperatingManual,
  Win,
  TimelineEvent,
} from "@/types";
import {
  TrendingUp,
  Sparkles,
  Trophy,
  History,
  FlaskConical,
  BookOpen,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Flame,
  RotateCw,
} from "lucide-react";
import { QuickActionModal } from "@/components/layout/QuickActionModal";

export const ProgressView: React.FC = () => {
  const [score, setScore] = useState<TransformationScore | null>(null);
  const [consistency, setConsistency] = useState<ConsistencyMetrics | null>(null);
  const [experiments, setExperiments] = useState<PersonalExperiment[]>([]);
  const [manual, setManual] = useState<PersonalOperatingManual | null>(null);
  const [wins, setWins] = useState<Win[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"score" | "manual" | "experiments" | "wins" | "timeline">("score");

  const loadData = () => {
    const tasks = DataStoreRepository.getTasks();
    const sessions = DataStoreRepository.getFocusSessions();
    const sleep = DataStoreRepository.getSleepLogs();
    const mood = DataStoreRepository.getMoodLogs();
    const workouts = DataStoreRepository.getWorkouts();
    const digital = DataStoreRepository.getDigitalLogs();
    const mission = DataStoreRepository.getDailyMission();
    const lessons = DataStoreRepository.getLessons();

    const computedScore = ScoringEngine.computeTransformationScore({
      tasks,
      focusSessions: sessions,
      sleepLogs: sleep,
      moodLogs: mood,
      workouts,
      digitalLogs: digital,
      dailyMission: mission,
      lessons,
    });
    setScore(computedScore);

    const computedConsistency = ScoringEngine.computeConsistencyMetrics(sessions, tasks);
    setConsistency(computedConsistency);

    setExperiments(DataStoreRepository.getExperiments());
    setManual(DataStoreRepository.getOperatingManual());
    setWins(DataStoreRepository.getWins());
    setTimeline(DataStoreRepository.getTimelineEvents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("ptos-data-change", loadData);
    return () => window.removeEventListener("ptos-data-change", loadData);
  }, []);

  const phases = [
    { num: 1, name: "Foundation & Baseline", days: "Days 1–15", status: "completed" },
    { num: 2, name: "Digital & Execution Build", days: "Days 16–30", status: "active" },
    { num: 3, name: "Physical Endurance Build", days: "Days 31–45", status: "upcoming" },
    { num: 4, name: "Cognitive Load Expansion", days: "Days 46–60", status: "upcoming" },
    { num: 5, name: "Challenge Zone & Proof", days: "Days 61–75", status: "upcoming" },
    { num: 6, name: "Mastery & Integration", days: "Days 76–90", status: "upcoming" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 font-bold">
            ADAPTIVE ANALYTICS & TIMELINE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Progress, Manual & Wins
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Data-driven transformation metrics, behavioral operating manual, and evidence archive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuickActionOpen(true)}
            className="text-xs gap-1.5 shadow-sm"
          >
            <Trophy size={14} /> Log Win
          </Button>
        </div>
      </div>

      {/* Primary Score & Consistency Banner */}
      {score && consistency && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 flex flex-col justify-between bg-gradient-to-br from-brand-500/[0.08] to-amber-500/[0.03] border-brand-500/20 shadow-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 font-bold block">
                OVERALL TRANSFORMATION SCORE
              </span>
              <div className="font-mono text-5xl font-black text-foreground mt-2">
                {score.overall}
                <span className="text-sm font-normal text-surface-400">/100</span>
              </div>
            </div>
            <p className="text-[11px] text-surface-600 mt-3">
              Weighted behavioral aggregate across Execution, Focus, Body, Mind, Digital, Consistency, and Reflection.
            </p>
          </Card>

          <Card className="p-5 flex flex-col justify-between bg-white border-surface-200/80 shadow-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-bold block">
                RETURN RATE AFTER INTERRUPTION
              </span>
              <div className="font-mono text-4xl font-bold text-foreground mt-2">
                {consistency.returnRatePercent}%
              </div>
            </div>
            <p className="text-[11px] text-surface-600 mt-3">
              Section 41: How often you resume focused execution within 48h after a missed day. Resilience is measurable.
            </p>
          </Card>

          <Card className="p-5 flex flex-col justify-between bg-white border-surface-200/80 shadow-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-bold block">
                90-DAY TRANSFORMATION PROGRAM
              </span>
              <div className="font-mono text-2xl font-bold text-foreground mt-2">
                Phase 2: Digital Build
              </div>
            </div>
            <p className="text-[11px] text-surface-600 mt-3">
              Active Focus: Reducing passive consumption to protect morning deep work blocks.
            </p>
          </Card>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 border-b border-surface-200">
        {[
          { key: "score", label: "Pillar Breakdown" },
          { key: "manual", label: "Personal Operating Manual" },
          { key: "experiments", label: "Personal Experiments" },
          { key: "wins", label: "My Wins Bank" },
          { key: "timeline", label: "Life Timeline" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-brand-500 text-white shadow-xs"
                : "bg-surface-100 text-surface-600 hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Pillar Breakdown */}
      {activeTab === "score" && score && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {[
              { name: "Execution", val: score.execution },
              { name: "Focus", val: score.focus },
              { name: "Body", val: score.body },
              { name: "Mind", val: score.mind },
              { name: "Digital", val: score.digital },
              { name: "Consistency", val: score.consistency },
              { name: "Reflection", val: score.reflection },
            ].map((p) => (
              <Card key={p.name} className="p-3 text-center bg-white border-surface-200/80 shadow-xs">
                <span className="text-[10px] font-mono text-surface-500 uppercase font-semibold block">
                  {p.name}
                </span>
                <div className="font-mono text-xl font-bold text-foreground mt-1">
                  {p.val}
                </div>
                <div className="w-full bg-surface-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: `${p.val}%` }} />
                </div>
              </Card>
            ))}
          </div>

          {/* 90-Day Phases Roadmap */}
          <Card className="p-5 space-y-4 bg-white border-surface-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-foreground">90-Day Transformation Roadmap</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {phases.map((ph) => (
                <div
                  key={ph.num}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    ph.status === "active"
                      ? "bg-brand-500/10 border-brand-500 text-foreground ring-1 ring-brand-500/30 shadow-xs"
                      : ph.status === "completed"
                      ? "bg-surface-50 border-surface-200 opacity-90"
                      : "bg-surface-50/50 border-surface-200 text-surface-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-brand-600">
                      PHASE {ph.num}
                    </span>
                    <Badge variant={ph.status === "active" ? "brand" : ph.status === "completed" ? "success" : "default"} size="sm">
                      {ph.status}
                    </Badge>
                  </div>
                  <div className="font-bold text-foreground">{ph.name}</div>
                  <div className="text-[11px] text-surface-500 font-mono">{ph.days}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: Personal Operating Manual */}
      {activeTab === "manual" && manual && (
        <Card className="p-6 space-y-5 bg-white border-surface-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-surface-200">
            <div>
              <h3 className="text-base font-bold text-foreground">My Personal Operating Manual</h3>
              <p className="text-xs text-surface-500">
                Synthesized from your real recorded behaviors and updated as patterns evolve.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200 space-y-1">
              <span className="font-semibold text-brand-600 block">
                I Focus Best When...
              </span>
              <p className="text-foreground">{manual.bestFocusTime}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200 space-y-1">
              <span className="font-semibold text-brand-600 block">
                Strongest Work Window
              </span>
              <p className="text-foreground">{manual.strongestWorkWindow}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200 space-y-1">
              <span className="font-semibold text-rose-500 block">Biggest Distractions</span>
              <p className="text-foreground">{manual.biggestDistractions.join(", ")}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200 space-y-1">
              <span className="font-semibold text-emerald-600 block">Effective Recovery Protocol</span>
              <p className="text-foreground">{manual.effectiveRecoveryRoutine}</p>
            </div>
          </div>

          {manual.customRules && manual.customRules.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-foreground block">
                Operating Rules (Learned from experience)
              </span>
              <div className="space-y-2">
                {manual.customRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded-lg border border-surface-200 bg-surface-50/70 text-xs"
                  >
                    <div className="font-bold text-foreground">{rule.title}</div>
                    <div className="text-surface-700 mt-0.5">
                      {rule.statement}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TAB 3: Experiments */}
      {activeTab === "experiments" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments.map((exp) => (
              <Card key={exp.id} className="p-5 space-y-3 bg-white border-surface-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge variant="brand" size="sm">
                    {exp.status.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] font-mono text-surface-400">
                    {exp.durationDays} Days ({exp.startDate} → {exp.endDate})
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground">{exp.title}</h4>
                <div className="text-xs text-surface-700 space-y-1">
                  <div>
                    <strong>Hypothesis: </strong>
                    {exp.hypothesis}
                  </div>
                  <div>
                    <strong>Target: </strong>
                    {exp.targetOutcome}
                  </div>
                </div>

                {exp.recordedFindings && (
                  <div className="p-3 rounded-lg bg-surface-50 border border-surface-200 text-xs">
                    <span className="font-semibold text-brand-600 block mb-0.5">
                      Neutral Recorded Report:
                    </span>
                    <span className="text-surface-700">
                      {exp.recordedFindings}
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Wins Bank */}
      {activeTab === "wins" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {wins.map((w) => (
              <Card key={w.id} className="p-4 space-y-2 bg-white border-surface-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge variant={w.category === "major" ? "brand" : "success"} size="sm">
                    {w.category}
                  </Badge>
                  <Trophy size={14} className="text-amber-500" />
                </div>
                <h4 className="text-xs font-bold text-foreground">{w.title}</h4>
                {w.notes && (
                  <p className="text-[11px] text-surface-600">{w.notes}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Timeline */}
      {activeTab === "timeline" && (
        <Card className="p-6 space-y-4 bg-white border-surface-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">Transformation History</h3>
          <div className="relative border-l border-surface-200 ml-3 space-y-6">
            {timeline.map((evt) => (
              <div key={evt.id} className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-brand-500 border-2 border-white shadow-xs" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-surface-400">{evt.date}</span>
                  <h4 className="text-xs font-bold text-foreground">{evt.title}</h4>
                  <p className="text-xs text-surface-600">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultTab="task"
      />
    </div>
  );
};
