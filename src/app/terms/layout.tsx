import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服務條款",
  description: "ArcanaPath 服務條款。",
  alternates: { canonical: "/terms" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
