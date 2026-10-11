/* My Fitness App: service worker that keeps the app working offline.
   When any file of the app changes, change VERSION as well, so phones pick up the new version. */
const VERSION = 'mfa-v1-2026-10-11';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
  'favicon-32.png',
  'heebo-hebrew.woff2',
  'heebo-latin.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(ASSETS.map(a => new Request(a, {cache: 'reload'}))))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.indexOf('mfa-') === 0 && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.open(VERSION)
        .then(cache => cache.match('index.html'))
        .then(hit => hit || fetch(req))
        .catch(() => fetch(req))
    );
    return;
  }
  event.respondWith(
    caches.open(VERSION)
      .then(cache => cache.match(req, {ignoreSearch: true}))
      .then(hit => hit || fetch(req))
  );
});
