/* Fallkarten in Satzform: „Ich helfe ___ beim Aufbau“ statt „Welchen Fall verlangt helfen?“
   Geprüft werden Form und Hörbarkeit der Aufgaben und — der teuerste Punkt — dass die
   richtige Form zum Fall der Karte passt und kein Ablenker in Wahrheit richtig ist. */

const { boot, daten, pruefer } = require("./setup");
const { FORM, NAME } = require("./formen");
const P = pruefer("A · Form der Satzaufgaben");

const w = boot(null);
const strip = h => String(h).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const norm  = t => strip(t).toLowerCase().replace(/[„“”"']/g, "").replace(/[.,;:!?]+$/, "").trim();

const POOL = daten(w, 'drillPool().map(e=>({w:e.w,t:e.t,k:e.k,ex:e.ex,s:e.s||null,ans:drillCase(e)}))');
const MIT  = POOL.filter(e => e.s);
const OHNE = POOL.filter(e => !e.s);

/* Eine Karte trägt entweder eine Fassung — [Satz, richtig, falsch …] — oder mehrere,
   dann als Liste von Listen. Alles Weitere prüft jede Fassung einzeln. */
const fassungen = e => Array.isArray(e.s[0]) ? e.s : [e.s];
const ALLE = [];
MIT.forEach(e => fassungen(e).forEach((f, i) =>
  ALLE.push({ e, f, i, satz: f[0], richtig: f[1], falsch: f.slice(2), von: fassungen(e).length })));

/* ---------- A · Form ---------- */
const schief = pruef => ALLE.filter(x => pruef(x)).map(x => x.e.w + "#" + (x.i + 1)).join(", ");
const ok = (label, pruef) => P.ok(label, !schief(pruef), schief(pruef));

P.ok("Satzformen vorhanden (" + MIT.length + " von " + POOL.length + " Karten, " +
     ALLE.length + " Fassungen)", MIT.length > 0);
ok("Genau eine Lücke je Satz", x => (x.satz.match(/___/g) || []).length !== 1);
ok("Mindestens zwei Optionen", x => x.f.length < 3);
ok("Keine leere Option", x => x.f.slice(1).some(o => !String(o).trim()));
ok("Keine Lücke in den Optionen", x => x.f.slice(1).some(o => /_/.test(o)));
/* $ hätte in String.replace eine Sonderbedeutung und würde die Antwort verstümmeln */
ok("Kein Dollarzeichen in den Optionen", x => x.f.slice(1).some(o => o.includes("$")));
ok("Optionen paarweise verschieden",
   x => new Set(x.f.slice(1).map(norm)).size !== x.f.length - 1);
ok("Ablenker ergeben einen anderen Satz", x => x.falsch.some(o =>
   norm(x.satz.replace("___", () => o)) === norm(x.satz.replace("___", () => x.richtig))));

/* ---------- B · Der Fall stimmt ---------- */
P.titel("B · Der Fall stimmt");
/* Welchen Fall die Fassung verlangt. Steht er eindeutig in k, gilt der. Wechselpräpositionen
   tragen beide Fälle in k; dort gilt die Reihenfolge der Fassungen: erst wohin (Akkusativ),
   dann wo (Dativ). Diese Reihenfolge ist Absprache und wird hier mitgeprüft. */
function sollFall(x) {
  /* Die Fallangabe steht mal blank („Dativ“), mal mit Präposition („auf + Akkusativ“,
     „aus, in + Dativ · auf + Dativ“). Eindeutig ist sie, solange nur ein Fall vorkommt.
     Unabhängig von drillCase() aufgelöst, damit die Prüfung nicht die App gegen sich
     selbst hält. */
  const k = String(x.e.k);
  const treffer = [["A", /Akkusativ|Akk\b/], ["D", /Dativ|Dat\b/], ["G", /Genitiv|Gen\b/]]
    .filter(([, re]) => re.test(k)).map(([c]) => c);
  if (treffer.length === 1) return treffer[0];
  if (x.e.t === "wechsel" && x.von === 2) return x.i === 0 ? "A" : "D";
  return null;
}
const traeger = t => String(t).toLowerCase().replace(/[^a-zäöüß ]/g, " ").split(/\s+/).filter(y => FORM[y]);

let gedeckt = 0;
const falscheForm = [], offen = [];
ALLE.forEach(x => {
  const soll = sollFall(x);
  const tr = soll ? traeger(x.richtig) : [];
  if (!soll || !tr.length) { offen.push(x.e.w + "#" + (x.i + 1)); return; }
  gedeckt++;
  if (!tr.some(y => FORM[y].includes(soll)))
    falscheForm.push(x.e.w + "#" + (x.i + 1) + ": „" + x.richtig + "“ ist kein " + NAME[soll]);
});
P.ok("Die richtige Form passt zum Fall der Karte (" + gedeckt + " geprüft)",
  !falscheForm.length, falscheForm.slice(0, 4).join(" · "));

/* Ein Ablenker, der eindeutig im verlangten Fall steht, wäre eine zweite richtige Antwort.
   Verglichen wird nur, wo beide Optionen reine Fallformen sind — also dieselbe Wortgruppe
   in verschiedenen Fällen. Wechselt stattdessen die Präposition („zum“ gegen „nach dem“),
   entscheidet nicht der Fall über richtig und falsch, und der Vergleich sagt nichts.
   Mehrdeutige Formen — „den“ ist Akkusativ Singular und Dativ Plural — bleiben ebenfalls
   ungeprüft; beides steht unten in der Zahl. */
const wortzahl = t => String(t).toLowerCase().replace(/[^a-zäöüß ]/g, " ").split(/\s+/).filter(Boolean).length;
const reineForm = t => wortzahl(t) > 0 && traeger(t).length === wortzahl(t);
let entschieden = 0;
const zweitRichtig = [];
ALLE.forEach(x => {
  const soll = sollFall(x);
  if (!soll || !reineForm(x.richtig)) return;
  x.falsch.forEach(o => {
    const tr = traeger(o);
    if (!reineForm(o) || tr.length !== 1 || FORM[tr[0]].length !== 1) return;
    entschieden++;
    if (FORM[tr[0]][0] === soll)
      zweitRichtig.push(x.e.w + "#" + (x.i + 1) + ": „" + o + "“ ist auch " + NAME[soll]);
  });
});
P.ok("Kein Ablenker steht eindeutig im verlangten Fall (" + entschieden + " entscheidbar)",
  !zweitRichtig.length, zweitRichtig.join(" · "));

/* Der ausgefüllte richtige Satz ist eigener korrekter Bestand — der Textcheck darf dort
   nicht hart anschlagen. Täte er es, widerspräche die App sich selbst. */
const fehlalarm = [];
ALLE.forEach(x => {
  const satz = x.satz.replace("___", () => x.richtig);
  const t = daten(w, 'analyse(' + JSON.stringify(satz) + ').finds.filter(f=>f.c.sev==="hart").map(f=>f.c.id)');
  if (t.length) fehlalarm.push(x.e.w + " (" + t.join("/") + ")");
});
P.ok("Richtige Satzform löst keine harte Meldung aus", !fehlalarm.length, fehlalarm.join(" · "));

/* Die Etikettform lebt weiter: dort darf die richtige Antwort der Fallangabe nicht
   widersprechen. Genau das war bei „in (Richtung)“ und „auf (Richtung)“ der Fall. */
const widerspruch = POOL.filter(e => {
  const direkt = Object.keys(NAME).find(k => NAME[k] === e.k);
  return direkt && e.ans !== NAME[direkt];
});
P.ok("Etikett-Antwort und Fallangabe sagen dasselbe", !widerspruch.length,
  widerspruch.map(e => e.w + ": " + e.k + " vs. " + e.ans).join(" · "));

/* ---------- C · Unterwegs ---------- */
P.titel("C · Unterwegs");
const frage = e => daten(w, 'caseQuestion(CASEREF.find(x=>x.w===' + JSON.stringify(e.w) + '))');
const FRAGEN = MIT.map(e => ({ e, q: frage(e) }));

const gleichKlang = FRAGEN.filter(({ q }) => {
  const flach = q.opts.map(o => norm(o).replace(/[^a-zäöüß0-9 ]/g, ""));
  return new Set(flach).size !== flach.length;
});
P.ok("Optionen hörbar unterscheidbar", !gleichKlang.length, gleichKlang.map(x => x.e.w).join(", "));

const stumm = FRAGEN.filter(({ q }) =>
  !/Lücke/.test(daten(w, "sprechbar(" + JSON.stringify(q.q) + ")")));
P.ok("Die Lücke wird mitgesprochen", !stumm.length, stumm.map(x => x.e.w).join(", "));

const falschMarkiert = FRAGEN.filter(({ e, q }) =>
  !fassungen(e).some(f => q.opts[q.ans] === f[1]));
P.ok("Die erste Option ist die richtige", !falschMarkiert.length,
  falschMarkiert.map(x => x.e.w).join(", "));
const schluesselWeg = FRAGEN.filter(({ e, q }) => q.key !== "c:" + e.w);
P.ok("Kartenschlüssel unverändert", !schluesselWeg.length, schluesselWeg.map(x => x.e.w).join(", "));

const vorn = FRAGEN.filter(({ q }) => q.ans === 0).length;
P.ok("Antwortposition streut", vorn > 0 && vorn < FRAGEN.length,
  vorn + " von " + FRAGEN.length + " vorn");

/* Karten mit zwei Fassungen müssen über die Tage auch beide zeigen — sonst übt Nils
   die halbe Karte nie. Geprüft am Tagesseed über einen Monat. */
const einseitig = MIT.filter(e => fassungen(e).length > 1).filter(e => {
  const gesehen = daten(w, '(function(){const g={};for(let i=1;i<=31;i++){' +
    'const d="2026-09-"+String(i).padStart(2,"0");' +
    'const r=rng(hash("c:' + e.w.replace(/"/g, '\\"') + '|"+d));' +
    'g[Math.floor(r()*' + fassungen(e).length + ')]=1;}return Object.keys(g);})()');
  return gesehen.length < fassungen(e).length;
});
P.ok("Beide Fassungen kommen dran", !einseitig.length, einseitig.map(e => e.w).join(", "));

/* ---------- D · Abdeckung ---------- */
P.titel("D · Abdeckung");
/* Bewusst in der Etikettform: Zweifelsfälle, bei denen kein Ablenker sicher falsch wäre.
   Bei „lehren“ kommt der Dativ der Person vor und gilt nur als schwächer.
   Neue Karten sollen hier auffallen, statt still in der Etikettform zu bleiben. */
const ETIKETT = ["lehren"];
const unerwartet = OHNE.filter(e => !ETIKETT.includes(e.w)).map(e => e.w);
P.ok("Nur die bekannten Karten ohne Satzform (" + OHNE.length + ")", !unerwartet.length,
  unerwartet.join(", "));
const verschwunden = ETIKETT.filter(x => !OHNE.some(e => e.w === x));
P.ok("Die Ausnahmenliste ist aktuell", !verschwunden.length, verschwunden.join(", "));

const ALLQ = new Set(daten(w, 'ALL.map(i=>i.q)').map(norm));
const doppelUeb = ALLE.filter(x => ALLQ.has(norm(x.satz)));
P.ok("Keine Satzform doppelt eine Übung", !doppelUeb.length,
  doppelUeb.map(x => x.e.w).join(", "));

P.info(MIT.length + " Karten in Satzform (" + ALLE.length + " Fassungen) · " +
       OHNE.length + " in Etikettform");
P.info(offen.length + " Fassungen ohne maschinell prüfbare Form: " + offen.slice(0, 8).join(", ") +
       (offen.length > 8 ? " …" : ""));

P.abschluss();
