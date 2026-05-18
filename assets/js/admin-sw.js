self.addEventListener("install", event => {
    console.log("M&N Admin OS SW installed");
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    console.log("M&N Admin OS SW activated");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
    // Admin App fetch passthrough
});