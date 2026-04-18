import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.radiantilyk.aesthetic",
  appName: "RadiantilyK Aesthetic",
  webDir: "dist/public",
  server: {
    // Point to the live server so the app uses the real backend
    url: "https://rkaskinai.com",
    androidScheme: "https",
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "RadiantilyK",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#FAF7F2",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#FAF7F2",
    },
  },
};

export default config;
