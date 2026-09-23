import {
  SleepLog,
  MoodEnergyLog,
  Task,
  FocusSession,
  DailyMission,
  SlumpRiskAssessment,
} from "@/types";

export class SlumpEngine {
  /**
   * Evaluates early burnout and habit slump indicators across multiple behavioral vectors.
   * Gives a 48-hour forward-looking risk assessment to prevent collapse before it occurs.
   */
  static evaluateRisk(params: {
    sleepLogs: SleepLog[];
    moodLogs: MoodEnergyLog[];
    tasks: Task[];
    focusSessions: FocusSession[];
    dailyMission: DailyMission | null;
  }): SlumpRiskAssessment {
    const { sleepLogs, moodLogs, tasks, focusSessions, dailyMission } = params;
    let score = 0;
    const factors: string[] = [];

    // --- VECTOR 1: SLEEP DEBT & RECOVERY QUALITY (Max 35 pts) ---
    const recentSleep = sleepLogs.slice(0, 3);
    if (recentSleep.length > 0) {
      const avgSleep =
        recentSleep.reduce((acc, s) => acc + s.durationHours, 0) /
        recentSleep.length;
      const avgQuality =
        recentSleep.reduce((acc, s) => acc + s.qualityRating, 0) /
        recentSleep.length;

      if (avgSleep < 6.0) {
        score += 28;
        factors.push(
          `Acute sleep deficit: 3-day average is ${avgSleep.toFixed(1)}h (recommended: 7.5h+)`
        );
      } else if (avgSleep < 6.8) {
        score += 16;
        factors.push(
          `Moderate sleep shortfall: 3-day average is ${avgSleep.toFixed(1)}h`
        );
      }

      if (avgQuality <= 5) {
        score += 10;
        factors.push(
          `Sub-optimal sleep recovery rating (${avgQuality.toFixed(1)}/10)`
        );
      }
    } else {
      // Default mild baseline if no logs yet
      score += 5;
    }

    // --- VECTOR 2: POSTPONEMENT & RESISTANCE VELOCITY (Max 25 pts) ---
    const postponedTasks = tasks.filter((t) => (t.postponedCount || 0) > 0);
    const totalPostponements = postponedTasks.reduce(
      (acc, t) => acc + (t.postponedCount || 0),
      0
    );

    if (totalPostponements >= 4) {
      score += 24;
      factors.push(
        `High task friction: ${totalPostponements} task postponements recorded`
      );
    } else if (totalPostponements >= 2) {
      score += 14;
      factors.push(
        `Emerging resistance: ${totalPostponements} postponements on priority items`
      );
    }

    // --- VECTOR 3: ENERGY & STRESS DECAY (Max 25 pts) ---
    const recentMood = moodLogs.slice(0, 2);
    if (recentMood.length > 0) {
      const latest = recentMood[0];
      if (latest.energy <= 4) {
        score += 15;
        factors.push(
          `Subjective energy dropped to low baseline (${latest.energy}/10)`
        );
      } else if (latest.energy <= 6) {
        score += 8;
      }

      if (latest.stress >= 7) {
        score += 12;
        factors.push(`Elevated neurological stress recorded (${latest.stress}/10)`);
      }
    }

    // --- VECTOR 4: OVER-ALLOCATION & CAPACITY STRAIN (Max 15 pts) ---
    const criticalIncomplete = tasks.filter(
      (t) => t.status !== "completed" && t.status !== "cancelled" && (t.priority === "critical" || t.priority === "high")
    ).length;

    if (criticalIncomplete >= 5 && focusSessions.length < 2) {
      score += 14;
      factors.push(
        `Workload backlog: ${criticalIncomplete} critical tasks pending with limited focus momentum`
      );
    } else if (criticalIncomplete >= 3) {
      score += 6;
    }

    // Cap score at 100
    const finalScore = Math.min(100, Math.max(0, score));

    // Determine level and protocol
    let riskLevel: "low" | "moderate" | "high" = "low";
    let recommendedProtocol: "maintain" | "light_load" | "rest_day" = "maintain";
    let summary = "System momentum is optimal. Biological and cognitive capacity are in balance.";

    if (finalScore >= 65) {
      riskLevel = "high";
      recommendedProtocol = "rest_day";
      summary =
        "Acute slump risk detected. Cognitive burnout likely within 48 hours without immediate decompression. Recommend triggering Low-Power Rest Protocol.";
    } else if (finalScore >= 36) {
      riskLevel = "moderate";
      recommendedProtocol = "light_load";
      summary =
        "Early strain markers observed. Dial back secondary commitments today and protect evening sleep window to prevent momentum collapse.";
    }

    if (factors.length === 0) {
      factors.push("Consistent sleep, balanced workload, and low avoidance friction.");
    }

    return {
      riskScore: finalScore,
      riskLevel,
      contributingFactors: factors,
      recommendedProtocol,
      summary,
      calculatedAt: new Date().toISOString(),
    };
  }
}
