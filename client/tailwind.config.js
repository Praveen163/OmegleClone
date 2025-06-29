/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        omegleBlue: '#4aa5ff',
        omegleOrange: '#ff8c00',
        linkBlue: '#4b7eab',
      },
    },
  },
  plugins: [],
} 