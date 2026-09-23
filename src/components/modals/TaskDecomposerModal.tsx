"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AIService, TaskDecompositionResult } from "@/services/aiService";
import { DataStoreRepository } from "@/repositories/dataStore";
import { Sparkles, Check, ArrowRight, CornerDownRight, Plus } from "lucide-react";

interface TaskDecomposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksAdded?: () => void;
}

export const TaskDecomposerModal: React.FC<TaskDecomposerModalProps> = ({
  isOpen,
  onClose,
  onTasksAdded,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TaskDecompositionResult | null>(null);

  const handleDecompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const res = await AIService.breakDownTask(prompt);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDecomposition = () => {
    if (!result) return;

    // 1. Create project
    const projId = `proj-${Date.now()}`;
    DataStoreRepository.saveProject({
      id: projId,
      userId: "user-demo-1",
      title: result.projectTitle,
      description: `Generated from breakdown: "${prompt}"`,
      status: "active",
      priority: "high",
      progressPercent: 0,
      momentumScore: 75,
      timeInvestedMinutes: 0,
      nextActionTitle: result.immediateNextAction,
      milestones: result.milestones.map((m, i) => ({
        id: `m-${Date.now()}-${i}`,
        projectId: projId,
        title: m,
        isCompleted: false,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2. Create tasks
    result.tasks.forEach((t, i) => {
      DataStoreRepository.saveTask({
        id: `task-${Date.now()}-${i}`,
        userId: "user-demo-1",
        projectId: projId,
        title: t.title,
        priority: t.priority,
        status: i === 0 ? "today" : "planned",
        estimatedMinutes: t.estimatedMinutes,
        actualMinutesSpent: 0,
        energyRequirement: t.energy,
        postponedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    if (onTasksAdded) onTasksAdded();
    onClose();
    setResult(null);
    setPrompt("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Decomposer Engine"
      description="Convert large, intimidating ambitions into 3-5 concrete actionable slices."
      maxWidth="lg"
    >
      {!result ? (
        <form onSubmit={handleDecompose} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
              What ambition or large project do you want to deconstruct?
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Build an AI-powered SaaS MVP, Prepare for final exams..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="gap-2"
            >
              <Sparkles size={15} />
              <span>Decompose into Slices</span>
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs">
            <div className="text-[10px] font-mono uppercase text-brand-600 dark:text-brand-400 font-bold mb-0.5">
              Target Project & Milestones
            </div>
            <div className="font-bold text-foreground text-sm">{result.projectTitle}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.milestones.map((m, idx) => (
                <Badge key={idx} variant="default" size="sm">
                  {idx + 1}. {m}
                </Badge>
              ))}
            </div>
          </div>

          {/* Generated tasks */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-surface-600 dark:text-surface-400 block">
              Concrete Action Steps (Editable):
            </span>
            {result.tasks.map((task, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-surface-200/80 dark:border-surface-700/80 bg-surface-50/70 dark:bg-surface-800/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-brand-500 font-bold">{idx + 1}.</span>
                  <span className="font-medium text-foreground">{task.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={task.priority as any} size="sm">
                    {task.priority}
                  </Badge>
                  <span className="font-mono text-surface-400 text-[11px]">
                    {task.estimatedMinutes}m
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Immediate Next Action */}
          <div className="p-3 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs flex items-center gap-2">
            <CornerDownRight size={14} className="text-brand-500 shrink-0" />
            <div>
              <span className="font-semibold text-foreground">Suggested First Action: </span>
              <span className="text-surface-600 dark:text-surface-300">{result.immediateNextAction}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-surface-200 dark:border-surface-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setResult(null)}
              className="text-xs text-surface-500"
            >
              Start Over
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleApplyDecomposition}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-500"
            >
              <Check size={16} />
              <span>Apply Slices to My OS</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
