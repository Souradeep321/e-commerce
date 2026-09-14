// components/admin/categories/category-products-filter-bar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

// Same URL-state convention as ProductsFilterBar — but real filtering
// this time, since this hits the real GET /api/admin/categories/[id]
// route, not a mock array.
export function CategoryProductsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (searchValue === current) return;
    const timeout = setTimeout(() => updateParam("q", searchValue || null), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const currentStatus =
    searchParams.get("isActive") === "true" ? "active" : searchParams.get("isActive") === "false" ? "inactive" : "all";
  const currentSort = searchParams.get("sort") ?? "latest";

  const pillGroupClass = cn(
    "rounded-md border p-0.5",
    isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
  );
  const pillItemClass = cn(
    "h-7 rounded-sm px-3 text-xs",
    isDark
      ? "text-neutral-400 data-[state=on]:bg-white data-[state=on]:text-neutral-900"
      : "text-neutral-500 data-[state=on]:bg-neutral-900 data-[state=on]:text-white"
  );
  const inputTheme = isDark
    ? "border-neutral-800 bg-neutral-900 text-neutral-100 placeholder:text-neutral-500 focus-visible:border-neutral-600 focus-visible:ring-0"
    : "border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-0";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search
          className={cn(
            "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2",
            isDark ? "text-neutral-500" : "text-neutral-400"
          )}
        />
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search products in this category..."
          className={cn("h-9 w-64 pl-8", inputTheme)}
        />
      </div>

      <ToggleGroup
        type="single"
        value={currentStatus}
        onValueChange={(v) => {
          if (v === "active") updateParam("isActive", "true");
          else if (v === "inactive") updateParam("isActive", "false");
          else updateParam("isActive", null);
        }}
        className={pillGroupClass}
      >
        <ToggleGroupItem value="all" className={pillItemClass}>All</ToggleGroupItem>
        <ToggleGroupItem value="active" className={pillItemClass}>Active</ToggleGroupItem>
        <ToggleGroupItem value="inactive" className={pillItemClass}>Inactive</ToggleGroupItem>
      </ToggleGroup>

      <Select value={currentSort} onValueChange={(v) => updateParam("sort", v === "latest" ? null : v)}>
        <SelectTrigger className={cn("h-9 w-44", inputTheme)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}