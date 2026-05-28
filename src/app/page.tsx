"use client";
// src/app/page.tsx — Homepage (Stitch "arcanapath_seek_your_truth" design)
// Visual fidelity rebuild: TopNav + SideNav + Hero Oracle + Daily Draw + Blog Bento + Footer

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

// ─── Star field ───────────────────────────────────────────────
function StarField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < 50; i++) {
      const star = document.createElement("div");
      star.className = "star-field";
      const x        = Math.random() * 100;
      const y        = Math.random() * 100;
      const duration = (2 + Math.random() * 4).toFixed(1);
      const delay    = (Math.random() * 5).toFixed(1);
      const size     = Math.random() < 0.2 ? 3 : 2;
      star.style.cssText = `left:${x}%;top:${y}%;--duration:${duration}s;--delay:${delay}s;width:${size}px;height:${size}px;`;
      container.appendChild(star);
    }
  }, []);

  return <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" />;
}

// ─── Tarot card back (Daily Draw) ─────────────────────────────
function DailyDrawCard({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      {/* Glow halo */}
      <div
        className="absolute -inset-8 rounded-[40px] transition-opacity duration-700"
        style={{
          background: "rgba(233,195,73,0.2)",
          filter: "blur(60px)",
          opacity: hovered ? 1 : 0.45,
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative overflow-hidden"
        style={{
          width: 256,
          aspectRatio: "2 / 3",
          background: "linear-gradient(160deg, #252a32 0%, #1b2027 60%, #171c23 100%)",
          borderRadius: "0.5rem",
          border: "1px solid rgba(233,195,73,0.4)",
          boxShadow: hovered
            ? "0 32px 64px rgba(0,0,0,0.7), 0 0 40px rgba(233,195,73,0.15)"
            : "0 16px 48px rgba(0,0,0,0.6)",
          transform: hovered
            ? "translateY(-16px) rotate(2deg)"
            : "translateY(0) rotate(0deg)",
          transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {/* Inner filigree border */}
        <div
          className="card-shimmer absolute inset-2 rounded-lg flex items-center justify-center"
          style={{ border: "1px solid rgba(233,195,73,0.2)" }}
        >
          {/* Dot grid pattern */}
          <div
            className="w-full h-full opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, #e9c349 1px, transparent 0)",
              backgroundSize: "12px 12px",
            }}
          />
        </div>

        {/* Centre icon */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              border: "2px solid rgba(233,195,73,0.6)",
              background: hovered ? "rgba(233,195,73,0.08)" : "transparent",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                color: "#e9c349",
                fontSize: 40,
                fontVariationSettings: "'FILL' 1",
              }}
            >
              auto_awesome
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 500,
              color: "rgba(233,195,73,0.6)",
              lineHeight: 1.3,
            }}
          >
            立即抽牌
          </span>
        </div>

        {/* Bottom filigree stars */}
        <div className="absolute bottom-4 w-full flex justify-center gap-1 opacity-40">
          {["star", "star", "star"].map((icon, i) => (
            <span
              key={i}
              className="material-symbols-outlined"
              style={{ color: "#e9c349", fontSize: 12, fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stats counter ─────────────────────────────────────────────
const STATS = [
  { value: "42k+", label: "受引導嘅探索者" },
  { value: "78",   label: "神聖阿卡納" },
  { value: "1.2m", label: "已開啟嘅啟示" },
];

// ─── Main page ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [question,  setQuestion]  = useState("");
  const [focused,   setFocused]   = useState(false);
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

  // Navigate to reading page with pre-filled question
  const handleOracle = useCallback(() => {
    const q = question.trim();
    if (q.length < 2) return;
    router.push(`/reading?q=${encodeURIComponent(q)}`);
  }, [question, router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleOracle();
    }
  }, [handleOracle]);

  const handleCardClick = useCallback(() => {
    router.push("/reading");
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* ── Global nav ────────────────────────────────────── */}
      <TopNav remainingCount={remaining} />
      <SideNav />

      {/* ── Page content (offset for sidebar + topnav) ───── */}
      <main className="lg:pl-64 min-h-screen pt-20">

        {/* ════════════════════════════════════════════════
            SECTION 1: Hero / Oracle Input
        ════════════════════════════════════════════════ */}
        <section
          className="relative min-h-[70vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop overflow-hidden"
        >
          {/* Stars */}
          <StarField />
          {/* Celestial dust */}
          <div className="celestial-dust z-0" />
          {/* Violet orb glow top-center */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 400,
              background: "radial-gradient(ellipse, rgba(109,91,151,0.18) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Content */}
          <div
            className="relative z-10 text-center w-full stagger-children"
            style={{ maxWidth: 768 }}
          >
            {/* Main headline */}
            <h1
              className="text-on-surface mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(40px, 8vw, 64px)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              問下神諭
            </h1>

            {/* Oracle input — glass morphism card */}
            <div
              className="oracle-glow-wrapper relative group"
              style={{ marginBottom: "1.5rem" }}
            >
              {/* Animated gradient glow behind the card */}
              <div
                className="oracle-glow-bg absolute -inset-1 rounded-xl blur-lg transition-opacity duration-1000"
                style={{
                  background: "linear-gradient(90deg, rgba(233,195,73,0.2), rgba(209,188,255,0.2), rgba(233,195,73,0.2))",
                  opacity: focused ? 1 : 0.75,
                }}
              />

              {/* Glass card */}
              <div
                className="oracle-inner relative"
                style={{
                  background: "rgba(9,15,21,0.6)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(233,195,73,0.2)",
                  borderRadius: "0.75rem",
                  padding: "0.5rem",
                }}
              >
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="向神諭提出任何問題..."
                  rows={2}
                  maxLength={300}
                  className="w-full bg-transparent border-none focus:ring-0 text-center resize-none py-8"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 32,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    color: "#e9c349",
                    outline: "none",
                  }}
                />
                <div className="flex justify-center pb-4">
                  <button
                    onClick={handleOracle}
                    disabled={question.trim().length < 2}
                    className="flex items-center gap-2 px-8 py-3 rounded-full transition-all active:scale-95 disabled:opacity-40"
                    style={{
                      background: "#e9c349",
                      color: "#0b0e14",
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      boxShadow: "0 0 0px rgba(233,195,73,0)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(233,195,73,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0px rgba(233,195,73,0)";
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
                    >
                      flare
                    </span>
                    開啟啟示
                  </button>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.05em",
                color: "rgba(198,198,203,0.6)",
                textTransform: "uppercase",
              }}
            >
              你嘅命運，早已刻喺繁星之中
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            SECTION 2: Daily Draw
        ════════════════════════════════════════════════ */}
        <section
          className="py-section-gap px-margin-mobile md:px-margin-desktop mx-auto"
          style={{ maxWidth: 1200 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-gutter">

            {/* Left: text */}
            <div className="w-full md:w-1/2 space-y-6">
              {/* Chip label */}
              <span
                className="inline-block px-3 py-1 rounded-full"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "#e9c349",
                  background: "rgba(233,195,73,0.1)",
                  border: "1px solid rgba(233,195,73,0.2)",
                }}
              >
                每日儀式
              </span>

              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 48,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "#dee2ec",
                }}
              >
                每日一抽
              </h2>

              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 18,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  letterSpacing: "0.01em",
                  color: "#c6c6cb",
                }}
              >
                沈澱思緒，集中精神。每日一抽為你今日嘅能量提供一個焦點。
                由大阿卡納向你嘅潛意識對話。
              </p>

              <div className="pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-3 px-6 py-3 transition-all hover:bg-secondary/5"
                  style={{
                    border: "1px solid #e9c349",
                    color: "#e9c349",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    history_edu
                  </span>
                  過往每日啟示
                </Link>
              </div>
            </div>

            {/* Right: card */}
            <div className="w-full md:w-1/2 flex justify-center py-12">
              <DailyDrawCard onClick={handleCardClick} />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            SECTION 3: Blog Bento Grid
        ════════════════════════════════════════════════ */}
        <section
          className="pb-section-gap px-margin-mobile md:px-margin-desktop mx-auto"
          style={{ maxWidth: 1200 }}
        >
          {/* Section title */}
          <h3
            className="mb-12 flex items-center gap-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.3,
              color: "#dee2ec",
            }}
          >
            <span
              className="inline-block"
              style={{ width: 48, height: 1, background: "rgba(233,195,73,0.3)" }}
            />
            神秘啟示
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Featured card (2-col) */}
            <div
              className="md:col-span-2 group relative overflow-hidden"
              style={{
                borderRadius: "1rem",
                height: 400,
              }}
            >
              {/* Background image */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <Image
                  src="/images/home/moon-mystery-tarot.webp"
                  alt="月相神秘塔羅"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
              {/* Subtle purple glow overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(ellipse at 30% 40%, rgba(109,91,151,0.25) 0%, transparent 55%)",
                }}
              />
              {/* Gradient overlay — darkens bottom for text legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, #0f141b 0%, rgba(15,20,27,0.55) 45%, transparent 100%)",
                }}
              />

              {/* Content */}
              <div className="absolute bottom-0 p-8 space-y-3">
                <span
                  className="inline-block px-3 py-1 rounded-full"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    color: "#e9c349",
                    background: "rgba(15,20,27,0.6)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  最新洞察
                </span>
                <h4
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 48,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: "#dee2ec",
                  }}
                >
                  月相如何影響當前奧秘
                </h4>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#c6c6cb",
                    maxWidth: 480,
                  }}
                >
                  探索當前月亮週期點樣改變你近期占卜中嘅能量流向。
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 mt-4 transition-transform group-hover:translate-x-2"
                  style={{
                    color: "#e9c349",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                  }}
                >
                  閱讀文章
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    arrow_right_alt
                  </span>
                </Link>
              </div>
            </div>

            {/* Small blog card */}
            <div
              className="flex flex-col justify-between p-8 group transition-colors"
              style={{
                background: "#252a32",
                borderRadius: "1rem",
                border: "1px solid rgba(233,195,73,0.1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#30353d";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#252a32";
              }}
            >
              <div className="space-y-4">
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#e9c349", fontSize: 40, fontVariationSettings: "'FILL' 1" }}
                >
                  auto_stories
                </span>
                <h4
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 32,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    color: "#dee2ec",
                  }}
                >
                  靈性隱私
                </h4>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#c6c6cb",
                  }}
                >
                  你嘅旅程係神聖嘅。了解我哋點樣保護你靈魂嘅數位足跡。
                </p>
              </div>
              <Link
                href="/privacy"
                className="transition-all hover:underline"
                style={{
                  color: "#e9c349",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                }}
              >
                查看隱私政策
              </Link>
            </div>

            {/* Stats row (full width) */}
            <div
              className="md:col-span-3 flex flex-wrap gap-8 justify-around py-12 mt-8"
              style={{ borderTop: "1px solid rgba(233,195,73,0.1)", borderBottom: "1px solid rgba(233,195,73,0.1)" }}
            >
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 64,
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      color: "#e9c349",
                    }}
                  >
                    {value}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      color: "#c6c6cb",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════ */}
      <footer
        className="lg:pl-64 w-full py-8 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ borderTop: "1px solid rgba(233,195,73,0.1)", background: "#0f141b" }}
      >
        {/* Logo + copyright */}
        <div className="flex flex-col gap-1 items-center md:items-start">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 500,
              color: "#e9c349",
            }}
          >
            ArcanaPath
          </span>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 16,
              color: "#c6c6cb",
            }}
          >
            © 2025 ArcanaPath. 繁星引路。
          </p>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-10">
          {[
            { href: "/blog",    label: "神諭博客" },
            { href: "/privacy", label: "靈性隱私" },
            { href: "/terms",   label: "神秘條款" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:text-secondary"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 12,
                letterSpacing: "0.05em",
                color: "#c6c6cb",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Social buttons */}
        <div className="flex gap-4">
          {["public", "share"].map((icon) => (
            <button
              key={icon}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-secondary/10"
              style={{ border: "1px solid rgba(233,195,73,0.2)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#e9c349", fontSize: 18 }}
              >
                {icon}
              </span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
