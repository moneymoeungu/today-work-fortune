import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      colors: {
        night: { 900: "#140a2e", 800: "#1e1145", 700: "#2d1b69" },
        brand: { DEFAULT: "#7c4dff", dark: "#5b32d6" },
      },
    },
  },
  plugins: [],
};
export default config;
