"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { CommandCenter } from "@/components/layout/CommandCenter";
import { QuickActionModal } from "@/components/layout/QuickActionModal";
import { ImStuckModal } from "@/components/modals/ImStuckModal";
import { BadDayModal } from "@/components/modals/BadDayModal";
import { UrgeSurferModal } from "@/components/modals/UrgeSurferModal";
import { VoiceCheckinModal } from "@/components/modals/VoiceCheckinModal";
import { AICoachDrawer } from "@/components/drawers/AICoachDrawer";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionTab, setQuickActionTab] = useState("task");
  const [isStuckOpen, setIsStuckOpen] = useState(false);
  const [isUrgeOpen, setIsUrgeOpen] = useState(false);
  const [isVoiceCheckinOpen, setIsVoiceCheckinOpen] = useState(false);
  const [isBadDayOpen, setIsBadDayOpen] = useState(false);
  const [isBadDayActive, setIsBadDayActive] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  const handleCommandSelect = (actionKey: string) => {
    setIsCommandOpen(false);
    if (actionKey === "open_palette") {
      setIsCommandOpen(true);
    } else if (actionKey === "new_task") {
      setQuickActionTab("task");
      setIsQuickActionOpen(true);
    } else if (actionKey === "new_project") {
      setQuickActionTab("project");
      setIsQuickActionOpen(true);
    } else if (actionKey === "new_goal") {
      setQuickActionTab("goal");
      setIsQuickActionOpen(true);
    } else if (actionKey === "log_mood") {
      setQuickActionTab("mood");
      setIsQuickActionOpen(true);
    } else if (actionKey === "log_sleep") {
      setQuickActionTab("sleep");
      setIsQuickActionOpen(true);
    } else if (actionKey === "distraction") {
      setQuickActionTab("distraction");
      setIsQuickActionOpen(true);
    } else if (actionKey === "frustration") {
      setQuickActionTab("frustration");
      setIsQuickActionOpen(true);
    } else if (actionKey === "voice_checkin") {
      setIsVoiceCheckinOpen(true);
    } else if (actionKey === "urge_surfer") {
      setIsUrgeOpen(true);
    } else if (actionKey === "stuck") {
      setIsStuckOpen(true);
    } else if (actionKey === "bad_day") {
      setIsBadDayOpen(true);
    } else if (actionKey === "ai_coach") {
      setIsAICoachOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar
        onOpenCommandCenter={() => setIsCommandOpen(true)}
        onOpenQuickAction={() => {
          setQuickActionTab("task");
          setIsQuickActionOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <Header
          onOpenStuckModal={() => setIsStuckOpen(true)}
          onOpenUrgeSurfer={() => setIsUrgeOpen(true)}
          onOpenVoiceCheckin={() => setIsVoiceCheckinOpen(true)}
          onOpenBadDayMode={() => setIsBadDayOpen(true)}
          onOpenQuickAction={() => {
            setQuickActionTab("task");
            setIsQuickActionOpen(true);
          }}
          onOpenAICoach={() => setIsAICoachOpen(true)}
          onOpenCommandCenter={() => setIsCommandOpen(true)}
          isBadDayModeActive={isBadDayActive}
        />

        <main className="flex-1 px-4 sm:px-8 py-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        onOpenQuickAction={() => {
          setQuickActionTab("task");
          setIsQuickActionOpen(true);
        }}
      />

      {/* Global Modals & Drawers */}
      <CommandCenter
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectAction={handleCommandSelect}
      />

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultTab={quickActionTab}
        onOpenUrgeSurfer={() => setIsUrgeOpen(true)}
      />

      <UrgeSurferModal
        isOpen={isUrgeOpen}
        onClose={() => setIsUrgeOpen(false)}
      />

      <VoiceCheckinModal
        isOpen={isVoiceCheckinOpen}
        onClose={() => setIsVoiceCheckinOpen(false)}
      />

      <ImStuckModal
        isOpen={isStuckOpen}
        onClose={() => setIsStuckOpen(false)}
      />

      <BadDayModal
        isOpen={isBadDayOpen}
        onClose={() => setIsBadDayOpen(false)}
        isActive={isBadDayActive}
        onToggleMode={setIsBadDayActive}
      />

      <AICoachDrawer
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
      />
    </div>
  );
};
