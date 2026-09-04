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
