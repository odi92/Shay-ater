import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#111111',
        'surface-hover': '#1c1c1c',
        border: '#222222',
        muted: '#555555',
        secondary: '#888888',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      aspectRatio: {
        'cinema': '2.35 / 1',
        'classic': '4 / 3',
      },
      letterSpacing: {
        'widest': '0.2em',
        'ultra': '0.3em',
      },
    },
  },
  plugins: [],
};

export default config;
