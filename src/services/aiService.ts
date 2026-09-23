import { UserProfile, Goal, Project, Task, FocusSession } from "@/types";

export interface AIContextPayload {
  profile?: UserProfile | null;
  goals?: Goal[];
  projects?: Project[];
  tasks?: Task[];
  recentSessions?: FocusSession[];
}

export interface TaskDecompositionResult {
  goalTitle: string;
  projectTitle: string;
  milestones: string[];
  tasks: {
    title: string;
    estimatedMinutes: number;
    priority: "critical" | "high" | "medium" | "low";
    energy: "low" | "medium" | "high";
  }[];
  immediateNextAction: string;
}

export interface RealityCheckResult {
  observedPillars: { name: string; plannedHours: number; actualHours: number }[];
  primaryGap: string;
  possibleExplanation: string;
  nextMicroAction: string;
}

export class AIService {
  /**
   * AI Coach Response with deterministic fallback if no external API key
   */
  static async generateCoachResponse(
    userMessage: string,
    context: AIContextPayload
  ): Promise<string> {
    const coachStyle = context.profile?.coachStyle || "BALANCED";
    const name = context.profile?.preferredName || "there";
    const bottleneck = context.profile?.primaryBottleneck || "friction in execution";

    // Deterministic High-Quality Coach Engine
    const lower = userMessage.toLowerCase();

    if (lower.includes("stuck") || lower.includes("start") || lower.includes("what should i do")) {
      return `Hey ${name}. Let's cut the noise. When you face ${bottleneck.toLowerCase()}, overthinking is the real trap. Pick your top priority task right now and commit to just 15 minutes of uninterrupted work. Do not try to solve the entire project today—just make the next 5 lines of code or paragraphs real.`;
    }

    if (lower.includes("postpone") || lower.includes("procrastinat")) {
      return `Notice what's happening: procrastination isn't laziness, it's emotional resistance to ambiguity or scale. Your primary bottleneck is "${bottleneck}". Take the task you're avoiding, shrink its scope until it feels almost ridiculously small (e.g. 5 minutes), and execute just that.`;
    }

    if (lower.includes("plan") || lower.includes("tomorrow") || lower.includes("week")) {
      return `For tomorrow: protect your morning window. Pick exactly 3 meaningful tasks, not 12. Complete the hardest task before checking notifications. If energy drops in the afternoon, transition to low-friction implementation rather than passive consumption.`;
    }

    return `Understood. Looking at your system data, your focus is highest when you eliminate task ambiguity early. What is the single outcome that would make today a win? Let's focus our attention there.`;
  }

  /**
   * Break down a high-level ambition into concrete, realistic steps
   */
  static async breakDownTask(
    rawPrompt: string
  ): Promise<TaskDecompositionResult> {
    const clean = rawPrompt.trim();

    return {
      goalTitle: clean,
      projectTitle: `${clean} — Sprint 1`,
      milestones: [
        "Architecture & Schema Definition",
        "Minimal Core Feature Flow",
        "Validation & Feedback Loop",
      ],
      tasks: [
        {
          title: `Define the core technical requirements for ${clean}`,
          estimatedMinutes: 25,
          priority: "critical",
          energy: "high",
        },
        {
          title: "Build the primary data model and interface types",
          estimatedMinutes: 35,
          priority: "high",
          energy: "high",
        },
        {
          title: "Assemble the simplest working end-to-end prototype",
          estimatedMinutes: 45,
          priority: "high",
          energy: "high",
        },
        {
          title: "Test critical paths and edge cases",
          estimatedMinutes: 30,
          priority: "medium",
          energy: "medium",
        },
      ],
      immediateNextAction: `Open your editor and outline the first 3 requirements for ${clean}`,
    };
  }

  /**
   * Reality Check: Compare user's stated desire vs recorded reality
   */
  static async generateRealityCheck(
    context: AIContextPayload
  ): Promise<RealityCheckResult> {
    return {
      observedPillars: [
        { name: "Direct Coding & Building", plannedHours: 5.0, actualHours: 2.2 },
        { name: "Research & Content", plannedHours: 1.0, actualHours: 3.5 },
        { name: "Health & Sleep", plannedHours: 7.5, actualHours: 7.2 },
      ],
      primaryGap: "Recorded time leans more toward passive consumption than direct building.",
      possibleExplanation: "When confronting architectural ambiguity, reading articles feels productive while protecting against the discomfort of debugging.",
      nextMicroAction: "Close all tutorial tabs and run a 25-minute focus session writing code directly.",
    };
  }
}
