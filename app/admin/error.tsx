// app/admin/error.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm font-medium text-neutral-900">Something went wrong.</p>
      <p className="text-sm text-neutral-500">{error.message || "Please try again."}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}