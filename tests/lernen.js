/* Lernlogik: erster Start, Einstufung, Lernplan, Kartenrückweg,
   und ein Langzeitlauf über 180 Tage reinen Unterwegs-Übens. */

const { boot, tag, leererStand, daten, schluessel, pruefer } = require("./setup");
const P = pruefer("A · Erster Start und Einstufung");

/* ---------- A · Neuling ---------- */
{
  const w = boot(leererStand({ auto: false }));
  const d = w.document;
  P.ok("Startseite gefüllt", d.querySelector("#dailyHost").textContent.length > 20);
  P.ok("kein Lernplan vorhanden", daten(w, "S.plan") === null);
  P.ok("Unterwegs-Karte da", !!d.querySelector("#walkHost .walkcard"));

  const einstieg = [...d.querySelectorAll("button")].find(b => /Einstufung/i.test(b.textContent));
  P.ok("Einstufung wird angeboten", !!einstieg);
  einstieg.click();

  const los = [...d.querySelectorAll("#pSub button")].find(b => /Test|Loslegen|Starten|Beginnen/i.test(b.textContent))
    || d.querySelector("#pSub button");
  P.ok("Startknopf im Einstufungsbereich", !!los,
    [...d.querySelectorAll("#pSub button")].map(b => b.textContent.trim()).join(" | "));
  los.click();

  let n = 0;
  while (daten(w, "!!(Q && !Q.done)") && n < 80) {
    const q = daten(w, "({t:Q.list[Q.i].type, a:Q.list[Q.i].ans, acc:Q.list[Q.i].accept||null})");
    if (q.t === "fill") {
      const inp = d.querySelector("#fillIn");
      inp.value = q.acc ? q.acc[0] : "x";
      d.querySelector("#fillGo").click();
    } else {
      const opts = [...d.querySelectorAll(".opt")];
      opts[n % 3 === 0 ? (q.a === 0 ? 1 : 0) : q.a].click();
    }
    const weiter = d.querySelector("#nextBtn");
    if (!weiter) break;
    weiter.click();
    n++;
  }
  P.ok("Test läuft durch (" + n + " Fragen)", n >= 25);
  P.ok("Niveau gespeichert", !!daten(w, "S.level"));

  const machen = d.querySelector("#pMake");
  P.ok("Plan wird angeboten", !!machen);
  if (machen) {
    machen.click();
    const plan = daten(w, "S.plan");
    P.ok("Lernplan angelegt", !!plan && Array.isArray(plan.order) && plan.order.length > 0);
    const lvl = daten(w, "S.level");
    const schwaechster = Object.keys(lvl).sort((a, b) => lvl[a] - lvl[b])[0];
    P.ok("Plan beginnt beim schwächsten Bereich", plan.order[0] === schwaechster,
      plan.order[0] + " statt " + schwaechster);

    const zeile = String(w.eval("planLine()")).replace(/<[^>]+>/g, " ");
    P.ok("Wochenschwerpunkt wird angezeigt", /Woche/i.test(zeile), zeile.slice(0, 120));

    const fokus = w.eval("planFocus()");
    const kats = daten(w, "buildDaily().map(q=>q.cat)");
    const anteil = kats.filter(c => c === fokus).length / kats.length;
    P.ok("Tagesaufgabe zieht aus dem Schwerpunkt", anteil >= 0.25, Math.round(anteil * 100) + " %");
  }

  d.querySelector("#wkNew").click();
  P.ok("Unterwegs-Runde startet danach", d.body.classList.contains("walk") && daten(w, "Q.list.length") === 20);
}

/* ---------- B · Kartenrückweg: jede Sorte muss wiederkommen ---------- */
P.titel("B · Rückweg aller Kartenarten");
{
  const w = boot(leererStand({ auto: false }));
  const K = schluessel(w);
  const proben = [K.aufgaben[3], K.woerter[3], K.faelle[3]];
  proben.forEach(k => {
    const frage = daten(w, "(function(){var q=frageZuSchluessel(" + JSON.stringify(k) + ");return q?{key:q.key,type:q.type,cat:q.cat}:null})()");
    P.ok("Schlüssel " + k + " löst auf", !!frage && frage.key === k, JSON.stringify(frage));
  });
  // nach Bewertung fällig setzen und prüfen, dass die Karte wieder auftaucht
  proben.forEach(k => {
    w.eval("grade(" + JSON.stringify(k) + ", false, 'gram', null);" +
      "S.cards[" + JSON.stringify(k) + "].d = " + JSON.stringify(tag(-1)) + "; save();");
  });
  const faellig = daten(w, "(function(){var n=[];" +
    "ALL.forEach(function(i){if(isDue(i.id))n.push(i.id)});" +
    "WORDS.forEach(function(x){if(isDue('w:'+x.w))n.push('w:'+x.w)});" +
    "drillDue().forEach(function(e){n.push('c:'+e.w)});return n})()");
  proben.forEach(k => P.ok("Karte " + k + " kehrt zurück", faellig.includes(k)));
  P.ok("countDue zählt alle Sorten", daten(w, "countDue()") >= 3, daten(w, "countDue()"));
}

/* ---------- C · Langzeitlauf: 180 Tage nur unterwegs ---------- */
P.titel("C · Langzeitlauf (180 Tage, 3 Runden am Tag)");
{
  const w = boot(leererStand({ auto: false }));
  const K = schluessel(w);
  const gesamt = K.aufgaben.length + K.woerter.length + K.faelle.length;
  const BOXES = daten(w, "BOXES");
  const cards = {};
  const gesehen = new Set();
  let leereRunden = 0, kurzeRunden = 0, zieltage = 0, hoechstOffen = 0;

  const heute = n => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    d.setHours(12, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  };

  // vereinfachtes Abbild der App-Logik: fällig → neu → am längsten nicht geübt
  for (let t = 0; t < 180; t++) {
    const datum = heute(t);
    let heuteKarten = 0;
    for (let r = 0; r < 3; r++) {
      const faellig = Object.keys(cards).filter(k => cards[k].d <= datum)
        .sort((a, b) => cards[a].d.localeCompare(cards[b].d));
      const neu = [...K.aufgaben, ...K.woerter, ...K.faelle].filter(k => !cards[k]);
      const alt = Object.keys(cards).sort((a, b) => (cards[a].s || 0) - (cards[b].s || 0));
      const runde = [];
      const nimm = liste => liste.forEach(k => { if (runde.length < 20 && !runde.includes(k)) runde.push(k); });
      nimm(faellig); nimm(neu); nimm(alt);
      if (!runde.length) { leereRunden++; continue; }
      if (runde.length < 20) kurzeRunden++;
      runde.forEach(k => {
        gesehen.add(k);
        const c = cards[k] || { b: 0, s: 0, w: 0 };
        const richtig = Math.random() > 0.2;
        c.b = richtig ? Math.min((c.s ? c.b + 1 : 2), BOXES.length) : 1;
        if (!richtig) c.w = (c.w || 0) + 1;
        c.s = (c.s || 0) + 1;
        c.d = heute(t + BOXES[c.b - 1]);
        cards[k] = c;
        heuteKarten++;
      });
      const offen = Object.keys(cards).filter(k => cards[k].d <= datum).length;
      if (offen > hoechstOffen) hoechstOffen = offen;
    }
    if (heuteKarten >= 12) zieltage++;
  }
  P.info("gesehen: " + gesehen.size + " von " + gesamt + " Karten");
  P.info("Tage mit Tagesziel: " + zieltage + " von 180 · Höchststand offener Karten: " + hoechstOffen);
  P.ok("kein Tag ohne Stoff", leereRunden === 0, leereRunden);
  P.ok("keine unvollständigen Runden", kurzeRunden === 0, kurzeRunden);
  P.ok("Tagesziel jeden Tag erreichbar", zieltage === 180, zieltage);
  P.ok("alle Karten kommen dran", gesehen.size === gesamt, gesehen.size + "/" + gesamt);
  P.ok("Rückstand bleibt beherrschbar", hoechstOffen < 260, hoechstOffen);
}

/* ---------- D · Was sitzt ---------- */
P.titel("D · Was sitzt");
{
  const w = boot(leererStand());
  const gesamt = daten(w, "alleSchluessel().length");
  const K = daten(w, "alleSchluessel()");

  const leer = daten(w, "retention()");
  P.ok("Leerer Stand: nichts sitzt, nichts im Aufbau", leer.sicher === 0 && leer.aufbau === 0,
    JSON.stringify(leer));
  P.ok("Leerer Stand: alles steht noch aus", leer.neu === gesamt, leer.neu + "/" + gesamt);
  P.info("Bestand: " + gesamt + " Karten");

  /* Die Aussage im Fortschritt lautet: Fach 4 heißt drei richtige Antworten nacheinander.
     Genau das wird hier über grade() nachgerechnet, nicht angenommen. */
  const nachDrei = daten(w, '(function(){const k=' + JSON.stringify(K[0]) +
    ';for(let i=0;i<3;i++) grade(k,true);return S.cards[k].b;})()');
  P.ok("Drei richtige Antworten führen auf Fach 4", nachDrei === 4, "Fach " + nachDrei);
  P.ok("Nach drei richtigen Antworten sitzt genau eine Karte",
    daten(w, "retention().sicher") === 1, daten(w, "retention().sicher"));

  const nachZwei = daten(w, '(function(){const k=' + JSON.stringify(K[1]) +
    ';for(let i=0;i<2;i++) grade(k,true);return {b:S.cards[k].b,r:retention()};})()');
  P.ok("Zwei richtige Antworten reichen nicht", nachZwei.b === 3 && nachZwei.r.sicher === 1,
    "Fach " + nachZwei.b + ", sicher " + nachZwei.r.sicher);
  P.ok("Die halb gelernte Karte zählt als im Aufbau", nachZwei.r.aufbau === 1, nachZwei.r.aufbau);

  /* Eine falsche Antwort setzt auf Fach 1 zurück — dann darf die Zahl nicht stehen bleiben */
  const nachFehler = daten(w, '(function(){grade(' + JSON.stringify(K[0]) + ',false);return retention();})()');
  P.ok("Ein Fehler nimmt die Karte wieder heraus", nachFehler.sicher === 0, nachFehler.sicher);

  const summe = daten(w, "(function(){const r=retention();return r.sicher+r.aufbau+r.neu===r.gesamt;})()");
  P.ok("Die drei Zahlen ergeben den Bestand", summe);

  /* Ein Schlüssel, den es nicht mehr gibt, darf die Zahl nicht aufblähen */
  const fremd = daten(w, '(function(){S.cards["k-gibtsnicht"]={b:5,d:"2030-01-01",s:9,w:0};' +
    'const r=retention();return r.sicher+r.aufbau+r.neu===r.gesamt&&r.gesamt===' + gesamt + ';})()');
  P.ok("Unbekannte Schlüssel verfälschen nichts", fremd);
}

/* ---------- E · Die Anzeige nennt dieselbe Zahl ---------- */
P.titel("E · Anzeige");
{
  const w = boot(leererStand());
  const K = daten(w, "alleSchluessel()");
  daten(w, '(function(){' + K.slice(0, 5).map(k =>
    'for(let i=0;i<3;i++) grade(' + JSON.stringify(k) + ',true);').join("") + 'return 1;})()');
  const r = daten(w, "retention()");
  P.ok("Fünf Karten sitzen", r.sicher === 5, r.sicher);

  const d = w.document;
  [...d.querySelectorAll(".tabs button")].find(b => /Fortschritt/i.test(b.textContent)).click();
  /* Am konkreten Element prüfen, nicht am Seitentext — sonst misst der Test das Falsche */
  const block = [...d.querySelectorAll("#statHost .card")]
    .find(c => /Was sitzt/i.test(c.querySelector(".eyebrow") ? c.querySelector(".eyebrow").textContent : ""));
  P.ok("Der Block „Was sitzt“ steht im Fortschritt", !!block);
  if (block) {
    const zahlen = [...block.querySelectorAll(".stat b")].map(b => Number(b.textContent));
    P.ok("Die Anzeige nennt dieselbe Zahl wie die Rechnung",
      zahlen[0] === r.sicher && zahlen[1] === r.aufbau && zahlen[2] === r.neu,
      zahlen.join("/") + " statt " + [r.sicher, r.aufbau, r.neu].join("/"));
    const balken = block.querySelectorAll(".bar.stapel > i");
    P.ok("Der Balken hat drei Abschnitte", balken.length === 3, balken.length);
    P.ok("Der Balken erklärt sich im Text",
      /Fach 4|drei richtige|3 richtige/i.test(block.textContent));
  }
}

P.abschluss();
