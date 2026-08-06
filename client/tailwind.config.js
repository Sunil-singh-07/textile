/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand ramp — dark to light: primary (walnut) -> secondary
        // (taupe) -> accent (camel). Exact values are the brief's own.
        primary: {
          DEFAULT: '#6B4F3B',
          50: '#F7F3F0',
          100: '#EEE5DD',
          400: '#8A6D57',
          600: '#6B4F3B',
          700: '#57402F',
          800: '#463327',
          900: '#372820',
        },
        secondary: {
          DEFAULT: '#8C6A52',
          100: '#F1E8E0',
          400: '#A3826A',
          600: '#8C6A52',
          700: '#725540',
        },
        accent: {
          DEFAULT: '#B08968',
          100: '#F3E7DA',
          300: '#D3B599',
          500: '#B08968',
          600: '#98704F',
        },
        background: '#E8D7C3',
        surface: '#F7F2EB',
        ink: '#2F241D',
        muted: '#7A6C5D',
        border: '#D7C2AC',
        success: { DEFAULT: '#55704F', 100: '#E7EDE3' },
        warning: { DEFAULT: '#B08339', 100: '#F3E6D2' },
        danger: { DEFAULT: '#A14F3B', 100: '#F3E0DA' },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Karla"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(47, 36, 29, 0.06), 0 1px 1px 0 rgba(47, 36, 29, 0.04)',
        card:'0 10px 28px -12px rgba(47,36,29,.16), 0 2px 8px rgba(47,36,29,.08)',
        elevated: '0 22px 55px -20px rgba(70,51,39,.26), 0 8px 18px rgba(70,51,39,.10)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.4)',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s ease-in-out infinite',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
