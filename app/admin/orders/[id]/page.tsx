// app/admin/orders/[id]/page.tsx
import { notFound } from "next/navigation";
import { getAdminOrder } from "@/lib/api";
import { OrderDetailHeader } from "@/components/admin/orders/order-detail-header";
import { OrderCustomerCard } from "@/components/admin/orders/order-customer-card";
import { OrderAddressCard } from "@/components/admin/orders/order-address-card";
import { OrderPaymentCard } from "@/components/admin/orders/order-payment-card";
import { OrderItemsTable } from "@/components/admin/orders/order-items-table";
import { OrderStatusUpdate } from "@/components/admin/orders/order-status-update";
import { DeleteOrderDialog } from "@/components/admin/orders/delete-order-dialog";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

// GET /api/admin/orders/[id] returns { success, message, order }, with
// `order: null` accompanying a 404 (per AdminOrderDetailResponse's own
// comment) rather than throwing — so unlike the list page, a missing
// order needs an explicit notFound() check here, not just letting a
// throw bubble to error.tsx.
export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const { order } = await getAdminOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <OrderDetailHeader orderId={order.id} status={order.status} createdAt={order.createdAt} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <OrderItemsTable items={order.items} totalAmount={order.totalAmount} />
        </div>

        <div className="space-y-6">
          <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
          <OrderCustomerCard user={order.user} />
          <OrderAddressCard address={order.address} />
          <OrderPaymentCard
            razorpayOrderId={order.razorpayOrderId}
            razorpayPaymentId={order.razorpayPaymentId}
            paymentCaptured={order.paymentCaptured}
          />
        </div>
      </div>

      <DeleteOrderDialog orderId={order.id} />
    </div>
  );
}