/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Chakra Petch"', "sans-serif"], // this makes Chakra Petch the default "font-sans"
      },
      animation: {
        "spin-slow": "spin 4s linear infinite",
      },
      screens: {
        xs: "320px",
        sm: "425px",
        md600: "601px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      colors: {
        primary: {
          DEFAULT: "#7269FF",
          light: "#FFFFFF",
          dark: "#0f0f0f",
        },
        secondary: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#0f0f0f",
        },
      },
      backgroundImage: {
        // "gradient-primary": "linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)",
        "gradient-primary": "linear-gradient(to right, #ff7e5f, #feb47b, #ff7e5f)",
        "gradient-secondary": "linear-gradient(to right, #ff7e5f, #feb47b)",
        "gradient-success": "linear-gradient(to right, #06b6d4, #10b981)",
        "gradient-dark": "linear-gradient(to right, #0f0f0f, #3f3f46)",
      }
    },
  },
  plugins: [
    // Add plugin for scrollbar hiding
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
