// Service Worker cho XemBongDa PWA
const CACHE_NAME = "xembongda-v1";
const BASE = "/bongda";

// Cache app shell khi install
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first cho API, cache-first cho static
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Chỉ xử lý GET
  if (event.request.method !== "GET") return;

  // API: network-first, fallback cache
  if (url.pathname.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets: cache-first
  if (url.pathname.includes("/_next/") || url.pathname.match(/\.(png|jpg|svg|ico|css|js|webp)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return res;
          })
        );
      })
    );
  }
});
