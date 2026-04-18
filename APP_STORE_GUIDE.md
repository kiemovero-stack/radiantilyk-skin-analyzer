# RadiantilyK Aesthetic — iOS App Store Submission Guide

## Prerequisites

- **Mac** with macOS 13 (Ventura) or later
- **Xcode 15+** installed from the Mac App Store
- **Apple Developer Account** ($99/year) — enrolled at [developer.apple.com](https://developer.apple.com)
- The `ios/` folder from this project (download the full project ZIP)

---

## Step 1: Download the Project

1. Download the project ZIP from the Manus dashboard (Code panel → Download)
2. Unzip it to a folder on your Mac (e.g., `~/Desktop/skin-analyzer`)

---

## Step 2: Open in Xcode

1. Open **Xcode**
2. Go to **File → Open** and navigate to:
   ```
   ~/Desktop/skin-analyzer/ios/App/App.xcodeproj
   ```
3. Wait for Xcode to resolve Swift packages (this may take 1-2 minutes)

---

## Step 3: Configure Signing

1. In the left sidebar, click on the **App** project (blue icon at the top)
2. Select the **App** target
3. Go to the **Signing & Capabilities** tab
4. Check **"Automatically manage signing"**
5. Select your **Team** (your Apple Developer account)
6. The **Bundle Identifier** should be: `com.radiantilyk.aesthetic`
   - If this is taken, change it to something unique like `com.radiantilyk.aestheticapp`

---

## Step 4: Set App Version

1. In the **General** tab:
   - **Display Name**: `RadiantilyK`
   - **Version**: `1.0.0`
   - **Build**: `1`

---

## Step 5: App Icon

The app icon is pre-configured using your rose gold seal logo on an ivory background. A 512px placeholder is included in the project. For the App Store submission, you'll need a full 1024x1024 icon:

1. The icon assets are in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. If Xcode warns about icon size, replace `AppIcon-1024.png` with a 1024x1024 version of your logo
3. You can use any image editor to resize the existing icon up, or use the original logo file

You should see the icon in the **General** tab under **App Icons and Launch Screen**.

---

## Step 6: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - **Platform**: iOS
   - **Name**: `RadiantilyK Aesthetic`
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select `com.radiantilyk.aesthetic` (or the one you used)
   - **SKU**: `radiantilyk-aesthetic-v1`
4. Click **Create**

---

## Step 7: Build and Upload

1. In Xcode, select your **iPhone** or **Any iOS Device (arm64)** as the build target (top bar)
2. Go to **Product → Archive**
3. Wait for the build to complete (2-5 minutes)
4. The **Organizer** window will open automatically
5. Select your archive and click **Distribute App**
6. Choose **App Store Connect** → **Upload**
7. Follow the prompts (keep defaults) and click **Upload**

---

## Step 8: Complete App Store Listing

Back in App Store Connect, fill in the required information:

### App Information
- **Category**: Health & Fitness (Primary), Lifestyle (Secondary)
- **Content Rights**: Does not contain third-party content
- **Age Rating**: 4+ (no objectionable content)

### Pricing
- **Price**: Free

### App Privacy
- **Data Types Collected**:
  - Email Address (used for account features)
  - Photos (used for skin analysis — not linked to identity)
  - Name (used for personalization)
  - Phone Number (optional, for appointment booking)

### Screenshots (Required)
You'll need screenshots for:
- **6.7" iPhone** (iPhone 15 Pro Max): 1290 × 2796 px
- **6.5" iPhone** (iPhone 11 Pro Max): 1242 × 2688 px
- **iPad Pro 12.9"**: 2048 × 2732 px

**Tip**: Run the app on the Xcode Simulator, take screenshots of:
1. Home/Landing page
2. Skin Analysis in progress
3. Results/Report page
4. Rewards page
5. Booking page

### Description (Suggested)
```
RadiantilyK Aesthetic — Your personal AI skin analysis and aesthetic wellness companion.

Get a complimentary AI-powered skin analysis that evaluates your skin health across multiple dimensions including hydration, texture, tone, and aging signs. Receive personalized treatment recommendations from RadiantilyK Aesthetic's expert team.

Features:
• AI Skin Analysis — Upload photos for an instant, detailed skin health assessment
• Personalized Recommendations — Get treatment and product suggestions tailored to your skin
• Rewards Program — Earn points on treatments and referrals, redeem for exclusive discounts
• Easy Booking — Schedule appointments directly through the app
• Flexible Financing — Apply for Cherry or Affirm financing for treatments
• Shop Products — Browse and purchase professional skincare products

RadiantilyK Aesthetic is a premier medical spa offering advanced aesthetic treatments including injectables, laser treatments, facials, and professional skincare.

Visit us at rkaskinai.com
```

### Keywords (Suggested)
```
skin analysis, medical spa, aesthetic, skincare, beauty, facial, botox, filler, skin health, rewards
```

### Support URL
```
https://rkaskinai.com
```

### Marketing URL
```
https://rkaskinai.com
```

---

## Step 9: Submit for Review

1. In App Store Connect, go to your app → **App Store** tab
2. Add the uploaded build (it appears after ~15 minutes of processing)
3. Fill in all required fields (screenshots, description, etc.)
4. Click **Submit for Review**

Apple's review typically takes **24-48 hours** for first submissions.

---

## Common Issues

### "No signing certificate" error
→ In Xcode: **Xcode → Settings → Accounts** → Select your Apple ID → Click **Manage Certificates** → Click **+** to create a new certificate

### "Provisioning profile" error
→ Make sure "Automatically manage signing" is checked and your Team is selected

### Build fails with "module not found"
→ In Xcode: **File → Packages → Reset Package Caches**, then try building again

### App rejected for "Guideline 4.2 - Minimum Functionality"
→ Apple sometimes rejects web-wrapper apps. If this happens, we can add native features (push notifications, haptic feedback, camera integration) to differentiate from the website.

---

## Updating the App

When you want to push updates:

1. I'll update the web app code
2. Run `npx cap sync ios` in the project
3. Open Xcode, increment the **Build** number
4. Archive and upload again
5. Submit the new version in App Store Connect

---

## Need Help?

If you get stuck at any step, take a screenshot and share it with me — I'll walk you through it.
