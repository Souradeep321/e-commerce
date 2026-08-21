"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/schemas/auth.schema";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { loginAndMergeCart } from "@/lib/auth-actions";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginSchema) {
    setSubmitting(true);
    setFormError(null);
    try {
      const result = await loginAndMergeCart(values.email, values.password);
      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh(); // re-render server components that read the session (e.g. nav)
      } else {
        setFormError("Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
            <Input
              {...field}
              id="sign-in-email"
              type="email"
              autoComplete="email"
              aria-invalid={fieldState.invalid}
              placeholder="you@example.com"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-xs text-neutral-500 hover:text-neutral-900"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              {...field}
              id="sign-in-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {formError && (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Signing in…" : "Sign In"}
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-neutral-900 underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </form>
  );
}