"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { resetPasswordSchema, ResetPasswordInput } from "@/schemas/auth.schema";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/lib/api";
import { ApiError } from "@/lib/api";

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { token: token ?? "", newPassword: "" },
    });

    async function onSubmit(values: ResetPasswordInput) {
        setSubmitting(true);
        setFormError(null);

        try {
            await resetPassword(values);
            // No toast here — we're navigating away immediately, and the
            // destination page already shows a persistent confirmation banner
            // (?reset=true). A toast would just double up the same message.
            router.push("/sign-in?reset=true");
        } catch (err) {
            if (err instanceof ApiError) {
                // Backend already returns precise, user-safe messages for this
                // flow (invalid / already-used / expired token) — no need to
                // generalize them into something vaguer.
                setFormError(err.message);
            } else {
                console.error(err);
                setFormError("Something went wrong. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    // No token at all — the link was malformed, forwarded incorrectly, or
    // someone landed here directly. Don't render a form that can only ever
    // fail the same way.
    if (!token) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <h1 className="mb-3 font-serif text-[29px] font-normal leading-none text-neutral-950">
                    Invalid reset link
                </h1>
                <p className="text-[12px] leading-5 text-neutral-500">
                    This password reset link is missing or malformed. Request a new
                    one below.
                </p>

                <Link href="/forgot-password">
                    <Button className="mt-6 h-11 w-full rounded-none bg-neutral-950 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-none hover:bg-neutral-800">
                        Request New Link
                    </Button>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <h1 className="mb-9 font-serif text-[29px] font-normal leading-none text-neutral-950">
                Set a new password
            </h1>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <Controller
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1.5">
                            <FieldLabel
                                htmlFor="reset-password-new"
                                className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-800"
                            >
                                New Password
                            </FieldLabel>
                            <div className="relative">

                                <Input
                                    {...field}
                                    id="reset-password-new"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="••••••••"
                                    className="h-8 rounded-none border-0 border-b border-neutral-300 bg-transparent px-0 text-[12px] text-neutral-900 shadow-none focus-visible:border-neutral-700 focus-visible:ring-0"
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
                                <FieldError errors={[fieldState.error]} className="text-[11px]" />
                            )}
                            <p className="mt-0.5 text-[10px] leading-4 text-neutral-400">
                                Use 6+ characters including an uppercase letter, lowercase
                                letter, number, and special character.
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
                    className="mt-2 h-11 w-full rounded-none bg-neutral-950 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-none hover:bg-neutral-800 disabled:opacity-100"
                >
                    {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner className="size-3.5" />
                            Resetting…
                        </span>
                    ) : (
                        "Reset Password"
                    )}
                </Button>
            </form>
        </motion.div>
    );
}