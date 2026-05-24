// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      colors: {
        arcana: {
          bg: "#0f141b",
          surface: "#131920",
          raised: "#1a2232",
          overlay: "#1e2a3a",
          gold: "#e9c349",
          "gold-dim": "#c9a32e",
          "gold-subtle": "rgba(233,195,73,0.12)",
          purple: "#d1bcff",
          "purple-dim": "#b09de0",
          "purple-subtle": "rgba(209,188,255,0.12)",
          text: "#e8e8e8",
          muted: "#9aabb8",
          error: "#cf6679",
        },
      },
    },
  },
  plugins: [],
};

export default config;
