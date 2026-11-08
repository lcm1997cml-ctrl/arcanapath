// src/app/page.tsx — Homepage (server). Interactive hero lives in HomeClient;
// the explanation/SEO sections below are server-rendered HTML.
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { FaqList } from "@/components/content/ContentShell";
import { SITE_FAQ } from "@/lib/seo/faq";
import { PRICING_TIERS } from "@/lib/pricing";
import { SITE_DESCRIPTION } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: { absolute: "AI塔羅占卜｜免費三張牌塔羅解讀・感情事業人生｜ArcanaPath" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const STEPS = [
  { t: "寫下問題", d: "感情、工作、財運或人生方向，越具體越好。" },
  { t: "親手抽三張牌", d: "過去・現在・未來，隨機正逆位，同一次不會重複。" },
  { t: "AI 塔羅解讀", d: "先給直接結論，再逐張拆解，最後給你下一步。" },
];

const TOPICS = [
  { t: "感情塔羅", d: "他喜歡我嗎？會復合嗎？我和他的未來。", href: "/love-tarot" },
  { t: "事業塔羅", d: "應該轉工嗎？升職時機？目前阻力在哪？", href: "/reading?topic=career" },
  { t: "財運塔羅", d: "收入走勢、投資風險、短期財務壓力。", href: "/reading?topic=wealth" },
  { t: "人生占卜", d: "卡住了嗎？該改變還是等待？", href: "/reading?topic=life" },
];

function HomeSections() {
  const homeFaq = SITE_FAQ.slice(0, 6);
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-20 space-y-16">
      <section aria-labelledby="how">
        <h2 id="how" className="font-serif text-2xl sm:text-3xl font-semibold text-center">
          AI塔羅占卜如何運作？
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-secondary/15 bg-surface-container-low/70 p-5">
              <span className="font-serif text-secondary text-lg">0{i + 1}</span>
              <h3 className="mt-1 font-semibold text-on-surface">{s.t}</h3>
              <p className="mt-1.5 text-sm text-on-surface-variant">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="topics">
        <h2 id="topics" className="font-serif text-2xl sm:text-3xl font-semibold text-center">
          你想問哪方面？
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((t) => (
            <Link
              key={t.t}
              href={t.href}
              className="rounded-2xl border border-secondary/15 bg-surface-container-low/70 p-5 transition hover:border-secondary/45"
            >
              <h3 className="font-semibold text-secondary">{t.t}</h3>
              <p className="mt-1.5 text-sm text-on-surface-variant">{t.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="why" className="rounded-2xl border border-secondary/15 bg-surface-container p-6 sm:p-8">
        <h2 id="why" className="font-serif text-2xl font-semibold">為什麼不直接問 ChatGPT？</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-on-surface-variant">
          <li>✦ <strong className="text-on-surface">牌面先行</strong>：你抽出的牌與正逆位，決定解讀方向。</li>
          <li>✦ <strong className="text-on-surface">固定結構</strong>：結論 → 整體 → 逐張牌 → 下一步，唔會答非所問。</li>
          <li>✦ <strong className="text-on-surface">情境導向</strong>：感情、事業、財運、人生各有不同分析重點。</li>
          <li>✦ <strong className="text-on-surface">可深入</strong>：需要時解鎖心理拆解、時間線與延伸問答。</li>
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/ai-tarot" className="text-secondary hover:underline">了解 AI 塔羅如何運作 →</Link>
        </p>
      </section>

      <section aria-labelledby="pricing">
        <h2 id="pricing" className="font-serif text-2xl sm:text-3xl font-semibold text-center">先免費，需要時才解鎖</h2>
        <p className="mt-3 text-center text-sm text-on-surface-variant">
          免費結果已包含完整三牌解讀。想再深入，才選擇方案——一次性付款，無自動續費。
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PRICING_TIERS.map((t) => (
            <div key={t.id} className={`rounded-2xl border p-5 ${t.highlighted ? "border-secondary/50 bg-surface-container" : "border-secondary/15 bg-surface-container-low/70"}`}>
              <p className="font-serif text-2xl text-secondary">{t.priceStr}</p>
              <p className="mt-1 text-sm text-on-surface">{t.tagline}</p>
              <ul className="mt-3 space-y-1 text-xs text-on-surface-variant">
                {t.features.slice(0, 4).map((f) => <li key={f}>· {f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="learn">
        <h2 id="learn" className="font-serif text-2xl font-semibold">塔羅知識</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {[
            ["塔羅牌意思大全", "/tarot-card-meaning"],
            ["愚者牌意思", "/tarot/cards/the-fool"],
            ["戀人牌感情", "/tarot/cards/the-lovers"],
            ["死神牌是壞牌嗎", "/tarot/cards/death"],
            ["高塔牌意思", "/tarot/cards/the-tower"],
            ["逆位牌", "/blog/reversed-cards"],
            ["感情塔羅怎樣問", "/love-tarot"],
          ].map(([l, h]) => (
            <Link key={h} href={h} className="rounded-full border border-secondary/20 px-3.5 py-1.5 text-on-surface-variant hover:text-secondary hover:border-secondary/50">
              {l}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq">
        <h2 id="faq" className="font-serif text-2xl sm:text-3xl font-semibold text-center mb-8">常見問題</h2>
        <FaqList items={homeFaq} />
        <p className="mt-4 text-center text-sm">
          <Link href="/faq" className="text-secondary hover:underline">查看全部常見問題</Link>
        </p>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <HomeClient>
      <HomeSections />
    </HomeClient>
  );
}
