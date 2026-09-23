"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, Check, ArrowRight } from "lucide-react";

interface BadDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
  onToggleMode: (active: boolean) => void;
}

export const BadDayModal: React.FC<BadDayModalProps> = ({
  isOpen,
  onClose,
  isActive,
  onToggleMode,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    water: false,
    hygiene: false,
    movement: false,
    microFocus: false,
    bedtime: false,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklist = [
    { id: "water", title: "Hydration", desc: "Drink a tall glass of cold water right now." },
    { id: "hygiene", title: "Basic Hygiene", desc: "Wash face, brush teeth, change into clean clothes." },
    { id: "movement", title: "5-Minute Movement", desc: "Walk outside or stretch gently to break physical stasis." },
    { id: "microFocus", title: "10-Minute Focus", desc: "Work on ONLY ONE non-negotiable task for 10 minutes." },
    { id: "bedtime", title: "Protect Bedtime", desc: "Turn off screens 45 minutes before sleep to reset tomorrow." },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bad Day Mode — Protect the Baseline"
      description="Zero shame. Some days are about holding the line, not setting records."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
          <p className="font-semibold mb-0.5">Forget the full plan. Let's protect the day.</p>
          <p className="text-[11px] opacity-90">
            We compress your dashboard to only 5 baseline anchors. Completing these is 100% success for today.
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {checklist.map((item) => {
            const isDone = checkedItems[item.id];
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                  isDone
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                    : "bg-surface-50 dark:bg-surface-800/60 border-surface-200 dark:border-surface-700/80 text-foreground hover:bg-surface-100 dark:hover:bg-surface-800"
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    isDone
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-surface-400 dark:border-surface-600"
                  }`}
                >
                  {isDone && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isDone ? "line-through opacity-70" : ""}`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-surface-500 dark:text-surface-400">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              onToggleMode(!isActive);
              onClose();
            }}
            className="text-xs font-medium text-surface-500 hover:text-foreground"
          >
            {isActive ? "Exit Bad Day Mode" : "Activate on Dashboard"}
          </button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Got It
          </Button>
        </div>
      </div>
    </Modal>
  );
};
