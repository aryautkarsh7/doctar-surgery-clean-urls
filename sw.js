const CACHE_NAME = 'doctar-v17';
const STATIC_ASSETS = [
  '/',
  '/styles.css',
  '/bundle.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Never intercept API calls or admin routes
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  // Cache-first for images — serve instantly, update cache in background
  if (e.request.destination === 'image') {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(url.href).then(cached => {
          const fetchPromise = fetch(e.request).then(response => {
            if (response.ok) cache.put(url.href, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Pure cache-first for versioned assets (?v=...) — URL changes when content changes,
  // so background revalidation is never needed and causes spurious 304 "double-fetches".
  if (url.search.includes('v=')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(url.href).then(cached =>
          cached || fetch(e.request).then(response => {
            if (response.ok) cache.put(url.href, response.clone());
            return response;
          })
        )
      )
    );
    return;
  }

  // Network-first for HTML navigation (always get a fresh shell)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    );
    return;
  }

  // Stale-while-revalidate for everything else (unversioned JS/CSS)
  e.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(url.href).then(cached => {
        const fetchPromise = fetch(e.request).then(response => {
          if (response.ok) cache.put(url.href, response.clone());
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    )
  );
});
