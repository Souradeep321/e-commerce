"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { loginSchema, LoginSchema } from "@/schemas/auth.schema";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { checkLoginRateLimit } from "@/lib/api/auth";
import { ApiError } from "@/lib/api";
import { loginAndMergeCart } from "@/lib/auth-actions";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const justCreated = searchParams.get("created") === "true";

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);


  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginSchema) {
    setSubmitting(true);
    setFormError(null);
    try {
      await checkLoginRateLimit(values.email);

      const result = await loginAndMergeCart(values.email, values.password);
      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setFormError("The email or password you entered is incorrect.");
      }
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1 className="mb-9 font-serif text-[29px] font-normal leading-none text-neutral-950">
        Sign In
      </h1>

      {justCreated && (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Account created — please sign in.
        </p>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel
                htmlFor="sign-in-email"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-800"
              >
                Email
              </FieldLabel>

              <Input
                {...field}
                id="sign-in-email"
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@example.com"
                className="
                  h-8
                  rounded-none
                  border-0
                  border-b
                  border-neutral-300
                  bg-transparent
                  px-0
                  text-[12px]
                  text-neutral-900
                  shadow-none
                  placeholder:text-neutral-300
                  focus-visible:border-neutral-700
                  focus-visible:ring-0
                "
              />

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-[11px]"
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel
                htmlFor="sign-up-password"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-800"
              >
                Password
              </FieldLabel>

              <div className="relative">
                <Input
                  {...field}
                  id="sign-up-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  className="
            h-8
            rounded-none
            border-0
            border-b
            border-neutral-300
            bg-transparent
            px-0
            pr-8
            text-[12px]
            text-neutral-900
            shadow-none
            focus-visible:border-neutral-700
            focus-visible:ring-0
          "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            text-neutral-400
            transition-colors
            hover:text-neutral-700
          "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </button>
              </div>

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-[11px]"
                />
              )}

              <p className="mt-0.5 text-[10px] leading-4 text-neutral-400">
                Use 6+ characters including an uppercase letter, lowercase letter,
                number, and special character.
              </p>
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
          className="
            mt-2
            h-11
            w-full
            rounded-none
            bg-neutral-950
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-white
            shadow-none
            hover:bg-neutral-800
          "
        >
          {submitting ? "Signing in…" : "Sign In"}
        </Button>

        <p className="pt-4 text-center text-[11px] text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="
              text-neutral-500
              underline
              decoration-neutral-300
              underline-offset-2
              transition-colors
              hover:text-orange-600 
            "
          >
            Sign up
          </Link>
        </p>
      </form>
    </motion.div>
  );
}