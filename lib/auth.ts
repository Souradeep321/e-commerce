// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

// ========================================
// Helper 1: Get Current User (No Error)
// ========================================
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

// ========================================
// Helper 2: Require User (Throws Error)
// ========================================
export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

// ========================================
// Helper 3: Require Admin (Throws Error)
// ========================================
export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}

// ========================================
// Helper 4: API Auth Guard (Returns Response)
// ========================================
export async function requireAuthAPI() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Please login to continue",
          requiresAuth: true,
        },
        { status: 401 }
      ),
    };
  }

  return {
    user: session.user,
    response: null,
  };
}

// ========================================
// Helper 5: API Admin Guard (Returns Response)
// ========================================
export async function requireAdminAPI() {
  const { user, response } = await requireAuthAPI();

  if (response) {
    return { user: null, response };
  }

  if (user!.role !== "ADMIN") {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}