import { CartWithTotals } from "@/types/api/cart.types";

export function recomputeCartTotals(cart: CartWithTotals): CartWithTotals {
  const subtotal = cart.items.reduce((sum, item) => {
    const unitPrice = item.variant?.price ?? item.product?.price ?? 0;
    return sum + unitPrice * item.quantity;
  }, 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...cart, subtotal, itemCount };
}