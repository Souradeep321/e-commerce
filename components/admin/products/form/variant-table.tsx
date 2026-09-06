// components/admin/products/form/variant-table.tsx
"use client";

// import { Controller, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import {
  Controller,
  Control,
  UseFormRegister,
  FieldErrors,
  FieldArrayWithId,
} from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminTheme } from "../../admin-theme-provider";
import { getStockStatus } from "@/lib/admin/product";
import { cn } from "@/lib/utils";
import { ProductFormValues, ProductFormInput } from "@/lib/admin/product-form-schema";

interface VariantRow {
  size: string;
  priceRupees: number;
  stock: number;
}

// interface VariantTableProps {
//   control: Control<ProductFormValues>;
//   register: UseFormRegister<ProductFormValues>;
//   errors: FieldErrors<ProductFormValues>;
//   fields: (VariantRow & { id: string })[];
//   onAdd: () => void;
//   onRemove: (index: number) => void;
// }
interface VariantTableProps {
  control: Control<ProductFormInput>;
  register: UseFormRegister<ProductFormInput>;
  errors: FieldErrors<ProductFormInput>;
  fields: FieldArrayWithId<ProductFormInput, "variants">[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const STATUS_COLORS: Record<string, { light: string; dark: string }> = {
  ok: { light: "text-green-700", dark: "text-green-400" },
  low: { light: "text-amber-700", dark: "text-amber-400" },
  out: { light: "text-red-700", dark: "text-red-400" },
};

export function VariantTable({ control, register, errors, fields, onAdd, onRemove }: VariantTableProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const borderColor = isDark ? "border-neutral-800" : "border-neutral-200";

  return (
    <div>
      <div className={cn("grid grid-cols-[1fr_1fr_1fr_auto] gap-3 border-b pb-2 text-xs uppercase tracking-wide", borderColor, isDark ? "text-neutral-500" : "text-neutral-400")}>
        <span>Size</span>
        <span>Price (₹)</span>
        <span>Stock</span>
        <span />
      </div>

      <div className="space-y-2 py-3">
        {fields.map((field, index) => {
          const stockValue = field.stock;
          const status = getStockStatus(Number(stockValue) || 0);
          const statusColor = STATUS_COLORS[status.tone][isDark ? "dark" : "light"];

          return (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] items-start gap-3">
              <div>
                <Input
                  placeholder="e.g. M"
                  {...register(`variants.${index}.size` as const)}
                  className={isDark ? "border-neutral-800 bg-neutral-900 text-neutral-100" : ""}
                />
                {errors.variants?.[index]?.size && (
                  <p className="mt-1 text-xs text-rose-500">{errors.variants[index]?.size?.message}</p>
                )}
              </div>

              <div>
                <Controller
                  control={control}
                  name={`variants.${index}.priceRupees` as const}
                  render={({ field: f }) => (
                    <Input
                      type="number"
                      placeholder="0"
                      value={typeof f.value === "number" ? f.value : ""}
                      onChange={(e) => f.onChange(e.target.valueAsNumber)}
                      className={isDark ? "border-neutral-800 bg-neutral-900 text-neutral-100" : ""}
                    />
                  )}
                />
                {errors.variants?.[index]?.priceRupees && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.variants[index]?.priceRupees?.message}
                  </p>
                )}
              </div>

              <div>
                <Controller
                  control={control}
                  name={`variants.${index}.stock` as const}
                  render={({ field: f }) => (
                    <Input
                      type="number"
                      placeholder="0"
                      value={typeof f.value === "number" ? f.value : ""}
                      onChange={(e) => f.onChange(e.target.valueAsNumber)}
                      className={isDark ? "border-neutral-800 bg-neutral-900 text-neutral-100" : ""}
                    />
                  )}
                />
                {/* Stock-status badge — a nice-to-have signal borrowed
                    from one of the two design references, computed
                    live from the row's own stock value. */}
                <p className={cn("mt-1 text-xs font-medium", statusColor)}>{status.label}</p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove variant"
                onClick={() => onRemove(index)}
              >
                <Trash2 className={isDark ? "text-neutral-500" : "text-neutral-400"} />
              </Button>
            </div>
          );
        })}
      </div>

      {typeof errors.variants?.message === "string" && (
        <p className="mb-2 text-xs text-rose-500">{errors.variants.message}</p>
      )}

      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="h-3.5 w-3.5" />
        Add variant
      </Button>
    </div>
  );
}