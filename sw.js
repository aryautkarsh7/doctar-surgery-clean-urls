const CACHE_NAME = 'doctar-v2';
const STATIC_ASSETS = [
  '/',
  '/styles.css',
  '/main.js',
  '/utils/helpers.js',
  '/utils/api.js',
  '/data.js',
  '/components/sections.js',
  '/components/footer-dynamic.js',
  '/components/header.js',
  '/components/booking-modal.js',
  '/pages/blog.js',
  '/pages/home.js',
  '/pages/category.js',
  '/pages/treatment.js',
  '/pages/doctors.js',
  '/pages/hospitals.js',
  '/pages/search.js',
  '/pages/pet.js',
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

  // Never cache API calls or admin
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  // Cache-first for images (serve instantly from cache, fetch+update in background)
  if (e.request.destination === 'image') {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(e.request).then(cached => {
          const fetchPromise = fetch(e.request).then(response => {
            if (response.ok) cache.put(e.request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Network-first for HTML navigation (always get fresh shell)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    );
    return;
  }

  // Stale-while-revalidate for JS/CSS — serve cached instantly, update in background
  e.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(response => {
          if (response.ok) cache.put(e.request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    )
  );
});
