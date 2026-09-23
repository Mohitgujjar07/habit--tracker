export type PriorityLevel = "low" | "medium" | "high" | "critical";

export type ProjectStatus =
  | "idea"
  | "planned"
  | "active"
  | "blocked"
  | "completed"
  | "archived";

export type TaskStatus =
  | "inbox"
  | "planned"
  | "today"
  | "in_progress"
  | "blocked"
  | "completed"
  | "cancelled";

export type EnergyRequirement = "low" | "medium" | "high";

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  isCompleted: boolean;
  targetDate?: string;
  completedAt?: string;
}

export type GoalHorizon =
  | "30_days"
  | "90_days"
  | "6_months"
  | "1_year"
  | "north_star";

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  why: string;
  category: "BECOME" | "BUILD" | "LEARN" | "IMPROVE" | "STOP" | "START" | "EXPERIENCE";
  priority: PriorityLevel;
  horizon?: GoalHorizon;
  targetDate: string;
  progressPercent: number;
  status: "active" | "completed" | "archived";
  milestones: string[];
  projectIds: string[];
  habitIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  goalId?: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: PriorityLevel;
  deadline?: string;
  progressPercent: number;
  momentumScore: number; // 0 - 100
  lastWorkedAt?: string;
  nextActionTitle?: string;
  blockerReason?: string;
  timeInvestedMinutes: number;
  milestones: Milestone[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  projectId?: string;
  goalId?: string;
  milestoneId?: string;
  title: string;
  description?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  dueDate?: string;
  estimatedMinutes: number;
  actualMinutesSpent: number;
  energyRequirement: EnergyRequirement;
  contextTag?: string; // e.g. "Deep Work", "Admin", "Call", "Writing", "Coding"
  postponedCount: number;
  tags?: string[];
  createdAt: string;
  completedAt?: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  projectId?: string;
  goalId?: string;
  taskTitle: string;
  durationMinutes: number;
  actualMinutes: number;
  focusRating: number; // 1 - 5
  outputSummary?: string;
  distractionsCount: number;
  distractionNotes?: string;
  wasStuck: boolean;
  status: "completed" | "abandoned" | "paused";
  startedAt: string;
  completedAt: string;
}

export interface StuckLog {
  id: string;
  userId: string;
  taskId?: string;
  focusSessionId?: string;
  reason: string;
  smallestActionGenerated: string;
  timerDurationSeconds: number;
  didResolve: boolean;
  createdAt: string;
}

export interface NextActionRecommendation {
  taskId?: string;
  projectId?: string;
  goalId?: string;
  title: string;
  durationMinutes: number;
  rationale: string;
  urgencyScore: number;
  energyMatch: string;
  projectTitle?: string;
  goalTitle?: string;
}
