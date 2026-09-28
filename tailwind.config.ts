import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        marino: '#1B2A6B',
        marinoHover: '#2A3D8F',
        naranja: '#F4821F',
        naranjaHover: '#d4711a',
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
