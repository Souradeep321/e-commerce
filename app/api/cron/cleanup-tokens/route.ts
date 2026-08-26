import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error-handler";

/**
 * Deletes AuthToken rows that are expired and were never used — the
 * leftovers createAuthToken()'s deleteMany() can't catch, since that
 * only prunes on the NEXT request of the same type; if the person never
 * comes back, the old row just sits there forever without this.
 *
 * Platform-agnostic: this is a plain route, callable by anything that
 * can make an authenticated HTTP request on a schedule (Vercel Cron,
 * a GitHub Actions scheduled workflow, cron-job.org, etc.) — only the
 * scheduler differs per platform, not this route.
 *
 * Auth: expects a shared secret, either as `Authorization: Bearer <secret>`
 * (what Vercel Cron sends automatically when CRON_SECRET is set) or as a
 * `?secret=` query param (for simpler external cron services that can't
 * set custom headers). Without a valid secret, this returns 401 — this
 * MUST stay protected, since it's a public URL that deletes DB rows.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const querySecret = searchParams.get("secret");

  const providedSecret = authHeader?.replace("Bearer ", "") ?? querySecret;

  if (!process.env.CRON_SECRET) {
    console.error("CRON_SECRET is not set — refusing to run cleanup.");
    return NextResponse.json(
      { success: false, message: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (providedSecret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await prisma.authToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.count} expired token(s).`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error in GET /api/cron/cleanup-tokens:", error);
    return handleApiError(error, "CLEANUP EXPIRED TOKENS");
  }
}