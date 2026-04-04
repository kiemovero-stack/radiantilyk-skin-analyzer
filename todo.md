# AI Skin Analyzer - Project TODO

## Theme & Design
- [x] Premium dark/luxury theme with futuristic aesthetic (clinical/luxury/futuristic hybrid)
- [x] Custom color palette (deep purples, teals, golds for premium feel)
- [x] Mobile-first responsive design

## Landing Page
- [x] Hero section with app description and CTA
- [x] Feature highlights section
- [x] Medical disclaimer banner

## Photo Upload & Capture
- [x] Image upload component (drag & drop + file picker)
- [x] Camera capture support (mobile-friendly)
- [x] Image preview before analysis
- [x] Image validation (file size, format)

## AI Analysis Engine (Backend)
- [x] Advanced skin analysis prompt engineering (world-class dermatology system)
- [x] Image upload to S3 and pass URL to AI vision
- [x] Structured JSON output with all 8 report sections
- [x] Dynamic evidence-based scoring (not generic 70-75%)
- [x] Severity differentiation (mild, moderate, severe)
- [x] Missed conditions detection (e.g., acne scarring)
- [x] Skin type and tone detection (Fitzpatrick scale)
- [x] IPL contraindication awareness for Type V/VI

## Report Sections (Output)
- [x] Section 1: Revised Skin Health Score (with justification)
- [x] Section 2: Advanced Skin Analysis (categorized by severity)
- [x] Section 3: Missed Conditions Identified
- [x] Section 4: Top 2 Facial Treatments (only)
- [x] Section 5: Top 4 Skin Procedures (prioritized with reasoning)
- [x] Section 6: Recommended Skincare Products (3-5 only with purpose)
- [x] Section 7: Next-Level Insights (predictive aging, skin trajectory, cellular-level)
- [x] Section 8: Personalized Skin Optimization Roadmap (phased plan)

## Report UI
- [x] Premium report display with animated sections
- [x] Severity color coding (green/amber/red)
- [x] Score visualization (radial/circular gauge)
- [x] Treatment cards with priority badges
- [x] Phased roadmap timeline visualization

## Database & History
- [x] Database schema for analyses (skinAnalyses table)
- [x] Save analysis results per user
- [x] Analysis history page with list of past reports
- [x] View past report details

## User Features
- [x] Login/logout integration
- [x] Protected routes for analysis and history

## Testing
- [x] Vitest tests for skin analysis prompt and schema (18 tests)
- [x] Vitest tests for auth logout (1 test)

## Multi-Angle Photo Upload
- [x] Multi-angle upload UI (front, left, right face views)
- [x] Visual face silhouette guides for each angle
- [x] Allow analyzing with 1-3 images (front required, sides optional)
- [x] Pass all images to AI for comprehensive multi-angle analysis

## Service & Product Catalog Integration
- [x] Extract full service menu with pricing from uploaded image
- [x] Create shared service catalog data file
- [x] Update AI prompt to recommend ONLY from the user's service catalog
- [x] Display service names and prices in report recommendations
- [x] Include membership options in recommendations where relevant

## Updated Tests
- [x] Update vitest tests for new prompt and catalog (19 tests passing)

## Staff-Only Access
- [x] Restrict all routes (Analyze, History, Report) to authenticated users only
- [x] Redirect unauthenticated users to login
- [x] Landing page shows login prompt for non-authenticated visitors

## Patient Intake Form
- [x] Add patient info form before analysis (first name, last name, email, DOB)
- [x] Add patient fields to database schema (skinAnalyses table)
- [x] Pass patient info to backend with analysis request
- [x] Display patient info on report page
- [x] Display patient info in history list
- [x] Update tests for patient intake and auth restrictions

## Additional Requests
- [x] Store when the analysis was done (timestamp displayed on report/history)

## PDF Report Download
- [x] Install PDF generation library (pdfkit)
- [x] Create server-side PDF generation endpoint
- [x] Generate premium-styled PDF with all 8 report sections
- [x] Include patient info, score, conditions, treatments, and roadmap in PDF
- [x] Add "Download PDF" button on Report page

## Email Report
- [x] Set up email sending (Nodemailer with Gmail SMTP)
- [x] Configure RadiantilyK@gmail.com as sender
- [x] Create email template with report summary and score
- [x] Attach PDF report to email
- [x] Send to patient's email address
- [x] Add "Email Report" button on Report page
- [x] Show success/error feedback after sending
- [x] Gmail App Password validated via SMTP verification test
- [x] 22 tests passing (including PDF generation + email service tests)

## Bug Fixes
- [x] Fix photo upload failing - changed hidden file inputs from display:none to sr-only positioning for cross-browser compatibility
- [x] Fix AI analysis timing out - use S3 URLs instead of base64, reduce max_tokens, remove thinking mode, add logging
- [x] Fix full app crash "An unexpected error occurred" on published domain after analysis
- [x] Fix production timeout: Replace base64 tRPC upload with multipart/form-data Express route
- [x] Add client-side image compression (resize to 1200px max, JPEG 80% quality)
- [x] Fix React hooks order violation in Report.tsx (hooks called after early returns)

## Skincare Product Catalog Integration (rkaskin.co)
- [x] Scrape and catalog all products from rkaskin.co (names, prices, descriptions, categories)
- [x] Create shared product catalog data file with all products
- [x] Update AI prompt to recommend ONLY from the user's actual product catalog
- [x] Update report UI to display product recommendations with prices and links
- [x] Update tests for new product catalog integration (36 tests passing)

## PDF Report Fix
- [x] Fix distorted PDF report that is emailed to clients
- [x] Rebuild PDF layout with proper formatting, spacing, and readability
- [x] Test PDF output quality

## Client Analysis Comparison Feature
- [x] Audit database schema and history page for comparison support
- [x] Build server-side endpoint to fetch multiple analyses for comparison
- [x] Build comparison UI page with side-by-side analysis view
- [x] Show score progression, condition changes, and severity trends over time
- [x] Add comparison entry points from History page (select & compare)
- [x] Add navigation/routing for the comparison page
- [x] Write tests for comparison feature (39 tests passing)

## Email Sender Change
- [x] Update sender email from RadiantilyK@gmail.com to kV@rkaglow.com
- [x] Update GMAIL_APP_PASSWORD secret for new account

## Client-Facing Portal
- [x] Public client intake page (full name, DOB, email) — no login required
- [x] Skin concerns questionnaire (multi-select with common concerns)
- [x] Guided photo capture with visual guides for front/left/right views (face + body)
- [x] Public upload route (no auth required for client flow)
- [x] Client-specific AI prompt — layman-friendly language, Fitzpatrick-aware treatment stacking
- [x] Client-facing report page with simple explanations in plain English
- [x] Treatment simulation with AI-generated descriptions, before/after comparison, progress timeline
- [x] Automated 24hr follow-up email with check-in link to radiantapp.click
- [x] Automated 48hr follow-up email with check-in link to radiantapp.click
- [x] Add /client routes to App.tsx router
- [x] Write tests for client portal features (52 tests passing)

## Treatment Simulation
- [x] Add simulation schema to AI prompt (beforeDescription, afterDescription, improvementPercent, milestones)
- [x] Build before/after comparison UI on client report page
- [x] Build improvement gauge with percentage visualization
- [x] Build progress timeline with milestones (1 week, 1 month, 3 months, 6 months)
- [x] Fitzpatrick-aware simulation descriptions
- [x] Write tests for simulation schema (59 tests passing)

## Client Landing Page
- [x] Build branded landing page at /client with hero section
- [x] How It Works steps (4 steps: photos, AI analysis, plan, book)
- [x] Features grid (AI-Powered, Personalized, Fitzpatrick-Aware, Results in Minutes)
- [x] What You'll Get checklist
- [x] Testimonials section with 5-star reviews
- [x] Final CTA with booking link
- [x] Footer with links to radiantapp.click and rkaskin.co
- [x] Separate /client (landing) and /client/start (analysis) routes

## AI-Generated Treatment Simulation Images
- [x] Research and integrate OpenAI API (gpt-image-1) for treatment simulation
- [x] Build server-side endpoint to generate "after" images from client's uploaded photo
- [x] Support simulation for: fillers, laser, microneedling, wrinkle reduction, skin rejuvenation
- [x] Build before/after image slider UI on client report page
- [x] Write tests for simulation image feature (68 tests passing)

## Bug Fix: Simulation Images Not Working
- [x] Debug why AI simulation images are not generating/displaying
- [x] Fix root cause: simulations now complete BEFORE marking status as "completed" so report page has images on load
- [x] Test end-to-end simulation flow (68 tests passing)

## Bug Fix: Score Always 68
- [x] Fix AI prompt so every client gets a unique, accurate skin score (not always 68)
- [x] Added detailed scoring rubric to both client and staff AI prompts
- [x] Rubric: Start at 100, deduct per condition severity, add back for positive findings
- [x] Score ranges defined: Excellent (85-95), Good (70-84), Average (55-69), Below average (35-54), Poor (<35)

## Async Simulation Fix (Client Portal Not Hanging)
- [x] Make simulation image generation fully asynchronous — analysis marks "completed" immediately
- [x] Client report page loads instantly after AI text analysis finishes
- [x] Simulation images generate in background (fire-and-forget)
- [x] Add polling logic on ClientReport.tsx — polls /api/client/simulations/:id every 10 seconds
- [x] Show "Generating Your Treatment Preview" loading indicator while simulations generate
- [x] Simulations appear automatically on report page when ready (no page refresh needed)
- [x] Server-side /api/client/simulations/:id endpoint returns { ready, simulationImages }

## History Page Search & Filter
- [x] Add search bar to History page — search by name, email, or skin type
- [x] Add date filter dropdown (All Time, Today, Past 7 Days, Past 30 Days)
- [x] Show result count ("Showing X of Y analyses")
- [x] Clear filters button when filters are active
- [x] Empty state when no results match search criteria
- [x] Write tests for new features (76 tests passing)

## Change: Single Combined Simulation Image
- [x] Generate ONE simulation image combining ALL recommended procedures (not separate per procedure)
- [x] Update simulation prompt to describe combined results of all treatments
- [x] Update client report to show single before/after slider
- [x] Faster and cheaper (1 API call instead of 4)

## Share Results Button
- [x] Add "Share Results" button to ClientReport page
- [x] Support sharing via native share API (mobile), copy link, email, and text/SMS
- [x] Show share modal with options on desktop

## Staff Notification on Client Analysis Completion
- [x] Send email to staff (kV@rkaglow.com) when a new client analysis completes
- [x] Include client name, score, top concerns, and link to report in notification email

## Product Images from rkaskin.co
- [x] Scrape product images from rkaskin.co for all catalog products
- [x] Update product catalog with image URLs
- [x] Display product images alongside recommendations in client report

## Test Follow-Up Emails (old)
- [x] Verify 24hr and 48hr follow-up email scheduling works
- [x] Confirm emails include booking link updated to rkaemr.click/portal

## Update Booking URL
- [x] Change booking URL from radiantapp.click to rkaemr.click/portal throughout the app

## Share Results Button
- [x] Add Share Results button to client report (native share, copy link, email, text)

## Staff Notification Email
- [x] Send staff email notification when new client analysis completes

## Product Images from rkaskin.co
- [x] Add generic product category icons alongside recommendations in client report (per brand guidelines)

## Test Follow-Up Emails
- [x] Verify 24hr/48hr follow-up emails have correct booking link (rkaemr.click/portal)
- [x] Note: Follow-up emails use in-memory setTimeout (lost on server restart)

## Persistent Follow-Up Email Scheduler
- [x] Create scheduledEmails database table (id, analysisId, emailType, scheduledAt, sentAt, status, config)
- [x] Migrate followUpService from in-memory setTimeout to DB-backed scheduler
- [x] Add server startup job that checks for pending emails and sends overdue ones
- [x] Add periodic polling (every 5 min) to check and send due emails
- [x] Ensure emails survive server restarts and deployments

## Client Consent Form with E-Signature
- [x] Create consent form page in client flow (before photo upload)
- [x] Include consent text for AI skin analysis and data usage
- [x] Add electronic signature pad (draw or type signature)
- [x] Capture date/time stamp with signature
- [x] Store consent in database (signature data, timestamp, IP, consent text version)
- [x] Block analysis if consent not signed
- [x] Make consent downloadable as PDF

## Staff Push Notifications
- [x] Integrate built-in notification API for staff alerts
- [x] Send push notification when new client analysis completes
- [x] Include patient name, score, and link to report in notification

## Bug Fix: Sculptra and Radiesse Not Being Recommended
- [x] Add explicit guidance in AI prompt to recommend Sculptra/Radiesse for volume loss, collagen depletion, and skin laxity
- [x] Increase procedure count from EXACTLY 4 to 5-6 to allow room for collagen induction treatments
- [x] Add treatment stacking examples that include Sculptra/Radiesse with other procedures

## Copy Protection for Skin AI
- [x] Disable right-click context menu on all pages
- [x] Disable text selection on report/analysis pages
- [x] Block dev tools keyboard shortcuts (Ctrl+U, Ctrl+Shift+I, F12)
- [x] Add watermark overlay on client report pages
- [x] Add meta robots noindex/nofollow to prevent search engine caching
- [x] Block copy/paste of page content
- [x] Block print (Ctrl+P) and save (Ctrl+S)
- [x] Disable print via CSS @media print
- [x] Block PrintScreen key

## Bug Fix: Radiesse Should NOT Be Recommended for Under-Eye
- [x] Add explicit rule in client prompt: Radiesse is NEVER for under-eye area
- [x] Add explicit rule in staff prompt: Radiesse is NEVER for under-eye area
- [x] Specify that only HA fillers (Restylane, Juvederm) are appropriate for under-eye

## Missing HA Filler Recommendations
- [x] Add HA fillers (Restylane, Juvederm, RHA, Versa) to AI recommendation guidance
- [x] Ensure AI recommends HA fillers for lips, under-eye, nasolabial folds, marionette lines, cheeks
- [x] Add HA fillers to service catalog if not already present

## Missing IPL Recommendations for Fitzpatrick I-IV
- [x] Ensure AI recommends IPL (NOT BBL) for Fitzpatrick types I-IV when appropriate
- [x] Add IPL recommendation guidance for sun damage, rosacea, pigmentation, vascular lesions (no BBL)
- [x] Verify IPL is still blocked for Fitzpatrick V-VI

## Logo & Branding Update
- [x] Upload RadiantilyK Aesthetic logo to S3
- [x] Add logo to client landing page
- [x] Update app branding with official logo

## Marketing-Ready Client Landing Page (Facebook Ads)
- [x] Redesign client landing page for high-conversion Facebook ad traffic
- [x] Add business addresses (San Jose: 2100 Curtner Ave, Ste 1B; San Mateo: 1528 S El Camino Real #200)
- [x] Add phone number (408-900-2674) and email contact info
- [x] Add social proof elements (trusted by 5,000+ patients, real results)
- [x] Add clear CTA flow for Facebook ad visitors (Get Your Free AI Skin Analysis)
- [x] Add location cards with hours for both clinics
- [x] Optimize for mobile (Facebook traffic is mostly mobile)

## Bug Fix: Body Concern Shows Face Photo Instructions
- [x] When concern area is "body", show body-specific photo angles (e.g., target area close-up, wider view, different angle) instead of face angles
- [x] Update photo tips to be body-relevant when body concern is selected
- [x] Keep face photo instructions for face concerns
- [x] Add body silhouette SVGs for body photo capture cards

## Body Treatment Recommendation Rules & RKsculpt Rename
- [x] Rename "Body Sculpting" to "RKsculpt" in service catalog
- [x] Rename "Body Sculpting" to "RKsculpt" in all AI prompts
- [x] Add body-specific treatment recommendation rules to client prompt (stretch marks, skin laxity, body acne, hyperpigmentation, fat reduction)
- [x] Add body-specific treatment recommendation rules to staff prompt
- [x] Never use the word "emsculpt" — always use "RKsculpt"
- [x] Update tests for new body treatment rules

## Facebook Pixel / Meta Tracking
- [x] Add Facebook Pixel base code to index.html (configurable via env variable)
- [x] Add conversion events: PageView, StartAnalysis, CompleteAnalysis, ViewReport
- [x] Create a reusable tracking utility for firing custom events
- [x] Request Facebook Pixel ID from user via secrets

## Special Offer Banner (25% Off)
- [x] Add animated special offer banner to client landing page ("Book within 48 hours and get 25% off")
- [ ] Add special offer reminder on the client report page after analysis completes
- [ ] Include countdown timer showing 48-hour window (future)

## Google Maps Embeds
- [x] Add Google Maps embed for San Jose location (2100 Curtner Ave, Ste 1B)
- [x] Add Google Maps embed for San Mateo location (1528 S El Camino Real #200)
- [x] Style maps to fit within location cards

## Bug Fix: Before/After Treatment Simulation Images Missing from Report
- [x] Diagnose why before/after simulation images are not showing on patient report
- [x] Add generateSimulationsInBackground to staff skinRouter (was only in clientRoutes)
- [x] Add getSimulations tRPC endpoint for staff polling
- [x] Add BeforeAfterSlider component to staff Report.tsx
- [x] Add simulation polling with useEffect to staff Report.tsx
- [x] Verify simulations appear on both staff and client reports

## Follow-Up Email Timing & Content Update
- [x] Update follow-up email timing: 24 hours (gentle reminder) and 72 hours (urgent booking push)
- [x] Update 24-hour email content: friendly reminder of their analysis results, mention 25% off offer
- [x] Update 72-hour email content: urgent tone, guide them to book consultation, emphasize limited-time offer expiring
- [x] Ensure emails include direct booking link (rkaemr.click/portal)
- [x] Update tests for new email timing and content

## AI Simulation Image Realism Improvement
- [x] Update simulation prompt to produce subtle, realistic, human-like enhancements
- [x] Ensure simulation shows believable treatment results (not dramatic/artificial)
- [x] Added percentage-based improvement targets (e.g., 30% reduction, not elimination)
- [x] Added critical rules: keep pores, texture, imperfections; less is more
- [x] Each treatment prompt specifies realistic timeframe expectations

## Update Storefront Products in AI Recommendations
- [x] Update skincare product catalog with all 53 products from rkaskin.co
- [x] Add new product lines: MOV, SkinCeuticals, Sisley, EltaMD, BARUBT, RadiantilyK new serums
- [x] Update product recommendation guidelines by skin concern (acne, aging, hyperpigmentation, dryness, sensitive, post-procedure, texture, under-eye, scars, lash, sun protection)
- [x] Include storefront link (rkaskin.co) in product recommendations
- [x] Update prices to match current storefront
- [x] Update tests for new product catalog (107 tests passing)

## Scrape Product Images for New Products
- [x] Scrape all 53 product images from rkaskin.co via browser JS extraction
- [x] Add imageUrl and shopUrl fields to ProductItem interface
- [x] Map all 53 images to products in catalog
- [x] Display product images in both client and staff report pages

## Bundle Deal Recommendations
- [x] Add BundleDeal interface and 5 bundle deals to product catalog
- [x] Add bundle deal section to AI prompt text (20% off bundles)
- [x] Display matching bundle deals with discount pricing in client report
- [x] Add findMatchingBundlesByName helper function

## Shop Now Button on Client Report
- [x] Add purple "Shop Now" button next to each product recommendation in client report
- [x] Link directly to rkaskin.co storefront
- [x] Add "Shop All Products at rkaskin.co" CTA button at bottom
- [x] Style with gradient purple/pink button matching report design

## 48-Hour Countdown Timer on Client Report
- [x] Add countdown timer to client report page showing time remaining for 25% off offer
- [x] Timer starts from analysis creation timestamp
- [x] Show hours:minutes:seconds countdown
- [x] When expired, show "Offer Expired" message
- [x] Add urgency styling (pulsing animation, red when under 6 hours)
- [x] Include "Book Now — Save 25%" CTA button next to timer

## UTM Parameter Tracking on Shop Now Links
- [x] Add UTM parameters to all Shop Now links (utm_source=skinai, utm_medium=report, utm_campaign=product_recommendation)
- [x] Add UTM parameters to all booking links (header, BookingCTA, countdown banner)
- [x] Include product name in utm_content parameter for per-product tracking
- [x] Add UTM to bundle deal links with bundle ID

## Facebook Pixel Setup Guide
- [x] Help user set up Facebook Pixel ID via secrets (ID: 1557621865295729 — 001: RKA (SA))
- [x] Verify pixel events are firing correctly (109 tests passing)

## Remove Walk-ins Welcome
- [x] Remove "Walk-ins Welcome" text from the website — changed to "By appointment only"
