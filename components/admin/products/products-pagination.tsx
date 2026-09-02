// components/admin/products/products-pagination.tsx
"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
}

// Same page-number-based approach as the storefront's Pagination
// component (infinite scroll was explicitly rejected there) — kept
// as a separate component rather than reusing that one directly,
// since it's themed for admin and targets /admin/products.
export function ProductsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  searchParams,
}: ProductsPaginationProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && key !== "page") params.set(key, value);
    }
    params.set("page", String(page));
    return `/admin/products?${params.toString()}`;
  }

  const textColor = isDark ? "text-neutral-500" : "text-neutral-400";

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className={cn("text-xs", textColor)}>
        {start}-{end} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild={currentPage > 1}>
          {currentPage > 1 ? (
            <Link href={buildHref(currentPage - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </Link>
          ) : (
            <span>
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </span>
          )}
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon-sm"
            disabled={page === currentPage}
            asChild={page !== currentPage}
          >
            {page === currentPage ? <span>{page}</span> : <Link href={buildHref(page)}>{page}</Link>}
          </Button>
        ))}

        <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
          {currentPage < totalPages ? (
            <Link href={buildHref(currentPage + 1)}>
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span>
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}