import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { nanoid } from "nanoid";
import { getReadingPaidState } from "@/lib/store";

// Never cache — every checkout is unique
export const dynamic = "force-dynamic";

const VISITOR_COOKIE = "arcana_visitor_id";

const PLAN_CONFIG: Record<string, { amount: number; label: string; description: string }> = {
  "19": { amount: 1900, label: "ArcanaPath · 單次完整塔羅解讀", description: "解鎖完整深度報告、核心訊息與三步行動建議" },
  "39": { amount: 3900, label: "ArcanaPath · 三次完整塔羅解讀", description: "三份完整深度報告，適合多個問題" },
  "88": { amount: 8800, label: "ArcanaPath · 30 日無限解讀", description: "30 天內無限次完整塔羅解讀" },
};

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("[/api/create-checkout] STRIPE_SECRET_KEY not set");
      return NextResponse.json({ ok: false, error: "Payment not configured" }, { status: 500 });
    }

    const body = (await req.json()) as { readingId?: string; plan?: string | number };
    const readingId = typeof body.readingId === "string" ? body.readingId.trim() : "";
    const plan = String(body.plan ?? "");

    if (!readingId) {
      return NextResponse.json({ ok: false, error: "readingId is required" }, { status: 400 });
    }
    if (!/^[A-Za-z0-9_-]{6,40}$/.test(readingId)) {
      return NextResponse.json({ ok: false, error: "readingId is invalid" }, { status: 400 });
    }
    if (!PLAN_CONFIG[plan]) {
      return NextResponse.json({ ok: false, error: "Invalid plan" }, { status: 400 });
    }

    // Don't let someone pay for a reading that doesn't exist / is already unlocked.
    try {
      const state = await getReadingPaidState(readingId);
      if (!state) {
        return NextResponse.json({ ok: false, error: "找不到此占卜，請重新占卜" }, { status: 404 });
      }
      if (state.isPaid) {
        return NextResponse.json({ ok: false, error: "此占卜已解鎖，請重新整理頁面" }, { status: 409 });
      }
    } catch (err) {
      // DB hiccup must not block a paying customer — continue to checkout.
      console.error("[/api/create-checkout] reading check failed (continuing)", err);
    }

    // Pass visitorId in metadata so webhook can grant multi-reading credits
    // for HK$39 (3 readings) and HK$88 (30-day unlimited) plans.
    let visitorId = req.cookies.get(VISITOR_COOKIE)?.value?.trim() ?? "";
    if (!visitorId) visitorId = nanoid(18);

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://arcanapath-two.vercel.app").replace(/\/$/, "");
    const stripe = new Stripe(secretKey, { apiVersion: "2026-02-25.clover" });

    const planCfg = PLAN_CONFIG[plan];
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Collect email so Stripe can send receipts to customers
      customer_creation: "always",
      billing_address_collection: "auto",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "hkd",
            unit_amount: planCfg.amount,
            product_data: {
              name: planCfg.label,
              description: planCfg.description,
            },
          },
        },
      ],
      // visitorId allows webhook to update visitor-level plan access
      metadata: {
        readingId,
        plan,
        visitorId,
        checkoutKind: "reading_unlock",
      },
      // session_id lets the result page verify payment server-side with Stripe
      // (the old ?paid=true&plan=… alone was trivially forgeable).
      success_url: `${appUrl}/result/${readingId}?paid=true&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/result/${readingId}`,
    });

    if (!session.url) {
      console.error("[/api/create-checkout] no session URL returned");
      return NextResponse.json({ ok: false, error: "Failed to create checkout URL" }, { status: 500 });
    }

    console.log("[/api/create-checkout] session created", {
      readingId,
      plan,
      visitorId: visitorId.slice(0, 6) + "…",
      sessionId: session.id,
    });

    // Ensure the visitor cookie is set on the response so the same visitor
    // is recognised when they return from Stripe.
    const res = NextResponse.json({ ok: true, url: session.url });
    res.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return res;
  } catch (error) {
    console.error("[/api/create-checkout] error:", error);
    return NextResponse.json({ ok: false, error: "Failed to create checkout session" }, { status: 500 });
  }
}
