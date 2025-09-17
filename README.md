# 🎅 Seasonal Santa - Santa Doorbell Magic

**Santa Doorbell Magic** is a UK-based Christmas-themed web application that creates personalized Santa Claus videos from your doorbell footage. Upload your doorbell video, pay £12.50, and receive a magical 8-second video of Santa delivering a present and disappearing - all automated and delivered to your email within minutes!

## ✨ What It Does

Transform your ordinary doorbell footage into magical Christmas memories! Our app uses AI processing to seamlessly overlay Santa Claus delivering presents in your doorway, creating shareable holiday content that brings the magic of Christmas to your home.

## 🚀 Key Features

- **🎬 Video Processing**: Upload MP4/MOV doorbell footage (max 30s)
- **💳 Seamless Payments**: Stripe integration for secure £12.50 transactions
- **🤖 AI Magic**: Nano Banana API processes videos with realistic Santa overlays
- **📧 Instant Delivery**: Receive your video via email within minutes
- **🇬🇧 UK-Focused**: Christmas-themed design with UK localization
- **📱 Mobile-First**: Fully responsive design optimized for mobile users

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) on Vercel
- **Styling**: Tailwind CSS with custom Christmas theme
- **Components**: Shadcn/ui with festive design system
- **Backend**: Supabase Edge Functions
- **Storage**: Supabase Buckets for video management
- **Payments**: Stripe Checkout integration
- **Processing**: Nano Banana API for video magic
- **Email**: Resend/SendGrid for delivery notifications

## 🎨 Design System

### Christmas Color Palette
- **Christmas Red**: `#C1272D` (Primary CTAs)
- **Evergreen**: `#1B4D3E` (Secondary elements)
- **Warm Gold**: `#FFD700` (Accents and highlights)
- **Frost Blue**: `#A9D6E5` (Backgrounds)
- **Snow White**: `#FFFFFF` (Clean backgrounds)

### Typography
- **Headings**: Playfair Display (elegant serif)
- **Body Text**: Inter (modern, readable)
- **Festive Accents**: Mountains of Christmas (holiday flair)

## 🏗️ Architecture

```
[User Upload] → [Stripe Payment] → [Supabase Edge Function]
                                        ↓
[Nano Banana API] → [Video Processing] → [Supabase Storage]
                                        ↓
[Email Service] → [Customer Receives Video Link]
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
seasonal-santa/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── Navbar.tsx        # Navigation component
│   └── Footer.tsx        # Footer component
├── docs/                 # Project documentation
│   ├── prd.md           # Product Requirements
│   ├── architect.md     # System Architecture
│   ├── designsystem.md  # Design Guidelines
│   └── tailwindconfig.md # Tailwind Configuration
└── lib/                  # Utility functions
```

## 🎯 User Journey

1. **Land** on Christmas-themed landing page
2. **Upload** doorbell footage (MP4/MOV)
3. **Pay** £12.50 via Stripe Checkout
4. **Wait** while AI processes your video
5. **Receive** magical Santa video via email

## 🔧 Development

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Christmas theme
- **Components**: Shadcn/ui + custom festive components
- **State Management**: React hooks + Supabase
- **Deployment**: Vercel (frontend) + Supabase (backend)

## 📈 Success Metrics

- Conversion rate from landing page to purchase
- Average processing + delivery time
- Customer satisfaction and feedback
- Seasonal order volume (target: 1,000+ videos)

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

*Bring the magic of Christmas to your doorstep with Seasonal Santa! 🎄✨*
