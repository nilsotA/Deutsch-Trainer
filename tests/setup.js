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
      if (stand) w.localStorage.setItem(KEY, JSON.stringify(stand));
      w.scrollTo = () => {};
      w.print = () => {};
      w.confirm = () => true;
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.HTMLAnchorElement.prototype.click = function () {};
      w.URL.createObjectURL = () => "blob:x";
      w.URL.revokeObjectURL = () => {};
      w.navigator.vibrate = () => true;
      w.navigator.wakeLock = { request: () => Promise.resolve({ release: () => Promise.resolve() }) };
      w.SpeechSynthesisUtterance = function (text) { this.text = text; };
      w.speechSynthesis = {
        cancel() {},
        speak(u) {
          (w.__gesagt = w.__gesagt || []).push(u.text);
          // Vorlesen sofort beenden, damit Rückrufe wie das Auto-Weiter greifen
          if (optionen.sprichSofortZuEnde && u.onend) setTimeout(() => u.onend(), 5);
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

module.exports = { APP, KEY, HTML, boot, tag, leererStand, daten, schluessel, pruefer };
