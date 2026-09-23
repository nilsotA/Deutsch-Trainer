/* Layout im echten Browser — was jsdom nicht sehen kann.
   jsdom rechnet kein Layout: Breiten, Höhen und Überdeckung sind dort null. Dieser Lauf
   öffnet die App in Chromium bei Handygrößen und misst. Er gehört nicht in `npm test`,
   weil er einen Browser braucht; ohne playwright-core oder Chromium überspringt er sich.

   Anlass (23.09.2026): Im Unterwegs-Modus brauchte auf 375×667 (iPhone SE) jede der 155
   Wortkarten Scrollen, um die vierte Antwort zu sehen — beim Gehen, einhändig, sieht man
   sie dann nicht. Gemessen wird deshalb jede Karte, die unterwegs vorkommen kann, einzeln. */

const fs = require("fs");
const path = require("path");
const { pruefer } = require("./setup");

let chromium;
try { ({ chromium } = require("playwright-core")); } catch (e) { chromium = null; }
const KANDIDATEN = [process.env.CHROMIUM_PATH, "/opt/pw-browsers/chromium/chrome-linux/chrome"]
  .concat(fs.existsSync("/opt/pw-browsers") ? fs.readdirSync("/opt/pw-browsers")
    .filter(d => /^chromium-\d+$/.test(d)).map(d => "/opt/pw-browsers/" + d + "/chrome-linux/chrome") : [])
  .filter(Boolean);
const BROWSER = KANDIDATEN.find(p => fs.existsSync(p));

if (!chromium || !BROWSER) {
  console.log("Layoutlauf übersprungen: " + (!chromium ? "playwright-core fehlt (npm install)" :
    "kein Chromium gefunden (CHROMIUM_PATH setzen)") + ".");
  process.exit(0);
}

const APP = "file://" + path.join(__dirname, "..", "Deutsch-Trainer.html");
const VIEWS = ["heute", "karten", "saetze", "formulieren", "schreiben", "regeln", "fortschritt"];
const P = pruefer("A · Hauptansichten auf dem Handy");

/* Überlauf nach rechts und verdeckte Tippflächen, im Seitenkontext gemessen. */
/* W ist die Gerätebreite, nicht innerWidth: Bei Handy-Emulation wächst der Layout-Viewport
   mit zu breitem Inhalt mit — mit einem 600 px breiten Element war innerWidth 611 statt 320,
   die Seite herausgezoomt, und gemessen an 611 ragte nichts über den Rand. */
function messen(W) {
  const sicht = el => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const name = el => (el.id ? "#" + el.id : el.tagName.toLowerCase()) +
    " „" + (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 24) + "“";
  const verdeckt = [];
  document.querySelectorAll("button, a[href], [role=button], .opt, input, select, textarea").forEach(el => {
    if (!sicht(el)) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cy <= 0 || cy >= innerHeight || cx <= 0 || cx >= W) return;
    const t = document.elementFromPoint(cx, cy);
    if (t && t !== el && !el.contains(t) && !t.contains(el)) verdeckt.push(name(el) + " unter " + name(t));
  });
  /* Nicht scrollWidth: Die Seite schneidet seitlichen Überlauf ab, ein zu breites Element
     wäre also abgeschnitten statt scrollbar — scrollWidth bliebe gleich, die Prüfung blind.
     Gemessen wird deshalb der rechte Rand jedes sichtbaren Elements, das nicht in einem
     eigenen Scrollbereich steht. */
  const rechts = [];
  document.querySelectorAll("body *").forEach(el => {
    if (!sicht(el) || getComputedStyle(el).position === "fixed") return;
    const r = el.getBoundingClientRect();
    if (r.right <= W + 1) return;
    for (let q = el.parentElement; q; q = q.parentElement) {
      const o = getComputedStyle(q).overflowX;
      if ((o === "auto" || o === "scroll") && q !== document.body && q !== document.documentElement) return;
    }
    rechts.push(name(el) + " bis " + Math.round(r.right));
  });
  return { ueberlauf: rechts.length, rechts, verdeckt, innen: innerWidth };
}

(async () => {
  const b = await chromium.launch({ executablePath: BROWSER });
  const seite = async (w, h) => {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    const fehler = [];
    p.on("pageerror", e => fehler.push(e.message));
    await p.goto(APP);
    await p.waitForTimeout(200);
    return { ctx, p, fehler };
  };

  for (const [w, h] of [[320, 568], [360, 740]]) {
    const { ctx, p, fehler } = await seite(w, h);
    for (const v of VIEWS) {
      await p.evaluate(v => go(v), v);
      await p.waitForTimeout(80);
      const m = await p.evaluate(messen, w);
      P.ok(w + "×" + h + " · " + v + ": nichts ragt über den rechten Rand", !m.rechts.length && m.innen === w,
        m.rechts.slice(0, 3).join(" · ") + " · innerWidth " + m.innen);
      P.ok(w + "×" + h + " · " + v + ": keine verdeckte Tippfläche", !m.verdeckt.length, m.verdeckt.slice(0, 3).join(" · "));
    }
    P.ok(w + "×" + h + ": keine Skriptfehler", !fehler.length, fehler.join(" | "));
    /* Positivprobe: ein zu breites Element muss als Überlauf auffallen. */
    if (w === 320) {
      const probe = await p.evaluate(([m, w]) => {
        const d = document.createElement("div"); d.style.width = "600px"; d.style.height = "4px";
        document.querySelector(".view.on").appendChild(d);
        const r = (new Function("return (" + m + ")(" + w + ")"))();
        d.remove();
        return r.ueberlauf;
      }, [messen.toString(), w]);
      P.ok("Die Überlaufprüfung erkennt ein zu breites Element", probe > 0, probe);
    }
    await ctx.close();
  }

  P.titel("B · Unterwegs-Modus");
  for (const [w, h, erlaubt] of [[375, 667, 25], [390, 844, 0]]) {
    const { ctx, p } = await seite(w, h);
    await p.evaluate(() => { S.auto = false; });
    await p.click("#wkNew");
    await p.waitForTimeout(120);
    const kopf = await p.evaluate(() => [...document.querySelectorAll(".walktop .btn")]
      .map(e => ({ id: e.id, h: Math.round(e.getBoundingClientRect().height) })));
    P.ok(w + "×" + h + ": Beenden, Vorlesen und Automatik sind mindestens 44 px hoch",
      kopf.length >= 3 && kopf.every(k => k.h >= 44), kopf.map(k => k.id + " " + k.h).join(", "));
    P.ok(w + "×" + h + ": … und höchstens 56 px — die Kopfzeile soll den Antworten keinen Platz nehmen",
      kopf.every(k => k.h <= 56), kopf.map(k => k.id + " " + k.h).join(", "));
    const r = await p.evaluate(() => {
      const out = [];
      let lang = 0, kurzMitLang = 0;
      for (const k of alleSchluessel()) {
        const q = frageZuSchluessel(k, rng(1));
        if (!q || q.type !== "mc") continue;
        Q.list = [q]; Q.i = 0; renderQ(); window.scrollTo(0, 0);
        const opts = [...document.querySelectorAll("#walkHost .opt")];
        const istLang = q.opts.some(o => String(o).replace(/<[^>]+>/g, "").length > 40);
        const hatKlasse = document.querySelector("#walkHost .opts").classList.contains("lang");
        if (istLang) lang += hatKlasse ? 1 : 0; else kurzMitLang += hatKlasse ? 1 : 0;
        out.push({ k, unten: Math.max(...opts.map(o => o.getBoundingClientRect().bottom)) });
      }
      return { H: innerHeight, out, lang, kurzMitLang };
    });
    const zu = r.out.filter(x => x.unten > r.H);
    P.info(w + "×" + h + ": " + zu.length + " von " + r.out.length + " Karten brauchen Scrollen bis zur letzten Antwort");
    P.ok(w + "×" + h + ": höchstens " + erlaubt + " Karten brauchen Scrollen, um alle Antworten zu sehen",
      zu.length <= erlaubt, zu.length + ": " + zu.slice(0, 6).map(x => x.k).join(", "));
    if (w === 375) {
      P.ok("Lange Antworten bekommen die kompakte Fassung (" + r.lang + " Karten)", r.lang > 150, r.lang);
      P.ok("… kurze nicht", r.kurzMitLang === 0, r.kurzMitLang);
    }
    await ctx.close();
  }

  P.titel("C · Sprung in eine Regel");
  for (const [bw, bh] of [[375, 667], [768, 1024]]) {
    /* „→ Regel nachlesen“ öffnet die Regel und scrollt hin. Mit block:"center" stand bei
       Regeln, die höher als der Bildschirm sind, die Mitte im Bild und die Überschrift
       darüber. Geprüft an den längsten Regeln, Satzbaukarten und Bausteinen. */
    const { ctx, p } = await seite(bw, bh);
    const ziele = await p.evaluate(() => {
      const lang = RULES_ALL.slice().sort((a, b) => b.b.length - a.b.length).slice(0, 5).map(r => ["r", r.id]);
      return lang.concat(SATZ.slice().sort((a, b) => b.b.length - a.b.length).slice(0, 2).map(x => ["s", x.id]));
    });
    for (const [art, id] of ziele) {
      await p.evaluate(([art, id]) => {
        if (art === "r") openRule(id);
        else { ST.tab = "bau"; go("saetze"); const el = document.getElementById("sa-" + id); el.classList.add("open");
               el.scrollIntoView({ behavior: "smooth", block: "start" }); }
      }, [art, id]);
      await p.waitForTimeout(900);
      const m = await p.evaluate(([art, id]) => {
        const el = document.getElementById((art === "r" ? "rule-" : "sa-") + id);
        const kopf = document.querySelector(".head").getBoundingClientRect().bottom;
        const t = el.querySelector("button").getBoundingClientRect();
        return { oben: Math.round(t.top), unten: Math.round(t.bottom), kopf: Math.round(kopf), H: innerHeight };
      }, [art, id]);
      P.ok(bw + "×" + bh + ": Überschrift von " + id + " steht nach dem Sprung sichtbar unter der Kopfleiste",
        m.oben >= m.kopf - 1 && m.unten <= m.H, "oben " + m.oben + ", Kopfleiste bis " + m.kopf);
    }
    await ctx.close();
  }

  P.titel("D · Querformat mit Notch");
  {
    /* viewport-fit=cover legt quer gehalten den Inhalt bis unter Notch oder Dynamic Island.
       Vorher begannen Text und Knöpfe bei 852×393 rund 34 px vom Rand, der Einzug ist 59 px.
       Chromium stellt die Einzüge über CDP nach; ohne diese Schnittstelle übersprungen. */
    const E = 59;
    const ctx = await b.newContext({ viewport: { width: 852, height: 393 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    let geht = true;
    try { await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: { top: 0, left: E, bottom: 21, right: E } }); }
    catch (e) { geht = false; }
    if (!geht) P.info("Querformat übersprungen: Emulation.setSafeAreaInsetsOverride fehlt in diesem Chromium.");
    else {
      await p.goto(APP);
      await p.waitForTimeout(200);
      const rand = () => {
        const W = innerWidth; let links = Infinity, rechts = Infinity, wer = "";
        document.querySelectorAll("body *").forEach(el => {
          const s = getComputedStyle(el);
          if (s.display === "none" || s.visibility === "hidden" || s.position === "fixed") return;
          const text = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
          if (!text && !el.matches("button, .opt, input, textarea, select")) return;
          const r = el.getBoundingClientRect();
          if (r.width <= 0 || r.height <= 0 || r.bottom < 0 || r.top > innerHeight) return;
          if (r.left < links) { links = r.left; wer = (el.id || el.className || el.tagName) + " links"; }
          if (W - r.right < rechts) { rechts = W - r.right; if (rechts < links) wer = (el.id || el.className || el.tagName) + " rechts"; }
        });
        return { links: Math.round(links), rechts: Math.round(rechts), wer };
      };
      for (const v of ["heute", "karten", "regeln", "fortschritt"]) {
        await p.evaluate(v => go(v), v);
        await p.waitForTimeout(80);
        const m = await p.evaluate(rand);
        P.ok("852×393 quer · " + v + ": Text und Knöpfe halten den Einzug von " + E + " px", m.links >= E && m.rechts >= E,
          "links " + m.links + ", rechts " + m.rechts + " (" + m.wer + ")");
      }
      await p.evaluate(() => { S.auto = false; document.querySelector("#wkNew").click(); });
      await p.waitForTimeout(120);
      const u = await p.evaluate(rand);
      P.ok("852×393 quer · Unterwegs: ebenso", u.links >= E && u.rechts >= E, "links " + u.links + ", rechts " + u.rechts + " (" + u.wer + ")");
      /* Positivprobe: mit den alten, festen 18 px muss die Prüfung anschlagen. */
      await p.evaluate(() => { go("heute"); const s = document.createElement("style"); s.id = "alt";
        s.textContent = ".wrap,.head-in,.tabs{padding-left:18px!important;padding-right:18px!important}"; document.head.appendChild(s); });
      await p.waitForTimeout(80);
      const alt = await p.evaluate(rand);
      P.ok("… und die Prüfung erkennt den alten Abstand (Positivprobe)", alt.links < E, "links " + alt.links);
    }
    await ctx.close();
  }

  await b.close();
  P.abschluss();
})().catch(e => { console.error(e); process.exit(1); });
