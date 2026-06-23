import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#C9A84C",
        "gold-light": "#E8C97A",
        navy: "#1A1F3A",
        blush: "#F5E6E8",
        cream: "#FAF7F2",
        "match-green": "#4CAF7D",
        matched: "#9E9E9E",
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "Apple SD Gothic Neo", "sans-serif"],
        serif: ["Noto Serif KR", "Georgia", "serif"],
      },
      perspective: {
        "1000": "1000px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "heart-burst": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.4)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-up": "fade-up 0.4s ease-out forwards",
        "heart-burst": "heart-burst 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
