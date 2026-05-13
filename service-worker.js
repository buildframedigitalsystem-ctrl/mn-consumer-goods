const CACHE_NAME = "mn-business-ecosystem-v5";

const urlsToCache = [

    "./",

    /* =========================================
       PUBLIC STOREFRONT
    ========================================= */

    "./index.html",
    "./retail.html",
    "./wholesale.html",
    "./promos.html",

    /* =========================================
       STORE OPERATIONS APP
    ========================================= */


    "./store-dashboard.html",
    "./store-order-form.html",

    "./cart.html",
    "./customer-login.html",
    "./customer-signup.html",
    "./customer-dashboard.html",

    "./quotation-request.html",
    "./delivery-booking.html",
    "./reseller-application.html",

    /* =========================================
       ADMIN OS
    ========================================= */

    "./admin.html",
    "./admin-dashboard.html",
    "./master-dashboard.html",

    /* =========================================
       PWA MANIFESTS
    ========================================= */

    "./manifest-store.json",
    "./manifest-admin.json",

    /* =========================================
       CSS
    ========================================= */

    "./assets/css/store.css",
    "./assets/css/base.css",

    "./assets/css/admin-layout.css",
    "./assets/css/admin-dashboard.css",
    "./assets/css/admin-forms.css",
    "./assets/css/master-dashboard.css",

    /* =========================================
       JAVASCRIPT
    ========================================= */

    "./assets/js/api-config.js",

    "./assets/js/store.js",

    "./assets/js/admin-main.js",
    "./assets/js/admin-dashboard.js",
    "./assets/js/permission.js",

    /* =========================================
       BRANDING
    ========================================= */

    "./assets/images/branding/mn-banner.png",
    "./assets/images/branding/mn-logo.png"
];

/* =========================================
   INSTALL
========================================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(urlsToCache);

            })

    );

    self.skipWaiting();

});

/* =========================================
   ACTIVATE
========================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(cacheName =>
                            cacheName !== CACHE_NAME
                        )
                        .map(cacheName =>
                            caches.delete(cacheName)
                        )

                );

            })

    );

    self.clients.claim();

});

/* =========================================
   FETCH
========================================= */

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                return cachedResponse || fetch(event.request);

            })

    );

});