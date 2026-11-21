import type { Config } from "tailwindcss";

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
        // Custom AQI colors with WCAG 2.1 AA contrast compliance
        aqi: {
          good: "#059669", // emerald-600
          moderate: "#d97706", // amber-600
          unhealthySensitive: "#ea580c", // orange-600
          unhealthy: "#dc2626", // red-600
          veryUnhealthy: "#7c3aed", // violet-600
          hazardous: "#881337", // rose-900
        },
      },
    },
  },
  plugins: [],
};
export default config;
