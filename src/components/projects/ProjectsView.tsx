"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { Project, Milestone } from "@/types";
import {
  FolderKanban,
  Plus,
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { QuickActionModal } from "@/components/layout/QuickActionModal";

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const loadData = () => {
    setProjects(DataStoreRepository.getProjects());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("ptos-data-change", loadData);
    return () => window.removeEventListener("ptos-data-change", loadData);
  }, []);

  const handleToggleMilestone = (project: Project, milestoneId: string) => {
    const updated = {
      ...project,
      milestones: project.milestones.map((m) =>
        m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
      ),
    };
    const completed = updated.milestones.filter((m) => m.isCompleted).length;
    updated.progressPercent = Math.round((completed / updated.milestones.length) * 100);
    DataStoreRepository.saveProject(updated);
  };

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === "all") return true;
    return p.status === filterStatus;
  });

  const activeCount = projects.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200/80 dark:border-surface-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold">
            EXECUTION PIPELINE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Projects & Milestones
          </h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
            Track momentum, active blockers, and tangible milestone velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuickActionOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Plus size={15} />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Project Fragmentation Warning (Section 88) */}
      {activeCount > 3 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500 shrink-0" />
            <span>
              <strong>Project Fragmentation Notice:</strong> You have {activeCount} simultaneously active projects. Consider pausing non-critical ones to concentrate momentum.
            </span>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        {["all", "active", "planned", "completed"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
              filterStatus === st
                ? "bg-brand-500 text-white shadow-xs"
                : "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:text-foreground"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => {
          const hoursInvested = (p.timeInvestedMinutes / 60).toFixed(1);
          return (
            <Card key={p.id} className="p-5 space-y-4 hoverEffect">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={p.status === "active" ? "brand" : "default"}>
                      {p.status}
                    </Badge>
                    <span className="text-[11px] font-mono text-surface-400 flex items-center gap-1">
                      <Clock size={12} /> {hoursInvested}h invested
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{p.title}</h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 font-mono text-sm font-bold text-amber-500 justify-end">
                    <Flame size={14} />
                    <span>{p.momentumScore}%</span>
                  </div>
                  <span className="text-[10px] text-surface-400 uppercase">Momentum</span>
                </div>
              </div>

              {/* Next Action Box */}
              {p.nextActionTitle && (
                <div className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-200/50 dark:border-surface-700/40 text-xs flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] font-mono uppercase text-brand-600 dark:text-brand-400 font-bold block">
                      Next Action
                    </span>
                    <span className="font-medium text-foreground truncate block">
                      {p.nextActionTitle}
                    </span>
                  </div>
                </div>
              )}

              {/* Milestones Checklist */}
              {p.milestones && p.milestones.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400 font-semibold block">
                    Milestones ({p.milestones.filter((m) => m.isCompleted).length}/{p.milestones.length})
                  </span>
                  <div className="space-y-1">
                    {p.milestones.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleToggleMilestone(p, m.id)}
                        className={`w-full text-left p-2 rounded-lg border text-xs flex items-center gap-2.5 transition-colors ${
                          m.isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/20 text-surface-400 line-through"
                            : "bg-surface-50/50 dark:bg-surface-800/40 border-surface-200 dark:border-surface-700/60 text-foreground"
                        }`}
                      >
                        {m.isCompleted ? (
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                          <Circle size={14} className="text-surface-400 shrink-0" />
                        )}
                        <span>{m.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <div className="w-full bg-surface-200 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${p.progressPercent}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultTab="project"
      />
    </div>
  );
};
