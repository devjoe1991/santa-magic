# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Santa Doorbell Magic is a UK-based Christmas-themed web application that transforms doorbell footage into personalized Santa Claus videos. Users upload their doorbell video, pay £12.50, and receive a magical 8-second video of Santa delivering a present. Built with Next.js 14 and integrates with Stripe for payments, Supabase for backend/storage, and Nano Banana API for AI video processing.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server
pnpm dev

# Build production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Tech Stack & Architecture

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Christmas theme and shadcn/ui components
- **Typography**: Playfair Display (headings), Inter (body), Mountains of Christmas (festive accents)
- **Backend**: Supabase Edge Functions
- **Storage**: Supabase Buckets (raw-uploads/, processed/)
- **Payments**: Stripe Checkout (£12.50 per video)
- **Video Processing**: Nano Banana API
- **Email**: Resend/SendGrid integration
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Key Components Structure

### Core Components
- `app/page.tsx` - Landing page with hero, demo video, features, testimonials
- `app/upload/page.tsx` - Video upload and payment flow
- `app/how-it-works/page.tsx` - Process explanation page
- `components/Navbar.tsx` - Navigation with Christmas branding
- `components/Footer.tsx` - Site footer
- `lib/utils.ts` - Utility functions (cn for class merging)

### UI System
- Uses shadcn/ui components located in `components/ui/`
- Christmas color palette: christmasRed (#C1272D), evergreen (#1B4D3E), warmGold (#FFD700), frostBlue (#A9D6E5)
- Custom shadows: glow, gold, frost
- Font variables: --font-inter, --font-playfair, --font-mountains

## User Flow Architecture

1. **Landing Page** → Hero with demo video and CTA
2. **Upload Flow** → File upload + Stripe payment (£12.50)
3. **Processing** → Supabase Edge Function → Nano Banana API → AI processing
4. **Delivery** → Processed video stored in Supabase → Email notification

## Design System

### Color Usage
- Primary CTAs: `christmasRed` (#C1272D)
- Secondary elements: `evergreen` (#1B4D3E)
- Accents: `warmGold` (#FFD700)
- Backgrounds: `frostBlue` (#A9D6E5), `cream` (#FFF9F0)

### Typography Classes
- `font-heading` - Playfair Display for titles
- `font-body` - Inter for body text
- `font-festive` - Mountains of Christmas for special elements

### Component Patterns
- Cards use `bg-cream border-2 border-warmGold/20 shadow-frost`
- Primary buttons use `bg-christmasRed hover:bg-[#A71D23] text-white shadow-glow`
- Gradients and blur effects for hero sections

## Integration Points

### Stripe Integration
- Checkout flow integrated in upload page
- £12.50 fixed price
- Webhooks trigger Supabase Edge Functions

### Supabase Integration
- Edge Functions handle payment validation and API calls
- Buckets store raw uploads and processed videos
- Row Level Security (RLS) for access control

### Nano Banana API
- Processes raw doorbell footage
- Adds realistic Santa overlay
- Returns 8-second processed video

## Development Notes

- Uses pnpm as package manager
- TypeScript configured with strict mode
- Path alias `@/*` maps to project root
- Authentication structure is prepared but not implemented (see isUserSignedIn in Navbar)
- Mobile-first responsive design approach
- UK localization (£ currency, British English)