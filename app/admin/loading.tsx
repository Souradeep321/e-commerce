// app/admin/loading.tsx
import { Spinner } from "@/components/ui/spinner";

// This renders BEFORE app/admin/layout.tsx resolves — layout.tsx sits
// above this Suspense boundary, not inside it (a same-segment
// loading.tsx wraps page.tsx and nested routes, not its own sibling
// layout.tsx). That means AdminThemeProvider/AdminShell aren't mounted
// yet when this shows, so this stays intentionally neutral rather than
// guessing at a theme — it's a brief flash either way, not worth
// engineering around.
export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <Spinner className="size-6 text-neutral-400" />
    </div>
  );
}