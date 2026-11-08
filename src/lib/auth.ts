// src/lib/auth.ts
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import type { AppUser, UserRole, UsageLimit } from "@/types";
import { ROLE_LIMITS } from "@/types";

const ADMIN_SESSION_COOKIE = "arcana_session";

const ADMIN_SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Signing key for the admin session cookie. Reuses existing server-only env
 * (no new secret required). Rotating ADMIN_PASSWORD invalidates all sessions.
 */
function getAdminSessionKey(): string | null {
  const key = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  return key && key.length > 0 ? `arcana-admin-session:${key}` : null;
}

function signPayload(payloadB64: string, key: string): string {
  return createHmac("sha256", key).update(payloadB64).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Verify a signed admin session token: `<base64url(payload)>.<hmac>`.
 * Legacy unsigned tokens (plain base64 JSON) are rejected — they were
 * forgeable by anyone. The admin simply logs in again.
 */
function verifyAdminSessionToken(token: string): boolean {
  const key = getAdminSessionKey();
  if (!key) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!safeEqual(sig, signPayload(payloadB64, key))) return false;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as {
      role?: string;
      ts?: number;
    };
    if (payload?.role !== "admin") return false;
    if (typeof payload.ts !== "number" || Date.now() - payload.ts > ADMIN_SESSION_MAX_AGE_MS) return false;
    return true;
  } catch {
    return false;
  }
}

export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) return null;
    if (!verifyAdminSessionToken(token)) return null;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return null;

    const now = new Date().toISOString();
    return {
      id: "admin",
      email: adminEmail,
      name: "Admin",
      role: "admin",
      dailyUsage: 0,
      totalUsage: 0,
      isActive: true,
      createdAt: now,
      lastActiveAt: now,
    };
  } catch {
    return null;
  }
}

export function createAdminSessionToken(): string {
  const key = getAdminSessionKey();
  if (!key) throw new Error("Admin session key missing (ADMIN_PASSWORD not set)");
  const payloadB64 = Buffer.from(JSON.stringify({ role: "admin", ts: Date.now() })).toString("base64url");
  return `${payloadB64}.${signPayload(payloadB64, key)}`;
}

export async function authenticateAdmin(email: string, password: string): Promise<AppUser | null> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return null;

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== adminEmail.trim().toLowerCase()) return null;
  if (!safeEqual(password, adminPassword)) return null;
  const now = new Date().toISOString();
  return {
    id: "admin",
    email: adminEmail,
    name: "Admin",
    role: "admin",
    dailyUsage: 0,
    totalUsage: 0,
    isActive: true,
    createdAt: now,
    lastActiveAt: now,
  };
}

// ─── Check if user is admin ───────────────────────────────────
export function isAdmin(user: AppUser | null): boolean {
  return user?.role === "admin";
}

// ─── Get usage limits for user ────────────────────────────────
export function getUsageLimits(user: AppUser | null): UsageLimit {
  const role: UserRole = user?.role ?? "visitor";
  return ROLE_LIMITS[role];
}

// Compatibility helper for pages using newer RolePolicy shape.
export function getRolePolicy(user: AppUser | null): {
  dailyLimit: number;
  canSeeHistory: boolean;
  canBuyReport: boolean;
  showPaywall: boolean;
} {
  const limits = getUsageLimits(user);
  return {
    dailyLimit: limits.daily,
    canSeeHistory: limits.canSeeHistory,
    canBuyReport: limits.canBuyReport,
    showPaywall: limits.showPaywall,
  };
}

// ─── Check if user can do a reading ──────────────────────────
export function canDoReading(user: AppUser | null, visitorUsage = 0): boolean {
  if (!user) {
    return visitorUsage < ROLE_LIMITS.visitor.daily;
  }
  const limits = getUsageLimits(user);
  if (limits.daily === -1) return true;
  return user.dailyUsage < limits.daily;
}
