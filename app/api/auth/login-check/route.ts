import { NextResponse } from "next/server";
import { authRateLimit } from "@/lib/rate-limit/rate-limit";
import { handleApiError } from "@/lib/api-error-handler";
import * as z from "zod";
import { emailValidation } from "@/schemas/auth.schema";

const loginCheckSchema = z.object({ email: emailValidation });

// Read-only precheck — does NOT consume from the rate limit bucket.
// authorize() in options.ts still does the real, consuming check via
// checkRateLimit(). This route exists purely so the frontend can show a
// distinguishable "rate limited" message BEFORE calling signIn(), since
// NextAuth v4 flattens every authorize() failure into the same generic
// "CredentialsSignin" error regardless of the actual reason.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginCheckSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // NOTE: verify this return shape against your installed
    // @upstash/ratelimit version's types — docs describe getRemaining()
    // as returning remaining/reset, but confirm via your IDE if this
    // doesn't typecheck.
    const { remaining, reset } = await authRateLimit.getRemaining(`login:${email}`);

    if (remaining <= 0) {
      const secondsUntilReset = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts. Please try again in ${secondsUntilReset} seconds.`,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/auth/login-check:", error);
    return handleApiError(error, "LOGIN RATE LIMIT CHECK");
  }
}