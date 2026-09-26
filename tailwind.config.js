/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.35rem" }],
      base: ["1rem", { lineHeight: "1.6rem" }],
      lg: ["1.1875rem", { lineHeight: "1.75rem" }],
      xl: ["1.5rem", { lineHeight: "1.9rem" }],
    },
    // Printed-programme corners: posters and controls are near-square, stills are square
    borderRadius: {
      none: "0",
      sm: "2px",
      DEFAULT: "4px",
      full: "9999px",
    },
    extend: {
      colors: {
        // Every text step clears WCAG AA (4.5:1) on ink-0 through ink-2
        ink: { 0: "#0B0A09", 1: "#141210", 2: "#1C1916", 3: "#27231F" },
        paper: { DEFAULT: "#F2ECE3", muted: "#B9B0A3", subtle: "#948B7F" },
        // Negative orange: the base colour of colour negative film
        signal: { DEFAULT: "#FF6B2C", ink: "#431A08" },
        rule: { DEFAULT: "rgba(242,236,227,0.12)", strong: "rgba(242,236,227,0.38)" },
      },
      fontFamily: {
        sans: ["Archivo", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      screens: {
        xl: "1200px",
        "2xl": "1560px",
      },
    },
  },
  plugins: [],
};
