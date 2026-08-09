import { apiFetch } from "./client";
import { CartResponse, ClearCartResponse } from "@/types/api/cart.types";
import { CartMergeResponse } from "@/types/api/auth.types";
import { CartItemInput } from "@/schemas/cart.schema";

// ==========================================
// GET /api/cart
// Works for both guest and authenticated users automatically —
// server reads the session or guest_session_id cookie.
// ==========================================
export function getCart() {
  return apiFetch<CartResponse>("/api/cart", {
    cache: "no-store",
  });
}

// ==========================================
// POST /api/cart
// Reuses CartItemInput from the Zod schema (productId,
// productVariantId, quantity) — same shape the backend
// validates against.
// ==========================================
export function addToCart(data: CartItemInput) {
  return apiFetch<CartResponse>("/api/cart", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/cart
// quantity: 0 removes the item entirely (route handles this
// as a delete, not an update) — same endpoint either way.
// ==========================================
export function updateCartItem(itemId: string, quantity: number) {
  return apiFetch<CartResponse>("/api/cart", {
    method: "PATCH",
    body: JSON.stringify({ itemId, quantity }),
    cache: "no-store",
  });
}

// ==========================================
// DELETE /api/cart
// Clears all items in the active cart (guest or authenticated).
// ==========================================
export function clearCart() {
  return apiFetch<ClearCartResponse>("/api/cart", {
    method: "DELETE",
    cache: "no-store",
  });
}

// ==========================================
// POST /api/cart/merge
// Call once, right after a successful signIn()/registerAndLogin()
// — see lib/auth-actions.ts, not called standalone from UI.
// Already defined in lib/api/auth.ts as mergeCart() — re-exported
// here too for discoverability if someone looks in cart.ts first.
// ==========================================
export { mergeCart } from "./auth";