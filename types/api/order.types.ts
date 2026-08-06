// ==========================================
// OrderAddress
// Matches the OrderAddress Prisma model — a frozen snapshot
// attached to one specific order. No isDefault (that concept
// only applies to saved UserAddress records, not order snapshots).
// ==========================================
export interface OrderAddress {
  id: string;
  fullName: string;
  email?: string | null;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ==========================================
// UserAddress
// Matches the UserAddress Prisma model — a user's saved,
// reusable address book entry. Has isDefault (unlike OrderAddress)
// and no email field (unlike OrderAddress, which has an optional one).
// ==========================================
export interface UserAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}
// ==========================================
// OrderProductSummary
// The reduced Product shape nested inside an order item —
// only what's needed to show "what did I buy" (name, image, link
// to the product page). Not the full Product model.
// ==========================================
export interface OrderProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  images: { url: string }[];
}

// ==========================================
// OrderVariantSummary
// Full variant shape — used only where a route selects the
// entire variant (price, stock, etc.), not just size.
// See OrderItemVariantPreview below for the size-only version,
// which is what most order routes actually return.
// ==========================================
export interface OrderVariantSummary {
  id: string;
  size: string;
  price: number;
  stock: number;
}

// ==========================================
// OrderItemVariantPreview
// Most order-listing routes only select { size: true } for the
// variant on an order item — not the full variant object.
// Kept separate from OrderVariantSummary so the type honestly
// reflects what's actually queried, not what's theoretically available.
// ==========================================
export interface OrderItemVariantPreview {
  size: string;
}

// ==========================================
// OrderItemBase
// Raw OrderItem fields, no relations — rarely used alone,
// mainly a building block for the "with relations" version below.
// ==========================================
export interface OrderItemBase {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// OrderItemWithRelations
// An order item as it appears in the customer's own order
// detail page — includes product summary and full variant
// (used by GET /api/orders/[id], which selects the complete
// variant object, not just size).
// ==========================================
export interface OrderItemWithRelations extends OrderItemBase {
  product: OrderProductSummary | null;
  variant: OrderVariantSummary | null;
}

// ==========================================
// OrderItemListPreview
// Lighter order item shape used by list-style routes
// (GET /api/orders, GET /api/admin/orders) — these only
// select { size: true } for variant, not the full object.
// ==========================================
export interface OrderItemListPreview extends OrderItemBase {
  product: OrderProductSummary;
  variant: OrderItemVariantPreview | null;
}

// ==========================================
// OrderSummary
// Full Order model shape, matching Prisma exactly.
// address is nullable because Order.address is optional in the
// schema (OrderAddress?) — even though in practice every checked-out
// order has one, the type stays honest about what Prisma allows.
// ==========================================
export interface OrderSummary {
  id: string;
  userId: string;
  totalAmount: number;
  status: "PENDING" | "PAID" | "FAILED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  paymentCaptured: boolean | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemWithRelations[];
  address: OrderAddress | null;
}

// ==========================================
// GET /api/checkout
// Pre-checkout summary: current cart + saved addresses + user info,
// used to render the checkout page before an order is created.
// ==========================================
export interface CheckoutCartSummaryItem {
  id: string;
  cartId: string;
  productId: string | null;
  variantId: string | null;
  quantity: number;
  product: OrderProductSummary | null;
  variant: OrderVariantSummary | null;
}

export interface CheckoutCartSummary {
  items: CheckoutCartSummaryItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CheckoutUserSummary {
  name: string | null;
  email: string;
}

// GET /api/checkout — corrected
export interface CheckoutGetResponse {
  success: boolean;
  data: {
    cart: CheckoutCartSummary;
    addresses: UserAddress[];   // ✅ fixed
    user: CheckoutUserSummary;
  };
}

// ==========================================
// POST /api/checkout
// Creates the order. Deliberately returns a REDUCED object —
// just enough to hand off to the Razorpay checkout widget on
// the frontend (order id, amount, Razorpay's own order id, key).
// Not the full Order — don't expect items/address here.
// ==========================================
export interface CheckoutPostResponse {
  success: boolean;
  message: string;
  order: {
    id: string;
    totalAmount: number;
    razorpayOrderId: string;
    razorpayKeyId: string | undefined;
  };
}

// ==========================================
// GET /api/orders
// Customer's own order history, paginated. Ownership is implicit —
// route filters by userId server-side, so every order here belongs
// to the requesting user.
// ==========================================
export interface OrderListItem extends Omit<OrderSummary, "items" | "address"> {
  items: OrderItemListPreview[];
  address: OrderAddress | null;
}

export interface OrdersGetResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  orders: OrderListItem[];
}

// ==========================================
// GET /api/orders/[id]
// Single order detail for the customer's own order.
// Route explicitly checks order.userId === current user before
// returning — 403 otherwise. Includes full variant object
// (not just size) and the shipping address.
// ==========================================
export interface OrderDetailResponse {
  success: boolean;
  message: string;
  order: OrderSummary | null; // null only accompanies a 404, check success first
}

// ==========================================
// GET /api/admin/orders
// Same list shape as customer's own history, but includes a
// user summary per order (since admin is viewing everyone's orders)
// and supports filtering by status via query param.
// ==========================================
export interface AdminOrderUserSummary {
  id: string;
  name: string | null;
  email: string;
}

export interface AdminOrderListItem extends OrderListItem {
  user: AdminOrderUserSummary;
}

export interface AdminOrdersGetResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  orders: AdminOrderListItem[];
}

// ==========================================
// GET /api/admin/orders/[id]
// Admin's single order detail — includes fuller user info
// (phone too, not just id/name/email) and variant with price
// (not just size), since admin needs more operational detail
// than a customer viewing their own order.
// ==========================================
export interface AdminOrderUserDetail extends AdminOrderUserSummary {
  phone: string | null;
}

export interface AdminOrderItemVariant {
  id: string;
  size: string;
  price: number;
}

export interface AdminOrderItem extends OrderItemBase {
  product: OrderProductSummary;
  variant: AdminOrderItemVariant | null;
}

export interface AdminOrderDetail extends Omit<OrderSummary, "items" | "address"> {
  user: AdminOrderUserDetail;
  items: AdminOrderItem[];
  address: OrderAddress | null;
}

export interface AdminOrderDetailResponse {
  success: boolean;
  message: string;
  order: AdminOrderDetail | null;
}

// ==========================================
// PATCH /api/admin/orders/[id]
// Updates order status, triggers a customer notification.
// Returns the updated order — but as a FLAT object, no
// items/address relations included (route doesn't re-fetch
// with include after update).
// ==========================================
export interface AdminOrderStatusUpdateResponse {
  success: boolean;
  message: string;
  order: Omit<OrderSummary, "items" | "address">;
}

// ==========================================
// DELETE /api/admin/orders/[id]
// Manually cascades deletion (reviews → items → address → order)
// inside a transaction. Returns counts of what was deleted,
// not the deleted records themselves.
// ==========================================
export interface AdminOrderDeleteResponse {
  success: boolean;
  message: string;
  deleted: {
    reviews: number;
    items: number;
    address: number; // 0 or 1, since an order has at most one address
  };
}

// ==========================================
// POST /api/payment/verify
// Request body shape — what the frontend must send after
// Razorpay's checkout widget returns a successful payment.
// ==========================================
export interface PaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

// ==========================================
// POST /api/payment/verify — response
// Two real outcomes with different shapes: normal success
// just confirms orderId; the "stock ran out after payment"
// case adds requiresRefund + errors — check requiresRefund
// before treating this as a simple success/fail.
// ==========================================
export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  orderId?: string;
  requiresRefund?: boolean;
  errors?: string[];
}