"use client";
// src/app/support/page.tsx — 支援 / FAQ

import React, { useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

const FAQS = [
  {
    category: "占卜",
    icon: "auto_awesome",
    questions: [
      {
        q: "免費占卜次數用完後怎麼辦？",
        a: "你可以留下電郵地址獲取額外免費次數，或購買任一付費方案即可繼續使用。付費解鎖後永久有效。",
      },
      {
        q: "塔羅占卜的結果準確嗎？",
        a: "ArcanaPath 使用 AI 結合傳統塔羅詮釋系統，提供深度的象徵性洞察。塔羅係一種自我反思工具，而非預言。最終決定權永遠在你手中。",
      },
      {
        q: "每日可以占卜多少次？",
        a: "免費用戶每日可進行 1 次占卜。留下電郵可額外獲得 2 次。付費方案 HK$88 可享 30 日無限占卜。",
      },
      {
        q: "占卜結果會保存多久？",
        a: "免費用戶的占卜結果會保存 7 日，付費用戶可永久保存。你也可以分享連結或下載圖片來永久留存。",
      },
    ],
  },
  {
    category: "付款",
    icon: "payments",
    questions: [
      {
        q: "支持哪些付款方式？",
        a: "我們透過 Stripe 處理所有付款，支持信用卡、Visa、Mastercard、Apple Pay 及 Google Pay。",
      },
      {
        q: "付款後如何使用？",
        a: "付款完成後，系統會自動解鎖你的占卜結果。如果在新設備上，可使用「恢復使用權限」功能輸入購買電郵來同步。",
      },
      {
        q: "可以退款嗎？",
        a: "由於占卜內容在購買後即時解鎖，原則上不提供退款。如遇技術問題導致未能使用，請聯絡我們處理。",
      },
    ],
  },
  {
    category: "技術",
    icon: "build",
    questions: [
      {
        q: "為什麼我的免費次數沒有更新？",
        a: "免費次數與你的設備 Cookie 綁定。清除 Cookie 或換設備會重置計數。如有問題，可使用電郵恢復功能同步你的帳戶。",
      },
      {
        q: "分享圖片無法生成怎麼辦？",
        a: "分享圖片需要稍等片刻生成。如持續失敗，請嘗試重新整理頁面或使用不同瀏覽器。",
      },
      {
        q: "在手機上使用有問題嗎？",
        a: "ArcanaPath 完全支持手機瀏覽器。如遇顯示問題，請確保使用最新版本的 Safari 或 Chrome。",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ border: "1px solid rgba(233,195,73,0.08)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left transition-all"
        style={{ background: open ? "rgba(233,195,73,0.05)" : "rgba(19,25,32,0.6)" }}
      >
        <span className="font-sans text-sm font-medium" style={{ color: "#e8e8e8" }}>{q}</span>
        <span
          className="material-symbols-outlined flex-shrink-0 transition-transform duration-300"
          style={{ fontSize: 20, color: "#e9c349", transform: open ? "rotate(180deg)" : "none" }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div
          className="px-5 pb-4 pt-1 font-sans text-sm leading-relaxed"
          style={{ color: "#9aabb8", background: "rgba(9,15,21,0.4)" }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  const [contactMsg, setContactMsg] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMsg.trim()) return;
    setSent(true);
    setContactEmail("");
    setContactMsg("");
  };

  return (
    <div className="min-h-screen cosmic-bg text-white">
      <TopNav />
      <SideNav />

      <div className="lg:pl-64 pt-20">
        <main className="max-w-2xl mx-auto px-4 md:px-8 py-12 space-y-12">

          {/* Header */}
          <section className="text-center space-y-3 animate-fade-in">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 40, color: "#e9c349", fontVariationSettings: "'FILL' 1", display: "block" }}
            >
              help
            </span>
            <h1 className="font-serif text-3xl font-semibold" style={{ color: "#e8e8e8" }}>支援中心</h1>
            <p className="font-sans text-sm" style={{ color: "#9aabb8" }}>
              在這裡找到你所有問題的答案，或聯絡我們的神諭團隊。
            </p>
          </section>

          {/* Quick links */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "auto_awesome", label: "開始占卜", href: "/reading" },
              { icon: "payments", label: "查看方案", href: "/paywall" },
              { icon: "restore", label: "恢復權限", href: "/paywall" },
            ].map(({ icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.1)" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <span className="font-sans text-xs font-medium text-center" style={{ color: "#9aabb8" }}>{label}</span>
              </Link>
            ))}
          </div>

          {/* FAQs */}
          {FAQS.map((section) => (
            <section key={section.category} className="space-y-3">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}>{section.icon}</span>
                <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>{section.category}</h2>
              </div>
              <div className="space-y-2">
                {section.questions.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>
          ))}

          {/* Contact form */}
          <section
            className="rounded-2xl p-8 space-y-5"
            style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.12)" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}>mail</span>
              <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>聯絡神諭團隊</h2>
            </div>

            {sent ? (
              <div
                className="py-8 text-center space-y-2"
                style={{ color: "#e9c349" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="font-serif text-base">訊息已送出！</p>
                <p className="font-sans text-sm" style={{ color: "#9aabb8" }}>我們會在 1–2 個工作日內回覆你。</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <div>
                  <label className="font-sans text-xs mb-1.5 block" style={{ color: "rgba(154,171,184,0.7)" }}>電郵地址</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full font-sans text-sm px-4 py-3 rounded-xl focus:outline-none transition-all"
                    style={{ background: "rgba(9,15,21,0.8)", border: "1px solid rgba(233,195,73,0.15)", color: "#e8e8e8" }}
                  />
                </div>
                <div>
                  <label className="font-sans text-xs mb-1.5 block" style={{ color: "rgba(154,171,184,0.7)" }}>訊息內容</label>
                  <textarea
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="請描述你遇到的問題或提問…"
                    rows={4}
                    required
                    className="w-full font-sans text-sm px-4 py-3 rounded-xl resize-none focus:outline-none transition-all"
                    style={{ background: "rgba(9,15,21,0.8)", border: "1px solid rgba(233,195,73,0.15)", color: "#e8e8e8" }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-sans text-sm font-semibold transition-all hover:brightness-110 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)", color: "#0f141b" }}
                >
                  送出訊息
                </button>
              </form>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
