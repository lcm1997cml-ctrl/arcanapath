// /tarot/cards/[slug] — individual tarot card meaning (static, indexable).
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CARD_CONTENT, getCardContentBySlug } from "@/lib/tarot/cardContent";
import { getCardById, getCardImagePath } from "@/lib/tarot/utils";
import { ContentShell, FaqList, Panel, ReadingCta, Section, faqJsonLd } from "@/components/content/ContentShell";
import { absoluteUrl, jsonLd } from "@/lib/seo/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return CARD_CONTENT.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = getCardContentBySlug(slug);
  const card = content ? getCardById(content.id) : undefined;
  if (!content || !card) return {};
  const title = `${card.name_zh}牌意思｜正逆位・感情・Yes or No｜${card.name}`;
  const description = `${card.name_zh}（${card.name}）塔羅牌意思：${content.essence}。完整解說正位、逆位、感情、事業、財運、未來與 Yes/No 答案。`;
  return {
    title: { absolute: `${title}｜ArcanaPath` },
    description,
    alternates: { canonical: `/tarot/cards/${slug}` },
    openGraph: {
      title: `${card.name_zh}塔羅牌意思｜ArcanaPath`,
      description,
      url: `/tarot/cards/${slug}`,
      type: "article",
      images: [{ url: getCardImagePath(card.image), alt: `${card.name_zh}塔羅牌` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${card.name_zh}塔羅牌意思｜ArcanaPath`,
      description,
      images: [getCardImagePath(card.image)],
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params;
  const content = getCardContentBySlug(slug);
  const card = content ? getCardById(content.id) : undefined;
  if (!content || !card) notFound();

  const idx = CARD_CONTENT.findIndex((c) => c.slug === slug);
  const prev = CARD_CONTENT[(idx - 1 + CARD_CONTENT.length) % CARD_CONTENT.length];
  const next = CARD_CONTENT[(idx + 1) % CARD_CONTENT.length];
  const prevCard = getCardById(prev.id)!;
  const nextCard = getCardById(next.id)!;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${card.name_zh}塔羅牌意思`,
    description: content.essence,
    image: absoluteUrl(getCardImagePath(card.image)),
    inLanguage: "zh-HK",
    author: { "@type": "Organization", name: "ArcanaPath" },
    publisher: { "@type": "Organization", name: "ArcanaPath" },
    mainEntityOfPage: absoluteUrl(`/tarot/cards/${slug}`),
  };

  return (
    <ContentShell
      crumbs={[
        { name: "塔羅牌意思", href: "/tarot-card-meaning" },
        { name: `${card.name_zh}`, href: `/tarot/cards/${slug}` },
      ]}
    >
      <header className="pt-8 pb-2 grid grid-cols-[96px_1fr] sm:grid-cols-[140px_1fr] gap-5 items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getCardImagePath(card.image)}
          alt={`${card.name_zh}（${card.name}）塔羅牌正位`}
          width={140}
          height={243}
          fetchPriority="high"
          className="w-full h-auto rounded-lg border border-secondary/30 shadow-lg"
        />
        <div>
          <p className="text-xs tracking-[0.18em] uppercase text-secondary/80">
            大阿爾克那 · {card.number} · {card.name}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold leading-tight">
            {card.name_zh}牌意思
          </h1>
          <p className="mt-3 text-on-surface-variant leading-relaxed">{content.essence}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {card.keywords.map((k) => (
              <span key={k} className="rounded-full border border-secondary/20 px-2.5 py-0.5 text-xs text-secondary/90">{k}</span>
            ))}
          </div>
        </div>
      </header>

      <Section title={`${card.name_zh}正位意思`}>
        <p>{content.upright}</p>
      </Section>
      <Section title={`${card.name_zh}逆位意思`}>
        <p>{content.reversed}</p>
        <p className="text-sm">逆位關鍵詞：{card.keywords_reversed.join("、")}</p>
      </Section>

      <Section title={`${card.name_zh}在感情中的意思`}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel><p className="text-sm font-semibold text-secondary mb-1.5">正位 · 感情</p><p>{content.love.upright}</p></Panel>
          <Panel><p className="text-sm font-semibold text-tertiary mb-1.5">逆位 · 感情</p><p>{content.love.reversed}</p></Panel>
        </div>
      </Section>

      <Section title="事業與工作">
        <p>{content.career}</p>
      </Section>
      <Section title="財運">
        <p>{content.money}</p>
      </Section>
      <Section title="未來走向">
        <p>{content.future}</p>
      </Section>

      <Section title={`${card.name_zh} Yes or No？`}>
        <Panel>
          <p className="font-serif text-2xl text-secondary">{content.yesNo.answer}</p>
          <p className="mt-1.5">{content.yesNo.why}</p>
        </Panel>
      </Section>

      <Section title="給你的建議">
        <p>{content.advice}</p>
        <p className="text-sm">
          牌義只是起點：同一張牌出現在「過去」、「現在」或「未來」位置，配合不同問題，意思會有很大分別。
          想知道{card.name_zh}對<strong className="text-on-surface">你的問題</strong>代表什麼，最好親自抽一次牌。
        </p>
      </Section>

      <ReadingCta
        title={`想知道${card.name_zh}對你的問題代表什麼？`}
        text="輸入你的感情、工作或人生問題，親手抽三張牌，AI 會結合牌位與正逆位為你解讀。首次免費。"
      />

      <Section title="常見問題">
        <FaqList items={content.faq} />
      </Section>

      <nav aria-label="其他塔羅牌" className="mt-12 grid grid-cols-2 gap-3 text-sm">
        <Link href={`/tarot/cards/${prev.slug}`} className="rounded-xl border border-secondary/15 p-4 hover:border-secondary/40">
          <span className="text-on-surface-variant/70">← 上一張</span>
          <span className="block mt-1 text-on-surface">{prevCard.name_zh}</span>
        </Link>
        <Link href={`/tarot/cards/${next.slug}`} className="rounded-xl border border-secondary/15 p-4 text-right hover:border-secondary/40">
          <span className="text-on-surface-variant/70">下一張 →</span>
          <span className="block mt-1 text-on-surface">{nextCard.name_zh}</span>
        </Link>
      </nav>
      <p className="mt-6 text-center text-sm">
        <Link href="/tarot-card-meaning" className="text-secondary hover:underline">查看全部塔羅牌意思</Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd(content.faq)) }} />
    </ContentShell>
  );
}
