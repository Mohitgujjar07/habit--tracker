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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-surface-100/90 backdrop-blur-lg border-t border-surface-200/80 dark:border-surface-800 px-4 py-2 flex items-center justify-around safe-bottom">
      {/* Home */}
      <Link
        href={links[0].href}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname === links[0].href
            ? "text-brand-600 dark:text-brand-400"
            : "text-surface-500 hover:text-foreground"
        }`}
      >
        <LayoutDashboard size={20} />
        <span>{links[0].label}</span>
      </Link>

      {/* Focus */}
      <Link
        href={links[1].href}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname === links[1].href
            ? "text-brand-600 dark:text-brand-400"
            : "text-surface-500 hover:text-foreground"
        }`}
      >
        <Zap size={20} />
        <span>{links[1].label}</span>
      </Link>

      {/* Central '+' Quick Action Button */}
      <div className="-mt-5">
        <button
          onClick={onOpenQuickAction}
          className="w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-500 active:scale-95 text-white shadow-lg flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20"
          aria-label="Quick Actions"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress */}
      <Link
        href={links[2].href}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname === links[2].href
            ? "text-brand-600 dark:text-brand-400"
            : "text-surface-500 hover:text-foreground"
        }`}
      >
        <TrendingUp size={20} />
        <span>{links[2].label}</span>
      </Link>

      {/* Profile */}
      <Link
        href={links[3].href}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname === links[3].href
            ? "text-brand-600 dark:text-brand-400"
            : "text-surface-500 hover:text-foreground"
        }`}
      >
        <User size={20} />
        <span>{links[3].label}</span>
      </Link>
    </nav>
  );
};
