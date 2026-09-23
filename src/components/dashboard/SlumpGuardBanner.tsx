"use client";

import React, { useState } from "react";
import { SlumpRiskAssessment } from "@/types";
import {
  ShieldAlert,
  AlertTriangle,
  BatteryCharging,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SlumpGuardBannerProps {
  assessment: SlumpRiskAssessment | null;
  onActivateRestDay: () => void;
}

export const SlumpGuardBanner: React.FC<SlumpGuardBannerProps> = ({
  assessment,
  onActivateRestDay,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!assessment || isDismissed) return null;

  const isHigh = assessment.riskLevel === "high";
  const isModerate = assessment.riskLevel === "moderate";

  // If low risk, show a subtle non-intrusive status pill
  if (assessment.riskLevel === "low") {
    return (
      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">Momentum Guard:</span>
          <span>
            {assessment.riskScore}% Burnout Risk • Stable Energy & Workload
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          {isExpanded ? "Hide Details" : "View Factors"}
          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>
    );
  }

  // Moderate or High Risk Banner
  const containerClasses = isHigh
    ? "bg-rose-50/90 border-rose-300 text-rose-950"
    : "bg-amber-50/90 border-amber-300 text-amber-950";

  const badgeClasses = isHigh
    ? "bg-rose-600 text-white"
    : "bg-amber-500 text-white";

  const iconColor = isHigh ? "text-rose-600" : "text-amber-600";

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border shadow-sm transition-all animate-in fade-in slide-in-from-top-2 ${containerClasses}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left header & summary */}
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl bg-white shadow-xs border ${
              isHigh ? "border-rose-200 text-rose-600" : "border-amber-200 text-amber-600"
            } shrink-0`}
          >
            {isHigh ? <ShieldAlert size={22} /> : <HeartPulse size={22} />}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-mono uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${badgeClasses}`}
              >
                {isHigh ? "High Slump Alert" : "Emerging Strain Detected"}
              </span>
              <span className="text-xs font-mono font-bold">
                {assessment.riskScore}% Burnout Index (48h Projection)
              </span>
            </div>

            <h3 className="text-sm font-bold tracking-tight text-slate-900">
              {assessment.summary}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl pt-0.5">
              Behavioral neuroscience insight:{" "}
              <em>
                "Taking a planned, intentional rest day resets dopamine and
                prevents an involuntary 5-day habit collapse."
              </em>
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <Button
            variant="primary"
            size="sm"
            onClick={onActivateRestDay}
            className={`text-xs font-bold gap-1.5 shadow-sm ${
              isHigh
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : "bg-amber-600 hover:bg-amber-500 text-white"
            }`}
          >
            <BatteryCharging size={15} />
            <span>Activate Low-Power Rest Day</span>
            <ArrowRight size={14} />
          </Button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            title="Dismiss warning for now"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Contributing Factors Accordion */}
      <div className="mt-3.5 pt-3 border-t border-slate-200/60">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
        >
          <span>Diagnostic Indicators ({assessment.contributingFactors.length})</span>
          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 pt-1 animate-in fade-in">
            {assessment.contributingFactors.map((factor, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-xl bg-white/90 border border-slate-200/80 text-xs text-slate-700 flex items-center gap-2 shadow-2xs"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? "bg-rose-500" : "bg-amber-500"}`} />
                <span className="font-medium">{factor}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
