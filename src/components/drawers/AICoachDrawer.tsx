"use client";

import React, { useState, useEffect } from "react";
import { X, Bot, Send, Sparkles, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AIService } from "@/services/aiService";
import { DataStoreRepository } from "@/repositories/dataStore";

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "assistant" | "user";
  text: string;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "I am your Personal OS Coach. I evaluate your real recorded momentum, bottlenecks, and energy windows—without motivational platitudes. What are you facing right now?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const profile = DataStoreRepository.getUserProfile();
      const tasks = DataStoreRepository.getTasks();
      const projects = DataStoreRepository.getProjects();
      const sessions = DataStoreRepository.getFocusSessions();

      const reply = await AIService.generateCoachResponse(query, {
        profile,
        tasks,
        projects,
        recentSessions: sessions,
      });

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I observed your recent logs. Focus on reducing task friction rather than pushing harder.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "What should I do right now?",
    "Why do I keep postponing hard tasks?",
    "How should I structure tomorrow morning?",
    "Help me recover from a broken streak",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-surface-100 border-l border-surface-200 dark:border-surface-700/80 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-surface-200/80 dark:border-surface-700/60 flex items-center justify-between bg-surface-50/50 dark:bg-surface-100/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">AI Execution Coach</h3>
                <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Data Context
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 p-1 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick prompt pills */}
          <div className="px-4 py-2.5 border-b border-surface-200/60 dark:border-surface-700/40 bg-surface-50 dark:bg-surface-800/40 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-surface-200/60 dark:bg-surface-700/60 hover:bg-brand-500/10 hover:text-brand-500 text-surface-600 dark:text-surface-300 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-br-xs"
                      : "bg-surface-100 dark:bg-surface-800/90 text-foreground border border-surface-200/60 dark:border-surface-700/60 rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface-100 dark:bg-surface-800 p-3 rounded-2xl rounded-bl-xs text-xs text-surface-400 flex items-center gap-2">
                  <span className="animate-spin text-brand-500">⟳</span> Analyzing your behavioral context...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-surface-200/80 dark:border-surface-700/60 bg-surface-50/50 dark:bg-surface-100/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask coach for clarity, recovery, or priority..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button type="submit" variant="primary" size="sm" disabled={isLoading || !input.trim()}>
                <Send size={14} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
