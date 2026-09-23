"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataStoreRepository } from "@/repositories/dataStore";
import { UrgeSurfingLog } from "@/types";
import {
  Waves,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
  Smartphone,
  Clock,
  Pizza,
  Cigarette,
  ShoppingBag,
  Zap,
  Plus,
} from "lucide-react";

interface UrgeSurferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TriggerCategory = UrgeSurfingLog["triggerCategory"];

const TRIGGER_OPTIONS: {
  category: TriggerCategory;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}[] = [
  {
    category: "Phone / Social Media",
    label: "Phone / Doomscroll",
    icon: Smartphone,
    description: "Checking notifications, feeds, or short-form video",
  },
  {
    category: "Procrastination",
    label: "Procrastination",
    icon: Clock,
    description: "Avoiding a hard task or fear of starting",
  },
  {
    category: "Junk Food / Sugar",
    label: "Junk Food / Sugar",
    icon: Pizza,
    description: "Stress snacking or mindless sugar craving",
  },
  {
    category: "Nicotine / Vaping",
    label: "Nicotine / Vaping",
    icon: Cigarette,
    description: "Chemical impulse or stress relief habit",
  },
  {
    category: "Impulsive Shopping",
    label: "Impulse Shopping",
    icon: ShoppingBag,
    description: "Buying things for temporary dopamine",
  },
  {
    category: "Other",
    label: "Other Distraction",
    icon: Zap,
    description: "Restlessness or sudden compulsive impulse",
  },
];

const REPLACEMENT_ACTIONS = [
  { id: "water", label: "Drink 500ml cold water", icon: "💧" },
  { id: "pushups", label: "10 pushups / squats / stretch", icon: "💪" },
  { id: "sprint", label: "Start 15-min focus sprint", icon: "⚡" },
  { id: "walk", label: "Step outside / 2-min walk", icon: "🚶" },
  { id: "journal", label: "Write 3 lines in Lesson Log", icon: "✍️" },
];

const GROUNDING_MANTRAS = [
  "A craving is neurochemistry, not a command. It crests and falls like an ocean wave.",
  "You do not have to obey this feeling. You are the sovereign observer, not the impulse.",
  "Physiological sighs instantly dump carbon dioxide and trigger the parasympathetic brake.",
  "Every time you surf an urge without yielding, your prefrontal cortex strengthens.",
  "The urgency you feel is an illusion manufactured by dopamine. Breathe deep.",
  "Discomfort is just the feeling of your future self taking control.",
];

export const UrgeSurferModal: React.FC<UrgeSurferModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Step 1: Setup, Step 2: Surfing (90s breath), Step 3: Victory & Replacement
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedTrigger, setSelectedTrigger] =
    useState<TriggerCategory>("Phone / Social Media");
  const [initialIntensity, setInitialIntensity] = useState<number>(7);
  const [finalIntensity, setFinalIntensity] = useState<number>(2);
  const [selectedReplacement, setSelectedReplacement] = useState<string>(
    REPLACEMENT_ACTIONS[0].label
  );
  const [customAction, setCustomAction] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSuccessSaved, setIsSuccessSaved] = useState<boolean>(false);

  // Timer & Breathing State (90 seconds default)
  const [timerSeconds, setTimerSeconds] = useState<number>(90);
  const [totalDuration, setTotalDuration] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [mantraIndex, setMantraIndex] = useState<number>(0);

  // Physiological sigh rhythm: 4s deep inhale + 1s top-off inhale + 6s slow exhale = 11s total cycle
  const [cycleTime, setCycleTime] = useState<number>(0);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTimerSeconds(90);
      setTotalDuration(90);
      setIsTimerRunning(false);
      setCycleTime(0);
      setIsSuccessSaved(false);
      setInitialIntensity(7);
      setFinalIntensity(2);
      setCustomAction("");
      setNotes("");
    }
  }, [isOpen]);

  // Timer interval & physiological sigh cycle
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
        setCycleTime((prev) => (prev + 1) % 11);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Auto advance to step 3 when timer hits zero
      setStep(3);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Rotate mantras every 15 seconds
  useEffect(() => {
    if (isTimerRunning) {
      const mantraInterval = setInterval(() => {
        setMantraIndex((prev) => (prev + 1) % GROUNDING_MANTRAS.length);
      }, 15000);
      return () => clearInterval(mantraInterval);
    }
  }, [isTimerRunning]);

  // Determine breathing phase
  // 0 - 3s (4 sec): Inhale 1
  // 4s (1 sec): Inhale 2 (top off)
  // 5 - 10s (6 sec): Exhale
  const breathPhase = useMemo(() => {
    if (cycleTime < 4) {
      return {
        label: "Deep Inhale (Nose)",
        instruction: "Expand belly & ribs smoothly",
        scale: "scale-125",
        color: "bg-orange-500 shadow-orange-300 shadow-2xl",
        textCol: "text-orange-600",
        secondsLeft: 4 - cycleTime,
      };
    } else if (cycleTime === 4) {
      return {
        label: "Top-Off Inhale",
        instruction: "Quick extra sip of air through nose",
        scale: "scale-140",
        color: "bg-amber-400 shadow-amber-300 shadow-2xl",
        textCol: "text-amber-600",
        secondsLeft: 1,
      };
    } else {
      return {
        label: "Slow Exhale (Mouth)",
        instruction: "Release gently through parted lips",
        scale: "scale-90",
        color: "bg-teal-500 shadow-teal-300 shadow-xl",
        textCol: "text-teal-600",
        secondsLeft: 11 - cycleTime,
      };
    }
  }, [cycleTime]);

  const handleStartSurfing = () => {
    setStep(2);
    setTimerSeconds(90);
    setTotalDuration(90);
    setCycleTime(0);
    setIsTimerRunning(true);
  };

  const handleSurfedEarly = () => {
    setIsTimerRunning(false);
    setStep(3);
  };

  const handleAdd30Seconds = () => {
    setTimerSeconds((prev) => prev + 30);
    setTotalDuration((prev) => prev + 30);
  };

  const handleSaveVictory = () => {
    const actionTaken = customAction.trim() || selectedReplacement;
    const finalLog: UrgeSurfingLog = {
      id: `urge-${Date.now()}`,
      userId: "user-demo-1",
      timestamp: new Date().toISOString(),
      triggerCategory: selectedTrigger,
      intensityInitial: initialIntensity,
      intensityFinal: finalIntensity,
      durationSeconds: Math.max(30, totalDuration - timerSeconds),
      replacementActionTaken: actionTaken,
      surfedSuccessfully: true,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    DataStoreRepository.saveUrgeLog(finalLog);
    setIsSuccessSaved(true);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const intensityDelta = initialIntensity - finalIntensity;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Urge Surfer — Dopamine Reset"
      description="Neuroscience-backed 90-second protocol to surf craving waves and rewire compulsive triggers."
      maxWidth="lg"
    >
      {/* Step Indicators */}
      <div className="flex items-center justify-between gap-2 mb-6 px-1">
        <div
          className={`flex-1 h-1.5 rounded-full transition-all ${
            step >= 1 ? "bg-orange-500" : "bg-slate-200"
          }`}
        />
        <div
          className={`flex-1 h-1.5 rounded-full transition-all ${
            step >= 2 ? "bg-orange-500" : "bg-slate-200"
          }`}
        />
        <div
          className={`flex-1 h-1.5 rounded-full transition-all ${
            step >= 3 ? "bg-emerald-500" : "bg-slate-200"
          }`}
        />
      </div>

      {/* STEP 1: IDENTIFY & RATE */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              1. What urge are you experiencing right now?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TRIGGER_OPTIONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedTrigger === item.category;
                return (
                  <button
                    key={item.category}
                    type="button"
                    onClick={() => setSelectedTrigger(item.category)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/80 shadow-xs ring-1 ring-orange-400"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected
                            ? "bg-orange-500 text-white"
                            : "bg-white text-slate-600 border border-slate-200"
                        }`}
                      >
                        <IconComponent size={16} />
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold ${
                          isSelected ? "text-orange-950" : "text-slate-900"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Initial Urge Intensity (1–10)
              </label>
              <span className="font-mono text-sm font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                {initialIntensity} / 10{" "}
                <span className="text-xs font-normal text-slate-500">
                  {initialIntensity <= 3
                    ? "• Mild"
                    : initialIntensity <= 6
                    ? "• Strong"
                    : initialIntensity <= 8
                    ? "• Urgent"
                    : "• Overwhelming"}
                </span>
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={initialIntensity}
              onChange={(e) => setInitialIntensity(Number(e.target.value))}
              className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
              <span>1 (Mild pull)</span>
              <span>5 (Moderate)</span>
              <span>10 (Blinding impulse)</span>
            </div>
          </div>

          {/* Neuroscience insight callout */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
            <Flame className="text-amber-600 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              A neurochemical craving lasts an average of{" "}
              <strong>90 seconds</strong> before dopamine receptors adapt. If
              you ride out the wave with physiological sigh breathing, the urge
              collapses naturally.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full py-3.5 shadow-md shadow-orange-500/20 text-sm font-bold bg-orange-600 hover:bg-orange-500"
            onClick={handleStartSurfing}
          >
            <Waves size={18} />
            <span>Begin 90-Second Physiological Sigh</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* STEP 2: 90-SECOND PHYSIOLOGICAL SIGH & WAVE SURFER */}
      {step === 2 && (
        <div className="space-y-6 text-center py-2">
          {/* Top header stats */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-500">
            <span className="font-semibold text-slate-700">
              Surfing:{" "}
              <strong className="text-orange-600">{selectedTrigger}</strong>
            </span>
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
              Initial Intensity: {initialIntensity}/10
            </span>
          </div>

          {/* Central Animated Breathing Visualizer */}
          <div className="relative flex flex-col items-center justify-center py-6 min-h-[260px]">
            {/* Pulsing halo */}
            <div
              className={`absolute w-44 h-44 rounded-full transition-transform duration-1000 ease-in-out opacity-20 ${breathPhase.color} ${breathPhase.scale}`}
            />
            <div
              className={`absolute w-36 h-36 rounded-full transition-transform duration-1000 ease-in-out opacity-40 ${breathPhase.color} ${breathPhase.scale}`}
            />

            {/* Core breathing sphere */}
            <div
              className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 ease-in-out ${breathPhase.color} ${breathPhase.scale}`}
            >
              <Waves size={24} className="animate-pulse opacity-90 mb-1" />
              <span className="text-[11px] font-mono font-bold tracking-wider">
                {breathPhase.secondsLeft}s
              </span>
            </div>

            {/* Phase Instructions */}
            <div className="mt-8 z-10">
              <span
                className={`text-sm font-extrabold uppercase tracking-wider block ${breathPhase.textCol} transition-colors`}
              >
                {breathPhase.label}
              </span>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {breathPhase.instruction}
              </p>
            </div>
          </div>

          {/* Big Countdown Timer */}
          <div>
            <div className="font-mono text-5xl font-black tracking-tight text-slate-900">
              {timeFormatted}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Double inhale through nose, extended slow exhale through mouth
            </p>
          </div>

          {/* Rotating Neuroscience Mantra */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-left flex items-start gap-2.5">
            <Sparkles className="text-orange-500 shrink-0 mt-0.5" size={15} />
            <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
              "{GROUNDING_MANTRAS[mantraIndex]}"
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
              onClick={handleAdd30Seconds}
              title="Add 30 seconds"
            >
              <Plus size={14} />
              <span>+30s</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTimerSeconds(90);
                setCycleTime(0);
                setIsTimerRunning(true);
              }}
              title="Restart 90s timer"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSurfedEarly}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              <CheckCircle2 size={14} />
              <span>Urge Subsided</span>
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: CELEBRATE VICTORY & CHANNEL DOPAMINE */}
      {step === 3 && (
        <div className="space-y-6">
          {isSuccessSaved ? (
            <div className="p-8 text-center space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Victory Recorded in Evidence Bank!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                You proved your prefrontal control over an immediate impulse.
                Your dopamine neurochemistry has been successfully reset.
              </p>
            </div>
          ) : (
            <>
              {/* Victory Header Card */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800 flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-500 text-white shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Wave Surfed Successfully
                  </h4>
                  <p className="text-xs text-emerald-950 font-medium mt-0.5">
                    You held the line for 90 seconds without yielding to the
                    craving.
                  </p>
                </div>
              </div>

              {/* Final Intensity Rating */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    How intense is the craving now? (1–10)
                  </label>
                  <span className="font-mono text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {finalIntensity} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={finalIntensity}
                  onChange={(e) => setFinalIntensity(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between items-center text-[11px] mt-1.5 font-semibold text-slate-500">
                  <span>1 (Virtually gone)</span>
                  {intensityDelta > 0 && (
                    <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-bold">
                      ↓ Dropped {intensityDelta} pts (
                      {Math.round((intensityDelta / initialIntensity) * 100)}%
                      drop)
                    </span>
                  )}
                  <span>10 (Still lingering)</span>
                </div>
              </div>

              {/* Replacement Action */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Channel your momentum into a replacement action:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {REPLACEMENT_ACTIONS.map((item) => {
                    const isSelected = selectedReplacement === item.label;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedReplacement(item.label)}
                        className={`px-3 py-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-400"
                            : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-700"
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Or enter custom replacement action..."
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Optional brief notes */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Self-Reflection Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Triggered by boredom during code review. Breathing cleared the fog."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 resize-none"
                />
              </div>

              {/* Save Victory Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full py-3.5 shadow-md shadow-emerald-500/20 text-sm font-bold bg-emerald-600 hover:bg-emerald-500"
                onClick={handleSaveVictory}
              >
                <ShieldCheck size={18} />
                <span>Log Victory to Identity Evidence Bank</span>
              </Button>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};
