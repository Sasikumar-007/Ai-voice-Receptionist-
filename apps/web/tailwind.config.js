/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tavus: {
          bg: '#f3eee7',
          surface: '#f5f3ef',
          black: '#140206',
          border: '#140206',
          neon: '#1bd944',
          'neon-dark': '#0cb531',
          pink: '#ff6183',
          'pink-light': '#ffb4c5',
          lilac: '#fed7ff',
          'lilac-deep': '#fdb3ff',
          fog: '#d0c9ed',
          glow: '#fd7f00',
          amber: '#ffb835',
          tan: '#d5997d',
          brown: '#4b2c22',
          muted: '#856f58'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #140206',
        'brutal': '4px 4px 0px #140206',
        'brutal-lg': '6px 6px 0px #140206',
        'brutal-xl': '8px 8px 0px #140206',
        'brutal-pink': '4px 4px 0px #ff6183',
        'brutal-neon': '4px 4px 0px #1bd944'
      }
    },
  },
  plugins: [],
}
