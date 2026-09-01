// components/admin/admin-shell.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutGrid,
  Package,
  Tag,
  ShoppingCart,
  HelpCircle,
  Bell,
  Menu,
  LogOut,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAdminTheme } from "./admin-theme-provider";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/questions", label: "Questions", icon: HelpCircle },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
] as const;

// Dashboard's own link is exact-match only ("/admin").
// Every other nav item stays active for its nested routes.
function isNavItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAdminTheme();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "flex min-h-screen",
        isDark
          ? "bg-neutral-950 text-neutral-100"
          : "bg-white text-neutral-900"
      )}
    >
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside
        className={cn(
          "hidden w-60 shrink-0 flex-col border-r lg:flex",
          isDark ? "border-neutral-800" : "border-neutral-200"
        )}
      >
        <SidebarContent
          isDark={isDark}
          pathname={pathname}
          userName={session?.user?.name}
          userEmail={session?.user?.email}
        />
      </aside>

      {/* =========================================================
          MAIN AREA
      ========================================================= */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* =======================================================
            TOP BAR
        ======================================================= */}
        <header
          className={cn(
            "flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6 lg:px-8 lg:hidden",
            isDark
              ? "border-neutral-800 bg-neutral-950"
              : "border-neutral-200 bg-white"
          )}
        >
          {/* Mobile menu */}
          <div className="flex items-center lg:hidden">
            <Sheet
              open={mobileOpen}
              onOpenChange={setMobileOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open admin navigation"
                  className={cn(
                    "h-9 w-9",
                    isDark
                      ? "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className={cn(
                  "w-60 border-0 p-0 sm:max-w-60",
                  isDark
                    ? "bg-neutral-950 text-neutral-100"
                    : "bg-white text-neutral-900"
                )}
              >
                <SheetTitle className="sr-only">
                  Admin navigation
                </SheetTitle>

                <SidebarContent
                  isDark={isDark}
                  pathname={pathname}
                  userName={session?.user?.name}
                  userEmail={session?.user?.email}
                  onNavigate={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Theme toggle */}
          <div className="ml-auto flex items-center ">
            <ThemeToggle />
          </div>
        </header>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}
        <main
          className={cn(
            "min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
            isDark ? "bg-neutral-950" : "bg-white"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

/* ===============================================================
   SIDEBAR
================================================================ */

interface SidebarContentProps {
  isDark: boolean;
  pathname: string;
  userName?: string | null;
  userEmail?: string | null;
  onNavigate?: () => void;
}

function SidebarContent({
  isDark,
  pathname,
  userName,
  userEmail,
  onNavigate,
}: SidebarContentProps) {
  const initials = (userName ?? userEmail ?? "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* =========================================================
          SIDEBAR HEADER
      ========================================================= */}
      <div className="flex items-center justify-between pt-5 px-5 ">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "h-5 w-5 rounded-sm",
              isDark ? "bg-white" : "bg-neutral-900"
            )}
          />

          <span
            className={cn(
              "text-xs font-bold uppercase tracking-[0.16em]",
              isDark ? "text-white" : "text-neutral-900"
            )}
          >
            Admin
          </span>
        </div>

        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================= */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(
            pathname,
            item.href
          );

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",

                active
                  ? isDark
                    ? "bg-neutral-800 font-medium text-white"
                    : "bg-neutral-100 font-medium text-neutral-900"
                  : isDark
                    ? "text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active
                    ? isDark
                      ? "text-neutral-200"
                      : "text-neutral-700"
                    : isDark
                      ? "text-neutral-600 group-hover:text-neutral-300"
                      : "text-neutral-400 group-hover:text-neutral-700"
                )}
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* =========================================================
          USER FOOTER
      ========================================================= */}
      <div
        className={cn(
          "border-t px-4 py-4",
          isDark
            ? "border-neutral-800"
            : "border-neutral-200"
        )}
      >
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
              isDark
                ? "bg-neutral-800 text-neutral-300"
                : "bg-neutral-100 text-neutral-600"
            )}
          >
            {initials}
          </div>

          {/* User details */}
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate text-xs font-medium",
                isDark
                  ? "text-neutral-100"
                  : "text-neutral-900"
              )}
            >
              {userName ?? "Admin"}
            </p>

            <p
              className={cn(
                "truncate text-[11px]",
                isDark
                  ? "text-neutral-500"
                  : "text-neutral-400"
              )}
            >
              {userEmail}
            </p>
          </div>

          {/* Sign out */}
          <button
            type="button"
            aria-label="Sign out"
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
            className={cn(
              "shrink-0 rounded-md p-1.5 transition-colors",
              isDark
                ? "text-neutral-600 hover:bg-neutral-800 hover:text-neutral-200"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            )}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}