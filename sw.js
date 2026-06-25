self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

const profilePatchScript = `
<script>
(function () {
  function openProfile(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    }
    window.location.href = 'profile.html';
  }

  function isProfileElement(element) {
    if (!element) return false;
    var text = (element.textContent || '').trim().toLowerCase();
    var aria = (element.getAttribute('aria-label') || '').trim().toLowerCase();
    var id = (element.id || '').trim().toLowerCase();
    return text.includes('profile') || aria.includes('profile') || id.includes('profile');
  }

  function bindProfileButtons() {
    var elements = document.querySelectorAll('button, a, .nav-item, [role="button"]');
    elements.forEach(function (element) {
      if (!isProfileElement(element)) return;
      if (element.dataset.profileLinked === 'true') return;
      element.dataset.profileLinked = 'true';
      element.addEventListener('click', openProfile, true);
    });
  }

  document.addEventListener('click', function (event) {
    var element = event.target.closest('button, a, .nav-item, [role="button"]');
    if (isProfileElement(element)) openProfile(event);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindProfileButtons);
  } else {
    bindProfileButtons();
  }

  setTimeout(bindProfileButtons, 300);
  setTimeout(bindProfileButtons, 1000);
  setInterval(bindProfileButtons, 2500);
})();
</script>
`;

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate' && (url.pathname === '/index.html' || url.pathname === '/')) {
    event.respondWith((async () => {
      const response = await fetch(event.request);
      const contentType = response.headers.get('content-type') || '';

      if (!contentType.includes('text/html')) return response;

      let html = await response.text();

      if (!html.includes('profilePatchScript')) {
        if (html.includes('</body>')) {
          html = html.replace('</body>', profilePatchScript + '</body>');
        } else {
          html += profilePatchScript;
        }
      }

      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store, no-cache, must-revalidate'
        }
      });
    })());
  }
});
