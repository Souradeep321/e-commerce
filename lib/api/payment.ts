import { apiFetch } from "./client";
import { PaymentVerifyRequest, PaymentVerifyResponse } from "@/types/api/order.types";

// ==========================================
// POST /api/payment/verify
// Called after Razorpay's checkout widget returns a successful
// payment client-side. Verifies the signature, decrements stock,
// creates notifications. Two possible outcomes — check
// `requiresRefund` before assuming a plain success/fail.
// ==========================================
export function verifyPayment(data: PaymentVerifyRequest) {
  return apiFetch<PaymentVerifyResponse>("/api/payment/verify", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}