// ==========================================
// Notification
// Matches the Notification model exactly — these routes
// return RAW notification rows, no nested relations
// (unlike reviews/questions, which nest user/product).
// entityId is a loosely-typed reference (order id, question
// id, etc.) — its meaning depends on `type`, not enforced
// by the type system itself.
// ==========================================
export interface Notification {
  id: string;
  userId: string | null; // null for admin-wide notifications
  audience: "ADMIN" | "CUSTOMER";
  type: "ORDER_PLACED" | "ORDER_STATUS_UPDATE" | "QUESTION_ANSWERED" | "REVIEW_APPROVED" | "SYSTEM";
  title: string;
  message: string;
  entityId: string | null;
  isRead: boolean;
  createdAt: string;
}

// ==========================================
// GET /api/notifications
// Paginated, plus unreadCount computed separately from the
// current page's results (so pagination doesn't affect the badge count).
// ==========================================
export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  unreadCount: number;
  notifications: Notification[];
}

// ==========================================
// DELETE /api/notifications
// Bulk-clears all READ notifications (not unread ones) —
// returns a count, not the deleted records.
// ==========================================
export interface ClearReadNotificationsResponse {
  success: boolean;
  message: string;
  deletedCount: number;
}

// ==========================================
// PATCH /api/notifications/mark-all-read
// ==========================================
export interface MarkAllReadResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}

// ==========================================
// PATCH /api/notifications/[id]
// Toggles a single notification's read state — request body
// is { isRead: boolean }, response echoes back the updated row.
// ==========================================
export interface UpdateNotificationResponse {
  success: boolean;
  message: string;
  notification: Notification;
}

// ==========================================
// DELETE /api/notifications/[id]
// ==========================================
export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}