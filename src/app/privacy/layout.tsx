import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "私隱政策",
  description: "ArcanaPath 私隱政策。",
  alternates: { canonical: "/privacy" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
