"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Shield,
  Smartphone,
  Laptop,
  CheckCircle2,
  Copy,
  ExternalLink,
  Zap,
  Lock,
  ArrowRight,
  ShieldCheck,
  Settings2,
  Sliders,
  Check,
  Play,
} from "lucide-react";

interface ShieldHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestInterception?: (appName: string) => void;
}

export const ShieldHubModal: React.FC<ShieldHubModalProps> = ({
  isOpen,
  onClose,
  onTestInterception,
}) => {
  const [activeTab, setActiveTab] = useState<"android" | "ios" | "desktop">("ios");
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState("Instagram");
  const [isNativeAndroid, setIsNativeAndroid] = useState(false);

  useEffect(() => {
    // Check if running inside Capacitor native Android
    if (typeof window !== "undefined") {
      const isCapacitor = !!(window as any).Capacitor;
      setIsNativeAndroid(isCapacitor);
      if (isCapacitor) {
        setActiveTab("android");
      }
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2500);
  };

  const getIosDeepLink = (app: string) => {
    if (typeof window === "undefined") {
      return `https://ptos-exec-89214.web.app/mind?mode=urge_surf&app=${encodeURIComponent(app)}&source=ios_shortcut`;
    }
    const origin = window.location.origin;
    return `${origin}/mind?mode=urge_surf&app=${encodeURIComponent(app)}&source=ios_shortcut`;
  };

  const openAndroidSettings = () => {
    const Cap = (window as any).Capacitor;
    if (Cap && Cap.Plugins && Cap.Plugins.LockdownShield) {
      Cap.Plugins.LockdownShield.openAccessibilitySettings();
    } else {
      alert("Opening Android Accessibility Settings is active when running inside the native APK. On standard web browsers, open Android Settings > Accessibility > comeback.mjg.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Distraction Lockdown Shield Hub"
      maxWidth="2xl"
    >
      <div className="space-y-5 text-slate-800">
        {/* Subtitle */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 font-bold block">
              CROSS-PLATFORM BEHAVIORAL INTERCEPTION
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              Automatically redirect compulsive digital urges into the 90-second physiological reset across all your devices.
            </p>
          </div>
          <Badge variant="brand" size="sm" className="hidden sm:inline-flex">
            All Systems Active
          </Badge>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab("ios")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "ios"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone size={14} />
            <span>iPhone / iOS</span>
          </button>
          <button
            onClick={() => setActiveTab("android")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "android"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Shield size={14} />
            <span>Android Native</span>
          </button>
          <button
            onClick={() => setActiveTab("desktop")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "desktop"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Laptop size={14} />
            <span>PC / Chrome Ext</span>
          </button>
        </div>

        {/* TAB 1: iOS SHORTCUTS AUTOMATION */}
        {activeTab === "ios" && (
          <div className="space-y-4 animate-in fade-in">
            <Card className="p-4 bg-orange-50/60 border-orange-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-orange-600 text-white font-bold text-xs">
                  0 CODE REQUIRED
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Instant Apple Shortcuts Automation (Takes 60 Seconds)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whenever you tap Instagram or YouTube on your iPhone, Apple Shortcuts automatically intercepts the launch and redirects you immediately into <strong>comeback.mjg</strong> for a 90-second dopamine reset.
              </p>
            </Card>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Setup Steps on iPhone:
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900 block">Open Apple Shortcuts App</strong>
                    <span className="text-slate-500">Tap the <strong>Automation</strong> tab at the bottom, then tap <strong>+ (New Automation)</strong>.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900 block">Select "App" Trigger</strong>
                    <span className="text-slate-500">Choose when <strong>[Instagram, YouTube, or X]</strong> is opened. Select <strong>"Run Immediately"</strong> and uncheck "Notify When Run".</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900 block">Add Action: "Open URLs"</strong>
                    <span className="text-slate-500">Search for the action <strong>"Open URLs"</strong> and paste your personalized interception URL below.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyable Deep-Link URL Generator */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Your Interception Deep-Link URL</span>
                <div className="flex gap-1">
                  {["Instagram", "YouTube", "X / Twitter", "Reddit"].map((app) => (
                    <button
                      key={app}
                      onClick={() => setSelectedApp(app)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                        selectedApp === app
                          ? "bg-orange-600 text-white"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getIosDeepLink(selectedApp)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 select-all"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => copyToClipboard(getIosDeepLink(selectedApp), "ios_url")}
                  className="bg-orange-600 hover:bg-orange-500 text-xs shrink-0 gap-1.5 font-bold"
                >
                  {isCopied === "ios_url" ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied === "ios_url" ? "Copied!" : "Copy"}</span>
                </Button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Ready to test? Tap below to simulate the exact iPhone interception flow:
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    if (onTestInterception) {
                      onTestInterception(selectedApp);
                    }
                  }}
                  className="text-xs font-bold border-orange-200 bg-white text-orange-700 hover:bg-orange-50 gap-1"
                >
                  <Play size={12} /> Test Flow Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANDROID NATIVE APP (CAPACITOR + ACCESSIBILITY) */}
        {activeTab === "android" && (
          <div className="space-y-4 animate-in fade-in">
            <Card className="p-4 bg-emerald-50/70 border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600" size={18} />
                  <span className="text-xs font-bold text-emerald-950">
                    Capacitor Native Android Shield Ready
                  </span>
                </div>
                <Badge variant={isNativeAndroid ? "success" : "default"} size="sm">
                  {isNativeAndroid ? "APK Native Mode" : "Web Preview Mode"}
                </Badge>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                The native Android project is generated in <code>android/</code> with our custom <strong><code>LockdownAccessibilityService</code></strong>. It monitors foreground window state changes and brings comeback.mjg into the foreground when blacklisted apps launch.
              </p>
            </Card>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Autonomous App Blacklist:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: "Instagram", pkg: "com.instagram.android" },
                  { name: "YouTube", pkg: "com.google.android.youtube" },
                  { name: "X / Twitter", pkg: "com.twitter.android" },
                  { name: "TikTok", pkg: "com.zhiliaoapp.musically" },
                  { name: "Reddit", pkg: "com.reddit.frontpage" },
                  { name: "Snapchat", pkg: "com.snapchat.android" },
                ].map((item) => (
                  <div
                    key={item.pkg}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-slate-800 block text-[11px]">{item.name}</strong>
                      <span className="text-[9px] text-slate-400 font-mono block truncate max-w-[120px]">{item.pkg}</span>
                    </div>
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Accessibility Service Permission</strong>
                  <span className="text-slate-500">Required on Android to detect when distracting apps become active.</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openAndroidSettings}
                  className="text-xs font-bold border-slate-300 gap-1.5"
                >
                  <Settings2 size={13} /> Open Settings
                </Button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-100 text-[11px] text-slate-600 font-mono">
              Build Command: <code>npx cap sync android &amp;&amp; npx cap open android</code>
            </div>
          </div>
        )}

        {/* TAB 3: DESKTOP CHROME / BRAVE EXTENSION */}
        {activeTab === "desktop" && (
          <div className="space-y-4 animate-in fade-in">
            <Card className="p-4 bg-sky-50/70 border-sky-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop className="text-sky-600" size={18} />
                  <span className="text-xs font-bold text-sky-950">
                    Desktop Companion Extension (Manifest V3)
                  </span>
                </div>
                <Badge variant="brand" size="sm">
                  Ready in Local Repo
                </Badge>
              </div>
              <p className="text-xs text-sky-900 leading-relaxed">
                We engineered a dedicated Chrome/Brave extension in <code>companion-extension/</code>. During active deep work blocks, it uses Chrome's <code>declarativeNetRequest</code> API to redirect YouTube, Reddit, Twitter, and Instagram straight to your comeback.mjg focus sprint.
              </p>
            </Card>

            <div className="space-y-2 text-xs">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                How to load in Chrome or Brave (30 Seconds):
              </span>
              <div className="space-y-1.5 text-slate-700">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
                  <span className="font-mono font-bold text-orange-600">1.</span>
                  <span>Navigate to <code>chrome://extensions</code> or <code>brave://extensions</code>.</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
                  <span className="font-mono font-bold text-orange-600">2.</span>
                  <span>Enable <strong>Developer mode</strong> in the top-right corner.</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
                  <span className="font-mono font-bold text-orange-600">3.</span>
                  <span>Click <strong>"Load unpacked"</strong> and select: <code>d:\new projects\habit-tracker\companion-extension</code></span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                Extension folder ready on disk:
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => copyToClipboard("d:\\new projects\\habit-tracker\\companion-extension", "ext_path")}
                className="text-xs font-bold gap-1"
              >
                {isCopied === "ext_path" ? <Check size={13} /> : <Copy size={13} />}
                <span>{isCopied === "ext_path" ? "Copied Path!" : "Copy Folder Path"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-200">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
