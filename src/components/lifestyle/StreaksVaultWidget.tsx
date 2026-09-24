"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { DataStoreRepository } from "@/repositories/dataStore";
import { DailyStreakMetric } from "@/types/lifestyle";
import {
  Flame,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Brain,
  Wallet,
  Smartphone,
  BookOpen,
  Award,
  Sparkles,
} from "lucide-react";

interface CategoryMeta {
  title: string;
  icon: any;
  colorBg: string;
  colorText: string;
  colorBorder: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  hydration: {
    title: "Hydration (2.5L+)",
    icon: Droplets,
    colorBg: "bg-cyan-50",
    colorText: "text-cyan-600",
    colorBorder: "border-cyan-200",
  },
  workout: {
    title: "Movement / Workout",
    icon: Dumbbell,
    colorBg: "bg-purple-50",
    colorText: "text-purple-600",
    colorBorder: "border-purple-200",
  },
  deep_work: {
    title: "Morning Deep Work",
    icon: Brain,
    colorBg: "bg-orange-50",
    colorText: "text-orange-600",
    colorBorder: "border-orange-200",
  },
  no_spend: {
    title: "No-Spend Discipline",
    icon: Wallet,
    colorBg: "bg-emerald-50",
    colorText: "text-emerald-600",
    colorBorder: "border-emerald-200",
  },
  screen_free: {
    title: "Screen-Free Morning",
    icon: Smartphone,
    colorBg: "bg-blue-50",
    colorText: "text-blue-600",
    colorBorder: "border-blue-200",
  },
  reading: {
    title: "Knowledge / Reading",
    icon: BookOpen,
    colorBg: "bg-amber-50",
    colorText: "text-amber-600",
    colorBorder: "border-amber-200",
  },
};

export const StreaksVaultWidget: React.FC = () => {
  const [streaks, setStreaks] = useState<DailyStreakMetric[]>([]);
  const today = new Date().toISOString().split("T")[0];

  const loadStreaks = () => {
    setStreaks(DataStoreRepository.getDailyStreaks());
  };

  useEffect(() => {
    loadStreaks();
    window.addEventListener("ptos-data-change", loadStreaks);
    return () => window.removeEventListener("ptos-data-change", loadStreaks);
  }, []);

  const handleCheckIn = (category: "hydration" | "workout" | "deep_work" | "no_spend" | "screen_free" | "reading") => {
    DataStoreRepository.recordStreakAction(category);
    loadStreaks();
  };

  const totalActiveStreakDays = streaks.reduce((sum, s) => sum + s.currentStreak, 0);

  return (
    <Card className="p-5 bg-white border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/80">
              <Flame size={18} className="fill-orange-500 text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Habit Streaks Vault</h3>
              <p className="text-[11px] text-slate-500">"Never Miss Twice" Grace-Day Buffer System</p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-mono font-bold">
            <Award size={13} className="text-orange-600" />
            <span>{totalActiveStreakDays} Total Days</span>
          </div>
        </div>

        {/* Psychological principle callout */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>Missing one day is an accident; missing twice starts a new habit.</span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider shrink-0 ml-2">
            James Clear Rule
          </span>
        </div>

        {/* Streak items list */}
        <div className="mt-3.5 space-y-2">
          {streaks.map((s) => {
            const meta = CATEGORY_META[s.category] || {
              title: s.name,
              icon: Flame,
              colorBg: "bg-slate-50",
              colorText: "text-slate-600",
              colorBorder: "border-slate-200",
            };
            const Icon = meta.icon;
            const isCompletedToday = s.lastLoggedDate === today;

            return (
              <div
                key={s.id}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg ${meta.colorBg} ${meta.colorText} border ${meta.colorBorder}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{meta.title}</span>
                      {s.graceDayActive && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-semibold uppercase tracking-wider">
                          Grace Day Active
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Best: {s.longestStreak} days
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-extrabold font-mono text-slate-900">
                      <Flame
                        size={12}
                        className={
                          s.currentStreak > 0
                            ? "text-orange-500 fill-orange-500"
                            : "text-slate-300"
                        }
                      />
                      <span>{s.currentStreak}d</span>
                    </div>
                  </div>

                  {isCompletedToday ? (
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      <span>Done</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCheckIn(s.category as any)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 border border-slate-200 hover:border-orange-600 text-xs font-semibold transition-all active:scale-95"
                    >
                      + Check In
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
