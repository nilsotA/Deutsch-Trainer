/* Service Worker für den Deutsch-Trainer.
   Zweck: Nils übt beim Spazierengehen. Ohne Cache bräuchte jeder Start Netz —
   genau dann, wenn der Empfang schlecht ist. Der Lernstand liegt in
   localStorage und wird hiervon nie berührt.

   Die Seite selbst wird zuerst aus dem Netz geholt, aber nur mit kurzer Geduld:
   Antwortet der Server nicht schnell genug oder gar nicht, kommt die Fassung aus
   dem Cache. Damit ist eine Korrektur sofort da — bei einer Lern-App zählt das —,
   und der Start gelingt trotzdem immer. Alles Übrige (Symbole, Manifest) kommt
   direkt aus dem Cache; das ändert sich so gut wie nie. */
const CACHE = "deutsch-trainer-v2";
const SCHALE = ["/", "/manifest.webmanifest", "/icon-180.png", "/icon-192.png", "/icon-512.png"];
const GEDULD = 2500;

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
  if (new URL(anfrage.url).origin !== self.location.origin) return;

  if (anfrage.mode === "navigate") { e.respondWith(seite(anfrage)); return; }
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(anfrage, { ignoreSearch: true }).then(treffer =>
        treffer || fetch(anfrage).then(a => {
          if (a && a.ok) cache.put(anfrage, a.clone());
          return a;
        })
      )
    )
  );
});

/* Netz zuerst, aber mit Frist. Was ankommt, wandert in den Cache. */
function seite(anfrage) {
  return caches.open(CACHE).then(cache => {
    const ausCache = () => cache.match("/", { ignoreSearch: true })
      .then(t => t || cache.match(anfrage, { ignoreSearch: true }));
    const ausNetz = fetch(anfrage).then(antwort => {
      if (antwort && antwort.ok) cache.put("/", antwort.clone());
      return antwort;
    });
    const frist = new Promise(loesen => setTimeout(() => loesen(null), GEDULD));
    return Promise.race([ausNetz.catch(() => null), frist])
      .then(antwort => antwort || ausCache().then(t => t || ausNetz))
      .catch(() => ausCache());
  });
}
