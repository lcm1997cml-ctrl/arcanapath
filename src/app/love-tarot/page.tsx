// /love-tarot — 感情塔羅 landing page (indexable, original content).
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ContentShell, FaqList, PageHeader, Panel, ReadingCta, Section, faqJsonLd } from "@/components/content/ContentShell";
import { jsonLd } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "感情塔羅占卜｜他喜歡我嗎・復合・我和他的未來（免費AI解讀）",
  description:
    "感情塔羅怎樣問？教你問「他喜歡我嗎」「我們會復合嗎」「我和他的未來」等愛情問題，並用三張牌（過去・現在・未來）免費進行 AI 感情塔羅占卜。",
  alternates: { canonical: "/love-tarot" },
};

const QUESTION_GROUPS: { title: string; examples: string[] }[] = [
  {
    title: "曖昧・他喜歡我嗎",
    examples: ["他對我有感覺嗎？", "這段曖昧會不會發展成戀愛？", "我應該主動表白嗎？"],
  },
  {
    title: "復合・前任",
    examples: ["我和前任還有復合的可能嗎？", "我放不下他，是因為什麼？", "他分手後心裡怎樣想？"],
  },
  {
    title: "穩定關係・未來",
    examples: ["我和他的未來會怎樣？", "我們之間最大的問題是什麼？", "這段關係值得繼續投入嗎？"],
  },
  {
    title: "單身・桃花",
    examples: ["我近期的桃花運如何？", "我為什麼總是遇到不適合的人？", "我理想的伴侶會是怎樣？"],
  },
];

const LOVE_FAQ = [
  {
    q: "感情塔羅準嗎？",
    a: "塔羅不能代替對方回答，但能幫你整理目前關係的狀態、你自己的感受與盲點。把它當作看清局面的工具，比把它當作判決更有用。",
  },
  {
    q: "同一個感情問題可以重複問嗎？",
    a: "建議不要短時間內重複問同一題。答案如果令你不安，更好的做法是換個角度問，例如「我可以怎樣做，令關係更好？」。",
  },
  {
    q: "可以問對方的想法嗎？",
    a: "可以，例如「他現在對我是什麼態度？」。但記得塔羅反映的是關係中的能量與趨勢，最終仍需要你們之間真實的溝通。",
  },
  {
    q: "哪些牌在感情中最正面？",
    a: "常見的正面感情牌包括戀人、太陽、星星、皇后與世界。不過牌的意思會受位置與正逆位影響，要整體來看。",
  },
];

export default function LoveTarotPage() {
  return (
    <ContentShell crumbs={[{ name: "感情塔羅", href: "/love-tarot" }]}>
      <PageHeader
        eyebrow="Love Tarot"
        title="感情塔羅占卜：他喜歡我嗎？我們會復合嗎？"
        intro={
          <p>
            感情是最多人問塔羅的主題。好的感情占卜，不是幫你猜對方，而是幫你看清：
            這段關係卡在哪裡、你真正想要什麼、下一步可以怎樣走。
          </p>
        }
      />

      <Section title="感情塔羅應該怎樣問？">
        <p>問題問得好，解讀才會有方向。三個原則：</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Panel><p className="font-semibold text-secondary">1. 以自己為主角</p><p className="mt-1 text-sm">「我可以怎樣面對？」比「他會不會改？」更有用。</p></Panel>
          <Panel><p className="font-semibold text-secondary">2. 具體一點</p><p className="mt-1 text-sm">寫清楚是誰、甚麼情況，例如「和前任分開三個月」。</p></Panel>
          <Panel><p className="font-semibold text-secondary">3. 一次一題</p><p className="mt-1 text-sm">把複雜的情況拆開，每次只問一個重點。</p></Panel>
        </div>
      </Section>

      <Section title="常見感情問題（點擊直接占卜）">
        <div className="grid gap-4 sm:grid-cols-2">
          {QUESTION_GROUPS.map((g) => (
            <Panel key={g.title}>
              <h3 className="font-semibold text-on-surface mb-2">{g.title}</h3>
              <ul className="space-y-1.5">
                {g.examples.map((q) => (
                  <li key={q}>
                    <Link
                      href={`/reading?topic=love&q=${encodeURIComponent(q)}`}
                      className="text-sm text-secondary hover:underline"
                    >
                      {q}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="三張牌如何解讀一段感情？">
        <p>ArcanaPath 的感情占卜使用「過去・現在・未來」三張牌陣：</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-on-surface">過去</strong>：這段關係如何走到今天，有甚麼舊傷或模式。</li>
          <li><strong className="text-on-surface">現在</strong>：你們此刻真正的拉扯，例如信任、距離或期望落差。</li>
          <li><strong className="text-on-surface">未來</strong>：維持現狀與作出改變，各自會走向哪裡。</li>
        </ul>
        <p>
          感情主題的 AI 解讀會特別關注：對方的真實態度、信任程度、關係中最核心的問題，
          以及你應該繼續投入、觀察、坦白溝通，還是放手。
        </p>
      </Section>

      <Section title="感情占卜中常見的牌">
        <p>
          想了解個別牌在感情中的意思，可以參考：
          <Link href="/tarot/cards/the-lovers" className="text-secondary hover:underline">戀人</Link>、
          <Link href="/tarot/cards/the-sun" className="text-secondary hover:underline">太陽</Link>、
          <Link href="/tarot/cards/the-star" className="text-secondary hover:underline">星星</Link>、
          <Link href="/tarot/cards/the-moon" className="text-secondary hover:underline">月亮</Link>、
          <Link href="/tarot/cards/the-devil" className="text-secondary hover:underline">惡魔</Link>、
          <Link href="/tarot/cards/the-tower" className="text-secondary hover:underline">高塔</Link>、
          <Link href="/tarot/cards/death" className="text-secondary hover:underline">死神</Link>，
          或查看 <Link href="/tarot-card-meaning" className="text-secondary hover:underline">全部塔羅牌意思</Link>。
        </p>
      </Section>

      <ReadingCta
        title="用三張牌看清你的感情"
        text="輸入你的感情問題，親手抽牌，AI 會針對你的關係狀況解讀。首次免費，無需註冊。"
        href="/reading?topic=love"
        label="免費感情塔羅占卜"
      />

      <Section title="感情塔羅常見問題">
        <FaqList items={LOVE_FAQ} />
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd(LOVE_FAQ)) }} />
    </ContentShell>
  );
}
