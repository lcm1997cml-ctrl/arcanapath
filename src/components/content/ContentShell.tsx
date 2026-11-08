// Server-rendered shell for SEO/content pages: shared nav + readable column.
import React from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";
import { absoluteUrl, jsonLd } from "@/lib/seo/site";

export type Crumb = { name: string; href: string };

export function ContentShell({
  crumbs,
  children,
}: {
  crumbs?: Crumb[];
  children: React.ReactNode;
}) {
  const breadcrumbLd = crumbs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "首頁", href: "/" }, ...crumbs].map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: absoluteUrl(c.href),
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <TopNav />
      <SideNav />
      <main className="lg:pl-64 pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {crumbs?.length ? (
            <nav aria-label="麵包屑" className="pt-6 text-xs text-on-surface-variant/70">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href="/" className="hover:text-secondary">首頁</Link></li>
                {crumbs.map((c, i) => (
                  <li key={c.href} className="flex items-center gap-1.5">
                    <span aria-hidden>›</span>
                    {i === crumbs.length - 1 ? (
                      <span aria-current="page" className="text-on-surface-variant">{c.name}</span>
                    ) : (
                      <Link href={c.href} className="hover:text-secondary">{c.name}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          {children}
        </div>
      </main>
      {breadcrumbLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbLd) }} />
      )}
    </div>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: React.ReactNode }) {
  return (
    <header className="pt-8 pb-6">
      {eyebrow && (
        <p className="text-xs tracking-[0.18em] uppercase text-secondary/80 mb-3">{eyebrow}</p>
      )}
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight text-on-surface">{title}</h1>
      {intro && <div className="mt-4 text-base leading-relaxed text-on-surface-variant">{intro}</div>}
    </header>
  );
}

export function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mt-10">
      <h2 className="font-serif text-xl sm:text-2xl font-semibold text-on-surface mb-4">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-on-surface-variant">{children}</div>
    </section>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-secondary/15 bg-surface-container-low/70 p-5 ${className}`}>
      {children}
    </div>
  );
}

/** Primary conversion block: always leads to the free reading flow. */
export function ReadingCta({
  title = "準備好問你的問題了嗎？",
  text = "輸入問題、親手抽三張牌，AI 會按過去・現在・未來為你解讀。首次免費，無需註冊。",
  href = "/reading",
  label = "免費開始 AI 塔羅占卜",
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="mt-12 rounded-2xl border border-secondary/25 bg-surface-container p-6 text-center">
      <p className="font-serif text-xl font-semibold text-on-surface">{title}</p>
      <p className="mt-2 text-sm text-on-surface-variant">{text}</p>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-secondary px-7 text-sm font-semibold text-on-secondary transition hover:brightness-110 active:scale-[0.98]"
      >
        {label}
      </Link>
    </div>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-secondary/10 rounded-2xl border border-secondary/15 bg-surface-container-low/60">
      {items.map((f) => (
        <details key={f.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-on-surface">
            <h3 className="text-[15px] leading-snug">{f.q}</h3>
            <span aria-hidden className="mt-0.5 text-secondary transition group-open:rotate-45">＋</span>
          </summary>
          <p className="mt-3 text-[15px] leading-relaxed text-on-surface-variant">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
