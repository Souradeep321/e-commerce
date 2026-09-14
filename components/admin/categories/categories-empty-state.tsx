// components/admin/categories/categories-empty-state.tsx
"use client";

import { Tag } from "lucide-react";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

export function CategoriesEmptyState() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border py-20 text-center",
        isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
      )}
    >
      <Tag className={cn("h-8 w-8", isDark ? "text-neutral-700" : "text-neutral-300")} />
      <p className={cn("mt-4 text-sm font-medium", isDark ? "text-neutral-200" : "text-neutral-900")}>
        No categories yet
      </p>
      <p className={cn("mt-1 text-sm", isDark ? "text-neutral-500" : "text-neutral-500")}>
        Create your first category to start organizing products.
      </p>
    </div>
  );
}