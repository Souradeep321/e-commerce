// components/admin/dashboard/recent-orders-table.tsx
"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminTheme } from "../admin-theme-provider";
import { formatINR, formatShortDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { AnalyticsRecentOrder } from "@/types/api/analytics.types";

interface RecentOrdersTableProps {
  orders: AnalyticsRecentOrder[];
}

// Same reasoning as OrderStatusBreakdown — explicit per-status colors
// rather than Badge's default variant classes, which are CSS-var
// driven and not guaranteed to respond to our manually-toggled theme.
const STATUS_STYLES: Record<string, { light: string; dark: string }> = {
  DELIVERED: { light: "border-green-200 bg-green-50 text-green-700", dark: "border-green-900 bg-green-950/40 text-green-400" },
  SHIPPED: { light: "border-blue-200 bg-blue-50 text-blue-700", dark: "border-blue-900 bg-blue-950/40 text-blue-400" },
  PAID: { light: "border-neutral-200 bg-neutral-100 text-neutral-700", dark: "border-neutral-700 bg-neutral-800 text-neutral-300" },
  PENDING: { light: "border-amber-200 bg-amber-50 text-amber-700", dark: "border-amber-900 bg-amber-950/40 text-amber-400" },
  CANCELLED: { light: "border-neutral-200 bg-neutral-100 text-neutral-500", dark: "border-neutral-700 bg-neutral-800 text-neutral-500" },
  FAILED: { light: "border-red-200 bg-red-50 text-red-700", dark: "border-red-900 bg-red-950/40 text-red-400" },
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const borderColor = isDark ? "border-neutral-800" : "border-neutral-200";

  return (
    <Card className={cn("gap-0 py-0", borderColor, isDark ? "bg-neutral-900" : "bg-white")}>
      <CardHeader className="border-b p-0 [border-color:inherit]">
        <CardTitle
          className={cn(
            "px-4 py-3 text-sm font-medium",
            isDark ? "text-neutral-100" : "text-neutral-900"
          )}
        >
          Recent Orders
        </CardTitle>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={cn("hover:bg-transparent", borderColor)}>
              {["Order", "Customer", "Total", "Status", "Items", "Date"].map((h) => (
                <TableHead
                  key={h}
                  className={cn(
                    "text-xs uppercase tracking-wide",
                    isDark ? "text-neutral-500" : "text-neutral-400"
                  )}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusStyle = STATUS_STYLES[order.status];
              return (
                <TableRow
                  key={order.id}
                  className={cn(borderColor, isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50")}
                >
                  <TableCell className={cn("font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className={isDark ? "text-neutral-300" : "text-neutral-700"}>
                    {order.customer}
                  </TableCell>
                  <TableCell className={isDark ? "text-neutral-100" : "text-neutral-900"}>
                    {formatINR(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-medium uppercase tracking-wide",
                        statusStyle ? (isDark ? statusStyle.dark : statusStyle.light) : undefined
                      )}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={isDark ? "text-neutral-400" : "text-neutral-500"}>
                    {order.itemCount}
                  </TableCell>
                  <TableCell className={isDark ? "text-neutral-400" : "text-neutral-500"}>
                    {formatShortDate(order.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}