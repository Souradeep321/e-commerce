// components/admin/theme-toggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useAdminTheme } from "./admin-theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAdminTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      onClick={toggleTheme}
      className={cn(
        "relative flex h-7 w-12 shrink-0 items-center rounded-full border p-0.5 transition-all duration-200",

        isDark
          ? "border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
          : "border-neutral-300 bg-neutral-200 hover:bg-neutral-300"
      )}
    >
      {/* Sliding knob */}
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-transform duration-200",

          isDark
            ? "translate-x-5 bg-neutral-950"
            : "translate-x-0 bg-white"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-neutral-300" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-neutral-600" />
        )}
      </span>
    </button>
  );
}