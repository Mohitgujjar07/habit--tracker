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
