// =============================================================
// src/lib/pricing.ts
// Single source of truth for all product pricing.
// Change prices here and they propagate everywhere.
// =============================================================

export interface PricingTier {
  id:          string;
  label:       string;      // short name shown on badge/button
  price:       number;      // HKD
  priceStr:    string;      // display string e.g. "HK$19"
  strikeStr?:  string;      // original price if discounted
  tagline:     string;      // one-line value prop
  features:    string[];    // bullet points
  cta:         string;      // button copy
  highlighted: boolean;     // show as primary / most prominent
  badge?:      string;      // e.g. "最低門檻" "最多人選" "最深入"
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id:          "single",
    label:       "HK$19",
    price:       19,
    priceStr:    "HK$19",
    tagline:     "單次完整解鎖，查看整份塔羅深度報告",
    features: [
      "深度心理拆解",
      "局勢真相分析",
      "短中長期時間線",
      "三步行動建議",
      "最應面對的核心問題",
      "延伸問答 Q&A",
    ],
    cta:         "HK$19 即可查看完整答案",
    highlighted: true,
    badge:       "最低門檻",
  },
  {
    id:          "triple",
    label:       "HK$39",
    price:       39,
    priceStr:    "HK$39",
    strikeStr:   "HK$57",
    tagline:     "三次完整塔羅解讀，適合有多個問題的人",
    features: [
      "三份完整深度報告",
      "可用於三個不同問題",
      "包含所有單次解鎖功能",
      "可用 email 喺其他裝置恢復權限",
    ],
    cta:         "HK$39 三次完整解讀",
    highlighted: false,
    badge:       "最多人選",
  },
  {
    id:          "deep",
    label:       "HK$88",
    price:       88,
    priceStr:    "HK$88",
    strikeStr:   "HK$128",
    tagline:     "30 日無限次完整解讀，適合想持續追蹤同一件事",
    features: [
      "30 日內無限次完整解讀",
      "每份都包含深度心理拆解與局勢真相",
      "短中長期時間線 + 延伸問答",
      "感情、事業、財運、人生主題通用",
      "可用 email 喺其他裝置恢復權限",
    ],
    cta:         "HK$88 人生深度版",
    highlighted: false,
    badge:       "最深入",
  },
];

// Quick lookup by id
export const TIER: Record<string, PricingTier> = Object.fromEntries(
  PRICING_TIERS.map((t) => [t.id, t])
);

// The primary CTA tier shown first / most prominently on result page
export const PRIMARY_TIER = TIER["single"];
