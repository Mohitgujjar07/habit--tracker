"use client";

import React, { useEffect, useState } from "react";
import {
  LifeBuoy,
  ShieldAlert,
  Moon,
  Sun,
  Plus,
  Bot,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface HeaderProps {
  onOpenStuckModal: () => void;
  onOpenBadDayMode: () => void;
  onOpenQuickAction: () => void;
  onOpenAICoach: () => void;
  onOpenCommandCenter: () => void;
  isBadDayModeActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStuckModal,
  onOpenBadDayMode,
  onOpenQuickAction,
  onOpenAICoach,
  onOpenCommandCenter,
  isBadDayModeActive = false,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check initial theme class on root html
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      setIsDarkMode(root.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDarkMode(false);
      localStorage.setItem("ptos_theme", "light");
    } else {
      root.classList.add("dark");
      setIsDarkMode(true);
      localStorage.setItem("ptos_theme", "dark");
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-surface-200/80 dark:border-surface-800 bg-white/70 dark:bg-surface-50/70 backdrop-blur-md">
      {/* Left items / status indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCommandCenter}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700/60 bg-surface-100/70 dark:bg-surface-800/40 text-xs text-surface-500 hover:text-foreground hover:border-surface-300 transition-colors"
        >
          <Command size={13} />
          <span>Quick Find...</span>
          <kbd className="font-mono text-[10px] bg-surface-200 dark:bg-surface-700 px-1 py-0.5 rounded text-surface-600 dark:text-surface-300">
            ⌘K
          </kbd>
        </button>

        {isBadDayModeActive && (
          <Badge variant="warning" className="animate-pulse">
            <ShieldAlert size={12} /> Bad Day Mode Active
          </Badge>
        )}
      </div>

      {/* Right actions: Stuck, Bad Day, AI Coach, Add, Theme */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* I'M STUCK (Section 30) */}
        <button
          onClick={onOpenStuckModal}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1.5 active:scale-95"
          title="Micro 2-minute action generator when experiencing friction or avoidance"
        >
          <LifeBuoy size={14} />
          <span>I'm Stuck</span>
        </button>

        {/* BAD DAY MODE (Section 39) */}
        <button
          onClick={onOpenBadDayMode}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isBadDayModeActive
              ? "bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-surface-200 dark:border-surface-700/60 text-surface-600 dark:text-surface-400 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800"
          }`}
          title="Scale down the entire day to essential survival & recovery minimums"
        >
          <ShieldAlert size={14} />
          <span>{isBadDayModeActive ? "Exit Bad Day" : "Bad Day Mode"}</span>
        </button>

        {/* AI COACH DRAWER (Section 57) */}
        <Button
          variant="subtle"
          size="sm"
          onClick={onOpenAICoach}
          className="gap-1.5 text-xs text-brand-600 dark:text-brand-400"
        >
          <Bot size={15} />
          <span className="hidden sm:inline">Coach</span>
        </Button>

        {/* QUICK ACTION DESKTOP '+' (Section 5) */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenQuickAction}
          className="hidden sm:inline-flex gap-1 text-xs"
        >
          <Plus size={15} />
          <span>Action</span>
        </Button>

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-500 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};
