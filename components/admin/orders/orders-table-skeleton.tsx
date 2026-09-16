// components/admin/orders/orders-table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

// Fixed dark styling — same reasoning as products-table-skeleton.tsx:
// can render before AdminThemeProvider is guaranteed mounted (hard
// reload / direct navigation), so it doesn't call useAdminTheme().
export function OrdersTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900">
      <div className="hidden grid-cols-[1fr_1.5fr_1fr_1fr_0.6fr_1fr_auto] gap-4 border-b border-neutral-800 px-4 py-3 sm:grid">
        <Skeleton className="h-3 w-14 bg-neutral-800" />
        <Skeleton className="h-3 w-20 bg-neutral-800" />
        <Skeleton className="h-3 w-12 bg-neutral-800" />
        <Skeleton className="h-3 w-14 bg-neutral-800" />
        <Skeleton className="h-3 w-10 bg-neutral-800" />
        <Skeleton className="h-3 w-14 bg-neutral-800" />
        <Skeleton className="h-3 w-10 bg-neutral-800 justify-self-end" />
      </div>

      <div className="divide-y divide-neutral-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 px-4 py-3 sm:grid sm:grid-cols-[1fr_1.5fr_1fr_1fr_0.6fr_1fr_auto]"
          >
            <Skeleton className="h-3.5 w-16 bg-neutral-800" />
            <Skeleton className="hidden h-3.5 w-28 bg-neutral-800 sm:block" />
            <Skeleton className="hidden h-3.5 w-14 bg-neutral-800 sm:block" />
            <Skeleton className="h-5 w-16 rounded-full bg-neutral-800" />
            <Skeleton className="hidden h-3.5 w-6 bg-neutral-800 sm:block" />
            <Skeleton className="hidden h-3.5 w-14 bg-neutral-800 sm:block" />
            <Skeleton className="h-4 w-4 bg-neutral-800 justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}