"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import {
  UserProfile,
  OccupationType,
  FreeTimeSlot,
  CoachingStyle,
  AccountabilityStyle,
} from "@/types";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  Brain,
  Clock,
  Shield,
  Smartphone,
} from "lucide-react";

export const OnboardingWizard: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [preferredName, setPreferredName] = useState("Alex");
  const [fullName, setFullName] = useState("");
  const [ageRange, setAgeRange] = useState("25–34");
  const [country, setCountry] = useState("United States");
  const [timezone, setTimezone] = useState(
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
      : "UTC"
  );
  const [occupation, setOccupation] = useState<OccupationType>("entrepreneur");
  const [occupationDetail, setOccupationDetail] = useState(
    "Building full-stack software and improving execution momentum."
  );
  const [freeTime, setFreeTime] = useState<FreeTimeSlot>("2–4 hours");
  const [weekdayRoutine, setWeekdayRoutine] = useState("Work from 9-6 with evening workouts.");
  const [weekendRoutine, setWeekendRoutine] = useState("Reading, side-projects, and outdoors.");
  const [responsibilities, setResponsibilities] = useState("Product delivery and technical consistency.");

  // Life areas
  const allLifeAreas = [
    "Focus", "Projects", "Consistency", "Digital habits", "Sleep",
    "Fitness", "Mind", "Learning", "Career", "Nutrition", "Discipline",
    "Confidence", "Money", "Social life",
  ];
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    "Focus", "Projects", "Consistency", "Digital habits",
  ]);
  const [priorityAreas, setPriorityAreas] = useState<string[]>([
    "Focus", "Projects", "Consistency",
  ]);

  // Bottlenecks
  const allProblems = [
    "Procrastination", "Phone overuse", "Social media", "Short-form content",
    "Poor sleep", "Inconsistent routine", "Difficulty focusing",
    "Starting but not finishing", "Overplanning", "Constantly changing goals",
    "Fear of failure", "Perfectionism", "Getting overwhelmed", "Low consistency",
  ];
  const [selectedProblems, setSelectedProblems] = useState<string[]>([
    "Fear of failure",
    "Starting but not finishing",
    "Phone overuse",
  ]);
  const [primaryBottleneck, setPrimaryBottleneck] = useState("Fear of failure");
  const [secondaryBottlenecks, setSecondaryBottlenecks] = useState<string[]>([
    "Phone overuse", "Starting but not finishing",
  ]);

  const toggleProblem = (prob: string) => {
    if (selectedProblems.includes(prob)) {
      const next = selectedProblems.filter((p) => p !== prob);
      setSelectedProblems(next);
      if (primaryBottleneck === prob) {
        setPrimaryBottleneck(next[0] || "");
      }
    } else {
      const next = [...selectedProblems, prob];
      setSelectedProblems(next);
      if (!primaryBottleneck) {
        setPrimaryBottleneck(prob);
      }
    }
  };

  const handleToggleAllProblems = () => {
    if (selectedProblems.length === allProblems.length) {
      setSelectedProblems([]);
      setPrimaryBottleneck("");
    } else {
      setSelectedProblems([...allProblems]);
      if (!primaryBottleneck) {
        setPrimaryBottleneck(allProblems[0]);
      }
    }
  };

  // Behavioral Profile
  const [onImportantTask, setOnImportantTask] = useState("I plan too much.");
  const [onDifficultTask, setOnDifficultTask] = useState("I search for tutorials.");
  const [onMissedDay, setOnMissedDay] = useState("I restart the next day.");
  const [primaryNeed, setPrimaryNeed] = useState("Need visible progress");

  // Digital
  const [screenTime, setScreenTime] = useState("4–6");
  const [distractingApps, setDistractingApps] = useState("YouTube, Twitter/X, Discord");
  const [distractionTriggers, setDistractionTriggers] = useState<string[]>(["Bored", "Avoiding work"]);

  // Routine
  const [typicalWake, setTypicalWake] = useState("07:00");
  const [desiredWake, setDesiredWake] = useState("06:30");
  const [typicalSleep, setTypicalSleep] = useState("23:45");
  const [desiredSleep, setDesiredSleep] = useState("23:00");

  // Energy
  const [energeticWindow, setEnergeticWindow] = useState("Morning");
  const [tiredWindow, setTiredWindow] = useState("Afternoon");
  const [hardestWorkWindow, setHardestWorkWindow] = useState("Early morning");

  // Branch Profile
  const [devLangs, setDevLangs] = useState("TypeScript, React, Node.js, Python");
  const [studentCourse, setStudentCourse] = useState("Computer Science");
  const [businessIdea, setBusinessIdea] = useState("B2B SaaS Developer Analytics");

  // Strategic Multi-Horizon Goals
  const [northStarVision, setNorthStarVision] = useState("Build a profitable, high-impact venture with complete location and financial autonomy.");
  const [goalBuild, setGoalBuild] = useState("Launch SaaS MVP to first 5 pilots.");
  const [goalBecome, setGoalBecome] = useState("A consistent builder who ships without friction.");
  const [goalStop, setGoalStop] = useState("Passive social media browsing during morning hours.");

  // Success Definition & Coaching
  const [successDef, setSuccessDef] = useState(
    "Having a live product tested by real users, having logged 80+ deep work blocks, and having zero guilt about how I spend my days."
  );
  const [coachStyle, setCoachStyle] = useState<CoachingStyle>("BALANCED");
  const [accountabilityStyle, setAccountabilityStyle] = useState<AccountabilityStyle>("Recovery plan");
  const [dislikedPatterns, setDislikedPatterns] = useState<string[]>([
    "Motivational quotes", "Streak pressure", "Overloaded dashboards",
  ]);

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinishOnboarding = () => {
    const profile: UserProfile = {
      id: "user-demo-1",
      userId: "user-demo-1",
      preferredName: preferredName.trim() || "User",
      fullName: fullName.trim() || undefined,
      ageRange,
      country,
      timezone,
      occupation,
      currentOccupationDetail: occupationDetail,
      weekdayRoutine,
      weekendRoutine,
      freeTimeDaily: freeTime,
      responsibilities,
      selectedLifeAreas: selectedAreas,
      priorityLifeAreas: priorityAreas,
      primaryBottleneck: primaryBottleneck || selectedProblems[0] || "Procrastination",
      secondaryBottlenecks: selectedProblems.filter(
        (p) => p !== (primaryBottleneck || selectedProblems[0])
      ),
      behaviorProfile: {
        onImportantTask,
        onDifficultTask,
        onMissedRoutineDay: onMissedDay,
        primaryNeed,
      },
      digitalProfile: {
        screenTimeHours: screenTime,
        consumingActivities: ["Short-form content", "YouTube"],
        distractingApps: distractingApps.split(",").map((s) => s.trim()),
        distractionTimes: ["Afternoon", "When tired"],
        distractionTriggers,
      },
      routine: {
        typicalWake,
        desiredWake,
        typicalSleep,
        desiredSleep,
        workStart: "09:00",
        workEnd: "18:00",
        commuteTime: "0",
        exerciseAvailability: "Late afternoon",
        preferredWorkHours: "Morning",
      },
      energyProfile: {
        energeticWindow,
        tiredWindow,
        hardestWorkWindow,
      },
      developerProfile: occupation === "entrepreneur" || occupation === "employee" ? {
        languages: devLangs.split(",").map((s) => s.trim()),
      } : undefined,
      goals90Days: [
        { category: "BUILD", text: goalBuild },
        { category: "BECOME", text: goalBecome },
        { category: "STOP", text: goalStop },
      ],
      personalDefinitionOfSuccess: successDef,
      coachStyle,
      dislikedExperiencePatterns: dislikedPatterns,
      accountabilityStyle,
      northStarVision: northStarVision.trim() || undefined,
      transformationPhase: "Perpetual Execution • Horizon I",
      onboardingCompleted: true,
      onboardingStep: 10,
      transformationDay: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStoreRepository.saveUserProfile(profile);

    // Also populate multi-horizon goals for instant momentum
    if (goalBuild.trim()) {
      DataStoreRepository.saveGoal({
        id: `goal-build-${Date.now()}`,
        userId: "user-demo-1",
        title: goalBuild.trim(),
        description: "Tactical deliverable and execution milestone",
        why: successDef,
        category: "BUILD",
        priority: "critical",
        horizon: "90_days",
        targetDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
        progressPercent: 15,
        status: "active",
        milestones: ["Phase 1 architecture", "Core build execution", "Public launch / review"],
        projectIds: [],
        habitIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    if (goalBecome.trim()) {
      DataStoreRepository.saveGoal({
        id: `goal-become-${Date.now()}`,
        userId: "user-demo-1",
        title: goalBecome.trim(),
        description: "Identity transformation and cognitive habit conditioning",
        why: "Identity precedes behavior; behavior precedes outcomes",
        category: "BECOME",
        priority: "high",
        horizon: "30_days",
        targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        progressPercent: 20,
        status: "active",
        milestones: ["First 7 consecutive days", "14-day consistency checkpoint", "Habit automaticity achieved"],
        projectIds: [],
        habitIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Brand Icon Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-brand-200">
          <img src="/logo.png" alt="comeback.mjg" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-foreground block leading-tight">comeback.mjg</span>
          <span className="text-[10px] text-brand-600 font-semibold uppercase tracking-wider block">A Better You. Everyday.</span>
        </div>
      </div>

      {/* Progress header */}
      <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-brand-600 uppercase tracking-widest font-bold">
            Personal OS Setup
          </span>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Step {step} of 10</h2>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i + 1 === step
                  ? "w-8 bg-brand-500"
                  : i + 1 < step
                  ? "w-3 bg-brand-500/40"
                  : "w-3 bg-surface-200"
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="w-full max-w-2xl p-6 sm:p-8 shadow-sm border-surface-200/80 bg-white">
        {/* STEP 1: Basic Profile */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-foreground">Welcome. Let's get to know you.</h3>
              <p className="text-xs text-surface-500 mt-1">
                The more accurately you answer, the better your OS adapts. You can update this anytime.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Preferred Name</label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 bg-surface-50 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Occupation</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 bg-surface-50 text-foreground focus:outline-none"
                >
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="employee">Employee</option>
                  <option value="student">Student</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="job_seeker">Job Seeker</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">
                What are you currently building or doing?
              </label>
              <input
                type="text"
                value={occupationDetail}
                onChange={(e) => setOccupationDetail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 bg-surface-50 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">
                Genuinely free time on a normal weekday?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(["<30 minutes", "30–60 minutes", "1–2 hours", "2–4 hours", "4+ hours"] as FreeTimeSlot[]).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFreeTime(slot)}
                    className={`py-2 px-1 text-xs rounded-lg border text-center transition-all ${
                      freeTime === slot
                        ? "bg-brand-500/10 border-brand-500 text-brand-600 font-semibold"
                        : "border-surface-200 text-surface-500 hover:bg-surface-50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Life Areas */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">What areas of life do you want to work on?</h3>
                <p className="text-xs text-surface-500 mt-1">
                  Select your focus areas. You control your priorities—the OS never assumes.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedAreas.length === allLifeAreas.length) {
                      setSelectedAreas([]);
                    } else {
                      setSelectedAreas([...allLifeAreas]);
                    }
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 hover:border-orange-500 bg-white hover:bg-orange-50/50 text-slate-700 hover:text-orange-700 transition-colors shadow-2xs"
                >
                  {selectedAreas.length === allLifeAreas.length ? "Deselect All" : "Select All"}
                </button>
                <Badge variant={selectedAreas.length > 0 ? "brand" : "default"} size="sm">
                  {selectedAreas.length} of {allLifeAreas.length} Selected
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {allLifeAreas.map((area) => {
                const isSelected = selectedAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleItem(selectedAreas, setSelectedAreas, area)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-brand-500/10 border-brand-500 text-brand-600 font-semibold"
                        : "border-surface-200 text-surface-500 hover:text-foreground hover:bg-surface-50"
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-2">
                Top 3 priorities right now:
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedAreas.map((area) => {
                  const isPriority = priorityAreas.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleItem(priorityAreas, setPriorityAreas, area)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        isPriority
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 font-semibold"
                          : "border-surface-200 text-surface-400 hover:bg-surface-50"
                      }`}
                    >
                      ★ {area}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Current Problems & Primary Bottleneck (Multi-Select & Select All) */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">What is currently getting in your way?</h3>
                <p className="text-xs text-surface-500 mt-1">
                  Select all obstacles that apply (or pick multiple). We will design targeted interventions around them.
                </p>
              </div>

              {/* Action Buttons: Select All / Deselect All + Counter */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleToggleAllProblems}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 hover:border-orange-500 bg-white hover:bg-orange-50/50 text-slate-700 hover:text-orange-700 transition-colors shadow-2xs"
                >
                  {selectedProblems.length === allProblems.length ? "Deselect All" : "Select All"}
                </button>
                <Badge variant={selectedProblems.length > 0 ? "brand" : "default"} size="sm">
                  {selectedProblems.length} of {allProblems.length} Selected
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allProblems.map((prob) => {
                const isSelected = selectedProblems.includes(prob);
                const isPrimary = (primaryBottleneck || selectedProblems[0]) === prob;
                return (
                  <button
                    key={prob}
                    type="button"
                    onClick={() => toggleProblem(prob)}
                    className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-rose-50/90 border-rose-400 text-rose-950 font-bold ring-1 ring-rose-400 shadow-2xs"
                        : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span className="truncate">{prob}</span>
                    {isSelected && (
                      <div className="flex items-center gap-1 shrink-0">
                        {isPrimary && (
                          <span className="text-[9px] font-mono uppercase bg-rose-200/80 text-rose-800 px-1 py-0.2 rounded font-black">
                            #1
                          </span>
                        )}
                        <CheckCircle size={14} className="text-rose-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Optional Primary Anchor Selector if 2+ selected */}
            {selectedProblems.length > 1 && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs animate-in fade-in">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Identify your #1 single biggest anchor from your selections:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProblems.map((prob) => {
                    const isPrimary = (primaryBottleneck || selectedProblems[0]) === prob;
                    return (
                      <button
                        key={prob}
                        type="button"
                        onClick={() => setPrimaryBottleneck(prob)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isPrimary
                            ? "bg-rose-600 text-white shadow-xs font-bold"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isPrimary ? `★ ${prob}` : prob}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Behavior Profile */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-foreground">Behavioral Patterns</h3>
              <p className="text-xs text-surface-500 mt-1">
                How do you genuinely respond when work gets real?
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">When you have an important task, what usually happens?</label>
              <select
                value={onImportantTask}
                onChange={(e) => setOnImportantTask(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
              >
                <option value="I start immediately.">I start immediately.</option>
                <option value="I plan too much.">I plan too much.</option>
                <option value="I procrastinate.">I procrastinate.</option>
                <option value="I watch/read content about it.">I watch/read content about it.</option>
                <option value="I get distracted.">I get distracted.</option>
                <option value="I feel overwhelmed.">I feel overwhelmed.</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">When a task becomes difficult, what usually happens?</label>
              <select
                value={onDifficultTask}
                onChange={(e) => setOnDifficultTask(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
              >
                <option value="I keep going.">I keep going.</option>
                <option value="I search for tutorials.">I search for tutorials.</option>
                <option value="I switch tasks.">I switch tasks.</option>
                <option value="I take a break.">I take a break.</option>
                <option value="I quit.">I quit.</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">When you miss one day of routine, what usually happens?</label>
              <select
                value={onMissedDay}
                onChange={(e) => setOnMissedDay(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
              >
                <option value="I restart the next day.">I restart the next day.</option>
                <option value="I miss a few more days.">I miss a few more days.</option>
                <option value="I feel like the streak is ruined.">I feel like the streak is ruined.</option>
                <option value="I stop tracking.">I stop tracking.</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: Digital Life */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-foreground">Digital Life & Screen Time</h3>
              <p className="text-xs text-surface-500 mt-1">
                Non-judgmental diagnostic to calibrate healthy creation/consumption ratios.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">Approximate daily screen time</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {["<1 hour", "1–2", "2–4", "4–6", "6–8", "8+"].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setScreenTime(hrs)}
                    className={`py-2 text-xs rounded-lg border text-center transition-colors ${
                      screenTime === hrs
                        ? "bg-brand-500/10 border-brand-500 text-brand-600 font-semibold"
                        : "border-surface-200 text-surface-500 hover:bg-surface-50"
                    }`}
                  >
                    {hrs} hrs
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">Top distracting apps or websites</label>
              <input
                type="text"
                value={distractingApps}
                onChange={(e) => setDistractingApps(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
              />
            </div>
          </div>
        )}

        {/* STEP 6: Routine */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-foreground">Routine & Circadian Window</h3>
              <p className="text-xs text-surface-500 mt-1">
                Compare typical times vs your realistic target.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Typical Wake</label>
                <input
                  type="time"
                  value={typicalWake}
                  onChange={(e) => setTypicalWake(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Desired Wake</label>
                <input
                  type="time"
                  value={desiredWake}
                  onChange={(e) => setDesiredWake(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Typical Bedtime</label>
                <input
                  type="time"
                  value={typicalSleep}
                  onChange={(e) => setTypicalSleep(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Desired Bedtime</label>
                <input
                  type="time"
                  value={desiredSleep}
                  onChange={(e) => setDesiredSleep(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Energy Profile */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-foreground">Energy Profile</h3>
              <p className="text-xs text-surface-500 mt-1">
                When should your hardest work happen?
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">When do you feel most energetic?</label>
              <div className="grid grid-cols-3 gap-2">
                {["Early morning", "Morning", "Afternoon", "Evening", "Night", "Unpredictable"].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setEnergeticWindow(w)}
                    className={`py-2 text-xs rounded-lg border text-center transition-colors ${
                      energeticWindow === w
                        ? "bg-brand-500/10 border-brand-500 text-brand-600 font-semibold"
                        : "border-surface-200 text-surface-500 hover:bg-surface-50"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Role Branching */}
        {step === 8 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-foreground">Role-Specific Calibration</h3>
              <p className="text-xs text-surface-500 mt-1">
                Custom parameters tailored for your path.
              </p>
            </div>
            {occupation === "student" ? (
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Degree / Course</label>
                <input
                  type="text"
                  value={studentCourse}
                  onChange={(e) => setStudentCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">Primary Tech Stack / Tools</label>
                <input
                  type="text"
                  value={devLangs}
                  onChange={(e) => setDevLangs(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 9: Multi-Horizon Goals & North Star */}
        {step === 9 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-orange-600 border border-orange-200 mb-1">
                MULTI-HORIZON LIFE ARCHITECTURE
              </div>
              <h3 className="text-lg font-bold text-foreground">Strategic Horizons & North Star</h3>
              <p className="text-xs text-surface-500 mt-0.5">
                Break free from arbitrary limits. Connect your long-term life vision to near-term execution sprints.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-surface-700">NORTH STAR: 1–3 Year Guiding Life Anchor</label>
                <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">Long-Term</span>
              </div>
              <textarea
                rows={2}
                value={northStarVision}
                onChange={(e) => setNorthStarVision(e.target.value)}
                placeholder="What is your ultimate 1–3 year vision? (e.g. Build a sovereign software venture that yields true financial & creative independence)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-surface-700">BUILD: 90-Day Tactical Quarter Milestone</label>
                <span className="text-[10px] font-mono text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-md">90-Day Quarter</span>
              </div>
              <input
                type="text"
                value={goalBuild}
                onChange={(e) => setGoalBuild(e.target.value)}
                placeholder="e.g. Launch SaaS MVP to first 5 pilots"
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-surface-700">BECOME: 30-Day Sprint Identity Target</label>
                <span className="text-[10px] font-mono text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">30-Day Sprint</span>
              </div>
              <input
                type="text"
                value={goalBecome}
                onChange={(e) => setGoalBecome(e.target.value)}
                placeholder="e.g. A disciplined builder who logs 90min deep work every morning"
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-surface-700">STOP: Destructive Habit to Eliminate</label>
                <span className="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md">Friction Shield</span>
              </div>
              <input
                type="text"
                value={goalStop}
                onChange={(e) => setGoalStop(e.target.value)}
                placeholder="e.g. Passive social media browsing during morning hours"
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        )}

        {/* STEP 10: Definition of Success & Coach Style */}
        {step === 10 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-foreground">Definition of Success & Tone</h3>
              <p className="text-xs text-surface-500 mt-1">
                How will you know your momentum and life trajectory are compounding?
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">
                "Looking ahead, what milestone or outcome will prove that this personal operating system transformed your life?"
              </label>
              <textarea
                rows={3}
                value={successDef}
                onChange={(e) => setSuccessDef(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 bg-surface-50 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">Coaching Communication Style</label>
              <div className="grid grid-cols-4 gap-2">
                {(["GENTLE", "DIRECT", "ANALYTICAL", "BALANCED"] as CoachingStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCoachStyle(style)}
                    className={`py-2 text-xs rounded-lg border text-center font-semibold transition-colors ${
                      coachStyle === style
                        ? "bg-brand-500/10 border-brand-500 text-brand-600"
                        : "border-surface-200 text-surface-500 hover:bg-surface-50"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-surface-200 mt-6">
          {step > 1 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="gap-1.5 shadow-sm"
            >
              <ArrowLeft size={14} /> Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < 10 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStep(step + 1)}
              className="gap-1.5 shadow-sm"
            >
              Next <ArrowRight size={14} />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleFinishOnboarding}
              className="gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-sm"
            >
              <Sparkles size={16} /> Confirm & Launch My OS
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
