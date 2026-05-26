// tailwind.config.ts — Full DESIGN.md token set from Stitch export
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Stitch color tokens ──────────────────────────────
      colors: {
        "surface":                   "#0f141b",
        "surface-dim":               "#0f141b",
        "surface-bright":            "#343941",
        "surface-container-lowest":  "#090f15",
        "surface-container-low":     "#171c23",
        "surface-container":         "#1b2027",
        "surface-container-high":    "#252a32",
        "surface-container-highest": "#30353d",
        "surface-variant":           "#30353d",
        "surface-tint":              "#c4c6cf",
        "on-surface":                "#dee2ec",
        "on-surface-variant":        "#c6c6cb",
        "inverse-surface":           "#dee2ec",
        "inverse-on-surface":        "#2c3138",
        "outline":                   "#909095",
        "outline-variant":           "#45474b",
        "background":                "#0f141b",
        "on-background":             "#dee2ec",
        "primary":                   "#c4c6cf",
        "on-primary":                "#2e3037",
        "primary-container":         "#0b0e14",
        "on-primary-container":      "#797b83",
        "inverse-primary":           "#5c5e66",
        "primary-fixed":             "#e1e2eb",
        "primary-fixed-dim":         "#c4c6cf",
        "on-primary-fixed":          "#191c22",
        "on-primary-fixed-variant":  "#44474e",
        "secondary":                 "#e9c349",
        "on-secondary":              "#3c2f00",
        "secondary-container":       "#af8d11",
        "on-secondary-container":    "#342800",
        "secondary-fixed":           "#ffe088",
        "secondary-fixed-dim":       "#e9c349",
        "on-secondary-fixed":        "#241a00",
        "on-secondary-fixed-variant":"#574500",
        "tertiary":                  "#d1bcff",
        "on-tertiary":               "#37265e",
        "tertiary-container":        "#130039",
        "on-tertiary-container":     "#8471af",
        "tertiary-fixed":            "#eaddff",
        "tertiary-fixed-dim":        "#d1bcff",
        "on-tertiary-fixed":         "#220e48",
        "on-tertiary-fixed-variant": "#4e3d76",
        "error":                     "#ffb4ab",
        "on-error":                  "#690005",
        "error-container":           "#93000a",
        "on-error-container":        "#ffdad6",
      },

      // ── Stitch typography scale ──────────────────────────
      fontFamily: {
        "display-lg":        ["Playfair Display", "serif"],
        "headline-lg":       ["Playfair Display", "serif"],
        "headline-lg-mobile":["Playfair Display", "serif"],
        "headline-md":       ["Playfair Display", "serif"],
        "body-lg":           ["Manrope", "sans-serif"],
        "body-md":           ["Manrope", "sans-serif"],
        "label-md":          ["Manrope", "sans-serif"],
        "label-sm":          ["Manrope", "sans-serif"],
        serif:               ["Playfair Display", "Georgia", "serif"],
        sans:                ["Manrope", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg":        ["64px",  { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg":       ["48px",  { lineHeight: "1.2",  fontWeight: "600" }],
        "headline-lg-mobile":["32px",  { lineHeight: "1.2",  fontWeight: "600" }],
        "headline-md":       ["32px",  { lineHeight: "1.3",  fontWeight: "500" }],
        "body-lg":           ["18px",  { lineHeight: "1.6",  letterSpacing: "0.01em", fontWeight: "400" }],
        "body-md":           ["16px",  { lineHeight: "1.6",  fontWeight: "400" }],
        "label-md":          ["14px",  { lineHeight: "1.2",  letterSpacing: "0.1em",  fontWeight: "600" }],
        "label-sm":          ["12px",  { lineHeight: "1.2",  letterSpacing: "0.05em", fontWeight: "500" }],
      },

      // ── Stitch spacing tokens ────────────────────────────
      spacing: {
        "gutter":         "24px",
        "section-gap":    "120px",
        "container-max":  "1200px",
        "margin-desktop": "64px",
        "margin-mobile":  "20px",
        "base":           "8px",
      },

      // ── Stitch border radius ─────────────────────────────
      borderRadius: {
        DEFAULT: "0.125rem",
        lg:      "0.25rem",
        xl:      "0.5rem",
        full:    "0.75rem",
      },

      // ── Max-width ────────────────────────────────────────
      maxWidth: {
        "container-max": "1200px",
      },

      // ── Backdrop blur ────────────────────────────────────
      backdropBlur: {
        "3xl": "40px",
      },

      // ── Box shadows (violet glow) ────────────────────────
      boxShadow: {
        "violet-glow": "0 0 40px rgba(209,188,255,0.15)",
        "gold-glow":   "0 0 20px rgba(233,195,73,0.4)",
        "top-nav":     "0 0 40px rgba(209,188,255,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
