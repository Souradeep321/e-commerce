// lib/auth-actions.ts
import { signIn } from "next-auth/react";

export async function loginAndMergeCart(email: string, password: string) {
  const result = await signIn("credentials", { email, password, redirect: false });

  if (result?.ok) {
    await fetch("/api/cart/merge", { method: "POST" });
  }

  return result;
}

export async function registerAndLogin(name: string, email: string, password: string) {
  // Step 1: create the account
  const res = await fetch("/api/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { ok: false, error: data.message || "Sign up failed" };
  }

  // Step 2: auto-login with the same credentials
  const loginResult = await loginAndMergeCart(email, password);

  return loginResult;
}