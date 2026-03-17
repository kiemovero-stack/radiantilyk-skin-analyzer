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
