"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useCart } from "@/lib/cart/use-cart";
import { formatPaise } from "@/lib/format";
import { ApiError } from "@/lib/api";
import { CartItem } from "@/types/api/cart.types";
import { cn } from "@/lib/utils";

interface CartItemRowProps {
  item: CartItem;
  compact?: boolean; // drawer usage — smaller image, tighter spacing
}

const DEBOUNCE_MS = 400;

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const { updateItem, removeItem } = useCart();
  const [pending, setPending] = useState(false);

  // Local, instant-feedback quantity — separate from the query cache so
  // every click redraws THIS row immediately without firing a mutation
  // per click. The cache (and therefore the icon/drawer/other rows) only
  // updates once the debounce settles and the real mutation's onMutate
  // fires — deliberate, not an oversight.
  const [displayQuantity, setDisplayQuantity] = useState(item.quantity);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resync local display quantity to the cache value whenever it changes
  // for a reason OTHER than this row's own pending debounced edit —
  // e.g. another tab's mutation landing via BroadcastChannel invalidation,
  // or a rollback from onError elsewhere.
  useEffect(() => {
    if (!debounceRef.current) setDisplayQuantity(item.quantity);
  }, [item.quantity]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function scheduleQuantityUpdate(next: number) {
    setDisplayQuantity(next); // instant local feedback, no network yet
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      debounceRef.current = null;
      setPending(true);
      try {
        await updateItem(item.id, next);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Couldn't update quantity. Please try again.");
        setDisplayQuantity(item.quantity); // roll local display back too
      } finally {
        setPending(false);
      }
    }, DEBOUNCE_MS);
  }

  async function handleRemove() {
    if (pending) return;
    if (debounceRef.current) {
      // Don't let a stale debounced quantity PATCH fire after this row
      // is already gone.
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setPending(true);
    try {
      await removeItem(item.id);
      // no reset-to-false-on-success — this row unmounts once the item
      // leaves cart.items in the query cache
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't remove item. Please try again.");
      setPending(false);
    }
  }

  // Product (and its variant, cascaded) can be deleted after this item
  // was added — schema.prisma sets both CartItem.productId/variantId to
  // null via onDelete: SetNull. Nothing left to price, size, or link to,
  // so this renders a reduced row with only a remove action, rather than
  // crashing on missing fields.
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
  const lineTotal = unitPrice * displayQuantity;
  const maxStock = item.variant?.stock; // undefined for flat products — server still enforces the real limit

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
              disabled={displayQuantity <= 1}
              onClick={() => scheduleQuantityUpdate(displayQuantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-neutral-500 disabled:opacity-30"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-xs">{displayQuantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={maxStock !== undefined && displayQuantity >= maxStock}
              onClick={() => scheduleQuantityUpdate(displayQuantity + 1)}
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
            {pending ? <Spinner className="size-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {!compact && (
        <p className="shrink-0 text-sm font-medium text-neutral-900">{formatPaise(lineTotal)}</p>
      )}
    </div>
  );
}