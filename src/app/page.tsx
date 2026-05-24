"use client";
// src/app/page.tsx — Homepage (Mockup 1 design)
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Star field ───────────────────────────────────────────────
function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 55; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2.5 + 0.5;
      star.className = "star";
      star.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `--duration:${(Math.random() * 4 + 2).toFixed(1)}s`,
        `--delay:${(Math.random() * 4).toFixed(1)}s`,
        `opacity:${Math.random() * 0.5 + 0.15}`,
      ].join(";");
      container.appendChild(star);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Homepage ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [focused, setFocused] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  // Fetch remaining free count
  useEffect(() => {
    fetch("/api/visitor-remaining", { method: "GET", cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && typeof d.remainingFreeCount === "number") {
          setRemaining(d.remainingFreeCount);
        }
      })
      .catch(() => {});
  }, []);

  const handleOracle = () => {
    if (question.trim().length < 3) return;
    const params = new URLSearchParams({ q: question.trim() });
    router.push(`/reading?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleOracle();
    }
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ background: "#0f141b" }}
    >
      <StarField />

      {/* ── Top Nav ──────────────────────────────────────────── */}
      <nav
        className="relative z-10 flex items-center justify-between px-5 py-3.5"
        style={{
          borderBottom: "1px solid rgba(233,195,73,0.1)",
          background: "rgba(15,20,27,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-semibold" style={{ color: "#e9c349" }}>
            ✦ ArcanaPath
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-sans">
          <Link
            href="/reading"
            className="transition-colors hover:opacity-100"
            style={{ color: "rgba(232,232,232,0.6)" }}
          >
            每日占卜
          </Link>
          <Link
            href="/paywall"
            className="transition-colors hover:opacity-100"
            style={{ color: "rgba(232,232,232,0.6)" }}
          >
            定價
          </Link>
        </div>

        {/* Right: remaining counter */}
        <div className="flex items-center gap-3 text-sm">
          {remaining !== null && (
            <span
              className="font-sans text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(233,195,73,0.1)",
                border: "1px solid rgba(233,195,73,0.2)",
                color: "#e9c349",
              }}
            >
              剩餘 {remaining} 次
            </span>
          )}
          <Link
            href="/paywall"
            className="hidden sm:block font-sans text-sm px-3.5 py-1.5 rounded-lg transition-all"
            style={{
              background: "rgba(233,195,73,0.12)",
              border: "1px solid rgba(233,195,73,0.25)",
              color: "#e9c349",
            }}
          >
            升級
          </Link>
        </div>
      </nav>

      {/* ── Hero / Oracle Input ──────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center px-5 pt-16 pb-10 text-center">
        {/* Cosmic glow orb */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3"
          style={{
            width: 520,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(209,188,255,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <p
          className="font-sans text-xs uppercase tracking-widest mb-4"
          style={{ color: "rgba(209,188,255,0.6)", letterSpacing: "0.2em" }}
        >
          神諭入口
        </p>

        <h1
          className="font-serif text-4xl sm:text-5xl font-semibold mb-3 leading-tight"
          style={{ color: "#e8e8e8" }}
        >
          問問宇宙，找回清晰
        </h1>
        <p
          className="font-sans text-sm sm:text-base max-w-md mb-10"
          style={{ color: "rgba(154,171,184,0.9)" }}
        >
          直接、真實、唔說廢話。讓塔羅幫你看清楚現在的局面。
        </p>

        {/* Oracle textarea */}
        <div className="w-full max-w-xl mb-4">
          <div
            className={`rounded-2xl transition-all duration-500 ${focused ? "oracle-focused" : ""}`}
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
              onKeyDown={handleKeyDown}
              placeholder="你想問宇宙什麼？例如：我同佢嘅關係仲有未來嗎？"
              rows={3}
              maxLength={200}
              className="w-full bg-transparent px-5 pt-4 pb-2 font-sans text-sm resize-none focus:outline-none leading-relaxed"
              style={{ color: "#e8e8e8" }}
            />
            <div className="flex items-center justify-between px-5 pb-3.5">
              <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.4)" }}>
                {question.length}/200
              </span>
              <button
                onClick={handleOracle}
                disabled={question.trim().length < 3}
                className="font-sans font-semibold text-sm px-5 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
                  color: "#0f141b",
                }}
              >
                尋求啟示 →
              </button>
            </div>
          </div>
          <p className="font-sans text-xs mt-2.5" style={{ color: "rgba(154,171,184,0.45)" }}>
            問得越具體，答案越準確・按 Enter 送出
          </p>
        </div>

        {/* Quick topic chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { icon: "♥", label: "感情運勢" },
            { icon: "◆", label: "事業方向" },
            { icon: "✦", label: "財運機遇" },
            { icon: "☽", label: "人生方向" },
          ].map((t) => (
            <button
              key={t.label}
              onClick={() => setQuestion(`我的${t.label}如何？`)}
              className="font-sans text-xs px-3.5 py-1.5 rounded-full transition-all hover:brightness-110"
              style={{
                background: "rgba(233,195,73,0.08)",
                border: "1px solid rgba(233,195,73,0.18)",
                color: "rgba(233,195,73,0.75)",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Daily Draw ───────────────────────────────────────── */}
      <section className="relative z-10 px-5 pb-10 max-w-xl mx-auto w-full">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(19,25,32,0.6)",
            border: "1px solid rgba(233,195,73,0.1)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
                今日每日占卜
              </h2>
              <p className="font-sans text-xs mt-0.5" style={{ color: "#9aabb8" }}>
                每日一張牌，指引今日能量
              </p>
            </div>
            <Link
              href="/reading"
              className="font-sans text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(233,195,73,0.1)",
                border: "1px solid rgba(233,195,73,0.2)",
                color: "#e9c349",
              }}
            >
              抽牌
            </Link>
          </div>

          {/* Card back preview */}
          <div className="flex justify-center">
            <div
              className="relative rounded-xl overflow-hidden card-shimmer"
              style={{
                width: 80,
                height: 128,
                background: "linear-gradient(145deg, #1a2232 0%, #131920 100%)",
                border: "1.5px solid rgba(233,195,73,0.25)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="absolute inset-[4px] rounded-lg"
                style={{ border: "1px solid rgba(233,195,73,0.15)" }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center font-serif text-3xl"
                style={{ color: "rgba(233,195,73,0.2)" }}
              >
                ✦
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Insights Bento ───────────────────────────────────── */}
      <section className="relative z-10 px-5 pb-16 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
            神諭洞察
          </h2>
          <span className="font-sans text-xs" style={{ color: "#9aabb8" }}>
            塔羅智慧
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              tag: "塔羅基礎",
              title: "逆位牌代表什麼？",
              desc: "逆位不代表壞事，而是提醒你注意能量的阻塞…",
              color: "rgba(209,188,255,0.08)",
              border: "rgba(209,188,255,0.15)",
            },
            {
              tag: "愛情塔羅",
              title: "感情解讀的三張牌",
              desc: "過去、現在、未來三張牌如何揭示感情走向…",
              color: "rgba(233,195,73,0.06)",
              border: "rgba(233,195,73,0.12)",
            },
            {
              tag: "每日儀式",
              title: "晨間塔羅冥想",
              desc: "每天早上抽一張牌，設定當日意圖與能量…",
              color: "rgba(233,195,73,0.06)",
              border: "rgba(233,195,73,0.12)",
            },
            {
              tag: "占星結合",
              title: "塔羅與月相",
              desc: "不同月相下抽牌，能量解讀各有側重…",
              color: "rgba(209,188,255,0.08)",
              border: "rgba(209,188,255,0.15)",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-4 cursor-pointer transition-all hover:brightness-110"
              style={{
                background: item.color,
                border: `1px solid ${item.border}`,
              }}
            >
              <span
                className="font-sans text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(233,195,73,0.1)",
                  color: "#e9c349",
                  border: "1px solid rgba(233,195,73,0.2)",
                }}
              >
                {item.tag}
              </span>
              <h3
                className="font-serif text-sm font-semibold mt-2 mb-1"
                style={{ color: "#e8e8e8" }}
              >
                {item.title}
              </h3>
              <p
                className="font-sans text-xs leading-relaxed line-clamp-2"
                style={{ color: "#9aabb8" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        className="relative z-10 px-5 py-6 mt-auto"
        style={{ borderTop: "1px solid rgba(233,195,73,0.08)" }}
      >
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif text-sm" style={{ color: "#e9c349" }}>
            ✦ ArcanaPath
          </span>
          <div
            className="flex gap-4 font-sans text-xs"
            style={{ color: "rgba(154,171,184,0.5)" }}
          >
            <Link href="/paywall" className="hover:opacity-80 transition-opacity">
              定價
            </Link>
            <Link href="/reading" className="hover:opacity-80 transition-opacity">
              占卜
            </Link>
            <span>© 2025 · 僅供娛樂</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
