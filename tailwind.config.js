/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black:           '#303c8e',
          bg:              '#FFFFFF',
          surface:         '#F0F2FF',
          'surface-alt':   '#E8ECFF',
          card:            '#FFFFFF',
          border:          '#E2E5F6',
          'border-strong': '#C7CDF0',
          primary:         '#303c8e',
          orange:          '#FF6B35',
          purple:          '#7C3AED',
          cyan:            '#0EA5E9',
          success:         '#22C55E',
          error:           '#EF4444',
          warning:         '#F59E0B',
          'text-primary':   '#303c8e',
          'text-secondary': '#5B6B9E',
          'text-muted':     '#9DA8CE',
          'footer-bg':     '#1D1D47',
          'footer-border': '#504F59',
          'footer-text':   '#E8E8E8',
        },
      },
      fontFamily: {
        // 'Hind Siliguri' is appended to each Latin family rather than applied
        // under :lang(bn). Font stacks resolve per GLYPH, so Latin text is found
        // in Inter / Plus Jakarta Sans and never reaches it, while Bengali text
        // — absent from both — falls through to it. English typography is
        // therefore unchanged, and Bangla stops rendering in an arbitrary OS
        // substitute. The family was already downloaded (nuxt.config.ts
        // googleFonts, bengali subset) but nothing had ever applied it.
        sans:    ['Inter', 'Hind Siliguri', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Hind Siliguri', 'sans-serif'],
        mono:    ['Space Grotesk', 'monospace'],
        bangla:  ['Hind Siliguri', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['96px', { lineHeight: '1.0',  letterSpacing: '-0.02em' }],
        'display-xl':  ['72px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg':  ['56px', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-md':  ['48px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'gradient-brand':  'linear-gradient(135deg, #303c8e 0%, #7C3AED 100%)',
        'gradient-orange': 'linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%)',
        'gradient-cyan':   'linear-gradient(135deg, #0EA5E9 0%, #303c8e 100%)',
        'gradient-light':  'linear-gradient(180deg, #FFFFFF 0%, #F0F2FF 100%)',
        'gradient-dark':   'linear-gradient(180deg, #1D1D47 0%, #0D0D30 100%)',
        'gradient-card':   'linear-gradient(135deg, #FFFFFF 0%, #F0F2FF 100%)',
        'glow-primary':    'radial-gradient(circle, rgba(48,60,142,0.12) 0%, transparent 70%)',
        'glow-orange':     'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
        'glow-purple':     'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        'grid-pattern':    'linear-gradient(rgba(48,60,142,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(48,60,142,.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
      boxShadow: {
        'glow-primary': '0 0 40px rgba(48, 60, 142, 0.20)',
        'glow-orange':  '0 0 40px rgba(255, 107, 53, 0.25)',
        'glow-purple':  '0 0 40px rgba(124, 58, 237, 0.20)',
        'glow-cyan':    '0 0 40px rgba(14, 165, 233, 0.20)',
        'card':         '0 1px 3px rgba(48,60,142,0.06), 0 4px 16px rgba(48,60,142,0.06)',
        'card-hover':   '0 4px 24px rgba(48,60,142,0.12), 0 1px 4px rgba(48,60,142,0.08)',
        'header':       '0 1px 0 rgba(48,60,142,0.08)',
      },
      borderRadius: {
        'card': '16px',
        'btn':  '8px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '80':  '80ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(48,60,142,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(48,60,142,0.6)' },
        },
      },
      animation: {
        'marquee':     'marquee 30s linear infinite',
        'fade-up':     'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':     'fade-in 0.4s ease forwards',
        'shimmer':     'shimmer 2s linear infinite',
        'float':       'float 4s ease-in-out infinite',
        'pulse-glow':  'pulse-glow 2s ease-in-out infinite',
      },
      maxWidth: {
        'content': '1280px',
      },
    },
  },
  plugins: [],
}
