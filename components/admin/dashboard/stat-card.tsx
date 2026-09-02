// components/admin/dashboard/stat-card.tsx
"use client";

import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
   // Must be a RENDERED element (e.g. `<DollarSign className="h-3.5 w-3.5" />`),
  // not a bare component reference (`icon={DollarSign}`) — Next.js
  // can't serialize a raw component function across the Server →
  // Client boundary, only already-rendered JSX. Color is applied here
  // via a wrapping span + `currentColor` (lucide icons default to
  // stroke="currentColor"), since color depends on emphasis/theme,
  // which the icon's creator (a Server Component) can't know about —
  // only size should be baked in at creation time.
  icon: ReactNode;
  // pendingOrders / lowStockProducts get a subtle attention treatment —
  // these are the two numbers an admin most needs to notice at a glance.
  emphasis?: boolean;
}

export function StatCard({ label, value, icon, emphasis }: StatCardProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isDark
          ? "border-neutral-800 bg-neutral-900"
          : "border-neutral-200 bg-white",
        emphasis && (isDark ? "border-amber-900/60" : "border-amber-300")
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs",
            isDark ? "text-neutral-400" : "text-neutral-500"
          )}
        >
          {label}
        </span>

        {icon}
      </div>

      <p
        className={cn(
          "mt-2 text-2xl font-medium",
          isDark ? "text-white" : "text-neutral-900"
        )}
      >
        {value}
      </p>
    </div>
  );
}