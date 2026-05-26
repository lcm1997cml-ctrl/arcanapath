// src/app/privacy/page.tsx — 隱私政策 (server component)
import Link from "next/link";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

const SECTIONS = [
  {
    title: "我們收集的資料",
    body: "當你使用 ArcanaPath 時，我們僅收集使用服務所必需的最少量資料：你輸入的占卜問題、選取的主題分類，以及你的瀏覽器生成的匿名訪客識別符（存儲於 Cookie）。如果你選擇提供電郵地址，我們會將其用於發送獎勵次數或恢復你的使用權限。",
  },
  {
    title: "我們如何使用資料",
    body: "你的問題與占卜結果用於生成 AI 解讀，並存儲以便你日後查閱。我們不會將你的個人問題或占卜內容用於廣告目的，亦不會出售你的資料給任何第三方。你的靈性旅程屬於你自己。",
  },
  {
    title: "Cookie 政策",
    body: "我們使用 Cookie 來識別你的設備以追蹤免費使用次數，以及儲存你的偏好設定。這些 Cookie 不包含任何個人識別資訊。你可以隨時在瀏覽器設定中清除 Cookie，但這將重置你的免費使用次數。",
  },
  {
    title: "資料安全",
    body: "所有資料透過 SSL 加密傳輸。付款資訊由 Stripe 全程處理，我們的伺服器不儲存任何信用卡資料。我們的伺服器基礎設施由 Vercel 與 Supabase 提供，均符合業界最高安全標準。",
  },
  {
    title: "你的權利",
    body: "你有權要求查閱、更正或刪除我們持有的關於你的任何資料。如需行使這些權利，請透過支援頁面聯絡我們，我們將在 30 日內回應你的請求。",
  },
  {
    title: "聯絡我們",
    body: "如果你對我們的隱私實踐有任何疑問，請透過支援頁面聯絡我們的團隊。我們致力於以最崇高的尊重態度對待你的靈性旅程和個人資料。",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen cosmic-bg text-white">
      <TopNav />
      <SideNav />

      <div className="lg:pl-64 pt-20">
        <main className="max-w-2xl mx-auto px-4 md:px-8 py-12">

          {/* Header */}
          <div className="mb-10 space-y-3">
            <span
              className="font-sans text-xs uppercase tracking-widest"
              style={{ color: "rgba(233,195,73,0.6)", letterSpacing: "0.2em" }}
            >
              法律文件
            </span>
            <h1 className="font-serif text-3xl font-semibold" style={{ color: "#e8e8e8" }}>隱私政策</h1>
            <p className="font-sans text-sm" style={{ color: "#9aabb8" }}>
              最後更新：2024 年 5 月 1 日
            </p>
            <div className="divider-gold" />
          </div>

          {/* Intro */}
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.1)" }}
          >
            <p className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>
              ArcanaPath 致力於保護你的隱私。本政策解釋我們如何收集、使用和保護你使用我們服務時提供的資料。
              我們相信你的靈性旅程是神聖的，你的資料同樣如此。
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {SECTIONS.map((s, i) => (
              <section key={s.title}>
                <h2 className="font-serif text-lg font-semibold mb-3" style={{ color: "#e8e8e8" }}>
                  {i + 1}. {s.title}
                </h2>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>{s.body}</p>
                {i < SECTIONS.length - 1 && <div className="divider-gold mt-6" />}
              </section>
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-12 flex gap-6">
            <Link href="/terms" className="font-sans text-sm transition-colors hover:text-yellow-300" style={{ color: "#e9c349" }}>
              服務條款 →
            </Link>
            <Link href="/support" className="font-sans text-sm transition-colors hover:text-yellow-300" style={{ color: "rgba(154,171,184,0.6)" }}>
              聯絡我們
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
