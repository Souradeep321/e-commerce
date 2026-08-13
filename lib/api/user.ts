import { apiFetch } from "./client";
import { GetProfileResponse, UpdateProfileResponse } from "@/types/api/user.types";
import { UpdateProfileSchema } from "@/schemas/auth.schema"; // z.infer<typeof updateProfileSchema>

// ==========================================
// GET /api/user/profile
// Account data — always live, never cache.
// ==========================================
export function getProfile() {
  return apiFetch<GetProfileResponse>("/api/user/profile", {
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/user/profile
// Partial update — name, phone, and/or password change
// (currentPassword required if setting newPassword).
// ==========================================
export function updateProfile(data: UpdateProfileSchema) {
  return apiFetch<UpdateProfileResponse>("/api/user/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}