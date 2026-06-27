/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', '"Apple SD Gothic Neo"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
