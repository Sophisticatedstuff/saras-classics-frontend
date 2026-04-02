/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-black': '#0B0B0B',
        'luxury-gold': '#FFD700',
      },
      boxShadow: {
        'glow-gold': '0 0 15px rgba(255, 215, 0, 0.5)',
        'glow-gold-intense': '0 0 25px rgba(255, 215, 0, 0.8)',
      }
    },
  },
  plugins: [],
}