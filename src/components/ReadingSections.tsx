// =============================================================
// src/components/ReadingSections.tsx
//
// Renders free reading + locked paid preview + paywall CTA.
// Design: updated to new ArcanaPath design system.
// Business logic preserved exactly.
// =============================================================
"use client";

import React, { useState } from "react";
import type { ReadingResult, DrawnCard } from "@/types/reading";
import TarotCard from "./TarotCard";
import { PRICING_TIERS, PRIMARY_TIER } from "@/lib/pricing";

// ─── Safe string accessor ─────────────────────────────────────

function s(v: unknown, fb = ""): string {
  if (typeof v === "string" && v.trim().length > 0) return v.trim();
  if (Array.isArray(v)) return v.map(String).join("；");
  return fb;
}

// ─── Layout atoms ─────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px" style={{ background: "rgba(233,195,73,0.1)" }} />
      <div className="font-sans text-xs" style={{ color: "rgba(233,195,73,0.25)" }}>✦</div>
      <div className="flex-1 h-px" style={{ background: "rgba(233,195,73,0.1)" }} />
    </div>
  );
}

function SectionBox({
  title, icon, children, accent = false,
}: {
  title: string; icon?: string; children: React.ReactNode; accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 space-y-3"
      style={{
        background: accent
          ? "linear-gradient(145deg, rgba(26,34,50,0.7) 0%, rgba(19,25,32,0.7) 100%)"
          : "rgba(19,25,32,0.55)",
        border: accent
          ? "1px solid rgba(233,195,73,0.2)"
          : "1px solid rgba(233,195,73,0.1)",
      }}
    >
      <h3 className="font-serif font-semibold flex items-center gap-2 text-base" style={{ color: "#e9c349" }}>
        {icon && <span className="text-lg">{icon}</span>}
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Card reveal row ──────────────────────────────────────────

function CardRevealRow({ cards }: { cards: DrawnCard[] }) {
  const [revealed, setRevealed] = useState<boolean[]>(cards.map(() => false));
  if (!cards.length) return null;

  return (
    <div className="flex items-end justify-center gap-5 py-2">
      {cards.map((dc, i) => {
        const isRevealed = revealed[i] ?? false;
        return (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className="font-sans text-xs uppercase tracking-widest"
              style={{ color: "rgba(154,171,184,0.6)", letterSpacing: "0.12em" }}
            >
              {dc.position}
            </div>
            <TarotCard
              card={dc.card}
              reversed={dc.reversed}
              faceDown={!isRevealed}
              revealed={isRevealed}
              size="lg"
              showLabel={isRevealed}
              glowOnHover={!isRevealed}
              onClick={
                !isRevealed
                  ? () => setRevealed((prev) => {
                      const n = [...prev]; n[i] = true; return n;
                    })
                  : undefined
              }
            />
            {!isRevealed && (
              <div
                className="font-sans text-xs animate-pulse"
                style={{ color: "rgba(233,195,73,0.4)" }}
              >
                點擊翻開
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Locked blurred section ───────────────────────────────────

function LockedSection({ title, lines = 4 }: { title: string; lines?: number }) {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "rgba(19,25,32,0.4)",
        border: "1px solid rgba(233,195,73,0.08)",
      }}
    >
      <div className="space-y-2 filter blur-[3px] pointer-events-none select-none" aria-hidden>
        <div className="h-4 rounded w-3/4" style={{ background: "rgba(233,195,73,0.08)" }} />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded ${i % 3 === 2 ? "w-2/3" : "w-full"}`}
            style={{ background: "rgba(233,195,73,0.05)" }}
          />
        ))}
      </div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]"
        style={{ background: "rgba(15,20,27,0.65)" }}
      >
        <div className="text-2xl">🔒</div>
        <div className="font-sans text-sm font-medium" style={{ color: "rgba(232,232,232,0.75)" }}>
          {title}
        </div>
      </div>
    </div>
  );
}

// ─── Paywall CTA ──────────────────────────────────────────────

function PaywallCTA({ readingId }: { readingId?: string }) {
  const primary   = PRIMARY_TIER;
  const secondary = PRICING_TIERS.filter((t) => !t.highlighted);

  return (
    <div className="space-y-3">

      {/* Primary CTA */}
      <div
        className="rounded-2xl p-6 text-center space-y-4"
        style={{
          background: "linear-gradient(145deg, rgba(26,34,50,0.9) 0%, rgba(19,25,32,0.9) 100%)",
          border: "1.5px solid rgba(233,195,73,0.35)",
          boxShadow: "0 0 40px rgba(233,195,73,0.06)",
        }}
      >
        <div className="font-sans text-2xl" style={{ color: "rgba(233,195,73,0.5)" }}>✦</div>

        <div>
          <div className="font-serif text-xl font-semibold" style={{ color: "#e8e8e8" }}>
            解鎖完整深度報告
          </div>
          <div
            className="font-sans text-xs mt-1 leading-relaxed"
            style={{ color: "rgba(154,171,184,0.7)" }}
          >
            心理拆解・局勢真相・時間線・行動建議・核心問題
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-left max-w-xs mx-auto">
          {primary.features.map((f) => (
            <div key={f} className="flex items-start gap-1.5 font-sans text-xs">
              <span style={{ color: "#e9c349", flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ color: "rgba(232,232,232,0.7)" }}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-2.5 pt-1">
          <a
            href={readingId ? `/paywall?readingId=${encodeURIComponent(readingId)}` : "/paywall"}
            className="block font-sans font-bold py-4 px-8 rounded-xl transition-all hover:brightness-110 active:scale-[0.98] text-base"
            style={{
              background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
              color: "#0f141b",
              boxShadow: "0 4px 20px rgba(233,195,73,0.2)",
            }}
          >
            {primary.cta}
          </a>
          <a
            href="/reading"
            className="block font-sans text-sm py-2 transition-opacity hover:opacity-80"
            style={{
              border: "1px solid rgba(233,195,73,0.15)",
              borderRadius: 12,
              color: "rgba(154,171,184,0.6)",
            }}
          >
            再免費占卜一次
          </a>
        </div>

        <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.3)" }}>
          一次性付款 · 永久保存 · 可隨時查看
        </p>
      </div>

      {/* Secondary upsell row */}
      <div className="grid grid-cols-2 gap-2">
        {secondary.map((tier) => (
          <a
            key={tier.id}
            href={readingId ? `/paywall?readingId=${encodeURIComponent(readingId)}` : "/paywall"}
            className="rounded-xl p-3.5 text-center space-y-1.5 block transition-all hover:brightness-110"
            style={{
              background: "rgba(19,25,32,0.5)",
              border: "1px solid rgba(233,195,73,0.1)",
            }}
          >
            {tier.badge && (
              <div className="font-sans text-xs" style={{ color: "rgba(209,188,255,0.65)" }}>
                {tier.badge}
              </div>
            )}
            <div className="font-serif font-semibold text-sm" style={{ color: "rgba(232,232,232,0.8)" }}>
              {tier.label}
            </div>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="font-serif font-bold text-base" style={{ color: "#e9c349" }}>
                {tier.priceStr}
              </span>
              {tier.strikeStr && (
                <span className="font-sans text-xs line-through" style={{ color: "rgba(154,171,184,0.35)" }}>
                  {tier.strikeStr}
                </span>
              )}
            </div>
            <div className="font-sans text-xs leading-tight" style={{ color: "rgba(154,171,184,0.5)" }}>
              {tier.tagline}
            </div>
          </a>
        ))}
      </div>

    </div>
  );
}

// ─── PricingCards (standalone, e.g. /paywall) ─────────────────

export function PricingCards() {
  return (
    <div className="space-y-3">
      {PRICING_TIERS.map((tier) => (
        <div
          key={tier.id}
          className="rounded-2xl p-5 space-y-3"
          style={{
            border: tier.highlighted
              ? "1.5px solid rgba(233,195,73,0.35)"
              : "1px solid rgba(233,195,73,0.1)",
            background: tier.highlighted
              ? "linear-gradient(145deg, rgba(26,34,50,0.9) 0%, rgba(19,25,32,0.9) 100%)"
              : "rgba(19,25,32,0.5)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-semibold" style={{ color: "#e8e8e8" }}>
                  {tier.label}
                </span>
                {tier.badge && (
                  <span
                    className="font-sans text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: tier.highlighted ? "rgba(233,195,73,0.12)" : "rgba(209,188,255,0.08)",
                      color: tier.highlighted ? "#e9c349" : "#d1bcff",
                    }}
                  >
                    {tier.badge}
                  </span>
                )}
              </div>
              <div className="font-sans text-xs mt-0.5" style={{ color: "#9aabb8" }}>
                {tier.tagline}
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="font-serif font-bold text-xl" style={{ color: "#e9c349" }}>
                {tier.priceStr}
              </div>
              {tier.strikeStr && (
                <div className="font-sans text-xs line-through" style={{ color: "rgba(154,171,184,0.35)" }}>
                  {tier.strikeStr}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            {tier.features.map((f) => (
              <div key={f} className="flex items-start gap-2 font-sans text-sm">
                <span style={{ color: "#e9c349", flexShrink: 0, marginTop: 1 }}>✦</span>
                <span style={{ color: "rgba(232,232,232,0.7)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main ReadingSections ─────────────────────────────────────

interface ReadingSectionsProps {
  result:      ReadingResult | null | undefined;
  showPaywall?: boolean;
  readingId?: string;
  inlineShareSection?: React.ReactNode;
}

export default function ReadingSections({
  result,
  showPaywall = true,
  readingId,
  inlineShareSection,
}: ReadingSectionsProps) {

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-5xl animate-pulse" style={{ color: "rgba(233,195,73,0.3)" }}>☽</div>
        <div className="font-sans" style={{ color: "rgba(154,171,184,0.5)" }}>正在載入解讀…</div>
      </div>
    );
  }

  const { freeReading, deepReading, timelineReport, qaBonus, cards = [] } = result;

  if (!freeReading) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "rgba(207,102,121,0.08)", border: "1px solid rgba(207,102,121,0.2)" }}
      >
        <div className="font-sans" style={{ color: "#cf6679" }}>
          解讀資料載入失敗，請返回重新占卜。
        </div>
        <a
          href="/reading"
          className="inline-block mt-3 font-sans text-sm transition-opacity hover:opacity-80"
          style={{ color: "#e9c349" }}
        >
          ← 重新占卜
        </a>
      </div>
    );
  }

  const headline     = s(freeReading.headline,  "牌面已揭示");
  const mainAxis     = s(freeReading.mainAxis,   "請見下方各牌詳細解讀。");
  const nextStep     = s(freeReading.nextStep,   "靜下來，誠實面對你真正想要的結果。");
  const cardReadings = Array.isArray(freeReading.cardReadings) ? freeReading.cardReadings : [];

  const hasDeep     = deepReading     != null;
  const hasTimeline = timelineReport  != null;
  const hasQa       = Array.isArray(qaBonus) && qaBonus.length > 0;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">

      {/* Card reveal */}
      <SectionBox title="你的牌陣" icon="🃏" accent>
        <CardRevealRow cards={cards} />
        <p
          className="font-sans text-center text-xs"
          style={{ color: "rgba(154,171,184,0.4)" }}
        >
          點擊每張牌翻開 · 三張代表過去、現在、未來
        </p>
      </SectionBox>

      {/* Headline */}
      <div
        className="rounded-2xl px-6 py-5 text-center"
        style={{
          background: "linear-gradient(145deg, rgba(26,34,50,0.7) 0%, rgba(19,25,32,0.7) 100%)",
          border: "1.5px solid rgba(233,195,73,0.2)",
        }}
      >
        <div
          className="font-sans text-xs uppercase tracking-widest mb-2"
          style={{ color: "rgba(233,195,73,0.5)", letterSpacing: "0.18em" }}
        >
          牌面所說
        </div>
        <div
          className="font-serif text-lg sm:text-xl leading-relaxed font-semibold"
          style={{ color: "#e8e8e8" }}
        >
          「{headline}」
        </div>
      </div>

      {/* Main axis */}
      <SectionBox title="整體解讀" icon="◈">
        <p
          className="font-sans text-sm leading-[1.9] whitespace-pre-line"
          style={{ color: "rgba(232,232,232,0.8)" }}
        >
          {mainAxis}
        </p>
      </SectionBox>

      {/* Per-card readings */}
      <SectionBox title="三牌詳解" icon="✦">
        <div className="space-y-5">
          {cardReadings.length > 0
            ? cardReadings.map((cr, i) => (
                <div
                  key={i}
                  className="pl-4 space-y-1.5"
                  style={{ borderLeft: "2px solid rgba(233,195,73,0.25)" }}
                >
                  <div className="font-serif font-medium text-sm" style={{ color: "#e9c349" }}>
                    {s(cr?.position, `第${i + 1}張`)}
                    {s(cr?.cardName) ? ` ─ ${s(cr.cardName)}` : ""}
                  </div>
                  <p
                    className="font-sans text-sm leading-[1.85]"
                    style={{ color: "rgba(232,232,232,0.75)" }}
                  >
                    {s(cr?.interpretation, "解讀暫時未能載入。")}
                  </p>
                </div>
              ))
            : cards.map((dc, i) => (
                <div
                  key={i}
                  className="pl-4 space-y-1.5"
                  style={{ borderLeft: "2px solid rgba(233,195,73,0.25)" }}
                >
                  <div className="font-serif font-medium text-sm" style={{ color: "#e9c349" }}>
                    {dc.position} ─ {dc.card.name_zh}
                    {dc.reversed && (
                      <span className="font-sans text-xs ml-1.5" style={{ color: "rgba(209,188,255,0.65)" }}>
                        逆位
                      </span>
                    )}
                  </div>
                  <p
                    className="font-sans text-sm leading-[1.85]"
                    style={{ color: "rgba(232,232,232,0.75)" }}
                  >
                    {dc.reversed ? dc.card.meaning_reversed : dc.card.meaning_upright}
                  </p>
                </div>
              ))}
        </div>
      </SectionBox>

      {/* Next step */}
      <SectionBox title="下一步" icon="→">
        <p className="font-sans text-sm leading-[1.9]" style={{ color: "rgba(232,232,232,0.8)" }}>
          {nextStep}
        </p>
      </SectionBox>

      {inlineShareSection}

      <Divider />

      {/* Deep reading */}
      {hasDeep ? (
        <SectionBox title="深度心理解讀" icon="🔮" accent>
          <div className="space-y-5">
            {s(deepReading!.psychologicalBreakdown) && (
              <div className="space-y-1.5">
                <div
                  className="font-sans text-xs uppercase tracking-wider"
                  style={{ color: "rgba(154,171,184,0.5)", letterSpacing: "0.12em" }}
                >
                  心理分析
                </div>
                <p className="font-sans text-sm leading-[1.9]" style={{ color: "rgba(232,232,232,0.8)" }}>
                  {s(deepReading!.psychologicalBreakdown)}
                </p>
              </div>
            )}
            {s(deepReading!.hiddenTruth) && (
              <div className="space-y-1.5">
                <div
                  className="font-sans text-xs uppercase tracking-wider"
                  style={{ color: "rgba(154,171,184,0.5)", letterSpacing: "0.12em" }}
                >
                  局勢真相
                </div>
                <p className="font-sans text-sm leading-[1.9]" style={{ color: "rgba(232,232,232,0.8)" }}>
                  {s(deepReading!.hiddenTruth)}
                </p>
              </div>
            )}
            {s(deepReading!.actionAdvice) && (
              <div className="space-y-1.5">
                <div
                  className="font-sans text-xs uppercase tracking-wider"
                  style={{ color: "rgba(154,171,184,0.5)", letterSpacing: "0.12em" }}
                >
                  行動建議
                </div>
                <p
                  className="font-sans text-sm leading-[1.9] whitespace-pre-line"
                  style={{ color: "rgba(232,232,232,0.8)" }}
                >
                  {s(deepReading!.actionAdvice)}
                </p>
              </div>
            )}
            {s(deepReading!.hardQuestion) && (
              <div
                className="rounded-xl p-4 mt-1"
                style={{
                  background: "rgba(233,195,73,0.06)",
                  border: "1px solid rgba(233,195,73,0.15)",
                }}
              >
                <div
                  className="font-sans text-xs uppercase tracking-wider mb-1.5"
                  style={{ color: "rgba(154,171,184,0.5)", letterSpacing: "0.12em" }}
                >
                  最應該面對的問題
                </div>
                <p className="font-serif italic text-sm leading-relaxed" style={{ color: "#e9c349" }}>
                  「{s(deepReading!.hardQuestion)}」
                </p>
              </div>
            )}
          </div>
        </SectionBox>
      ) : showPaywall ? (
        <LockedSection title="深度心理解讀" lines={5} />
      ) : null}

      {/* Timeline */}
      {hasTimeline ? (
        <SectionBox title="時間線預測" icon="◷">
          <div className="space-y-3">
            {(
              [
                { label: "短期 1-4週",    value: s(timelineReport!.shortTerm) },
                { label: "中期 1-3個月",  value: s(timelineReport!.midTerm)   },
                { label: "長期 3個月以上", value: s(timelineReport!.longTerm)  },
              ] as const
            ).map(({ label, value }) =>
              value ? (
                <div
                  key={label}
                  className="rounded-xl p-3 space-y-1"
                  style={{
                    background: "rgba(15,20,27,0.5)",
                    border: "1px solid rgba(233,195,73,0.1)",
                  }}
                >
                  <div className="font-sans text-xs" style={{ color: "rgba(233,195,73,0.6)" }}>
                    {label}
                  </div>
                  <p className="font-sans text-sm leading-[1.85]" style={{ color: "rgba(232,232,232,0.75)" }}>
                    {value}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </SectionBox>
      ) : showPaywall ? (
        <LockedSection title="時間線預測" lines={3} />
      ) : null}

      {/* Q&A */}
      {hasQa ? (
        <SectionBox title="延伸問答" icon="💬">
          <div className="space-y-4">
            {qaBonus!.map((qa, i) => (
              <div
                key={i}
                className="rounded-xl p-4 space-y-2"
                style={{
                  background: "rgba(15,20,27,0.4)",
                  border: "1px solid rgba(233,195,73,0.08)",
                }}
              >
                <div className="font-serif text-sm font-medium" style={{ color: "#e9c349" }}>
                  Q：{s(qa?.question)}
                </div>
                <p className="font-sans text-sm leading-[1.85]" style={{ color: "rgba(232,232,232,0.7)" }}>
                  {s(qa?.answer)}
                </p>
              </div>
            ))}
          </div>
        </SectionBox>
      ) : showPaywall ? (
        <LockedSection title="延伸問答" lines={3} />
      ) : null}

      {/* Paywall CTA */}
      {showPaywall && (!hasDeep || !hasTimeline || !hasQa) && (
        <PaywallCTA readingId={readingId} />
      )}

    </div>
  );
}
