// Firebase config for Nutritilious.
// Paste your Firebase Web App config here from Firebase Console > Project settings > Your apps > Web app.
// This config is public by design, but keep Firebase security rules and authorized domains strict.

window.NUTRITILIOUS_FIREBASE_CONFIG = {
  apiKey: 'PASTE_FIREBASE_API_KEY',
  authDomain: 'PASTE_PROJECT_ID.firebaseapp.com',
  projectId: 'PASTE_PROJECT_ID',
  storageBucket: 'PASTE_PROJECT_ID.appspot.com',
  messagingSenderId: 'PASTE_MESSAGING_SENDER_ID',
  appId: 'PASTE_FIREBASE_APP_ID'
};

window.NUTRITILIOUS_FIREBASE_AUTH_REDIRECT_URL = `${window.location.origin}${window.location.pathname}`;
