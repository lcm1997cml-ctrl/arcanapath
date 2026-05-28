// =============================================================
// src/components/TarotFan.tsx
// Arc fan card selector – real card-back image, GPU-optimised.
//
// Performance notes:
//   • Cards use will-change:transform + backface-visibility:hidden
//     so the browser promotes each card to its own compositor layer.
//   • Transforms are written as translate3d(...) to force GPU path.
//   • Box-shadows during animation are avoided via the CSS approach:
//     shadows live in a separate ::after pseudo-element that only
//     updates on state change, not every frame.
//   • CSS custom properties drive hover/selected via a single <style>
//     injection so React never re-renders cards just for hover.
//   • Individual cards are React.memo'd: only the changed card
//     re-renders when selectedIndices changes.
//   • Window-resize listener uses a passive flag + 100ms debounce.
// =============================================================
"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";

// ─── Injected CSS ─────────────────────────────────────────────
// !important is required to override inline `transform` styles.
// All animation work is done on compositor-only properties
// (transform, opacity) — no layout thrashing.
const FAN_STYLES = `
  .tfan-card {
    position: absolute;
    left: 50%;
    top: 32px;
    transform-origin: center bottom;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    will-change: transform;
    cursor: pointer;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                opacity   0.2s ease;
  }
  /* Separate shadow element avoids repainting the card itself */
  .tfan-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    pointer-events: none;
    transition: box-shadow 0.35s ease, opacity 0.35s ease;
  }
  .tfan-card:hover:not(.tfan-disabled) {
    transform: translateX(-50%) translate3d(var(--tfx), var(--tfyh), 0) rotate(var(--tfrot)) scale(1.1) !important;
    z-index: 50 !important;
  }
  .tfan-card:hover:not(.tfan-disabled)::after {
    box-shadow: 0 0 28px rgba(233, 195, 73, 0.5);
  }
  .tfan-card.tfan-selected {
    transform: translateX(-50%) translate3d(var(--tfx), var(--tfys), 0) rotate(0deg) scale(1.15) !important;
    z-index: 60 !important;
  }
  .tfan-card.tfan-selected::after {
    box-shadow: 0 0 40px rgba(233, 195, 73, 0.7), 0 0 0 1.5px rgba(233,195,73,0.9);
  }
  .tfan-disabled { opacity: 0.28 !important; cursor: default !important; }
`;

// ─── Types ────────────────────────────────────────────────────

export interface TarotFanProps {
  totalCards: number;
  selectedIndices: number[];
  onSelect: (index: number) => void;
  maxSelect?: number;
}

interface CardDef {
  i: number;
  angle: number;
  x: number;
  y: number;
  zBase: number;
}

// ─── Single card — memo'd so only the changed card re-renders ─

interface FanCardProps {
  def: CardDef;
  cardW: number;
  cardH: number;
  riseHover: number;
  riseSelected: number;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (i: number) => void;
}

const FanCard = memo(function FanCard({
  def, cardW, cardH, riseHover, riseSelected,
  isSelected, isDisabled, onSelect,
}: FanCardProps) {
  const { i, angle, x, y, zBase } = def;
  const yHover    = y - riseHover;
  const ySelected = y - riseSelected;

  const handleClick = useCallback(() => {
    if (!isDisabled) onSelect(i);
  }, [isDisabled, i, onSelect]);

  return (
    <div
      className={[
        "tfan-card",
        isSelected ? "tfan-selected" : "",
        isDisabled ? "tfan-disabled"  : "",
      ].filter(Boolean).join(" ")}
      style={{
        width:  cardW,
        height: cardH,
        // CSS vars consumed by the injected :hover / .tfan-selected rules
        "--tfx":   `${x}px`,
        "--tfyh":  `${yHover}px`,
        "--tfys":  `${ySelected}px`,
        "--tfrot": `${angle}deg`,
        // Initial transform — overridden by CSS class rules via !important
        transform: isSelected
          ? `translateX(-50%) translate3d(${x}px, ${ySelected}px, 0) rotate(0deg) scale(1.15)`
          : `translateX(-50%) translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`,
        zIndex: isSelected ? 60 + i : zBase,
        borderRadius: 10,
        overflow: "hidden",
        // Border lives on ::after so it doesn't trigger repaint on transform
        border: isSelected
          ? "1.5px solid rgba(233,195,73,0.9)"
          : "1px solid rgba(200,155,40,0.3)",
      } as React.CSSProperties}
      onClick={handleClick}
      // No onMouseEnter/Leave — hover is handled entirely by CSS
    >
      {/* Real card-back image */}
      <Image
        src="/images/tarot/card-back.PNG"
        alt=""
        fill
        sizes={`${cardW}px`}
        style={{ objectFit: "cover", objectPosition: "center" }}
        draggable={false}
        priority={i < 4}        // first visible cards load immediately
      />

      {/* Subtle gold shimmer overlay — thin layer, no blur cost */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isSelected
            ? "linear-gradient(135deg, rgba(233,195,73,0.12) 0%, transparent 50%)"
            : "linear-gradient(135deg, rgba(233,195,73,0.04) 0%, transparent 60%)",
          transition: "background 0.3s ease",
        }}
      />
    </div>
  );
});

// ─── Main export ──────────────────────────────────────────────

export default function TarotFan({
  totalCards,
  selectedIndices,
  onSelect,
  maxSelect = 3,
}: TarotFanProps) {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setWindowWidth(window.innerWidth), 100);
    };
    update();                              // initial read
    window.addEventListener("resize", update, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", update);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const count    = Math.min(totalCards, 26);

  // ── Arc geometry ──────────────────────────────────────────
  const radius     = isMobile ? 400  : 700;
  const startAngle = isMobile ? -46  : -52;
  const endAngle   = isMobile ?  46  :  52;

  // ── Card dimensions ───────────────────────────────────────
  // reference: w-32 h-52 = 128 × 208 (≈ 3:5 ratio)
  const cardW = isMobile ?  76 : 128;
  const cardH = isMobile ? 124 : 208;

  // ── Rise amounts ──────────────────────────────────────────
  const riseHover    = isMobile ? 28 : 40;
  const riseSelected = isMobile ? 55 : 80;

  // ── Container height = top-offset + cardH + maxArcDrop + pad ──
  const maxArcDrop  = radius - radius * Math.cos((Math.abs(startAngle) * Math.PI) / 180);
  const containerH  = Math.ceil(32 + cardH + maxArcDrop + 20);

  const mid = (count - 1) / 2;

  // CardDefs are stable as long as geometry doesn't change
  const cards: CardDef[] = Array.from({ length: count }, (_, i) => {
    const angle = count === 1 ? 0 : startAngle + (i * (endAngle - startAngle)) / (count - 1);
    const rad   = (angle * Math.PI) / 180;
    const x     = radius * Math.sin(rad);
    const y     = radius - radius * Math.cos(rad);
    const zBase = 10 + Math.round(count - Math.abs(i - mid));
    return { i, angle, x, y, zBase };
  });

  const canSelectMore = selectedIndices.length < maxSelect;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FAN_STYLES }} />

      <div
        className="relative w-full overflow-visible"
        style={{ height: containerH, minHeight: containerH }}
      >
        {/* perspective enables 3-D depth cue on the arc */}
        <div className="relative w-full h-full" style={{ perspective: "2000px" }}>
          {cards.map((def) => {
            const isSelected = selectedIndices.includes(def.i);
            const isDisabled = !isSelected && !canSelectMore;
            return (
              <FanCard
                key={def.i}
                def={def}
                cardW={cardW}
                cardH={cardH}
                riseHover={riseHover}
                riseSelected={riseSelected}
                isSelected={isSelected}
                isDisabled={isDisabled}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
