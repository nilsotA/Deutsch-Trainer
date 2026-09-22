/* Gekoppelte Sätze — die Bestände, die denselben Satz zweimal führen.

   Fehlerklasse „die Korrektur bleibt auf einer Ebene liegen“. Der Bestand der App ist
   stärker verzahnt, als er aussieht: Dieselbe Aussage steht oft wörtlich in einer Regel
   und in einer Übung, in einem Prüfmuster und in einem Vorher/Nachher-Paar, in einem
   Baustein und in einer Regel. Wer eine Formulierung an einer Stelle korrigiert und die
   andere übersieht, hinterlässt zwei Fassungen derselben Aussage — und Nils bekommt je
   nach Ansicht eine andere Auskunft.

   Am 21.09.2026 ist genau das passiert: Die Übung f06 bekam „Der Konjunktiv allein macht
   daraus noch keine Bitte …“, das Vorher/Nachher-Paar pr01 trug den alten Satz „Der
   Konjunktiv macht sie nicht höflicher, nur indirekter“ weiter. Beide Einträge teilten
   vorher drei Sätze, hinterher noch zwei — eine Prüfung auf Paarebene hätte geschwiegen.

   Deshalb wird auf Satzebene geprüft. tests/kopplungen.json hält fest, welcher Satz an
   welchen Stellen steht. Der Wächter in suite.js rechnet das nach und meldet genau den
   einen Fall: Ein Satz ist an manchen der gespeicherten Stellen noch da und an anderen
   nicht mehr — jemand hat eine Seite geändert und die andere stehen lassen. Ändern sich
   alle Seiten, verschwindet der Satz vollständig; das ist ein sauberer Umbau und bleibt
   still, der Eintrag wird nur noch als abgelaufen gezählt.

   Nicht mitgezählt werden Paare aus Regel und Satzkarte: RULES_SATZ wird über
   SATZ_RULEMAP aus SATZ erzeugt, beide tragen denselben Text von Haus aus.

   Neu erzeugen: npm run kopplungen (schreibt tests/kopplungen.json neu). Das gehört in
   denselben Commit wie die Änderung, die einen Satz umgeschrieben hat. */

const MINDESTWOERTER = 7;

/* Ein Satz zählt als derselbe, wenn er sich nur in Anführungszeichen, Leerraum und dem
   Schlusszeichen unterscheidet — „… klein weiter.“ und „… klein weiter:“ sind einer. */
const gleich = s => String(s).toLowerCase()
  .replace(/[„“”"»«‚‘']/g, "")
  .replace(/\s+/g, " ")
  .replace(/[.:;!?…,]+$/, "")
  .trim();

const strip = h => String(h).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function saetze(text) {
  return strip(text).split(/(?<=[.!?:;])\s+/)
    .map(s => s.trim().replace(/^[—·\-–]\s*/, ""))
    .filter(s => s.split(/\s+/).length >= MINDESTWOERTER);
}

/* Sammelt „Sorte id“ → Sätze über alle Bestände, die eigenen Text tragen. */
function stellenSammeln(daten, w) {
  const J = x => daten(w, x);
  const E = new Map();
  const nimm = (sorte, id, t) => {
    if (!t) return;
    const k = sorte + " " + id;
    if (!E.has(k)) E.set(k, []);
    saetze(t).forEach(s => E.get(k).push(s));
  };
  J('ALL.map(e=>({id:e.id,q:e.q||"",e:e.e||"",o:(e.o||[]).join(" · ")}))').forEach(e => {
    nimm("Übung", e.id, e.q); nimm("Übung", e.id, e.e); nimm("Übung", e.id, e.o);
  });
  J('WORDS.map(x=>({w:x.w,d:x.d||"",t:x.t||""}))').forEach(x => {
    nimm("Wortkarte", x.w, x.d); nimm("Wortkarte", x.w, x.t);
  });
  J('RULES_ALL.map(r=>({id:r.id,b:r.b}))').forEach(r => nimm("Regel", r.id, r.b));
  J('SATZ.map(s=>({id:s.id,b:s.b}))').forEach(s => nimm("Satzkarte", s.id, s.b));
  J('CASEREF.map(c=>({w:c.w,n:c.n||""}))').forEach(c => nimm("Fallkarte", c.w, c.n));
  J('TABLES.map(t=>({id:t.id,b:t.b}))').forEach(t => nimm("Tabelle", t.id, t.b));
  J('CHECKS_ALL.map(c=>({id:c.id,k:c.k||""}))').forEach(c => nimm("Prüfmuster", c.id, c.k));
  J('KORREKTUR.map((k,i)=>({id:"kt"+(i+1),k:(k.errs||[]).map(e=>e.k||"").join(" ")}))')
    .forEach(k => nimm("Fehlersuche", k.id, k.k));
  J('PROMPTS.map(p=>({id:p.id,tip:p.tip||"",model:p.model||""}))').forEach(p => {
    nimm("Schreibauftrag", p.id, p.tip); nimm("Schreibauftrag", p.id, p.model);
  });
  J('PHRASES.map(p=>({id:p.id,tip:p.tip||"",no:(p.no||[]).join(" · ")}))').forEach(p => {
    nimm("Baustein", p.id, p.tip); nimm("Baustein", p.id, p.no);
  });
  J('PAIRS.map(p=>({id:p.id,why:p.why||"",note:p.note||""}))').forEach(p => {
    nimm("Vorher/Nachher", p.id, p.why); nimm("Vorher/Nachher", p.id, p.note);
  });
  J('SCENES.map(p=>({id:p.id,why:p.why||"",alt:p.alt||""}))').forEach(p => {
    nimm("Situation", p.id, p.why); nimm("Situation", p.id, p.alt);
  });
  return E;
}

const istErzeugtesPaar = (a, b) => {
  const sa = a.split(" ")[0], sb = b.split(" ")[0];
  return (sa === "Regel" && sb === "Satzkarte") || (sa === "Satzkarte" && sb === "Regel");
};

/* Gruppen: ein Satz, der an mindestens zwei Stellen steht — Regel↔Satzkarte ausgenommen,
   sofern das die einzige Paarung ist. */
function gruppen(E) {
  const karte = new Map();
  for (const [stelle, liste] of E) liste.forEach(s => {
    const g = gleich(s);
    if (!karte.has(g)) karte.set(g, { satz: s, stellen: new Set() });
    karte.get(g).stellen.add(stelle);
  });
  const raus = [];
  for (const v of karte.values()) {
    const a = [...v.stellen].sort();
    if (a.length < 2) continue;
    if (a.length === 2 && istErzeugtesPaar(a[0], a[1])) continue;
    raus.push({ satz: v.satz, stellen: a });
  }
  raus.sort((x, y) => x.satz.localeCompare(y.satz));
  return raus;
}

module.exports = { gleich, saetze, stellenSammeln, gruppen, MINDESTWOERTER };
