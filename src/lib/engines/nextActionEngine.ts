import { Task, Project, Goal, UserProfile, NextActionRecommendation } from "@/types";

export class NextActionEngine {
  /**
   * Determine the single most effective action right now.
   * Deterministic, transparent, and non-overwhelming.
   */
  static evaluateNextAction(
    tasks: Task[],
    projects: Project[],
    goals: Goal[],
    profile: UserProfile | null,
    currentHour: number = new Date().getHours()
  ): NextActionRecommendation {
    // 1. Filter out already completed or cancelled tasks
    const candidateTasks = tasks.filter(
      (t) => t.status !== "completed" && t.status !== "cancelled"
    );

    if (candidateTasks.length === 0) {
      return {
        title: "Define next 90-day milestone or project task",
        durationMinutes: 20,
        rationale: "All current tasks are complete. Spend 20 minutes clarifying the next meaningful outcome.",
        urgencyScore: 50,
        energyMatch: "Moderate",
      };
    }

    // Determine current user energy phase based on time
    const isMorning = currentHour >= 6 && currentHour < 12;
    const isAfternoon = currentHour >= 12 && currentHour < 17;
    const isEvening = currentHour >= 17 && currentHour < 22;

    const scoredTasks = candidateTasks.map((task) => {
      let score = 0;
      let rationaleParts: string[] = [];

      // Priority weighting
      if (task.priority === "critical") {
        score += 50;
        rationaleParts.push("Critical priority");
      } else if (task.priority === "high") {
        score += 35;
        rationaleParts.push("High priority");
      } else if (task.priority === "medium") {
        score += 20;
      } else {
        score += 10;
      }

      // Status weighting: "today" or "in_progress" ranks higher
      if (task.status === "in_progress") {
        score += 40;
        rationaleParts.push("Already in progress");
      } else if (task.status === "today") {
        score += 30;
        rationaleParts.push("Scheduled for today");
      }

      // Energy matching
      if (isMorning) {
        if (task.energyRequirement === "high") {
          score += 25;
          rationaleParts.push("Matches morning cognitive peak");
        } else if (task.energyRequirement === "medium") {
          score += 15;
        }
      } else if (isAfternoon) {
        if (task.energyRequirement === "medium") {
          score += 20;
          rationaleParts.push("Fits afternoon steady work");
        } else if (task.energyRequirement === "low") {
          score += 15;
        }
      } else if (isEvening) {
        if (task.energyRequirement === "low") {
          score += 25;
          rationaleParts.push("Low mental drag for evening hours");
        } else if (task.energyRequirement === "medium") {
          score += 10;
        }
      }

      // Project momentum synergy
      const project = projects.find((p) => p.id === task.projectId);
      if (project && project.status === "active") {
        score += 15;
        if (project.momentumScore > 70) {
          score += 10;
          rationaleParts.push(`Rides high project momentum (${project.title})`);
        }
      }

      // Postponement penalty / intervention:
      // If task postponed > 3 times, prioritize breaking it down or small sprint
      if (task.postponedCount > 2) {
        score += 10;
        rationaleParts.push("Previously postponed — do a short focused block");
      }

      return {
        task,
        project,
        score,
        rationale: rationaleParts.join(" • ") || "Next logical step in queue",
      };
    });

    // Sort descending by score
    scoredTasks.sort((a, b) => b.score - a.score);
    const top = scoredTasks[0];

    const goal = top.project?.goalId
      ? goals.find((g) => g.id === top.project?.goalId)
      : undefined;

    return {
      taskId: top.task.id,
      projectId: top.project?.id,
      goalId: goal?.id,
      title: top.task.title,
      durationMinutes: Math.min(top.task.estimatedMinutes || 25, 45),
      rationale: top.rationale,
      urgencyScore: top.score,
      energyMatch: `${top.task.energyRequirement.toUpperCase()} energy required`,
      projectTitle: top.project?.title,
      goalTitle: goal?.title,
    };
  }
}
