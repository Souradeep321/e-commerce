// lib/admin/order.ts — FRONTEND ONLY. No server/API code here.

/**
 * Single source of truth for order status styling/labels across the
 * admin Orders list + detail pages. Deliberately NOT reused from
 * components/admin/dashboard/order-status-breakdown.tsx or
 * recent-orders-table.tsx — those are dashboard-scoped and out of
 * scope to touch for this feature; colors are kept visually
 * consistent with them by design (same palette), but this is its own
 * copy so the Orders admin section doesn't take an implicit
 * dependency on dashboard components.
 */
export const ORDER_STATUS_VALUES = [
  "PENDING",
  "PAID",
  "FAILED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUS_VALUES)[number];

interface StatusStyle {
  label: string;
  light: string;
  dark: string;
}

export const ORDER_STATUS_STYLES: Record<OrderStatusValue, StatusStyle> = {
  DELIVERED: { label: "Delivered", light: "border-green-200 bg-green-50 text-green-700", dark: "border-green-900 bg-green-950/40 text-green-400" },
  SHIPPED: { label: "Shipped", light: "border-blue-200 bg-blue-50 text-blue-700", dark: "border-blue-900 bg-blue-950/40 text-blue-400" },
  PAID: { label: "Paid", light: "border-neutral-200 bg-neutral-100 text-neutral-700", dark: "border-neutral-700 bg-neutral-800 text-neutral-300" },
  PENDING: { label: "Pending", light: "border-amber-200 bg-amber-50 text-amber-700", dark: "border-amber-900 bg-amber-950/40 text-amber-400" },
  CANCELLED: { label: "Cancelled", light: "border-neutral-200 bg-neutral-100 text-neutral-500", dark: "border-neutral-700 bg-neutral-800 text-neutral-500" },
  FAILED: { label: "Failed", light: "border-red-200 bg-red-50 text-red-700", dark: "border-red-900 bg-red-950/40 text-red-400" },
};

export function getOrderStatusClass(status: string, isDark: boolean): string {
  const style = ORDER_STATUS_STYLES[status as OrderStatusValue];
  if (!style) return "";
  return isDark ? style.dark : style.light;
}

export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_STYLES[status as OrderStatusValue]?.label ?? status;
}

// Matches the exact slice used server-side in the notification message
// (app/api/admin/orders/[id]/route.ts: `Your order #${id.slice(-8)}`)
// — keep these in sync so the order number shown in admin matches the
// one customers see in their notification text.
export function formatOrderNumber(id: string): string {
  return `#${id.slice(-8)}`;
}