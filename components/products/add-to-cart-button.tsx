"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addToCart, ApiError } from "@/lib/api";
import { ProductDetail, ProductVariant } from "@/types/api/product.types";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: ProductDetail;
  selectedVariant: ProductVariant | null;
  quantity: number;
}

export function AddToCartButton({ product, selectedVariant, quantity }: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const hasVariants = product.variants.length > 0;
  const needsSizeSelection = hasVariants && !selectedVariant;
  const outOfStock = hasVariants
    ? selectedVariant !== null && selectedVariant.stock === 0
    : (product.stock ?? 0) === 0;

  const disabled = needsSizeSelection || outOfStock || status === "loading";

  const label = needsSizeSelection
    ? "Select a size"
    : outOfStock
      ? "Out of Stock"
      : status === "loading"
        ? "Adding…"
        : "Add to Cart";

  async function handleAddToCart() {
    setStatus("loading");
    try {
      await addToCart(
        hasVariants
          ? { productVariantId: selectedVariant!.id, quantity }
          : { productId: product.id, quantity }
      );
      setStatus("idle");
      toast.success("Added to cart!");
      // TODO: trigger cart drawer/toast confirmation once that UI exists
    } catch (err) {
      setStatus("error");
      toast.error("Failed to add to cart. Please try again.");
      // TODO: surface real error message via toast once toast system exists
      console.error(err instanceof ApiError ? err.message : err);
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      disabled={disabled}
      onClick={handleAddToCart}
      className="h-10 flex-1 bg-neutral-900 text-white hover:bg-neutral-800"
    >
      {label}
    </Button>
  );
}