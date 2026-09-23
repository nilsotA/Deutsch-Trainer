/* Gemeinsame Grundlage aller Prüfläufe.
   Lädt die App in jsdom, stellt Browser-Schnittstellen bereit, die jsdom nicht kennt,
   und liefert kleine Helfer für Zustände und Ausgaben. */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const APP = path.join(__dirname, "..", "Deutsch-Trainer.html");
const KEY = "deutschtrainer.v1";
const HTML = fs.readFileSync(APP, "utf8");

/* Kalenderversatz für die Prüfläufe. `DT_TAGE=30 npm test` verschiebt den heutigen Tag
   um 30 Tage — für die App und für die Prüfläufe gleichermaßen. Gebraucht wird das, weil
   ein Prüflauf still rot werden kann, sobald der Kalender weiterläuft: `regelAenderungen()`
   setzt Karten aus NEU_GELERNT je nach Datum zurück oder nicht. Genau daran stand
   tests/lernen.js, Abschnitt J am 21.09.2026 rot, nachdem er am 16.09. noch grün war.
   `npm run kalender` fährt die Läufe über mehrere Versätze. */
const TAGE = Number(process.env.DT_TAGE || 0);

/* Datum als YYYY-MM-DD, wahlweise verschoben — TAGE kommt immer obendrauf */
function tag(versatz = 0) {
  const d = new Date();
  d.setDate(d.getDate() + versatz + TAGE);
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/* Verschiebt die Uhr im jsdom-Fenster. Das Fenster hat einen eigenen V8-Kontext mit
   eigenem Date — Node zu patchen reicht also nicht. Ohne Versatz passiert nichts. */
function uhrStellen(w) {
  if (!TAGE) return;
  w.eval("(function(){ var E = Date, ms = " + (TAGE * 86400000) + ";" +
    " function D(){ if(arguments.length) return new (Function.prototype.bind.apply(E, [null].concat([].slice.call(arguments))));" +
    " return new E(E.now() + ms); }" +
    " D.prototype = E.prototype; D.now = function(){ return E.now() + ms; };" +
    " D.parse = E.parse; D.UTC = E.UTC; Date = D; })()");
}

/* App starten. `stand` wird vorher in den localStorage gelegt. */
function boot(stand, optionen = {}) {
  const dom = new JSDOM(HTML, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "http://localhost/",
    beforeParse(w) {
      uhrStellen(w);
      /* optionen.roh legt den Lernstand als Rohtext ab — für beschädigte Datensätze,
         die sich als Objekt gar nicht ausdrücken lassen. */
      if (optionen.roh !== undefined) w.localStorage.setItem(KEY, optionen.roh);
      else if (stand) w.localStorage.setItem(KEY, JSON.stringify(stand));
      w.scrollTo = () => {};
      w.print = () => {};
      w.confirm = () => true;
      w.HTMLElement.prototype.scrollIntoView = () => {};
      /* Nur der Download-Anker der Sicherung wird stillgelegt. Bis zum 23.09.2026 traf das
         jeden Link: Ein Prüflauf, der „→ Regel nachlesen“ per click() antippte, löste nichts
         aus, und seine Zusicherung „der Tipp zählt nicht“ war stumm grün. */
      const echterAnkerKlick = w.HTMLAnchorElement.prototype.click;
      w.HTMLAnchorElement.prototype.click = function () {
        if (this.hasAttribute("download")) return;
        return echterAnkerKlick.call(this);
      };
      w.URL.createObjectURL = () => "blob:x";
      w.URL.revokeObjectURL = () => {};
      w.navigator.vibrate = () => true;
      /* Wie im echten Browser: die Bildschirmsperre ist ein Sentinel mit release-Ereignis,
         und der Browser gibt sie von selbst frei, sobald das Dokument unsichtbar wird.
         Solange der Ersatz hier nur ein nacktes Objekt lieferte, konnte kein Prüflauf
         sehen, dass die App die Sperre danach nie wieder anforderte. */
      const sperren = [];
      w.navigator.wakeLock = {
        request() {
          const s = {
            type: "screen", released: false, __hoerer: [],
            addEventListener(name, fn) { if (name === "release") this.__hoerer.push(fn); },
            release() { this.__freigeben(); return Promise.resolve(); },
            __freigeben() {
              if (this.released) return;
              this.released = true;
              this.__hoerer.forEach(fn => { try { fn(); } catch (e) {} });
            }
          };
          sperren.push(s);
          return Promise.resolve(s);
        }
      };
      w.__wakeSperren = sperren;
      /* Das tut der Browser beim Wegblenden — hier von Hand auslösbar. */
      w.__wakeVerlieren = () => sperren.forEach(s => s.__freigeben());
      w.SpeechSynthesisUtterance = function (text) { this.text = text; };
      /* Wie im echten Browser: cancel() bricht die laufende Äußerung ab und meldet
         das. Solange der Stub hier nichts tat, konnte der Prüflauf einen ganzen
         Fehlerweg nicht sehen — den abgebrochenen Rückruf, der die Automatik auf der
         nächsten, unbeantworteten Frage armiert.
         WebKit (iPhone, Nils' Gerät) meldet den Abbruch SYNCHRON als error-Ereignis,
         noch innerhalb von cancel() (SpeechSynthesis::cancel ruft speakingErrorOccurred
         direkt auf). Chromium meldet ihn später als Ende. Bis zum 23.09.2026 bildete der
         Stub nur Chromium nach — der Schutz in check(), der dort griff, versagte auf dem
         iPhone, und der Prüflauf blieb grün. Standard ist deshalb WebKit;
         optionen.abbruchAsynchron stellt Chromium nach. */
      let laufend = null;
      w.speechSynthesis = {
        cancel() {
          const u = laufend; laufend = null;
          if (!u) return;
          if (optionen.abbruchAsynchron) { if (u.onend) setTimeout(() => u.onend(), 0); return; }
          if (u.onerror) u.onerror({ type: "error", error: "canceled" });
          else if (u.onend) u.onend();
        },
        speak(u) {
          (w.__gesagt = w.__gesagt || []).push(u.text);
          laufend = u;
          /* Natürliches Satzende von Hand auslösen — für Prüfungen, die zwischen Antwort
             und Satzende etwas tun (antippen, 🔊, Beenden). */
          w.__sprichZuEnde = () => { const x = laufend; laufend = null; if (x && x.onend) x.onend(); };
          // Vorlesen sofort beenden, damit Rückrufe wie das Auto-Weiter greifen
          if (optionen.sprichSofortZuEnde && u.onend) {
            setTimeout(() => { if (laufend === u) { laufend = null; u.onend(); } }, 5);
          }
        }
      };
      /* Eingriff vor dem Start der App — für Umgebungen, die jsdom nicht hat (etwa
         navigator.standalone der Home-Bildschirm-App auf dem iPhone), und für weitere
         Einträge im localStorage neben dem Lernstand. */
      if (optionen.vorLaden) optionen.vorLaden(w);
    }
  });
  return dom.window;
}

/* Leerer Lernstand, wie beim allerersten Start */
function leererStand(extra = {}) {
  return Object.assign({
    xp: 0, streak: 0, best: 0, last: null, cards: {}, days: {}, cat: {},
    writing: {}, scenes: {}, log: [], korr: {}, level: null, levelDate: null,
    plan: null, lastExport: null, session: null, speak: false, auto: true,
    theme: "light", seenW: {}
  }, extra);
}

/* Antwort antippen. Die App sperrt Antworten 350 ms nach dem Rendern einer Frage — gegen
   den Prelltipp, siehe check() in der App. Die Prüfläufe tippen viel schneller als jeder
   Mensch und stellen die Sperre deshalb vor jedem Klick zurück; die Sperre selbst prüft
   tests/unterwegs.js, Abschnitt I. */
function tippe(w, el) {
  try { w.eval("if (typeof Q !== 'undefined' && Q) Q.frageSeit = 0"); } catch (e) { /* keine Runde */ }
  el.click();
}

/* Daten aus der laufenden App holen (JSON-fähige Teile) */
function daten(w, ausdruck) {
  return JSON.parse(w.eval("JSON.stringify(" + ausdruck + ")"));
}

/* Alle Kartenschlüssel der App, nach Sorte getrennt */
function schluessel(w) {
  return {
    aufgaben: daten(w, 'ALL.filter(i=>i.t!=="fill").map(i=>i.id)'),
    woerter: daten(w, 'WORDS.map(x=>"w:"+x.w)'),
    faelle: daten(w, 'drillPool().map(e=>"c:"+e.w)')
  };
}

/* Ergebnisausgabe */
function pruefer(titel) {
  const probleme = [];
  console.log("── " + titel);
  return {
    ok(label, bedingung, detail) {
      console.log((bedingung ? "  ok    " : "  FEHLER ") + label +
        (bedingung ? "" : "  → " + String(detail === undefined ? "" : detail).slice(0, 160)));
      if (!bedingung) probleme.push(label);
    },
    info(zeile) { console.log("        " + zeile); },
    titel(t) { console.log("── " + t); },
    abschluss() {
      console.log("");
      if (probleme.length) {
        console.log(probleme.length + " Probleme: " + probleme.join(" · "));
        process.exitCode = 1;
      } else {
        console.log("Alles bestanden.");
      }
    }
  };
}

module.exports = { tippe, APP, KEY, HTML, boot, tag, leererStand, daten, schluessel, pruefer };
