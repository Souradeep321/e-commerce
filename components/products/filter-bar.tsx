// "use client";

// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { PublicCategory } from "@/types/api/category.types";

// interface FilterBarProps {
//   categories: PublicCategory[];
// }

// const GENDER_OPTIONS = [
//   { value: "MEN", label: "Men" },
//   { value: "WOMEN", label: "Women" },
//   { value: "UNISEX", label: "Unisex" },
// ];

// const SORT_OPTIONS = [
//   { value: "latest", label: "Newest" },
//   { value: "price_asc", label: "Price: Low to High" },
//   { value: "price_desc", label: "Price: High to Low" },
// ];

// export function FilterBar({ categories }: FilterBarProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   function updateParam(key: string, value: string | null) {
//     const params = new URLSearchParams(searchParams.toString());
//     if (value) {
//       params.set(key, value);
//     } else {
//       params.delete(key);
//     }
//     params.delete("page"); // any filter change invalidates current page position
//     router.push(`${pathname}?${params.toString()}`);
//   }

//   return (
//     <div className="flex flex-wrap items-center gap-3">
//       <Select
//         value={searchParams.get("category") ?? "all"}
//         onValueChange={(value) => updateParam("category", value === "all" ? null : value)}
//       >
//         <SelectTrigger className="w-40">
//           <SelectValue placeholder="Category" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Categories</SelectItem>
//           {categories.map((category) => (
//             <SelectItem key={category.id} value={category.slug}>
//               {category.name}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Select
//         value={searchParams.get("gender") ?? "all"}
//         onValueChange={(value) => updateParam("gender", value === "all" ? null : value)}
//       >
//         <SelectTrigger className="w-35">
//           <SelectValue placeholder="Gender" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All</SelectItem>
//           {GENDER_OPTIONS.map((option) => (
//             <SelectItem key={option.value} value={option.value}>
//               {option.label}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Select
//         value={searchParams.get("sort") ?? "latest"}
//         onValueChange={(value) => updateParam("sort", value)}
//       >
//         <SelectTrigger className="w-45">
//           <SelectValue placeholder="Sort by" />
//         </SelectTrigger>
//         <SelectContent>
//           {SORT_OPTIONS.map((option) => (
//             <SelectItem key={option.value} value={option.value}>
//               {option.label}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PublicCategory } from "@/types/api/category.types";

interface FilterBarProps {
  // Omit entirely to hide the category switcher — e.g. on
  // /categories/[slug], the category is already fixed by the route,
  // not something to reassign via a `?category=` query param (the
  // category page's own endpoint doesn't accept a category override,
  // and a real switcher belongs in the future header nav, not here).
  categories?: PublicCategory[];
  // Opt-in — GET /api/products doesn't support `q` (search there is a
  // separate autocomplete flow), but GET /api/categories/[slug] does.
  // Defaults to false so existing /products usage is unaffected.
  showSearch?: boolean;
}

const GENDER_OPTIONS = [
  { value: "MEN", label: "Men" },
  { value: "WOMEN", label: "Women" },
  { value: "UNISEX", label: "Unisex" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function FilterBar({ categories, showSearch = false }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // any filter change invalidates current page position
    router.push(`${pathname}?${params.toString()}`);
  }

  // Debounced search input — same debounce pattern as the admin
  // products filter bar (components/admin/products/products-filter-bar.tsx),
  // adapted for the storefront. Local state so every keystroke doesn't
  // push a new URL entry.
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    if (!showSearch) return;
    const current = searchParams.get("q") ?? "";
    if (searchValue === current) return;

    const timeout = setTimeout(() => updateParam("q", searchValue || null), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, showSearch]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showSearch && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search this category..."
            className="h-9 w-56 pl-8"
          />
        </div>
      )}

      {categories && categories.length > 0 && (
        <Select
          value={searchParams.get("category") ?? "all"}
          onValueChange={(value) => updateParam("category", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={searchParams.get("gender") ?? "all"}
        onValueChange={(value) => updateParam("gender", value === "all" ? null : value)}
      >
        <SelectTrigger className="w-35">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {GENDER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("sort") ?? "latest"}
        onValueChange={(value) => updateParam("sort", value)}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}