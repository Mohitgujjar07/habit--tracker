"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NextActionRecommendation } from "@/types";
import { Zap, Clock, ArrowRight, CornerDownRight, RotateCw, CheckCircle2 } from "lucide-react";

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
    <Card className="relative overflow-hidden border-brand-500/30 bg-gradient-to-br from-brand-500/[0.04] via-transparent to-surface-100/50 dark:to-surface-800/20 p-5 sm:p-6 shadow-sm">
      {/* Top tag */}
      <div className="flex items-center justify-between gap-2 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400">
            NEXT ACTION • RECOMMENDED BY ENGINE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">
            <Clock size={11} /> {action.durationMinutes} min block
          </Badge>
          <span className="text-[11px] text-surface-400 font-mono hidden sm:inline">
            {action.energyMatch}
          </span>
        </div>
      </div>

      {/* Main Action Title */}
      <div className="my-2">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {action.title}
        </h2>
        {action.projectTitle && (
          <div className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 mt-1">
            <CornerDownRight size={13} className="text-brand-500" />
            <span>Connected to Project:</span>
            <span className="font-semibold text-foreground">{action.projectTitle}</span>
          </div>
        )}
      </div>

      {/* Rationale explanation */}
      <p className="text-xs text-surface-500 dark:text-surface-400 bg-surface-100/80 dark:bg-surface-800/60 p-2.5 rounded-lg border border-surface-200/50 dark:border-surface-700/40 my-3">
        <span className="font-semibold text-foreground">Why this now:</span> {action.rationale}
      </p>

      {/* Postpone reason picker overlay */}
      {showReasonPicker ? (
        <div className="mt-3 p-3 bg-surface-100 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 space-y-2 animate-in fade-in">
          <div className="text-xs font-semibold text-foreground">
            Why skip this action right now? (Recorded for avoidance analysis)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reasons.map((r) => (
              <button
                key={r}
                onClick={() => handleSelectReason(r)}
                className="text-left text-xs p-2 rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 hover:border-brand-500 text-surface-700 dark:text-surface-300 transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowReasonPicker(false)}
            className="text-[11px] text-surface-400 hover:text-foreground mt-1"
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
            className="gap-2 shadow-md shadow-brand-500/10"
          >
            <Zap size={16} />
            <span>START FOCUS ({action.durationMinutes}m)</span>
            <ArrowRight size={14} />
          </Button>

          <Button
            variant="subtle"
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
