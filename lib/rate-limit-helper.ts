import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";

export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
) {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many requests. Please try again shortly.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  return null; // null means "not rate limited, continue"
}