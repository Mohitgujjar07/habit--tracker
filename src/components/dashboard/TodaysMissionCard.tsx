"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { DailyMission } from "@/types";
import { Check, Dumbbell, Flame, CheckCircle2 } from "lucide-react";

interface TodaysMissionCardProps {
  mission: DailyMission;
  onToggleTask: (taskId: string) => void;
}

export const TodaysMissionCard: React.FC<TodaysMissionCardProps> = ({
  mission,
  onToggleTask,
}) => {
  const completedCount = mission.priorityTasks.filter((t) => t.completed).length;
  const totalCount = mission.priorityTasks.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400 font-semibold block">
            TODAY'S MISSION
          </span>
          <h3 className="text-base font-bold tracking-tight text-foreground">
            3 Non-Negotiable Anchors
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
            {completedCount}/{totalCount} Done ({progressPercent}%)
          </span>
          <div className="w-20 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Priority items list */}
      <div className="space-y-2">
        {mission.priorityTasks.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => onToggleTask(t.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
              t.completed
                ? "bg-emerald-500/10 border-emerald-500/30 text-surface-400"
                : "bg-surface-50/70 dark:bg-surface-800/40 border-surface-200/80 dark:border-surface-700/60 text-foreground hover:border-surface-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  t.completed
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-surface-300 dark:border-surface-600"
                }`}
              >
                {t.completed && <Check size={12} strokeWidth={3} />}
              </div>
              <span className={`text-xs font-medium ${t.completed ? "line-through opacity-70" : ""}`}>
                {idx + 1}. {t.title}
              </span>
            </div>
            <span className="text-[11px] font-mono text-surface-400">
              {t.estimatedMinutes}m
            </span>
          </button>
        ))}
      </div>

      {/* Movement suggestion & Focus target */}
      <div className="pt-2 border-t border-surface-200/60 dark:border-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-surface-500 dark:text-surface-400">
        <div className="flex items-center gap-2">
          <Dumbbell size={14} className="text-emerald-500" />
          <span>{mission.movementSuggestion}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <Flame size={14} className="text-amber-500" />
          <span>Focus Goal: {mission.focusTargetMinutes} min</span>
        </div>
      </div>
    </Card>
  );
};
