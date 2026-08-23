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
  await signUp({ name, email, password }); // throws ApiError on failure — caller's catch handles it
  return loginAndMergeCart(email, password);
}