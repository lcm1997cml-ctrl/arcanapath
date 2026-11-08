// /tarot-card-meaning — hub for all card meaning pages.
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { CARD_CONTENT } from "@/lib/tarot/cardContent";
import { getCardById } from "@/lib/tarot/utils";
import { ContentShell, PageHeader, Panel, ReadingCta, Section } from "@/components/content/ContentShell";

export const metadata: Metadata = {
  title: "塔羅牌意思大全｜22張大阿爾克那正位逆位・感情事業解讀",
  description:
    "塔羅牌意思一覽：愚者、魔術師、戀人、死神、星星等 22 張大阿爾克那牌的正位、逆位、感情、事業、財運與 Yes/No 解讀，並教你如何看正逆位與三張牌陣。",
  alternates: { canonical: "/tarot-card-meaning" },
};

export default function TarotCardMeaningHub() {
  return (
    <ContentShell crumbs={[{ name: "塔羅牌意思", href: "/tarot-card-meaning" }]}>
      <PageHeader
        eyebrow="Tarot Card Meanings"
        title="塔羅牌意思大全"
        intro={
          <p>
            一副塔羅牌有 78 張，其中 22 張「大阿爾克那」代表人生重要課題與轉折。
            以下整理每張大牌的正位、逆位、感情、事業與 Yes/No 意思。ArcanaPath 的 AI 占卜目前亦使用這 22 張大牌抽牌。
          </p>
        }
      />

      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
        {CARD_CONTENT.map((c) => {
          const card = getCardById(c.id)!;
          return (
            <li key={c.slug}>
              <Link
                href={`/tarot/cards/${c.slug}`}
                className="group block rounded-xl border border-secondary/10 bg-surface-container-low/60 p-2 transition hover:border-secondary/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/cards/thumbs/${card.image}`}
                  alt={`${card.name_zh}塔羅牌`}
                  width={120}
                  height={208}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto aspect-[120/208] rounded-md bg-surface-container object-cover"
                />
                <span className="mt-2 block text-center text-sm text-on-surface group-hover:text-secondary">
                  {card.name_zh}
                </span>
                <span className="block text-center text-[11px] text-on-surface-variant/60">{card.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <Section title="正位和逆位有什麼分別？">
        <p>
          正位代表牌的能量順暢表達；逆位（牌面倒轉）通常代表能量受阻、過度、延遲或需要向內反思。
          逆位不等於壞事——例如「惡魔」逆位反而代表擺脫束縛。
        </p>
      </Section>

      <Section title="三張牌陣：過去・現在・未來">
        <div className="grid gap-3 sm:grid-cols-3">
          <Panel><p className="font-semibold text-secondary">過去</p><p className="mt-1 text-sm">形成目前局面的原因與舊模式。</p></Panel>
          <Panel><p className="font-semibold text-secondary">現在</p><p className="mt-1 text-sm">你此刻最核心的處境與拉扯。</p></Panel>
          <Panel><p className="font-semibold text-secondary">未來</p><p className="mt-1 text-sm">按目前狀態發展的趨勢，並非定局。</p></Panel>
        </div>
        <p>
          同一張牌在不同位置，意思會改變。這也是為什麼看單張牌義只是起點，
          結合你的問題和牌位一起看，才是真正的塔羅解讀。
        </p>
      </Section>

      <Section title="延伸閱讀">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><Link className="text-secondary hover:underline" href="/love-tarot">感情塔羅：怎樣問他喜歡我嗎、復合與未來</Link></li>
          <li><Link className="text-secondary hover:underline" href="/ai-tarot">AI塔羅是什麼？和 ChatGPT 有什麼分別</Link></li>
          <li><Link className="text-secondary hover:underline" href="/blog/reversed-cards">逆位牌隱藏嘅力量</Link></li>
          <li><Link className="text-secondary hover:underline" href="/faq">塔羅占卜常見問題</Link></li>
        </ul>
      </Section>

      <ReadingCta />
    </ContentShell>
  );
}
