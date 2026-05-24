"use client";
// src/app/result/[id]/ResultClientPage.tsx — Mockup 2 design

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type { ReadingResult, UserRole } from "@/types/reading";
import ReadingSections from "@/components/ReadingSections";
import CheckoutPlanButtons from "@/components/CheckoutPlanButtons";
import { buildShareImagePayloadFromReading, renderShareImageToDataUrlAsync } from "@/lib/shareImageCanvas";

interface ResultClientPageProps {
  id: string;
  result: ReadingResult;
  topicLabel: string;
  dateStr: string;
  isPaidQuery: boolean;
  paidPlan?: string;
  isUnlocked: boolean;
  userRole?: UserRole;
  isLoggedIn: boolean;
}

// ─── Card position labels ─────────────────────────────────────
const POSITIONS = ["旅程", "當下", "前路"] as const;
const POSITION_LABELS = ["過去", "現在", "未來"] as const;

// ─── Tarot card visual ────────────────────────────────────────
function TarotCardDisplay({
  name,
  position,
  posLabel,
  reversed,
  index,
}: {
  name: string;
  position: string;
  posLabel: string;
  reversed: boolean;
  index: number;
}) {
  const rotations = [-5, 0, 5];
  const baseRot = rotations[index] ?? 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="font-sans text-xs uppercase tracking-widest"
        style={{ color: "rgba(154,171,184,0.65)", letterSpacing: "0.15em" }}
      >
        {posLabel}
      </span>
      <div
        className="gold-filigree relative rounded-xl flex flex-col items-center justify-end pb-3 transition-all duration-500"
        style={{
          width: 88,
          height: 140,
          background: "linear-gradient(145deg, #1a2232 0%, #131920 100%)",
          transform: `rotate(${reversed ? baseRot + 180 : baseRot}deg)`,
        }}
      >
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 40% 30%, rgba(209,188,255,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-[5px] rounded-lg" style={{ border: "1px solid rgba(233,195,73,0.12)" }} />
        <span
          className="font-serif text-center text-xs font-semibold px-2 leading-tight relative z-10"
          style={{
            color: "#e9c349",
            transform: reversed ? "rotate(180deg)" : "none",
            display: "block",
          }}
        >
          {name}
        </span>
        {reversed && (
          <span
            className="font-sans text-center relative z-10"
            style={{
              fontSize: 9,
              marginTop: 2,
              color: "rgba(209,188,255,0.65)",
              transform: "rotate(180deg)",
              display: "block",
            }}
          >
            逆位
          </span>
        )}
      </div>
      <span
        className="font-sans text-xs"
        style={{ color: "rgba(154,171,184,0.5)" }}
      >
        {position}
      </span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function ResultClientPage({
  id,
  result,
  topicLabel,
  dateStr,
  isPaidQuery,
  paidPlan,
  isUnlocked,
  userRole,
  isLoggedIn,
}: ResultClientPageProps) {
  const [shareToast, setShareToast] = useState("");
  const [downloadBusy, setDownloadBusy] = useState(false);

  const paidLabelMap: Record<string, string> = {
    "19": "基本完整解讀",
    "39": "深入分析",
    "88": "完整 AI 深度解讀",
    starter: "基本完整解讀",
    insight: "深入分析",
    master: "完整 AI 深度解讀",
  };

  const shareOrigin = useMemo(() => {
    if (typeof window === "undefined") return process.env.NEXT_PUBLIC_APP_URL ?? "";
    return process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  }, []);
  const shareUrl = useMemo(() => `${shareOrigin}/r/${id}`, [shareOrigin, id]);
  const brandDomain = useMemo(
    () => shareUrl.replace(/^https?:\/\//, "").split("/")[0] || "ArcanaPath",
    [shareUrl]
  );
  const shareCopyRich = useMemo(() => {
    const h = (result.freeReading?.headline ?? "").trim();
    return h ? `${h}\n${shareUrl}` : `ArcanaPath 塔羅 · 我的抽牌結果\n${shareUrl}`;
  }, [result, shareUrl]);
  const platformUrls = useMemo(
    () => ({
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareCopyRich)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareCopyRich)}`,
      instagram: "https://www.instagram.com/",
      threads: "https://www.threads.net/",
    }),
    [shareUrl, shareCopyRich]
  );
  const notifyShared = useCallback(() => {
    setShareToast("已開啟分享");
    setTimeout(() => setShareToast(""), 2200);
  }, []);

  const handleShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ title: "ArcanaPath 塔羅", text: shareCopyRich, url: shareUrl || undefined })
        .catch(() => {});
      notifyShared();
      return;
    }
    window.open(platformUrls.x, "_blank", "noopener,noreferrer");
    notifyShared();
  }, [notifyShared, platformUrls.x, shareCopyRich, shareUrl]);

  const handlePlatformShare = useCallback(
    (url: string) => {
      window.open(url, "_blank", "noopener,noreferrer");
      notifyShared();
    },
    [notifyShared]
  );

  const handleDownloadImage = useCallback(async () => {
    setDownloadBusy(true);
    try {
      const payload = buildShareImagePayloadFromReading(result, brandDomain);
      const dataUrl = await renderShareImageToDataUrlAsync(payload);
      if (!dataUrl) {
        setShareToast("無法產生圖片");
        setTimeout(() => setShareToast(""), 2200);
        return;
      }
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "arcanapath-result-share.png";
      a.click();
      setShareToast("圖片已下載");
      setTimeout(() => setShareToast(""), 2200);
    } catch {
      setShareToast("下載失敗，請重試");
      setTimeout(() => setShareToast(""), 2200);
    } finally {
      setDownloadBusy(false);
    }
  }, [result, brandDomain]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareToast("連結已複製");
    } catch {
      setShareToast("複製失敗，請手動複製");
    }
    setTimeout(() => setShareToast(""), 2200);
  }, [shareUrl]);

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareCopyRich);
      setShareToast("文案已複製");
    } catch {
      setShareToast("複製失敗，請手動複製");
    }
    setTimeout(() => setShareToast(""), 2200);
  }, [shareCopyRich]);

  // Cards from result (result.cards is DrawnCard[])
  const cards = useMemo(() => {
    const drawn = result.cards ?? [];
    return drawn.slice(0, 3) as { card: { name: string; name_zh?: string }; reversed: boolean }[];
  }, [result]);

  const renderShareSection = useCallback(
    (title: string) => (
      <div
        className="rounded-2xl p-5 space-y-4 mt-6"
        style={{
          background: "rgba(19,25,32,0.7)",
          border: "1px solid rgba(233,195,73,0.12)",
        }}
      >
        <p className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>
          {title}
        </p>

        <button
          type="button"
          onClick={handleShare}
          className="w-full font-sans font-semibold py-3 rounded-xl transition-all hover:brightness-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
            color: "#0f141b",
          }}
        >
          分享結果
        </button>

        <div className="grid grid-cols-5 gap-2">
          {[
            { label: "Facebook", url: platformUrls.facebook },
            { label: "X", url: platformUrls.x },
            { label: "WhatsApp", url: platformUrls.whatsapp },
            { label: "Instagram", url: platformUrls.instagram },
            { label: "Threads", url: platformUrls.threads },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handlePlatformShare(p.url)}
              className="font-sans text-xs py-2 rounded-lg transition-all hover:opacity-80"
              style={{
                border: "1px solid rgba(233,195,73,0.18)",
                color: "rgba(232,232,232,0.65)",
                background: "rgba(233,195,73,0.04)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-3 gap-2 pt-3"
          style={{ borderTop: "1px solid rgba(233,195,73,0.1)" }}
        >
          <button
            type="button"
            onClick={() => void handleCopyLink()}
            className="font-sans text-xs py-2 rounded-lg transition-all hover:opacity-80"
            style={{ border: "1px solid rgba(233,195,73,0.18)", color: "rgba(232,232,232,0.65)", background: "rgba(233,195,73,0.04)" }}
          >
            複製連結
          </button>
          <button
            type="button"
            onClick={() => void handleCopyText()}
            className="font-sans text-xs py-2 rounded-lg transition-all hover:opacity-80"
            style={{ border: "1px solid rgba(233,195,73,0.18)", color: "rgba(232,232,232,0.65)", background: "rgba(233,195,73,0.04)" }}
          >
            複製文案
          </button>
          <button
            type="button"
            onClick={() => void handleDownloadImage()}
            disabled={downloadBusy}
            className="font-sans text-xs py-2 rounded-lg transition-all hover:opacity-80 disabled:opacity-50"
            style={{ border: "1px solid rgba(233,195,73,0.18)", color: "rgba(232,232,232,0.65)", background: "rgba(233,195,73,0.04)" }}
          >
            {downloadBusy ? "產生中…" : "下載圖片"}
          </button>
        </div>
      </div>
    ),
    [
      handleCopyLink,
      handleCopyText,
      downloadBusy,
      handleDownloadImage,
      handlePlatformShare,
      handleShare,
      platformUrls.facebook,
      platformUrls.instagram,
      platformUrls.threads,
      platformUrls.whatsapp,
      platformUrls.x,
    ]
  );

  return (
    <div
      className="min-h-screen text-white pb-28"
      style={{ background: "#0f141b" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2"
        style={{
          width: 600,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(209,188,255,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav
        className="relative z-10 flex items-center justify-between px-5 py-3.5"
        style={{
          borderBottom: "1px solid rgba(233,195,73,0.1)",
          background: "rgba(15,20,27,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/" className="font-serif text-lg font-semibold" style={{ color: "#e9c349" }}>
          ✦ ArcanaPath
        </Link>
        <div className="flex items-center gap-4 text-sm font-sans">
          {userRole === "admin" && (
            <Link href="/admin" style={{ color: "#e9c349" }}>後台</Link>
          )}
          {isLoggedIn ? (
            <Link href="/dashboard" style={{ color: "rgba(154,171,184,0.7)" }}>我的記錄</Link>
          ) : (
            <Link href="/reading" style={{ color: "rgba(154,171,184,0.7)" }}>← 再問一次</Link>
          )}
        </div>
      </nav>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="relative z-10 text-center pt-8 pb-4 px-5">
        <span
          className="inline-block font-sans text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{
            background: "rgba(233,195,73,0.08)",
            border: "1px solid rgba(233,195,73,0.18)",
            color: "rgba(233,195,73,0.8)",
            letterSpacing: "0.18em",
          }}
        >
          {topicLabel}
        </span>

        <h1
          className="font-serif text-xl font-semibold max-w-xl mx-auto leading-relaxed"
          style={{ color: "#e8e8e8" }}
        >
          「{result.question}」
        </h1>

        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.5)" }}>
            {dateStr}
          </span>
          {userRole === "admin" && (
            <span
              className="font-sans text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(233,195,73,0.1)", border: "1px solid rgba(233,195,73,0.2)", color: "#e9c349" }}
            >
              Admin · 完整報告
            </span>
          )}
          {result.isPaid && (
            <span
              className="font-sans text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(233,195,73,0.08)", border: "1px solid rgba(233,195,73,0.15)", color: "rgba(233,195,73,0.8)" }}
            >
              已解鎖完整版
            </span>
          )}
          {isPaidQuery && (
            <span
              className="font-sans text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(100,220,100,0.08)", border: "1px solid rgba(100,220,100,0.18)", color: "rgba(120,230,120,0.9)" }}
            >
              付款成功 · {paidLabelMap[paidPlan ?? ""]}
            </span>
          )}
        </div>
      </div>

      {/* ── Three-card spread ────────────────────────────────── */}
      {cards.length === 3 && (
        <div className="relative z-10 max-w-md mx-auto px-5 mb-6">
          <div
            className="rounded-2xl py-6 px-4"
            style={{
              background: "rgba(19,25,32,0.5)",
              border: "1px solid rgba(233,195,73,0.1)",
            }}
          >
            <p
              className="font-sans text-xs text-center uppercase tracking-widest mb-5"
              style={{ color: "rgba(154,171,184,0.5)", letterSpacing: "0.2em" }}
            >
              你靈魂嘅鏡像
            </p>
            <div className="flex justify-center gap-5">
              {cards.map((c, i) => (
                <TarotCardDisplay
                  key={i}
                  name={c.card.name_zh ?? c.card.name}
                  position={POSITIONS[i] ?? `第${i + 1}張`}
                  posLabel={POSITION_LABELS[i] ?? ""}
                  reversed={c.reversed}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Reading content ──────────────────────────────────── */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-2">
        <ReadingSections
          result={result as any}
          showPaywall={!isUnlocked}
          readingId={id}
          inlineShareSection={renderShareSection("分享你的結果 🔮")}
        />
        {isUnlocked && renderShareSection("睇完整份解讀後，想分享俾朋友睇？🔮")}
      </div>

      {/* ── Sticky bottom bar ────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div
          className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3"
          style={{
            borderTop: "1px solid rgba(233,195,73,0.12)",
            background: "rgba(15,20,27,0.92)",
            backdropFilter: "blur(16px)",
          }}
        >
          <Link
            href="/reading"
            className="font-sans text-sm flex-shrink-0 transition-opacity hover:opacity-100"
            style={{ color: "rgba(154,171,184,0.55)" }}
          >
            ← 再問一次
          </Link>

          <div className="flex-1 flex items-center justify-end gap-2">
            {isUnlocked ? (
              isLoggedIn ? (
                <Link href="/dashboard" className="font-sans text-sm" style={{ color: "rgba(233,195,73,0.7)" }}>
                  查看歷史 →
                </Link>
              ) : (
                <Link href="/" className="font-sans text-sm" style={{ color: "rgba(233,195,73,0.7)" }}>
                  返回首頁 →
                </Link>
              )
            ) : (
              <CheckoutPlanButtons readingId={id} />
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ────────────────────────────────────────────── */}
      {shareToast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] font-sans text-sm px-4 py-2 rounded-lg shadow-lg"
          style={{ background: "rgba(233,195,73,0.95)", color: "#0f141b" }}
        >
          {shareToast}
        </div>
      )}
    </div>
  );
}
