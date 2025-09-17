# 🎄 Santa Doorbell Magic – Tailwind Config

```js
// tailwind.config.js
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎅 Primary Palette
        christmasRed: "#C1272D",
        evergreen: "#1B4D3E",
        snowWhite: "#FFFFFF",

        // ✨ Secondary Palette
        warmGold: "#FFD700",
        frostBlue: "#A9D6E5",
        cream: "#FFF9F0",

        // 🌑 Neutral Palette
        charcoal: "#1E1E1E",
        coolGray: "#D1D5DB",
        lightFrost: "#F3F4F6",
      },
      fontFamily: {
        heading: ["'Playfair Display'", ...fontFamily.serif],
        body: ["Inter", ...fontFamily.sans],
        festive: ["'Mountains of Christmas'", ...fontFamily.serif],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        glow: "0px 4px 20px rgba(193, 39, 45, 0.2)", // red glow
        gold: "0px 4px 20px rgba(255, 215, 0, 0.4)", // gold glow
        frost: "0px 6px 24px rgba(169, 214, 229, 0.2)", // frosty shadow
      },
      spacing: {
        4: "4px",
        8: "8px",
        12: "12px",
        16: "16px",
        24: "24px",
        32: "32px",
        48: "48px",
        64: "64px",
      },
    },
  },
  plugins: [],
};

---

### ✅ Example Component Usage
```tsx
<button className="bg-christmasRed text-snowWhite font-body px-6 py-3 rounded-xl shadow-gold hover:bg-[#A71D23] transition-transform transform hover:scale-105">
  Upload Your Video 🎅
</button>

<div className="bg-cream shadow-frost rounded-2xl p-8">
  <h2 className="font-heading text-3xl text-evergreen">How It Works</h2>
  <p className="font-body text-charcoal mt-4">
    Upload your doorbell video, pay £12.50, and receive your Santa Magic in minutes!
  </p>
</div>