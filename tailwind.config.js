/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // important for React + TS
  ],
  theme: {
    extend: {
      animation: {
        'pulse-subtle': 'pulse-subtle 3s infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 }
        }
      }
    },
  },
  plugins: [],
}

