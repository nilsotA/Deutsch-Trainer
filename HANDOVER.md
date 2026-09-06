# Übergabe an Claude Code

Seit dem 29.08.2026 liegt das Projekt in Git: `github.com/nilsotA/Deutsch-Trainer`
(privat). Das Repo ist die maßgebliche Fassung — egal in welchem Verzeichnis oder auf
welchem Rechner du es auscheckst. Auf Nils' Mac liegt eine Arbeitskopie unter
`~/Claude/Projects/Deutsch-Trainer`; die Kopie im Cowork-Ausgabeordner ist nur noch
Sicherung und wird nicht mehr gepflegt.

## Was du zuerst tun solltest

```bash
npm install
npm run syntax
npm test
```

`node_modules/` ist nicht im Repo — `npm install` ist nach jedem frischen Checkout nötig
und holt nur jsdom. Sonst gibt es keine Abhängigkeiten und keinen Build.

Alle fünf Prüfläufe sind grün. Sie sind inzwischen einmal vollständig gelaufen —
der Vorbehalt aus der letzten Übergabe ist erledigt. Ein Fehlalarm war zu beheben,
und zwar in der Prüfung, nicht in der App: Der Korpus für „korrektes Material“ in
`tests/suite.js` enthielt die richtige Antwort von `z24` — „Ich rufe dir an“ statt
„dich“ —, also eine *zitierte* Falschform. Enthält ein Eintrag ein Kontrastwort
(`statt`, `falsch`), zählt jetzt nur der Text außerhalb der Anführungszeichen.
Musterformulierungen und wörtliche Rede bleiben vollständig in der Prüfung.

Die drei zuvor ungetesteten Textänderungen sind nachgeprüft und in der Datei.

## Stand der App

| | |
|---|---|
| Übungen | 376 |
| Regeln | 117 |
| Wortkarten | 155 |
| Fallkarten | 182, davon 164 in Satzform (173 Fassungen) |
| Satzbaukarten | 24 |
| Prüfmuster im Textcheck | 95 |
| Fehlersuchtexte | 12 mit 86 markierten Fehlern |
| Dateigröße | ~660 KB, eine Datei, kein Build |

Sieben Reiter: Heute, Karten, Sätze, Formulieren, Schreiben, Regeln, Fortschritt.
Dazu Einstufungstest, Wochen-Lernplan, Fehlerjournal, Textcheck für eigene Texte,
druckbarer Spickzettel, Export/Import des Lernstands.

## Wie Nils die App benutzt

**Beim Spazierengehen, einhändig, oft mit Vorlesen.** Das hat die letzten Runden
bestimmt und sollte auch weiter der Maßstab sein:

- Große Antwortflächen in Daumenreichweite, keine Tippaufgaben unterwegs
- Vorlesen mit Hinweis, wenn Antworten gleich klingen („Weiteren groß“)
- Nach richtiger Antwort schaltet die App selbst weiter
- Runde jederzeit unterbrechbar, 36 Stunden fortsetzbar
- Rundenende zeigt die Fehler nach Regel gebündelt
- „Nur Fehler“-Runde für gezieltes Nacharbeiten

## Zuletzt geändert

**Gegenprüfung der 120 offenen Funde (06.09.2026).** Die Liste aus dem Widerspruchslauf war
ungeprüft — deshalb ein zweiter Lauf, der jede Meldung zu **widerlegen** versuchte und
Prüfmuster mechanisch über `analyse()` nachstellte statt nach Gefühl zu urteilen.
**63 der 120 fielen durch** — genau dafür war die Runde da. 54 hielten, 3 brauchen eine
Quelle. Aus den haltbaren wurden 71 fertige Ersetzungen gebaut; jede habe ich selbst gegen
die Datei geprüft (alle trafen genau einmal), vier Doppelmeldungen zusammengefasst,
67 angewendet. Keine ändert die richtige Antwort einer Karte, also kein `NEU_GELERNT`.
Alle Zahlen unverändert: 376 Übungen, 155 Wortkarten, 117 Regeln, 95 Prüfmuster, 86
Markierungen, 696 Karten.

Die Prüfmuster, jedes vorher und nachher nachgestellt:

- **`x03`** meldete „Während dem Kollegen die Zeit fehlte, haben wir weitergemacht“ als
  klaren Fehler — dort ist „während“ Konjunktion und „dem Kollegen“ das Dativobjekt des
  Nebensatzes. Jetzt `pruef`, und der Hinweis nennt beide Lesarten.
- **`y08`** meldete „viel frische Luft“ und „wenig freie Plätze“. Umgekehrt verlangte es
  mindestens sechs Buchstaben und verfehlte damit **„etwas neues“**, das Musterbeispiel
  seiner eigenen Regel. Beides behoben, dazu die Großformen am Satzanfang („Alles gute“).
- **`s05`** (doppelte Verneinung) meldete „nicht **unter** die Dusche“ und „nicht
  **unter**schiedlich“ — die Vorsilbe un- ist jetzt eingegrenzt.
- **`f02`** traf jedes „kein Problem“ mitten im Satz; gemeint ist die Antwort auf einen Dank.
- **`f11`** erkannte „eine ganz kurze Frage“, aber nicht „eine ganz kurze **kleine** Frage“ —
  je stärker die Verkleinerung gestapelt war, desto weniger griff das Muster. Genau dieser
  Satz steht in der App als abschreckendes Beispiel (`pr28`).
- **`a11`** und **`y06`** standen auf Stufen, die der App widersprechen: „wegen mir“ ist wie
  die Nachbarmuster eine Registerfrage, doppeltes „würde“ erklären `z15` und `sa12`
  ausdrücklich für keinen Fehler.

**Die App beschrieb sich selbst falsch.** Der Textcheck warb mit „78 Muster“ (es sind 95,
die Zahl kommt jetzt aus `CHECKS_ALL.length` und kann nicht mehr veralten) und mit „erkennt
rund drei von vier eingebauten Fehlern“. Nachgemessen an den eigenen Fehlersuchtexten sind
es **47 von 86 markierten Stellen bei strenger Zählung, 47 bis 55 Prozent** — dort steht
jetzt „etwa die Hälfte“.

Inhaltlich außerdem: `komma-infinitiv` sagte „**immer** Komma“ und widerlegte das drei
Absätze später selbst; der Merksatz nannte vier der sieben Verben, die den Ausnahmeabsatz
bilden — im Spickzettel gleich zweimal. `kt08` ließ vor „ob“ das Komma weg, das vier andere
Fehlersuchtexte anstreichen. `n-uhrzeit` und `kt04` schrieben eine Infinitivgruppe mit
„statt“ ohne das Komma, das die App selbst zur Pflicht erklärt. Vier Stellen nannten
„Es ist zu einer Nichtbewilligung gekommen“ ein Passiv — es ist Perfekt Aktiv, und der
eigene Passivzähler der App gibt dafür 0. `gram-ndekl` nahm den ganzen Nominativ von der
n-Deklination aus statt nur den Singular. Der „Stand der Prüfung“ behauptete, alle zehn
Tabellen seien geprüft; es sind fünf.

**Kontrollmessung nach allen Änderungen:** 1475 Proben aus dem gesamten sauberen Bestand —
Regelbeispiele, Musterformulierungen der Schreibwerkstatt, Situationen, Schreibaufträge,
Wortkarten und die richtigen Antworten aller Übungen — ergeben **keine einzige harte
Meldung**. Die weicheren Stufen melden fast nur Stellen, an denen eine Regel die Falschform
selbst zitiert (`stil-fuellwort` listet „eigentlich“, `stil-pleonasmus` „bereits schon“).

`FUNDE-offen.md` führt jetzt die drei offenen Stellen und, als Gedächtnis für spätere Läufe,
die 63 verworfenen Verdachtsfälle mit Begründung — damit niemand sie erneut als Fund meldet.


**Widerspruchslauf über alle 117 Regeln (05.09.2026).** Ohne Suchbudget ist Faktenprüfung
nicht möglich — also wurde nach dem gesucht, was ohne Quelle entscheidbar ist: Stellen, an
denen die App sich selbst widerspricht. 26 Prüfer haben jede Regel gegen ihre Übungen,
Prüfmuster, Fehlersuche-Markierungen, Karten und den Spickzettel gelesen; jeder Fund musste
mit zwei wörtlichen Zitaten belegt sein, die nicht beide gelten können. 149 Meldungen, davon
29 abgearbeitet. **Die übrigen 120 stehen in `FUNDE-offen.md`** — ungeprüft, mit Anleitung.

Vier Prüfmuster waren kaputt, alle mechanisch über `analyse()` nachgestellt:

- **`x04`** (Komparativ mit „wie“, hart) meldete „Wir machen weiter wie geplant“, „Das
  Training geht weiter wie besprochen“ und „Er trainiert nicht mehr wie früher“ als klaren
  Fehler. „weiter“ ist raus, „mehr“ und „länger“ greifen nicht mehr nach nicht/nie/kaum,
  feste Fügungen sind ausgenommen.
- **`x20`** (anrufen + Dativ, hart) prüfte nicht „anrufen“, sondern jede Form von „rufen“
  plus Dativpronomen — „Die Trainerin ruft ihr Kind“, „Er ruft ihr zu“, „Warum ruft ihr uns
  nicht an?“ und „Sie rief ihm nach“ bekamen „klarer Fehler“. Jetzt mit „an“ im Satz
  verlangt, ohne „ihr“, ohne „uns“ und „euch“ (in beiden Fällen gleich), und auf `pruef`
  herabgestuft: Die App führt den Dativ selbst als südwestdeutsch und schweizerisch.
- **Tote Alternativen.** `\b` ist in JavaScript an `[A-Za-z0-9_]` gebunden, ä ö ü ß zählen
  dort nicht als Wortzeichen. Deshalb konnten **„älter“ und „öfter“ in `x04`, „äusserst“ in
  `x26` und „über“ in `a08` nie treffen** — ohne Syntaxfehler, ohne roten Lauf.
  `tests/suite.js` erkennt die Klasse jetzt dauerhaft, mit Positiv- und Gegenprobe.
- **`a03`** fand den Satz nicht, den sein eigener Hinweistext als Beispiel nennt: Partizipien
  trennbarer Verben („ausgefüllt“) beginnen nicht mit „ge“. Dieselbe Lücke saß in der
  **Passiv-Kennzahl der Schreibwerkstatt** — ein Text aus vier Passivsätzen wurde mit
  0 Prozent Passivanteil ausgewiesen. Jetzt 100.
- **`y03`** meldete den doppelten Infinitiv („weil ich habe arbeiten müssen“), den die
  eigene Übung `z11` als die richtige Fassung lehrt.

Inhaltlich abgearbeitet, nach Grundsatz sortiert:

- **Grundsatz 2 (kein Ablenker darf richtig sein):** `z07` wertete „Ich gebe den Ball dem
  Trainer“ als falsch, während die eigene Erklärung ihn „nicht falsch“ nennt. `g05` bot
  beide zulässigen Schreibungen als falsche Optionen an. `f38` wertete „Eine Zusammenfassung“
  als falsch — die Nachbarkarte `form-absprachen` empfiehlt genau das. `m04` schloss den
  Konjunktiv II aus, den die eigene Erklärung zulässt. `s12` fragte nach einem Genitiv und
  antwortete „Genitivkette“.
- **Grundsatz 4 (regional statt falsch):** „Ich rufe dir an“ hieß in `n11` „einer der
  häufigsten Fehler“ und in `z24` „Kasusfehler“, an vier anderen Stellen dagegen
  südwestdeutsch. `m17` und `z02` ebenso. Jetzt überall gleich eingeordnet.
- **Grundsatz 5 (keine absoluten Aussagen):** `komma-aufzaehlung` und der Spickzettel führten
  aber/doch/jedoch ohne die Einschränkung, die die eigene Übung `k11` kennt und die die App
  in ihrem Fließtext vierzigfach anwendet. `gram-praepakk` sagte „ohne Ausnahme“ und führte
  zwei Zeilen später `entlang` mit Genitiv auf. `gram-kasusfinden` sagte „Präposition
  entscheidet, Verb egal“ — „teilnehmen an“ steht mit Dativ, „glauben an“ mit Akkusativ.
  `n33` nannte „denen“ die einzige vom Artikel abweichende Form.
- **Grundsatz 3 (Stil ist keine Regel):** `f43` fragte, was an gestapelter Absicherung
  „falsch“ sei, obwohl `stil-hedging` sie ausdrücklich für keinen Fehler erklärt. Die
  Fehlersuche nannte alle Markierungen „Fehler“, obwohl ein Drittel Stil und Formulierung
  ist — sie heißen jetzt „Stellen, die besser gehen“. In `kt10` verlangte eine Markierung
  „problematisch“ statt „nicht ganz unproblematisch“, was `stil-verneinung` als legitime
  Litotes führt und die Aussage stärker macht als das Original.
- **Sonstige Widersprüche:** `getrennt-verb` machte „erneut“ zur Probe für
  Getrenntschreibung, während `t12` dieselbe Bedeutung dem einen Wort „wiedersehen“
  zuordnet. `gram-ndekl` führte Herr ohne den Sonderfall, den die App selbst schreibt
  (Singular -n, Plural -en). „durchführen“ stand in `stil-nominal` als Warnsignal und in
  `stil-verben` als Ziel. `form-loben` nannte eine Präpositionalgruppe einen Nebensatz.
  Der Spickzettel führte leer und voll als nicht steigerbar, die die Regel ausnimmt.
  **„Grammatik (ein m)“** stand als Merkhilfe da — so gelesen führt sie zu „Gramatik“.
  `f19` nannte „Es ist zu einem Fehler gekommen“ ein Passiv; es ist Perfekt Aktiv, und der
  eigene Passivzähler der App gibt dafür 0.

**Unterwegs:** `hoerHinweis()` nennt jetzt auch die Auslautverhärtung. „angestrengt“ und
„angestrenkt“ klingen gleich, standen aber nicht in `KLANGPAAR` — sie sind kein festes Paar,
sondern eine Bauart (g/k, d/t, b/p am Silbenende). Der Hinweis hängt an jeder Option und
verrät deshalb nichts. Betrifft `r04`, `r18`, `v02`. **Nicht** gelöst: Paare wie
„Tipp/Tip“, „Rhythmus/Rythmus“, „nummerieren/numerieren“ — ob die Sprachausgabe sie
unterscheidet, hängt an der Vokallänge und ist ohne Hörprobe nicht zu entscheiden. Lieber
offen als geraten.


**Vierter Durchgang — Zahlen, Uhrzeit, Datum (05.09.2026).** Neun Regeln waren aus dem
Workflow des dritten Durchgangs übrig geblieben (das Modellkontingent lief mitten im Lauf
aus). Sieben davon sind einzeln geprüft worden. **Wichtig für die nächste Sitzung:** Das
Websuchbudget der Sitzung (200 Anfragen) und danach das Modellkontingent waren erschöpft,
bevor die Prüfung fertig war. Übernommen wurden deshalb **nur Befunde, die ohne Quelle
entscheidbar sind** — Widersprüche im Bestand selbst und Aussagen, die zurückgenommen statt
neu behauptet werden. Alles, was eine neue Tatsachenbehauptung gewesen wäre, steht unten
unter „Offen“ und wartet auf einen Lauf mit freiem Suchkontingent.

Geändert:

- **`n-uhrzeit`.** `q12` markierte „um 8:30 Uhr“ als falsch, während die eigene Erklärung
  zwei Zeilen weiter „Beides ist korrekt“ sagte. Die Frage nennt jetzt die Quelle
  („Welche Uhrzeitschreibung folgt dem Duden?“), die richtige Antwort ist unverändert.
  `q13` ebenso: „um 8.00 Uhr“ ist keine Falschform, die Frage geht jetzt auf die knappere
  Form. Die Regelkarte gab für Tabellen „08:30“ an, `q13` für dieselben Tabellen „08.00“ —
  beide Formen stehen jetzt nebeneinander.
- **`n-gliederung`.** „1000 oder 1.000“ stand als erstes Beispiel direkt unter dem Satz
  „Ab fünf Stellen wird gegliedert“. Vierstellige Zahlen haben jetzt einen eigenen Absatz.
  „Telefonnummern werden nicht gegliedert“ und „Mio. und Mrd. nur in Tabellen“ waren nicht
  belegbar und sind gestrichen beziehungsweise als Empfehlung gekennzeichnet. Die Zuschreibung
  „Duden = Punkt, DIN 5008 = schmales Leerzeichen“ ließ sich in keine Richtung belegen und
  nennt jetzt beide Zeichen ohne Quelle. `q26` wertete mit „1.500.000“ eine korrekt
  geschriebene Zahl als Ablenker ab — die Frage fragt jetzt nach der Lesbarkeit.
- **`n-ziffern`.** `q03` stellte „Vierundzwanzig Personen nahmen teil.“ gegen
  „24 Personen nahmen teil.“ — **unterwegs klingen beide gleich**, die Sprachausgabe liest
  „24“ als „vierundzwanzig“. Dazu ist der Ablenker keine Falschform. Die Aufgabe fragt jetzt
  nach der Empfehlung und hat drei hörbar verschiedene Optionen. Die Absoluta „Immer Ziffern“
  und „Immer Wörter“ sind abgeschwächt, `q02` sagt jetzt, woran die Ziffer wirklich hängt
  (abgekürzte Einheit).
- **`x24`** (hart, „in 2026“) meldete auch **korrekte Sätze**: „Das Lager fand in 2000 Metern
  Höhe statt“ schlug an. Das Muster schließt jetzt folgende Einheiten und Substantive aus,
  erkennt dafür den Satzanfang („In 1995 …“) und steht auf `pruef` — die Regel dahinter ist
  eine Stilregel, und Grundsatz 3 sagt, Stil ist keine Regel.

Zwei neue Prüfungen, beide nach dem Muster „Fehlerklasse statt Einzelfix“:

- `tests/suite.js`: **Die Beispiele der Regeln laufen jetzt gegen die harten Muster.** Bisher
  wurden nur die richtigen Antworten der Übungen geprüft; die 477 Beispiele aus
  `class="ok"` und `class="ex"` in Regeln, Satzbaukarten und Tabellen blieben außen vor.
  Gegenbeispiele (`class="nope"`, Zeilen mit Pfeil, „nicht“, „statt“, „falsch“) sind
  ausgenommen. Dazu eine Positivprobe und eine Untergrenze für die Zahl der Beispiele,
  damit die Prüfung nicht stumm grün wird.
- `tests/inhalt.js`: **Ziffer gegen ausgeschriebene Zahl.** Unterscheiden sich zwei Optionen
  nur darin, klingen sie beim Vorlesen gleich. Auch hier eine Positivprobe mit dem Paar aus
  `q03`, das die Prüfung nötig gemacht hat.

Nachgezogen im selben Durchgang, ebenfalls ohne neue Tatsachenbehauptung:

- `n-abkuerzung`: „Mit Punkt stehen Abkürzungen, die man als volles Wort ausspricht“ ist auf
  „in aller Regel“ abgeschwächt, und dass die Zuordnung nicht lückenlos ist, steht jetzt da.
  Der Absatz „Am Satzende steht nur ein Punkt“ nennt jetzt auch den Fall, der sich aus der
  eigenen Regel `z-frage` ergibt: Frage- und Ausrufezeichen bleiben stehen
  („Ist er Regierungsrat a. D.?“). „In wissenschaftlichen Texten gilt“ war eine Behauptung
  ohne Quelle und ist eine Empfehlung geworden; `q25` fragt entsprechend nach dem Rat, nicht
  nach einer Regel.
- `n-quellen`: „a. a. O. ist heute unüblich“ → „wird seltener verwendet; viele Leitfäden
  raten davon ab“.

Eine dritte Prüfung kam dazu: `tests/suite.js` lässt jetzt auch die **292
Musterformulierungen der Schreibwerkstatt** (`PHRASES`, `PAIRS.good`) und die korrigierten
Fehlersuchtexte gegen die harten Muster laufen — Nils soll die Bausteine abschreiben, ein
hartes Muster darf sie nicht anstreichen. Dazu die Prüfung, dass **jede Fehlermarkierung im
Text auffindbar ist**: `korrErrIdx()` sucht das Wort als ganzes Token, findet es nichts, ist
der Fehler unanklickbar, zählt aber in der Gesamtzahl — Nils käme nie auf 100 Prozent.
Aktuell stimmt alles. Zwölf Fehlersuchtexte ersetzen mehrteilig („dem → des Zeitplans“) oder
tragen statt einer Form eine Anweisung („(Beobachtung statt Etikett)“); dort ist die
korrigierte Fassung nicht rekonstruierbar, der Lauf sagt das ausdrücklich.

Nach dem Rendern im Browser noch einmal nachgezogen — zwei Stellen, an denen ich beim
Umformulieren selbst zu weit gegangen war beziehungsweise eine Liste stehen ließ, die die
App an anderer Stelle nicht deckt:

- `n-gliederung`: „Nur wo Zahlen in einer Tabelle untereinanderstehen, gliederst du sie mit“
  wäre eine neue Behauptung gewesen und hätte „1.000“ zur Falschform gemacht. Der Absatz
  sagt jetzt „bleiben meist ungegliedert“ und nennt die gegliederte Form als das, was einem
  in Spalten begegnet.
- `stil-absolut` führte zwölf Adjektive als nicht steigerbar auf — die beiden Übungen `r05`
  und `s17` nennen aber nur sieben davon, und das harte Muster `x07` erfasst fünf. Die Regel
  war also strenger als alles, was die App selbst prüft und lehrt. Die Liste ist auf die enge,
  sichere Auswahl zusammengezogen, „voll“, „leer“ und „rund“ stehen jetzt als das da, was sie
  sind: in festen Wendungen steigerbar.

**Offen aus diesem Durchgang** — belegt, aber nicht übernommen, weil die Quelle fehlt.
Jeder Punkt braucht einen Lauf mit freiem Suchkontingent, dann Regel, Übung, Textcheck und
Spickzettel in einem Zug:

- `n-gliederung`: Wie schreibt die DIN 5008 Telefonnummern (Vorwahl, Leerzeichen, Rufnummer,
  Durchwahl mit Bindestrich)? Und sieht sie bei Geldbeträgen wirklich den Punkt vor? Beides
  wäre eine Ergänzung, die die App im Alltag braucht.
- `n-uhrzeit`: Gilt die DIN-Schreibung nur für Tabellen oder für Briefe und Mails insgesamt?
  Fehlen `h` und `min` für Zeitmessungen im Sport?
- `n-ziffern`: Der Duden soll die Zwölf-Regel für überholt erklären und stattdessen die
  Silbenzahl empfehlen. Wenn das stimmt, gehört es in die Regel.
- `n-datum`: Die führende Null (05.05.2026) ist eine DIN-Vorgabe, keine Rechtschreibregel —
  die App trennt das an den Nachbarstellen sauber, hier nicht. Dazu fehlen beim schließenden
  Komma die zwei Grenzen, die `komma-brief` schon kennt.
- `n-abkuerzung`: „Mit Punkt stehen Abkürzungen, die man als volles Wort ausspricht“ ist zu
  glatt (RücklVO, GmbH). `q20` deckt nur den Aussagesatz ab — nach „a. D.?“ bleibt das
  Fragezeichen. `q25` („im Fließtext ausschreiben, in Klammern abkürzen“) ist unbelegt, damit
  ist der Ablenker nicht sicher falsch. `t02` fehlen `Z.B.`, `D.h.`, `u.U.`, `v.a.`, `z.Hd.`
  — `e.V.` bewusst nicht, weil Vereinsnamen so eingetragen sind.
- `n-quellen`: „a. a. O. ist heute unüblich“ ist zu absolut. Bei Gliederungsziffern fehlt das
  System ohne Schlusspunkt (2.1 Stichprobe). „ebd.“ meint auch dieselbe Seite. `t11` kennt
  nur fünf der acht Kürzel, die die Regel selbst aufführt.
- `recht-verwechsel`: Zwei Ablenker sind womöglich zulässig — „Sie war scheinbar krank“
  (`r11`) und „Sie ist zumindest 18“ (`m21`). Beide würden die richtige Antwort ändern,
  brauchen also einen `NEU_GELERNT`-Eintrag. Die Regelzeile zu „dasselbe / das gleiche“
  widerspricht der eigenen Wortkarte, die die Grenze schon als verwischt beschreibt.
- `recht-klassiker` und `n-einheiten` sind gar nicht erst geprüft worden.
- Vorbereitet liegt außerdem die Faktenlage der `gram-*`-Regeln: Beim Durchsehen fielen
  `gram-praepakk` („immer den Akkusativ — ohne Ausnahme“, aber `entlang` steht vorangestellt
  mit Dativ oder Genitiv) und `gram-praepdat` („immer den Dativ“, aber `außer Landes`,
  schwankendes `ab`) auf. Beides ist **nicht** geprüft und **nicht** geändert — nur notiert.


**Dritter Durchgang: Rechtschreibung, Groß- und Kleinschreibung, Getrennt- und
Zusammenschreibung** (05.09.2026). Gleiches Vorgehen wie bei der Zeichensetzung: zwei
unabhängige Belegagenten je Regel, Zusammenführung, eigene Nachprüfung. Belegt sind
`gross-subst`, `gross-zeit`, `gross-wendung`, `gross-sprachen`, `getrennt-praep`,
`getrennt-verb`, `getrennt-konj`, `recht-dass`, `recht-seit`, `recht-wider`, `recht-sz`,
`recht-apostroph`, `recht-bindestrich`. Die schwersten Funde:

- **Fünf harte Textcheck-Muster meldeten korrekte Sätze als Fehler.** `x17` beanstandete
  „Ihr seid dem Trainer dankbar“, „Ihr seid heute dran“, „Seid heute pünktlich“ — die
  normale Anrede an eine Mannschaft. `x18` beanstandete „seit ihr zusammen trainiert“ und
  fand die eigentliche Fehlerform „Seit ihr bereit?“ wegen des fehlenden i-Flags nicht.
  `x16` beanstandete wegen des i-Flags das korrekte Verb „wieder erwarten“. `x26` meldete
  „KÖLNER STRASSE“, „GROSSE PAUSE“, „Frau Weiss“ und „Herr Gross“, `x19` die Auslassung
  „Geht’s Peter gut?“ als Genitiv-Apostroph. Alle behoben und lokal nachgerechnet.
- **Die Fehlersuche verlangte einen Fehler.** Im Elternbrief war „etwas Kleines zu essen“
  als „zu Essen“ markiert. „zu essen“ ist ein Infinitiv mit „zu“ und bleibt klein (Duden:
  „Etwas zu essen brauchen wir am nötigsten“). Markierung gestrichen, daher 86 statt 87
  Fehler.
- **Zwei Sachfehler in den Regeln:** `gross-wendung` führte „Er macht mir angst“ als klein
  mit groß als Nebenform — Regelwerk und Duden kennen nur „jemandem Angst machen“, klein
  ist auf sein/bleiben/werden beschränkt. `gross-sprachen` gab der Kleinschreibung die
  Bedeutung „auf deutsche Art“ statt „in deutscher Sprache“.
- **`recht-sz` war zu grob:** Die Regel hing nur an der Vokallänge. Sie gilt aber nur für
  das scharfe s — „reisen“, „Hase“, „lesen“ haben langen Vokal und ein einfaches s. Dazu
  fehlten die kurzen Ausnahmen (das, was, bis, Bus) und die Versalienregel (SS, seit 2017
  auch ẞ).
- **`recht-bindestrich` fehlten beide Pflichtgruppen:** Einzelbuchstaben und Abkürzungen
  (E-Mail, Kfz-Werkstatt) und die Durchkopplung (E-Mail-Adresse, Erste-Hilfe-Kurs).
- **Vierzehn Übungen hatten einen Ablenker, der selbst zulässig war** (Grundsatz 2): g05
  (morgen Früh), g08, g09 (das Radfahren), g11 (recht/Recht haben), g17, t01 (sodass),
  t04 (kennenlernen), t05, t06, t09, t14, t19, r24 (Email als Schmelzüberzug), r25
  (Knowhow). Umgebaut nach dem Hausmuster „Nur: …“ oder mit Satzkontext; nur g05 brauchte
  einen Eintrag in `NEU_GELERNT`.
- **Unterwegs nicht lösbar:** „Seid ihr bereit?“ und „Seit ihr bereit?“ werden identisch
  vorgelesen, ebenso „wider/wieder Erwarten“. Neu sind `KLANGPAAR` und `klangHinweise()`
  — der Hörhinweis nennt jetzt die Schreibung („seid mit d am Ende“). `tests/inhalt.js`
  prüft diese Fehlerklasse dauerhaft.
- **Zehn neue Prüfmuster:** x27 (heute abend), x28 (tut mir Leid), x29 (in bezug auf),
  x30 (wieviel, zuviel, irgend etwas), x31 (nichts desto trotz), x32 (auf deutsch),
  x33 (erwiedern), x34 (widerholen), x35 (Plural mit Apostroph), y12 (vor Kurzem als
  Variantenhinweis). Alle gegen den sauberen Bestand geprüft.
- **Die Zahlen in dieser Übergabe waren veraltet:** 331 statt 371 Übungen, 116 statt 155
  Wortkarten. `tests/suite.js` prüft die Tabelle in CLAUDE.md jetzt gegen die App.

**Zweiter Durchgang Zeichensetzung: sieben weitere Regeln belegt** (04.09.2026, abends).
Vorgehen: Für jede Regel zwei unabhängige Belegagenten (Faktenprüfung; Absolutheit,
Änderungen 2024, Widersprüche, Ablenker), Befunde zusammengeführt, die Kernaussagen
zusätzlich selbst per Suche geprüft, dann umgesetzt. Danach drei gegnerische Prüfer je
Regel (Verteidiger des alten Textes, Prüfer des Ersatztextes, Quellenprüfer):
209 Urteile, 185 halten. Die 24 übrigen sind fast alle „bereits umgesetzt“ (Verteidiger,
die gegen den schon geänderten Dateistand urteilten) oder „unbelegt, nicht übernehmen“
(APA-Semikolon, Paragraphenzählung 2024, Gliederungsziffern „1.)“); kein Fund wurde
inhaltlich zurückgewiesen. Die Präzisierungen der Prüfer sind eingearbeitet, die
Urteile liegen im Workflow-Journal der Sitzung. Belegt sind jetzt `komma-nebensatz`, `komma-hauptsatz`, `komma-einschub`,
`komma-vergleich`, `komma-adjektive`, `komma-brief`, `z-anfuehrung`. Die Einzelheiten
stehen in den Commit-Nachrichten; die wichtigsten Funde:

- **Zweite Änderung von 2024 gefunden:** Das schließende Komma nach mehrteiligen
  Datumsangaben („Am Montag, dem 12. Mai, beginnt …“) ist seit 2024 Pflicht. Die App
  sagte „möglich“ (`komma-brief`, `k25`); `n-datum` sagte es schon richtig. Ebenfalls
  2024: Nachgestellte Erläuterungen als verkürztes Satzglied dürfen ohne schließendes
  Komma stehen (`komma-einschub`, als Randnotiz).
- **Drei Übungen mit richtigem Ablenker** (Grundsatz 2): `k18` („Zwei“ Kommas waren
  auch richtig, das Komma vor „und“ ist frei), `p25` („Komma“ zwischen zwei
  Hauptsätzen ist richtig, die Übung nannte nur das Semikolon), `p11` (die einfachen
  Anführungszeichen ‚…‘ sind beim Vorlesen von den geraden nicht zu unterscheiden und
  als Zitat im Zitat korrekt). Umgebaut, IDs behalten; `p25` in `NEU_GELERNT`.
- **Fehlersuche kt12** wertete „am Dienstag, den 12. Mai“ als Kasusfehler („dem“),
  obwohl `n-datum` beide Formen zulässt — gestrichen; stattdessen fehlt dort das seit
  2024 verbindliche schließende Komma. `kt03` wertete das fehlende Komma nach „Wie
  bereits mehrfach erwähnt“ als Fehler — bei kurzen Formeln ist es frei.
- **„immer“ und „alles“ abgeschwächt**, wo Duden und Regelwerk Freiräume lassen:
  Formeln („wie besprochen(,)“), „vorausgesetzt(,) dass“, Kurzformeln als Zusatz
  („Er hat(,) wie erwartet(,) gewonnen“), enge Appositionen ohne Komma, Adjektivkomma
  als Bedeutungsträger („neue, umweltfreundliche“ ≠ „neue umweltfreundliche“).
- **Lücken geschlossen:** Nebensatz ohne Einleitewort („Ich hoffe, du kommst“), „denn“
  (fehlte in der ganzen App), mehrteilige Einleitungen („nur weil“ → Komma vor der
  Fügung), Komma vor „als“ mit zu-Infinitiv, gerade Zollzeichen sind Tastaturzeichen,
  die englischen Anführungszeichen stehen beide oben (“…“).
- **Textcheck:** `y01` (Nebensatz) kennt mehrteilige Einleitungen, `y11` neu
  (erweiterte Infinitivgruppe ohne Komma), `t13` neu (englische Anführungszeichen),
  `t01` von „hart“ auf „prüfen“ (Typografie, keine Rechtschreibung), `a01` und `x25`
  erkennen mehr Formen. Alle gegen den sauberen Bestand geprüft, null Fehlalarme.

**Dritter Block: die fünf übrigen Zeichenregeln** (`z-klammern`, `z-auslassung`,
`z-frage`, `z-schraeg`, `z-semikolon`), gleiches Vorgehen. Die wichtigsten Funde:

- **Fragezeichen:** Das Schlusszeichen richtet sich nach dem ganzen Satz, nicht nach dem
  Nebensatz. „Weißt du, wann sie kommt?“ behält das Fragezeichen — die App lehrte „nur bei
  direkter Frage“, womit Nils in Mails an Dozenten („Können Sie mir sagen, ob …?“) den
  Punkt gesetzt hätte. Regel, `p19`, `t12`, Spickzettel.
- **Klammern:** Punkt innen nur bei einem Klammersatz, der für sich steht; eingeschoben
  in einen anderen Satz fällt sein Punkt weg, Frage- und Ausrufezeichen bleiben, das Komma
  des Satzes steht nach der Klammer (Regelwerk-Beispiele). `p16` war beim Vorlesen nicht
  lösbar (Klammern werden nicht mitgesprochen), fragt jetzt nach der Position.
  `p15`: „Für Quellenangaben“ war als Ablenker nicht sicher falsch (numerische
  Zitierstile: [12]).
- **Auslassungspunkte:** Rechtschreiblich drei Punkte, das eigene Zeichen ist
  Typografie; eckige Klammern im Zitat sind Zitierkonvention, das Regelwerk zeigt
  Auslassungen ohne Klammern. `p18`: runde Klammern waren als Ablenker nicht sicher
  falsch. Neues hartes Muster `t14` für den Punkt nach Auslassungspunkten.
- **Schrägstrich/Apostroph:** Leerzeichen beim Schrägstrich zwischen Wortgruppen sind
  DIN-Konvention, das Regelwerk schreibt selbst „das Semikolon/der Strichpunkt“ —
  `p21` umgebaut („Beides geht“), in `NEU_GELERNT`. Apostroph: „ce“ ergänzt (Alice’ Idee,
  stand in `recht-apostroph` schon richtig), vierter Fall Newton’sche/newtonsche Gesetze,
  Ladennamen präzisiert, „20%ig“ statt des Fehlbeispiels „20-prozentig“ (`t03` lässt
  „100%ig“ jetzt durch). `recht-apostroph` und `r10` auf das typografische ’ umgestellt.
- **Semikolon:** nie Pflicht; in der Aufzählung ersetzt es das Komma, nicht der Punkt
  („der ist nie falsch“ galt nur zwischen Sätzen). Gedankenstrich als dritte Möglichkeit.
- **Neue Fehlerklasse im Prüflauf** (`tests/inhalt.js`, Abschnitt D): Unterscheiden sich
  zwei Optionen beim Hören nur durch ein Satzzeichen, muss der Hörhinweis es beim Namen
  nennen. Gefunden: `p03` (Semikolon, der Hinweis zählte nur Kommas) und `q12` („8:30“
  meldete „ohne Trennzeichen“). `hoerHinweis()` kennt jetzt Semikolon und Doppelpunkt,
  `zahlHinweis()` den Doppelpunkt in Uhrzeiten.

Was die Belegagenten nicht erreichen konnten: duden.de, rechtschreibrat.com, dwds.de,
grammis und Wikipedia sind aus der Umgebung nur über Suchtreffer lesbar. Die
Paragraphennummern des Regelwerks 2024 sind deshalb nur dort genannt, wo sie mehrfach
bestätigt sind (§ 73 Infinitivgruppen). Ein Prüfer hatte den Volltext der Fassung
2006/2018 als lokale Textdatei — die Zitate daraus sind in den Commit-Nachrichten
und Urteilen im Workflow-Journal nachlesbar, nicht in der App.

**Zeichensetzung belegt, Infinitivkomma auf den Stand von 2024** (04.09.2026).
Punkt 1 der Ideenliste. Duden, Rechtschreibrat, DWDS und grammis sind aus der
Sitzungsumgebung nicht direkt abrufbar (Proxy), belegt wurde über Suchtreffer auf
diesen Seiten und über die Zusammenfassung der Änderungen des Rechtschreibrats
(`RfdR_Amtliches-Regelwerk_2024_UeberblickAenderungen.pdf`), Duden-Handreichung zur
29. Auflage, GfdS, lehrerfreund. Ergebnis:

- **Infinitivgruppen — die App war auf dem Stand von 2006.** Seit 1. Juli 2024 ist das
  Komma bei *erweiterten* Infinitivgruppen Pflicht (Regelwerk § 73, Infinitivgruppen
  zählen jetzt zu den Nebensätzen). Frei bleibt nur der bloße Infinitiv („Er hofft(,)
  zu gewinnen“). Kein Komma, wenn der Infinitiv mit sein, haben, brauchen, pflegen,
  scheinen (übertragen: drohen, versprechen) ein Prädikat bildet (§ 73 E4). Neu ist auch
  die ausdrückliche Kommapflicht bei Abhängigkeit von Adjektiv oder Partizip.
  Geändert: Regel `komma-infinitiv` neu geschrieben, Übung `k20` gedreht (Pflicht statt
  fakultativ, richtige Antwort steht jetzt vorn, ID unverändert), `k01` ergänzt, fünf
  neue Übungen `j01–j05` (neues Präfix), Textcheck-Muster `y11` (prüfen, nicht hart:
  Verb + erweiterte Infinitivgruppe ohne Komma; null Treffer im sauberen Bestand),
  Spickzettel Abschnitt 1, „Stand der Prüfung“.
- **Partizipgruppen:** Komma seit **1996** frei, nicht seit 2006; 2024 beibehalten.
  Regel und `k29` korrigiert.
- **Doppelpunkt:** bestätigt. Liste der Ankündigungswörter ergänzt (nämlich, zum
  Beispiel, wie, und zwar, das heißt, unter anderem, also), Beispiel dazu.
- **Bis-Strich:** bestätigt, auch für DIN 5008:2020 (mit Leerzeichen, gilt dort auch
  für den Streckenstrich). Ergänzt: „4- bis 6-Zimmer-Wohnung“ statt „4–6-Zimmer-Wohnung“,
  Bis-Strich nur zwischen Zahlen und Einzelbuchstaben.
- **Geänderte Antwort wird neu gelernt.** Bei `k20` ist die richtige Antwort eine andere
  als vor dem 04.09.2026. Neu: `NEU_GELERNT = {k20: "2026-09-04"}` und
  `regelAenderungen()` — beim Laden und nach dem Import kommt eine solche Karte einmal auf
  Fach 1 zurück und ist sofort fällig, wenn ihre letzte Antwort vor dem Datum lag. Der
  Lernstand hält das Datum nicht, es ergibt sich aus Fälligkeit minus Fachintervall.
  Der Vermerk `S.neu` verhindert Wiederholung und wandert mit Export und Import.
  `tests/lernen.js`, Abschnitt F, prüft das inklusive Import einer alten Sicherung.
- **Dabei gefunden:** zwei Textcheck-Muster trugen dieselbe Kennung `y05`. Die alte
  (gleich/derselbe) behält sie, `tests/suite.js` prüft jetzt dauerhaft, dass
  Prüfmuster-Kennungen eindeutig sind.

Nicht geändert: `komma-nebensatz`, `komma-hauptsatz`, `komma-einschub`, `komma-vergleich`,
`komma-adjektive`, `komma-brief`, `z-anfuehrung`, `z-klammern`, `z-auslassung`, `z-frage`,
`z-schraeg`, `z-semikolon` — nicht einzeln belegt, nur gelesen; nichts Auffälliges.
Die 2024 neu nummerierten Paragraphen sind in der App nur bei `komma-infinitiv` zitiert;
alle anderen Regeln nennen bewusst keine Nummern, weil die Zählung der Fassung 2024 dort
nicht verifiziert werden konnte (ein Prüfer hatte den Volltext der Fassung 2018 lokal).

**Achtung — zwei Sitzungen im selben Ordner** (29.08.2026). Eine zweite Claude-Code-Sitzung
hat den alten Cowork-Ausgabeordner als „Stand aus vorherigem Chat“ über die Arbeit dieser
Sitzung committet (`c6ff912`, −465 Zeilen): Satzform der Fallkarten, Retentionszahl und
zwei Prüfläufe waren aus dem Arbeitsverzeichnis verschwunden. Der Inhalt lag noch in
`300c665` und wurde von dort zurückgeholt. **Der Cowork-Ordner ist überholt — nicht mehr
als Quelle verwenden.** Wer in diesem Projekt zu arbeiten anfängt: erst `git log` lesen.

**Belege für die festen Verbpräpositionen** (29.08.2026, gegen DWDS geprüft):

- `leiden an` fehlte in `gram-praep` ganz, aufgeführt war nur `leiden unter`. Die
  Aufteilung an = Krankheit / unter = Umstand steht jetzt als Faustregel da, nicht als
  feste Grenze: Das DWDS führt beide Präpositionen für seelisches Leiden gemeinsam
  („an unglücklicher Liebe leiden“).
- `bestehen auf` steht mit Dativ; der Akkusativ ist laut DWDS seltene Nebenform, also
  nicht falsch. Steht jetzt in Regel und Fallkarte.
- Die Wohin-/Wo-Probe in `gram-kasus` stand ohne Einschränkung da. Sie greift nur
  räumlich — bei Thema („über den Trainer sprechen“) und Zeit („vor einem Jahr“) liegt
  der Fall fest. Die Fallkarten wussten das längst, die Regel nicht.
- `sich erinnern` transitiv ist bestätigt: DWDS sagt „landschaftlich, besonders
  norddeutsch“. Die App lag richtig, die Aussage ist jetzt belegt.
- **Nicht** ergänzt: ein Verwechslungspaar `nützen`/`nutzen`. Das DWDS führt beide als
  Synonyme ohne saubere Kasustrennung — die Aussage wäre zu glatt gewesen.


**Fallkarten in Satzform** (29.08.2026). Die Fallkarten fragten nach dem *Namen* des
Falls; jetzt fragen sie nach der **Form im Satz**: „Ich helfe ___ beim Aufbau“ mit
den Antworten *ihm* / *ihn*. Das ist die Form, die beim Sprechen gebraucht wird.

- 164 der 165 abfragbaren Karten haben eine Satzform (Feld `s`), alle von Hand geschrieben.
- Die Kartenschlüssel (`c:helfen`) sind unverändert — **kein Lernstand geht verloren**.
- Die Optionen werden mit Tagesseed gemischt, die richtige steht nicht immer vorn.
- Die neun Wechselpräpositionen tragen **zwei Fassungen** — wohin und wo. Welche drankommt,
  entscheidet der Tagesseed; über die Wochen kommen beide dran.
- Die Erklärung zeigt den ausgefüllten Satz statt des alten Beispiels; `ex` steht weiter
  in der Fall-Referenzliste und in der Suche.

Ohne Satzform bleibt nur `lehren`: Dort „kommt der Dativ der Person vor, gilt aber als
schwächer“ — also gibt es keinen sicher falschen Ablenker.

**Retentionszahl im Fortschritt** (29.08.2026). Ganz oben in der Übersicht stehen jetzt
drei Zahlen statt nur XP: **sitzt sicher · im Aufbau · noch nicht dran**, dazu ein
Stapelbalken über den ganzen Bestand (damals 652, heute 696 Karten).

Sicher heißt Fach 4 oder 5. Das ist keine willkürliche Grenze: Eine falsche Antwort setzt
eine Karte auf Fach 1 zurück, wer in Fach 4 steht, hat also mindestens dreimal nacheinander
richtig geantwortet. Genau diese Aussage steht in der App — und `tests/lernen.js` rechnet
sie über `grade()` nach, statt sie zu glauben. Was die Zahl **nicht** hergibt, steht in
`CLAUDE.md`: den Abstand zwischen den Antworten hält der Lernstand nicht fest.

Neu dabei: `alleSchluessel()` als einzige Quelle für den Gesamtbestand. Vorher stand die
Rechnung `ALL.length+WORDS.length+drillPool().length` einmal mitten in der Kartenansicht.

**Dabei aufgefallen und mitbehoben:** `drillCase()` gab für alle Wechselpräpositionen
pauschal „Akkusativ oder Dativ“ zurück. Bei `in (Richtung)` und `auf (Richtung)` steht in
der Karte aber „Akkusativ“ — die richtige Antwort widersprach also der Erklärung direkt
darunter. `drillCase()` folgt jetzt einer eindeutigen Fallangabe, und `tests/fallform.js`
prüft diesen Widerspruch dauerhaft mit.

**Was der neue Prüflauf leistet.** `tests/fallform.js` prüft Lücke, Optionen, Hörbarkeit,
Abdeckung, dass beide Fassungen drankommen, und dass der ausgefüllte richtige Satz keine
harte Textcheck-Meldung auslöst. Der Kern ist aber `tests/formen.js`: eine unabhängig
aufgestellte Tabelle, welche Artikelform zu welchem Fall passt — vorher nur in `inhalt.js`,
jetzt von beiden Läufen geteilt. Damit waren zunächst **163 der 173 Fassungen maschinell gegen ihren
Fall geprüft** und 66 Ablenker als eindeutig falsch bestätigt; seit dem 04.09.2026 sind es
171 Fassungen und 123 Ablenker (siehe Ideenliste, Punkt 4). Der Lauf nennt die zwei
verbleibenden Fassungen offen, statt Deckung vorzutäuschen.

Davor (aus der letzten Sitzung, inzwischen geprüft):

1. `getrennt-praep`: „Alle diese Präpositionen verlangen den Genitiv“ → Hinweis
   ergänzt, dass mit eingeschobenem „von“ der Dativ korrekt ist.
2. `komma-aufzaehlung`: Einschränkung ergänzt, dass „kein Komma vor als/wie“ nur
   für den bloßen Vergleich gilt.
3. `recht-klassiker`: „Portemonnaie“ um die zulässige Form „Portmonee“ ergänzt.

## Was inhaltlich belegt ist

Rund 70 Einzelaussagen sind gegen Duden, DWDS, das amtliche Regelwerk und DIN 5008
gegengeprüft — vor allem dort, wo etwas als ausnahmslos richtig oder falsch dasteht.
Belegt und im Text kenntlich gemacht sind unter anderem:

- „gewinkt/gewunken“ (DWDS: gewunken umgangssprachlich, zunehmend schriftlich)
- Perfekt von stehen/sitzen/liegen mit haben oder sein (regional, beides korrekt)
- „anrufen“ + Dativ (südwestdeutsch und schweizerisch)
- „brauchen“ ohne „zu“ (gesprochen verbreitet, geschrieben mit „zu“)
- „imstande/im Stande“, „zu Hause/zuhause“, „Portemonnaie/Portmonee“ (Varianten)
- Groß-/Kleinschreibung nach Präposition: Wahl nur ohne Artikel
- „bräuchte/brauchte“ (Zweifelsfall, beide vertretbar)
- Komma bei erweiterten Infinitivgruppen: seit 2024 Pflicht (Regelwerk § 73); bloßer
  Infinitiv frei; kein Komma nach sein/haben/brauchen/pflegen/scheinen (§ 73 E4)
- Partizipgruppen: Komma seit 1996 frei, 2024 beibehalten
- Doppelpunkt: entbehrlich nach nämlich/zum Beispiel/und zwar; groß danach nur bei Ganzsatz
- Bis-Strich: Duden ohne, DIN 5008 (auch 2020) mit Leerzeichen; nicht mit „von“ kombinieren

Der übrige Bestand beruht auf allgemeinem Sprachwissen und hat die maschinellen
Prüfungen bestanden, ist aber nicht einzeln belegt. Der Absatz „Stand der Prüfung“
im Regelwerk sagt das dem Nutzer auch so — **bitte aktuell halten**, wenn du
weiter belegst.

## Ideenliste

Nach Nutzen sortiert, nichts davon ist angefangen:

1. **Restliche Regelgruppen belegen.** Erledigt sind Zeichensetzung, Groß- und
   Kleinschreibung, Getrennt- und Zusammenschreibung und die Rechtschreibfallen.
   Offen sind die 23 Grammatikregeln (`gram-*`), die 14 Satzbauregeln (`satz-*`), die
   17 Stilregeln (`stil-*`) und die 26 Formulierungsregeln (`form-*`) — bei den letzten
   beiden Gruppen geht es weniger um Belege als um die Frage, ob Empfehlungen als
   Empfehlungen gekennzeichnet sind (Grundsatz 3). Vorgehen wie gehabt.

2. **Aus der alten Liste: restliche Zeichensetzung belegen.** Infinitivgruppen, Partizipgruppen,
   Doppelpunkt und Bis-Strich sind erledigt (siehe „Zuletzt geändert“). Offen:
   `komma-nebensatz`, `komma-hauptsatz`, `komma-einschub`, `komma-vergleich`,
   `komma-adjektive`, `komma-brief` und die übrigen `z-`-Regeln gegen das Regelwerk
   von 2024 lesen — die Kommaregeln sind dort neu nummeriert, und „Komma bei Nebensätzen
   mit und/oder“ könnte sich verschoben haben. Vorgehen wie gehabt: erst belegen, dann
   Regel, Übung, Fallkarte und Textcheck angleichen, dann „Stand der Prüfung“ nachziehen.
3. **Textcheck weiter schärfen.** Trefferquote im eigenen Fehlerkorpus ist gut,
   Fehlalarme auf sauberem Text bei null. Weitere Muster sind möglich, aber jedes
   neue Muster muss gegen sauberen Text geprüft werden.
4. **Erledigt (05.09.2026): 39 neue Wortkarten, jetzt 155.** Vier Sammler mit
   verschiedenen Blickwinkeln (Wissenschaftssprache, Verwechslungspaare, präzise
   Wörter statt Allerweltsvokabeln, Urteilsadjektive) haben 48 Karten mit Duden- oder
   DWDS-Beleg vorgeschlagen; je Sammlung haben zwei Prüfer (Bedeutung und Quelle;
   Sprache und Nutzen) jede Karte einzeln beurteilt und kleine Mängel korrigiert.
   Acht Karten fielen: zu banal für einen Muttersprachler (plädieren, Konsens,
   fordern/fördern, verfrüht, nachlässig, ausgewogen), Kollision mit „explizieren“
   (darlegen), unsaubere Trennung (unverständlich/unverstanden). Neu unter anderem:
   implizieren, extrapolieren, nivellieren, das Konstrukt, die Signifikanz, die Empirie,
   formal/formell, rational/rationell, physisch/physikalisch, geistig/geistlich,
   ideal/ideell, verifizieren/falsifizieren, erörtern, veranschaulichen, gewichten,
   resümieren, erwidern, aufweisen, hinreichend, mutmaßlich, vertretbar, allenfalls.
   Weitere Kandidaten am besten aus Nils' eigenen Texten; die Sammler-Prompts stehen
   im Workflow-Skript `wortschatz-erweitern` der Sitzung.
5. **Erledigt (04.09.2026): die zehn offenen Fassungen sind maschinell geprüft.** Die
   Formentabelle kennt jetzt die artikellosen Adjektivformen der Karten (`nächsten`,
   `besseres`, `angefangene` …, stark gebeugt, mit Kommentar zur Mehrdeutigkeit von „-en“)
   und eine zweite Tabelle `PRONOMEN` (er, sie, es, wir, ihr), die nur in `fallform.js`
   gilt — in Beispielsätzen wäre „sie“ meist Subjekt und würde `inhalt.js` verfälschen.
   Die Ablenkerprüfung zählt einen Ablenker jetzt auch dann als sicher falsch, wenn
   keine seiner Lesarten den verlangten Fall enthält („sie“ für einen Dativ); vorher
   waren nur eindeutige Formen entscheidbar. Stand: 171 von 173 Fassungen gegen ihren
   Fall geprüft (vorher 163), 123 Ablenker entschieden (vorher 66), `inhalt.js` prüft
   121 statt 115 Beispiele. Offen bleiben nur `nach (Richtung)` und `bei (Ort)`, wo die
   Präposition wechselt statt der Form — dort sagt der Fall nichts über richtig und falsch.

## Werkzeug, das nützlich war

- `nils-schreibstil` — Skill mit Nils' Schreibstil, abgeleitet aus seinem
  BFP-Portfolio. Nützlich, wenn Texte nach ihm klingen sollen.
- Web-Recherche für jede normative Aussage. Duden und DWDS liefern klare
  Variantenangaben, `grammis.ids-mannheim.de` gute Begründungen.

## Was schiefgehen kann

Steht ausführlich in `CLAUDE.md`, Abschnitt 4 und 6. Die zwei teuersten Fallen:

- **Skript bricht ab, bevor geschrieben wird** — Änderungen gelten als erledigt,
  sind aber nie in der Datei gelandet. Nach jedem Schritt schreiben.
- **`\b` in nicht-rohen Python-Strings** — wird zum Steuerzeichen und macht
  Prüfmuster stumm, ohne dass die Syntax bricht. Vier Textcheck-Muster waren so
  eine Weile tot.
