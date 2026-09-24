import {
  UserProfile,
  Goal,
  Project,
  Task,
  FocusSession,
  StuckLog,
  SleepLog,
  MoodEnergyLog,
  WorkoutSession,
  DigitalBalanceLog,
  DistractionCapture,
  DailyMission,
  FrustrationLog,
  Lesson,
  Win,
  IdentityEvidence,
  PersonalExperiment,
  PersonalOperatingManual,
  TimelineEvent,
  WeeklyReview,
  UrgeSurfingLog,
  DailyCheckin,
  WaterLog,
  ExpenseLog,
  ImpulseHoldingItem,
  DailyStreakMetric,
  KnowledgeLog,
} from "@/types";

import {
  createInitialDemoUser,
  initialDemoGoals,
  initialDemoProjects,
  initialDemoTasks,
  initialDemoFocusSessions,
  initialDemoDailyMission,
  initialDemoSleepLogs,
  initialDemoMoodLogs,
  initialDemoWorkouts,
  initialDemoDigitalLogs,
  initialDemoLessons,
  initialDemoWins,
  initialDemoIdentityEvidence,
  initialDemoOperatingManual,
  initialDemoExperiments,
  initialDemoTimeline,
  initialDemoUrgeLogs,
} from "@/lib/demoData";

const STORAGE_KEYS = {
  USER_PROFILE: "ptos_user_profile",
  GOALS: "ptos_goals",
  PROJECTS: "ptos_projects",
  TASKS: "ptos_tasks",
  FOCUS_SESSIONS: "ptos_focus_sessions",
  STUCK_LOGS: "ptos_stuck_logs",
  SLEEP_LOGS: "ptos_sleep_logs",
  MOOD_LOGS: "ptos_mood_logs",
  WORKOUTS: "ptos_workouts",
  DIGITAL_LOGS: "ptos_digital_logs",
  DISTRACTIONS: "ptos_distractions",
  DAILY_MISSION: "ptos_daily_mission",
  FRUSTRATIONS: "ptos_frustrations",
  LESSONS: "ptos_lessons",
  WINS: "ptos_wins",
  IDENTITY_EVIDENCE: "ptos_identity_evidence",
  EXPERIMENTS: "ptos_experiments",
  OPERATING_MANUAL: "ptos_operating_manual",
  TIMELINE: "ptos_timeline",
  WEEKLY_REVIEWS: "ptos_weekly_reviews",
  URGE_LOGS: "ptos_urge_logs",
  DAILY_CHECKINS: "ptos_daily_checkins",
  WATER_LOGS: "ptos_water_logs",
  EXPENSE_LOGS: "ptos_expense_logs",
  IMPULSE_ITEMS: "ptos_impulse_items",
  DAILY_STREAKS: "ptos_daily_streaks",
  KNOWLEDGE_LOGS: "ptos_knowledge_logs",
  HAS_SEEDED: "ptos_has_seeded_v1",
};

// Safe localStorage helper
function readStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return defaultValue;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event for cross-component realtime sync
    window.dispatchEvent(new Event("ptos-data-change"));
  } catch (error) {
    console.error(`Error writing ${key} to storage:`, error);
  }
}

export class DataStoreRepository {
  // Ensure default demo seed is loaded if brand new
  static ensureInitialized(): void {
    if (typeof window === "undefined") return;
    const hasSeeded = window.localStorage.getItem(STORAGE_KEYS.HAS_SEEDED);
    if (!hasSeeded) {
      DataStoreRepository.resetToDemoData();
      window.localStorage.setItem(STORAGE_KEYS.HAS_SEEDED, "true");
    }
  }

  static resetToDemoData(): void {
    if (typeof window === "undefined") return;
    writeStorage(STORAGE_KEYS.USER_PROFILE, createInitialDemoUser());
    writeStorage(STORAGE_KEYS.GOALS, initialDemoGoals);
    writeStorage(STORAGE_KEYS.PROJECTS, initialDemoProjects);
    writeStorage(STORAGE_KEYS.TASKS, initialDemoTasks);
    writeStorage(STORAGE_KEYS.FOCUS_SESSIONS, initialDemoFocusSessions);
    writeStorage(STORAGE_KEYS.DAILY_MISSION, initialDemoDailyMission);
    writeStorage(STORAGE_KEYS.SLEEP_LOGS, initialDemoSleepLogs);
    writeStorage(STORAGE_KEYS.MOOD_LOGS, initialDemoMoodLogs);
    writeStorage(STORAGE_KEYS.WORKOUTS, initialDemoWorkouts);
    writeStorage(STORAGE_KEYS.DIGITAL_LOGS, initialDemoDigitalLogs);
    writeStorage(STORAGE_KEYS.LESSONS, initialDemoLessons);
    writeStorage(STORAGE_KEYS.WINS, initialDemoWins);
    writeStorage(STORAGE_KEYS.IDENTITY_EVIDENCE, initialDemoIdentityEvidence);
    writeStorage(STORAGE_KEYS.OPERATING_MANUAL, initialDemoOperatingManual);
    writeStorage(STORAGE_KEYS.EXPERIMENTS, initialDemoExperiments);
    writeStorage(STORAGE_KEYS.TIMELINE, initialDemoTimeline);
    writeStorage(STORAGE_KEYS.URGE_LOGS, initialDemoUrgeLogs);
    writeStorage(STORAGE_KEYS.DAILY_CHECKINS, []);
    writeStorage(STORAGE_KEYS.STUCK_LOGS, []);
    writeStorage(STORAGE_KEYS.DISTRACTIONS, []);
    writeStorage(STORAGE_KEYS.FRUSTRATIONS, []);
    writeStorage(STORAGE_KEYS.WEEKLY_REVIEWS, []);
  }

  static clearAllData(): void {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
    window.dispatchEvent(new Event("ptos-data-change"));
  }

  // --- USER PROFILE ---
  static getUserProfile(): UserProfile | null {
    DataStoreRepository.ensureInitialized();
    return readStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
  }

  static saveUserProfile(profile: UserProfile): void {
    profile.updatedAt = new Date().toISOString();
    writeStorage(STORAGE_KEYS.USER_PROFILE, profile);
  }

  // --- GOALS ---
  static getGoals(): Goal[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<Goal[]>(STORAGE_KEYS.GOALS, []);
  }

  static saveGoal(goal: Goal): void {
    const goals = DataStoreRepository.getGoals();
    const index = goals.findIndex((g) => g.id === goal.id);
    goal.updatedAt = new Date().toISOString();
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goal.id = goal.id || `goal-${Date.now()}`;
      goal.createdAt = goal.createdAt || new Date().toISOString();
      goals.push(goal);
    }
    writeStorage(STORAGE_KEYS.GOALS, goals);
  }

  static deleteGoal(id: string): void {
    const goals = DataStoreRepository.getGoals().filter((g) => g.id !== id);
    writeStorage(STORAGE_KEYS.GOALS, goals);
  }

  // --- PROJECTS ---
  static getProjects(): Project[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
  }

  static saveProject(project: Project): void {
    const projects = DataStoreRepository.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    project.updatedAt = new Date().toISOString();
    if (index >= 0) {
      projects[index] = project;
    } else {
      project.id = project.id || `proj-${Date.now()}`;
      project.createdAt = project.createdAt || new Date().toISOString();
      projects.push(project);
    }
    writeStorage(STORAGE_KEYS.PROJECTS, projects);
  }

  static deleteProject(id: string): void {
    const projects = DataStoreRepository.getProjects().filter((p) => p.id !== id);
    writeStorage(STORAGE_KEYS.PROJECTS, projects);
  }

  // --- TASKS ---
  static getTasks(): Task[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<Task[]>(STORAGE_KEYS.TASKS, []);
  }

  static saveTask(task: Task): void {
    const tasks = DataStoreRepository.getTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    task.updatedAt = new Date().toISOString();
    if (index >= 0) {
      tasks[index] = task;
    } else {
      task.id = task.id || `task-${Date.now()}`;
      task.createdAt = task.createdAt || new Date().toISOString();
      tasks.push(task);
    }
    writeStorage(STORAGE_KEYS.TASKS, tasks);
  }

  static deleteTask(id: string): void {
    const tasks = DataStoreRepository.getTasks().filter((t) => t.id !== id);
    writeStorage(STORAGE_KEYS.TASKS, tasks);
  }

  // --- FOCUS SESSIONS ---
  static getFocusSessions(): FocusSession[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<FocusSession[]>(STORAGE_KEYS.FOCUS_SESSIONS, []);
  }

  static saveFocusSession(session: FocusSession): void {
    const sessions = DataStoreRepository.getFocusSessions();
    session.id = session.id || `focus-${Date.now()}`;
    sessions.unshift(session);
    writeStorage(STORAGE_KEYS.FOCUS_SESSIONS, sessions);

    // Also update project timeInvested and lastWorkedAt if project exists
    if (session.projectId) {
      const projects = DataStoreRepository.getProjects();
      const proj = projects.find((p) => p.id === session.projectId);
      if (proj) {
        proj.timeInvestedMinutes = (proj.timeInvestedMinutes || 0) + session.actualMinutes;
        proj.lastWorkedAt = new Date().toISOString();
        proj.momentumScore = Math.min(100, Math.max(10, proj.momentumScore + 5));
        DataStoreRepository.saveProject(proj);
      }
    }
  }

  // --- STUCK LOGS ---
  static getStuckLogs(): StuckLog[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<StuckLog[]>(STORAGE_KEYS.STUCK_LOGS, []);
  }

  static saveStuckLog(log: StuckLog): void {
    const logs = DataStoreRepository.getStuckLogs();
    log.id = log.id || `stuck-${Date.now()}`;
    log.createdAt = log.createdAt || new Date().toISOString();
    logs.unshift(log);
    writeStorage(STORAGE_KEYS.STUCK_LOGS, logs);
  }

  // --- LIFESTYLE LOGS ---
  static getSleepLogs(): SleepLog[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<SleepLog[]>(STORAGE_KEYS.SLEEP_LOGS, []);
  }

  static saveSleepLog(log: SleepLog): void {
    const logs = DataStoreRepository.getSleepLogs();
    log.id = log.id || `sleep-${Date.now()}`;
    log.createdAt = log.createdAt || new Date().toISOString();
    logs.unshift(log);
    writeStorage(STORAGE_KEYS.SLEEP_LOGS, logs);
  }

  static getMoodLogs(): MoodEnergyLog[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<MoodEnergyLog[]>(STORAGE_KEYS.MOOD_LOGS, []);
  }

  static saveMoodLog(log: MoodEnergyLog): void {
    const logs = DataStoreRepository.getMoodLogs();
    log.id = log.id || `mood-${Date.now()}`;
    log.createdAt = log.createdAt || new Date().toISOString();
    logs.unshift(log);
    writeStorage(STORAGE_KEYS.MOOD_LOGS, logs);
  }

  static getWorkouts(): WorkoutSession[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS, []);
  }

  static saveWorkout(session: WorkoutSession): void {
    const workouts = DataStoreRepository.getWorkouts();
    session.id = session.id || `workout-${Date.now()}`;
    session.createdAt = session.createdAt || new Date().toISOString();
    workouts.unshift(session);
    writeStorage(STORAGE_KEYS.WORKOUTS, workouts);
  }

  static getDigitalLogs(): DigitalBalanceLog[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<DigitalBalanceLog[]>(STORAGE_KEYS.DIGITAL_LOGS, []);
  }

  static saveDigitalLog(log: DigitalBalanceLog): void {
    const logs = DataStoreRepository.getDigitalLogs();
    log.id = log.id || `dig-${Date.now()}`;
    log.createdAt = log.createdAt || new Date().toISOString();
    logs.unshift(log);
    writeStorage(STORAGE_KEYS.DIGITAL_LOGS, logs);
  }

  static getDistractions(): DistractionCapture[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<DistractionCapture[]>(STORAGE_KEYS.DISTRACTIONS, []);
  }

  static saveDistraction(distraction: DistractionCapture): void {
    const distractions = DataStoreRepository.getDistractions();
    distraction.id = distraction.id || `dist-${Date.now()}`;
    distraction.createdAt = new Date().toISOString();
    distractions.unshift(distraction);
    writeStorage(STORAGE_KEYS.DISTRACTIONS, distractions);
  }

  // --- TRANSFORMATION & REFLECTION ---
  static getDailyMission(): DailyMission {
    DataStoreRepository.ensureInitialized();
    return readStorage<DailyMission>(STORAGE_KEYS.DAILY_MISSION, initialDemoDailyMission);
  }

  static saveDailyMission(mission: DailyMission): void {
    writeStorage(STORAGE_KEYS.DAILY_MISSION, mission);
  }

  static getFrustrations(): FrustrationLog[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<FrustrationLog[]>(STORAGE_KEYS.FRUSTRATIONS, []);
  }

  static saveFrustration(log: FrustrationLog): void {
    const list = DataStoreRepository.getFrustrations();
    log.id = log.id || `frust-${Date.now()}`;
    log.createdAt = new Date().toISOString();
    list.unshift(log);
    writeStorage(STORAGE_KEYS.FRUSTRATIONS, list);
  }

  static getLessons(): Lesson[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<Lesson[]>(STORAGE_KEYS.LESSONS, []);
  }

  static saveLesson(lesson: Lesson): void {
    const list = DataStoreRepository.getLessons();
    lesson.id = lesson.id || `les-${Date.now()}`;
    lesson.createdAt = new Date().toISOString();
    list.unshift(lesson);
    writeStorage(STORAGE_KEYS.LESSONS, list);
  }

  static getWins(): Win[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<Win[]>(STORAGE_KEYS.WINS, []);
  }

  static saveWin(win: Win): void {
    const list = DataStoreRepository.getWins();
    win.id = win.id || `win-${Date.now()}`;
    win.createdAt = new Date().toISOString();
    list.unshift(win);
    writeStorage(STORAGE_KEYS.WINS, list);
  }

  static getIdentityEvidence(): IdentityEvidence[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<IdentityEvidence[]>(STORAGE_KEYS.IDENTITY_EVIDENCE, []);
  }

  static saveIdentityEvidence(evidence: IdentityEvidence): void {
    const list = DataStoreRepository.getIdentityEvidence();
    evidence.id = evidence.id || `ev-${Date.now()}`;
    evidence.timestamp = new Date().toISOString();
    list.unshift(evidence);
    writeStorage(STORAGE_KEYS.IDENTITY_EVIDENCE, list);
  }

  static getExperiments(): PersonalExperiment[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<PersonalExperiment[]>(STORAGE_KEYS.EXPERIMENTS, []);
  }

  static saveExperiment(experiment: PersonalExperiment): void {
    const list = DataStoreRepository.getExperiments();
    const index = list.findIndex((e) => e.id === experiment.id);
    if (index >= 0) {
      list[index] = experiment;
    } else {
      experiment.id = experiment.id || `exp-${Date.now()}`;
      experiment.createdAt = new Date().toISOString();
      list.push(experiment);
    }
    writeStorage(STORAGE_KEYS.EXPERIMENTS, list);
  }

  static getOperatingManual(): PersonalOperatingManual {
    DataStoreRepository.ensureInitialized();
    return readStorage<PersonalOperatingManual>(
      STORAGE_KEYS.OPERATING_MANUAL,
      initialDemoOperatingManual
    );
  }

  static saveOperatingManual(manual: PersonalOperatingManual): void {
    manual.updatedAt = new Date().toISOString();
    writeStorage(STORAGE_KEYS.OPERATING_MANUAL, manual);
  }

  static getTimelineEvents(): TimelineEvent[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<TimelineEvent[]>(STORAGE_KEYS.TIMELINE, []);
  }

  static saveTimelineEvent(event: TimelineEvent): void {
    const list = DataStoreRepository.getTimelineEvents();
    event.id = event.id || `tl-${Date.now()}`;
    list.unshift(event);
    writeStorage(STORAGE_KEYS.TIMELINE, list);
  }

  static getWeeklyReviews(): WeeklyReview[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<WeeklyReview[]>(STORAGE_KEYS.WEEKLY_REVIEWS, []);
  }

  static saveWeeklyReview(review: WeeklyReview): void {
    const list = DataStoreRepository.getWeeklyReviews();
    review.id = review.id || `rev-${Date.now()}`;
    review.createdAt = new Date().toISOString();
    list.unshift(review);
    writeStorage(STORAGE_KEYS.WEEKLY_REVIEWS, list);
  }

  // --- URGE SURFING & CRUSHING CRAVINGS ---
  static getUrgeLogs(): UrgeSurfingLog[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<UrgeSurfingLog[]>(STORAGE_KEYS.URGE_LOGS, initialDemoUrgeLogs);
  }

  static saveUrgeLog(log: UrgeSurfingLog): void {
    const list = DataStoreRepository.getUrgeLogs();
    log.id = log.id || `urge-${Date.now()}`;
    log.createdAt = log.createdAt || new Date().toISOString();
    log.timestamp = log.timestamp || new Date().toISOString();
    list.unshift(log);
    writeStorage(STORAGE_KEYS.URGE_LOGS, list);

    // If successfully surfed, automatically record evidence of ironclad discipline in Identity Evidence and Wins!
    if (log.surfedSuccessfully) {
      DataStoreRepository.saveIdentityEvidence({
        id: `ev-urge-${Date.now()}`,
        userId: log.userId || "user-demo-1",
        timestamp: new Date().toISOString(),
        identityStatement: "I have ironclad self-regulation and overcome compulsive urges.",
        evidenceAction: `Surfed ${log.triggerCategory} craving (Intensity dropped from ${log.intensityInitial}/10 to ${log.intensityFinal}/10) -> Executed: ${log.replacementActionTaken}`,
      });

      DataStoreRepository.saveWin({
        id: `win-urge-${Date.now()}`,
        userId: log.userId || "user-demo-1",
        title: `Surfed Craving: ${log.triggerCategory}`,
        notes: `Resisted impulse for ${log.durationSeconds}s. Channelled dopamine into: ${log.replacementActionTaken}`,
        category: "breakthrough",
        createdAt: new Date().toISOString(),
      });
    }
  }

  // --- DAILY CHECKINS & VOICE DEBRIEFS ---
  static getDailyCheckins(): DailyCheckin[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<DailyCheckin[]>(STORAGE_KEYS.DAILY_CHECKINS, []);
  }

  static saveDailyCheckin(checkin: DailyCheckin): void {
    const list = DataStoreRepository.getDailyCheckins();
    checkin.id = checkin.id || `chk-${Date.now()}`;
    checkin.createdAt = checkin.createdAt || new Date().toISOString();
    list.unshift(checkin);
    writeStorage(STORAGE_KEYS.DAILY_CHECKINS, list);

    // If there is an extracted win, save it automatically
    if (checkin.extractedWin) {
      DataStoreRepository.saveWin({
        id: `win-chk-${Date.now()}`,
        userId: checkin.userId || "user-demo-1",
        title: checkin.extractedWin,
        notes: `Recorded during ${checkin.type} debrief.`,
        category: "comeback",
        createdAt: new Date().toISOString(),
      });
    }

    // If there is a tomorrow priority action, automatically create/prepend it as a priority task
    if (checkin.tomorrowPriorityAction) {
      DataStoreRepository.saveTask({
        id: `task-chk-${Date.now()}`,
        userId: checkin.userId || "user-demo-1",
        title: checkin.tomorrowPriorityAction,
        priority: "critical",
        status: "today",
        estimatedMinutes: 45,
        actualMinutesSpent: 0,
        energyRequirement: "high",
        contextTag: "Deep Work",
        postponedCount: 0,
        tags: ["evening-debrief", "priority"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Record evidence of self-accountability
    DataStoreRepository.saveIdentityEvidence({
      id: `ev-chk-${Date.now()}`,
      userId: checkin.userId || "user-demo-1",
      timestamp: new Date().toISOString(),
      identityStatement: "I close my days with conscious reflection and crystal clarity.",
      evidenceAction: `Completed ${checkin.type} debrief. Priority locked: ${checkin.tomorrowPriorityAction || "Day closed intentionally."}`,
    });
  }

  // --- EXPORT ALL ---
  static exportAllData(): Record<string, any> {
    return {
      profile: DataStoreRepository.getUserProfile(),
      goals: DataStoreRepository.getGoals(),
      projects: DataStoreRepository.getProjects(),
      tasks: DataStoreRepository.getTasks(),
      focusSessions: DataStoreRepository.getFocusSessions(),
      sleepLogs: DataStoreRepository.getSleepLogs(),
      moodLogs: DataStoreRepository.getMoodLogs(),
      workouts: DataStoreRepository.getWorkouts(),
      digitalLogs: DataStoreRepository.getDigitalLogs(),
      lessons: DataStoreRepository.getLessons(),
      wins: DataStoreRepository.getWins(),
      identityEvidence: DataStoreRepository.getIdentityEvidence(),
      experiments: DataStoreRepository.getExperiments(),
      operatingManual: DataStoreRepository.getOperatingManual(),
      timeline: DataStoreRepository.getTimelineEvents(),
      urgeLogs: DataStoreRepository.getUrgeLogs(),
      dailyCheckins: DataStoreRepository.getDailyCheckins(),
      waterLogs: DataStoreRepository.getWaterLogs(),
      expenseLogs: DataStoreRepository.getExpenseLogs(),
      impulseItems: DataStoreRepository.getImpulseHoldingItems(),
      dailyStreaks: DataStoreRepository.getDailyStreaks(),
      knowledgeLogs: DataStoreRepository.getKnowledgeLogs(),
      exportedAt: new Date().toISOString(),
    };
  }

  // --- WATER INTAKE & HYDRATION ---
  static getWaterLogs(): WaterLog[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<WaterLog[]>(STORAGE_KEYS.WATER_LOGS, []);
  }

  static getTodayWaterMl(): number {
    const today = new Date().toISOString().split("T")[0];
    return DataStoreRepository.getWaterLogs()
      .filter((l) => l.date === today)
      .reduce((sum, l) => sum + l.amountMl, 0);
  }

  static addWater(amountMl: number, targetMl = 3000): void {
    const today = new Date().toISOString().split("T")[0];
    const logs = DataStoreRepository.getWaterLogs();
    logs.unshift({
      id: `water-${Date.now()}`,
      userId: "user-demo-1",
      date: today,
      amountMl,
      targetMl,
      createdAt: new Date().toISOString(),
    });
    writeStorage(STORAGE_KEYS.WATER_LOGS, logs);
    DataStoreRepository.recordStreakAction("hydration");
  }

  // --- EXPENSES & FINANCIAL TRACKING ---
  static getExpenseLogs(): ExpenseLog[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<ExpenseLog[]>(STORAGE_KEYS.EXPENSE_LOGS, []);
  }

  static saveExpenseLog(log: ExpenseLog): void {
    const logs = DataStoreRepository.getExpenseLogs();
    log.id = log.id || `exp-${Date.now()}`;
    log.createdAt = log.createdAt || new Date().toISOString();
    logs.unshift(log);
    writeStorage(STORAGE_KEYS.EXPENSE_LOGS, logs);
  }

  static getTodayExpenseTotal(): number {
    const today = new Date().toISOString().split("T")[0];
    return DataStoreRepository.getExpenseLogs()
      .filter((e) => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  // --- IMPULSE COOLING-OFF VAULT ---
  static getImpulseHoldingItems(): ImpulseHoldingItem[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<ImpulseHoldingItem[]>(STORAGE_KEYS.IMPULSE_ITEMS, []);
  }

  static saveImpulseHoldingItem(item: ImpulseHoldingItem): void {
    const items = DataStoreRepository.getImpulseHoldingItems();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.unshift(item);
    }
    writeStorage(STORAGE_KEYS.IMPULSE_ITEMS, items);
  }

  // --- DAILY STREAKS WITH GRACE-DAY BUFFER ---
  static getDailyStreaks(): DailyStreakMetric[] {
    DataStoreRepository.ensureInitialized();
    const defaultStreaks: DailyStreakMetric[] = [
      { id: "str-1", userId: "user-demo-1", name: "Hydration (2.5L+)", category: "hydration", currentStreak: 6, longestStreak: 14, lastLoggedDate: new Date().toISOString().split("T")[0], graceDayActive: false },
      { id: "str-2", userId: "user-demo-1", name: "Physical Movement", category: "workout", currentStreak: 4, longestStreak: 12, lastLoggedDate: new Date().toISOString().split("T")[0], graceDayActive: false },
      { id: "str-3", userId: "user-demo-1", name: "Morning Deep Work", category: "deep_work", currentStreak: 8, longestStreak: 21, lastLoggedDate: new Date().toISOString().split("T")[0], graceDayActive: false },
      { id: "str-4", userId: "user-demo-1", name: "No-Spend Discipline", category: "no_spend", currentStreak: 3, longestStreak: 7, lastLoggedDate: new Date().toISOString().split("T")[0], graceDayActive: true },
      { id: "str-5", userId: "user-demo-1", name: "Screen-Free Morning", category: "screen_free", currentStreak: 5, longestStreak: 10, lastLoggedDate: new Date().toISOString().split("T")[0], graceDayActive: false },
    ];
    return readStorage<DailyStreakMetric[]>(STORAGE_KEYS.DAILY_STREAKS, defaultStreaks);
  }

  static recordStreakAction(category: "hydration" | "workout" | "deep_work" | "no_spend" | "screen_free" | "reading"): void {
    const streaks = DataStoreRepository.getDailyStreaks();
    const today = new Date().toISOString().split("T")[0];
    const streak = streaks.find((s) => s.category === category);
    if (!streak) return;

    if (streak.lastLoggedDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (streak.lastLoggedDate === yesterday) {
        streak.currentStreak += 1;
        streak.graceDayActive = false;
      } else if (!streak.graceDayActive) {
        // Grace Day buffer (Never Miss Twice principle)
        streak.graceDayActive = true;
        streak.currentStreak += 1;
      } else {
        streak.currentStreak = 1;
        streak.graceDayActive = false;
      }
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      streak.lastLoggedDate = today;
      writeStorage(STORAGE_KEYS.DAILY_STREAKS, streaks);
    }
  }

  // --- KNOWLEDGE & READING LOGS ---
  static getKnowledgeLogs(): KnowledgeLog[] {
    DataStoreRepository.ensureInitialized();
    return readStorage<KnowledgeLog[]>(STORAGE_KEYS.KNOWLEDGE_LOGS, []);
  }

  static saveKnowledgeLog(log: KnowledgeLog): void {
    const logs = DataStoreRepository.getKnowledgeLogs();
    log.id = log.id || `kn-${Date.now()}`;
    log.createdAt = log.createdAt || new Date().toISOString();
    logs.unshift(log);
    writeStorage(STORAGE_KEYS.KNOWLEDGE_LOGS, logs);
  }
}


