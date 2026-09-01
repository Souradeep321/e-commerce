// components/admin/dashboard/order-status-breakdown.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

interface OrderStatusBreakdownProps {
  orderStatus: Record<string, number>;
}

// Fixed order + color per status, not derived from object key order
// (Record iteration order isn't guaranteed to match how you want it
// displayed — DELIVERED should always lead, FAILED always trail).
const STATUS_CONFIG = [
  { key: "DELIVERED", label: "Delivered", color: "#10b981" },
  { key: "SHIPPED", label: "Shipped", color: "#3b82f6" },
  { key: "PAID", label: "Paid", color: "#818cf8" },
  { key: "PENDING", label: "Pending", color: "#f59e0b" },
  { key: "CANCELLED", label: "Cancelled", color: "#a3a3a3" },
  { key: "FAILED", label: "Failed", color: "#ef4444" },
] as const;

export function OrderStatusBreakdown({ orderStatus }: OrderStatusBreakdownProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  const total = Object.values(orderStatus).reduce((sum, n) => sum + n, 0);

  return (
    <Card
      className={cn(
        "gap-0 py-0",
        isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
      )}
    >
      <CardHeader className="border-b p-0 [border-color:inherit]">
        <CardTitle
          className={cn(
            "px-4 py-3 text-sm font-medium",
            isDark ? "text-neutral-100" : "text-neutral-900"
          )}
        >
          Order Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Segmented bar */}
        <div
          className={cn(
            "flex h-2 w-full overflow-hidden rounded-full",
            isDark ? "bg-neutral-800" : "bg-neutral-100"
          )}
        >
          {STATUS_CONFIG.map(({ key, color }) => {
            const count = orderStatus[key] ?? 0;
            if (count === 0 || total === 0) return null;
            return (
              <div
                key={key}
                style={{ width: `${(count / total) * 100}%`, backgroundColor: color }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
          {STATUS_CONFIG.map(({ key, label, color }) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className={isDark ? "text-neutral-400" : "text-neutral-500"}>
                {label}
              </span>
              <span className={cn("font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
                {orderStatus[key] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}