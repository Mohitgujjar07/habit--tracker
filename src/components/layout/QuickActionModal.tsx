"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DataStoreRepository } from "@/repositories/dataStore";
import {
  CheckSquare,
  FolderKanban,
  Target,
  Smile,
  Moon,
  Dumbbell,
  AlertCircle,
  Flame,
} from "lucide-react";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "task",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Form states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<"critical" | "high" | "medium" | "low">("high");
  const [taskMinutes, setTaskMinutes] = useState(30);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState<"BUILD" | "BECOME" | "IMPROVE" | "LEARN">("BUILD");

  const [moodVal, setMoodVal] = useState(7);
  const [energyVal, setEnergyVal] = useState(7);
  const [stressVal, setStressVal] = useState(4);
  const [moodTrigger, setMoodTrigger] = useState("");

  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(8);

  const [distractionTrigger, setDistractionTrigger] = useState("Bored");
  const [distractionNote, setDistractionNote] = useState("");

  const [frustrationContext, setFrustrationContext] = useState("");
  const [frustrationLevel, setFrustrationLevel] = useState(6);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    DataStoreRepository.saveTask({
      id: `task-${Date.now()}`,
      userId: "user-demo-1",
      title: taskTitle.trim(),
      priority: taskPriority,
      status: "today",
      estimatedMinutes: taskMinutes,
      actualMinutesSpent: 0,
      energyRequirement: taskPriority === "critical" ? "high" : "medium",
      postponedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setTaskTitle("");
    onClose();
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    DataStoreRepository.saveProject({
      id: `proj-${Date.now()}`,
      userId: "user-demo-1",
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      status: "active",
      priority: "high",
      progressPercent: 0,
      momentumScore: 70,
      timeInvestedMinutes: 0,
      milestones: [{ id: `m-${Date.now()}`, projectId: `proj-${Date.now()}`, title: "Initial Milestone", isCompleted: false }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setProjectTitle("");
    setProjectDesc("");
    onClose();
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    DataStoreRepository.saveGoal({
      id: `goal-${Date.now()}`,
      userId: "user-demo-1",
      title: goalTitle.trim(),
      description: "90-day outcome priority",
      why: "Key driver of personal transformation",
      category: goalCategory,
      priority: "high",
      targetDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
      progressPercent: 0,
      status: "active",
      milestones: ["Define deliverables", "Midpoint review", "Final completion"],
      projectIds: [],
      habitIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setGoalTitle("");
    onClose();
  };

  const handleLogMood = (e: React.FormEvent) => {
    e.preventDefault();
    DataStoreRepository.saveMoodLog({
      id: `mood-${Date.now()}`,
      userId: "user-demo-1",
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      timeOfDay: "afternoon",
      mood: moodVal,
      energy: energyVal,
      stress: stressVal,
      trigger: moodTrigger || undefined,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleLogSleep = (e: React.FormEvent) => {
    e.preventDefault();
    DataStoreRepository.saveSleepLog({
      id: `sleep-${Date.now()}`,
      userId: "user-demo-1",
      date: new Date().toISOString().split("T")[0],
      bedTime: "23:30",
      wakeTime: "07:00",
      durationHours: sleepHours,
      qualityRating: sleepQuality,
      restedFeeling: sleepQuality,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleLogDistraction = (e: React.FormEvent) => {
    e.preventDefault();
    DataStoreRepository.saveDistraction({
      id: `dist-${Date.now()}`,
      userId: "user-demo-1",
      timestamp: new Date().toISOString(),
      trigger: distractionTrigger as any,
      notes: distractionNote || undefined,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleLogFrustration = (e: React.FormEvent) => {
    e.preventDefault();
    DataStoreRepository.saveFrustration({
      id: `frust-${Date.now()}`,
      userId: "user-demo-1",
      frustrationLevel,
      whatHappened: frustrationContext,
      actionTaken: "Logged in OS instead of impulse quitting",
      didQuit: false,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const tabs = [
    { key: "task", label: "Task", icon: CheckSquare },
    { key: "project", label: "Project", icon: FolderKanban },
    { key: "goal", label: "Goal", icon: Target },
    { key: "mood", label: "Mood & Energy", icon: Smile },
    { key: "sleep", label: "Sleep", icon: Moon },
    { key: "distraction", label: "Distraction", icon: AlertCircle },
    { key: "frustration", label: "Frustration", icon: Flame },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Action" maxWidth="lg">
      {/* Tab selection */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-surface-200/80 dark:border-surface-700/60 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                  : "text-surface-500 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Task Form */}
      {activeTab === "task" && (
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement webhook authentication receiver"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-foreground focus:outline-none"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
                Estimated Minutes
              </label>
              <input
                type="number"
                min={5}
                max={180}
                step={5}
                value={taskMinutes}
                onChange={(e) => setTaskMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-foreground focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Create Task
            </Button>
          </div>
        </form>
      )}

      {/* Project Form */}
      {activeTab === "project" && (
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Core Telemetry Ingestion Engine"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
              Outcome Description
            </label>
            <textarea
              rows={2}
              placeholder="What tangible output marks this project complete?"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Create Project
            </Button>
          </div>
        </form>
      )}

      {/* Goal Form */}
      {activeTab === "goal" && (
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
              90-Day Vision Goal
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ship SaaS MVP with first 5 beta pilots"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["BUILD", "BECOME", "IMPROVE", "LEARN"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGoalCategory(cat)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    goalCategory === cat
                      ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400"
                      : "border-surface-200 dark:border-surface-700 text-surface-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Create 90-Day Goal
            </Button>
          </div>
        </form>
      )}

      {/* Mood Form */}
      {activeTab === "mood" && (
        <form onSubmit={handleLogMood} className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Mood (1-10)</span>
                <span className="font-mono text-brand-600 dark:text-brand-400">{moodVal}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={moodVal}
                onChange={(e) => setMoodVal(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Energy (1-10)</span>
                <span className="font-mono text-brand-600 dark:text-brand-400">{energyVal}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={energyVal}
                onChange={(e) => setEnergyVal(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Stress (1-10)</span>
                <span className="font-mono text-rose-500">{stressVal}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={stressVal}
                onChange={(e) => setStressVal(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Save Entry
            </Button>
          </div>
        </form>
      )}

      {/* Distraction Form */}
      {activeTab === "distraction" && (
        <form onSubmit={handleLogDistraction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
              What triggered the urge to distract?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Bored", "Tired", "Stressed", "Avoiding work", "Lonely", "Habit"].map((trig) => (
                <button
                  key={trig}
                  type="button"
                  onClick={() => setDistractionTrigger(trig)}
                  className={`py-1.5 text-xs rounded-lg border text-center transition-colors ${
                    distractionTrigger === trig
                      ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-semibold"
                      : "border-surface-200 dark:border-surface-700 text-surface-500"
                  }`}
                >
                  {trig}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
              What were you trying to avoid? (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Unclear error message in terminal"
              value={distractionNote}
              onChange={(e) => setDistractionNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-foreground focus:outline-none"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="danger" size="md">
              Log Distraction Impulse
            </Button>
          </div>
        </form>
      )}

      {/* Frustration Form */}
      {activeTab === "frustration" && (
        <form onSubmit={handleLogFrustration} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
              What caused friction or resistance?
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Tried to implement state synchronization and hit unexpected re-renders..."
              value={frustrationContext}
              onChange={(e) => setFrustrationContext(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Frustration Intensity (1-10)</span>
              <span className="font-mono text-rose-500">{frustrationLevel}/10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={frustrationLevel}
              onChange={(e) => setFrustrationLevel(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Record in Journal
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
