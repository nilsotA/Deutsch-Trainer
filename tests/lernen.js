/* Lernlogik: erster Start, Einstufung, Lernplan, Kartenrückweg,
   und ein Langzeitlauf über 180 Tage reinen Unterwegs-Übens. */

const { tippe, boot, tag, leererStand, daten, schluessel, pruefer } = require("./setup");
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
      tippe(w, d.querySelector("#fillGo"));
    } else {
      const opts = [...d.querySelectorAll(".opt")];
      tippe(w, opts[n % 3 === 0 ? (q.a === 0 ? 1 : 0) : q.a]);
    }
    const weiter = d.querySelector("#nextBtn");
    if (!weiter) break;
    weiter.click();
    n++;
  }
  P.ok("Test läuft durch (" + n + " Fragen)", n >= 25);
  P.ok("Niveau gespeichert", !!daten(w, "S.level"));

  /* Die Einstufung trägt den ganzen Lernplan: makePlan() sortiert die Bereiche nach dem
     Ergebnis und macht den schwächsten zum ersten Wochenschwerpunkt. Ein Bereich, der gar
     nicht abgefragt wurde, bekäme in testAuswertung() den Wert 0 („t ? … : 0“) und stünde
     damit als schwächster vorn — ohne dass Nils dazu je eine Frage gesehen hätte.
     testQuestions() nimmt drei Fragen je Bereich aus dem Vorrat; schrumpft ein Vorrat unter
     drei, liefert die Schleife stillschweigend weniger. Deshalb hier festgehalten. */
  const einstufung = daten(w, "testQuestions().map(x=>x.cat)");
  const jeBereich = {};
  einstufung.forEach(c => jeBereich[c] = (jeBereich[c] || 0) + 1);
  const testcats = daten(w, "TESTCATS");
  P.ok("Die Einstufung fragt jeden Bereich ab", testcats.every(c => jeBereich[c]),
    testcats.filter(c => !jeBereich[c]).join(", "));
  P.ok("und jeden gleich oft (3)", testcats.every(c => jeBereich[c] === 3),
    JSON.stringify(jeBereich));
  P.ok("zusammen so viele Fragen, wie die App ankündigt",
    einstufung.length === testcats.length * 3, einstufung.length);
  {
    /* Positivprobe, damit die drei Prüfungen oben nicht stumm grün werden: Schrumpft der
       Vorrat eines Bereichs unter drei, muss es auffallen. Der Vorrat wird dafür in einem
       eigenen Fenster zusammengestrichen, das danach weggeworfen wird. */
    const w2 = boot(leererStand());
    const knapp = daten(w2, `(function(){
      const raus = ALL.filter(i => i.c === "zahlen").slice(2);
      raus.forEach(i => ALL.splice(ALL.indexOf(i), 1));
      const z = {};
      testQuestions().forEach(q => z[q.cat] = (z[q.cat] || 0) + 1);
      return z;
    })()`);
    P.ok("ein geschrumpfter Vorrat fällt auf", knapp.zahlen !== 3, JSON.stringify(knapp));
  }

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
    /* Die Planansicht versprach bis zum 22.09.2026, „die Hälfte der Tagesaufgabe“ komme aus
       dem Schwerpunkt. buildDaily() reserviert aber keine Hälfte, es zieht neuen Stoff
       zuerst aus dem Schwerpunkt; Wiederholungen gehen nach Termin vor. In einem Lauf über
       sechs Wochen mit lauter richtigen Antworten waren es in den ersten zwei Wochen 5 bis 8
       von 12 Karten, ab der dritten 0 bis 2 — der Rest waren fällige Wiederholungen. Die
       Ansicht sagt jetzt, was der Code tut, und hier steht genau das: Solange es im
       Schwerpunkt noch ungesehene Übungen gibt, ist jede neue Übung der Tagesaufgabe eine
       aus dem Schwerpunkt. */
    const neueUebungen = daten(w, "buildDaily().filter(q=>!/^[wc]:/.test(q.key)).map(q=>q.cat)");
    const fremd = neueUebungen.filter(c => c !== fokus);
    P.ok("Neue Übungen kommen zuerst aus dem Schwerpunkt", neueUebungen.length > 0 && !fremd.length,
      fremd.join(","));
    /* Am gerenderten Element, nicht am Quelltext: kurz ohne Plan zeichnen, dann zurück. */
    const planText = String(w.eval("(function(){ const p = S.plan; S.plan = null; renderPlan();" +
      " const t = $('#pSub').textContent; S.plan = p; renderPlan(); return t; })()"));
    P.ok("Die Planansicht verspricht keinen festen Anteil", /zuerst aus dem Schwerpunkt/.test(planText) && !/Hälfte/.test(planText),
      planText.slice(0, 160));
  }

  d.querySelector("#wkNew").click();
  P.ok("Unterwegs-Runde startet danach", d.body.classList.contains("walk") && daten(w, "Q.list.length") === 20);
}

/* ---------- A2 · Unterbrochene Einstufung ---------- */
P.titel("A2 · Unterbrochene Einstufung");
{
  /* Fehlerklasse „die Sitzung merkt sich Daten, aber nicht die Absicht“: startTest()
     übergab die Auswertung als Funktion (opts.onDone), und eine Funktion lässt sich nicht
     in den localStorage schreiben. Wer die Einstufung unterbrach und später fortsetzte,
     beantwortete alle 30 Fragen und stand danach wieder vor „Wo stehst du gerade?“ —
     S.level, S.levelDate und S.plan blieben null. Dasselbe traf die Tagesaufgabe: nach dem
     Fortsetzen fehlte am Ende die Serie, weil auch Q.daily nicht mitgesichert wurde. */
  const w = boot(leererStand({ auto: false }));
  const d = w.document;
  [...d.querySelectorAll("button")].find(b => /Einstufung/i.test(b.textContent)).click();
  ([...d.querySelectorAll("#pSub button")].find(b => /Test|Loslegen|Starten|Beginnen/i.test(b.textContent))
    || d.querySelector("#pSub button")).click();

  const antworte = (fenster, dok, wieViele) => {
    let n = 0;
    while (daten(fenster, "!!(Q && !Q.done)") && n < wieViele) {
      const q = daten(fenster, "({t:Q.list[Q.i].type, a:Q.list[Q.i].ans, acc:Q.list[Q.i].accept||null})");
      if (q.t === "fill") {
        dok.querySelector("#fillIn").value = q.acc ? q.acc[0] : "x";
        tippe(fenster, dok.querySelector("#fillGo"));
      } else {
        const opts = [...dok.querySelectorAll(".opt")];
        tippe(fenster, opts[n % 3 === 0 ? (q.a === 0 ? 1 : 0) : q.a]);
      }
      const weiter = dok.querySelector("#nextBtn");
      if (!weiter) break;
      weiter.click();
      n++;
    }
    return n;
  };

  const gesamt = daten(w, "Q.list.length");
  P.ok("Einstufung läuft (" + gesamt + " Fragen)", gesamt >= 25, gesamt);
  P.ok("die Sitzung ist als Einstufung gemerkt", daten(w, "(S.session && S.session.art) || null") === "test");
  P.ok("und trägt den Stand von vorher mit", daten(w, "(S.session && S.session.vorher) || null") !== null);
  P.ok("fünf beantwortet", antworte(w, d, 5) === 5);

  /* App geschlossen und neu geöffnet — wie wenn iOS die Seite verwirft. */
  const w2 = boot(daten(w, "S"));
  const d2 = w2.document;
  P.ok("die Unterwegs-Karte bietet die Einstufung nicht an",
    !d2.querySelector("#wkOn"), d2.querySelector("#walkHost") && d2.querySelector("#walkHost").textContent.slice(0, 60));
  const weiterKnopf = d2.querySelector("#goOn");
  P.ok("unter „Karten“ steht die offene Runde", !!weiterKnopf);
  weiterKnopf.click();
  P.ok("die Auswertung ist wieder da", daten(w2, "typeof Q.onDone") === "function");
  P.ok("und sie läuft im Fortschritt-Reiter weiter", daten(w2, "(Q.host && Q.host.id) || null") === "pSub",
    daten(w2, "(Q.host && Q.host.id) || null"));

  const rest = antworte(w2, d2, 60);
  P.ok("die restlichen Fragen beantwortet (" + rest + ")", rest >= gesamt - 6, rest);
  P.ok("das Ergebnis ist da", !!daten(w2, "S.level"), daten(w2, "S.level"));
  P.ok("mit Datum", !!daten(w2, "S.levelDate"));
  P.ok("und der Plan wird angeboten", !!d2.querySelector("#pMake"));
}
{
  /* Die Tagesaufgabe muss nach dem Fortsetzen weiter als Tagesaufgabe gelten. */
  const w = boot(leererStand({ auto: false }));
  w.document.querySelector("#startD").click();
  P.ok("Tagesaufgabe gemerkt", daten(w, "(S.session && S.session.daily) || null") === true);
  const w2 = boot(daten(w, "S"));
  w2.document.querySelector("#goOn").click();
  P.ok("nach dem Fortsetzen weiterhin Tagesaufgabe", daten(w2, "Q.daily || null") === true);
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

  /* Die Aussage im Fortschritt lautet: Fach 4 heißt drei richtige Antworten an drei
     verschiedenen Tagen. Genau das wird hier über grade() nachgerechnet, nicht angenommen.
     „An einem anderen Tag geantwortet“ heißt im Lernstand: das Feld l steht auf gestern. */
  const anTagen = (k, n) => daten(w, '(function(){const k=' + JSON.stringify(k) +
    ';for(let i=0;i<' + n + ';i++){ grade(k,true); if(S.cards[k]) S.cards[k].l = "2020-01-0"+(i+1); }' +
    'return S.cards[k].b;})()');
  const nachDrei = anTagen(K[0], 3);
  P.ok("Drei richtige Antworten an drei Tagen führen auf Fach 4", nachDrei === 4, "Fach " + nachDrei);
  P.ok("Nach drei richtigen Antworten sitzt genau eine Karte",
    daten(w, "retention().sicher") === 1, daten(w, "retention().sicher"));

  /* Und die Gegenprobe, die den Wert der Zahl ausmacht: dreimal am selben Tag richtig
     bringt die Karte genau ein Fach weiter, nicht drei. */
  const amStueck = daten(w, '(function(){const k=' + JSON.stringify(K[2]) +
    ';for(let i=0;i<4;i++) grade(k,true);return {b:S.cards[k].b, s:S.cards[k].s};})()');
  P.ok("Viermal am selben Tag richtig bringt trotzdem nur ein Fach",
    amStueck.b === 2, "Fach " + amStueck.b);
  P.ok("gezählt werden die Antworten trotzdem alle", amStueck.s === 4, amStueck.s);
  P.ok("und die Karte sitzt dadurch nicht", daten(w, "retention().sicher") === 1,
    daten(w, "retention().sicher"));

  const nachZwei = daten(w, '(function(){const k=' + JSON.stringify(K[1]) +
    ';for(let i=0;i<2;i++){ grade(k,true); if(S.cards[k]) S.cards[k].l = "2020-02-0"+(i+1); }' +
    'return {b:S.cards[k].b,r:retention()};})()');
  P.ok("Zwei richtige Antworten reichen nicht", nachZwei.b === 3 && nachZwei.r.sicher === 1,
    "Fach " + nachZwei.b + ", sicher " + nachZwei.r.sicher);
  P.ok("Die halb gelernte Karte zählt als im Aufbau", nachZwei.r.aufbau === 2, nachZwei.r.aufbau);

  /* Ein Fehler zaehlt dagegen auch am selben Tag — er ist Information, keine Aufblaehung. */
  const fehlerSelberTag = daten(w, '(function(){const k=' + JSON.stringify(K[3]) +
    ';grade(k,true); grade(k,false); return S.cards[k].b;})()');
  P.ok("Ein Fehler am selben Tag setzt trotzdem zurück", fehlerSelberTag === 1, "Fach " + fehlerSelberTag);

  /* Eine falsche Antwort setzt auf Fach 1 zurück — dann darf die Zahl nicht stehen bleiben */
  const nachFehler = daten(w, '(function(){grade(' + JSON.stringify(K[0]) + ',false);return retention();})()');
  P.ok("Ein Fehler nimmt die Karte wieder heraus", nachFehler.sicher === 0, nachFehler.sicher);

  const summe = daten(w, "(function(){const r=retention();return r.sicher+r.aufbau+r.neu===r.gesamt;})()");
  P.ok("Die drei Zahlen ergeben den Bestand", summe);

  {
    /* Die Zusage der Zahl als Ganzes, an einem realistischen Tagesablauf geprüft:
       Tagesaufgabe, dann eine Unterwegs-Runde, dann die Fehlerrunde. Dabei kommt dieselbe
       Karte oft mehrfach an einem Tag dran — in 40 simulierten Tagen an jedem einzelnen.
       Kein Fach darf höher steigen, als die Karte verschiedene Tage gesehen hat.
       (Gemessen: 284 solcher Doppelungen führten vorher zu je einem zusätzlichen Aufstieg;
       „sitzt sicher“ stand nach 40 Tagen bei 349 statt bei 287.) */
    const w2 = boot(leererStand({ auto: false }));
    const lauf = daten(w2, `(function(){
      const minus = d => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate()-1); return x.toISOString().slice(0,10); };
      let rnd = 99; const zufall = () => (rnd = (rnd*1103515245+12345) & 0x7fffffff) / 0x7fffffff;
      let doppelt = 0; const sprung = [];
      for (let t = 0; t < 40; t++) {
        const heute = new Set();
        /* Der Fachstand zu Tagesbeginn — daran misst sich, ob ein Tag mehr als einen
           Aufstieg gebracht hat. Der Deckel bei Fach 5 verdeckt die Aufblaehung sonst. */
        const vorher = {}; Object.keys(S.cards).forEach(k => vorher[k] = S.cards[k].b || 0);
        const spiele = liste => liste.forEach(q => {
          if (heute.has(q.key)) doppelt++;
          heute.add(q.key);
          grade(q.key, zufall() < 0.85, q.cat, q.rule);
        });
        spiele(buildDaily());
        unterwegsRunde(document.querySelector("#walkHost")); if (Q) { spiele(Q.list); Q = null; }
        if (schwacheSchluessel().length >= 6) { schwachRunde(document.querySelector("#walkHost")); if (Q) { spiele(Q.list); Q = null; } }
        Object.keys(S.cards).forEach(k => {
          /* Eine neue Karte startet bei Fach 1; „auf Anhieb richtig“ bringt sie auf 2 —
             das ist ein Aufstieg, kein Sprung. */
          const stand = vorher[k] === undefined ? 1 : vorher[k];
          const auf = (S.cards[k].b || 0) - stand;
          if (auf > 1 && sprung.length < 6) sprung.push("Tag " + (t+1) + " · " + k + ": " + (vorher[k] === undefined ? "neu" : "Fach " + vorher[k]) + " → Fach " + S.cards[k].b);
          S.cards[k].d = minus(S.cards[k].d); if (S.cards[k].l) S.cards[k].l = minus(S.cards[k].l);
        });
        S.days = {}; S.last = null;
      }
      return { doppelt, sprung, sicher: retention().sicher, karten: Object.keys(S.cards).length };
    })()`);
    P.info("40 Tage mit Tagesaufgabe, Unterwegs-Runde und Fehlerrunde: " + lauf.doppelt +
      " Karten kamen an einem Tag mehrfach dran · " + lauf.sicher + " von " + lauf.karten + " sitzen sicher");
    P.ok("keine Karte steigt an einem Tag um mehr als ein Fach",
      !lauf.sprung.length, lauf.sprung.join(" · "));
    P.ok("die Doppelungen gibt es wirklich — sonst prüft der Lauf nichts", lauf.doppelt > 50, lauf.doppelt);
  }

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
  /* Drei richtige Antworten an drei verschiedenen Tagen — das Feld l wird dafür jeweils
     auf einen früheren Tag gesetzt, so wie es nach einer echten Nacht aussähe. */
  daten(w, '(function(){' + K.slice(0, 5).map(k =>
    'for(let i=0;i<3;i++){ grade(' + JSON.stringify(k) + ',true); ' +
    'if(S.cards[' + JSON.stringify(k) + ']) S.cards[' + JSON.stringify(k) + '].l="2020-03-0"+(i+1); }').join("") +
    'return 1;})()');
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

/* ---------- F · Geänderte Antwort ---------- */
P.titel("F · Regeländerung");
/* Fehlerklasse „alte Antwort sitzt“: Ändert sich die richtige Antwort einer Karte,
   hat Nils sie mit der alten Antwort gelernt. Sie muss einmal zurück auf Fach 1. */
{
  const geaendert = daten(boot(leererStand()), "NEU_GELERNT");
  const ids = Object.keys(geaendert);
  P.ok("Die Liste geänderter Karten ist gefüllt", ids.length > 0);
  const id = ids[0], datum = geaendert[id];
  const heute = daten(boot(leererStand()), "today()");
  const vorher = daten(boot(leererStand()), "addDays(" + JSON.stringify(datum) + ",-1)");
  /* Fach 4, zuletzt am Tag vor der Änderung beantwortet: Fälligkeit = damals + 16 Tage */
  const alt = { b: 4, s: 3, w: 0, d: daten(boot(leererStand()), "addDays(" + JSON.stringify(vorher) + ",16)") };
  /* Fach 2, heute beantwortet: Fälligkeit = heute + 3 Tage */
  const frisch = { b: 2, s: 1, w: 0, d: daten(boot(leererStand()), "addDays(" + JSON.stringify(heute) + ",3)") };
  const anderes = { b: 4, s: 3, w: 0, d: alt.d };

  const stand = leererStand();
  stand.cards[id] = Object.assign({}, alt);
  stand.cards["k01"] = Object.assign({}, anderes);
  const w = boot(stand);
  const c = daten(w, "S.cards[" + JSON.stringify(id) + "]");
  P.ok("Vor der Änderung gelernt → zurück auf Fach 1", c.b === 1, JSON.stringify(c));
  P.ok("… und sofort fällig", c.d === heute && daten(w, "isDue(" + JSON.stringify(id) + ")") === true, c.d);
  P.ok("Zählungen bleiben", c.s === 3 && c.w === 0);
  P.ok("Andere Karten bleiben unberührt", daten(w, "S.cards.k01.b") === 4);
  P.ok("Die Änderung ist als angewendet vermerkt", daten(w, "S.neu[" + JSON.stringify(id) + "]") === datum);
  P.ok("Der Lernstand ist gespeichert",
    JSON.parse(w.localStorage.getItem("deutschtrainer.v1")).cards[id].b === 1);

  /* Zweiter Start: nicht noch einmal zurücksetzen, auch nicht nach richtiger Antwort */
  daten(w, "(function(){grade(" + JSON.stringify(id) + ",true);return 1;})()");
  const nachher = JSON.parse(w.localStorage.getItem("deutschtrainer.v1"));
  const w2 = boot(nachher);
  P.ok("Beim nächsten Start bleibt das neue Fach", daten(w2, "S.cards[" + JSON.stringify(id) + "].b") === 2);

  /* Nach der Änderung beantwortet: nichts passiert */
  const stand2 = leererStand();
  stand2.cards[id] = Object.assign({}, frisch);
  const w3 = boot(stand2);
  P.ok("Nach der Änderung gelernt → bleibt", daten(w3, "S.cards[" + JSON.stringify(id) + "].b") === 2);

  /* Import einer alten Sicherung wendet die Änderung ebenfalls an */
  const w4 = boot(leererStand());
  const sicherung = leererStand(); sicherung.cards[id] = Object.assign({}, alt);
  daten(w4, "(function(){S=Object.assign(load()," + JSON.stringify(sicherung) + ");save();return regelAenderungen();})()");
  P.ok("Nach dem Import einer alten Sicherung zurückgesetzt", daten(w4, "S.cards[" + JSON.stringify(id) + "].b") === 1);
}

/* ---------- G · Zweites Fenster ---------- */
/* Fehlerklasse „veraltetes Fenster überschreibt den neuen Stand“: save() schrieb immer
   den ganzen Zustand, den das Fenster beim Start geladen hatte. Ein vergessenes Fenster
   löschte mit einer einzigen Antwort den ganzen Lerntag des anderen — lautlos.
   Hier nachgestellt über denselben Speicher, den zwei Fenster teilen. */
P.titel("G · Zweites Fenster");
{
  const spA = boot(leererStand({}));
  const spB = boot(leererStand({}));
  /* Beide Fenster auf denselben Speicher legen, wie zwei Tabs im selben Browser */
  const gemeinsam = {};
  const geteilt = {
    setItem(k, v) { gemeinsam[k] = String(v); },
    getItem(k) { return k in gemeinsam ? gemeinsam[k] : null; },
    removeItem(k) { delete gemeinsam[k]; },
    clear() { Object.keys(gemeinsam).forEach(k => delete gemeinsam[k]); },
  };
  [spA, spB].forEach(w => Object.defineProperty(w, "localStorage", { configurable: true, value: geteilt }));
  /* B lernt zwölf Karten */
  spB.eval('for(let i=0;i<12;i++) grade("k"+String(i+1).padStart(2,"0"), true);');
  const nachB = JSON.parse(gemeinsam["deutschtrainer.v1"] || "{}");
  P.ok("B hat zwölf Karten gespeichert", Object.keys(nachB.cards || {}).length === 12,
    Object.keys(nachB.cards || {}).length);

  /* A kennt den Stand von vorher und beantwortet eine Karte */
  spA.eval('grade("z01", true);');
  const nachA = JSON.parse(gemeinsam["deutschtrainer.v1"] || "{}");
  P.ok("A überschreibt den Lerntag nicht", Object.keys(nachA.cards || {}).length === 12,
    "im Speicher stehen " + Object.keys(nachA.cards || {}).length + " Karten");
  P.ok("A sagt es dem Nutzer", !!spA.document.querySelector("#otherWin"));
  P.ok("und speichert danach nichts mehr",
    (() => { try { return spA.eval("fremdStand") === true; } catch (e) { return false; } })());
}
{
  /* Der Normalfall darf davon unberührt bleiben. */
  const w = boot(leererStand({}));
  w.eval('for(let i=0;i<8;i++) grade("k"+String(i+1).padStart(2,"0"), true);');
  const roh = JSON.parse(w.localStorage.getItem("deutschtrainer.v1") || "{}");
  P.ok("Ein einzelnes Fenster speichert wie bisher", Object.keys(roh.cards || {}).length === 8,
    Object.keys(roh.cards || {}).length);
  P.ok("und zeigt keine Warnung", !w.document.querySelector("#otherWin"));
}

/* ---------- H · Tagesaufgabe über Wochen ---------- */
P.titel("H · Tagesaufgabe über Wochen");
{
  /* Fehlerklasse „eine Kartensorte ist über einen Weg gar nicht erreichbar“ — dieselbe,
     die schon einmal die Fallkarten aus dem Unterwegs-Mix hat fallen lassen. Hier traf es
     „Heute“: buildDaily() füllte erst alle zwölf Plätze mit Übungen, der Wortschatzblock
     kam danach nie an die Reihe, und einen Block für neue Fallkarten gab es gar nicht.
     Weil eine Karte erst fällig werden kann, nachdem sie einmal dran war, blieben 320 der
     696 Karten über diesen Weg dauerhaft unerreichbar: 30 Tage ergaben 360 Übungen, null
     Wortkarten, null Fallkarten.

     Der Lauf treibt die echte buildDaily() über 60 Tage. Weitergestellt wird nicht die
     Uhr, sondern der Lernstand: alle gespeicherten Fälligkeiten wandern je Tag um einen
     Tag zurück — für die App nicht zu unterscheiden. */
  const w = boot(leererStand({ auto: false }));
  const lauf = tage => daten(w, `(function(){
    const sorten = {A:0, W:0, F:0}, gesehen = new Set();
    let rnd = 12345; const zufall = () => (rnd = (rnd*1103515245+12345) & 0x7fffffff) / 0x7fffffff;
    const minusEinTag = d => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate()-1); return x.toISOString().slice(0,10); };
    for(let t = 0; t < ${tage}; t++){
      const liste = buildDaily();
      liste.forEach(q => {
        gesehen.add(q.key);
        sorten[q.key.startsWith("c:") ? "F" : q.key.startsWith("w:") ? "W" : "A"]++;
        grade(q.key, zufall() < 0.8, q.cat, q.rule);
      });
      Object.keys(S.cards).forEach(k => {
        S.cards[k].d = minusEinTag(S.cards[k].d);
        if (S.cards[k].l) S.cards[k].l = minusEinTag(S.cards[k].l);
      });
      S.days = {}; S.last = null;
    }
    const faecher = {}; Object.values(S.cards).forEach(c => faecher[c.b] = (faecher[c.b]||0) + 1);
    return {sorten:sorten, gesehen:gesehen.size, gesamt:alleSchluessel().length, faecher:faecher, letzte:${tage}};
  })()`);
  const r = lauf(60);
  P.info("60 Tage nur Tagesaufgabe: " + r.sorten.A + " Aufgaben · " + r.sorten.W +
    " Wortkarten · " + r.sorten.F + " Fallkarten · " + r.gesehen + " von " + r.gesamt + " Karten gesehen");
  /* Der Beleg, dass die Simulation die Lernlogik wirklich durchläuft: Ohne das
     Weiterstellen von `l` blieben alle Karten in Fach 1 und 2 stecken. */
  P.ok("die Karten verteilen sich über die Fächer (" +
    Object.keys(r.faecher).sort().map(b => b + ":" + r.faecher[b]).join(" ") + ")",
    Object.keys(r.faecher).length >= 4, JSON.stringify(r.faecher));
  P.ok("Wortkarten kommen über „Heute“ vor", r.sorten.W > 0, r.sorten.W);
  P.ok("Fallkarten kommen über „Heute“ vor", r.sorten.F > 0, r.sorten.F);
  /* Untergrenzen mit Luft: gemessen 150 und 235 bei 720 Antworten. Sie sollen einen
     Rückfall auf null fangen, nicht die genaue Mischung festschreiben. */
  P.ok("und zwar nicht nur vereinzelt", r.sorten.W >= 60 && r.sorten.F >= 60,
    r.sorten.W + " / " + r.sorten.F);
  /* Die Tagesaufgabe bleibt von Übungen getragen — sonst wäre die Aufteilung bloß von
     einem Ende ins andere gekippt. Nicht als Mehrheit geprüft: die Quote unterwegs ist
     45 % Aufgaben / 25 % Wörter / 30 % Fälle, und über 60 Tage landet „Heute“ von allein
     bei 47 / 21 / 33. Übungen müssen also die größte Gruppe sein, nicht die absolute. */
  const anteilA = r.sorten.A / (r.sorten.A + r.sorten.W + r.sorten.F);
  P.ok("Übungen bleiben die größte Gruppe",
    r.sorten.A > r.sorten.W && r.sorten.A > r.sorten.F && anteilA >= 0.4,
    r.sorten.A + " / " + r.sorten.W + " / " + r.sorten.F + " — Anteil " + Math.round(anteilA*100) + " %");
  P.ok("jeder Tag ist voll", r.sorten.A + r.sorten.W + r.sorten.F === 60 * 12,
    r.sorten.A + r.sorten.W + r.sorten.F);
}
{
  /* Fehlerklasse „eine Sorte hat Vorfahrt vor der Fälligkeit“: buildDaily() nahm in
     Phase 1 erst alle fälligen Fallkarten und dann erst die Übungen. Nach einer Pause,
     wenn der Rückstand größer ist als die zwölf Plätze, bestand die Tagesaufgabe damit
     tagelang aus nichts als Fallkarten, während die ältesten Übungen liegen blieben.
     Jetzt entscheidet die Fälligkeit, nicht die Sorte. */
  const K = schluessel(boot(null));
  const bau = (exTage, fallTage) => {
    const cards = {};
    K.aufgaben.slice(0, 60).forEach((k, i) => cards[k] = { b: 2, d: tag(exTage + i % 5), s: 2, w: 0 });
    K.faelle.slice(0, 60).forEach((k, i) => cards[k] = { b: 2, d: tag(fallTage + i % 5), s: 2, w: 0 });
    K.woerter.slice(0, 20).forEach(k => cards[k] = { b: 2, d: tag(-8), s: 2, w: 0 });
    const w = boot(leererStand({ cards }));
    const z = { A: 0, W: 0, F: 0 };
    daten(w, "buildDaily().map(x=>x.key)")
      .forEach(k => z[k.startsWith("c:") ? "F" : k.startsWith("w:") ? "W" : "A"]++);
    return z;
  };
  const exAelter = bau(-14, -10);
  P.ok("liegen die Übungen länger, kommen sie zuerst", exAelter.A > exAelter.F,
    JSON.stringify(exAelter));
  const fallAelter = bau(-10, -14);
  P.ok("liegen die Fallkarten länger, kommen sie zuerst", fallAelter.F > fallAelter.A,
    JSON.stringify(fallAelter));
}
{
  /* „Nur Fehler“ soll zeigen, was gerade danebengeht — nicht, was irgendwann einmal oft
     danebenging und längst in Fach 5 sitzt. */
  const K = schluessel(boot(null));
  const cards = {};
  K.aufgaben.slice(0, 5).forEach(k => cards[k] = { b: 5, d: tag(30), s: 12, w: 9 });   // Altlast
  K.aufgaben.slice(5, 10).forEach(k => cards[k] = { b: 1, d: tag(0), s: 3, w: 1 });    // gerade gefallen
  const w = boot(leererStand({ cards }));
  const reihe = daten(w, "schwacheSchluessel()");
  P.ok("die frisch gefallenen Karten stehen vorn",
    reihe.slice(0, 5).every(k => K.aufgaben.slice(5, 10).includes(k)),
    reihe.slice(0, 5).join(", "));
  P.ok("die gefestigten Altlasten stehen hinten",
    reihe.slice(5).every(k => K.aufgaben.slice(0, 5).includes(k)),
    reihe.slice(5).join(", "));
}

/* ---------- I · Beschädigter Lernstand ---------- */
P.titel("I · Beschädigter Lernstand");
{
  /* Fehlerklasse „stiller Verlust“: load() fing jeden Fehler ab und lieferte wortlos den
     leeren Standardzustand. Bei einem beschädigten Datensatz — abgeschnitten geschrieben,
     Profil defekt — startete die App also mit 0 XP und Serie 0, ohne Warnung, und die
     erste Antwort schrieb den Rest endgültig weg. Beim Schreibfehler warnt die App seit
     jeher, beim Lesefehler gar nicht. In der Nachstellung enthielt der auf 80 % gekürzte
     Stand noch fast alle Karten und wäre von Hand zu retten gewesen. */
  const cards = {};
  for (let i = 1; i <= 20; i++) cards["k" + String(i).padStart(2, "0")] = { b: 4, d: tag(9), s: 5, w: 0 };
  const heil = JSON.stringify(leererStand({ xp: 480, streak: 23, best: 23, cards }));
  const kaputt = heil.slice(0, Math.floor(heil.length * 0.8));

  const w = boot(null, { roh: kaputt });
  const d = w.document;
  P.ok("die App startet trotzdem", daten(w, "typeof S") === "object");
  P.ok("und zwar bei null", daten(w, "S.xp") === 0 && daten(w, "S.streak") === 0);
  const leiste = d.querySelector("#readWarn");
  P.ok("eine Warnleiste steht da", !!leiste);
  P.ok("sie sagt, was los ist", !!leiste && /nicht lesen/i.test(leiste.textContent),
    leiste && leiste.textContent.slice(0, 80));
  P.ok("der beschädigte Stand ist beiseitegelegt",
    w.localStorage.getItem("deutschtrainer.v1.defekt") === kaputt);

  /* Weiterüben darf die Kopie nicht wegräumen — nur der Knopf darf das. */
  w.eval('grade("k01", true)');
  P.ok("die Kopie überlebt die erste Antwort",
    w.localStorage.getItem("deutschtrainer.v1.defekt") === kaputt);
  P.ok("der neue Stand wird normal gespeichert",
    JSON.parse(w.localStorage.getItem("deutschtrainer.v1") || "{}").xp > 0);
  const verwerfen = d.querySelector("#readDrop");
  if (verwerfen) verwerfen.click();
  P.ok("nach dem Verwerfen ist die Kopie weg",
    w.localStorage.getItem("deutschtrainer.v1.defekt") === null);
  P.ok("und die Leiste auch", !d.querySelector("#readWarn"));
}
{
  /* Gegenprobe: ein leerer Speicher ist kein Defekt. */
  const w = boot(null);
  P.ok("erster Start ohne Warnleiste", !w.document.querySelector("#readWarn"));
  P.ok("und ohne Kopie", w.localStorage.getItem("deutschtrainer.v1.defekt") === null);
  const w2 = boot(leererStand({ xp: 30 }));
  P.ok("heiler Stand ohne Warnleiste", !w2.document.querySelector("#readWarn"));
  P.ok("und er wird geladen", daten(w2, "S.xp") === 30);
}

/* ---------- J · Ansicht nach Import und Zurücksetzen ---------- */
P.titel("J · Ansicht nach Import und Zurücksetzen");
{
  /* Fehlerklasse „die Ansicht, auf der man steht, wird als einzige nicht neu gezeichnet“:
     „Sicherung laden“ und „Alles zurücksetzen“ sitzen selbst im Fortschritt, riefen aber
     renderAll() — und darin fehlte renderFortschritt(). Nach dem Laden einer Sicherung
     stand oben „🔥 21 · 4300 XP“ und der Toast „Sicherung geladen“, zwei Zeilen darunter
     unverändert „0 sitzt sicher · 696 noch nicht dran“. Beim Zurücksetzen dasselbe
     rückwärts: der Speicher war leer, die Zeile zeigte weiter die alten Zahlen. */
  /* Die Kartenmenge muss unabhängig vom Kalender sein. Steht eine ID in NEU_GELERNT,
     setzt regelAenderungen() sie je nach heutigem Datum auf Fach 1 zurück — oder eben
     nicht —, und die Zahl in der Zeile wackelt. Genau daran ging dieser Abschnitt am
     21.09.2026 rot: k20 steht mit dem 04.09. in NEU_GELERNT; die Karte liegt auf Fach 5
     mit Fälligkeit heute+20, die letzte Antwort also bei heute−15. Bis zum 19.09. lag
     die vor dem 04.09. (Rücksetzer, 39 sitzt sicher), seitdem dahinter (kein Rücksetzer,
     40). Die zweite Zusicherung unten hatte man damals mit „24 oder 25“ umschifft,
     statt die Ursache zu beseitigen. Jetzt werden die IDs aus dem Bestand gezogen und
     gegen NEU_GELERNT gefiltert — das hält auch, wenn dort etwas dazukommt. */
  const wRef = boot(null);
  const neuGelernt = Object.keys(daten(wRef, "NEU_GELERNT"));
  const frei = daten(wRef, 'ALL.filter(i=>i.t!=="fill").map(i=>i.id)')
    .filter(id => !neuGelernt.includes(id)).slice(0, 40);
  P.ok("die Kartenmenge hängt nicht am Kalender",
    frei.length === 40 && !frei.some(id => neuGelernt.includes(id)),
    frei.length + " IDs, davon aus NEU_GELERNT: " + frei.filter(id => neuGelernt.includes(id)).join(", "));
  const cards = {};
  frei.forEach(id => cards[id] = { b: 5, d: tag(20), s: 6, w: 0 });
  const w = boot(leererStand({ xp: 400, streak: 9, cards }));
  const d = w.document;
  w.eval('go("fortschritt")');
  const zeile = () => d.querySelector("#statHost").textContent.replace(/\s+/g, " ");
  P.ok("vorher steht der gelernte Stand da", /40\s*sitzt sicher/.test(zeile()), zeile().slice(0, 100));

  d.querySelector("#rst").click();                       // confirm() ist im Prüflauf immer ja
  P.ok("der Speicher ist zurückgesetzt", daten(w, "S.streak") === 0 && daten(w, "S.xp") === 0);
  P.ok("die Kopfzeile auch", d.querySelector("#hudStreak").textContent.includes("0"));
  P.ok("und dieselbe Ansicht zeigt es", /0\s*sitzt sicher/.test(zeile()), zeile().slice(0, 100));

  /* Der Import macht genau das, was der Import-Rückruf tut: S ersetzen, dann renderAll(). */
  /* Andere Kartenzahl als vorher, damit die Prüfung auch dann bisse, wenn das
     Zurücksetzen die Ansicht schon richtig gestellt hätte. */
  const weniger = {};
  Object.keys(cards).slice(0, 25).forEach(k => weniger[k] = cards[k]);
  w.eval("S = Object.assign(load(), " + JSON.stringify(leererStand({ xp: 4300, streak: 21, cards: weniger })) +
    "); save(); regelAenderungen(); renderAll();");   // genau die Schritte des Import-Rückrufs
  P.ok("nach dem Laden einer Sicherung stimmt die Kopfzeile",
    d.querySelector("#hudStreak").textContent.includes("21"));
  P.ok("und die Ansicht darunter genauso", /25\s*sitzt sicher/.test(zeile()), zeile().slice(0, 100));
}
{
  /* Gegenstück: die laufende Einstufung darf renderFortschritt() nicht wegzeichnen. */
  const w = boot(leererStand({ auto: false }));
  const d = w.document;
  [...d.querySelectorAll("button")].find(b => /Einstufung/i.test(b.textContent)).click();
  ([...d.querySelectorAll("#pSub button")].find(b => /Test|Loslegen|Starten|Beginnen/i.test(b.textContent))
    || d.querySelector("#pSub button")).click();
  P.ok("die Einstufung läuft in #pSub", daten(w, "(Q.host && Q.host.id) || null") === "pSub");
  w.eval("renderFortschritt()");
  P.ok("ein Neuzeichnen räumt sie nicht weg", !!d.querySelector("#pSub .qtext"));
  w.eval('go("karten"); go("fortschritt")');
  P.ok("ein Reiterwechsel auch nicht", !!d.querySelector("#pSub .qtext"));
}

/* ---------- K · Sichern und Laden ---------- */
P.titel("K · Sichern und Laden");
(async () => {
  {
    /* Die Datei trug das Datum der *vorigen* Sicherung: S.lastExport wurde erst nach dem
       Verpacken gesetzt. Der Import-Dialog fragt später „Sicherung vom … laden?“ und nannte
       damit ein Datum, an dem diese Datei noch gar nicht existierte. */
    const w = boot(leererStand({ xp: 40, lastExport: "2026-01-01" }));
    w.eval(`
      window.__inhalt = null;
      const Echt = window.Blob;
      window.Blob = function (teile, opt) { window.__inhalt = String(teile[0]); return new Echt(teile, opt); };
    `);
    w.eval("exportieren()");
    const inhalt = JSON.parse(daten(w, "__inhalt"));
    P.ok("die Sicherung trägt das heutige Datum", inhalt.lastExport === daten(w, "today()"),
      inhalt.lastExport + " statt " + daten(w, "today()"));
    P.ok("und im Speicher steht dasselbe", daten(w, "S.lastExport") === daten(w, "today()"));
  }

  const laden = async (w, stand) => {
    const d = w.document;
    w.eval('go("fortschritt")');
    const feld = d.querySelector("#impFile");
    const datei = new w.File([JSON.stringify(stand)], "sicherung.json", { type: "application/json" });
    Object.defineProperty(feld, "files", { value: [datei], configurable: true });
    /* Auf das Ende des Imports warten, nicht fest 120 ms: Unter Last war der FileReader
       danach noch nicht fertig, und unbeteiligte Zusicherungen wurden rot. */
    const t = d.querySelector("#toast"); t.textContent = "";
    feld.dispatchEvent(new w.Event("change"));
    for (let n = 0; n < 200 && !t.textContent; n++) await new Promise(r => setTimeout(r, 25));
  };

  {
    /* Die Anzeigeart steckt im Stand — sie blieb nach dem Import trotzdem hell. */
    const w = boot(leererStand({ xp: 5, theme: "light" }));
    await laden(w, leererStand({ xp: 4300, streak: 21, theme: "dark" }));
    P.ok("die Sicherung ist geladen", daten(w, "S.xp") === 4300, daten(w, "S.xp"));
    P.ok("und die Anzeige ist dunkel",
      w.document.documentElement.getAttribute("data-theme") === "dark",
      w.document.documentElement.getAttribute("data-theme"));
    P.ok("… samt der Statusleiste", w.document.querySelector('meta[name="theme-color"]').getAttribute("content") === daten(w, "THEMA_FARBE.dark"),
      w.document.querySelector('meta[name="theme-color"]').getAttribute("content"));
  }

  {
    /* Fehlerklasse „der Merker vom Gerät gilt für eine fremde Datei“: S.neu hält fest,
       welche Regeländerungen schon abgearbeitet sind. Beim Import blieb der Merker dieses
       Geräts stehen, weil die alte Sicherung gar keinen mitbringt — regelAenderungen()
       hielt die Änderungen damit für erledigt, und die betroffenen Karten blieben in ihrem
       alten Fach. Nils hätte die neue Antwort erst in Wochen gesehen. */
    const geaendert = Object.keys(daten(boot(null), "NEU_GELERNT"));
    P.ok("es gibt geänderte Karten", geaendert.length > 0, geaendert.length);
    const id = geaendert[0];
    const datum = daten(boot(null), "NEU_GELERNT")[id];
    /* Die letzte Antwort muss vor dem Änderungsdatum liegen — sonst hat Nils die neue
       Antwort schon gesehen und regelAenderungen() lässt die Karte zu Recht stehen. Das
       Feld l sagt das ausdrücklich; vorher hing es an der Schätzung aus Fälligkeit minus
       Fachintervall und damit am heutigen Datum, und die Prüfung wurde mit der Zeit falsch. */
    const vorDerAenderung = "2020-01-01";
    const karteVon = () => ({ b: 4, d: tag(9), s: 5, w: 0, l: vorDerAenderung });
    const cards = {}; cards[id] = karteVon();
    const merker = {}; merker[id] = datum;
    const w = boot(leererStand({ cards, neu: merker }));
    /* … lädt eine Sicherung von vorher: dieselbe Karte, aber ohne Merker. */
    const altCards = {}; altCards[id] = karteVon();
    await laden(w, leererStand({ xp: 100, cards: altCards }));
    const karte = daten(w, "S.cards[" + JSON.stringify(id) + "] || null");
    P.ok("die geänderte Karte fällt zurück auf Fach 1", karte && karte.b === 1, karte);
    P.ok("und ist sofort fällig", karte && karte.d === daten(w, "today()"), karte && karte.d);
  }

  {
    /* Eine Datei, die die Prüfung besteht, aber beim Aufbau der Ansicht scheitert, darf den
       vorhandenen Stand nicht mitreißen. */
    const w = boot(leererStand({ xp: 77, streak: 4 }));
    w.eval("window.__echtRenderAll = renderAll; renderAll = function(){ throw new Error('Absicht'); };");
    await laden(w, leererStand({ xp: 4300, streak: 21 }));
    P.ok("der alte Stand steht wieder im Speicher",
      JSON.parse(w.localStorage.getItem("deutschtrainer.v1") || "{}").xp === 77,
      JSON.parse(w.localStorage.getItem("deutschtrainer.v1") || "{}").xp);
    P.ok("und im Arbeitsspeicher auch", daten(w, "S.xp") === 77, daten(w, "S.xp"));
  }

  {
    /* Fehlerklasse „gefiltert, aber nicht hingescrollt“: Der Sprung aus der Suche auf ein
       Wort oder einen Fall füllte nur das Filterfeld. Die Listen beginnen weit unten — der
       Treffer landete rund 1000 px unter dem Bildschirmrand, und es sah aus, als hätte der
       Tipp nichts bewirkt. */
    const w = boot(leererStand({}));
    w.eval("window.__hin = []; HTMLElement.prototype.scrollIntoView = function(){ window.__hin.push(this.id || this.className); };");
    w.eval("if(!INDEX) INDEX = buildIndex(); INDEX.find(e => e.k === 'Wort').go();");
    await new Promise(r => setTimeout(r, 400));
    P.ok("der Wort-Sprung scrollt auf die Liste", daten(w, "__hin").includes("wList"), daten(w, "__hin"));
    w.eval("window.__hin = []; INDEX.find(e => e.k === 'Fall').go();");
    await new Promise(r => setTimeout(r, 400));
    P.ok("der Fall-Sprung auch", daten(w, "__hin").includes("crHost"), daten(w, "__hin"));
  }

  /* ---- Home-Bildschirm-App auf dem iPhone ----
     jsdom kennt navigator.standalone nicht; ohne diese Umgebung liefen alle Zweige für
     die installierte App ungeprüft durch. Gesetzt wird, was WebKit dort meldet. */
  const umgebung = (standalone, touch = 5) => ({ vorLaden(w) {
    if (standalone !== undefined) Object.defineProperty(w.navigator, "standalone", { value: standalone, configurable: true });
    Object.defineProperty(w.navigator, "maxTouchPoints", { value: touch, configurable: true });
    w.__anker = 0;
    w.HTMLAnchorElement.prototype.click = function () { w.__anker++; };
    w.__geteilt = [];
    w.navigator.canShare = d => !!(d && d.files && d.files.length);
    w.navigator.share = d => { w.__geteilt.push(d);
      return new w.Promise((ja, nein) => { w.__teilenOk = ja; w.__teilenNein = nein; }); };
  } });
  const lesen = (w, datei) => new Promise(r => { const f = new w.FileReader(); f.onload = () => r(f.result); f.readAsText(datei); });
  const toastText = w => w.document.querySelector("#toast").textContent;
  const fehler = (w, name) => { const e = new w.Error("x"); e.name = name; return e; };

  {
    /* In der Home-Bildschirm-App öffnete a[download] eine Vorschau ohne Rückweg in die
       App, und lastExport stand schon vor dem Klick — die Mahnung schwieg 30 Tage für eine
       Datei, die es nicht gab. */
    const w = boot(leererStand({ xp: 40, lastExport: "2026-01-01" }), umgebung(true));
    const heute = daten(w, "today()");
    w.eval("exportieren()");
    P.ok("die Home-Bildschirm-App sichert über das Teilen-Menü", daten(w, "__geteilt.length") === 1, daten(w, "__geteilt.length"));
    P.ok("… und nicht über einen Download", daten(w, "__anker") === 0, daten(w, "__anker"));
    const datei = w.__geteilt[0].files[0];
    P.ok("die geteilte Datei heißt nach dem heutigen Tag", datei.name === "deutsch-trainer-" + heute + ".json", datei.name);
    const inhalt = JSON.parse(await lesen(w, datei));
    P.ok("… und trägt das heutige Datum", inhalt.lastExport === heute, inhalt.lastExport);
    P.ok("solange das Teilen offen ist, gilt nichts als gesichert", daten(w, "S.lastExport") === "2026-01-01", daten(w, "S.lastExport"));
    w.__teilenOk();
    await new Promise(r => setTimeout(r, 0));
    P.ok("nach dem Teilen steht das Sicherungsdatum", daten(w, "S.lastExport") === heute, daten(w, "S.lastExport"));
    P.ok("… auch im Speicher", JSON.parse(w.localStorage.getItem("deutschtrainer.v1")).lastExport === heute);
    P.ok("… und die Meldung sagt es", /übergeben/.test(toastText(w)), toastText(w));
  }
  for (const [name, erwartet] of [["AbortError", /Nicht gesichert/], ["NotAllowedError", /versuch es noch einmal/]]) {
    const w = boot(leererStand({ lastExport: "2026-01-01" }), umgebung(true));
    w.eval("exportieren()");
    w.__teilenNein(fehler(w, name));
    await new Promise(r => setTimeout(r, 0));
    P.ok(name + ": das Sicherungsdatum bleibt stehen", daten(w, "S.lastExport") === "2026-01-01", daten(w, "S.lastExport"));
    P.ok(name + ": kein Download als Rückfall", daten(w, "__anker") === 0, daten(w, "__anker"));
    P.ok(name + ": die Meldung sagt, was los ist", erwartet.test(toastText(w)), toastText(w));
  }
  {
    /* Ein zweiter Tipp bei offenem Menü: WebKit meldet InvalidStateError. Das erste Menü
       ist noch da — eine Fehlermeldung darüber wäre falsch. */
    const w = boot(leererStand({ lastExport: "2026-01-01" }), umgebung(true));
    w.eval("exportieren()");
    w.__teilenNein(fehler(w, "InvalidStateError"));
    await new Promise(r => setTimeout(r, 0));
    P.ok("ein zweiter Tipp bei offenem Menü meldet keinen Fehler", !/nicht|Nicht/.test(toastText(w)), toastText(w));
  }
  {
    /* Die Mahnung verschwindet nach dem Teilen, ohne dass der Fortschritt neu gezeichnet
       wird — dort kann eine Einstufung laufen. */
    const days = {}; for (let i = 1; i <= 20; i++) days[tag(-i)] = { a: 12, c: 10, done: true };
    const w = boot(leererStand({ days }), umgebung(true));
    w.eval('go("fortschritt")');
    P.ok("nach 20 Tagen ohne Sicherung mahnt der Fortschritt", !!w.document.querySelector("#sicherMahnung"));
    P.ok("… in der App ohne den Browserverlauf, der dort nicht der Ort ist",
      /keine zweite Kopie/.test(w.document.querySelector("#sicherMahnung").textContent) &&
      !/Browserverlauf/.test(w.document.querySelector("#sicherMahnung").textContent),
      w.document.querySelector("#sicherMahnung").textContent);
    w.document.querySelector("#exp").click();
    w.__teilenOk();
    await new Promise(r => setTimeout(r, 0));
    P.ok("nach dem Teilen ist die Mahnung weg", !w.document.querySelector("#sicherMahnung"));
  }
  for (const [art, opt] of [["im Browser", umgebung(undefined, 0)], ["in einer Web-App am Mac", umgebung(true, 0)],
                             ["im Safari-Tab", umgebung(false)]]) {
    /* Außerhalb der Home-Bildschirm-App bleibt der Download, Byte für Byte wie vorher. */
    const w = boot(leererStand({ lastExport: "2026-01-01" }), opt);
    w.eval("exportieren()");
    P.ok(art + ": Sicherung als Download", daten(w, "__anker") === 1 && daten(w, "__geteilt.length") === 0,
      daten(w, "__anker") + " Downloads, " + daten(w, "__geteilt.length") + " geteilt");
    P.ok(art + ": das Datum steht wie bisher sofort", daten(w, "S.lastExport") === daten(w, "today()"));
  }
  {
    /* Kann das Gerät die Datei nicht teilen, bleibt der alte Weg — schlechter wird es nicht. */
    const opt = umgebung(true);
    const w = boot(leererStand({ lastExport: "2026-01-01" }), { vorLaden(w) { opt.vorLaden(w); w.navigator.canShare = () => false; } });
    w.eval("exportieren()");
    P.ok("ohne Teilen von Dateien fällt die App auf den Download zurück", daten(w, "__anker") === 1, daten(w, "__anker"));
  }

  {
    /* Der Satz über den Speicherort nannte in der App „diesen Browser“ — dort ist es gerade
       nicht der Browser: Home-Bildschirm-Apps haben einen eigenen Speicher. */
    const ort = opt => { const w = boot(leererStand({}), opt); w.eval('go("fortschritt")');
      return w.document.querySelector("#datenOrt").textContent; };
    const browser = ort(umgebung(undefined, 0)), app = ort(umgebung(true)), tab = ort(umgebung(false));
    P.ok("im Browser bleibt der Satz, wie er war",
      browser === "Alles liegt nur in diesem Browser. Sicher dir den Fortschritt, bevor du den Verlauf löschst oder das Gerät wechselst.", browser);
    P.ok("in der App nennt er den getrennten Speicher", /getrennt vom Browser/.test(app) && !/Verlauf/.test(app), app);
    P.ok("im Safari-Tab sagt er, dass die App leer beginnt", /eigenen Speicher/.test(tab) && /beginnt dort leer/.test(tab), tab);
  }
  {
    /* Erster Start in der App: Wer vorher im Browser geübt hat, sieht einen leeren Trainer. */
    const w = boot(leererStand({ auto: false }), umgebung(true));
    const d = w.document;
    P.ok("die leere App fragt, ob schon im Browser geübt wurde", !!d.querySelector("#umzug"));
    let gewaehlt = 0;
    d.querySelector("#impFile").click = () => { gewaehlt++; };
    d.querySelector("#umzugLaden").click();
    P.ok("… und öffnet von dort die Dateiauswahl", gewaehlt === 1, gewaehlt);
    /* Die Dateiauswahl stand im Fortschritt unter „Übersicht“. Nach einem Blick in die
       Einstufung oder das Fehlerjournal fehlte sie, und der Knopf tat nichts. */
    for (const reiter of ["plan", "journal"]) {
      w.eval('PT.tab = "' + reiter + '"; go("fortschritt"); go("heute")');
      const feld = d.querySelector("#impFile");
      if (feld) feld.click = () => { gewaehlt++; };
      const vorher = gewaehlt;
      d.querySelector("#umzugLaden").click();
      P.ok("… auch wenn der Fortschritt auf „" + reiter + "“ steht", gewaehlt === vorher + 1, gewaehlt - vorher);
    }
    /* Über die Unterwegs-Runde, nicht die Tagesaufgabe: Deren erste Karte kann je nach Datum
       eine Tippaufgabe ohne Optionen sein (DT_TAGE=7), unterwegs gibt es keine. */
    d.querySelector("#wkNew").click();
    tippe(w, d.querySelector("#walkHost .opt"));
    w.eval('go("heute")');
    P.ok("nach der ersten Antwort ist der Hinweis weg", !d.querySelector("#umzug") && Object.keys(daten(w, "S.cards")).length === 1);
    const voll = boot(leererStand({ cards: { k01: { b: 2, d: tag(1), s: 1, w: 0 } } }), umgebung(true));
    P.ok("mit Lernstand erscheint er nicht", !voll.document.querySelector("#umzug"));
    P.ok("im Browser erscheint er nicht", !boot(leererStand({}), umgebung(undefined, 0)).document.querySelector("#umzug"));
    P.ok("im Safari-Tab auch nicht", !boot(leererStand({}), umgebung(false)).document.querySelector("#umzug"));
  }

  {
    /* Der Text im Textcheck ging verloren, wenn iOS die App beim Wechsel nach Mail verwarf. */
    const TC = "deutschtrainer.v1.tc";
    const w = boot(leererStand({}));
    w.eval('WT.tab = "check"; go("schreiben"); renderSchreiben()');
    const ta = w.document.querySelector("#tcArea");
    ta.value = "Ich wollte fragen ob ich die Arbeit später abgeben darf.";
    ta.dispatchEvent(new w.Event("input"));
    const roh = JSON.parse(w.localStorage.getItem(TC) || "null");
    P.ok("der Textcheck legt den Text beim Tippen ab", roh && roh.text === ta.value && !roh.geprueft, roh);
    w.document.querySelector("#tcGo").click();
    P.ok("nach dem Prüfen gilt er als geprüft", JSON.parse(w.localStorage.getItem(TC)).geprueft === true);
    P.ok("… und steht nicht im Lernstand", !/abgeben darf/.test(w.localStorage.getItem("deutschtrainer.v1") || ""));
    const eintrag = w.localStorage.getItem(TC);

    const neu = boot(leererStand({}), { vorLaden(x) { x.localStorage.setItem(TC, eintrag); } });
    P.ok("nach einem Neustart ist der Text wieder da", daten(neu, "TC.text") === ta.value, daten(neu, "TC.text"));
    P.ok("… mit Ergebnis", daten(neu, "!!(TC.res && TC.res.finds.length)"), daten(neu, "TC.res && TC.res.finds.length"));
    P.ok("… und Schreiben öffnet den Textcheck", daten(neu, "WT.tab") === "check", daten(neu, "WT.tab"));
    neu.eval('go("schreiben")');
    P.ok("… mit dem Text im Feld", neu.document.querySelector("#tcArea").value === ta.value);
    neu.document.querySelector("#tcClear").click();
    P.ok("„Leeren“ löscht ihn", neu.localStorage.getItem(TC) === null, neu.localStorage.getItem(TC));

    const alt = JSON.stringify(Object.assign(JSON.parse(eintrag), { ts: Date.now() - 25 * 3600 * 1000 }));
    const spaeter = boot(leererStand({}), { vorLaden(x) { x.localStorage.setItem(TC, alt); } });
    P.ok("nach einem Tag verwirft die App ihn", daten(spaeter, "TC.text") === "" && spaeter.localStorage.getItem(TC) === null,
      daten(spaeter, "TC.text"));
    P.ok("… und Schreiben beginnt wie gewohnt", daten(spaeter, "WT.tab") === "impulse", daten(spaeter, "WT.tab"));

    const kaputt = boot(leererStand({}), { vorLaden(x) { x.localStorage.setItem(TC, "{kaputt"); } });
    P.ok("ein kaputter Eintrag stört den Start nicht", daten(kaputt, "TC.text") === "" && !!kaputt.document.querySelector("#dailyHost .card"));

    const rst = boot(leererStand({}), { vorLaden(x) { x.localStorage.setItem(TC, eintrag); } });
    rst.eval('go("fortschritt")');
    rst.document.querySelector("#rst").click();
    P.ok("„Alles zurücksetzen“ nimmt ihn mit", rst.localStorage.getItem(TC) === null && daten(rst, "TC.text") === "",
      rst.localStorage.getItem(TC));

    /* Ein zweites Fenster, das im Textcheck tippt, ist kein fremder Lernstand. */
    const zwei = boot(leererStand({}));
    zwei.dispatchEvent(new zwei.StorageEvent("storage", { key: TC, newValue: eintrag }));
    P.ok("ein Textcheck-Eintrag aus einem zweiten Fenster sperrt das Speichern nicht", daten(zwei, "fremdStand") === false);
  }

/* ---------- L · Der lange Horizont ---------- */
P.titel("L · Der lange Horizont");
{
  /* Fehlerklasse „die Prüfung glaubt einem Abbild statt der App“. Abschnitt C läuft über
     180 Tage und meldet „alle Karten kommen dran“ — aber mit einer eigenen, vereinfachten
     Nachbildung der Auswahl. Die kennt weder die Drosselung neuen Stoffs bei Rückstand
     noch quotenMix() noch die Sperre „höchstens ein Aufstieg am Tag“ und kann deshalb
     gar nichts anderes melden als volle Abdeckung.

     Hier läuft stattdessen die echte Auswahl: buildDaily() und unterwegsRunde() der App,
     bewertet über grade(). Das Ergebnis sieht anders aus, und genau deshalb steht es hier.

     Weitergestellt wird wieder nicht die Uhr, sondern der Lernstand — Fälligkeit und
     Datum der letzten Antwort wandern je Tag um einen Tag zurück. Beides zusammen: Ohne
     das zurückgestellte `l` greift die Tagessperre in grade() für immer, keine Karte
     verlässt Fach 2, und der Lauf misst eine Welt, die es nicht gibt. (Gegenprobe: ohne
     `l` bleibt die Abdeckung ab Tag 1 bei 93 Karten stehen.) */
  const lauf = (tage, runden, marken) => {
    const w = boot(leererStand({ auto: false }));
    return daten(w, `(function(){
      const minus = d => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate()-1); return x.toISOString().slice(0,10); };
      let rnd = 4711; const zufall = () => (rnd = (rnd*1103515245+12345) & 0x7fffffff) / 0x7fffffff;
      const gesehen = new Set(), stand = {};
      const host = document.querySelector("#walkHost");
      const spiele = liste => liste.forEach(q => { gesehen.add(q.key); grade(q.key, zufall() < 0.8, q.cat, q.rule); });
      for(let t = 0; t < ${tage}; t++){
        spiele(buildDaily());
        for(let i = 0; i < ${runden}; i++){ unterwegsRunde(host); if(Q){ spiele(Q.list); Q = null; } }
        Object.keys(S.cards).forEach(k => {
          S.cards[k].d = minus(S.cards[k].d); if(S.cards[k].l) S.cards[k].l = minus(S.cards[k].l);
        });
        S.days = {}; S.last = null;
        if(${JSON.stringify(marken)}.indexOf(t+1) >= 0) stand[t+1] = gesehen.size;
      }
      return { stand: stand, gesehen: gesehen.size, gesamt: alleSchluessel().length };
    })()`);
  };

  /* Ein Tag, wie Nils ihn wirklich hat: die Tagesaufgabe und eine Runde unterwegs. */
  const eins = lauf(180, 1, [30, 90, 150, 180]);
  P.info("180 Tage mit Tagesaufgabe und einer Runde: " +
    [30, 90, 150, 180].map(t => "Tag " + t + ": " + eins.stand[t]).join(" · ") +
    " von " + eins.gesamt + " Karten");
  /* Gemessen 234 / 426 / 522 / 558, in einem zweiten Lauf 239 / 431 / 514 / 564 — die
     Reihenfolge unterwegs hängt an rng(Date.now()). Die Schranken lassen deshalb Luft;
     sie sollen einen Einbruch fangen, keine Zahl festschreiben. */
  P.ok("nach drei Monaten ist mehr als die Hälfte des Bestands dran gewesen",
    eins.stand[90] > eins.gesamt / 2, eins.stand[90] + "/" + eins.gesamt);
  P.ok("und die Abdeckung wächst weiter, statt stehen zu bleiben",
    eins.stand[180] - eins.stand[150] >= 20, eins.stand[150] + " → " + eins.stand[180]);
  /* Die ehrliche Kehrseite: Wiederholung hat Vorrang vor neuem Stoff, also ist der Bestand
     nach einem halben Jahr mit einer Runde am Tag noch nicht durch. Das ist gewollt und
     steht hier als Zahl, damit es niemand versehentlich für einen Fehler hält. */
  P.ok("ein Rest bleibt dabei offen — eine Runde am Tag reicht nicht für alles",
    eins.stand[180] < eins.gesamt, eins.stand[180] + "/" + eins.gesamt);

  /* Was die Unterwegs-Runde wirklich beiträgt, misst nur der Vergleich mit ihrem Ausbleiben.
     „Heute“ allein bringt in vier Monaten 227 Karten zusammen — zwölf Karten am Tag, davon
     der größte Teil Wiederholung. Mit zwei Runden ist derselbe Zeitraum der ganze Bestand.
     (Zwei Stellen in unterwegsRunde() holen neuen Stoff: Stufe 2 gezielt, Stufe 3 über das
     am längsten nicht Geübte. Abgeklemmt gemessen: jede der beiden schafft die volle
     Abdeckung auch allein, erst ohne beide bleibt es bei 487 von 699.) */
  const ohne = lauf(120, 0, [120]);
  const zwei = lauf(120, 2, [30, 60, 90, 120]);
  P.info("120 Tage nur „Heute“: " + ohne.gesehen + " Karten · mit zwei Runden: " +
    [30, 60, 90, 120].map(t => "Tag " + t + ": " + zwei.stand[t]).join(" · ") +
    " von " + zwei.gesamt);
  P.ok("die Tagesaufgabe allein lässt den größeren Teil des Bestands liegen",
    ohne.gesehen < ohne.gesamt / 2, ohne.gesehen + "/" + ohne.gesamt);
  P.ok("mit zwei Runden am Tag ist der ganze Bestand binnen vier Monaten durch",
    zwei.gesehen === zwei.gesamt, zwei.gesehen + "/" + zwei.gesamt);
}

/* ---------- M · Was die Oberfläche übers Zählen sagt ---------- */
P.titel("M · Was die Oberfläche übers Zählen sagt");
/* Bis zum 22.09.2026 stand unter den Kacheln „Graue Felder sind Tage ohne Tagesaufgabe“.
   Gefärbt wird aber nach dem Tagesziel, und das zählt jede Antwort — tagesZiel() läuft aus
   grade() heraus, egal ob Tagesaufgabe, Unterwegs-Runde oder Fehlerrunde. Ein Spaziergang
   mit 20 Karten färbte das Feld, eine halbe Tagesaufgabe nicht. Die Legende nennt jetzt
   das Tagesziel; hier steht beides nachgemessen, am gerenderten Element. */
{
  const w = boot(null);
  const kachel = n => String(w.eval("(function(){ S.days = {}; for (let i = 0; i < " + n + "; i++) tagesZiel(true);" +
    " PT.tab = 'ueber'; renderFortschritt(); const d = document.querySelectorAll('.dots .dot');" +
    " return d[d.length - 1].className; })()"));
  const ziel = w.eval("TAGESZIEL");
  P.ok("ein Tag knapp unter dem Tagesziel bleibt grau", kachel(ziel - 1) === "dot", kachel(ziel - 1));
  P.ok("ein Tag mit dem Tagesziel ist gefärbt, auch ohne Tagesaufgabe", /\bf[1-5]\b/.test(kachel(ziel)), kachel(ziel));
  const legende = String(w.eval("(function(){ const d = document.querySelector('.dots'); return d.nextElementSibling.textContent; })()"));
  P.ok("die Legende nennt das Tagesziel, nicht die Tagesaufgabe",
    legende.includes("Tagesziel von " + ziel + " Karten") && !/ohne Tagesaufgabe/.test(legende), legende);
}
/* Dieselbe Klasse auf der Startseite: Über „Gezielt trainieren“ stand „Ohne Wertung für die
   Serie“. Die Antworten laufen aber durch grade() und damit durch tagesZiel() — sie zählen
   für die Serie und legen Lernkarten an. Nachgemessen am echten Klickweg. */
{
  const w = boot(null), d = w.document;
  const text = d.querySelector("#freePractice").textContent;
  const chip = d.querySelector("#catChips button");
  chip.click();
  tippe(w, d.querySelector(".opt"));
  const heute = daten(w, "S.days[today()]") || {};
  P.ok("eine Antwort im freien Üben zählt fürs Tagesziel", heute.a === 1, JSON.stringify(heute));
  P.ok("und legt eine Lernkarte an", Object.keys(daten(w, "S.cards")).length === 1);
  P.ok("die Startseite verspricht nichts anderes", !/[Oo]hne Wertung/.test(text) && /Tagesziel/.test(text), text.trim().slice(0, 120));
}

/* ---------- N · Rückkehr aus dem Hintergrund ---------- */
P.titel("N · Rückkehr aus dem Hintergrund");
{
  /* Die Home-Bildschirm-App auf dem iPhone wird eingefroren und am nächsten Morgen
     fortgesetzt, ohne neu zu laden. Nachgestellt, indem die Uhr im laufenden Fenster
     vorgestellt und dann das Ereignis der Rückkehr ausgelöst wird. */
  const uhrVor = (w, tage) => w.eval("(function(){ var E = Date, ms = " + (tage * 86400000) + ";" +
    " function D(){ if(arguments.length) return new (Function.prototype.bind.apply(E, [null].concat([].slice.call(arguments))));" +
    " return new E(E.now() + ms); }" +
    " D.prototype = E.prototype; D.now = function(){ return E.now() + ms; };" +
    " D.parse = E.parse; D.UTC = E.UTC; Date = D; })()");
  const sichtbar = (w, zustand) => {
    Object.defineProperty(w.document, "visibilityState", { get: () => zustand, configurable: true });
    w.document.dispatchEvent(new w.Event("visibilitychange"));
  };
  const erledigt = () => { const days = {}; days[tag(0)] = { a: 12, c: 12, done: true };
    return leererStand({ days, streak: 5, best: 5, last: tag(0), auto: false }); };

  {
    const w = boot(erledigt()), d = w.document;
    const datum = d.querySelector("#dateLbl").textContent;
    P.ok("am Abend steht die Tagesaufgabe auf erledigt", /Erledigt/.test(d.querySelector("#dailyHost h2").textContent));
    d.querySelector("#dailyHost").insertAdjacentHTML("beforeend", '<i id="marke"></i>');
    sichtbar(w, "visible");
    P.ok("am selben Tag zeichnet die Rückkehr nichts neu", !!d.querySelector("#marke"));
    uhrVor(w, 1);
    sichtbar(w, "visible");
    P.ok("am nächsten Morgen steht eine neue Tagesaufgabe da", !!d.querySelector("#startD") &&
      !/Erledigt/.test(d.querySelector("#dailyHost h2").textContent), d.querySelector("#dailyHost h2").textContent);
    P.ok("… und oben das neue Datum", d.querySelector("#dateLbl").textContent !== datum, d.querySelector("#dateLbl").textContent);
    P.ok("nach einem Tag steht die Serie noch", d.querySelector("#hudStreak").textContent === "🔥 5", d.querySelector("#hudStreak").textContent);
    P.ok("die Unterwegs-Karte meldet das Tagesziel nicht mehr als erreicht", !/Tagesziel erreicht/.test(d.querySelector("#walkHost").textContent));
  }
  {
    const w = boot(erledigt()), d = w.document;
    uhrVor(w, 2);
    w.dispatchEvent(new w.Event("focus"));
    P.ok("nach zwei Tagen ist die Serie gerissen — auch über focus erkannt",
      d.querySelector("#hudStreak").textContent === "🔥 0" && daten(w, "S.streak") === 0, d.querySelector("#hudStreak").textContent);
  }
  {
    /* Eine Runde, die über Mitternacht läuft, darf nicht weggezeichnet werden. */
    const w = boot(erledigt()), d = w.document;
    d.querySelector("#wkNew").click();
    const frage = d.querySelector("#walkHost .qtext").textContent;
    const datumVorher = d.querySelector("#dateLbl").textContent;
    uhrVor(w, 1);
    sichtbar(w, "visible");
    P.ok("eine laufende Unterwegs-Runde bleibt stehen", d.querySelector("#walkHost .qtext") &&
      d.querySelector("#walkHost .qtext").textContent === frage && d.body.classList.contains("walk"));
    P.ok("… das Datum oben springt trotzdem", d.querySelector("#dateLbl").textContent !== datumVorher &&
      daten(w, "angezeigterTag") !== daten(w, "today()"), d.querySelector("#dateLbl").textContent);
    w.eval("Q.done = true");
    sichtbar(w, "visible");
    P.ok("auch der Rückblick einer Unterwegs-Runde bleibt stehen, solange der Modus läuft",
      d.body.classList.contains("walk") && !d.querySelector("#walkHost .walkcard"));
    w.eval('go("heute")');
    sichtbar(w, "visible");
    P.ok("danach holt die nächste Rückkehr den Tag nach", daten(w, "angezeigterTag") === daten(w, "today()") && !!d.querySelector("#startD"));
  }
  {
    /* Eine Runde in einer anderen Ansicht (Karten) sperrte den Tageswechsel auf „Heute“ —
       go() lässt nicht fertige Runden dort stehen. */
    const w = boot(erledigt()), d = w.document;
    w.eval('go("karten")');
    d.querySelector("#startSrs").click();
    P.ok("(in Karten läuft eine Runde)", daten(w, "!!(Q && !Q.done && Q.host.id === 'cardHost')"));
    w.eval('go("heute")');
    uhrVor(w, 1);
    sichtbar(w, "visible");
    P.ok("eine Runde in einer anderen Ansicht hält den neuen Tag auf „Heute“ nicht auf", !!d.querySelector("#startD"),
      d.querySelector("#dailyHost h2") && d.querySelector("#dailyHost h2").textContent);
  }
  {
    const w = boot(erledigt()), d = w.document;
    uhrVor(w, 1);
    const ev = new w.Event("pageshow"); Object.defineProperty(ev, "persisted", { value: true });
    w.dispatchEvent(ev);
    P.ok("eine Rückkehr aus dem Seitencache (pageshow) holt den Tag auch", !!d.querySelector("#startD"));
  }

  /* Neu laden nach langer Pause — damit Korrekturen ankommen. jsdom kann nicht neu laden;
     frischLaden() wird ersetzt und gezählt. */
  const mitWorker = { vorLaden(w) { Object.defineProperty(w.navigator, "serviceWorker", { value: { controller: {}, register: () => w.Promise.resolve({}) }, configurable: true }); } };
  const lang = 31 * 60000;
  {
    const w = boot(leererStand({}));
    w.eval('GELADEN.tag = "2000-01-01"');
    P.ok("ohne Service Worker lädt die App nicht neu (offline stünde sonst eine Fehlerseite da)", w.eval("darfFrischLaden(" + lang + ")") === false);
  }
  {
    const w = boot(leererStand({}), mitWorker);
    const darf = p => w.eval("darfFrischLaden(" + p + ")");
    P.ok("am selben Tag, frisch geladen: kein Neuladen", darf(lang) === false);
    w.eval("GELADEN.ms = Date.now() - 7 * 3600000");
    P.ok("nach 6 Stunden seit dem Laden und 30 Minuten Pause: neu laden", darf(lang) === true);
    w.eval('GELADEN.ms = Date.now(); GELADEN.tag = "2000-01-01"');
    P.ok("an einem neuen Tag nach 30 Minuten Pause: neu laden", darf(lang) === true);
    P.ok("nach 10 Minuten Pause nicht", darf(10 * 60000) === false);
    P.ok("ohne gemeldete Pause nicht", darf(0) === false);
    w.eval("speicherDefekt = true");
    P.ok("nicht, wenn der Speicher streikt — der Fortschritt läge nur im Arbeitsspeicher", darf(lang) === false);
    w.eval("speicherDefekt = false");
    w.document.querySelector("#wkNew").click();
    P.ok("nicht während einer Runde", darf(lang) === false);
    w.eval("Q.done = true");
    P.ok("nach dem Ende der Runde schon", darf(lang) === true);
    w.eval('go("karten"); document.querySelector("#startSrs").click(); go("heute")');
    P.ok("eine Runde in einer anderen Ansicht sperrt nicht — sie ist abgelegt", darf(lang) === true &&
      daten(w, "!!(S.session && S.session.list.length)"));
    w.eval('go("schreiben"); WT.tab = "korrektur"; renderSchreiben(); openKorr(KORREKTUR[0].id)');
    P.ok("nicht in einer offenen Fehlersuche", darf(lang) === false);
    w.eval('WT.tab = "check"; renderSchreiben()');
    P.ok("eine über den Unterreiter verlassene Fehlersuche sperrt nicht auf Dauer", daten(w, "!!(KO && !KO.done)") && darf(lang) === true);
    w.eval('KO = null; WT.tab = "impulse"; renderSchreiben(); openPrompt(PROMPTS[0].id)');
    P.ok("nicht bei offenem Schreibfeld", !!w.document.querySelector("#wArea") && darf(lang) === false);
    w.eval('WT.tab = "check"; renderSchreiben(); standDefekt = true');
    P.ok("nicht, solange die Warnung zum unlesbaren Stand steht", darf(lang) === false);
    w.eval("standDefekt = false");
  }
  {
    /* Der Weg über die Ereignisse: versteckt, lange Pause, sichtbar → genau ein Neuladen. */
    const w = boot(leererStand({}), mitWorker);
    w.eval('window.__neu = 0; seiteNeuLaden = function(){ window.__neu++; }; GELADEN.tag = "2000-01-01"');
    sichtbar(w, "hidden");
    w.eval("verstecktSeit -= " + lang);
    sichtbar(w, "visible");
    P.ok("nach langer Pause lädt die Rückkehr neu", daten(w, "__neu") === 1, daten(w, "__neu"));
    P.ok("… und sperrt die alte Seite, bis die neue da ist — ein Tipp dort ginge verloren",
      w.document.body.classList.contains("laedt") && w.document.querySelector(".wrap").inert === true &&
      w.document.querySelector(".head").inert === true);
    w.eval('document.body.classList.remove("laedt"); document.querySelectorAll(".head, .wrap").forEach(e => e.inert = false)');
    sichtbar(w, "hidden");
    sichtbar(w, "visible");
    P.ok("nach kurzer Pause nicht", daten(w, "__neu") === 1, daten(w, "__neu"));
    P.ok("die Pause zählt ab dem Verstecken, nicht ab dem ersten Verstecken des Tages", daten(w, "verstecktSeit") === 0);
    w.dispatchEvent(new w.Event("focus"));
    P.ok("ein focus ohne Pause lädt nicht neu", daten(w, "__neu") === 1, daten(w, "__neu"));
    w.eval('document.body.classList.remove("laedt"); document.querySelectorAll(".head, .wrap").forEach(e => e.inert = false)');
    /* iOS setzt teils über den Seitencache fort: pagehide beim Gehen, pageshow mit persisted
       bei der Rückkehr — ohne visibilitychange. */
    const seitenwechsel = persisted => { const ev = new w.Event("pageshow"); Object.defineProperty(ev, "persisted", { value: persisted }); return ev; };
    w.dispatchEvent(new w.Event("pagehide"));
    w.eval("verstecktSeit -= " + lang);
    w.dispatchEvent(seitenwechsel(true));
    P.ok("pagehide und pageshow aus dem Seitencache laden nach langer Pause auch neu", daten(w, "__neu") === 2, daten(w, "__neu"));
    w.eval('document.body.classList.remove("laedt"); document.querySelectorAll(".head, .wrap").forEach(e => e.inert = false)');
    w.dispatchEvent(new w.Event("pagehide"));
    w.eval("verstecktSeit -= " + lang);
    w.dispatchEvent(seitenwechsel(false));
    P.ok("… ein pageshow ohne Seitencache (erster Aufbau) nicht", daten(w, "__neu") === 2, daten(w, "__neu"));
  }
  {
    /* Ein Text, der noch im Textcheck steht, darf das Neuladen nach mehr als einem Tag nicht
       kosten: Sein Eintrag war dann abgelaufen, und der Start verwarf ihn. */
    const w = boot(leererStand({}), mitWorker);
    w.eval('window.__neu = 0; seiteNeuLaden = function(){ window.__neu++; }; GELADEN.tag = "2000-01-01"');
    w.eval('WT.tab = "check"; go("schreiben"); renderSchreiben()');
    const ta = w.document.querySelector("#tcArea");
    ta.value = "Ich wollte fragen ob ich die Arbeit später abgeben darf.";
    ta.dispatchEvent(new w.Event("input"));
    const TC = "deutschtrainer.v1.tc";
    const alt = JSON.parse(w.localStorage.getItem(TC)); alt.ts -= 25 * 3600000;
    w.localStorage.setItem(TC, JSON.stringify(alt));
    w.eval('go("heute")');
    sichtbar(w, "hidden");
    w.eval("verstecktSeit -= " + lang);
    sichtbar(w, "visible");
    const danach = JSON.parse(w.localStorage.getItem(TC) || "null");
    P.ok("vor dem Neuladen legt die App den Textcheck-Text frisch ab", daten(w, "__neu") === 1 &&
      danach && danach.text === ta.value && Date.now() - danach.ts < 60000, danach && danach.ts);
  }
}

  P.abschluss();
})();
