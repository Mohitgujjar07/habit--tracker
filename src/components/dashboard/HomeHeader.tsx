"use client";

import React from "react";
import { UserProfile } from "@/types";

interface HomeHeaderProps {
  profile: UserProfile | null;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ profile }) => {
  const name = profile?.preferredName || "Builder";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const day = profile?.transformationDay || 24;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            {greeting}, {name}
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-orange-50 text-orange-600 border border-orange-200">
            DAY {day} • MOMENTUM
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">
          A better you. Everyday. Small steps lead to lasting momentum.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        <div className="text-left sm:text-right">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
            Current Phase
          </div>
          <div className="text-xs font-bold text-slate-800">
            {profile?.transformationPhase || "Phase 2: Digital & Execution Build"}
          </div>
        </div>
      </div>
    </div>
  );
};
