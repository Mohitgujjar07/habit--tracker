"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap, BookOpen, Clock, AlertCircle } from "lucide-react";

export const CollegeDashboard: React.FC = () => {
  const subjects = [
    { name: "Distributed Systems & Cloud Computing", examInDays: 18, pendingAssignments: 1 },
    { name: "Algorithms & Complexity", examInDays: 24, pendingAssignments: 2 },
    { name: "Database Engineering", examInDays: 32, pendingAssignments: 0 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 font-bold">
            ACADEMIC EXECUTION ENGINE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <GraduationCap size={24} className="text-brand-500" />
            <span>College & Academic Mode</span>
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Subject pipelines, assignment deadlines, and exam study blocks connected to focus sessions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map((sub) => (
          <Card key={sub.name} className="p-5 space-y-3 bg-white border-surface-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <Badge variant="brand">Course Subject</Badge>
              <span className="font-mono text-xs text-amber-500 font-bold">
                Exam in {sub.examInDays}d
              </span>
            </div>
            <h4 className="text-sm font-bold text-foreground">{sub.name}</h4>
            <div className="text-xs text-surface-500 flex items-center justify-between pt-2 border-t border-surface-200">
              <span>Pending Tasks:</span>
              <span className="font-bold text-foreground">
                {sub.pendingAssignments} Assignments
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
