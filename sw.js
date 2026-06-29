var CACHE = 'qatee3-v3';
var CORE = [
  '/goats-project/',
  '/goats-project/index.html',
  '/goats-project/manifest.json',
  '/goats-project/goat-arab.jpg',
  '/goats-project/goat-damascus.jpg',
  '/goats-project/goat-boer.jpg',
  '/goats-project/feed-barley.jpg',
  '/goats-project/feed-wheat-bran.jpg',
  '/goats-project/feed-soybean.jpg',
  '/goats-project/feed-calcium.jpg',
  '/goats-project/feed-alfalfa.jpg',
  '/goats-project/feed-vitamins.jpg'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(CORE); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      var netFetch = fetch(e.request).then(function(res) {
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return res;
      }).catch(function() { return cached; });
      return cached || netFetch;
    })
  );
});
