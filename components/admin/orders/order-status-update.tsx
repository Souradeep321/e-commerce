// components/admin/orders/order-status-update.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminTheme } from "../admin-theme-provider";
import { ORDER_STATUS_VALUES, getOrderStatusLabel } from "@/lib/admin/order";
import { updateOrderStatus, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
}

// PATCH /api/admin/orders/[id] triggers a customer-facing
// ORDER_STATUS_UPDATE notification on every successful change (see
// the route source) — worth surfacing in the UI copy so an admin
// doesn't pick a status casually thinking it's a silent internal flag.
export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter();
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const inputTheme = isDark ? "border-neutral-800 bg-neutral-900 text-neutral-100" : "";

  const [selected, setSelected] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const isUnchanged = selected === currentStatus;

  async function handleUpdate() {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, selected);
      toast.success(`Order marked as ${getOrderStatusLabel(selected)}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update order status. Please try again.");
      setSelected(currentStatus); // revert the select to match reality
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Card className={cn("gap-0 py-0", isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white")}>
      <CardHeader className="border-b p-0 [border-color:inherit]">
        <CardTitle className={cn("px-4 py-3 text-sm font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
          Update Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className={cn("w-full", inputTheme)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUS_VALUES.map((status) => (
              <SelectItem key={status} value={status}>
                {getOrderStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-400")}>
          Changing the status notifies the customer.
        </p>

        <Button onClick={handleUpdate} disabled={isUnchanged || updating} className="w-full">
          {updating ? "Updating…" : "Update Status"}
        </Button>
      </CardContent>
    </Card>
  );
}