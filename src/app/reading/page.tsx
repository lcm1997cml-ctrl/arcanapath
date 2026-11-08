import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "免費AI塔羅占卜｜輸入問題・親手抽三張牌",
  description: "輸入你的感情、事業、財運或人生問題，親手抽三張塔羅牌（過去・現在・未來），即時獲得 AI 塔羅解讀。首次免費，無需註冊。",
  alternates: { canonical: "/reading" },
};
import ReadingClientPage from "./ReadingClientPage";

export default function ReadingPage() {
  return <ReadingClientPage />;
}
