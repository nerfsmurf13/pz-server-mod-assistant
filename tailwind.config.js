/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pzYellow: "#edd93e",
        pzPurple: "#8973d9",
        pzBg: "#73ab62",
        pzBlue: "#7fc2d2",
        pzGreen: "#55ad45",
        pzLightbaige: "#d1cbb2",
        pzBaige: "#dba574",
        pzDark: "#394242",
        pzRed: "#dc7c8a",
        pzGray: "#b7b1a5",
      },
    },
  },
  plugins: [],
};
