/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "321px",
      sm: "390px",
      xsm: "456px",
      xxsm: "600px",
      md: "769px",
      lg: "1025px",
      xm: "1200px",
      xmd: "1366px",
      xl: "1440px",
      xxl: "1600px",
      xxxl: "1920px",
    },
    fontFamily: {
      Lexend: ["Lexend"],
      Inter: ["Inter"],
      NanumGothic: ["NanumGothic"],
    },
    safelist: [
      "animate-[fade-in_1s_ease-in-out]",
      "animate-[fade-in-down_1s_ease-in-out]",
    ],
    extend: {
      backgroundImage: {
        "gradient-redmain": "linear-gradient(to right, #ff0049  , #ff3e47 )",
        "gradient-redcol": "linear-gradient(to bottom, #ff0049 , #ff3e47)",
        "gradient-purple": "linear-gradient(101deg, #153234, #2d3164)",
        "gradient-green":
          "linear-gradient(101deg, rgba(16, 163, 218, 0.15) 95.62%, rgba(209, 14, 209, 0.15) 0%",
        "gradient-pink":
          "linear-gradient(101deg, rgba(16, 163, 218, 0.15) 95.62%, rgba(209, 14, 209, 0.15) 0%",
        "gradient-radical": "radial-gradient(circle,  #2b88dd, #2b5797)",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "body-box": "rgba(255, 255, 255, 0.05)",
        "body-bg": "rgba(255, 255, 255, 0.00)",
        "button-gradient":
          "linear-gradient(108deg, #C517D1 0%, #2592D9 101.4%)",
        "gradient-gray":
          "linear-gradient(108.24deg, rgba(199, 210, 235, 0.15) 40%, rgba(0, 0, 0, 0.15) 10%, rgba(37, 146, 217, 0.15) 50%)",
        "gradient-dark-pink":
          "linear-gradient(108.24deg, rgba(197, 23, 209, 0.15) 0%, rgba(37, 146, 217, 0.15) 100%)",
        "gradiant-active-pink":
          "linear-gradient(108deg, rgba(37, 146, 217, 0.15) 10%, rgba(197, 23, 209, 0.15) 90%)",
        "black-gradient-cover":
          "linear-gradient(0deg, rgba(12,10,20,1) 3%, rgba(12,10,20,0.7203256302521008) 15%, rgba(12,10,20,0.5046393557422969) 21%, rgba(12,10,20,0) 27%, rgba(12,10,20,0) 100%)",
      },
      colors: {
        theme_color: "#cc0000",
        // admin_theme_color: "#f6f8fa",
        admin_theme_color: "#26619C",
        theme_text_color: "#595959",
        theme_headertext_color: "#262626",
        alert_success: "#3ebaf4",
        alert_error: "#ff6600",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "50", transform: "scale(0.5)" },
          "100%": { opacity: "100", transform: "scale(1)" },
        },
        animatezoom: {
          from: { transform: "scale(0)" },
          to: { transform: "scale(1)" },
        },
        animatepop: {
          from: { transform: "scale(0)" },
          to: { transform: "scale(1)" },
        },
        displayEase: {
          "0%": { opacity: "0%" },
          "10%": { opacity: "100%" },
          "60%": { opacity: "100%" },
          "100%": { opacity: "0%" },
        },
      },
      animation: {
        fadeIn: "fadeIn .3s linear infinite",
        animatezoom: "animatezoom 1s ease-in-out",
        animatepop: "animatepop 1s ease-in-out",
        displayEase: "displayEase 3s linear",
      },
    },
    plugins: [],
  },
};
