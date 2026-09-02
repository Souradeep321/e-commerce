// app/admin/products/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { ProductsTableSkeleton } from "@/components/admin/products/products-table-skeleton";

export default function AdminProductsLoading() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-28 bg-neutral-800" />
          <Skeleton className="h-4 w-16 bg-neutral-800" />
        </div>
        <Skeleton className="h-9 w-36 rounded-md bg-neutral-800" />
      </div>

      {/* Search + filter row */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Skeleton className="h-9 w-64 rounded-md bg-neutral-800" />
        <Skeleton className="h-9 w-72 rounded-md bg-neutral-800" />
        <Skeleton className="h-9 w-32 rounded-md bg-neutral-800" />
      </div>

      {/* Table */}
      <div className="mt-4">
        <ProductsTableSkeleton />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <Skeleton className="h-4 w-20 bg-neutral-800" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-md bg-neutral-800" />
          <Skeleton className="h-8 w-8 rounded-md bg-neutral-800" />
          <Skeleton className="h-8 w-8 rounded-md bg-neutral-800" />
          <Skeleton className="h-8 w-16 rounded-md bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}