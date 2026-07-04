import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rosa accentfärg enligt önskemål.
        pink: {
          DEFAULT: "#FF69B4",
          50: "#FFF0F7",
          100: "#FFE0EF",
          200: "#FFC2DF",
          300: "#FF9DCB",
          400: "#FF83BF",
          500: "#FF69B4",
          600: "#E84B9C",
          700: "#C43682",
          800: "#9B2A66",
          900: "#7A2151",
        },
        ink: {
          DEFAULT: "#1A1A1F",
          soft: "#4A4A55",
          muted: "#8A8A96",
        },
      },
      fontFamily: {
        // Vogue för rubriker (self-hostad, se public/fonts/README.md), Roboto för brödtext.
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
        cardHover: "0 8px 24px rgba(16, 24, 40, 0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
