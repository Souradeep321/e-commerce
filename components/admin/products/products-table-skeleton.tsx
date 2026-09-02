// components/admin/products/products-table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

// Fixed dark styling — same reasoning as app/admin/loading.tsx: this
// can render before AdminThemeProvider is guaranteed mounted (hard
// reload / direct navigation case), so it doesn't call useAdminTheme().
export function ProductsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900">
      {/* Column header row */}
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-neutral-800 px-4 py-3 sm:grid">
        <Skeleton className="h-3 w-16 bg-neutral-800" />
        <Skeleton className="h-3 w-16 bg-neutral-800" />
        <Skeleton className="h-3 w-12 bg-neutral-800" />
        <Skeleton className="h-3 w-14 bg-neutral-800" />
        <Skeleton className="h-3 w-14 bg-neutral-800 justify-self-end" />
      </div>

      <div className="divide-y divide-neutral-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto]"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
              <Skeleton className="h-10 w-10 shrink-0 rounded bg-neutral-800" />
              <Skeleton className="h-3.5 w-32 bg-neutral-800" />
            </div>
            <Skeleton className="hidden h-3.5 w-16 bg-neutral-800 sm:block" />
            <Skeleton className="hidden h-3.5 w-14 bg-neutral-800 sm:block" />
            <Skeleton className="hidden h-5 w-16 rounded-full bg-neutral-800 sm:block" />
            <div className="hidden shrink-0 gap-2 sm:flex sm:justify-self-end">
              <Skeleton className="h-4 w-4 bg-neutral-800" />
              <Skeleton className="h-4 w-4 bg-neutral-800" />
              <Skeleton className="h-4 w-4 bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}