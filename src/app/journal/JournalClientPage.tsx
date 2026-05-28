"use client";
// src/app/journal/JournalClientPage.tsx

import React, { useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

interface JournalClientPageProps {
  isAdmin: boolean;
}

interface JournalEntry {
  id: string;
  date: string;
  question: string;
  cards: string[];
  mood: string;
  note: string;
}

const SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: "s1",
    date: "2024年5月18日",
    question: "我應該如何面對目前嘅感情困境？",
    cards: ["月亮", "力量", "星星"],
    mood: "困惑",
    note: "今日嘅牌面令我反思了好多。月亮提醒我要面對自己嘅恐懼…",
  },
  {
    id: "s2",
    date: "2024年5月15日",
    question: "我嘅事業發展方向係咩？",
    cards: ["帝王", "命運之輪", "世界"],
    mood: "期待",
    note: "命運之輪出現，感覺係一個轉捩點正在來臨…",
  },
  {
    id: "s3",
    date: "2024年5月12日",
    question: "今日嘅能量指引係咩？",
    cards: ["太陽", "節制", "隱者"],
    mood: "平靜",
    note: "三張牌組合非常有意思，隱者提示我需要更多內省時間…",
  },
];

const MOON_PHASES = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

function getMoonPhase() {
  const now = new Date();
  const day = now.getDate();
  return MOON_PHASES[Math.floor((day / 30) * 8) % 8];
}

export default function JournalClientPage({ isAdmin }: JournalClientPageProps) {
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!note.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setNote("");
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  // Admin and paid users see full content; others see premium gate
  const hasFullAccess = isAdmin;

  return (
    <div className="min-h-screen cosmic-bg text-white">
      {/* Ambient */}
      <div
        className="pointer-events-none fixed bottom-0 left-1/4"
        style={{
          width: 500, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(233,195,73,0.04) 0%, transparent 70%)",
          filter: "blur(100px)", zIndex: 0,
        }}
      />

      <TopNav />
      <SideNav />

      <div className="lg:pl-64 pt-20">
        <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-10">

          {/* ── Header ───────────────────────────────────────── */}
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                {isAdmin && (
                  <span
                    className="inline-block font-sans text-xs px-2 py-0.5 rounded-full mb-1"
                    style={{
                      background: "rgba(233,195,73,0.1)",
                      border: "1px solid rgba(233,195,73,0.25)",
                      color: "#e9c349",
                    }}
                  >
                    Admin · 完整訪問
                  </span>
                )}
                <span
                  className="font-sans text-xs uppercase tracking-widest block"
                  style={{ color: "rgba(233,195,73,0.6)", letterSpacing: "0.2em" }}
                >
                  {getMoonPhase()} 靈魂日記
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: "#e8e8e8" }}>
                  你嘅靈性旅程
                </h1>
              </div>
              <div
                className="hidden md:flex flex-col items-end gap-1"
                style={{ color: "rgba(154,171,184,0.5)" }}
              >
                <span className="font-sans text-xs">{new Date().toLocaleDateString("zh-HK", { month: "long", day: "numeric" })}</span>
                <span className="font-sans text-xs">農曆正月</span>
              </div>
            </div>
            <div className="divider-gold mt-4" />
          </section>

          {/* ── Quick note ───────────────────────────────────── */}
          <section
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "rgba(19,25,32,0.8)",
              border: "1px solid rgba(233,195,73,0.12)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 22, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
              >
                edit_note
              </span>
              <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
                今日靈性筆記
              </h2>
            </div>
            <div className="oracle-glow-wrapper relative">
              <div
                className="oracle-glow-bg absolute -inset-1 rounded-xl opacity-0 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(233,195,73,0.06), rgba(209,188,255,0.06))",
                  filter: "blur(8px)",
                }}
              />
              <div className="oracle-inner relative rounded-xl transition-all" style={{ background: "rgba(9,15,21,0.7)", border: "1px solid rgba(233,195,73,0.15)" }}>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="記錄今日嘅占卜感受、夢境、靈感…"
                  rows={4}
                  className="w-full bg-transparent px-4 py-3 font-sans text-sm resize-none focus:outline-none"
                  style={{ color: "#e8e8e8", caretColor: "#e9c349" }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.4)" }}>
                {note.length} / 500
              </span>
              <button
                onClick={handleSave}
                disabled={isSaving || !note.trim()}
                className="font-sans text-sm font-semibold px-5 py-2 rounded-xl transition-all disabled:opacity-40 hover:brightness-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
                  color: "#0f141b",
                }}
              >
                {isSaving ? "儲存中…" : saved ? "✓ 已儲存" : "儲存筆記"}
              </button>
            </div>
          </section>

          {/* ── Journal entries section ───────────────────────── */}
          {hasFullAccess ? (
            /* Admin: full access, no gate */
            <section
              className="rounded-2xl p-6 space-y-4"
              style={{
                background: "rgba(19,25,32,0.7)",
                border: "1px solid rgba(233,195,73,0.15)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
                >
                  auto_stories
                </span>
                <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
                  占卜歷史記錄
                </h2>
                <span
                  className="font-sans text-xs px-2 py-0.5 rounded-full ml-auto"
                  style={{
                    background: "rgba(233,195,73,0.08)",
                    border: "1px solid rgba(233,195,73,0.2)",
                    color: "rgba(233,195,73,0.7)",
                  }}
                >
                  Admin 預覽模式
                </span>
              </div>
              {SAMPLE_ENTRIES.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl p-4 space-y-2"
                  style={{ background: "rgba(9,15,21,0.6)", border: "1px solid rgba(233,195,73,0.08)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs" style={{ color: "rgba(233,195,73,0.7)" }}>{entry.date}</span>
                    <span className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(233,195,73,0.08)", color: "rgba(233,195,73,0.6)", border: "1px solid rgba(233,195,73,0.12)" }}>
                      {entry.mood}
                    </span>
                  </div>
                  <p className="font-serif text-sm" style={{ color: "#e8e8e8" }}>{entry.question}</p>
                  <div className="flex gap-2">
                    {entry.cards.map((c) => (
                      <span key={c} className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(19,25,32,0.8)", color: "rgba(154,171,184,0.6)", border: "1px solid rgba(154,171,184,0.08)" }}>{c}</span>
                    ))}
                  </div>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: "#9aabb8" }}>{entry.note}</p>
                </div>
              ))}
            </section>
          ) : (
            /* Non-admin: premium gate with blurred preview */
            <section
              className="relative rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(233,195,73,0.15)" }}
            >
              {/* Blurred preview */}
              <div className="p-6 space-y-4" style={{ filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_stories
                  </span>
                  <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
                    占卜歷史記錄
                  </h2>
                </div>
                {SAMPLE_ENTRIES.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl p-4 space-y-2"
                    style={{ background: "rgba(19,25,32,0.6)", border: "1px solid rgba(233,195,73,0.08)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs" style={{ color: "rgba(233,195,73,0.7)" }}>{entry.date}</span>
                      <span className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(233,195,73,0.08)", color: "rgba(233,195,73,0.6)", border: "1px solid rgba(233,195,73,0.12)" }}>
                        {entry.mood}
                      </span>
                    </div>
                    <p className="font-serif text-sm" style={{ color: "#e8e8e8" }}>{entry.question}</p>
                    <div className="flex gap-2">
                      {entry.cards.map((c) => (
                        <span key={c} className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(19,25,32,0.8)", color: "rgba(154,171,184,0.6)", border: "1px solid rgba(154,171,184,0.08)" }}>{c}</span>
                      ))}
                    </div>
                    <p className="font-sans text-xs leading-relaxed" style={{ color: "#9aabb8" }}>{entry.note}</p>
                  </div>
                ))}
              </div>

              {/* Unlock overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
                style={{ background: "linear-gradient(to bottom, rgba(9,15,21,0.6) 0%, rgba(9,15,21,0.92) 40%)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(233,195,73,0.08)", border: "1.5px solid rgba(233,195,73,0.3)" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 28, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
                  >
                    lock
                  </span>
                </div>
                <div className="space-y-2 max-w-xs">
                  <h3 className="font-serif text-xl font-semibold" style={{ color: "#e8e8e8" }}>
                    解鎖完整靈魂日記
                  </h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>
                    升級即可永久儲存所有占卜記錄、個人筆記同靈性旅程追蹤。
                  </p>
                </div>
                <Link
                  href="/paywall"
                  className="font-sans text-sm font-semibold px-8 py-3 rounded-xl transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
                    color: "#0f141b",
                  }}
                >
                  開啟完整日記 ✦
                </Link>
                <Link href="/reading" className="font-sans text-xs transition-colors hover:text-yellow-300" style={{ color: "rgba(154,171,184,0.6)" }}>
                  先去占卜 →
                </Link>
              </div>
            </section>
          )}

          {/* ── Moon cycle tracker ───────────────────────────── */}
          <section
            className="rounded-2xl p-6 space-y-5"
            style={{
              background: "rgba(19,25,32,0.6)",
              border: "1px solid rgba(209,188,255,0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl">🌙</span>
              <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>月相周期</h2>
            </div>
            <div className="grid grid-cols-8 gap-2 text-center">
              {MOON_PHASES.map((phase, i) => {
                const labels = ["新月", "眉月", "上弦", "盈凸", "滿月", "虧凸", "下弦", "殘月"];
                const isNow = i === Math.floor(((new Date().getDate() / 30) * 8)) % 8;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all"
                    style={{
                      background: isNow ? "rgba(233,195,73,0.08)" : "transparent",
                      border: isNow ? "1px solid rgba(233,195,73,0.2)" : "1px solid transparent",
                    }}
                  >
                    <span className="text-xl">{phase}</span>
                    <span className="font-sans text-xs hidden md:block" style={{ color: isNow ? "#e9c349" : "rgba(154,171,184,0.4)", fontSize: 9 }}>
                      {labels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.5)" }}>
              現在月相：{getMoonPhase()} {["新月", "眉月", "上弦月", "盈凸月", "滿月", "虧凸月", "下弦月", "殘月"][Math.floor(((new Date().getDate() / 30) * 8)) % 8]} — 適合{["開始新計劃", "種下意圖", "行動與成長", "擴展與顯化", "感恩與釋放", "反思與評估", "放下與清理", "休息與更新"][Math.floor(((new Date().getDate() / 30) * 8)) % 8]}
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}
