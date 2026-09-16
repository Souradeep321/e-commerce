// components/admin/orders/orders-filter-bar.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAdminTheme } from "../admin-theme-provider";
import { ORDER_STATUS_VALUES, getOrderStatusLabel } from "@/lib/admin/order";
import { cn } from "@/lib/utils";

// Status-only filter — GET /api/admin/orders' contract (lib/api/orders.ts
// getAdminOrders) only supports { status, page, limit }, no text search.
// Unlike products-filter-bar (which has a search box wired against a
// route that does support `q`), adding a search input here would
// promise functionality the backend doesn't have — so this stays
// status-only, matching the real API surface.
export function OrdersFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  const currentStatus = searchParams.get("status") ?? "all";

  function handleChange(value: string) {
    if (!value) return; // ToggleGroup fires "" on deselect — treat as no-op, not "clear"
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const pillGroupClass = cn(
    "flex flex-wrap rounded-md border p-0.5",
    isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
  );
  const pillItemClass = cn(
    "h-7 rounded-sm px-3 text-xs",
    isDark
      ? "text-neutral-400 data-[state=on]:bg-white data-[state=on]:text-neutral-900"
      : "text-neutral-500 data-[state=on]:bg-neutral-900 data-[state=on]:text-white"
  );

  return (
    <ToggleGroup
      type="single"
      value={currentStatus}
      onValueChange={handleChange}
      className={pillGroupClass}
    >
      <ToggleGroupItem value="all" className={pillItemClass}>
        All
      </ToggleGroupItem>
      {ORDER_STATUS_VALUES.map((status) => (
        <ToggleGroupItem key={status} value={status} className={pillItemClass}>
          {getOrderStatusLabel(status)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}