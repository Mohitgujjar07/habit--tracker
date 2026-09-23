"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  FolderKanban,
  Zap,
  Brain,
  Activity,
  TrendingUp,
  User,
  Sparkles,
  Command,
  RefreshCw,
  Code2,
  GraduationCap,
} from "lucide-react";
import { DataStoreRepository } from "@/repositories/dataStore";
import { UserProfile } from "@/types";

interface SidebarProps {
  onOpenCommandCenter?: () => void;
  onOpenQuickAction?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenCommandCenter,
  onOpenQuickAction,
}) => {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadProfile = () => {
    setProfile(DataStoreRepository.getUserProfile());
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener("ptos-data-change", loadProfile);
    return () => window.removeEventListener("ptos-data-change", loadProfile);
  }, []);

  const navItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Goals", href: "/goals", icon: Target },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "Focus", href: "/focus", icon: Zap },
    { label: "Mind", href: "/mind", icon: Brain },
    { label: "Body", href: "/body", icon: Activity },
    { label: "Progress", href: "/progress", icon: TrendingUp },
    { label: "Profile", href: "/profile", icon: User },
  ];

  const handleResetDemo = () => {
    if (confirm("Reset all local data back to the clean 30-day realistic demo state?")) {
      DataStoreRepository.resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-surface-200/80 dark:border-surface-800 bg-white/50 dark:bg-surface-100/40 backdrop-blur-md h-screen sticky top-0 px-4 py-5 select-none z-30">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 pb-5 border-b border-surface-200/60 dark:border-surface-800/80">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center text-white font-bold text-base shadow-sm">
            Δ
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              TRANSFORMATION <span className="text-[10px] text-brand-500 font-mono">OS</span>
            </div>
            <div className="text-[11px] text-surface-400 font-medium">
              Execution Engine
            </div>
          </div>
        </Link>
      </div>

      {/* 90-Day Transformation Phase Badge */}
      <div className="mt-4 px-2.5 py-2 rounded-lg bg-surface-100 dark:bg-surface-800/60 border border-surface-200/60 dark:border-surface-700/40 flex items-center justify-between text-xs">
        <span className="font-mono text-surface-500 dark:text-surface-400 text-[11px]">
          DAY {profile?.transformationDay || 24} / 90
        </span>
        <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
          Phase 2: Build
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="mt-5 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                  : "text-surface-600 dark:text-surface-400 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800/50"
              }`}
            >
              <Icon size={18} className={isActive ? "text-brand-500" : "text-surface-400"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Specialized Mode links if profile configured */}
      <div className="pt-3 border-t border-surface-200/60 dark:border-surface-800/80 space-y-1">
        <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-surface-400">
          Specialized Views
        </div>
        <Link
          href="/dashboard?mode=developer"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-surface-600 dark:text-surface-400 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800/40"
        >
          <Code2 size={15} />
          <span>Developer Studio</span>
        </Link>
        <Link
          href="/dashboard?mode=college"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-surface-600 dark:text-surface-400 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800/40"
        >
          <GraduationCap size={15} />
          <span>College Mode</span>
        </Link>
      </div>

      {/* Command Palette & Demo Reset */}
      <div className="pt-3 mt-2 border-t border-surface-200/60 dark:border-surface-800/80 space-y-2">
        <button
          onClick={onOpenCommandCenter}
          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg bg-surface-100 dark:bg-surface-800/60 hover:bg-surface-200/60 dark:hover:bg-surface-700/50 text-surface-500 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Command size={14} />
            Command Center
          </span>
          <kbd className="font-mono text-[10px] bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 rounded text-surface-600 dark:text-surface-300">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={handleResetDemo}
          title="Reset sample data back to standard 30-day realistic state"
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
        >
          <RefreshCw size={13} />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
