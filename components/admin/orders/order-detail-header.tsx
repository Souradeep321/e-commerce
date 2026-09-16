// components/admin/orders/order-detail-header.tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAdminTheme } from "../admin-theme-provider";
import { OrderStatusBadge } from "./order-status-badge";
import { formatOrderNumber } from "@/lib/admin/order";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface OrderDetailHeaderProps {
  orderId: string;
  status: string;
  createdAt: string;
}

export function OrderDetailHeader({ orderId, status, createdAt }: OrderDetailHeaderProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <Link
        href="/admin/orders"
        className={cn(
          "inline-flex items-center gap-1.5 text-xs",
          isDark ? "text-neutral-500 hover:text-neutral-300" : "text-neutral-400 hover:text-neutral-700"
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className={cn("text-2xl font-medium", isDark ? "text-white" : "text-neutral-900")}>
          Order {formatOrderNumber(orderId)}
        </h1>
        <OrderStatusBadge status={status} />
      </div>

      <p className={cn("mt-1 text-sm", isDark ? "text-neutral-500" : "text-neutral-500")}>
        Placed {formatDate(createdAt)}
      </p>
    </div>
  );
}