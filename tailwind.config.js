/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          indigo: '#4f46e5',
          'indigo-dark': '#4338ca',
          purple: '#7c3aed',
          cyan: '#0284c7',
          emerald: '#059669',
          rose: '#e11d48',
          amber: '#d97706',
        },
      },
      keyframes: {
        floatOrb: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(40px, -50px) scale(1.08)' },
          '100%': { transform: 'translate(-30px, 30px) scale(0.95)' },
        },
        livePulse: {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        cardFadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        floatOrb: 'floatOrb 18s ease-in-out infinite alternate',
        livePulse: 'livePulse 2s infinite ease-in-out',
        cardFadeUp: 'cardFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      boxShadow: {
        glow: '0 0 25px rgba(79, 70, 229, 0.18)',
        card: '0 25px 50px -12px rgba(30, 41, 59, 0.12), 0 0 1px 1px rgba(99, 102, 241, 0.08)',
      },
    },
  },
  plugins: [],
}
