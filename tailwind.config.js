/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      colors: {
        themecolor: '#082a26',
        milky: '#ECF9FF',
        pink: '#F5F5F5'
      },
    },
  },
  plugins: [
    // ...
    require('@tailwindcss/typography'),
  ],
};
