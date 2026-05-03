# ServiceSpeak AI — Landing Page PRD

## Original Problem Statement
Build a professional landing page for 'ServiceSpeak AI', an AI Automation Agency specializing in AI Receptionists for local field service businesses (plumbers, HVAC, electricians). Hero "Never miss a lead again with 24/7 AI answering", core services (Automated Booking, FAQ handling, Lead Capture), How it works, strong free-demo CTA. Modern trustworthy blue/white palette.

## User Personas
- Owner/operator of small-to-mid local trades shop (plumbing, HVAC, electrical)
- Office manager evaluating dispatch/answering solutions
- Multi-location franchise considering AI receptionist pilot

## Architecture
- Frontend-only React (CRA + craco) with Tailwind + shadcn/ui
- No backend; demo form shows toast confirmation (mock)
- Sticky glassmorphism nav, asymmetric Swiss/Brutalist layout
- Fonts: Cabinet Grotesk (display) + Manrope (body) + JetBrains Mono (accents)

## What's Implemented (Dec 2025)
- Sticky header with smooth scroll nav + mobile menu
- Hero: split asymmetric layout, live-call transcript visual, $18,420 floating chip
- Trusted-by infinite marquee (10 trade names)
- Services bento grid: Automated Booking (calendar mockup), FAQ Handling (dark card), Lead Capture (full-width with mock lead)
- How It Works: dark vertical timeline, 4 steps, integration logos strip
- Outcomes: 4 massive metrics + 3 testimonial cards with Unsplash imagery
- FAQ: 6-item shadcn Accordion
- CTA: blue block with offset-shadow form card, Sonner toast on submit (MOCKED — no backend persistence)
- Footer: brand, link columns, contact, legal

## Backlog
- P1: Backend `/api/leads` endpoint to persist demo requests in MongoDB
- P1: Email/SMS notification on new lead (Resend or Twilio)
- P2: Real audio sample of AI answering a call
- P2: Pricing section + plan comparison
- P2: Case-study deep-dive pages
- P2: Blog / SEO content layer

## Mocked / Stubbed
- Demo form submission: shows toast only, no persistence (MOCKED)
- Trusted-by company names: representative, not actual customers
- Testimonial quotes: representative, photos from Unsplash
