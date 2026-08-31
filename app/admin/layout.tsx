// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { requireAdminFresh } from "@/lib/auth";
import { AdminThemeProvider } from "@/components/admin/admin-theme-provider";
import { AdminShell } from "@/components/admin/admin-shell";

// middleware.ts already blocks non-admin *tokens* from reaching this
// layout, but that check is only as fresh as the token — a user
// demoted in the last few minutes can still be holding an ADMIN
// token. This layout is the actual gate: it re-verifies role against
// the live DB before rendering anything under /admin.
//
// requireAdminFresh() throws rather than returning null — caught here
// and redirected, since a thrown error in a layout would otherwise
// surface Next's generic error boundary instead of a clean bounce.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdminFresh();
  } catch {
    redirect("/");
  }

  return (
    <AdminThemeProvider>
      <AdminShell>{children}</AdminShell>
    </AdminThemeProvider>
  );
}