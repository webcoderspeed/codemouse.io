/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        page:    '#08090E',
        surface: '#0E1018',
        overlay: '#13151F',
        subtle:  '#191B28',
        border: {
          DEFAULT: '#1E2030',
          hover:   '#2D3154',
          focus:   '#4F52D9',
        },
        text: {
          primary:   '#E2E4F0',
          secondary: '#6B7194',
          muted:     '#3A3D5C',
        },
        accent: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F52D9',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          subtle: '#6366F114',
        },
        success: { DEFAULT: '#22C55E', subtle: '#22C55E14', text: '#4ADE80' },
        warning: { DEFAULT: '#F59E0B', subtle: '#F59E0B14', text: '#FCD34D' },
        danger:  { DEFAULT: '#EF4444', subtle: '#EF444414', text: '#F87171' },
        info:    { DEFAULT: '#3B82F6', subtle: '#3B82F614', text: '#60A5FA' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight:   '-0.025em',
        wide:    '0.04em',
        wider:   '0.08em',
        widest:  '0.12em',
      },
      boxShadow: {
        'glow-sm': '0 0 12px 0 rgba(99,102,241,0.15)',
        'glow':    '0 0 28px 0 rgba(99,102,241,0.20)',
        'glow-lg': '0 0 52px 0 rgba(99,102,241,0.25)',
        'card':    '0 1px 3px 0 rgba(0,0,0,0.5)',
        'card-lg': '0 4px 24px 0 rgba(0,0,0,0.5)',
        'inset-t': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'grid-faint': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 40V0M40 40V0M40 0H0M40 40H0' stroke='%231E2030' stroke-width='.4'/%3E%3C/svg%3E")`,
        'hero-radial': 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        'accent-grad': 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
        'card-grad':   'linear-gradient(160deg, #13151F 0%, #0E1018 100%)',
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease forwards',
        'slide-up': 'slideUp 0.35s ease forwards',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
