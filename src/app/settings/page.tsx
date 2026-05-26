"use client";
// src/app/settings/page.tsx — 設定

import React, { useState } from "react";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

type Toggle = { label: string; desc: string; key: string };

const READING_TOGGLES: Toggle[] = [
  { label: "顯示逆位牌", desc: "允許塔羅牌以逆位出現，提供更完整的解讀", key: "reversed" },
  { label: "自動朗讀結果", desc: "使用語音合成功能朗讀你的占卜結果", key: "tts" },
  { label: "背景環境音樂", desc: "占卜期間播放神秘主義環境音效", key: "ambient" },
];

const NOTIFICATION_TOGGLES: Toggle[] = [
  { label: "每日提醒", desc: "每天早上提醒你進行每日一抽", key: "daily" },
  { label: "月相通知", desc: "在重要月相時段通知你", key: "moon" },
  { label: "新文章通知", desc: "神諭博客發布新內容時通知你", key: "articles" },
];

function SettingRow({ toggle, value, onChange }: { toggle: Toggle; value: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid rgba(233,195,73,0.06)" }}>
      <div className="space-y-0.5 pr-4">
        <p className="font-sans text-sm font-medium" style={{ color: "#e8e8e8" }}>{toggle.label}</p>
        <p className="font-sans text-xs" style={{ color: "#9aabb8" }}>{toggle.desc}</p>
      </div>
      <button
        onClick={onChange}
        className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300"
        style={{
          background: value ? "linear-gradient(135deg, #e9c349, #c9a32e)" : "rgba(154,171,184,0.2)",
          border: value ? "none" : "1px solid rgba(154,171,184,0.2)",
        }}
        aria-label={toggle.label}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
          style={{
            background: value ? "#0f141b" : "rgba(154,171,184,0.7)",
            left: value ? "calc(100% - 22px)" : 2,
          }}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [readingSettings, setReadingSettings] = useState<Record<string, boolean>>({
    reversed: true, tts: false, ambient: false,
  });
  const [notifSettings, setNotifSettings] = useState<Record<string, boolean>>({
    daily: false, moon: false, articles: true,
  });
  const [topic, setTopic] = useState("love");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen cosmic-bg text-white">
      <TopNav />
      <SideNav />

      <div className="lg:pl-64 pt-20">
        <main className="max-w-xl mx-auto px-4 md:px-8 py-12 space-y-8">

          {/* Header */}
          <section className="animate-fade-in">
            <h1 className="font-serif text-3xl font-semibold" style={{ color: "#e8e8e8" }}>設定</h1>
            <p className="font-sans text-sm mt-1" style={{ color: "#9aabb8" }}>自訂你的 ArcanaPath 體驗</p>
            <div className="divider-gold mt-4" />
          </section>

          {/* Reading settings */}
          <section className="rounded-2xl p-6" style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.1)" }}>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>占卜設定</h2>
            </div>
            <div>
              {READING_TOGGLES.map((t) => (
                <SettingRow
                  key={t.key}
                  toggle={t}
                  value={readingSettings[t.key] ?? false}
                  onChange={() => setReadingSettings((prev) => ({ ...prev, [t.key]: !prev[t.key] }))}
                />
              ))}
            </div>

            {/* Default topic */}
            <div className="mt-5 space-y-2">
              <p className="font-sans text-sm font-medium" style={{ color: "#e8e8e8" }}>預設占卜主題</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "love", label: "❤️ 感情" },
                  { value: "career", label: "💼 事業" },
                  { value: "wealth", label: "💰 財運" },
                  { value: "life", label: "🌿 人生" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setTopic(value)}
                    className="py-2.5 px-4 rounded-xl font-sans text-sm transition-all"
                    style={{
                      background: topic === value ? "rgba(233,195,73,0.12)" : "rgba(9,15,21,0.6)",
                      border: topic === value ? "1px solid rgba(233,195,73,0.35)" : "1px solid rgba(154,171,184,0.1)",
                      color: topic === value ? "#e9c349" : "#9aabb8",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Notification settings */}
          <section className="rounded-2xl p-6" style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.1)" }}>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}>notifications</span>
              <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>通知設定</h2>
            </div>
            <div>
              {NOTIFICATION_TOGGLES.map((t) => (
                <SettingRow
                  key={t.key}
                  toggle={t}
                  value={notifSettings[t.key] ?? false}
                  onChange={() => setNotifSettings((prev) => ({ ...prev, [t.key]: !prev[t.key] }))}
                />
              ))}
            </div>
          </section>

          {/* Appearance */}
          <section className="rounded-2xl p-6" style={{ background: "rgba(19,25,32,0.7)", border: "1px solid rgba(233,195,73,0.1)" }}>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#e9c349", fontVariationSettings: "'FILL' 1" }}>palette</span>
              <h2 className="font-serif text-base font-semibold" style={{ color: "#e8e8e8" }}>外觀</h2>
            </div>
            <div className="flex gap-3">
              {[
                { label: "暗黑宇宙", active: true, bg: "#0f141b", accent: "#e9c349" },
                { label: "星際藍", active: false, bg: "#060d1e", accent: "#88b4ff" },
                { label: "午夜紫", active: false, bg: "#120918", accent: "#c4a3ff" },
              ].map(({ label, active, bg, accent }) => (
                <button
                  key={label}
                  disabled={!active}
                  className="flex-1 py-3 px-3 rounded-xl flex flex-col items-center gap-2 transition-all"
                  style={{
                    background: active ? "rgba(233,195,73,0.08)" : "rgba(9,15,21,0.5)",
                    border: active ? "1.5px solid rgba(233,195,73,0.3)" : "1px solid rgba(154,171,184,0.08)",
                    opacity: active ? 1 : 0.5,
                    cursor: active ? "pointer" : "not-allowed",
                  }}
                >
                  <div className="w-8 h-8 rounded-full" style={{ background: bg, border: `2px solid ${accent}` }} />
                  <span className="font-sans text-xs" style={{ color: active ? "#e9c349" : "#9aabb8" }}>{label}</span>
                  {!active && <span className="font-sans text-xs" style={{ color: "rgba(154,171,184,0.35)", fontSize: 9 }}>即將推出</span>}
                </button>
              ))}
            </div>
          </section>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-xl font-sans text-sm font-semibold transition-all hover:brightness-110 active:scale-95"
            style={{
              background: saved ? "rgba(134,200,134,0.15)" : "linear-gradient(135deg, #e9c349 0%, #c9a32e 100%)",
              color: saved ? "#86c886" : "#0f141b",
              border: saved ? "1px solid rgba(134,200,134,0.3)" : "none",
            }}
          >
            {saved ? "✓ 設定已儲存" : "儲存設定"}
          </button>

        </main>
      </div>
    </div>
  );
}
