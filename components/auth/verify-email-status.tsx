"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { verifyEmail, resendVerification } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

type Status = "loading" | "success" | "error";

export function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { status: sessionStatus, update: updateSession } = useSession(); // "authenticated" | "unauthenticated" | "loading"

  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const hasRun = useRef(false); // guards React Strict Mode's double-invoke in dev

  const [verifiedOnServer, setVerifiedOnServer] = useState(false);

  // Step 1: hit the verify API as soon as we have a token — this part
  // doesn't depend on the session being ready.
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus("error");
      setErrorMessage("This verification link is missing or malformed.");
      return;
    }

    verifyEmail(token)
      .then(() => {
        // DB write succeeded — now we just need the session synced.
        setVerifiedOnServer(true);
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(
          err instanceof ApiError ? err.message : "This link may have expired."
        );
      });
  }, [token]);

  // Step 2: only call update() once SessionProvider is actually ready.
  // This is the piece that was missing — update() was firing while
  // sessionStatus was still "loading" and silently no-oping.
  const hasSynced = useRef(false); // separate from hasRun — guards the update() call specifically

  useEffect(() => {
    if (!verifiedOnServer) return;
    if (sessionStatus === "loading") return; // wait for provider's initial load
    if (hasSynced.current) return;           // don't re-fire once we've already synced
    hasSynced.current = true;

    updateSession().then(() => setStatus("success"));
  }, [verifiedOnServer, sessionStatus]);

  async function handleResend() {
    setResending(true);
    try {
      const res = await resendVerification();
      toast.success(res.message);
      setResent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        console.error(err);
        toast.error("Failed to resend verification email. Please try again.");
      }
      setResent(false); // stay in the failure state so they can retry
    } finally {
      setResending(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center py-8">
        <Spinner className="size-6" />
        <p className="mt-4 text-[12px] text-neutral-500">
          Verifying your email…
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center border border-neutral-300">
          <Check className="h-5 w-5 text-neutral-900" />
        </div>
        <h1 className="mt-6 font-serif text-[26px] font-normal leading-none text-neutral-950">
          Email Verified
        </h1>
        <p className="mt-2 text-[12px] leading-5 text-neutral-500">
          Your email address has been confirmed.
        </p>
        <Link href="/" className="mt-8 w-full">
          <Button className="h-11 w-full rounded-none bg-neutral-950 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-none hover:bg-neutral-800">
            Continue to Store
          </Button>
        </Link>
      </motion.div>
    );
  }

  // status === "error"
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center border border-neutral-300">
        <X className="h-5 w-5 text-neutral-900" />
      </div>
      <h1 className="mt-6 font-serif text-[26px] font-normal leading-none text-neutral-950">
        Verification Failed
      </h1>
      <p className="mt-2 text-[12px] leading-5 text-neutral-500">
        {errorMessage}
      </p>

      {sessionStatus === "loading" ? (
        <div className="mt-8 flex items-center justify-center">
          <Spinner className="size-4" />
        </div>
      ) : sessionStatus === "authenticated" ? (
        resent ? (
          <p className="mt-8 text-[12px] text-neutral-500">
            A new verification email is on its way.
          </p>
        ) : (
          <Button
            onClick={handleResend}
            disabled={resending}
            className="mt-8 h-11 w-full rounded-none bg-neutral-950 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-none hover:bg-neutral-800"
          >
            {resending ? "Sending…" : "Resend Verification Email"}
          </Button>
        )
      ) : (
        <>
          <p className="mt-8 text-[12px] leading-5 text-neutral-500">
            Sign in first, then request a new verification email from your
            account.
          </p>
          <Link href="/sign-in" className="mt-3 w-full">
            <Button className="h-11 w-full rounded-none bg-neutral-950 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-none hover:bg-neutral-800">
              Sign In
            </Button>
          </Link>
        </>
      )}
    </motion.div>
  );
}