// app/admin/categories/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-32 bg-neutral-800" />
          <Skeleton className="mt-2 h-4 w-64 bg-neutral-800" />
        </div>
        <Skeleton className="h-8 w-28 bg-neutral-800" />
      </div>

      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <Skeleton className="h-4 w-40 bg-neutral-800" />
            <Skeleton className="mt-2 h-3 w-24 bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  );
}