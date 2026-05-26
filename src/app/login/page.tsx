// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError("請輸入電郵和密碼");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "登入失敗");
        return;
      }
      router.push("/admin");
    } catch {
      setError("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(109,91,151,0.10) 0%, transparent 55%), #0f141b",
      }}
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "radial-gradient(circle, rgba(233,195,73,0.2) 0%, rgba(209,188,255,0.08) 100%)", border: "1px solid rgba(233,195,73,0.35)" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#e9c349", fontVariationSettings: "\'FILL\' 1" }}>auto_awesome</span>
            </div>
            <span className="font-serif text-2xl font-semibold tracking-widest" style={{ color: "#e9c349" }}>ArcanaPath</span>
          </Link>
          <p className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.5)" }}>管理員登入</p>
        </div>

        <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(19,25,32,0.85)", border: "1px solid rgba(233,195,73,0.12)" }}>
          <div>
            <label className="font-sans text-xs mb-1.5 block" style={{ color: "rgba(154,171,184,0.7)" }}>電郵</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full font-sans text-sm rounded-xl px-4 py-3 focus:outline-none transition-all"
              style={{ background: "rgba(9,15,21,0.8)", border: "1px solid rgba(233,195,73,0.15)", color: "#e8e8e8" }}
            />
          </div>
          <div>
            <label className="font-sans text-xs mb-1.5 block" style={{ color: "rgba(154,171,184,0.7)" }}>密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full font-sans text-sm rounded-xl px-4 py-3 focus:outline-none transition-all"
              style={{ background: "rgba(9,15,21,0.8)", border: "1px solid rgba(233,195,73,0.15)", color: "#e8e8e8" }}
            />
          </div>
          {error && (
            <div className="rounded-xl px-4 py-2.5 font-sans text-xs" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "rgba(252,165,165,0.9)" }}>
              {error}
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-sans text-sm font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)", color: "#0f141b" }}
          >
            {loading ? "登入中…" : "登入"}
          </button>
        </div>

        <p className="text-center font-sans text-xs" style={{ color: "rgba(154,171,184,0.45)" }}>
          一般用戶無需帳戶，前往{" "}
          <Link href="/reading" className="transition-colors hover:text-yellow-300" style={{ color: "#e9c349" }}>占卜頁</Link>{" "}
          即可開始
        </p>
      </div>
    </div>
  );
}
