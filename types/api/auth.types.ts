// ==========================================
// Shared user shape (matches NextAuth session)
// ==========================================
export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  isVerified: boolean;
}

// ==========================================
// POST /api/auth/sign-up
// ==========================================
export interface SignUpResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// ==========================================
// POST /api/auth/verify
// ==========================================
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

// ==========================================
// POST /api/auth/resend-verification
// ==========================================
export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

// ==========================================
// POST /api/cart/merge
// ==========================================
export interface CartMergeResponse {
  success: boolean;
  message?: string;
}

// ==========================================
// POST /api/auth/request-reset
// Deliberately generic response regardless of whether the
// email exists — prevents user enumeration. Never check for
// a "user not found" case on the frontend; there isn't one.
// ==========================================
export interface RequestPasswordResetResponse {
  success: boolean;
  message: string;
}

// ==========================================
// POST /api/auth/reset-password
// ==========================================
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// ==========================================
// POST /api/auth/login-check
// Read-only rate-limit precheck — see the route's own comment for why
// this exists separately from NextAuth's credentials flow.
// ==========================================
export interface LoginCheckResponse {
  success: boolean;
  message?: string;
}