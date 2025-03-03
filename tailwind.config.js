/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  
  theme: {
    extend: {
      colors:{
        // 2EDBF2
        primary: '#826aed',
      }
    },
  },
  plugins: [],
}

