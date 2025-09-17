/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 🎅 Christmas Theme Colors
        christmasRed: "#C1272D",
        evergreen: "#1B4D3E",
        snowWhite: "#FFFFFF",
        warmGold: "#FFD700",
        frostBlue: "#A9D6E5",
        cream: "#FFF9F0",
        charcoal: "#1E1E1E",
        coolGray: "#D1D5DB",
        lightFrost: "#F3F4F6",
        
        // Shadcn UI Colors (keeping for compatibility)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        special: "hsl(var(--special))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#C1272D", // Christmas Red
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1B4D3E", // Evergreen
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#FFD700", // Warm Gold
          foreground: "#1E1E1E",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["Inter", "sans-serif"],
        festive: ["'Mountains of Christmas'", "serif"],
      },
      boxShadow: {
        glow: "0px 4px 20px rgba(193, 39, 45, 0.2)",
        gold: "0px 4px 20px rgba(255, 215, 0, 0.4)",
        frost: "0px 6px 24px rgba(169, 214, 229, 0.2)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      maxWidth: {
        "8xl": "1408px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
