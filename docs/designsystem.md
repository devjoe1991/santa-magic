# 🎄 Santa Doorbell Magic – Design System

A consistent design system for the Christmas-themed web app.

---

## 1. Brand Identity

- **Theme:** Magical, festive, warm, family-oriented.
- **Tone:** Friendly, trustworthy, fun.
- **Logo/Wordmark:** Simple Santa + gift icon, paired with a warm serif font for “Santa Doorbell Magic”.
- **Imagery Style:** Realistic festive photography + playful Santa illustrations.

---

## 2. Colors

### 🎅 Primary Palette
- **Christmas Red:** `#C1272D`
- **Evergreen:** `#1B4D3E`
- **Snow White:** `#FFFFFF`

### ✨ Secondary Palette
- **Warm Gold:** `#FFD700`
- **Frost Blue:** `#A9D6E5`
- **Cream:** `#FFF9F0`

### 🌑 Neutral Palette
- **Charcoal Black:** `#1E1E1E`
- **Cool Gray:** `#D1D5DB`
- **Light Frost:** `#F3F4F6`

---

## 3. Typography

- **Headings:**  
  - Font: **"Playfair Display"** (serif, elegant)  
  - Weight: 600–700  
  - Example: `font-family: 'Playfair Display', serif;`

- **Body Text:**  
  - Font: **"Inter"** (sans-serif, modern, readable)  
  - Weight: 400–500  
  - Example: `font-family: 'Inter', sans-serif;`

- **Accent Text:**  
  - Font: **"Mountains of Christmas"** (festive headings/CTAs, used sparingly)  

---

## 4. Spacing & Layout

- **Container Width:** max `1200px`, centered.  
- **Grid:** 12-column responsive grid.  
- **Spacing Scale (px):** `4, 8, 12, 16, 24, 32, 48, 64`.  
- **Border Radius:** `16px` (cards, inputs, buttons).  
- **Shadows:** soft glow (`0px 4px 20px rgba(193, 39, 45, 0.2)`).

---

## 5. Components

### Buttons
- **Primary CTA Button**
  - Background: Christmas Red `#C1272D`
  - Text: White
  - Hover: Darker red `#A71D23`
  - Border-radius: `16px`
  - Padding: `12px 24px`
  - Shadow: Soft gold glow

- **Secondary Button**
  - Background: Evergreen `#1B4D3E`
  - Text: White
  - Hover: Lighter green `#236B57`

---

### Inputs & Upload Fields
- Background: White
- Border: `2px solid #D1D5DB`
- Focus: Red border glow `#C1272D`
- Rounded corners: `12px`
- Padding: `10px 16px`

---

### Cards
- Background: White or Cream `#FFF9F0`
- Border-radius: `16px`
- Padding: `24px`
- Shadow: Subtle frost shadow

---

### Modals
- Background: White with frosted glass effect (`backdrop-filter: blur(10px)`)
- Border-radius: `20px`
- Close button styled as gold ✨

---

## 6. Imagery & Iconography

- **Icons:** Use `lucide-react` or custom festive SVGs.  
- **Illustrations:** Santa, presents, snowflakes, wreaths (consistent style).  
- **Photography:** Real doorbell footage samples + cozy UK homes.  

---

## 7. Motion & Animation

- **Page Load:** Snowfall effect (subtle, looping).  
- **Button Hover:** Scale up `1.05x` with smooth ease.  
- **Santa Demo Video:** Auto-play loop muted on landing page.  

---

## 8. Accessibility

- Contrast ratio: Minimum **4.5:1**.  
- Alt text for all images (e.g., “Santa delivering a present”).  
- Focus states visible (gold outline).  
- Responsive across mobile, tablet, desktop.

---

## 9. Example Usage

### Landing Page Hero
- Background: Frost Blue gradient → Snow White.  
- Heading: "Bring Santa to Your Doorstep 🎅" (Playfair Display).  
- Subheading: Friendly Inter font.  
- CTA Button: Christmas Red, glow effect.  
- Demo Video: Centered, framed in festive border.  

---

## 10. Assets & Tools

- **Fonts:** Google Fonts (Playfair Display, Inter, Mountains of Christmas).  
- **Icons:** Lucide-react + festive custom set.  
- **Animations:** Framer Motion + CSS snowfall.  
- **Illustrations:** Undraw or custom vector pack (Christmas theme).