"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useCart } from "@/providers/CartProvider";
import { formatPaise } from "@/lib/format";
import { ApiError } from "@/lib/api";
import { CartItem } from "@/types/api/cart.types";
import { cn } from "@/lib/utils";

interface CartItemRowProps {
  item: CartItem;
  compact?: boolean; // drawer usage — smaller image, tighter spacing
}

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const { updateItem, removeItem } = useCart();
  const [pending, setPending] = useState(false);

  async function handleRemove() {
    if (pending) return;
    setPending(true);
    try {
      await removeItem(item.id);
      // no reset-to-false-on-success — this row unmounts once the item leaves cart.items
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't remove item. Please try again.");
      setPending(false);
    }
  }

  // Product (and its variant, cascaded) can be deleted after this item
  // was added — schema.prisma sets both CartItem.productId/variantId to
  // null via onDelete: SetNull. Nothing left to price, size, or link to,
  // so this is a reduced row with only a remove action, rather than a
  // crash on missing fields. Closes the "does the cart UI handle a null
  // product/variant" open item from KNOWN_ISSUES.md.
  if (!item.product) {
    return (
      <div className={cn("flex items-center gap-4 py-4", compact && "py-3")}>
        <div className={cn("shrink-0 rounded bg-neutral-100", compact ? "h-14 w-14" : "h-20 w-20")} />
        <p className="min-w-0 flex-1 text-sm italic text-neutral-400">
          This product is no longer available
        </p>
        <button
          type="button"
          aria-label="Remove item"
          disabled={pending}
          onClick={handleRemove}
          className="text-neutral-400 hover:text-red-500 disabled:opacity-30"
        >
          {pending ? <Spinner className="size-3.5" /> : <Trash2 className="size-3.5" />}
        </button>
      </div>
    );
  }

  const image = item.product.images[0]?.url;
  const unitPrice = item.variant?.price ?? item.product.price ?? 0;
  const lineTotal = unitPrice * item.quantity;
  const maxStock = item.variant?.stock; // undefined for flat products — server still enforces the real limit

  async function handleQuantityChange(nextQuantity: number) {
    if (nextQuantity < 1 || pending) return;
    setPending(true);
    try {
      await updateItem(item.id, nextQuantity);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update quantity. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("flex items-center gap-4 py-4", compact && "py-3")}>
      <Link
        href={`/products/${item.product.slug}`}
        className={cn(
          "relative shrink-0 overflow-hidden rounded bg-neutral-100",
          compact ? "h-14 w-14" : "h-20 w-20"
        )}
      >
        {image && (
          <Image
            src={image}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes={compact ? "56px" : "80px"}
          />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${item.product.slug}`}
          className="line-clamp-1 text-sm font-medium text-neutral-900 hover:underline"
        >
          {item.product.name}
        </Link>
        {item.variant?.size && (
          <p className="mt-0.5 text-xs text-neutral-500">Size {item.variant.size}</p>
        )}
        <p className="mt-0.5 text-xs text-neutral-500">{formatPaise(unitPrice)} each</p>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center rounded-md border border-neutral-200">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={pending || item.quantity <= 1}
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-neutral-500 disabled:opacity-30"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-xs">
              {pending ? <Spinner className="mx-auto size-3" /> : item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={pending || (maxStock !== undefined && item.quantity >= maxStock)}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-neutral-500 disabled:opacity-30"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Remove item"
            disabled={pending}
            onClick={handleRemove}
            className="text-neutral-400 hover:text-red-500 disabled:opacity-30"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!compact && (
        <p className="shrink-0 text-sm font-medium text-neutral-900">{formatPaise(lineTotal)}</p>
      )}
    </div>
  );
}