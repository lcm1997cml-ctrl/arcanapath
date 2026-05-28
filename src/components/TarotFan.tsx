// =============================================================
// src/components/TarotFan.tsx
// Arc fan card selector matching /reference/stitch-draw-ui/.
// Arc math: x = R·sin(θ), y = R - R·cos(θ)
// CSS custom properties drive hover/selected transforms.
// =============================================================
"use client";

import React, { useState, useEffect } from "react";

// ─── Star texture (reuses CardBack aesthetic) ─────────────────
const STAR_SM = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='3' cy='4' r='0.55' fill='rgba(255,240,180,0.55)'/%3E%3Ccircle cx='14' cy='2' r='0.4' fill='rgba(255,240,180,0.4)'/%3E%3Ccircle cx='20' cy='10' r='0.6' fill='rgba(255,240,180,0.5)'/%3E%3Ccircle cx='7' cy='18' r='0.45' fill='rgba(255,240,180,0.45)'/%3E%3Ccircle cx='18' cy='20' r='0.35' fill='rgba(255,240,180,0.35)'/%3E%3C/svg%3E")`;
const STAR_LG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='5' cy='8' r='0.9' fill='rgba(255,240,180,0.6)'/%3E%3Ccircle cx='22' cy='3' r='0.7' fill='rgba(255,240,180,0.5)'/%3E%3Ccircle cx='35' cy='18' r='1.0' fill='rgba(255,240,180,0.55)'/%3E%3Ccircle cx='12' cy='30' r='0.75' fill='rgba(255,240,180,0.5)'/%3E%3Ccircle cx='30' cy='33' r='0.85' fill='rgba(255,240,180,0.4)'/%3E%3C/svg%3E")`;

// ─── CSS injected once for hover/selected transforms ──────────
// CSS !important overrides inline styles, enabling hover to work.
const FAN_STYLES = `
  .tfan-card {
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                box-shadow 0.4s ease,
                border-color 0.3s ease,
                opacity 0.2s ease;
    cursor: pointer;
    transform-origin: center bottom;
    position: absolute;
    left: 50%;
    top: 32px;
  }
  .tfan-card:hover:not(.tfan-disabled) {
    transform: translateX(-50%) translate(var(--tfx), var(--tfyh)) rotate(var(--tfrot)) scale(1.1) !important;
    box-shadow: 0 0 25px rgba(233, 195, 73, 0.45) !important;
    z-index: 50 !important;
  }
  .tfan-card.tfan-selected {
    transform: translateX(-50%) translate(var(--tfx), var(--tfys)) rotate(0deg) scale(1.15) !important;
    box-shadow: 0 0 40px rgba(233, 195, 73, 0.65) !important;
    z-index: 60 !important;
  }
`;

// ─── Props ────────────────────────────────────────────────────

export interface TarotFanProps {
  totalCards: number;
  selectedIndices: number[];
  onSelect: (index: number) => void;
  maxSelect?: number;
}

// ─── Card back art (mini, self-contained) ─────────────────────

function MiniCardBack({ selected }: { selected: boolean }) {
  return (
    <>
      {/* Deep-space gradient base (already set as parent background) */}
      {/* Star layer 1 */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: STAR_SM, backgroundSize: "24px 24px", opacity: selected ? 0.9 : 0.7 }}
      />
      {/* Star layer 2 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: STAR_LG,
          backgroundSize: "40px 40px",
          backgroundPosition: "7px 11px",
          opacity: selected ? 0.75 : 0.55,
        }}
      />
      {/* Nebula glow */}
      <div
        className="absolute"
        style={{
          inset: "18%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(80,40,160,0.18) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
      {/* Gold outer inset */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ boxShadow: "inset 0 0 0 2px rgba(200,160,40,0.45), inset 0 0 0 3px rgba(100,70,15,0.2)" }}
      />
      {/* Inner rule */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: 4, borderRadius: 3, border: "1px solid rgba(180,140,30,0.22)" }}
      />
      {/* Center octagram + glyph */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3px]" style={{ zIndex: 5 }}>
        <svg
          width={selected ? 52 : 44}
          height={selected ? 52 : 44}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.55 }}
        >
          <circle cx="22" cy="22" r="19" stroke="rgba(200,160,40,0.45)" strokeWidth="0.8" />
          <rect x="9" y="9" width="26" height="26" stroke="rgba(200,160,40,0.35)" strokeWidth="0.7" />
          <rect x="9" y="9" width="26" height="26" stroke="rgba(200,160,40,0.3)" strokeWidth="0.7" transform="rotate(45 22 22)" />
          <circle cx="22" cy="22" r="6" stroke="rgba(200,160,40,0.4)" strokeWidth="0.7" />
        </svg>
        <div
          style={{
            fontSize: 14,
            color: "rgba(220,175,50,0.8)",
            textShadow: "0 0 8px rgba(220,175,50,0.5)",
            lineHeight: 1,
            marginTop: -4,
          }}
        >
          ✦
        </div>
        {selected && (
          <div style={{ fontSize: 8, color: "rgba(200,160,40,0.5)", letterSpacing: "0.25em", lineHeight: 1 }}>
            ☽ ✦ ☾
          </div>
        )}
      </div>
      {/* Corner dots */}
      {(["top-[5px] left-[5px]", "top-[5px] right-[5px]", "bottom-[5px] left-[5px]", "bottom-[5px] right-[5px]"] as const).map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos} select-none`}
          style={{ fontSize: 7, color: "rgba(200,160,40,0.45)", lineHeight: 1, zIndex: 5 }}
        >
          ◆
        </div>
      ))}
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(220,175,50,0.06) 0%, transparent 45%, rgba(220,175,50,0.04) 100%)",
        }}
      />
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────

export default function TarotFan({
  totalCards,
  selectedIndices,
  onSelect,
  maxSelect = 3,
}: TarotFanProps) {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = windowWidth < 768;
  const count    = Math.min(totalCards, 26);

  // Arc geometry — wider spread for 26 cards vs reference's 14
  const radius     = isMobile ? 400 : 700;
  const startAngle = isMobile ? -46 : -52;
  const endAngle   = isMobile ? 46  : 52;

  // Card dimensions — reference uses w-32 h-52 (128×208)
  const cardW = isMobile ? 76  : 128;
  const cardH = isMobile ? 124 : 208;

  // Rise on hover / selected
  const riseHover    = isMobile ? 28 : 40;
  const riseSelected = isMobile ? 55 : 80;

  // Container height: lowest point of arc + card + some padding
  const maxYOffset  = radius - radius * Math.cos((Math.abs(startAngle) * Math.PI) / 180);
  const containerH  = Math.ceil(32 + cardH + maxYOffset + 20);

  const cards = Array.from({ length: count }, (_, i) => {
    const angle  = count === 1 ? 0 : startAngle + (i * (endAngle - startAngle)) / (count - 1);
    const rad    = (angle * Math.PI) / 180;
    const x      = radius * Math.sin(rad);
    const y      = radius - radius * Math.cos(rad);
    return { i, angle, x, y };
  });

  const canSelectMore = selectedIndices.length < maxSelect;
  const mid = (count - 1) / 2;

  return (
    <>
      {/* Inject arc CSS once — uses !important to override inline transforms */}
      <style dangerouslySetInnerHTML={{ __html: FAN_STYLES }} />

      <div
        className="relative w-full overflow-visible"
        style={{ height: containerH, minHeight: containerH }}
      >
        <div className="relative w-full h-full" style={{ perspective: "2000px" }}>
          {cards.map(({ i, angle, x, y }) => {
            const isSelected = selectedIndices.includes(i);
            const isDisabled = !isSelected && !canSelectMore;
            const zBase = 10 + Math.round(count - Math.abs(i - mid));

            return (
              <div
                key={i}
                className={[
                  "tfan-card",
                  "rounded-xl overflow-hidden shadow-2xl select-none",
                  isSelected  ? "tfan-selected"  : "",
                  isDisabled  ? "tfan-disabled"  : "",
                ].join(" ")}
                style={{
                  width:  cardW,
                  height: cardH,
                  // CSS custom properties for hover/selected CSS rules
                  "--tfx":  `${x}px`,
                  "--tfyh": `${y - riseHover}px`,
                  "--tfys": `${y - riseSelected}px`,
                  "--tfrot": `${angle}deg`,
                  // Initial inline transform (overridden by .tfan-selected / :hover CSS)
                  transform: isSelected
                    ? `translateX(-50%) translate(${x}px, ${y - riseSelected}px) rotate(0deg) scale(1.15)`
                    : `translateX(-50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
                  zIndex: isSelected ? 60 + i : zBase,
                  border: isSelected
                    ? "1.5px solid rgba(233,195,73,0.9)"
                    : "1px solid rgba(200,155,40,0.25)",
                  background: "radial-gradient(ellipse at 40% 25%, #1e0e40 0%, #100826 40%, #06020f 100%)",
                  opacity: isDisabled ? 0.28 : 1,
                  cursor: isDisabled ? "default" : "pointer",
                } as React.CSSProperties}
                onClick={() => { if (!isDisabled) onSelect(i); }}
              >
                <MiniCardBack selected={isSelected} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
