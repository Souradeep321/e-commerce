// components/admin/orders/order-address-card.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";
import { OrderAddress } from "@/types/api/order.types";

interface OrderAddressCardProps {
  address: OrderAddress | null;
}

// Order.address is optional in schema.prisma (OrderAddress?), so a
// null address here is a legitimate, expected state to render for —
// not an error condition.
export function OrderAddressCard({ address }: OrderAddressCardProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <Card className={cn("gap-0 py-0", isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white")}>
      <CardHeader className="border-b p-0 [border-color:inherit]">
        <CardTitle className={cn("px-4 py-3 text-sm font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        {address ? (
          <div className={cn("space-y-1", isDark ? "text-neutral-300" : "text-neutral-700")}>
            <p className="font-medium">{address.fullName}</p>
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.country}</p>
            <p className={cn("pt-1", isDark ? "text-neutral-500" : "text-neutral-500")}>{address.phone}</p>
            {address.email && (
              <p className={isDark ? "text-neutral-500" : "text-neutral-500"}>{address.email}</p>
            )}
          </div>
        ) : (
          <p className={isDark ? "text-neutral-500" : "text-neutral-400"}>No address on file for this order.</p>
        )}
      </CardContent>
    </Card>
  );
}