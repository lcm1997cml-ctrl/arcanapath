// /ai-tarot — explains AI tarot & how ArcanaPath differs from a chatbot.
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ContentShell, PageHeader, Panel, ReadingCta, Section } from "@/components/content/ContentShell";
import { TIER } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "AI塔羅是什麼？AI塔羅占卜和ChatGPT有什麼分別",
  description:
    "AI塔羅占卜如何運作？ArcanaPath 讓你親手抽牌（含正逆位），再按過去・現在・未來牌陣與你的問題，生成結構化 AI 塔羅解讀。了解它和直接問 ChatGPT 的分別、免費與完整解讀內容。",
  alternates: { canonical: "/ai-tarot" },
};

export default function AiTarotPage() {
  return (
    <ContentShell crumbs={[{ name: "AI塔羅", href: "/ai-tarot" }]}>
      <PageHeader
        eyebrow="AI Tarot"
        title="AI塔羅是什麼？"
        intro={
          <p>
            AI 塔羅 = 你親手抽的塔羅牌 + 為你的問題而寫的解讀。
            ArcanaPath 不是一般聊天機械人：牌面先決定方向，AI 再根據牌義、正逆位、牌陣位置與你的具體處境，
            給你一份有結構、可行動的解讀。
          </p>
        }
      />

      <Section title="ArcanaPath 如何運作？">
        <ol className="space-y-3">
          {[
            ["輸入問題", "選擇感情、事業、財運或人生主題，寫下你真正想問的事。"],
            ["親手抽三張牌", "從洗好的牌中選出三張，分別代表過去、現在、未來；每張隨機出現正位或逆位，同一次不會重複。"],
            ["AI 結合牌面解讀", "先給你直接結論，再逐張解釋它在該位置對你問題的意義，最後給出具體下一步。"],
            ["按需要深入", "免費結果已包含完整的三牌解讀；如需要，可解鎖深度心理分析、時間線與延伸問答。"],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-secondary/40 font-serif text-secondary">{i + 1}</span>
              <div><p className="font-semibold text-on-surface">{t}</p><p className="text-sm">{d}</p></div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="為什麼不直接問 ChatGPT？">
        <div className="overflow-x-auto rounded-2xl border border-secondary/15">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-surface-container text-left text-on-surface">
              <tr><th className="p-3 font-semibold"> </th><th className="p-3 font-semibold">一般 AI 聊天</th><th className="p-3 font-semibold text-secondary">ArcanaPath AI塔羅</th></tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {[
                ["解讀依據", "只有你的文字", "你抽出的三張牌 + 正逆位 + 牌位"],
                ["結構", "自由對話，視乎你怎樣問", "固定：結論 → 整體 → 逐張牌 → 下一步"],
                ["主題", "通用", "感情、事業、財運、人生各有不同分析重點"],
                ["語氣", "中立建議", "像塔羅師解牌，直接指出盲點"],
                ["保存與分享", "需自行整理", "每次結果有獨立連結，可下載三牌分享圖"],
              ].map(([k, a, b]) => (
                <tr key={k}><td className="p-3 text-on-surface">{k}</td><td className="p-3">{a}</td><td className="p-3 text-on-surface">{b}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="免費解讀與完整解讀">
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel>
            <p className="font-semibold text-on-surface">免費解讀</p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              <li>塔羅結論（直接回答你的問題）</li>
              <li>三張牌整體解讀</li>
              <li>過去・現在・未來逐張解讀</li>
              <li>具體下一步建議</li>
            </ul>
          </Panel>
          <Panel className="border-secondary/35">
            <p className="font-semibold text-secondary">完整解讀 · {TIER.single.priceStr} 起</p>
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              {TIER.single.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </Panel>
        </div>
        <p className="text-sm">
          另有 {TIER.triple.priceStr}（三次完整解讀）及 {TIER.deep.priceStr}（30 日無限次完整解讀）。
          <Link href="/paywall" className="text-secondary hover:underline">查看方案</Link>
        </p>
      </Section>

      <Section title="AI 塔羅的限制">
        <p>
          塔羅與 AI 都不能保證未來，也不能代替醫療、法律或財務等專業意見。
          ArcanaPath 的定位是幫你整理思緒、看見盲點、作出更清醒的選擇——最後的決定，永遠在你手上。
        </p>
      </Section>

      <ReadingCta />

      <p className="mt-8 text-center text-sm">
        想先了解牌義？<Link href="/tarot-card-meaning" className="text-secondary hover:underline">塔羅牌意思大全</Link> ·{" "}
        <Link href="/love-tarot" className="text-secondary hover:underline">感情塔羅</Link> ·{" "}
        <Link href="/faq" className="text-secondary hover:underline">常見問題</Link>
      </p>
    </ContentShell>
  );
}
