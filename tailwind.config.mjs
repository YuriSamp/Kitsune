const {fontFamily} = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#ede0d8',
        secondary: '#d41b1bf3',
      },
      fontFamily: {
        sans: ['Satoshi', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
