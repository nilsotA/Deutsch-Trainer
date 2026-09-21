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
const RULES_ALL = daten(w, "RULES_ALL.map(r=>({id:r.id,b:r.b}))");
const CHECKS_ALL = daten(w, "CHECKS_ALL.map(c=>({id:c.id,k:c.k||\"\"}))");
const KORREKTUR = daten(w, "KORREKTUR");

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
         ["Dativ", "dem", "dem", "der", "denen"], ["Genitiv", "dessen", "dessen", "deren", "deren"]],
  /* Bis zum 21.09.2026 liefen fünf der zehn Tabellen nur als korrekter Bestand gegen die
     harten Textcheck-Muster mit — gegen ein Paradigma geprüft waren sie nicht. CLAUDE.md
     hat das selbst als offene Stelle geführt. Vier davon haben ein geschlossenes Paradigma,
     das sich unabhängig hinschreiben lässt; es steht hier, aus der Grammatik und nicht aus
     der App. Inhaltlich stimmten alle vier — die Lücke in der Absicherung war es trotzdem.
     tb09 ist keine Formentabelle, sondern ein Beispielwort (Kollege) durchdekliniert. */
  tb02: [["Nominativ", "ein —", "ein —", "eine", "keine / meine"],
         ["Akkusativ", "einen", "ein —", "eine", "keine / meine"],
         ["Dativ", "einem", "einem", "einer", "keinen / meinen"],
         ["Genitiv", "eines + s", "eines + s", "einer", "keiner / meiner"]],
  tb05: [["Nominativ", "guter Kaffee", "gutes Wetter", "gute Laune", "gute Ideen"],
         ["Akkusativ", "guten Kaffee", "gutes Wetter", "gute Laune", "gute Ideen"],
         ["Dativ", "gutem Kaffee", "gutem Wetter", "guter Laune", "guten Ideen"],
         ["Genitiv", "guten Kaffees", "guten Wetters", "guter Laune", "guter Ideen"]],
  tb09: [["Nominativ", "der Kollege", "die Kollegen"], ["Akkusativ", "den Kollegen", "die Kollegen"],
         ["Dativ", "dem Kollegen", "den Kollegen"], ["Genitiv", "des Kollegen", "der Kollegen"]],
  /* tb06 ist nach der Nominativform sortiert, nicht nach dem Fall — die erste Spalte
     dient hier als Schlüssel. tb08 trägt eine vierte Spalte mit einem Beispielsatz;
     geprüft werden nur die Formen, der Beispielsatz darf umformuliert werden. */
  tb06: [["ich", "mich", "mir"], ["du", "dich", "dir"], ["er", "ihn", "ihm"], ["es", "es", "ihm"],
         ["sie", "sie", "ihr"], ["wir", "uns", "uns"], ["ihr", "euch", "euch"],
         ["sie / Sie", "sie / Sie", "ihnen / Ihnen"]],
  tb08: [["Nominativ", "wer", "was"], ["Akkusativ", "wen", "was"],
         ["Dativ", "wem", "—"], ["Genitiv", "wessen", "wessen"]]
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

/* Lehre aus dem 21.09.2026 („ein Wächter sieht nicht alle Bestände“): Wer über einen
   Bestand prüft, zählt die Sorten ab. Kommt eine Tabelle dazu, ohne dass jemand ein
   Paradigma hinterlegt, fällt das sonst niemandem auf — sie läuft dann nur noch als
   korrektes Material gegen die Textcheck-Muster mit, und ein falsches Feld bliebe stumm. */
const TB_OHNE_PARADIGMA = {
  tb10: "wird unten gegen die Konjunktiv-II-Formen geprüft, nicht gegen ein Kasusparadigma",
};
const tbUngeprueft = TABLES.map(t => t.id)
  .filter(id => !(id in SOLL) && !(id in TB_OHNE_PARADIGMA));
P.ok("Jede Tabelle wird gegen ein Paradigma geprüft (" + TABLES.length + ")",
  !tbUngeprueft.length, tbUngeprueft.join(", "));
const tbTot = Object.keys(SOLL).concat(Object.keys(TB_OHNE_PARADIGMA))
  .filter(id => !TABLES.some(t => t.id === id));
P.ok("Kein Paradigma ohne Tabelle", !tbTot.length, tbTot.join(", "));
/* Zwei Proben für den Abdeckungswächter selbst: Er muss eine neue Tabelle ohne Paradigma
   melden und ein Paradigma ohne Tabelle ebenso. Sonst ist er eine leere Zusage. */
const abdeckung = (ids, soll, frei) => ids.filter(id => !(id in soll) && !(id in frei));
P.ok("Der Abdeckungswächter meldet eine Tabelle ohne Paradigma",
  abdeckung(["tb01", "tb99"], { tb01: 1 }, {}).join() === "tb99", "Positivprobe blieb stumm");
P.ok("… und schweigt bei einer ausgenommenen Tabelle",
  !abdeckung(["tb01", "tb99"], { tb01: 1 }, { tb99: "Grund" }).length, "Gegenprobe schlug an");

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
let zeichenPaare = 0;
ALL.filter(i => i.t !== "fill").forEach(i => {
  i.o.forEach((a, k) => i.o.forEach((b, m) => {
    if (m <= k || flach(a) !== flach(b)) return;
    Object.keys(ZEICHEN).forEach(z => {
      if (a.includes(z) === b.includes(z)) return;
      zeichenPaare++;
      const mit = a.includes(z) ? a : b;
      const hinweis = w.eval("hoerHinweis(" + JSON.stringify(mit) + "," + JSON.stringify(i.o) + ")");
      if (!hinweis.includes(ZEICHEN[z])) stummeZeichen.push(i.id + " (" + ZEICHEN[z] + ")");
    });
  }));
});
/* Die Prüfung sieht sich nur wenige Paare an. Fällt der Filter auf null, wäre sie stumm
   grün — deshalb die Untergrenze und die sichtbare Zahl. */
P.ok("Die Zeichenprüfung findet überhaupt Paare (" + zeichenPaare + ")", zeichenPaare >= 1, "kein Paar geprüft");
P.ok("Der Hörhinweis nennt das unterscheidende Zeichen", !stummeZeichen.length, stummeZeichen.join(", "));

/* Fehlerklasse „gleich klingende Wörter ohne Hinweis“: „Seid ihr bereit?“ und „Seit ihr
   bereit?“ werden identisch vorgelesen. Steht ein Paar aus KLANGPAAR in zwei Optionen an
   derselben Stelle, muss der Hörhinweis die Schreibung benennen. */
const PAARE = daten(w, "Object.keys(KLANGPAAR)");
const wortliste = t => String(t).toLowerCase().replace(/[^\p{L}]+/gu, " ").trim().split(/\s+/);
const stummePaare = [];
let klangPaare = 0;
ALL.filter(i => i.t !== "fill").forEach(i => {
  i.o.forEach((a, k) => i.o.forEach((b, m) => {
    if (m <= k) return;
    const ohneTags = t => String(t).replace(/<[^>]*>/g, " ");
    const wa = wortliste(ohneTags(a)), wb = wortliste(ohneTags(b));
    const treffer = wa.some((x, n) => PAARE.includes(x) && wb[n] && wb[n] !== x && PAARE.includes(wb[n]));
    if (!treffer) return;
    klangPaare++;
    const hinweis = w.eval("hoerHinweis(" + JSON.stringify(a) + "," + JSON.stringify(i.o) + ")");
    if (!hinweis.trim()) stummePaare.push(i.id);
  }));
});
P.ok("Die Klangprüfung findet überhaupt Paare (" + klangPaare + ")", klangPaare >= 1, "kein Paar geprüft");
P.ok("Gleich klingende Wörter bekommen einen Hörhinweis", !stummePaare.length, stummePaare.join(", "));

/* Fehlerklasse „Ziffer gegen ausgeschriebene Zahl“: „24 Personen nahmen teil“ und
   „Vierundzwanzig Personen nahmen teil“ werden von der Sprachausgabe wortgleich
   vorgelesen — unterwegs ist die Aufgabe damit nicht lösbar (q03 war so gebaut).
   Geprüft wird, ob zwei Optionen sich nur in Ziffer gegen Zahlwort unterscheiden.
   Die längeren Zahlwörter stehen zuerst, sonst zerlegt „drei“ das Wort „dreißig“. */
const ZAHLWORT = new RegExp("\\b(?:(?:ein|zwei|drei|vier|fünf|sechs|sieben|acht|neun)?und)?"
  + "(?:dreizehn|vierzehn|fünfzehn|sechzehn|siebzehn|achtzehn|neunzehn|dreißig|vierzig|fünfzig"
  + "|sechzig|siebzig|achtzig|neunzig|zwanzig|hundert|tausend|zwölf|zehn|elf|null|eine|ein[esrnm]?"
  + "|zwei|drei|vier|fünf|sechs|sieben|acht|neun)\\b", "gi");
const zahlKern = t => String(t).replace(/<[^>]*>/g, " ").replace(/\d+([.,]\d+)?/g, " ")
  .replace(ZAHLWORT, " ").replace(/[^\wäöüÄÖÜß ]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
const gleichNachZahl = (a, b) => {
  if (/\d/.test(String(a)) === /\d/.test(String(b))) return false;
  const ka = zahlKern(a);
  return ka.length >= 4 && ka === zahlKern(b);
};
/* Positivprobe: Das Paar, das die Prüfung überhaupt erst nötig gemacht hat. */
P.ok("Die Zifferprobe erkennt das Paar aus q03",
  gleichNachZahl("Vierundzwanzig Personen nahmen teil.", "24 Personen nahmen teil."),
  "Positivprobe blieb stumm");
const zifferStumm = [];
ALL.filter(i => i.t !== "fill").forEach(i => {
  i.o.forEach((a, k) => i.o.forEach((b, m) => {
    if (m <= k || !gleichNachZahl(a, b)) return;
    const hinweis = w.eval("hoerHinweis(" + JSON.stringify(a) + "," + JSON.stringify(i.o) + ")");
    if (!hinweis.trim()) zifferStumm.push(i.id + ": „" + a + "“ / „" + b + "“");
  }));
});
P.ok("Ziffer und ausgeschriebene Zahl klingen nicht gleich", !zifferStumm.length,
  zifferStumm.join(" · "));

/* ---------- E · Sammelantworten ---------- */
P.titel("E · Sammelantworten");
/* Fehlerklasse „zwei richtige Antworten“: Lautet die richtige Antwort „Beides ist
   zulässig“, dann erklärt die Aufgabe beide vorgeführten Formen für korrekt. Steht eine
   davon als blanker Ablenker daneben, ist dieser Ablenker nicht falsch — wer ihn antippt,
   hat nichts Falsches gewählt und bekommt trotzdem „falsch“ angezeigt (CLAUDE.md,
   Abschnitt 3, Grundsatz 2). Der Bestand löst das sonst einheitlich: Die Ablenker
   behaupten Ausschließlichkeit („Nur klein: recht haben“) und sind damit sicher falsch,
   weil eben nicht nur die eine Form gilt. */
const SAMMEL = /^\s*(beides|beide|alle\s+(drei|beide)|sowohl)\b/i;
const AUSSCHLUSS = /\b(nur|ausschließlich|einzig|ausschliesslich)\b|\b(ist|sind|wäre)\s+falsch\b|nicht\s+(zulässig|erlaubt|korrekt|richtig)|darf\s+nicht\b/i;
const sammelPruefen = liste => {
  const schief = [];
  liste.filter(i => i.t !== "fill" && Array.isArray(i.o) && SAMMEL.test(String(i.o[i.a] || "")))
    .forEach(i => i.o.forEach((o, k) => {
      if (k === i.a || AUSSCHLUSS.test(String(o))) return;
      schief.push(i.id + ": „" + o + "“ neben „" + i.o[i.a] + "“");
    }));
  return schief;
};
const sammelSchief = sammelPruefen(ALL);
const sammelZahl = ALL.filter(i => Array.isArray(i.o) && SAMMEL.test(String(i.o[i.a] || ""))).length;
P.ok("Sammelantworten gefunden (" + sammelZahl + ")", sammelZahl >= 10, sammelZahl);
P.ok("Kein Ablenker neben einer Sammelantwort ist selbst richtig", !sammelSchief.length,
  sammelSchief.join(" · "));
/* Positivprobe: Genau die Bauform, die hier verboten ist — sonst misst der Abschnitt
   nichts, falls sich SAMMEL oder AUSSCHLUSS an der Wirklichkeit vorbeientwickeln. */
P.ok("Die Sammelantwort-Prüfung schlägt beim blanken Ablenker an",
  sammelPruefen([{ id: "probe", a: 0, o: ["Beides ist zulässig", "Er ist imstande zu helfen."] }]).length === 1,
  "Positivprobe blieb stumm");
P.ok("und lässt die Ausschlussbehauptung stehen",
  sammelPruefen([{ id: "probe", a: 0, o: ["Beides ist zulässig", "Nur: imstande"] }]).length === 0,
  "Positivprobe meldet zu viel");

/* ---------- F · Tippaufgaben ---------- */
P.titel("F · Tippaufgaben");
/* Fehlerklasse „richtige Eingabe wird als Fehler gewertet“: Eine Tippaufgabe prüft den
   Kasus, akzeptierte aber nur eine einzige Form. „Innerhalb ___ Woche“ nahm nur „einer“ —
   „der Woche“ und „dieser Woche“ sind derselbe Genitiv. Wer richtig denkt und die andere
   Form tippt, bekommt einen Fehler in den Lernstand geschrieben und lernt daraus etwas
   Falsches. Umgekehrt darf die Liste nicht so weit werden, dass der falsche Kasus
   durchgeht — deshalb steht zu jeder Aufgabe beides: was durchgehen muss und was nicht.
   Die Tabelle ist die festgehaltene Durchsicht aller 44 Tippaufgaben vom 13.09.2026. */
const TIPP = [
  { id: "m20", muss: ["einer", "der", "dieser"], nicht: ["die", "eine", "den"] },
  { id: "n01", muss: ["dem", "meinem", "einem"], nicht: ["das", "den", "der"] },
  { id: "n02", muss: ["den", "einen", "meinen"], nicht: ["dem", "der", "des"] },
  { id: "n03", muss: ["den", "einen", "meinen"], nicht: ["dem", "der"] },
  { id: "n04", muss: ["der", "einer", "meiner"], nicht: ["die", "eine", "den"] },
  { id: "n06", muss: ["der", "einer"], nicht: ["die", "eine"] },
  { id: "n07", muss: ["den", "einen", "unseren"], nicht: ["dem", "des"] },
  { id: "n11", muss: ["dich", "ihn", "sie", "euch"], nicht: ["dir", "ihm", "ihnen"] },
  { id: "n12", muss: ["mir", "ihm", "ihr", "uns"], nicht: ["mich", "ihn", "dich"] },
  { id: "n14", muss: ["mich", "dich", "ihn", "uns"], nicht: ["mir", "dir", "ihm"] },
  { id: "n15", muss: ["dem"], nicht: ["den", "der", "des"] },
  { id: "n23", muss: ["mir"], nicht: ["mich", "dir"] },
  { id: "n25", muss: ["mir"], nicht: ["mich", "dir"] },
  { id: "r21", muss: ["darf"], nicht: ["dürfen", "darfst"] },
  { id: "n20", muss: ["unter"], nicht: ["auf", "über"] },
];
const norm = t => String(t).toLowerCase().trim()
  .replace(/[„“”"'‚‘’]/g, "").replace(/[.,;:!?]+$/, "").replace(/\s+/g, " ");
const nimmt = (auf, wort) => auf.some(a => norm(a) === norm(wort));
const zuEng = [], zuWeit = [], fehlt = [];
TIPP.forEach(t => {
  const i = ALL.find(x => x.id === t.id);
  if (!i || i.t !== "fill") { fehlt.push(t.id); return; }
  t.muss.forEach(x => { if (!nimmt(i.a, x)) zuEng.push(t.id + ": „" + x + "“ wird abgelehnt"); });
  t.nicht.forEach(x => { if (nimmt(i.a, x)) zuWeit.push(t.id + ": „" + x + "“ geht durch"); });
});
P.ok("Alle geprüften Tippaufgaben gibt es noch (" + TIPP.length + ")", !fehlt.length, fehlt.join(","));
P.ok("Keine richtige Eingabe wird abgelehnt", !zuEng.length, zuEng.join(" · "));
P.ok("Kein falscher Kasus geht durch", !zuWeit.length, zuWeit.join(" · "));
/* Positivproben: Beide Richtungen müssen anschlagen können. */
P.ok("Die Tippprüfung erkennt eine zu enge Liste",
  !nimmt(["einer"], "der") && nimmt(["einer", "der"], "der"), "Positivprobe blieb stumm");
P.ok("und eine zu weite", nimmt(["den", "dem"], "dem"), "Positivprobe blieb stumm");

/* Die Frage einer Tippaufgabe darf keine zweite Lesart offenlassen, die eine andere Form
   verlangt: n15 sagte nur „(maskulin, Dativ)“, was auch der Dativ Plural „den Kollegen“
   erfüllt; n23 und n25 fragten nach einem Pronomen, ohne „Reflexiv“ zu nennen. Die
   geschärften Fassungen werden hier festgehalten, damit sie nicht zurückfallen. */
const SCHARF = [
  ["n15", /Dativ Singular/],
  ["n20", /bei einem Umstand/],
  ["n23", /Reflexivpronomen/],
  ["n25", /Reflexivpronomen/],
  ["r21", /von „dürfen“/],
];
const stumpf = SCHARF.filter(([id, re]) => {
  const i = ALL.find(x => x.id === id);
  return !i || !re.test(String(i.q));
}).map(([id]) => id);
P.ok("Die geschärften Fragen sind geschärft geblieben", !stumpf.length, stumpf.join(","));

/* Die Rückmeldung zeigt bei einer Tippaufgabe „Richtig wäre: “ + accept[0]. Wer die Liste
   erweitert, darf die Musterantwort nicht ans Ende schieben — Nils läse sonst plötzlich
   „Richtig wäre: dieser“, wo er „einer“ gelernt hat. */
const ERST = { m20: "einer", n01: "dem", n02: "den", n03: "den", n04: "der", n06: "der",
  n07: "den", n11: "dich", n12: "mir", n14: "mich", n15: "dem", n23: "mir", n25: "mir" };
const verrutscht = Object.keys(ERST).filter(id => {
  const i = ALL.find(x => x.id === id);
  return !i || !Array.isArray(i.a) || norm(i.a[0]) !== norm(ERST[id]);
});
P.ok("Die Musterantwort steht bei jeder erweiterten Tippaufgabe vorn", !verrutscht.length,
  verrutscht.join(","));


/* ---------- G · Einordnung regionaler Varianten ---------- */
P.titel("G · Regionale Varianten");
/* Fehlerklasse „dieselbe Form, zwei verschiedene Landkarten“: Die Fallkarte „trotz“ sagte
   „In Österreich ist ‚trotz dem‘ verbreitet“, die Übung d17 zur exakt selben Sache „Der
   Dativ ist landschaftlich und in der Schweiz üblich“. Nils hat beide Karten im selben
   Stapel und bekommt für denselben Ablenker zwei verschiedene geografische Auskünfte.
   CLAUDE.md, Grundsatz 4: regional statt falsch — und überall gleich einordnen.
   Die Tabelle hält fest, was an welcher Stelle stehen muss. Sie ist der festgehaltene
   Quellenstand vom 13.09.2026, je mit zwei verschieden formulierten Suchen belegt:
   trotz → Schweiz, Österreich, teilweise Süddeutschland (IDS-Variantengrammatik)
   während → Schweiz und Westösterreich, in Zeitungstexten (IDS); sonst umgangssprachlich
   statt → Österreich und Schweiz (IDS); Dativ auch ohne erkennbare Genitivform
   wegen → überall umgangssprachlich, keine regionale Standardvariante
   Wer die Aussage ändert, ändert sie hier mit — und belegt sie neu. */
const EINORDNUNG = [
  { was: "trotz", muss: [/Schweiz/, /Österreich/, /[Ss]üddeutschland|Süden Deutschlands/],
    stellen: [["Fallkarte", "trotz"], ["Übung", "d17"], ["Übung", "m03"],
              ["Prüfmuster", "x02"], ["Fehlersuche", "kt07:dem"]] },
  { was: "während", muss: [/umgangssprachlich/, /Schweiz/, /Westösterreich|Österreich/],
    stellen: [["Fallkarte", "während"], ["Übung", "d18"]] },
  { was: "statt", muss: [/umgangssprachlich/, /Österreich/, /Schweiz/],
    stellen: [["Fallkarte", "statt / anstatt"]] },
  /* „wegen“ stand in der Regel als der Fall, bei dem der Dativ „überall“ umgangssprachlich
     sei — abgesetzt von trotz/während/statt, für die dieselbe Quelle zwei Sätze vorher
     zitiert wird. Die Variantengrammatik hat aber auch für „wegen“ eine Seite: geschrieben
     vor allem Liechtenstein, daneben Schweiz, Mittel- und Westösterreich, Südwestdeutschland,
     Luxemburg — bei überall deutlich überwiegendem Genitiv. Am 15.09.2026 mit zwei Suchen
     belegt. Das Prüfmuster x01 steht seitdem auf „pruef“ statt „hart“, wie x02. */
  { was: "wegen", muss: [/umgangssprachlich/],
    stellen: [["Fallkarte", "wegen"], ["Übung", "n05"], ["Übung", "v03"], ["Übung", "m01"],
              ["Prüfmuster", "x01"]] },
  /* gedenken → Duden-Zweifelsfälle: „standardsprachlich noch nicht anerkannt“, aber in
     Zeitungen verbreitet. zu (Richtung) → „nach Aldi“ ist Ruhrgebiet, nördliches
     Rheinland, Ostfriesland; Duden 2005: auf Norddeutschland beschränkt, nicht
     standardsprachlich. Beides am 13.09.2026 mit je zwei Suchen belegt. */
  { was: "gedenken", muss: [/nicht anerkannt|nicht standardsprachlich/, /Zeitungen|Presse/],
    stellen: [["Fallkarte", "gedenken"]] },
  { was: "zu (Richtung)", muss: [/Ruhrgebiet/, /Rheinland/, /nicht standardsprachlich|norddeutsch/],
    stellen: [["Fallkarte", "zu (Richtung)"], ["Übung", "n09"], ["Regel", "gram-richtung"]] },
  /* „Sinn machen“ ist keine regionale, sondern eine strittige Einordnung — dieselbe
     Fehlerklasse auf einer anderen Achse. Die App sagte an drei Stellen glatt
     „Lehnübersetzung aus dem Englischen“. Der Duden führt „etwas macht [k]einen Sinn“
     zwar als umgangssprachlich und setzt „nach englisch something makes sense“ dazu,
     aber Peter Eisenberg hält dagegen, dass „machen“ mit abstraktem Objekt im Deutschen
     alt ist („das macht Freude“). Am 14.09.2026 mit zwei Suchen belegt. Seitdem steht
     an allen vier Stellen dasselbe: der Duden-Befund und der Vorbehalt. */
  /* Perfekt mit „sein“ bei den Ruheverben. Die Landkarte stand an sieben Stellen und an
     zwei verschiedenen: Die Regel und z14 nannten Süddeutschland und Österreich, x11
     nannte zusätzlich die Schweiz, die vier Fallkarten wieder nicht. grammis (IDS) führt
     Süddeutschland, Österreich und die Schweiz — und als vierte Form „hängen“, die in
     der App gar nicht dabeistand. Am 15.09.2026 mit drei Suchen belegt. */
  { was: "Perfekt mit sein — die Landkarte",
    muss: [/schweizerisch|Schweiz/, /österreichisch|Österreich/, /süddeutsch|Süddeutschland|Süden/],
    stellen: [["Regel", "satz-perfekt"], ["Übung", "z14"], ["Übung", "x11"],
              ["Fallkarte", "stehen — wo"], ["Fallkarte", "sitzen — wo"],
              ["Fallkarte", "liegen — wo"], ["Fallkarte", "hängen (hing) — wo"]] },
  { was: "Perfekt mit sein — die Verbliste",
    muss: [/hängen/],
    stellen: [["Regel", "satz-perfekt"], ["Übung", "z14"], ["Übung", "x11"]] },
  /* „wo“ als Relativpronomen: Regel und Übung nannten die Landkarte, das Prüfmuster sagte
     nur „regional“. Seit dem 14.09.2026 steht die Einordnung auch dort. */
  { was: "wo als Relativpronomen", muss: [/Süddeutschland/, /Westens/, /nicht/],
    stellen: [["Übung", "n35"], ["Prüfmuster", "y10"], ["Regel", "gram-relkasus"]] },
  /* „anrufen“ mit Dativ: an sieben Stellen eingeordnet, nur in der Regel gram-akkverben
     stand bis zum 15.09.2026 ein nacktes „(nicht: dir)“ in der Klasse .nope — also optisch
     als klarer Fehler, während überall sonst die Landkarte steht. */
  /* „ab“ ohne Artikel: Duden empfiehlt den Dativ, in Deutschland ist der Akkusativ
     verbreitet; mit Artikel steht der Dativ fest. Am 15.09.2026 mit zwei Suchen belegt,
     beide beim IDS-Artikel „ab + Dativ/Akkusativ bei Datums- und Zeitangaben“. */
  /* „auf die Post“ gegen „zur Post“: beides Standard, die Verteilung regional. Der IDS
     führt dafür einen eigenen Artikel („Auf die / zur Post“). Am 15.09.2026 mit zwei
     Suchen belegt. Die Regel gab bis dahin nur „auf“ an — für Köln die seltenere Form. */
  { was: "auf die / zur Post", muss: [/[Ss]üden/, /Norden/, /Standard/],
    stellen: [["Regel", "gram-richtung"], ["Fallkarte", "auf (Richtung)"]] },
  { was: "ab ohne Artikel", muss: [/[Oo]hne Artikel/, /Akkusativ/, /Dativ/],
    stellen: [["Regel", "gram-praepdat"], ["Fallkarte", "ab"]] },
  { was: "anrufen mit Dativ", muss: [/[Ss]üdwest/, /[Ss]chweiz/],
    stellen: [["Regel", "gram-akkverben"], ["Übung", "n11"], ["Übung", "d03"], ["Übung", "d28"],
              ["Fallkarte", "anrufen"], ["Prüfmuster", "x20"]] },
  { was: "Sinn machen", muss: [/umgangssprachlich/, /umstritten/],
    stellen: [["Übung", "s08"], ["Prüfmuster", "s06"], ["Fehlersuche", "macht"],
              ["Regel", "stil-anglizismus"]] },
];
const textVon = (art, id) => {
  if (art === "Fallkarte") { const c = CASEREF.find(x => x.w === id); return c ? String(c.n || "") : null; }
  if (art === "Prüfmuster") { const c = CHECKS_ALL.find(x => x.id === id); return c ? String(c.k || "") : null; }
  if (art === "Regel") { const r = RULES_ALL.find(x => x.id === id); return r ? String(r.b || "") : null; }
  if (art === "Fehlersuche") {
    /* Ein Fehlersuchtext trägt mehrere Markierungen. „kt07:dem“ meint die Markierung „dem“
       in kt07; ohne Doppelpunkt gilt die Suche über alle Texte. Ohne diese Schärfung müsste
       jede gleichnamige Markierung dieselbe Einordnung tragen — „dem“ gibt es mehrfach. */
    const [wo, was] = id.includes(":") ? id.split(":") : [null, id];
    const treffer = [];
    KORREKTUR.forEach(k => {
      if (wo && k.id !== wo) return;
      (k.errs || []).forEach(e => { if (e.w === was) treffer.push(String(e.k || "")); });
    });
    return treffer.length ? treffer.join(" ") : null;
  }
  const i = ALL.find(x => x.id === id); return i ? String(i.e || "") : null;
};
const schiefG = [], fehltG = [];
EINORDNUNG.forEach(e => e.stellen.forEach(([art, id]) => {
  const t = textVon(art, id);
  if (t === null) { fehltG.push(art + " " + id); return; }
  const fehlend = e.muss.filter(re => !re.test(t));
  if (fehlend.length) schiefG.push(e.was + " · " + art + " " + id + ": fehlt " + fehlend.map(String).join(", "));
}));
P.ok("Alle eingeordneten Stellen gibt es noch", !fehltG.length, fehltG.join(", "));
P.ok("Dieselbe Variante ist überall gleich eingeordnet", !schiefG.length, schiefG.join(" · "));
/* Positivprobe: Die Prüfung muss anschlagen, wenn eine Landkarte unvollständig ist —
   sonst misst sie nichts. Die alte Fassung der Fallkarte trotz nannte nur Österreich. */
const alteFassung = "Im Plural ohne erkennbare Genitivform weicht man auf den Dativ aus. In Österreich ist „trotz dem“ verbreitet.";
P.ok("Die Einordnungsprüfung erkennt eine unvollständige Landkarte",
  EINORDNUNG[0].muss.filter(re => !re.test(alteFassung)).length === 2,
  "Positivprobe blieb stumm");

/* Zweite Achse derselben Fehlerklasse: das Register. Die Übung g13 sagt zu „bezüglich“,
   es klinge nach Amtsdeutsch — die Fallkarten „zwecks“ und „seitens“ sagten dazu nichts,
   obwohl beide tiefer im Amtsdeutsch stehen: Duden führt „zwecks“ als Amtssprache und
   „seitens“ als Papierdeutsch, das DWDS „zwecks“ als Behördensprache neben „behufs“.
   Nils soll die Wörter erkennen, nicht übernehmen — er schreibt Hausarbeiten und
   Elternmails, keine Bescheide. Belegt am 13.09.2026 mit je zwei Suchen. */
const REGISTER = [
  { was: "zwecks", art: "Fallkarte", id: "zwecks", muss: /Amtssprache|Amtsdeutsch|Behördensprache/ },
  { was: "seitens", art: "Fallkarte", id: "seitens", muss: /Papierdeutsch|Amtssprache|Amtsdeutsch/ },
  { was: "bezüglich", art: "Übung", id: "g13", muss: /Amtsdeutsch|Amtssprache/ },
];
const registerSchief = REGISTER.filter(r => {
  const t = textVon(r.art, r.id);
  return t === null || !r.muss.test(t);
}).map(r => r.was);
P.ok("Amtsdeutsch ist als Amtsdeutsch gekennzeichnet", !registerSchief.length, registerSchief.join(", "));
P.ok("Die Registerprüfung erkennt eine fehlende Kennzeichnung",
  !REGISTER[0].muss.test("zwecks besserer Planung — Genitiv."), "Positivprobe blieb stumm");

P.titel("K · Der Spickzettel gegen die Regel dahinter");
/* Der Spickzettel wiederholt Teile des Bestands handgeschrieben (CLAUDE.md, Abschnitt 7).
   Wird eine Regel korrigiert, bleibt die Kurzfassung stehen — niemand liest sie mit.
   Genau so stand am 15.09.2026 im Spickzettel „wider = gegen (widersprechen, widerlegen,
   widerspiegeln)“, während die Regel recht-wider widerspiegeln seit Langem ausdrücklich
   als eine der drei Ausnahmen führt, in denen „wider“ nicht „gegen“, sondern „zurück“
   heißt. Dieselbe Behauptung stand auch in der Erklärung des Prüfmusters x15.
   Die Tabelle hält je Spickzettelzeile fest, was dort stehen muss und was dort nicht
   stehen darf. `regel` ist nur die Fundstelle für den, der prüfen will. */
const cheatDom = w.document.createElement("div");
cheatDom.innerHTML = w.eval("cheatHTML()");
const spickZeile = (kopf) => {
  const tr = [...cheatDom.querySelectorAll("tr")]
    .find(x => x.children[0] && x.children[0].textContent.trim() === kopf);
  if (!tr) return null;
  return [...tr.children].slice(1).map(x => x.textContent).join(" ");
};
const spickAbschnitt = (nr) => {
  const sec = [...cheatDom.querySelectorAll("section.ch-sec")]
    .find(x => x.querySelector("h2").textContent.trim().startsWith(nr + " ·"));
  return sec ? sec.textContent : null;
};
const SPICK = [
  { zeile: "wider / wieder", regel: "recht-wider",
    muss: [/widerspiegeln/, /zurück/],
    darfNicht: [/gegen \(widersprechen, widerlegen, widerspiegeln/] },
  /* Die Regel recht-sz hängt die ss/ß-Entscheidung an drei Bedingungen: scharfes s,
     Vokallänge — und eine Handvoll kurzer Wörter mit einfachem s. Der Spickzettel gab
     bis zum 15.09.2026 nur die Vokallänge an und führte ausgerechnet „dass“ als Beispiel,
     also genau das Wort, dessen Partner „das“ die Ausnahme ist. */
  { zeile: "ss / ß", regel: "recht-sz",
    muss: [/scharfe/, /[Ww]eich/, /\bbis\b/], darfNicht: [] },
  /* Grundsatz 1: Wo mehrere Formen zulässig sind, steht das da. Die Regel z-schraeg nennt
     „die newtonschen Gesetze“ ausdrücklich als ebenso richtig; der Spickzettel nannte
     nur die Form mit Apostroph. */
  { zeile: "Apostroph", regel: "z-schraeg",
    muss: [/newtonsche/], darfNicht: [] },
];
const spickSchief = [];
SPICK.forEach(e => {
  const t = spickZeile(e.zeile);
  if (t === null) { spickSchief.push("Zeile fehlt: " + e.zeile); return; }
  e.muss.filter(re => !re.test(t)).forEach(re => spickSchief.push(e.zeile + ": fehlt " + re));
  e.darfNicht.filter(re => re.test(t)).forEach(re => spickSchief.push(e.zeile + ": steht noch " + re));
});
P.ok("Der Spickzettel sagt dasselbe wie die Regel dahinter", !spickSchief.length, spickSchief.join(" · "));
/* Positivprobe: an der alten Fassung muss die Prüfung anschlagen. */
const alteWiderZeile = "wider = gegen (widersprechen, widerlegen, widerspiegeln) · wieder = erneut.";
P.ok("Die Spickzettelprüfung erkennt die alte Fassung",
  SPICK[0].darfNicht.some(re => re.test(alteWiderZeile)) && !/zurück/.test(alteWiderZeile),
  "Positivprobe blieb stumm");

/* Zweite Achse: Der Spickzettel zählt Präpositionen listenweise auf. Drei davon führt die
   Regel gram-praepakk beziehungsweise gram-praepdat ausdrücklich als Sonderfälle — wer
   sie in der Liste liest und den Vorbehalt nicht, schreibt „entlang den Fluss“. */
const praepAbschnitt = spickAbschnitt("2") || "";
const praepFehlt = [[/entlang des Flusses/, "entlang vorangestellt mit Genitiv"],
                    [/bis zum Montag/, "bis mit Artikel"],
                    [/ab nächsten Montag/, "ab ohne Artikel mit Akkusativ"]]
  .filter(([re]) => !re.test(praepAbschnitt)).map(([, was]) => was);
P.ok("Die Sonderfälle der Präpositionslisten stehen im Spickzettel dabei",
  praepAbschnitt && !praepFehlt.length, praepFehlt.join(", "));

/* Dritte Achse: Abschnitt 8 des Spickzettels ist keine Kurzfassung, sondern eine zweite
   Fassung derselben zwei Listen aus satz-sprechen (Karte sa18). Zwei Listen, die dasselbe
   sagen sollen, laufen auseinander, ohne dass es jemand merkt — am 16.09.2026 führte der
   Spickzettel „mit was“ statt „womit“ unter „Fällt auf“, die Regel nicht. Abgedeckt war es
   sonst überall: Übung d27 und Prüfmuster a08 sagen beide, es sei gesprochen geläufig.
   Geprüft werden Stichwörter, nicht Wortlaute — der Spickzettel darf kürzen. */
const sprechRegel = RULES_ALL.find(r => r.id === "satz-sprechen");
const sprechDom = w.document.createElement("div");
sprechDom.innerHTML = sprechRegel ? sprechRegel.b : "";
const sprechListen = [...sprechDom.querySelectorAll("ul")]
  .map(ul => [...ul.querySelectorAll("li")].map(li => li.textContent).join(" · "));
const spickSpalten = (() => {
  const sec = [...cheatDom.querySelectorAll("section.ch-sec")]
    .find(x => x.querySelector("h2").textContent.trim().startsWith("8 ·"));
  if (!sec) return null;
  return [...sec.querySelectorAll(".ch-2col > div")]
    .map(d => [...d.querySelectorAll("li")].map(li => li.textContent).join(" · "));
})();
/* Stichwörter je Spalte, in der Reihenfolge der Listen: erst unauffällig, dann fällt auf. */
const SPRECH_STICH = [
  ["wegen dem Wetter", "Perfekt", "weil", "hab", "gestanden", "brauchen", "gehabt"],
  ["rufe dir an", "größer wie", "mit was", "Kollege", "würde", "Relativpronomen", "Satzabbruch", "Satzklammer"],
];
const sprechSchief = [];
if (!spickSpalten || spickSpalten.length !== 2 || sprechListen.length !== 2) {
  sprechSchief.push("Listen nicht gefunden: Regel " + sprechListen.length + ", Spickzettel " +
    (spickSpalten ? spickSpalten.length : 0));
} else {
  SPRECH_STICH.forEach((stich, i) => stich.forEach(x => {
    if (!sprechListen[i].includes(x)) sprechSchief.push("Regel, Liste " + (i + 1) + ": „" + x + "“ fehlt");
    if (!spickSpalten[i].includes(x)) sprechSchief.push("Spickzettel, Spalte " + (i + 1) + ": „" + x + "“ fehlt");
  }));
}
P.ok("Spickzettel 8 und satz-sprechen führen dieselben Punkte (" +
  SPRECH_STICH.flat().length + " Stichwörter)", !sprechSchief.length, sprechSchief.join(" · "));
/* Positivprobe: derselbe Vergleich gegen die Fassung vom 16.09.2026, in der „mit was“ nur
   im Spickzettel stand. Sie muss genau eine Lücke melden — auf der Regelseite. */
const probeVergleich = (regelListe, spickSpalte, stich) => {
  const fehlt = [];
  stich.forEach(x => {
    if (!regelListe.includes(x)) fehlt.push("Regel: " + x);
    if (!spickSpalte.includes(x)) fehlt.push("Spickzettel: " + x);
  });
  return fehlt;
};
const alteRegelListe = "„Ich rufe dir an“ statt „dich“ · „größer wie“ statt „größer als“ · " +
  "Fehlende n-Deklination: „mit dem Kollege“ · Doppeltes „würde“ · Falsches Relativpronomen · " +
  "Satzabbruch mitten im Gedanken · Verlorene Satzklammer bei langen Sätzen";
const alteSpickSpalte = "„Ich rufe dir an“ statt dich · „größer wie“ statt als · „mit was“ statt womit · " +
  "„mit dem Kollege“ — n-Deklination · doppeltes „würde“ · falsches Relativpronomen · " +
  "Satzabbruch mitten im Gedanken · verlorene Satzklammer bei langen Sätzen";
const probeFehlt = probeVergleich(alteRegelListe, alteSpickSpalte, SPRECH_STICH[1]);
P.ok("Die Listenprüfung erkennt einen Punkt, der nur auf einer Seite steht",
  probeFehlt.length === 1 && probeFehlt[0] === "Regel: mit was", probeFehlt.join(", ") || "blieb stumm");

P.titel("L · Kein Ablenker, den die App selbst erlaubt");
/* Grundsatz 2 ist der teuerste des Projekts: Kein Ablenker darf richtig sein. Eine Sorte
   davon lässt sich maschinell suchen — die, bei der die App sich selbst widerspricht.
   Unterscheiden sich richtige Antwort und Ablenker in genau einem Wort, und nennt
   irgendeine Regel beide Wörter in einem Satz, der sie als Varianten führt („beides
   zulässig“, „ebenso richtig“, „sind beide richtig“), dann sagt das Regelwerk selbst,
   dass der Ablenker nicht falsch ist. Genau so war „im Stande“ in die Aufgaben gekommen.
   Zwei Sorten Fehlalarm fallen raus: Grammatikbezeichnungen — die Aufgabe fragt dann nach
   dem Namen des Falls, nicht nach einer Form — und Kontrastsätze wie „Standard (nicht
   Standart)“, in denen beide Wörter stehen, aber gerade nicht als Varianten. */
const VARSATZ = /beides|ebenso richtig|auch richtig|auch zulässig|ebenfalls zulässig|freigestellt|beide (?:sind |formen|richtig)|zwei Schreibungen|wahlweise|sind beide/i;
const TERM = /^(Genitiv|Dativ|Akkusativ|Nominativ|Pflicht|freigestellt|groß|klein|zusammen|getrennt)$/i;
const nurText = h => String(h).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const varSaetze = [];
RULES_ALL.forEach(r => nurText(r.b).split(/(?<=[.:;])\s+/)
  .forEach(z => { if (VARSATZ.test(z)) varSaetze.push({ id: r.id, z }); }));
const wortDrin = (t, x) =>
  new RegExp("(?<![\\wäöüßÄÖÜ])" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\wäöüßÄÖÜ])").test(t);
/* Liefert die Fundstellen für ein Optionenpaar — als eigene Funktion, damit die
   Positivprobe unten denselben Weg geht wie die Prüfung. */
const variantenTreffer = (richtig, ablenker) => {
  const sauber = x => x.replace(/[„“”"()]/g, "").trim().split(/\s+/);
  const a = sauber(richtig), b = sauber(ablenker);
  if (a.length !== b.length) return [];
  const diff = a.map((x, n) => [x, b[n]]).filter(([x, y]) => x !== y);
  if (diff.length !== 1) return [];
  const ka = diff[0][0].replace(/[.,;:!?]+$/, ""), kb = diff[0][1].replace(/[.,;:!?]+$/, "");
  if (ka === kb || ka.length < 4 || kb.length < 4) return [];
  if (TERM.test(ka) || TERM.test(kb)) return [];
  const kontrast = new RegExp("\\(nicht\\s+(?:" + ka + "|" + kb + ")|statt\\s+(?:" + ka + "|" + kb + ")");
  return varSaetze.filter(v => !kontrast.test(v.z) && wortDrin(v.z, ka) && wortDrin(v.z, kb))
    .map(v => ka + " / " + kb + " — " + v.id);
};
const varSchief = [];
ALL.forEach(i => {
  if (!i.o || i.t === "fill" || i.o.length < 2) return;
  i.o.forEach((opt, k) => {
    if (k === i.a) return;
    variantenTreffer(i.o[i.a], opt).forEach(t => varSchief.push(i.id + ": " + t));
  });
});
P.ok("Kein Ablenker steht anderswo als zulässige Variante", !varSchief.length, varSchief.join(" · "));
P.info(varSaetze.length + " Variantensätze in den Regeln, dagegen geprüft");
/* Positivprobe: „ab nächstem Montag“ und „ab nächsten Montag“ führt gram-praepdat
   ausdrücklich als beide richtig. Als Aufgabenpaar müsste die Prüfung das melden. */
P.ok("Die Variantenprüfung erkennt einen erlaubten Ablenker",
  variantenTreffer("Wir starten ab nächstem Montag.", "Wir starten ab nächsten Montag.").length > 0,
  "Positivprobe blieb stumm");
/* Gegenprobe: ein echtes Falschpaar darf sie nicht melden. */
P.ok("und meldet ein echtes Falschpaar nicht",
  !variantenTreffer("Das ist Standard.", "Das ist Standart.").length,
  "Gegenprobe schlug an");

P.titel("M · Wortkarten, die sich selbst widersprechen");
/* Elf Wortkarten bauen ihre Bedeutung nach dem Muster „… — statt: X, Y“: X und Y sind die
   unscharfen Alltagswörter, die das Stichwort ersetzen soll. Steht dasselbe Wort zugleich
   im Feld s, sagt die Karte beides — meide es und nimm es. Genau so stand es bei
   „erörtern“: d riet von „diskutieren“ ab, s führte es als Sinnverwandtes. Der Duden
   definiert „erörtern“ selbst mit „diskutieren“; unscharf ist nur „reden über“.
   Geprüft wird der Wortlaut, nicht die Bedeutung — zwei verschiedene Wörter für dieselbe
   Sache sind kein Fund, dasselbe Wort in beiden Listen schon. */
const stattListe = (d) => {
  const m = String(d).match(/—\s*statt:\s*(.+)$/);
  return m ? m[1].split(/\s*,\s*/).map(x => x.toLowerCase().trim()).filter(Boolean) : null;
};
const synListe = (s) => String(s || "").split(/\s*,\s*/).map(x => x.toLowerCase().trim()).filter(Boolean);
const doppelt = (karte) => {
  const meiden = stattListe(karte.d);
  if (!meiden) return [];
  const syn = synListe(karte.s);
  return meiden.filter(x => syn.includes(x));
};
const stattSchief = [], mitStatt = WORDS.filter(x => stattListe(x.d));
WORDS.forEach(x => doppelt(x).forEach(y =>
  stattSchief.push(x.w + ": „" + y + "“ steht in der statt-Liste und unter den Synonymen")));
P.ok("Keine Wortkarte meidet ein Wort, das sie selbst als Synonym führt (" +
  mitStatt.length + " Karten mit statt-Liste)", !stattSchief.length, stattSchief.join(" · "));
/* Positivprobe an der Fassung vom 21.09.2026. */
P.ok("Die Widerspruchsprüfung erkennt die alte Fassung von erörtern",
  doppelt({ d: "eine offene Frage eingehend und von mehreren Seiten besprechen — statt: reden über, diskutieren",
            s: "besprechen, abhandeln, diskutieren" }).length === 1,
  "Positivprobe blieb stumm");
/* Gegenprobe: verschiedene Wörter für dieselbe Sache dürfen nebeneinander stehen. */
P.ok("… und schweigt bei zwei verschiedenen Wörtern",
  !doppelt({ d: "etwas sichtbar machen — statt: zeigen", s: "verdeutlichen, illustrieren" }).length,
  "Gegenprobe schlug an");

P.abschluss();
