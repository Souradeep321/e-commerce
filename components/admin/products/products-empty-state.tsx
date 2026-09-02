// components/admin/products/products-empty-state.tsx
"use client";

import Link from "next/link";
import { Package, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

interface ProductsEmptyStateProps {
  // Two genuinely different situations, per the design prompt's own
  // note: a brand-new store with zero products ever created needs a
  // "create your first product" nudge; a search/filter that matched
  // nothing needs "try different filters" instead. Conflating them
  // into one generic message would misdirect a first-time admin.
  hasActiveFilters: boolean;
}

export function ProductsEmptyState({ hasActiveFilters }: ProductsEmptyStateProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  const Icon = hasActiveFilters ? SearchX : Package;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border py-20 text-center",
        isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
      )}
    >
      <Icon className={cn("h-8 w-8", isDark ? "text-neutral-700" : "text-neutral-300")} />

      <p className={cn("mt-4 text-sm font-medium", isDark ? "text-neutral-200" : "text-neutral-900")}>
        {hasActiveFilters ? "No products match your filters" : "No products yet"}
      </p>
      <p className={cn("mt-1 text-sm", isDark ? "text-neutral-500" : "text-neutral-500")}>
        {hasActiveFilters
          ? "Try adjusting your search or filters."
          : "Get started by creating your first product."}
      </p>

      {!hasActiveFilters && (
        <Button asChild className="mt-6">
          <Link href="/admin/products/new">Create Product</Link>
        </Button>
      )}
    </div>
  );
}