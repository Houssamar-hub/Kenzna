/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kenzna: {
          cream: '#FAF9F6',
          beige: '#F4F1EA',
          sand: '#EAE5DB',
          light: '#F8F9FA',
          brown: '#2C1D11',
          'brown-light': '#4A3525',
          dark: '#1A120B',
          green: '#22C55E',
          'green-dark': '#16A34A',
          'green-deep': '#15803D',
          'green-light': '#DCFCE7',
          'green-soft': '#F0FDF4',
          amber: '#F59E0B',
          'amber-hover': '#D97706',
          'amber-light': '#FEF3C7',
          gold: '#EAB308',
          'gold-light': '#FEF9C3',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(61, 38, 25, 0.06)',
        'card': '0 10px 30px -4px rgba(61, 38, 25, 0.08)',
        'premium': '0 20px 40px -10px rgba(61, 38, 25, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
