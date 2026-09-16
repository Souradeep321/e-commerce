// components/admin/orders/order-customer-card.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";
import { AdminOrderUserDetail } from "@/types/api/order.types";

interface OrderCustomerCardProps {
  user: AdminOrderUserDetail;
}

export function OrderCustomerCard({ user }: OrderCustomerCardProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <Card className={cn("gap-0 py-0", isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white")}>
      <CardHeader className="border-b p-0 [border-color:inherit]">
        <CardTitle className={cn("px-4 py-3 text-sm font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
          Customer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 p-4 text-sm">
        <p className={cn("font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
          {user.name ?? "—"}
        </p>
        <p className={isDark ? "text-neutral-400" : "text-neutral-500"}>{user.email}</p>
        <p className={isDark ? "text-neutral-400" : "text-neutral-500"}>{user.phone ?? "No phone on file"}</p>
      </CardContent>
    </Card>
  );
}