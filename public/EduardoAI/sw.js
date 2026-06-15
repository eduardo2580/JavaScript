/* sw.js — Eduardo.AI Service Worker v2026.03.27
   Aggressive caching + network-fresh strategy
   - ICD-10 JSON: Network-first (always fresh), fallback to cache
   - HTML/JS/CSS: Network-first (always latest), fallback to cache
   - Images/fonts: Cache-first (performance)
*/
var CACHE_VERSION = Date.now(); /* Force new cache on every deploy */
var CACHE_NAME = 'eduardoai-cache-' + CACHE_VERSION;
var OLD_CACHE_PREFIX = 'eduardoai-';

self.addEventListener('install', function(e) {
  console.log('[SW] Installing with cache:', CACHE_NAME);
  e.waitUntil(self.skipWaiting()); /* Activate immediately */
});

self.addEventListener('activate', function(e) {
  console.log('[SW] Activating, cleaning old caches');
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        /* Delete all old eduardoai caches (keep only current) */
        if (k.indexOf(OLD_CACHE_PREFIX) === 0 && k !== CACHE_NAME) {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        }
      }));
    }).then(function() {
      return self.clients.claim(); /* Claim all clients immediately */
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  var method = e.request.method;
  
  /* Skip non-GET requests */
  if (method !== 'GET') return;
  
  /* ICD-10 JSON: Network-first (always get fresh data) */
  if (url.indexOf('icd10cm_2022_compact.json') >= 0) {
    e.respondWith(
      /* Try network first */
      fetch(e.request).then(function(response) {
        if (response && response.status === 200) {
          /* Cache successful response */
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, copy);
          });
          console.log('[SW] ICD-10 fetched (fresh)');
        }
        return response;
      }).catch(function(err) {
        /* Network failed: try cache */
        console.log('[SW] ICD-10 network failed, trying cache');
        return caches.match(e.request).then(function(cached) {
          if (cached) {
            console.log('[SW] ICD-10 from cache (offline)');
            return cached;
          }
          /* No cache either: return error */
          return new Response(
            JSON.stringify({ error: 'Offline - data unavailable' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        });
      })
    );
    return;
  }
  
  /* HTML/JS/CSS: Network-first (always get latest code) */
  if (/\.(html|js|css)$/.test(url)) {
    e.respondWith(
      fetch(e.request).then(function(response) {
        if (response && response.status === 200) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, copy);
          });
        }
        return response;
      }).catch(function(err) {
        return caches.match(e.request) || 
          new Response('Offline', { status: 503 });
      })
    );
    return;
  }
  
  /* Images/fonts/other: Cache-first (performance) */
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        if (response && response.status === 200) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, copy);
          });
        }
        return response;
      }).catch(function() {
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
