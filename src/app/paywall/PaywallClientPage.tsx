"use client";
// src/app/paywall/PaywallClientPage.tsx — Mockup 3 design (開啟完整塔羅啟示)

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRICING_TIERS, type PricingTier } from "@/lib/pricing";
import CheckoutPlanButtons from "@/components/CheckoutPlanButtons";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

// ─── Pricing card ─────────────────────────────────────────────
function PricingCard({
  tier,
  readingId,
  isRecommended,
}: {
  tier: PricingTier;
  readingId: string;
  isRecommended: boolean;
}) {
  const planMap: Record<string, "19" | "39" | "88"> = {
    single: "19",
    triple: "39",
    deep: "88",
  };
  const plan = planMap[tier.id];

  return (
    <div
      className="relative rounded-2xl p-6 transition-all duration-300"
      style={{
        background: isRecommended
          ? "linear-gradient(145deg, rgba(26,34,50,0.9) 0%, rgba(19,25,32,0.9) 100%)"
          : "rgba(19,25,32,0.6)",
        border: isRecommended
          ? "1.5px solid rgba(233,195,73,0.45)"
          : "1px solid rgba(233,195,73,0.12)",
        boxShadow: isRecommended
          ? "0 0 40px rgba(233,195,73,0.08), 0 8px 32px rgba(0,0,0,0.4)"
          : "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="font-sans text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
              color: "#0f141b",
            }}
          >
            推薦
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-semibold" style={{ color: "#e8e8e8" }}>
            {tier.label}
          </h3>
          <p className="font-sans text-xs mt-0.5" style={{ color: "#9aabb8" }}>
            {tier.tagline}
          </p>
          {tier.badge && (
            <span
              className="inline-block font-sans text-xs px-2 py-0.5 rounded-full mt-1.5"
              style={{
                background: isRecommended ? "rgba(233,195,73,0.12)" : "rgba(209,188,255,0.08)",
                border: isRecommended ? "1px solid rgba(233,195,73,0.25)" : "1px solid rgba(209,188,255,0.15)",
                color: isRecommended ? "#e9c349" : "#d1bcff",
              }}
            >
              {tier.badge}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0 ml-4">
          {tier.strikeStr && (
            <div
              className="font-sans text-xs line-through mb-0.5"
              style={{ color: "rgba(154,171,184,0.4)" }}
            >
              {tier.strikeStr}
            </div>
          )}
          <div
            className="font-serif font-bold leading-none"
            style={{
              fontSize: isRecommended ? 28 : 22,
              color: isRecommended ? "#e9c349" : "rgba(232,232,232,0.85)",
            }}
          >
            {tier.priceStr}
          </div>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-5">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 font-sans text-sm">
            <span style={{ color: "#e9c349", flexShrink: 0 }}>✦</span>
            <span style={{ color: isRecommended ? "rgba(232,232,232,0.85)" : "rgba(154,171,184,0.8)" }}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      <CheckoutPlanButtons readingId={readingId} plan={plan} buttonLabel={tier.cta} />
    </div>
  );
}

// ─── Email bonus section ──────────────────────────────────────
function EmailBonusSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/email-bonus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
        cache: "no-store",
      });
      const data = await res.json();
      setMsg(data?.message ?? (data?.ok ? "已送出！" : data?.error ?? "提交失敗"));
      if (data?.ok) setEmail("");
    } catch {
      setMsg("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(209,188,255,0.04)",
        border: "1px solid rgba(209,188,255,0.12)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color: "#d1bcff" }}>✦</span>
        <h3 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
          留下 Email，即送 2 次免費占卜
        </h3>
      </div>
      <p className="font-sans text-xs mb-4" style={{ color: "#9aabb8" }}>
        每日一次，完全免費，隨時取消
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          onKeyDown={(e) => e.key === "Enter" && void submit()}
          className="flex-1 font-sans text-sm rounded-xl px-4 py-2.5 focus:outline-none transition-all"
          style={{
            background: "rgba(19,25,32,0.8)",
            border: "1px solid rgba(209,188,255,0.2)",
            color: "#e8e8e8",
          }}
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={loading || !email.trim()}
          className="font-sans font-semibold text-sm px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 hover:brightness-110"
          style={{
            background: "rgba(209,188,255,0.15)",
            border: "1px solid rgba(209,188,255,0.25)",
            color: "#d1bcff",
          }}
        >
          {loading ? "…" : "送出"}
        </button>
      </div>
      {msg && (
        <p className="font-sans text-xs mt-2" style={{ color: "rgba(209,188,255,0.8)" }}>
          {msg}
        </p>
      )}
    </div>
  );
}

// ─── Restore access section ───────────────────────────────────
function RestoreSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/restore-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
        cache: "no-store",
      });
      const data = await res.json();
      setMsg(data?.message ?? (data?.ok ? "已恢復！" : data?.error ?? "恢復失敗"));
      if (data?.ok) setEmail("");
    } catch {
      setMsg("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(19,25,32,0.5)",
        border: "1px solid rgba(233,195,73,0.1)",
      }}
    >
      <h3 className="font-serif text-base font-semibold mb-1" style={{ color: "#e8e8e8" }}>
        已購買？恢復使用權限
      </h3>
      <p className="font-sans text-xs mb-4" style={{ color: "#9aabb8" }}>
        輸入購買時的 email，即時同步你的方案
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          onKeyDown={(e) => e.key === "Enter" && void submit()}
          className="flex-1 font-sans text-sm rounded-xl px-4 py-2.5 focus:outline-none transition-all"
          style={{
            background: "rgba(19,25,32,0.8)",
            border: "1px solid rgba(233,195,73,0.18)",
            color: "#e8e8e8",
          }}
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={loading || !email.trim()}
          className="font-sans font-semibold text-sm px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 hover:brightness-110"
          style={{
            background: "rgba(233,195,73,0.1)",
            border: "1px solid rgba(233,195,73,0.22)",
            color: "#e9c349",
          }}
        >
          {loading ? "…" : "恢復"}
        </button>
      </div>
      {msg && (
        <p className="font-sans text-xs mt-2" style={{ color: "rgba(233,195,73,0.75)" }}>
          {msg}
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function PaywallClientPage() {
  const searchParams = useSearchParams();
  const readingId = searchParams.get("readingId") ?? "";

  const primary = PRICING_TIERS.filter((t) => t.highlighted);
  const secondary = PRICING_TIERS.filter((t) => !t.highlighted);

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "#0f141b" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2"
        style={{
          width: 700,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(209,188,255,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      <TopNav />
      <SideNav />

      <div className="lg:pl-64 pt-20">
      <div className="relative z-10 max-w-lg mx-auto px-4 py-10 space-y-8">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="text-center space-y-3 pb-2">
          <span
            className="inline-block font-sans text-xs uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: "rgba(209,188,255,0.08)",
              border: "1px solid rgba(209,188,255,0.15)",
              color: "rgba(209,188,255,0.75)",
              letterSpacing: "0.2em",
            }}
          >
            完整塔羅啟示
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold" style={{ color: "#e8e8e8" }}>
            開啟完整塔羅啟示
          </h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>
            真正影響結果的訊號，藏在完整深度解讀裡。
          </p>
        </div>

        {/* ── What you unlock ─────────────────────────────── */}
        <div
          className="rounded-2xl p-5 space-y-2.5"
          style={{
            background: "rgba(19,25,32,0.6)",
            border: "1px solid rgba(233,195,73,0.1)",
          }}
        >
          <p
            className="font-sans text-xs uppercase tracking-widest mb-3"
            style={{ color: "rgba(154,171,184,0.5)", letterSpacing: "0.18em" }}
          >
            解鎖後你會知道
          </p>
          {[
            "為什麼事情會走到現在這一步",
            "對方或局勢背後真正的動機",
            "未來 1–3 個月的走向",
            "你最容易忽略的一個關鍵訊號",
            "最應該採取的下一步行動",
            "塔羅師給你的核心提醒與延伸問答",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 font-sans text-sm">
              <span style={{ color: "#e9c349", flexShrink: 0 }}>✦</span>
              <span style={{ color: "rgba(232,232,232,0.75)" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* ── Primary tier (recommended) ──────────────────── */}
        <div className="space-y-3">
          <p
            className="font-sans text-xs uppercase tracking-widest text-center"
            style={{ color: "rgba(154,171,184,0.4)", letterSpacing: "0.18em" }}
          >
            現在解鎖完整答案
          </p>
          {primary.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              readingId={readingId}
              isRecommended
            />
          ))}
        </div>

        {/* ── Divider ─────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(233,195,73,0.1)" }} />
          <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.4)" }}>
            更多選擇
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(233,195,73,0.1)" }} />
        </div>

        {/* ── Secondary tiers ─────────────────────────────── */}
        <div className="space-y-3">
          {secondary.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              readingId={readingId}
              isRecommended={false}
            />
          ))}
        </div>

        {/* ── Email bonus ──────────────────────────────────── */}
        <EmailBonusSection />

        {/* ── Restore access ──────────────────────────────── */}
        <RestoreSection />

        {/* ── Trust ───────────────────────────────────────── */}
        <div className="text-center space-y-2 pb-4">
          <div
            className="flex items-center justify-center gap-5 font-sans text-sm"
            style={{ color: "rgba(154,171,184,0.5)" }}
          >
            <span>🔐 付款安全</span>
            <span>⚡ 即時解鎖</span>
            <span>💾 永久保存</span>
          </div>
          <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.35)" }}>
            付款後立即解鎖，隨時重新查看
          </p>
        </div>

      </div>
      </div>{/* end lg:pl-64 pt-20 */}
    </div>
  );
}
