import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "塔羅牌陣介紹｜三張牌、感情牌陣與常用牌陣",
  description: "了解常用塔羅牌陣：三張牌（過去・現在・未來）、感情牌陣等，並開始你的 AI 塔羅占卜。",
  alternates: { canonical: "/spreads" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
