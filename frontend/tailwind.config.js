/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:      "#fafbfc",
        surface: "#ffffff",
        line:    "#e8ecf1",
        ink:     "#0f1729",
        muted:   "#5b6577",
        accent:  "#3b82f6",
        up:      "#16a34a",
        down:    "#dc2626",
      },
      fontFamily: {
        sans:   ["'Inter'", "system-ui", "sans-serif"],
        serif:  ["'Source Serif 4'", "Georgia", "serif"],
        mono:   ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
