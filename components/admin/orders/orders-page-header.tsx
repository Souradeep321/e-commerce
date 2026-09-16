// components/admin/orders/orders-page-header.tsx
"use client";

import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

// Small client wrapper so the list page's own header text can stay
// theme-aware via useAdminTheme() (per house convention — no `dark:`
// variants) even though app/admin/orders/page.tsx itself is a Server
// Component and can't call hooks directly.
export function OrdersPageHeader() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <h1 className={cn("text-2xl font-medium", isDark ? "text-white" : "text-neutral-900")}>
        Orders
      </h1>
      <p className={cn("mt-1 text-sm", isDark ? "text-neutral-500" : "text-neutral-500")}>
        View orders, update their status, and manage order history.
      </p>
    </div>
  );
}