/* clear-cache.js — Eduardo.AI
   Runs immediately on page load, before any other script.
   1. Unregisters all service workers
   2. Deletes all Cache Storage entries
   3. Registers fresh no-cache service worker
   ES5 compatible.
*/
(function() {
  'use strict';

  /* 1. Kill all existing service workers */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(regs) {
      regs.forEach(function(reg) { reg.unregister(); });
    });

    /* 2. Wipe all Cache Storage buckets */
    if ('caches' in window) {
      caches.keys().then(function(keys) {
        keys.forEach(function(k) { caches.delete(k); });
      });
    }

    /* 3. Register fresh no-cache SW */
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js?v=' + Date.now())
        .then(function(reg) {
          reg.update();
        })
        .catch(function() {});
    });
  }

  /* 4. Force-reload if a stale bfcache entry is restored */
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) { window.location.reload(true); }
  });

})();
