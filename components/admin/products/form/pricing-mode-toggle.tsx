// components/admin/products/form/pricing-mode-toggle.tsx
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAdminTheme } from "../../admin-theme-provider";
import { cn } from "@/lib/utils";

interface PricingModeToggleProps {
  mode: "simple" | "variants";
  hasEnteredData: boolean; // whether the CURRENT mode has any real data to lose
  onSwitch: (mode: "simple" | "variants") => void;
}

// Both reference designs converged on requiring confirmation before a
// switch — implemented here as a real blocking dialog (not a browser
// confirm()), matching the app's existing shadcn-primitives convention.
export function PricingModeToggle({ mode, hasEnteredData, onSwitch }: PricingModeToggleProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [pendingMode, setPendingMode] = useState<"simple" | "variants" | null>(null);

  function handleClick(target: "simple" | "variants") {
    if (target === mode) return;
    if (hasEnteredData) {
      setPendingMode(target);
    } else {
      onSwitch(target);
    }
  }

  function confirmSwitch() {
    if (pendingMode) onSwitch(pendingMode);
    setPendingMode(null);
  }

  const baseBtn = cn(
    "h-8 flex-1 rounded-md text-sm font-medium transition-colors sm:flex-none sm:px-4"
  );
  const activeBtn = isDark ? "bg-white text-neutral-900" : "bg-neutral-900 text-white";
  const inactiveBtn = isDark
    ? "bg-transparent text-neutral-400 hover:text-neutral-200"
    : "bg-transparent text-neutral-500 hover:text-neutral-900";

  return (
    <>
      <div
        className={cn(
          "inline-flex rounded-md border p-0.5",
          isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-neutral-50"
        )}
      >
        <button
          type="button"
          onClick={() => handleClick("simple")}
          className={cn(baseBtn, mode === "simple" ? activeBtn : inactiveBtn)}
        >
          Simple pricing
        </button>
        <button
          type="button"
          onClick={() => handleClick("variants")}
          className={cn(baseBtn, mode === "variants" ? activeBtn : inactiveBtn)}
        >
          Has sizes
        </button>
      </div>

      <AlertDialog open={pendingMode !== null} onOpenChange={(open) => !open && setPendingMode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch pricing mode?</AlertDialogTitle>
            <AlertDialogDescription>
              Switching pricing modes will clear the pricing and stock information you have
              entered for the current mode. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingMode(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSwitch}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}