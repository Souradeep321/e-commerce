// app/admin/categories/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { ProductsTableSkeleton } from "@/components/admin/products/products-table-skeleton";

export default function CategoryDetailLoading() {
  return (
    <div>
      <Skeleton className="h-3 w-24 bg-neutral-800" />
      <Skeleton className="mt-4 h-7 w-48 bg-neutral-800" />
      <Skeleton className="mt-2 h-4 w-40 bg-neutral-800" />

      <div className="mt-6">
        <Skeleton className="h-9 w-64 bg-neutral-800" />
      </div>

      <div className="mt-4">
        <ProductsTableSkeleton rows={6} />
      </div>
    </div>
  );
}