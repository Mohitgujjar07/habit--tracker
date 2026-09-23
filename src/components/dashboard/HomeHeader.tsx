"use client";

import React from "react";
import { UserProfile } from "@/types";
import { Sparkles, Calendar } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-200/60 dark:border-surface-800/80">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {greeting}, {name}
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            DAY {day} / 90
          </span>
        </div>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
          Turn your goals into actions, your actions into evidence, and your evidence into lasting progress.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        <div className="text-right">
          <div className="text-[10px] font-mono text-surface-400 uppercase tracking-wider">
            Current Phase
          </div>
          <div className="text-xs font-semibold text-foreground">
            Phase 2: Digital & Execution Build
          </div>
        </div>
      </div>
    </div>
  );
};
