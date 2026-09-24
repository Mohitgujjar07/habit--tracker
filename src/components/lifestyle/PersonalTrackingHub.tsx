"use client";

import React, { useState, useEffect } from "react";
import { WaterTrackerWidget } from "./WaterTrackerWidget";
import { ExpenseTrackerWidget } from "./ExpenseTrackerWidget";
import { StreaksVaultWidget } from "./StreaksVaultWidget";
import { EnergyMoodMatrixWidget } from "./EnergyMoodMatrixWidget";
import { DataStoreRepository } from "@/repositories/dataStore";
import {
  Activity,
  Droplets,
  Wallet,
  Flame,
  Zap,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
} from "lucide-react";

type HubTab = "all" | "water" | "expenses" | "streaks" | "energy";

export const PersonalTrackingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HubTab>("all");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [todayWater, setTodayWater] = useState<number>(1750);
  const [todaySpend, setTodaySpend] = useState<number>(0);
  const [topStreak, setTopStreak] = useState<number>(8);
  const [latestEnergy, setLatestEnergy] = useState<number>(7);

  const loadMetrics = () => {
    const water = DataStoreRepository.getTodayWaterMl();
    setTodayWater(water > 0 ? water : 1750);

    const spend = DataStoreRepository.getTodayExpenseTotal();
    setTodaySpend(spend);

    const streaks = DataStoreRepository.getDailyStreaks();
    const maxStreak = streaks.reduce((max, s) => Math.max(max, s.currentStreak), 0);
    setTopStreak(maxStreak);

    const moods = DataStoreRepository.getMoodLogs();
    if (moods.length > 0) {
      setLatestEnergy(moods[0].energy);
    }
  };

  useEffect(() => {
    loadMetrics();
    window.addEventListener("ptos-data-change", loadMetrics);
    return () => window.removeEventListener("ptos-data-change", loadMetrics);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Hub Top Bar with Metrics Glance & Collapsible Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-100/70 text-orange-600 border border-orange-200">
            <Activity size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Personal Operating & Habit Hub
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-mono text-[10px] font-bold">
                Daily Vitality
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Hydration, expenses & impulse cooling, daily streaks, bio-energy check-ins.
            </p>
          </div>
        </div>

        {/* Quick Glance Metrics Pill strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs font-mono">
            <Droplets size={13} className="text-cyan-500" />
            <span className="font-semibold text-slate-800">{(todayWater / 1000).toFixed(1)}L</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs font-mono">
            <Wallet size={13} className="text-emerald-500" />
            <span className="font-semibold text-slate-800">${todaySpend.toFixed(0)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs font-mono">
            <Flame size={13} className="text-orange-500 fill-orange-500" />
            <span className="font-semibold text-slate-800">{topStreak}d</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs font-mono">
            <Zap size={13} className="text-amber-500 fill-amber-500" />
            <span className="font-semibold text-slate-800">{latestEnergy}/10</span>
          </div>

          {/* Toggle Expand / Collapse */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-all ml-1 shadow-2xs"
            title={isCollapsed ? "Expand Hub" : "Collapse Hub"}
          >
            {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid size={13} />
              <span>Full View (All 4)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("water")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "water"
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Droplets size={13} className={activeTab === "water" ? "text-white" : "text-cyan-500"} />
              <span>Hydration</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("expenses")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "expenses"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Wallet size={13} className={activeTab === "expenses" ? "text-white" : "text-amber-500"} />
              <span>Finances & 72h Vault</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("streaks")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "streaks"
                  ? "bg-orange-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Flame size={13} className={activeTab === "streaks" ? "text-white fill-white" : "text-orange-500"} />
              <span>Habit Streaks</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("energy")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "energy"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Zap size={13} className={activeTab === "energy" ? "text-white fill-white" : "text-violet-500"} />
              <span>Energy & Mood</span>
            </button>
          </div>

          {/* Widgets Grid */}
          {activeTab === "all" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
              <WaterTrackerWidget />
              <ExpenseTrackerWidget />
              <StreaksVaultWidget />
              <EnergyMoodMatrixWidget />
            </div>
          )}

          {activeTab === "water" && (
            <div className="max-w-xl mx-auto animate-in fade-in">
              <WaterTrackerWidget />
            </div>
          )}

          {activeTab === "expenses" && (
            <div className="max-w-xl mx-auto animate-in fade-in">
              <ExpenseTrackerWidget />
            </div>
          )}

          {activeTab === "streaks" && (
            <div className="max-w-xl mx-auto animate-in fade-in">
              <StreaksVaultWidget />
            </div>
          )}

          {activeTab === "energy" && (
            <div className="max-w-xl mx-auto animate-in fade-in">
              <EnergyMoodMatrixWidget />
            </div>
          )}
        </>
      )}
    </div>
  );
};
