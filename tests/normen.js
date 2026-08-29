/* Normative Aussagen: absolute Behauptungen, Kann-Regeln und Jahreszahlen.

   Fehlerklasse, die diesen Lauf ausgelöst hat: Eine normative Aussage steht an vier
   Stellen — Regel, Übung, Spickzettel, Textcheck — und veraltet an einer davon, ohne
   dass es auffällt. So hat die App nach der Regelwerksfassung 2024 noch acht Monate
   lang gelehrt, das Komma bei „Er hat versucht(,) pünktlich zu sein“ sei freigestellt.
   Es ist seit dem 1. Juli 2024 Pflicht.

   Der Lauf erzwingt keine Richtigkeit — das kann keine Maschine. Er erzwingt, dass
   jede scharfe Aussage bewusst eingetragen ist. Wer eine neue absolute Behauptung,
   eine neue Kann-Regel oder eine neue Jahreszahl in die Zeichensetzung schreibt,
   bekommt hier einen Fehler und muss nachschlagen, statt es beim Schreiben zu glauben.

   Wächst der Bestand, wächst die Liste unten mit — von Hand, mit Begründung. */

const { boot, daten, pruefer } = require("./setup");
const P = pruefer("A · Absolute Aussagen");

const w = boot(null);
const RA = daten(w, "RULES_ALL");
const ALL = daten(w, "ALL");
const CH = daten(w, "CHECKS_ALL.map(c=>({id:c.id,sev:c.sev,t:c.t,k:c.k,r:c.r}))");
const strip = h => String(h).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/* Nur die Zeichensetzung. Die übrigen Kategorien sind nicht Gegenstand dieses Laufs;
   wer sie aufnimmt, muss ihre Fundstellen genauso einzeln eintragen. */
const IMBLICK = c => c === "komma" || c === "zeichen";
/* Prüfmuster tragen keine Kategorie, nur einen Regelverweis. */
const komma_zeichen = rid => {
  const r = RA.find(x => x.id === rid);
  return !!r && IMBLICK(r.c);
};

/* ---------- A · Absolute Aussagen sind eingetragen ---------- */

/* „fast immer“ und „nicht immer“ sind bereits abgeschwächt und zählen nicht mit. */
const ABSOLUT = /(?<!\b(?:fast|nicht)\s)\b(immer|nie|niemals|stets|ausschließlich|grundsätzlich|keinesfalls|ausnahmslos)\b/gi;

/* Fundstelle → warum die Absolutheit hier belegt ist. */
const ABS_OK = {
  "komma-infinitiv": "Erweiterte Infinitivgruppe: Komma seit 1.7.2024 ohne Ausnahme — Regelwerk 2024, § 73.",
  "z-semikolon": "„ein Punkt ist nie falsch“ — zwei Hauptsätze dürfen immer als zwei Sätze stehen.",
  "z-schraeg": "Apostroph beim normalen Genitiv und im Plural: ausgeschlossen. Der zulässige Fall (Andrea’s) steht direkt darüber.",
  "k01": "um/ohne/statt/anstatt/außer/als: Komma war schon vor 2024 Pflicht und ist es geblieben.",
  "t06": "„von 1990–1995“ mischt zwei Schreibweisen: Der Bis-Strich vertritt das Wort „bis“ (Duden). Steht „von“, muss „bis“ ausgeschrieben werden."
};

const absFund = [];
RA.filter(r => IMBLICK(r.c)).forEach(r => {
  const m = strip(r.b).match(ABSOLUT);
  if (m) absFund.push({ id: r.id, art: "Regel", woerter: [...new Set(m.map(x => x.toLowerCase()))] });
});
ALL.filter(i => IMBLICK(i.c)).forEach(i => {
  const m = strip(i.e).match(ABSOLUT);
  if (m) absFund.push({ id: i.id, art: "Übung", woerter: [...new Set(m.map(x => x.toLowerCase()))] });
});
/* Der Textcheck ist die vierte Ebene. Sein Hinweistext behauptet dasselbe wie die
   Regel und veraltet genauso leicht — y02 sagte nach dem 1.7.2024 noch die halbe
   Wahrheit, weil dort nur die Einleitewörter standen. */
CH.filter(c => komma_zeichen(c.r)).forEach(c => {
  const m = strip(c.k).match(ABSOLUT);
  if (m) absFund.push({ id: c.id, art: "Prüfmuster", woerter: [...new Set(m.map(x => x.toLowerCase()))] });
});

const absNeu = absFund.filter(f => !ABS_OK[f.id]);
P.ok("Jede absolute Aussage ist eingetragen (" + absFund.length + " Fundstellen)",
  !absNeu.length,
  absNeu.map(f => f.art + " " + f.id + " (" + f.woerter.join("/") + ")").join(" · ")
  + " — nachschlagen und in ABS_OK eintragen");

const absTot = Object.keys(ABS_OK).filter(id => !absFund.some(f => f.id === id));
P.ok("Keine Karteileiche in der Liste", !absTot.length,
  absTot.join(",") + " steht in ABS_OK, hat aber keine absolute Aussage mehr");

/* ---------- B · Kann-Regeln zeigen auf einen Beleg ---------- */
P.titel("B · Kann-Regeln sind belegt");

const KANN = /\b(freigestellt|fakultativ|wahlfrei|kann (?:gesetzt|stehen|entfallen|weggelassen))\b/i;
const BELEG = /\b(Duden|DWDS|Regelwerk|Rat für deutsche Rechtschreibung|DIN 5008|Gesellschaft für deutsche Sprache|Reform von \d{4})\b/;

const kannRegeln = RA.filter(r => IMBLICK(r.c) && KANN.test(strip(r.b)));
const ohneBeleg = kannRegeln.filter(r => !BELEG.test(strip(r.b)));
P.ok("Jede Regel mit Kann-Aussage nennt eine Quelle (" + kannRegeln.length + ")",
  !ohneBeleg.length, ohneBeleg.map(r => r.id).join(","));

/* Übungen erben den Beleg über ihren Regelverweis — sie müssen ihn nicht wiederholen,
   aber die Regel dahinter muss ihn haben. */
const kannUebungen = ALL.filter(i => IMBLICK(i.c) && KANN.test(strip(i.e)));
const erbtNichts = kannUebungen.filter(i => {
  const r = RA.find(x => x.id === i.r);
  return !r || !BELEG.test(strip(r.b));
});
P.ok("Jede Übung mit Kann-Aussage hängt an einer belegten Regel (" + kannUebungen.length + ")",
  !erbtNichts.length, erbtNichts.map(i => i.id + "→" + i.r).join(","));

const kannMuster = CH.filter(c => komma_zeichen(c.r) && KANN.test(strip(c.k)));
const musterOhne = kannMuster.filter(c => {
  const r = RA.find(x => x.id === c.r);
  return !r || !BELEG.test(strip(r.b));
});
P.ok("Jedes Prüfmuster mit Kann-Aussage hängt an einer belegten Regel (" + kannMuster.length + ")",
  !musterOhne.length, musterOhne.map(c => c.id + "→" + c.r).join(","));

/* ---------- C · Jahreszahlen sind eingetragen ---------- */
P.titel("C · Datierte Aussagen");

/* Eine Jahreszahl in einer Regel ist eine Behauptung über den Stand des Regelwerks.
   Genau daran ist die Infinitivregel veraltet — das Datum stand nirgends. */
/* Nur Jahreszahlen in normativem Zusammenhang. Beispielsätze wie der Bis-Strich
   „1990–1995“ oder ein Datum im Briefkopf behaupten nichts über das Regelwerk. */
const NORMWORT = /(seit|Reform|Fassung|Regelwerk|in Kraft|geändert|gilt|neu vergeben)/i;
const jahre = text => {
  const treffer = [];
  const re = /\b(?:19|20)\d{2}\b/g;
  let m;
  while ((m = re.exec(text))) {
    if (NORMWORT.test(text.slice(Math.max(0, m.index - 70), m.index))) treffer.push(m[0]);
  }
  return treffer.length ? [...new Set(treffer)] : null;
};
const JAHR_OK = {
  "komma-infinitiv": "1.7.2024 / Fassung 2024 — Inkrafttreten der neuen Kommaregel für Infinitivgruppen.",
  "komma-partizip": "1996 — die Reform hat die Pflichtfälle zusammengezogen; 2024 unverändert.",
  "komma-hauptsatz": "1996 — Freistellung des Kommas vor und/oder; 2024 Hinweis auf die neue Zählung.",
  "k09": "1996 — dieselbe Freistellung, Beleg steht in komma-hauptsatz.",
  "k20": "2024 — Datum der Änderung, Beleg steht in komma-infinitiv.",
  "k29": "1996 — Beleg steht in komma-partizip.",
  "y02": "2024 — Hinweistext des Textchecks nennt das Inkrafttreten; Beleg steht in komma-infinitiv."
};

const jahrFund = [];
RA.filter(r => IMBLICK(r.c)).forEach(r => {
  const m = jahre(strip(r.b));
  if (m) jahrFund.push({ id: r.id, art: "Regel", jahre: m });
});
ALL.filter(i => IMBLICK(i.c)).forEach(i => {
  const m = jahre(strip(i.e));
  if (m) jahrFund.push({ id: i.id, art: "Übung", jahre: m });
});
CH.filter(c => komma_zeichen(c.r)).forEach(c => {
  const m = jahre(strip(c.k));
  if (m) jahrFund.push({ id: c.id, art: "Prüfmuster", jahre: m });
});

const jahrNeu = jahrFund.filter(f => !JAHR_OK[f.id]);
P.ok("Jede Jahreszahl ist eingetragen (" + jahrFund.length + " Fundstellen)",
  !jahrNeu.length,
  jahrNeu.map(f => f.art + " " + f.id + " (" + f.jahre.join("/") + ")").join(" · ")
  + " — belegen und in JAHR_OK eintragen");

/* ---------- D · Der Spickzettel sagt dasselbe wie die Regeln ---------- */
P.titel("D · Spickzettel gegen Regelwerk");

/* Der Spickzettel wiederholt Teile des Bestands von Hand. Genau dort hat die alte
   Einteilung „einfache Infinitivgruppe ohne Einleitewort“ überlebt, nachdem sie in
   der Regel schon ersetzt war. Diese Liste hält beide Seiten zusammen. */
const spick = daten(w, "cheatHTML()");
const st = strip(spick);

const PAARE = [
  { was: "erweiterte Infinitivgruppe steht unter „Immer“",
    imSpick: /erweiterte Infinitivgruppe/i, inRegel: "komma-infinitiv", imText: /erweiterte Infinitivgruppe/i },
  { was: "nicht erweiterte Gruppe steht unter „Wahlfrei“",
    imSpick: /nicht erweiterte Infinitivgruppe/i, inRegel: "komma-infinitiv", imText: /nicht erweitert/i },
  { was: "Partizipgruppe bleibt wahlfrei",
    imSpick: /Partizipgruppe/i, inRegel: "komma-partizip", imText: /freigestellt/i }
];

PAARE.forEach(p => {
  const imSpick = p.imSpick.test(st);
  const regel = RA.find(r => r.id === p.inRegel);
  const inRegel = regel && p.imText.test(strip(regel.b));
  P.ok(p.was, imSpick && inRegel,
    (imSpick ? "" : "fehlt im Spickzettel ") + (inRegel ? "" : "fehlt in " + p.inRegel));
});

/* Die überholte Einteilung darf nirgends mehr auftauchen. */
const HTML = require("./setup").HTML;
P.ok("Alte Einteilung „einfache Infinitivgruppe ohne Einleitewort“ ist raus",
  !/einfache[nr]? Infinitivgruppen? ohne Einleitewort/i.test(HTML));

P.abschluss();
