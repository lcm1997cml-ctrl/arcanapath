// src/app/dashboard/page.tsx — 紀錄頁
// Admin users see full history. Visitors see a beautiful CTA page.
import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getReadingsByUser } from "@/lib/store";
import type { ReadingResult } from "@/types";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

const TOPIC_LABELS: Record<string, string> = {
  love: "感情",
  career: "事業",
  wealth: "財運",
  life: "人生",
};

// ─── Visitor view (no auth) ───────────────────────────────────
function VisitorDashboard() {
  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-16 space-y-10 text-center animate-fade-in">

      {/* Decorative orb */}
      <div className="flex justify-center">
        <div
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, rgba(233,195,73,0.12) 0%, rgba(209,188,255,0.06) 100%)",
            border: "1.5px solid rgba(233,195,73,0.25)",
            boxShadow: "0 0 60px rgba(233,195,73,0.08)",
          }}
        >
          {/* Inner ring */}
          <div
            className="absolute inset-4 rounded-full"
            style={{ border: "1px solid rgba(233,195,73,0.15)" }}
          />
          <span
            className="material-symbols-outlined relative z-10"
            style={{ fontSize: 44, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
          >
            auto_stories
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="font-serif text-3xl font-semibold" style={{ color: "#e8e8e8" }}>
          你的占卜旅程
        </h1>
        <p className="font-sans text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "#9aabb8" }}>
          完整的占卜歷史記錄、靈性日記和個性化洞察，在升級後永久保存。
        </p>
      </div>

      {/* Preview cards (decorative) */}
      <div className="space-y-3 text-left">
        {[
          { question: "我嘅感情關係走向如何？", topic: "感情", date: "今日", blurred: true },
          { question: "事業上嘅轉變時機到了嗎？", topic: "事業", date: "昨日", blurred: true },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-xl p-4 transition-all"
            style={{
              background: "rgba(19,25,32,0.7)",
              border: "1px solid rgba(233,195,73,0.08)",
              filter: "blur(2px)",
              userSelect: "none",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-serif text-sm" style={{ color: "#e8e8e8" }}>{item.question}</p>
                <p className="font-sans text-xs mt-1" style={{ color: "rgba(154,171,184,0.5)" }}>
                  {item.topic} · {item.date}
                </p>
              </div>
              <span className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(233,195,73,0.08)", color: "rgba(233,195,73,0.6)", border: "1px solid rgba(233,195,73,0.12)" }}>
                完整版
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        <Link
          href="/reading"
          className="block w-full py-3.5 rounded-xl font-sans text-sm font-semibold transition-all hover:brightness-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
            color: "#0f141b",
          }}
        >
          開始新的占卜 ✦
        </Link>
        <Link
          href="/paywall"
          className="block w-full py-3.5 rounded-xl font-sans text-sm font-semibold transition-all hover:brightness-110"
          style={{
            background: "rgba(19,25,32,0.8)",
            border: "1px solid rgba(233,195,73,0.2)",
            color: "#e9c349",
          }}
        >
          解鎖完整紀錄
        </Link>
      </div>
    </div>
  );
}

// ─── Admin history view ───────────────────────────────────────
function AdminDashboard({ readings, userName }: { readings: ReadingResult[]; userName: string }) {
  const sorted = [...readings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 space-y-8">

      {/* Stats */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.1)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-serif text-lg font-semibold" style={{ color: "#e8e8e8" }}>{userName}</p>
            <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.6)" }}>管理員</p>
          </div>
          <Link
            href="/admin"
            className="font-sans text-xs px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
            style={{ background: "rgba(233,195,73,0.08)", border: "1px solid rgba(233,195,73,0.18)", color: "#e9c349" }}
          >
            後台管理
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "總占卜次數", value: readings.length },
            { label: "已付費解鎖", value: readings.filter((r) => r.isPaid).length },
            { label: "本月占卜", value: readings.filter((r) => new Date(r.createdAt).getMonth() === new Date().getMonth()).length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl py-3" style={{ background: "rgba(9,15,21,0.5)", border: "1px solid rgba(233,195,73,0.06)" }}>
              <p className="font-serif text-2xl font-semibold" style={{ color: "#e9c349" }}>{value}</p>
              <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.5)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New reading CTA */}
      <Link
        href="/reading"
        className="block w-full text-center py-3.5 rounded-xl font-sans text-sm font-semibold transition-all hover:brightness-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)", color: "#0f141b" }}
      >
        開始新的占卜 ✦
      </Link>

      {/* History list */}
      <div>
        <h2 className="font-serif text-base font-semibold mb-4" style={{ color: "#e8e8e8" }}>占卜歷史</h2>
        {sorted.length === 0 ? (
          <div
            className="text-center py-12 rounded-2xl font-sans text-sm"
            style={{ color: "rgba(154,171,184,0.4)", background: "rgba(19,25,32,0.5)", border: "1px solid rgba(233,195,73,0.06)" }}
          >
            尚未有占卜記錄
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((r) => (
              <Link
                key={r.id}
                href={`/result/${r.id}`}
                className="block rounded-xl p-4 transition-all hover:border-[rgba(233,195,73,0.25)]"
                style={{ background: "rgba(19,25,32,0.6)", border: "1px solid rgba(233,195,73,0.08)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm truncate" style={{ color: "#e8e8e8" }}>{r.question}</p>
                    <p className="font-sans text-xs mt-1" style={{ color: "rgba(154,171,184,0.5)" }}>
                      {TOPIC_LABELS[r.topic] ?? r.topic} · {new Date(r.createdAt).toLocaleDateString("zh-HK")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {r.isPaid && (
                      <span className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(233,195,73,0.08)", color: "rgba(233,195,73,0.7)", border: "1px solid rgba(233,195,73,0.15)" }}>
                        完整版
                      </span>
                    )}
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(154,171,184,0.3)" }}>chevron_right</span>
                  </div>
                </div>
                {r.freeReading?.headline && (
                  <p className="font-sans text-xs mt-2 italic truncate" style={{ color: "rgba(154,171,184,0.4)" }}>
                    「{r.freeReading.headline}」
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page (server) ────────────────────────────────────────────
export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Visitors: no redirect, show beautiful visitor view
  if (!user) {
    return (
      <div className="min-h-screen cosmic-bg text-white">
        <TopNav />
        <SideNav />
        <div className="lg:pl-64 pt-20">
          <VisitorDashboard />
        </div>
      </div>
    );
  }

  // Admin / member: show reading history
  const readings: ReadingResult[] = user.role !== "visitor"
    ? await getReadingsByUser(user.id)
    : [];

  return (
    <div className="min-h-screen cosmic-bg text-white">
      <TopNav />
      <SideNav />
      <div className="lg:pl-64 pt-20">
        <AdminDashboard readings={readings} userName={user.name ?? user.email} />
      </div>
    </div>
  );
}
