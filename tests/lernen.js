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
      Object.keys(S.cards).forEach(k => { S.cards[k].d = minusEinTag(S.cards[k].d); });
      S.days = {}; S.last = null;
    }
    return {sorten:sorten, gesehen:gesehen.size, gesamt:alleSchluessel().length, letzte:${tage}};
  })()`);
  const r = lauf(60);
  P.info("60 Tage nur Tagesaufgabe: " + r.sorten.A + " Aufgaben · " + r.sorten.W +
    " Wortkarten · " + r.sorten.F + " Fallkarten · " + r.gesehen + " von " + r.gesamt + " Karten gesehen");
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
  const cards = {};
  for (let i = 1; i <= 40; i++) cards["k" + String(i).padStart(2, "0")] = { b: 5, d: tag(20), s: 6, w: 0 };
  const w = boot(leererStand({ xp: 400, streak: 9, cards }));
  const d = w.document;
  w.eval('go("fortschritt")');
  const zeile = () => d.querySelector("#statHost").textContent.replace(/\s+/g, " ");
  P.ok("vorher steht der gelernte Stand da", /39\s*sitzt sicher/.test(zeile()), zeile().slice(0, 100));

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
  P.ok("und die Ansicht darunter genauso", /2[45]\s*sitzt sicher/.test(zeile()), zeile().slice(0, 100));
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
    feld.dispatchEvent(new w.Event("change"));
    await new Promise(r => setTimeout(r, 120));
  };

  {
    /* Die Anzeigeart steckt im Stand — sie blieb nach dem Import trotzdem hell. */
    const w = boot(leererStand({ xp: 5, theme: "light" }));
    await laden(w, leererStand({ xp: 4300, streak: 21, theme: "dark" }));
    P.ok("die Sicherung ist geladen", daten(w, "S.xp") === 4300, daten(w, "S.xp"));
    P.ok("und die Anzeige ist dunkel",
      w.document.documentElement.getAttribute("data-theme") === "dark",
      w.document.documentElement.getAttribute("data-theme"));
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
    /* Ein Gerät, das die Änderung längst abgearbeitet hat … */
    const cards = {}; cards[id] = { b: 4, d: tag(9), s: 5, w: 0 };
    const merker = {}; merker[id] = datum;
    const w = boot(leererStand({ cards, neu: merker }));
    /* … lädt eine Sicherung von vorher: dieselbe Karte, aber ohne Merker. */
    const altCards = {}; altCards[id] = { b: 4, d: tag(9), s: 5, w: 0 };
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

  P.abschluss();
})();
