"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { DailyMission } from "@/types";
import { Check, Dumbbell, Flame } from "lucide-react";

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
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            TODAY'S MISSION
          </span>
          <h3 className="text-base font-bold tracking-tight text-slate-900">
            3 Non-Negotiable Anchors
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-orange-600">
            {completedCount}/{totalCount} Done ({progressPercent}%)
          </span>
          <div className="w-20 h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
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
            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 shadow-xs ${
              t.completed
                ? "bg-emerald-50/70 border-emerald-200/80 text-slate-500"
                : "bg-slate-50/60 border-slate-200 text-slate-800 hover:bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                  t.completed
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {t.completed && <Check size={12} strokeWidth={3} />}
              </div>
              <span className={`text-xs font-semibold ${t.completed ? "line-through opacity-60" : "text-slate-900"}`}>
                {idx + 1}. {t.title}
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-400">
              {t.estimatedMinutes}m
            </span>
          </button>
        ))}
      </div>

      {/* Movement suggestion & Focus target */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <Dumbbell size={14} className="text-emerald-500" />
          <span>{mission.movementSuggestion}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-600 font-semibold">
          <Flame size={14} className="text-amber-500" />
          <span>Focus Goal: {mission.focusTargetMinutes} min</span>
        </div>
      </div>
    </Card>
  );
};
