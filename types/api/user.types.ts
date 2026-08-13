// ==========================================
// UserProfile
// Matches the curated select in GET/PATCH /api/user/profile —
// never includes password, matches SessionUser closely but
// adds createdAt (only on GET, not PATCH's response).
// ==========================================
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER";
  isVerified: boolean;
  createdAt?: string; // present on GET, absent on PATCH's response
}

export interface GetProfileResponse {
  success: boolean;
  message: string;
  profile: UserProfile;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  profile: UserProfile;
}