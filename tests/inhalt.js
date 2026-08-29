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

/* Welche Formen mit welchen Fällen vereinbar sind — unabhängig von der App aufgestellt */
const FORM = {
  den: ["A", "D"], dem: ["D"], des: ["G"], der: ["N", "D", "G"], die: ["N", "A"], das: ["N", "A"],
  einen: ["A"], einem: ["D"], eines: ["G"], einer: ["D", "G"], eine: ["N", "A"], ein: ["N", "A"],
  keinen: ["A", "D"], keinem: ["D"], keines: ["G"], keiner: ["D", "G"], keine: ["N", "A"],
  meinen: ["A", "D"], meinem: ["D"], meines: ["G"], meiner: ["D", "G"], meine: ["N", "A"], mein: ["N", "A"],
  deinen: ["A", "D"], deinem: ["D"], deiner: ["D", "G"], deine: ["N", "A"], dein: ["N", "A"],
  seinen: ["A", "D"], seinem: ["D"], seines: ["G"], seiner: ["D", "G"], seine: ["N", "A"],
  ihren: ["A", "D"], ihrem: ["D"], ihres: ["G"], ihrer: ["D", "G"], ihre: ["N", "A"],
  unseren: ["A", "D"], unserem: ["D"], unserer: ["D", "G"], unsere: ["N", "A"],
  diesen: ["A", "D"], diesem: ["D"], dieses: ["N", "A", "G"], dieser: ["N", "D", "G"], diese: ["N", "A"],
  mich: ["A"], dich: ["A"], ihn: ["A"], uns: ["A", "D"], euch: ["A", "D"],
  mir: ["D"], dir: ["D"], ihm: ["D"], ihnen: ["D"], sich: ["A", "D"],
  wem: ["D"], wen: ["A"], wessen: ["G"], wer: ["N"],
  im: ["D"], am: ["D"], beim: ["D"], zum: ["D"], zur: ["D"], vom: ["D"],
  vorm: ["D"], hinterm: ["D"], unterm: ["D"], "überm": ["D"],
  ins: ["A"], ans: ["A"], aufs: ["A"], durchs: ["A"], "fürs": ["A"], ums: ["A"],
  "übers": ["A"], unters: ["A"], hinters: ["A"]
};
const NAME = { N: "Nominativ", A: "Akkusativ", D: "Dativ", G: "Genitiv" };

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

P.abschluss();
