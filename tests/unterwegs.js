/* Unterwegs-Modus — der Hauptanwendungsfall.
   Kartenmix in Grenzfällen, automatisches Weiterschalten, Rückblick, Fehlerrunde. */

const { tippe, boot, tag, leererStand, daten, schluessel, pruefer } = require("./setup");
const P = pruefer("A · Zusammensetzung der Runde");

const w0 = boot(null);
const K = schluessel(w0);
const ALLE = [...K.aufgaben, ...K.woerter, ...K.faelle];

function stand(karteFuer) {
  const cards = {};
  ALLE.forEach((k, i) => { const c = karteFuer(k, i); if (c) cards[k] = c; });
  return leererStand({ streak: 5, best: 5, last: tag(-1), cards, auto: false });
}

function runde(st, knopf = "#wkNew") {
  const w = boot(st);
  w.document.querySelector(knopf).click();
  return {
    w,
    liste: daten(w, "Q.list.map(x=>({k:x.key,t:x.type,c:x.cat}))")
  };
}

function sorten(liste) {
  const z = { Aufgabe: 0, Wort: 0, Fall: 0 };
  liste.forEach(x => z[x.k.startsWith("c:") ? "Fall" : x.k.startsWith("w:") ? "Wort" : "Aufgabe"]++);
  return z;
}

const faelle = [
  ["leerer Start", stand(() => null), true],
  ["alles gelernt, nichts fällig", stand(() => ({ b: 5, d: tag(30), s: 6, w: 0 })), true],
  ["alles fällig", stand(() => ({ b: 1, d: tag(-1), s: 2, w: 1 })), true],
  ["wenig fällig", stand((k, i) => i % 40 === 0 ? { b: 1, d: tag(-1), s: 2, w: 1 } : { b: 5, d: tag(30), s: 6, w: 0 }), true],
  ["nur Aufgaben gelernt", stand(k => k[1] === ":" ? null : { b: 5, d: tag(30), s: 6, w: 0 }), false]
];

faelle.forEach(([name, st, alleDrei]) => {
  const { liste } = runde(st);
  const z = sorten(liste);
  P.info(name.padEnd(30) + liste.length + " Karten · Aufgabe " + z.Aufgabe + " · Wort " + z.Wort + " · Fall " + z.Fall);
  P.ok(name + ": volle Runde", liste.length === 20, liste.length);
  P.ok(name + ": keine Doppelten", new Set(liste.map(x => x.k)).size === liste.length);
  P.ok(name + ": keine Tippaufgaben", liste.every(x => x.t !== "fill"));
  if (alleDrei) P.ok(name + ": alle drei Kartenarten", z.Aufgabe > 0 && z.Wort > 0 && z.Fall > 0, JSON.stringify(z));
});

/* Überfälliges muss Vorrang haben */
{
  const st = stand(k => k[1] === ":" ? { b: 1, d: tag(-9), s: 3, w: 2 } : { b: 5, d: tag(30), s: 6, w: 0 });
  const z = sorten(runde(st).liste);
  P.ok("Überfällige Wort- und Fallkarten kommen zuerst", z.Wort + z.Fall >= 15, JSON.stringify(z));
}

/* Wochenschwerpunkt des Lernplans wirkt auf neuen Stoff */
{
  const ohne = sorten(runde(stand(() => null)).liste);
  const mitPlan = leererStand({
    auto: false,
    level: { komma: 40, zeichen: 90, gross: 90, getrennt: 90, recht: 90, gram: 95, satz: 95, zahlen: 90, stil: 90, form: 90 },
    levelDate: tag(0),
    plan: { start: tag(0), order: ["komma", "zeichen", "gross", "getrennt", "recht", "gram", "satz", "zahlen", "stil", "form"], shift: 0 }
  });
  const liste = runde(mitPlan).liste;
  const komma = liste.filter(x => x.c === "komma").length;
  P.ok("Lernplan lenkt auch die Unterwegs-Runde", komma >= 5, komma + " Kommakarten");
  void ohne;
}

/* ---------- B · Automatisches Weiterschalten ---------- */
P.titel("B · Automatik");
const schlaf = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  {
    const w = boot(leererStand({ auto: true }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    const vor = daten(w, "({i:Q.i, ans:Q.list[Q.i].ans})");
    tippe(w, d.querySelectorAll(".opt")[vor.ans]);
    P.ok("Laufstreifen nach richtiger Antwort", d.body.classList.contains("autolauf"));
    await schlaf(2600);
    P.ok("schaltet von selbst weiter", daten(w, "Q.i") === vor.i + 1, daten(w, "Q.i"));
    const jetzt = daten(w, "({i:Q.i, ans:Q.list[Q.i].ans})");
    const falsch = [...d.querySelectorAll(".opt")].findIndex((b, i) => i !== jetzt.ans);
    tippe(w, d.querySelectorAll(".opt")[falsch]);
    await schlaf(2600);
    P.ok("nach Fehler bleibt es stehen", daten(w, "Q.i") === jetzt.i);
  }
  {
    const w = boot(leererStand({ auto: true, speak: true }), { sprichSofortZuEnde: true });
    const d = w.document;
    d.querySelector("#wkNew").click();
    const vor = daten(w, "({i:Q.i, ans:Q.list[Q.i].ans})");
    P.ok("Frage wird vorgelesen", (w.__gesagt || []).length > 0);
    tippe(w, d.querySelectorAll(".opt")[vor.ans]);
    await schlaf(900);
    P.ok("beim Vorlesen erst nach dem Satzende weiter", daten(w, "Q.i") === vor.i + 1, daten(w, "Q.i"));
  }
  {
    /* Fehlerklasse „abgebrochener Rückruf schaltet die nächste Frage weg“: Tippt Nils
       auf „Weiter“, statt die vorgelesene Erklärung abzuwarten, bricht next() das
       Vorlesen ab. Der Browser meldet den Abbruch wie ein normales Satzende — und der
       Rückruf armierte die Automatik auf der nächsten, noch unbeantworteten Frage, die
       600 ms später ungefragt übersprungen wurde. In einer Runde von zwanzig Karten
       kam so nur jede zweite dran, und das Rundenende meldete „10 von 20 richtig“,
       obwohl keine Antwort falsch war. */
    const w = boot(leererStand({ auto: true, speak: true }));   // Vorlesen endet nicht von selbst
    const d = w.document;
    d.querySelector("#wkNew").click();
    const vor = daten(w, "({i:Q.i, ans:Q.list[Q.i].ans})");
    tippe(w, d.querySelectorAll(".opt")[vor.ans]);
    d.querySelector("#nextBtn").click();          // weitertippen, statt zuzuhören
    await schlaf(60);                             // dem gemeldeten Satzende Zeit geben
    P.ok("Weitertippen armiert die Automatik nicht auf der neuen Frage",
      !d.body.classList.contains("autolauf"));
    const jetzt = daten(w, "Q.i");
    await schlaf(900);                            // länger als die 600 ms der Automatik
    P.ok("die neue Frage wird nicht übersprungen", daten(w, "Q.i") === jetzt,
      "aus Frage " + jetzt + " wurde " + daten(w, "Q.i"));
    P.ok("und sie ist noch unbeantwortet",
      d.querySelectorAll(".opt.right,.opt.wrong").length === 0);
  }
  {
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    const vor = daten(w, "({i:Q.i, ans:Q.list[Q.i].ans})");
    tippe(w, d.querySelectorAll(".opt")[vor.ans]);
    await schlaf(2600);
    P.ok("abgeschaltet: bleibt stehen", daten(w, "Q.i") === vor.i);
    P.ok("Schalter vorhanden", !!d.querySelector("#walkAuto"));
    d.querySelector("#walkAuto").click();
    P.ok("Schalter merkt sich den Zustand", daten(w, "S.auto") === true);
  }

  /* ---------- C · Rückblick am Rundenende ---------- */
  P.titel("C · Rückblick");
  {
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    let n = 0;
    while (daten(w, "!!(Q && !Q.done)") && n < 90) {
      const st = daten(w, "({ans:Q.list[Q.i].ans, nochmal:!!Q.list[Q.i]._nochmal})");
      const opts = [...d.querySelectorAll(".opt")];
      const falsch = opts.findIndex((b, i) => i !== st.ans);
      const wahl = (n % 3 === 0 && !st.nochmal && falsch >= 0) ? falsch : st.ans;
      tippe(w, opts[wahl]);
      const weiter = d.querySelector("#nextBtn");
      if (!weiter) break;
      weiter.click();
      n++;
    }
    const host = d.querySelector("#walkHost");
    P.ok("Abschluss erscheint", /richtig/.test(host.textContent));
    const zeilen = [...d.querySelectorAll(".fehlerzeile")];
    P.ok("Fehler nach Regel gebündelt", zeilen.length > 0 && zeilen.length <= 4, zeilen.length);
    P.ok("jede Zeile mit Titel und Anzahl", zeilen.every(z => /\d+×/.test(z.textContent) && z.textContent.length > 4));
    if (zeilen.length) {
      zeilen[0].click();
      P.ok("Antippen öffnet die Regel", !!d.querySelector(".acc.open"));
      P.ok("Unterwegs-Modus danach beendet", !d.body.classList.contains("walk"));
    }
  }
  {
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    let n = 0;
    while (daten(w, "!!(Q && !Q.done)") && n < 60) {
      tippe(w, d.querySelectorAll(".opt")[daten(w, "Q.list[Q.i].ans")]);
      const weiter = d.querySelector("#nextBtn");
      if (!weiter) break;
      weiter.click();
      n++;
    }
    P.ok("fehlerfreie Runde ohne Rückblick", d.querySelectorAll(".fehlerzeile").length === 0);
    P.ok("Ergebnis stimmt", /20 von 20 richtig/.test(d.querySelector("#walkHost").textContent));
  }

  /* ---------- D · Runde nur aus Fehlern ---------- */
  P.titel("D · Nur Fehler");
  {
    const schwach = [...K.aufgaben.slice(0, 14), ...K.woerter.slice(0, 8), ...K.faelle.slice(0, 8)];
    const cards = {};
    schwach.forEach((k, i) => cards[k] = { b: 1, d: tag(3), s: 3, w: (i % 4) + 1 });
    K.aufgaben.slice(20, 60).forEach(k => cards[k] = { b: 4, d: tag(9), s: 5, w: 0 });
    const w = boot(leererStand({ cards, auto: false }));
    const d = w.document;
    const knopf = d.querySelector("#wkWeak");
    P.ok("Knopf „Nur Fehler“ sichtbar", !!knopf);
    P.ok("Anzahl stimmt", knopf && knopf.textContent.includes(String(schwach.length)), knopf && knopf.textContent);
    knopf.click();
    const liste = daten(w, "Q.list.map(x=>x.key)");
    P.ok("Runde hat 20 Karten", liste.length === 20, liste.length);
    P.ok("nur Karten mit Fehlern", liste.every(k => schwach.includes(k)));
    P.ok("alle drei Kartenarten", new Set(liste.map(k => k.startsWith("c:") ? "F" : k.startsWith("w:") ? "W" : "A")).size === 3);
    const haeufig = liste.filter(k => (cards[k].w || 0) >= 3).length;
    P.ok("häufigste Fehler zuerst", haeufig >= 8, haeufig);

    const rein = boot(leererStand({ cards: Object.fromEntries(K.aufgaben.slice(0, 40).map(k => [k, { b: 4, d: tag(9), s: 5, w: 0 }])) }));
    P.ok("ohne Fehler kein Knopf", !rein.document.querySelector("#wkWeak"));
  }

  /* ---------- E · Fortsetzen ---------- */
  P.titel("E · Fortsetzen");
  {
    /* Fehlerklasse „beantwortete Frage kommt beim Fortsetzen noch einmal“: sitzungSichern()
       hielt nur Q.i fest, nicht ob die Frage an dieser Stelle schon beantwortet und über
       grade() verbucht war. Wer nach der Rückmeldung auf „Beenden“ tippte, bekam beim
       Fortsetzen dieselbe Frage — samt der Lösung, die eben in der Rückmeldung stand. Eine
       gerade falsch beantwortete Karte stieg dadurch auf Fach 2 und kam erst in drei Tagen
       wieder statt am nächsten Tag; das Tagesziel zählte sie doppelt. Denselben Zustand
       erzeugt iOS von allein, wenn es die Seite im Hintergrund verwirft. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    const erste = daten(w, "({key:Q.list[0].key, ans:Q.list[0].ans, frage:Q.list[0].q})");
    const falsch = [...d.querySelectorAll(".opt")].findIndex((b, i) => i !== erste.ans);
    tippe(w, d.querySelectorAll(".opt")[falsch]);
    const nachFehler = daten(w, "S.cards[" + JSON.stringify(erste.key) + "]");
    const tagNachFehler = daten(w, "S.days[today()]");
    P.ok("falsch beantwortet: Karte in Fach 1", nachFehler && nachFehler.b === 1, nachFehler);

    d.querySelector("#walkOut").click();                    // „Beenden“ mitten in der Rückmeldung
    const gemerkt = daten(w, "S.session");
    P.ok("die Runde ist gemerkt", !!gemerkt && Array.isArray(gemerkt.list), gemerkt);
    P.ok("und weiß, dass die Frage schon verbucht ist", !!gemerkt && gemerkt.fertig === true, gemerkt && gemerkt.fertig);

    const stand2 = daten(w, "S");
    const w2 = boot(stand2);
    const d2 = w2.document;
    P.ok("die Startseite bietet das Fortsetzen an", !!d2.querySelector("#wkOn"));
    d2.querySelector("#wkOn").click();
    P.ok("es geht hinter der beantworteten Frage weiter", daten(w2, "Q.i") === 1, daten(w2, "Q.i"));
    P.ok("nicht dieselbe Frage noch einmal",
      daten(w2, "Q.list[Q.i].q") !== erste.frage, daten(w2, "Q.list[Q.i].q"));

    /* Die eigentliche Folge: die Karte darf nicht durch die aufgedeckte Lösung aufsteigen. */
    const wahl2 = daten(w2, "Q.list[Q.i].ans");
    tippe(w2, d2.querySelectorAll(".opt")[wahl2]);
    const spaeter = daten(w2, "S.cards[" + JSON.stringify(erste.key) + "]");
    P.ok("die falsch beantwortete Karte bleibt in Fach 1",
      spaeter && spaeter.b === 1, spaeter);
    const tagSpaeter = daten(w2, "S.days[today()]");
    P.ok("und zählt für das Tagesziel nur einmal",
      (tagSpaeter.a || 0) === (tagNachFehler.a || 0) + 1,
      "vorher " + (tagNachFehler.a || 0) + ", nachher " + (tagSpaeter.a || 0));
  }
  {
    /* Gegenprobe: wer beendet, ohne geantwortet zu haben, bekommt seine Frage zurück. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    const frage = daten(w, "Q.list[Q.i].q");
    d.querySelector("#walkOut").click();
    P.ok("unbeantwortet beendet: nicht als verbucht gemerkt", daten(w, "S.session.fertig") === false);
    const w2 = boot(daten(w, "S"));
    w2.document.querySelector("#wkOn").click();
    P.ok("dieselbe Frage kommt wieder", daten(w2, "Q.i") === 0 && daten(w2, "Q.list[Q.i].q") === frage);
  }
  {
    /* War die verbuchte Frage die letzte, gibt es nichts mehr fortzusetzen — sonst
       stünde der Zeiger hinter dem Ende der Liste. */
    const w = boot(leererStand({ auto: false }));
    w.eval("S.session = {list:[{key:'k01'},{key:'k02'}], i:1, correct:0, base:2, title:'x', walk:true, fertig:true, ts:Date.now()}");
    P.ok("hinter der letzten Frage ist die Runde vorbei", daten(w, "sitzungOffen()") === null);
    w.eval("S.session.fertig = false");
    P.ok("dieselbe Sitzung unbeantwortet ist offen", daten(w, "sitzungOffen() && sitzungOffen().i") === 1);
  }

  /* ---------- F · Zwei Runden gleichzeitig ---------- */
  P.titel("F · Zwei Runden gleichzeitig");
  {
    /* Fehlerklasse „globaler Zustand, dokumentweite Abfragen“: In der Heute-Ansicht liegen
       zwei Wirtsbereiche übereinander (#walkHost und #dailyHost). startQuiz() überschrieb
       nur den einen; die Karte im anderen blieb samt Antwortknöpfen stehen und bedienbar.
       Q ist aber global, und check() suchte mit $$(".opt") und $("#fbHost") im ganzen
       Dokument: Ein Tipp auf die stehengebliebene Karte bewertete die aktuelle Frage der
       anderen Runde — gemessen wurde so eine Fallkarte auf Fach 2 gesetzt, die nie auf dem
       Schirm war. Weil #walkHost im Markup vor #dailyHost steht, traf $("#fbHost") dabei
       den falschen Wirt. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    P.ok("Unterwegs-Runde läuft in #walkHost", daten(w, "Q.host.id") === "walkHost");
    w.eval('go("heute")');
    d.querySelector("#startD").click();
    P.ok("Tagesaufgabe läuft in #dailyHost", daten(w, "Q.host.id") === "dailyHost");
    P.ok("nur eine Frage steht auf dem Schirm", d.querySelectorAll(".qtext").length === 1,
      d.querySelectorAll(".qtext").length);
    /* Im Wirt der alten Runde darf keine Frage mit Antwortknöpfen stehen bleiben. Was
       dort steht, ist die gewöhnliche Unterwegs-Kachel — der Wechsel auf Heute beendet
       die Unterwegs-Runde und zeichnet sie neu. */
    P.ok("die Karte der alten Runde ist weg",
      !d.querySelector("#walkHost .qtext") && !d.querySelector("#walkHost .opt"),
      d.querySelector("#walkHost").innerHTML.slice(0, 80));

    /* Selbst wenn im anderen Wirt etwas steht, darf check() es nicht anfassen. */
    d.querySelector("#walkHost").innerHTML =
      '<div id="fbHost"></div><button class="opt" data-i="0"><span>Rest</span></button>';
    const dran = daten(w, "Q.list[Q.i].key");
    tippe(w, d.querySelectorAll("#dailyHost .opt")[daten(w, "Q.list[Q.i].ans")]);
    P.ok("die Rückmeldung landet im eigenen Wirt", !!d.querySelector("#dailyHost .fb"));
    P.ok("der fremde Wirt bleibt leer", d.querySelector("#walkHost #fbHost").innerHTML === "",
      d.querySelector("#walkHost #fbHost").innerHTML.slice(0, 60));
    P.ok("der fremde Knopf wird nicht eingefärbt",
      d.querySelector("#walkHost .opt").className === "opt",
      d.querySelector("#walkHost .opt").className);
    P.ok("bewertet wurde die Karte der laufenden Runde",
      !!daten(w, "S.cards[" + JSON.stringify(dran) + "] || null"));
    P.ok("und sonst keine", Object.keys(daten(w, "S.cards")).length === 1,
      Object.keys(daten(w, "S.cards")).join(", "));
  }

  /* ---------- G · Wege aus einer Runde heraus ---------- */
  P.titel("G · Wege aus einer Runde heraus");
  {
    /* Fehlerklasse „Sackgasse“: body.walk blendet die Reiterleiste aus. Der Link
       „→ Regel nachlesen“ aus der Rückmeldung rief go("regeln"), und go() fasste
       body.walk nicht an — die Regelansicht stand ohne Reiterleiste da, die laufende Runde
       lag in einer ausgeblendeten Ansicht, und der einzige Ausweg war ein Neuladen. In der
       vom Startbildschirm gestarteten Web-App gibt es dafür keinen Knopf. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    P.ok("Unterwegs-Modus an", d.body.classList.contains("walk"));
    /* Die Mischung der Runde ist nicht tagesfest, und Wortkarten tragen keine Regel —
       also zur ersten Karte vorrücken, die eine hat, statt auf die erste zu bauen. */
    w.eval("while(Q.i < Q.list.length - 1 && !Q.list[Q.i].rule) Q.i++; renderQ();");
    P.ok("eine Karte mit Regel gefunden", !!daten(w, "Q.list[Q.i].rule || null"));
    const ans = daten(w, "Q.list[Q.i].ans");
    tippe(w, [...d.querySelectorAll("#walkHost .opt")][ans === 0 ? 1 : 0]);   // falsch, damit die Regel dabeisteht
    const lnk = d.querySelector("#walkHost [data-rule]");
    P.ok("die Rückmeldung verweist auf die Regel", !!lnk);
    lnk.onclick(new w.Event("click"));         // der Prüflauf klemmt echte Anker-Klicks ab
    P.ok("die Regelansicht ist offen",
      [...d.querySelectorAll(".view.on")].map(x => x.id).join() === "v-regeln",
      [...d.querySelectorAll(".view.on")].map(x => x.id).join());
    P.ok("der Unterwegs-Modus ist beendet", !d.body.classList.contains("walk"));
    /* Am gerechneten Stil geprüft, nicht am Vorhandensein der Knoten: body.walk blendet
       die Leiste per CSS aus, die Elemente stehen die ganze Zeit im Dokument. */
    P.ok("die Reiterleiste ist wieder sichtbar",
      w.getComputedStyle(d.querySelector(".tabs")).display !== "none",
      w.getComputedStyle(d.querySelector(".tabs")).display);
    P.ok("die Runde ist gemerkt", !!daten(w, "S.session"));
    w.eval('go("heute")');
    P.ok("und lässt sich fortsetzen", !!d.querySelector("#wkOn"));
  }
  {
    /* Fehlerklasse „Runde ohne Ausstieg“: Nur der Unterwegs-Kopf hatte einen
       Beenden-Knopf. Wer auf Heute ein Thema antippte oder die Tagesaufgabe startete, kam
       nur durch Neuladen wieder heraus — alle sieben Reiter durchklicken half nicht, weil
       go() die Heute-Ansicht gesperrt hält, solange dort eine Runde läuft. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    w.eval('go("heute")');
    d.querySelector("#startD").click();
    P.ok("die Tagesaufgabe läuft", daten(w, "!!(Q && !Q.done)"));
    const raus = d.querySelector("#quizOut");
    P.ok("der Rundenkopf hat einen Ausstieg", !!raus);
    P.ok("und er weiß, wohin zurück", daten(w, "(Q && Q.zurueck) || null") === "heute", daten(w, "(Q && Q.zurueck) || null"));
    if (raus) raus.click();
    P.ok("die Runde ist beendet", daten(w, "Q") === null);
    P.ok("die Tagesaufgabe steht wieder da", !!d.querySelector("#startD"),
      d.querySelector("#dailyHost").textContent.slice(0, 60));
    P.ok("und sie ist gemerkt", !!daten(w, "S.session"));
    P.ok("mit dem Stand von vorher", daten(w, "(S.session && S.session.i) === 0"));
  }

  /* ---------- H · Rückmeldung im Bild ---------- */
  P.titel("H · Rückmeldung im Bild");
  {
    /* Nach einer falschen Antwort standen Erklärung und Weiter-Knopf oft unter der
       Falzkante. Die .walkbar ist zwar position:sticky;bottom:0, klebt aber nur innerhalb
       ihres Elternblocks — und der beginnt erst hinter der Rückmeldung. Im Browser
       gemessen (375x667, zwölf falsche Antworten): Weiter-Knopf im Bild vorher 4 von 12,
       jetzt 12 von 12; Tagesaufgabe 0 von 12 auf 12 von 12.

       jsdom rechnet kein Layout — alle Rechtecke sind null, zeigeRueckmeldung() hält sich
       dort also für fertig. Geprüft wird deshalb die Entscheidung selbst, mit
       untergeschobenen Rechtecken: scrollt sie, wenn die Rückmeldung unter dem Rand liegt,
       und hält sie still, wenn Nils inzwischen selbst gescrollt hat. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    const ans = daten(w, "Q.list[0].ans");
    tippe(w, [...d.querySelectorAll("#walkHost .opt")][ans === 0 ? 1 : 0]);
    w.eval(`
      window.__gescrollt = [];
      window.scrollTo = (a, b) => window.__gescrollt.push(a && typeof a === "object" ? a.top : b);
      Element.prototype.getBoundingClientRect = function(){
        return {top:900, bottom:1000, left:0, right:0, width:0, height:0, x:0, y:900};
      };
    `);
    P.ok("es gibt eine Stelle, die dafür sorgt", daten(w, "typeof zeigeRueckmeldung") === "function");
    try { w.eval("zeigeRueckmeldung()"); } catch (e) { /* gibt es nicht — die Prüfung darunter meldet es */ }
    P.ok("liegt die Rückmeldung unter dem Rand, wird gescrollt",
      daten(w, "__gescrollt.length") === 1, daten(w, "__gescrollt"));
    P.ok("und zwar so, dass die Frage angeschnitten bleibt",
      daten(w, "(__gescrollt[0] === undefined ? null : __gescrollt[0])") === 830,
      daten(w, "(__gescrollt[0] === undefined ? null : __gescrollt[0])"));

    /* Zweiter Fall: Nils hat selbst gescrollt — dann holt ihn die App nicht zurück. */
    const w2 = boot(leererStand({ auto: false }));
    const d2 = w2.document;
    d2.querySelector("#wkNew").click();
    const ans2 = daten(w2, "Q.list[0].ans");
    tippe(w2, [...d2.querySelectorAll("#walkHost .opt")][ans2 === 0 ? 1 : 0]);
    w2.eval(`
      window.__gescrollt = [];
      window.scrollTo = (a, b) => window.__gescrollt.push(a && typeof a === "object" ? a.top : b);
      Element.prototype.getBoundingClientRect = function(){
        return {top:900, bottom:1000, left:0, right:0, width:0, height:0, x:0, y:900};
      };
    `);
    Object.defineProperty(w2, "scrollY", { value: 500, configurable: true });
    try { w2.eval("zeigeRueckmeldung()"); } catch (e) { /* siehe oben */ }
    P.ok("wer selbst gescrollt hat, wird nicht zurückgeholt",
      daten(w2, "__gescrollt.length") === 0, daten(w2, "__gescrollt"));
  }

  /* ---------- I · Prelltipp, Enter und Bildschirmsperre ---------- */
  P.titel("I · Prelltipp, Enter und Bildschirmsperre");
  {
    /* Fehlerklasse „der zweite Tipp landet auf der neuen Karte“: renderQ() ersetzt den
       Inhalt sofort. Ein Nachfassen an derselben Stelle — unsicherer Daumen in Bewegung —
       trifft, was dort jetzt liegt, und über eine Runde von 20 Karten liegt der
       Weiter-Knopf dreimal (393x852) genau über einer Antwortoption der Folgefrage. Die
       Karte stand danach ungesehen als Fehler im Lernstand und in der „Nur Fehler“-Runde. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    const erste = daten(w, "({key:Q.list[0].key, ans:Q.list[0].ans})");
    d.querySelectorAll(".opt")[erste.ans].click();          // sofort, ohne tippe()
    P.ok("ein Tipp binnen 350 ms zählt nicht",
      daten(w, "S.cards[" + JSON.stringify(erste.key) + "] || null") === null,
      daten(w, "S.cards[" + JSON.stringify(erste.key) + "] || null"));
    P.ok("und die Karte steht noch unbeantwortet da",
      d.querySelectorAll(".opt.right,.opt.wrong").length === 0);
    await schlaf(400);
    d.querySelectorAll(".opt")[erste.ans].click();
    P.ok("danach zählt sie normal",
      !!daten(w, "S.cards[" + JSON.stringify(erste.key) + "] || null"));
  }
  {
    /* Fehlerklasse „ein Tastendruck, zwei Horcher“: Das Eingabefeld einer Tippaufgabe
       hatte einen eigenen Enter-Horcher, und der Horcher am Dokument prüfte denselben
       Druck noch einmal, fand den eben entstandenen Weiter-Knopf und drückte ihn. Ein
       Enter wertete also die Antwort und blätterte gleich weiter — „Richtig wäre: …“ war
       nie zu sehen, bei einer Tippaufgabe genau der Ertrag. Unterwegs betrifft es nichts,
       dort filtert startQuiz() Tippaufgaben heraus. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    w.eval('startQuiz(ALL.filter(i=>i.t==="fill").slice(0,3).map(exQuestion), document.querySelector("#dailyHost"), {title:"Tippen"})');
    P.ok("eine Tippaufgabe steht da", !!d.querySelector("#fillIn"));
    w.eval("Q.frageSeit = 0");
    const feld = d.querySelector("#fillIn");
    feld.value = "irgendwas Falsches";
    const taste = new w.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    feld.dispatchEvent(taste);
    P.ok("die Korrektur steht auf dem Schirm", !!d.querySelector("#dailyHost .fb"));
    P.ok("und die App ist nicht weitergeblättert", daten(w, "Q.i") === 0, daten(w, "Q.i"));
    const rueck = d.querySelector("#dailyHost .fb");
    P.ok("„Richtig wäre“ ist zu lesen", !!rueck && /Richtig wäre/.test(rueck.textContent),
      rueck && rueck.textContent.slice(0, 60));
  }
  {
    /* Fehlerklasse „einmal angefordert, für immer verloren“: Der Browser gibt die
       Bildschirmsperre frei, sobald das Dokument unsichtbar wird — Anruf, Sperrtaste,
       App-Wechsel. Die App erfuhr davon nichts, wakeSperre blieb gesetzt, und genau daran
       scheiterte jede Neuanforderung. Der Bildschirm ging danach für den Rest der Sitzung
       aus, obwohl die Kartenansicht das Gegenteil verspricht. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    await schlaf(30);
    P.ok("die Bildschirmsperre ist angefordert", w.__wakeSperren.length === 1, w.__wakeSperren.length);
    P.ok("und die App hält sie", daten(w, "!!wakeSperre"));
    w.__wakeVerlieren();                      // das tut der Browser beim Wegblenden
    P.ok("nach dem Wegblenden merkt die App, dass sie weg ist", daten(w, "!!wakeSperre") === false);
    d.dispatchEvent(new w.Event("visibilitychange"));
    await schlaf(30);
    P.ok("bei der Rückkehr fordert sie neu an", w.__wakeSperren.length === 2, w.__wakeSperren.length);
    P.ok("und hält sie wieder", daten(w, "!!wakeSperre"));
  }

  /* ---------- J · Rückmeldung ohne Farbe und ohne Maus ---------- */
  P.titel("J · Rückmeldung ohne Farbe und ohne Maus");
  {
    /* Zwei Fehlerklassen auf einmal.

       „Nur der Farbton unterscheidet“: Rand und Fläche von richtig und falsch liegen bei
       1,03:1 bzw. 1,02:1 Helligkeitsverhältnis — in Graustufen identisch. Dieselbe
       Entsättigung erzeugt ein Handydisplay in der Sonne, also genau Nils' Standardfall.

       „Die Runde läuft stumm“: Es gab in der ganzen Datei keine einzige Live-Region, und
       der Fokus fiel bei jedem Schritt auf <body> — check() deaktiviert die angetippte
       Fläche, renderQ() ersetzt danach den ganzen Kartenblock. Vorlese-Software sagte
       weder die Rückmeldung noch die nächste Frage an. */
    const w = boot(leererStand({ auto: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    const richtig = daten(w, "Q.list[Q.i].ans");
    const falsch = richtig === 0 ? 1 : 0;
    tippe(w, d.querySelectorAll("#walkHost .opt")[falsch]);

    const marke = i => d.querySelectorAll("#walkHost .opt")[i].querySelector(".k").textContent;
    P.ok("die richtige Fläche trägt einen Haken", marke(richtig) === "✓", marke(richtig));
    P.ok("die falsch gewählte ein Kreuz", marke(falsch) === "✗", marke(falsch));
    P.ok("und beides sind Zeichen, keine Buchstaben — der Buchstabe stand vorher auf beiden",
      !/[A-Za-z]/.test(marke(richtig) + marke(falsch)), marke(richtig) + marke(falsch));

    const fbh = d.querySelector("#walkHost #fbHost");
    P.ok("die Rückmeldung ist eine Live-Region", fbh && fbh.getAttribute("role") === "status",
      fbh && fbh.getAttribute("role"));
    P.ok("und wird angesagt, wenn die App nicht selbst redet",
      fbh && fbh.getAttribute("aria-live") === "polite", fbh && fbh.getAttribute("aria-live"));
    P.ok("der Fokus steht auf dem Weiter-Knopf",
      d.activeElement && d.activeElement.id === "nextBtn",
      d.activeElement && (d.activeElement.id || d.activeElement.tagName));
  }
  {
    /* Läuft die App-eigene Sprachausgabe, muss die Live-Region still bleiben — sonst
       redeten zwei Stimmen gleichzeitig. */
    const w = boot(leererStand({ auto: false, speak: true }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    tippe(w, d.querySelectorAll("#walkHost .opt")[daten(w, "Q.list[Q.i].ans")]);
    const fbh = d.querySelector("#walkHost #fbHost");
    P.ok("beim Vorlesen bleibt die Live-Region still",
      fbh && fbh.getAttribute("aria-live") === "off", fbh && fbh.getAttribute("aria-live"));
  }
  {
    /* Die beiden Unterwegs-Schalter sagen jetzt, wie sie heißen und ob sie an sind. */
    const w = boot(leererStand({ auto: false, speak: false }));
    const d = w.document;
    d.querySelector("#wkNew").click();
    const au = d.querySelector("#walkAuto");
    P.ok("der Automatik-Schalter hat einen Namen",
      !!au && (au.getAttribute("aria-label") || "").length > 5, au && au.getAttribute("aria-label"));
    P.ok("und sagt, dass er aus ist", au.getAttribute("aria-pressed") === "false");
    au.click();
    P.ok("nach dem Umschalten sagt er, dass er an ist", au.getAttribute("aria-pressed") === "true");
    const sp = d.querySelector("#walkSpeak");
    if (sp) {
      P.ok("der Vorlese-Schalter hat einen Namen", (sp.getAttribute("aria-label") || "").length > 5,
        sp.getAttribute("aria-label"));
      P.ok("und sagt, dass er aus ist", sp.getAttribute("aria-pressed") === "false");
      sp.click();
      P.ok("nach dem Umschalten sagt er, dass er an ist", sp.getAttribute("aria-pressed") === "true");
    }
  }

  P.abschluss();
})();
