/* Service worker CM2 K-Pop : rend l'app installable et utilisable hors-ligne */
const CACHE = "cm2kpop-v1";
const CORE = ["index.html", "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png"];

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
  if (url.origin === location.origin) {
    // fichiers de l'app : cache d'abord, sinon réseau (et on met en cache)
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return resp;
      }).catch(() => caches.match("index.html")))
    );
  } else {
    // ressources externes (polices, images Wikimedia, cartes) : réseau, puis cache de secours
    e.respondWith(
      fetch(e.request).then(resp => {
        const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return resp;
      }).catch(() => caches.match(e.request))
    );
  }
});
