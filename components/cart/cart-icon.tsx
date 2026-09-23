"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/CartProvider";

export function CartIcon() {
  const { itemCount, openDrawer } = useCart();

  return (
    <button
      type="button"
      aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      onClick={openDrawer}
      className="relative flex h-9 w-9 items-center justify-center text-neutral-600 hover:text-neutral-900"
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-medium text-white">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}