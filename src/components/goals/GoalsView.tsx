"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { Goal } from "@/types";
import { Target, Plus, Sparkles, CheckCircle2, Calendar, ArrowUpRight } from "lucide-react";
import { TaskDecomposerModal } from "@/components/modals/TaskDecomposerModal";
import { QuickActionModal } from "@/components/layout/QuickActionModal";

export const GoalsView: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDecomposerOpen, setIsDecomposerOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const loadData = () => {
    setGoals(DataStoreRepository.getGoals());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("ptos-data-change", loadData);
    return () => window.removeEventListener("ptos-data-change", loadData);
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 font-bold">
            90-DAY OUTCOME ARCHITECTURE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Goals & Strategic Vision
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Every goal connects to real projects, milestones, and daily focus blocks. Zero abstract aspirations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDecomposerOpen(true)}
            className="gap-1.5 text-xs shadow-sm"
          >
            <Sparkles size={14} className="text-brand-500" />
            <span>AI Decomposer</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuickActionOpen(true)}
            className="gap-1.5 text-xs shadow-sm"
          >
            <Plus size={15} />
            <span>New Goal</span>
          </Button>
        </div>
      </div>

      {/* Goals list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => (
          <Card key={g.id} className="p-5 space-y-4 hoverEffect bg-white border-surface-200/80 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={g.priority === "critical" ? "critical" : "brand"}>
                    {g.category}
                  </Badge>
                  <span className="text-[11px] font-mono text-surface-400 flex items-center gap-1">
                    <Calendar size={12} /> Target: {g.targetDate}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">{g.title}</h3>
                <p className="text-xs text-surface-600">{g.description}</p>
              </div>
              <div className="text-right">
                <div className="text-base font-mono font-bold text-foreground">
                  {g.progressPercent}%
                </div>
                <span className="text-[10px] text-surface-400 uppercase font-semibold">Progress</span>
              </div>
            </div>

            {/* Why statement */}
            <div className="p-3 rounded-lg bg-surface-50 border border-surface-200/80 text-xs">
              <span className="font-semibold text-brand-600">Why this matters: </span>
              <span className="text-surface-700">{g.why}</span>
            </div>

            {/* Milestones list */}
            {g.milestones && g.milestones.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400 font-semibold block">
                  Strategic Milestones
                </span>
                <div className="space-y-1">
                  {g.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-surface-600"
                    >
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${g.progressPercent}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <TaskDecomposerModal
        isOpen={isDecomposerOpen}
        onClose={() => setIsDecomposerOpen(false)}
        onTasksAdded={loadData}
      />

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultTab="goal"
      />
    </div>
  );
};
