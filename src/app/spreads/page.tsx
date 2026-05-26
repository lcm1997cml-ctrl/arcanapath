"use client";
// src/app/spreads/page.tsx — 牌陣選擇頁

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

// ─── Spread definitions ───────────────────────────────────────
const SPREADS = [
  {
    id: "three-card",
    name: "三張牌陣",
    nameEn: "Three Card Spread",
    icon: "auto_awesome",
    difficulty: "入門",
    time: "5 分鐘",
    description: "過去、現在、未來三個時間維度的能量洞察。最適合初學者，亦是每日例行占卜的絕佳選擇。",
    positions: ["過去", "現在", "未來"],
    layout: "row",
    available: true,
    gradient: "from-[#1a0a2e] to-[#0f141b]",
    accent: "rgba(233,195,73,0.7)",
  },
  {
    id: "celtic-cross",
    name: "凱爾特十字",
    nameEn: "Celtic Cross",
    icon: "add",
    difficulty: "進階",
    time: "20 分鐘",
    description: "十張牌的深度分析，涵蓋當前局勢、潛在影響、過去根源、未來走向及最終結果。",
    positions: ["當下", "挑戰", "過去", "未來", "潛意識", "外在影響", "建議", "環境", "希望", "結果"],
    layout: "cross",
    available: false,
    gradient: "from-[#0a1520] to-[#0f141b]",
    accent: "rgba(209,188,255,0.7)",
  },
  {
    id: "horseshoe",
    name: "馬蹄形牌陣",
    nameEn: "Horseshoe Spread",
    icon: "architecture",
    difficulty: "中級",
    time: "12 分鐘",
    description: "七張牌呈弧形排列，深入探索問題的各個面向：過去影響、現狀、隱藏因素及行動建議。",
    positions: ["過去", "現在", "隱藏", "障礙", "外因", "建議", "結果"],
    layout: "arc",
    available: false,
    gradient: "from-[#0f1a14] to-[#0f141b]",
    accent: "rgba(134,200,134,0.6)",
  },
  {
    id: "relationship",
    name: "感情關係牌陣",
    nameEn: "Relationship Spread",
    icon: "favorite",
    difficulty: "中級",
    time: "15 分鐘",
    description: "專為感情問題設計的五張牌陣，分別揭示你的能量、對方的能量、關係核心及未來走向。",
    positions: ["你的能量", "對方能量", "關係核心", "挑戰", "走向"],
    layout: "diamond",
    available: false,
    gradient: "from-[#200a1a] to-[#0f141b]",
    accent: "rgba(220,120,160,0.6)",
  },
  {
    id: "year-ahead",
    name: "年度牌陣",
    nameEn: "Year Ahead Spread",
    icon: "calendar_month",
    difficulty: "進階",
    time: "30 分鐘",
    description: "十二張牌分別代表每個月份的能量走勢，加上一張核心主題牌，為全年旅程提供指引。",
    positions: Array.from({ length: 12 }, (_, i) => `${i + 1}月`).concat(["核心主題"]),
    layout: "circle",
    available: false,
    gradient: "from-[#0a0f20] to-[#0f141b]",
    accent: "rgba(233,195,73,0.5)",
  },
  {
    id: "chakra",
    name: "脈輪牌陣",
    nameEn: "Chakra Spread",
    icon: "brightness_high",
    difficulty: "中級",
    time: "18 分鐘",
    description: "七張牌對應七大脈輪能量中心，揭示身、心、靈各層面的能量狀態與療癒方向。",
    positions: ["海底輪", "臍輪", "太陽輪", "心輪", "喉輪", "眉心輪", "頂輪"],
    layout: "column",
    available: false,
    gradient: "from-[#15082a] to-[#0f141b]",
    accent: "rgba(170,120,255,0.6)",
  },
];

// ─── Mini card position visualiser ───────────────────────────
function SpreadVisual({ layout, count, accent }: { layout: string; count: number; accent: string }) {
  const cardStyle = {
    width: 14,
    height: 22,
    borderRadius: 2,
    background: "rgba(233,195,73,0.08)",
    border: `1px solid ${accent.replace("0.7", "0.4").replace("0.6", "0.3").replace("0.5", "0.3")}`,
    flexShrink: 0,
  } as React.CSSProperties;

  if (layout === "row") {
    return (
      <div className="flex gap-2 justify-center items-center h-12">
        {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
          <div key={i} style={{ ...cardStyle, background: i === 1 ? `${accent.replace(/[\d.]+\)$/, "0.18)")}` : cardStyle.background }} />
        ))}
      </div>
    );
  }
  if (layout === "cross") {
    return (
      <div className="relative flex items-center justify-center h-12 w-20 mx-auto">
        <div style={{ ...cardStyle, position: "absolute" }} />
        <div style={{ ...cardStyle, position: "absolute", transform: "rotate(90deg)", width: 22, height: 14 }} />
        {[-28, 28].map((offset, i) => (
          <div key={i} style={{ ...cardStyle, position: "absolute", left: offset + 10 }} />
        ))}
        {[-22, 22].map((offset, i) => (
          <div key={i} style={{ ...cardStyle, position: "absolute", top: offset - 4 }} />
        ))}
      </div>
    );
  }
  if (layout === "arc") {
    const angles = [-60, -30, 0, 30, 60];
    return (
      <div className="relative h-12 w-24 mx-auto">
        {angles.map((angle, i) => (
          <div
            key={i}
            style={{
              ...cardStyle,
              position: "absolute",
              left: "50%",
              top: "60%",
              transform: `translateX(-50%) translateY(-100%) rotate(${angle}deg) translateY(-16px)`,
            }}
          />
        ))}
      </div>
    );
  }
  // Default: grid
  return (
    <div className="flex flex-wrap gap-1 justify-center h-12 items-center">
      {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
        <div key={i} style={{ ...cardStyle, width: 10, height: 16 }} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function SpreadsPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen cosmic-bg text-white">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-0 right-0"
        style={{
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(209,188,255,0.06) 0%, transparent 70%)",
          filter: "blur(80px)", zIndex: 0,
        }}
      />

      <TopNav />
      <SideNav />

      <div className="lg:pl-64 pt-20">
        <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-14">

          {/* ── Hero ─────────────────────────────────────────── */}
          <section className="text-center space-y-4 animate-fade-in">
            <span
              className="inline-block font-sans text-xs uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "rgba(233,195,73,0.08)",
                border: "1px solid rgba(233,195,73,0.18)",
                color: "rgba(233,195,73,0.8)",
                letterSpacing: "0.2em",
              }}
            >
              神聖牌陣
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold" style={{ color: "#e8e8e8" }}>
              選擇你嘅牌陣
            </h1>
            <p className="font-sans text-base leading-relaxed max-w-xl mx-auto" style={{ color: "#9aabb8" }}>
              每種牌陣都係一扇獨特嘅宇宙之窗。選擇最符合你當下需求嘅方式，讓塔羅為你解讀。
            </p>
          </section>

          {/* ── Spreads grid ─────────────────────────────────── */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPREADS.map((spread) => (
              <div
                key={spread.id}
                onMouseEnter={() => setHovered(spread.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (spread.available) {
                    router.push("/reading");
                  }
                }}
                className="relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
                style={{
                  background: `linear-gradient(145deg, ${spread.gradient.replace("from-", "").replace(/\s.*/, "")} 0%, #0f141b 100%)`,
                  border: hovered === spread.id && spread.available
                    ? `1.5px solid ${spread.accent}`
                    : "1px solid rgba(233,195,73,0.08)",
                  boxShadow: hovered === spread.id && spread.available
                    ? `0 8px 40px rgba(0,0,0,0.5), 0 0 30px ${spread.accent.replace(/[\d.]+\)$/, "0.08)")}`
                    : "none",
                  cursor: spread.available ? "pointer" : "default",
                  transform: hovered === spread.id ? "translateY(-4px)" : "none",
                }}
              >
                {/* Not-yet-available overlay */}
                {!spread.available && (
                  <div
                    className="absolute top-3 right-3 font-sans text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(19,25,32,0.9)",
                      border: "1px solid rgba(154,171,184,0.2)",
                      color: "rgba(154,171,184,0.6)",
                    }}
                  >
                    即將推出
                  </div>
                )}

                {/* Icon + visual */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(233,195,73,0.08)",
                      border: "1px solid rgba(233,195,73,0.15)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 22, color: spread.accent, fontVariationSettings: "'FILL' 1" }}
                    >
                      {spread.icon}
                    </span>
                  </div>
                  <SpreadVisual layout={spread.layout} count={spread.positions.length} accent={spread.accent} />
                </div>

                {/* Meta */}
                <div className="flex gap-2">
                  <span
                    className="font-sans text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(233,195,73,0.06)", border: "1px solid rgba(233,195,73,0.12)", color: "rgba(233,195,73,0.7)" }}
                  >
                    {spread.difficulty}
                  </span>
                  <span
                    className="font-sans text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(19,25,32,0.6)", border: "1px solid rgba(154,171,184,0.1)", color: "rgba(154,171,184,0.6)" }}
                  >
                    {spread.time}
                  </span>
                </div>

                {/* Name & desc */}
                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg font-semibold" style={{ color: "#e8e8e8" }}>
                    {spread.name}
                  </h3>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: "#9aabb8" }}>
                    {spread.description}
                  </p>
                </div>

                {/* Positions preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {spread.positions.slice(0, 4).map((pos) => (
                    <span
                      key={pos}
                      className="font-sans text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(9,15,21,0.8)", color: "rgba(154,171,184,0.55)", border: "1px solid rgba(154,171,184,0.08)" }}
                    >
                      {pos}
                    </span>
                  ))}
                  {spread.positions.length > 4 && (
                    <span className="font-sans text-xs px-2 py-0.5" style={{ color: "rgba(154,171,184,0.35)" }}>
                      +{spread.positions.length - 4}
                    </span>
                  )}
                </div>

                {/* CTA */}
                {spread.available && (
                  <div
                    className="flex items-center gap-1.5 font-sans text-sm font-semibold mt-1"
                    style={{ color: "#e9c349" }}
                  >
                    開始此牌陣
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* ── Tip ──────────────────────────────────────────── */}
          <section
            className="rounded-2xl p-8 flex items-start gap-5"
            style={{
              background: "rgba(19,25,32,0.6)",
              border: "1px solid rgba(233,195,73,0.1)",
            }}
          >
            <span
              className="material-symbols-outlined flex-shrink-0"
              style={{ fontSize: 28, color: "#e9c349", fontVariationSettings: "'FILL' 1", marginTop: 2 }}
            >
              lightbulb
            </span>
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
                新手建議
              </h4>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>
                初次使用建議從「三張牌陣」開始。花一點時間讓心靈平靜，清晰地在心中形成你的問題，然後讓宇宙透過牌面說話。
              </p>
              <Link
                href="/reading"
                className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold mt-2 transition-colors hover:text-yellow-300"
                style={{ color: "#e9c349" }}
              >
                立即開始三張牌占卜
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
