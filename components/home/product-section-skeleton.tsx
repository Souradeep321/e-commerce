import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "./product-card-skeleton";

interface ProductSectionSkeletonProps {
  count?: number;
}

export function ProductSectionSkeleton({ count = 4 }: ProductSectionSkeletonProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}