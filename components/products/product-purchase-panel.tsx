"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductDetail } from "@/types/api/product.types";
import { formatDetailPrice } from "@/lib/format";
import { VariantSelector } from "./variant-selector";
import { QuantityStepper } from "./quantity-stepper";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductPurchasePanelProps {
  product: ProductDetail;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? null;

  // Reset quantity on size change — a quantity of 3 carried over from a
  // previous size could exceed the newly-selected size's stock.
  function handleSelectVariant(variantId: string | null) {
    setSelectedVariantId(variantId);
    setQuantity(1);
  }

  const maxQuantity =
    product.variants.length > 0 ? selectedVariant?.stock : product.stock ?? undefined;


  return (
    <div>
      {product.category && (
        <Link
          href={`/categories/${product.category.slug}`}
          className="mb-4 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
        >
          <ChevronLeft className="h-3 w-3" />
          Back to {product.category.name}
        </Link>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          {product.category && (
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {product.category.name}
            </p>
          )}
          <h1 className="font-serif text-4xl leading-tight text-neutral-900">
            {product.name}
          </h1>
        </div>

        {product.ourRecommendation && (
          <Badge variant="outline" className="shrink-0 gap-1">
            <Star className="h-3 w-3 fill-current" />
            Our Pick
          </Badge>
        )}
      </div>

      {/* Rating summary intentionally omitted — ProductDetail only returns a
          5-item review preview, not a real averageRating/totalReviews. The
          accurate version comes from getProductReviews(slug) in stage 2. */}

      <p className="mt-4 text-2xl text-neutral-900">
        {formatDetailPrice(product, selectedVariant)}
      </p>

      <div className="mt-6">
        <VariantSelector
          variants={product.variants}
          selectedVariantId={selectedVariantId}
          onSelect={handleSelectVariant}
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <QuantityStepper quantity={quantity} onChange={setQuantity} max={maxQuantity} />
        <AddToCartButton
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
        />
      </div>
    </div>
  );
}