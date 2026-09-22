"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addToCart, ApiError } from "@/lib/api";
import { ProductDetail, ProductVariant } from "@/types/api/product.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: ProductDetail;
  selectedVariant: ProductVariant | null;
  quantity: number;
}

export function AddToCartButton({ product, selectedVariant, quantity }: AddToCartButtonProps) {
  console.log("addtocartbutton-product", product)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();
  console.log("AddToCartButton - Selected Variant:", selectedVariant);

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
      const payload = hasVariants
        ? {
          productId: product.id,
          productVariantId: selectedVariant!.id,
          quantity,
        }
        : {
          productId: product.id,
          quantity,
        };

      console.log("ADD TO CART DEBUG:", {
        product,
        productId: product.id,
        selectedVariant,
        selectedVariantId: selectedVariant?.id,
        payload,
        payloadJSON: JSON.stringify(payload),
      });

      const response = await addToCart(payload);

      console.log("AddToCartButton - Add to Cart Response:", response);

      setStatus("idle");
      toast.success(response.message || "Added to cart!");
      router.refresh();
    } catch (err) {
      console.error("AddToCartButton - ERROR:", err);

      setStatus("error");

      toast.error(
        err instanceof ApiError
          ? err.message
          : "Failed to add to cart. Please try again."
      );
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