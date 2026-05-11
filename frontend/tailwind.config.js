/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#05070A',
        'bg-secondary': '#0A0E14',
        accent: '#1A2B48',
      },
      fontFamily: {
        mincho: ['"Shippori Mincho"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
}
