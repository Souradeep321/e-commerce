"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number; // e.g. available stock — stepper won't exceed this
}

export function QuantityStepper({ quantity, onChange, max }: QuantityStepperProps) {
  const atMax = max !== undefined && quantity >= max;

  return (
    <div className="flex h-10 items-center border border-neutral-300">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-full w-9 rounded-none"
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm" aria-live="polite">
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-full w-9 rounded-none"
        disabled={atMax}
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}