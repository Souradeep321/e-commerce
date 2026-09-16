// components/admin/orders/order-items-table.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminTheme } from "../admin-theme-provider";
import { formatPaise } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AdminOrderItem } from "@/types/api/order.types";

interface OrderItemsTableProps {
  items: AdminOrderItem[];
  totalAmount: number; // paise — see page-level note on the paise assumption
}

// Deliberately uses item.price (the OrderItem's own captured price at
// purchase time), NOT item.product.price — the actual GET
// /api/admin/orders/[id] route never selects product.price (only id,
// name, slug, images), even though the AdminOrderItem/
// OrderProductSummary types declare it. item.price is the field that
// both the schema and the real query actually guarantee, and it's
// also the semantically correct one here: a line item should reflect
// what was charged at the time of purchase, not the product's current price.
export function OrderItemsTable({ items, totalAmount }: OrderItemsTableProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const borderColor = isDark ? "border-neutral-800" : "border-neutral-200";

  return (
    <Card className={cn("gap-0 overflow-hidden py-0", borderColor, isDark ? "bg-neutral-900" : "bg-white")}>
      <CardHeader className="border-b p-0 [border-color:inherit]">
        <CardTitle className={cn("px-4 py-3 text-sm font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
          Items
        </CardTitle>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={cn("hover:bg-transparent", borderColor)}>
              {["Product", "Size", "Unit Price", "Qty", "Line Total"].map((h) => (
                <TableHead
                  key={h}
                  className={cn("text-xs uppercase tracking-wide", isDark ? "text-neutral-500" : "text-neutral-400")}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className={borderColor}>
                <TableCell>
                  <Link
                    href={`/products/${item.product.slug}`}
                    target="_blank"
                    className="flex items-center gap-3"
                  >
                    <div
                      className={cn(
                        "relative h-10 w-10 shrink-0 overflow-hidden rounded",
                        isDark ? "bg-neutral-800" : "bg-neutral-100"
                      )}
                    >
                      {item.product.images[0]?.url && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      )}
                    </div>
                    <span className={cn("font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
                      {item.product.name}
                    </span>
                  </Link>
                </TableCell>

                <TableCell className={isDark ? "text-neutral-400" : "text-neutral-500"}>
                  {item.variant?.size ?? "—"}
                </TableCell>

                <TableCell className={isDark ? "text-neutral-300" : "text-neutral-700"}>
                  {formatPaise(item.price)}
                </TableCell>

                <TableCell className={isDark ? "text-neutral-300" : "text-neutral-700"}>
                  {item.quantity}
                </TableCell>

                <TableCell className={cn("font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
                  {formatPaise(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter className={cn("bg-transparent", isDark ? "border-neutral-800" : "border-neutral-200")}>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className={cn("text-right font-medium", isDark ? "text-neutral-300" : "text-neutral-700")}>
                Order Total
              </TableCell>
              <TableCell className={cn("font-semibold", isDark ? "text-white" : "text-neutral-900")}>
                {formatPaise(totalAmount)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Card>
  );
}