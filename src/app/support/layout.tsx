import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "支援與聯絡",
  description: "ArcanaPath 支援中心：付款、恢復權限與占卜相關問題。",
  alternates: { canonical: "/support" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
