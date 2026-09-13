// components/admin/products/form/product-form-skeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductEditFormSkeleton() {
  return (
    <div>
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-40 bg-neutral-800" />
        <Skeleton className="mt-2 h-4 w-105 max-w-full bg-neutral-800" />
      </div>

      {/* Basic Info */}
      <section className="mt-6 border-t border-neutral-800 pt-6 dark:border-neutral-800">
        <Skeleton className="h-4 w-20" />

        <div className="mt-4 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-25 w-full" />
          </div>

          {/* Category + Gender */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-neutral-800" />
              <Skeleton className="h-10 w-full bg-neutral-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Stock */}
      <section className="mt-6 border-t border-neutral-800 pt-6 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28 bg-neutral-800  " />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Price */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-neutral-800" />
            <Skeleton className="h-10 w-full bg-neutral-800" />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-neutral-800" />
            <Skeleton className="h-10 w-full bg-neutral-800" />
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <Skeleton className="h-4 w-16 bg-neutral-800 " />

        <div className="mt-4">
          {/* Upload area */}
          <Skeleton className="h-40 w-full rounded-lg bg-neutral-800" />

          {/* Image previews */}
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-24 w-24 rounded-md bg-neutral-800" />
            <Skeleton className="h-24 w-24 rounded-md bg-neutral-800" />
            <Skeleton className="h-24 w-24 rounded-md bg-neutral-800" />
          </div>
        </div>
      </section>

      {/* Visibility & Flags */}
      <section className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <Skeleton className="h-4 w-32 bg-neutral-800" />

        <div className="mt-4 space-y-6">
          {/* Active */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-14 bg-neutral-800" />
              <Skeleton className="h-3 w-72 max-w-[70vw] bg-neutral-800" />
            </div>

            <Skeleton className="h-6 w-11 rounded-full bg-neutral-800" />
          </div>

          {/* Recommendation */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 bg-neutral-800" />
              <Skeleton className="h-3 w-80 max-w-[70vw] bg-neutral-800" />
            </div>

            <Skeleton className="h-6 w-11 rounded-full bg-neutral-800" />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <Skeleton className="h-10 w-24 rounded-md bg-neutral-800" />
        <Skeleton className="h-10 w-20 rounded-md bg-neutral-800" />
      </div>
    </div>
  );
}
