// app/admin/orders/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

// Hardcoded dark, same reasoning as app/admin/orders/loading.tsx and
// app/admin/products/loading.tsx.
export default function AdminOrderDetailLoading() {
  return (
    <div>
      <Skeleton className="h-3.5 w-28 bg-neutral-800" />
      <Skeleton className="mt-3 h-8 w-56 bg-neutral-800" />
      <Skeleton className="mt-2 h-4 w-40 bg-neutral-800" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Skeleton className="h-64 rounded-lg bg-neutral-800" />
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-lg bg-neutral-800" />
          <Skeleton className="h-28 rounded-lg bg-neutral-800" />
          <Skeleton className="h-40 rounded-lg bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}