// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcanaPath｜AI塔羅占卜｜尋找屬於你嘅真相",
  description: "ArcanaPath AI塔羅占卜，免費三張牌解讀，深入分析愛情、事業與未來方向。輸入問題，即時獲得專業塔羅牌解讀。",
  keywords: "塔羅牌,塔羅占卜,AI塔羅,塔羅解讀,免費塔羅,愛情塔羅",
};

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
      <body className="antialiased bg-background text-on-surface">{children}</body>
    </html>
  );
}
