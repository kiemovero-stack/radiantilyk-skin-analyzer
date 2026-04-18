# Android Build Guide — RadiantilyK Aesthetic

Build and publish the RadiantilyK Android app from your **Windows PC**.

---

## Prerequisites

1. **Android Studio** (free) — Download from [developer.android.com/studio](https://developer.android.com/studio)
2. **Google Play Developer Account** ($25 one-time fee) — Sign up at [play.google.com/console](https://play.google.com/console)
3. **Git** — Download from [git-scm.com](https://git-scm.com/download/win)

---

## Step 1: Install Android Studio

1. Download Android Studio from [developer.android.com/studio](https://developer.android.com/studio)
2. Run the installer and follow the setup wizard
3. When prompted, install the **Android SDK** (default settings are fine)
4. Wait for all components to download (this takes 10-15 minutes)

---

## Step 2: Clone the Project

Open **Command Prompt** or **PowerShell** and run:

```bash
git clone https://github.com/kiemovero-stack/radiantilyk-skin-analyzer.git
cd radiantilyk-skin-analyzer
```

---

## Step 3: Open in Android Studio

1. Open **Android Studio**
2. Click **"Open"** (not "New Project")
3. Navigate to the cloned folder and select the **`android`** subfolder
4. Click **OK**
5. Wait for Gradle sync to complete (first time takes 5-10 minutes)

---

## Step 4: Test on Emulator (Optional)

1. In Android Studio, click **Tools → Device Manager**
2. Click **"Create Device"**
3. Select **Pixel 7** → Click **Next**
4. Download a system image (e.g., **API 34**) → Click **Next** → **Finish**
5. Click the **Play** button (green triangle) in the toolbar
6. The app should launch in the emulator

---

## Step 5: Generate Signed APK/AAB

To publish on Google Play, you need a signed Android App Bundle (AAB):

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle** → Click **Next**
3. **Create a new keystore:**
   - Click **"Create new..."**
   - Choose a location (e.g., `C:\Users\YourName\radiantilyk-keystore.jks`)
   - Set a strong password (SAVE THIS — you'll need it for every update)
   - Fill in the certificate info:
     - First and Last Name: `Kiem Vukadinovic`
     - Organization: `RadiantilyK Aesthetic LLC`
     - City: `Fremont`
     - State: `CA`
     - Country Code: `US`
   - Click **OK**
4. Select **release** build variant → Click **Finish**
5. The signed AAB file will be in: `android/app/release/app-release.aab`

> **IMPORTANT:** Keep your keystore file and password safe! You need the same keystore for all future app updates.

---

## Step 6: Create Google Play Listing

1. Go to [play.google.com/console](https://play.google.com/console)
2. Click **"Create app"**
3. Fill in the details:

| Field | Value |
|-------|-------|
| App name | RadiantilyK Aesthetic |
| Default language | English (United States) |
| App or game | App |
| Free or paid | Free |

4. Accept the declarations and click **Create app**

---

## Step 7: Upload to Google Play

1. In the Play Console, go to **Release → Production**
2. Click **"Create new release"**
3. Upload the **app-release.aab** file from Step 5
4. Add release notes:
   ```
   RadiantilyK Aesthetic - Your AI-powered skincare companion.
   
   Features:
   • AI Skin Analysis with personalized treatment recommendations
   • Easy appointment booking with your provider
   • Loyalty rewards program
   • Secure card on file for hassle-free visits
   ```
5. Click **Review release** → **Start rollout to Production**

---

## Step 8: Complete Store Listing

Go to **Grow → Store listing** and fill in:

### Short Description (80 chars max)
```
AI-powered skin analysis & easy appointment booking at RadiantilyK Aesthetic
```

### Full Description
```
RadiantilyK Aesthetic brings professional skincare analysis and appointment booking to your fingertips.

✨ AI Skin Analysis
Upload a photo and receive a comprehensive AI-powered skin analysis with advanced diagnostics, severity grading, and personalized treatment recommendations.

📅 Easy Booking
Book appointments with your provider in just a few taps. View available times, select your preferred provider, and confirm your visit instantly.

🎁 Rewards Program
Earn points on every treatment and redeem them for discounts. Progress through tiers from Glow to Icon status.

💳 Secure & Simple
Add your card on file securely through Stripe. No charges at booking — your card is held only for our cancellation policy.

RadiantilyK Aesthetic LLC
Fremont, CA | (510) 990-1444
```

### Screenshots
You'll need:
- **Phone screenshots:** At least 2 screenshots (1080x1920 or similar)
- **Feature graphic:** 1024x500 banner image

> **Tip:** Take screenshots from the emulator in Step 4, or use your phone to screenshot the web app at rkaskinai.com

### App Icon
The app icon is already configured in the project — it will be pulled automatically from the build.

---

## Step 9: Content Rating & Privacy

1. **Content rating:** Go to **Policy → App content → Content rating** → Start questionnaire → Select "Utility" category → Answer all questions → Submit
2. **Privacy policy:** You need a privacy policy URL. Use: `https://rkaskinai.com/privacy` (or create one)
3. **Data safety:** Declare what data your app collects (email, name, phone, payment info)

---

## Timeline

| Step | Time |
|------|------|
| Install Android Studio | 15-20 min |
| Clone & open project | 5-10 min |
| Build signed AAB | 5 min |
| Create Play listing | 20-30 min |
| Google review | 1-7 days |

---

## Troubleshooting

**Gradle sync fails:**
- Make sure you have a stable internet connection
- Try: File → Invalidate Caches → Restart

**Build fails:**
- Check that Android SDK is installed: File → Settings → Languages & Frameworks → Android SDK
- Minimum SDK should be API 22+

**App shows blank screen:**
- The app connects to `https://rkaskinai.com` — make sure the website is published and accessible

---

## Need Help?

Contact the development team or refer to:
- [Capacitor Android docs](https://capacitorjs.com/docs/android)
- [Google Play Console help](https://support.google.com/googleplay/android-developer)
