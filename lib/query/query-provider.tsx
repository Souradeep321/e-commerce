"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function AppQueryProvider({ children }: { children: React.ReactNode }) {
  // useState (not a module-level singleton) so each request/session gets
  // its own client — standard TanStack Query + Next.js App Router setup,
  // avoids leaking cache across users on the server.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: true, // cross-tab fallback, per your requirement #6
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}