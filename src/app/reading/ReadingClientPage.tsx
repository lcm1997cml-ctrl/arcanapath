"use client";

// =============================================================
// src/app/reading/ReadingClientPage.tsx
// 4-phase flow: input → shuffle → fan-select → preview → submit
// Design: updated to new ArcanaPath design system (Mockup 1 oracle style)
// =============================================================

import React, { useState, useCallback, useEffect, memo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { Topic, DrawnCard } from "@/types/reading";
import { deck, serializeDrawnCards } from "@/lib/tarot/utils";
import TarotCard from "@/components/TarotCard";
import TarotFan from "@/components/TarotFan";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

// ─── Types ────────────────────────────────────────────────────

type Phase = "input" | "shuffle" | "select" | "preview" | "submitting";

const TOPICS: { value: Topic; label: string; icon: string; sub: string }[] = [
  { value: "love",   label: "感情", icon: "♥", sub: "關係・情感・連結" },
  { value: "career", label: "事業", icon: "◆", sub: "工作・方向・突破" },
  { value: "wealth", label: "財運", icon: "✦", sub: "金錢・機遇・資源" },
  { value: "life",   label: "人生", icon: "☽", sub: "方向・意義・成長" },
];

const FAN_COUNT  = 26;
const POSITIONS  = ["過去", "現在", "未來"];

// ─── Shuffle animation ────────────────────────────────────────
// memo: onDone identity is stable (useCallback), so this component
// will never re-render from the parent during its own animation.

const ShuffleAnimation = memo(function ShuffleAnimation({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const TOTAL = 6;

  useEffect(() => {
    if (step >= TOTAL) {
      const t = setTimeout(onDone, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 160);
    return () => clearTimeout(t);
  }, [step, onDone, TOTAL]);

  const done = step >= TOTAL;

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <p className="font-serif text-lg" style={{ color: done ? "#e9c349" : "rgba(232,232,232,0.65)" }}>
        {done ? "洗牌完成" : "正在洗牌，請保持專注…"}
      </p>

      {/* Card pile — real card-back image, GPU-composited transforms */}
      <div className="relative" style={{ width: 140, height: 110 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const offset = i - 2.5;
          const rot    = offset * (step % 2 === 0 ? 10 : -8) + step * 3.5;
          const tx     = offset * 6 + (step % 3 === 0 ? offset * 2 : 0);
          const ty     = Math.abs(offset) * 1.5;
          return (
            <div
              key={i}
              className="absolute rounded-[6px] overflow-hidden"
              style={{
                width: 54,
                height: 90,
                left: "50%",
                top: "50%",
                transformOrigin: "center 110%",
                // translate3d keeps transforms on GPU compositor
                transform: `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) rotate(${rot}deg)`,
                transition: "transform 0.22s ease",
                // Thin shadow only — heavy shadows repaint on every frame
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                zIndex: i,
                willChange: "transform",
                backfaceVisibility: "hidden",
                border: "1.5px solid rgba(233,195,73,0.35)",
              }}
            >
              <Image
                src="/images/tarot/card-back.PNG"
                alt=""
                fill
                sizes="54px"
                style={{ objectFit: "cover", objectPosition: "center" }}
                draggable={false}
                priority={i === 5}
              />
              {/* Thin gold border overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 0 1.5px rgba(200,160,40,0.5)",
                  borderRadius: 6,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 items-center">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-200"
            style={{
              width:  i < step ? 8 : 5,
              height: i < step ? 8 : 5,
              background: i < step ? "#e9c349" : "rgba(233,195,73,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
});

// ─── Selected cards preview ───────────────────────────────────

function SelectedPreview({
  cards,
  onConfirm,
  onReset,
  submitting,
  error,
}: {
  cards: DrawnCard[];
  onConfirm: () => void;
  onReset: () => void;
  submitting: boolean;
  error: string;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <p className="font-serif text-lg" style={{ color: "rgba(232,232,232,0.85)" }}>
          你選擇了三張牌
        </p>
        <p className="font-sans text-xs mt-1" style={{ color: "rgba(154,171,184,0.5)" }}>
          翻開後會顯示解讀
        </p>
      </div>

      <div className="flex items-end gap-8 justify-center">
        {cards.map((dc, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div
              className="font-sans text-xs uppercase tracking-widest"
              style={{ color: "rgba(154,171,184,0.6)", letterSpacing: "0.15em" }}
            >
              {POSITIONS[i]}
            </div>
            <TarotCard card={dc.card} faceDown selected size="lg" showLabel={false} />
          </div>
        ))}
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-2.5 font-sans text-sm text-center max-w-xs"
          style={{
            background: "rgba(207,102,121,0.1)",
            border: "1px solid rgba(207,102,121,0.25)",
            color: "#cf6679",
          }}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onConfirm}
          disabled={submitting}
          className="w-full font-sans font-semibold py-4 rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base"
          style={{
            background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
            color: "#0f141b",
            boxShadow: "0 4px 20px rgba(233,195,73,0.2)",
          }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin" style={{ animationDuration: "1.5s" }}>☽</span>
              解讀中…
            </span>
          ) : (
            "開始解讀 →"
          )}
        </button>
        <button
          onClick={onReset}
          disabled={submitting}
          className="font-sans text-sm transition-opacity hover:opacity-80"
          style={{ color: "rgba(154,171,184,0.55)" }}
        >
          重新選牌
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function ReadingClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase,     setPhase]     = useState<Phase>("input");
  const [question,  setQuestion]  = useState(searchParams.get("q") ?? "");
  const [topic,     setTopic]     = useState<Topic>("love");
  const [error,     setError]     = useState("");
  const [focused,   setFocused]   = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [toast, setToast] = useState("");
  const [lastReadingId, setLastReadingId] = useState("");
  const [remainingFreeHint, setRemainingFreeHint] = useState<number | null>(null);
  const [bonusEmail, setBonusEmail] = useState("");
  const [emailBonusLoading, setEmailBonusLoading] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [creditsCheckoutLoading, setCreditsCheckoutLoading] = useState(false);

  useEffect(() => {
    try {
      const savedRemaining = localStorage.getItem("arcana_remaining_free");
      if (savedRemaining !== null) {
        const parsed = Number(savedRemaining);
        if (!Number.isNaN(parsed)) setRemainingFreeHint(parsed);
      }
      const savedReadingId = localStorage.getItem("arcana_last_reading_id");
      if (savedReadingId) setLastReadingId(savedReadingId);
    } catch { /* ignore */ }
  }, []);

  const refreshRemainingFromServer = useCallback(async (retries = 0) => {
    try {
      const res = await fetch("/api/visitor-remaining", { method: "GET", cache: "no-store" });
      const data = await res.json();
      if (data?.ok && typeof data.remainingFreeCount === "number") {
        setRemainingFreeHint(data.remainingFreeCount);
        try { localStorage.setItem("arcana_remaining_free", String(data.remainingFreeCount)); } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 450));
      await refreshRemainingFromServer(retries - 1);
    }
  }, []);

  useEffect(() => { void refreshRemainingFromServer(1); }, [refreshRemainingFromServer]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (searchParams.get("credits") !== "1") return;
    setToast("付款成功，已為你加入 3 次占卜額度");
    void (async () => {
      await refreshRemainingFromServer(0);
      await new Promise((r) => setTimeout(r, 400));
      await refreshRemainingFromServer(0);
    })();
    router.replace("/reading");
  }, [refreshRemainingFromServer, router, searchParams]);

  // Fan state
  const [submittingMessage, setSubmittingMessage] = useState("牌陣已就緒…");
  const [fanOrder, setFanOrder]   = useState<{ cardIndex: number; reversed: boolean }[]>([]);
  const [selected, setSelected]   = useState<number[]>([]);

  const drawnCards: DrawnCard[] = selected.map((fi, pos) => {
    const entry = fanOrder[fi] ?? { cardIndex: 0, reversed: false };
    return { card: deck[entry.cardIndex], position: POSITIONS[pos] ?? `第${pos + 1}張`, reversed: entry.reversed };
  });

  const startShuffle = useCallback(() => {
    if (question.trim().length < 3) { setError("請輸入至少3個字的問題"); return; }
    setError("");
    setShowUnlockModal(false);
    const indices = Array.from({ length: deck.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setFanOrder(indices.slice(0, FAN_COUNT).map((ci) => ({ cardIndex: ci, reversed: Math.random() < 0.28 })));
    setSelected([]);
    setPhase("shuffle");
  }, [question]);

  const handleFanSelect = useCallback((index: number) => {
    setSelected((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index);
      if (prev.length >= 3) return prev;
      return [...prev, index];
    });
  }, []);

  const handleReveal = useCallback(() => {
    if (selected.length === 3) setPhase("preview");
  }, [selected]);

  const handleSubmit = useCallback(async () => {
    if (drawnCards.length !== 3) return;
    setPhase("submitting");
    setSubmittingMessage("牌陣已就緒…");
    setError("");

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), topic, cards: serializeDrawnCards(drawnCards) }),
      });

      // Non-2xx = JSON error (auth / validation failures)
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "發生錯誤，請重試" }));
        if (data.unlockRequired) { setShowUnlockModal(true); setPhase("input"); return; }
        if (typeof data.remainingFree === "number") {
          setRemainingFreeHint(data.remainingFree);
          try { localStorage.setItem("arcana_remaining_free", String(data.remainingFree)); } catch { /* ignore */ }
        }
        setError(data.error ?? "發生錯誤，請重試");
        setPhase("preview");
        return;
      }

      // 2xx = SSE stream
      if (!res.body) {
        setError("回應格式錯誤，請重試");
        setPhase("preview");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6)) as {
              type: string;
              message?: string;
              id?: string;
              remainingFree?: number | null;
              error?: string;
              unlockRequired?: boolean;
            };

            if (data.type === "progress" && data.message) {
              setSubmittingMessage(data.message);
            } else if (data.type === "done" && data.id) {
              if (typeof data.remainingFree === "number") {
                setRemainingFreeHint(data.remainingFree);
                try { localStorage.setItem("arcana_remaining_free", String(data.remainingFree)); } catch { /* ignore */ }
              }
              try { localStorage.setItem("arcana_last_reading_id", data.id); } catch { /* ignore */ }
              setLastReadingId(data.id);
              router.push(`/result/${data.id}`);
              break outer;
            } else if (data.type === "error") {
              if (data.unlockRequired) { setShowUnlockModal(true); setPhase("input"); break outer; }
              setError(data.error ?? "發生錯誤，請重試");
              setPhase("preview");
              break outer;
            }
          } catch { /* ignore malformed events */ }
        }
      }
    } catch {
      setError("網絡錯誤，請重試");
      setPhase("preview");
    }
  }, [drawnCards, question, topic, router]);

  const submitEmailBonus = useCallback(async () => {
    setEmailBonusLoading(true);
    try {
      const res = await fetch("/api/email-bonus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: bonusEmail.trim() }),
        cache: "no-store",
      });
      const data = await res.json();
      if (!data?.ok) { setToast(data?.error ?? "提交失敗"); return; }
      if (typeof data.remainingFreeCount === "number") {
        setRemainingFreeHint(data.remainingFreeCount);
        try { localStorage.setItem("arcana_remaining_free", String(data.remainingFreeCount)); } catch { /* ignore */ }
      }
      setToast(data.message ?? (data.awarded ? "已送你 +3 次占卜" : "已處理"));
      if (data.awarded) setBonusEmail("");
    } catch { setToast("網絡錯誤，請重試"); }
    finally { setEmailBonusLoading(false); }
  }, [bonusEmail]);

  const startCreditsCheckout = useCallback(async () => {
    setCreditsCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-reading-credits-checkout", { method: "POST", cache: "no-store" });
      const data = await res.json();
      if (data?.ok && data.url) { window.location.href = data.url; return; }
      setToast(data?.error ?? "無法開始付款");
    } catch { setToast("網絡錯誤，請重試"); }
    finally { setCreditsCheckoutLoading(false); }
  }, []);

  const submitRestoreAccess = useCallback(async () => {
    setRestoreLoading(true);
    try {
      const res = await fetch("/api/restore-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: restoreEmail.trim() }),
        cache: "no-store",
      });
      const data = await res.json();
      if (!data?.ok) { setToast(data?.error ?? "恢復失敗"); return; }
      if (typeof data.remainingFreeCount === "number") {
        setRemainingFreeHint(data.remainingFreeCount);
        try { localStorage.setItem("arcana_remaining_free", String(data.remainingFreeCount)); } catch { /* ignore */ }
      }
      setToast(data?.message ?? (data?.restored ? "已恢復可用權限" : "此 email 目前沒有可恢復內容"));
      if (data?.restored) { setRestoreEmail(""); await refreshRemainingFromServer(1); router.refresh(); }
    } catch { setToast("網絡錯誤，請重試"); }
    finally { setRestoreLoading(false); }
  }, [refreshRemainingFromServer, restoreEmail, router]);

  const phaseOrder: Phase[] = ["input", "shuffle", "select", "preview"];
  const stepIndex = phaseOrder.indexOf(phase as Phase);

  // Suppress unused var warning for lastReadingId
  void lastReadingId;

  return (
    <div
      className="min-h-screen text-white bg-background"
    >
      <TopNav remainingCount={remainingFreeHint} />
      <SideNav />

      <div className="lg:pl-64 pt-20">

      {/* ── Title + step indicator (hidden during immersive select phase) ── */}
      {phase !== "select" && (
        <>
          <div className="text-center pt-7 pb-2 px-4">
            <h1 className="font-serif text-xl font-semibold" style={{ color: "#e8e8e8" }}>
              塔羅占卜
            </h1>
          </div>

          <div className="flex justify-center gap-2 py-4">
            {phaseOrder.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      i <= stepIndex ? 28 : 8,
                  height:     6,
                  background: i <= stepIndex ? "#e9c349" : "rgba(233,195,73,0.15)",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Content ─────────────────────────────────────────── */}
      <div className={phase === "select" ? "" : "pb-20"}>

        {/* INPUT */}
        {phase === "input" && (
          <div className="max-w-md mx-auto px-5 space-y-6">

            {/* Oracle textarea */}
            <div className="space-y-2">
              <label className="font-serif text-sm block" style={{ color: "#e9c349" }}>
                你的問題
              </label>
              <div
                className={`rounded-2xl transition-all duration-300 ${focused ? "oracle-focused" : ""}`}
                style={{
                  border: focused
                    ? "1px solid rgba(233,195,73,0.45)"
                    : "1px solid rgba(233,195,73,0.18)",
                  background: "rgba(19,25,32,0.8)",
                }}
              >
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="例：我同佢嘅關係仲有未來嗎？我係咪應該轉行？"
                  rows={3}
                  maxLength={200}
                  className="w-full bg-transparent px-4 pt-4 pb-2 font-sans text-sm resize-none focus:outline-none leading-relaxed"
                  style={{ color: "#e8e8e8" }}
                />
                <div className="flex justify-between items-center px-4 pb-3">
                  <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.45)" }}>
                    💡 問得越具體，結果會越準
                  </p>
                  <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.35)" }}>
                    {question.length}/200
                  </span>
                </div>
              </div>
              {error && (
                <p className="font-sans text-xs" style={{ color: "#cf6679" }}>
                  {error}
                </p>
              )}
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <label className="font-sans text-sm block" style={{ color: "rgba(154,171,184,0.7)" }}>
                主題
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TOPICS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTopic(t.value)}
                    className="py-3 px-2 rounded-xl text-center font-sans transition-all"
                    style={{
                      border: topic === t.value
                        ? "1.5px solid rgba(233,195,73,0.5)"
                        : "1px solid rgba(233,195,73,0.12)",
                      background: topic === t.value
                        ? "rgba(233,195,73,0.1)"
                        : "rgba(19,25,32,0.5)",
                      color: topic === t.value ? "#e9c349" : "rgba(154,171,184,0.65)",
                    }}
                  >
                    <div className="text-xl mb-0.5">{t.icon}</div>
                    <div className="text-sm font-semibold">{t.label}</div>
                    <div className="text-xs mt-0.5" style={{ opacity: 0.65 }}>{t.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startShuffle}
              className="w-full font-sans font-semibold py-4 rounded-xl transition-all hover:brightness-110 active:scale-[0.98] text-base"
              style={{
                background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
                color: "#0f141b",
                boxShadow: "0 4px 20px rgba(233,195,73,0.18)",
              }}
            >
              開始洗牌 →
            </button>

            <p className="text-center font-sans text-xs" style={{ color: "rgba(154,171,184,0.35)" }}>
              訪客可先免費試用 1 次；次數用完可留 email 或購買額度
            </p>

            {/* Restore access */}
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{
                background: "rgba(19,25,32,0.5)",
                border: "1px solid rgba(233,195,73,0.1)",
              }}
            >
              <p className="font-serif text-sm font-semibold" style={{ color: "#e8e8e8" }}>
                已付款 / 已有權限？輸入 email 恢復使用
              </p>
              <input
                type="email"
                value={restoreEmail}
                onChange={(e) => setRestoreEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full font-sans text-sm rounded-xl px-4 py-2.5 focus:outline-none transition-all"
                style={{
                  background: "rgba(15,20,27,0.8)",
                  border: "1px solid rgba(233,195,73,0.15)",
                  color: "#e8e8e8",
                }}
              />
              <button
                type="button"
                onClick={() => void submitRestoreAccess()}
                disabled={restoreLoading || !restoreEmail.trim()}
                className="w-full font-sans font-semibold py-2.5 rounded-xl transition-all hover:brightness-110 disabled:opacity-40"
                style={{
                  background: "rgba(233,195,73,0.08)",
                  border: "1px solid rgba(233,195,73,0.2)",
                  color: "#e9c349",
                }}
              >
                {restoreLoading ? "恢復中…" : "用 email 恢復權限"}
              </button>
            </div>

            {/* Email bonus + credits (only when out of free readings) */}
            {remainingFreeHint === 0 && (
              <div className="space-y-4">
                <div
                  className="rounded-2xl p-4 space-y-3"
                  style={{
                    background: "rgba(209,188,255,0.04)",
                    border: "1px solid rgba(209,188,255,0.12)",
                  }}
                >
                  <p className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
                    免費次數已用完
                  </p>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: "#9aabb8" }}>
                    留下 email，即送你 +3 次免費占卜（每日一次）
                  </p>
                  <input
                    type="email"
                    value={bonusEmail}
                    onChange={(e) => setBonusEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="w-full font-sans text-sm rounded-xl px-4 py-2.5 focus:outline-none transition-all"
                    style={{
                      background: "rgba(15,20,27,0.8)",
                      border: "1px solid rgba(209,188,255,0.2)",
                      color: "#e8e8e8",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => void submitEmailBonus()}
                    disabled={emailBonusLoading || !bonusEmail.trim()}
                    className="w-full font-sans font-semibold py-2.5 rounded-xl transition-all hover:brightness-110 disabled:opacity-40"
                    style={{
                      background: "rgba(209,188,255,0.1)",
                      border: "1px solid rgba(209,188,255,0.22)",
                      color: "#d1bcff",
                    }}
                  >
                    {emailBonusLoading ? "提交中…" : "送出 email 領取 +3 次"}
                  </button>
                </div>

                <div
                  className="rounded-2xl p-4 space-y-3"
                  style={{
                    background: "rgba(19,25,32,0.5)",
                    border: "1px solid rgba(233,195,73,0.1)",
                  }}
                >
                  <p className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
                    想立即再占卜？
                  </p>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: "#9aabb8" }}>
                    即時支付 HK$9，即可獲得 3 次占卜機會（可重複購買）
                  </p>
                  <button
                    type="button"
                    onClick={() => void startCreditsCheckout()}
                    disabled={creditsCheckoutLoading}
                    className="w-full font-sans font-semibold py-2.5 rounded-xl transition-all hover:brightness-110 disabled:opacity-40"
                    style={{
                      background: "rgba(233,195,73,0.1)",
                      border: "1px solid rgba(233,195,73,0.22)",
                      color: "#e9c349",
                    }}
                  >
                    {creditsCheckoutLoading ? "前往 Stripe…" : "HK$9 · 購買 3 次占卜"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SHUFFLE */}
        {phase === "shuffle" && (
          <div className="max-w-md mx-auto px-5">
            <ShuffleAnimation onDone={() => setPhase("select")} />
          </div>
        )}

        {/* SELECT */}
        {phase === "select" && (
          <div className="relative flex flex-col items-center overflow-visible" style={{ minHeight: "calc(100vh - 180px)" }}>

            {/* ── Ambient gold glow ───────────────────────────── */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 800, height: 800,
                top: "40%", left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(233,195,73,0.08) 0%, transparent 70%)",
                filter: "blur(80px)",
                borderRadius: "50%",
              }}
            />

            {/* ── Title + subtitle + progress bars ────────────── */}
            <div className="text-center pt-4 pb-0 relative z-20">
              <h1 className="font-serif text-4xl font-semibold tracking-widest mb-2" style={{ color: "#dee2ec" }}>
                塔羅占卜
              </h1>
              <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
                憑感覺，選出三張牌
              </p>
              <div className="flex items-center justify-center gap-3 mt-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: 48,
                      height: 6,
                      background: selected.length > i ? "#e9c349" : "rgba(255,255,255,0.1)",
                      boxShadow: selected.length > i ? "0 0 8px rgba(233,195,73,0.55)" : "none",
                    }}
                  />
                ))}
                <span
                  className="ml-1 font-mono text-xs"
                  style={{ color: "#e9c349" }}
                >
                  {selected.length} / 3
                </span>
              </div>
            </div>

            {/* ── Arc fan ──────────────────────────────────────── */}
            <div className="relative z-10 w-full">
              <TarotFan
                totalCards={FAN_COUNT}
                selectedIndices={selected}
                onSelect={handleFanSelect}
                maxSelect={3}
              />
            </div>

            {/* ── 解讀結果 button ───────────────────────────────── */}
            <div className="pb-10 relative z-30">
              <button
                onClick={handleReveal}
                disabled={selected.length !== 3}
                className="font-serif text-lg tracking-[0.3em] rounded-lg transition-all duration-500 px-14 py-4"
                style={{
                  background: "transparent",
                  border: "1px solid #e9c349",
                  color: "#e9c349",
                  opacity: selected.length === 3 ? 1 : 0.32,
                  cursor: selected.length === 3 ? "pointer" : "default",
                  boxShadow: selected.length === 3
                    ? "0 0 20px rgba(233,195,73,0.15)"
                    : "none",
                }}
              >
                解讀結果
                <span
                  className="block font-sans tracking-normal"
                  style={{ fontSize: 10, marginTop: 3, opacity: selected.length === 3 ? 0.65 : 0 }}
                >
                  Reveal your path
                </span>
              </button>
            </div>

          </div>
        )}

        {/* PREVIEW */}
        {phase === "preview" && drawnCards.length === 3 && (
          <div className="max-w-md mx-auto px-5">
            <SelectedPreview
              cards={drawnCards}
              onConfirm={handleSubmit}
              onReset={() => { setSelected([]); setPhase("select"); }}
              submitting={false}
              error={error}
            />
          </div>
        )}

        {/* SUBMITTING */}
        {phase === "submitting" && (
          <div className="flex flex-col items-center gap-8 py-20">
            {/* Spinning moon */}
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, rgba(233,195,73,0.12) 0%, transparent 70%)",
                  filter: "blur(12px)",
                }}
              />
              <div className="text-6xl animate-spin relative z-10" style={{ animationDuration: "2.2s" }}>☽</div>
            </div>

            {/* Dynamic progress message — fades between states */}
            <div className="text-center space-y-2">
              <p
                key={submittingMessage}
                className="font-serif text-lg transition-opacity duration-500"
                style={{ color: "rgba(232,232,232,0.8)" }}
              >
                {submittingMessage}
              </p>
              <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.4)" }}>
                神諭正在感應你的問題
              </p>
            </div>

            {/* Animated progress dots */}
            <div className="flex gap-2 items-center">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: "rgba(233,195,73,0.5)",
                    animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Unlock modal ─────────────────────────────────────── */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div
            className="w-full max-w-md rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              background: "#131920",
              border: "1px solid rgba(233,195,73,0.15)",
            }}
          >
            <h3 className="font-serif text-xl font-semibold" style={{ color: "#e8e8e8" }}>
              你已用完免費次數 🔮
            </h3>
            <p className="font-sans text-sm" style={{ color: "#9aabb8" }}>
              可選以下方式繼續：
            </p>

            <div
              className="rounded-xl p-3 space-y-2"
              style={{ background: "rgba(209,188,255,0.04)", border: "1px solid rgba(209,188,255,0.12)" }}
            >
              <p className="font-serif text-sm font-semibold" style={{ color: "#e8e8e8" }}>
                留 email · +3 次（每日一次）
              </p>
              <input
                type="email"
                value={bonusEmail}
                onChange={(e) => setBonusEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full font-sans text-sm rounded-xl px-3 py-2 focus:outline-none"
                style={{ background: "rgba(15,20,27,0.8)", border: "1px solid rgba(209,188,255,0.18)", color: "#e8e8e8" }}
              />
              <button
                type="button"
                onClick={() => void submitEmailBonus()}
                disabled={emailBonusLoading || !bonusEmail.trim()}
                className="w-full font-sans font-semibold py-2 rounded-lg text-sm transition-all disabled:opacity-40"
                style={{ background: "rgba(209,188,255,0.1)", border: "1px solid rgba(209,188,255,0.22)", color: "#d1bcff" }}
              >
                {emailBonusLoading ? "提交中…" : "送出領取"}
              </button>
            </div>

            <div
              className="rounded-xl p-3 space-y-2"
              style={{ background: "rgba(19,25,32,0.5)", border: "1px solid rgba(233,195,73,0.1)" }}
            >
              <p className="font-serif text-sm font-semibold" style={{ color: "#e8e8e8" }}>
                HK$9 · 3 次占卜
              </p>
              <p className="font-sans text-xs" style={{ color: "#9aabb8" }}>
                可一日內多次購買，付款後即加額度
              </p>
              <button
                type="button"
                onClick={() => void startCreditsCheckout()}
                disabled={creditsCheckoutLoading}
                className="w-full font-sans font-semibold py-2 rounded-lg text-sm transition-all disabled:opacity-40"
                style={{ background: "rgba(233,195,73,0.1)", border: "1px solid rgba(233,195,73,0.22)", color: "#e9c349" }}
              >
                {creditsCheckoutLoading ? "前往付款…" : "前往 Stripe 付款"}
              </button>
            </div>

            <a
              href="/paywall"
              className="block w-full font-sans font-semibold py-3 rounded-xl text-center transition-all hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
                color: "#0f141b",
              }}
            >
              解鎖完整報告（Premium）
            </a>

            <button
              type="button"
              onClick={() => setShowUnlockModal(false)}
              className="w-full font-sans text-sm py-1 transition-opacity hover:opacity-80"
              style={{ color: "rgba(154,171,184,0.5)" }}
            >
              稍後再說
            </button>
          </div>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] font-sans text-sm px-4 py-2 rounded-lg shadow-lg"
          style={{ background: "rgba(233,195,73,0.95)", color: "#0f141b" }}
        >
          {toast}
        </div>
      )}
      </div>{/* end lg:pl-64 pt-20 */}
    </div>
  );
}
