import type { Config } from "tailwindcss";

// Note: In Tailwind CSS v4, configuration is primarily done in your global CSS file
// (e.g., src/app/globals.css) using the `@theme` directive.
// This tailwind.config.ts is provided for backward compatibility and editor integration.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
