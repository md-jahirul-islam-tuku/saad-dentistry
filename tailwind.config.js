/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("daisyui")],
  darkMode: "class",
  daisyui: {
    themes: [
      {
        light: {
          primary: "#BC74A5",
          secondary: "#b54827",
          accent: "#BC54A9",
          neutral: "#F2F2F2",
          "base-100": "#FFFFFF",
          "base-content": "#1f2937",
          info: "#0E54AE",
          success: "#6BEBA7",
          warning: "#F2CE40",
          error: "#E14C6C",
          cardBG:"#BC54A9"
        },
      },
      {
        dark: {
          primary: "#BC74A5",
          accent: "#BC54A9",
          "base-100": "#020617",
          info: "#0E54AE",
          cardBG:"#000000"
        },
      },
    ],
  },
};