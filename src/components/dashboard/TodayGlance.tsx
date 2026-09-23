"use client";

import React from "react";
import {
  Moon,
  Zap,
  Smile,
  Clock,
  Footprints,
  Smartphone,
  Dumbbell,
  BookOpen,
  Code,
} from "lucide-react";

interface TodayGlanceProps {
  sleepHours: number;
  energyLevel: number;
  moodLevel: number;
  focusMinutes: number;
  stepsCount: number;
  screenTimeHours: number;
  workoutLogged: boolean;
  learningMinutes: number;
  outputMinutes: number;
}

export const TodayGlance: React.FC<TodayGlanceProps> = ({
  sleepHours = 7.5,
  energyLevel = 8,
  moodLevel = 8,
  focusMinutes = 45,
  stepsCount = 6420,
  screenTimeHours = 4.2,
  workoutLogged = true,
  learningMinutes = 30,
  outputMinutes = 150,
}) => {
  const metrics = [
    { label: "Sleep", value: `${sleepHours}h`, icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Energy", value: `${energyLevel}/10`, icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Mood", value: `${moodLevel}/10`, icon: Smile, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Focus", value: `${focusMinutes}m`, icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Steps", value: `${stepsCount.toLocaleString()}`, icon: Footprints, color: "text-teal-500", bg: "bg-teal-50" },
    { label: "Screen Time", value: `${screenTimeHours}h`, icon: Smartphone, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Workout", value: workoutLogged ? "Logged" : "Rest", icon: Dumbbell, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Learning", value: `${learningMinutes}m`, icon: BookOpen, color: "text-sky-500", bg: "bg-sky-50" },
    { label: "Output", value: `${outputMinutes}m`, icon: Code, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
        TODAY AT A GLANCE
      </span>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="p-3 rounded-2xl border border-slate-200/90 bg-white shadow-xs flex flex-col items-center justify-center text-center transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div className={`p-1.5 rounded-xl ${m.bg} ${m.color} mb-1.5`}>
                <Icon size={16} />
              </div>
              <div className="text-xs sm:text-sm font-extrabold font-mono text-slate-900 leading-tight">
                {m.value}
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5 whitespace-nowrap">
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
