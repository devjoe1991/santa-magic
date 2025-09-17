# Product Requirements Document (PRD)

## Project Title
Santa Doorbell Magic – Personalized Santa Claus Video Generator

## Overview
A UK-based Christmas-themed web application where customers can upload their doorbell/doorcam footage and receive a personalized 8-second video of Santa Claus delivering a present and disappearing. The process is automated via Nano Banana API, with payments handled seamlessly through the landing page. Final videos are emailed to customers within minutes of purchase.

---

## Goals
- Deliver a magical, highly shareable Santa Claus video product.
- Provide a frictionless user experience: upload → pay → receive video.
- Monetize through a flat fee of **£12.50 per video**.
- Build trust with a Christmas-themed, UK-centric design.
- Ensure scalability during seasonal demand spikes.

---

## Key Features
1. **Landing Page (Christmas-themed)**
   - Showcase demo videos and testimonials.
   - Clear CTA: "Upload Your Video & Get Your Santa Magic".
   - FAQ, trust signals, and process explanation.

2. **Upload & Payment**
   - Users upload doorbell footage (MP4, MOV).
   - Payment integration (Stripe recommended).
   - £12.50 per processed video.

3. **Video Processing**
   - Uploaded video sent to **Nano Banana API**.
   - Background is processed and Santa asset integrated.
   - Processing runs via Supabase Edge Functions for security.

4. **Delivery**
   - Final video stored in Supabase storage.
   - Email with download link sent to customer.

---

## User Flow
1. User lands on Christmas landing page.
2. User clicks "Upload Your Video".
3. Upload form + payment checkout appear.
4. After payment, video is queued and sent to backend.
5. Nano Banana processes video with Santa overlay.
6. Completed video uploaded to Supabase storage.
7. Customer receives email with secure download link.

---

## Technical Requirements
- **Frontend:** Next.js (hosted on Vercel)
- **Backend/Serverless:** Supabase Edge Functions
- **Storage:** Supabase Buckets
- **Processing API:** Nano Banana
- **Auth/Payments:** Stripe (one-time checkout)
- **Email Delivery:** Supabase Functions + Resend/SendGrid
- **Deployment:** Vercel + Supabase

---

## Success Metrics
- Conversion rate from landing page to purchase.
- Average processing + delivery time.
- Customer satisfaction (feedback/email replies).
- Number of seasonal orders (target 1,000+ videos).

---

## Constraints
- Seasonal time-critical (must be live in the next two days).
- Videos must remain short (~8 seconds).
- Processing reliability depends on Nano Banana API.
- Price fixed at £12.50.

---

## Future Enhancements
- Add multiple Santa variations (different poses, outfits).
- Offer upsell packages (HD export, personalized message).
- Introduce referral/discount codes.