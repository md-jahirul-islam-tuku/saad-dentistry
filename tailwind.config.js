/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#BC74A5",

          secondary: "#b54827",

          accent: "#BC54A9",

          neutral: "#F2F2F2",

          "base-100": "#FFFFFF",

          info: "#0E54AE",

          success: "#6BEBA7",

          warning: "#F2CE40",

          error: "#E14C6C",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
