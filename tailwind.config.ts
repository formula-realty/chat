import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        formula: {
          ink: "#201D1E",
          muted: "#716B66",
          line: "#E7E0D7",
          surface: "#FFFFFF",
          soft: "#F7F2EA",
          accent: "#201D1E",
          accentDark: "#000000",
          gold: "#C6A56D"
        }
      },
      boxShadow: {
        chat: "0 24px 70px rgba(32, 29, 30, 0.16)",
        soft: "0 12px 34px rgba(32, 29, 30, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
