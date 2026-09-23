"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { SleepLog, WorkoutSession } from "@/types";
import {
  Moon,
  Dumbbell,
  Droplets,
  Scale,
  Footprints,
  Plus,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { QuickActionModal } from "@/components/layout/QuickActionModal";

export const BodyView: React.FC = () => {
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickTab, setQuickTab] = useState("sleep");

  const loadData = () => {
    setSleepLogs(DataStoreRepository.getSleepLogs());
    setWorkouts(DataStoreRepository.getWorkouts());
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

  const avgSleep = sleepLogs.length > 0
    ? (sleepLogs.reduce((acc, s) => acc + s.durationHours, 0) / sleepLogs.length).toFixed(1)
    : "7.5";

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-600 font-bold">
            BIOLOGICAL RECOVERY & VITALITY
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Body & Physical Baseline
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Physical health is the biological foundation that powers cognitive focus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openLog("sleep")}
            className="text-xs gap-1.5 shadow-sm"
          >
            <Moon size={14} className="text-indigo-500" /> Log Sleep
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openLog("workout")}
            className="text-xs gap-1.5 shadow-sm"
          >
            <Dumbbell size={14} /> Log Workout
          </Button>
        </div>
      </div>

      {/* Safety Notice Banner (Section 75) */}
      <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 text-xs text-slate-700 flex items-start gap-2.5 shadow-xs">
        <ShieldCheck size={16} className="text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-teal-900">Health Safety & Non-Diagnostic Principle: </span>
          All metrics recorded here are personal habit trends and behavioral logs. Personal Transformation OS never provides medical diagnosis, clinical treatment, or medical inferences. If you notice persistent physical issues, consult a qualified healthcare professional.
        </div>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 space-y-1 bg-white border-surface-200/80 shadow-sm">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-medium text-surface-600">Avg Sleep</span>
            <Moon size={15} className="text-indigo-500" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground">{avgSleep}h</div>
          <span className="text-[10px] text-surface-400">Last 7 recorded nights</span>
        </Card>

        <Card className="p-4 space-y-1 bg-white border-surface-200/80 shadow-sm">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-medium text-surface-600">Workouts</span>
            <Dumbbell size={15} className="text-purple-500" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground">{workouts.length}</div>
          <span className="text-[10px] text-surface-400">Logged sessions</span>
        </Card>

        <Card className="p-4 space-y-1 bg-white border-surface-200/80 shadow-sm">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-medium text-surface-600">Water Target</span>
            <Droplets size={15} className="text-cyan-500" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground">2.5 L</div>
          <span className="text-[10px] text-surface-400">Daily baseline</span>
        </Card>

        <Card className="p-4 space-y-1 bg-white border-surface-200/80 shadow-sm">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-medium text-surface-600">Daily Steps</span>
            <Footprints size={15} className="text-teal-500" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground">8,000</div>
          <span className="text-[10px] text-surface-400">Movement anchor</span>
        </Card>
      </div>

      {/* Sleep Logs & Workouts in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sleep Section */}
        <Card className="p-5 space-y-4 bg-white border-surface-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Moon size={16} className="text-indigo-500" />
              <span>Recent Sleep History</span>
            </h3>
            <span className="text-xs text-surface-400 font-mono">Bedtime Consistency</span>
          </div>

          <div className="space-y-2">
            {sleepLogs.length === 0 ? (
              <p className="text-xs text-surface-400 text-center py-6">No sleep logs yet.</p>
            ) : (
              sleepLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-surface-200 bg-surface-50/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-foreground">{log.date}</div>
                    <div className="text-[11px] text-surface-400">
                      {log.bedTime} → {log.wakeTime}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-foreground">
                      {log.durationHours} hrs
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Quality: {log.qualityRating}/10
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Workout Section */}
        <Card className="p-5 space-y-4 bg-white border-surface-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Dumbbell size={16} className="text-purple-500" />
              <span>Recorded Workouts</span>
            </h3>
            <span className="text-xs text-surface-400 font-mono">Sets & Reps</span>
          </div>

          <div className="space-y-2">
            {workouts.length === 0 ? (
              <p className="text-xs text-surface-400 text-center py-6">No workouts logged yet.</p>
            ) : (
              workouts.slice(0, 5).map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-lg border border-surface-200 bg-surface-50/70 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-foreground">{w.title}</div>
                    <span className="text-[11px] font-mono text-surface-400">
                      {w.durationMinutes} min • Intensity {w.intensityRating}/10
                    </span>
                  </div>

                  {w.exercises && w.exercises.length > 0 && (
                    <div className="space-y-1">
                      {w.exercises.map((ex) => (
                        <div key={ex.id} className="text-[11px] text-surface-500 flex justify-between">
                          <span>{ex.name}</span>
                          <span className="font-mono">
                            {ex.sets.length} sets × {ex.sets[0]?.weightKg || 0}kg
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
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
