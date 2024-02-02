import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        "primary-bg": "#F5F5F5",
        "secondary-bg": "#E0E0E0",
        "accent-blue": "#007BFF",
        "secondary-accent": "#FFA500",
        dark: "#333333",
        "hover-blue": "#5CACEE",
      },
    },
  },
  plugins: [],
} satisfies Config;
