import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

// Firebase App Check (anti-spam). Only active when a reCAPTCHA v3 site key is set.
// In the Firebase console it stays in MONITORING mode (requests are measured,
// nothing is blocked) until someone explicitly clicks "Enforce" for Firestore.
export const appCheckSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
if (appCheckSiteKey) {
  if (import.meta.env.DEV) {
    // Local development: print a debug token to register in the console instead of solving reCAPTCHA.
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

export const db = getFirestore(app);

export const analytics = isAnalyticsSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);
