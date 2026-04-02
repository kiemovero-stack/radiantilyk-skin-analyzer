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

## Bug Fix: Simulation Images Issues
- [x] Fix only one simulation image generated instead of one per recommended procedure
- [x] Fix simulation still showing as loading / never completing on client report page

## Change: Single Combined Simulation Image
- [x] Generate ONE simulation image combining ALL recommended procedures (not separate per procedure)
- [x] Update simulation prompt to describe combined results of all treatments
- [x] Update client report to show single before/after slider with "Your Treatment Preview" section
- [x] Faster and cheaper (1 API call instead of 4)
- [x] Backward compatible with old per-procedure simulation images
- [x] 76 tests passing
