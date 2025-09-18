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
        // 🎅 Enhanced Christmas Theme Colors - Bold & Vibrant
        christmasRed: "#FF0040",
        electricGreen: "#00FF88",
        berryRed: "#D2001F",
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
          DEFAULT: "#FF0040", // Vibrant Christmas Red
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
        display: ["var(--font-bebas)", "Impact", "Arial Black", "sans-serif"],
        heading: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        body: ["var(--font-poppins)", "system-ui", "sans-serif"],
        festive: ["var(--font-mountains)", "serif"],
      },
      fontSize: {
        // Massive Typography Scale
        'display': ['7.5rem', { lineHeight: '0.9', letterSpacing: '-0.02em', fontWeight: '400' }], // 120px
        'display-sm': ['4.5rem', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '400' }], // 72px
        'hero': ['4rem', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '900' }], // 64px
        'hero-sm': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '900' }], // 48px
        'title': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }], // 56px
        'title-sm': ['2.25rem', { lineHeight: '1.2', fontWeight: '800' }], // 36px
        'subtitle': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }], // 40px
        'subtitle-sm': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }], // 28px
        'body-lg': ['1.25rem', { lineHeight: '1.5', fontWeight: '500' }], // 20px
        'body': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }], // 18px
        'button-lg': ['1.25rem', { lineHeight: '1.5', fontWeight: '700' }], // 20px
        'button': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }], // 18px
      },
      boxShadow: {
        // Enhanced Glow Effects
        glow: "0px 4px 20px rgba(255, 0, 64, 0.4), 0px 0px 40px rgba(255, 0, 64, 0.2)",
        "glow-lg": "0px 8px 40px rgba(255, 0, 64, 0.6), 0px 0px 60px rgba(255, 0, 64, 0.3)",
        "glow-pulse": "0px 0px 20px rgba(255, 0, 64, 0.5), 0px 0px 40px rgba(255, 0, 64, 0.3), 0px 0px 60px rgba(255, 0, 64, 0.1)",
        gold: "0px 4px 20px rgba(255, 215, 0, 0.4)",
        "gold-lg": "0px 8px 40px rgba(255, 215, 0, 0.6)",
        frost: "0px 6px 24px rgba(169, 214, 229, 0.2)",
        electric: "0px 4px 20px rgba(0, 255, 136, 0.4), 0px 0px 40px rgba(0, 255, 136, 0.2)",
      },
      backgroundImage: {
        // Vibrant Gradients
        "hero-gradient": "linear-gradient(135deg, #FF0040 0%, #00FF88 50%, #FFD700 100%)",
        "button-gradient": "linear-gradient(90deg, #FF0040 0%, #D2001F 100%)",
        "text-gradient": "linear-gradient(90deg, #FF0040, #00FF88, #FFD700, #FF0040)",
        "frost-gradient": "linear-gradient(180deg, #E0F7FF 0%, #A9D6E5 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Enhanced Animations
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 0, 64, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 0, 64, 0.8), 0 0 60px rgba(255, 0, 64, 0.4)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "rainbow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
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
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "rainbow": "rainbow 3s ease infinite",
        "float": "float 3s ease-in-out infinite",
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
