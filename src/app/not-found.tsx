// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 text-center"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(109,91,151,0.10) 0%, transparent 55%), #0f141b",
      }}
    >
      {/* Decorative orb */}
      <div className="relative mb-8">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, rgba(233,195,73,0.06) 0%, rgba(209,188,255,0.04) 100%)",
            border: "1px solid rgba(233,195,73,0.15)",
            boxShadow: "0 0 60px rgba(233,195,73,0.06)",
          }}
        >
          <div
            className="absolute inset-6 rounded-full"
            style={{ border: "1px solid rgba(233,195,73,0.08)" }}
          />
          <span
            className="font-serif relative z-10"
            style={{ fontSize: 52, color: "rgba(233,195,73,0.4)", lineHeight: "1" }}
          >
            ☽
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-3 mb-10 max-w-sm">
        <p
          className="font-sans text-xs uppercase tracking-widest"
          style={{ color: "rgba(233,195,73,0.5)", letterSpacing: "0.25em" }}
        >
          404 · 迷失於宇宙之中
        </p>
        <h1 className="font-serif text-3xl font-semibold" style={{ color: "#e8e8e8" }}>
          此頁面隱入虛空
        </h1>
        <p className="font-sans text-sm leading-relaxed" style={{ color: "#9aabb8" }}>
          你所尋找的啟示似乎已回歸星塵。可能是占卜連結已過期，或此路徑從未存在。
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/reading"
          className="flex-1 py-3.5 rounded-xl font-sans text-sm font-semibold text-center transition-all hover:brightness-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
            color: "#0f141b",
          }}
        >
          重新占卜 ✦
        </Link>
        <Link
          href="/"
          className="flex-1 py-3.5 rounded-xl font-sans text-sm font-semibold text-center transition-all hover:brightness-110"
          style={{
            background: "rgba(19,25,32,0.8)",
            border: "1px solid rgba(233,195,73,0.2)",
            color: "#e9c349",
          }}
        >
          回到首頁
        </Link>
      </div>
    </div>
  );
}
