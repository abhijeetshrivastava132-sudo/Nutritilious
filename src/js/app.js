const app = document.getElementById('app');
const vegToggle = document.getElementById('vegToggle');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const interestBtn = document.getElementById('interestBtn');
const knowMoreBtn = document.getElementById('knowMoreBtn');
const profileBtn = document.getElementById('profileBtn');
const categoryGrid = document.getElementById('categoryGrid');
const mealList = document.getElementById('mealList');
const filterList = document.getElementById('filterList');
let loginForm = document.getElementById('loginForm');
let loginPhone = null;
let sendOtpBtn = null;
let loginMessage = document.getElementById('loginMessage');
let otpBox = null;
let otpInput = null;
let otpHelper = null;
let verifyOtpBtn = null;
let changePhoneBtn = null;
let googleLoginBtn = null;
let guestLoginBtn = document.getElementById('guestLoginBtn');
const loginCard = document.getElementById('loginCard');
const accountCard = document.getElementById('accountCard');
let accountIdentityText = document.getElementById('accountIdentityText');
let logoutBtn = document.getElementById('logoutBtn');

const data = window.NUTRITILIOUS_DATA || { categories: [], meals: [], filters: [], deliveryRadiusKm: 8 };
const LOCATION_STORAGE_KEY = 'nutritiliousLocation';
const AUTH_STORAGE_KEY = 'nutritiliousUser';
const deliveryRadiusKm = data.deliveryRadiusKm || 8;
let firebaseAuth = null;
let currentFirebaseUser = null;
let authInitialized = false;
let confirmationResult = null;
let pendingPhoneNumber = '';
let recaptchaVerifier = null;

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

function mountLoginMarkup() {
  if (loginCard) {
    loginCard.className = 'login-card auth-card';
    loginCard.innerHTML = `
      <div class="auth-hero">
        <div class="auth-brand-mark">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8c-3.8 0-7 3.1-7 7 0 5.4 7 11.4 7 11.4s7-6 7-11.4c0-3.9-3.2-7-7-7zm0 9.6a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z"/></svg>
        </div>
        <span class="auth-pill">Fresh homemade meals</span>
      </div>
      <h1>Login or sign up</h1>
      <p>Get nearby home cooks, quick ordering, subscriptions, and order updates.</p>

      <form class="login-form phone-login-form" id="loginForm">
        <label for="loginPhone">Mobile number</label>
        <div class="phone-field auth-phone-field">
          <span>+91</span>
          <input id="loginPhone" type="tel" inputmode="numeric" maxlength="10" placeholder="Enter mobile number" autocomplete="tel" />
        </div>
        <button class="login-submit auth-primary-btn" id="sendOtpBtn" type="submit">Continue</button>
      </form>

      <div class="otp-box auth-otp-box" id="otpBox" hidden>
        <label for="otpInput">Enter OTP</label>
        <p class="otp-helper" id="otpHelper">We sent a 6 digit code to your mobile number.</p>
        <input id="otpInput" type="tel" inputmode="numeric" maxlength="6" placeholder="6 digit OTP" />
        <button class="login-submit auth-primary-btn" id="verifyOtpBtn" type="button">Verify and continue</button>
        <button class="text-btn" id="changePhoneBtn" type="button">Change mobile number</button>
      </div>

      <div class="guest-divider auth-divider">or</div>

      <button class="google-btn" id="googleLoginBtn" type="button">
        <span class="google-mark">G</span>
        <span>Continue with Google</span>
      </button>

      <button class="guest-btn" id="guestLoginBtn" type="button">Continue as Guest</button>
      <div id="recaptchaContainer" class="recaptcha-container" aria-hidden="true"></div>
      <p class="login-message" id="loginMessage">Use phone OTP, Google, or guest mode to continue.</p>
      <p class="auth-terms">By continuing, you agree to Nutritilious terms and privacy policy.</p>
    `;
  }

  if (accountCard) {
    accountCard.className = 'account-card auth-account-card';
    accountCard.innerHTML = `
      <div class="account-avatar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12c2.4 0 4.2-1.8 4.2-4.2S14.4 3.6 12 3.6 7.8 5.4 7.8 7.8 9.6 12 12 12z"/><path d="M4.8 20.4c0-3.2 3.2-5.6 7.2-5.6s7.2 2.4 7.2 5.6"/></svg>
      </div>
      <h1>Account</h1>
      <p id="accountIdentityText">Logged in</p>
      <div class="account-actions">
        <button class="login-submit auth-primary-btn" type="button" data-page-btn="homePage">Continue ordering</button>
        <button class="logout-btn" id="logoutBtn" type="button">Log out</button>
      </div>
    `;
  }

  cacheAuthRefs();
}

function cacheAuthRefs() {
  loginForm = document.getElementById('loginForm');
  loginPhone = document.getElementById('loginPhone');
  sendOtpBtn = document.getElementById('sendOtpBtn');
  loginMessage = document.getElementById('loginMessage');
  otpBox = document.getElementById('otpBox');
  otpInput = document.getElementById('otpInput');
  otpHelper = document.getElementById('otpHelper');
  verifyOtpBtn = document.getElementById('verifyOtpBtn');
  changePhoneBtn = document.getElementById('changePhoneBtn');
  googleLoginBtn = document.getElementById('googleLoginBtn');
  guestLoginBtn = document.getElementById('guestLoginBtn');
  accountIdentityText = document.getElementById('accountIdentityText');
  logoutBtn = document.getElementById('logoutBtn');
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
  firebaseAuth.languageCode = 'en';
  firebaseAuth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL).catch(() => {});
  return firebaseAuth;
}

function setLoginMessage(message, type = '') {
  if (!loginMessage) return;
  loginMessage.textContent = message;
  loginMessage.className = `login-message ${type}`.trim();
}

function setAuthButtonsDisabled(isDisabled) {
  if (sendOtpBtn) sendOtpBtn.disabled = isDisabled;
  if (verifyOtpBtn) verifyOtpBtn.disabled = isDisabled;
  if (changePhoneBtn) changePhoneBtn.disabled = isDisabled;
  if (googleLoginBtn) googleLoginBtn.disabled = isDisabled;
  if (guestLoginBtn) guestLoginBtn.disabled = isDisabled;
  if (logoutBtn) logoutBtn.disabled = isDisabled;
}

function getCleanPhoneNumber() {
  return (loginPhone?.value || '').replace(/\D/g, '').slice(0, 10);
}

function formatFirebasePhone(phone) {
  return `+91${phone}`;
}

async function getRecaptchaVerifier() {
  const auth = getFirebaseAuth();
  const container = document.getElementById('recaptchaContainer');

  if (!auth || !container || !window.firebase?.auth?.RecaptchaVerifier) return null;
  if (recaptchaVerifier) return recaptchaVerifier;

  recaptchaVerifier = new window.firebase.auth.RecaptchaVerifier('recaptchaContainer', {
    size: 'invisible',
    callback: () => {}
  });

  recaptchaVerifier.widgetId = await recaptchaVerifier.render();
  return recaptchaVerifier;
}

function resetRecaptcha() {
  try {
    if (window.grecaptcha && recaptchaVerifier?.widgetId !== undefined) {
      window.grecaptcha.reset(recaptchaVerifier.widgetId);
    }
  } catch (error) {}
}

function getUserSnapshot(user) {
  if (!user) return null;

  return {
    provider: 'firebase',
    uid: user.uid,
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    isAnonymous: Boolean(user.isAnonymous),
    providerIds: (user.providerData || []).map((provider) => provider.providerId),
    loggedInAt: new Date().toISOString()
  };
}

function getCurrentAuthUser() {
  return currentFirebaseUser ? getUserSnapshot(currentFirebaseUser) : getSavedUser();
}

function formatUserIdentity(user) {
  if (!user) return 'Logged in';
  if (user.isAnonymous) return 'Guest account active';
  if (user.phoneNumber) return `Logged in with ${user.phoneNumber}`;
  if (user.displayName && user.email) return `${user.displayName} • ${user.email}`;
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

function showOtpStep(phone) {
  pendingPhoneNumber = phone;
  if (otpBox) otpBox.hidden = false;
  if (loginForm) loginForm.classList.add('otp-active');
  if (otpHelper) otpHelper.textContent = `We sent a 6 digit code to +91 ${phone}.`;
  if (otpInput) {
    otpInput.value = '';
    otpInput.focus();
  }
}

function resetLoginStep() {
  pendingPhoneNumber = '';
  confirmationResult = null;
  if (otpBox) otpBox.hidden = true;
  if (loginForm) loginForm.classList.remove('otp-active');
  if (otpInput) otpInput.value = '';
  setLoginMessage('Use phone OTP, Google, or guest mode to continue.');
  loginPhone?.focus();
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const phone = getCleanPhoneNumber();

  if (phone.length !== 10) {
    setLoginMessage('Enter a valid 10 digit mobile number.', 'error');
    loginPhone?.focus();
    return;
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    setLoginMessage('Firebase config missing. Check src/js/firebase-config.js.', 'error');
    return;
  }

  setAuthButtonsDisabled(true);
  setLoginMessage('Sending OTP...');

  try {
    const verifier = await getRecaptchaVerifier();
    if (!verifier) throw new Error('Firebase reCAPTCHA could not load.');

    confirmationResult = await auth.signInWithPhoneNumber(formatFirebasePhone(phone), verifier);
    if (loginPhone) loginPhone.value = phone;
    showOtpStep(phone);
    setLoginMessage(`OTP sent to +91 ${phone}.`, 'success');
  } catch (error) {
    resetRecaptcha();
    setLoginMessage(error.message || 'Could not send OTP. Check Phone provider and authorized domain.', 'error');
  } finally {
    setAuthButtonsDisabled(false);
  }
}

async function handleOtpVerify() {
  const otp = (otpInput?.value || '').replace(/\D/g, '').slice(0, 6);

  if (!confirmationResult || !pendingPhoneNumber) {
    setLoginMessage('Enter mobile number first.', 'error');
    return;
  }

  if (otp.length !== 6) {
    setLoginMessage('Enter a valid 6 digit OTP.', 'error');
    otpInput?.focus();
    return;
  }

  setAuthButtonsDisabled(true);
  setLoginMessage('Verifying OTP...');

  try {
    await confirmationResult.confirm(otp);
    setLoginMessage('Login successful.', 'success');
    resetLoginStep();
  } catch (error) {
    setLoginMessage(error.message || 'Wrong or expired OTP.', 'error');
    otpInput?.focus();
  } finally {
    setAuthButtonsDisabled(false);
  }
}

async function handleGoogleLogin() {
  const auth = getFirebaseAuth();
  if (!auth) {
    setLoginMessage('Firebase config missing. Check src/js/firebase-config.js.', 'error');
    return;
  }

  const provider = new window.firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  setAuthButtonsDisabled(true);
  setLoginMessage('Opening Google login...');

  try {
    await auth.signInWithPopup(provider);
    setLoginMessage('Google login successful.', 'success');
  } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      await auth.signInWithRedirect(provider);
      return;
    }
    setLoginMessage(error.message || 'Google login failed. Check Google provider and domain.', 'error');
  } finally {
    setAuthButtonsDisabled(false);
  }
}

async function handleGuestLogin() {
  const auth = getFirebaseAuth();
  if (!auth) {
    setLoginMessage('Firebase config missing. Check src/js/firebase-config.js.', 'error');
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
    setLoginMessage('Firebase config missing. Check src/js/firebase-config.js.');
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

  auth.getRedirectResult()
    .then((result) => {
      if (result?.user) setLoginMessage('Google login successful.', 'success');
    })
    .catch((error) => {
      if (error?.message) setLoginMessage(error.message, 'error');
    });
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

  document.addEventListener('click', (event) => {
    const pageButton = event.target.closest('[data-page-btn]');
    if (pageButton) openPage(pageButton.dataset.pageBtn);
  });

  interestBtn?.addEventListener('click', () => {
    interestBtn.classList.toggle('interested');
    const text = interestBtn.querySelector('.interest-text');
    text.textContent = interestBtn.classList.contains('interested') ? 'Interest Saved' : 'I’m Interested';
  });

  knowMoreBtn?.addEventListener('click', () => openPage('knowMorePage'));
  profileBtn?.addEventListener('click', () => openPage('loginPage'));
  loginForm?.addEventListener('submit', handleLoginSubmit);
  verifyOtpBtn?.addEventListener('click', handleOtpVerify);
  changePhoneBtn?.addEventListener('click', resetLoginStep);
  googleLoginBtn?.addEventListener('click', handleGoogleLogin);
  guestLoginBtn?.addEventListener('click', handleGuestLogin);
  logoutBtn?.addEventListener('click', handleLogout);

  loginPhone?.addEventListener('input', () => {
    loginPhone.value = getCleanPhoneNumber();
  });

  otpInput?.addEventListener('input', () => {
    otpInput.value = (otpInput.value || '').replace(/\D/g, '').slice(0, 6);
  });

  window.addEventListener('nutritilious:location-changed', renderMeals);
}

mountLoginMarkup();
renderCategories();
renderFilters();
renderMeals();
initFirebaseAuth();
bindEvents();
