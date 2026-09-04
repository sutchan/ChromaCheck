import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elev': 'var(--bg-elev)',
        'bg-sunken': 'var(--bg-sunken)',
        fg: 'var(--fg)',
        'fg-soft': 'var(--fg-soft)',
        'fg-mute': 'var(--fg-mute)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        brand: 'var(--brand)',
        'brand-hover': 'var(--brand-hover)',
        'brand-soft': 'var(--brand-soft)',
        'on-brand': 'var(--on-brand)',
        ok: 'var(--ok)',
        'ok-soft': 'var(--ok-soft)',
        warn: 'var(--warn)',
        'warn-soft': 'var(--warn-soft)',
        risk: 'var(--risk)',
        'risk-soft': 'var(--risk-soft)',
        'axis-protan': 'var(--axis-protan)',
        'axis-deutan': 'var(--axis-deutan)',
        'axis-tritan': 'var(--axis-tritan)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
      boxShadow: {
        1: 'var(--sh-1)',
        2: 'var(--sh-2)',
        3: 'var(--sh-3)',
        focus: 'var(--sh-focus)',
      },
      maxWidth: {
        wrap: '1160px',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '-180% 0' },
          to: { backgroundPosition: '180% 0' },
        },
      },
      animation: {
        rise: 'rise var(--d-4) var(--ease) both',
        fade: 'fade var(--d-3) var(--ease) both',
        pop: 'pop var(--d-3) var(--ease) both',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
