export interface SleepLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  bedTime: string;
  wakeTime: string;
  durationHours: number;
  qualityRating: number; // 1 - 10
  restedFeeling: number; // 1 - 10
  notes?: string;
  createdAt: string;
}

export interface MoodEnergyLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  mood: number; // 1 - 10
  energy: number; // 1 - 10
  stress: number; // 1 - 10
  tags?: string[];
  trigger?: string;
  notes?: string;
  createdAt: string;
}

export interface WorkoutSet {
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  title: string;
  durationMinutes: number;
  exercises: WorkoutExercise[];
  intensityRating: number; // 1 - 10
  notes?: string;
  createdAt: string;
}

export interface BodyMetrics {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weightKg?: number;
  stepsCount?: number;
  waterMl?: number;
  notes?: string;
  createdAt: string;
}

export interface DigitalBalanceLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  screenTimeMinutes: number;
  contentConsumedMinutes: number;
  creationOutputMinutes: number;
  implementationMinutes: number;
  ratioScore: number; // 0 - 100
  topDistraction?: string;
  notes?: string;
  createdAt: string;
}

export interface DistractionCapture {
  id: string;
  userId: string;
  taskId?: string;
  timestamp: string;
  trigger:
    | "Bored"
    | "Tired"
    | "Stressed"
    | "Avoiding work"
    | "Lonely"
    | "Curious"
    | "Habit"
    | "Other";
  notes?: string;
  createdAt: string;
}

export interface LabResult {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  notes?: string;
  createdAt: string;
}

export interface UrgeSurfingLog {
  id: string;
  userId: string;
  timestamp: string;
  triggerCategory:
    | "Phone / Social Media"
    | "Procrastination"
    | "Junk Food / Sugar"
    | "Nicotine / Vaping"
    | "Impulsive Shopping"
    | "Other";
  intensityInitial: number; // 1 - 10
  intensityFinal: number; // 1 - 10
  durationSeconds: number; // e.g. 90 or 180
  replacementActionTaken: string;
  surfedSuccessfully: boolean;
  notes?: string;
  createdAt: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  targetMl: number;
  createdAt: string;
}

export type ExpenseCategory =
  | "Food & Dining"
  | "Transport & Fuel"
  | "Tools & Software"
  | "Health & Fitness"
  | "Books & Learning"
  | "Entertainment"
  | "General & Living";

export interface ExpenseLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: ExpenseCategory;
  description: string;
  isImpulse: boolean;
  createdAt: string;
}

export interface ImpulseHoldingItem {
  id: string;
  userId: string;
  itemName: string;
  price: number;
  category: ExpenseCategory;
  url?: string;
  notes?: string;
  targetCooldownHours: number; // default 72h
  createdAt: string;
  status: "cooling" | "bought" | "resisted_saved";
}

export interface DailyStreakMetric {
  id: string;
  userId: string;
  name: string;
  category: "hydration" | "workout" | "deep_work" | "no_spend" | "screen_free" | "reading";
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string; // YYYY-MM-DD
  graceDayActive: boolean; // Never miss twice buffer
}

export interface KnowledgeLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  title: string;
  source: "Book" | "Article" | "Podcast" | "Experience";
  oneSentenceTakeaway: string;
  pagesRead?: number;
  createdAt: string;
}

