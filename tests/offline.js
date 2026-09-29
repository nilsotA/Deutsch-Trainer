/* Offline-Betrieb im echten Browser — was die übrigen Prüfläufe nicht sehen.
   sw.js wurde bisher nur als Text geprüft. Nils übt beim Spazierengehen, oft bei schlechtem
   Empfang; drei Zusagen aus dem Kopf von sw.js hängen daran und werden hier in Chromium
   nachgestellt (28.09.2026):
   1. Nach einem Start mit Netz startet die App ohne Netz, mit Lernstand, und eine Runde läuft.
   2. Eine neue Fassung auf dem Server ist beim nächsten Start da (Netz zuerst).
   3. Kommt die Seite nicht binnen GEDULD vollständig an, kommt die Kopie aus dem Cache.
   Ausgeliefert wird wie auf Vercel: „/“ ist die App. Der Server läuft in diesem Prozess;
   Chromiums Netzdrosselung greift für Anfragen des Workers nicht, deshalb drosselt der Server
   selbst. Ohne playwright-core oder Chromium überspringt sich der Lauf wie npm run layout. */

const fs = require("fs");
const path = require("path");
const http = require("http");
const { pruefer } = require("./setup");

let chromium;
try { ({ chromium } = require("playwright-core")); } catch (e) { chromium = null; }
const KANDIDATEN = [process.env.CHROMIUM_PATH, "/opt/pw-browsers/chromium/chrome-linux/chrome"]
  .concat(fs.existsSync("/opt/pw-browsers") ? fs.readdirSync("/opt/pw-browsers")
    .filter(d => /^chromium-\d+$/.test(d)).map(d => "/opt/pw-browsers/" + d + "/chrome-linux/chrome") : [])
  .filter(Boolean);
const BROWSER = KANDIDATEN.find(p => fs.existsSync(p));
if (!chromium || !BROWSER) {
  console.log("Offline-Lauf übersprungen: " + (!chromium ? "playwright-core fehlt (npm install)" :
    "kein Chromium gefunden (CHROMIUM_PATH setzen)") + ".");
  process.exit(0);
}

const WURZEL = path.join(__dirname, "..");
const APP_HTML = fs.readFileSync(path.join(WURZEL, "Deutsch-Trainer.html"), "utf8");
const SW = fs.readFileSync(path.join(WURZEL, "sw.js"), "utf8");
const P = pruefer("Offline über den Service Worker");

/* Zustand des Servers — die Prüfungen stellen ihn um. */
const server = { html: APP_HTML, sw: SW, langsam: false };
const TYP = { ".js": "text/javascript", ".webmanifest": "application/manifest+json", ".png": "image/png" };
function starten() {
  return new Promise(res => {
    const s = http.createServer((req, antwort) => {
      const url = req.url.split("?")[0];
      if (url === "/" || url === "/index.html") {
        const daten = Buffer.from(server.html, "utf8");
        antwort.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Content-Length": daten.length, "Cache-Control": "no-cache" });
        if (!server.langsam) return antwort.end(daten);
        /* rund 60 kB alle 0,5 s: die ganze Seite bräuchte etwa acht Sekunden */
        let i = 0;
        const tropf = () => {
          if (i >= daten.length) return antwort.end();
          antwort.write(daten.subarray(i, i + 60000)); i += 60000;
          setTimeout(tropf, 500);
        };
        return tropf();
      }
      if (url === "/sw.js") {
        antwort.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-cache" });
        return antwort.end(server.sw);
      }
      const datei = path.join(WURZEL, path.basename(url));
      if (/^\/(manifest\.webmanifest|icon-\d+\.png)$/.test(url) && fs.existsSync(datei)) {
        antwort.writeHead(200, { "Content-Type": TYP[path.extname(datei)] || "application/octet-stream" });
        return antwort.end(fs.readFileSync(datei));
      }
      antwort.writeHead(404); antwort.end();
    });
    s.listen(0, "127.0.0.1", () => res(s));
  });
}

(async () => {
  const s = await starten();
  const BASIS = "http://127.0.0.1:" + s.address().port + "/";
  const b = await chromium.launch({ executablePath: BROWSER });

  /* Ein frischer Kontext je Fall: Worker und Cache hängen am Kontext. */
  const neu = async () => {
    const ctx = await b.newContext({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.goto(BASIS);
    await p.evaluate(() => navigator.serviceWorker.ready);
    await p.reload();                                   // jetzt steuert der Worker die Seite
    await p.waitForTimeout(200);
    return { ctx, p };
  };

  /* 1 · ohne Netz */
  {
    const { ctx, p } = await neu();
    P.ok("der Worker steuert die Seite nach dem ersten Start", await p.evaluate(() => !!navigator.serviceWorker.controller));
    await p.evaluate(() => { S.xp = 42; save(); });
    await ctx.setOffline(true);
    let geladen = true;
    try { await p.reload({ timeout: 15000 }); } catch (e) { geladen = false; }
    P.ok("ohne Netz startet die App", geladen && await p.evaluate(() => typeof go === "function"));
    P.ok("… mit Lernstand", geladen && await p.evaluate(() => S.xp) === 42);
    if (geladen) {
      await p.evaluate(() => { S.auto = false; document.querySelector("#wkNew").click(); });
      await p.waitForTimeout(200);
      P.ok("… und eine Unterwegs-Runde läuft", await p.evaluate(() => document.querySelectorAll("#walkHost .opt").length) >= 2);
    }
    await ctx.close();

    /* Positivprobe: ohne Worker scheitert derselbe Neustart. */
    const ohne = await b.newContext({ serviceWorkers: "block" });
    const q = await ohne.newPage();
    await q.goto(BASIS);
    await ohne.setOffline(true);
    let trotzdem = true;
    try { await q.reload({ timeout: 8000 }); trotzdem = await q.evaluate(() => typeof go === "function"); } catch (e) { trotzdem = false; }
    P.ok("… und die Prüfung erkennt eine App ohne Worker (Positivprobe)", !trotzdem);
    await ohne.close();
  }

  /* 2 · neue Fassung */
  {
    const { ctx, p } = await neu();
    server.html = APP_HTML.replace("</body>", '<div id="neueFassung" hidden></div></body>');
    await p.reload(); await p.waitForTimeout(200);
    P.ok("eine neue Fassung auf dem Server ist beim nächsten Start da",
      await p.evaluate(() => !!document.querySelector("#neueFassung")));
    server.html = APP_HTML;
    await ctx.close();
  }

  /* 3 · langsames Netz */
  const langsamerStart = async () => {
    const { ctx, p } = await neu();
    server.langsam = true;
    const t0 = Date.now();
    await p.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    const dauer = Date.now() - t0;
    const da = await p.evaluate(() => typeof go === "function");
    server.langsam = false;
    await ctx.close();
    return { dauer, da };
  };
  {
    const r = await langsamerStart();
    P.info("Start bei langsamem Server (die Seite bräuchte etwa 8 s): " + r.dauer + " ms");
    P.ok("bei langsamem Netz kommt nach der Frist die Kopie aus dem Cache (unter 4 s)", r.da && r.dauer < 4000, r.dauer + " ms");

    /* Positivprobe: mit einer Frist, die nie abläuft, dauert derselbe Start so lange wie das Netz. */
    server.sw = SW.replace(/const GEDULD = \d+;/, "const GEDULD = 60000;").replace(/deutsch-trainer-v\d+/, "deutsch-trainer-probe");
    const alt = await langsamerStart();
    server.sw = SW;
    P.ok("… und die Prüfung erkennt einen Worker ohne Frist (Positivprobe)", alt.dauer >= 4000, alt.dauer + " ms");
  }

  await b.close();
  s.close();
  P.abschluss();
})().catch(e => { console.error(e); process.exit(1); });
