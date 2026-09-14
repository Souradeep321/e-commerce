// components/admin/categories/category-header.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";
import { CategoryWithChildren } from "@/types/api/category.types";

interface CategoryHeaderProps {
  category: CategoryWithChildren;
  totalItems: number;
}

// Client Component specifically so the "back" link can be theme-aware
// via useAdminTheme() rather than a `dark:` Tailwind variant (rule 3) —
// this is the reason the back link lives here and not in the Server
// Component page.
export function CategoryHeader({ category, totalItems }: CategoryHeaderProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <Link
        href="/admin/categories"
        className={cn(
          "inline-flex items-center gap-1.5 text-xs",
          isDark ? "text-neutral-500 hover:text-neutral-200" : "text-neutral-500 hover:text-neutral-900"
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All categories
      </Link>

      <div className="mt-3 flex items-center gap-2.5">
        <Tag className={cn("h-5 w-5", isDark ? "text-neutral-500" : "text-neutral-400")} />
        <h1 className="text-2xl font-medium">{category.name}</h1>
      </div>

      <p className={cn("mt-1 text-sm", isDark ? "text-neutral-500" : "text-neutral-500")}>
        /{category.slug} · {totalItems} product{totalItems === 1 ? "" : "s"}
      </p>

      {category.children.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {category.children.map((child) => (
            <span
              key={child.id}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs",
                isDark ? "border-neutral-800 text-neutral-400" : "border-neutral-200 text-neutral-500"
              )}
            >
              {child.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}