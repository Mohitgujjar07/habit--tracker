"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
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
    { label: "Sleep", value: `${sleepHours}h`, icon: Moon, color: "text-indigo-400" },
    { label: "Energy", value: `${energyLevel}/10`, icon: Zap, color: "text-amber-400" },
    { label: "Mood", value: `${moodLevel}/10`, icon: Smile, color: "text-emerald-400" },
    { label: "Focus", value: `${focusMinutes}m`, icon: Clock, color: "text-cyan-400" },
    { label: "Steps", value: `${stepsCount.toLocaleString()}`, icon: Footprints, color: "text-teal-400" },
    { label: "Screen Time", value: `${screenTimeHours}h`, icon: Smartphone, color: "text-rose-400" },
    { label: "Workout", value: workoutLogged ? "Logged" : "Rest", icon: Dumbbell, color: "text-purple-400" },
    { label: "Learning", value: `${learningMinutes}m`, icon: BookOpen, color: "text-blue-400" },
    { label: "Output", value: `${outputMinutes}m`, icon: Code, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400 font-semibold block">
        TODAY AT A GLANCE
      </span>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="p-2.5 rounded-xl border border-surface-200/80 dark:border-surface-700/60 bg-white/60 dark:bg-surface-100/60 flex flex-col items-center justify-center text-center transition-all hover:border-surface-300"
            >
              <Icon size={15} className={`${m.color} mb-1`} />
              <div className="text-xs font-bold font-mono text-foreground leading-tight">
                {m.value}
              </div>
              <div className="text-[10px] text-surface-400 mt-0.5 whitespace-nowrap">
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
