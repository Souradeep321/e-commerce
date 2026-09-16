// components/admin/orders/order-payment-card.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";

interface OrderPaymentCardProps {
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paymentCaptured: boolean | null;
}

export function OrderPaymentCard({
  razorpayOrderId,
  razorpayPaymentId,
  paymentCaptured,
}: OrderPaymentCardProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const mutedText = isDark ? "text-neutral-500" : "text-neutral-400";
  const valueText = isDark ? "text-neutral-300" : "text-neutral-700";

  return (
    <Card className={cn("gap-0 py-0", isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white")}>
      <CardHeader className="border-b p-0 [border-color:inherit]">
        <CardTitle className={cn("px-4 py-3 text-sm font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className={mutedText}>Captured</span>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-medium uppercase tracking-wide",
              paymentCaptured
                ? isDark
                  ? "border-green-900 bg-green-950/40 text-green-400"
                  : "border-green-200 bg-green-50 text-green-700"
                : isDark
                  ? "border-neutral-700 bg-neutral-800 text-neutral-500"
                  : "border-neutral-200 bg-neutral-100 text-neutral-400"
            )}
          >
            {paymentCaptured ? "Yes" : "No"}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className={mutedText}>Razorpay Order</span>
          <span className={cn("truncate font-mono text-xs", valueText)}>{razorpayOrderId ?? "—"}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className={mutedText}>Razorpay Payment</span>
          <span className={cn("truncate font-mono text-xs", valueText)}>{razorpayPaymentId ?? "—"}</span>
        </div>
      </CardContent>
    </Card>
  );
}