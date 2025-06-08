/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Our cozy color palette
        'warm-linen': '#FDFBF6',
        'warm-charcoal': '#4E443C',
        'soft-clay': '#DAB894',
        'sage-green': '#B4C6A6',
        // Additional semantic colors
        'accent-warm': {
          light: '#E5D5C3',
          DEFAULT: '#DAB894',
          dark: '#C4A67C',
        },
        'accent-calm': {
          light: '#C8D7BC',
          DEFAULT: '#B4C6A6',
          dark: '#9BAF8C',
        },
      },
      fontFamily: {
        'be-vietnam': ['Be Vietnam Pro', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gentle-fade': 'fade 0.5s ease-in-out',
        'soft-lift': 'lift 0.3s ease-out',
        'gentle-pulse': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionTimingFunction: {
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} 