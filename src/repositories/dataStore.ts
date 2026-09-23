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
      exportedAt: new Date().toISOString(),
    };
  }
}
