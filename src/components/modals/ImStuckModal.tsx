"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataStoreRepository } from "@/repositories/dataStore";
import { Play, Pause, RotateCcw, CheckCircle, LifeBuoy } from "lucide-react";

interface ImStuckModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTaskTitle?: string;
}

export const ImStuckModal: React.FC<ImStuckModalProps> = ({
  isOpen,
  onClose,
  currentTaskTitle = "Current priority task",
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [microAction, setMicroAction] = useState<string>("");
  const [timerSeconds, setTimerSeconds] = useState<number>(120); // 2 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  const reasons = [
    "Don't know where to start",
    "Don't understand the problem",
    "Scope feels too large",
    "Distracted or restless",
    "Frustrated with roadblocks",
    "Low energy",
    "Fear of doing it poorly",
  ];

  const handleSelectReason = (reason: string) => {
    setSelectedReason(reason);
    // Generate a concrete 2-minute micro-action
    let action = "";
    if (reason === "Don't know where to start") {
      action = `Open the code file or document and write a 2-bullet outline for "${currentTaskTitle}".`;
    } else if (reason === "Scope feels too large") {
      action = `Identify ONLY the very first 5-minute slice of "${currentTaskTitle}" and ignore everything else.`;
    } else if (reason === "Don't understand the problem") {
      action = "Write down the exact question or error in plain English in 2 sentences.";
    } else if (reason === "Low energy") {
      action = "Drink a large glass of water, stand up for 60 seconds, and commit to 2 minutes of typing.";
    } else if (reason === "Fear of doing it poorly") {
      action = "Give yourself full permission to write a deliberately ugly first draft for 2 minutes.";
    } else {
      action = `Spend 120 seconds doing the simplest physical movement required to begin "${currentTaskTitle}".`;
    }
    setMicroAction(action);
    setTimerSeconds(120);
    setIsTimerRunning(true);

    DataStoreRepository.saveStuckLog({
      id: `stuck-${Date.now()}`,
      userId: "user-demo-1",
      reason,
      smallestActionGenerated: action,
      timerDurationSeconds: 120,
      didResolve: false,
      createdAt: new Date().toISOString(),
    });
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleComplete = () => {
    setIsResolved(true);
    setTimeout(() => {
      onClose();
      setIsResolved(false);
      setSelectedReason("");
      setMicroAction("");
      setTimerSeconds(120);
      setIsTimerRunning(false);
    }, 1200);
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeStr = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="I'm Stuck — 2-Minute Reset"
      description="Resistance is just data. Shrink the action until momentum restarts."
      maxWidth="md"
    >
      {!microAction ? (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-surface-600 dark:text-surface-400">
            What is currently causing friction?
          </p>
          <div className="grid grid-cols-1 gap-2">
            {reasons.map((r) => (
              <button
                key={r}
                onClick={() => handleSelectReason(r)}
                className="w-full text-left px-3.5 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700/80 bg-surface-50 dark:bg-surface-800/60 hover:bg-brand-500/10 hover:border-brand-500/40 text-xs font-medium text-foreground transition-all flex items-center justify-between"
              >
                <span>{r}</span>
                <span className="text-[10px] text-surface-400">→</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5 text-center py-2">
          {/* Micro Action card */}
          <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold block mb-1">
              Your 2-Minute Starter Action
            </span>
            <p className="text-sm font-semibold text-foreground">
              {microAction}
            </p>
          </div>

          {/* Large 2-minute countdown */}
          <div className="py-2">
            <div className="font-mono text-5xl font-bold tracking-tight text-foreground">
              {timeStr}
            </div>
            <p className="text-xs text-surface-400 mt-1">
              Do nothing else. Just execute this 2-minute action.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
              <span>{isTimerRunning ? "Pause" : "Resume"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTimerSeconds(120);
                setIsTimerRunning(false);
              }}
            >
              <RotateCcw size={14} />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleComplete}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              <CheckCircle size={14} />
              <span>Momentum Restored</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
