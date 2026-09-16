// app/admin/orders/loading.tsx
import { OrdersTableSkeleton } from "@/components/admin/orders/orders-table-skeleton";

// Hardcoded dark shell, same as app/admin/products/loading.tsx — can
// render before AdminThemeProvider mounts (hard reload / direct nav),
// so no useAdminTheme() here. Known minor cosmetic gap for light-mode
// users, already documented in KNOWN_ISSUES.md for the products page;
// same tradeoff accepted here rather than solving it differently.
export default function AdminOrdersLoading() {
  return (
    <div>
      <div className="h-7 w-24 animate-pulse rounded bg-neutral-800" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-neutral-800" />
      <div className="mt-6 h-9 w-96 animate-pulse rounded-md bg-neutral-800" />
      <div className="mt-4">
        <OrdersTableSkeleton />
      </div>
    </div>
  );
}