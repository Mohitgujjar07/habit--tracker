import Link from "next/link";
import {
  Zap,
  Target,
  Shield,
  Brain,
  Activity,
  ArrowRight,
  Sparkles,
  LifeBuoy,
  Lock,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand-500/20">
      {/* Navigation Header */}
      <header className="border-b border-surface-200/60 dark:border-surface-800/80 px-6 sm:px-12 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-30 bg-background/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            Δ
          </div>
          <span className="font-bold tracking-tight text-sm">
            PERSONAL TRANSFORMATION <span className="text-brand-500 font-mono">OS</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-surface-600 dark:text-surface-300 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            Live Demo
          </Link>
          <Link
            href="/onboarding"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all"
          >
            Start Setup
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28 max-w-4xl mx-auto space-y-8 animate-in fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
          <Sparkles size={13} /> NOT A MOTIVATIONAL APP • AN EXECUTION ENGINE
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
          YOUR LIFE. <br />
          YOUR DATA. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-400 to-cyan-400">
            YOUR NEXT MOVE.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
          A personal operating system for turning goals into actions and actions into lasting progress.
          Zero motivational fluff. Maximum execution velocity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 active:scale-98 transition-all"
          >
            <span>START YOUR 90-DAY JOURNEY</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-100/60 dark:bg-surface-800/60 hover:bg-surface-200 dark:hover:bg-surface-700 text-foreground font-semibold text-sm transition-all"
          >
            <span>EXPLORE LIVE DASHBOARD</span>
          </Link>
        </div>

        {/* The Core Product Philosophy Strip */}
        <div className="pt-16 w-full">
          <span className="text-[10px] font-mono uppercase tracking-widest text-surface-400 font-bold block mb-4">
            THE EXECUTION LOOP
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-semibold text-surface-500 dark:text-surface-400">
            <span className="px-2.5 py-1 rounded-md bg-surface-100 dark:bg-surface-800">INFORMATION</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-md bg-surface-100 dark:bg-surface-800">DECISION</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-500 border border-brand-500/20">ACTION</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-md bg-surface-100 dark:bg-surface-800">EVIDENCE</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-md bg-surface-100 dark:bg-surface-800">REFLECTION</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-md bg-surface-100 dark:bg-surface-800">ADAPTATION</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">BETTER ACTION</span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-16 text-left w-full">
          <div className="p-6 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 bg-white/50 dark:bg-surface-100/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <h3 className="text-sm font-bold text-foreground">Next Action Engine</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
              Never wonder what to do next. The engine calculates the single highest-impact action matching your energy and time.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 bg-white/50 dark:bg-surface-100/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <LifeBuoy size={18} />
            </div>
            <h3 className="text-sm font-bold text-foreground">I'm Stuck Reset</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
              When resistance strikes, shrink the action into an immediate 2-minute micro step to restore momentum without guilt.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 bg-white/50 dark:bg-surface-100/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Activity size={18} />
            </div>
            <h3 className="text-sm font-bold text-foreground">Biological Baseline</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
              Track sleep consistency, workout volume, and energy levels without pseudoscience or medical overreach.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 bg-white/50 dark:bg-surface-100/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Brain size={18} />
            </div>
            <h3 className="text-sm font-bold text-foreground">Identity & Evidence</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
              Actions become proof. Build an undeniable bank of evidence showing you finish what you start.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 bg-white/50 dark:bg-surface-100/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Layers size={18} />
            </div>
            <h3 className="text-sm font-bold text-foreground">Personal Operating Manual</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
              A dynamic user manual synthesizing your best work windows, triggers, and proven recovery protocols.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-surface-200/80 dark:border-surface-700/80 bg-white/50 dark:bg-surface-100/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h3 className="text-sm font-bold text-foreground">Privacy & Local-First</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
              You own your records. Export anytime in JSON/CSV, toggle AI access granularly, and run completely offline.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200/60 dark:border-surface-800/80 py-8 px-6 text-center text-xs text-surface-400">
        <p>Know yourself. Do the work. Become who you want to be.</p>
        <p className="mt-1 text-[11px] text-surface-500">
          Personal Transformation OS • Built for execution, not procrastination.
        </p>
      </footer>
    </div>
  );
}
