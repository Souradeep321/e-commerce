"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import {
  requestPasswordResetSchema,
  RequestPasswordResetInput,
} from "@/schemas/auth.schema";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/api";
import { ApiError } from "@/lib/api";

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: RequestPasswordResetInput) {
    setSubmitting(true);
    setFormError(null);

    try {
      await requestPasswordReset(values);
      setSubmitted(true); // backend always returns generic success — never branches on "email not found"
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setFormError(err.message);
      } else {
        console.error(err);
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="mb-3 font-serif text-[29px] font-normal leading-none text-neutral-950">
          Check your email
        </h1>
        <p className="text-[12px] leading-5 text-neutral-500">
          If an account exists for that email, we&apos;ve sent a link to
          reset your password.
        </p>

        <p className="pt-6 text-center text-[11px] text-neutral-400">
          <Link
            href="/sign-in"
            className="text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-orange-600"
          >
            Back to sign in
          </Link>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1 className="mb-3 font-serif text-[29px] font-normal leading-none text-neutral-950">
        Reset your password
      </h1>
      <p className="mb-9 text-[12px] leading-5 text-neutral-500">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel
                htmlFor="forgot-password-email"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-800"
              >
                Email
              </FieldLabel>
              <Input
                {...field}
                id="forgot-password-email"
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@example.com"
                className="h-8 rounded-none border-0 border-b border-neutral-300 bg-transparent px-0 text-[12px] text-neutral-900 shadow-none placeholder:text-neutral-300 focus-visible:border-neutral-700 focus-visible:ring-0"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-[11px]" />
              )}
            </Field>
          )}
        />

        <AnimatePresence>
          {formError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-0.5 text-[11px] leading-5 text-rose-400"
              role="alert"
            >
              {formError}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 w-full rounded-none bg-neutral-950 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-none hover:bg-neutral-800 disabled:opacity-100"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="size-3.5" />
              Sending…
            </span>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <p className="pt-4 text-center text-[11px] text-neutral-400">
          <Link
            href="/sign-in"
            className="text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-orange-600"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </motion.div>
  );
}