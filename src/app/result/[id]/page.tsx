// =============================================================
// src/app/result/[id]/page.tsx
// Server component. Reads result, checks role/paywall,
// strips paid content if needed, renders ReadingSections.
//
// Changes:
//  - Sticky bottom bar shows "立即解鎖 HK$19" for non-unlocked users
//  - Admin / paid users see normal bottom nav instead
// =============================================================

import React, { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getReading } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { stripPaidContent } from "@/lib/reading/normalize";
import { resolveReadingAccess } from "@/lib/payments/access";
import { TOPIC_LABELS } from "@/types/reading";
import ResultClientPage from "./ResultClientPage";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string; plan?: string; planId?: string; session_id?: string }>;
}

// generateMetadata + page share one DB read per request.
const getReadingCached = cache(async (id: string) => getReading(id));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let question = "";
  try {
    question = (await getReadingCached(id))?.question ?? "";
  } catch {
    /* metadata must never crash the page */
  }
  const q = (question || "塔羅牌解讀").replace(/\s+/g, " ").trim().slice(0, 60);
  return {
    title: `AI塔羅牌解讀｜${q}`,
    description: "ArcanaPath 三張牌塔羅占卜結果：過去、現在、未來牌陣與 AI 塔羅解讀。",
    // Personal readings: keep out of search results (privacy + thin content).
    robots: { index: false, follow: true },
    alternates: { canonical: `/result/${id}` },
  };
}

export default async function ResultPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;

  // ── Fetch ──────────────────────────────────────────────────
  const rawResult = await getReadingCached(id);
  if (!rawResult) notFound();

  // ── Entitlement (server-verified only) ─────────────────────
  // ?paid=true&plan=… is NOT trusted any more: anyone could type it.
  // Payment is confirmed via DB flag or Stripe session_id verification.
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const access = await resolveReadingAccess({
    reading: rawResult,
    isAdmin: user?.role === "admin",
    visitorId: cookieStore.get("arcana_visitor_id")?.value,
    restoredEmail: cookieStore.get("arcana_lead_email")?.value,
    stripeSessionId: typeof query?.session_id === "string" ? query.session_id : undefined,
  });

  // Any paid plan unlocks the whole report (matches pricing copy: HK$19
  // includes timeline + Q&A; HK$39/88 "包含所有單次解鎖功能").
  const isUnlocked = access.unlocked;
  const paidPlan = access.plan ?? ((rawResult as any)?.paidPlan as string | undefined);

  const result = isUnlocked
    ? { ...rawResult, isPaid: rawResult.isPaid || access.justPaid || access.unlocked }
    : stripPaidContent(rawResult as any);
  const topicLabel = TOPIC_LABELS[result.topic] ?? result.topic;
  const dateStr    = new Date(result.createdAt).toLocaleDateString("zh-HK", {
    year: "numeric", month: "long", day: "numeric",
  });
  return (
    <>
      <ResultClientPage
        id={id}
        result={result as any}
        topicLabel={topicLabel}
        dateStr={dateStr}
        isPaidQuery={access.justPaid}
        paidPlan={paidPlan}
        isUnlocked={isUnlocked}
        userRole={user?.role}
        isLoggedIn={!!user}
      />
    </>
  );
}
