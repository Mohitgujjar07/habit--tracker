"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataStoreRepository } from "@/repositories/dataStore";
import { DailyCheckin } from "@/types";
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Trophy,
  Target,
  Moon,
  AlertCircle,
  Play,
  RotateCcw,
  Send,
  Zap,
  Volume2,
} from "lucide-react";

interface VoiceCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCheckinModal: React.FC<VoiceCheckinModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordSeconds, setRecordSeconds] = useState(60);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Extracted Fields
  const [extractedEnergy, setExtractedEnergy] = useState<number>(7);
  const [extractedWin, setExtractedWin] = useState<string>("");
  const [extractedFriction, setExtractedFriction] = useState<string>("");
  const [extractedPriority, setExtractedPriority] = useState<string>("");
  const [extractedBedtime, setExtractedBedtime] = useState<string>("23:00");

  const recognitionRef = useRef<any>(null);

  // Check speech recognition capability
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setIsRecording(false);
      setTranscript("");
      setRecordSeconds(60);
      setHasProcessed(false);
      setIsSaved(false);
      setExtractedEnergy(7);
      setExtractedWin("");
      setExtractedFriction("");
      setExtractedPriority("");
      setExtractedBedtime("23:00");
    }
  }, [isOpen]);

  // 60-second countdown during recording
  useEffect(() => {
    let interval: any = null;
    if (isRecording && recordSeconds > 0) {
      interval = setInterval(() => {
        setRecordSeconds((prev) => prev - 1);
      }, 1000);
    } else if (recordSeconds === 0 && isRecording) {
      handleStopRecording();
    }
    return () => clearInterval(interval);
  }, [isRecording, recordSeconds]);

  // Start speech recognition
  const handleStartRecording = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + " ";
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setRecordSeconds(60);
    } catch (e) {
      console.error("Speech recognition error:", e);
      setIsRecording(false);
    }
  };

  // Stop recording & parse
  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    parseVoiceDebrief(transcript);
  };

  // Smart heuristic extractor
  const parseVoiceDebrief = (text: string) => {
    if (!text.trim()) {
      setHasProcessed(true);
      return;
    }

    const lower = text.toLowerCase();

    // 1. Detect Energy
    let detectedEnergy = 7;
    const energyMatch = lower.match(/(?:energy|feeling|mood)\s+(?:is|at|around)?\s*(\d{1,2})/);
    if (energyMatch && Number(energyMatch[1]) <= 10) {
      detectedEnergy = Number(energyMatch[1]);
    } else if (lower.includes("exhausted") || lower.includes("drained") || lower.includes("burnt out")) {
      detectedEnergy = 4;
    } else if (lower.includes("great") || lower.includes("energized") || lower.includes("fantastic")) {
      detectedEnergy = 9;
    }
    setExtractedEnergy(detectedEnergy);

    // 2. Detect Win
    let win = "";
    if (lower.includes("finished") || lower.includes("completed") || lower.includes("shipped") || lower.includes("built")) {
      const sentences = text.split(/[.!?]/);
      const winSentence = sentences.find((s) => {
        const sl = s.toLowerCase();
        return (
          sl.includes("finished") ||
          sl.includes("completed") ||
          sl.includes("shipped") ||
          sl.includes("built") ||
          sl.includes("workout")
        );
      });
      if (winSentence) win = winSentence.trim();
    }
    if (!win) {
      win = "Maintained daily consistency and made progress on key objectives.";
    }
    setExtractedWin(win);

    // 3. Detect Friction / Avoidance
    let friction = "";
    if (lower.includes("avoided") || lower.includes("stuck") || lower.includes("procrastinated") || lower.includes("difficult")) {
      const sentences = text.split(/[.!?]/);
      const frictionSentence = sentences.find((s) => {
        const sl = s.toLowerCase();
        return (
          sl.includes("avoided") ||
          sl.includes("stuck") ||
          sl.includes("procrastinated") ||
          sl.includes("distracted") ||
          sl.includes("difficult")
        );
      });
      if (frictionSentence) friction = frictionSentence.trim();
    }
    setExtractedFriction(friction || "Zero severe friction encountered.");

    // 4. Detect Tomorrow's Priority
    let priority = "";
    if (lower.includes("tomorrow") || lower.includes("next")) {
      const sentences = text.split(/[.!?]/);
      const prioritySentence = sentences.find((s) => {
        const sl = s.toLowerCase();
        return (
          sl.includes("tomorrow") ||
          sl.includes("next action") ||
          sl.includes("first thing")
        );
      });
      if (prioritySentence) {
        priority = prioritySentence
          .replace(/tomorrow\s*(i need to|i will|priority is|i'm going to)?/i, "")
          .trim();
      }
    }
    if (!priority) {
      priority = "Execute morning 90-minute focus block on core project milestone.";
    }
    setExtractedPriority(priority);

    // 5. Detect Bedtime
    const bedMatch = lower.match(/(?:sleep|bed|lights out)\s*(?:at|by)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/);
    if (bedMatch) {
      setExtractedBedtime(bedMatch[1]);
    } else {
      setExtractedBedtime("23:00");
    }

    setHasProcessed(true);
  };

  const handleSaveCheckin = () => {
    const today = new Date().toISOString().split("T")[0];
    const checkin: DailyCheckin = {
      id: `chk-${Date.now()}`,
      userId: "user-demo-1",
      date: today,
      type: "evening",
      energyLevel: extractedEnergy,
      moodLevel: extractedEnergy,
      audioTranscript: transcript.trim() || undefined,
      extractedWin: extractedWin.trim() || undefined,
      wentWell: extractedWin.trim() || undefined,
      wasDifficult: extractedFriction.trim() || undefined,
      tomorrowPriorityAction: extractedPriority.trim() || undefined,
      bedtimeIntention: extractedBedtime.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    DataStoreRepository.saveDailyCheckin(checkin);
    setIsSaved(true);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="60-Second Evening Voice Debrief"
      description="Speak freely about your day. comeback.mjg extracts wins, friction, energy, and tomorrow's priority."
      maxWidth="lg"
    >
      {isSaved ? (
        <div className="p-8 text-center space-y-3 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Day Intentionally Closed!
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Your win is recorded in the Wins Log, and tomorrow's #1 priority
            action is already waiting in your execution pipeline. Sleep well.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Audio Recording / Speech Area */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-orange-50/60 to-white border border-orange-200/80 text-center space-y-4 shadow-xs">
            {/* Visualizer & Mic Button */}
            <div className="relative flex items-center justify-center min-h-[120px]">
              {isRecording && (
                <>
                  <div className="absolute w-28 h-28 rounded-full bg-orange-400/20 animate-ping" />
                  <div className="absolute w-24 h-24 rounded-full bg-orange-500/20 animate-pulse" />
                </>
              )}

              <button
                type="button"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                  isRecording
                    ? "bg-rose-600 text-white shadow-rose-500/30 animate-pulse ring-4 ring-rose-200"
                    : "bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/30 hover:scale-105"
                }`}
                title={isRecording ? "Stop Recording" : "Start 60s Voice Memo"}
              >
                {isRecording ? <MicOff size={30} /> : <Mic size={30} />}
              </button>
            </div>

            {/* Timer & Instructions */}
            <div>
              <div className="font-mono text-xl font-black text-slate-900">
                {isRecording ? `00:${recordSeconds < 10 ? "0" : ""}${recordSeconds}` : "60-Second Voice Memo"}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {isRecording
                  ? "Listening... Speak naturally about what you did, what was hard, and tomorrow's priority."
                  : "Tap the microphone to speak, or type directly into the transcript box below."}
              </p>
            </div>

            {!isSpeechSupported && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-center gap-2">
                <AlertCircle size={14} />
                <span>Speech recognition not supported in this browser. You can type directly below!</span>
              </div>
            )}
          </div>

          {/* Live Transcript / Manual Input Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 size={13} className="text-orange-500" />
                <span>Transcript / Day Notes</span>
              </label>
              {transcript && (
                <button
                  type="button"
                  onClick={() => parseVoiceDebrief(transcript)}
                  className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles size={12} /> Re-extract Insights
                </button>
              )}
            </div>
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g. Finished the database migration, workout was solid. Avoided writing documentation because I was exhausted. Tomorrow morning I must finish the docs before 10 AM. Energy is 6/10, sleep at 11 PM..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800"
            />
          </div>

          {/* Extracted Structured Data Cards */}
          {(hasProcessed || transcript.trim().length > 10) && (
            <div className="space-y-3.5 pt-2 border-t border-slate-200 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-orange-500" />
                  <span>AI Extracted Behavioral Summary (Editable)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Ready to lock in
                </span>
              </div>

              {/* Energy Level Slider */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-500" /> Daily Energy Score
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {extractedEnergy} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={extractedEnergy}
                  onChange={(e) => setExtractedEnergy(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Key Win Input */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Trophy size={14} className="text-emerald-600" /> Today's Primary Win
                </label>
                <input
                  type="text"
                  value={extractedWin}
                  onChange={(e) => setExtractedWin(e.target.value)}
                  placeholder="What was the main victory today?"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tomorrow's #1 Priority Task */}
              <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/90">
                <label className="text-xs font-bold text-orange-950 block mb-1 flex items-center gap-1.5">
                  <Target size={14} className="text-orange-600" /> Tomorrow's #1 Priority Task
                </label>
                <input
                  type="text"
                  value={extractedPriority}
                  onChange={(e) => setExtractedPriority(e.target.value)}
                  placeholder="What must be completed first thing tomorrow?"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-orange-200 bg-white text-slate-900 font-semibold focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-orange-700 font-medium block mt-1">
                  ⚡ This will be automatically placed at the top of your Next Action queue tomorrow morning.
                </span>
              </div>

              {/* Friction & Bedtime in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Friction or Avoidance Noted
                  </label>
                  <input
                    type="text"
                    value={extractedFriction}
                    onChange={(e) => setExtractedFriction(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <Moon size={13} className="text-indigo-500" /> Target Bedtime
                  </label>
                  <input
                    type="text"
                    value={extractedBedtime}
                    onChange={(e) => setExtractedBedtime(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleSaveCheckin}
                className="w-full py-3.5 shadow-md shadow-orange-500/20 text-sm font-bold bg-orange-600 hover:bg-orange-500"
              >
                <CheckCircle2 size={18} />
                <span>Save & Lock In Tomorrow</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
