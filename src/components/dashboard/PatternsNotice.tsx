"use client";

import React, { useState } from "react";
import { DetectedPattern } from "@/lib/engines/patternEngine";
import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";

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
    <div className="p-4 sm:p-5 rounded-2xl border border-orange-200/90 bg-gradient-to-r from-orange-50/80 to-amber-50/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 mt-0.5 shadow-xs">
          <Eye size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-700 font-bold">
              OBSERVED PATTERN IN YOUR DATA
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
            {topPattern.title}
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {topPattern.observation}{" "}
            <span className="text-slate-900 font-semibold">{topPattern.suggestedAction}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
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
          className="text-xs text-slate-500 hover:text-slate-800"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};
