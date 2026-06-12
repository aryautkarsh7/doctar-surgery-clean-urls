const CACHE_NAME = 'doctar-surgery-v1';
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
  // Never cache API calls or admin
  if (e.request.url.includes('/api/') || e.request.url.includes('/admin')) return;
  // Cache-first for static assets, network-first for HTML navigation
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
