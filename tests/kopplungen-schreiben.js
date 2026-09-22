/* Schreibt tests/kopplungen.json neu: welcher Satz steht an welchen Stellen.
   Aufruf: npm run kopplungen — gehört in denselben Commit wie die Änderung, die einen
   gekoppelten Satz umgeschrieben hat. Siehe tests/kopplung.js für die Fehlerklasse. */
const fs = require("fs");
const path = require("path");
const { boot, daten } = require("./setup");
const { stellenSammeln, gruppen } = require("./kopplung");

const w = boot(null);
const g = gruppen(stellenSammeln(daten, w));
const ziel = path.join(__dirname, "kopplungen.json");
fs.writeFileSync(ziel, JSON.stringify(g, null, 1) + "\n");
const sorten = new Set();
g.forEach(x => x.stellen.forEach(s => sorten.add(s.split(" ")[0])));
console.log("tests/kopplungen.json geschrieben: " + g.length + " gekoppelte Sätze über " +
  sorten.size + " Sorten (" + [...sorten].sort().join(", ") + ").");
process.exit(0);
