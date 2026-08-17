"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProductVariant } from "@/types/api/product.types";

const LOW_STOCK_THRESHOLD = 5;

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string | null) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length === 0) return null; // flat-price product — nothing to pick

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-neutral-500">Size</span>
        {selectedVariantId && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900"
          >
            Clear
          </button>
        )}
      </div>

      <ToggleGroup
        type="single"
        value={selectedVariantId ?? ""}
        onValueChange={(value) => onSelect(value || null)}
        className="mt-2 flex-wrap justify-start"
      >
        {variants.map((variant) => {
          const outOfStock = variant.stock === 0;

          return (
            <ToggleGroupItem
              key={variant.id}
              value={variant.id}
              disabled={outOfStock}
              aria-label={
                outOfStock ? `${variant.size}, out of stock` : `Size ${variant.size}`
              }
              className="h-10 min-w-10 border border-neutral-300 px-3 text-sm
                         data-[state=on]:border-neutral-900 data-[state=on]:bg-neutral-900
                         data-[state=on]:text-white
                         disabled:cursor-not-allowed disabled:border-dashed
                         disabled:text-neutral-300 disabled:line-through"
            >
              {variant.size}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {selectedVariant &&
        selectedVariant.stock > 0 &&
        selectedVariant.stock <= LOW_STOCK_THRESHOLD && (
          <p className="mt-2 text-xs text-red-600">
            Only {selectedVariant.stock} left in size {selectedVariant.size}
          </p>
        )}
    </div>
  );
}