import {
  UserProfile,
  Goal,
  Project,
  Task,
  FocusSession,
  SleepLog,
  MoodEnergyLog,
  WorkoutSession,
  DigitalBalanceLog,
  Lesson,
  Win,
  IdentityEvidence,
  PersonalExperiment,
  PersonalOperatingManual,
  TimelineEvent,
  DailyMission,
  UrgeSurfingLog,
} from "@/types";

export const createInitialDemoUser = (): UserProfile => ({
  id: "user-demo-1",
  userId: "user-demo-1",
  preferredName: "Alex",
  fullName: "Alex Chen",
  ageRange: "25–34",
  country: "United States",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  occupation: "entrepreneur",
  currentOccupationDetail: "Building a B2B SaaS analytics platform and improving personal execution.",
  weekdayRoutine: "Wake at 6:45 AM, 90m deep work block, team sync, implementation afternoon, gym at 6 PM.",
  weekendRoutine: "Reading, outdoor movement, system reset, weekly planning on Sunday afternoon.",
  freeTimeDaily: "2–4 hours",
  responsibilities: "Product architecture, customer discovery, self-care, maintaining technical skills.",
  selectedLifeAreas: ["Focus", "Projects", "Fitness", "Digital habits", "Sleep", "Consistency"],
  priorityLifeAreas: ["Focus", "Projects", "Consistency"],
  primaryBottleneck: "Starting but not finishing",
  secondaryBottlenecks: ["Phone overuse", "Overplanning", "Too much passive learning"],
  behaviorProfile: {
    onImportantTask: "I plan too much.",
    onDifficultTask: "I search for tutorials instead of doing the hard thinking.",
    onMissedRoutineDay: "I restart the next day with a smaller action.",
    primaryNeed: "Need visible progress and tight deadlines.",
  },
  digitalProfile: {
    screenTimeHours: "4–6",
    consumingActivities: ["Short-form video", "YouTube", "Random browsing"],
    distractingApps: ["YouTube", "Twitter/X", "Discord"],
    distractionTimes: ["Afternoon", "When tired"],
    distractionTriggers: ["Bored", "Avoiding work"],
  },
  routine: {
    typicalWake: "07:00",
    desiredWake: "06:30",
    typicalSleep: "23:45",
    desiredSleep: "23:00",
    workStart: "09:00",
    workEnd: "18:00",
    commuteTime: "None (Remote)",
    exerciseAvailability: "Late afternoon / 17:30",
    preferredWorkHours: "Morning (07:30 - 11:30)",
  },
  energyProfile: {
    energeticWindow: "Morning",
    tiredWindow: "Late Afternoon (14:30 - 16:30)",
    hardestWorkWindow: "Early Morning (07:30 - 10:00)",
  },
  goals90Days: [
    { category: "BUILD", text: "Launch MVP of SaaS platform with first 5 paying pilots." },
    { category: "BECOME", text: "A disciplined builder who acts before feeling ready." },
    { category: "IMPROVE", text: "Average 7.5 hours of consistent sleep and 100min daily deep work." },
    { category: "STOP", text: "Passive tutorial consumption when actual code needs writing." }
  ],
  personalDefinitionOfSuccess:
    "Having a live product tested by real users, having logged 100 focused deep work sessions, and feeling in control of my daily momentum.",
  coachStyle: "BALANCED",
  dislikedExperiencePatterns: [
    "Motivational quotes",
    "Toxic streak shaming",
    "Overloaded dashboards",
    "Fake AI certainty"
  ],
  accountabilityStyle: "Recovery plan",
  onboardingCompleted: true,
  onboardingStep: 10,
  transformationDay: 24,
  createdAt: new Date(Date.now() - 24 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
});

export const initialDemoGoals: Goal[] = [
  {
    id: "goal-1",
    userId: "user-demo-1",
    title: "Launch B2B SaaS MVP",
    description: "Build, deploy, and onboard first 5 beta customers.",
    why: "Achieve financial autonomy and master end-to-end fullstack delivery.",
    category: "BUILD",
    priority: "critical",
    targetDate: new Date(Date.now() + 66 * 86400000).toISOString().split("T")[0],
    progressPercent: 42,
    status: "active",
    milestones: ["Auth & Database Schema", "Core Analytics Engine", "Billing & Subscriptions", "Beta Launch"],
    projectIds: ["proj-1", "proj-2"],
    habitIds: ["habit-1"],
    createdAt: new Date(Date.now() - 24 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "goal-2",
    userId: "user-demo-1",
    title: "Build 90-Minute Daily Deep Work Consistency",
    description: "Protect morning blocks and track focus completion without phone interruptions.",
    why: "Cognitive endurance is the single highest-leverage asset for high-value output.",
    category: "BECOME",
    priority: "high",
    targetDate: new Date(Date.now() + 66 * 86400000).toISOString().split("T")[0],
    progressPercent: 68,
    status: "active",
    milestones: ["20 consecutive logged sessions", "Average focus score >= 4.0", "Zero distraction morning blocks"],
    projectIds: ["proj-3"],
    habitIds: ["habit-2"],
    createdAt: new Date(Date.now() - 24 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialDemoProjects: Project[] = [
  {
    id: "proj-1",
    userId: "user-demo-1",
    goalId: "goal-1",
    title: "Core Data Ingestion & API Pipeline",
    description: "Write event pipeline, validate data schemas, and connect webhook receivers.",
    status: "active",
    priority: "critical",
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    progressPercent: 65,
    momentumScore: 84,
    lastWorkedAt: new Date().toISOString(),
    nextActionTitle: "Implement batch processor for incoming telemetry events",
    timeInvestedMinutes: 1420,
    milestones: [
      { id: "m-1", projectId: "proj-1", title: "Design event payload schema", isCompleted: true },
      { id: "m-2", projectId: "proj-1", title: "Build webhook receiver endpoint", isCompleted: true },
      { id: "m-3", projectId: "proj-1", title: "Batch queue worker", isCompleted: false },
    ],
    tags: ["Backend", "Engineering"],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-2",
    userId: "user-demo-1",
    goalId: "goal-1",
    title: "Product UI & Interactive Dashboard",
    description: "Customer-facing charts, user management, and API key settings.",
    status: "active",
    priority: "high",
    deadline: new Date(Date.now() + 28 * 86400000).toISOString().split("T")[0],
    progressPercent: 30,
    momentumScore: 62,
    lastWorkedAt: new Date(Date.now() - 86400000).toISOString(),
    nextActionTitle: "Add time-series filter to customer overview chart",
    timeInvestedMinutes: 680,
    milestones: [
      { id: "m-4", projectId: "proj-2", title: "User authentication flows", isCompleted: true },
      { id: "m-5", projectId: "proj-2", title: "Time-series dashboard charts", isCompleted: false },
      { id: "m-6", projectId: "proj-2", title: "API settings & token generator", isCompleted: false },
    ],
    tags: ["Frontend", "UX"],
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialDemoTasks: Task[] = [
  {
    id: "task-1",
    userId: "user-demo-1",
    projectId: "proj-1",
    goalId: "goal-1",
    title: "Implement batch processor for incoming telemetry events",
    description: "Handle up to 500 records per chunk with error retry queue.",
    priority: "critical",
    status: "today",
    dueDate: new Date().toISOString().split("T")[0],
    estimatedMinutes: 45,
    actualMinutesSpent: 0,
    energyRequirement: "high",
    contextTag: "Coding",
    postponedCount: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    userId: "user-demo-1",
    projectId: "proj-2",
    goalId: "goal-1",
    title: "Add time-series filter to customer overview chart",
    description: "Support 7d, 30d, 90d query range selectors.",
    priority: "high",
    status: "planned",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    estimatedMinutes: 30,
    actualMinutesSpent: 0,
    energyRequirement: "medium",
    contextTag: "Frontend",
    postponedCount: 1,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    userId: "user-demo-1",
    projectId: "proj-1",
    goalId: "goal-1",
    title: "Write unit tests for authentication tokens",
    description: "Verify JWT expiration and refresh token rotation.",
    priority: "medium",
    status: "completed",
    dueDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    estimatedMinutes: 35,
    actualMinutesSpent: 40,
    energyRequirement: "medium",
    contextTag: "Testing",
    postponedCount: 0,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialDemoFocusSessions: FocusSession[] = [
  {
    id: "focus-1",
    userId: "user-demo-1",
    taskId: "task-3",
    projectId: "proj-1",
    taskTitle: "Write unit tests for authentication tokens",
    durationMinutes: 45,
    actualMinutes: 40,
    focusRating: 5,
    outputSummary: "Created 12 tests for token revocation and edge cases.",
    distractionsCount: 0,
    wasStuck: false,
    status: "completed",
    startedAt: new Date(Date.now() - 86400000 - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "focus-2",
    userId: "user-demo-1",
    projectId: "proj-2",
    taskTitle: "Design schema for client configuration",
    durationMinutes: 45,
    actualMinutes: 45,
    focusRating: 4,
    outputSummary: "Drafted database schema and JSON validation rules.",
    distractionsCount: 1,
    distractionNotes: "Quick Slack ping checked at 22m mark.",
    wasStuck: false,
    status: "completed",
    startedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 86400000 + 45 * 60000).toISOString(),
  },
];

export const initialDemoDailyMission: DailyMission = {
  id: "mission-today",
  userId: "user-demo-1",
  date: new Date().toISOString().split("T")[0],
  priorityTasks: [
    { id: "task-1", title: "Implement batch processor for telemetry events", completed: false, estimatedMinutes: 45 },
    { id: "task-2", title: "Add time-series filter to customer overview chart", completed: false, estimatedMinutes: 30 },
    { id: "t-movement", title: "45m Weight training session (Push day)", completed: false, estimatedMinutes: 45 },
  ],
  focusTargetMinutes: 75,
  movementSuggestion: "Upper body strength session + 10m walk post-lunch",
};

export const initialDemoSleepLogs: SleepLog[] = [
  {
    id: "sleep-1",
    userId: "user-demo-1",
    date: new Date().toISOString().split("T")[0],
    bedTime: "23:15",
    wakeTime: "06:45",
    durationHours: 7.5,
    qualityRating: 8,
    restedFeeling: 8,
    notes: "Fell asleep quickly, woke up with clear head.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sleep-2",
    userId: "user-demo-1",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    bedTime: "23:45",
    wakeTime: "07:00",
    durationHours: 7.25,
    qualityRating: 7,
    restedFeeling: 7,
    notes: "Slight late screen time before bed.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const initialDemoMoodLogs: MoodEnergyLog[] = [
  {
    id: "mood-1",
    userId: "user-demo-1",
    date: new Date().toISOString().split("T")[0],
    timestamp: new Date().toISOString(),
    timeOfDay: "morning",
    mood: 8,
    energy: 8,
    stress: 3,
    tags: ["Focused", "Motivated"],
    trigger: "Good sleep and clean workspace.",
    createdAt: new Date().toISOString(),
  }
];

export const initialDemoWorkouts: WorkoutSession[] = [
  {
    id: "workout-1",
    userId: "user-demo-1",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    title: "Upper Body Strength",
    durationMinutes: 50,
    intensityRating: 8,
    exercises: [
      {
        id: "ex-1",
        name: "Barbell Bench Press",
        sets: [
          { reps: 8, weightKg: 75, completed: true },
          { reps: 8, weightKg: 75, completed: true },
          { reps: 7, weightKg: 75, completed: true },
        ],
      },
      {
        id: "ex-2",
        name: "Incline Dumbbell Press",
        sets: [
          { reps: 10, weightKg: 26, completed: true },
          { reps: 10, weightKg: 26, completed: true },
        ],
      },
    ],
    notes: "Solid session, felt strong on top sets.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const initialDemoDigitalLogs: DigitalBalanceLog[] = [
  {
    id: "dig-1",
    userId: "user-demo-1",
    date: new Date().toISOString().split("T")[0],
    screenTimeMinutes: 240,
    contentConsumedMinutes: 90,
    creationOutputMinutes: 150,
    implementationMinutes: 120,
    ratioScore: 78,
    topDistraction: "YouTube",
    notes: "Kept recreational tabs closed during morning block.",
    createdAt: new Date().toISOString(),
  }
];

export const initialDemoLessons: Lesson[] = [
  {
    id: "les-1",
    userId: "user-demo-1",
    title: "Tutorial Paralysis on Complex Features",
    context: "Spent 2 hours watching architectural videos before writing a single line of backend logic.",
    rootCause: "Fear of suboptimal schema design masquerading as 'preparation'.",
    takeaway: "Write the naive implementation first, then refactor with evidence.",
    actionRule: "Never watch a tutorial without a code editor open and an immediate 15-minute test branch.",
    category: "execution",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  }
];

export const initialDemoWins: Win[] = [
  {
    id: "win-1",
    userId: "user-demo-1",
    title: "Shipped Auth Engine Without Postponement",
    category: "major",
    notes: "Completed the entire Firebase auth token rotation in a single 90m deep work block.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "win-2",
    userId: "user-demo-1",
    title: "Protected Morning Work Block from Phone Use",
    category: "small",
    notes: "Phone stayed in another room until 11:30 AM.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const initialDemoIdentityEvidence: IdentityEvidence[] = [
  {
    id: "ev-1",
    userId: "user-demo-1",
    identityStatement: "I finish what I start.",
    evidenceAction: "Completed token rotation suite without switching to easier tasks.",
    relatedTaskId: "task-3",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ev-2",
    userId: "user-demo-1",
    identityStatement: "I am a builder.",
    evidenceAction: "Produced 150 minutes of meaningful code vs 30 minutes of consumption.",
    timestamp: new Date().toISOString(),
  }
];

export const initialDemoOperatingManual: PersonalOperatingManual = {
  userId: "user-demo-1",
  bestFocusTime: "07:30 - 10:30 AM",
  strongestWorkWindow: "Early morning before email/messages",
  biggestDistractions: ["Passive YouTube essays", "Twitter notifications", "Unscheduled phone checks"],
  commonAvoidanceTriggers: ["Ambiguous task boundaries", "Complex API errors"],
  effectiveRecoveryRoutine: "Close all tabs, 5-minute walk, open a blank scratchpad, set a 2-minute micro action.",
  preferredSessionDuration: "45 minutes",
  customRules: [
    {
      id: "rule-1",
      title: "The 2-Minute Unstuck Rule",
      statement: "When stuck, define the physically smallest action (e.g., 'Open file X and write function signature').",
      isCustom: false,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "rule-2",
      title: "Protect the First 90 Minutes",
      statement: "No communication apps before the first focus block is finished.",
      isCustom: true,
      lastUpdated: new Date().toISOString(),
    }
  ],
  updatedAt: new Date().toISOString(),
};

export const initialDemoExperiments: PersonalExperiment[] = [
  {
    id: "exp-1",
    userId: "user-demo-1",
    title: "Morning Deep Work vs Afternoon Deep Work",
    hypothesis: "Morning focus blocks yield 30% higher completion rates and fewer recorded distractions.",
    metricToTrack: "Focus Rating (1-5) and Completion Percentage",
    targetOutcome: "Average completion > 85% in morning blocks.",
    durationDays: 14,
    startDate: new Date(Date.now() - 10 * 86400000).toISOString().split("T")[0],
    endDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    status: "active",
    recordedFindings: "Recorded data shows 88% completion for 7:30 AM blocks vs 58% for 3:00 PM blocks.",
    neutralReport: "In your logged data, morning sessions have 1.8 fewer distraction logs per hour.",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  }
];

export const initialDemoTimeline: TimelineEvent[] = [
  {
    id: "tl-1",
    userId: "user-demo-1",
    date: new Date(Date.now() - 24 * 86400000).toISOString().split("T")[0],
    type: "first_focus",
    title: "Started 90-Day Transformation Journey",
    description: "Completed comprehensive onboarding and established first 90-day focus targets.",
    badgeText: "Day 1",
  },
  {
    id: "tl-2",
    userId: "user-demo-1",
    date: new Date(Date.now() - 18 * 86400000).toISOString().split("T")[0],
    type: "first_project",
    title: "Initiated Core Data Pipeline Project",
    description: "Mapped milestones from high-level goal down to granular technical actions.",
    badgeText: "Milestone",
  },
  {
    id: "tl-3",
    userId: "user-demo-1",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    type: "win",
    title: "Completed Authentication Infrastructure",
    description: "All unit tests green, zero post-work guilt.",
    badgeText: "Win",
  }
];

export const initialDemoUrgeLogs: UrgeSurfingLog[] = [
  {
    id: "urge-demo-1",
    userId: "user-demo-1",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    triggerCategory: "Phone / Social Media",
    intensityInitial: 8,
    intensityFinal: 2,
    durationSeconds: 90,
    replacementActionTaken: "Drank 500ml water and resumed 25m focus sprint",
    surfedSuccessfully: true,
    notes: "Felt strong urge to doomscroll Twitter notifications during build. Surfed the physiological sigh.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "urge-demo-2",
    userId: "user-demo-1",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    triggerCategory: "Procrastination",
    intensityInitial: 7,
    intensityFinal: 3,
    durationSeconds: 90,
    replacementActionTaken: "10 pushups and opened IDE",
    surfedSuccessfully: true,
    notes: "Overcame resistance to start hard refactoring work.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];
