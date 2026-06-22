/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C5CE7",
          dark: "#5B4FE3",
          light: "#EDEBFB",
        },
        ink: "#1A1D2E",
        muted: "#8A8F9C",
        bg: "#F4F5FA",
        success: "#22C55E",
        pending: "#F59E0B",
        priority: {
          high: "#EF4444",
          highBg: "#FEE2E2",
          med: "#F59E0B",
          medBg: "#FEF3C7",
          low: "#22C55E",
          lowBg: "#DCFCE7",
        },
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "26px",
      },
    },
  },
  plugins: [],
};
