"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LifeBuoy,
  ShieldAlert,
  Plus,
  Bot,
  Command,
  Waves,
  Mic,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface HeaderProps {
  onOpenStuckModal: () => void;
  onOpenBadDayMode: () => void;
  onOpenQuickAction: () => void;
  onOpenAICoach: () => void;
  onOpenCommandCenter: () => void;
  onOpenUrgeSurfer?: () => void;
  onOpenVoiceCheckin?: () => void;
  onOpenShieldHub?: () => void;
  isBadDayModeActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStuckModal,
  onOpenBadDayMode,
  onOpenQuickAction,
  onOpenAICoach,
  onOpenCommandCenter,
  onOpenUrgeSurfer,
  onOpenVoiceCheckin,
  onOpenShieldHub,
  isBadDayModeActive = false,
}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      {/* Left items: Mobile Logo & Desktop Quick Find */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo Branding */}
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-orange-200">
            <img
              src="/logo.png"
              alt="comeback.mjg logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900">
            comeback<span className="text-orange-500">.mjg</span>
          </span>
        </Link>

        {/* Desktop Quick Find Search */}
        <button
          onClick={onOpenCommandCenter}
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-xs text-slate-500 hover:text-slate-800 transition-all shadow-xs"
        >
          <Command size={13} className="text-slate-400" />
          <span>Quick Find...</span>
          <kbd className="font-mono text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-600">
            ⌘K
          </kbd>
        </button>

        {isBadDayModeActive && (
          <Badge variant="warning" className="animate-pulse">
            <ShieldAlert size={12} /> Bad Day Mode Active
          </Badge>
        )}
      </div>

      {/* Right actions: Voice Debrief, Urge Surfer, Stuck, Bad Day, AI Coach, Add */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* VOICE DEBRIEF (Option C: 60-Second Audio Check-in) */}
        <button
          onClick={onOpenVoiceCheckin}
          className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
          title="60-Second Evening Voice Memo check-in with AI win extraction"
        >
          <Mic size={14} className="text-indigo-600" />
          <span className="hidden sm:inline">Voice Debrief</span>
        </button>

        {/* APP SHIELD (Android & iOS Interception Hub) */}
        <button
          onClick={onOpenShieldHub}
          className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
          title="Cross-platform distraction shield (Native Android APK, iOS Shortcuts, Desktop Extension)"
        >
          <Shield size={14} className="text-emerald-600" />
          <span className="hidden md:inline">App Shield</span>
        </button>

        {/* RESIST URGE (Option A: Urge Surfer Dopamine Reset) */}
        <button
          onClick={onOpenUrgeSurfer}
          className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
          title="90-Second Physiological Sigh protocol to reset dopamine and surf cravings"
        >
          <Waves size={14} className="text-orange-500" />
          <span className="hidden xs:inline sm:inline">Resist Urge</span>
        </button>

        {/* I'M STUCK (Section 30) */}
        <button
          onClick={onOpenStuckModal}
          className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
          title="Micro 2-minute action generator when experiencing friction or avoidance"
        >
          <LifeBuoy size={14} className="text-rose-500" />
          <span className="hidden xs:inline">I'm Stuck</span>
        </button>

        {/* BAD DAY MODE (Section 39) */}
        <button
          onClick={onOpenBadDayMode}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-xs ${
            isBadDayModeActive
              ? "bg-amber-100 border-amber-400 text-amber-800"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          }`}
          title="Scale down the entire day to essential survival & recovery minimums"
        >
          <ShieldAlert size={14} className="text-amber-500" />
          <span>{isBadDayModeActive ? "Exit Bad Day" : "Bad Day Mode"}</span>
        </button>

        {/* AI COACH DRAWER (Section 57) */}
        <Button
          variant="subtle"
          size="sm"
          onClick={onOpenAICoach}
          className="gap-1.5 text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200/60"
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
      </div>
    </header>
  );
};
