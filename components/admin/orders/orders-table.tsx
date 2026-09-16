// components/admin/orders/orders-table.tsx
"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminTheme } from "../admin-theme-provider";
import { OrderStatusBadge } from "./order-status-badge";
import { formatOrderNumber } from "@/lib/admin/order";
import { formatPaise } from "@/lib/format";
import { formatShortDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { AdminOrderListItem } from "@/types/api/order.types";

interface OrdersTableProps {
  orders: AdminOrderListItem[];
}

// Deliberately view-only at the list level — status changes and
// deletion are destructive/stateful enough (status change notifies
// the customer; delete cascades reviews/items/address) that they
// belong on the order's own detail page, not as a row-inline action
// next to eight other rows. Matches the products list's own "Eye"
// action for "go look at the full thing", just without a parallel
// inline delete here.
export function OrdersTable({ orders }: OrdersTableProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const borderColor = isDark ? "border-neutral-800" : "border-neutral-200";

  return (
    <Card className={cn("gap-0 overflow-hidden py-0", borderColor, isDark ? "bg-neutral-900" : "bg-white")}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={cn("hover:bg-transparent", borderColor)}>
              {["Order", "Customer", "Total", "Status", "Items", "Date", ""].map((h) => (
                <TableHead
                  key={h}
                  className={cn(
                    "text-xs uppercase tracking-wide",
                    isDark ? "text-neutral-500" : "text-neutral-400",
                    h === "" && "text-right"
                  )}
                >
                  {h === "" ? "Actions" : h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <TableRow
                  key={order.id}
                  className={cn(borderColor, isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50")}
                >
                  <TableCell className={cn("font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
                    {formatOrderNumber(order.id)}
                  </TableCell>

                  <TableCell className={isDark ? "text-neutral-300" : "text-neutral-700"}>
                    {order.user.name ?? order.user.email}
                  </TableCell>

                  <TableCell className={isDark ? "text-neutral-100" : "text-neutral-900"}>
                    {formatPaise(order.totalAmount)}
                  </TableCell>

                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>

                  <TableCell className={isDark ? "text-neutral-400" : "text-neutral-500"}>
                    {itemCount}
                  </TableCell>

                  <TableCell className={isDark ? "text-neutral-400" : "text-neutral-500"}>
                    {formatShortDate(order.createdAt)}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="icon-xs" asChild>
                        <Link href={`/admin/orders/${order.id}`} aria-label={`View order ${formatOrderNumber(order.id)}`}>
                          <Eye className={isDark ? "text-neutral-400" : "text-neutral-500"} />
                        </Link>
                      </Button>
                    </div>
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