/*
 * sw-register.js — Eduardo.AI
 * Service Worker registration. Extracted from inline script in index.html.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js')
      .then(function (reg) {
        if (window.console) window.console.info('[SW] Registered, scope:', reg.scope);
      })
      .catch(function (err) {
        if (window.console) window.console.warn('[SW] Registration failed:', err);
      });
  });
}
