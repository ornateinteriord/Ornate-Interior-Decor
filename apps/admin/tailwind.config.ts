import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ornate: {
          cream: "#F4EFE6",
          gold: "#C9A461",
          darkgold: "#8E6F38",
          charcoal: "#262320",
          softblack: "#1A1816",
          offwhite: "#FAF8F4",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        display: ["Tenor Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
