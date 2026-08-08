import { apiFetch } from "./client";
import {
  SignUpResponse,
  VerifyEmailResponse,
  ResendVerificationResponse,
  CartMergeResponse,
} from "@/types/api/auth.types";
import { RegisterSchema } from "@/schemas/auth.schema";

// ==========================================
// POST /api/auth/sign-up
// ==========================================
export function signUp(data: RegisterSchema) {
  return apiFetch<SignUpResponse>("/api/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

// ==========================================
// POST /api/auth/verify
// Note: login itself is NOT here — that's NextAuth's signIn()
// from "next-auth/react", called directly in your login page/
// component, not through this API wrapper. This file only
// covers the auth-adjacent routes that aren't part of NextAuth's
// own flow (sign-up, email verification, resend, cart merge).
// ==========================================
export function verifyEmail(token: string, type: "EMAIL_VERIFICATION" = "EMAIL_VERIFICATION") {
  return apiFetch<VerifyEmailResponse>("/api/auth/verify", {
    method: "POST",
    body: JSON.stringify({ token, type }),
    cache: "no-store",
  });
}

// ==========================================
// POST /api/auth/resend-verification
// Requires an authenticated session (route uses requireAuthAPI) —
// cookies are sent automatically since this is same-origin.
// ==========================================
export function resendVerification() {
  return apiFetch<ResendVerificationResponse>("/api/auth/resend-verification", {
    method: "POST",
    cache: "no-store",
  });
}

// ==========================================
// POST /api/cart/merge
// Call this once, right after a successful signIn() or
// registerAndLogin() — see lib/auth-actions.ts for where
// this actually gets wired in.
// ==========================================
export function mergeCart() {
  return apiFetch<CartMergeResponse>("/api/cart/merge", {
    method: "POST",
    cache: "no-store",
  });
}