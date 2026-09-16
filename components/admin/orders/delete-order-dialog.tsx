// components/admin/orders/delete-order-dialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAdminTheme } from "../admin-theme-provider";
import { formatOrderNumber } from "@/lib/admin/order";
import { deleteOrder, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

interface DeleteOrderDialogProps {
  orderId: string;
}

// Copy matches what the route actually does (verified from
// app/api/admin/orders/[id]/route.ts DELETE): a real manual cascade
// inside a transaction — reviews for this order, then order items,
// then the address, then the order itself. Unlike products (where
// deletion is BLOCKED if order history exists via Restrict), there's
// no such guard here — this genuinely deletes an order and everything
// attached to it, unconditionally, regardless of its status.
export function DeleteOrderDialog({ orderId }: DeleteOrderDialogProps) {
  const router = useRouter();
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteOrder(orderId);
      toast.success("Order deleted");
      router.push("/admin/orders");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete order. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={cn(
        "mt-6 rounded-lg border p-4",
        isDark ? "border-red-900/50 bg-red-950/10" : "border-red-200 bg-red-50"
      )}
    >
      <p className={cn("text-sm font-medium", isDark ? "text-red-400" : "text-red-700")}>Danger Zone</p>
      <p className={cn("mt-1 text-sm", isDark ? "text-red-400/70" : "text-red-600")}>
        Deleting this order is permanent and cannot be undone. It also removes this order&apos;s reviews,
        line items, and shipping address — regardless of the order&apos;s current status.
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="mt-3 border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700">
            Delete Order
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete order {formatOrderNumber(orderId)}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the order along with its reviews, line items, and shipping
              address. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Deleting…" : "Delete order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}