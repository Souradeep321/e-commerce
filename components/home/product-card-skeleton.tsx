import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square w-full" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}