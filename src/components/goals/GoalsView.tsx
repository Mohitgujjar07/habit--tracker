"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataStoreRepository } from "@/repositories/dataStore";
import { Goal, GoalHorizon, UserProfile } from "@/types";
import {
  Target,
  Plus,
  Sparkles,
  CheckCircle2,
  Calendar,
  Compass,
  Star,
  Clock,
  Filter,
  Edit3,
  Check,
  X,
  Layers,
  Flame,
  ArrowRight,
} from "lucide-react";
import { TaskDecomposerModal } from "@/components/modals/TaskDecomposerModal";
import { QuickActionModal } from "@/components/layout/QuickActionModal";

const HORIZON_CONFIG: Record<
  GoalHorizon,
  { label: string; short: string; badgeClass: string; desc: string; days: number }
> = {
  "30_days": {
    label: "30-Day Sprint",
    short: "30D Sprint",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    desc: "Rapid habit conditioning & focused execution blocks",
    days: 30,
  },
  "90_days": {
    label: "90-Day Quarter",
    short: "90D Quarter",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    desc: "Tactical deliverable, MVP launch, or major project",
    days: 90,
  },
  "6_months": {
    label: "6-Month Horizon",
    short: "6-Month Arc",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    desc: "Strategic capability shift & biological conditioning",
    days: 180,
  },
  "1_year": {
    label: "1-Year Mission",
    short: "1-Year Mission",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Major life inflection point & financial sovereignty",
    days: 365,
  },
  north_star: {
    label: "North Star (1–3 Yrs)",
    short: "North Star",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    desc: "Guiding life vision anchoring all short-term horizons",
    days: 1000,
  },
};

export const GoalsView: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedHorizon, setSelectedHorizon] = useState<string>("all");
  const [isDecomposerOpen, setIsDecomposerOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // North Star Vision Inline Editing
  const [isEditingNorthStar, setIsEditingNorthStar] = useState(false);
  const [northStarInput, setNorthStarInput] = useState("");

  const loadData = () => {
    setGoals(DataStoreRepository.getGoals());
    const userProfile = DataStoreRepository.getUserProfile();
    setProfile(userProfile);
    if (userProfile?.northStarVision) {
      setNorthStarInput(userProfile.northStarVision);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("ptos-data-change", loadData);
    return () => window.removeEventListener("ptos-data-change", loadData);
  }, []);

  const handleSaveNorthStar = () => {
    if (!profile) return;
    const updatedProfile: UserProfile = {
      ...profile,
      northStarVision: northStarInput.trim() || undefined,
    };
    DataStoreRepository.saveUserProfile(updatedProfile);
    setIsEditingNorthStar(false);
  };

  const handleToggleMilestone = (goal: Goal, milestoneIndex: number) => {
    // Increment or cycle progress
    const totalMilestones = goal.milestones.length || 1;
    const newProgress = Math.min(100, Math.round(goal.progressPercent + 100 / totalMilestones));
    const updatedGoal: Goal = {
      ...goal,
      progressPercent: newProgress >= 100 ? 100 : newProgress,
      status: newProgress >= 100 ? "completed" : goal.status,
    };
    DataStoreRepository.saveGoal(updatedGoal);
  };

  // Filter goals by horizon
  const filteredGoals = goals.filter((g) => {
    if (selectedHorizon === "all") return true;
    return (g.horizon || "90_days") === selectedHorizon;
  });

  // Calculate days remaining helper
  const getDaysRemaining = (targetDate: string) => {
    const diffTime = new Date(targetDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays)) return null;
    return diffDays;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              PERPETUAL MULTI-HORIZON ARCHITECTURE
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              30D • 90D • 6MO • 1YR • NORTH STAR
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            Goals & Strategic Horizons
          </h1>
          <p className="text-xs text-surface-500 mt-0.5">
            Break free from arbitrary limits. Connect your 3-year North Star to 90-day quarters and 30-day tactical sprints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDecomposerOpen(true)}
            className="gap-1.5 text-xs shadow-sm"
          >
            <Sparkles size={14} className="text-orange-500" />
            <span>AI Decomposer</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuickActionOpen(true)}
            className="gap-1.5 text-xs shadow-sm"
          >
            <Plus size={15} />
            <span>New Goal</span>
          </Button>
        </div>
      </div>

      {/* North Star Vision Hero Card */}
      <Card className="p-5 bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-indigo-50/60 border border-orange-200/80 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Compass size={18} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-orange-700">
                1–3 YEAR STRATEGIC ANCHOR
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                North Star Vision
              </h2>
            </div>
          </div>

          {!isEditingNorthStar ? (
            <button
              onClick={() => setIsEditingNorthStar(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-slate-200/60 transition-colors"
            >
              <Edit3 size={12} />
              <span>Edit Vision</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSaveNorthStar}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors shadow-xs"
              >
                <Check size={12} />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setNorthStarInput(profile?.northStarVision || "");
                  setIsEditingNorthStar(false);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-3">
          {isEditingNorthStar ? (
            <textarea
              rows={2}
              value={northStarInput}
              onChange={(e) => setNorthStarInput(e.target.value)}
              placeholder="What is your ultimate 1–3 year vision? (e.g. Build a sovereign software venture that yields true financial & creative independence)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-orange-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
            />
          ) : (
            <p className="text-xs sm:text-sm font-medium text-slate-800 italic leading-relaxed">
              "{profile?.northStarVision || "Build a sovereign, high-impact enterprise that yields complete financial, intellectual, and location independence."}"
            </p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-orange-200/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            Every tactical sprint below feeds directly into this sovereign baseline.
          </span>
          <span className="font-mono text-slate-400">
            Phase: {profile?.transformationPhase || "Perpetual Execution"}
          </span>
        </div>
      </Card>

      {/* Horizon Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedHorizon("all")}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
            selectedHorizon === "all"
              ? "bg-slate-900 text-white shadow-xs font-semibold"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Horizons ({goals.length})
        </button>

        {(["30_days", "90_days", "6_months", "1_year", "north_star"] as GoalHorizon[]).map(
          (hKey) => {
            const count = goals.filter((g) => (g.horizon || "90_days") === hKey).length;
            const config = HORIZON_CONFIG[hKey];
            const isSelected = selectedHorizon === hKey;

            return (
              <button
                key={hKey}
                onClick={() => setSelectedHorizon(hKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-orange-500 text-white border-orange-500 shadow-xs font-semibold"
                    : "bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{config.short}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((g) => {
          const horizonKey = g.horizon || "90_days";
          const horizonInfo = HORIZON_CONFIG[horizonKey] || HORIZON_CONFIG["90_days"];
          const daysRemaining = getDaysRemaining(g.targetDate);

          return (
            <Card
              key={g.id}
              className="p-5 space-y-4 hoverEffect bg-white border-surface-200/80 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header row: category, horizon badge, days remaining */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${horizonInfo.badgeClass}`}
                    >
                      {horizonInfo.label}
                    </span>
                    <Badge variant={g.priority === "critical" ? "critical" : "brand"}>
                      {g.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <Clock size={12} className="text-slate-400" />
                    {daysRemaining !== null ? (
                      daysRemaining > 0 ? (
                        <span className="font-semibold text-slate-700">{daysRemaining}d remaining</span>
                      ) : (
                        <span className="font-semibold text-rose-600">Target Reached</span>
                      )
                    ) : (
                      <span>{g.targetDate}</span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-foreground leading-snug">{g.title}</h3>
                  <p className="text-xs text-surface-600 mt-1 leading-relaxed">{g.description}</p>
                </div>

                {/* Why statement */}
                <div className="p-3 rounded-lg bg-surface-50 border border-surface-200/80 text-xs">
                  <span className="font-semibold text-orange-600">Strategic Anchor: </span>
                  <span className="text-surface-700">{g.why}</span>
                </div>

                {/* Milestones list */}
                {g.milestones && g.milestones.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-surface-400 font-semibold">
                      <span>Milestones & Checkpoints</span>
                      <span>{g.milestones.length} defined</span>
                    </div>
                    <div className="space-y-1.5">
                      {g.milestones.map((m, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleToggleMilestone(g, idx)}
                          className="flex items-center gap-2 text-xs text-surface-600 hover:text-slate-900 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Click to log milestone advancement"
                        >
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          <span className="leading-tight">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar & bottom status */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-500">Execution Progress</span>
                  <span className="font-mono font-bold text-slate-900">{g.progressPercent}%</span>
                </div>
                <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${g.progressPercent}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredGoals.length === 0 && (
        <Card className="p-8 text-center bg-white border-dashed border-slate-300">
          <Target className="mx-auto text-slate-400 mb-2" size={32} />
          <h3 className="text-sm font-bold text-slate-800">No goals in this horizon yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Establish a new goal in this strategic horizon to maintain unbroken alignment with your North Star.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuickActionOpen(true)}
            className="mt-4 gap-1.5 text-xs"
          >
            <Plus size={14} />
            <span>Create Goal</span>
          </Button>
        </Card>
      )}

      <TaskDecomposerModal
        isOpen={isDecomposerOpen}
        onClose={() => setIsDecomposerOpen(false)}
        onTasksAdded={loadData}
      />

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultTab="goal"
      />
    </div>
  );
};
