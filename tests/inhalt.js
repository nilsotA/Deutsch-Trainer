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
    stellen: [["Fallkarte", "trotz"], ["Übung", "d17"], ["Übung", "m03"]] },
  { was: "während", muss: [/umgangssprachlich/],
    stellen: [["Fallkarte", "während"], ["Übung", "d18"]] },
  { was: "statt", muss: [/umgangssprachlich/, /Österreich/, /Schweiz/],
    stellen: [["Fallkarte", "statt / anstatt"]] },
  { was: "wegen", muss: [/umgangssprachlich/],
    stellen: [["Fallkarte", "wegen"], ["Übung", "n05"], ["Übung", "v03"], ["Übung", "m01"]] },
  /* gedenken → Duden-Zweifelsfälle: „standardsprachlich noch nicht anerkannt“, aber in
     Zeitungen verbreitet. zu (Richtung) → „nach Aldi“ ist Ruhrgebiet, nördliches
     Rheinland, Ostfriesland; Duden 2005: auf Norddeutschland beschränkt, nicht
     standardsprachlich. Beides am 13.09.2026 mit je zwei Suchen belegt. */
  { was: "gedenken", muss: [/nicht anerkannt|nicht standardsprachlich/, /Zeitungen|Presse/],
    stellen: [["Fallkarte", "gedenken"]] },
  { was: "zu (Richtung)", muss: [/Ruhrgebiet/, /Rheinland/, /nicht standardsprachlich|norddeutsch/],
    stellen: [["Fallkarte", "zu (Richtung)"]] },
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
  { was: "Sinn machen", muss: [/umgangssprachlich/, /umstritten/],
    stellen: [["Übung", "s08"], ["Prüfmuster", "s06"], ["Fehlersuche", "macht"],
              ["Regel", "stil-anglizismus"]] },
];
const textVon = (art, id) => {
  if (art === "Fallkarte") { const c = CASEREF.find(x => x.w === id); return c ? String(c.n || "") : null; }
  if (art === "Prüfmuster") { const c = CHECKS_ALL.find(x => x.id === id); return c ? String(c.k || "") : null; }
  if (art === "Regel") { const r = RULES_ALL.find(x => x.id === id); return r ? String(r.b || "") : null; }
  if (art === "Fehlersuche") {
    /* Ein Fehlersuchtext trägt mehrere Markierungen; gesucht ist die mit diesem Wort. */
    const treffer = [];
    KORREKTUR.forEach(k => (k.errs || []).forEach(e => { if (e.w === id) treffer.push(String(e.k || "")); }));
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

P.abschluss();
