/* Unterwegs-Modus — der Hauptanwendungsfall.
   Kartenmix in Grenzfällen, automatisches Weiterschalten, Rückblick, Fehlerrunde. */

const { boot, tag, leererStand, daten, schluessel, pruefer } = require("./setup");
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
    d.querySelectorAll(".opt")[vor.ans].click();
    P.ok("Laufstreifen nach richtiger Antwort", d.body.classList.contains("autolauf"));
    await schlaf(2600);
    P.ok("schaltet von selbst weiter", daten(w, "Q.i") === vor.i + 1, daten(w, "Q.i"));
    const jetzt = daten(w, "({i:Q.i, ans:Q.list[Q.i].ans})");
    const falsch = [...d.querySelectorAll(".opt")].findIndex((b, i) => i !== jetzt.ans);
    d.querySelectorAll(".opt")[falsch].click();
    await schlaf(2600);
    P.ok("nach Fehler bleibt es stehen", daten(w, "Q.i") === jetzt.i);
  }
  {
    const w = boot(leererStand({ auto: true, speak: true }), { sprichSofortZuEnde: true });
    const d = w.document;
    d.querySelector("#wkNew").click();
    const vor = daten(w, "({i:Q.i, ans:Q.list[Q.i].ans})");
    P.ok("Frage wird vorgelesen", (w.__gesagt || []).length > 0);
    d.querySelectorAll(".opt")[vor.ans].click();
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
    d.querySelectorAll(".opt")[vor.ans].click();
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
    d.querySelectorAll(".opt")[vor.ans].click();
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
      opts[wahl].click();
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
      d.querySelectorAll(".opt")[daten(w, "Q.list[Q.i].ans")].click();
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
    d.querySelectorAll(".opt")[falsch].click();
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
    d2.querySelectorAll(".opt")[wahl2].click();
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
    P.ok("die Karte der alten Runde ist weg", d.querySelector("#walkHost").innerHTML === "",
      d.querySelector("#walkHost").innerHTML.slice(0, 60));

    /* Selbst wenn im anderen Wirt etwas steht, darf check() es nicht anfassen. */
    d.querySelector("#walkHost").innerHTML =
      '<div id="fbHost"></div><button class="opt" data-i="0"><span>Rest</span></button>';
    const dran = daten(w, "Q.list[Q.i].key");
    d.querySelectorAll("#dailyHost .opt")[daten(w, "Q.list[Q.i].ans")].click();
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

  P.abschluss();
})();
