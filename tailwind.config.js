/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // This line ensures Tailwind applies styles to MUI components as well
    "./node_modules/@mui/material/**/*.js"
  ],
  theme: {
    extend: {
      animation: {
        expandPadding: "expandPadding 0.3s ease-out forwards",
      },
      keyframes: {
        expandPadding: {
          "0%": { paddingLeft: "0px", paddingRight: "0px" },
          "100%": { paddingLeft: "20px", paddingRight: "20px" }, // `px-5` in Tailwind
        },
      },
    },
  },
  plugins: [
    // If you wish to use DaisyUI or other plugins, you can uncomment this line
    // require('daisyui'),
  ],
}
