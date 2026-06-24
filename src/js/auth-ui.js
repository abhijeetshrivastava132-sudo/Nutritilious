(() => {
  const GOOGLE_LOGO = `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.1L6.1 33C9.5 39.5 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4 5.5l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  `;

  const BELL_ICON = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 17H9"/>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
      <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
    </svg>
  `;

  const PROFILE_ICON = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12c2.6 0 4.6-2 4.6-4.6S14.6 2.8 12 2.8 7.4 4.8 7.4 7.4 9.4 12 12 12z"/>
      <path d="M4.6 20.2V19c0-3.1 4.2-4.8 7.4-4.8s7.4 1.7 7.4 4.8v1.2"/>
    </svg>
  `;

  function injectUiAssets() {
    if (!document.querySelector('link[href="src/css/ui-fixes.css"]')) {
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = 'src/css/ui-fixes.css';
      document.head.appendChild(styleLink);
    }

    if (!document.querySelector('link[href^="src/css/header-bg.css"]')) {
      const headerBgLink = document.createElement('link');
      headerBgLink.rel = 'stylesheet';
      headerBgLink.href = 'src/css/header-bg.css?v=2';
      document.head.appendChild(headerBgLink);
    }

    if (!document.querySelector('script[src="src/js/location-details.js"]')) {
      const detailsScript = document.createElement('script');
      detailsScript.src = 'src/js/location-details.js';
      detailsScript.defer = true;
      document.head.appendChild(detailsScript);
    }

    if (!document.getElementById('headerNavFixStyle')) {
      const style = document.createElement('style');
      style.id = 'headerNavFixStyle';
      style.textContent = `
        body .app .top-header .top-row::after {
          content: none !important;
          display: none !important;
        }

        body .app .notification-btn {
          position: relative;
          z-index: 4;
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          margin-left: 8px;
          border: 0;
          border-radius: 50%;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.16);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.14);
          -webkit-tap-highlight-color: transparent;
        }

        body .app .notification-btn svg {
          width: 23px;
          height: 23px;
          stroke: currentColor;
          stroke-width: 2.2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        body .app .bottom-nav {
          grid-template-columns: repeat(5, 1fr) !important;
        }

        body .app .bottom-nav .nav-profile-cta {
          color: #777777;
          background: transparent;
        }

        body .app .bottom-nav .nav-profile-cta.active {
          color: var(--brand);
          background: var(--brand-soft);
        }
      `;
      document.head.appendChild(style);
    }
  }

  function replaceHeaderProfileWithNotification() {
    const oldProfileButton = document.querySelector('.top-header .profile-btn');
    if (!oldProfileButton || document.getElementById('notificationBtn')) return;

    const notificationButton = document.createElement('button');
    notificationButton.className = 'notification-btn';
    notificationButton.id = 'notificationBtn';
    notificationButton.type = 'button';
    notificationButton.setAttribute('aria-label', 'Notifications');
    notificationButton.innerHTML = BELL_ICON;

    oldProfileButton.replaceWith(notificationButton);
  }

  function addProfileBottomCta() {
    const bottomNav = document.querySelector('.bottom-nav');
    if (!bottomNav || document.getElementById('profileCtaBtn')) return;

    const profileCta = document.createElement('button');
    profileCta.className = 'nav-item nav-profile-cta';
    profileCta.id = 'profileCtaBtn';
    profileCta.type = 'button';
    profileCta.dataset.page = 'loginPage';
    profileCta.innerHTML = `${PROFILE_ICON}<span>Profile</span>`;

    profileCta.addEventListener('click', () => {
      if (typeof openPage === 'function') openPage('loginPage');
      window.requestAnimationFrame(() => {
        document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
        profileCta.classList.add('active');
      });
    });

    bottomNav.appendChild(profileCta);

    bottomNav.addEventListener('click', (event) => {
      const navButton = event.target.closest('.nav-item');
      if (navButton && navButton !== profileCta) profileCta.classList.remove('active');
    });
  }

  function setupHeaderAndNavButtons() {
    replaceHeaderProfileWithNotification();
    addProfileBottomCta();
  }

  function setupAuthUi() {
    const app = document.getElementById('app');
    const loginPage = document.getElementById('loginPage');
    const loginCard = document.getElementById('loginCard');
    const loginForm = document.getElementById('loginForm');
    const phoneField = loginForm?.querySelector('.auth-phone-field');
    const phoneLabel = loginForm?.querySelector('label[for="loginPhone"]');
    const googleBtn = document.getElementById('googleLoginBtn');
    const guestBtn = document.getElementById('guestLoginBtn');
    const divider = loginCard?.querySelector('.auth-divider, .guest-divider');
    const loginTitle = loginCard?.querySelector('h1');
    const loginDesc = loginTitle?.nextElementSibling;

    setupHeaderAndNavButtons();

    if (loginCard) loginCard.classList.add('auth-swiggy-card');
    if (loginTitle) loginTitle.textContent = 'LOGIN';
    if (loginDesc && loginDesc.tagName === 'P') {
      loginDesc.textContent = 'Enter your phone number to continue';
    }
    if (phoneLabel) phoneLabel.textContent = 'Phone Number';

    if (googleBtn) {
      let googleMark = googleBtn.querySelector('.google-mark');
      if (!googleMark) {
        googleMark = document.createElement('span');
        googleMark.className = 'google-mark';
        googleBtn.prepend(googleMark);
      }
      googleMark.innerHTML = GOOGLE_LOGO;

      const googleText = googleBtn.querySelector('span:last-child');
      if (googleText) googleText.textContent = 'Gmail';
      googleBtn.classList.add('quick-auth-btn');
    }

    if (guestBtn) {
      guestBtn.textContent = 'Guest';
      guestBtn.classList.add('quick-auth-btn');
    }

    if (phoneField && googleBtn && guestBtn && !loginForm.querySelector('.quick-auth-row')) {
      const quickRow = document.createElement('div');
      quickRow.className = 'quick-auth-row';
      quickRow.append(googleBtn, guestBtn);
      phoneField.insertAdjacentElement('afterend', quickRow);
    }

    if (divider) divider.hidden = true;

    function syncAuthScreenClass() {
      const isAuthOpen = Boolean(loginPage?.classList.contains('active-page'));
      document.body.classList.toggle('auth-screen-open', isAuthOpen);
      app?.classList.toggle('auth-screen-open', isAuthOpen);
    }

    syncAuthScreenClass();

    if (loginPage && !loginPage.dataset.authObserverAttached) {
      const observer = new MutationObserver(() => {
        syncAuthScreenClass();
        const profileCta = document.getElementById('profileCtaBtn');
        profileCta?.classList.toggle('active', loginPage.classList.contains('active-page'));
      });
      observer.observe(loginPage, { attributes: true, attributeFilter: ['class'] });
      loginPage.dataset.authObserverAttached = 'true';
    }

    document.addEventListener('click', () => {
      window.requestAnimationFrame(syncAuthScreenClass);
    });
  }

  injectUiAssets();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAuthUi);
  } else {
    setupAuthUi();
  }
})();