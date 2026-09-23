"use client";

import React, { useState } from "react";
import { X, Bot, Send } from "lucide-react";
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
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">AI Execution Coach</h3>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Data Context
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick prompt pills */}
          <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 text-slate-600 font-medium transition-all shadow-xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/30">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                    m.role === "user"
                      ? "bg-orange-600 text-white rounded-br-xs font-medium"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-xs text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                  <span className="animate-spin text-orange-500">⟳</span> Analyzing your behavioral context...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white">
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
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
