import { apiFetch } from "./client";
import {
  OrdersGetResponse,
  OrderDetailResponse,
  AdminOrdersGetResponse,
  AdminOrderDetailResponse,
  AdminOrderStatusUpdateResponse,
  AdminOrderDeleteResponse,
} from "@/types/api/order.types";

// ---------- Customer ----------

// ==========================================
// GET /api/orders
// Customer's own order history, paginated. Order status can
// change (shipped, delivered) — keep this live, don't cache.
// ==========================================
export function getMyOrders(params?: { page?: number; limit?: number }) {
  return apiFetch<OrdersGetResponse>("/api/orders", {
    params,
    cache: "no-store",
  });
}

// ==========================================
// GET /api/orders/[id]
// Single order detail — ownership-checked server-side (403 if
// it's not yours). Never cache order-specific data.
// ==========================================
export function getMyOrder(id: string) {
  return apiFetch<OrderDetailResponse>(`/api/orders/${id}`, {
    cache: "no-store",
  });
}

// ---------- Admin ----------

// ==========================================
// GET /api/admin/orders
// All orders, filterable by status via query param.
// ==========================================
export function getAdminOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return apiFetch<AdminOrdersGetResponse>("/api/admin/orders", {
    params,
    cache: "no-store",
  });
}

// ==========================================
// GET /api/admin/orders/[id]
// Fuller detail than the customer version — includes user
// phone and variant price (not just size).
// ==========================================
export function getAdminOrder(id: string) {
  return apiFetch<AdminOrderDetailResponse>(`/api/admin/orders/${id}`, {
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/admin/orders/[id]
// Updates order status, triggers a customer notification.
// Returns a FLAT order object — no items/address relations,
// unlike the GET above. Re-fetch via getAdminOrder if you need
// the full detail after updating.
// ==========================================
export function updateOrderStatus(id: string, status: string) {
  return apiFetch<AdminOrderStatusUpdateResponse>(`/api/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    cache: "no-store",
  });
}

// ==========================================
// DELETE /api/admin/orders/[id]
// Manually cascades (reviews → items → address → order) in a
// transaction. Response reports counts of what was deleted,
// not the records themselves.
// ==========================================
export function deleteOrder(id: string) {
  return apiFetch<AdminOrderDeleteResponse>(`/api/admin/orders/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
}