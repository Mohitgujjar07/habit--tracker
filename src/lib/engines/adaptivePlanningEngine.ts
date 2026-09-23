import { Task, UserProfile, DailyMission } from "@/types";

export interface TimeBudgetAnalysis {
  availableMinutes: number;
  allocatedMinutes: number;
  bufferMinutes: number;
  isOverAllocated: boolean;
  overageMinutes: number;
  recommendation: string;
}

export class AdaptivePlanningEngine {
  /**
   * Calculate realistic Time Budget for today.
   */
  static analyzeTimeBudget(
    profile: UserProfile | null,
    todayTasks: Task[]
  ): TimeBudgetAnalysis {
    let availableMinutes = 180; // default 3 hours
    if (profile?.freeTimeDaily) {
      if (profile.freeTimeDaily === "<30 minutes") availableMinutes = 30;
      else if (profile.freeTimeDaily === "30–60 minutes") availableMinutes = 60;
      else if (profile.freeTimeDaily === "1–2 hours") availableMinutes = 90;
      else if (profile.freeTimeDaily === "2–4 hours") availableMinutes = 180;
      else if (profile.freeTimeDaily === "4+ hours") availableMinutes = 270;
    }

    const allocatedMinutes = todayTasks.reduce(
      (acc, t) => acc + (t.estimatedMinutes || 30),
      0
    );

    // Recommended 20% buffer for cognitive switching and interruptions
    const bufferMinutes = Math.round(availableMinutes * 0.2);
    const effectiveCapacity = availableMinutes - bufferMinutes;
    const isOverAllocated = allocatedMinutes > effectiveCapacity;
    const overageMinutes = Math.max(0, allocatedMinutes - effectiveCapacity);

    let recommendation = "Your schedule has a healthy buffer for unexpected interruptions.";
    if (isOverAllocated) {
      recommendation = `You have planned ${allocatedMinutes}m of work against ${effectiveCapacity}m of realistic capacity (${bufferMinutes}m buffer). Consider postponing the lowest priority task to protect quality.`;
    }

    return {
      availableMinutes,
      allocatedMinutes,
      bufferMinutes,
      isOverAllocated,
      overageMinutes,
      recommendation,
    };
  }

  /**
   * Generate an adaptive Daily Mission: 3 prioritized tasks
   */
  static generateDailyMission(
    tasks: Task[],
    userEnergy: number = 7
  ): DailyMission {
    // If energy is low (<= 4), prioritize low or medium energy tasks
    const sorted = [...tasks]
      .filter((t) => t.status !== "completed")
      .sort((a, b) => {
        const pOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return pOrder[b.priority] - pOrder[a.priority];
      });

    const chosen = sorted.slice(0, 3).map((t) => ({
      id: t.id,
      title: t.title,
      completed: false,
      estimatedMinutes: t.estimatedMinutes || 30,
    }));

    const totalTarget = chosen.reduce((acc, c) => acc + c.estimatedMinutes, 0);

    return {
      id: `mission-${Date.now()}`,
      userId: tasks[0]?.userId || "user-1",
      date: new Date().toISOString().split("T")[0],
      priorityTasks: chosen,
      focusTargetMinutes: Math.min(totalTarget, 120),
      movementSuggestion: userEnergy > 6 ? "45m strength training or run" : "20m brisk outdoor walk to restore energy",
    };
  }
}
