/* Inhaltsprüfungen, die keinen Browser brauchen:
   Fallkarten gegen ihre Beispiele, Tabellen gegen die Standardparadigmen,
   Hörbarkeit, Dubletten. */

const { boot, daten, pruefer } = require("./setup");
const P = pruefer("A · Fallkarten gegen ihre Beispiele");

const w = boot(null);
const CASEREF = daten(w, "CASEREF");
const ALL = daten(w, "ALL");
const TABLES = daten(w, "TABLES");
const WORDS = daten(w, "WORDS");

/* Formentabelle: siehe tests/formen.js — von inhalt.js und fallform.js geteilt */
const { FORM, NAME } = require("./formen");

let geprueft = 0;
const widerspruch = [];
CASEREF.forEach(e => {
  const soll = Object.keys(NAME).find(k => NAME[k] === e.k);
  if (!soll) return;                                   // Doppelangaben wie „Akk oder Dat“
  const woerter = String(e.ex || "").toLowerCase().replace(/[^a-zäöüß ]/g, " ").split(/\s+/);
  const traeger = woerter.filter(x => FORM[x]);
  if (!traeger.length) return;                         // kein Artikel im Beispiel
  geprueft++;
  if (!traeger.some(x => FORM[x].includes(soll)))
    widerspruch.push(e.w + " (" + e.k + "): „" + e.ex + "“");
});
P.info("prüfbar: " + geprueft + " von " + CASEREF.length + " Fallkarten");
P.ok("Beispiel zeigt den angegebenen Fall", !widerspruch.length, widerspruch.join(" · "));

/* ---------- B · Tabellen gegen die Standardparadigmen ---------- */
P.titel("B · Deklinationstabellen");
const { JSDOM } = require("jsdom");
function zeilen(id) {
  const t = TABLES.find(x => x.id === id);
  if (!t) return null;
  const d = new JSDOM("<div>" + t.b + "</div>").window.document;
  return [...d.querySelectorAll("table tbody tr")].map(tr =>
    [...tr.children].map(c => c.textContent.trim().replace(/\s+/g, " ")));
}
const SOLL = {
  tb01: [["Nominativ", "der", "das", "die", "die"], ["Akkusativ", "den", "das", "die", "die"],
         ["Dativ", "dem", "dem", "der", "den + n"], ["Genitiv", "des + s", "des + s", "der", "der"]],
  tb03: [["Nominativ", "der gute", "das gute", "die gute", "die guten"],
         ["Akkusativ", "den guten", "das gute", "die gute", "die guten"],
         ["Dativ", "dem guten", "dem guten", "der guten", "den guten"],
         ["Genitiv", "des guten", "des guten", "der guten", "der guten"]],
  tb04: [["Nominativ", "ein guter", "ein gutes", "eine gute", "keine guten"],
         ["Akkusativ", "einen guten", "ein gutes", "eine gute", "keine guten"],
         ["Dativ", "einem guten", "einem guten", "einer guten", "keinen guten"],
         ["Genitiv", "eines guten", "eines guten", "einer guten", "keiner guten"]],
  tb07: [["Nominativ", "der", "das", "die", "die"], ["Akkusativ", "den", "das", "die", "die"],
         ["Dativ", "dem", "dem", "der", "denen"], ["Genitiv", "dessen", "dessen", "deren", "deren"]]
};
Object.keys(SOLL).forEach(id => {
  const ist = zeilen(id);
  if (!ist) { P.ok("Tabelle " + id + " vorhanden", false); return; }
  const abweichung = [];
  SOLL[id].forEach(soll => {
    const zeile = ist.find(z => z[0] === soll[0]);
    if (!zeile) { abweichung.push(soll[0] + " fehlt"); return; }
    soll.slice(1).forEach((wert, i) => {
      if ((zeile[i + 1] || "") !== wert) abweichung.push(soll[0] + "/" + (i + 1) + ": „" + zeile[i + 1] + "“ statt „" + wert + "“");
    });
  });
  P.ok("Tabelle " + id + " stimmt mit dem Paradigma überein", !abweichung.length, abweichung.join(" · "));
});

const konj = zeilen("tb10");
if (konj) {
  const erwartet = { sein: "wäre", haben: "hätte", werden: "würde", können: "könnte", müssen: "müsste",
    dürfen: "dürfte", sollen: "sollte", mögen: "möchte", wissen: "wüsste", gehen: "ginge",
    kommen: "käme", tun: "täte", lassen: "ließe" };
  const falsch = [];
  Object.keys(erwartet).forEach(v => {
    const z = konj.find(x => x[0] === v);
    if (!z) return;                                   // nicht jede Form muss aufgeführt sein
    if (!z[1] || !z[1].includes(erwartet[v])) falsch.push(v + ": „" + z[1] + "“ statt „" + erwartet[v] + "“");
  });
  P.ok("Konjunktiv-II-Formen korrekt", !falsch.length, falsch.join(" · "));
}

/* ---------- C · Dubletten und Wortkarten ---------- */
P.titel("C · Dubletten");
const dop = (liste, name) => {
  const z = {};
  liste.forEach(x => z[x] = (z[x] || 0) + 1);
  const mehrfach = Object.keys(z).filter(k => z[k] > 1);
  P.ok("Keine doppelten " + name, !mehrfach.length, mehrfach.join(", "));
};
dop(WORDS.map(x => x.w.toLowerCase()), "Wortkarten");
dop(CASEREF.map(x => x.w.toLowerCase()), "Fallkarten");
dop(TABLES.map(x => x.id), "Tabellen-IDs");

const ohneBeispiel = WORDS.filter(x => !x.ex || x.ex.length < 8).map(x => x.w);
P.ok("Jede Wortkarte hat ein Beispiel", !ohneBeispiel.length, ohneBeispiel.join(", "));
const knapp = WORDS.filter(x => !x.d || x.d.length < 12).map(x => x.w);
P.ok("Jede Wortkarte hat eine Erläuterung", !knapp.length, knapp.join(", "));

/* ---------- D · Länge unterwegs ---------- */
P.titel("D · Hörbarkeit");
const langeFragen = ALL.filter(i => i.t !== "fill")
  .filter(i => (i.q + " " + i.o.join(" ")).length > 340)
  .map(i => i.id);
P.ok("Keine überlangen Fragen für unterwegs", !langeFragen.length, langeFragen.join(","));

const restZeichen = new Set();
ALL.filter(i => i.t !== "fill").forEach(i => {
  const t = w.eval("sprechbar(sprechFrage(" + JSON.stringify({ q: i.q, opts: i.o }) + "))");
  (t.match(/[_§°%→<>&\/\\\[\]{}]/g) || []).forEach(c => restZeichen.add(c));
});
P.ok("Keine unlesbaren Sonderzeichen im Sprechtext", restZeichen.size === 0, [...restZeichen].join(" "));

/* Fehlerklasse „Hinweis nennt das falsche Zeichen“: Unterscheiden sich zwei Optionen beim
   Hören nur durch ein Satzzeichen, muss der Hörhinweis genau dieses Zeichen beim Namen
   nennen. Bei p03 nannte er nur die Kommas — der Hörer hätte sie zählen müssen, um die
   Fassung mit Semikolons zu erkennen. */
const ZEICHEN = { ";": "Semikolon", ":": "Doppelpunkt", "?": "Fragezeichen", "!": "Ausrufezeichen" };
const flach = t => String(t).toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const stummeZeichen = [];
ALL.filter(i => i.t !== "fill").forEach(i => {
  i.o.forEach((a, k) => i.o.forEach((b, m) => {
    if (m <= k || flach(a) !== flach(b)) return;
    Object.keys(ZEICHEN).forEach(z => {
      if (a.includes(z) === b.includes(z)) return;
      const mit = a.includes(z) ? a : b;
      const hinweis = w.eval("hoerHinweis(" + JSON.stringify(mit) + "," + JSON.stringify(i.o) + ")");
      if (!hinweis.includes(ZEICHEN[z])) stummeZeichen.push(i.id + " (" + ZEICHEN[z] + ")");
    });
  }));
});
P.ok("Der Hörhinweis nennt das unterscheidende Zeichen", !stummeZeichen.length, stummeZeichen.join(", "));

/* Fehlerklasse „gleich klingende Wörter ohne Hinweis“: „Seid ihr bereit?“ und „Seit ihr
   bereit?“ werden identisch vorgelesen. Steht ein Paar aus KLANGPAAR in zwei Optionen an
   derselben Stelle, muss der Hörhinweis die Schreibung benennen. */
const PAARE = daten(w, "Object.keys(KLANGPAAR)");
const wortliste = t => String(t).toLowerCase().replace(/[^\p{L}]+/gu, " ").trim().split(/\s+/);
const stummePaare = [];
ALL.filter(i => i.t !== "fill").forEach(i => {
  i.o.forEach((a, k) => i.o.forEach((b, m) => {
    if (m <= k) return;
    const ohneTags = t => String(t).replace(/<[^>]*>/g, " ");
    const wa = wortliste(ohneTags(a)), wb = wortliste(ohneTags(b));
    const treffer = wa.some((x, n) => PAARE.includes(x) && wb[n] && wb[n] !== x && PAARE.includes(wb[n]));
    if (!treffer) return;
    const hinweis = w.eval("hoerHinweis(" + JSON.stringify(a) + "," + JSON.stringify(i.o) + ")");
    if (!hinweis.trim()) stummePaare.push(i.id);
  }));
});
P.ok("Gleich klingende Wörter bekommen einen Hörhinweis", !stummePaare.length, stummePaare.join(", "));

P.abschluss();
