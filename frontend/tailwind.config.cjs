/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
      "./app/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fly: {
          '0%': { left: '0%' },
          '50%': { left: '50%' },
          '100%': { left: '100%' },
        },
      },
      animation: {
        fly: 'fly 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};