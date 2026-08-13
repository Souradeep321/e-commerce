import { apiFetch } from "./client";
import { AnalyticsResponse } from "@/types/api/analytics.types";

// ==========================================
// GET /api/admin/analytics
// Dashboard data — always live, never cache. ?period=<days>
// controls the date range for most stats (default 30).
// ==========================================
export function getAnalytics(period?: number) {
  return apiFetch<AnalyticsResponse>("/api/admin/analytics", {
    params: period ? { period } : undefined,
    cache: "no-store",
  });
}