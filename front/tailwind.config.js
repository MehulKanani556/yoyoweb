/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Chakra Petch"', "sans-serif"], // this makes Chakra Petch the default "font-sans"
      },
      keyframes: {
        neonGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        "spin-slow": "spin 4s linear infinite",
        neon: 'neonGradient 4s ease infinite',
        'gradient-x': 'gradient-x 6s linear infinite',
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
          DEFAULT: "#7e22ce",
          light: "#FFFFFF",
          dark: "#0f0f0f",
        },
        secondary: {
          DEFAULT: "#4338ca",
          light: "#34D399",
          dark: "#0f0f0f",
        },
      },
      backgroundImage: {
        // "gradient-primary": "linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)",
        "gradient-primary": "linear-gradient(90deg,rgba(120, 36, 206, 1) 10%, rgba(67, 56, 202, 1) 100%)",
        "gradient-radial": "radial-gradient(circle,rgba(120, 36, 206, 1) 0%, rgba(67, 56, 202, 1) 100%)",
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
