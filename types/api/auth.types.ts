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