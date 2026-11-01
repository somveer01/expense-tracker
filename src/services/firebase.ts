import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

// User can configure these in a .env file or localStorage
const getFirebaseConfig = () => {
  const customConfig = localStorage.getItem('surviva_firebase_config');
  if (customConfig) {
    try {
      return JSON.parse(customConfig);
    } catch {
      // ignore
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForLayoffSurvivalApp12345",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "layoff-survival-tracker.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "layoff-survival-tracker",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "layoff-survival-tracker.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
  };
};

let app: any;
let auth: any;
let isRealFirebase = false;

try {
  const config = getFirebaseConfig();
  app = getApps().length > 0 ? getApp() : initializeApp(config);
  auth = getAuth(app);
  // Check if real config is provided (not dummy default)
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyDummyKeyForLayoffSurvivalApp12345") {
    isRealFirebase = true;
  }
} catch (err) {
  console.warn("Firebase initialization notice:", err);
}

export { 
  app, 
  auth, 
  isRealFirebase,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged 
};
export type { User };
