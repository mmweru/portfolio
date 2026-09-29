/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        background: '#080c14',
        surface: '#0e1422',
        'surface-high': '#151e32',
        'surface-highest': '#1e2942',
        primary: '#dbfcff',
        'primary-container': '#00f0ff',
        secondary: '#4cd7f6',
        'secondary-container': '#03b5d3',
        brand: {
          cyan: '#00f0ff',
          teal: '#00dbe9',
          dark: '#080c14',
          card: '#0e1422',
          border: '#1a2438',
          borderHover: '#00f0ff55',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
