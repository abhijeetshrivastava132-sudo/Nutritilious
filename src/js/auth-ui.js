(() => {
  function injectUiAssets() {
    if (!document.querySelector('link[href="src/css/ui-fixes.css"]')) {
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = 'src/css/ui-fixes.css';
      document.head.appendChild(styleLink);
    }

    if (!document.querySelector('script[src="src/js/location-details.js"]')) {
      const detailsScript = document.createElement('script');
      detailsScript.src = 'src/js/location-details.js';
      detailsScript.defer = true;
      document.head.appendChild(detailsScript);
    }
  }

  function setupAuthUi() {
    const app = document.getElementById('app');
    const loginPage = document.getElementById('loginPage');
    const loginCard = document.getElementById('loginCard');
    const loginForm = document.getElementById('loginForm');
    const phoneField = loginForm?.querySelector('.auth-phone-field');
    const googleBtn = document.getElementById('googleLoginBtn');
    const guestBtn = document.getElementById('guestLoginBtn');
    const divider = loginCard?.querySelector('.auth-divider');
    const loginTitle = loginCard?.querySelector('h1');
    const loginDesc = loginTitle?.nextElementSibling;

    if (loginCard) loginCard.classList.add('auth-swiggy-card');
    if (loginTitle) loginTitle.textContent = 'LOGIN';
    if (loginDesc && loginDesc.tagName === 'P') {
      loginDesc.textContent = 'Enter your phone number to continue';
    }

    if (googleBtn) {
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
      const observer = new MutationObserver(syncAuthScreenClass);
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
