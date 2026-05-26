// src/app/terms/page.tsx — 服務條款
import Link from "next/link";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

const SECTIONS = [
  {
    title: "服務性質",
    body: "ArcanaPath 提供基於人工智能的塔羅占卜解讀服務，旨在作為自我反思和靈性探索的工具。本服務不提供醫療、法律、財務或其他專業建議。占卜結果僅供參考，不應作為重大決策的唯一依據。",
  },
  {
    title: "使用條件",
    body: "使用本服務即表示你年滿 18 歲（或在父母/監護人監督下使用），你不會將服務用於任何非法目的，且你理解占卜結果的象徵性和娛樂性質。我們保留在任何時候以任何原因拒絕或終止服務的權利。",
  },
  {
    title: "付款與退款",
    body: "所有付款透過 Stripe 安全處理。購買後即時解鎖的數位內容原則上不提供退款。如遇技術問題導致服務無法正常使用，請聯絡我們尋求協助。",
  },
  {
    title: "知識產權",
    body: "ArcanaPath 平台上的所有內容，包括 AI 生成的解讀文字、設計元素和品牌標識，均受版權法保護。你獲得個人和非商業用途的使用許可，但不得複製、修改或分發平台內容。",
  },
  {
    title: "免責聲明",
    body: "本服務按「現狀」提供，不作任何形式的保證。ArcanaPath 不保證服務的持續可用性，亦不對因使用或無法使用本服務而造成的任何損失承擔責任。塔羅解讀結果的準確性或適用性不在我們的保證範圍內。",
  },
  {
    title: "條款更新",
    body: "我們可能會不時更新本條款。重大變更將通過平台通知告知用戶。繼續使用本服務即表示你接受更新後的條款。如不同意新條款，請停止使用本服務。",
  },
];

export default function TermsPage() {
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
            <h1 className="font-serif text-3xl font-semibold" style={{ color: "#e8e8e8" }}>服務條款</h1>
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
              歡迎使用 ArcanaPath。使用本平台即表示你同意以下條款和條件。
              請在使用前仔細閱讀，你的靈性旅程值得清晰的指引。
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
            <Link href="/privacy" className="font-sans text-sm transition-colors hover:text-yellow-300" style={{ color: "#e9c349" }}>
              隱私政策 →
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
