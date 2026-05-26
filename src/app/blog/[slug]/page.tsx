// src/app/blog/[slug]/page.tsx — 動態博客文章頁
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getBlogArticle, getRelatedArticles, BLOG_ARTICLES } from "@/lib/blog-content";
import type { BlogSection } from "@/lib/blog-content";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return { title: "文章不存在 | ArcanaPath" };
  return {
    title: `${article.title} | ArcanaPath 神諭博客`,
    description: article.excerpt,
  };
}

// ─── Section renderers ────────────────────────────────────────
function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "heading":
      return (
        <h2
          className="font-serif text-xl font-semibold mt-10 mb-4"
          style={{ color: "#e8e8e8" }}
        >
          {section.content}
        </h2>
      );

    case "paragraph":
      return (
        <p
          className="font-sans text-sm leading-relaxed mb-5"
          style={{ color: "#9aabb8", lineHeight: "1.9" }}
        >
          {section.content}
        </p>
      );

    case "quote":
      return (
        <blockquote
          className="my-8 pl-5 py-1"
          style={{ borderLeft: "2px solid rgba(233,195,73,0.5)" }}
        >
          <p
            className="font-serif text-base italic leading-relaxed"
            style={{ color: "rgba(233,195,73,0.85)" }}
          >
            {section.content}
          </p>
        </blockquote>
      );

    case "insight":
      return (
        <div
          className="rounded-xl p-5 my-4 flex gap-4"
          style={{
            background: "rgba(19,25,32,0.7)",
            border: "1px solid rgba(233,195,73,0.1)",
          }}
        >
          <div
            className="w-1.5 rounded-full flex-shrink-0 mt-1"
            style={{ background: "rgba(233,195,73,0.5)", minHeight: 16 }}
          />
          <p className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>
            {section.content}
          </p>
        </div>
      );

    case "list":
      return (
        <div className="my-6 space-y-2">
          {section.content && (
            <p className="font-sans text-sm font-medium mb-3" style={{ color: "#e8e8e8" }}>
              {section.content}
            </p>
          )}
          <ul className="space-y-2.5">
            {(section.items ?? []).map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="font-serif flex-shrink-0 mt-0.5"
                  style={{ color: "#e9c349", fontSize: 14 }}
                >
                  ✦
                </span>
                <span className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

// ─── Page ─────────────────────────────────────────────────────
export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.relatedSlugs ?? []);

  return (
    <div className="min-h-screen cosmic-bg text-white">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2"
        style={{
          width: 600, height: 300, borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(109,91,151,0.08) 0%, transparent 70%)`,
          filter: "blur(80px)", zIndex: 0,
        }}
      />

      <TopNav />
      <SideNav />

      <div className="lg:pl-64 pt-20">

        {/* ── Hero banner ─────────────────────────────────── */}
        <div
          className="relative px-4 md:px-8 py-16 overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${article.gradientFrom} 0%, #0f141b 100%)`,
            borderBottom: "1px solid rgba(233,195,73,0.08)",
          }}
        >
          {/* Decorative icon */}
          <div
            className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
            aria-hidden
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 160, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}
            >
              {article.accentIcon}
            </span>
          </div>

          <div className="relative z-10 max-w-2xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <Link
                href="/blog"
                className="font-sans text-xs transition-colors hover:text-yellow-300"
                style={{ color: "rgba(154,171,184,0.6)" }}
              >
                神諭博客
              </Link>
              <span style={{ color: "rgba(154,171,184,0.3)" }}>›</span>
              <span className="font-sans text-xs" style={{ color: "rgba(233,195,73,0.7)" }}>
                {article.category}
              </span>
            </div>

            {/* Category + meta */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="font-sans text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(233,195,73,0.1)",
                  border: "1px solid rgba(233,195,73,0.2)",
                  color: "rgba(233,195,73,0.85)",
                }}
              >
                {article.category}
              </span>
              <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.5)" }}>
                {article.readTime}
              </span>
              <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.5)" }}>
                {article.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4 leading-snug" style={{ color: "#e8e8e8" }}>
              {article.title}
            </h1>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>
              {article.subtitle}
            </p>
          </div>
        </div>

        {/* ── Article body ─────────────────────────────────── */}
        <main className="max-w-2xl mx-auto px-4 md:px-8 py-12">

          {article.body.map((section, i) => (
            <RenderSection key={i} section={section} />
          ))}

          {/* Divider */}
          <div className="divider-gold my-12" />

          {/* CTA — try a reading */}
          <div
            className="rounded-2xl p-8 text-center space-y-4"
            style={{
              background: "rgba(19,25,32,0.8)",
              border: "1.5px solid rgba(233,195,73,0.15)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 36, color: "#e9c349", fontVariationSettings: "'FILL' 1", display: "block" }}
            >
              auto_awesome
            </span>
            <h3 className="font-serif text-xl font-semibold" style={{ color: "#e8e8e8" }}>
              準備好聆聽你的牌面了嗎？
            </h3>
            <p className="font-sans text-sm" style={{ color: "#9aabb8" }}>
              知識是起點，但真正的洞見來自你自己的占卜體驗。
            </p>
            <Link
              href="/reading"
              className="inline-block font-sans text-sm font-semibold px-8 py-3.5 rounded-xl transition-all hover:brightness-110 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
                color: "#0f141b",
              }}
            >
              開始免費占卜 ✦
            </Link>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-14 space-y-5">
              <h2 className="font-serif text-xl font-semibold" style={{ color: "#e8e8e8" }}>
                延伸閱讀
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="glass-card rounded-xl p-5 space-y-2 transition-all hover:-translate-y-0.5"
                  >
                    <span className="font-sans text-xs" style={{ color: "#e9c349" }}>
                      {rel.category}
                    </span>
                    <p className="font-serif text-sm font-medium leading-snug" style={{ color: "#e8e8e8" }}>
                      {rel.title}
                    </p>
                    <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.5)" }}>
                      {rel.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back to blog */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-sans text-sm transition-colors hover:text-yellow-300"
              style={{ color: "rgba(154,171,184,0.6)" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              返回神諭博客
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
