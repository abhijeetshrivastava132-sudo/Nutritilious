const PROFILE_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCzD-QcA0K-rSXM5VZYsGB2bE3FEfhkyX0",
  authDomain: "nutrilious-ceebd.firebaseapp.com",
  projectId: "nutrilious-ceebd",
  storageBucket: "nutrilious-ceebd.firebasestorage.app",
  messagingSenderId: "904909524137",
  appId: "1:904909524137:web:e20913ddbd9aa3d3856db8"
};

(function () {
  let auth = null;
  let db = null;

  function initFirebaseProfileBackend() {
    if (!window.firebase) return null;

    if (!firebase.apps.length) {
      firebase.initializeApp(PROFILE_FIREBASE_CONFIG);
    }

    auth = firebase.auth ? firebase.auth() : null;
    db = firebase.firestore ? firebase.firestore() : null;
    return { auth, db };
  }

  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem("nutritiliousUser") || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function getUserId() {
    const storedUser = getStoredUser();
    const firebaseUser = auth && auth.currentUser ? auth.currentUser : null;
    return firebaseUser && firebaseUser.uid ? firebaseUser.uid : storedUser.uid || null;
  }

  function getLocalKey(field) {
    const storedUser = getStoredUser();
    const id = getUserId() || storedUser.email || storedUser.phone || storedUser.provider || "guest";
    return `nutritiliousProfile_${String(id).replace(/[^a-zA-Z0-9_-]/g, "_")}_${field}`;
  }

  function saveLocalProfile(profile) {
    localStorage.setItem(getLocalKey("Name"), profile.name || "");
    localStorage.setItem(getLocalKey("Phone"), profile.phone || "");
    localStorage.setItem(getLocalKey("Email"), profile.email || "");
    localStorage.setItem(getLocalKey("Language"), profile.language || "English");
  }

  function loadLocalProfile() {
    return {
      name: localStorage.getItem(getLocalKey("Name")) || "",
      phone: localStorage.getItem(getLocalKey("Phone")) || "",
      email: localStorage.getItem(getLocalKey("Email")) || "",
      language: localStorage.getItem(getLocalKey("Language")) || "English"
    };
  }

  function getProfileDoc() {
    const userId = getUserId();
    if (!db || !userId) return null;
    return db.collection("users").doc(userId).collection("profile").doc("details");
  }

  async function waitForAuthReady() {
    initFirebaseProfileBackend();

    if (!auth) return getStoredUser();
    if (auth.currentUser) return auth.currentUser;

    return new Promise(resolve => {
      let resolved = false;
      const done = user => {
        if (resolved) return;
        resolved = true;
        resolve(user || getStoredUser());
      };

      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe();
        done(user);
      });

      setTimeout(() => done(getStoredUser()), 1500);
    });
  }

  async function saveProfile(profile) {
    initFirebaseProfileBackend();
    saveLocalProfile(profile);
    await waitForAuthReady();

    const doc = getProfileDoc();
    if (!doc) return { savedToBackend: false, savedToLocal: true };

    await doc.set({
      name: profile.name || "",
      phone: profile.phone || "",
      email: profile.email || "",
      language: profile.language || "English",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { savedToBackend: true, savedToLocal: true };
  }

  async function loadProfile() {
    initFirebaseProfileBackend();
    await waitForAuthReady();

    const doc = getProfileDoc();
    if (!doc) return loadLocalProfile();

    const snapshot = await doc.get();
    if (!snapshot.exists) return loadLocalProfile();

    const data = snapshot.data() || {};
    const profile = {
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      language: data.language || "English"
    };

    saveLocalProfile(profile);
    return profile;
  }

  async function logout() {
    initFirebaseProfileBackend();

    if (auth) {
      await auth.signOut().catch(() => {});
    }

    localStorage.removeItem("nutritiliousAuthType");
    localStorage.removeItem("nutritiliousUser");
    localStorage.setItem("nutritiliousLoggedOut", "true");
    sessionStorage.clear();
  }

  window.NutritiliousProfileBackend = {
    init: initFirebaseProfileBackend,
    saveProfile,
    loadProfile,
    logout
  };
})();
