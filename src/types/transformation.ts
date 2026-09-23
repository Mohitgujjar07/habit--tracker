export interface TransformationScore {
  overall: number; // 0 - 100
  execution: number;
  focus: number;
  body: number;
  mind: number;
  digital: number;
  consistency: number;
  reflection: number;
  calculatedAt: string;
}

export interface ConsistencyMetrics {
  returnRatePercent: number; // % of times user resumed action within 48h after interruption
  interruptionCount: number;
  successfulRecoveries: number;
  averageRecoveryTimeHours: number;
  activeStreakDays: number;
  weeklyAdherencePercent: number;
}

export interface DailyMission {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  priorityTasks: {
    id: string;
    title: string;
    completed: boolean;
    estimatedMinutes: number;
  }[];
  focusTargetMinutes: number;
  movementSuggestion: string;
  recoveryAlternative?: string;
  completedAt?: string;
}

export interface DailyCheckin {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  type: "morning" | "evening";
  sleepHours?: number;
  energyLevel?: number;
  moodLevel?: number;
  stressLevel?: number;
  wentWell?: string;
  wasDifficult?: string;
  completedSummary?: string;
  avoidedSummary?: string;
  proudMoment?: string;
  createdAt: string;
}

export interface FrustrationLog {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  frustrationLevel: number; // 1 - 10
  whatHappened: string;
  actionTaken: string;
  didQuit: boolean;
  whatHelped?: string;
  whatToChange?: string;
  recurringContext?: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  userId: string;
  title: string;
  context: string;
  rootCause: string;
  takeaway: string;
  actionRule: string;
  category: "planning" | "execution" | "digital" | "mindset" | "energy";
  createdAt: string;
}

export interface Win {
  id: string;
  userId: string;
  title: string;
  category: "small" | "major" | "comeback" | "breakthrough";
  notes?: string;
  createdAt: string;
}

export interface IdentityEvidence {
  id: string;
  userId: string;
  identityStatement: string; // e.g., "I finish what I start", "I am a builder"
  evidenceAction: string;
  relatedTaskId?: string;
  relatedProjectId?: string;
  timestamp: string;
}

export interface PersonalExperiment {
  id: string;
  userId: string;
  title: string;
  hypothesis: string;
  metricToTrack: string;
  targetOutcome: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "abandoned";
  recordedFindings?: string;
  neutralReport?: string;
  createdAt: string;
}

export interface OperatingManualItem {
  id: string;
  title: string;
  statement: string;
  isCustom: boolean;
  lastUpdated: string;
}

export interface PersonalOperatingManual {
  userId: string;
  bestFocusTime: string;
  strongestWorkWindow: string;
  biggestDistractions: string[];
  commonAvoidanceTriggers: string[];
  effectiveRecoveryRoutine: string;
  preferredSessionDuration: string;
  customRules: OperatingManualItem[];
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  userId: string;
  date: string;
  type:
    | "first_focus"
    | "first_project"
    | "milestone"
    | "comeback"
    | "win"
    | "breakthrough"
    | "review"
    | "experiment";
  title: string;
  description: string;
  badgeText?: string;
  mediaUrl?: string;
}

export interface WeeklyReview {
  id: string;
  userId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalFocusHours: number;
  completedTasksCount: number;
  learningImplementationRatio: number;
  whatWentWell: string;
  whatWentPoorly: string;
  whatWasAvoided: string;
  keyLearning: string;
  changesForNextWeek: string;
  primaryGoalNextWeek: string;
  prioritiesNextWeek: string[];
  createdAt: string;
}
