// components/admin/products/form/delete-product-dialog.tsx
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
import { useAdminTheme } from "../../admin-theme-provider";
import { deleteProduct, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

interface DeleteProductDialogProps {
  productId: string;
  productName: string;
}

// Copy deliberately does NOT say "orders referencing this product
// will be affected" (as one of the reference designs showed) — that's
// inaccurate given OrderItem.product is onDelete: Restrict in
// schema.prisma. The DB will BLOCK deletion outright if any order
// references this product; it doesn't cascade into anything. The
// actual 409 from the route (if it happens) carries the precise
// explanation, surfaced via toast below.
export function DeleteProductDialog({ productId, productName }: DeleteProductDialogProps) {
  const router = useRouter();
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProduct(productId);
      toast.success("Product deleted");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        // Surfaces the route's real 409 message ("has order history,
        // mark Inactive instead") verbatim when that's what happened.
        toast.error(err.message);
      } else {
        toast.error("Failed to delete product. Please try again.");
      }
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
      <p className={cn("text-sm font-medium", isDark ? "text-red-400" : "text-red-700")}>
        Danger Zone
      </p>
      <p className={cn("mt-1 text-sm", isDark ? "text-red-400/70" : "text-red-600")}>
        Deleting this product is permanent and cannot be undone. If it has ever been ordered,
        deletion will be blocked — mark it Inactive instead to hide it from the storefront.
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="mt-3 border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700">
            Delete Product
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting <strong>{productName}</strong> is permanent and cannot be undone. If this
              product has any order history, deletion will fail and you&apos;ll need to mark it
              Inactive instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Deleting…" : "Delete product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}