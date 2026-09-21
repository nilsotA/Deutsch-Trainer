/* Fährt die vier inhaltlichen Prüfläufe über mehrere Kalenderversätze.

   Fehlerklasse: ein Prüflauf, dessen Ergebnis vom heutigen Datum abhängt. Der wird still
   rot, sobald der Kalender weiterläuft — niemand hat etwas geändert, und trotzdem schlägt
   er fehl. Am 21.09.2026 stand tests/lernen.js, Abschnitt J so da, nachdem er am 16.09.
   noch grün war: Die Karte k20 steht mit dem 04.09. in NEU_GELERNT, lag im Fixture auf
   Fach 5 mit Fälligkeit heute+20, die letzte Antwort also bei heute−15. Bis zum 19.09. lag
   die vor dem 04.09., `regelAenderungen()` setzte die Karte auf Fach 1 zurück, und die
   Ansicht zeigte 39 statt 40. Eine zweite Zusicherung im selben Abschnitt hatte man mit
   „24 oder 25“ umschifft — dieselbe Falle, einmal schon zugeschnappt und nicht erkannt.

   `tests/setup.js` liest dafür `DT_TAGE` und verschiebt beide Uhren: die des Prüflaufs
   (`tag()`) und die im jsdom-Fenster. Das Fenster hat einen eigenen V8-Kontext mit eigenem
   Date — Node allein zu patchen reicht nicht.

   Die Versätze decken die Fachintervalle (bis 35 Tage), ein halbes und ein ganzes Jahr ab.
   Der Lauf dauert ein paar Minuten und gehört deshalb nicht in `npm test`. Wer an der
   Lernlogik, an NEU_GELERNT oder an einem Fixture mit Fälligkeiten arbeitet, ruft ihn
   einmal auf: `npm run kalender`.

   fallform.js läuft nicht mit — er prüft reine Inhaltsdaten ohne Datumsbezug. */

const { execFileSync } = require("child_process");
const path = require("path");

const LAEUFE = ["suite.js", "inhalt.js", "unterwegs.js", "lernen.js"];
const VERSAETZE = [0, 1, 7, 40, 200, 400];

console.log("── Kalenderdurchlauf: " + LAEUFE.length + " Prüfläufe × " +
  VERSAETZE.length + " Versätze");

const rot = [];
VERSAETZE.forEach(tage => {
  console.log("\n── DT_TAGE=" + tage);
  LAEUFE.forEach(datei => {
    let ausgabe = "";
    let bestanden = false;
    try {
      ausgabe = execFileSync(process.execPath, [path.join(__dirname, datei)], {
        encoding: "utf8",
        env: Object.assign({}, process.env, { DT_TAGE: String(tage) }),
      });
      bestanden = /Alles bestanden\./.test(ausgabe);
    } catch (e) {
      ausgabe = String((e.stdout || "") + (e.stderr || ""));
    }
    if (bestanden) {
      console.log("  ok    " + datei);
    } else {
      const zeilen = ausgabe.split("\n").filter(z => /FEHLER/.test(z)).slice(0, 3);
      console.log("  FEHLER " + datei + (zeilen.length ? "\n      " + zeilen.join("\n      ") : ""));
      rot.push("DT_TAGE=" + tage + " · " + datei);
    }
  });
});

console.log("");
if (rot.length) {
  console.log(rot.length + " Probleme: " + rot.join(" · "));
  process.exitCode = 1;
} else {
  console.log("Alles bestanden.");
}
