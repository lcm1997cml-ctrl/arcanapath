"use client";
// src/components/TopNav.tsx
// Fixed top navigation bar — matches Stitch export exactly
// h-20, bg/80 backdrop-blur, gold bottom border, violet shadow

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopNavProps {
  remainingCount?: number | null;
}

const NAV_LINKS = [
  { href: "/reading", label: "占卜" },
  { href: "/dashboard", label: "紀錄" },
  { href: "/paywall", label: "高級版" },
  { href: "/blog", label: "神諭博客" },
];

export default function TopNav({ remainingCount }: TopNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20"
      style={{
        background: "rgba(15,20,27,0.8)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(233,195,73,0.2)",
        boxShadow: "0 0 40px rgba(209,188,255,0.15)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        {/* Celestial orb logo mark */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, rgba(233,195,73,0.25) 0%, rgba(209,188,255,0.1) 100%)",
            border: "1px solid rgba(233,195,73,0.4)",
            boxShadow: "0 0 12px rgba(233,195,73,0.2)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: "#e9c349",
              fontSize: 18,
              fontVariationSettings: "'FILL' 1, 'wght' 400",
            }}
          >
            auto_awesome
          </span>
        </div>
        <span
          className="font-headline-md text-secondary tracking-widest"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}
        >
          ArcanaPath
        </span>
      </Link>

      {/* Centre nav links (desktop) */}
      <div className="hidden md:flex items-center gap-10">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href || (href === "/reading" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className="font-label-md text-label-md transition-colors"
              style={{
                color: isActive ? "#e9c349" : "#c6c6cb",
                borderBottom: isActive ? "2px solid #e9c349" : "2px solid transparent",
                paddingBottom: 4,
                fontFamily: "'Manrope', sans-serif",
                fontSize: 14,
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right: remaining count + user */}
      <div className="flex items-center gap-4 md:gap-6">
        {remainingCount !== null && remainingCount !== undefined && (
          <div
            className="px-4 py-2 rounded-full"
            style={{
              border: "1px solid rgba(233,195,73,0.3)",
              background: "rgba(233,195,73,0.05)",
            }}
          >
            <span
              className="font-label-sm text-secondary"
              style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, letterSpacing: "0.05em", fontWeight: 500 }}
            >
              剩餘 {remainingCount} 次免費占卜
            </span>
          </div>
        )}
        <Link href="/paywall">
          <span
            className="material-symbols-outlined cursor-pointer transition-transform hover:scale-110"
            style={{
              color: "#e9c349",
              fontSize: 28,
              fontVariationSettings: "'FILL' 1, 'wght' 400",
            }}
          >
            account_circle
          </span>
        </Link>
      </div>
    </nav>
  );
}
