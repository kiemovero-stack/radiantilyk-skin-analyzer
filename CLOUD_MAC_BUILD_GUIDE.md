# Building the RadiantilyK iOS App from Windows via Cloud Mac

This guide walks you through renting a Mac in the cloud and using it from your Windows computer to build, sign, and submit the RadiantilyK Aesthetic iOS app to the Apple App Store.

---

## Step 1: Choose a Cloud Mac Service

You only need the cloud Mac for a few hours to build and submit. The **Pay-As-You-Go** plan is the most cost-effective option.

| Service | Best Plan | Cost | Xcode Included | App Store Submission | Access Method |
|---------|-----------|------|----------------|---------------------|---------------|
| **MacinCloud** (Recommended) | Pay-As-You-Go | **$1/hour** or $4/day | Yes | Yes (confirmed) | Remote Desktop (RDP) |
| MacinCloud | Managed Server | $25/month | Yes | Yes | Remote Desktop (RDP) |
| RentAMac.io | Dedicated Mac Mini M4 | $99/month | Yes | Yes | DeskIn remote desktop |

**MacinCloud Pay-As-You-Go at $1/hour is the best option** — you will likely need only 2-3 hours total, so the cost should be around **$3-4**.

### How to Sign Up for MacinCloud

1. Go to [checkout.macincloud.com/select](https://checkout.macincloud.com/select)
2. Select the **Pay-As-You-Go** plan (leftmost option, labeled "Most Flexible")
3. Click **Buy Plan** and create an account
4. Add a payment method (credit/debit card)
5. You will receive login credentials by email within minutes

---

## Step 2: Connect to the Cloud Mac from Windows

Once you receive your MacinCloud credentials:

1. Open **Remote Desktop Connection** on your Windows PC (search "Remote Desktop" in the Start menu, or download **Microsoft Remote Desktop** from the Microsoft Store)
2. Enter the **IP address** and **port** from your MacinCloud welcome email
3. Enter your **username** and **password**
4. You are now looking at a macOS desktop — just like sitting in front of a Mac

> **Tip:** If the connection feels slow, close unnecessary apps on your Windows PC and make sure you are on a stable internet connection. MacinCloud servers in US-West (Los Angeles) or US-East (New York) will have the best performance from the US.

---

## Step 3: Get the Project Code onto the Cloud Mac

You have two options to get the code onto the cloud Mac:

### Option A: Clone from GitHub (Recommended)

If the code has been exported to GitHub (I can do this for you), open **Terminal** on the cloud Mac and run:

```bash
git clone https://github.com/kiemovero-stack/radiantilyk-skin-analyzer.git
cd radiantilyk-skin-analyzer
```

### Option B: Download ZIP from Manus

1. In the Manus Management UI, click the **Code** panel
2. Click **Download All Files** (ZIP)
3. Transfer the ZIP to the cloud Mac (drag and drop into the Remote Desktop window, or upload via Google Drive/Dropbox)
4. Unzip the file on the Mac

---

## Step 4: Open the Xcode Project

1. On the cloud Mac, open **Finder** and navigate to the project folder
2. Go into the `ios/App/` folder
3. Double-click **`App.xcodeproj`** to open it in Xcode
4. Xcode will open and load the project (this may take a minute the first time)

---

## Step 5: Sign the App with Your Apple Developer Account

1. In Xcode, click on **App** in the left sidebar (the project name at the very top)
2. Click the **Signing & Capabilities** tab
3. Check the box for **Automatically manage signing**
4. Under **Team**, click the dropdown and select **Add an Account...**
5. Sign in with your **Apple ID** (the one enrolled in the Apple Developer Program at $99/year)
6. Select your team from the dropdown
7. Xcode will automatically create the provisioning profile and signing certificate

> **Important:** Your Apple Developer Program membership ($99/year) must be active. If you have not enrolled yet, go to [developer.apple.com/programs](https://developer.apple.com/programs/) and enroll first.

---

## Step 6: Configure the App Settings

Verify these settings in Xcode under **Signing & Capabilities**:

| Setting | Value |
|---------|-------|
| Bundle Identifier | `com.radiantilyk.aesthetic` |
| Team | Your Apple Developer team |
| Deployment Target | iOS 16.0 (or latest) |
| Display Name | RadiantilyK Aesthetic |

These should already be set correctly from the Capacitor configuration, but double-check them.

---

## Step 7: Build and Archive the App

1. In the top toolbar, make sure the device is set to **Any iOS Device (arm64)** (not a simulator)
2. Go to **Product → Archive** in the menu bar
3. Wait for the build to complete (2-5 minutes)
4. When done, the **Organizer** window will open automatically showing your archive

---

## Step 8: Submit to App Store Connect

1. In the Organizer window, select your archive and click **Distribute App**
2. Select **App Store Connect** and click **Next**
3. Select **Upload** and click **Next**
4. Keep all default options checked and click **Next**
5. Review the summary and click **Upload**
6. Wait for the upload to complete (5-10 minutes depending on internet speed)

---

## Step 9: Complete the App Store Listing

After uploading, go to [App Store Connect](https://appstoreconnect.apple.com) in a browser (you can do this from your Windows PC — no Mac needed):

1. Sign in with your Apple ID
2. Click **My Apps** → select **RadiantilyK Aesthetic**
3. Fill in the required information:

| Field | What to Enter |
|-------|---------------|
| App Name | RadiantilyK Aesthetic |
| Subtitle | AI-Powered Skin Analysis |
| Category | Health & Fitness (Primary), Medical (Secondary) |
| Description | See below |
| Keywords | skin analysis, skincare, aesthetic, dermatology, beauty, AI, facial, treatment, med spa |
| Support URL | https://rkaskinai.com |
| Privacy Policy URL | https://rkaskinai.com/privacy (or your privacy policy page) |

### Suggested App Description

```
RadiantilyK Aesthetic brings AI-powered skin analysis to your fingertips. Upload photos of your skin and receive a comprehensive analysis with personalized treatment recommendations from our board-certified providers.

Features:
• AI Skin Analysis — Advanced computer vision analyzes your skin across multiple angles
• Personalized Treatment Plans — Receive customized recommendations for your skin type and concerns
• Treatment Simulations — See projected results before committing to treatments
• Rewards Program — Earn points on treatments and products, redeem for discounts
• Easy Booking — Schedule appointments directly through the app
• Flexible Financing — Cherry and Affirm payment options available

RadiantilyK Aesthetic is a medical spa located in the San Francisco Bay Area offering injectables, laser treatments, facials, body contouring, and wellness services.
```

4. Upload **screenshots** (you can take these from your iPhone or use the Xcode Simulator):
   - You need screenshots for iPhone 6.7" (iPhone 15 Pro Max) and iPhone 6.5" (iPhone 14 Plus)
   - Take screenshots of: the landing page, an analysis report, the rewards page, and the booking page

5. Upload an **app icon** (1024x1024 — this is already in the Xcode project assets)

6. Click **Submit for Review**

---

## Step 10: Wait for Apple Review

Apple typically reviews apps within **24-48 hours**. You will receive an email when:
- The app is **approved** and live on the App Store
- The app needs **changes** (Apple will explain what to fix)

Common reasons for rejection and how to avoid them:
- **Missing privacy policy** — Make sure you have a privacy policy URL
- **Incomplete metadata** — Fill in all required fields in App Store Connect
- **Login required without demo account** — Since the client app does not require login, this should not be an issue

---

## Step 11: Disconnect from Cloud Mac

Once the app is uploaded and you have completed the App Store Connect listing:

1. Log out of your Apple Developer account on the cloud Mac (Xcode → Preferences → Accounts → remove your account)
2. Delete the project files from the cloud Mac
3. Disconnect from the Remote Desktop session
4. If using MacinCloud Pay-As-You-Go, billing stops automatically when you disconnect

---

## Summary of Costs

| Item | Cost |
|------|------|
| MacinCloud Pay-As-You-Go (~2-3 hours) | ~$3-4 |
| Apple Developer Program (annual) | $99/year |
| **Total one-time cost to submit** | **~$103** |

---

## Need Help?

If you run into any issues during the build process, let me know and I can walk you through it step by step. The most common issues are:

1. **Signing errors** — Usually resolved by re-selecting your team in Xcode
2. **Build failures** — Usually resolved by cleaning the build (Product → Clean Build Folder) and trying again
3. **Upload failures** — Check your internet connection and try again

The entire process from signing up for MacinCloud to having the app uploaded should take about **1-2 hours**.
