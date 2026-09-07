/* Gemeinsame Grundlage aller Prüfläufe.
   Lädt die App in jsdom, stellt Browser-Schnittstellen bereit, die jsdom nicht kennt,
   und liefert kleine Helfer für Zustände und Ausgaben. */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const APP = path.join(__dirname, "..", "Deutsch-Trainer.html");
const KEY = "deutschtrainer.v1";
const HTML = fs.readFileSync(APP, "utf8");

/* Datum als YYYY-MM-DD, wahlweise verschoben */
function tag(versatz = 0) {
  const d = new Date();
  d.setDate(d.getDate() + versatz);
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/* App starten. `stand` wird vorher in den localStorage gelegt. */
function boot(stand, optionen = {}) {
  const dom = new JSDOM(HTML, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "http://localhost/",
    beforeParse(w) {
      /* optionen.roh legt den Lernstand als Rohtext ab — für beschädigte Datensätze,
         die sich als Objekt gar nicht ausdrücken lassen. */
      if (optionen.roh !== undefined) w.localStorage.setItem(KEY, optionen.roh);
      else if (stand) w.localStorage.setItem(KEY, JSON.stringify(stand));
      w.scrollTo = () => {};
      w.print = () => {};
      w.confirm = () => true;
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.HTMLAnchorElement.prototype.click = function () {};
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
         das als Ende. Solange der Stub hier nichts tat, konnte der Prüflauf einen
         ganzen Fehlerweg nicht sehen — den abgebrochenen Rückruf, der die Automatik
         auf der nächsten, unbeantworteten Frage armiert. */
      let laufend = null;
      w.speechSynthesis = {
        cancel() {
          const u = laufend; laufend = null;
          if (u && u.onend) setTimeout(() => u.onend(), 0);
        },
        speak(u) {
          (w.__gesagt = w.__gesagt || []).push(u.text);
          laufend = u;
          // Vorlesen sofort beenden, damit Rückrufe wie das Auto-Weiter greifen
          if (optionen.sprichSofortZuEnde && u.onend) {
            setTimeout(() => { if (laufend === u) { laufend = null; u.onend(); } }, 5);
          }
        }
      };
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
