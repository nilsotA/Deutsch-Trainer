/* Handy-Nutzung: sichere Ränder, Web-App-Auszeichnung, Touchbedienung.

   Anlass war ein stiller Fehler: Die App hatte sechs Regeln mit
   env(safe-area-inset-…) — und keine davon wirkte, weil im Viewport-Meta
   viewport-fit=cover fehlte. Ohne das liefern die Insets konstant 0. Beim
   Einschalten kam der zweite Fehler ans Licht:

       .srch input{padding:16px 16px calc(16px + env(safe-area-inset-top))}

   Bei drei Werten ist der dritte das untere Padding — der Top-Inset saß also
   unten. Beide Fehler sind unsichtbar, solange niemand ein iPhone in die Hand
   nimmt. Abschnitt A prüft deshalb beides maschinell. */

const { HTML, boot, daten, pruefer } = require("./setup");
const P = pruefer("A · Viewport und sichere Ränder");

const css = HTML.slice(HTML.indexOf("<style>") + 7, HTML.indexOf("</style>"));
const kopf = HTML.slice(0, HTML.indexOf("<style>"));

/* ---------- A · Viewport und sichere Ränder ---------- */

const vp = (kopf.match(/<meta\s+name="viewport"\s+content="([^"]*)"/) || [])[1] || "";
P.ok("Viewport-Meta vorhanden", !!vp, vp);
P.ok("viewport-fit=cover gesetzt — sonst sind alle Insets 0",
  /viewport-fit\s*=\s*cover/.test(vp), vp);
P.ok("width=device-width gesetzt", /width\s*=\s*device-width/.test(vp), vp);

/* Werte einer Kurzschreibweise auf oberster Ebene trennen: calc(...) enthält
   selbst Leerzeichen, die nicht trennen dürfen. */
function werte(s) {
  const out = []; let tiefe = 0, akt = "";
  for (const z of s) {
    if (z === "(") tiefe++;
    if (z === ")") tiefe--;
    if (/\s/.test(z) && tiefe === 0) { if (akt) out.push(akt); akt = ""; }
    else akt += z;
  }
  if (akt) out.push(akt);
  return out;
}
/* Welche Seiten deckt der n-te Wert einer Kurzschreibweise ab? */
const SEITEN = {
  1: [["top", "right", "bottom", "left"]],
  2: [["top", "bottom"], ["right", "left"]],
  3: [["top"], ["right", "left"], ["bottom"]],
  4: [["top"], ["right"], ["bottom"], ["left"]]
};
const LANG = /^(padding|margin|inset|scroll-padding|scroll-margin)-(top|right|bottom|left)$/;
const KURZ = /^(padding|margin|inset|scroll-padding|scroll-margin)$/;
const KANTE = /^(top|right|bottom|left)$/;

const falsch = [], geprueft = [], ungeprueft = [];
/* Alle Deklarationen einsammeln, die einen Inset benutzen. */
const dekl = css.match(/[-a-z]+\s*:\s*[^;{}]*env\(safe-area-inset-[^;{}]*/g) || [];
dekl.forEach(d => {
  const doppel = d.indexOf(":");
  const prop = d.slice(0, doppel).trim();
  const wert = d.slice(doppel + 1).trim();
  const insets = (wert.match(/safe-area-inset-(top|right|bottom|left)/g) || [])
    .map(x => x.replace("safe-area-inset-", ""));
  if (!insets.length) return;

  if (LANG.test(prop) || KANTE.test(prop)) {
    const seite = KANTE.test(prop) ? prop : prop.split("-")[1];
    insets.forEach(i => {
      const eintrag = prop + ": " + i;
      if (i === seite) geprueft.push(eintrag);
      else falsch.push(prop + " benutzt safe-area-inset-" + i);
    });
    return;
  }
  if (KURZ.test(prop)) {
    const w = werte(wert);
    const karte = SEITEN[w.length];
    if (!karte) { ungeprueft.push(prop + " mit " + w.length + " Werten"); return; }
    w.forEach((v, n) => {
      const drin = (v.match(/safe-area-inset-(top|right|bottom|left)/g) || [])
        .map(x => x.replace("safe-area-inset-", ""));
      drin.forEach(i => {
        if (karte[n].includes(i)) geprueft.push(prop + "[" + n + "]: " + i);
        else falsch.push(prop + ": safe-area-inset-" + i + " steht an der Stelle für "
          + karte[n].join("/"));
      });
    });
    return;
  }
  ungeprueft.push(prop);
});

P.ok("Jeder Inset steht auf seiner eigenen Seite (" + geprueft.length + " geprüft)",
  !falsch.length, [...new Set(falsch)].join(" · "));
if (ungeprueft.length) P.info("nicht maschinell prüfbar: " + [...new Set(ungeprueft)].join(", "));

/* Die vier Ränder, die beim Gehen tatsächlich stören. */
const hat = (auswahl, seite) =>
  new RegExp(auswahl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[^}]*safe-area-inset-" + seite).test(css);
P.ok("Kopfzeile hält Abstand zur Statusleiste", hat(".head{", "top"));
P.ok("Inhalt hält Abstand zum Home-Indikator", /\.wrap\{[^}]*safe-area-inset-bottom/.test(css));
P.ok("Inhalt weicht der Notch in Querlage aus",
  /\.wrap\{[^}]*safe-area-inset-left/.test(css) && /\.wrap\{[^}]*safe-area-inset-right/.test(css));
P.ok("Unterwegs-Leiste liegt über dem Home-Indikator", hat(".walkbar{", "bottom"));

/* ---------- B · Web-App-Auszeichnung ---------- */
P.titel("B · Web-App-Auszeichnung");

const meta = n => (kopf.match(new RegExp('<meta\\s+name="' + n + '"\\s+content="([^"]*)"')) || [])[1];
P.ok("theme-color gesetzt", !!meta("theme-color"), meta("theme-color"));
P.ok("Als Web-App startbar (Apple)", meta("apple-mobile-web-app-capable") === "yes");
P.ok("Als Web-App startbar (übrige)", meta("mobile-web-app-capable") === "yes");
P.ok("Kurzname für den Startbildschirm", !!meta("apple-mobile-web-app-title"), meta("apple-mobile-web-app-title"));

const icon = (kopf.match(/<link\s+rel="apple-touch-icon"\s+href="(data:image\/png;base64,[^"]+)"/) || [])[1];
P.ok("Startbildschirm-Symbol eingebettet", !!icon,
  icon ? Math.round(icon.length / 1024) + " KB" : "fehlt");
if (icon) {
  const roh = Buffer.from(icon.split(",")[1], "base64");
  const png = roh.slice(0, 8).toString("hex") === "89504e470d0a1a0a";
  P.ok("Symbol ist ein gültiges PNG", png);
  P.ok("Symbol ist quadratisch und groß genug",
    png && roh.readUInt32BE(16) === roh.readUInt32BE(20) && roh.readUInt32BE(16) >= 180,
    png ? roh.readUInt32BE(16) + "×" + roh.readUInt32BE(20) : "");
  P.ok("Symbol bleibt unter 20 KB", roh.length < 20480, Math.round(roh.length / 1024) + " KB");
}

/* Das Manifest entsteht zur Laufzeit als Blob. jsdom lädt unter http://localhost/,
   also läuft derselbe Zweig wie auf einem Server. */
const w = boot(null);
const blob = (w.__blobs || []).find(b => b.typ === "application/manifest+json");
P.ok("Manifest wird erzeugt", !!blob);
if (blob) {
  let m = null;
  try { m = JSON.parse(blob.text); } catch (e) {}
  P.ok("Manifest ist gültiges JSON", !!m);
  if (m) {
    P.ok("Manifest nennt Namen und Kurznamen", !!m.name && !!m.short_name, m.name + " / " + m.short_name);
    P.ok("Manifest startet eigenständig", m.display === "standalone", m.display);
    P.ok("Manifest hat start_url und scope", !!m.start_url && !!m.scope, m.start_url + " / " + m.scope);
    P.ok("Manifest nennt Farben", !!m.theme_color && !!m.background_color);
    P.ok("Manifest führt ein maskierbares Symbol",
      Array.isArray(m.icons) && m.icons.length > 0 && /maskable/.test(m.icons[0].purpose || ""),
      JSON.stringify((m.icons || [])[0] || {}).slice(0, 60));
  }
}
P.ok("Manifest-Link hängt im Dokument",
  !!w.document.querySelector('link[rel="manifest"]'));
P.ok("Browser-Symbol wird nachgetragen",
  !!w.document.querySelector('link[rel="icon"]'));

/* Die Statusleistenfarbe muss dem Thema folgen, sonst steht im dunklen Modus
   ein heller Balken über der App. */
const hell = w.document.querySelector('meta[name="theme-color"]').getAttribute("content");
w.eval('S.theme="dark"; themeFarbe();');
const dunkel = w.document.querySelector('meta[name="theme-color"]').getAttribute("content");
P.ok("theme-color folgt dem Thema", hell !== dunkel, hell + " → " + dunkel);

/* ---------- C · Touchbedienung ---------- */
P.titel("C · Touchbedienung");

const touch = (css.match(/@media\(hover:none\)\{[\s\S]*?\n\}/) || [""])[0];
P.ok("Block für Geräte ohne Mauszeiger vorhanden", touch.length > 100);
P.ok("Kein versehentliches Neuladen beim Wischen", /overscroll-behavior/.test(touch));
P.ok("Kein grauer Blitz beim Tippen", /-webkit-tap-highlight-color\s*:\s*transparent/.test(touch));
P.ok("Keine Textauswahl auf Bedienelementen", /user-select\s*:\s*none/.test(touch));
P.ok("Doppeltipp-Zoom abgeschaltet", /touch-action\s*:\s*manipulation/.test(touch));

/* Regeltexte und Beispiele müssen markierbar bleiben — sonst kann Nils nichts
   herauskopieren. Die Sperre darf nur auf Bedienelementen liegen. */
const sperre = (touch.match(/([^{}]+)\{[^}]*user-select\s*:\s*none[^}]*\}/g) || []).join(" ");
P.ok("Sperre trifft keine Textbereiche",
  !/\.body|\.ex\b|\.korrtext|\bp\b|\bli\b/.test(sperre.split("{")[0] || ""), sperre.split("{")[0]);

/* Tippflächen: unter 44 px wird es beim Gehen unzuverlässig. */
const iconbtn = (touch.match(/\.iconbtn\{([^}]*)\}/) || [])[1] || "";
const px = (s, p) => { const m = s.match(new RegExp(p + "\\s*:\\s*(\\d+)px")); return m ? +m[1] : 0; };
P.ok("Symbolknöpfe sind mindestens 44 px", px(iconbtn, "width") >= 44 && px(iconbtn, "height") >= 44,
  iconbtn.trim());

/* iOS zoomt beim Antippen in jedes Feld unter 16 px hinein und zoomt nicht
   von selbst zurück. Die App hält das bereits ein — die Prüfung hält es fest. */
const felder = [];
const reFeld = /([^{}]*(?:input|textarea|select)[^{}]*)\{([^}]*)\}/g;
let mf;
while ((mf = reFeld.exec(css))) {
  const g = (mf[2].match(/font-size\s*:\s*([\d.]+)px/) || [])[1];
  if (g && parseFloat(g) < 16) felder.push(mf[1].replace(/\s+/g, " ").trim() + " (" + g + "px)");
}
P.ok("Eingabefelder sind mindestens 16 px — sonst zoomt iOS hinein",
  !felder.length, felder.join(" · "));

P.abschluss();
