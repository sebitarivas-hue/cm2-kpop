/* Service worker CM2 K-Pop — réseau d'abord pour le HTML (toujours la dernière version), cache pour l'offline */
const CACHE = "cm2kpop-v6";
const APP = "index.html";
const CORE = [APP, "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const isDoc = e.request.mode === "navigate" || e.request.destination === "document"
    || url.pathname.endsWith("/") || url.pathname.endsWith(".html");

  if (url.origin === location.origin && isDoc) {
    // HTML : réseau d'abord → met à jour le cache, sinon cache (offline)
    e.respondWith(
      fetch(e.request).then(resp => {
        const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return resp;
      }).catch(() => caches.match(e.request).then(r => r || caches.match(APP)))
    );
  } else if (url.origin === location.origin) {
    // autres fichiers de l'app : cache d'abord, sinon réseau
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return resp;
      }))
    );
  } else {
    // ressources externes (polices, images, cartes) : réseau, puis cache de secours
    e.respondWith(
      fetch(e.request).then(resp => {
        const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return resp;
      }).catch(() => caches.match(e.request))
    );
  }
});
