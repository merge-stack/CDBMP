/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#476A48',
          light: '#DEE8DC',
          dark: '#426345',
        },
        secondary: {
          DEFAULT: '#DEE8DC',
        },
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};
