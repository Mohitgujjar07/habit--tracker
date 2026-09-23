"use client";

import React, { useState } from "react";
import { DetectedPattern } from "@/lib/engines/patternEngine";
import { Button } from "@/components/ui/Button";
import { Sparkles, Eye, X, ArrowRight } from "lucide-react";

interface PatternsNoticeProps {
  patterns: DetectedPattern[];
  onConfirmPattern?: (patternId: string) => void;
}

export const PatternsNotice: React.FC<PatternsNoticeProps> = ({
  patterns,
  onConfirmPattern,
}) => {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  const activePatterns = patterns.filter((p) => !dismissed[p.id]);
  if (activePatterns.length === 0) return null;

  const topPattern = activePatterns[0];

  const handleDismiss = (id: string) => {
    setDismissed((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.07] backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-0.5">
          <Eye size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
              OBSERVED PATTERN IN YOUR DATA
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-foreground mt-0.5">
            {topPattern.title}
          </h4>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
            {topPattern.observation}{" "}
            <span className="text-foreground font-medium">{topPattern.suggestedAction}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {topPattern.requiresConfirmation && onConfirmPattern && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConfirmPattern(topPattern.id)}
            className="text-xs whitespace-nowrap"
          >
            Update Routine
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDismiss(topPattern.id)}
          className="text-xs text-surface-400 hover:text-foreground"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};
