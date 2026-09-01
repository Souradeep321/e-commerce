// components/admin/dashboard/stat-card.tsx
"use client";

import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
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