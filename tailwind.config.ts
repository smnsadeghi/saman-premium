import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0F0E11",
        surface: {
          DEFAULT: "#18171C",
          subtle: "#1F1E24",
          elevated: "#25242C",
        },
        ritual: {
          period: {
            DEFAULT: "#C85A53",
            dark: "#A8443E",
            glow: "rgba(200, 90, 83, 0.16)",
          },
          support: {
            DEFAULT: "#4F7A75",
            dark: "#3B5F5B",
            glow: "rgba(79, 122, 117, 0.16)",
          },
          dormant: {
            DEFAULT: "#D9A05B",
            glow: "rgba(217, 160, 91, 0.08)",
          },
          pre: {
            DEFAULT: "#9D84B7",
            glow: "rgba(157, 132, 183, 0.12)",
          },
          cooldown: {
            DEFAULT: "#E09F7D",
            glow: "rgba(224, 159, 125, 0.12)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "Vazirmatn", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      animation: {
        "breath-slow": "breath 5s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        breath: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.04)", opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
