"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { DataStoreRepository } from "@/repositories/dataStore";
import { MoodEnergyLog } from "@/types";
import {
  Zap,
  Smile,
  Sparkles,
  CheckCircle2,
  Clock,
  Compass,
  AlertCircle,
  Tag,
} from "lucide-react";

const QUICK_TAGS = [
  "Deeply Focused",
  "Post-Workout",
  "Creative Flow",
  "Afternoon Dip",
  "Fatigued",
  "Anxious",
  "Optimistic",
  "Calm & Grounded",
];

export const EnergyMoodMatrixWidget: React.FC = () => {
  const [energy, setEnergy] = useState<number>(7);
  const [mood, setMood] = useState<number>(8);
  const [stress, setStress] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Deeply Focused"]);
  const [note, setNote] = useState<string>("");
  const [latestLog, setLatestLog] = useState<MoodEnergyLog | null>(null);
  const [isSavedRecently, setIsSavedRecently] = useState<boolean>(false);

  const loadData = () => {
    const logs = DataStoreRepository.getMoodLogs();
    if (logs.length > 0) {
      setLatestLog(logs[0]);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("ptos-data-change", loadData);
    return () => window.removeEventListener("ptos-data-change", loadData);
  }, []);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay: "morning" | "afternoon" | "evening" | "night" = "morning";
    if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17 && hour < 21) timeOfDay = "evening";
    else if (hour >= 21 || hour < 5) timeOfDay = "night";

    const newLog: MoodEnergyLog = {
      id: `mood-${Date.now()}`,
      userId: "user-demo-1",
      date: now.toISOString().split("T")[0],
      timestamp: now.toISOString(),
      timeOfDay,
      energy,
      mood,
      stress,
      tags: selectedTags,
      notes: note.trim() || undefined,
      createdAt: now.toISOString(),
    };

    DataStoreRepository.saveMoodLog(newLog);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
    setNote("");
  };

  // Dynamic state quadrant insight
  const getOperatingRecommendation = () => {
    if (energy >= 7 && mood >= 7) {
      return {
        zone: "Peak Output Zone",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        message: "Cognitive bandwidth is primed. Tackle your highest-leverage deep work or hardest bug.",
      };
    } else if (energy <= 4 && mood <= 4) {
      return {
        zone: "Slump Buffer Zone",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        message: "Protect your biological baseline. Hydrate, take a 20m power nap, or switch to low-power tasks.",
      };
    } else if (energy <= 4 && mood >= 6) {
      return {
        zone: "Cozy Realignment Zone",
        color: "text-blue-700 bg-blue-50 border-blue-200",
        message: "Mental spirits are high despite low bodily energy. Ideal for reading, strategic review, or clean-up.",
      };
    } else {
      return {
        zone: "Steady Cadence Zone",
        color: "text-indigo-700 bg-indigo-50 border-indigo-200",
        message: "Balanced rhythm. Maintain steady 45-minute focus intervals with brief movement breaks.",
      };
    }
  };

  const recommendation = getOperatingRecommendation();

  return (
    <Card className="p-5 bg-white border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 border border-violet-200/80">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Energy & Mood Matrix</h3>
              <p className="text-[11px] text-slate-500">Bio-feedback calibration & capacity check-in</p>
            </div>
          </div>

          {latestLog && (
            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
              Latest: <span className="font-bold text-slate-800">⚡{latestLog.energy}/10</span> • <span className="font-bold text-slate-800">😊{latestLog.mood}/10</span>
            </div>
          )}
        </div>

        {/* Operating Recommendation Card */}
        <div className={`mt-3 p-2.5 rounded-xl border ${recommendation.color} text-xs space-y-0.5`}>
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Compass size={13} />
              <span>{recommendation.zone}</span>
            </span>
            <span className="text-[10px] font-mono uppercase">Guidance</span>
          </div>
          <p className="text-[11px] opacity-90 leading-relaxed font-normal">
            {recommendation.message}
          </p>
        </div>

        {/* Check-In Form */}
        <form onSubmit={handleSave} className="mt-3.5 space-y-3">
          {/* Sliders */}
          <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            {/* Energy Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Zap size={13} className="text-amber-500 fill-amber-500" />
                  <span>Physical Energy</span>
                </span>
                <span className="font-mono text-amber-600 font-bold">{energy}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Mood Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Smile size={13} className="text-emerald-500" />
                  <span>Mental Mood</span>
                </span>
                <span className="font-mono text-emerald-600 font-bold">{mood}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Quick Tags */}
          <div>
            <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">State Tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                      isSelected
                        ? "bg-violet-100 text-violet-800 border border-violet-300"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note & Submit */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="What triggered this state? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />

            <button
              type="submit"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-xs shrink-0 ${
                isSavedRecently
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              {isSavedRecently ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Log Check-in</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};
