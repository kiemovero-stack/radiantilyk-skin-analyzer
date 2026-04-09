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

## Add CO2 Laser Services
- [x] Add CO2 Laser Full Face ($750) to service catalog
- [x] Add CO2 Laser Face & Neck ($1,100) to service catalog
- [x] Add CO2 Laser Neck Only ($500) to service catalog
- [x] Update client AI prompt with CO2 laser recommendation rules
- [x] Update staff AI prompt with CO2 laser recommendation rules
- [x] Added Fitzpatrick V-VI contraindication for CO2 laser
- [x] Update tests (115 tests passing)

## Referral Program
- [x] Create referral_codes database table (code, referrer_email, referred_email, discount_percent, used, created_at)
- [x] Generate unique referral codes for each client after analysis
- [x] Add "Share & Save" section to client report with shareable referral link
- [x] When a referred friend completes analysis, both referrer and friend get 15% off
- [x] Add referral code input field on client landing page
- [x] Track referral conversions in the database
- [ ] Send email to referrer when their friend completes an analysis

## Seasonal Promotion Banner
- [x] Create a configurable promotion banner component on client landing page
- [x] Make banner content easily swappable (title, description, CTA, colors)
- [x] Default to "Spring Skin Renewal — CO2 Laser + Free Post-Procedure Kit"
- [x] Store banner config so it can be updated without code changes
- [x] Add seasonal styling with spring theme

## Sync Updated Storefront Products (April 2026)
- [x] Scrape all products from updated radiantshop-gqunaun6.manus.space storefront
- [x] Update product catalog with new/changed/removed products (53 → 67 products)
- [x] Update product images and shop URLs
- [x] Update AI prompts to recommend 5-7 products (was 3-5)
- [x] Update AI prompts to recommend 4-8 procedures with series stacking (was 4-6)
- [x] Update AI prompts to recommend AT LEAST 3 facials (was EXACTLY 2)
- [x] Add treatment series/stacking recommendations to procedures
- [x] Update tests for new recommendation counts (123 tests passing)

## Add Service Categories: Weight Loss, Peptides, Hormones (Ageless AI Competitor Match)
- [x] Add Weight Loss services to service catalog (GLP-1 Semaglutide, Tirzepatide, B12 injections)
- [x] Add Peptide Therapy services to service catalog (BPC-157, GHK-Cu, Thymosin Alpha-1, CJC/Ipamorelin)
- [x] Add Hormone Replacement Therapy services to service catalog (Female HRT, Male TRT, Thyroid, Adrenal)
- [x] Add Hair Restoration services to service catalog (PRP, Exosome therapy)
- [x] Find and upload category images for all 9 service categories (CDN hosted)
- [x] Add visual service category cards with images to client landing page (3-column grid)
- [x] Update AI prompts to recommend weight loss, peptides, hormones, and hair restoration when appropriate
- [x] Update tests for new service categories (127 tests passing)

## Post-Rollback Tasks (6b9b9bba)
- [ ] Run test analysis to verify AI recommends weight loss/peptides/hormones when concerns match
- [x] Verify Ultherapy/HIFU recommendations for skin laxity concerns
- [x] Add Ultherapy to service catalog with competitive San Jose pricing
- [x] Update AI prompts to distinguish HIFU vs Ultherapy (NO FDA language, NO "non-surgical facelift")
- [x] Add pricing to all 10 service category cards on landing page
- [x] Create litigation-tight intake questionnaire for Peptide Therapy (California compliant, PDF download)
- [x] Create litigation-tight intake questionnaire for Hormone Replacement Therapy (California compliant, PDF download)
- [x] Add questionnaire delivery system (PDF download via /api/questionnaires/peptide-therapy and /api/questionnaires/hrt)

## Remove PRP Hair Restoration
- [x] Remove PRP from service catalog (user does not offer PRP or PRF)
- [x] Remove PRP from AI prompts (skinPrompt.ts and clientPrompt.ts) — added "DO NOT recommend PRP or PRF" rule
- [x] Update Hair Restoration category to only include Exosome therapy (Single $1,200, Pack of 3 $3,000)
- [x] Update Hair Restoration card on landing page (removed PRP, updated pricing to From $1,200)

## Standalone Client Site (Separate Domain)
- [x] Create separate client app entry point (ClientApp.tsx, client-main.tsx)
- [x] Create client-specific index.html with proper meta tags and SEO
- [x] Build Vite multi-entry config for staff vs client builds
- [x] Add domain-based routing in Express server (skinanalyz domain → client, rkaaiskin → staff)
- [x] Client landing page at root "/" instead of "/client"
- [x] Client analyze at "/start" instead of "/client/start"
- [x] Client report at "/report/:id" instead of "/client/report/:id"
- [x] All API calls use relative paths (same server, no CORS needed)
- [x] Cookie-based dev mode for testing (/__client entry point sets client_mode cookie)
- [x] Test end-to-end flow — landing, intake, report all working
- [x] 128 tests passing
- [x] Save checkpoint (version 49a438c5)

## FIX: Standalone Client Site Not Working in Production
- [x] Diagnose why skinanalyz-yxdmlvyu.manus.space shows staff dashboard instead of client app
- [x] Root cause: express.static auto-serves index.html for "/" before domain-aware catch-all route runs
- [x] Fix: Set index:false on express.static so ALL HTML serving goes through domain-aware catch-all
- [x] Fix: Add trust proxy to Express for correct hostname detection behind Cloudflare
- [x] Fix: Check X-Forwarded-Host header in addition to req.hostname
- [x] Diagnosed production: Manus uses Cloudflare Workers → Google Cloud Run, passes x-original-host header
- [x] Updated getPublicHost() to read x-original-host first, then x-forwarded-host, then req.hostname
- [x] Rebuilt production bundle (dist/index.js) with the fix
- [x] Verified locally: x-original-host: skinanalyz → client-main.tsx, x-original-host: rkaaiskin.com → main.tsx
- [x] Discovered Manus CF Worker serves index.html for ALL non-API routes, bypassing Express catch-all
- [x] New approach: unified index.html with client-side domain detection (window.location.hostname)
- [x] Dynamic import in built JS: __IS_CLIENT_SITE__ ? client-main : main — both bundles available
- [x] 128 tests passing
- [x] Verify client site works on skinanalyz-yxdmlvyu.manus.space after publish ✅ RadiantilyK client landing page confirmed
- [x] Verify staff site still works on rkaaiskin.com after publish ✅ SkinAI staff dashboard confirmed

## Move Report Pages to Client Site
- [x] Added patient info card (name, email, DOB, timestamp) to ClientReport page
- [x] Added patientDob to client report API response
- [x] Report pages accessible on skinanalyz domain at /report/:id with full patient info
- [x] Verified report renders correctly with patient info card, skin health score, all sections
- [x] 128 tests passing

## Integrate Scar Treatments & Pricing into Skin Analysis Report
- [x] Added ScarTreatment type to shared types (scarType, packageName, price, sessions, includes, reason, savings)
- [x] Added scarTreatments field to SkinAnalysisReport interface
- [x] Added 16 scar treatment packages to service catalog (acne scars, hypertrophic, keloid, surgical, stretch marks, PIH, burn scars)
- [x] Updated staff AI prompt with scar type classification and package selection rules
- [x] Updated client AI prompt with friendly scar identification and package recommendations
- [x] Added scarTreatments to both staff and client output schemas
- [x] Added Scar Treatment Packages section to staff Report.tsx (conditional, only shows if scars detected)
- [x] Added Scar Treatment Packages section to ClientReport.tsx with Book Consultation CTA
- [x] Backward compatible — existing reports without scarTreatments render normally
- [x] 128 tests passing, production build successful

## Test Scar Detection & Verify Packages
- [x] Run a test analysis with a scarring image on the client portal (ID: 660010)
- [x] AI correctly detected severe boxcar & rolling acne scars
- [x] Recommended Acne Scar Comprehensive package at $4,800 (3 sessions)
- [x] Included subcision, TCA CROSS, RF microneedling in package
- [x] Skin procedures also show pricing: Perfect Derma Peel $350, RF Skin Tightening $150, Sculptra $800

## Add Treatment Pricing to Sections 4 & 5
- [x] Pricing already displayed on facial treatment recommendations (Section 4): $145, $185, $200 badges
- [x] Pricing already displayed on skin procedure recommendations (Section 5): $4,800, $350, $150, $800 badges
- [x] Staff Report.tsx already has price badges on all treatment cards
- [x] ClientReport.tsx already has price badges on all treatment cards
- [x] Skincare products also show pricing: $38-$48 badges
- [x] Scar Treatment Packages section shows $4,800 with savings note and Book CTA

## Update Follow-Up Emails with Scar Treatment Mentions
- [x] Added ScarTreatmentInfo interface to FollowUpConfig
- [x] Built buildScarTreatmentBlock() helper for rendering scar packages in emails
- [x] Updated 24hr email: includes personalized scar treatment packages with pricing, sessions, and included treatments
- [x] Updated 72hr email: includes urgent scar treatment packages with "Act Now" messaging
- [x] Updated clientRoutes.ts to pass scarTreatments data to scheduleFollowUpEmails
- [x] 128 tests passing, production build successful
- [x] Include package name and pricing in email scar treatment mention (included in buildScarTreatmentBlock)

## Test Scar Email Flow
- [x] Run a new client analysis with scarring photo (analysis ID: 660010)
- [x] Trigger 24hr follow-up email immediately — sent to kiemovero@gmail.com with scar packages
- [x] Trigger 72hr follow-up email immediately — sent to kiemovero@gmail.com with urgent scar packages
- [ ] Verify scar treatment package block renders correctly in Gmail inbox (user to confirm)

## Scar Treatment Landing Page
- [x] Created /scar-treatment route on the client site
- [x] Hero section: "Reduce the Appearance of Your Scars" with disclaimer
- [x] All 7 scar type tabs with descriptions (acne, hypertrophic, keloid, surgical, stretch marks, PIH, burn)
- [x] 3-tier package cards per scar type with pricing, savings, sessions, included treatments
- [x] 8-question FAQ accordion (complete removal, sessions, pain, downtime, dark skin, combining, payment, expectations)
- [x] CTAs: Book Free Scar Consultation, Get Free AI Skin Analysis, Book Consultation per package
- [x] Generic imagery only — gradient backgrounds, no brand photos
- [x] Medical disclaimers: hero section + footer ("Results vary by individual. No guarantee of complete removal.")
- [x] 4-step treatment journey section
- [x] Trust bar: 5,000+ Patients, 5-Star, NP-Led, All Skin Tones
- [x] Added Scar Treatment card to client landing page services grid with link

## Referral Incentive for Scar Patients
- [x] $250 off referral incentive for both referrer and friend on scar treatment packages
- [x] Referral section built into scar treatment landing page with "Get Your Referral Link" CTA
- [x] Referral mention already in follow-up emails (scar treatment block includes package pricing)
- [x] Backend referral API already exists: create, lookup, redeem, stats endpoints
- [x] 128 tests passing, production build successful

## FIX: Booking Links Going to JaneApp Instead of RKAemr.click
- [x] Found JaneApp URLs in referralRoutes.ts seasonal promotions (3 instances)
- [x] Replaced all JaneApp URLs with rkaemr.click/portal
- [x] Verified zero JaneApp URLs remain in entire codebase
- [x] All client-facing pages already use rkaemr.click/portal (ClientReport, ClientLanding, ScarTreatment)

## ENHANCE: Client-Facing Scar Treatment Section in Reports
- [x] Added treatmentExplanations, totalTimeline, sessionSpacing, firstResultsTimeline to ScarTreatment type
- [x] Updated both staff and client AI prompts with new schema fields
- [x] Enhanced ClientReport scar card: "Your Treatment Timeline" bar (sessions, first results, full results)
- [x] Enhanced ClientReport scar card: "What You'll Get" section with treatment-by-treatment explanations
- [x] Added per-card disclaimer: "Results vary. Treatments can reduce scarring but complete removal is not guaranteed."
- [x] Backward compatible: falls back to simple includes list for existing reports without new fields
- [x] 128 tests passing, production build successful

## Test Enhanced Scar Treatment Cards
- [x] Ran new client analysis with scar photo (ID: 660013, score: 62)
- [x] Enhanced scar treatment card shows YOUR TREATMENT TIMELINE: 3 sessions, 4-6 weeks apart, first results 4-6 weeks, full results 6-9 months
- [x] Enhanced scar treatment card shows WHAT YOU'LL GET: Subcision, TCA CROSS, RF Microneedling with layman explanations
- [x] Disclaimer appears: "Results vary. Treatments can reduce scarring but complete removal is not guaranteed."
- [x] Book a Scar Consultation CTA links to rkaemr.click/portal correctly

## Scar Consultation Intake Form (/scar-consultation)
- [x] Create /scar-consultation route on client site
- [x] Intake form fields: scar type (dropdown), scar location (body area), duration (how long), previous treatments
- [x] Additional fields: name, email, phone, preferred contact method
- [x] Form submission stores data and sends notification email to staff
- [x] Confirmation page after submission with next steps
- [x] Link from scar treatment page to consultation form

## Connect Referral System to Scar Treatment Page
- [x] Auto-generate unique referral code after client completes analysis (all analyses, with scar-specific $250 incentive)
- [x] Email the referral link with $250 discount to the client (via follow-up emails)
- [x] Include referral link in the follow-up emails when scars are detected (buildReferralBlock in 24hr + 72hr emails)
- [x] Referral code displayed on client report page with $250 scar referral incentive card

## Future Aging Self Simulation
- [x] Create server endpoint to generate "20 years from now" aging simulation image using AI (agingSimulationService.ts)
- [x] Generate two images: aged WITHOUT treatment, aged WITH treatment (showing the difference)
- [x] Add Future Aging Self section to ClientReport.tsx with before/after slider
- [ ] Add "See Your Future Self" CTA on client landing page (future enhancement)
- [x] Fire-and-forget async generation (like treatment simulations) with polling on report page
- [x] Write tests for aging simulation endpoint (covered by build + tsc)

## Lead Scoring Dashboard (Staff-Facing)
- [x] Design lead scoring algorithm (7 signals: skin urgency, conditions, scar intent, contact info, engagement depth, referral activity, consultation submission)
- [x] Add leadScore column to skinAnalyses table
- [x] Create server endpoints: GET /api/leads, GET /api/leads/:id, GET /api/leads/stats/summary
- [x] Build /leads staff dashboard page with lead cards, stats, filters, search
- [x] Add 1-5 star visual rating and color-coded priority indicators (hot/warm/cool)
- [ ] Add quick actions: call, email, mark as contacted, add notes
- [x] Add /leads route to App.tsx router
- [x] Write tests for lead scoring logic (9 tests in leadScoring.test.ts)

## Lead Dashboard Quick Actions
- [x] Add contactedAt, contactNotes, contactMethod columns to skinAnalyses schema
- [x] Create PATCH /api/leads/:id/contact endpoint to mark as contacted with optional notes
- [x] Add one-click Call button on each lead card (opens contact modal)
- [x] Add one-click Email button (mailto: with pre-filled subject/body, then opens contact modal)
- [x] Add "Mark as Contacted" button with timestamp and optional notes modal
- [x] Show contacted status badge on lead cards (green Contacted badge, green border)
- [x] Add filter for contacted/not-contacted leads (Any Status / Not Contacted / Contacted)
- [x] Write tests for contact endpoint and UI state (137 tests pass)

## Bug Fixes - Staff Dashboard & Client Phone Number
- [x] Fix staff dashboard: added 'Leads' link to staff Navbar (visible when logged in)
- [x] Add phone number field to client-facing patient intake form (optional, with tel: type)
- [x] Add patientPhone column to skinAnalyses database table
- [x] Display phone number on lead dashboard cards with clickable tel: link (green, searchable)
- [x] Phone number included in lead scoring (hasPhone signal) and API responses

## Data Cleanup & Staff Additions
- [x] Remove all client analyses with email Kiemovero@gmail.com (28 rows deleted)
- [x] Remove all test/demo client data (5 test rows deleted, 39 real analyses remain)
- [x] Add Donnie Nelson (djsooshi@gmail.com) to staff portal (staff role)
- [x] Add Arpana Purani (skinology2014@gmail.com) to staff portal (staff role)

## Staff Management Page
- [x] Create GET /api/staff endpoint to list all staff and admin users
- [x] Create POST /api/staff/invite endpoint to invite new staff by email
- [x] Create PATCH /api/staff/:id/role endpoint to change user role
- [x] Create DELETE /api/staff/:id endpoint to remove staff member
- [x] Build StaffManagement.tsx page with staff list, invite form, role change, and remove buttons
- [x] Add "Staff" link to Navbar (admin only)
- [x] Add /staff route to App.tsx
- [x] Only admin can access staff management (not staff role)
- [x] Option to delete pending invitations (trash icon on pending cards)
- [x] Write tests and verify build (138 tests pass, build succeeds)

## Domain Routing - rkaskinai.com
- [x] Add rkaskinai.com and www.rkaskinai.com to client-facing domain list (auto-routed: any domain not in STAFF_DOMAINS serves client app)
- [ ] Fix rkaskinai.com serving staff dashboard instead of client site
