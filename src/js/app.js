const app = document.getElementById('app');
const vegToggle = document.getElementById('vegToggle');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageButtons = document.querySelectorAll('[data-page-btn]');
const interestBtn = document.getElementById('interestBtn');
const knowMoreBtn = document.getElementById('knowMoreBtn');
const profileBtn = document.getElementById('profileBtn');
const categoryGrid = document.getElementById('categoryGrid');
const mealList = document.getElementById('mealList');
const filterList = document.getElementById('filterList');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const sendLoginLinkBtn = document.getElementById('sendLoginLinkBtn');
const loginMessage = document.getElementById('loginMessage');
const emailLinkBox = document.getElementById('emailLinkBox');
const emailLinkText = document.getElementById('emailLinkText');
const resendEmailLinkBtn = document.getElementById('resendEmailLinkBtn');
const changeEmailBtn = document.getElementById('changeEmailBtn');
const guestLoginBtn = document.getElementById('guestLoginBtn');
const loginCard = document.getElementById('loginCard');
const accountCard = document.getElementById('accountCard');
const accountIdentityText = document.getElementById('accountIdentityText');
const logoutBtn = document.getElementById('logoutBtn');

const data = window.NUTRITILIOUS_DATA || { categories: [], meals: [], filters: [], deliveryRadiusKm: 8 };
const LOCATION_STORAGE_KEY = 'nutritiliousLocation';
const AUTH_STORAGE_KEY = 'nutritiliousUser';
const EMAIL_FOR_SIGNIN_KEY = 'nutritiliousEmailForSignIn';
const deliveryRadiusKm = data.deliveryRadiusKm || 8;
let firebaseAuth = null;
let currentFirebaseUser = null;
let authInitialized = false;
let pendingEmailAddress = '';

function icon(type) {
  const icons = {
    filter: '<svg viewBox="0 0 24 24"><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z"/></svg>',
    flash: '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 10-13h-7l0-7z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24"><path d="M5 12c0-5 4-8 11-9 2 7-1 13-7 13H5z"/><path d="M5 21c1-5 5-8 10-10"/></svg>',
    rupee: '<svg viewBox="0 0 24 24"><path d="M6 4h12"/><path d="M9 4c3 0 5 1.5 5 4s-2 4-5 4h-3l8 8"/><path d="M6 8h12"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>'
  };
  return icons[type] || icons.filter;
}

function getSavedLocation() {
  try {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

function getSavedUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    const user = saved ? JSON.parse(saved) : null;
    return user?.provider === 'firebase' ? user : null;
  } catch (error) {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function hasGpsLocation(location) {
  return Boolean(location && toNumber(location.latitude) !== null && toNumber(location.longitude) !== null);
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistanceKm(startLatitude, startLongitude, endLatitude, endLongitude) {
  const earthRadiusKm = 6371;
  const latitudeDiff = degreesToRadians(endLatitude - startLatitude);
  const longitudeDiff = degreesToRadians(endLongitude - startLongitude);

  const startLatRad = degreesToRadians(startLatitude);
  const endLatRad = degreesToRadians(endLatitude);

  const value =
    Math.sin(latitudeDiff / 2) * Math.sin(latitudeDiff / 2) +
    Math.cos(startLatRad) * Math.cos(endLatRad) *
    Math.sin(longitudeDiff / 2) * Math.sin(longitudeDiff / 2);

  const centralAngle = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  return earthRadiusKm * centralAngle;
}

function formatDistance(distanceKm) {
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1)} km`;
}

function getMealsForLocation() {
  const savedLocation = getSavedLocation();

  if (!hasGpsLocation(savedLocation)) {
    return data.meals.map((meal) => ({
      ...meal,
      computedDistance: null,
      distanceLabel: meal.distance,
      locationMatched: false
    }));
  }

  const userLatitude = toNumber(savedLocation.latitude);
  const userLongitude = toNumber(savedLocation.longitude);

  return data.meals
    .map((meal) => {
      const providerLatitude = toNumber(meal.latitude);
      const providerLongitude = toNumber(meal.longitude);

      if (providerLatitude === null || providerLongitude === null) {
        return {
          ...meal,
          computedDistance: null,
          distanceLabel: meal.distance,
          locationMatched: false
        };
      }

      const computedDistance = calculateDistanceKm(
        userLatitude,
        userLongitude,
        providerLatitude,
        providerLongitude
      );

      return {
        ...meal,
        computedDistance,
        distanceLabel: `${formatDistance(computedDistance)} away`,
        locationMatched: computedDistance <= deliveryRadiusKm
      };
    })
    .filter((meal) => meal.locationMatched)
    .sort((firstMeal, secondMeal) => firstMeal.computedDistance - secondMeal.computedDistance);
}

function renderCategories() {
  categoryGrid.innerHTML = data.categories
    .map((category) => `
      <button class="cat-item" type="button">
        <div class="cat-img-wrap">
          <img class="cat-img" src="${category.image}" alt="${category.name}">
        </div>
        <div class="cat-name">${category.name}</div>
      </button>
    `)
    .join('');
}

function renderFilters() {
  const iconMap = ['filter', 'star', 'flash', 'leaf', 'rupee'];
  filterList.innerHTML = data.filters
    .map((filter, index) => `<button class="filter-chip" type="button">${icon(iconMap[index])}${filter}</button>`)
    .join('');
}

function renderEmptyNearbyState() {
  mealList.innerHTML = `
    <div class="nearby-empty">
      <div class="nearby-empty-icon">${icon('pin')}</div>
      <h3>No nearby homemade food providers yet</h3>
      <p>We could not find providers within ${deliveryRadiusKm} km of your selected location. Try manual location or check again later.</p>
    </div>
  `;
}

function renderMeals() {
  const meals = getMealsForLocation();

  if (!meals.length) {
    renderEmptyNearbyState();
    return;
  }

  mealList.innerHTML = meals
    .map((meal) => `
      <article class="restaurant-card">
        <div class="restaurant-img-box">
          <img class="restaurant-img" src="${meal.image}" alt="${meal.name}">
          <div class="discount-badge">${meal.discount}</div>
          <div class="time-badge">${meal.time}</div>
        </div>
        <div class="restaurant-content">
          <div class="restaurant-top">
            <div>
              <h3 class="restaurant-name">${meal.name}</h3>
              <div class="restaurant-meta">${meal.meta}</div>
            </div>
            <div class="rating">${meal.rating} ★</div>
          </div>
          <div class="restaurant-bottom">
            <div class="price">${meal.price}</div>
            <div class="distance">${meal.distanceLabel}</div>
          </div>
        </div>
      </article>
    `)
    .join('');
}

function isFirebaseConfigReady() {
  const config = window.NUTRITILIOUS_FIREBASE_CONFIG;
  return Boolean(
    config &&
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    !String(config.apiKey).includes('PASTE_') &&
    !String(config.projectId).includes('PASTE_')
  );
}

function getFirebaseAuth() {
  if (firebaseAuth) return firebaseAuth;
  if (!window.firebase || !isFirebaseConfigReady()) return null;

  if (!window.firebase.apps.length) {
    window.firebase.initializeApp(window.NUTRITILIOUS_FIREBASE_CONFIG);
  }

  firebaseAuth = window.firebase.auth();
  firebaseAuth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL).catch(() => {});
  return firebaseAuth;
}

function getAuthRedirectUrl() {
  return window.NUTRITILIOUS_FIREBASE_AUTH_REDIRECT_URL || `${window.location.origin}${window.location.pathname}`;
}

function getCleanEmail() {
  return (loginEmail?.value || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoginMessage(message, type = '') {
  if (!loginMessage) return;
  loginMessage.textContent = message;
  loginMessage.className = `login-message ${type}`.trim();
}

function setAuthButtonsDisabled(isDisabled) {
  if (sendLoginLinkBtn) sendLoginLinkBtn.disabled = isDisabled;
  if (resendEmailLinkBtn) resendEmailLinkBtn.disabled = isDisabled;
  if (guestLoginBtn) guestLoginBtn.disabled = isDisabled;
  if (logoutBtn) logoutBtn.disabled = isDisabled;
}

function getUserSnapshot(user) {
  if (!user) return null;
  return {
    provider: 'firebase',
    uid: user.uid,
    email: user.email || '',
    isAnonymous: Boolean(user.isAnonymous),
    loggedInAt: new Date().toISOString()
  };
}

function getCurrentAuthUser() {
  return currentFirebaseUser ? getUserSnapshot(currentFirebaseUser) : getSavedUser();
}

function formatUserIdentity(user) {
  if (!user) return 'Logged in';
  if (user.isAnonymous) return 'Guest account active';
  if (user.email) return `Logged in with ${user.email}`;
  return 'Firebase account active';
}

function updateLoginView() {
  const user = getCurrentAuthUser();

  if (user) {
    if (loginCard) loginCard.hidden = true;
    if (accountCard) accountCard.hidden = false;
    if (accountIdentityText) accountIdentityText.textContent = formatUserIdentity(user);
    profileBtn?.classList.add('logged-in');
    return;
  }

  if (loginCard) loginCard.hidden = false;
  if (accountCard) accountCard.hidden = true;
  if (accountIdentityText) accountIdentityText.textContent = 'Logged in';
  profileBtn?.classList.remove('logged-in');
}

function showEmailLinkStep(email) {
  pendingEmailAddress = email;
  if (emailLinkBox) emailLinkBox.hidden = false;
  if (loginForm) loginForm.classList.add('link-sent');
  if (emailLinkText) {
    emailLinkText.textContent = `A secure Firebase login link has been sent to ${email}. Open it on this device to continue.`;
  }
}

function resetLoginStep() {
  pendingEmailAddress = '';
  if (emailLinkBox) emailLinkBox.hidden = true;
  if (loginForm) loginForm.classList.remove('link-sent');
  setLoginMessage('Email link login is passwordless and avoids SMS OTP cost.');
  loginEmail?.focus();
}

async function sendEmailLoginLink(email) {
  const auth = getFirebaseAuth();
  if (!auth) {
    setLoginMessage('Firebase config missing. Paste config in src/js/firebase-config.js first.', 'error');
    return;
  }

  const actionCodeSettings = {
    url: getAuthRedirectUrl(),
    handleCodeInApp: true
  };

  setAuthButtonsDisabled(true);
  setLoginMessage('Sending Firebase login link...');

  try {
    await auth.sendSignInLinkToEmail(email, actionCodeSettings);
    localStorage.setItem(EMAIL_FOR_SIGNIN_KEY, email);
    showEmailLinkStep(email);
    setLoginMessage('Login link sent. Check your email.', 'success');
  } catch (error) {
    setLoginMessage(error.message || 'Could not send login link. Check Firebase setup.', 'error');
  } finally {
    setAuthButtonsDisabled(false);
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = getCleanEmail();

  if (!isValidEmail(email)) {
    setLoginMessage('Enter a valid email address.', 'error');
    loginEmail?.focus();
    return;
  }

  if (loginEmail) loginEmail.value = email;
  await sendEmailLoginLink(email);
}

async function handleResendEmailLink() {
  const email = pendingEmailAddress || localStorage.getItem(EMAIL_FOR_SIGNIN_KEY) || getCleanEmail();
  if (!isValidEmail(email)) {
    setLoginMessage('Enter email again to resend the link.', 'error');
    resetLoginStep();
    return;
  }

  await sendEmailLoginLink(email);
}

async function handleGuestLogin() {
  const auth = getFirebaseAuth();
  if (!auth) {
    setLoginMessage('Firebase config missing. Paste config in src/js/firebase-config.js first.', 'error');
    return;
  }

  setAuthButtonsDisabled(true);
  setLoginMessage('Creating guest session...');

  try {
    await auth.signInAnonymously();
    setLoginMessage('Guest session created.', 'success');
  } catch (error) {
    setLoginMessage(error.message || 'Guest login failed. Enable Anonymous provider in Firebase.', 'error');
  } finally {
    setAuthButtonsDisabled(false);
  }
}

async function completeEmailLinkSignInIfNeeded() {
  const auth = getFirebaseAuth();
  if (!auth || !auth.isSignInWithEmailLink(window.location.href)) return;

  let email = localStorage.getItem(EMAIL_FOR_SIGNIN_KEY);
  if (!email) {
    email = window.prompt('Enter the email address you used for login');
  }

  if (!email || !isValidEmail(email)) {
    setLoginMessage('Email confirmation required to complete Firebase login.', 'error');
    return;
  }

  setLoginMessage('Completing Firebase login...');

  try {
    await auth.signInWithEmailLink(email, window.location.href);
    localStorage.removeItem(EMAIL_FOR_SIGNIN_KEY);
    window.history.replaceState({}, document.title, getAuthRedirectUrl());
    setLoginMessage('Login successful.', 'success');
  } catch (error) {
    setLoginMessage(error.message || 'Firebase login link expired or invalid.', 'error');
  }
}

async function handleLogout() {
  const auth = getFirebaseAuth();
  setAuthButtonsDisabled(true);

  try {
    if (auth) await auth.signOut();
    clearUser();
    currentFirebaseUser = null;
    updateLoginView();
    resetLoginStep();
    setLoginMessage('Logged out successfully.', 'success');
  } catch (error) {
    setLoginMessage(error.message || 'Logout failed.', 'error');
  } finally {
    setAuthButtonsDisabled(false);
  }
}

function initFirebaseAuth() {
  const auth = getFirebaseAuth();

  if (!auth) {
    clearUser();
    updateLoginView();
    setLoginMessage('Paste Firebase config and enable Email Link + Anonymous sign-in to activate real login.');
    return;
  }

  authInitialized = true;
  auth.onAuthStateChanged((user) => {
    currentFirebaseUser = user;

    if (user) {
      saveUser(getUserSnapshot(user));
    } else {
      clearUser();
    }

    updateLoginView();
  });

  completeEmailLinkSignInIfNeeded();
}

function openPage(pageId) {
  pages.forEach((page) => page.classList.remove('active-page'));
  document.getElementById(pageId)?.classList.add('active-page');

  navItems.forEach((item) => {
    item.classList.remove('active');
    const navPage = pageId === 'knowMorePage' ? 'subscriptionPage' : pageId;
    if (item.dataset.page === navPage) item.classList.add('active');
  });

  if (pageId === 'homePage') {
    app.classList.remove('inner-page');
  } else {
    app.classList.add('inner-page');
  }

  if (pageId === 'loginPage') {
    updateLoginView();
    if (!authInitialized && !getFirebaseAuth()) {
      setLoginMessage('Firebase config missing. Add config before testing login.', 'error');
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindEvents() {
  vegToggle?.addEventListener('click', () => vegToggle.classList.toggle('off'));

  navItems.forEach((item) => {
    item.addEventListener('click', () => openPage(item.dataset.page));
  });

  pageButtons.forEach((button) => {
    button.addEventListener('click', () => openPage(button.dataset.pageBtn));
  });

  interestBtn?.addEventListener('click', () => {
    interestBtn.classList.toggle('interested');
    const text = interestBtn.querySelector('.interest-text');
    text.textContent = interestBtn.classList.contains('interested') ? 'Interest Saved' : 'I’m Interested';
  });

  knowMoreBtn?.addEventListener('click', () => openPage('knowMorePage'));
  profileBtn?.addEventListener('click', () => openPage('loginPage'));
  loginForm?.addEventListener('submit', handleLoginSubmit);
  resendEmailLinkBtn?.addEventListener('click', handleResendEmailLink);
  changeEmailBtn?.addEventListener('click', resetLoginStep);
  guestLoginBtn?.addEventListener('click', handleGuestLogin);
  logoutBtn?.addEventListener('click', handleLogout);

  loginEmail?.addEventListener('input', () => {
    loginEmail.value = getCleanEmail();
  });

  window.addEventListener('nutritilious:location-changed', renderMeals);
}

renderCategories();
renderFilters();
renderMeals();
initFirebaseAuth();
bindEvents();
