"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { HomeHeader } from "@/components/dashboard/HomeHeader";
import { NextActionHero } from "@/components/dashboard/NextActionHero";
import { TodaysMissionCard } from "@/components/dashboard/TodaysMissionCard";
import { TodayGlance } from "@/components/dashboard/TodayGlance";
import { ProjectMomentumCard } from "@/components/dashboard/ProjectMomentumCard";
import { PatternsNotice } from "@/components/dashboard/PatternsNotice";
import { MorningQuoteHero } from "@/components/dashboard/MorningQuoteHero";
import { SlumpGuardBanner } from "@/components/dashboard/SlumpGuardBanner";
import { DeveloperDashboard } from "@/components/specialized/DeveloperDashboard";
import { CollegeDashboard } from "@/components/specialized/CollegeDashboard";
import { DataStoreRepository } from "@/repositories/dataStore";
import { NextActionEngine } from "@/lib/engines/nextActionEngine";
import { PatternEngine, DetectedPattern } from "@/lib/engines/patternEngine";
import { SlumpEngine } from "@/lib/engines/slumpEngine";
import { PersonalTrackingHub } from "@/components/lifestyle/PersonalTrackingHub";
import {
  UserProfile,
  Task,
  Project,
  Goal,
  DailyMission,
  NextActionRecommendation,
  FocusSession,
  SleepLog,
  MoodEnergyLog,
  WorkoutSession,
  DigitalBalanceLog,
  SlumpRiskAssessment,
} from "@/types";

function DashboardContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [nextAction, setNextAction] = useState<NextActionRecommendation | null>(null);
  const [patterns, setPatterns] = useState<DetectedPattern[]>([]);
  const [slumpAssessment, setSlumpAssessment] = useState<SlumpRiskAssessment | null>(null);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodEnergyLog[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [digitalLogs, setDigitalLogs] = useState<DigitalBalanceLog[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);

  const loadAllData = () => {
    const p = DataStoreRepository.getUserProfile();
    const t = DataStoreRepository.getTasks();
    const pr = DataStoreRepository.getProjects();
    const g = DataStoreRepository.getGoals();
    const m = DataStoreRepository.getDailyMission();
    const s = DataStoreRepository.getSleepLogs();
    const md = DataStoreRepository.getMoodLogs();
    const w = DataStoreRepository.getWorkouts();
    const d = DataStoreRepository.getDigitalLogs();
    const f = DataStoreRepository.getFocusSessions();

    setProfile(p);
    setTasks(t);
    setProjects(pr);
    setGoals(g);
    setMission(m);
    setSleepLogs(s);
    setMoodLogs(md);
    setWorkouts(w);
    setDigitalLogs(d);
    setFocusSessions(f);

    // Compute next action
    const rec = NextActionEngine.evaluateNextAction(t, pr, g, p);
    setNextAction(rec);

    // Compute patterns
    const pat = PatternEngine.analyzePatterns({
      focusSessions: f,
      sleepLogs: s,
      tasks: t,
      projects: pr,
      digitalLogs: d,
      profile: p,
    });
    setPatterns(pat);

    // Compute predictive slump & burnout assessment (Option B)
    const slump = SlumpEngine.evaluateRisk({
      sleepLogs: s,
      moodLogs: md,
      tasks: t,
      focusSessions: f,
      dailyMission: m,
    });
    setSlumpAssessment(slump);
  };

  useEffect(() => {
    loadAllData();
    window.addEventListener("ptos-data-change", loadAllData);
    return () => window.removeEventListener("ptos-data-change", loadAllData);
  }, []);

  const handleRefreshNextAction = () => {
    const rec = NextActionEngine.evaluateNextAction(tasks, projects, goals, profile);
    setNextAction(rec);
  };

  const handlePostponeReason = (reason: string) => {
    if (nextAction?.taskId) {
      const task = tasks.find((t) => t.id === nextAction.taskId);
      if (task) {
        task.postponedCount = (task.postponedCount || 0) + 1;
        task.updatedAt = new Date().toISOString();
        DataStoreRepository.saveTask(task);
      }
    }
  };

  const handleToggleMissionTask = (taskId: string) => {
    if (!mission) return;
    const updated = {
      ...mission,
      priorityTasks: mission.priorityTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    };
    DataStoreRepository.saveDailyMission(updated);
    setMission(updated);
  };

  const handleActivateRestDay = () => {
    if (mission) {
      const compressed: DailyMission = {
        ...mission,
        priorityTasks: mission.priorityTasks.slice(0, 1),
        focusTargetMinutes: 20,
        movementSuggestion: "Gentle 15-minute nature walk & hydration",
        recoveryAlternative: "Early bedtime at 22:00. No screens 1h before bed.",
      };
      DataStoreRepository.saveDailyMission(compressed);
      setMission(compressed);
    }
    DataStoreRepository.saveIdentityEvidence({
      id: `ev-rest-${Date.now()}`,
      userId: profile?.id || "user-demo-1",
      timestamp: new Date().toISOString(),
      identityStatement: "I know when to protect my biological baseline to stay in the game for the long run.",
      evidenceAction: "Activated intentional Low-Power Rest Day protocol to prevent cognitive burnout.",
    });
  };

  // If specialized mode requested in query string
  if (mode === "developer") {
    return (
      <AppShell>
        <DeveloperDashboard />
      </AppShell>
    );
  }

  if (mode === "college") {
    return (
      <AppShell>
        <CollegeDashboard />
      </AppShell>
    );
  }

  const latestSleep = sleepLogs[0]?.durationHours || 7.5;
  const latestMood = moodLogs[0]?.mood || 8;
  const latestEnergy = moodLogs[0]?.energy || 8;
  const totalFocusMins = focusSessions.reduce((acc, f) => acc + f.actualMinutes, 0);

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in">
        {/* Header with greeting & Day counter */}
        <HomeHeader profile={profile} />

        {/* Daily 6:00 AM Highlighted Motivational Quote */}
        <MorningQuoteHero />

        {/* Predictive Slump & Burnout Guard Banner (Option B) */}
        <SlumpGuardBanner
          assessment={slumpAssessment}
          onActivateRestDay={handleActivateRestDay}
        />

        {/* Observed Pattern Notice */}
        <PatternsNotice patterns={patterns} />

        {/* NEXT ACTION — THE CORE HERO CARD */}
        {nextAction && (
          <NextActionHero
            action={nextAction}
            onRefreshAction={handleRefreshNextAction}
            onPostponeReason={handlePostponeReason}
          />
        )}

        {/* PERSONAL TRACKING & HABIT HUB */}
        <PersonalTrackingHub />

        {/* Today's Mission & Project Momentum in 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mission && (
            <TodaysMissionCard
              mission={mission}
              onToggleTask={handleToggleMissionTask}
            />
          )}

          <ProjectMomentumCard projects={projects} />
        </div>

        {/* Today at a Glance: 9 compact metrics */}
        <TodayGlance
          sleepHours={latestSleep}
          energyLevel={latestEnergy}
          moodLevel={latestMood}
          focusMinutes={totalFocusMins > 0 ? totalFocusMins : 45}
          stepsCount={6840}
          screenTimeHours={4.2}
          workoutLogged={workouts.length > 0}
          learningMinutes={30}
          outputMinutes={150}
        />
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-surface-400">Loading Command Center...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
