// =============================================================
// src/components/TarotCard.tsx
// Tarot card component.
// Card back: deep night sky + scattered stars + gold foil border.
// Card front: real RWS image or text fallback.
// Supports: faceDown, revealed, reversed, selected, sizes.
// =============================================================
"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import type { TarotCardData } from "@/types/reading";
import { getCardImagePath } from "@/lib/tarot/utils";

// ─── Size map ─────────────────────────────────────────────────

const SIZES = {
  xs: { w: 48,  h: 80,  title: 8,  symbol: 14 },
  sm: { w: 64,  h: 108, title: 10, symbol: 18 },
  md: { w: 88,  h: 148, title: 11, symbol: 22 },
  lg: { w: 120, h: 200, title: 13, symbol: 28 },
  xl: { w: 160, h: 268, title: 15, symbol: 36 },
} as const;

export type CardSize = keyof typeof SIZES;
type S = (typeof SIZES)[CardSize];

export interface TarotCardProps {
  card?: TarotCardData | null;
  reversed?: boolean;
  faceDown?: boolean;
  revealed?: boolean;
  selected?: boolean;
  size?: CardSize;
  onClick?: () => void;
  className?: string;
  showLabel?: boolean;
  glowOnHover?: boolean;
}

// ─── Card back — real card-back image ─────────────────────────
// GPU-optimised: no SVG stars, no blur filters, no heavy paint.
// Overlays (border shimmer) are cheap pointer-events-none divs.

function CardBack({ s }: { s: S }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        borderRadius: 6,
        background: "#06020f",       // fallback while image loads
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      {/* ── Real card-back image ── */}
      <Image
        src="/images/tarot/card-back.PNG"
        alt=""
        fill
        sizes={`${s.w}px`}
        style={{ objectFit: "cover", objectPosition: "center" }}
        draggable={false}
        priority={false}
      />

      {/* ── Gold foil border overlay (cheap inset shadow, no repaint) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 6,
          boxShadow:
            "inset 0 0 0 2px rgba(200,160,40,0.7), inset 0 0 0 4px rgba(100,70,15,0.2)",
        }}
      />

      {/* ── Inner gold rule ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 4,
          borderRadius: 3,
          border: "1px solid rgba(180,140,30,0.22)",
        }}
      />

      {/* ── Subtle shimmer gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 6,
          background:
            "linear-gradient(135deg, rgba(220,175,50,0.07) 0%, transparent 45%, rgba(220,175,50,0.04) 100%)",
        }}
      />
    </div>
  );
}

// ─── Card front ───────────────────────────────────────────────

function CardFront({
  card, reversed, s, imgError, onImgError,
}: {
  card: TarotCardData; reversed: boolean; s: S;
  imgError: boolean; onImgError: () => void;
}) {
  const src = getCardImagePath(card.image);
  const orientationTransform = reversed ? "rotate(180deg)" : "none";
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        borderRadius: 6,
        background: "linear-gradient(160deg,#1c0a36 0%,#2a1050 100%)",
      }}
    >
      {/* Gold border frames */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 6,
          boxShadow:
            "inset 0 0 0 2px rgba(200,160,40,0.7), inset 0 0 0 4px rgba(100,70,15,0.25)",
          zIndex: 10,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 4,
          borderRadius: 3,
          border: "1px solid rgba(180,140,30,0.2)",
          zIndex: 10,
        }}
      />

      {/* Image or text fallback */}
      {src && !imgError ? (
        <img
          src={src}
          alt={`${card.name_zh}｜塔羅牌 三張牌占卜 AI解讀`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: orientationTransform, transformOrigin: "center" }}
          onError={onImgError}
          draggable={false}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-between py-[10%] px-[8%]"
          style={{ transform: orientationTransform, transformOrigin: "center" }}
        >
          <div className="text-amber-500/60 font-serif text-center" style={{ fontSize: s.title * 0.78 }}>
            {card.arcana === "major" ? "大阿卡納" : (card.suit ?? "小阿卡納")}
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-amber-300 select-none" style={{ fontSize: s.symbol * 1.15 }}>
              {card.arcana === "major" ? "☽" : "◆"}
            </div>
            <div className="text-amber-200 font-serif font-semibold text-center" style={{ fontSize: s.title, lineHeight: 1.25 }}>
              {card.name_zh}
            </div>
            <div className="text-amber-600/55 font-serif text-center" style={{ fontSize: s.title * 0.72 }}>
              {card.name}
            </div>
          </div>
          <div className="text-amber-500/50 font-serif text-center" style={{ fontSize: s.title * 0.68, lineHeight: 1.4 }}>
            {(reversed ? card.keywords_reversed : card.keywords).slice(0, 2).join(" · ")}
          </div>
        </div>
      )}

      {/* Reversed badge — counter-rotated so it reads correctly */}
      {reversed && (
        <div
          className="absolute z-20 bg-rose-950/90 border border-rose-700/60 text-rose-300 font-serif rounded"
          style={{
            top: 4, right: 4,
            fontSize: s.title * 0.72,
            padding: "1px 4px",
          }}
        >
          逆
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────

export default function TarotCard({
  card = null,
  reversed = false,
  faceDown = false,
  revealed = false,
  selected = false,
  size = "md",
  onClick,
  className = "",
  showLabel = false,
  glowOnHover = true,
}: TarotCardProps) {
  const [imgError, setImgError] = useState(false);
  const [pressing, setPressing] = useState(false);
  const s = SIZES[size];
  const showFront = !faceDown && (revealed || card !== null);
  const clickable  = !!onClick;

  const handleClick = useCallback(() => {
    if (!onClick) return;
    setPressing(true);
    setTimeout(() => { setPressing(false); onClick(); }, 175);
  }, [onClick]);

  return (
    <div
      className={`inline-flex flex-col items-center gap-2 select-none ${className}`}
      style={{ cursor: clickable ? "pointer" : "default" }}
      onClick={handleClick}
    >
      <div
        className="relative flex-shrink-0 transition-transform duration-200"
        style={{
          width:  s.w,
          height: s.h,
          borderRadius: 6,
          willChange: "transform",
          backfaceVisibility: "hidden",
          transform: pressing
            ? "scale3d(0.93,0.93,1)"
            : selected
            ? "scale3d(1.07,1.07,1) translateY(-5px)"
            : "scale3d(1,1,1)",
          boxShadow: selected
            ? "0 0 0 2px rgba(200,160,40,0.8), 0 10px 28px rgba(0,0,0,0.7)"
            : "0 4px 18px rgba(0,0,0,0.55)",
        }}
        onMouseEnter={(e) => {
          if (!clickable || !glowOnHover || selected) return;
          // translate3d keeps the hover on the GPU compositor layer
          (e.currentTarget as HTMLDivElement).style.transform = "scale3d(1.04,1.04,1) translateY(-3px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 0 0 1.5px rgba(180,140,30,0.55), 0 12px 24px rgba(0,0,0,0.6)";
        }}
        onMouseLeave={(e) => {
          if (!clickable || !glowOnHover || selected) return;
          (e.currentTarget as HTMLDivElement).style.transform = "scale3d(1,1,1)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 18px rgba(0,0,0,0.55)";
        }}
      >
        {faceDown || !showFront ? (
          <CardBack s={s} />
        ) : card ? (
          <CardFront
            card={card}
            reversed={reversed}
            s={s}
            imgError={imgError}
            onImgError={() => setImgError(true)}
          />
        ) : (
          /* Empty slot */
          <div
            className="absolute inset-0"
            style={{
              borderRadius: 6,
              border: "2px dashed rgba(100,70,15,0.3)",
              background: "rgba(13,5,24,0.5)",
            }}
          />
        )}
      </div>

      {/* Label */}
      {showLabel && card && showFront && (
        <div className="text-center">
          <div className="text-amber-300 font-serif font-medium" style={{ fontSize: s.title }}>
            {card.name_zh}
          </div>
          {reversed && (
            <div className="text-rose-400/70 font-serif" style={{ fontSize: s.title * 0.84 }}>
              逆位
            </div>
          )}
        </div>
      )}
    </div>
  );
}
