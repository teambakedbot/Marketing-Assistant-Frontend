import {fontFamily} from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
      extend: {
         colors: {
            dark: {0: "#0B0101"},
            slate: {900: "#06152B"},
            gray: {
               400: "#99B2C6",
               700: "#384455",
               600: "#636363",
               950: "#0B0B0B",
               900: "#090909",
               800: "#080909",
            },
            neutral: {
               400: "#9D9696",
               500: "#898989",
               600: "#775DA6",
               700: "#5A5A5A",
               800: "#504B4B",
               950: "#0F0F0F",
            },
            stone: {800: "#202020"},
            red: {400: "#BD0505", 500: "#F3654A", 600: "#D13434", 700: "#F10F0F", 800: "#F00C0C"},
            amber: {400: "#FFB536"},
            yellow: {600: "#F27A0C"},
            emerald: {300: "#70B6C1", 400: "#1AD598", 500: "#4CAF50"},
            cyan: {900: "#344767"},
            blue: {400: "#2305FB", 500: "#217EFD"},
            fuchsia: {500: "#DB5AEE"},
         },
         fontSize: {
            xs: ["10px", {lineHeight: "1.4em"}],
            sm: ["11px", {lineHeight: "1.36em"}],
            md: ["12px", {lineHeight: "1.42em"}],
            base: ["13px", {lineHeight: "1.38em"}],
            lg: ["14px", {lineHeight: "1.21em"}],
            xl: ["15px", {lineHeight: "1.4em"}],
            "3xl": ["16px", {lineHeight: "1.38em"}],
            "4xl": ["18px", {lineHeight: "1.22em"}],
            "5xl": ["20px", {lineHeight: "1.4em"}],
            "6xl": ["22px", {lineHeight: "1.23em"}],
            "7xl": ["24px", {lineHeight: "1.42em"}],
            "8xl": ["36px", {lineHeight: "1.28em"}],
            "9xl": ["40px", {lineHeight: "1.4em"}],
         },
         boxShadow: {
            sm: "0px 2px 6px rgba(0, 0, 0, 0.25)",
            md: "0px 1px 2px rgba(0, 0, 0, 0.08)",
            lg: "0px 4px 12px #AFAFAF",
         },
      },
      fontFamily: {
         roboto: ["'Roboto'", ...fontFamily.sans],
         "istok-web": ["'Istok Web'", ...fontFamily.sans],
         "shadows-into-light": ["'Shadows Into Light'", ...fontFamily.sans],
         "rhodium-libre": ["'Rhodium Libre'", ...fontFamily.sans],
         "reenie-beanie": ["'Reenie Beanie'", ...fontFamily.sans],
         "wendy-one": ["'Wendy One'", ...fontFamily.sans],
         inter: ["'Inter'", ...fontFamily.sans],
         jost: ["'Jost'", ...fontFamily.sans],
      },
      backgroundImage: {
         "grey-grey": "linear-gradient(180deg, #3E3D45 0%, #202020 100%)",
         "green-emerald": "linear-gradient(180deg, #63B967 0%, #4BA64F 100%)",
         "blue-blue": "linear-gradient(180deg, #439DEE 0%, #1E78E9 100%)",
         "red-pink": "linear-gradient(180deg, #E93B77 0%, #DA1F63 100%)",
         dark: "linear-gradient(180deg, #3E3D45 0%, #202020 100%)",
         "blue-black": "linear-gradient(180deg, #2305FB 0%, #202020 100%)",
      },
      container: {
         center: true,
         padding: {
            DEFAULT: "0.750rem",
         },
      },
   },
   plugins: [],
};
