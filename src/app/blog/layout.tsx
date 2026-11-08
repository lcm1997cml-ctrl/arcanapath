import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "神諭博客｜塔羅知識與感情指南",
  description: "ArcanaPath 神諭博客：塔羅牌義、逆位牌、感情塔羅與靈性生活文章。",
  alternates: { canonical: "/blog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
