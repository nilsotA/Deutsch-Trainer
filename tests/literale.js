/* Sammelt die String-Literale eines JavaScript-Quelltexts — für die Oberflächentexte der App,
   die im Logikteil stehen und zu keinem Datenbestand gehören.

   Warum ein Tokenizer und kein Regex: Ein erster Scan am 22.09.2026 suchte Strings per
   Regex und geriet in Kommentare und Regex-Literale — typografische Anführungszeichen,
   Apostrophe in „geht’s“ und Schrägstriche in Prüfmustern verschoben die Paarung, und
   heraus kamen Codefetzen statt Sätze. Hier werden Kommentare und Regex-Literale
   übersprungen; ob ein „/“ eine Division oder ein Regex beginnt, entscheidet das letzte
   bedeutsame Zeichen davor, wie in jedem JavaScript-Lexer. Template-Literale werden ohne
   ihre ${…}-Teile zusammengefügt. Die Zusicherungen in tests/suite.js prüfen, dass dabei
   keine Codefetzen herauskommen und bekannte Sätze gefunden werden. */
function literale(src) {
  const out = [];
  let i = 0, prev = "";
  const n = src.length;
  const regexErlaubt = () =>
    /[(,=:\[!&|?{};+\-*%<>~^]$/.test(prev) ||
    /^(return|typeof|case|in|of|delete|void|throw|new|else|do)$/.test(prev) || prev === "";
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "/") { while (i < n && src[i] !== "\n") i++; continue; }
    if (c === "/" && d === "*") { const e = src.indexOf("*/", i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1, s = "";
      while (j < n && src[j] !== c) { if (src[j] === "\\") { s += src[j + 1]; j += 2; } else s += src[j++]; }
      out.push({ at: i, s }); i = j + 1; prev = "str"; continue;
    }
    if (c === "`") {
      let j = i + 1, s = "", tiefe = 0;
      while (j < n && !(src[j] === "`" && tiefe === 0)) {
        if (src[j] === "\\") { s += src[j + 1]; j += 2; continue; }
        if (tiefe === 0 && src[j] === "$" && src[j + 1] === "{") { tiefe = 1; j += 2; s += " "; continue; }
        if (tiefe > 0) { if (src[j] === "{") tiefe++; else if (src[j] === "}") tiefe--; j++; continue; }
        s += src[j++];
      }
      out.push({ at: i, s }); i = j + 1; prev = "str"; continue;
    }
    if (c === "/" && regexErlaubt()) {
      let j = i + 1, klasse = false;
      while (j < n && (src[j] !== "/" || klasse)) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === "[") klasse = true; else if (src[j] === "]") klasse = false;
        if (src[j] === "\n") break;
        j++;
      }
      j++; while (/[a-z]/.test(src[j] || "")) j++;
      i = j; prev = "re"; continue;
    }
    if (/\s/.test(c)) { i++; continue; }
    if (/[A-Za-z_$]/.test(c)) { let j = i; while (/[\w$]/.test(src[j] || "")) j++; prev = src.slice(i, j); i = j; continue; }
    prev = c; i++;
  }
  return out;
}

/* Die Oberflächentexte der App: Prosa-Literale des Logikteils ohne die Prüfmuster und den
   Spickzettel (beide stehen schon als eigene Sorten in BESTAND), dazu der Text des
   statischen Markups vor dem Skript. Kennung ist der Anfang des Satzes — stabil genug für
   eine Erlaubnisliste, und wer den Satz umschreibt, soll ihn neu bewerten. */
function oberflaeche(html) {
  const a = html.indexOf("ANWENDUNGSLOGIK"), b = html.lastIndexOf("</script>");
  if (a < 0 || b < 0) throw new Error("Logikteil nicht gefunden");
  const src = html.slice(a, b);
  const aus = [["const CHECKS = [", "const FUELL"], ["function cheatHTML", "\n}\n"]].map(([x, y]) => {
    const i = src.indexOf(x), j = src.indexOf(y, i);
    if (i < 0 || j < 0) throw new Error("Ausschnitt nicht gefunden: " + x);
    return [i, j];
  });
  const glatt = t => String(t).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  const prosa = t => t.split(" ").length >= 4 && /[a-zäöüß]{3,} [a-zäöüß]{3,}/.test(t);
  const kennung = t => t.replace(/[^\p{L}\p{N} ]/gu, "").split(" ").filter(Boolean).slice(0, 4).join(" ");
  const aus_logik = literale(src).filter(l => !aus.some(([i, j]) => l.at >= i && l.at < j))
    .map(l => glatt(l.s)).filter(prosa);
  const m1 = html.indexOf("</style>"), m2 = html.indexOf("<script");
  const aus_markup = html.slice(m1, m2).split(/<\/(?:p|h\d|div|li|button|span)>/).map(glatt).filter(prosa);
  return aus_logik.concat(aus_markup).map(t => ({ id: kennung(t), t }));
}

module.exports = { literale, oberflaeche };
