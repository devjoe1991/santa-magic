# Design & Architecture Document

## System Architecture
[Client Browser] → [Next.js Frontend on Vercel]
↓ Upload + Payment
[Stripe Checkout] → [Supabase Edge Function]
↓ Validate Payment
[Nano Banana API Processing]
↓ Save Output
[Supabase Storage] → [Email Service]
↓
[Customer Receives Final Video Link]
---

## Components

### 1. **Frontend (Next.js on Vercel)**
- **Landing Page**
  - Hero section with Christmas theme & Santa demo.
  - CTA button: "Upload Your Video".
  - FAQ, trust section, UK branding.
- **Upload Form**
  - Accepts MP4/MOV files (max 30s).
  - Integrated with Stripe Checkout.
  - After payment, triggers Supabase Edge Function call.

---

### 2. **Backend**
- **Supabase Edge Functions**
  - Handle webhook from Stripe (verify payment success).
  - Accept uploaded video metadata (stored in Supabase).
  - Call **Nano Banana API** with video + Santa overlay parameters.
  - Poll until processing complete.
  - Save processed video to Supabase Storage.
  - Trigger email notification to customer.

---

### 3. **Storage**
- Supabase Buckets for:
  - `raw-uploads/` (original user videos).
  - `processed/` (final Santa videos).

---

### 4. **Processing**
- **Nano Banana API**
  - Input: Uploaded raw video.
  - Processing: Add realistic Santa overlay.
  - Output: 8-second processed video.

---

### 5. **Payments**
- Stripe Checkout (one-time £12.50).
- Webhooks used to confirm transaction before video processing.

---

### 6. **Emails**
- Transactional emails:
  - Payment confirmation.
  - Final video download link.
- Service: Resend or SendGrid integrated via Supabase Function.

---

## Data Flow
1. User uploads → Next.js sends video to Supabase.
2. Stripe Checkout completes → webhook triggers Edge Function.
3. Edge Function sends video to Nano Banana API.
4. Processed video returned → saved to Supabase Storage.
5. Email service sends secure download link to user.

---

## Security Considerations
- Signed URLs for video downloads (expire after X hours).
- Stripe handles all payment data (PCI compliant).
- Supabase Row Level Security (RLS) for storage.
- Edge Functions validate payment + ownership before processing.

---

## UI/UX Design Principles
- Full Christmas theme (reds, greens, snowflakes, Santa visuals).
- Mobile-first responsive design (most traffic via phones).
- Clear 3-step journey: **Upload → Pay → Receive**.
- UK localization (currency, wording).
- Trust elements: demo video, FAQs, testimonials.

---

## Timeline (MVP)
- **Week 1:** Landing page setup (Next.js + theme).
- **Week 2:** Stripe payment + upload flow.
- **Week 3:** Nano Banana integration + Edge Functions.
- **Week 4:** Email delivery + storage handling.
- **Week 5:** Polish, QA, deploy.

---

## Future Architecture Additions
- Admin dashboard to track orders + statuses.
- Queue management system for high traffic.
- Optional personalization features (name on gift bag, custom Santa look).