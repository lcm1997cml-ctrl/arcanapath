"use client";
// src/app/blog/page.tsx — 神諭博客
// Matches the_oracle_blog_arcanapath Stitch export

import React, { useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

// ─── Static blog articles ─────────────────────────────────────
const ARTICLES = [
  {
    id: "lovers-tarot",
    category: "塔羅基礎",
    readTime: "8 分鐘閱讀",
    title: "理解塔羅「戀人」牌喺愛情占卜中嘅意義",
    excerpt:
      "「戀人」牌經常被誤解為簡單嘅浪漫象徵，但其根源實際上深入到選擇、契合度同內在和諧嘅架構中。探索點樣喺唔同語境下解讀呢張強大嘅大阿爾克那。",
    date: "2024年5月18日",
    featured: true,
    gradient: "from-[#1a0a2e] via-[#0f141b] to-[#0a1520]",
  },
  {
    id: "reversed-cards",
    category: "情緒成長",
    readTime: "5 分鐘閱讀",
    title: "逆位牌隱藏嘅力量",
    excerpt:
      "點解抽到逆位牌唔係壞兆頭，而係需要內在反思同能量轉換嘅提醒。",
    date: "2024年5月14日",
    featured: false,
    gradient: "from-[#0a1520] to-[#131920]",
  },
  {
    id: "mercury-retrograde",
    category: "占星術",
    readTime: "6 分鐘閱讀",
    title: "水逆期間：靈魂避風港指南",
    excerpt:
      "利用我哋嘅宇宙生存策略，以優雅同戰術性嘅沉默嚟應對溝通混亂。",
    date: "2024年5月10日",
    featured: false,
    gradient: "from-[#0f0a20] to-[#131920]",
  },
  {
    id: "crystals-daily",
    category: "儀式與手作",
    readTime: "4 分鐘閱讀",
    title: "每日顯化嘅水晶選用",
    excerpt:
      "點樣將特定寶石同你嘅晨間塔羅牌結合，以增強你嘅意圖並保護你嘅氣場。",
    date: "2024年5月5日",
    featured: false,
    gradient: "from-[#0f1a14] to-[#131920]",
  },
  {
    id: "shadow-work",
    category: "情緒成長",
    readTime: "7 分鐘閱讀",
    title: "陰影工作：月亮嘅映射",
    excerpt:
      "解開隱藏喺黑暗中嘅自己。心理同靈魂整合嘅實用指南。",
    date: "2024年4月28日",
    featured: false,
    gradient: "from-[#0a0f20] to-[#131920]",
  },
];

const CATEGORIES = ["所有見解", "塔羅基礎", "占星術", "情緒成長", "儀式與手作"];

// ─── Article card (small) ─────────────────────────────────────
function SmallArticleCard({ article }: { article: typeof ARTICLES[0] }) {
  return (
    <article className="glass-card gold-shimmer rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1">
      {/* Decorative gradient image area */}
      <div
        className="tarot-aspect relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${article.gradient.replace("from-", "").replace(/\s.*/, "")} 0%, #131920 100%)`,
          aspectRatio: "16 / 9",
        }}
      >
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 30% 40%, rgba(209,188,255,0.12) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 64, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <span className="font-sans text-xs mb-2" style={{ color: "#e9c349" }}>
          {article.category}
        </span>
        <h3
          className="font-serif text-xl font-semibold mb-3 leading-snug"
          style={{ color: "#e8e8e8" }}
        >
          {article.title}
        </h3>
        <p className="font-sans text-sm mb-6 line-clamp-2" style={{ color: "#9aabb8" }}>
          {article.excerpt}
        </p>
        <div
          className="mt-auto pt-4 flex justify-between items-center"
          style={{ borderTop: "1px solid rgba(233,195,73,0.1)" }}
        >
          <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.6)" }}>
            {article.date}
          </span>
          <Link
            href={`/blog/${article.id}`}
            className="font-sans text-xs font-semibold transition-colors hover:text-yellow-300"
            style={{ color: "#e9c349" }}
          >
            閱讀更多
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("所有見解");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const featured = ARTICLES.find((a) => a.featured)!;
  const others = ARTICLES.filter((a) => !a.featured);

  const filteredOthers = others.filter((a) => {
    const matchCat = activeCategory === "所有見解" || a.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      a.title.includes(searchQuery) ||
      a.excerpt.includes(searchQuery) ||
      a.category.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterMsg("已訂閱！宇宙預報即將送達 ✦");
    setNewsletterEmail("");
    setTimeout(() => setNewsletterMsg(""), 4000);
  };

  return (
    <div className="min-h-screen cosmic-bg text-white">
      {/* ── Fixed ambient glow ──────────────────────────────── */}
      <div
        className="pointer-events-none fixed top-0 left-1/3"
        style={{
          width: 500,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(109,91,151,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      <TopNav />
      <SideNav />

      <div className="lg:pl-64 pt-20">
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-16">

          {/* ── Hero ───────────────────────────────────────── */}
          <section className="text-center space-y-6 animate-fade-in">
            <h1
              className="font-serif text-4xl md:text-5xl font-semibold"
              style={{ color: "#e8e8e8" }}
            >
              神諭博客
            </h1>
            <p
              className="font-sans text-base leading-relaxed max-w-2xl mx-auto"
              style={{ color: "#9aabb8" }}
            >
              透過我哋精心挑選嘅塔羅、占星同靈魂進化見解，加深你同神聖力量嘅連結。
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto group">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(233,195,73,0.5)", fontSize: 20 }}
              >
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋文章…"
                className="w-full pl-11 pr-4 py-3 rounded-xl font-sans text-sm focus:outline-none transition-all"
                style={{
                  background: "rgba(19,25,32,0.8)",
                  border: "1px solid rgba(233,195,73,0.15)",
                  color: "#e8e8e8",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(233,195,73,0.4)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(233,195,73,0.15)";
                }}
              />
            </div>
          </section>

          {/* ── Category pills ─────────────────────────────── */}
          <section className="overflow-x-auto no-scrollbar">
            <div className="flex gap-3 min-w-max pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-5 py-2 rounded-full font-sans text-sm font-semibold transition-all"
                  style={{
                    background:
                      activeCategory === cat
                        ? "rgba(233,195,73,0.12)"
                        : "rgba(19,25,32,0.6)",
                    border:
                      activeCategory === cat
                        ? "1px solid rgba(233,195,73,0.4)"
                        : "1px solid rgba(233,195,73,0.08)",
                    color: activeCategory === cat ? "#e9c349" : "#9aabb8",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* ── Article grid ───────────────────────────────── */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Featured article — spans 2 columns */}
            {(activeCategory === "所有見解" || activeCategory === featured.category) &&
              !searchQuery && (
              <article
                className="lg:col-span-2 relative group overflow-hidden glass-card rounded-xl gold-shimmer transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row min-h-[280px]">
                  {/* Decorative image panel */}
                  <div
                    className="md:w-2/5 h-48 md:h-full overflow-hidden relative flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(145deg, #1a0a2e 0%, #0f141b 60%, #0a1520 100%)",
                      minHeight: 220,
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 30% 40%, rgba(209,188,255,0.15) 0%, transparent 65%)",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center"
                        style={{
                          background: "rgba(233,195,73,0.08)",
                          border: "1px solid rgba(233,195,73,0.2)",
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: 44,
                            color: "#e9c349",
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          favorite
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 flex flex-col justify-center">
                    <span className="font-sans text-xs font-semibold mb-2" style={{ color: "#e9c349" }}>
                      {featured.category} • {featured.readTime}
                    </span>
                    <h2
                      className="font-serif text-2xl md:text-3xl font-semibold mb-4 leading-snug"
                      style={{ color: "#e8e8e8" }}
                    >
                      {featured.title}
                    </h2>
                    <p className="font-sans text-sm leading-relaxed mb-6 line-clamp-3" style={{ color: "#9aabb8" }}>
                      {featured.excerpt}
                    </p>
                    <Link
                      href={`/blog/${featured.id}`}
                      className="inline-flex items-center gap-2 font-sans text-sm font-semibold transition-all group/link"
                      style={{ color: "#e9c349" }}
                    >
                      開始探索之旅
                      <span
                        className="material-symbols-outlined transition-transform group-hover/link:translate-x-1"
                        style={{ fontSize: 18 }}
                      >
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* Regular articles */}
            {filteredOthers.map((article) => (
              <SmallArticleCard key={article.id} article={article} />
            ))}

            {filteredOthers.length === 0 && (
              <div
                className="col-span-full text-center py-16 font-sans text-sm"
                style={{ color: "#9aabb8" }}
              >
                沒有符合條件嘅文章
              </div>
            )}
          </section>

          {/* ── Newsletter ─────────────────────────────────── */}
          <section
            className="relative rounded-2xl p-10 md:p-14 text-center overflow-hidden"
            style={{
              background: "rgba(19,25,32,0.8)",
              border: "1.5px solid rgba(233,195,73,0.15)",
            }}
          >
            {/* Glow blobs */}
            <div
              className="absolute -top-20 -right-20 rounded-full pointer-events-none"
              style={{
                width: 240,
                height: 240,
                background: "rgba(209,188,255,0.06)",
                filter: "blur(80px)",
              }}
            />

            <div className="relative z-10 space-y-5 max-w-lg mx-auto">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 40, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
              >
                mail
              </span>
              <h2 className="font-serif text-2xl font-semibold" style={{ color: "#e8e8e8" }}>
                神諭見解訂閱
              </h2>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>
                喺你嘅專屬空間入面，每星期接收宇宙預報同深度塔羅智慧。
              </p>

              <form
                onSubmit={handleNewsletter}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="flex-1 font-sans text-sm px-4 py-3 rounded-xl focus:outline-none transition-all"
                  style={{
                    background: "rgba(9,15,21,0.8)",
                    border: "1px solid rgba(233,195,73,0.2)",
                    color: "#e8e8e8",
                  }}
                />
                <button
                  type="submit"
                  className="font-sans text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
                    color: "#0f141b",
                  }}
                >
                  立即訂閱
                </button>
              </form>

              {newsletterMsg && (
                <p className="font-sans text-sm" style={{ color: "#e9c349" }}>
                  {newsletterMsg}
                </p>
              )}
            </div>
          </section>

        </main>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer
          className="px-4 md:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ borderTop: "1px solid rgba(233,195,73,0.08)" }}
        >
          <div className="flex flex-col items-center md:items-start gap-1">
            <span
              className="font-serif text-lg font-semibold"
              style={{ color: "#e9c349" }}
            >
              ArcanaPath
            </span>
            <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.5)" }}>
              © 2024 ArcanaPath. 星辰指引。
            </p>
          </div>

          <div className="flex gap-6">
            {[
              { label: "神諭博客", href: "/blog", active: true },
              { label: "靈魂隱私", href: "/privacy" },
              { label: "神秘條款", href: "/terms" },
            ].map(({ label, href, active }) => (
              <Link
                key={href}
                href={href}
                className="font-sans text-xs transition-colors hover:text-yellow-300"
                style={{ color: active ? "#e9c349" : "rgba(154,171,184,0.55)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex gap-4">
            {["public", "auto_awesome", "history_edu"].map((icon) => (
              <span
                key={icon}
                className="material-symbols-outlined cursor-pointer transition-colors hover:text-yellow-300"
                style={{ fontSize: 20, color: "rgba(154,171,184,0.5)" }}
              >
                {icon}
              </span>
            ))}
          </div>
        </footer>
      </div>{/* end lg:pl-64 pt-20 */}
    </div>
  );
}
