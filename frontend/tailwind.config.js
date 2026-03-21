/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        accent: 'var(--accent)',
        textMain: 'var(--text-primary)',
        textMuted: 'var(--text-secondary)',
        borderColor: 'var(--border-color)',
      },
      boxShadow: {
        'theme': '0 4px 20px -4px var(--shadow-color)',
        'theme-hover': '0 12px 30px -4px var(--shadow-color)',
      },
    },
  },
  plugins: [],
}