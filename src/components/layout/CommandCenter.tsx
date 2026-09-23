"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Zap,
  CheckSquare,
  FolderKanban,
  Target,
  Smile,
  Moon,
  Dumbbell,
  LifeBuoy,
  ShieldAlert,
  Bot,
  Flame,
  FileText,
  AlertCircle,
} from "lucide-react";

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionKey: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction("open_palette");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const commands = [
    { id: "start_focus", title: "Start Focus Session", icon: Zap, category: "Execution", action: () => router.push("/focus") },
    { id: "create_task", title: "Create New Task", icon: CheckSquare, category: "Execution", action: () => onSelectAction("new_task") },
    { id: "create_project", title: "Create New Project", icon: FolderKanban, category: "Planning", action: () => onSelectAction("new_project") },
    { id: "create_goal", title: "Create 90-Day Goal", icon: Target, category: "Planning", action: () => onSelectAction("new_goal") },
    { id: "log_mood", title: "Log Mood & Energy", icon: Smile, category: "Mind", action: () => onSelectAction("log_mood") },
    { id: "log_sleep", title: "Log Sleep & Recovery", icon: Moon, category: "Body", action: () => onSelectAction("log_sleep") },
    { id: "log_workout", title: "Log Workout Session", icon: Dumbbell, category: "Body", action: () => onSelectAction("log_workout") },
    { id: "log_distraction", title: "Capture Distraction Trigger", icon: AlertCircle, category: "Digital", action: () => onSelectAction("distraction") },
    { id: "im_stuck", title: "I'm Stuck (2-Min Action)", icon: LifeBuoy, category: "Intervention", action: () => onSelectAction("stuck") },
    { id: "bad_day_mode", title: "Toggle Bad Day Recovery Mode", icon: ShieldAlert, category: "Intervention", action: () => onSelectAction("bad_day") },
    { id: "open_ai_coach", title: "Ask AI Coach", icon: Bot, category: "Intelligence", action: () => onSelectAction("ai_coach") },
    { id: "frustration_log", title: "Log Frustration & Resistance", icon: Flame, category: "Reflection", action: () => onSelectAction("frustration") },
    { id: "view_progress", title: "View Transformation Analytics", icon: FileText, category: "Analytics", action: () => router.push("/progress") },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95">
        {/* Search input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search size={18} className="text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
          />
          <kbd className="font-mono text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-orange-50/80 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                      <Icon size={16} />
                    </div>
                    <span>{cmd.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
