"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { soundService } from "@/services/soundService";
import { ImStuckModal } from "@/components/modals/ImStuckModal";
import { Task } from "@/types";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  LifeBuoy,
  AlertCircle,
  CheckCircle,
  Star,
} from "lucide-react";

export const FocusStudio: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTaskId = searchParams.get("taskId") || "";
  const initialTitle = searchParams.get("taskTitle") || "Core Deep Work Block";
  const initialDuration = Number(searchParams.get("duration") || 45);

  const [taskTitle, setTaskTitle] = useState(initialTitle);
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const [secondsRemaining, setSecondsRemaining] = useState(initialDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimalMode, setIsMinimalMode] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isStuckOpen, setIsStuckOpen] = useState(false);

  // Distraction & completion states
  const [distractionCount, setDistractionCount] = useState(0);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [focusRating, setFocusRating] = useState(5);
  const [outputSummary, setOutputSummary] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskId);

  useEffect(() => {
    setTasks(DataStoreRepository.getTasks());
  }, []);

  const handleSelectPresetDuration = (mins: number) => {
    if (isRunning) return;
    setSelectedDuration(mins);
    setSecondsRemaining(mins * 60);
  };

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      soundService.playCompletionChime();
      setIsCompletionModalOpen(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(selectedDuration * 60);
  };

  const toggleAmbientSound = () => {
    const newState = soundService.toggleAmbientNoise(!isAmbientPlaying);
    setIsAmbientPlaying(newState);
  };

  const handleLogDistraction = () => {
    setDistractionCount((prev) => prev + 1);
    DataStoreRepository.saveDistraction({
      id: `dist-${Date.now()}`,
      userId: "user-demo-1",
      taskId: selectedTaskId || undefined,
      timestamp: new Date().toISOString(),
      trigger: "Avoiding work",
      notes: `Logged during focus session on "${taskTitle}"`,
      createdAt: new Date().toISOString(),
    });
  };

  const handleFinishEarly = () => {
    setIsRunning(false);
    soundService.playCompletionChime();
    setIsCompletionModalOpen(true);
  };

  const handleSaveCompletedSession = () => {
    const totalMinutes = selectedDuration;
    const elapsedMinutes = Math.max(1, Math.round((selectedDuration * 60 - secondsRemaining) / 60));

    DataStoreRepository.saveFocusSession({
      id: `focus-${Date.now()}`,
      userId: "user-demo-1",
      taskId: selectedTaskId || undefined,
      taskTitle: taskTitle.trim() || "Deep Work Block",
      durationMinutes: totalMinutes,
      actualMinutes: elapsedMinutes,
      focusRating,
      outputSummary: outputSummary.trim() || "Completed dedicated focus block",
      distractionsCount: distractionCount,
      wasStuck: false,
      status: "completed",
      startedAt: new Date(Date.now() - elapsedMinutes * 60000).toISOString(),
      completedAt: new Date().toISOString(),
    });

    if (selectedTaskId) {
      const task = tasks.find((t) => t.id === selectedTaskId);
      if (task) {
        task.status = "completed";
        task.completedAt = new Date().toISOString();
        task.actualMinutesSpent = (task.actualMinutesSpent || 0) + elapsedMinutes;
        DataStoreRepository.saveTask(task);
      }
    }

    DataStoreRepository.saveIdentityEvidence({
      id: `ev-${Date.now()}`,
      userId: "user-demo-1",
      identityStatement: "I finish what I start.",
      evidenceAction: `Completed ${elapsedMinutes}m focus session: "${taskTitle}"`,
      timestamp: new Date().toISOString(),
    });

    if (isAmbientPlaying) {
      soundService.toggleAmbientNoise(false);
      setIsAmbientPlaying(false);
    }

    setIsCompletionModalOpen(false);
    router.push("/dashboard");
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  const progressPercent = Math.round(
    ((selectedDuration * 60 - secondsRemaining) / (selectedDuration * 60)) * 100
  );

  return (
    <div
      className={`min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 transition-all ${
        isMinimalMode
          ? "fixed inset-0 z-50 bg-slate-50 text-slate-900"
          : "relative"
      }`}
    >
      <div className="w-full max-w-xl space-y-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between">
          <Badge variant="brand" size="md">
            FOCUS ENGINE • {isRunning ? "IN SESSION" : "PAUSED"}
          </Badge>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAmbientSound}
              className={`p-2 rounded-xl border transition-colors ${
                isAmbientPlaying
                  ? "bg-orange-50 border-orange-300 text-orange-600 shadow-xs"
                  : "border-slate-200 bg-white text-slate-400 hover:text-slate-800"
              }`}
              title="Toggle Brown Noise for cognitive isolation"
            >
              {isAmbientPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={() => setIsMinimalMode(!isMinimalMode)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-800 transition-colors shadow-xs"
              title="Toggle Zero-Distraction Minimal Mode"
            >
              {isMinimalMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* Task Input / Selector */}
        {(!isMinimalMode || !isRunning) && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              What are you focusing on right now?
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Implement webhook receiver tests"
              className="w-full px-4 py-2.5 text-sm font-semibold rounded-2xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
            />
          </div>
        )}

        {/* Main Focus Card with Big Timer */}
        <Card className="text-center py-10 px-6 sm:px-12 border-slate-200/90 shadow-card relative overflow-hidden bg-white">
          {/* Subtle Progress Bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />

          <div className="space-y-6">
            {/* Presets */}
            {!isRunning && (
              <div className="flex items-center justify-center gap-2">
                {[25, 45, 50, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSelectPresetDuration(mins)}
                    className={`px-3.5 py-1 text-xs rounded-xl font-mono font-bold transition-all ${
                      selectedDuration === mins
                        ? "bg-orange-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            )}

            {/* Huge Clock in Deep Slate */}
            <div className="font-mono text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-900 select-none">
              {timeFormatted}
            </div>

            <p className="text-xs text-slate-500 font-semibold tracking-wide">
              {taskTitle || "Unscheduled Focus Block"}
            </p>

            {/* Primary Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant={isRunning ? "secondary" : "primary"}
                size="lg"
                onClick={toggleTimer}
                className="gap-2 px-8 text-base shadow-md shadow-orange-500/10"
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{isRunning ? "Pause" : "Start Focus"}</span>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleReset}
                title="Reset timer"
              >
                <RotateCcw size={16} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Emergency Interventions Strip */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={() => setIsStuckOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all active:scale-95 shadow-xs"
          >
            <LifeBuoy size={14} className="text-rose-600" />
            <span>I'm Stuck</span>
          </button>

          <button
            onClick={handleLogDistraction}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs"
          >
            <AlertCircle size={14} className="text-amber-500" />
            <span>I Want To Distract Myself ({distractionCount})</span>
          </button>

          <Button
            variant="subtle"
            size="sm"
            onClick={handleFinishEarly}
            className="text-xs"
          >
            Finish Early
          </Button>
        </div>
      </div>

      {/* I'M STUCK MODAL */}
      <ImStuckModal
        isOpen={isStuckOpen}
        onClose={() => setIsStuckOpen(false)}
        currentTaskTitle={taskTitle}
      />

      {/* SESSION COMPLETION REVIEW MODAL */}
      {isCompletionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-1 border border-emerald-200">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Session Complete</h3>
              <p className="text-xs text-slate-500">
                Record your real output to add evidence toward your transformation.
              </p>
            </div>

            {/* Focus Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                Focus Quality Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFocusRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      size={24}
                      className={
                        focusRating >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Output Summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What tangible output did you produce?
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Wrote 3 unit tests, resolved CORS issue in API..."
                value={outputSummary}
                onChange={(e) => setOutputSummary(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
              />
            </div>

            {/* Evidence Notice */}
            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-[11px] text-orange-800 font-medium">
              <span className="font-bold block">Evidence Added:</span>
              "I finish what I start."
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleSaveCompletedSession}
              className="w-full bg-emerald-600 hover:bg-emerald-500"
            >
              Record Session & Return to OS
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
