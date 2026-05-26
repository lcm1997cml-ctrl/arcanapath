// src/app/r/[id]/page.tsx — Public share page (Stitch design)
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getReading } from "@/lib/store";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getReading(id);
  const q = (result?.question ?? "免費塔羅占卜結果").replace(/\s+/g, " ").trim().slice(0, 70);
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://arcanapath.com").replace(/\/$/, "");
  return {
    title: `免費塔羅占卜結果｜ArcanaPath`,
    description: `免費三張牌塔羅占卜與 AI 解讀：${q}`,
    alternates: { canonical: `${appUrl}/r/${id}` },
  };
}

const POSITION_LABELS = ["過去", "現在", "未來"] as const;

export default async function PublicSharePage({ params }: Props) {
  const { id } = await params;
  const result = await getReading(id);
  if (!result) notFound();

  const cards = Array.isArray(result.cards) ? result.cards.slice(0, 3) : [];
  const summaryRaw =
    result.freeReading?.headline ??
    result.freeReading?.nextStep ??
    result.freeReading?.mainAxis ??
    "牌面顯示你正踏入新的轉變階段。";
  const summary = String(summaryRaw).replace(/\s+/g, " ").trim();

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(109,91,151,0.12) 0%, rgba(26,10,46,0.4) 40%, #0f141b 70%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2"
        style={{
          width: 500, height: 250, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(233,195,73,0.06) 0%, transparent 70%)",
          filter: "blur(60px)", zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-md mx-auto px-5 py-10 space-y-6">

        {/* Brand header */}
        <div className="text-center space-y-1 pt-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(233,195,73,0.2) 0%, rgba(209,188,255,0.08) 100%)",
                border: "1px solid rgba(233,195,73,0.35)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <span className="font-serif text-lg font-semibold tracking-widest" style={{ color: "#e9c349" }}>
              ArcanaPath
            </span>
          </Link>
          <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.5)", letterSpacing: "0.15em" }}>
            宇宙透過符號說話
          </p>
        </div>

        {/* Question */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.12)" }}
        >
          <p
            className="font-sans text-xs uppercase tracking-widest mb-2"
            style={{ color: "rgba(233,195,73,0.6)", letterSpacing: "0.15em" }}
          >
            占卜問題
          </p>
          <p className="font-serif text-base font-medium leading-relaxed" style={{ color: "#e8e8e8" }}>
            「{result.question}」
          </p>
        </div>

        {/* Cards */}
        {cards.length > 0 && (
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(19,25,32,0.6)", border: "1px solid rgba(233,195,73,0.08)" }}
          >
            <p
              className="font-sans text-xs uppercase tracking-widest text-center mb-4"
              style={{ color: "rgba(233,195,73,0.5)", letterSpacing: "0.15em" }}
            >
              三張牌陣
            </p>
            <div className="grid grid-cols-3 gap-3">
              {cards.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.55)" }}>
                    {POSITION_LABELS[idx]}
                  </span>
                  <div
                    className="gold-filigree relative w-full rounded-xl flex flex-col items-center justify-end pb-3"
                    style={{
                      aspectRatio: "2/3",
                      maxHeight: 110,
                      background: "linear-gradient(145deg, #1a2232 0%, #131920 100%)",
                      transform: item.reversed ? "rotate(180deg)" : "none",
                    }}
                  >
                    <div className="absolute inset-[4px] rounded-lg" style={{ border: "1px solid rgba(233,195,73,0.1)" }} />
                    <span
                      className="font-serif text-center leading-tight relative z-10 px-1"
                      style={{ fontSize: 9, color: "#e9c349", transform: item.reversed ? "rotate(180deg)" : "none", display: "block" }}
                    >
                      {item.card.name_zh ?? item.card.name}
                    </span>
                  </div>
                  <span className="font-sans" style={{ fontSize: 10, color: item.reversed ? "rgba(209,188,255,0.6)" : "rgba(233,195,73,0.6)" }}>
                    {item.reversed ? "逆位" : "正位"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.12)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}>stars</span>
            <p className="font-sans text-xs uppercase tracking-widest" style={{ color: "rgba(233,195,73,0.6)", letterSpacing: "0.15em" }}>神諭綜論</p>
          </div>
          <p className="font-serif text-sm leading-relaxed" style={{ color: "#e0e0e0" }}>{summary}</p>
        </div>

        {/* Locked deep reading */}
        <div className="rounded-2xl relative overflow-hidden" style={{ border: "1px solid rgba(233,195,73,0.08)" }}>
          <div className="p-5 space-y-2" style={{ filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}>
            {["深度心理解讀：你內心深處的真實動機與恐懼…", "時間線分析：未來 1-3 個月的能量走勢…", "塔羅師的核心提醒：你最容易忽略的關鍵訊號…"].map((line, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "rgba(233,195,73,0.3)" }} />
                <p className="font-sans text-xs" style={{ color: "#9aabb8" }}>{line}</p>
              </div>
            ))}
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: "linear-gradient(to bottom, rgba(9,15,21,0.5) 0%, rgba(9,15,21,0.88) 50%)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "rgba(233,195,73,0.6)", fontVariationSettings: "'FILL' 1" }}>lock</span>
            <p className="font-serif text-sm font-semibold" style={{ color: "#e8e8e8" }}>深度解讀（已鎖定）</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 pt-2 pb-6">
          <Link
            href="/reading"
            className="block w-full py-4 rounded-xl font-sans text-sm font-semibold text-center transition-all hover:brightness-110 active:scale-95"
            style={{ background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)", color: "#0f141b", boxShadow: "0 4px 20px rgba(233,195,73,0.2)" }}
          >
            獲取你的免費占卜 ✦
          </Link>
          <Link
            href={`/result/${id}`}
            className="block w-full py-3.5 rounded-xl font-sans text-sm font-semibold text-center transition-all hover:brightness-110"
            style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.18)", color: "#e9c349" }}
          >
            查看完整解讀
          </Link>
          <p className="text-center font-sans text-xs" style={{ color: "rgba(154,171,184,0.35)" }}>
            42,000+ 人已透過 ArcanaPath 獲得靈性指引
          </p>
        </div>

      </div>
    </div>
  );
}
