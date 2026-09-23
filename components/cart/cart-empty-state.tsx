import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartEmptyState() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <ShoppingBag className="h-8 w-8 text-neutral-300" />
      <p className="mt-4 text-sm font-medium text-neutral-900">Your cart is empty</p>
      <p className="mt-1 text-sm text-neutral-500">Looks like you haven&apos;t added anything yet.</p>
      <Button asChild className="mt-6">
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </main>
  );
}