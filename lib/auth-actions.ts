// lib/auth-actions.ts
import { signIn } from "next-auth/react";
import { mergeCart, signUp } from "@/lib/api/auth";

export async function loginAndMergeCart(email: string, password: string) {
  const result = await signIn("credentials", { email, password, redirect: false });

  if (result?.ok) {
    await mergeCart(); // ← reuses the function from lib/api/auth.ts
  }

  return result;
}

export async function registerAndLogin(name: string, email: string, password: string) {
  const res = await signUp({ name, email, password }); // ← also reuses lib/api/auth.ts

  if (!res.success) {
    return { ok: false, error: res.message };
  }

  return loginAndMergeCart(email, password);
}