/* Grundprüfung: Datenbestand, Verweise, Widersprüche, Ansichten, Textcheck.
   Läuft in wenigen Sekunden und sollte nach jeder Änderung grün sein. */

const { boot, daten, pruefer } = require("./setup");
const P = pruefer("A · Datenbestand");

const w = boot(null);
const ALL = daten(w, "ALL");
const RA = daten(w, "RULES_ALL");
const WORDS = daten(w, "WORDS");
const CASEREF = daten(w, "CASEREF");
const SATZ = daten(w, "SATZ");
const KORREKTUR = daten(w, "KORREKTUR");
const strip = h => String(h).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/* ---------- Der ganze Bestand an einem Ort ----------
   Fehlerklasse „ein Wächter sieht nicht alle Bestände“, zweimal zugeschnappt: Die
   Rangbehauptungsprüfung las erst fünf Sorten von zehn, dann sechs — beide Male stand der
   Fund in einer der übersehenen. Wer jeden Wächter selbst zusammenstellen lässt, wiederholt
   das. Hier steht der Bestand einmal, jeder Wächter läuft darüber, und darunter prüft eine
   Zusicherung, dass keine Sorte fehlt. */
const BESTAND = [];
const nimmAuf = (sorte, id, t) => { if (t) BESTAND.push({ sorte, id, t: strip(t) }); };
RA.forEach(r => nimmAuf("Regel", r.id, r.b));
SATZ.forEach(x => nimmAuf("Satzkarte", x.id, x.b));
ALL.forEach(i => { nimmAuf("Übung", i.id, i.e); nimmAuf("Übung", i.id, i.q); });
daten(w, "CHECKS_ALL.map(c=>({id:c.id,k:c.k||''}))").forEach(c => nimmAuf("Prüfmuster", c.id, c.k));
CASEREF.forEach(e => nimmAuf("Fallkarte", e.w, e.n));
WORDS.forEach(x => { nimmAuf("Wortkarte", x.w, x.d); nimmAuf("Wortkarte", x.w, x.t); });
daten(w, "TABLES").forEach(t => nimmAuf("Tabelle", t.id, t.b));
KORREKTUR.forEach(t => t.errs.forEach(e => nimmAuf("Fehlersuche", t.id + ":" + e.w, e.k)));
daten(w, "PROMPTS").forEach(x => {
  nimmAuf("Schreibwerkstatt", x.id + ".tip", x.tip);
  nimmAuf("Schreibwerkstatt", x.id + ".model", x.model);
  (x.crit || []).forEach((c, i) => nimmAuf("Schreibwerkstatt", x.id + ".crit" + i, c));
});
daten(w, "SCENES").forEach(x => ["s", "model", "why", "alt"]
  .forEach(f => nimmAuf("Schreibwerkstatt", x.id + "." + f, x[f])));
daten(w, "PAIRS").forEach(x => ["bad", "good", "why", "note"]
  .forEach(f => nimmAuf("Schreibwerkstatt", x.id + "." + f, x[f])));
daten(w, "PHRASES").forEach(x => {
  nimmAuf("Schreibwerkstatt", x.id + ".tip", x.tip);
  (x.no || []).forEach((n, i) => nimmAuf("Schreibwerkstatt", x.id + ".no" + i, n));
});
nimmAuf("Spickzettel", "cheat", daten(w, "cheatHTML()"));
/* Ein Wächter, der über BESTAND läuft, filtert mit dieser Hilfe auf seine Sorten —
   und wer alles will, lässt sie weg. */
const ausBestand = (...sorten) =>
  sorten.length ? BESTAND.filter(x => sorten.includes(x.sorte)) : BESTAND;

/* ---------- A · Datenbestand ---------- */
const ids = new Set();
let doppelt = 0;
ALL.forEach(i => { if (ids.has(i.id)) doppelt++; ids.add(i.id); });
P.ok("Aufgaben-IDs eindeutig (" + ALL.length + ")", doppelt === 0, doppelt);

const rids = new Set(RA.map(r => r.id));
P.ok("Regel-IDs eindeutig (" + RA.length + ")", rids.size === RA.length);

/* Fehlerklasse „veraltete Zahl in der Anleitung“: Die Tabelle in CLAUDE.md nannte
   331 Übungen, tatsächlich waren es 371. Wer sich beim Ergänzen daran orientiert,
   rechnet mit falschen Größen. Die Zahlen werden hier gegen die App geprüft. */
const fs = require("fs");
const path = require("path");
const doku = fs.readFileSync(path.join(__dirname, "..", "CLAUDE.md"), "utf8");
const zahl = re => { const m = doku.match(re); return m ? Number(m[1]) : null; };
const dokuZahlen = [
  ["Übungen", zahl(/\|\s*`EX_A … EX_E` → `ALL`\s*\|\s*(\d+) Übungen/), daten(w, "ALL.length")],
  ["Wortkarten", zahl(/\|\s*`WORDS`\s*\|\s*(\d+) Wortschatzkarten/), daten(w, "WORDS.length")],
  ["Regeln", zahl(/→ `RULES_ALL`\s*\|\s*(\d+) Regeln/), daten(w, "RULES_ALL.length")],
  ["Fallkarten", zahl(/\|\s*`CASEREF`\s*\|\s*(\d+) Fallkarten/), daten(w, "CASEREF.length")],
  ["Prüfmuster", zahl(/→ `CHECKS_ALL`\s*\|\s*(\d+) Prüfmuster/), daten(w, "CHECKS_ALL.length")],
  ["Fehlersuchtexte", zahl(/\|\s*`KORREKTUR`\s*\|\s*(\d+) Fehlersuchtexte/), daten(w, "KORREKTUR.length")],
  ["Fehlermarkierungen", zahl(/Fehlersuchtexte \/ (\d+) Fehler/), daten(w, "KORREKTUR.reduce((a,t)=>a+t.errs.length,0)")],
  ["Gesamtbestand", zahl(/Gesamtbestand \((\d+) Karten/), daten(w, "alleSchluessel().length")],
];
const dokuSchief = dokuZahlen.filter(([, dok, app]) => dok !== app)
  .map(([was, d, a]) => was + ": CLAUDE.md " + d + ", App " + a);
P.ok("Die Zahlen in CLAUDE.md stimmen mit der App überein", !dokuSchief.length, dokuSchief.join(" · "));

/* Dieselbe Tabelle, andere Frage: Ist jeder Datenbestand, den sie nennt, auch in BESTAND
   vertreten? Nur dann können die Wächter darunter ihn überhaupt sehen. Kommt eine Zeile
   dazu — ein neuer Datenbestand —, wird dieser Lauf rot, bis jemand ihn oben einträgt.
   Genau das hat zweimal gefehlt: Die Rangbehauptungsprüfung übersah erst die Wortkarten,
   dann die Schreibwerkstatt, die Fehlersuche, die Tabellen und den Spickzettel. */
const KONSTANTE_ZU_SORTE = {
  ALL: "Übung", WORDS: "Wortkarte", RULES_ALL: "Regel", SATZ: "Satzkarte",
  CASEREF: "Fallkarte", TABLES: "Tabelle", KORREKTUR: "Fehlersuche",
  CHECKS_ALL: "Prüfmuster", PROMPTS: "Schreibwerkstatt",
};
const tabelle = doku.slice(doku.indexOf("### Datenbestände"), doku.indexOf("**Kategorien"));
const zeilenDerTabelle = tabelle.split("\n")
  .filter(z => z.startsWith("|") && z.includes("`") && !z.includes("Konstante") && !z.includes("---"));
const sortenDa = new Set(BESTAND.map(x => x.sorte));
const bestandLuecken = [];
zeilenDerTabelle.forEach(z => {
  const namen = (z.match(/`([A-Z_][A-Z_0-9]*)`/g) || []).map(x => x.replace(/`/g, ""));
  const bekannt = namen.filter(n => n in KONSTANTE_ZU_SORTE);
  if (!bekannt.length) { bestandLuecken.push("Zeile ohne bekannte Konstante: " + namen.join(", ")); return; }
  bekannt.forEach(n => {
    if (!sortenDa.has(KONSTANTE_ZU_SORTE[n]))
      bestandLuecken.push(n + " → Sorte „" + KONSTANTE_ZU_SORTE[n] + "“ fehlt in BESTAND");
  });
});
P.ok("Jeder Datenbestand aus der Tabelle steckt in BESTAND (" + zeilenDerTabelle.length +
  " Zeilen, " + sortenDa.size + " Sorten, " + BESTAND.length + " Felder)",
  !bestandLuecken.length, bestandLuecken.join(" · "));
/* Positivprobe: Ohne die Wortkarten — der Stand vor dem 21.09.2026 — muss sie anschlagen. */
P.ok("Die Bestandsprüfung erkennt eine fehlende Sorte",
  !new Set(BESTAND.filter(x => x.sorte !== "Wortkarte").map(x => x.sorte)).has("Wortkarte"),
  "Positivprobe blieb stumm");

/* Dieselbe Falle ein drittes Mal, diesmal in der App selbst: Ihre Kommentare begründen
   Entscheidungen mit Bestandszahlen — „320 der 699 Karten waren über Heute unerreichbar“,
   „118 Regeln, zweimal gezeichnet“. Wächst der Bestand, stimmen sie nicht mehr, und wer
   beim nächsten Umbau danach plant, rechnet falsch. Drei standen veraltet da (696, 696,
   117), bevor diese Prüfung entstand.
   Geführte Liste statt Mustersuche: Ein erster Anlauf suchte jede Zahl vor einem
   Bestandswort und meldete „30 Tage Tagesaufgabe ergaben 360 Übungen“ — ein
   Rechenergebnis, keine Bestandsangabe. Die beiden lassen sich maschinell nicht
   trennen, und eine Regel, die das Falsche misst, ist schlimmer als eine enge. */
{
  const skript = fs.readFileSync(path.join(__dirname, "..", "Deutsch-Trainer.html"), "utf8")
    .split("<script>")[1].split("</" + "script>")[0];
  const KOMMENTARZAHLEN = [
    { text: "320 der N Karten", wert: () => daten(w, "alleSchluessel().length") },
    { text: "über alle N Karten", wert: () => daten(w, "alleSchluessel().length") },
    { text: "N Regeln, zweimal", wert: () => daten(w, "RULES_ALL.length") },
  ];
  const veraltet = [], fehlt = [];
  KOMMENTARZAHLEN.forEach(k => {
    const soll = k.wert();
    const gesucht = k.text.replace("N", String(soll));
    if (skript.includes(gesucht)) return;
    /* Steht dort eine andere Zahl, oder ist die Stelle ganz weg? Erst escapen, dann das
       N einsetzen — andersherum escapt man die eigene Klammer und die Gruppe ist hin. */
    const escapt = k.text.replace(/[.*+?^${}()|[\]\\]/g, x => "\\" + x);
    const m = skript.match(new RegExp(escapt.replace("N", "(\\d+)")));
    if (m) veraltet.push("„" + m[0] + "“ — es sind " + soll);
    else fehlt.push("„" + k.text + "“ nicht mehr im Skript");
  });
  P.ok("Die Bestandszahlen in den Kommentaren der App stimmen", !veraltet.length, veraltet.join(" · "));
  P.ok("Die geprüften Kommentarstellen gibt es noch (" + KOMMENTARZAHLEN.length + ")", !fehlt.length,
    fehlt.join(" · "));
}

/* Dieselbe Falle ein zweites Mal: HANDOVER.md führt eine Tabelle „Stand der App“ mit
   denselben Zahlen. Sie stand bei 376 Übungen, 117 Regeln und 95 Prüfmustern, während
   CLAUDE.md längst nachgezogen war — geprüft wurde eben nur die eine Datei. Auch die
   Dateigröße wird mitgeprüft: Sie hinkte um 130 KB hinterher, und wer nach ihr plant,
   schätzt die Ladezeit auf dem Handy falsch ein. */
const hand = fs.readFileSync(path.join(__dirname, "..", "HANDOVER.md"), "utf8");
const hzahl = re => { const m = hand.match(re); return m ? Number(m[1]) : null; };
const appKB = Math.round(fs.statSync(path.join(__dirname, "..", "Deutsch-Trainer.html")).size / 1024);
const handZahlen = [
  ["Übungen", hzahl(/\|\s*Übungen\s*\|\s*(\d+)\s*\|/), daten(w, "ALL.length")],
  ["Regeln", hzahl(/\|\s*Regeln\s*\|\s*(\d+)\s*\|/), daten(w, "RULES_ALL.length")],
  ["Wortkarten", hzahl(/\|\s*Wortkarten\s*\|\s*(\d+)\s*\|/), daten(w, "WORDS.length")],
  ["Fallkarten", hzahl(/\|\s*Fallkarten\s*\|\s*(\d+)/), daten(w, "CASEREF.length")],
  ["Satzbaukarten", hzahl(/\|\s*Satzbaukarten\s*\|\s*(\d+)\s*\|/), daten(w, "SATZ.length")],
  ["Prüfmuster", hzahl(/\|\s*Prüfmuster im Textcheck\s*\|\s*(\d+)\s*\|/), daten(w, "CHECKS_ALL.length")],
  ["Fehlersuchtexte", hzahl(/\|\s*Fehlersuchtexte\s*\|\s*(\d+) mit/), daten(w, "KORREKTUR.length")],
  ["Fehlermarkierungen", hzahl(/Fehlersuchtexte \| \d+ mit (\d+) markierten/), daten(w, "KORREKTUR.reduce((a,t)=>a+t.errs.length,0)")],
];
const handSchief = handZahlen.filter(([, dok, app]) => dok !== app)
  .map(([was, d, a]) => was + ": HANDOVER.md " + d + ", App " + a);
P.ok("Die Zahlen in HANDOVER.md stimmen mit der App überein", !handSchief.length, handSchief.join(" · "));
const handKB = hzahl(/\|\s*Dateigröße\s*\|\s*~(\d+) KB/);
P.ok("Die Dateigröße in HANDOVER.md stimmt auf 20 KB genau (" + appKB + " KB)",
  handKB !== null && Math.abs(handKB - appKB) <= 20, "HANDOVER.md ~" + handKB + " KB, tatsächlich " + appKB + " KB");

/* Fehlerklasse „doppelte Prüfmuster-Kennung“: Zwei Muster mit derselben id sind in der
   Ansicht nicht auseinanderzuhalten, und wer nach der id filtert, sieht das falsche. */
const CHECKS = daten(w, "CHECKS_ALL.map(c => ({id: c.id, sev: c.sev}))");
const cids = new Set(CHECKS.map(c => c.id));
P.ok("Prüfmuster-IDs eindeutig (" + CHECKS.length + ")", cids.size === CHECKS.length,
  CHECKS.map(c => c.id).filter((x, k, a) => a.indexOf(x) !== k).join(","));
P.ok("Regelverweise gültig", ALL.filter(i => i.r && !rids.has(i.r)).length === 0,
  ALL.filter(i => i.r && !rids.has(i.r)).map(i => i.id).join(","));
P.ok("Jede Aufgabe hat einen Regelverweis", ALL.filter(i => !i.r).length === 0,
  ALL.filter(i => !i.r).map(i => i.id).join(","));
P.ok("Jede Regel hat mindestens eine Aufgabe",
  RA.filter(r => !ALL.some(i => i.r === r.id)).length === 0,
  RA.filter(r => !ALL.some(i => i.r === r.id)).map(r => r.id).join(","));

let schief = 0;
ALL.forEach(i => {
  if (i.t === "fill") { if (!Array.isArray(i.a) || !i.a.length) schief++; return; }
  if (typeof i.a !== "number" || i.a < 0 || i.a >= i.o.length) schief++;
  if (new Set(i.o).size !== i.o.length) schief++;      // zwei identische Optionen
  if (i.o.some(o => !String(o).trim())) schief++;
});
P.ok("Antwortangaben gültig", schief === 0, schief);

let fehlmark = 0, dopmark = 0;
KORREKTUR.forEach(t => {
  const tk = t.txt.split(/\s+/), belegt = {};
  t.errs.forEach(e => {
    const n = e.nth || 1;
    let c = 0, idx = -1;
    tk.forEach((x, i) => { if (x === e.w) { c++; if (c === n && idx < 0) idx = i; } });
    if (idx < 0) fehlmark++;
    if (belegt[idx]) dopmark++;
    belegt[idx] = 1;
  });
});
P.ok("Korrekturmarkierungen auffindbar (" + KORREKTUR.reduce((a, t) => a + t.errs.length, 0) + ")",
  fehlmark === 0 && dopmark === 0, fehlmark + " nicht gefunden / " + dopmark + " doppelt");

/* Jede Markierung ist antippbar und führt in die Regel. Zeigt ihr Verweis ins Leere,
   landet Nils nirgends — und eine Markierung, deren Kategorie nicht zur verwiesenen Regel
   passt, sortiert sich im Fehlerjournal unter der falschen Überschrift ein. */
const KAT = new Set(["komma", "gross", "getrennt", "recht", "gram", "stil", "form", "satz", "zeichen", "zahlen"]);
const regelKat = {};
daten(w, "RULES_ALL.map(r=>({id:r.id,c:r.c}))").forEach(r => regelKat[r.id] = r.c);
const markSchief = [];
KORREKTUR.forEach(t => t.errs.forEach(e => {
  if (!e.r || !rids.has(e.r)) markSchief.push(t.id + ": „" + e.w + "“ verweist auf " + e.r);
  else if (e.c && regelKat[e.r] !== e.c)
    markSchief.push(t.id + ": „" + e.w + "“ ist " + e.c + ", die Regel " + e.r + " aber " + regelKat[e.r]);
  if (String(e.ok) === String(e.w)) markSchief.push(t.id + ": „" + e.w + "“ wird durch sich selbst ersetzt");
  if (!e.c || !KAT.has(e.c)) markSchief.push(t.id + ": „" + e.w + "“ hat die Kategorie " + e.c);
}));
P.ok("Jede Fehlermarkierung führt in eine passende Regel", !markSchief.length,
  markSchief.slice(0, 5).join(" · "));

/* Grundsatz 4, auf die Fehlersuche angewandt: Derselbe Fehler muss überall gleich
   eingeordnet sein. „vorraus“ → „Voraus“ ist in zwei Texten markiert; kt01 und das
   Prüfmuster x14 schickten Nils nach gross-subst, kt03 nach form-danken — einer Regel
   übers Danken, die zur Schreibung nichts sagt. Im Fehlerjournal sortierte sich derselbe
   Rechtschreibfehler damit einmal unter Großschreibung und einmal unter Wirkung und Ton. */
{
  const wortKern = x => String(x).toLowerCase().replace(/[^a-zäöüß]/g, "");
  const gleiche = {};
  KORREKTUR.forEach(t => t.errs.forEach(e => {
    const schl = wortKern(e.w) + "→" + wortKern(e.ok);
    (gleiche[schl] = gleiche[schl] || []).push({ id: t.id, r: e.r, c: e.c, w: e.w, ok: e.ok });
  }));
  const uneins = Object.values(gleiche).filter(v => v.length > 1 &&
    new Set(v.map(x => x.r + "/" + x.c)).size > 1);
  P.ok("Derselbe Fehler ist in jedem Fehlersuchtext gleich eingeordnet",
    !uneins.length,
    uneins.map(v => "„" + v[0].w + "“: " + v.map(x => x.id + "→" + x.r + "/" + x.c).join(" gegen ")).join(" · "));
  /* Positivprobe an der Fassung vom 21.09.2026. */
  const probePaar = [{ id: "kt01", r: "gross-subst", c: "gross" }, { id: "kt03", r: "form-danken", c: "form" }];
  P.ok("Die Einordnungsprüfung erkennt zwei verschiedene Zuordnungen",
    new Set(probePaar.map(x => x.r + "/" + x.c)).size === 2, "Positivprobe blieb stumm");

  /* Die Fehlersuche zeigt jede Markierung als „falsch → richtig“ (siehe die Zeile mit
     kerr-h). Rechts vom Pfeil muss also die richtige Form stehen — nicht noch einmal die
     falsche. kt02 zeigte „selben → selben Verein (zusammen: demselben)“: Die richtige Form
     stand nur in der Klammer, links und rechts dasselbe falsche Wort.

     Ausgenommen sind stil, form und satz: Dort ist das ok-Feld von Haus aus ein Hinweis
     oder eine ganze Umschreibung („(streichen)“, „an der Veranstaltung teilnehmen“), in
     der das beanstandete Wort zwangsläufig wieder vorkommt. Ebenso ausgenommen ist die
     reine Kommaergänzung („fragen“ → „fragen,“) — die ist eindeutig. */
  const roh = x => String(x).replace(/^[^\wÄÖÜäöüß]+|[^\wÄÖÜäöüß]+$/g, "");
  const alsWort = (t, x) =>
    new RegExp("(?<![\\wäöüßÄÖÜ])" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\wäöüßÄÖÜ])").test(t);
  const spiegelt = (e) => {
    if (["stil", "form", "satz"].includes(e.c)) return false;
    const wk = roh(e.w), ok = String(e.ok);
    if (!wk) return false;
    if (ok === e.w + "," || ok === wk + "," || ok === wk) return false;
    return alsWort(ok, wk);
  };
  const gespiegelt = [];
  KORREKTUR.forEach(t => t.errs.forEach(e => {
    if (spiegelt(e)) gespiegelt.push(t.id + ": „" + e.w + "“ → „" + e.ok + "“");
  }));
  P.ok("Rechts vom Pfeil steht die richtige Form, nicht noch einmal die falsche",
    !gespiegelt.length, gespiegelt.join(" · "));
  P.ok("Der Spiegel-Erkenner schlägt bei der alten Fassung von kt02 an",
    spiegelt({ c: "gram", w: "selben", ok: "selben Verein (zusammen: demselben)" }),
    "Positivprobe blieb stumm");
  P.ok("… und schweigt bei einer Kommaergänzung und bei einer Umschreibung",
    !spiegelt({ c: "komma", w: "fragen", ok: "fragen," }) &&
    !spiegelt({ c: "satz", w: "teilnehmen", ok: "an der Veranstaltung teilnehmen" }),
    "Gegenprobe schlug an");
}

/* ---------- B · Formulierung der Aufgaben ---------- */
P.titel("B · Formulierung");
const POS = /\b(Fassung [ABC]\b|Option [ABC]\b|die (erste|zweite|dritte) (Fassung|Variante|Version|Option|Antwort))/i;
const posL = ALL.filter(i => POS.test(strip(i.q)) || POS.test(strip(i.e)));
P.ok("Keine Positionsverweise", !posL.length, posL.map(i => i.id).join(","));

const RUECK = /^(und |auch |noch )|^(hier|dasselbe|genauso)\b|\b(und hier|wie eben|wie oben|siehe oben|dieselbe regel|vorige aufgabe)\b/i;
const rueckL = ALL.filter(i => RUECK.test(strip(i.q).trim()));
P.ok("Keine Rückverweise auf die vorige Aufgabe", !rueckL.length, rueckL.map(i => i.id).join(","));

const SICHT = /\b(oben|unten|links|rechts|folgend|obige|untenstehend|siehe)\b/i;
const sichtL = ALL.filter(i => SICHT.test(strip(i.q)));
P.ok("Keine Sichtverweise in Fragen", !sichtL.length, sichtL.map(i => i.id).join(","));

/* Beim Hören unterscheidbar — der Unterwegs-Modus liest Frage und Antworten vor */
const hoerbar = ALL.filter(i => i.t !== "fill").filter(i => {
  const t = w.eval("sprechbar(sprechFrage(" + JSON.stringify({ q: i.q, opts: i.o }) + "))");
  const teile = t.split(/\b[A-E]: /).slice(1).map(x => x.toLowerCase().replace(/[^a-zäöüß0-9]/g, ""));
  return new Set(teile).size !== teile.length;
});
P.ok("Antworten unterwegs hörbar unterscheidbar", !hoerbar.length, hoerbar.map(i => i.id).join(","));

/* ---------- C · Widersprüche ---------- */
P.titel("C · Widersprüche");
const stellen = [];
const zu = (id, t) => { if (t) stellen.push({ id, t: strip(t) }); };
ALL.forEach(i => { zu(i.id, i.e); zu(i.id, i.q); });
RA.forEach(r => zu(r.id, r.b));
CASEREF.forEach(e => { zu("c:" + e.w, e.n); zu("c:" + e.w, e.ex); });
WORDS.forEach(x => { zu("w:" + x.w, x.t); zu("w:" + x.w, x.d); });
SATZ.forEach(x => zu(x.id, x.b));

const HART = /\b(ist falsch|sind falsch|falsch:|nicht korrekt|geht nicht|gibt es nicht)\b/i;
const WEICH = /\b(landschaftlich|regional|süddeutsch|südwestdeutsch|schweizerisch|österreichisch|umgangssprachlich|zulässig|beides|standardsprachlich|gebräuchlich|verbreitet)\b/i;
const H = {}, WCH = {};
stellen.forEach(s => {
  const re = /„([^“]{4,60})“/g;
  let m;
  while ((m = re.exec(s.t))) {
    const z = m[1].toLowerCase().replace(/\s+/g, " ").trim();
    const u = s.t.slice(Math.max(0, m.index - 90), m.index + m[1].length + 90);
    if (HART.test(u)) (H[z] = H[z] || []).push(s.id);
    if (WEICH.test(u)) (WCH[z] = WCH[z] || []).push(s.id);
  }
});
const streit = Object.keys(H).filter(z => WCH[z] &&
  [...new Set(H[z])].join() !== [...new Set(WCH[z])].join());
P.ok("Kein Urteil widerspricht sich (hart vs. relativiert)", !streit.length, streit.join(" · "));

{
  /* Fehlerklasse „die Markierung geht beim Strippen verloren“. In den Regelkörpern trägt
     die Bedeutung nicht der Text, sondern die Klasse: <span class="nope">,</span> zeigt ein
     Komma, das gerade NICHT stehen soll, class="ok" die richtige Form. Wer solchen Text
     durch strip() schickt, macht aus der Falschform eine Empfehlung — „die neue, rote
     Trainingsjacke“ liest sich dann wie ein Vorbild, obwohl die Regel genau das Komma
     durchstreicht. (Mir selbst beim Durchsehen passiert, mit einem Lesewerkzeug, das die
     Klassen wegwarf.)

     In der App geht das heute gut: Regelkörper werden als HTML gerendert, die Klassen
     bleiben; der Suchindex strippt zwar, zeigt den gestrippten Text aber nie an — er dient
     nur dem Treffer. Vorgelesen wird dagegen gestrippt (sprechFrage, und die Erklärung nach
     der Antwort). Deshalb hier die Bedingung, die das hält: Kein Feld, das gesprochen oder
     ohne Markup gezeigt wird, darf eine solche Klasse tragen. */
  const MARKE = /class="(nope|ok)"/;
  const gestrippt = [];
  ALL.forEach(i => {
    if (MARKE.test(String(i.q || ""))) gestrippt.push("Frage " + i.id);
    (i.o || []).forEach(o => { if (MARKE.test(String(o))) gestrippt.push("Option " + i.id); });
    if (MARKE.test(String(i.e || ""))) gestrippt.push("Erklärung " + i.id);
  });
  WORDS.forEach(x => {
    if (MARKE.test(String(x.d || "") + String(x.t || "") + String(x.ex || "")))
      gestrippt.push("Wortkarte " + x.w);
  });
  CASEREF.forEach(e => {
    if (MARKE.test(String(e.n || "") + String(e.ex || ""))) gestrippt.push("Fallkarte " + e.w);
  });
  P.ok("Keine Richtig-/Falsch-Markierung in vorgelesenem Material",
    !gestrippt.length, [...new Set(gestrippt)].join(" · "));
  /* Positivprobe: Der Erkenner muss anschlagen — sonst ist die Zusage leer. */
  P.ok("Der Markierungs-Erkenner schlägt an",
    MARKE.test('die neue<span class="nope">,</span> rote Trainingsjacke'), "Positivprobe blieb stumm");
  /* Und die Regelkörper tragen die Markierungen wirklich — sonst prüft die Bedingung oben
     etwas, das es gar nicht gibt. */
  const mitMarke = RA.filter(r => MARKE.test(String(r.b))).length;
  P.ok("Die Regelkörper tragen die Markierungen (" + mitMarke + " Regeln)", mitMarke >= 40, mitMarke);
}

{
  /* Fehlerklasse „Rangbehauptung ohne Beleg“. Grundsatz 5 warnt vor „immer“, „nie“ und
     „ausschließlich“ — dieselbe Falle stellt der Superlativ: „der häufigste Fehler“, „die
     wichtigste Regel überhaupt“, „die größten Konfliktverstärker der deutschen Sprache“.
     Das sind Häufigkeitsordnungen, für die es keine Quelle gibt, und der Rat wird nicht
     schlechter, wenn stattdessen der Mechanismus dasteht. Gefunden wurden sieben solche
     Stellen — in komma-nebensatz, gram-ndekl, form-kritik samt Übung f26, satz-konjunktiv
     mit der Satzkarte sa12, satz-reden mit sa19, n-abkuerzung und z-auslassung.

     Nicht jede Fundstelle ist ein Fehler: In gross-subst sind „das Beste“ und „die
     meisten“ die Beispielwörter der Regel selbst, und die form-Regeln sind Ratgebertexte,
     in denen „die beste Investition“ ein Rat ist und kein Befund. Deshalb eine gepflegte
     Liste statt eines Verbots: Jede Stelle, die eine Rangformel tragen darf, steht hier
     mit Grund. Eine neue, nicht gelistete Stelle macht den Lauf rot — der Superlativ wird
     damit zur bewussten Entscheidung.

     Geprüft wird die Stelle, nicht die Zahl der Formeln in ihr: Wer in einer gelisteten
     Regel eine zweite Rangformel ergänzt, fällt nicht auf. Das ist der Preis dafür, dass
     eine Umformulierung des Beispiels den Lauf nicht grundlos rot macht. */
  /* Am 21.09.2026 kam die meist-Bildung dazu: Die Wortkarte „scheinbar / anscheinend“ nannte
     sich „das meistverwechselte Paar der deutschen Sprache“ — eine Häufigkeitsordnung ohne
     Quelle, die der Erkenner nicht sah, weil er nur eine feste Liste von Superlativen kannte.
     „die meisten“ bleibt getrennt behandelt; ausgenommen ist es über den Eintrag zu
     gross-subst, wo „das Meiste“ das Beispielwort der Regel ist. */
  const RANG = /(?:^|[^\wäöüßÄÖÜ])(?:der|die|das)\s+(?:häufigste|größte|schlimmste|wichtigste|beste|schwerste|typischste|verbreitetste)[nrs]?(?![\wäöüßÄÖÜ])|(?:^|[^\wäöüßÄÖÜ])(?:der|die|das)\s+meist(?!en(?![\wäöüßÄÖÜ]))[a-zäöüß]+(?![\wäöüßÄÖÜ])|(?:^|[^\wäöüßÄÖÜ])am\s+(?:häufigsten|verbreitetsten|meisten)(?![\wäöüßÄÖÜ])|(?:^|[^\wäöüßÄÖÜ])die\s+meisten(?![\wäöüßÄÖÜ])/i;   /* kein g: .test() waere damit zustandsbehaftet, siehe Kommentar unten */
  /* Am 21.09.2026 kam der artikellose Superlativ dazu: z23 nannte den Satzabbruch
     „Häufigster Stolperstein beim freien Sprechen“ — dieselbe Behauptung wie „der
     häufigste“, nur ohne Artikel davor, und der Erkenner oben sah sie nicht. Diese
     Fassung prüft gross geschrieben und verlangt ein Substantiv dahinter, sonst
     träfe sie Wendungen wie „in häufigster Verwendung“. „Best…“ und „Schwerst…“
     bleiben draussen: „Beste Grüße“ und „Besten Dank“ sind Formeln, keine Befunde. */
  const RANG_OHNE_ARTIKEL = /(?:^|[^\wäöüßÄÖÜ])(?:Häufigst|Größt|Schlimmst|Wichtigst|Verbreitetst|Typischst)(?:er|e|es)\s+[A-ZÄÖÜ][a-zäöüß]/;
  const ERLAUBT = {
    "Regel gross-subst":    "„das Beste“ und „die meisten“ sind dort die Beispielwörter der Regel",
    "Regel gram-konjunktiv": "„die meisten Verben sind schwach“ ist eine Aussage über die Formenbildung, keine Fehlerstatistik",
    "Regel form-anrede":    "Ratgebertext: „Die wichtigste Regel: spiegeln“ ist ein Rat, kein Befund",
    "Regel form-eltern":    "Ratgebertext: „Die beste Investition“ ist ein Rat, kein Befund",
    "Regel n-abkuerzung":   "„raten die meisten Leitfäden“ — Aussage über Leitfäden, mit „raten“ abgeschwächt",
    "Übung g07":            "„die meisten wissen das“ ist der Beispielsatz der Aufgabe",
    "Übung m02":            "„die häufigsten“ meint die häufigsten Präpositionen, kein Fehlerranking",
    "Übung q25":            "Frage nach dem, was Leitfäden raten",
    "Schreibwerkstatt w05.tip":  "„die beste Übung gegen Wortballast“ ist ein Rat zur Übung, kein Befund über Fehler",
    "Schreibwerkstatt sc04.why": "„der wichtigste“ meint den wichtigsten Satz dieser einen Mail, nicht eine Rangordnung",
    "Schreibwerkstatt pr29.good": "„was ist der beste Weg, dich zu erreichen?“ ist wörtliche Rede in einer Musterformulierung",
    "Schreibwerkstatt ph43.tip": "„die beste Investition“ — derselbe Rat wie in form-eltern, dort schon begründet",
    "Schreibwerkstatt pr26.good": "„was dich daran am meisten beschäftigt“ ist wörtliche Rede in einer Musterformulierung, keine Aussage über Sprache",
    "Spickzettel cheat":     "„Das Wichtigste aus dem Trainer auf einen Blick“ ist die Auswahlansage des Spickzettels",
  };
  const rangStellen = new Set();
  const rang = t => { const s = String(t).replace(/<[^>]+>/g, " ");
    return RANG.test(s) || RANG_OHNE_ARTIKEL.test(s); };
  const sammle = (art, id, t) => { if (t && rang(t)) rangStellen.add(art + " " + id); };
  /* Läuft über den gemeinsamen Bestand von oben — keine eigene Sammlung mehr,
     damit hier nie wieder eine Sorte fehlen kann. */
  BESTAND.forEach(x => sammle(x.sorte, x.id, x.t));
  const neu = [...rangStellen].filter(x => !(x in ERLAUBT));
  P.ok("Keine ungelistete Rangbehauptung (" + rangStellen.size + " Stellen, " +
    Object.keys(ERLAUBT).length + " begründet erlaubt)", !neu.length, neu.join(" · "));
  /* Positivprobe: Der Erkenner muss anschlagen, sonst ist die Liste eine leere Zusage. */
  const probe = new Set();
  const sammle2 = (art, id, t) => { if (t && rang(t)) probe.add(art + " " + id); };
  sammle2("Regel", "probe-rang", "<p>Das ist der häufigste Fehler in Alltagstexten.</p>");
  sammle2("Wortkarte", "probe-meist", "<p>Das meistverwechselte Paar der deutschen Sprache.</p>");
  /* Die beiden Fassungen vom 21.09.2026, wörtlich aus z23 und q01. */
  sammle2("Übung", "probe-z23", "<p>Ein <b>Anakoluth</b>. Häufigster Stolperstein beim freien Sprechen.</p>");
  sammle2("Übung", "probe-q01", "<p>Die Zeitungskonvention ist am verbreitetsten.</p>");
  P.ok("Der Rang-Erkenner schlägt bei einer neuen Behauptung an", probe.size === 4, "Positivprobe blieb stumm");
  const leer = new Set();
  const sammle3 = (art, id, t) => { if (t && rang(t)) leer.add(art + " " + id); };
  sammle3("Regel", "probe-ok", "<p>Ein mehrdeutiger Bezug zwingt zum Zurücklesen.</p>");
  /* Gegenprobe zum artikellosen Erkenner: kleingeschrieben ist es keine Behauptung
     über eine Rangordnung, sondern eine gewöhnliche Fügung. */
  sammle3("Regel", "probe-klein", "<p>Das Wort steht in häufigster Verwendung.</p>");
  sammle3("Regel", "probe-gruss", "<p>Beste Grüße und besten Dank für die Rückmeldung.</p>");
  P.ok("… und schweigt bei einem Satz ohne Rangformel", leer.size === 0, "Gegenprobe schlug an");
}

/* Grundsatz 3: Stil ist keine Regel. Die Stilregeln stehen im Regelwerk neben den
   Kommaregeln und sehen genauso aus — wer dort „falsch“ liest, hält eine Empfehlung für
   einen Fehler. Am 15.09.2026 sagte stil-kollokation „Wer sie falsch kombiniert, klingt
   sofort schief“, stil-hedging führte seine Empfehlung als „Regel:“ ein, und
   stil-genitivkette behauptete, ab drei Genitiven verliere der Satz seine Struktur.

   Geprüft wird satzweise: Ein Satz einer stil-Regel darf ein Fehlerwort nur tragen, wenn
   er es verneint („Ein Fehler ist die Kette nicht“) — oder wenn die Regel eine Quelle
   nennt und die Aussage damit belegt ist wie in stil-absolut. Für form-Regeln gilt das
   nicht: Das sind Ratgebertexte über Gespräche und Mails, kein Urteil über Sprache. */
{
  const FEHLERWORT = /(?<![\wäöüßÄÖÜ])(falsch|fehlerhaft|Fehler|unzulässig|verboten)(?![\wäöüßÄÖÜ])/i;
  const VERNEINT = /(?<![\wäöüßÄÖÜ])(kein|keine|keines|keiner|nicht)(?![\wäöüßÄÖÜ])/i;
  const QUELLE = /Duden|DWDS|Regelwerk|Rat für deutsche Rechtschreibung|IDS|Variantengrammatik|grammis|DIN /i;
  const nurText = h => String(h).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const stilUrteil = (b) => {
    const t = nurText(b);
    if (QUELLE.test(t)) return [];
    return t.split(/(?<=[.:;])\s+/).filter(z => FEHLERWORT.test(z) && !VERNEINT.test(z));
  };
  const stilSchief = [];
  RA.filter(r => r.c === "stil").forEach(r =>
    stilUrteil(r.b).forEach(z => stilSchief.push(r.id + ": „" + z.trim().slice(0, 90) + "“")));
  P.ok("Keine Stilregel nennt eine Empfehlung einen Fehler (" +
    RA.filter(r => r.c === "stil").length + " Stilregeln)", !stilSchief.length, stilSchief.join(" · "));
  /* Positivprobe: die alte Fassung von stil-kollokation. */
  P.ok("Der Stil-Erkenner schlägt bei der alten Fassung an",
    stilUrteil("<p>Wörter haben Lieblingspartner. Wer sie falsch kombiniert, klingt sofort schief.</p>").length === 1,
    "Positivprobe blieb stumm");
  /* Zwei Gegenproben: die Verneinung und der Beleg müssen den Satz durchlassen. */
  P.ok("… und lässt eine Verneinung durch",
    !stilUrteil("<p>Ein Fehler ist die Kette nicht — sie kostet Lesbarkeit.</p>").length,
    "Gegenprobe schlug an");
  P.ok("… und einen belegten Befund",
    !stilUrteil("<p>Gesteigert sind sie standardsprachlich falsch. Quelle: Duden.</p>").length,
    "Gegenprobe schlug an");
}

/* Grundsatz 5 für die andere Wortfamilie: „immer“, „nie“, „ausschließlich“. Die
   Rangbehauptungsprüfung darüber fängt Superlative; diese hier fängt die Absolutwörter in
   den Grammatik- und Satzregeln — dort, wo eine verschwiegene Ausnahme Nils eine falsche
   Form beibringt. Am 15.09.2026 sagte sa07 „Vor diesen Elementen steht ‚nicht‘ immer“,
   obwohl das vorangestellte Element es hinten stehen lässt („Nach Köln fahre ich nicht“);
   sa04 nannte den nachgestellten Nebensatz „immer leichter zu bauen“ und sa19 versprach,
   wer mit einem Hauptsatz beginne, könne ihn „immer beenden“.

   Abgeschwächte Formen („fast immer“), feste Fügungen („immer wenn“, „wann immer“,
   „immer noch“) und die Satzkarten, die denselben Text tragen, zählen nicht als Fund —
   letztere aber doch, weil sie eigene Stellen sind: Wer nur die Regel ändert und die
   Karte vergisst, soll auffallen. Wie bei den Rangformeln eine gepflegte Liste statt
   eines Verbots: Jede Stelle, die ein Absolutwort tragen darf, steht hier mit Grund. */
{
  const ABSOLUT = /(?<![\wäöüßÄÖÜ])(immer|nie|niemals|ausschließlich|stets|ohne Ausnahme|in jedem Fall)(?![\wäöüßÄÖÜ])/gi;
  const WEICH = /(fast|nicht|meist|so gut wie|beinahe|nahezu|wann)\s+$/i;
  const FEST = /^(immer\s+wenn|immer\s+noch)/i;
  const ABS_ERLAUBT = {
    "Regel gram-kasus":  "„über beim Thema immer Akkusativ“ und „vor bei der Zeit immer Dativ“ — feste Rektion, keine Ausnahme bekannt",
    "Regel gram-wechsel": "dieselbe Aussage über Themen mit „über“",
    "Satzkarte sa16":     "Satzkarte zu gram-wechsel, trägt denselben Satz",
    "Regel satz-klammer": "„Nie trennbar: be-, ge-, er-, ver-, zer-, ent-, emp-, miss-“ — diese Vorsilben trennen sich nicht ab; der Sonderfall miss- steht im Satz danach",
    "Satzkarte sa08":     "Satzkarte zu satz-klammer, trägt denselben Satz",
  };
  const nurText = h => String(h).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const absStellen = new Set();
  const absSammle = (art, id, b) => {
    const t = nurText(b);
    [...t.matchAll(ABSOLUT)].forEach(m => {
      if (WEICH.test(t.slice(Math.max(0, m.index - 20), m.index))) return;
      if (FEST.test(t.slice(m.index, m.index + 30))) return;
      absStellen.add(art + " " + id);
    });
  };
  RA.filter(r => r.c === "gram" || r.c === "satz").forEach(r => absSammle("Regel", r.id, r.b));
  SATZ.forEach(x => absSammle("Satzkarte", x.id, x.b));
  const absNeu = [...absStellen].filter(x => !(x in ABS_ERLAUBT));
  P.ok("Kein ungelistetes Absolutwort in Grammatik- und Satzregeln (" + absStellen.size +
    " Stellen, " + Object.keys(ABS_ERLAUBT).length + " begründet erlaubt)", !absNeu.length, absNeu.join(" · "));
  /* Positivprobe an der alten Fassung von sa07, Gegenproben an Abschwächung und fester Fügung. */
  const probeAbs = (b) => { const v = new Set();
    const t = nurText(b);
    [...t.matchAll(ABSOLUT)].forEach(m => {
      if (WEICH.test(t.slice(Math.max(0, m.index - 20), m.index))) return;
      if (FEST.test(t.slice(m.index, m.index + 30))) return;
      v.add(1); });
    return v.size; };
  P.ok("Der Absolut-Erkenner schlägt bei der alten Fassung an",
    probeAbs("<p><b>Vor diesen Elementen steht „nicht“ immer:</b></p>") === 1, "Positivprobe blieb stumm");
  P.ok("… und schweigt bei „fast immer“ und „immer wenn“",
    probeAbs("<p>Die Vorsilbe be- macht fast immer ein Akkusativverb. Immer wenn ich Zeit habe, gehe ich schwimmen.</p>") === 0,
    "Gegenprobe schlug an");
  const absTot = Object.keys(ABS_ERLAUBT).filter(x => !absStellen.has(x));
  P.ok("Keine tote Ausnahme in der Absolutliste", !absTot.length, absTot.join(", "));
}

/* Dieselbe Falle, eine Stufe subtiler: Eine Regel zählt ihre Ausnahmen. „mit einer Ausnahme",
   „und nur diese", „genau einmal" sind Absolutaussagen, die der Wortwächter oben nicht sieht,
   weil sie ohne „immer" und „nie" auskommen. Und eine gezählte Ausnahme ist genau die Sorte
   Behauptung, die beim naechsten Fund falsch wird.

   Am 16.09.2026 kostete das drei Stellen:
   - sa02 sagte „mit einer Ausnahme" (doppelter Infinitiv) und übersah den irrealen Vergleich
     mit bloßem „als": „Er tut, als wäre er der Trainer" — das Verb steht dort direkt hinter
     der Konjunktion, nicht am Ende.
   - sa04 sagte „Eine Ausnahme, und nur diese" (Korrelat dann/so) und übersah „je … desto",
     wo desto plus Komparativ die Position 1 füllen. Die App fuehrte genau diesen Satz in k08.
   - sa13 sagte, das Kasussignal müsse „genau einmal" vorkommen. Bei mehreren Adjektiven ohne
     Artikel steht es zweimal: „bei gutem, warmem Wetter".

   Keine Ausnahmenliste hier: Wer künftig eine Ausnahme zaehlt, soll das begründen müssen —
   und die einfachste Begründung ist, sie nicht zu zaehlen, sondern den Mechanismus zu nennen. */
{
  /* Am 21.09.2026 kam das Zahlwort dazu. Der Erkenner kannte nur ausgeschriebene
     Formeln und sah deshalb sieben Stellen nicht, die genauso zählen: „gehört zu den
     drei Ausnahmen“ (r17), „Merk dir die drei als Ausnahmen“ (recht-wider), dazu fünf
     Überschriften „Zwei Ausnahmen“. Bei zwei davon stimmte die Zahl schon nicht mehr —
     gross-subst und sa04 nennen hinter der Zählung noch einen weiteren Fall, sa04 seit
     je … desto dazukam. Das Zwischenwort in (?:[\wäöüßÄÖÜ]+\s+)? fängt „die drei als Ausnahmen“.
     „eine Ausnahme“ allein bleibt draussen: „Eine Ausnahme ist X“ führt eine ein,
     statt den Vorrat zu beziffern. */
  const GEZAEHLT = /(?<![\wäöüßÄÖÜ])(und nur diese|mit (?:einer|genau einer) Ausnahme|(?:die )?einzige Ausnahme|genau einmal|nur eine Ausnahme|nur diese eine|(?:zwei|drei|vier|fünf|sechs|sieben|beiden)\s+(?:[\wäöüßÄÖÜ]+\s+)?Ausnahmen)/gi;
  const ohneTags = h => String(h).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const zaehlStellen = new Set();
  const zaehlSammle = (art, id, b) => {
    if (GEZAEHLT.test(ohneTags(b))) zaehlStellen.add(art + " " + id);
    GEZAEHLT.lastIndex = 0;
  };
  /* Auch dieser Wächter las nur zwei Sorten. Eine gezählte Ausnahme kann überall stehen,
     wo die App erklärt. Er läuft jetzt über denselben gemeinsamen Bestand. */
  BESTAND.forEach(x => zaehlSammle(x.sorte, x.id, x.t));
  /* Was zählen darf, steht hier mit Grund. */
  const ZAEHL_ERLAUBT = {
    "Übung p22": "„Einzige Ausnahme sind Laden- und Firmennamen“ — die Zählung gilt dem Genitiv-s, und dort stimmt sie; der Apostroph vor -sch ist keine Genitivform",
  };
  const zaehlNeu = [...zaehlStellen].filter(x => !(x in ZAEHL_ERLAUBT));
  P.ok("Keine ungelistete gezählte Ausnahme (" + zaehlStellen.size + " Stellen, " +
    Object.keys(ZAEHL_ERLAUBT).length + " begründet erlaubt)", !zaehlNeu.length, zaehlNeu.join(" · "));
  const zaehlTot = Object.keys(ZAEHL_ERLAUBT).filter(x => !zaehlStellen.has(x));
  P.ok("Keine tote Ausnahme in der Zählliste", !zaehlTot.length, zaehlTot.join(", "));
  /* Drei Positivproben: die Fassungen vom 16.09.2026, jede einzeln. */
  const zaehlProbe = (t) => { const r = GEZAEHLT.test(ohneTags(t)); GEZAEHLT.lastIndex = 0; return r; };
  P.ok("Der Zähl-Erkenner schlägt bei allen drei alten Fassungen an",
    zaehlProbe("<p>… steht das gebeugte Verb <b>ganz am Schluss</b> — mit einer Ausnahme: Beim doppelten Infinitiv …</p>") &&
    zaehlProbe("<p><b>Eine Ausnahme, und nur diese:</b> Steht im Hauptsatz ein Korrelat …</p>") &&
    zaehlProbe("<p>Das <b>Kasussignal</b> muss <b>genau einmal</b> im Ausdruck vorkommen …</p>"),
    "Positivprobe blieb stumm");
  /* Und bei den Fassungen mit Zahlwort vom 21.09.2026, mit und ohne Zwischenwort. */
  P.ok("… und beim Zahlwort vor der Ausnahme",
    zaehlProbe("<p>„widerspiegeln“ gehört zu den drei Ausnahmen, in denen „wider“ „zurück“ heißt.</p>") &&
    zaehlProbe("<p>… trotzdem ohne e. Merk dir die drei als Ausnahmen.</p>") &&
    zaehlProbe("<p><b>Zwei Ausnahmen:</b> am + Superlativ bleibt klein …</p>"),
    "Positivprobe blieb stumm");
  /* Gegenprobe: eine einzelne eingeführte Ausnahme beziffert den Vorrat nicht. */
  P.ok("… und schweigt bei der eingeführten einzelnen Ausnahme",
    !zaehlProbe("<p>Eine Ausnahme ist der doppelte Infinitiv: Dort rückt das Verb davor.</p>"),
    "Gegenprobe schlug an");
  /* Gegenprobe: ein hinweisendes „nur diese" ist keine gezählte Ausnahme. So steht es in
     komma-adjektive („nur diese Auflage ist überarbeitet") — ohne diese Trennung wäre die
     Prüfung dort grundlos rot. */
  P.ok("… und schweigt beim hinweisenden „nur diese“",
    !zaehlProbe("<p>„die 6., vollständig überarbeitete Auflage“ (nur diese Auflage ist überarbeitet; Duden)</p>"),
    "Gegenprobe schlug an");
}

/* ---------- D · Textcheck ---------- */
P.titel("D · Textcheck");
const muster = daten(w, "CHECKS_ALL.map(c=>({id:c.id,re:String(c.re),sev:c.sev,r:c.r||null}))");
const kaputt = muster.filter(c => /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(c.re));
P.ok("Prüfmuster ohne Steuerzeichen (" + muster.length + ")", !kaputt.length, kaputt.map(c => c.id).join(","));

const stumm = daten(w, 'CHECKS_ALL.filter(c=>{try{return "Probe".match(c.re)===undefined}catch(e){return true}}).map(c=>c.id)');
P.ok("Alle Prüfmuster ausführbar", !stumm.length, stumm.join(","));

/* Fehlerklasse „tote Alternative“: \b ist in JavaScript an [A-Za-z0-9_] gebunden —
   ä, ö, ü und ß zählen dort nicht als Wortzeichen. Steht \b direkt vor „älter“ oder
   direkt hinter einem Wort auf „ß“, ist die Grenze nie erfüllt: die Alternative kann
   nicht mehr treffen, ohne dass die Syntax bricht oder ein Lauf rot wird. Genau so
   waren „älter“ und „öfter“ in x04, „äusserst“ in x26 und „über“ in a08 stumm. */
function altsNachGrenze(src, i) {
  let j = i;
  if (src[j] !== "(") return null;
  j++;
  if (src.startsWith("?:", j)) j += 2;
  else if (src.startsWith("?<", j) || src.startsWith("?=", j) || src.startsWith("?!", j)) return null;
  let tiefe = 1, klasse = false, teil = "";
  const alts = [];
  for (; j < src.length; j++) {
    const ch = src[j];
    if (src[j - 1] === "\\") { teil += ch; continue; }
    if (klasse) { teil += ch; if (ch === "]") klasse = false; continue; }
    if (ch === "[") { klasse = true; teil += ch; continue; }
    if (ch === "(") { tiefe++; teil += ch; continue; }
    if (ch === ")") { tiefe--; if (!tiefe) { alts.push(teil); break; } teil += ch; continue; }
    if (ch === "|" && tiefe === 1) { alts.push(teil); teil = ""; continue; }
    teil += ch;
  }
  return alts;
}
const NICHTASCII = /[^\x00-\x7F]/;
const toteGrenzen = c => {
  const src = c.re, raus = [];
  for (let i = 0; i + 1 < src.length; i++) {
    if (src[i] !== "\\" || src[i + 1] !== "b") continue;
    if (i > 0 && src[i - 1] === "\\") continue;
    const nach = src.slice(i + 2);
    if (NICHTASCII.test(nach[0] || "")) raus.push("vor „" + nach.slice(0, 12) + "“");
    (altsNachGrenze(src, i + 2) || []).forEach(a => {
      if (NICHTASCII.test(a[0] || "")) raus.push("vor Alternative „" + a.slice(0, 14) + "“");
    });
    if (NICHTASCII.test(src.slice(0, i).slice(-1))) raus.push("hinter „" + src.slice(0, i).slice(-12) + "“");
  }
  return raus;
};
/* Positivprobe und Gegenprobe: der Erkenner muss anschlagen und darf sich beruhigen lassen. */
P.ok("Der Grenzen-Erkenner findet ein bekanntes totes Muster",
  toteGrenzen({ re: String(/\b(alt|älter)\s+wie\b/g) }).length > 0, "Positivprobe blieb stumm");
P.ok("… und meldet das reparierte Muster nicht mehr",
  toteGrenzen({ re: String(/(?<![\wäöüß])(alt|älter)\s+wie\b/g) }).length === 0, "Gegenprobe schlug an");
const stumpf = [];
muster.forEach(c => toteGrenzen(c).forEach(x => stumpf.push(c.id + ": \\b " + x)));
P.ok("Kein \\b vor oder hinter Umlaut und ß (tote Alternative)", !stumpf.length, stumpf.join(" · "));

{
  /* Die Gegenrichtung derselben \b-Falle, und die teurere: Nicht die Alternative wird
     stumm, sondern sie springt mitten in einem Wort an. \b liegt in JavaScript zwischen
     jedem Nicht-Wortzeichen und einem Wortzeichen — ä, ö, ü und ß gehören nicht dazu.
     „Brüder“ endet deshalb für JavaScript auf einer eigenen Wortgrenze plus „der“.
     y05 (/\b(der|die|das|den|dem)\s+(gleiche|…)/) meldete darum „Alle Brüder gleiche
     Chancen“ als Zweifelsfall, x23 meldete „Grüße aus dem Süden Herr Meier war auch da“
     als harten Fehler in der n-Deklination. analyse() dehnt den Treffer anschließend auf
     ganze Wörter — angestrichen wird also „Süden Herr“, und die Meldung liest sich, als
     hätte Nils etwas falsch gemacht.

     Gesucht wird die Paarung selbst: eine mit \b verankerte Alternative aus reinen
     ASCII-Buchstaben, und ein Wort aus dem eigenen Bestand der App, das genau darauf
     endet und davor einen Umlaut oder ein ß trägt. Gefunden hat das x23, f12, a05 und
     a10; alle vier tragen jetzt (?<![\wäöüßÄÖÜ]) statt \b. Der Bestand der App ist als
     Wortliste bewusst schmal — er fängt, was Nils hier liest, nicht jedes deutsche Wort. */
  const woerter = new Set();
  daten(w, `(function(){
    const strip = h => String(h).replace(/<[^>]+>/g," ").replace(/&[a-z]+;/g," ").replace(/\s+/g," ").trim();
    const t = [];
    ALL.forEach(i => { (i.o||[]).forEach(o=>t.push(strip(o))); if(i.q) t.push(strip(i.q)); if(i.e) t.push(strip(i.e)); });
    RULES_ALL.concat(SATZ).concat(TABLES).forEach(r => t.push(strip(r.b)));
    WORDS.forEach(x => { t.push(x.ex); t.push(x.d); t.push(x.w); });
    CASEREF.forEach(e => t.push(e.ex));
    KORREKTUR.forEach(k => t.push(k.txt));
    t.push(strip(cheatHTML()));
    return t.filter(Boolean).map(String);
  })()`).forEach(t => (String(t).match(/[A-Za-zÄÖÜäöüß]{3,}/g) || []).forEach(x => woerter.add(x)));
  const UML = /[ÄÖÜäöüß]/;
  const mitUmlaut = [...woerter].filter(x => UML.test(x));

  const steckenBleibt = c => {
    const src = c.re.slice(1, c.re.lastIndexOf("/"));
    if (!src.startsWith("\\b")) return [];
    const egal = /i/.test(c.re.slice(c.re.lastIndexOf("/") + 1));
    let anfaenge = altsNachGrenze(src, 2);
    if (!anfaenge) { const m = src.slice(2).match(/^[A-Za-z]+/); anfaenge = m ? [m[0]] : []; }
    const raus = [];
    anfaenge.forEach(a => {
      /* Nur vollständige Alternativen aus ASCII-Buchstaben. Wer „ständig“ auf „st“ kürzt,
         prüft einen Wortanfang, den das Muster gar nicht kennt. */
      if (!/^[A-Za-z]{2,}$/.test(a)) return;
      mitUmlaut.forEach(wo => {
        if (wo.length <= a.length) return;
        const ende = wo.slice(-a.length);
        if (egal ? ende.toLowerCase() !== a.toLowerCase() : ende !== a) return;
        if (!UML.test(wo[wo.length - a.length - 1])) return;
        raus.push(c.id + ": „" + a + "“ steckt am Ende von „" + wo + "“");
      });
    });
    return raus;
  };
  /* Positiv- und Gegenprobe an dem Muster, das die Klasse ans Licht gebracht hat. */
  P.ok("Der Wortmitte-Erkenner findet die alte Fassung von y05",
    steckenBleibt({ id: "y05", re: String(/\b(der|die|das|den|dem)\s+(gleiche|gleichen)\b/g) }).length > 0,
    "Positivprobe blieb stumm");
  P.ok("… und meldet die reparierte Fassung nicht mehr",
    steckenBleibt({ id: "y05", re: String(/(?<![\wäöüßÄÖÜ])(der|die|das|den|dem)\s+(gleiche|gleichen)\b/g) }).length === 0,
    "Gegenprobe schlug an");
  const mitten = [];
  muster.forEach(c => steckenBleibt(c).forEach(x => mitten.push(x)));
  P.ok("Kein \\b lässt ein Muster mitten in einem Wort anspringen (" + mitUmlaut.length +
    " Wörter mit Umlaut geprüft)", !mitten.length, [...new Set(mitten)].join(" · "));
}

/* Der eigene korrekte Bestand darf keine harten Meldungen auslösen.
   Fehlerklasse „zitierte Falschform“: Manche richtigen Antworten benennen eine falsche
   Form, statt selbst eine korrekte zu sein („Ich rufe dir an“ statt „dich“). Steht im
   Eintrag ein Kontrastwort, zählt nur der Text außerhalb der Anführungszeichen als
   korrektes Material. Zitate ohne Kontrastwort (Musterformulierungen, wörtliche Rede)
   bleiben vollständig in der Prüfung. */
const KONTRAST = /\b(statt|falsch)\b/i;
const ohneZitat = t => KONTRAST.test(t)
  ? t.replace(/„[^“]*“/g, " ").replace(/\s+/g, " ").trim()
  : t;

const korpus = [];
ALL.forEach(i => { if (i.t !== "fill") korpus.push(strip(i.o[i.a])); });
CASEREF.forEach(e => korpus.push(e.ex));
WORDS.forEach(x => korpus.push(x.ex));
const fehlalarm = [];
let gekuerzt = 0;
korpus.forEach(roh => {
  const t = ohneZitat(String(roh || ""));
  if (t !== roh) gekuerzt++;
  if (!t || t.length < 6) return;
  const treffer = daten(w, 'analyse(' + JSON.stringify(t) + ').finds.filter(f=>f.c.sev==="hart").map(f=>f.c.id)');
  if (treffer.length) fehlalarm.push(treffer.join("/") + " bei „" + t.slice(0, 50) + "“");
});
P.ok("Keine harte Meldung auf korrektem Material", !fehlalarm.length,
  fehlalarm.slice(0, 5).join(" · ") + (fehlalarm.length > 5 ? " …(" + fehlalarm.length + ")" : ""));
if (gekuerzt) P.info(gekuerzt + " Einträge zitieren eine Falschform — dort nur der Text außerhalb der Zitate geprüft");

/* Fehlerklasse „hartes Muster gegen die eigene Regel“: Ein hartes Prüfmuster meldete
   Schreibungen als Fehler, die die App in ihren Regeltexten selbst als richtig zeigt
   (x16, x17, x18, x19, x26 taten das). Die Beispiele der Regeln sind der zweite
   korrekte Bestand neben den Antworten — hier werden sie mitgeprüft.
   Nicht geprüft wird, was als Gegenbeispiel dasteht: Inhalte von class="nope" und
   Zeilen mit Pfeil, „nicht“, „statt“ oder „falsch“ zeigen absichtlich die Falschform. */
const RB = daten(w, "RULES_ALL.map(r=>({id:r.id,b:r.b}))")
  .concat(daten(w, "SATZ.map(x=>({id:x.id,b:x.b}))"))
  .concat(daten(w, "TABLES.map(x=>({id:x.id,b:x.b}))"));
const ohneNope = h => String(h).replace(/<(span|div) class="nope">[\s\S]*?<\/\1>/g, " ");
/* Gegenbeispiel-Marker: der Pfeil, und „nicht/statt/falsch“ nur dort, wo sie als
   Kontrastformel stehen — in Klammern, in Anführungszeichen, mit Doppelpunkt oder direkt
   vor der zitierten Falschform („… · nicht „in 1995““, die Schreibweise des Spickzettels).
   Ein schlichtes „nicht“ im Satz („Du brauchst nicht zu kommen“) ist eine normale
   Verneinung; wer danach ausschließt, verliert 49 korrekte Beispiele stillschweigend.
   Die vierte Form kostet nachgemessen null Regelbeispiele. */
const GEGEN = /→|[(„]\s*(?:nicht|statt|falsch)\b|\b(?:nicht|statt|falsch):|\b(?:nicht|statt|falsch)\s+„/i;
const proben = [];
RB.forEach(r => {
  const re = /<(span|div) class="(ok|ex)">([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(ohneNope(r.b)))) {
    strip(String(m[3]).replace(/<br\s*\/?>/g, " · ")).split(/\s·\s|\s\|\s/).forEach(t => {
      t = t.trim();
      if (t.length >= 8 && !GEGEN.test(t)) proben.push({ id: r.id, t });
    });
  }
});
/* Positivprobe: Der Weg Beispiel → analyse() → harte Meldung muss überhaupt anschlagen,
   sonst misst die Prüfung nichts (siehe CLAUDE.md, Abschnitt 6). */
const probeAn = daten(w, 'analyse("Das ist ein Standart im Verein.").finds.filter(f=>f.c.sev==="hart").length');
P.ok("Die Beispielprüfung schlägt bei einem echten Fehler an", probeAn > 0, "Positivprobe blieb stumm");
P.ok("Genug Beispiele in den Regeln gefunden (" + proben.length + ")", proben.length >= 450, proben.length);
const regelAlarm = [];
const regelFrage = [];
proben.forEach(pr => {
  const f = daten(w, 'analyse(' + JSON.stringify(pr.t) + ').finds.map(f=>({id:f.c.id,sev:f.c.sev,r:f.c.r||null}))');
  const hart = f.filter(x => x.sev === "hart").map(x => x.id);
  if (hart.length) regelAlarm.push(hart.join("/") + " in " + pr.id + ": „" + pr.t.slice(0, 50) + "“");
  /* Ein Muster der Stufe „prüfen“ darf auf dem Beispiel der Regel stehen, zu der es
     selbst gehört: y05 fragt „derselbe oder der gleiche?“ und trifft damit das Beispiel
     von gram-derselbe — genau das ist der Zweck. Trifft es ein Beispiel einer anderen
     Regel, meldet der Textcheck einen Zweifel an Text, den die App als richtig zeigt. */
  f.filter(x => x.sev === "pruef" && x.r !== pr.id).forEach(x =>
    regelFrage.push(x.id + " in " + pr.id + ": „" + pr.t.slice(0, 50) + "“"));
});
P.ok("Keine harte Meldung auf den Beispielen der Regeln", !regelAlarm.length,
  regelAlarm.slice(0, 5).join(" · ") + (regelAlarm.length > 5 ? " …(" + regelAlarm.length + ")" : ""));
P.ok("Kein fremder Prüfhinweis auf den Beispielen der Regeln", !regelFrage.length,
  regelFrage.slice(0, 5).join(" · ") + (regelFrage.length > 5 ? " …(" + regelFrage.length + ")" : ""));
/* Positivprobe: Der Weg muss auch auf Stufe „prüfen“ etwas finden können, sonst ist die
   Prüfung eine leere Zusicherung. Dasselbe Beispiel, einer fremden Regel zugeschrieben. */
const frageProbe = daten(w, 'analyse("Wir tragen die gleichen Schuhe heute.").finds.filter(f=>f.c.sev==="pruef"&&f.c.r!=="komma-aufzaehlung").length');
P.ok("Die Prüfhinweis-Prüfung schlägt bei fremder Regel an", frageProbe > 0, "Positivprobe blieb stumm");

/* Dritter korrekter Bestand: die Musterformulierungen der Schreibwerkstatt (PHRASES,
   PAIRS.good) und die Fehlersuchtexte in ihrer korrigierten Fassung. Nils soll die
   Bausteine abschreiben — ein hartes Muster darf sie nicht anstreichen.
   Bei den Fehlersuchtexten wird nur eingesetzt, was der Text auch wirklich ersetzt:
   Texte mit einer mehrteiligen Ersetzung (dem → des Zeitplans) oder einer Anweisung
   statt einer Form ((Beobachtung statt Etikett)) bleiben außen vor. */
const PHRASES = daten(w, "PHRASES");
const PAIRS = daten(w, "PAIRS");
const vorlagen = [];
/* Teilmenge „Vorbildtexte“: Text, den Nils abschreiben oder nachbauen soll. Er wird
   unten zusätzlich auf der Stufe „prüfen“ geprüft — siehe Begründung dort. */
const vorbild = [];
const beide = x => { vorlagen.push(x); vorbild.push(x); };
PHRASES.forEach(ph => Object.keys(ph.lv || {}).forEach(stufe =>
  (ph.lv[stufe] || []).forEach(t => beide({ id: "ph:" + ph.id, t: strip(t) }))));
PAIRS.forEach(pr => beide({ id: "pr:" + pr.id, t: strip(pr.good) }));
/* Bis zum 21.09.2026 fehlten hier ausgerechnet die Mustertexte — geprüft wurden der
   Szenariotext und die Aufgabenstellung, nicht aber das, was Nils abschreibt: die
   Musterantwort eines Schreibauftrags, die Musterformulierung einer Situation und ihre
   Kurzfassung, dazu die Begründungen und Merksätze. 129 Proben, alle sauber; die Lücke
   in der Absicherung war es trotzdem. Zwei Fehlalarme von y08 kamen dabei ans Licht
   („genauso wenig wie“, „wenn ich nichts habe“) und sind im Muster behoben. */
daten(w, "PROMPTS").forEach(pr => {
  if (pr.model) beide({ id: "w:" + pr.id + " (Musterantwort)", t: strip(pr.model) });
  if (pr.tip) beide({ id: "w:" + pr.id + " (Merksatz)", t: strip(pr.tip) });
});
daten(w, "SCENES").forEach(sc => {
  if (sc.model) beide({ id: "sc:" + sc.id + " (Muster)", t: strip(sc.model) });
  if (sc.alt) beide({ id: "sc:" + sc.id + " (Kurzfassung)", t: strip(sc.alt) });
  if (sc.why) beide({ id: "sc:" + sc.id + " (Begründung)", t: strip(sc.why) });
});
PAIRS.forEach(pr => { if (pr.note) beide({ id: "pr:" + pr.id + " (Merksatz)", t: strip(pr.note) }); });
PHRASES.forEach(ph => { if (ph.tip) beide({ id: "ph:" + ph.id + " (Merksatz)", t: strip(ph.tip) }); });
/* Auch der eigene Fließtext der App: die Situationen der Schreibwerkstatt, die
   Schreibaufträge und die Erläuterungen der Wortkarten sind Text, den Nils als
   korrektes Deutsch vorgesetzt bekommt. */
daten(w, "SCENES").forEach(sc => { if (sc.s) beide({ id: "sc:" + sc.id, t: strip(sc.s) }); });
daten(w, "PROMPTS").forEach(pr => { if (pr.p) beide({ id: "w:" + pr.id, t: strip(pr.p) }); });
/* Die Erläuterung einer Wortkarte beschreibt das Wort, statt es zu verwenden: „scheinbar
   = nur dem Schein nach“. Ein Muster der Stufe „prüfen“ trifft dort zu Recht — sie bleibt
   deshalb bei der harten Prüfung und zählt nicht zu den Vorbildtexten. */
WORDS.forEach(x => { if (x.d) vorlagen.push({ id: "w:" + x.w + " (Erläuterung)", t: strip(x.d) }); });
/* Fehlerklasse „Prüfkorpus ist in Wahrheit leer“: Vorher wurde ein Fehlersuchtext ganz
   verworfen, sobald EINE seiner Markierungen mehrteilig ersetzt („dem“ → „des Zeitplans“)
   oder gar eine Anweisung statt einer Form ist („(Beobachtung statt Etikett)“). Das trifft
   auf alle zwölf zu — der dritte korrekte Bestand trug also null Texte bei, während
   CLAUDE.md ihn aufzählte. Jetzt wird satzweise gerettet: einteilige Korrekturen einsetzen,
   dann nur die Sätze behalten, in denen keine unersetzte Markierung mehr steht. Das sind
   55 Sätze mit gut 600 Wörtern zusammenhängender, richtiger Prosa. */
let korrOffen = 0, korrSaetze = 0;
KORREKTUR.forEach(t => {
  const toks = String(t.txt).split(/\s+/);
  const offen = new Set();
  t.errs.forEach(e => {
    const nth = e.nth || 1;
    let c = 0, idx = -1;
    for (let i = 0; i < toks.length; i++) if (toks[i] === e.w && ++c === nth) { idx = i; break; }
    if (idx < 0) return;
    if (/\s/.test(String(e.ok))) offen.add(idx);
    else toks[idx] = e.ok;
  });
  korrOffen += offen.size;
  let start = 0;
  toks.forEach((tk, i) => {
    if (!/[.!?]["\u201c\u00bb]?$/.test(tk) && i !== toks.length - 1) return;
    const satz = toks.slice(start, i + 1).join(" ");
    const belastet = [...offen].some(o => o >= start && o <= i);
    if (!belastet && satz.split(" ").length >= 4) {
      beide({ id: t.id + " korrigiert", t: satz });
      korrSaetze++;
    }
    start = i + 1;
  });
});
P.ok("Genug Musterformulierungen gefunden (" + vorlagen.length + ")", vorlagen.length >= 430, vorlagen.length);
const vorbildSet = new Set(vorbild);
const vorlagenAlarm = [];
const vorbildFrage = [];
vorlagen.forEach(m => {
  if (m.t.length < 8) return;
  const f = daten(w, 'analyse(' + JSON.stringify(m.t) + ').finds.map(f=>({id:f.c.id,sev:f.c.sev}))');
  const hart = f.filter(x => x.sev === "hart").map(x => x.id);
  if (hart.length) vorlagenAlarm.push(hart.join("/") + " in " + m.id + ": „" + m.t.slice(0, 50) + "“");
  if (!vorbildSet.has(m)) return;
  const frag = f.filter(x => x.sev === "pruef").map(x => x.id);
  if (frag.length) vorbildFrage.push(frag.join("/") + " in " + m.id + ": „" + m.t.slice(0, 50) + "“");
});
P.ok("Keine harte Meldung auf den Musterformulierungen", !vorlagenAlarm.length,
  vorlagenAlarm.slice(0, 5).join(" · ") + (vorlagenAlarm.length > 5 ? " …(" + vorlagenAlarm.length + ")" : ""));
/* Fehlerklasse „Prüfhinweis auf dem eigenen Vorbildtext“: Ein Muster der Stufe „prüfen“
   behauptet keinen Fehler, es stellt eine Frage („Komma nötig?“, „scheinbar oder
   anscheinend?“). Auf einem Baustein, den Nils wörtlich übernehmen soll, ist die Frage
   trotzdem falsch — er schreibt ab, was die App vorgibt, und bekommt dafür einen Zweifel
   angezeigt. Die Vorbildtexte sind damit zugleich das Netz gegen zu weit gefasste neue
   Kommamuster: y01, y13 und y14 laufen hier über gut 300 korrekte Sätze. */
P.ok("Kein Prüfhinweis auf den Vorbildtexten (" + vorbild.length + ")", !vorbildFrage.length,
  vorbildFrage.slice(0, 5).join(" · ") + (vorbildFrage.length > 5 ? " …(" + vorbildFrage.length + ")" : ""));
const vorbildProbe = daten(w, 'analyse("Er war scheinbar schon vor uns da.").finds.filter(f=>f.c.sev==="pruef").length');
P.ok("Die Vorbildprüfung schlägt bei einem Prüfhinweis an", vorbildProbe > 0, "Positivprobe blieb stumm");

/* Vierter korrekter Bestand: der Spickzettel. CLAUDE.md nennt ihn selbst als Risiko — er
   „wiederholt Teile des Bestands teils handgeschrieben“ —, und bis hierher fasste ihn kein
   Prüflauf an: 2300 Wörter, die Nils ausdruckt und danebenlegt. Geprüft werden die Zellen
   und Absätze der Abschnitte, die eine Norm aufstellen. Ausgenommen sind „Die Klassiker“
   und „Was beim Sprechen wirklich auffällt“: Dort stehen die Falschformen absichtlich, und
   zwar ohne Kontrastformel („doppeltes Perfekt („gemacht gehabt“)“). Ausgenommen ist
   außerdem jedes Stück mit Pfeil oder Kontrastwort, wie bei den Regelbeispielen. */
{
  /* Der Pfeil zählt hier NICHT als Gegenbeispiel-Marke. Im Regeltext heißt „→“ „falsch →
     richtig“, im Spickzettel dagegen „X ergibt Y“: „Kurzer Vokal → ss“, „wohin? →
     Akkusativ“, „legen, stellen, setzen, hängen → Akkusativ“. Alle zehn Pfeilstellen sind
     Zuordnungen. Mit GEGEN wären zehn Zellen stillschweigend übersprungen worden, darunter
     die ss/ß-Zelle — die Gegenprobe blieb genau deshalb erst stumm. */
  const GEGEN_SPICK = /[(„]\s*(?:nicht|statt|falsch)\b|\b(?:nicht|statt|falsch):|\b(?:nicht|statt|falsch)\s+„/i;
  const spick = String(daten(w, "cheatHTML()"));
  const spickSek = [...spick.matchAll(/<section[^>]*>([\s\S]*?)<\/section>/g)].map(m => m[1]);
  const spickStuecke = [];
  spickSek.forEach(sek => {
    const titel = strip((sek.match(/<h2>([\s\S]*?)<\/h2>/) || [, ""])[1]);
    if (/Klassiker|beim Sprechen/i.test(titel)) return;
    [...sek.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>|<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/g)].forEach(m => {
      const t = strip(m[1] || m[2] || "");
      if (t.length >= 10 && !GEGEN_SPICK.test(t)) spickStuecke.push({ titel, t });
    });
  });
  P.ok("Genug Spickzettel-Stücke gefunden (" + spickStuecke.length + ")", spickStuecke.length >= 120,
    spickStuecke.length);
  /* Und sie müssen aus dem ganzen Blatt kommen, nicht aus einer Ecke: Fiele die Zerlegung
     auf einen Abschnitt zurück, bliebe die Zahl oben hoch und die Prüfung trotzdem blind. */
  const spickAbschnitte = new Set(spickStuecke.map(x => x.titel)).size;
  P.ok("Die Stücke kommen aus dem ganzen Spickzettel (" + spickAbschnitte + " Abschnitte)",
    spickAbschnitte >= 8, spickAbschnitte);
  const spickAlarm = [];
  spickStuecke.forEach(x => {
    const f = daten(w, 'analyse(' + JSON.stringify(x.t) + ').finds.filter(f=>f.c.sev==="hart"||f.c.sev==="pruef").map(f=>f.c.sev+" "+f.c.id)');
    if (f.length) spickAlarm.push(f.join("/") + " in „" + x.titel + "“: „" + x.t.slice(0, 60) + "“");
  });
  P.ok("Keine Meldung auf dem Spickzettel", !spickAlarm.length,
    spickAlarm.slice(0, 5).join(" · ") + (spickAlarm.length > 5 ? " …(" + spickAlarm.length + ")" : ""));
  /* Positivprobe: Der Weg Spickzettel → analyse() muss überhaupt etwas finden können. */
  const spickProbe = daten(w, 'analyse("Im großen und ganzen war das Standart.").finds.filter(f=>f.c.sev==="hart").length');
  P.ok("Die Spickzettelprüfung schlägt bei einem echten Fehler an", spickProbe >= 2, spickProbe);
}
P.ok("Genug korrigierte Sätze aus den Fehlersuchtexten (" + korrSaetze + ")", korrSaetze >= 45, korrSaetze);
if (korrOffen) P.info(korrOffen + " Markierungen ersetzen mehrteilig oder nennen nur eine Anweisung — die Sätze um sie herum bleiben außen vor");

/* Jede Markierung muss im Text auffindbar sein: korrErrIdx() sucht das Wort als ganzes
   Token. Findet es nichts, ist der Fehler unanklickbar, zählt aber in der Gesamtzahl —
   Nils kommt dann nie auf 100 Prozent. */
const unauffindbar = [];
KORREKTUR.forEach(t => {
  const toks = String(t.txt).split(/\s+/);
  t.errs.forEach(e => {
    const nth = e.nth || 1;
    let c = 0;
    for (let i = 0; i < toks.length; i++) if (toks[i] === e.w) c++;
    if (c < nth) unauffindbar.push(t.id + ": „" + e.w + "“ (" + nth + ". von " + c + ")");
  });
});
P.ok("Jede Fehlermarkierung ist im Text auffindbar", !unauffindbar.length, unauffindbar.join(" · "));

/* Fehlerklasse „Markierung mitten im Wort“: JavaScripts \b kennt keine Umlaute. Vor
   „überlegen“ liegt zwischen ü und b eine Wortgrenze, also begann der Treffer des
   Kommamusters erst beim b — der Textcheck unterstrich „berlegen ob“. analyse() dehnt
   Treffer seitdem auf ganze Wörter. Geprüft wird am echten Bestand, nicht an
   Kunstsätzen: 2200 Texte voller Umlaute sind die schärfere Probe. */
{
  const wortProben = [];
  ALL.forEach(i => {
    wortProben.push(strip(i.q));
    (i.o || []).forEach(o => wortProben.push(strip(o)));
    if (i.e) wortProben.push(strip(i.e));
  });
  RA.forEach(r => wortProben.push(strip(r.b)));
  KORREKTUR.forEach(t => wortProben.push(String(t.txt)));
  WORDS.forEach(x => { if (x.ex) wortProben.push(strip(x.ex)); });
  /* und drei Sätze, die genau die Stelle treffen, an der es schiefging */
  const gift = ["Man sollte mal überlegen ob wir das aufteilen.",
    "Wir müssen überprüfen dass alles stimmt.",
    "Die Übung hört auf sobald der Pfiff kommt."];
  const WZ = /[\p{L}\p{N}]/u;
  const mitten = [];
  let gepruefteTreffer = 0;
  wortProben.concat(gift).forEach(t => {
    if (!t || t.length < 4) return;
    const finds = daten(w, 'analyse(' + JSON.stringify(t) + ').finds.map(f=>({id:f.c.id,s:f.s,e:f.e}))');
    finds.forEach(f => {
      gepruefteTreffer++;
      const links = f.s > 0 && WZ.test(t[f.s - 1]) && WZ.test(t[f.s]);
      const rechts = f.e < t.length && WZ.test(t[f.e]) && WZ.test(t[f.e - 1]);
      if (links || rechts) mitten.push(f.id + ": „" + t.slice(Math.max(0, f.s - 6), f.e + 6) +
        "“ markiert „" + t.slice(f.s, f.e) + "“");
    });
  });
  P.ok("Die Wortgrenzenprüfung sieht überhaupt Treffer (" + gepruefteTreffer + ")",
    gepruefteTreffer >= 200, gepruefteTreffer);
  P.ok("Der drei Giftsätze wegen greift ein Kommamuster", daten(w,
    'analyse("Man sollte mal überlegen ob wir das aufteilen.").finds.some(f=>f.c.id==="y01")') === true,
    "Positivprobe blieb stumm");
  P.ok("Keine Markierung beginnt oder endet mitten im Wort", !mitten.length,
    mitten.slice(0, 5).join(" · ") + (mitten.length > 5 ? " …(" + mitten.length + ")" : ""));
}

{
  /* Wie viel von dem, was die App selbst als Fehler markiert, findet ihr eigener Textcheck?
     Die zwölf Fehlersuchtexte tragen 86 markierte Stellen mit Korrektur — eine Probe, die
     man nicht schönrechnen kann. Gemessen: 45 von 86 (52 %), nach dem Ausbau der
     Kommamuster 52, nachdem analyse() die Treffer auf ganze Wörter dehnt 54, mit den
     Mustern zu „Mal“, „im Großen und Ganzen“ und dem erweiterten „leid“ 58, nach dem
     Ausbau von y09 (das/dass) 64 von 86 (74 %).
     Die Schranke ist eine Untergrenze gegen Rückfall, kein Ziel: Der Textcheck soll auf
     Verdachtsstellen zeigen, nicht alles finden. Wer ein Muster zu Recht enger fasst,
     darf sie unterschreiten — dann hier den neuen Stand eintragen, nicht die Zahl
     schönrechnen. */
  /* Fehlerklasse „der Test misst neben der Stelle“. Gezaehlt wurde vorher, ob IRGENDEIN
     Treffer im Text das markierte Wort enthaelt — egal wo er sitzt. Bei kurzen Wörtern wie
     „das“, „den“ oder „wie“ ist das schnell irgendwo im Text erfuellt, und ein Treffer auf
     das eine „das“ zaehlte fuer das andere mit. Jetzt muss der Treffer die markierte Stelle
     wirklich ueberlappen. Die Stelle wird so bestimmt, wie die App selbst es tut
     (korrErrIdx): Text an Leerraum zerlegen, das n-te gleiche Token nehmen. */
  const quote = daten(w, `(function(){
    let stellen = 0, gefunden = 0;
    KORREKTUR.forEach(t => {
      const finds = analyse(t.txt).finds;
      const toks = t.txt.split(/\\s+/);
      const pos = []; let p = 0;
      toks.forEach(tk => { const i = t.txt.indexOf(tk, p); pos.push(i); p = i + tk.length; });
      t.errs.forEach(e => {
        stellen++;
        const nth = e.nth || 1; let c = 0, idx = -1;
        for (let i = 0; i < toks.length; i++) if (toks[i] === e.w && ++c === nth) { idx = i; break; }
        if (idx < 0) return;
        const a = pos[idx], b = a + toks[idx].length;
        if (finds.some(f => f.s < b && f.e > a)) gefunden++;
      });
    });
    return {stellen, gefunden};
  })()`);
  P.info("Der Textcheck findet " + quote.gefunden + " von " + quote.stellen + " markierten Fehlern (" +
    Math.round(quote.gefunden / quote.stellen * 100) + " %)");
  P.ok("Der Textcheck findet mindestens 60 der markierten Fehler",
    quote.gefunden >= 60, quote.gefunden + " von " + quote.stellen);

  /* Fehlerklasse „die App nennt einen Anteil, den niemand nachrechnet“. Der Textcheck
     sagt über sich selbst, wie viel er von den eingebauten Fehlern findet. Diese Zusage
     stand auf „etwa zwei Drittel“, während die Messung schon bei 74 Prozent lag — die
     Zahl war also nicht falsch, aber zu bescheiden, und sie wandert mit jedem geschärften
     Muster weiter weg. Hier wird sie an der Messung festgemacht. */
  {
    /* Dieselbe Klasse noch einmal: a04 versprach in seiner Erklärung „Über 30 Wörter in
       einem Satz“ und maß in Wirklichkeit Zeichen — 230 davon. Gemessen kippt es bei
       43 kurzen Wörtern und schon bei 18 langen Komposita; die Wortzahl war also keine
       Beschreibung, sondern eine Verwechslung. Die Erklärung nennt jetzt beide Enden,
       und hier stehen sie nachgerechnet. */
    const baue = (woerter, n) =>
      Array.from({ length: n }, (_, i) => woerter[i % woerter.length]).join(" ") + ".";
    const KURZ = ["Der","Trainer","hat","uns","heute","noch","einmal","die","Halle","gezeigt",
                  "und","dann","die","Bälle","geholt"];
    const LANG = ["Die","Trainerin","erklärte","ausführlich","sämtliche","Koordinationsübungen",
                  "einschließlich","Aufwärmprogramm","Dehnungseinheiten","Rückmeldungen",
                  "Wiederholungszahlen","Belastungssteuerung"];
    const trifft = txt => daten(w, "analyse(" + JSON.stringify(txt) + ").finds.some(f=>f.c.id===\"a04\")");
    P.ok("a04 lässt 40 kurze Wörter noch durch", !trifft(baue(KURZ, 40)));
    P.ok("und meldet 45 kurze Wörter", trifft(baue(KURZ, 45)));
    P.ok("bei langen Komposita meldet es schon 20 Wörter", trifft(baue(LANG, 20)));
    P.ok("und lässt 12 davon durch", !trifft(baue(LANG, 12)));
  }

  const BRUCH = { "die Hälfte": 0.5, "zwei Drittel": 2/3, "drei Viertel": 0.75,
                  "vier Fünftel": 0.8, "neun Zehntel": 0.9 };
  /* Am gerenderten Element gemessen, nicht am Quelltext — und der vorige Inhalt von
     #wSub wird danach zurückgelegt, damit die Ansichtsprüfungen unten dasselbe vorfinden. */
  const zusage = String(daten(w, `(function(){
    const host = document.querySelector("#wSub");
    const vorher = host.innerHTML;
    renderCheck();
    const t = host.textContent;
    host.innerHTML = vorher;
    return t;
  })()`));
  const genannt = Object.keys(BRUCH).find(x => zusage.includes(x));
  P.ok("Der Textcheck sagt selbst, welchen Anteil er findet", !!genannt,
    zusage.slice(0, 120));
  if (genannt) {
    const ist = quote.gefunden / quote.stellen;
    const naechster = Object.keys(BRUCH).sort((x, y) =>
      Math.abs(BRUCH[x] - ist) - Math.abs(BRUCH[y] - ist))[0];
    P.ok("und dieser Anteil stimmt mit der Messung überein („" + genannt + "“, gemessen " +
      Math.round(ist * 100) + " %)", genannt === naechster,
      "genannt „" + genannt + "“, am nächsten läge „" + naechster + "“");
  }

  /* Und die Gegenrichtung, härter als die Vorlage oben: Die korrigierten Fassungen
     derselben Texte sind zusammenhängende, richtige Prosa. Die drei Kommamuster dürfen
     dort nicht melden — sie sind die einzigen, die auf fehlende Zeichen zielen, und
     ausgerechnet solche Muster feuern leicht auf richtigen Text. */
  const falschalarm = daten(w, `(function(){
    const out = [];
    KORREKTUR.forEach(t => {
      const toks = t.txt.split(/\\s+/);
      t.errs.forEach(e => {
        if (!e.ok || /^\\(|^…/.test(e.ok)) return;
        let n = e.nth || 1, c = 0;
        for (let i = 0; i < toks.length; i++) { if (toks[i] === e.w && ++c === n) { toks[i] = e.ok; break; } }
      });
      const s = toks.join(" ");
      analyse(s).finds.forEach(f => {
        if (["y01", "y13", "y14"].includes(f.c.id)) out.push(f.c.id + " in " + (t.id || "?") + ": " + s.slice(f.s, f.e));
      });
    });
    return out;
  })()`);
  P.ok("Die Kommamuster melden nichts im korrigierten Text", !falschalarm.length, falschalarm.join(" · "));
}

/* Fehlerklasse „nach oben offene Wiederholung über einer verneinten Zeichenklasse“:
   a04 suchte sehr lange Sätze mit /[A-ZÄÖÜ][^.!?]{230,}[.!?]/. Da im Deutschen fast jedes
   Substantiv groß beginnt, setzt so ein Muster alle paar Zeichen neu an, und ohne
   Obergrenze läuft jeder Versuch bis zum Textende — der Aufwand vervierfacht sich, wenn
   der Text doppelt so lang wird. Gemessen an einem zeilenweise notierten Trainingsplan
   ohne Satzpunkte: 6000 Wörter brauchten 544 ms, in denen a04 nicht eine Fundstelle
   liefern kann (ohne Punkt trifft es nie). Mit Obergrenze sind es 24 ms. */
{
  /* Fehlerklasse „ein Fallmuster meldet eine Form, die den geforderten Fall selbst tragen
     kann“: x21 verlangte den Akkusativ und meldete dabei „uns“ und „euch“ — Formen, die im
     Dativ und im Akkusativ gleich lauten. „Das interessiert uns sehr“ stand damit als
     „Klarer Fehler“ da, und der eingeblendete Hinweis forderte genau die Form, die schon
     dastand. Die App wusste es an anderer Stelle selbst: x20 nimmt die beiden Formen aus
     demselben Grund ausdrücklich heraus.

     Geprüft wird gegen tests/formen.js — dieselbe unabhängig aufgestellte Formentabelle,
     mit der auch die Fallkarten geprüft werden. Wer ein Muster baut, das den Akkusativ
     verlangt, darf darin keine Form aufzählen, die selbst Akkusativ sein kann. */
  const { FORM } = require("./formen");
  const akkMuster = muster.filter(c => c.r === "gram-akkverben");
  const durchlaessig = [];
  akkMuster.forEach(c => {
    (String(c.re).match(/[a-zäöüßA-ZÄÖÜ]+/g) || []).forEach(wort => {
      const faelle = FORM[wort.toLowerCase()];
      if (faelle && faelle.includes("A")) durchlaessig.push(c.id + ": „" + wort + "“");
    });
  });
  P.ok("Kein Akkusativmuster zählt eine Form auf, die selbst Akkusativ sein kann (" +
    akkMuster.length + " Muster)", !durchlaessig.length, [...new Set(durchlaessig)].join(" · "));
}

{
  /* Fehlerklasse „die Stufe passt nicht zur Regel“. Grundsatz 3 sagt: Stil ist keine Regel,
     und was Stil ist, darf nicht als „falsch“ herauskommen. Die App hat dafür vier Stufen —
     hart („Klarer Fehler“), pruef („Bitte prüfen“), stil, form („Wirkung und Ton“) — und
     jede Regel hat eine Kategorie. Laufen beide auseinander, sagt der Textcheck etwas
     anderes als das Regelwerk dahinter.

     Gefunden wurden vier solche Paare: a06 („faul“, „unmotiviert“) und a07
     („ich bin zu blöd“) standen auf „Bitte prüfen“, obwohl beides tadelloses Deutsch ist
     und nur die Wirkung betrifft — jetzt „form“. x24 („in 2026“) stand ebenso auf
     „prüfen“, obwohl es eine Übernahme ist und kein Fehler — jetzt „stil“. Umgekehrt
     standen x06 und x07 auf „hart“ und zeigten auf eine Regel, die die Steigerung von
     Absolutadjektiven „schief“ nannte; der Duden führt „einzigste“ unter den häufigen
     Fehlern, also hat die Regel nachgezogen, nicht das Muster.

     Die Ausnahmen stehen mit Grund in der Liste — eine neue macht den Lauf rot. */
  const kat = {};
  RA.forEach(r => kat[r.id] = r.c);
  const PASST = {
    hart:  ["recht", "komma", "gross", "getrennt", "gram", "satz", "zeichen", "zahlen"],
    pruef: ["recht", "komma", "gross", "getrennt", "gram", "satz", "zeichen", "zahlen"],
    stil:  ["stil", "form"],
    form:  ["stil", "form"],
  };
  const AUSNAHMEN = {
    "x06": "hart auf stil-absolut: „einzigste“ führt der Duden unter den häufigen Fehlern, nicht als Stilfrage",
    "x07": "hart auf stil-absolut: dieselbe Begründung für optimalste, maximalste, idealste",
    "y06": "stil auf satz-konjunktiv: das doppelte „würde“ nennt CLAUDE.md ausdrücklich als Stilfrage",
    "y12": "stil auf gross-subst: „vor Kurzem/vor kurzem“ sind beide zulässig — der Hinweis mahnt nur Einheitlichkeit an",
    "s07": "stil auf form-verbindlich: „man“ statt Zuständigkeit ist eine Formulierungsfrage",
  };
  const schief = [];
  muster.forEach(c => {
    const k = kat[c.r];
    if (!k || !PASST[c.sev]) return;
    if (PASST[c.sev].includes(k)) return;
    if (c.id in AUSNAHMEN) return;
    schief.push(c.id + " [" + c.sev + "] → " + c.r + " (" + k + ")");
  });
  P.ok("Die Stufe jedes Musters passt zur Kategorie seiner Regel (" +
    Object.keys(AUSNAHMEN).length + " begründete Ausnahmen)", !schief.length, schief.join(" · "));
  /* Positivprobe: Der Abgleich muss ein falsches Paar erkennen. */
  const probe = [{ id: "probe", sev: "hart", r: "stil-fuellwort" }].filter(c => {
    const k = kat[c.r];
    return k && PASST[c.sev] && !PASST[c.sev].includes(k);
  });
  P.ok("Der Stufenabgleich erkennt ein unpassendes Paar", probe.length === 1, "Positivprobe blieb stumm");
  /* Und jede Ausnahme muss es noch geben — sonst verwaltet die Liste Karteileichen. */
  const tot = Object.keys(AUSNAHMEN).filter(id => !muster.some(c => c.id === id));
  P.ok("Jede gelistete Ausnahme gibt es noch", !tot.length, tot.join(", "));
}

const offeneWdh = muster.filter(c => /\[\^[^\]]*\]\{\d+,\}/.test(c.re));
P.ok("Kein Prüfmuster hat eine nach oben offene Wiederholung über einer verneinten Klasse",
  !offeneWdh.length, offeneWdh.map(c => c.id + ": " + c.re).join(" · "));

{
  /* Und die Wirkung selbst, großzügig bemessen: die Schranke soll einen Rückfall in die
     Größenordnung 500 ms fangen, nicht eine bestimmte Rechnerleistung festschreiben. */
  const woerter = ["Training", "Einheit", "Gruppe", "Aufwärmen", "Sprint", "Pause",
                   "Dehnen", "Sprungkraft", "Koordination", "Ausdauer"];
  w.__probe = Array.from({ length: 6000 }, (_, i) => woerter[i % 10]).join(" ");
  const ms = w.eval("(function(){const t=window.__probe;const a=Date.now();analyse(t);return Date.now()-a;})()");
  P.info("Textcheck über 6000 Wörter ohne Satzzeichen: " + ms + " ms");
  P.ok("Der Textcheck friert bei Text ohne Satzzeichen nicht ein", ms < 250, ms + " ms");
}

{
  /* Fehlerklasse „das Muster kennt seinen Zielfall nur in einer Wortform“. Ein Prüfmuster
     kann fehlerfrei laufen, syntaktisch heil sein, keinen Fehlalarm auslösen — und den
     Fall, für den es gebaut wurde, trotzdem in der häufigsten Stellung verpassen. Solche
     Muster fallen nirgends auf: Der Textcheck meldet nichts, und Nils hält seinen Text
     für sauber.

     Gefunden wurde die Klasse bei einem Durchgang über die Muster, die auf keiner einzigen
     Falschform der App greifen. Vier Beispiele, alle nachgemessen:
     x34 kannte nur wider + Stamm, nie das ge-Infix der Partizipien — „widergegeben“,
     „widergesehen“, „widergekehrt“ liefen durch, obwohl das Perfekt die Alltagsstellung
     dieser Verben ist. x15 kannte „Wiedersprüche“, aber nicht den Singular
     „Wiederspruch“, für den der Duden eigens eine Falschschreibungsseite führt. x33
     kannte jede Form von „erwiedern“ außer der ersten Person („ich erwiedere“). Und x32
     schrieb „auf|in“ nur klein, hatte also am Satzanfang gar keine Wirkung — es verpasste
     genau das Beispiel, das in seiner eigenen Erklärung steht („auf gut Deutsch“).

     Die Tabelle hält beide Richtungen fest: Was das Muster fangen muss, und was in seiner
     Nähe liegt und still bleiben muss. Die Verbotsseite ist die teurere — bei x34 sind es
     die trennbaren wider-Verben, deren Partizip ein ge einschiebt und dabei korrekt ist
     („hat sich widergespiegelt“, „hat widergehallt“). Wer die Lücke mit einem breiten
     /widerge/ schlösse, meldete diese Formen als harten Fehler und widerspräche damit dem
     eigenen Regeltext. */
  const ZIELE = [
    { id: "x34",
      ziel: ["Er hat das widergegeben.", "Wir haben uns lange nicht widergesehen.",
             "Der Schmerz ist widergekehrt.", "Ich widergebe den Inhalt nur.",
             "Ich muss das leider widerholen."],
      still: ["Das Ergebnis hat sich darin widergespiegelt.", "Der Ruf hat im Saal widergehallt.",
              "Das Echo ist widergeklungen.", "Das Licht hat widergestrahlt.",
              "Er hat das wiedergegeben.", "Sie hat ihm widersprochen.",
              "Ihm ist Unrecht widerfahren.", "Der Widerstand war groß."] },
    { id: "x15",
      ziel: ["Das ist ein klarer Wiederspruch.", "Er hat mir wiedersprochen.",
             "Ich kann dem nicht wiederstehen.", "Den Bescheid kann man wiederrufen."],
      still: ["Das ist ein klarer Widerspruch.", "Ich kann dem nicht widerstehen.",
              "Den Bescheid kann man widerrufen.", "Ich muss die Übung wiederholen.",
              "Wir haben den Zustand wiederhergestellt."] },
    { id: "x33",
      ziel: ["Ich erwiedere den Gruß.", "Er erwiederte nichts.", "Sie erwiedern nur knapp.",
             "Die Erwiederung kam prompt."],
      still: ["Ich erwidere den Gruß.", "Er erwiderte nichts.", "Er hat wieder etwas gesagt."] },
    /* Die Kommamuster für Infinitivgruppen: Beide kannten ihren Zielfall nur, wenn
       zwischen Auslöser und „zu“ kein Substantiv stand — deutsche Substantive sind groß,
       also blockte fast jeder echte Satz. Auf der Verbotsseite steht hier das mehrteilige
       Prädikat (sein, haben, brauchen, pflegen, scheinen, drohen, versprechen), bei dem
       nach § 73 E4 gerade kein Komma steht. */
    { id: "y02",
      ziel: ["Sie geht früher um pünktlich zu sein.", "Wir treffen uns um den Plan durchzugehen.",
             "Er spart um sich ein Rad zu kaufen.", "Sie kommt vorbei um das Trikot abzuholen."],
      still: ["Sie geht früher, um pünktlich zu sein.", "Um fit zu bleiben, geht er joggen.",
              "Er bittet um Erlaubnis.", "Wir kümmern uns um den Aufbau, um Zeit zu sparen."] },
    { id: "y11",
      ziel: ["Er hat versucht den Ball zu treffen.", "Sie hat beschlossen das Training zu verschieben.",
             "Er hat angefangen für die Klausur zu lernen.", "Sie plant im Sommer umzuziehen.",
             "Er hat vergessen Milch zu kaufen.", "Sie hat gelernt mit dem Rad zu fahren."],
      still: ["Er hat versucht, den Ball zu treffen.", "Er hofft zu gewinnen.",
              "Du brauchst nicht zu kommen.", "Sie scheint das Spiel zu gewinnen.",
              "Er hat noch zu arbeiten.", "Das Wetter droht schlecht zu werden.",
              "Er hat es versucht. Den Ball zu treffen ist schwer.",
              "Unser Vorhaben die Halle zu sanieren war teuer."] },
    /* Zwei Stilmuster, die nur die verbletzte Stellung kannten — im Hauptsatz rückt das
       finite Verb vor das Nomen, und genau dort waren beide stumm. Sie verpassten damit
       die eigenen Gegenbeispiele der App: „macht Sinn“ aus dem Fehlersuchtext kt10 und
       der Übung s08, „kam zur Anwendung“ aus der Übung s02. */
    { id: "s06",
      ziel: ["Das macht Sinn.", "Macht das Sinn?", "Die Aufteilung macht keinen Sinn.",
             "Zwei Einheiten machen mehr Sinn als eine.", "Das hat wenig Sinn gemacht."],
      still: ["Das ergibt Sinn.", "Der Sinn des Lebens ist unklar.", "Das ist sinnvoll.",
              "Er macht das mit viel Sinn für Details."] },
    { id: "s02",
      ziel: ["Das Verfahren kam zur Anwendung.", "Die Regel kommt hier zur Anwendung.",
             "Der Ersatzball kam zum Einsatz.", "Wir ziehen das in Erwägung.",
             "Die Regel findet hier Anwendung."],
      still: ["Wir wendeten das Verfahren an.", "Wir setzen den Ersatzball ein.",
              "Wir erwägen das.", "Er kam zur Halle.", "Die Anwendung ist einfach."] },
    { id: "y05",
      ziel: ["Der gleiche Fehler ist mir wieder passiert.", "Das gleiche Problem wie gestern.",
             "Wir tragen die gleichen Schuhe."],
      still: ["Alle Brüder gleiche Chancen bekommen.", "Die Räder gleicher Bauart liefen rund.",
              "Das Gleiche gilt für dich."] },
    { id: "t10",
      ziel: ["Er wollte laufen - Krafttraining kam später.",
             "Das Ergebnis war klar - Nils hatte gewonnen.",
             "Der Plan - so gut er war - scheiterte."],
      still: ["Meine Aufgaben:\n- aufwärmen\n- auslaufen", "Das Warm-up dauert zehn Minuten.",
              "Er wollte laufen – Krafttraining kam später."] },
    { id: "t14",
      ziel: ["Das war es....", "Und dann war Schluss…."],
      still: ["Im Zitat steht [...].", "Er zitierte (...).", "Und dann ...?",
              "Ich wollte noch trainieren ..., aber die Halle war zu.",
              "Die Methode funktioniert […]."] },
    /* y10 tat vorher genau das Gegenteil seiner Aufgabe: Es verlangte Verbzweitstellung
       im wo-Satz, die ein Relativsatz gar nicht hat, und traf deshalb nur den korrekten
       lokalen Gebrauch — „Die Halle, wo er ist“ und „Das ist der Ort, wo er war“ wurden
       gemeldet, die eigene Falschoption aus n35 nicht. Der Anker liegt jetzt auf dem
       Bezugswort: Nach einer Person ist „wo“ regional, nach einem Ort ist es richtig. */
    /* Vier Muster, die nur eine Zeitform oder nur einen Begleiter kannten. Gefunden beim
       eigenen Nachmessen, nicht durch den Prüflauf: x22 kannte nur das Präsens, f12
       verlangte ein „es“ vor „tut mir leid“ und verpasste damit den häufigsten Fall am
       Satzanfang, a07 kannte zwei Adverbien, x03 drei Begleiter. */
    /* Zwei Muster aus dem Nachmessen an den eigenen Fehlersuchtexten. x04 verlangte, dass
       der Komparativ unmittelbar vor „wie“ steht - im Satz liegt aber meist ein Verb
       dazwischen („schneller verbessert wie“, „weniger Anweisungen bekam wie“). Der Abstand
       ist jetzt erlaubt, aber nur, wenn direkt vor „wie“ ein kleingeschriebenes Wort steht:
       Sonst faengt das Muster den attributiven Gebrauch mit („ein kleiner Fehler wie
       dieser“ - kleiner ist dort kein Komparativ). x39 ist neu und hat kein Vorbild im
       Bestand: „der selbe“ getrennt fuehrt der Duden als Falschschreibung. Die Verbotsseite
       ist hier die verschmolzene Praeposition - „am selben Tag“ ist richtig, weil der
       Artikel im „am“ schon steckt. */
    { id: "x04",
      ziel: ["Die Gruppe von Marek hat sich deutlich schneller verbessert wie die anderen beiden.",
             "Auffällig war das die Gruppe weniger Anweisungen bekam wie die vordere.",
             "Er ist größer wie ich.", "Das dauerte länger wie gedacht.",
             "Größer wie ich ist hier keiner."],
      still: ["Er ist größer als ich.", "Mach es besser so wie gestern.",
              "Wir laufen genauso schnell wie ihr.", "Es lief besser als geplant.",
              "Das war ein kleiner Fehler wie dieser.", "Ein schneller Läufer wie er fehlt uns.",
              "Ein schlechter Tag wie jeder andere.", "Das ist nicht mehr wie früher.",
              "Ich habe mehr Zeit gebraucht, wie du weißt."] },
    { id: "x39",
      ziel: ["Wir kommen aus dem selben Verein.", "Er hat nochmal das Selbe erklärt.",
             "Das ist der selbe Fehler wie gestern.", "Sie tragen die selben Schuhe.",
             "Ein und das selbe."],
      still: ["Wir kommen aus demselben Verein.", "Er hat nochmal dasselbe erklärt.",
              "Am selben Tag war Training.", "Im selben Atemzug sagte er das.",
              "Zur selben Zeit lief das Spiel.", "Ich habe das selber gemacht.",
              "Vom selben Trainer betreut.", "Beim selben Verein angestellt."] },
    { id: "x03",
      ziel: ["Während dem Spiel hat es geregnet.", "Während diesem Training war es laut.",
             "Während meinem Praktikum habe ich viel gelernt."],
      still: ["Während der Vorlesung war es still.", "Während ich lief, regnete es.",
              "Während des Spiels hat es geregnet.", "Währenddessen lief das Warm-up."] },
    { id: "x22",
      ziel: ["Das kostet mir viel Zeit.", "Das kostete mir das Letzte.",
             "Die Karten kosten mir zu viel."],
      still: ["Das kostet mich viel Zeit.", "Das kostet uns viel Zeit.",
              "Das kostet euch nichts.", "Das kostet ihr Geld."] },
    { id: "f12",
      ziel: ["Es tut mir leid, falls das untergegangen ist.", "Tut mir leid, falls ich störe.",
             "Hallo Herr Meier. Tut mir leid, falls das untergeht."],
      still: ["Es tut mir leid. Ich habe den Termin vergessen.",
              "Tut mir leid für die späte Antwort.",
              "Ein großes tut mir leid, wenn das nicht klappt."] },
    { id: "a07",
      ziel: ["Ich bin wahrscheinlich zu blöd dafür.", "Ich bin einfach zu dumm für das Thema.",
             "Ich bin wohl zu blöd dafür.", "Ich bin schwer von Begriff."],
      still: ["Ich bin nicht zu dumm dafür.", "Ich bin für dumm verkauft worden.",
              "Ich bin mit der Aufgabe nicht weitergekommen."] },
    { id: "y10",
      ziel: ["der Mann, wo das gesagt hat", "Die Frau, wo im Verein arbeitet, heißt Meier.",
             "Der Trainer, wo uns betreut, ist neu.",
             "Die Leute, wo das erzählt haben, waren dabei.",
             "Mein Kollege, wo im Büro sitzt, weiß es."],
      still: ["Die Halle, wo er ist, liegt am Rand.", "Das ist der Ort, wo er war.",
              "Die Halle, wo wir trainieren, ist neu.", "Der Punkt, wo es kippt, ist der dritte.",
              "Der Mann, der das gesagt hat, ist weg.", "Ich weiß nicht, wo der Ball ist.",
              "Das Zimmer, wo das Material steht, ist abgeschlossen."] },
    { id: "x35",
      ziel: ["Meine Foto's vom Turnier sind fertig.", "Unsere CD's liegen im Schrank.",
             "Sechs Auto's standen vor der Halle.", "Ein paar Foto's fehlen noch.",
             "Keine Foto's mehr."],
      still: ["Meine Fotos vom Turnier sind fertig.", "Andrea’s Blumenladen hat zu.",
              "Newton’sche Gesetze gelten hier.", "Andreas’ Buch liegt da.", "Geht’s dir gut?"] },
    /* Bei „mal“ ist die Verbotsseite das Rechnen: „Das Gleiche mal zwei“ und „Zwei mal
       drei“ schreiben „mal“ zu Recht klein. Deshalb kommen ohne Begleiter nur nächste,
       letzte und vorige dazu — gleiche und selbe bleiben an den Begleiter gebunden. */
    { id: "x37",
      ziel: ["Nächstes mal bringe ich die Pfeife mit.", "Letztes mal war es besser.",
             "Voriges mal hat es geregnet.", "Beim nächsten mal klappt es.", "Bis nächstes mal."],
      still: ["Nächstes Mal bringe ich die Pfeife mit.", "Das Gleiche mal zwei ergibt das Doppelte.",
              "Zwei mal drei ist sechs.", "Komm mal her.", "Beim nächsten Mal klappt es."] },
    { id: "x38",
      ziel: ["Jedes mal, wenn ich ins Training komme, fehlt ein Ball.",
             "Hat es dieses mal geklappt?", "Ich habe jedesmal nachgefragt.",
             "Manches mal fehlt mir die Ruhe."],
      still: ["Jedes Mal, wenn ich ins Training komme, fehlt ein Ball.",
              "Manches Mal fehlt mir die Ruhe.", "Das ist die jedesmalige Prüfung.",
              "Diesmal klappt es."] },
    { id: "x32",
      ziel: ["Auf gut deutsch: das reicht nicht.", "Auf deutsch heißt das Abseits.",
             "In deutsch war ich nie gut.", "Ich schreibe die Mail in deutsch."],
      still: ["Auf Deutsch heißt das Abseits.", "Auf gut Deutsch: das reicht nicht.",
              "Wir spielen auf deutsch-französischem Boden."] },
  ];
  const verpasst = [], falschAn = [];
  ZIELE.forEach(z => {
    const treffer = s => daten(w, "analyse(" + JSON.stringify(s) + ").finds.some(f=>f.c.id===" +
      JSON.stringify(z.id) + ")");
    z.ziel.forEach(s => { if (!treffer(s)) verpasst.push(z.id + ": „" + s + "“"); });
    z.still.forEach(s => { if (treffer(s)) falschAn.push(z.id + ": „" + s + "“"); });
  });
  const zahl = ZIELE.reduce((n, z) => n + z.ziel.length + z.still.length, 0);
  P.ok("Jedes geprüfte Muster fängt seinen Zielfall in allen aufgeführten Stellungen (" +
    zahl + " Sätze)", !verpasst.length, verpasst.join(" · "));
  P.ok("und lässt die richtigen Nachbarformen in Ruhe", !falschAn.length, falschAn.join(" · "));
  /* Positivprobe: Der Weg Satz → analyse() → Muster-Treffer muss überhaupt anschlagen.
     Ohne sie wäre eine leere oder falsch geschriebene Tabelle stumm grün. */
  P.ok("Die Zielsatzprüfung schlägt bei einem Muster an, das nicht greifen darf",
    daten(w, 'analyse("Das Ergebnis hat sich darin widergespiegelt.").finds.some(f=>f.c.id==="x15")') === false &&
    daten(w, 'analyse("Das Ergebnis hat sich darin wiederspiegelt.").finds.some(f=>f.c.id==="x15")') === true,
    "Positivprobe blieb stumm");
}

/* ---------- E · Ansichten ---------- */
P.titel("E · Ansichten");
const d = w.document;
const reiter = [...d.querySelectorAll(".tabs button")];
P.ok("Sieben Reiter vorhanden", reiter.length === 7, reiter.length);
const leer = [];
reiter.forEach(b => {
  b.click();
  const sicht = [...d.querySelectorAll(".view")].find(v => v.style.display !== "none");
  if (!sicht || sicht.textContent.trim().length < 40) leer.push(b.textContent.trim());
});
P.ok("Keine leere Ansicht", !leer.length, leer.join(","));

const regelHost = d.querySelector("#ruleHost");
P.ok("Regelwerk lädt nach (" + RA.length + ")", regelHost && regelHost.querySelectorAll(".acc").length === RA.length,
  regelHost ? regelHost.querySelectorAll(".acc").length : "kein Host");

/* Spickzettel darf nicht von der Sprechkarte abweichen */
const zettelKnopf = [...d.querySelectorAll("button")].find(b => /Spickzettel/i.test(b.textContent));
P.ok("Spickzettel erreichbar", !!zettelKnopf);
if (zettelKnopf) {
  zettelKnopf.click();
  const zettel = d.querySelector("#cheatHost").textContent.replace(/\s+/g, " ");
  const karte = strip((SATZ.find(x => x.id === "sa18") || { b: "" }).b);
  const marker = ["rufe dir an", "größer", "Kollege", "würde", "brauchen", "gemacht gehabt",
    "mit was", "wegen dem Wetter", "bin gestanden"];
  const fehlt = marker.filter(m => karte.includes(m) && !zettel.includes(m));
  P.ok("Spickzettel deckt die Sprechkarte ab", !fehlt.length, fehlt.join(" · "));
}

/* Fehlerklasse „Fenster ohne Ausweg“: Auf Schirmen unter 600 px deckt das Suchfenster
   die ganze Fläche. Der Hintergrund, dessen Tipp es schließt, liegt darunter und ist
   nicht mehr erreichbar; der Hinweis auf Esc trägt die Klasse kbd und ist auf
   Berührungsgeräten ausgeblendet. Auf dem iPhone gab es damit keinen Weg heraus —
   als Startbildschirm-App auch keine Adressleiste zum Neuladen. */
{
  const knopf = d.querySelector("#searchBtn");
  P.ok("Suche erreichbar", !!knopf);
  if (knopf) {
    knopf.click();
    const fenster = d.querySelector("#srchWrap");
    P.ok("Suchfenster öffnet", !!fenster && fenster.classList.contains("on"));
    const zu = fenster && fenster.querySelector("button[aria-label], button[title]");
    P.ok("Das Suchfenster hat einen eigenen Schließen-Knopf", !!zu,
      "ohne ihn führt auf dem Handy kein Weg heraus");
    if (zu) {
      P.ok("… mit einem Namen für Vorlese-Software",
        !!(zu.getAttribute("aria-label") || "").trim());
      zu.click();
      P.ok("… und er schließt wirklich", !fenster.classList.contains("on"));
    }
  }
}

/* Fehlerklasse „Farbe reißt den Kontrast“: Weiß auf dem Akzentgrün des dunklen Themas
   ergab 2,56:1 — nötig sind 4,5:1 für Fließtext. Betroffen war der Hauptknopf, also
   „Weiter“, „Abschließen“, „Losgehen“, und ebenso die Fehlerfarbe mit 2,75:1. Beides
   fällt beim Ansehen kaum auf und ist unterwegs bei Sonne genau das Problem. */
const quelle = require("fs").readFileSync(require("path").join(__dirname, "..", "Deutsch-Trainer.html"), "utf8");
const farben = (block) => {
  const m = quelle.match(new RegExp(block.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\{([^}]*)\\}"));
  const raus = {};
  if (m) (m[1].match(/--[\w-]+:\s*#[0-9a-fA-F]{3,8}/g) || []).forEach(z => {
    const [k, v] = z.split(":"); raus[k.trim()] = v.trim();
  });
  return raus;
};
const leucht = h => {
  let c = h.replace("#", "");
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  const f = v => (v /= 255) <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * f(parseInt(c.substr(0, 2), 16)) + 0.7152 * f(parseInt(c.substr(2, 2), 16))
       + 0.0722 * f(parseInt(c.substr(4, 2), 16));
};
const kontrast = (a, b) => {
  const l1 = leucht(a), l2 = leucht(b), [h, n] = l1 > l2 ? [l1, l2] : [l2, l1];
  return Math.round((h + 0.05) / (n + 0.05) * 100) / 100;
};
P.ok("Die Kontrastrechnung stimmt an bekannten Werten",
  kontrast("#000000", "#ffffff") === 21 && kontrast("#ffffff", "#ffffff") === 1,
  kontrast("#000000", "#ffffff") + " / " + kontrast("#ffffff", "#ffffff"));

const themen = [["hell", farben(":root")], ["dunkel", farben('[data-theme="dark"]')]];
const paare = [
  ["Schrift auf dem Akzentknopf", "--acc-fg", "--acc"],
  ["Schrift auf der Fehlerfläche", "--bad-fg", "--bad"],
  ["Kleinschrift auf dem Grund", "--ink3", "--bg"],
  ["Kleinschrift auf der Karte", "--ink3", "--card"],
  ["Nebentext auf dem Grund", "--ink2", "--bg"],
  ["Haupttext auf dem Grund", "--ink", "--bg"],
];
const zuBlass = [];
themen.forEach(([name, f]) => {
  P.ok("Farbwerte für das " + name + "e Thema gefunden", Object.keys(f).length > 5, Object.keys(f).length);
  paare.forEach(([was, vg, hg]) => {
    if (!f[vg] || !f[hg]) { zuBlass.push(name + ": " + vg + " oder " + hg + " fehlt"); return; }
    const v = kontrast(f[vg], f[hg]);
    if (v < 4.5) zuBlass.push(name + ", " + was + ": " + v + ":1");
  });
});
P.ok("Kein Text unter 4,5:1 (" + themen.length * paare.length + " Paare)", !zuBlass.length, zuBlass.join(" · "));

/* ---------- F · Verpackung ---------- */
/* Die gehostete Fassung ist auf dem Handy installierbar und offline nutzbar. Das hängt an
   fünf kleinen Dateien und an sechs Zeilen im <head> — beides kann eine spätere Änderung
   still zerstören, ohne dass irgendein Prüflauf rot wird. Genau das fängt dieser Abschnitt.
   Die Einzeldatei muss dabei unberührt bleiben: unter file: darf sich kein Worker melden. */
P.titel("F · Verpackung");
const wurzel = path.join(__dirname, "..");
const lies = n => fs.readFileSync(path.join(wurzel, n), "utf8");
const daIst = n => fs.existsSync(path.join(wurzel, n));

const kopf = lies("Deutsch-Trainer.html").split("</head>")[0];
const kopfzeilen = [
  ["viewport-fit=cover", /viewport-fit\s*=\s*cover/],
  ["apple-mobile-web-app-capable", /name="apple-mobile-web-app-capable"\s+content="yes"/],
  ["apple-touch-icon", /rel="apple-touch-icon"/],
  ["Manifest verlinkt", /rel="manifest"/],
  ["theme-color", /name="theme-color"/],
];
const fehlendeKopfzeilen = kopfzeilen.filter(([, re]) => !re.test(kopf)).map(([n]) => n);
P.ok("Der <head> trägt, was das Handy braucht", !fehlendeKopfzeilen.length, fehlendeKopfzeilen.join(", "));

/* Der Service Worker darf sich nur melden, wenn die App über einen Server läuft.
   Als Datei ist ohnehin alles da, und eine Registrierung würde dort nur scheitern. */
const registrierung = lies("Deutsch-Trainer.html").match(/serviceWorker[\s\S]{0,400}?register\([^)]*\)/);
P.ok("Der Service Worker wird registriert", !!registrierung);
P.ok("… aber nicht bei file:", !!registrierung &&
  /location\.protocol\s*!==\s*"http:"[\s\S]{0,80}?return/.test(registrierung[0]),
  "die Registrierung ist nicht auf http(s) begrenzt");

P.ok("sw.js vorhanden", daIst("sw.js"));
if (daIst("sw.js")) {
  let sauber = true;
  try { new Function(lies("sw.js")); } catch (e) { sauber = false; }
  P.ok("sw.js ist ausführbar", sauber);

  /* Zwei Eigenschaften, die sich nicht am Text ablesen lassen, ohne sie zu benennen —
     beide sind teuer erkauft (gemessen: 28 s Start bei 25 kB/s, obwohl die ganze Seite
     im Cache lag). Es sind Textprüfungen, also nur ein Riegel gegen Rückfall, kein Beweis:
     das Verhalten selbst misst swtest/pruef.js im Browser.

     1. Ein fetch() ist erfüllt, sobald die Kopfzeilen da sind. Wer nur darauf wartet,
        misst nicht die 700 kB dahinter — die Frist schützt dann nur vor einem stummen
        Server, nicht vor schwachem Empfang. Der Rumpf muss also gelesen werden.
     2. Gewinnt die Frist, läuft das Nachladen im Hintergrund. Ohne waitUntil darf der
        Browser den Worker vorher abräumen, und die neue Fassung landet nie im Cache. */
  const swQuelle = lies("sw.js");
  const abFetch = swQuelle.slice(swQuelle.indexOf('addEventListener("fetch"'));
  P.ok("Der Worker wartet auf den ganzen Rumpf, nicht nur auf die Kopfzeilen",
    /\.(?:blob|arrayBuffer|text)\(\)/.test(swQuelle),
    "keine Stelle liest den Rumpf aus");
  P.ok("Das Nachladen im Hintergrund überlebt den Worker",
    /waitUntil\(/.test(abFetch),
    "im fetch-Ereignis steht kein waitUntil");
}

/* Zwei Layout-Eigenschaften, die sich nur im Browser messen lassen (jsdom rechnet keine
   Medienabfragen und kein Layout). Hier steht deshalb nur der Riegel gegen den Rückfall —
   gemessen wurde beides in Chromium bei 393x852, 375x667 und 667x375:
   Seitenbreite 458 auf 393 px Schirm vorher, 393 nachher; Reiterleiste nach 3000 px
   Scrollen vorher außer Sicht, nachher bei top 55. */
const handyBlock = (() => {
  /* Es gibt mehrere @media(max-width:600px)-Blöcke; gesucht ist der große am Ende der
     Formatvorlage. Geschnitten wird über die Klammern, nicht über Zeilenumbrüche. */
  const quelle = lies("Deutsch-Trainer.html");
  let bester = "";
  let ab = 0;
  for (;;) {
    const start = quelle.indexOf("@media(max-width:600px){", ab);
    if (start < 0) break;
    let i = quelle.indexOf("{", start), tiefe = 0, ende = -1;
    for (; i < quelle.length; i++) {
      if (quelle[i] === "{") tiefe++;
      else if (quelle[i] === "}" && --tiefe === 0) { ende = i; break; }
    }
    if (ende < 0) break;
    const block = quelle.slice(start, ende);
    if (block.length > bester.length) bester = block;
    ab = ende;
  }
  return bester;
})();
P.ok("Der Handy-Block ist auffindbar", handyBlock.length > 200, handyBlock.length);
P.ok("Die Kopfzeile bleibt auf dem Handy kleben",
  !/\.head\{[^}]*position:(relative|static)/.test(handyBlock),
  "der Handy-Block hebt position:sticky wieder auf");
P.ok("Die Spickzettel-Spalten dürfen schmaler werden als ihr Inhalt",
  /\.ch-2col\s*>\s*\*\{[^}]*min-width:0/.test(handyBlock),
  "ohne min-width:0 stehen die Tabellen über den Rand");

{
  /* Zwei weitere Regeln, die an der falschen Bedingung hingen — beide im Browser gemessen.
     (1) Die 16 px für Eingabefelder verhindern, dass iOS beim Antippen hineinzoomt. Sie
     standen in der Breiten-Abfrage: quer gehalten ist ein iPhone breiter als 600 px, die
     Felder fielen dort auf 15 px zurück, und iOS zoomte. Das hängt am Gerät, nicht an der
     Fensterbreite.
     (2) Die Kategorie-Marke im Unterwegs-Kopf wurde nur unter 400 px ausgeblendet. Auf
     einem 414-px-Schirm brauchte die Zeile mit ihr 468 px und schob den Fortschrittszähler
     über den Rand. */
  const quelle = lies("Deutsch-Trainer.html");
  const start = quelle.indexOf("@media(hover:none){");
  let tiefe = 0, ende = -1;
  for (let i = quelle.indexOf("{", start); i < quelle.length && start >= 0; i++) {
    if (quelle[i] === "{") tiefe++;
    else if (quelle[i] === "}" && --tiefe === 0) { ende = i; break; }
  }
  const touchBlock = start >= 0 && ende > 0 ? quelle.slice(start, ende) : "";
  P.ok("Der Touch-Block ist auffindbar", touchBlock.length > 100, touchBlock.length);
  P.ok("Die 16 px für Eingabefelder hängen am Gerät, nicht an der Fensterbreite",
    /input[^{}]*\{[^}]*font-size:16px/.test(touchBlock) &&
    !/input[^{}]*\{[^}]*font-size:16px/.test(handyBlock),
    "steht im Handy-Block statt im Touch-Block");
  P.ok("Die Kategorie-Marke ist im Unterwegs-Kopf auf jedem Handy aus",
    /\.walktop\s+\.tag\{[^}]*display:none/.test(touchBlock),
    "sie wird nur unter einer bestimmten Breite ausgeblendet");
}

P.ok("manifest.webmanifest vorhanden", daIst("manifest.webmanifest"));
if (daIst("manifest.webmanifest")) {
  let m = null;
  try { m = JSON.parse(lies("manifest.webmanifest")); } catch (e) { /* bleibt null */ }
  P.ok("Manifest ist gültiges JSON", !!m);
  if (m) {
    const pflicht = ["name", "start_url", "display", "icons"].filter(k => !m[k]);
    P.ok("Manifest nennt Name, Start, Anzeigeart und Symbole", !pflicht.length, pflicht.join(", "));
    P.ok("Manifest öffnet im eigenen Fenster", m.display === "standalone", m.display);

    /* Ein Symbol, das im Manifest steht, aber nicht im Repo liegt, fällt erst auf dem
       Home-Bildschirm auf — dann steht dort ein leeres Kästchen. */
    const groesse = datei => {
      const b = fs.readFileSync(path.join(wurzel, datei));
      if (b.slice(1, 4).toString() !== "PNG") return null;
      return b.readUInt32BE(16) + "x" + b.readUInt32BE(20);
    };
    const symbolSchief = (m.icons || []).map(i => {
      const n = String(i.src).replace(/^\//, "");
      if (!daIst(n)) return n + " fehlt";
      const g = groesse(n);
      if (!g) return n + " ist kein PNG";
      if (i.sizes && i.sizes !== g) return n + ": Manifest sagt " + i.sizes + ", Datei ist " + g;
      return null;
    }).filter(Boolean);
    P.ok("Alle Symbole liegen da und haben die angegebene Größe (" + (m.icons || []).length + ")",
      !symbolSchief.length, symbolSchief.join(" · "));

    /* Was das Deployment braucht, darf nicht aus dem Deployment ausgeschlossen sein. */
    if (daIst(".vercelignore")) {
      const raus = lies(".vercelignore").split("\n").map(z => z.trim())
        .filter(z => z && !z.startsWith("#"));
      const noetig = ["Deutsch-Trainer.html", "sw.js", "manifest.webmanifest"]
        .concat((m.icons || []).map(i => String(i.src).replace(/^\//, "")));
      const versehentlich = noetig.filter(n => raus.some(r => r === n || n.startsWith(r.replace(/\/$/, "") + "/")));
      P.ok("Die Ignorierliste schließt nichts Nötiges aus", !versehentlich.length,
        [...new Set(versehentlich)].join(", "));
    }
  }
}

if (daIst("vercel.json")) {
  let v = null;
  try { v = JSON.parse(lies("vercel.json")); } catch (e) { /* bleibt null */ }
  P.ok("vercel.json ist gültiges JSON", !!v);
  /* Die App heißt nicht index.html — ohne diese Zuordnung antwortet / mit 404. */
  P.ok("/ zeigt auf die App", !!v && (v.rewrites || [])
    .some(r => r.source === "/" && /Deutsch-Trainer\.html$/.test(r.destination)),
    "keine Zuordnung für / gefunden");
}

/* ---------- F2 · Suche, Textcheck, Sprünge ---------- */
P.titel("F2 · Suche und Textcheck");
{
  const dd = w.document;

  /* Fehlerklasse „das Ergebnis überlebt seine Grundlage“: Die Fundstellen des Textchecks
     sind Zeichenpositionen im geprüften Text. Wer nach dem Prüfen im Feld weiterschrieb,
     verschob sie — drawCheck() schnitt die Markierungen aus dem inzwischen geänderten
     Text, und sie saßen auf den falschen Wörtern. Der geprüfte Text gehört jetzt zum
     Ergebnis. */
  w.eval('go("schreiben")');
  [...dd.querySelectorAll("#v-schreiben .sub")].find(b => /Textcheck/.test(b.textContent)).click();
  const feld = dd.querySelector("#tcArea");
  P.ok("das Textcheck-Feld ist da", !!feld);
  feld.value = "Wir haben im Vorraus geplant und sind zufrieden mit dem Ergebniss.";
  dd.querySelector("#tcGo").click();
  P.ok("es gibt Fundstellen", (dd.querySelectorAll("#tcRes mark") || []).length > 0,
    dd.querySelectorAll("#tcRes mark").length);
  const markiert = [...dd.querySelectorAll("#tcRes mark")].map(m => m.textContent);
  feld.value = "Vorne steht jetzt etwas ganz anderes. " + feld.value;
  feld.dispatchEvent(new w.Event("input"));
  w.eval("drawCheck()");
  const danach = [...dd.querySelectorAll("#tcRes mark")].map(m => m.textContent);
  P.ok("die Markierungen sitzen weiter auf denselben Wörtern",
    JSON.stringify(markiert) === JSON.stringify(danach),
    markiert.join("|") + "  →  " + danach.join("|"));

  /* Fehlerklasse „Überlagerung ohne Fessel“: Ein Shift+Tab im Suchfenster landete
     unsichtbar auf der Seite dahinter — und Enter startete dort eine Runde. */
  const vorherFokussiert = dd.querySelector("#searchBtn");
  vorherFokussiert.focus();
  w.eval("openSearch()");
  P.ok("die Seite hinter der Suche ist aus der Fokusreihenfolge",
    dd.querySelector(".wrap").inert === true, dd.querySelector(".wrap").inert);
  /* Der Fokus muss erst wirklich weg sein, sonst prüft die Zeile darunter nichts —
     openSearch() setzt ihn selbst erst nach 30 ms. */
  dd.querySelector("#srchIn").focus();
  P.ok("der Fokus liegt im Suchfeld", dd.activeElement && dd.activeElement.id === "srchIn",
    dd.activeElement && dd.activeElement.id);
  w.eval("closeSearch()");
  P.ok("nach dem Schließen ist sie wieder bedienbar", dd.querySelector(".wrap").inert === false);
  P.ok("und der Fokus steht wieder, wo er herkam",
    dd.activeElement === vorherFokussiert,
    dd.activeElement && (dd.activeElement.id || dd.activeElement.tagName));
}
{
  /* Fehlerklasse „dieselbe teure Arbeit zweimal“: openRule() rief drawRules(), obwohl
     go("regeln") über ensureRules() schon gezeichnet hatte — 117 Regeln, zweimal, beim
     ersten Regelsprung. Der Zähler prüft die Anzahl der Aufrufe, nicht die Zeit; die hängt
     vom Rechner ab. Gemessen sank der erste Sprung in jsdom von 375 auf 215 ms. */
  const w3 = boot(null);
  w3.eval("window.__n = 0; const echt = drawRules; drawRules = function(){ window.__n++; return echt.apply(this, arguments); };");
  const ersteId = daten(w3, "RULES_ALL[3].id");
  w3.eval("openRule(" + JSON.stringify(ersteId) + ")");
  P.ok("der erste Regelsprung zeichnet die Liste einmal", daten(w3, "__n") === 1, daten(w3, "__n"));
  P.ok("und die Regel steht offen da", !!w3.document.querySelector("#rule-" + ersteId + ".open"));
  w3.eval("window.__n = 0;");
  const zweiteId = daten(w3, "RULES_ALL[7].id");
  w3.eval("openRule(" + JSON.stringify(zweiteId) + ")");
  P.ok("der zweite auch", daten(w3, "__n") === 1, daten(w3, "__n"));
  P.ok("und auch diese Regel steht offen da", !!w3.document.querySelector("#rule-" + zweiteId + ".open"));
}

/* ---------- G · Bedienung ohne Maus ---------- */
P.titel("G · Bedienung ohne Maus");
{
  /* Fehlerklasse „klickbar, aber nicht fokussierbar“: Ein span oder li ohne tabindex steht
     in keiner Fokusreihenfolge und lässt sich mit keiner Taste auslösen. Betroffen waren
     die 84 Wörter je Fehlersuchtext (12 Texte, 86 markierte Stellen — die ganze Übung war
     ohne Zeigegerät zu), die fünf Selbstcheck-Haken im Schreibimpuls und die zwei
     Tagesbausteine auf Heute. Dass es anders gemeint war, stand längst im Stylesheet:
     `.tok:focus-visible` konnte nie greifen. */
  const dd = w.document;

  /* Die vier Zeichenknöpfe heißen für Vorlese-Software sonst „⌕“, „◐“, „🔊“, „⏩“ — die
     Namensberechnung nimmt zuerst den Inhalt, das title kommt nie dran. */
  ["#searchBtn", "#themeBtn"].forEach(sel => {
    const b = dd.querySelector(sel);
    const name = b && b.getAttribute("aria-label");
    P.ok("Knopf " + sel + " hat einen sprechbaren Namen",
      !!name && name.length > 3 && !/^[^A-Za-zÄÖÜäöü]+$/.test(name), name);
  });

  w.eval('go("schreiben")');
  [...dd.querySelectorAll("#v-schreiben .sub")].find(b => /Fehlersuche/.test(b.textContent)).click();
  dd.querySelector("#wSub button").click();
  const woerter = [...dd.querySelectorAll("#ktText .tok")];
  P.ok("Der Fehlersuchtext ist in Wörter zerlegt", woerter.length > 40, woerter.length);
  P.ok("genau ein Wort ist mit Tab erreichbar",
    woerter.filter(x => x.getAttribute("tabindex") === "0").length === 1,
    woerter.filter(x => x.getAttribute("tabindex") === "0").length);
  P.ok("und jedes sagt, was es ist", woerter.every(x => x.getAttribute("role") === "checkbox"));
  P.ok("und ob es markiert ist", woerter.every(x => x.getAttribute("aria-checked") === "false"));

  const taste = k => new w.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  woerter[0].dispatchEvent(taste("ArrowRight"));
  P.ok("die Pfeiltaste rückt den Tabstopp weiter",
    woerter[1].getAttribute("tabindex") === "0" && woerter[0].getAttribute("tabindex") === "-1",
    woerter.map(x => x.getAttribute("tabindex")).slice(0, 3).join(","));
  woerter[1].dispatchEvent(taste(" "));
  P.ok("die Leertaste markiert", woerter[1].classList.contains("sel"));
  P.ok("und sagt es an", woerter[1].getAttribute("aria-checked") === "true");
  P.ok("der Zähler zählt mit", /1 von/.test(dd.querySelector("#ktCount").textContent),
    dd.querySelector("#ktCount").textContent);
  woerter[1].dispatchEvent(taste("Enter"));
  P.ok("Enter nimmt die Markierung zurück",
    !woerter[1].classList.contains("sel") && woerter[1].getAttribute("aria-checked") === "false");

  /* Selbstcheck-Haken im Schreibimpuls */
  [...dd.querySelectorAll("#v-schreiben .sub")].find(b => /Schreibimpuls/.test(b.textContent)).click();
  const schreiben = [...dd.querySelectorAll("#wSub button")].find(b => /Schreiben/.test(b.textContent));
  if (schreiben) schreiben.click();
  const haken = [...dd.querySelectorAll("#critList li")];
  P.ok("Die Selbstcheck-Haken sind da", haken.length > 0, haken.length);
  P.ok("und alle mit Tab erreichbar", haken.every(x => x.getAttribute("tabindex") === "0"));
  if (haken.length) {
    haken[0].dispatchEvent(taste(" "));
    P.ok("die Leertaste hakt ab",
      haken[0].classList.contains("tick") && haken[0].getAttribute("aria-checked") === "true");
  }

  /* Tagesbausteine auf Heute */
  w.eval('go("heute")');
  const kasten = [...dd.querySelectorAll("#extraHost .tbox-h")];
  P.ok("Die Tagesbausteine sind da", kasten.length > 0, kasten.length);
  P.ok("und mit Tab erreichbar", kasten.every(x => x.getAttribute("tabindex") === "0"));
  if (kasten.length) {
    kasten[0].dispatchEvent(taste("Enter"));
    P.ok("Enter klappt sie auf",
      kasten[0].parentElement.classList.contains("open") &&
      kasten[0].getAttribute("aria-expanded") === "true");
  }
}

/* ---------- H · Kontraste ---------- */
P.titel("H · Kontraste");
/* Fehlerklasse „Farbe im hellen Theme zu blass“: Acht Regeln setzten --gold als Textfarbe
   auf --gold-soft — die Serien-Kachel, der ◆-Varianten-Aufkleber, die Stilmarke im
   Textcheck, das gewählte Wort im Satzbaukasten. Gemessen 3,43:1, verlangt sind 4,5:1 bei
   Fließtext. Drei weitere lagen mit --ink3 auf --line2 bei 4,27:1. Im dunklen Theme war
   alles in Ordnung, deshalb fiel es beim Ansehen nicht auf: Nils läuft mit dem Handy in
   der Sonne, und da ist das helle Theme der schwierige Fall.
   Gerechnet wird auf den Farbwerten, nicht am gerenderten Bild — das findet auch, was
   gerade nicht auf dem Schirm steht. */
{
  const css = fs.readFileSync(path.join(__dirname, "..", "Deutsch-Trainer.html"), "utf8")
    .split("<style>")[1].split("</style>")[0];
  const dunkelStart = css.indexOf('[data-theme="dark"]{');
  const hellStart = css.indexOf(":root{");
  /* Der erste Anlauf schnitt am Text „:root[data-theme=…]“ — den es nicht gibt. Beide
     Themes waren dadurch dunkel, und die Prüfung meldete null Fehler. Deshalb hier hart
     abbrechen, statt stumm das Falsche zu messen. */
  P.ok("Beide Themenblöcke im CSS gefunden", hellStart >= 0 && dunkelStart > hellStart,
    "hell@" + hellStart + " dunkel@" + dunkelStart);
  /* Dreistellige Hex-Werte gehören dazu — „#fff“ ist dasselbe wie „#ffffff“. Ohne diese
     Zeile fehlten fünf Tokens des Druckblocks, und die Prüfung meldete den Druck aus dem
     dunklen Theme als unlesbar, obwohl der Browser ihn sauber zeichnete. */
  const langHex = h => h.length === 4 ? "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3] : h;
  const lies = block => {
    const o = {};
    [...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?)\b/g)]
      .forEach(m => o[m[1]] = langHex(m[2]));
    return o;
  };
  const hellTok = lies(css.slice(hellStart, dunkelStart));
  const dunkelTok = Object.assign({}, hellTok,
    lies(css.slice(dunkelStart, css.indexOf("}", css.indexOf("--shadow", dunkelStart)) + 1)));
  P.ok("Das dunkle Theme setzt eigene Farben (" + Object.keys(lies(css.slice(dunkelStart,
    css.indexOf("}", css.indexOf("--shadow", dunkelStart)) + 1))).length + " Tokens)",
    hellTok.bg !== dunkelTok.bg && hellTok.ink !== dunkelTok.ink, "Themes sind identisch");
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const lum = c => { const v = c.map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const kontrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const paare = [];
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].forEach(m => {
    const sel = m[1].trim().replace(/\s+/g, " "), body = m[2];
    const fg = (body.match(/(?:^|;)\s*color:\s*var\(--([a-z0-9-]+)\)/) || [])[1];
    const bg = (body.match(/background(?:-color)?:\s*var\(--([a-z0-9-]+)\)/) || [])[1];
    const px = Number((body.match(/font-size:\s*([\d.]+)px/) || [])[1]) || 13;
    const fw = Number((body.match(/font-weight:\s*(\d+)/) || [])[1]) || 400;
    if (fg && bg) paare.push({ sel, fg, bg, px, gross: px >= 24 || (px >= 18.66 && fw >= 700) });
  });
  P.ok("Genug Farbpaare im CSS gefunden (" + paare.length + ")", paare.length >= 40, paare.length);
  /* Dritte Konfiguration: der Druck. Papier ist immer hell, und der Druckblock zieht die
     Farbtokens deshalb auf helle Werte. Ohne diesen Block druckte der Spickzettel im
     dunklen Theme weiße Schrift auf weißem Papier — 146 von 328 Textelementen unter
     4,5:1, das schlechteste bei 1,19:1. Zwei Themes zu prüfen hätte das nie gefunden:
     Der Fehler entsteht erst aus dunklem Theme PLUS Druckregeln. */
  const klammerEnde = (text, start) => {
    let i = text.indexOf("{", start), tief = 0;
    for (; i < text.length; i++) {
      if (text[i] === "{") tief++;
      else if (text[i] === "}" && --tief === 0) return i;
    }
    return text.length;
  };
  const druckStart = css.indexOf("@media print{");
  P.ok("Der Druckblock ist auffindbar", druckStart > 0, druckStart);
  const druckBlock = css.slice(druckStart, klammerEnde(css, druckStart) + 1);
  const druckTok = lies(druckBlock);
  P.ok("Der Druckblock setzt eigene Farbtokens (" + Object.keys(druckTok).length + ")",
    Object.keys(druckTok).length >= 10 && druckTok.ink, Object.keys(druckTok).join(","));
  const druckAusHell = Object.assign({}, hellTok, druckTok);
  const druckAusDunkel = Object.assign({}, dunkelTok, druckTok);
  const blass = [];
  [["hell", hellTok], ["dunkel", dunkelTok],
   ["Druck aus hell", druckAusHell], ["Druck aus dunkel", druckAusDunkel]].forEach(([name, tok]) => {
    paare.forEach(p2 => {
      if (!tok[p2.fg] || !tok[p2.bg]) return;
      const c = kontrast(hex(tok[p2.fg]), hex(tok[p2.bg]));
      const soll = p2.gross ? 3 : 4.5;
      if (c < soll) blass.push(name + " " + (Math.round(c * 100) / 100) + ":1 (" + soll + " nötig)  " +
        p2.sel.slice(0, 40) + "  --" + p2.fg + " auf --" + p2.bg);
    });
  });
  P.ok("Jede Farbkombination erreicht den Kontrast — hell, dunkel und im Druck", !blass.length,
    blass.slice(0, 6).join(" · ") + (blass.length > 6 ? " …(" + blass.length + ")" : ""));
  /* Und die physische Wahrheit dazu: Papier ist weiß, egal was --bg sagt. Der Drucker
     zeichnet keine Flächen, wenn „Hintergrundgrafiken“ aus sind — das ist die Voreinstellung.
     Jede Schriftfarbe des Druckstands muss deshalb gegen reines Weiß reichen, aus beiden
     Themes heraus. Genau hier lag der Fehler: Aus dem dunklen Theme stand --ink auf #e9ecea,
     also 1,08:1 auf Papier. Die Paarprüfung oben sah das nicht, weil sie --ink gegen --bg
     hielt und --bg im dunklen Theme mitdunkelt. */
  const AUFWEISS = ["ink", "ink2", "ink3", "acc", "acc-ink", "warn", "bad", "gold", "blue", "pur", "teal"];
  const aufPapier = [];
  [["aus hell", druckAusHell], ["aus dunkel", druckAusDunkel]].forEach(([name, tok]) => {
    AUFWEISS.forEach(t => {
      if (!tok[t]) return;
      const c = kontrast(hex(tok[t]), [255, 255, 255]);
      if (c < 4.5) aufPapier.push(name + " --" + t + " " + (Math.round(c * 100) / 100) + ":1 auf weißem Papier");
    });
  });
  P.ok("Jede Schriftfarbe reicht auf weißem Papier", !aufPapier.length, aufPapier.join(" · "));
  /* Positivprobe: Die Rechnung muss ein bekannt zu blasses Paar auch als zu blass erkennen. */
  P.ok("Die Kontrastrechnung erkennt ein zu blasses Paar",
    kontrast(hex("#a97b1e"), hex("#fbf3e2")) < 4.5 && kontrast(hex("#8d6518"), hex("#fbf3e2")) >= 4.5,
    "Positivprobe blieb stumm");

  /* Tippflächen. Gemessen im echten Browser bei 320, 393 und 430 px mit Touch-Emulation:
     keine Fläche unter 44 px, außer den Kopfknöpfen bei ≤360 px — dort stehen sie auf 38,
     und das ist Absicht: Mit 44 passt „Deutsch-Trainer“ nicht mehr neben Serie, XP und die
     zwei Knöpfe, der Titel läuft unter die Serien-Kachel. 38 liegt weit über dem
     Mindestmaß von 24 px (WCAG 2.5.8).
     Wichtig beim Nachmessen: Ohne Touch-Emulation greift @media(hover:none) nicht, und
     dann meldet die Messung 91 zu kleine Flächen, die es auf dem Handy nicht gibt.
     Hier wird nur die Regel geprüft, dafür ohne Browser. */
  const groesse = (block, sel) => {
    const m = block.match(new RegExp("\\" + sel + "\\{[^}]*?(?:width|height):\\s*(\\d+)px"));
    return m ? Number(m[1]) : null;
  };
  const touchBlock = css.slice(css.indexOf("@media(hover:none)"), css.indexOf("@media(hover:none)") + 900);
  const engStart = css.indexOf("@media(max-width:360px)");
  const engBlock = engStart > 0 ? css.slice(engStart, engStart + 700) : "";
  const touchIcon = groesse(touchBlock, ".iconbtn"), engIcon = groesse(engBlock, ".iconbtn");
  P.ok("Der Touchblock setzt die Kopfknöpfe auf mindestens 44 px (" + touchIcon + ")",
    touchIcon !== null && touchIcon >= 44, touchIcon);
  P.ok("Auch auf schmalen Schirmen bleiben sie über dem Mindestmaß von 24 px (" + engIcon + ")",
    engIcon !== null && engIcon >= 24, engIcon);
  /* Positivprobe: Die Suche darf nicht irgendeine Zahl finden. */
  P.ok("Die Größenprüfung liest wirklich die iconbtn-Regel",
    groesse(touchBlock, ".gibtsnicht") === null && touchIcon !== engIcon, touchIcon + "/" + engIcon);
}

P.abschluss();
