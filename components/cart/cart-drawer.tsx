"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { CartItemRow } from "./cart-item-row";
import { formatPaise } from "@/lib/format";
import { useCart } from "@/lib/cart/use-cart";
import { useIsDrawerOpen, closeDrawer } from "@/lib/cart/drawer-store";

export function CartDrawer() {
  const { cart, loading } = useCart();
  const isOpen = useIsDrawerOpen();
  const hasItems = !!cart && cart.items.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Your Cart{hasItems ? ` (${cart!.itemCount})` : ""}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner className="h-5 w-5 text-neutral-400" />
            </div>
          ) : !hasItems ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-6 w-6 text-neutral-300" />
              <p className="mt-3 text-sm text-neutral-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {cart!.items.map((item) => (
                <CartItemRow key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {hasItems && (
          <SheetFooter className="gap-3 border-t border-neutral-200">
            <div className="flex w-full items-center justify-between text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-medium text-neutral-900">{formatPaise(cart!.subtotal)}</span>
            </div>
            <Button asChild className="w-full" onClick={closeDrawer}>
              <Link href="/checkout">Checkout</Link>
            </Button>
            <Button asChild variant="outline" className="w-full" onClick={closeDrawer}>
              <Link href="/cart">View Cart</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}