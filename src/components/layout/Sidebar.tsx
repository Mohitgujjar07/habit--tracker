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
  Command,
  RefreshCw,
  Code2,
  GraduationCap,
  Sparkles,
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
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/80 bg-white h-screen sticky top-0 px-4 py-5 select-none z-30 shadow-xs">
      {/* Brand Header with App Logo */}
      <div className="flex items-center gap-3 px-2 pb-4 border-b border-slate-200/80">
        <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm border border-orange-200 bg-orange-50 shrink-0">
          <img
            src="/logo.png"
            alt="comeback.mjg App Icon"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-sm tracking-tight text-slate-900 leading-none">
            comeback<span className="text-orange-500">.mjg</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium tracking-tight mt-1 truncate">
            A Better You. Everyday.
          </div>
        </div>
      </div>

      {/* 90-Day Transformation Phase Badge */}
      <div className="mt-4 px-3 py-2 rounded-xl bg-orange-50/80 border border-orange-200/70 flex items-center justify-between text-xs">
        <span className="font-mono text-orange-700 text-[11px] font-bold">
          DAY {profile?.transformationDay || 24} / 90
        </span>
        <span className="text-[11px] font-semibold text-orange-600">
          Phase 2: Build
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="mt-4 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-orange-50 text-orange-600 font-bold border-r-2 border-orange-500 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-orange-500" : "text-slate-400"}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Specialized Mode links */}
      <div className="pt-3 border-t border-slate-200 space-y-1">
        <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
          Specialized Views
        </div>
        <Link
          href="/dashboard?mode=developer"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        >
          <Code2 size={15} className="text-slate-400" />
          <span>Developer Studio</span>
        </Link>
        <Link
          href="/dashboard?mode=college"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        >
          <GraduationCap size={15} className="text-slate-400" />
          <span>College Mode</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        >
          <Sparkles size={15} className="text-orange-500" />
          <span>Brand & Splash Screen</span>
        </Link>
      </div>

      {/* Command Palette & Demo Reset */}
      <div className="pt-3 mt-2 border-t border-slate-200 space-y-2">
        <button
          onClick={onOpenCommandCenter}
          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80 transition-colors"
        >
          <span className="flex items-center gap-2 font-medium">
            <Command size={14} className="text-slate-400" />
            Command Center
          </span>
          <kbd className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={handleResetDemo}
          title="Reset sample data back to standard 30-day realistic state"
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          <RefreshCw size={12} />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
