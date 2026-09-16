// components/admin/orders/order-status-badge.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { useAdminTheme } from "../admin-theme-provider";
import { getOrderStatusClass, getOrderStatusLabel } from "@/lib/admin/order";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-medium uppercase tracking-wide",
        getOrderStatusClass(status, isDark),
        className
      )}
    >
      {getOrderStatusLabel(status)}
    </Badge>
  );
}