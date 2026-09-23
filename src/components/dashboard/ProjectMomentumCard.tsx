"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Project } from "@/types";
import { ArrowUpRight, Flame } from "lucide-react";

interface ProjectMomentumCardProps {
  projects: Project[];
}

export const ProjectMomentumCard: React.FC<ProjectMomentumCardProps> = ({ projects }) => {
  const activeProjects = projects.filter((p) => p.status === "active").slice(0, 2);

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            PROJECT MOMENTUM
          </span>
          <h3 className="text-base font-bold tracking-tight text-slate-900">
            Active Trajectories
          </h3>
        </div>
        <Link
          href="/projects"
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <span>All Projects</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="space-y-3">
        {activeProjects.map((p) => {
          const activeMilestone = p.milestones.find((m) => !m.isCompleted);
          return (
            <div
              key={p.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{p.description}</p>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  <Flame size={13} />
                  <span>{p.momentumScore}%</span>
                </div>
              </div>

              {/* Current milestone & next action */}
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Current Milestone:</span>
                  <span className="font-bold text-slate-800">
                    {activeMilestone ? activeMilestone.title : "All Complete"}
                  </span>
                </div>
                {p.nextActionTitle && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Next Action:</span>
                    <span className="font-semibold text-orange-600 truncate max-w-[180px]">
                      {p.nextActionTitle}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all"
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
