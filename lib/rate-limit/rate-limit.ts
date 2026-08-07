import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Strict: for auth-sensitive routes (login, sign-up, resend-verification)
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per 60 seconds
  prefix: "ratelimit:auth",
});

// Looser: for general write actions (add to cart, create review, ask question)
export const writeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  prefix: "ratelimit:write",
});