// components/admin/dashboard/period-selector.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

const PERIODS = [
  { value: "7", label: "7d" },
  { value: "30", label: "30d" },
  { value: "90", label: "90d" },
] as const;

// URL-driven, matching the established convention (FilterBar on
// /products) rather than local component state — keeps the chosen
// period shareable/bookmarkable and consistent with how filters work
// elsewhere in the app.
export function PeriodSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  const current = searchParams.get("period") ?? "30";

  function handleChange(value: string) {
    if (!value) return; // ToggleGroup fires "" on deselect — ignore, period is not optional
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <ToggleGroup
      type="single"
      value={current}
      onValueChange={handleChange}
      className={cn(
        "rounded-md border p-0.5",
        isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
      )}
    >
      {PERIODS.map((p) => (
        <ToggleGroupItem
          key={p.value}
          value={p.value}
          className={cn(
            "h-7 rounded-sm px-3 text-xs",
            isDark
              ? "text-neutral-400 data-[state=on]:bg-white data-[state=on]:text-neutral-900"
              : "text-neutral-500 data-[state=on]:bg-neutral-900 data-[state=on]:text-white"
          )}
        >
          {p.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}