// src/lib/payments/fulfill.ts
// Single, idempotent fulfilment path for Stripe Checkout sessions.
// Used by BOTH the webhook and the post-checkout return (result page with
// ?session_id=…), so a paid user is unlocked immediately even if the webhook
// is delayed, and a duplicate webhook can never grant credits twice.
//
// Idempotency (no DB schema change):
//  1. reading_unlock: `markReadingPaidIfUnpaid` is an atomic false→true flip;
//     only the caller that flips grants plan credits.
//  2. Every fulfilled session gets `metadata.fulfilled = "1"` on Stripe;
//     the fresh session is re-fetched before granting anything.

import Stripe from "stripe";
import {
  addVisitorFreeCredits,
  addVisitorPlanCredits,
  getReadingPaidState,
  grantLeadPlan,
  markReadingPaidIfUnpaid,
  setVisitorUnlimitedPlan,
  updateReadingPaid,
} from "@/lib/store";

export type PaidPlan = "19" | "39" | "88";

export type FulfillResult =
  | { ok: true; kind: "reading_unlock"; readingId: string; plan: PaidPlan; granted: boolean }
  | { ok: true; kind: "reading_credits"; granted: boolean }
  | { ok: false; reason: "unpaid" | "invalid_metadata" | "unknown_kind" };

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeSingleton) stripeSingleton = new Stripe(key);
  return stripeSingleton;
}

function isPaid(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === "paid" || session.payment_status === "no_payment_required";
}

async function markFulfilled(stripe: Stripe, session: Stripe.Checkout.Session) {
  try {
    await stripe.checkout.sessions.update(session.id, {
      metadata: { ...(session.metadata ?? {}), fulfilled: "1" },
    });
  } catch (err) {
    // Not fatal: the reading flip still protects reading_unlock from doubles.
    console.error("[fulfill] could not mark session fulfilled", { sessionId: session.id, err });
  }
}

/**
 * Fulfil a checkout session. Always re-fetches the session from Stripe so the
 * `fulfilled` flag and payment status are current (never trusts the caller).
 */
export async function fulfillCheckoutSession(
  stripe: Stripe,
  sessionId: string,
  source: "webhook" | "return"
): Promise<FulfillResult> {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const meta = session.metadata ?? {};
  const alreadyFulfilled = meta.fulfilled === "1";

  if (!isPaid(session)) {
    console.warn("[fulfill] session not paid", { sessionId, status: session.payment_status, source });
    return { ok: false, reason: "unpaid" };
  }

  const visitorId = typeof meta.visitorId === "string" ? meta.visitorId.trim() : "";
  const email = session.customer_details?.email?.trim().toLowerCase() ?? "";

  // ── HK$9 extra reading credits ───────────────────────────────
  if (meta.checkoutKind === "reading_credits") {
    if (!visitorId) return { ok: false, reason: "invalid_metadata" };
    if (alreadyFulfilled) return { ok: true, kind: "reading_credits", granted: false };
    // Grant first, then mark: if the grant throws, Stripe retries and the
    // customer still gets what they paid for. (A double grant is only
    // possible if marking fails after a successful grant — logged.)
    await addVisitorFreeCredits(visitorId, 3);
    await markFulfilled(stripe, session);
    console.log("[fulfill] reading credits +3", { sessionId, source });
    return { ok: true, kind: "reading_credits", granted: true };
  }

  // ── Reading unlock (HK$19 / HK$39 / HK$88) ───────────────────
  const readingId = typeof meta.readingId === "string" ? meta.readingId.trim() : "";
  const plan = meta.plan as PaidPlan;
  if (!readingId || (plan !== "19" && plan !== "39" && plan !== "88")) {
    if (meta.checkoutKind && meta.checkoutKind !== "reading_unlock") {
      return { ok: false, reason: "unknown_kind" };
    }
    return { ok: false, reason: "invalid_metadata" };
  }

  const flipped = await markReadingPaidIfUnpaid(readingId, plan);
  let grant = flipped;
  if (!flipped && !alreadyFulfilled) {
    // Reading was already paid by something else (rare). Grant only if this
    // exact purchase has not been applied by a concurrent caller.
    const state = await getReadingPaidState(readingId);
    grant = !!state && state.paidPlan !== plan;
    if (grant) await updateReadingPaid(readingId, plan); // record this purchase's plan
  }

  if (grant) {
    await markFulfilled(stripe, session);
    if (visitorId) {
      if (plan === "39") await addVisitorPlanCredits(visitorId, 2); // 1 used on this reading
      if (plan === "88") await setVisitorUnlimitedPlan(visitorId, 30);
    } else {
      console.warn("[fulfill] no visitorId in metadata — visitor plan skipped", { readingId, plan });
    }
    if (email) await grantLeadPlan(email, plan);
  }

  console.log("[fulfill] reading unlock", { readingId, plan, granted: grant, source });
  return { ok: true, kind: "reading_unlock", readingId, plan, granted: grant };
}
