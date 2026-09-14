// components/admin/categories/category-products-empty-state.tsx
"use client";

import { SearchX, PackageOpen } from "lucide-react";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

interface CategoryProductsEmptyStateProps {
  hasActiveFilters: boolean;
}

export function CategoryProductsEmptyState({ hasActiveFilters }: CategoryProductsEmptyStateProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const Icon = hasActiveFilters ? SearchX : PackageOpen;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border py-16 text-center",
        isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
      )}
    >
      <Icon className={cn("h-8 w-8", isDark ? "text-neutral-700" : "text-neutral-300")} />
      <p className={cn("mt-4 text-sm font-medium", isDark ? "text-neutral-200" : "text-neutral-900")}>
        {hasActiveFilters ? "No products match your filters" : "No products in this category yet"}
      </p>
      <p className={cn("mt-1 text-sm", isDark ? "text-neutral-500" : "text-neutral-500")}>
        {hasActiveFilters ? "Try adjusting your search or filters." : "Assign products to this category from the product form."}
      </p>
    </div>
  );
}