"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getDailyQuote, getRandomQuote, MotivationalQuote } from "@/lib/quotes";
import { NotificationService } from "@/services/notificationService";
import {
  Sparkles,
  Quote,
  Zap,
  RefreshCw,
  Bell,
  Check,
  ArrowRight,
  Sun,
} from "lucide-react";

export const MorningQuoteHero: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote>(() => getDailyQuote());
  const [isTested, setIsTested] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleNextQuote = () => {
    setIsRotating(true);
    setCurrentQuote(getRandomQuote());
    setTimeout(() => setIsRotating(false), 300);
  };

  const handleTriggerTest = async () => {
    await NotificationService.requestPermission();
    await NotificationService.showNotification(currentQuote, true);
    setIsTested(true);
    setTimeout(() => setIsTested(false), 3000);
  };

  return (
    <Card className="p-5 sm:p-6 bg-gradient-to-br from-orange-50/90 via-amber-50/30 to-white border-orange-200/80 shadow-sm relative overflow-hidden">
      {/* Decorative background sun glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative space-y-4">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sun size={15} />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-700 font-bold">
              DAILY 6:00 AM MOTIVATIONAL ANCHOR
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant="brand" size="sm" className="capitalize">
              {currentQuote.category}
            </Badge>

            <button
              onClick={handleNextQuote}
              title="Shuffle motivational quote"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
            >
              <RefreshCw size={13} className={isRotating ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Highlighted Quote Body */}
        <div className="flex items-start gap-3 pt-1">
          <div className="p-2 rounded-2xl bg-orange-500/10 text-orange-600 shrink-0 mt-0.5">
            <Quote size={20} />
          </div>

          <div className="space-y-1.5 min-w-0">
            <blockquote className="text-sm sm:text-base font-bold text-slate-900 leading-snug tracking-tight">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-xs font-semibold text-orange-600 block not-italic">
              — {currentQuote.author}
            </cite>
          </div>
        </div>

        {/* Action Advice & Morning Kickstart CTA */}
        <div className="p-3 rounded-xl bg-white/90 border border-orange-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">Today's Focus Prompt: </span>
            <span className="text-slate-600">{currentQuote.actionAdvice}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerTest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-all"
              title="Test this alert as a mobile notification right now"
            >
              {isTested ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-600 font-bold">Sent to Mobile!</span>
                </>
              ) : (
                <>
                  <Bell size={13} className="text-orange-500" />
                  <span>Test Mobile Alert</span>
                </>
              )}
            </button>

            <Link
              href="/focus"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Zap size={13} />
              <span>Start Focus</span>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
