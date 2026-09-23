"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationService } from "@/services/notificationService";
import { MotivationalQuote } from "@/lib/quotes";
import { Sparkles, X, ArrowRight, Zap, Bell } from "lucide-react";

interface InAppAlert {
  quote: MotivationalQuote;
  isTest?: boolean;
}

export const NotificationManager: React.FC = () => {
  const router = useRouter();
  const [activeAlert, setActiveAlert] = useState<InAppAlert | null>(null);

  useEffect(() => {
    // 1. Register Service Worker for mobile push capabilities
    NotificationService.registerServiceWorker();

    // 2. Initial check for today's scheduled morning notification
    NotificationService.checkAndTriggerScheduledMorning();

    // 3. Set a timer for next morning's alarm
    const msUntilNext = NotificationService.getMsUntilNextAlarm();
    const timerId = setTimeout(() => {
      NotificationService.checkAndTriggerScheduledMorning();
    }, msUntilNext);

    // 4. Also check when user returns or unlocks device
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        NotificationService.checkAndTriggerScheduledMorning();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 5. Listen for in-app alert events (for active browser tab or instant test)
    const handleInAppAlert = (e: Event) => {
      const customEvent = e as CustomEvent<InAppAlert>;
      if (customEvent.detail && customEvent.detail.quote) {
        setActiveAlert(customEvent.detail);
      }
    };
    window.addEventListener("comeback-in-app-notification", handleInAppAlert);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("comeback-in-app-notification", handleInAppAlert);
    };
  }, []);

  // Auto-dismiss in-app notification banner after 9 seconds
  useEffect(() => {
    if (!activeAlert) return;
    const dismissTimer = setTimeout(() => {
      setActiveAlert(null);
    }, 9000);
    return () => clearTimeout(dismissTimer);
  }, [activeAlert]);

  if (!activeAlert) return null;

  const { quote, isTest } = activeAlert;

  const handleStartFocus = () => {
    setActiveAlert(null);
    router.push("/focus");
  };

  return (
    <aside
      aria-label="Morning Notification Alert"
      className="fixed top-3 left-3 right-3 sm:max-w-lg sm:left-auto sm:right-4 z-50 animate-in slide-in-from-top-5 duration-300 pointer-events-auto"
    >
      <div className="p-4 rounded-2xl bg-white border-2 border-orange-400 shadow-2xl shadow-orange-500/20 text-slate-900 space-y-2.5 backdrop-blur-md">
        {/* Banner Top Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-orange-200 bg-orange-50 shrink-0">
              <img src="/logo.png" alt="comeback.mjg" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 tracking-tight">comeback.mjg</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                  {isTest ? "6:00 AM Test" : "6:00 AM Kickstart"}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                Daily Morning Motivation
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveAlert(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>

        {/* Highlighted Motivational Quote */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80">
          <p className="text-xs font-bold text-slate-900 leading-relaxed italic">
            "{quote.text}"
          </p>
          <div className="mt-1 text-[11px] font-semibold text-orange-700 text-right">
            — {quote.author}
          </div>
        </div>

        {/* Micro-Step & Action Button */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="text-[11px] text-slate-600 truncate">
            <span className="font-bold text-slate-900">Today's Focus: </span>
            <span>{quote.actionAdvice}</span>
          </div>

          <button
            onClick={handleStartFocus}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Zap size={13} />
            <span>Start</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
