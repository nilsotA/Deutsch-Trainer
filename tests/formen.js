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
  wem: ["D"], wen: ["A"], wessen: ["G"], wer: ["N"],
  im: ["D"], am: ["D"], beim: ["D"], zum: ["D"], zur: ["D"], vom: ["D"],
  vorm: ["D"], hinterm: ["D"], unterm: ["D"], "überm": ["D"],
  ins: ["A"], ans: ["A"], aufs: ["A"], durchs: ["A"], "fürs": ["A"], ums: ["A"],
  "übers": ["A"], unters: ["A"], hinters: ["A"],

  /* Artikellose Adjektive und „all-“ in starker Beugung — die Fälle, die die Form ohne
     Artikel tragen kann. Nötig für Präpositionen, die meist ohne Artikel stehen (bis, je,
     pro, wider, samt, zwecks). Steht ein Artikel davor, entscheidet der Artikel; die Tabelle
     bleibt dann richtig, weil sie nur sagt, was die Form tragen KANN. „-en“ ist wie „den“
     mehrdeutig: Akkusativ Singular, Dativ Plural, Genitiv Maskulinum/Neutrum. */
  "nächsten": ["A", "D", "G"], "nächstem": ["D"],
  besseres: ["N", "A"], besserem: ["D"], besserer: ["N", "D", "G"], bessere: ["N", "A"],
  angefangenen: ["A", "D", "G"], angefangenem: ["D"], angefangene: ["N", "A"], angefangener: ["N", "D", "G"],
  allem: ["D"], alles: ["N", "A"]
};

/* Persönliche Pronomen, die auch Subjekt sein können. Sie gelten nur dort, wo das Wort
   selbst die Antwort ist (Satzform der Fallkarten). In Beispielsätzen wäre „sie“ meist
   das Subjekt und würde die Prüfung des Objektfalls verfälschen — deshalb nicht in FORM.
   „ihr“ ist Dativ Femininum, daneben Nominativ Plural (ihr seid) und Possessiv (ihr Ball). */
const PRONOMEN = {
  er: ["N"], sie: ["N", "A"], es: ["N", "A"], wir: ["N"], ihr: ["N", "A", "D"]
};
const NAME = { N: "Nominativ", A: "Akkusativ", D: "Dativ", G: "Genitiv" };

module.exports = { FORM, PRONOMEN, NAME };
