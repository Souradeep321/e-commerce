import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-lg font-medium text-neutral-900">No products found</p>
      <p className="mt-1 text-sm text-neutral-500">
        Try adjusting your filters or check back later.
      </p>
      <Button asChild variant="outline" className="mt-6">
        <Link href="/products">Clear filters</Link>
      </Button>
    </div>
  );
}