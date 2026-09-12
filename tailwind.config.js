/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
