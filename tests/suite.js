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

/* ---------- A · Datenbestand ---------- */
const ids = new Set();
let doppelt = 0;
ALL.forEach(i => { if (ids.has(i.id)) doppelt++; ids.add(i.id); });
P.ok("Aufgaben-IDs eindeutig (" + ALL.length + ")", doppelt === 0, doppelt);

const rids = new Set(RA.map(r => r.id));
P.ok("Regel-IDs eindeutig (" + RA.length + ")", rids.size === RA.length);
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

/* Fehlerklasse: HTML in einem Feld, das bei der Ausgabe durch esc() geht.
   Die Auszeichnung erscheint dann wörtlich auf dem Bildschirm — „<b>fachliche</b>“
   statt fett. Kein Fehler, den ein Syntaxlauf sieht, und in der Wortliste stand er
   unbemerkt drin. Regeltexte (r.b) und Satzkarten (x.b) sind ausgenommen: Die sind
   absichtlich HTML und werden nicht escapet. */
const ROH = /<\/?[a-z][a-z0-9]*(\s[^<>]*)?>/i;
const escapt = [
  ["Wortkarte", WORDS, ["w", "p", "d", "ex", "s", "t"], x => x.w],
  ["Fallkarte", CASEREF, ["w", "t", "k", "ex", "n"], x => x.w],
  ["Regeltitel", RA, ["t"], x => x.id],
  ["Satzkarte", SATZ, ["t", "short"], x => x.id]
];
const roh = [];
escapt.forEach(([art, liste, felder, id]) => {
  (liste || []).forEach(x => felder.forEach(f => {
    if (x && x[f] && ROH.test(String(x[f]))) roh.push(art + " " + id(x) + "." + f);
  }));
});
P.ok("Keine HTML-Auszeichnung in Feldern, die escapet werden", !roh.length, roh.join(" · "));

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
/* „nicht falsch“ und „keine der beiden Formen ist falsch“ sind Freisprüche, keine Urteile.
   Ohne diese Ausnahme meldet der Lauf jeden Beleg, der eine Form ausdrücklich in Schutz
   nimmt — genau das ist beim Beleg zu stehen/sitzen/liegen passiert. „nicht korrekt“ bleibt
   bewusst ein hartes Urteil und wird hier nicht erfasst. */
const FREISPRUCH = /\b(nicht|nie)\s+falsch\b|\bkein\w*\b[^.;!?]{0,45}?\b(ist|sind)\s+falsch\b/i;
const H = {}, WCH = {};
stellen.forEach(s => {
  const re = /„([^“]{4,60})“/g;
  let m;
  while ((m = re.exec(s.t))) {
    const z = m[1].toLowerCase().replace(/\s+/g, " ").trim();
    const u = s.t.slice(Math.max(0, m.index - 90), m.index + m[1].length + 90);
    if (HART.test(u) && !FREISPRUCH.test(u)) (H[z] = H[z] || []).push(s.id);
    if (WEICH.test(u)) (WCH[z] = WCH[z] || []).push(s.id);
  }
});
const streit = Object.keys(H).filter(z => WCH[z] &&
  [...new Set(H[z])].join() !== [...new Set(WCH[z])].join());
P.ok("Kein Urteil widerspricht sich (hart vs. relativiert)", !streit.length, streit.join(" · "));

/* Fehlerklasse: Die App fällt ihr Urteil auf zwei Wegen — mit Worten („ist falsch“) und
   mit der Auszeichnung <span class="nope">. Die Prüfung oben liest nur die Worte, weil
   strip() die Tags entfernt. So stand „das Auto von meinem Bruder“ in Rot und wurde in
   derselben Zeile als umgangssprachlich bezeichnet; „wegen dem Wetter“ stand in Rot,
   während drei andere Stellen es als verbreitet einordneten. Der Duden führt beide als
   umgangssprachlich — also nicht als falsch.

   Seitdem gibt es drei Stufen: ok (standardsprachlich), ugs (umgangssprachlich oder
   regional, aber nicht falsch) und nope (falsch). Diese Prüfung hält sie auseinander. */
const AUSZEICHNUNG = /<span class="(nope|ugs)">([\s\S]{2,120}?)<\/span>/g;
const WEICHWORT = /\b(umgangssprachlich|landschaftlich|regional|südwestdeutsch|schweizerisch|österreichisch|gesprochen sehr verbreitet)\b/i;

const rotUndWeich = [];
const traeger = [];
RA.forEach(r => traeger.push({ id: r.id, h: r.b }));
SATZ.forEach(x => traeger.push({ id: x.id, h: x.b }));
ALL.forEach(i => { traeger.push({ id: i.id, h: i.e }); traeger.push({ id: i.id, h: i.q }); });

traeger.forEach(t => {
  const h = String(t.h || "");
  let m;
  const re = new RegExp(AUSZEICHNUNG.source, "g");
  while ((m = re.exec(h))) {
    if (m[1] !== "nope") continue;
    /* Nur das unmittelbare Umfeld derselben Auszeichnung, nicht der ganze Regeltext:
       Ein Fehler darf in einer Regel stehen, die anderswo Regionales bespricht. */
    const nah = strip(h.slice(m.index + m[0].length, m.index + m[0].length + 70));
    if (WEICHWORT.test(nah)) rotUndWeich.push(t.id + ": „" + strip(m[2]).slice(0, 40) + "“");
  }
});
P.ok("Keine rot markierte Form wird zugleich als umgangssprachlich bezeichnet",
  !rotUndWeich.length, [...new Set(rotUndWeich)].join(" · ")
  + " — entweder falsch (nope) oder umgangssprachlich (ugs), nicht beides");

/* Die Gegenrichtung: Was die App als ugs auszeichnet, darf nirgends „ist falsch“ heißen. */
const ugsFormen = [];
traeger.forEach(t => {
  const h = String(t.h || "");
  let m;
  const re = new RegExp(AUSZEICHNUNG.source, "g");
  while ((m = re.exec(h))) if (m[1] === "ugs") ugsFormen.push(strip(m[2]).replace(/[„“]/g, "").toLowerCase());
});
const ugsAlsFalsch = [];
stellen.forEach(s2 => {
  const t = s2.t.toLowerCase();
  [...new Set(ugsFormen)].forEach(f => {
    if (f.length < 8) return;
    const i = t.indexOf(f);
    if (i < 0) return;
    if (HART.test(s2.t.slice(Math.max(0, i - 90), i + f.length + 90))) ugsAlsFalsch.push(s2.id + ": „" + f.slice(0, 40) + "“");
  });
});
P.ok("Keine als umgangssprachlich ausgezeichnete Form heißt anderswo falsch (" + [...new Set(ugsFormen)].length + " Formen)",
  !ugsAlsFalsch.length, [...new Set(ugsAlsFalsch)].join(" · "));

/* ---------- D · Textcheck ---------- */
P.titel("D · Textcheck");
const muster = daten(w, "CHECKS_ALL.map(c=>({id:c.id,re:String(c.re),sev:c.sev}))");
const kaputt = muster.filter(c => /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(c.re));
P.ok("Prüfmuster ohne Steuerzeichen (" + muster.length + ")", !kaputt.length, kaputt.map(c => c.id).join(","));

const stumm = daten(w, 'CHECKS_ALL.filter(c=>{try{return "Probe".match(c.re)===undefined}catch(e){return true}}).map(c=>c.id)');
P.ok("Alle Prüfmuster ausführbar", !stumm.length, stumm.join(","));

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
ALL.forEach(i => { if (i.t !== "fill") korpus.push([i.id, strip(i.o[i.a])]); });
CASEREF.forEach(e => korpus.push(["c:" + e.w, e.ex]));
WORDS.forEach(x => korpus.push(["w:" + x.w, x.ex]));

/* Geprüft werden hart, pruef und form — nicht stil.

   Stilhinweise sollen auf korrektem Text ansprechen: „man muss“, Füllwörter, „Es gibt“
   am Satzanfang sind einwandfreies Deutsch, über das die App trotzdem etwas sagen will.
   Sie hier einzubeziehen hieße, die App entgegen Grundsatz 3 umzuschreiben — Stil ist
   keine Regel. Die drei anderen Schärfegrade behaupten dagegen ein Problem, und eine
   Meldung auf sauberem Text kostet dort Vertrauen.

   Ausgenommen sind Lehrstücke: Karten, die das Phänomen selbst behandeln, müssen es
   enthalten. Die Wortkarte zu scheinbar/anscheinend kommt ohne „scheinbar“ nicht aus.
   Solche Paare stehen hier einzeln, damit ein neues nicht unbemerkt dazukommt. */
const LEHRSTUECK = {
  "f25|a06": "Die Aufgabe lehrt Beobachtung statt Bewertung und muss „unzuverlässig“ zeigen.",
  "w:scheinbar / anscheinend|y04": "Die Karte erklärt genau dieses Wortpaar.",
  "w:das Gleiche / dasselbe|y05": "Dieselbe Karte, dasselbe Muster."
};
const HARTE_SCHAERFE = ["hart", "ugs", "pruef", "form"];

const fehlalarm = [], benutzt = new Set();
let gekuerzt = 0;
korpus.forEach(([id, roh]) => {
  const t = ohneZitat(String(roh || ""));
  if (t !== roh) gekuerzt++;
  if (!t || t.length < 6) return;
  const treffer = daten(w, "analyse(" + JSON.stringify(t) + ").finds.map(f=>({id:f.c.id,sev:f.c.sev}))")
    .filter(f => HARTE_SCHAERFE.includes(f.sev));
  treffer.forEach(f => {
    const schluessel = id + "|" + f.id;
    if (LEHRSTUECK[schluessel]) { benutzt.add(schluessel); return; }
    fehlalarm.push(f.sev + " " + f.id + " bei " + id + ": „" + t.slice(0, 46) + "“");
  });
});
P.ok("Keine Meldung auf korrektem Material (hart, ugs, pruef, form)", !fehlalarm.length,
  fehlalarm.slice(0, 5).join(" · ") + (fehlalarm.length > 5 ? " …(" + fehlalarm.length + ")" : "")
  + " — beheben oder als Lehrstück eintragen");

const totesLehrstueck = Object.keys(LEHRSTUECK).filter(k => !benutzt.has(k));
P.ok("Kein totes Lehrstück in der Liste", !totesLehrstueck.length,
  totesLehrstueck.join(", ") + " löst nichts mehr aus — aus LEHRSTUECK streichen");

if (gekuerzt) P.info(gekuerzt + " Einträge zitieren eine Falschform — dort nur der Text außerhalb der Zitate geprüft");
P.info("Stilhinweise bleiben außen vor: Sie sollen auf korrektem Text ansprechen");

/* Der Korpus oben besteht aus dem eigenen Bestand — er deckt nur ab, was die App
   ohnehin enthält. Genau daran ist x18 vorbeigekommen: /\bseit\s+ihr\b/ ohne i-Flag
   schlug hart auf „…, seit ihr gewonnen habt“ an — korrektes Deutsch — und schwieg bei
   „Seit ihr schon da?“, dem eigentlichen Fehler. Weil nirgends in der App „seit ihr“
   vorkam, fiel nichts auf.

   Deshalb dieser zweite Korpus: von Hand geschriebene, zweifelsfrei richtige Sätze, die
   die App nie gesehen hat. Sie decken die Bereiche ab, in denen die Muster arbeiten.
   Kein Satz hier darf eine Meldung auslösen. Wer ein Muster ergänzt, sollte einen Satz
   dazuschreiben, der knapp danebenliegt. */
const SAUBER = [
  "Seid ihr schon da?",
  "Das ist so, seit ihr gewonnen habt.",
  "Es geht bergauf, seit ihr Vater wieder trainiert.",
  "Seit dem Praktikum weiß er, worauf es ankommt.",
  "Wir sprechen mit dem Kollegen über den Trainingsplan.",
  "Für den Praktikanten war die erste Woche anstrengend.",
  "Er hat versucht, pünktlich zu sein.",
  "Er hat versucht zu kommen.",
  "Du brauchst nicht extra zu kommen.",
  "Er scheint das Training zu genießen.",
  "Er trainiert, um sich zu verbessern.",
  "Wegen des Wetters fällt das Training aus.",
  "Die Reflexion des Praktikums fiel kurz aus.",
  "Die Halle, in der wir trainieren, wird saniert.",
  "Er lief schneller als ich.",
  "Sie ist so schnell wie ich.",
  "Er lief schneller, als ich erwartet hatte.",
  "Das Ergebnis ist eindeutig: Die Methode funktioniert.",
  "Mitzubringen sind: Schuhe, Handtuch, Trinkflasche.",
  "Wir haben Zeit bis nächsten Montag.",
  "Er gab die Tasche samt allem Zubehör ab.",
  "Ich helfe ihm beim Aufbau der Geräte.",
  "Wir danken ihr für die Vertretung.",
  "Von 1990 bis 1995 spielte er im Verein.",
  "Der Zeitraum 1990–1995 ist gut belegt.",
  "Des Weiteren fehlt die Auswertung der Fragebögen.",
  "Im Allgemeinen sind die Ergebnisse stabil.",
  "Sie war müde, trotzdem lief sie weiter.",
  "Er packte die Tasche, und sie schloss die Tür.",
  "Je länger er trainierte, desto ruhiger wurde sein Puls.",
  "Vorausgesetzt, dass alle zusagen, findet der Ausflug statt.",
  "Von der Hitze erschöpft, brach sie das Training ab.",
  "Der Plan, täglich zu laufen, war ambitioniert.",
  "Nicht die Technik war das Problem, sondern die Kondition.",
  "Die Stichprobe umfasste 24 Schülerinnen und Schüler.",
  "Er fragte, wann sie kommt.",
  "Sie sagte: „Das machen wir anders.“",
  "Er nannte das eine gute Idee.",
  "Das Training fällt aus (wegen des Wetters).",
  "Bitte melde dich, sobald du angekommen bist.",
  "Ihr seid dem Verein beigetreten.",
  "Ihr seid der Einladung gefolgt.",
  "Ihr alle seid dem Verein beigetreten.",
  "Ihr seid Anfang Mai dabei gewesen.",
  "Trotz allem hat er weitergemacht.",
  "Wir sprechen mit dem Kollegen über den Ablauf.",
  "Das Trainingslager fand in 2000 Metern Höhe statt.",
  "Er mass die Strecke sorgfältig aus.",
  "Die Standarten der Vereine wehten am Eingang.",
  "Er trainiert voraussichtlich bis Ostern weiter.",
  "Das interessiert uns sehr.",
  "Das interessiert euch bestimmt auch.",
  "Das kostet uns viel Zeit.",
  "Er ruft uns zu, dass es losgeht.",
  "Sie rief mir nach, ich solle warten.",
  "Wider Erwarten hat es geklappt.",
  "Er will dem Vorschlag widersprechen.",
  "Das spiegelt die Lage wider.",
  "Er nutzt z. B. Intervalle im Training.",
  "Der Kurs kostet 20 % mehr als geplant.",
  "Nach § 5 der Prüfungsordnung ist das zulässig.",
  "Im weiteren Verlauf wurde es ruhiger.",
  "Im folgenden Kapitel steht die Auswertung.",
  "Sie sprach etwas leise.",
  "Er hat viel bessere Chancen.",
  "Wer fragte das?",
  "Das Obst ist faul geworden.",
  "Die Temperatur lag bei 12 °C.",
  "Siehe S. 12 und Abb. 3.",
  "Mit wem hast du gesprochen?",
  "Er hat viel Gutes bewirkt.",
  "Er findet die Anwendung gut.",
  "Das Verfahren wird im Training angewendet."
];

const fremdalarm = [];
SAUBER.forEach(t => {
  daten(w, "analyse(" + JSON.stringify(t) + ").finds.map(f=>({id:f.c.id,sev:f.c.sev}))")
    .filter(f => HARTE_SCHAERFE.includes(f.sev))
    .forEach(f => fremdalarm.push(f.sev + " " + f.id + ": „" + t + "“"));
});
P.ok("Keine Meldung auf fremdem korrektem Deutsch (" + SAUBER.length + " Sätze)",
  !fremdalarm.length, fremdalarm.slice(0, 4).join(" · "));

/* Die Gegenrichtung: Ein Muster, das nichts findet, fällt nirgends auf. Genau so
   war x18 halb tot — und acht weitere Muster hatten dieselbe blinde Stelle: Ohne
   i-Flag greifen sie nur mitten im Satz, nicht am Satzanfang. „Weil ich hab keine
   Zeit“ wurde übersehen, „…, weil ich hab keine Zeit“ erkannt.

   Jeder Eintrag hier ist ein bewusst falscher Satz mit dem Muster, das ihn fangen
   muss — und steht in der Schreibung, in der er am ehesten vorkommt: am Satzanfang. */
const FEHLER = [
  ["Seit ihr schon da?", "x18"],
  ["Weil ich hab keine Zeit, komme ich später.", "y03"],
  ["In 2026 beginnt das neue Semester.", "x24"],
  ["Von 1990–1995 spielte er im Verein.", "t06"],
  ["Der gleiche Fehler ist uns schon zweimal passiert.", "y05"],
  ["Dem Kollege habe ich das gesagt.", "x23"],
  ["Interessiert dir das überhaupt?", "x21"],
  ["Kostet mir das etwas?", "x22"],
  ["Ruft mir bitte morgen an.", "x20"],
  ["Die Reflektion des Praktikums war kurz.", "x27"],
  ["Er hat versucht die Prüfung zu bestehen.", "y11"],
  ["Seid dem Sommer trainiert er wieder.", "x17"],
  ["Während dem Training hat er sich verletzt.", "x03"],
  ["Er ist schneller als wie ich.", "x05"],
  ["Das war die optimalste Lösung.", "x07"],
  ["Ich möchte dem wiedersprechen.", "x15"],
  ["Mit freundlichen Grüßen,\nNils Otten", "x25"],
  ["Die Quote lag bei 80% der Gruppe.", "t03"],
  ["Er trainiert täglich um seine Ausdauer zu verbessern.", "y02"],
  ["Der Trainer, wo das gesagt hat, ist neu.", "y10"],
  ["Er wollte noch etwas sagen...", "t08"],
  ["Das Training - bei Regen in der Halle - beginnt um 17 Uhr.", "t10"],
  ["Ich bin wahrscheinlich zu blöd für diese Aufgabe.", "a07"],
  ["Wenn das Verfahren zur Anwendung kommt, ändert sich wenig.", "s02"],
  ["Ob das Sinn macht, weiß ich nicht.", "s06"],
  ["Der Plan wurde von dem Trainer geändert.", "a03"],
  ["Die Auswertung der Fragebögen hat gezeigt, dass die Gruppe im Verlauf der Intervention deutlich motivierter war als zu Beginn, was sich sowohl in der Anwesenheit als auch in der Bereitschaft zeigte, zusätzliche Einheiten mitzumachen und dabei über das geforderte Maß hinauszugehen.", "a04"],
  ["Ich hoffe, es geht Ihnen gut.", "f10"],
  ["Es tut mir leid, falls das missverständlich war.", "f12"],
  ["Ich versuche, den Bericht bis Freitag fertigzustellen.", "f13"],
  ["Nicht schlecht für den ersten Versuch.", "f14"]
];
const stummeMuster = [];
const belegteMuster = new Set();
FEHLER.forEach(([t, id]) => {
  const ids = daten(w, "analyse(" + JSON.stringify(t) + ").finds.map(f=>f.c.id)");
  ids.forEach(x => belegteMuster.add(x));
  if (!ids.includes(id)) stummeMuster.push(id + " findet nichts in „" + t + "“");
});
P.ok("Jedes benannte Muster greift auch am Satzanfang (" + FEHLER.length + " Fälle)",
  !stummeMuster.length, stummeMuster.join(" · "));

/* Kein Muster darf stumm bleiben. Die Hauptquelle ist der eigene Bestand an falschem
   Material — die Ablenker der Aufgaben und die Fehlersuchtexte sind bewusst fehlerhaftes
   Deutsch und belegen den Großteil der Muster von selbst, ohne Pflege. Was dort nicht
   vorkommt, steht oben im Handkorpus.

   Warum das nötig ist: x18 war halb tot und y10 fand seine eigene Musterformulierung
   nicht („der Mann, wo das gesagt hat“ — genau der Satz steht in gram-relkasus). Ein
   Muster, das nichts findet, fällt sonst nirgends auf. */
ALL.forEach(i => {
  if (i.t === "fill") return;
  i.o.forEach((o, n) => {
    if (n === i.a) return;
    const t = strip(o);
    if (t.length < 4) return;
    daten(w, "analyse(" + JSON.stringify(t) + ").finds.map(f=>f.c.id)").forEach(x => belegteMuster.add(x));
  });
});
KORREKTUR.forEach(t => {
  daten(w, "analyse(" + JSON.stringify(t.txt) + ").finds.map(f=>f.c.id)").forEach(x => belegteMuster.add(x));
});

const alleMuster = daten(w, "CHECKS_ALL.map(c=>c.id)");
const stummeIds = alleMuster.filter(id => !belegteMuster.has(id));
P.ok("Jedes Prüfmuster ist als wirksam belegt (" + alleMuster.length + ")",
  !stummeIds.length, stummeIds.join(", ") + " findet nirgends etwas — Beispielsatz in FEHLER nachtragen");

/* Die App kennt in Beispielen drei Stufen — ok, ugs, nope — und im Textcheck seit
   dieser Runde ebenfalls. Beide müssen dasselbe sagen: Was in einer Regel orange
   als „verbreitet, aber nicht falsch“ steht, darf der Textcheck nicht als „Klarer
   Fehler“ melden. Genau das tat er bei „wegen dem Wetter“, „größer wie“, „als wie“
   und „Ich rufe dir an“ — vier Formen, die die App selbst als ugs auszeichnet. */
const ugsFormenTC = [];
[].concat(RA.map(r => r.b), SATZ.map(x => x.b)).forEach(h => {
  const re = /<span class="ugs">([\s\S]{2,90}?)<\/span>/g;
  let m;
  while ((m = re.exec(String(h)))) {
    const f = strip(m[1]).replace(/[„“]/g, "");
    /* Die Legende in der Regelansicht zeichnet das Wort „orange“ selbst aus —
       das ist keine Sprachform. */
    if (f.length >= 6 && f !== "orange") ugsFormenTC.push(f);
  }
});
const zuHart = [];
[...new Set(ugsFormenTC)].forEach(f => {
  daten(w, "analyse(" + JSON.stringify(f) + ").finds.map(x=>({id:x.c.id,sev:x.c.sev}))")
    .filter(x => x.sev === "hart")
    .forEach(x => zuHart.push(x.id + " meldet „" + f + "“ als klaren Fehler"));
});
/* Wirksamkeit ist nicht Trefferquote. Ein Muster kann eine Formulierung finden und
   fünf andere desselben Fehlers durchlassen — x01 fing „wegen dem“, aber nicht „wegen
   meinem“, und das ist die häufigere Form. Hier steht je Muster eine Reihe von
   Varianten; alle müssen greifen. Wer eine Wortliste in einem Muster erweitert,
   erweitert hier die Reihe mit. */
const VARIANTEN = {
  x01: ["wegen dem Wetter", "wegen einem Fehler", "wegen meinem Bruder", "wegen seinem Knie",
        "wegen ihrem Auto", "wegen diesem Problem", "wegen unserem Plan", "wegen keinem Grund"],
  x02: ["trotz dem Regen", "trotz einem Sieg", "trotz meinem Einsatz", "trotz diesem Ergebnis"],
  x03: ["während dem Training", "während einem Spiel", "während meinem Praktikum",
        "während diesem Semester"],
  x04: ["größer wie", "schneller wie", "besser wie", "billiger wie", "teurer wie",
        "leichter wie", "früher wie", "später wie", "schöner wie", "lieber wie", "einfacher wie"],
  x17: ["Seid dem Sommer trainiert er wieder.", "Seid letztem Jahr läuft es besser.",
        "Seid Wochen ist die Halle gesperrt.", "Seid Montag ist er zurück."],
  x23: ["mit dem Kollege", "für den Mensch", "dem Nachbar", "den Doktorand", "dem Dozent",
        "den Referent", "dem Elefant", "den Absolvent"],
  x08: ["Das ist kein Standart.", "Die Standarts sind hoch."],
  x09: ["Das läuft seperat.", "Zwei seperate Listen.", "im seperaten Bereich"],
  x10: ["Er hat kein Rückrad.", "Das Rückrads war das Problem."],
  x14: ["Das war nicht vorraus zu sehen.", "Vorraussichtlich klappt es."],
  x24: ["In 2026 beginnt das Semester.", "Das war in 2025.", "in 2021 erschien die Studie"],
  x20: ["Ich rufe dir später an.", "Ruf mir an!", "Ich habe dir angerufen.", "Sie ruft ihm gleich an."],
  x21: ["Das interessiert mir nicht.", "Das interessiert dir doch nicht."],
  x22: ["Das kostet mir zu viel.", "Das kostet dir nur Zeit."],
  x15: ["Ich möchte dem wiedersprechen.", "Das wiederlegt die These.", "Es wiederspiegelt die Lage."],
  x16: ["Wieder Erwarten hat es geklappt."],
  t02: ["Er nutzt z.B. Intervalle.", "Das gilt d.h. für alle."],
  t03: ["Der Kurs kostet 20% mehr.", "Nur 5% blieben übrig."],
  t04: ["Nach §5 der Ordnung.", "Siehe §12 Absatz 3."],
  y07: ["Im weiteren fehlt die Auswertung.", "Des weiteren fehlt etwas.", "Im allgemeinen stimmt das."],
  y08: ["Er hat etwas neues ausprobiert.", "Da war nichts gutes dabei.", "Alles wichtiges steht drin."],
  t12: ["Er fragte, wann sie kommt?", "Sie fragte ihn, ob er kommt?"],
  a06: ["Der Schüler ist faul.", "Die Gruppe wirkt unmotiviert.", "Er arbeitet schlampig."],
  s02: ["Das Verfahren kommt im Training zur Anwendung.",
        "Wenn das Verfahren zur Anwendung kommt, ändert sich wenig.",
        "Neue Geräte kommen ab Mai zum Einsatz.",
        "Wir ziehen einen Wechsel in Erwägung.",
        "Die Methode findet breite Anwendung."]
};
const luecken = [];
let varianten = 0;
Object.entries(VARIANTEN).forEach(([id, liste]) => {
  liste.forEach(t => {
    varianten++;
    const ids = daten(w, "analyse(" + JSON.stringify(t) + ").finds.map(f=>f.c.id)");
    if (!ids.includes(id)) luecken.push(id + " übersieht „" + t + "“");
  });
});
P.ok("Die Muster finden auch die anderen Formen desselben Fehlers (" + varianten + " Varianten)",
  !luecken.length, luecken.slice(0, 5).join(" · "));

P.ok("Kein hartes Muster meldet eine als umgangssprachlich ausgezeichnete Form ("
  + [...new Set(ugsFormenTC)].length + " Formen)",
  !zuHart.length, zuHart.join(" · "));

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

P.abschluss();
