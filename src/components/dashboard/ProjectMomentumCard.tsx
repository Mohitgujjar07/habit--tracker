"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Project } from "@/types";
import { FolderKanban, ArrowUpRight, Flame, Clock, CheckCircle } from "lucide-react";

interface ProjectMomentumCardProps {
  projects: Project[];
}

export const ProjectMomentumCard: React.FC<ProjectMomentumCardProps> = ({ projects }) => {
  const activeProjects = projects.filter((p) => p.status === "active").slice(0, 3);

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400 font-semibold block">
            PROJECT MOMENTUM
          </span>
          <h3 className="text-base font-bold tracking-tight text-foreground">
            Active Trajectories
          </h3>
        </div>
        <Link
          href="/projects"
          className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
        >
          <span>All Projects</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeProjects.map((p) => {
          const activeMilestone = p.milestones.find((m) => !m.isCompleted);
          return (
            <div
              key={p.id}
              className="p-3.5 rounded-xl border border-surface-200/80 dark:border-surface-700/60 bg-surface-50/60 dark:bg-surface-800/40 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{p.title}</h4>
                  <p className="text-[11px] text-surface-400 line-clamp-1">{p.description}</p>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-500">
                  <Flame size={13} />
                  <span>{p.momentumScore}%</span>
                </div>
              </div>

              {/* Current milestone & next action */}
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-surface-500 dark:text-surface-400">
                  <span>Current Milestone:</span>
                  <span className="font-semibold text-foreground">
                    {activeMilestone ? activeMilestone.title : "All Complete"}
                  </span>
                </div>
                {p.nextActionTitle && (
                  <div className="flex items-center justify-between text-surface-500 dark:text-surface-400">
                    <span>Next Action:</span>
                    <span className="font-medium text-brand-600 dark:text-brand-400 truncate max-w-[180px]">
                      {p.nextActionTitle}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-200 dark:bg-surface-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full transition-all"
                  style={{ width: `${p.progressPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
