/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mamaeBg: "#FDE7EF",
        mamaePrimary: "#F9A9C8",
        mamaeDark: "#D4537E",
        mamaeText: "#5C4550",
        mamaeTextSec: "#8C7480",
        mamaeCream: "#FFF6F9",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        albert: ["Albert Sans", "sans-serif"],
      },
      borderRadius: {
        card: "22px",
      },
      boxShadow: {
        mamae: "0 8px 24px rgba(212, 83, 126, 0.08)",
        mamaeStrong: "0 20px 60px rgba(92, 69, 80, 0.25)",
      }
    },
  },
  plugins: [],
}
