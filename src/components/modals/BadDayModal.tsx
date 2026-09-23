"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

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
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 shadow-xs">
          <p className="font-bold mb-0.5">Forget the full plan. Let's protect the day.</p>
          <p className="text-[11px] opacity-90 leading-relaxed">
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
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 shadow-xs ${
                  isDone
                    ? "bg-emerald-50/70 border-emerald-300 text-slate-800"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                    isDone
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isDone && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDone ? "line-through opacity-60 text-slate-500" : "text-slate-900"}`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
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
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
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
