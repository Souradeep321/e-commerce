// components/admin/dashboard/top-products-list.tsx
"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";
import { TopProduct } from "@/types/api/analytics.types";

interface TopProductsListProps {
  products: TopProduct[];
}

export function TopProductsList({ products }: TopProductsListProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <Card
      className={cn(
        "gap-0 py-0",
        isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
      )}
    >
      <CardHeader className="border-b p-0 [border-color:inherit]">
        <CardTitle
          className={cn(
            "px-4 py-3 text-sm font-medium",
            isDark ? "text-neutral-100" : "text-neutral-900"
          )}
        >
          Top Products
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y p-0 [&>*]:border-color-inherit">
        {products.map((item, index) => (
          <div
            key={item.product?.id ?? `deleted-${index}`}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              isDark ? "border-neutral-800" : "border-neutral-100"
            )}
          >
            <span className={cn("w-4 text-xs", isDark ? "text-neutral-500" : "text-neutral-400")}>
              {index + 1}
            </span>

            <div
              className={cn(
                "relative h-9 w-9 shrink-0 overflow-hidden rounded",
                isDark ? "bg-neutral-800" : "bg-neutral-100"
              )}
            >
              {item.product?.images[0]?.url && (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              {item.product ? (
                <p
                  className={cn(
                    "truncate text-sm font-medium",
                    isDark ? "text-neutral-100" : "text-neutral-900"
                  )}
                >
                  {item.product.name}
                </p>
              ) : (
                <p className={cn("truncate text-sm italic", isDark ? "text-neutral-500" : "text-neutral-400")}>
                  (deleted product)
                </p>
              )}
            </div>

            <span className={cn("shrink-0 text-sm font-medium", isDark ? "text-neutral-300" : "text-neutral-600")}>
              {item.totalSold}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}