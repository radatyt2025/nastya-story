import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { wine: '#4A1728', night: '#101014', ivory: '#F6F0E8', rose: '#D8A4B2', gold: '#D9BC8A' },
    fontFamily: { serif: ['var(--f-serif)', 'Georgia', 'serif'], sans: ['var(--f-sans)', 'system-ui', 'sans-serif'], hand: ['var(--f-hand)', 'cursive'] },
  } },
} satisfies Config;
