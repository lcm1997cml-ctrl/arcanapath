// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, jsonLd } from "@/lib/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI塔羅占卜｜免費三張牌塔羅解讀・感情事業人生｜ArcanaPath",
    template: "%s｜ArcanaPath AI塔羅",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "zh_HK",
    url: SITE_URL,
    title: "ArcanaPath｜AI塔羅占卜・感情與人生問題解讀",
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/og-cover.jpg", width: 1200, height: 800, alt: "ArcanaPath AI 塔羅占卜" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArcanaPath｜AI塔羅占卜",
    description: SITE_DESCRIPTION,
    images: ["/images/og-cover.jpg"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0f141b",
  width: "device-width",
  initialScale: 1,
};

const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["ArcanaPath AI塔羅", "ArcanaPath 塔羅占卜"],
    url: SITE_URL,
    inLanguage: "zh-HK",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-HK" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Stitch design system fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Outlined — variable axes */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-on-surface">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
