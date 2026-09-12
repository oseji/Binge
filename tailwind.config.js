/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Seven type steps (12 / 14 / 16 / 20 / 28 / 40 / display) and three radii (8 / 12 / 20)
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.25rem", { lineHeight: "1.75rem" }],
      xl: ["1.75rem", { lineHeight: "2.125rem" }],
      "2xl": ["2.5rem", { lineHeight: "2.75rem" }],
      "display-sm": ["clamp(2rem, 6vw, 4.5rem)", { lineHeight: "1" }],
      display: ["clamp(2.75rem, 7vw, 5.5rem)", { lineHeight: "0.95" }],
    },
    borderRadius: {
      none: "0",
      DEFAULT: "0.5rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1.25rem",
      full: "9999px",
    },
    extend: {
      colors: {
        // Surfaces
        canvas: "#09090F",
        surface: { DEFAULT: "#0D0D18", 2: "#14141F" },
        // Text — every step clears WCAG AA (4.5:1) on canvas and surface-2
        fg: { DEFAULT: "#FFFFFF", muted: "#A0A0B8", subtle: "#8A8AA4" },
        // Brand — `accent` for fills (white text on it = 4.5:1),
        // `accent-text` for purple text on dark (6.7:1)
        accent: { DEFAULT: "#9B51E0", text: "#B57CF0", deep: "#7B3FC0" },
        // Hairlines — `line` is decorative, `line-strong` is for input/button
        // boundaries (3:1 non-text contrast)
        line: { DEFAULT: "rgba(255,255,255,0.10)", strong: "rgba(255,255,255,0.35)" },
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
      },
      screens: {
        xl: "1200px",
      },
    },
  },
  plugins: [],
};
