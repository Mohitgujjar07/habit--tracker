import Link from "next/link";
import {
  Zap,
  Target,
  Brain,
  Activity,
  ArrowRight,
  Sparkles,
  LifeBuoy,
  Lock,
  Layers,
  ChevronRight,
  Moon,
  Smartphone,
  Dumbbell,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-orange-500/20">
      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex items-center justify-between backdrop-blur-md sticky top-0 z-30 bg-white/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm border border-orange-200 bg-orange-50 shrink-0">
            <img
              src="/logo.png"
              alt="comeback.mjg Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-base text-slate-900">
              comeback<span className="text-orange-500">.mjg</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block leading-none">
              A BETTER YOU. EVERYDAY.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-bold px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Live Demo
          </Link>
          <Link
            href="/onboarding"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white shadow-sm shadow-orange-500/20 transition-all"
          >
            Start Setup
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 sm:py-20 max-w-5xl mx-auto space-y-10 animate-in fade-in">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-orange-50 text-orange-700 border border-orange-200 shadow-xs">
          <Sparkles size={13} className="text-orange-500" /> SMALL STEPS • BIG CHANGES
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.06]">
            TURN DAILY ACTIONS <br />
            INTO LASTING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500">
              MOMENTUM.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            <strong>comeback.mjg</strong> is a personal operating system built to help you understand yourself, execute meaningful goals, build unbreakable consistency, and adapt based on your real behavior.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 active:scale-98 transition-all"
          >
            <span>START YOUR 90-DAY JOURNEY</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition-all"
          >
            <span>EXPLORE LIVE DASHBOARD</span>
          </Link>
        </div>

        {/* 4 Pillars Highlight (Sleep, Digital, Body, Mind from logo) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-6">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-center gap-3 text-left">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Moon size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Sleep & Rest</div>
              <div className="text-[10px] text-slate-400 font-medium">Biological Baseline</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-center gap-3 text-left">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Smartphone size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Digital Balance</div>
              <div className="text-[10px] text-slate-400 font-medium">Output vs Screen</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-center gap-3 text-left">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Dumbbell size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Body & Strength</div>
              <div className="text-[10px] text-slate-400 font-medium">Workouts & Vitality</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-center gap-3 text-left">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Brain size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Mind & Focus</div>
              <div className="text-[10px] text-slate-400 font-medium">Cognitive Execution</div>
            </div>
          </div>
        </div>

        {/* Splash Screen Visual Showcase */}
        <div className="pt-6 w-full max-w-xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900/5 aspect-[9/16] max-h-[580px] mx-auto">
            <img
              src="/splash.png"
              alt="comeback.mjg Splash Screen Showcase"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-3 font-mono">
            comeback.mjg • Small steps, big changes.
          </p>
        </div>

        {/* The Execution Loop */}
        <div className="pt-12 w-full">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-4">
            THE EXECUTION ENGINE LOOP
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold text-slate-600">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">INFORMATION</span>
            <span>→</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">DECISION</span>
            <span>→</span>
            <span className="px-3 py-1.5 rounded-xl bg-orange-500 text-white shadow-sm">ACTION</span>
            <span>→</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">EVIDENCE</span>
            <span>→</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">REFLECTION</span>
            <span>→</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">ADAPTATION</span>
            <span>→</span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white shadow-sm">BETTER ACTION</span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-12 text-left w-full">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-card space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Next Action Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Eliminates decision fatigue. The engine calculates the single highest-impact action matching your energy and time.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-card space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <LifeBuoy size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">I'm Stuck Reset</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              When resistance strikes, shrink the action into an immediate 2-minute micro step to restore momentum without guilt.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-card space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Activity size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Biological Baseline</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Track sleep consistency, workout volume, and energy levels without pseudoscience or medical overreach.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-card space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Brain size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Identity & Evidence</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Actions become proof. Build an undeniable bank of evidence showing you finish what you start.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-card space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Layers size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Personal Operating Manual</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              A dynamic user manual synthesizing your best work windows, triggers, and proven recovery protocols.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-card space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Privacy & Local-First</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              You own your records. Export anytime in JSON/CSV, toggle AI access granularly, and run completely offline.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500 bg-white">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src="/logo.png" alt="Logo" className="w-5 h-5 rounded-md" />
          <span className="font-bold text-slate-900">comeback.mjg</span>
        </div>
        <p className="font-medium">A better you. Everyday. Small steps, big changes.</p>
        <p className="mt-1 text-[11px] text-slate-400">
          Personal Transformation OS • Built for execution, not procrastination.
        </p>
      </footer>
    </div>
  );
}
