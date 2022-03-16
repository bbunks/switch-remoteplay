module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        success: {
          100: "#DDFDED",
          200: "#0AC295",
          300: "#09A57F",
          400: "#078364",
          500: "#027357",
        },
        warning: {
          100: "#FEF7B9",
          200: "#FFDA6C",
          300: "#FFB400",
          400: "#E07C02",
          500: "#C33E01",
        },
        error: {
          100: "#FCD2CF",
          200: "#F45532",
          300: "#DF320C",
          400: "#C61A0B",
          500: "#AE0A0A",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
