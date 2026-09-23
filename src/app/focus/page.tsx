import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FocusStudio } from "@/components/focus/FocusStudio";

export default function FocusPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-surface-400">Loading Focus Studio...</div>}>
        <FocusStudio />
      </Suspense>
    </AppShell>
  );
}
