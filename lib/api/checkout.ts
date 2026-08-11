import { apiFetch } from "./client";
import {
  CheckoutGetResponse,
  CheckoutPostResponse,
} from "@/types/api/order.types";
import { OrderAddressInput } from "@/schemas/order.schema";

// ==========================================
// Request body for POST /api/checkout
// Either addressId (saved address) OR newAddress (typed fresh
// at checkout) — omit both to fall back to the user's default
// saved address. See the route's three-way branch for details.
// ==========================================
export interface CreateOrderRequest {
  addressId?: string;
  newAddress?: OrderAddressInput;
}

// ==========================================
// GET /api/checkout
// Pre-checkout summary — cart, saved addresses, user info.
// Always live: stock/prices can change, never cache this.
// ==========================================
export function getCheckoutDetails() {
  return apiFetch<CheckoutGetResponse>("/api/checkout", {
    cache: "no-store",
  });
}

// ==========================================
// POST /api/checkout
// Creates the order + Razorpay order. Response is intentionally
// reduced (id, totalAmount, razorpayOrderId, razorpayKeyId) —
// exactly what the Razorpay checkout widget needs on the frontend.
// ==========================================
export function createOrder(data: CreateOrderRequest) {
  return apiFetch<CheckoutPostResponse>("/api/checkout", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}