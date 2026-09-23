"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Code2, GitCommit, Rocket, Bug, Terminal, Clock, Flame } from "lucide-react";

export const DeveloperDashboard: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200/80 dark:border-surface-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
            DEVELOPER OPERATING SYSTEM
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Code2 size={24} className="text-brand-500" />
            <span>Developer Studio Mode</span>
          </h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
            Execution metrics for software builders: coding velocity, bug resolutions, and deployments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-medium">Coding Deep Work</span>
            <Clock size={15} className="text-brand-400" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground">34.5 hrs</div>
          <span className="text-[10px] text-surface-400">Past 14 days</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-medium">Deployments</span>
            <Rocket size={15} className="text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground">6 MVP Builds</div>
          <span className="text-[10px] text-surface-400">Production releases</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-medium">Problems Solved</span>
            <Bug size={15} className="text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground">18 Roadblocks</div>
          <span className="text-[10px] text-surface-400">Overcome without quitting</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-surface-400">
            <span className="text-[11px] font-medium">Pipeline Health</span>
            <Terminal size={15} className="text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground">98.2%</div>
          <span className="text-[10px] text-surface-400">Test pass rate</span>
        </Card>
      </div>

      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground">Active Software Tech Stack</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {["TypeScript", "Next.js", "Firebase", "Node.js", "Tailwind CSS", "Jest", "Git/GitHub", "Docker"].map((tech) => (
            <Badge key={tech} variant="brand" size="md">
              {tech}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};
