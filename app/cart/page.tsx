"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useCart } from "@/providers/CartProvider";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartEmptyState } from "@/components/cart/cart-empty-state";
import { formatPaise } from "@/lib/format";

export default function CartPage() {
  const { cart, loading, clearAll } = useCart();

  if (loading) {
    return (
      <main className="mx-auto flex max-w-4xl items-center justify-center px-4 py-24">
        <Spinner className="h-6 w-6 text-neutral-400" />
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-neutral-900">
          Your Cart <span className="text-base font-normal text-neutral-400">({cart.itemCount})</span>
        </h1>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="text-xs uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
            >
              Clear cart
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes every item currently in your cart. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => clearAll()}>Clear cart</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-8 divide-y divide-neutral-200 border-t border-neutral-200">
        {cart.items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-3 border-t border-neutral-200 pt-6">
        <div className="flex w-full max-w-xs items-center justify-between text-sm">
          <span className="text-neutral-500">Subtotal</span>
          <span className="font-medium text-neutral-900">{formatPaise(cart.subtotal)}</span>
        </div>
        <p className="max-w-xs text-right text-xs text-neutral-400">
          Shipping and taxes calculated at checkout.
        </p>
        <Button asChild className="w-full max-w-xs" size="lg">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </main>
  );
}