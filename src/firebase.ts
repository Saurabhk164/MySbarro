import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU8ejaHSww_laMj5C-joEG6bBf70inoCM",
  authDomain: "sbarrospace.firebaseapp.com",
  projectId: "sbarrospace",
  storageBucket: "sbarrospace.firebasestorage.app",
  messagingSenderId: "717761655423",
  appId: "1:717761655423:web:e204554a2d141f634a054a",
  databaseURL: "https://sbarrospace-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 