import { defineConfig } from "windicss/helpers";

export default defineConfig({
  extract: {
    include: ["**/*.{jsx,tsx,css,sass}"],
    exclude: ["node_modules", ".git", ".next"],
  },
  darkMode: "class",
});
