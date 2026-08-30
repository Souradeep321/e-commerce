// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
// Trusts the JWT's role claim — fine for API routes, where the
// worst case of a stale-but-recently-demoted token is bounded by
// the jwt() callback's own TTL-based self-heal (see options.ts).
// Do NOT use this for the /admin/* page layout — use
// requireAdminFresh() below there instead, since a page render is
// a much longer-lived, higher-blast-radius surface than one API call.
// ========================================
export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}

// ========================================
// Helper 3b: Require Admin — Fresh DB Check (Throws Error)
// Used specifically at the /admin/* layout level. The JWT's role
// claim can lag a real demotion by up to the jwt() callback's
// re-check interval (currently 5 min) — middleware.ts only checks
// the token, so it alone can't catch a demotion that happened
// moments ago. This re-verifies against the live DB value instead
// of trusting the token, closing that window at the point where it
// matters most: actually rendering admin-only pages/data.
// ========================================
export async function requireAdminFresh() {
  const user = await requireUser();

  const freshUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (freshUser?.role !== "ADMIN") {
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
// Same token-trust tradeoff as requireAdmin() above — acceptable
// for API routes given the bounded self-heal TTL. Not used by the
// /admin/* page layout.
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