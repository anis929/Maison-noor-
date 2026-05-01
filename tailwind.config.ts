import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'noir-profond':  '#0A0A0A',
        'noir-doux':     '#141414',
        'corne-fonce':   '#2B1810',
        'corne-medium':  '#6B4423',
        'corne-clair':   '#A67C52',
        'chrome':        '#C8C8CC',
        'chrome-clair':  '#E8E8EC',
        'orange-brule':  '#D4541C',
        'orange-lumiere':'#FF7B3D',
        'creme-os':      '#E8DCC4',
        'creme-pale':    '#F5EFE0',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans:    ['var(--font-sans)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-up':     'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':     'fadeIn 0.6s ease forwards',
        'marquee':     'marquee 30s linear infinite',
        'cursor-grow': 'cursorGrow 0.2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'halo-orange': 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,84,28,0.25) 0%, transparent 70%)',
        'halo-warm':   'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,84,28,0.15) 0%, transparent 70%)',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
