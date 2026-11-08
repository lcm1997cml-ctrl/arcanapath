import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { CARD_CONTENT } from "@/lib/tarot/cardContent";
import { BLOG_ARTICLES } from "@/lib/blog-content";

// Only indexable, evergreen pages. Personal readings (/result, /r) are
// intentionally excluded (noindex for privacy).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "daily"),
    page("/reading", 0.9, "weekly"),
    page("/love-tarot", 0.9),
    page("/ai-tarot", 0.8),
    page("/tarot-card-meaning", 0.8),
    page("/faq", 0.7, "monthly"),
    page("/paywall", 0.6, "monthly"),
    page("/spreads", 0.5, "monthly"),
    page("/blog", 0.6),
    ...BLOG_ARTICLES.map((a) => page(`/blog/${a.slug}`, 0.6, "monthly")),
    ...CARD_CONTENT.map((c) => page(`/tarot/cards/${c.slug}`, 0.7, "monthly")),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
  ];
}
