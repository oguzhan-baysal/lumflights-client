'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics sadece client tarafında çalışır
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Firestore'u özel ayarlarla başlat
const db = getFirestore(app);

// Client-side'da persistence'ı etkinleştir
if (typeof window !== 'undefined') {
  try {
    // Offline persistence'ı etkinleştir
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Offline persistence çoklu sekme açıkken çalışmaz');
      } else if (err.code === 'unimplemented') {
        console.warn('Tarayıcınız offline persistence desteklemiyor');
      }
    });
  } catch (error) {
    console.error('Offline persistence etkinleştirilirken hata:', error);
  }
}

const auth = getAuth(app);

export { db, auth, analytics }; 