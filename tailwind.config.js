/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#00f2fe',
          600: '#00d4e0',
        },
        secondary: {
          500: '#7d44fa',
          600: '#6b3ae0',
        },
        dark: {
          900: '#050511',
          800: '#0a0a1a',
          700: '#161628',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}