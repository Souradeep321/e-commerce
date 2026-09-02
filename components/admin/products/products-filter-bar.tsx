// components/admin/products/products-filter-bar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

interface ProductsFilterBarProps {
  categories: readonly string[];
}

// URL-state-driven, matching the storefront FilterBar convention.
// Same note as that component: this wires the URL params correctly,
// but doesn't actually filter the (mock) product array yet — matches
// the precedent already set on /products, where FilterBar's real
// filtering is deferred until real backend data replaces the mock.
export function ProductsFilterBar({ categories }: ProductsFilterBarProps) {
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

  // Debounced so every keystroke doesn't push a new URL entry.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (searchValue === current) return;

    const timeout = setTimeout(() => updateParam("q", searchValue || null), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const currentCategory = searchParams.get("category") ?? "all";
  const currentStatus = searchParams.get("status") ?? "all";

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
          placeholder="Search products..."
          className={cn(
            "h-9 w-64 pl-8",
            isDark
              ? "border-neutral-800 bg-neutral-900 text-neutral-100 placeholder:text-neutral-500 focus-visible:border-neutral-600 focus-visible:ring-0"
              : "border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-0"
          )}
        />
      </div>

      <ToggleGroup
        type="single"
        value={currentCategory}
        onValueChange={(v) => v && updateParam("category", v)}
        className={pillGroupClass}
      >
        <ToggleGroupItem value="all" className={pillItemClass}>All</ToggleGroupItem>
        {categories.map((c) => (
          <ToggleGroupItem key={c} value={c.toLowerCase()} className={pillItemClass}>
            {c}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <ToggleGroup
        type="single"
        value={currentStatus}
        onValueChange={(v) => v && updateParam("status", v)}
        className={pillGroupClass}
      >
        <ToggleGroupItem value="all" className={pillItemClass}>All</ToggleGroupItem>
        <ToggleGroupItem value="active" className={pillItemClass}>Active</ToggleGroupItem>
        <ToggleGroupItem value="inactive" className={pillItemClass}>Inactive</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}