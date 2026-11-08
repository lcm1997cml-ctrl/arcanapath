import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "完整塔羅解讀方案｜HK$19 起",
  description: "解鎖完整 AI 塔羅深度報告：深度心理拆解、局勢真相、行動建議、時間線與延伸問答。HK$19 單次、HK$39 三次、HK$88 30 日無限。",
  alternates: { canonical: "/paywall" },
};

import PaywallClientPage from "./PaywallClientPage";

export default function PaywallPage() {
  return <PaywallClientPage />;
}
