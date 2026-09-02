// app/admin/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

// Renders BEFORE app/admin/layout.tsx resolves (a same-segment
// loading.tsx wraps page.tsx, not its own sibling layout.tsx) — so
// AdminThemeProvider/useAdminTheme() aren't available here. Fixed
// dark styling, matching the default theme, same reasoning as the
// spinner version this replaces. Shape mirrors the real dashboard
// closely so there's minimal layout shift once content mounts.

function Card({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-lg border border-neutral-800 bg-neutral-900 p-4 ${className}`}>
      <Skeleton className="h-full w-full bg-neutral-800" />
    </div>
  );
}

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32 bg-neutral-800" />
          <Skeleton className="h-4 w-24 bg-neutral-800" />
        </div>
        <Skeleton className="h-8 w-40 rounded-md bg-neutral-800" />
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16 bg-neutral-800" />
              <Skeleton className="h-3.5 w-3.5 rounded-full bg-neutral-800" />
            </div>
            <Skeleton className="mt-3 h-7 w-20 bg-neutral-800" />
          </div>
        ))}
      </div>

      {/* Trend charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-neutral-800 bg-neutral-900">
            <div className="border-b border-neutral-800 px-4 py-3">
              <Skeleton className="h-4 w-20 bg-neutral-800" />
            </div>
            <div className="p-4">
              <Skeleton className="h-40 w-full bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Category sales + status breakdown */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900">
          <div className="border-b border-neutral-800 px-4 py-3">
            <Skeleton className="h-4 w-28 bg-neutral-800" />
          </div>
          <div className="p-4">
            <Skeleton className="h-52 w-full bg-neutral-800" />
          </div>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900">
          <div className="border-b border-neutral-800 px-4 py-3">
            <Skeleton className="h-4 w-40 bg-neutral-800" />
          </div>
          <div className="space-y-3 p-4">
            <Skeleton className="h-2 w-full rounded-full bg-neutral-800" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-16 bg-neutral-800" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top products + recent orders */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900">
          <div className="border-b border-neutral-800 px-4 py-3">
            <Skeleton className="h-4 w-24 bg-neutral-800" />
          </div>
          <div className="divide-y divide-neutral-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded bg-neutral-800" />
                <Skeleton className="h-3.5 flex-1 bg-neutral-800" />
                <Skeleton className="h-3.5 w-8 shrink-0 bg-neutral-800" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900">
          <div className="border-b border-neutral-800 px-4 py-3">
            <Skeleton className="h-4 w-28 bg-neutral-800" />
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full bg-neutral-800" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}