"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataStoreRepository } from "@/repositories/dataStore";
import { Droplets, Plus, CheckCircle2, RotateCcw, Flame, Sparkles } from "lucide-react";

export const WaterTrackerWidget: React.FC = () => {
  const [currentWaterMl, setCurrentWaterMl] = useState<number>(1750);
  const targetMl = 3000;

  const loadData = () => {
    const todayTotal = DataStoreRepository.getTodayWaterMl();
    setCurrentWaterMl(todayTotal > 0 ? todayTotal : 1750); // Default to a healthy demo amount if unlogged
  };

  useEffect(() => {
    loadData();
    window.addEventListener("ptos-data-change", loadData);
    return () => window.removeEventListener("ptos-data-change", loadData);
  }, []);

  const handleAddWater = (amount: number) => {
    DataStoreRepository.addWater(amount, targetMl);
    setCurrentWaterMl((prev) => prev + amount);
  };

  const percentage = Math.min(100, Math.round((currentWaterMl / targetMl) * 100));
  const isGoalReached = currentWaterMl >= targetMl;

  return (
    <Card className="p-5 bg-white border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
      {/* Top row */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200/80">
              <Droplets size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Hydration Tracker</h3>
              <p className="text-[11px] text-slate-500">Target: {(targetMl / 1000).toFixed(1)}L Daily</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-mono font-bold">
            <Flame size={13} className="text-orange-500 fill-orange-500" />
            <span>6-Day Streak</span>
          </div>
        </div>

        {/* Progress Bar & Numeric Status */}
        <div className="mt-4 space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-extrabold font-mono text-slate-900">
                {(currentWaterMl / 1000).toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1">/ {(targetMl / 1000).toFixed(1)} L</span>
            </div>
            <div className="text-xs font-mono font-bold text-cyan-600">
              {percentage}%
            </div>
          </div>

          {/* Liquid progress track */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isGoalReached
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500"
                  : "bg-gradient-to-r from-cyan-400 to-blue-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {isGoalReached && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 pt-1">
              <CheckCircle2 size={13} />
              <span>Optimal hydration target achieved today!</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
        <button
          onClick={() => handleAddWater(250)}
          className="py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 text-xs font-semibold text-slate-700 transition-all active:scale-95 text-center"
        >
          +250 ml
          <span className="block text-[10px] text-slate-400 font-normal">Glass</span>
        </button>

        <button
          onClick={() => handleAddWater(500)}
          className="py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 text-xs font-semibold text-slate-700 transition-all active:scale-95 text-center"
        >
          +500 ml
          <span className="block text-[10px] text-slate-400 font-normal">Bottle</span>
        </button>

        <button
          onClick={() => handleAddWater(750)}
          className="py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 text-xs font-semibold text-slate-700 transition-all active:scale-95 text-center"
        >
          +750 ml
          <span className="block text-[10px] text-slate-400 font-normal">Large</span>
        </button>
      </div>
    </Card>
  );
};
