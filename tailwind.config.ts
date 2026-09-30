import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        marino: '#1e2a65',
        marinoHover: '#2c3a80',
        naranja: '#f38322',
        naranjaHover: '#d9711a',
        fondo: '#F5F6FA',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
