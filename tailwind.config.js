/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      backgroundImage: {
        'hero-pattern': "url('./public/assets/background-precsys.jpg')"
      }
    },
  },
  plugins: [],
  darkMode: 'selector',
}

