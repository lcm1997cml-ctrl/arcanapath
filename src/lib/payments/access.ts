// src/lib/payments/access.ts
// Server-side entitlement decision for a single reading.
// The ONLY ways to unlock a reading:
//   1. readings.is_paid in DB (webhook / previous unlock)
//   2. a Stripe session_id on the return URL that Stripe confirms as paid
//      for THIS reading (fulfilled on the spot — webhook may lag)
//   3. an account-level plan (HK$39 credits / HK$88 unlimited) on the
//      visitor cookie or restored email
//   4. admin session (signed cookie)
// Query params like ?paid=true&plan=88 are display hints only.

import type { ReadingResult } from "@/types";
import { fulfillCheckoutSession, getStripe, type PaidPlan } from "./fulfill";
import { unlockReadingWithAccountPlan } from "@/lib/store";

export type ReadingAccess = {
  unlocked: boolean;
  /** Plan that unlocked the reading, if known. */
  plan?: PaidPlan;
  /** True when this request just confirmed a Stripe payment. */
  justPaid: boolean;
};

const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

export async function resolveReadingAccess(opts: {
  reading: ReadingResult;
  isAdmin: boolean;
  visitorId?: string;
  restoredEmail?: string;
  stripeSessionId?: string;
}): Promise<ReadingAccess> {
  const { reading, isAdmin } = opts;
  const storedPlan = (reading as any)?.paidPlan as PaidPlan | undefined;

  if (isAdmin) return { unlocked: true, plan: storedPlan, justPaid: false };
  if (reading.isPaid) return { unlocked: true, plan: storedPlan, justPaid: false };

  // ── Returned from Stripe Checkout ───────────────────────────
  const sid = opts.stripeSessionId?.trim() ?? "";
  if (sid && SESSION_ID_RE.test(sid)) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sid);
        if (session.metadata?.readingId === reading.id) {
          const r = await fulfillCheckoutSession(stripe, sid, "return");
          if (r.ok && r.kind === "reading_unlock") {
            return { unlocked: true, plan: r.plan, justPaid: true };
          }
        } else {
          console.warn("[access] session_id does not belong to this reading", { readingId: reading.id });
        }
      } catch (err) {
        console.error("[access] stripe session verification failed", err);
      }
    }
  }

  // ── Account-level plan (credits / unlimited) ────────────────
  const visitorId = opts.visitorId?.trim() ?? "";
  if (visitorId) {
    try {
      const ok = await unlockReadingWithAccountPlan(reading.id, visitorId, opts.restoredEmail || undefined);
      if (ok) return { unlocked: true, justPaid: false };
    } catch (err) {
      console.error("[access] account plan check failed", err);
    }
  }

  return { unlocked: false, justPaid: false };
}
