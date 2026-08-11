import { apiFetch } from "./client";
import {
  GetNotificationsResponse,
  ClearReadNotificationsResponse,
  MarkAllReadResponse,
  UpdateNotificationResponse,
  DeleteNotificationResponse,
} from "@/types/api/notification.types";

// ==========================================
// GET /api/notifications
// Paginated, plus unreadCount for a badge. Always live —
// notifications are exactly the kind of data you never
// want stale.
// ==========================================
export function getNotifications(params?: { unreadOnly?: boolean; page?: number; limit?: number }) {
  return apiFetch<GetNotificationsResponse>("/api/notifications", {
    params,
    cache: "no-store",
  });
}

// ==========================================
// DELETE /api/notifications
// Bulk-clears all READ notifications (not unread ones).
// ==========================================
export function clearReadNotifications() {
  return apiFetch<ClearReadNotificationsResponse>("/api/notifications", {
    method: "DELETE",
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/notifications/mark-all-read
// ==========================================
export function markAllNotificationsRead() {
  return apiFetch<MarkAllReadResponse>("/api/notifications/mark-all-read", {
    method: "PATCH",
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/notifications/[id]
// Toggle a single notification's read state.
// ==========================================
export function updateNotification(id: string, isRead: boolean) {
  return apiFetch<UpdateNotificationResponse>(`/api/notifications/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isRead }),
    cache: "no-store",
  });
}

// ==========================================
// DELETE /api/notifications/[id]
// ==========================================
export function deleteNotification(id: string) {
  return apiFetch<DeleteNotificationResponse>(`/api/notifications/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
}