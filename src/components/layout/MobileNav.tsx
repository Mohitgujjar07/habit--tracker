"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Zap, Plus, TrendingUp, User } from "lucide-react";

interface MobileNavProps {
  onOpenQuickAction: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenQuickAction }) => {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Focus", href: "/focus", icon: Zap },
    { label: "Progress", href: "/progress", icon: TrendingUp },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-lg safe-bottom">
      {/* Home */}
      <Link
        href={links[0].href}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
          pathname === links[0].href
            ? "text-orange-600"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <LayoutDashboard size={20} />
        <span>{links[0].label}</span>
      </Link>

      {/* Focus */}
      <Link
        href={links[1].href}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
          pathname === links[1].href
            ? "text-orange-600"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Zap size={20} />
        <span>{links[1].label}</span>
      </Link>

      {/* Central '+' Quick Action Button */}
      <div className="-mt-6">
        <button
          onClick={onOpenQuickAction}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 active:scale-95 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-orange-500/20"
          aria-label="Quick Actions"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress */}
      <Link
        href={links[2].href}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
          pathname === links[2].href
            ? "text-orange-600"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <TrendingUp size={20} />
        <span>{links[2].label}</span>
      </Link>

      {/* Profile */}
      <Link
        href={links[3].href}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
          pathname === links[3].href
            ? "text-orange-600"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <User size={20} />
        <span>{links[3].label}</span>
      </Link>
    </nav>
  );
};
