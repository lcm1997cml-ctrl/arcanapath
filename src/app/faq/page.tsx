// /faq — site FAQ with FAQPage structured data.
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ContentShell, FaqList, PageHeader, ReadingCta, faqJsonLd } from "@/components/content/ContentShell";
import { SITE_FAQ } from "@/lib/seo/faq";
import { jsonLd } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "塔羅占卜常見問題｜塔羅牌準嗎？AI塔羅是什麼？",
  description:
    "塔羅牌準嗎？AI塔羅和 ChatGPT 有什麼分別？感情塔羅怎樣問、可以問前任嗎、免費和完整解讀有何不同？ArcanaPath 塔羅占卜常見問題解答。",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <ContentShell crumbs={[{ name: "常見問題", href: "/faq" }]}>
      <PageHeader
        eyebrow="FAQ"
        title="塔羅占卜常見問題"
        intro={<p>關於塔羅、AI 塔羅解讀、提問方法與付費方案的常見疑問。</p>}
      />
      <FaqList items={SITE_FAQ} />
      <p className="mt-6 text-sm text-on-surface-variant">
        仍有疑問？可到 <Link href="/support" className="text-secondary hover:underline">支援頁面</Link> 聯絡我們。
      </p>
      <ReadingCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd(SITE_FAQ)) }} />
    </ContentShell>
  );
}
