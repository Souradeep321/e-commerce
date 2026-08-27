// components/layout/unverified-email-banner.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { resendVerification } from "@/lib/api";
import { ApiError } from "@/lib/api";

export function UnverifiedEmailBanner() {
    const { data: session, status: sessionStatus } = useSession();
    const pathname = usePathname();

    const [dismissed, setDismissed] = useState(false);
    const [resending, setResending] = useState(false);

    // Don't show while the session is still resolving — avoid a flash of
    // the banner for users who are actually verified, or aren't logged in.
    if (sessionStatus !== "authenticated") return null;
    if (session.user.isVerified) return null;
    if (dismissed) return null;
    // The verify-email page already has its own dedicated resend flow —
    // showing this banner on top of it would be redundant.
    if (pathname === "/verify-email") return null;

    async function handleResend() {
        setResending(true);
        try {
            const res = await resendVerification();
            toast.success(res.message);
        } catch (err) {
            if (err instanceof ApiError) {
                toast.error(err.message);
            } else {
                console.error(err);
                toast.error("Failed to resend verification email. Please try again.");
            }
        } finally {
            setResending(false);
        }
    }


    return (
        <div className="flex items-center justify-center gap-3 bg-neutral-900 px-4 py-2 text-center text-xs text-white">
            <span>
                Please verify your email address.{" "}
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="underline underline-offset-2 hover:text-neutral-300 disabled:opacity-60"
                >
                    {resending ? "Sending…" : "Resend verification email"}
                </button>
            </span>
            <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss"
                className="shrink-0 text-neutral-400 hover:text-white"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

