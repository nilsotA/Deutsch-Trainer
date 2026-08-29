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

  P.abschluss();
})();
