/* Service Worker für den Deutsch-Trainer.
   Zweck: Nils übt beim Spazierengehen. Ohne Cache bräuchte jeder Start Netz —
   genau dann, wenn der Empfang schlecht ist. Der Lernstand liegt in
   localStorage und wird hiervon nie berührt.

   Die Seite selbst wird zuerst aus dem Netz geholt, aber nur mit kurzer Geduld:
   Kommt sie nicht binnen GEDULD *vollständig* an, kommt die Fassung aus dem
   Cache, und der Rest lädt im Hintergrund weiter in den Cache. Damit ist eine
   Korrektur beim nächsten Start da — bei einer Lern-App zählt das —, und der
   Start gelingt trotzdem immer.

   Wichtig ist das Wort „vollständig“. Ein fetch() ist schon erfüllt, sobald die
   Kopfzeilen da sind; die 700 kB tröpfeln danach. Bei schwachem Empfang gewann
   deshalb früher das Netz die Frist und die App startete trotz vollständiger
   Kopie erst nach einer halben Minute. Darum wird der Rumpf hier ausgelesen,
   bevor die Antwort als „da“ gilt.

   Alles Übrige (Symbole, Manifest) kommt direkt aus dem Cache; das ändert sich
   so gut wie nie. */
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

  if (anfrage.mode === "navigate") {
    const ausNetz = netzSeite(anfrage);
    /* Auch wenn die Frist gewinnt: der Worker darf nicht abgeräumt werden,
       bevor der Nachschub im Cache liegt. Sonst bliebe die alte Fassung ewig. */
    e.waitUntil(ausNetz);
    e.respondWith(seite(anfrage, ausNetz));
    return;
  }

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(anfrage, { ignoreSearch: true }).then(treffer =>
        treffer || fetch(anfrage).then(a => {
          if (a && a.ok) e.waitUntil(cache.put(anfrage, a.clone()));
          return a;
        })
      )
    )
  );
});

/* Holt die Seite ganz und legt sie ab. Ergibt null, wenn daraus nichts wird. */
function netzSeite(anfrage) {
  return fetch(anfrage)
    .then(antwort => {
      if (!antwort || !antwort.ok) return null;
      return antwort.blob().then(rumpf => {
        const fertig = new Response(rumpf, {
          status: antwort.status, statusText: antwort.statusText, headers: antwort.headers
        });
        return caches.open(CACHE)
          .then(cache => cache.put("/", fertig.clone()))
          .then(() => fertig, () => fertig);
      });
    })
    .catch(() => null);
}

/* Netz zuerst, aber mit Frist — und die Frist gilt für den ganzen Rumpf. */
function seite(anfrage, ausNetz) {
  return caches.open(CACHE).then(cache => {
    const ausCache = () => cache.match("/", { ignoreSearch: true })
      .then(t => t || cache.match(anfrage, { ignoreSearch: true }));
    const frist = new Promise(loesen => setTimeout(() => loesen(null), GEDULD));
    return Promise.race([ausNetz, frist])
      .then(antwort => antwort || ausCache().then(t => t || ausNetz))
      .then(antwort => antwort || fetch(anfrage))
      .catch(() => ausCache().then(t => t || fetch(anfrage)));
  });
}
