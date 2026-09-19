import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";

export default function CategoryLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-56" />
      </div>

      <ProductGridSkeleton />
    </main>
  );
}