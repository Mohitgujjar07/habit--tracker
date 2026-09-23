"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NextActionRecommendation } from "@/types";
import { Zap, Clock, ArrowRight, CornerDownRight, RotateCw } from "lucide-react";

interface NextActionHeroProps {
  action: NextActionRecommendation;
  onRefreshAction: () => void;
  onPostponeReason: (reason: string) => void;
}

export const NextActionHero: React.FC<NextActionHeroProps> = ({
  action,
  onRefreshAction,
  onPostponeReason,
}) => {
  const router = useRouter();
  const [showReasonPicker, setShowReasonPicker] = useState(false);

  const reasons = [
    "Energy is too low for this right now",
    "Missing necessary inputs or requirements",
    "Switching to emergency high-priority item",
    "Need a 5-minute break first",
  ];

  const handleStartFocus = () => {
    const params = new URLSearchParams();
    if (action.taskId) params.set("taskId", action.taskId);
    if (action.title) params.set("taskTitle", action.title);
    if (action.projectId) params.set("projectId", action.projectId);
    params.set("duration", String(action.durationMinutes || 25));
    router.push(`/focus?${params.toString()}`);
  };

  const handleSelectReason = (r: string) => {
    onPostponeReason(r);
    setShowReasonPicker(false);
    onRefreshAction();
  };

  return (
    <Card className="relative overflow-hidden border-orange-200/90 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 p-5 sm:p-7 shadow-card hover:border-orange-300">
      {/* Top tag */}
      <div className="flex items-center justify-between gap-2 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-orange-600">
            NEXT ACTION • RECOMMENDED BY ENGINE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">
            <Clock size={11} /> {action.durationMinutes} min block
          </Badge>
          <span className="text-[11px] text-slate-500 font-mono font-medium hidden sm:inline">
            {action.energyMatch}
          </span>
        </div>
      </div>

      {/* Main Action Title */}
      <div className="my-2">
        <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
          {action.title}
        </h2>
        {action.projectTitle && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-medium">
            <CornerDownRight size={13} className="text-orange-500" />
            <span>Connected to Project:</span>
            <span className="font-bold text-slate-900">{action.projectTitle}</span>
          </div>
        )}
      </div>

      {/* Rationale explanation */}
      <div className="text-xs text-slate-600 bg-white/90 p-3 rounded-xl border border-slate-200/80 my-3 shadow-xs">
        <span className="font-bold text-slate-900">Why this now:</span> {action.rationale}
      </div>

      {/* Postpone reason picker overlay */}
      {showReasonPicker ? (
        <div className="mt-3 p-3.5 bg-white rounded-xl border border-orange-200 space-y-2.5 shadow-sm animate-in fade-in">
          <div className="text-xs font-bold text-slate-900">
            Why skip this action right now? (Recorded for avoidance analysis)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reasons.map((r) => (
              <button
                key={r}
                onClick={() => handleSelectReason(r)}
                className="text-left text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-400 hover:bg-orange-50/50 text-slate-700 font-medium transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowReasonPicker(false)}
            className="text-[11px] text-slate-400 hover:text-slate-700 mt-1 font-medium"
          >
            Cancel
          </button>
        </div>
      ) : (
        /* Action buttons */
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleStartFocus}
            className="gap-2 shadow-md shadow-orange-500/20 px-5"
          >
            <Zap size={16} />
            <span>START FOCUS ({action.durationMinutes}m)</span>
            <ArrowRight size={14} />
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowReasonPicker(true)}
            className="text-xs"
          >
            Not Now
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={onRefreshAction}
            className="text-xs gap-1.5"
            title="Evaluate alternative task in queue"
          >
            <RotateCw size={13} />
            <span>Change</span>
          </Button>
        </div>
      )}
    </Card>
  );
};
