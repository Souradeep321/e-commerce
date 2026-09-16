// components/admin/orders/orders-empty-state.tsx
"use client";

import { ShoppingCart, SearchX } from "lucide-react";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

interface OrdersEmptyStateProps {
  hasActiveFilters: boolean;
}

// Same two-situation distinction as products-empty-state.tsx: no
// orders placed yet at all, vs. a status filter that matched nothing.
// No "create" CTA here though — unlike products, orders aren't
// something an admin creates by hand.
export function OrdersEmptyState({ hasActiveFilters }: OrdersEmptyStateProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  const Icon = hasActiveFilters ? SearchX : ShoppingCart;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border py-20 text-center",
        isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
      )}
    >
      <Icon className={cn("h-8 w-8", isDark ? "text-neutral-700" : "text-neutral-300")} />

      <p className={cn("mt-4 text-sm font-medium", isDark ? "text-neutral-200" : "text-neutral-900")}>
        {hasActiveFilters ? "No orders match this status" : "No orders yet"}
      </p>
      <p className={cn("mt-1 text-sm", isDark ? "text-neutral-500" : "text-neutral-500")}>
        {hasActiveFilters
          ? "Try a different status filter."
          : "Orders will appear here once customers start checking out."}
      </p>
    </div>
  );
}