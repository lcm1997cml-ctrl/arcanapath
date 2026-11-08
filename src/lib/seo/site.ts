// src/lib/seo/site.ts — single source for canonical site URL + brand copy.
// NEXT_PUBLIC_APP_URL should be the production domain in Vercel.
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://arcanapath-two.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "ArcanaPath";
export const SITE_TAGLINE = "AI塔羅占卜｜感情、事業與人生問題解讀";
export const SITE_DESCRIPTION =
  "ArcanaPath 是 AI 塔羅占卜平台：輸入你的感情、工作或人生問題，親手抽三張塔羅牌（過去・現在・未來，含正逆位），即時獲得針對你問題的結構化 AI 塔羅解讀。首次免費。";

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Serialize JSON-LD safely for a <script> tag (prevents </script> breakouts). */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
