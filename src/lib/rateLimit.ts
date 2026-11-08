// src/lib/rateLimit.ts
// Best-effort, in-memory fixed-window rate limiter.
//
// Scope: per server instance. On Vercel (Fluid compute) instances are reused,
// so this reliably stops bursts / scripted loops from a single client without
// needing Redis or a DB schema change. It is NOT a global quota — durable
// limits still come from visitor_usage in Supabase.

import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 20_000;

function sweep(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }
  // Still too big (under attack) → drop oldest half to bound memory.
  if (buckets.size >= MAX_BUCKETS) {
    let i = 0;
    for (const k of buckets.keys()) {
      if (i++ > MAX_BUCKETS / 2) break;
      buckets.delete(k);
    }
  }
}

/**
 * Returns true when the call is allowed, false when the limit is exceeded.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}

/** Client IP from Vercel / proxy headers. Never logged in full. */
export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim() || "unknown";
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
