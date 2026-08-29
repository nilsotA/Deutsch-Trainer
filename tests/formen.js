/* Welche Formen mit welchen Fällen vereinbar sind — unabhängig von der App aufgestellt.
   Gemeinsame Quelle für tests/inhalt.js (Fallkarten gegen ihre Beispiele) und
   tests/fallform.js (Satzformen gegen ihren Fall). Nur eine Stelle pflegen. */

/* Welche Formen mit welchen Fällen vereinbar sind — unabhängig von der App aufgestellt */
const FORM = {
  den: ["A", "D"], dem: ["D"], des: ["G"], der: ["N", "D", "G"], die: ["N", "A"], das: ["N", "A"],
  einen: ["A"], einem: ["D"], eines: ["G"], einer: ["D", "G"], eine: ["N", "A"], ein: ["N", "A"],
  keinen: ["A", "D"], keinem: ["D"], keines: ["G"], keiner: ["D", "G"], keine: ["N", "A"],
  meinen: ["A", "D"], meinem: ["D"], meines: ["G"], meiner: ["D", "G"], meine: ["N", "A"], mein: ["N", "A"],
  deinen: ["A", "D"], deinem: ["D"], deiner: ["D", "G"], deine: ["N", "A"], dein: ["N", "A"],
  seinen: ["A", "D"], seinem: ["D"], seines: ["G"], seiner: ["D", "G"], seine: ["N", "A"],
  ihren: ["A", "D"], ihrem: ["D"], ihres: ["G"], ihrer: ["D", "G"], ihre: ["N", "A"],
  unseren: ["A", "D"], unserem: ["D"], unserer: ["D", "G"], unsere: ["N", "A"],
  diesen: ["A", "D"], diesem: ["D"], dieses: ["N", "A", "G"], dieser: ["N", "D", "G"], diese: ["N", "A"],
  mich: ["A"], dich: ["A"], ihn: ["A"], uns: ["A", "D"], euch: ["A", "D"],
  mir: ["D"], dir: ["D"], ihm: ["D"], ihnen: ["D"], sich: ["A", "D"],
  /* „ihr“ ist Dativ feminin (wir danken ihr), zugleich Possessiv (ihr Buch, N/A) und
     zweite Person Plural (ihr kommt, N). „sie“ ist nie Dativ — dort steht ihr/ihnen. */
  ihr: ["N", "A", "D"], sie: ["N", "A"],
  wem: ["D"], wen: ["A"], wessen: ["G"], wer: ["N"],
  im: ["D"], am: ["D"], beim: ["D"], zum: ["D"], zur: ["D"], vom: ["D"],
  vorm: ["D"], hinterm: ["D"], unterm: ["D"], "überm": ["D"],
  ins: ["A"], ans: ["A"], aufs: ["A"], durchs: ["A"], "fürs": ["A"], ums: ["A"],
  "übers": ["A"], unters: ["A"], hinters: ["A"]
};
/* Adjektive und Pronomen tragen dieselben Endungen wie die Artikel. Damit lässt sich
   aus einem Stamm jede Form ableiten, statt sie einzeln aufzuzählen.

   Warum die Endungen so und nicht enger stehen:
   -em  nur Dativ (stark, maskulin und neutrum)
   -en  alle vier — Akkusativ maskulin stark, Dativ Plural, Nominativ Plural schwach
        („die guten Tage“), Genitiv Singular schwach („des guten Tages“). Diese Endung
        schließt also nichts aus; tragend ist bei solchen Aufgaben der Ablenker.
   -er  nie Akkusativ — Nominativ maskulin, Dativ und Genitiv feminin, Genitiv Plural
   -es  Nominativ und Akkusativ neutrum, dazu Genitiv
   -e   nur Nominativ und Akkusativ; Dativ wäre -en oder -er, Genitiv -er oder -en

   Die Stämme stehen einzeln da, damit die Regel nicht versehentlich auf gewöhnliche
   Substantive zugreift: „Trainer“ endet auf -er, ist aber keine Fallform. Wer eine
   Karte mit einem neuen Adjektiv schreibt, trägt hier den Stamm nach. */
const ENDUNG = { em: ["D"], en: ["N", "A", "D", "G"], er: ["N", "D", "G"], es: ["N", "A", "G"], e: ["N", "A"] };
const STAMM = ["nächst", "besser", "angefangen", "all"];

STAMM.forEach(st => Object.entries(ENDUNG).forEach(([e, f]) => {
  const wort = st + e;
  if (!FORM[wort]) FORM[wort] = f;
}));

const NAME = { N: "Nominativ", A: "Akkusativ", D: "Dativ", G: "Genitiv" };

module.exports = { FORM, NAME, ENDUNG, STAMM };
