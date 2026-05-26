"use client";
// src/components/SideNav.tsx
// Fixed left sidebar — matches Stitch export exactly
// w-64, hidden on mobile (lg:flex), glass surface, gold accents

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/reading",   icon: "auto_awesome",  label: "每日一抽" },
  { href: "/spreads",   icon: "grid_view",      label: "牌陣" },
  { href: "/journal",   icon: "auto_stories",   label: "靈魂日記" },
  { href: "/paywall",   icon: "auto_fix_high",  label: "商店" },
];

const BOTTOM_ITEMS = [
  { href: "/settings",  icon: "settings",       label: "設定" },
  { href: "/support",   icon: "help_outline",    label: "支援" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full z-40 flex-col w-64 pt-24 pb-8 hidden lg:flex"
      style={{
        borderRight: "1px solid rgba(233,195,73,0.1)",
        background: "rgba(9,15,21,0.9)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        boxShadow: "4px 0 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* User profile card */}
      <div className="px-6 mb-8">
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "rgba(23,28,35,0.8)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(233,195,73,0.15)",
              border: "1px solid rgba(233,195,73,0.4)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#e9c349", fontSize: 20 }}
            >
              person
            </span>
          </div>
          <div className="min-w-0">
            <p
              className="font-label-md text-on-surface truncate"
              style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 600 }}
            >
              探索者
            </p>
            <p
              className="text-on-surface-variant uppercase"
              style={{ fontSize: 10, letterSpacing: "0.05em" }}
            >
              初心階級
            </p>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = pathname === href || (href === "/reading" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-4 py-3 transition-all group"
              style={{
                background:  isActive ? "rgba(233,195,73,0.1)" : "transparent",
                color:       isActive ? "#e9c349" : "#c6c6cb",
                borderRight: isActive ? "3px solid #e9c349" : "3px solid transparent",
                borderRadius: "2px",
              }}
            >
              <span
                className="material-symbols-outlined transition-colors"
                style={{
                  fontSize: 22,
                  color: isActive ? "#e9c349" : "inherit",
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {icon}
              </span>
              <span
                className="font-label-md"
                style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: upgrade + settings */}
      <div className="px-4 space-y-1">
        <Link
          href="/paywall"
          className="block w-full py-3 mb-3 rounded-lg text-center transition-all hover:brightness-110 active:scale-95"
          style={{
            background: "#e9c349",
            color: "#0b0e14",
            fontFamily: "'Manrope', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}
        >
          開啟完整啟示
        </Link>

        {BOTTOM_ITEMS.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 px-4 py-2 transition-all hover:text-secondary"
            style={{ color: "#c6c6cb" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "inherit" }}>
              {icon}
            </span>
            <span
              className="font-label-sm"
              style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, letterSpacing: "0.05em", fontWeight: 500 }}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
