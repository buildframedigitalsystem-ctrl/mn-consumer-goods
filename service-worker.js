const CACHE_NAME = "mn-store-v1";

const urlsToCache = [

    "./",
    "./index.html",
    "./assets/css/store.css",
    "./assets/js/store.js",
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

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(response => {

                return response || fetch(event.request);

            })

    );

});