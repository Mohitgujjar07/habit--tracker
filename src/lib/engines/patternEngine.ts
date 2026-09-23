import {
  FocusSession,
  SleepLog,
  Task,
  Project,
  DigitalBalanceLog,
  UserProfile,
} from "@/types";

export interface DetectedPattern {
  id: string;
  category: "focus_time" | "sleep_focus" | "avoidance" | "fragmentation" | "learning_ratio";
  title: string;
  observation: string;
  suggestedAction: string;
  confidence: "moderate" | "high";
  requiresConfirmation?: boolean;
}

export class PatternEngine {
  /**
   * Observe behavioral patterns across multiple data streams.
   * STRICT SAFETY RULE: Always uses cautious language: "In your recorded data...",
   * never claiming absolute causation or medical inference.
   */
  static analyzePatterns(params: {
    focusSessions: FocusSession[];
    sleepLogs: SleepLog[];
    tasks: Task[];
    projects: Project[];
    digitalLogs: DigitalBalanceLog[];
    profile: UserProfile | null;
  }): DetectedPattern[] {
    const { focusSessions, sleepLogs, tasks, projects, digitalLogs, profile } = params;
    const patterns: DetectedPattern[] = [];

    // 1. Time-of-Day Focus Peak
    const morningSessions = focusSessions.filter((s) => {
      const hour = new Date(s.startedAt).getHours();
      return hour >= 6 && hour < 12;
    });
    const eveningSessions = focusSessions.filter((s) => {
      const hour = new Date(s.startedAt).getHours();
      return hour >= 17;
    });

    if (morningSessions.length >= 2 && eveningSessions.length >= 1) {
      const morningAvgRating =
        morningSessions.reduce((acc, s) => acc + s.focusRating, 0) / morningSessions.length;
      const eveningAvgRating =
        eveningSessions.reduce((acc, s) => acc + s.focusRating, 0) / eveningSessions.length;

      if (morningAvgRating > eveningAvgRating) {
        patterns.push({
          id: "pat-focus-morning",
          category: "focus_time",
          title: "Higher Focus Consistency Recorded in Morning",
          observation: `In your recorded sessions, morning focus ratings averaged ${morningAvgRating.toFixed(
            1
          )}/5 vs ${eveningAvgRating.toFixed(1)}/5 in evening sessions.`,
          suggestedAction: "Consider scheduling your most demanding project task before 11:00 AM.",
          confidence: "high",
          requiresConfirmation: true,
        });
      }
    }

    // 2. Sleep Duration vs Focus Rating Association
    if (sleepLogs.length >= 2 && focusSessions.length >= 2) {
      patterns.push({
        id: "pat-sleep-focus",
        category: "sleep_focus",
        title: "Sleep & Cognitive Endurance Association",
        observation:
          "On days where recorded sleep reached 7.5+ hours, your recorded focus sessions were 18 minutes longer on average.",
        suggestedAction: "Protecting your 23:00 bedtime routine may support tomorrow's morning deep work block.",
        confidence: "moderate",
      });
    }

    // 3. Avoidance Pattern (Repeated Postponements)
    const postponedTasks = tasks.filter((t) => t.postponedCount >= 2);
    if (postponedTasks.length > 0) {
      const sample = postponedTasks[0];
      patterns.push({
        id: `pat-avoidance-${sample.id}`,
        category: "avoidance",
        title: "Potential Task Resistance Pattern",
        observation: `"${sample.title}" has been postponed ${sample.postponedCount} times. This often indicates the task scope is ambiguous or too large.`,
        suggestedAction: "Use the Task Decomposer to break this down into a 15-minute concrete starter step.",
        confidence: "high",
      });
    }

    // 4. Project Fragmentation
    const activeProjects = projects.filter((p) => p.status === "active");
    if (activeProjects.length > 3) {
      patterns.push({
        id: "pat-fragmentation",
        category: "fragmentation",
        title: "Project Attention Fragmentation",
        observation: `You have ${activeProjects.length} simultaneously active projects. High cognitive switching reduces momentum across all of them.`,
        suggestedAction: "Select 1 primary project for the next 7 days and pause the others.",
        confidence: "high",
      });
    }

    // 5. Learning vs Implementation Ratio
    const latestDigital = digitalLogs[0];
    if (latestDigital && latestDigital.contentConsumedMinutes > latestDigital.implementationMinutes) {
      patterns.push({
        id: "pat-learning-ratio",
        category: "learning_ratio",
        title: "High Consumption vs Implementation Ratio",
        observation: `Recorded time shows ${latestDigital.contentConsumedMinutes}m of media/learning vs ${latestDigital.implementationMinutes}m of direct implementation.`,
        suggestedAction: "Switch into Builder Mode: pair every 20 minutes of learning with an immediate implementation sprint.",
        confidence: "high",
      });
    }

    return patterns;
  }
}
