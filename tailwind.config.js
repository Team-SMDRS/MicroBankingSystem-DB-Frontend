/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // important for React + TS
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F9FD',
        primary: '#001F5B',
        secondary: '#0A4DA6',
        tertiary: '#84B9E8',
        highlight: '#FFC107',
        highlightHover: '#FFD54F',
        borderLight: '#E6EFF9',
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s infinite',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-in-left': 'slide-in-left 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'bounce-soft': 'bounce-soft 0.6s ease-in-out',
        'scale-pop': 'scale-pop 0.3s ease-out',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 }
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'scale-pop': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 }
        }
      }
    },
  },
  plugins: [],
}

