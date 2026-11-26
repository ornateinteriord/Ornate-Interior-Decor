import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ornate: {
          cream: "#EFEAE0",
          gold: "#D49B54",
          darkgold: "#9B5F22",
          charcoal: "#1E1B18",
          muted: "#635B52",
          softblack: "#141210",
          offwhite: "#F7F4EE",
          moss: "#1F2D27",
          mossLight: "#2D4037",
          sage: "#E6ECE8",
          border: "#E5DDD0",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
