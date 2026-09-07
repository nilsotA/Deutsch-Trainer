/* Service Worker für den Deutsch-Trainer.
   Zweck: Nils übt beim Spazierengehen. Ohne Cache bräuchte jeder Start Netz —
   genau dann, wenn der Empfang schlecht ist. Der Lernstand liegt in
   localStorage und wird hiervon nie berührt.

   Strategie: aus dem Cache ausliefern (sofort da, auch offline), im Hintergrund
   nachladen und den Cache auffrischen. Eine neue Fassung ist damit beim
   übernächsten Start da — nie auf Kosten des Startens. */
const CACHE = "deutsch-trainer-v1";
const SCHALE = ["/", "/manifest.webmanifest", "/icon-180.png", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SCHALE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const anfrage = e.request;
  if (anfrage.method !== "GET") return;
  const url = new URL(anfrage.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(anfrage, { ignoreSearch: true }).then(treffer => {
        const frisch = fetch(anfrage)
          .then(antwort => {
            if (antwort && antwort.ok) cache.put(anfrage, antwort.clone());
            return antwort;
          })
          .catch(() => treffer);           // offline: bleibt beim Cache
        return treffer || frisch;
      })
    )
  );
});
