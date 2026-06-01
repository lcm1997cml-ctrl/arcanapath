"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type PlanValue = "19" | "39" | "88";

const PLANS: Array<{ plan: PlanValue; label: string }> = [
  { plan: "19", label: "HK$19 即可查看完整答案" },
  { plan: "39", label: "HK$39 三次完整解讀" },
  { plan: "88", label: "HK$88 人生深度版" },
];

// Redirect target when no readingId is present
const DRAW_URL = "/reading";
const NO_READING_MSG = "請先完成一次占卜，再解鎖你的完整靈魂答案 ✨";

export default function CheckoutPlanButtons({
  readingId,
  plan,
  buttonLabel,
}: {
  readingId: string;
  plan?: PlanValue;
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");
  // true while we're showing the "redirecting" message
  const [redirecting, setRedirecting] = useState(false);

  const startCheckout = async (targetPlan: PlanValue) => {
    // ── Guard: no readingId → friendly redirect, no API call ──
    if (!readingId || !readingId.trim()) {
      setRedirecting(true);
      setError(NO_READING_MSG);
      setTimeout(() => router.push(DRAW_URL), 1600);
      return;
    }

    setLoadingPlan(targetPlan);
    setError("");
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: readingId.trim(), plan: targetPlan }),
      });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setError(data.error ?? "建立付款失敗，請重試");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("網絡錯誤，請稍後再試");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plansToRender = plan ? PLANS.filter((p) => p.plan === plan) : PLANS;
  const isDisabled = loadingPlan !== null || redirecting;

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {plansToRender.map(({ plan, label }) => (
        <button
          key={plan}
          onClick={() => void startCheckout(plan)}
          disabled={isDisabled}
          className="flex-shrink-0 font-serif font-bold text-white text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-lg transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #b45309 0%, #92400e 100%)",
            boxShadow: "0 3px 14px rgba(180,83,9,0.4), inset 0 1px 0 rgba(255,200,100,0.12)",
          }}
        >
          {loadingPlan === plan
            ? "處理中…"
            : redirecting
            ? "前往占卜 ✨"
            : `🔓 ${buttonLabel ?? label}`}
        </button>
      ))}
      {error && (
        <div
          className="w-full text-right text-xs font-serif mt-1"
          style={{ color: redirecting ? "#e9c349" : "#f87171" }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
