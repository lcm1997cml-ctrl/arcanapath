import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillCheckoutSession } from "@/lib/payments/fulfill";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    console.error("[stripe webhook] env missing: STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ ok: false, error: "Stripe webhook env missing" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, error: "Missing stripe-signature header" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe webhook] signature verification failed", error);
    return NextResponse.json({ ok: false, error: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    console.log("[stripe webhook] event received", { type: event.type, id: event.id });

    // `async_payment_succeeded` covers delayed payment methods; card payments
    // arrive as `completed` with payment_status="paid".
    if (
      event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.async_payment_succeeded"
    ) {
      return NextResponse.json({ ok: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const result = await fulfillCheckoutSession(stripe, session.id, "webhook");

    if (!result.ok) {
      // 'unpaid' is expected for async methods on `completed` — acknowledge so
      // Stripe stops retrying; fulfilment happens on async_payment_succeeded.
      if (result.reason === "unpaid" || result.reason === "unknown_kind") {
        return NextResponse.json({ ok: true, skipped: result.reason });
      }
      console.error("[stripe webhook] fulfilment rejected", { reason: result.reason, sessionId: session.id });
      return NextResponse.json({ ok: false, error: result.reason }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // 500 → Stripe retries; fulfilment is idempotent so retries are safe.
    console.error("[stripe webhook] update failed", error);
    return NextResponse.json({ ok: false, error: "Webhook processing failed" }, { status: 500 });
  }
}
