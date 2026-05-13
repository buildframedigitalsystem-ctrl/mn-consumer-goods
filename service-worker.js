const CACHE_NAME = "mn-buildframe-os-v2";

const urlsToCache = [
    "./",
    "./index.html",
    "./admin.html",
    "./master-dashboard.html",

    "./manifest-store.json",
    "./manifest-admin.json",

    "./assets/css/store.css",
    "./assets/css/admin-dashboard.css",
    "./assets/css/master-dashboard.css",

    "./assets/js/store.js",
    "./assets/js/admin-main.js",

    "./assets/images/branding/mn-banner.png",
    "./assets/images/branding/mn-logo.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => caches.delete(cacheName))
                );
            })
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
    );
});