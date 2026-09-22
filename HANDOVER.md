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
| Übungen | 381 |
| Regeln | 118 |
| Wortkarten | 155 |
| Fallkarten | 182, davon 164 in Satzform (173 Fassungen) |
| Satzbaukarten | 24 |
| Prüfmuster im Textcheck | 101 |
| Fehlersuchtexte | 12 mit 86 markierten Fehlern |
| Dateigröße | ~765 KB, eine Datei, kein Build |

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

**Die Schreibwerkstatt, gegen ihre Regeln gelesen (22.09.2026, zweiundzwanzigste Runde).**

Nach Übungen und Prüfmustern der dritte Bestand: 105 Einträge (Schreibaufträge,
Situationen, Vorher/Nachher-Paare, Bausteine) in 15 Paketen, dazu 79 fast gleiche
Satzpaare aus gekoppelten Einträgen in 10 Paketen und drei Querschnittsprüfer; jede
Meldung danach von einem Widerleger angegriffen. 134 Agenten, 106 Meldungen, 59 gehalten.
Ein Widerleger (`w10.tip`) lief ins Wochenlimit — die Meldung habe ich selbst geprüft und
eingebaut, also 60. Alle 60 vor dem Einbau nachgemessen: Zählungen selbst nachgezählt,
Sprachbehauptungen mit je zwei verschieden formulierten Suchen.

**Die Befunde nach Klasse:** 22 Einträge widersprachen sich selbst, 13 ihrer Regel, 12
waren sachlich falsch, vier Vorbildtexte hatten einen Sprachfehler, je zwei Rang- und
Absolutaussagen, zwei regionale Formen ohne Einordnung, zwei sonstige.

- **Zahlen, die nicht stimmten.** `w06` „Aus 46 Wörtern werden 28“ (38 und 26), `w10`
  „Vorher (68 Wörter)“ über einem Absatz mit 53, `pr06` und `pr09` zählten Sätze und Wörter
  falsch, `pr24` hieß „fünffach abgesichert“ bei vier Absicherungen. Die Übung `f43` trug
  dieselbe Zahl in ihrer **richtigen Antwort** — jetzt „Mehrfach abgesichert“, und `f43`
  steht mit dem 22.09. in `NEU_GELERNT`.
- **Tipps gegen die eigenen Beispiele:** `ph05`, `ph19`, `ph29`, `ph32`, `ph36`, `ph48` —
  der Merksatz empfahl, was die Formulierungen darüber nicht taten, oder umgekehrt.
- **Regional:** `ph09` bot „es geht sich zeitlich nicht aus“ als förmliche Absage an — das
  ist österreichisch. Jetzt „zeitlich ist es mir nicht möglich“.
- **Komma vor „statt … zu“** fehlte in `pr12` und `pr28`. Der Textcheck sah es nicht: `y02`
  kannte nur „um … zu“ und bekam einen schmalen Zweig für statt/anstatt (breiter getestet
  meldete er „ohne Weiteres zu erklären“). Und die Begründungen der Paare liefen gar nicht
  im Vorbildkorpus — jetzt schon; die Gegenprobe mit dem alten `pr12` wird rot.
- **Eine eigene Korrektur der Runde 20 war ungenau:** In der Anrede wird der
  Professorentitel ausgeschrieben, der Doktortitel bleibt abgekürzt („Sehr geehrter Herr
  Dr. Lang“). `form-anrede` und `f01` sagen das jetzt.
- **Der Kopplungswächter hat zum ersten Mal echt angeschlagen**, und zwar bei mir: Ich hatte
  in `g03` „dagegen“ durch „ebenfalls“ ersetzt, während `y08` den Satz weiter trug. `g03`
  folgt jetzt der Reihenfolge von `y08`.
- Die Kopfzeile eines Schreibauftrags zeigte „Umformulierung Wörter“ — `umfang()` hängt
  „Wörter“ nur noch an Zahlen.

**Beim Nachzählen selbst gefunden, nach dem Workflow:**

- **Alle 13 Musterlösungen mit Wortbereich lagen darunter** (`w01`: 200–280 verlangt, 153
  gezeigt). Die Vorgaben sind an die Muster angepasst — kürzer schreiben ist ohnehin, was
  die Werkstatt übt. Neue Prüfung in `tests/suite.js`: Wortbereich (bei „2 × a–b“ je
  Fassung), Zählköpfe „(N Wörter)“, Prozentangabe, „Aus N Wörtern werden M“ und die
  zählbaren Selbstcheck-Punkte („Genau fünf Sätze“, „Kein Satz länger als 25 Wörter“),
  gezählt wie das Schreibfeld der App. Sieben Positivproben aus den alten Fassungen, eine
  Abdeckungszusicherung. Zahlen im Fließtext sieht sie nicht.
- **`w10` erfand beim Kürzen eine Zahl** („über vierzig empirische Studien seit 2015“) —
  unter meinem eigenen neuen Tipp „du nimmst nur weg“. Das Nachher sagt jetzt nur, was das
  Vorher sagte (15 Wörter, −72 %); der Titel heißt „Ein Viertel kürzer“, passend zur
  Aufgabe (mindestens 25 Prozent), statt „Zehn Wörter kürzer“.
- **`w05` und `kt10` schrieben Dietrich Kurz einen Aufsatz „Erziehender Sportunterricht“
  samt Ergebnis zu.** So heißt ein Buch von Peter Neumann (2004); Kurz' Titel von 2001
  lautet „Pädagogische Perspektiven für den Schulsport. Orientierungen für einen
  erziehenden Sportunterricht“. Das Ergebnis war ausgedacht. Jetzt „Weber“ mit dem Aufsatz
  „Zwei Ziele, eine Stunde“ — erkennbar erfunden, wie Frau Dr. Weber in den Mails. Mit dem
  weiblichen Subjekt wurden zwei „sie“ in `w05` doppeldeutig; umformuliert.
- `w04` nannte die Bewegungsbeschreibung „die härteste Schule für Sprachgenauigkeit“; der
  Rangwächter kannte „härteste“ nicht. Jetzt schon, mit Positivprobe.

**Gemessen, nicht bearbeitet:** `BESTAND` in `tests/suite.js` heißt „der ganze Bestand“,
nimmt aber nur die erklärenden Felder auf — nicht `PROMPTS.p`, `SCENES.ask`,
`PHRASES.lv`, `WORDS.ex`/`s`, `CASEREF.ex`/`s`, `SATZ.short`, `ALL.o`, `KORREKTUR.txt`
und die Titel der Prüfmuster. Rang- und Absolutwächter über diese 1280 Felder: sauber,
die Treffer sind Beispielsätze („die drei wichtigsten Korrekturen“). Wer sie aufnimmt,
bekommt eine Erlaubnisliste für Beispielsätze dazu.

**Ein Wächter für die gekoppelten Sätze (22.09.2026).**

Die Falle „die Korrektur bleibt auf einer Ebene liegen“ stand seit gestern in CLAUDE.md,
aber keine Prüfung hielt sie. Jetzt schon.

**Was gemessen ist.** 101 Sätze stehen wörtlich an zwei oder mehr Stellen in voneinander
unabhängigen Beständen — eine Regel und eine Übung, ein Prüfmuster und ein
Vorher/Nachher-Paar, ein Baustein und eine Regel. 67 davon an zwei Stellen, 30 an drei,
vier an vier oder fünf. Die Paare aus Regel und Satzkarte zählen nicht mit: `RULES_SATZ`
wird über `SATZ_RULEMAP` aus `SATZ` erzeugt, beide tragen denselben Text von Haus aus.

**Warum auf Satzebene und nicht auf Paarebene.** Am 21.09. teilten die Übung `f06` und das
Vorher/Nachher-Paar `pr01` drei Sätze. Nach der Korrektur an `f06` noch zwei. Eine Prüfung
„teilen die beiden noch irgendetwas?“ hätte geschwiegen. Der Wächter vergleicht deshalb
Satz für Satz und meldet genau einen Fall: **Ein gespeicherter Satz steht noch an manchen
seiner Stellen und an anderen nicht mehr.** Verschwindet er überall, war es ein sauberer
Umbau — das bleibt still und wird nur als abgelaufener Eintrag gezählt.

**Neu im Repo:** `tests/kopplung.js` (die geteilte Sammel- und Normierlogik, mit der
Begründung im Kopf), `tests/kopplungen-schreiben.js` und `tests/kopplungen.json` (der
Stand), dazu `npm run kopplungen`. Wer einen gekoppelten Satz umschreibt, ruft das Skript
und legt die neue Fassung in denselben Commit.

**Gegengeprobt am echten Bestand**, nicht nur an einer Attrappe: In einer Kopie habe ich
eine Seite eines gekoppelten Satzes geändert — der Lauf wird rot und nennt beide Seiten
(„noch bei Regel z-klammern, nicht mehr bei Übung p16“). Dazu drei Proben im Lauf selbst,
alle durch dieselbe Urteilsfunktion wie der Bestand: einseitig geändert → rot, überall
umgeschrieben → still, überall unverändert → still.

**Zwei Messungen nebenbei, beide noch nicht bearbeitet:**

- **Regelverweise fehlen der halben App.** Übungen (381), Prüfmuster (101) und
  Fehlermarkierungen (86) tragen alle ein Feld `r` und führen damit in eine Regel — das
  ist die Grundlage der Runden 20 und 21. Wortkarten (155), Fallkarten (182), Tabellen
  (10) und die ganze Schreibwerkstatt (105) tragen **keinen einzigen**. Genau deshalb
  konnte `pr01` von `form-bitten` wegdriften, ohne dass etwas anschlug. Umgekehrt ist der
  Bestand sauber: Auf jede der 118 Regeln zeigt mindestens eine Übung, ein Prüfmuster oder
  eine Fehlermarkierung — es gibt keine unerreichbare Regel.
- **Zehn Vorbildtexte lösen den eigenen Textcheck aus**, alle auf den Stufen `stil` und
  `form` (`hart` und `prüfen` sind schon abgesichert). Mehrere davon zu Recht: Die
  Mustertexte von `w10` und `sc11` zitieren absichtlich eine schlechte Fassung, bevor sie
  die gute zeigen. Zwei bis drei sehen nach echter Selbstwidersprüchlichkeit aus, darunter
  `ph29` — eine förmliche Musterformulierung mit „deutlich“, das `s08` als vage Angabe
  anstreicht.

**Die 101 Prüfmuster, gegen ihre eigene Regel gelesen (21.09.2026, einundzwanzigste Runde).**

Dieselbe Frage wie eine Runde vorher, ein Bestand weiter: Jedes Prüfmuster des Textchecks
verweist auf eine Regel — sagen beide dasselbe? 17 Prüfer über je sechs Muster, dazu vier
Querschnittsprüfer (Stufenzuordnung, doppelt erklärte Sachen, regionale Einordnung, Regex
gegen Text), jede Meldung danach von einem Widerleger angegriffen. 109 Agenten, 88
Meldungen, 58 gehalten. **43 der 101 Muster sind geändert.** Alle 58 habe ich vor dem
Einbau selbst nachgemessen — die Regex-Befunde in node, die Sprachbehauptungen mit je zwei
verschieden formulierten Suchen. Ein Agent hatte einen Regelwortlaut falsch zitiert und
einer ein Gegenbeispiel erfunden, das die Regex gar nicht trifft; beides fiel beim
Nachmessen auf.

**Der große Befund, 31 von 58 Meldungen: Der Hinweis beschreibt einen Geltungsbereich,
den die Regex nicht prüft.** Beispiele, alle selbst nachgemessen:

- `a06` („Etikett statt Beobachtung“) trifft „unzuverlässig“ auch in „die Zeitmessung war
  unzuverlässig“ — dort bewertet niemand eine Person.
- `s01` lief mit `i`-Flag und hielt deshalb das Substantiv „Halt“ für ein Füllwort: „Beim
  Sprung verlor er den Halt“ bekam den Rat „streich es testweise“.
- `a05` meldet schon zwei Genitive („dem Trainer der Mannschaft des Vereins“) und erklärte
  sie mit „drei Genitive lesen sich zäh“ — genau die Zahl, die die eigene Regel für lesbar
  erklärt.
- `f13` nannte „Ich versuche seit zwei Wochen, einen Termin zu bekommen“ eine halbe Absage.
- `a03` meldet „wurde von der Halle bis zum Platz vermessen“ und riet zum Aktiv, obwohl es
  dort gar keinen Handelnden gibt.
- `a04` meldet jeden Block ohne Satzpunkt als „sehr langen Satz“, weil `[^.!?]` den
  Zeilenumbruch einschließt — ein zeilenweise notierter Trainingsplan reicht.

Der Ausweg war fast nie die engere Regex — die verliert echte Treffer —, sondern der
Hinweis, der seine Bedingung selbst nennt.

**Zwei Muster trafen ihr eigenes Beispiel nicht.** `a02` verlangt drei Substantive auf
-ung/-heit/-keit und führte einen Satz mit zweien vor. `y11` fing sein eigenes „pünktlich
zu sein“ nicht, weil „sein“ anders als bei `y02` nicht in der Verbliste stand — dieser
zweite Fund ist beim Nachmessen entstanden, nicht gemeldet worden.

**Und die Umlautfalle aus CLAUDE.md schnappte wieder zu.** In „Alles fließt.“ markierte
`y08` die Zeichenfolge **Alles flie** als fehlende Großschreibung: Weil ß für JavaScript
kein Wortzeichen ist, liegt hinter „flie“ eine Wortgrenze. Dasselbe Muster ließ „etwas
müde“ und „etwas lange“ anstreichen, wo „etwas“ Gradangabe ist und die Kleinschreibung
stimmt. Die Regex trennt jetzt: `-es` nach allen fünf Wörtern, `-e` nur nach „alles“, und
die Wortgrenze am Ende ist umlautfest.

**Vier Hinweise waren absoluter als ihre Regel.** „in Großbuchstaben steht ohnehin SS“,
obwohl `recht-sz` daneben das große ẞ führt. „Klein bleibt nur das Adverb früh“, obwohl
`gross-zeit` „morgen Früh“ als zulässige, süddeutsch-österreichisch geprägte Variante
nennt. Die n-Deklination „bekommt überall -en“, obwohl die Wortliste desselben Musters
**Herr** und **Bauer** führt, die -n bekommen — wer dem Hinweis folgte, schrieb „dem Herren
Weber“. Und `x03` („während“) trug als einziges der drei Genitivpräpositions-Muster die
regionale Einordnung nicht.

**Dazu:** `x24` gibt die Herkunft von „in 2026“ jetzt als das aus, was sie ist — die
Einordnung des Dudens, der Sprachwissenschaftler widersprechen; belegt ist die Fügung im
Deutschen schon im 18. Jahrhundert. Die Stufen sind angeglichen: „S.12“ stand auf „bitte
prüfen“, „§5“ auf „klarer Fehler“, obwohl derselbe Satz derselben Regel dahintersteht —
beides ist jetzt hart. Zwei Regeln haben eine Lücke geschlossen, in die ihr Prüfmuster
zeigte: `sa22` sagte nichts zu wo(r)-, `getrennt-praep` führte von „irgendwann“ und
„irgendwo“ nichts.

**Drei Prüfungen sind dazugekommen oder weiter geworden**, alle gegen den Bestand vor
dieser Runde rot gegengeprobt:

- *Der Hinweis widerspricht seinem eigenen Muster.* Die linke Seite eines „falsch →
  richtig“ muss das Muster auslösen, die rechte nicht; und keine im Hinweis fett
  empfohlene Form darf ihr eigenes Muster auslösen (drei begründete Ausnahmen: die
  Zweifelsfall-Muster, die beide Varianten anstreichen).
- *Der Absolutwort-Wächter* las nur Grammatik- und Satzregeln — zum dritten Mal dieselbe
  Klasse. Er liest jetzt auch die Prüfmuster und die Schreibwerkstatt. Dort stand der
  Fund, den niemand sah: `ph06` sagte „Nenn **immer** ein Datum, **nie** eine
  Dringlichkeitsstufe“ und widersprach damit der Regel `form-frist` **und** den eigenen
  Beispielen derselben Karte („Bis Freitag würde mir reichen“). 19 Stellen stehen jetzt
  mit Grund in der Liste, die übrigen Sorten bleiben mit Begründung draußen.
- *Der Rang-Wächter* verlangte den Superlativ direkt hinter dem Artikel. `pr29` nannte
  „nie“ und „immer“ „die **zwei häufigsten** Konfliktverstärker der deutschen Sprache“ —
  ein Zahlwort dazwischen, und der Erkenner schwieg.

**Ein Nachzügler von gestern.** Die Korrektur an `f06` („Der Konjunktiv macht sie nicht
höflicher“) war in der Schreibwerkstatt liegen geblieben: `pr01` trug den Satz wörtlich
weiter. Beim Nachmessen kam heraus, wie groß die Kopplung ist — **97 Sätze stehen in zwei
oder mehr voneinander unabhängigen Beständen**, die 230 generierten Regel↔Satzkarte-Paare
nicht mitgezählt. Wer eine Formulierung ändert, sucht sie vorher im ganzen Bestand.

`npm run kalender` war nicht nötig: keine Änderung an Lernlogik, `NEU_GELERNT` oder
Fixtures, und keine Karte hat eine andere richtige Antwort bekommen.

**Die 381 Erklärungen, gegen ihre eigene Regel gelesen (21.09.2026, zwanzigste Runde).**

Jede Übung trägt eine Erklärung und verweist auf eine Regel. Geprüft war bisher, dass der
Verweis existiert — nicht, dass beide dasselbe sagen. Zwanzig Prüfer haben je rund zwanzig
Erklärungen Satz für Satz gegen die Regel gelesen, in die sie zeigen; jede Meldung ist
danach von einem Gegenprüfer angegriffen worden. Von 23 Meldungen hielten 18. Alle 18 habe
ich vor dem Einbau selbst nachgeprüft, die strittigen mit je zwei verschieden formulierten
Suchen.

**Zwei Ablenker waren nicht sicher falsch** — Grundsatz 2, und beide, ohne dass jemand die
Aufgabe je angefasst hätte:

- `x05` fragte „Welche Form ist standardsprachlich?“ und wertete **gewunken** als falsch.
  Der Duden führt seit 2005 „gewinkt, auch: gewunken“ ohne Zusatz, grammis (IDS) stuft
  beide Partizipien als standardsprachlich ein. Die Einordnung „umgangssprachlich“ in der
  App ist der Duden-Stand von 1998. Aus der Entscheidungsfrage ist eine Variantenfrage
  geworden; `sa24` und die Quellenzeile daneben sind mitgezogen.
- `f01` fragte nach der Anrede beim Erstkontakt mit einer Professorin und gab „Sehr geehrte
  Frau Weber“ als richtig aus. Der Duden-Sprachratgeber trennt sauber: In der **Anrede**
  steht der höchste Titel, ausgeschrieben, der Doktortitel entfällt daneben („Sehr geehrte
  Frau Professorin Weber“); abgekürzt und vollständig steht er im **Anschriftenfeld**
  („Frau Prof. Dr. Claudia Weber“). Damit war der Ablenker nicht schlechter als die
  Antwort. Die Regel `form-anrede` trägt die Unterscheidung jetzt auch.

Beide Karten stehen mit dem heutigen Datum in `NEU_GELERNT` und kommen einmal auf Fach 1
zurück. **`npm run kalender` ist deshalb gelaufen** — alle sechs Versätze grün.

**Der Rest waren Erklärungen, die absoluter klangen als ihre Regel.** `s03` sagte
„Füllwörter schwächen jede Aussage“, während `stil-fuellwort` die Ausnahme fürs Gespräch
selbst nennt (Grundsatz 3). `d18` nannte „während dem Vortrag“ nur
umgangssprachlich, während `gram-genitiv` den Dativ für die Schweiz und Westösterreich
auch geschrieben führt (Grundsatz 4) — jetzt steht beides da. `x07` schrieb, „wenn“
passe **nur** bei Wiederholung oder in Gegenwart und Zukunft — der irreale Bedingungssatz
steht auch für einen einzelnen Fall in der Vergangenheit. `d15` behauptete, im Dativ Plural
ende auch das Substantiv auf -n; Plurale auf -s tun das nicht, und „den Trainings“ steht in
derselben App. `m09` leitete „lateinische Neutra auf -um bilden den Plural auf -a“ her und
widerlegte sich in der nächsten Zeile mit Zentren und Museen. `n16` und `gram-ndekl`
beschrieben die n-Deklination als Sache der Personenbezeichnungen — Automat, Planet,
Diamant und Satellit gehen genauso, und „am Automat“ war damit die naheliegende Folgerung.
`r18` bot die Verlängerungsprobe für *seit/seid* an, wo sie nicht trägt. `v08` ließ das
„meist“ und die fest ans Verb gebundenen Präpositionen weg, die `gram-kasusfinden` nennt.
`f06` sagte, der Konjunktiv mache eine Bitte nicht höflicher, während `form-hedging` sagt,
er trage die Höflichkeit allein — beides stimmt nur getrennt nach Frage und Feststellung.
`q24` erklärte nur das Leerzeichen am Paragrafenzeichen und unterschied damit den dritten
Ablenker („Abs 2.“) nicht. Und `z04` samt `sa04` behauptete, man höre „Komma, Verb, Verb“;
zu hören sind die beiden Verben, die am Komma aneinanderstoßen („… müde **war**, **bin**
ich …“).

**Zwei Fehlerklassen, die kein Wächter sah.** Beide sind gefunden worden, weil dieselbe
Behauptung in einer Formulierung stand, die knapp an der Erkennung vorbeiging:

- *Der Superlativ ohne Artikel.* Der Rangwächter verlangte „der/die/das“ davor. `z23`
  schrieb „**Häufigster** Stolperstein beim freien Sprechen“, `q01` „ist **am
  verbreitetsten**“. Er prüft jetzt auch die artikellose Fassung — groß geschrieben und mit
  Substantiv dahinter, damit „in häufigster Verwendung“ und „Beste Grüße“ draußen bleiben.
- *Die Ausnahme mit Zahlwort gezählt.* Der Zählwächter kannte nur ausgeschriebene Formeln.
  Sieben Stellen zählten mit einem Zahlwort: „gehört zu den drei Ausnahmen“ (`r17`), „Merk
  dir die drei als Ausnahmen“ (`recht-wider`) und fünf Überschriften „Zwei Ausnahmen“. Bei
  `gross-subst` und `sa04` stimmte die Zahl schon nicht mehr — beide nennen hinter der
  Zählung noch einen weiteren Fall. Alle sieben zählen nicht mehr, die Listen sind
  geblieben.

Beide Wächter sind gegen den Bestand **vor** dieser Runde gegengeprobt: Sie werden dort rot
und nennen genau z23, q01 und die elf Zählstellen.

**Vier Fundstellen kamen beim Nachziehen dazu.** Die Aussage „klein bleiben die
Zahladjektive“ stand an vier Stellen — `g03`, `g23`, dem Prüfmuster `y08` und in
`gross-subst`. Nur die Regel nannte den Vorbehalt (groß ist zulässig, wenn der
substantivische Charakter betont wird); die drei Kurzfassungen nicht. Und der Spickzettel
zählte die drei „wider“-Ausnahmen weiter mit, nachdem `recht-wider` damit aufgehört hatte —
dieselbe Zeile, die schon einmal hinterherhinkte.

**Eine Prüfung ist schärfer geworden.** `tests/inhalt.js` verlangte für „während“ nur das
Wort „umgangssprachlich“; die geografische Hälfte der Landkarte stand nur auf der
Fallkarte. Genau in die Lücke ist meine erste Fassung von `d18` gefallen. Beide Hälften
werden jetzt an beiden Stellen verlangt.

**Kein Wächter sammelt mehr selbst (21.09.2026, neunzehnte Runde).**

Die Falle „ein Wächter sieht nicht alle Bestände“ war an einem Tag zweimal zugeschnappt:
Erst übersah die Rangbehauptungsprüfung die Wortkarten, dann — nach der Korrektur — immer
noch die Schreibwerkstatt, die Fehlersuche, die Tabellen und den Spickzettel. Vier Sorten
von zehn. Diese Runde hat das systematisch nachgemessen und die Ursache beseitigt, statt
die Symptome ein drittes Mal zu flicken.

**Der Fund in der übersehenen Sorte.** Der Schreibauftrag `w01` gab als Hinweis mit:
„**Der häufigste Fehler** in Reflexionen: Bewertung schleicht sich in die Beschreibung.“
Das ist wörtlich die Formel, die CLAUDE.md als Beispiel für eine Häufigkeitsbehauptung
ohne Quelle führt — und sie stand an der Stelle, die Nils vor dem Schreiben liest. Der
Mechanismus dahinter stimmt und bleibt; nur die Rangaussage ist weg („Die Falle in
Reflexionen: …“).

**Fünf weitere Fundstellen halten und stehen jetzt mit Grund in der Ausnahmeliste:** „die
beste Übung gegen Wortballast“ (ein Rat zur Übung), „der wichtigste“ Satz einer bestimmten
Mail, „was ist der beste Weg, dich zu erreichen?“ (wörtliche Rede in einer
Musterformulierung), „die beste Investition“ (derselbe Rat wie in `form-eltern`, dort schon
begründet) und „Das Wichtigste aus dem Trainer auf einen Blick“ als Auswahlansage des
Spickzettels.

**Der Wächter über gezählte Ausnahmen las ebenfalls nur zwei Sorten.** Über den ganzen
Bestand findet er genau eine Stelle: `p22` sagt „Einzige Ausnahme sind Laden- und
Firmennamen“. Die Zählung gilt dort dem Genitiv-s, und in dieser Reichweite stimmt sie —
der Apostroph vor `-sch` ist keine Genitivform. Sie steht deshalb mit Begründung in der
Liste, ungeändert.

**Die strukturelle Änderung.** `tests/suite.js` legt den Bestand jetzt einmal in `BESTAND`
an — zehn Sorten, 1819 Felder, von der Regel bis zum Spickzettel. Beide Wächter laufen
darüber statt über eigene Sammlungen. Und darunter steht die Zusicherung, die das offen
hält: Sie liest die Datentabelle aus CLAUDE.md, ordnet jede Konstante einer Sorte zu und
verlangt, dass die Sorte in `BESTAND` vorkommt. Wer der App einen neuen Datenbestand
hinzufügt und ihn in der Tabelle einträgt, bekommt einen roten Lauf, bis der Bestand auch
gesammelt wird. Eine Positivprobe zeigt, dass sie eine fehlende Sorte erkennt.

`npm run kalender` war nicht nötig: An Lernlogik, `NEU_GELERNT` und den Fixtures hat sich
nichts geändert. Die Dateigröße in CLAUDE.md und hier stand danach auf 749 KB.

**Die Deklinationstabellen, gegen ein Paradigma gestellt (21.09.2026, achtzehnte Runde).**

CLAUDE.md führte es selbst als offene Stelle: Fünf der zehn Tabellen liefen nur als
korrektes Material gegen die harten Textcheck-Muster mit, gegen ein Paradigma geprüft
waren sie nicht. Ein falsches Feld dort wäre unsichtbar gewesen — und Tabellen sind
Nachschlagematerial, Nils liest sie, statt sie zu üben.

Vier der fünf haben ein geschlossenes Paradigma, das sich unabhängig hinschreiben lässt
(`tb02` unbestimmter Artikel, `tb05` starke Adjektivbeugung, `tb06` Personalpronomen,
`tb08` Fragewörter), die fünfte (`tb09`) ist ein durchdekliniertes Beispielwort. Alle fünf
stehen jetzt in `tests/inhalt.js`, Abschnitt B — aus der Grammatik geschrieben, nicht aus
der App abgelesen. **Inhaltlich stimmten alle fünf.** Die Lücke in der Absicherung war es
trotzdem; der Beweis, dass die Prüfung beißt, ist eine verdorbene Zelle („guten Wetter“
statt „gutem Wetter“), die sie auf Anhieb mit Zeile und Spalte meldet.

**Ein Fund am Rand.** Die Tabelle `tb09` führt in ihrer Wortliste **Herr** und schreibt
darüber „Alles außer dem Nominativ Singular endet auf -en“. Für Herr stimmt das nicht: im
Singular nur ein -n („dem Herrn Weber“), erst im Plural -en („Sehr geehrte Damen und
Herren“). Die Regel `gram-ndekl` und die Satzkarte sa14 nennen die Ausnahme beide seit
Langem — nur die Tabelle nicht, also ausgerechnet die Stelle zum Nachschlagen. Mit zwei
verschieden formulierten Suchen belegt (Duden-Eintrag „Herr“, dazu die Deklinationstabellen
von verbformen.com und korrekturen.de).

**Ein Wächter für die Abdeckung.** Nach der Lehre vom selben Tag — ein Wächter sah fünf
Bestände von sechs — zählt der Prüflauf die Tabellen jetzt selbst ab: Kommt eine dazu, für
die niemand ein Paradigma hinterlegt hat, wird der Lauf rot. Wer eine bewusst ausnimmt,
trägt sie mit Grund in `TB_OHNE_PARADIGMA` ein; dort steht heute nur `tb10`, die gegen die
Konjunktiv-II-Formen geprüft wird statt gegen ein Kasusparadigma. Beide Richtungen haben
eine Probe — eine Tabelle ohne Paradigma und ein Paradigma ohne Tabelle.

Der Absatz „Stand der Prüfung“ in der App sagte bis heute „fünf der zehn Tabellen“. Er
sagt jetzt, was gilt.

`npm run kalender` war nicht nötig: An Lernlogik, `NEU_GELERNT` und den Fixtures hat sich
nichts geändert.

**Die 155 Wortkarten, erstmals inhaltlich gelesen (21.09.2026, siebzehnte Runde).**

Die Wortkarten waren strukturell abgesichert — keine Dubletten, Beispiel lang genug,
Bedeutung lang genug — aber nie daraufhin geprüft, ob die Bedeutung stimmt. Das ist der
Bestand, den Nils auswendig lernt: 155 Karten, und `d` ist die richtige Antwort auf „Was
bedeutet X?“. Zwölf Prüfer, je rund dreizehn Karten, jede Meldung danach von einem
Gegenprüfer angegriffen, der sie widerlegen sollte. Von 28 Meldungen hielten acht; jede
habe ich anschließend selbst mit zwei verschieden formulierten Suchen nachgeprüft.

**Zwei Karten widersprachen sich selbst** — das ließ sich ohne jede Quelle nachweisen:

- **erörtern** riet in `d` von „diskutieren“ ab („— statt: reden über, diskutieren“) und
  führte es in `s` als sinnverwandt. Der Duden definiert „erörtern“ selbst mit
  „diskutieren“; unscharf ist nur „reden über“.
- **herausstellen** erklärte „deutlich hervortreten lassen“ — transitiv —, während
  Beispielsatz („Es stellte sich heraus, dass …“) und Synonyme („zeigen, ergeben“ )
  ausschließlich die reflexive Bedeutung zeigen. Nils lernte eine Bedeutung und übte
  einen Satz, der sie nicht enthält.

**Eine falsche Regel in einem Fachbegriff:** **hinreichend** erklärte, eine notwendige
Bedingung „reicht allein aber nicht aus“. Das ist logisch falsch — eine Bedingung kann
zugleich notwendig und hinreichend sein. Jetzt steht da, was das Wort sagt und was nicht.

**Eine Quellenzuschreibung, die nicht stimmte:** **lapidar** schrieb dem Duden „kurz und
bündig, aber wirkungsvoll“ zu. Der Duden sagt „überraschend kurz und knapp (aber
treffend)“ und führt das Wort als bildungssprachlich; die zitierte Fassung steht im DWDS.

**Eine Rangbehauptung:** **scheinbar / anscheinend** nannte sich „das meistverwechselte
Paar der deutschen Sprache“. Dazu unten mehr — der Wächter dafür hat sie nicht gesehen.

**Drei zu eng gefasste Bedeutungen:** **vorwegnehmen** (nicht nur aussprechen, auch tun —
„eine Entscheidung vorwegnehmen“), **diffizil** (die Schwierigkeit liegt in der verlangten
Sorgfalt, nicht in feinen Unterscheidungen) und **Reflexion** (prüfendes Nachdenken über
etwas; die Bindung an die eigene Praxis ist der Lehramtsfall, nicht die Bedeutung).

Fünf davon ändern das Feld `d` und damit die richtige Antwort — sie stehen mit ihrem
Schlüssel `w:…` in `NEU_GELERNT` und kommen einmal auf Fach 1 zurück. Die drei, bei denen
nur die Abgrenzung `t` nachgezogen wurde, stehen bewusst nicht dort.

**Drei Funde im Prüflauf selbst — der wertvollste Teil dieser Runde.**

- **Der Rang-Wächter sah die Wortkarten nicht.** Er sammelte Regeln, Satzkarten, Übungen,
  Prüfmuster und Fallkarten — fünf Bestände von sechs. Deshalb stand „das
  meistverwechselte Paar“ ungesehen da. Dieselbe Falle wie „Kartensorte verschwindet“,
  nur eine Ebene höher.
- **`.test()` auf einem `/g`-Muster ist zustandsbehaftet.** `RANG` trug das `g`-Flag; jeder
  Treffer verschob `lastIndex`, der nächste Aufruf begann mitten im Text, und der Wächter
  prüfte nur jedes zweite Feld. Aufgefallen ist das erst, als eine zweite Positivprobe
  dazukam und stumm blieb. Heute hat die Lücke zufällig nichts verdeckt — die Zahl blieb
  bei acht Stellen —, der Fehler war trotzdem echt. Die App ist davon nicht betroffen:
  Ihre Prüfmuster laufen über `matchAll`, und die beiden `.test()`-Stellen tragen kein `g`.
- **Die Mustertexte der Schreibwerkstatt liefen nicht gegen den Textcheck.** Geprüft waren
  Szenariotext und Aufgabenstellung — nicht `PROMPTS.model`, `SCENES.model`, `SCENES.alt`,
  `SCENES.why`, `PAIRS.note`, `PHRASES.tip`. Also gerade das, was Nils abschreibt. 129
  Proben: null harte Treffer, aber zwei Fehlalarme von **y08** auf sauberem Text
  („genauso wenig wie“, „wenn ich bis Freitag nichts habe“ — ein Vergleichspartikel und
  eine finite Verbform, beide auf -e). Beide sind jetzt ausgeschlossen; ein echter
  Großschreibfehler kann dahinter nicht verschwinden, weil keines der beiden ein Adjektiv ist.

**Drei Prüfungen**, alle gegen den Stand davor rot: Wortkarten im Rang-Wächter, die
Mustertexte im Korpus (`tests/suite.js`), und in `tests/inhalt.js`, Abschnitt M die Probe,
dass keine Karte ein Wort meidet, das sie selbst als Synonym führt.

**Zwei Messungen ohne Fund**, damit sie niemand wiederholt: Von den 30 Gegensatzpaaren der
Schreibwerkstatt unterscheiden sich zwölf für den Textcheck nicht — der Unterschied ist
pragmatisch („Du machst mich echt wütend“ gegen „Ich werde wütend, wenn Absprachen nicht
halten“), und dafür ein Muster zu bauen hieße, Ton als Rechtschreibung auszugeben. Und die
Ausrufezeichen: 14 Stellen in 1490 Feldern, alle in Zitaten oder Musterformulierungen —
die App ruft nie in eigener Stimme aus.

**Die Fehlersuche, Markierung für Markierung (21.09.2026, sechzehnte Runde).**

Die zwölf Fehlersuchtexte mit ihren 86 Markierungen waren strukturell gut abgesichert —
auffindbar, nicht doppelt, Verweis in eine Regel der passenden Kategorie —, aber nie
daraufhin gelesen, ob das, was rechts vom Pfeil steht, auch stimmt. Der Einstieg war eine
Messung: alle Korrekturen anwenden und den fertigen Text durch den Textcheck schicken.
Zwei Stellen blieben hängen, und beide waren echt.

- **Derselbe Fehler, zwei Schubladen.** „vorraus“ → „Voraus“ ist in zwei Texten markiert.
  kt01 ordnet es als Rechtschreibfehler ein und verweist auf `gross-subst` — genau wie das
  Prüfmuster x14. kt03 ordnete es als `form` ein und verwies auf `form-danken`, eine Regel
  übers Danken, die zur Schreibung nichts sagt. Nils wäre also beim Antippen in einem Text
  über Höflichkeit gelandet, und im Fehlerjournal hätte sich derselbe Fehler einmal unter
  Großschreibung und einmal unter „Wirkung und Ton“ einsortiert. Jetzt beide gleich.
  Nebenbei: `gross-subst` führte „im Voraus“ nur in der Liste der großgeschriebenen
  Wendungen, ohne ein Wort zum einfachen r — obwohl drei Stellen der App für genau diesen
  Fehler dorthin verweisen. Das steht jetzt dabei.
- **Rechts vom Pfeil stand die Falschform.** kt02 zeigte „selben → selben Verein
  (zusammen: demselben)“. Die Anzeige heißt „falsch → richtig“; rechts stand aber dasselbe
  falsche Wort, und die richtige Form nur in der Klammer. Der Fehler geht über zwei Wörter
  („aus dem selben“), die Markierung kann nur eines tragen — deshalb jetzt
  „demselben (zusammengeschrieben, das „dem“ davor entfällt)“. Die Regel `gram-derselbe`
  führt genau diesen Satz als Beispiel: „Wir kommen aus demselben Verein.“

**Zwei Prüfungen**, beide in `tests/suite.js` bei den Markierungsprüfungen: Ein mehrfach
markierter Fehler muss überall dieselbe Regel und Kategorie tragen; und rechts vom Pfeil
darf die Falschform nicht wiederkehren — ausgenommen `stil`, `form` und `satz`, wo das
ok-Feld von Haus aus ein Hinweis oder eine ganze Umschreibung ist, und ausgenommen die
reine Kommaergänzung („fragen“ → „fragen,“). Gegen den Stand davor sind beide rot, mit
genau diesen zwei Funden.

**Punkt 2 der Ideenliste ist damit zu.** Alle 17 Komma- und Zeichenregeln nennen eine
Quelle; die letzte ohne war `komma-aufzaehlung`. Beim Belegen kam eine Gegenausnahme
dazu, die dort fehlte: Steht die Paarformel selbst **in** einem Nebensatz, ist sie wieder
eine gewöhnliche Aufzählung ohne Komma — „Er weiß, dass er sowohl im Verein trainieren als
auch an der Uni Sport machen darf.“ Mit zwei verschieden formulierten Suchen belegt.

`npm run kalender` war für diese Runde nicht nötig: An Lernlogik, `NEU_GELERNT` und den
Fixtures hat sich nichts geändert.

**Ein Prüflauf, der ohne Änderung rot wird (21.09.2026, fünfzehnte Runde).**

`npm test` war am 16.09. grün und stand am 21.09. rot — ohne dass jemand etwas geändert
hätte. `tests/lernen.js`, Abschnitt J legte 40 Karten auf Fach 5 mit Fälligkeit heute+20,
die letzte Antwort also bei heute−15. `k20` steht mit dem 04.09. in `NEU_GELERNT`: Bis zum
19.09. lag heute−15 davor, `regelAenderungen()` setzte die Karte auf Fach 1 zurück, und die
Ansicht zeigte 39 statt 40. Danach nicht mehr. Die App war die ganze Zeit in Ordnung — der
Prüflauf hing am Kalender.

Auffällig war dabei die zweite Zusicherung desselben Abschnitts: Sie stand auf
„24 oder 25 sitzt sicher“. Dieselbe Falle hatte also schon einmal zugeschnappt, und
jemand hatte sie mit einer Toleranz umschifft, statt die Ursache zu beseitigen.

**Behoben, nicht umschifft.** Das Fixture zieht seine IDs jetzt aus dem Bestand und filtert
gegen `NEU_GELERNT`; beide Zahlen stehen wieder fest (40 und 25). Eine eigene Zusicherung
sagt, dass die Kartenmenge nicht am Kalender hängt — wer später eine ID nachträgt, die
kollidiert, liest den Grund, statt eine wackelnde Zahl zu sehen.

**Die Prüfung dazu ist neu und heißt `npm run kalender`.** `tests/setup.js` liest `DT_TAGE`
und verschiebt beide Uhren: die des Prüflaufs und die im jsdom-Fenster. Das Fenster hat
einen eigenen V8-Kontext mit eigenem `Date`, Node allein zu patchen reicht also nicht.
`tests/kalender.js` fährt suite, inhalt, unterwegs und lernen über sechs Versätze
(0, 1, 7, 40, 200, 400 Tage) — 24 Läufe, alle grün. Gegen die alte Fassung ist er bei
DT_TAGE=−10 grün und bei 0 rot, mit Exitcode 1; der Fehlerpfad ist also mitgeprüft.

Der Lauf dauert Minuten und gehört deshalb nicht in `npm test`, wohl aber vor jeden
Commit, der an der Lernlogik, an `NEU_GELERNT` oder an einem Fixture mit Fälligkeiten
rührt. Andere Fixtures greifen ebenfalls auf `k20` und `g05` zu (`K.aufgaben.slice(…)`,
`"k"+padStart`); sie halten heute, aber das weiß man erst seit diesem Durchlauf.

**Die 20 unbelegten Grammatik- und Satzregeln (16.09.2026, vierzehnte Runde).**

Punkt 1 der Ideenliste, der große Rest: 20 der 35 `gram-` und `satz-`Regeln nannten keine
Quelle. Zehn Prüfer haben je zwei davon Satz für Satz gegen Duden, grammis (IDS) und die
Gesellschaft für deutsche Sprache gelesen, jede Meldung danach von einem Gegenprüfer
angegriffen, dessen Auftrag war, sie zu **widerlegen**. Von zwölf Meldungen hielten vier.
Jede habe ich anschließend selbst mit zwei eigenen Suchen nachgeprüft, bevor etwas in die
Datei ging — bei einer zu Recht, dazu unten.

Drei der vier gehören zu **einer** Fehlerklasse: Die Regel zählt ihre Ausnahmen, und zählt
zu wenige.

- **sa02** sagte „mit einer Ausnahme" (doppelter Infinitiv). Beim irrealen Vergleich mit
  bloßem „als" steht das gebeugte Verb aber direkt hinter der Konjunktion, nicht am Ende:
  „Er tut, als wäre er der Trainer." Mit „als ob" bleibt es hinten. Beides ist richtig, der
  Konjunktiv bei bloßem „als" ist Pflicht. Das zeitliche und das vergleichende „als" in der
  Wortliste bleiben unberührt — der Gegenprüfer hat den Vorschlag des Melders an genau
  diesem Punkt zerlegt, und er hatte recht.
- **sa04** sagte „Eine Ausnahme, und nur diese" (Korrelat dann/so) und übersah `je … desto`,
  wo „desto" und der Komparativ die Position 1 füllen. Die App widersprach sich hier selbst:
  Genau dieser Satz steht als Übung k08 in der Datei.
- **sa13** sagte, das Kasussignal müsse „genau einmal" vorkommen. Bei mehreren Adjektiven
  ohne Artikel steht es zweimal: „bei gutem, warmem Wetter."
- **gram-kongruenz** kannte als Abweichung nur die Mengenangaben. Steht der
  Gleichsetzungsnominativ im Plural, folgt das Verb meist ihm, nicht dem Subjektkern:
  „Das Problem waren die fehlenden Bälle."

**Wo der Prüfagent danebenlag.** Er schlug für sa13 vor, die gleiche Endung sei „die
empfohlene Form". Meine dritte Suche zeigte etwas anderes: Der Duden hat seine frühere
Empfehlung zurückgenommen, die GfdS nennt beide Formen richtig und gibt ein inhaltliches
Kriterium — wechselnde Beugung, wenn das zweite Adjektiv mit dem Substantiv eine Einheit
bildet; gleiche Endung bei gleichrangigen Adjektiven. Genau so steht es jetzt da, ohne
Empfehlung. Die acht gefallenen Meldungen fielen meist am selben Grund wie im letzten
Durchgang: Die vermisste Einschränkung stand schon woanders im Bestand.

**Zwei Funde daneben, aus dem eigenen Lesen.** Die Karte sa18 schloss mit „Die Liste unten
rechts ist kurz. Wer diese sieben Dinge sichert …" — „unten rechts" beschreibt den
Spickzettel, nicht das Regelwerk, und „sieben" stimmte nur auf einer der beiden Seiten: Der
Spickzettel führte acht Punkte, weil er „mit was" statt „womit" mitzählte. Die Regel führt
es jetzt auch; der Positionsverweis und die Zahl sind weg.

**Zwei neue Prüfungen.** `tests/suite.js` lässt keine gezählte Ausnahme mehr durch
(„mit einer Ausnahme", „und nur diese", „genau einmal") — mit drei Positivproben, je eine
pro alter Fassung, und einer Gegenprobe für das hinweisende „nur diese" in komma-adjektive.
`tests/inhalt.js`, Abschnitt K prüft Spickzettel 8 und satz-sprechen gegen dieselben 15
Stichwörter. Beide sind gegen den Stand davor rot.

**„immer“ und „nie“ in den Grammatik- und Satzregeln (15.09.2026, dreizehnte Runde).**

Grundsatz 5 nennt „immer“, „nie“, „ausschließlich“ als Warnsignale; geprüft war bisher nur
der Superlativ. Die 22 Grammatik- und 13 Satzregeln samt ihrer 24 Satzkarten sind jetzt
daraufhin durchgesehen. Abgeschwächte Formen („fast immer“) und feste Fügungen („immer
wenn“, „wann immer“) zählen nicht. Übrig blieben fünf Behauptungen, drei davon halten:

- **sa07** sagte „Vor diesen Elementen steht ‚nicht‘ immer“ — stimmt nur, solange Ortsangabe,
  Adjektiv oder Präpositionalobjekt im Mittelfeld stehen. Vorangestellt bleibt „nicht“
  hinten: „Nach Köln fahre ich nicht.“ Die Karte nennt jetzt die Bedingung.
- **sa04** nannte den nachgestellten Nebensatz „immer leichter zu bauen“, **sa19**
  versprach, wer mit einem Hauptsatz beginne, könne ihn „immer beenden“. Beides jetzt
  abgeschwächt.
- Nicht geändert, weil belegt: „bei Themen immer Akkusativ“ und „vor bei der Zeit immer
  Dativ“ (gram-kasus, gram-wechsel, sa16) sowie „Nie trennbar: be-, ge-, er-, ver-, zer-,
  ent-, emp-, miss-“ (satz-klammer, sa08). Die fünf Stellen stehen mit Grund in der
  Ausnahmenliste von `tests/suite.js`, Abschnitt B — wie bei den Rangformeln.

**Dazu miss- richtiggestellt.** sa08 stellte den betonten Fall als den Normalfall dar. Der
Duden-Sprachratgeber „Konjugation von Verben mit der Vorsilbe miss-“ und die Gesellschaft
für deutsche Sprache sagen dasselbe: Meist ist die Vorsilbe unbetont und verhält sich wie
„ver-“ — <b>missachtet, zu missachten</b>. Nur wenn sie den Ton trägt (missverstehen,
missleiten), rutscht das „zu“ hinein: <b>misszuverstehen</b>. Getrennt wird das Verb in
keinem Fall. Zwei verschieden formulierte Suchen, beide Quellen unabhängig.

Der Absatz „Stand der Prüfung“ im Regelwerk trägt die drei Runden dieses Tages jetzt mit.

**Stil ist keine Regel — nachgesehen statt angenommen (15.09.2026, zwölfte Runde).**

Punkt 1 der Ideenliste fragte für die 17 `stil-` und 26 `form-`Regeln: Sind Empfehlungen
als Empfehlungen gekennzeichnet? Alle 43 sind jetzt daraufhin gelesen. Die `form-`Regeln
sind Ratgebertexte über Gespräche und Mails — sie urteilen nicht über Sprache, dort ist
nichts zu ändern. Bei den Stilregeln waren es vier Stellen:

- **stil-kollokation** sagte „Wer sie falsch kombiniert, klingt sofort schief“. Eine
  ungewohnte Kollokation ist meist kein Grammatikfehler; sie klingt schief. Genau das
  steht jetzt da.
- **stil-hedging** führte seine Empfehlung als „**Regel:** eine Absicherung pro Aussage“
  ein — jetzt „Faustregel“.
- **stil-genitivkette** behauptete, ab drei Genitiven verliere der Satz seine Struktur.
  Eine Schwelle ohne Quelle, und als Befund formuliert. Jetzt steht der Mechanismus da:
  ab dem dritten wird die Zuordnung mühsam, ein Fehler ist die Kette nicht.
- **stil-fuellwort** nennt jetzt ausdrücklich, was Grundsatz 3 mit diesen Wörtern als
  Beispiel meint: ein Fehler ist keines davon, es geht um Wirkung.

Die Prüfung dazu steht in `tests/suite.js`, Abschnitt B, neben der Rangbehauptungsprüfung.
Sie liest die Stilregeln satzweise: Ein Fehlerwort darf nur stehen, wenn der Satz es
verneint — oder wenn die Regel eine Quelle nennt, wie `stil-absolut` den Duden. Gegen den
Stand vor dieser Runde schlägt sie an, zwei Gegenproben halten sie davon ab, Verneinungen
und belegte Befunde zu melden.

**Der Spickzettel, Zelle für Zelle (15.09.2026, elfte Runde).**

CLAUDE.md, Abschnitt 7, Schritt 4 sagt: „Spickzettel prüfen: Er wiederholt Teile des
Bestands teils handgeschrieben.“ Genau das war nie systematisch geschehen. Alle zwölf
Abschnitte sind jetzt Zeile für Zeile gegen die Regel gelesen worden, aus der sie stammen.

- **wider / wieder.** Der Spickzettel führte „widerspiegeln“ als Beispiel für „wider =
  gegen“ — die Regel `recht-wider` führt es seit Langem als eine der drei Ausnahmen, in
  denen „wider“ nicht „gegen“, sondern „zurück“ heißt (widerspiegeln, Widerhall,
  Widerschein). Dieselbe falsche Zuordnung stand in der Erklärung des Prüfmusters **x15**.
  Beide sagen jetzt, was die Regel sagt; die Übung r17 war schon richtig.
- **ss / ß.** Der Spickzettel gab nur die Vokallänge an und führte ausgerechnet „dass“ als
  Beispiel — also genau das Wort, dessen Partner „das“ die Ausnahme ist. Die Regel
  `recht-sz` hängt die Entscheidung an drei Bedingungen: scharfes s, Vokallänge, und eine
  Handvoll kurzer Wörter mit einfachem s. Alle drei stehen jetzt auch im Spickzettel.
- **Apostroph vor -sch.** Nur „Newton'sche Gesetze“ stand da; die Regel nennt „newtonsche“
  ausdrücklich als ebenso richtig. Grundsatz 1: Varianten kennzeichnen.
- **Die Präpositionslisten.** Der Spickzettel zählt sie auf; die Regeln führen drei davon
  ausdrücklich als Sonderfälle (`bis` mit Artikel, `entlang` vorangestellt, `ab` ohne
  Artikel). Wer die Liste liest und den Vorbehalt nicht, schreibt „entlang den Fluss“.
  Die drei stehen jetzt als zweite Fußnote unter Abschnitt 2.

Die Prüfung dazu ist `tests/inhalt.js`, Abschnitt K. Sie hält je Spickzettelzeile fest, was
dort stehen muss und was dort nicht mehr stehen darf, plus die drei Sonderfälle als
Abschnittsprobe. Gegen den Stand vor dieser Runde schlägt sie an beiden Stellen an —
gegengeprüft, nicht angenommen.

**Wenn die Stufe etwas anderes sagt als die Regel dahinter (15.09.2026, zehnte Runde).**

Grundsatz 3 sagt: Stil ist keine Regel, und was Stil ist, darf nicht als „falsch“
herauskommen. Die App hat dafür vier Stufen — **hart** („Klarer Fehler“), **pruef** („Bitte
prüfen“), **stil**, **form** („Wirkung und Ton“) — und jede Regel hat eine Kategorie. Laufen
beide auseinander, sagt der Textcheck etwas anderes als das Regelwerk dahinter. Vier Paare
liefen auseinander:

- **a06** („faul“, „unmotiviert“, „unzuverlässig“) und **a07** („ich bin zu blöd“) standen
  auf **Bitte prüfen**. Beides ist tadelloses Deutsch; beanstandet wird die Wirkung auf den
  Leser. Sie stehen jetzt auf **Wirkung und Ton** — der Stufe, die dafür gemacht ist.
- **x24** („in 2026“) stand ebenfalls auf **Bitte prüfen**, obwohl es eine Übernahme aus
  dem Englischen ist und kein Fehler. Jetzt **Stil**.
- **x06** und **x07** (`einzigste`, `optimalste`) standen auf **hart** und zeigten auf eine
  Regel, die die Steigerung von Absolutadjektiven bloß „schief“ nannte. Hier hat die Regel
  nachgezogen, nicht das Muster: Der Duden führt „einzigste“ eigens unter den **häufigen
  Fehlern**, mit eigener Seite. Die Regel sagt das jetzt — und nennt zugleich die beiden
  Stellen, an denen die Steigerung vorkommt, ohne falsch zu sein: die Umgangssprache und der
  literarische Gebrauch (Goethe 1775: „Einzigstes, einzigstes Mädchen“).

`tests/suite.js` gleicht das jetzt bei jedem Lauf ab. Fünf Paare bleiben erlaubt und stehen
mit Begründung in der Liste — etwa das doppelte „würde“, das CLAUDE.md ausdrücklich als
Stilfrage führt, und „vor Kurzem/vor kurzem“, wo beide Schreibungen zulässig sind und der
Hinweis nur Einheitlichkeit anmahnt. Dazu zwei Gegenrichtungen: Der Abgleich muss ein
falsches Paar erkennen, und jede gelistete Ausnahme muss es noch geben — sonst verwaltet die
Liste Karteileichen.

**Ein Widerspruch, den es nicht gab — und was daraus zu lernen war (15.09.2026, neunte Runde).**

Beim Durchsehen der Kommaregeln stieß ich in `komma-adjektive` scheinbar auf einen groben
Fehler: Als Beispiel für **nicht** gleichrangige Adjektive stand dort „die neue, rote
Trainingsjacke“ — mit Komma, obwohl der Text daneben erklärt, dass genau dort keins
hingehört. Der Fehler lag bei mir: Im Quelltext steht `die neue<span class="nope">,</span>
rote Trainingsjacke`. Das Komma wird in Fehlerrot gezeigt und ist durchgestrichen gemeint.
Mein Lesewerkzeug warf die Klassen weg und machte aus der Warnung ein Vorbild.

Das ist eine Fehlerklasse, keine Ungeschicklichkeit: **In den Regelkörpern trägt die
Bedeutung nicht der Text, sondern die Klasse.** Also nachgesehen, ob die App selbst irgendwo
in dieselbe Falle läuft:

| Stelle | strippt? | zeigt den gestrippten Text? |
|---|---|---|
| Regelkörper im Regelwerk | nein, HTML bleibt | — |
| Suchindex (`buildIndex`) | ja | **nein** — der gestrippte Text dient nur dem Treffer, angezeigt werden Art, Titel und Untertitel |
| Vorlesen (`sprechFrage`, Erklärung nach der Antwort) | ja | gesprochen |

Der dritte Weg wäre der gefährliche, und dort ist es sauber: Kein Feld, das gesprochen wird
— Frage, Optionen, Erklärung, Wort- und Fallkarten — trägt eine solche Klasse. Das ist
jetzt festgehalten, mit Positivprobe und einer Gegenrichtung („die Regelkörper tragen die
Markierungen wirklich“, 73 Regeln), damit die Bedingung nicht stumm grün wird.

**Zwei Gegenproben waren zuerst ungültig, und das gehört dazu.** Die erste baute
`class='nope'` mit einfachen Anführungszeichen ein — das Muster sucht doppelte, also blieb
der Lauf grün, ohne etwas zu prüfen. Die zweite nahm doppelte, unescapet: Die schließen das
JS-String, der Skriptblock war kaputt, und `node tests/suite.js` gab **gar nichts** aus. Eine
Gegenprobe, die schweigt, ist kein Beweis — erst die dritte (`class=\"nope\"` escaped) machte
den Lauf rot und damit die Prüfung gültig. Nebenbei zeigt das eine zweite Schutzschicht:
Eine solche Markierung lässt sich in ein doppelt gequotetes Feld gar nicht unbemerkt
einbauen, `npm run syntax` fängt es.

**Und ein negatives Ergebnis, das eine Runde wert war:** Die App zitiert genau **eine**
Stelle des amtlichen Regelwerks (§ 73 in `komma-infinitiv`), und die stimmt für die Fassung
von 2024. Die übrigen Paragrafenzeichen im Bestand sind Beispiele für das Zeichen selbst
(„§ 5 mit Leerzeichen“), keine Verweise. Es gibt also keine veralteten Paragrafennummern,
die man nachziehen müsste.

**Die letzten vier offenen Meldungen, abgearbeitet (15.09.2026, achte Runde).**

`FUNDE-offen.md` ist für den Regellauf leer — alles nachgemessen, jede Sprachaussage mit
zwei verschieden formulierten Suchen belegt.

**`gram-zeiten` nannte nur eine von zwei üblichen Zeitformen.** „Das Präteritum für die
Beschreibung des eigenen Vorgehens“ — die Schreibratgeber führen für den Methodenteil
**Präteritum und Perfekt** nebeneinander. „Wir befragten 40 Sportstudierende“ und „Wir haben
40 Sportstudierende befragt“ sind beide üblich; worauf es ankommt, ist die Einheitlichkeit
innerhalb des Abschnitts. Genau das steht jetzt da — und ist für eine Hausarbeit der
nützlichere Hinweis als die Wahl selbst.

**Die Wortkarte „nachdem“ zeigte eine Zeitform, die dieselbe App zwei Regeln weiter
ablehnt.** Ihre Erklärung gab als Muster der standardsprachlichen Verwendung „nachdem er
ankam“ — ein Präteritum, während Regel und Übung m18 nach „nachdem“ das Plusquamperfekt
verlangen. Das Beispiel der Karte selbst („Nachdem er sich aufgewärmt hatte“) hatte es
richtig. Jetzt steht in beiden Feldern dieselbe Zeit.

**`gram-genalltag` verbot eine Form, die nur stilistisch schwächer ist.** Unter der
Überschrift „Wo der Genitiv nicht hingehört“ stand „Lenas Rad, nicht das Rad Lenas“. Der
nachgestellte Genitiv bei artikellosen Eigennamen ist aber nicht falsch — „das Werk
Beethovens“, „die Werke Goethes“ sind gehobene Schriftsprache. Beide Suchen sagen dasselbe:
möglich, aber stilistisch schwächer als die Voranstellung. Nach Grundsatz 3 gehört das damit
nicht in eine Verbotsliste. Der Punkt steht jetzt als das, was er ist — eine Frage der
Stellung, nicht des Falls.

**Und eine Lücke, auf die eine vage Meldung geführt hat.** Zu `n-quellen` hieß es nur
„andere Zählweisen?“. Beim Nachsehen fiel auf, dass die Regel zu **DIN 1421** nichts sagt:
In einer Gliederungsnummer gehört der Punkt nur *zwischen* die Stufen, nie ans Ende — „1
Einleitung“, „2.1 Methode“, „2.1.1 Stichprobe“. Für eine Hausarbeit ist das der Fall, der
täglich vorkommt. Steht jetzt drin, mit der ehrlichen Einschränkung: Viele
Institutsleitfäden schreiben trotzdem „1. Einleitung“, verbindlich ist die Vorgabe des
Instituts, und wichtig ist das Durchhalten einer Form.

**Der Superlativ ist dieselbe Falle wie „immer“ (15.09.2026, siebte Runde).**

`main` steht jetzt auf dem aktuellen Stand — dreizehn Commits, Vercel baut sie.

Aus dem Regellauf blieb eine Meldung offen, die nach demselben Muster gebaut war wie eine
schon behobene: `n-abkuerzung` behauptete „das ist der häufigste Fehler“, `gram-kongruenz`
hatte „der häufigste Verständlichkeitsfehler in Hausarbeiten“ gesagt. Zwei Fundstellen sind
kein Einzelfall, also erst die Klasse benennen und den ganzen Bestand absuchen.

**Fünfzehn Stellen tragen eine Rang- oder Häufigkeitsformel. Sieben davon waren
Behauptungen ohne Beleg:**

| Stelle | stand da | steht jetzt |
|---|---|---|
| `komma-nebensatz` | „Die wichtigste Kommaregel überhaupt“ | „Die Grundregel“ |
| `gram-ndekl` | „einer der häufigsten Fehler in Alltagstexten“ | „liest man oft: Das fehlende -n fällt beim Schreiben kaum auf, weil die Form im Nominativ ja stimmt“ |
| `form-kritik` + Übung f26 | „die größten Konfliktverstärker der deutschen Sprache“ | „verschärfen fast jeden Konflikt“ |
| `satz-konjunktiv` + `sa12` | „die wichtigste Höflichkeitsform überhaupt“ | „macht eine Bitte höflich, ohne dass du ein einziges Höflichkeitswort brauchst“ |
| `satz-reden` + `sa19` | „Der häufigste Fehler beim freien Sprechen“ | „Ein typischer Stolperer“ |
| `n-abkuerzung` | „das ist der häufigste Fehler“ | „es wird oft weggelassen“ |
| `z-auslassung` | „Die meisten Programme wandeln um“ | „Viele Programme“ |

Jedes Mal dasselbe Rezept: die Rangbehauptung durch den **Mechanismus** ersetzen. Der Rat
wird dadurch nicht schwächer, sondern konkreter — „das fehlende -n fällt beim Schreiben
kaum auf, weil die Form im Nominativ ja stimmt“ sagt Nils mehr als eine Häufigkeitsordnung.

**Die übrigen acht bleiben, mit Grund.** In `gross-subst` sind „das Beste“ und „die
meisten“ die Beispielwörter der Regel selbst; die `form`-Regeln sind Ratgebertexte, in
denen „die beste Investition“ ein Rat ist und kein Befund; „die meisten Verben sind
schwach“ ist eine Aussage über die Formenbildung. `tests/suite.js` führt sie als **gepflegte
Liste mit Begründung** — eine neue, nicht gelistete Rangformel macht den Lauf rot. Damit
wird der Superlativ zur bewussten Entscheidung statt zur Gewohnheit. Gegenprobe geführt: die
zurückgedrehte Fassung von `satz-reden` meldet zwei Stellen.

Geprüft wird die Stelle, nicht die Zahl der Formeln in ihr — wer in einer gelisteten Regel
eine zweite ergänzt, fällt nicht auf. Das ist der Preis dafür, dass eine Umformulierung des
Beispiels den Lauf nicht grundlos rot macht; es steht so auch im Kommentar.

**Die vier Funde, die der Gegenprobe standgehalten haben (15.09.2026, sechste Runde).**

Die adversarische Stufe des Regellaufs ist nachgeholt: 30 Funde, je zwei Gegner, **4 halten,
6 geteilt, 20 gefallen** — wobei die zwanzig fast ausnahmslos deshalb fielen, weil ich sie
während des Laufs schon behoben hatte. Die vier haltbaren habe ich nachgemessen und
eingebaut:

**`gram-genitiv` maß mit zwei Maßen.** Die Regel beruft sich für trotz, während und statt
auf die Variantengrammatik des IDS — und setzte „wegen“ dann ab: „Bei wegen dagegen gilt der
Dativ **überall** als umgangssprachlich.“ Dieselbe Quelle hat für „wegen“ eine eigene Seite:
geschrieben vor allem Liechtenstein, daneben Schweiz, Mittel- und Westösterreich,
Südwestdeutschland, Luxemburg — bei überall deutlich überwiegendem Genitiv. Wer für
„während“ die Variantengrammatik entscheiden lässt und für „wegen“ nicht, misst mit zwei
Maßen. Die Regel nennt jetzt beides: das Wörterbuchurteil (umgangssprachlich und
landschaftlich) **und** den Korpusbefund. Der Schlusssatz sagte „als Fehler abstempeln sollte
man den Dativ bei den ersten drei aber nicht“ — mit der Änderung zählt „die ersten drei“
nicht mehr, also steht dort jetzt „bei keinem der vier“. Und **x01 steht auf `pruef` statt
`hart`**, wie x02: Was die App selbst durchgehend „umgangssprachlich“ nennt, kann sie nicht
zugleich als „Klaren Fehler“ melden.

**`satz-perfekt` schloss ausgerechnet den Sportfall aus.** „Sobald ein Akkusativobjekt
dabeisteht, gilt haben“ — der Duden führt „einen Rekord, neue Bestzeit laufen“ ausdrücklich
mit **beiden** Hilfsverben: „Ich bin / habe einen neuen Rekord gelaufen.“ Für einen
Sportstudenten ist das nicht der Randfall, sondern der Alltag. Regel und Übung z12 sagen es
jetzt beide.

**`satz-modal` warf Pflicht und Schwankung in einen Topf.** „Das gilt genauso für sehen,
hören, lassen“ — genauso gilt es nur für lassen. Bei den Wahrnehmungsverben sehen, hören,
fühlen und helfen ist der Ersatzinfinitiv nach der Duden-Grammatik **nicht Pflicht**,
sondern die häufigere von zwei zulässigen Formen; „Ich habe ihn kommen gesehen“ ist korrekt,
nicht bloß alltagssprachlich. Pflicht ist er nur bei den Modalverben und bei „brauchen“.

Der vierte haltbare Fund (`gram-genalltag`, nachgestellter Genitiv bei Eigennamen) steht mit
Begründung in `FUNDE-offen.md` — niedriges Gewicht, und die Beleglage braucht mehr Sorgfalt,
als diese Runde noch hergab. Dort stehen auch die vier geteilten Funde.

**Drei Regeln, die sich im eigenen Text widersprochen haben (15.09.2026, fünfte Runde).**

**`recht-wider` führte „widerspiegeln“ als Musterbeispiel und als Ausnahme.** Zeile 1: „wider
= gegen: widersprechen, widerlegen, **widerspiegeln**, widerstehen …“. Drei Zeilen tiefer:
„Tückisch: **widerspiegeln**, Widerhall, Widerschein — hier heißt „wider“ nicht „gegen“,
sondern „zurück“ … Merk dir die drei als Ausnahmen.“ Ein Wort kann nicht beides sein. Die
Übung r17 wiederholte denselben Fehler. „widerspiegeln“ steht jetzt nur noch dort, wo es
hingehört — bei den Ausnahmen.

**`komma-aufzaehlung` machte im ersten Satz aus der Ausnahme eine Pauschale.** „Gleichrangige
Teile werden durch Komma getrennt — außer, es steht schon eine Konjunktion dazwischen.“ Zwei
Zeilen später steht in derselben Regel die richtige Unterscheidung: vor **und, oder, sowie**
kein Komma, vor **aber, sondern, doch, denn** sehr wohl — und das sind auch Konjunktionen.
Der Einleitungssatz sagt das jetzt und verweist auf beide Listen. Für Nils ist das keine
Kleinigkeit: Komma ist das erklärte Ziel der App.

**`gross-sprachen` nannte ein Merkmal, das nichts entscheidet.** „Folgt ein Substantiv oder
Partizip, steht dort das Adjektiv und bleibt klein: auf deutsch besetztem Gebiet.“ Zwei
Wörter vorher steht in derselben Regel das Gegenbeispiel: „in **Deutsch** abgefasst“ — groß,
und „abgefasst“ ist ein Partizip. Entscheidend ist nicht, was folgt, sondern worauf sich die
Präposition bezieht: Steht die Sprache selbst hinter auf oder in, ist sie ein Substantiv und
steht groß; bestimmt das Wort ein folgendes Adjektiv oder Partizip näher, ist es ein Adverb
und bleibt klein („das Dokument ist deutsch verfasst“). Das Prüfmuster x32 trug dasselbe
falsche Merkmal und ist mitgezogen.

**Zum Prüflauf selbst — ein Fehler im Skript, den es festzuhalten lohnt.** Die
Gegenprobe-Stufe hat nie gelaufen: Ich hatte `parallel([agent(...), agent(...)])`
geschrieben, also fertige Promises übergeben statt Funktionen. Der Lauf meldete das erst am
Ende, nach 43 Minuten — acht Berichte mit 21 Funden, null Urteile. Dass davon nichts
ungeprüft in die App kam, lag nur daran, dass ich ohnehin **jeden Fund selbst nachmesse und
jede Sprachaussage mit zwei verschieden formulierten Suchen belege**, bevor ich etwas
ändere. Die Stufe läuft jetzt nach; die Berichte kommen aus dem Zwischenspeicher.

**Zwei Präpositionen, bei denen die App Nils' eigene Form zur Ausnahme erklärt hat (15.09.2026, vierte Runde).**

**`ab` steht nicht immer mit dem Dativ.** Die Regel führte es kommentarlos unter den
Dativpräpositionen, die Fallkarte ebenso. Ohne Artikel schwankt der Fall aber, und
ausgerechnet der Akkusativ ist **in Deutschland** die verbreitete Form: „ab nächstem
Montag“ (Dativ, vom Duden empfohlen) und „ab nächsten Montag“ (Akkusativ) sind beide
richtig. Nur mit Artikel steht der Dativ fest — „ab dem ersten Mai“, und genau so fragt die
Fallkarte auch, der Ablenker bleibt also sicher falsch. Beide Stellen tragen die
Einschränkung jetzt, mit der Quelle: Variantengrammatik des IDS.

**„auf die Post“ ist nicht die Regel, sondern der Süden.** `gram-richtung` verteilte die
vier Richtungsangaben und gab Ämter und Einrichtungen an „auf“ — „auf die Post“, „auf die
Bank“. Der IDS führt dafür einen eigenen Artikel: „auf die Post“ ist im Süden und in
Österreich verbreitet, „zur Post“ in der Mitte und im Norden, **beides Standard**. Für Köln
ist „zur Post“ die normale Form; die Regel hätte Nils seine eigene Form abgewöhnt. Regel und
Fallkarte sagen es jetzt beide.

Beide Einordnungen stehen in der Variantentabelle von `tests/inhalt.js` und werden dort
gegen ein Auseinanderlaufen gehalten.

**Sechs Regeln, die eine Ausnahme verschwiegen — und eine Erklärung, die seitenverkehrt war (15.09.2026, dritte Runde).**

Weiter aus dem Prüflauf über die unbelegten Regeln, jeder Fund von mir nachgemessen und
jede Sprachaussage mit zwei verschieden formulierten Suchen belegt.

**Die Erklärung von z07 beschrieb die Umstellung verkehrt herum.** Die Aufgabe stellt „Ich
gebe dem Trainer den Ball“ gegen „Ich gebe den Ball dem Trainer“, und die Erklärung sagte:
die andere Reihenfolge „rückt den Ball nach hinten“. Dort steht der Ball aber **vorn**, nach
hinten rückt der Trainer. Wer die Erklärung las, merkte sich das Gegenteil dessen, was auf
dem Bildschirm stand. Kein Quellenfall — nur genau hinsehen.

**`satz-nebensatz` sagte zweimal „immer“, wo die App selbst die Ausnahme kennt.** Erstens:
„Nach einer unterordnenden Konjunktion steht das gebeugte Verb ganz am Schluss“ — beim
doppelten Infinitiv rückt es davor („…, weil ich nicht **habe** kommen können“), und genau
das steht seit jeher in `satz-modal`. Zweitens: „Steht der Nebensatz am Anfang, füllt er
Position 1 komplett aus. Direkt danach folgt das Verb.“ Das gilt nicht, wenn ein Korrelat
dazwischensteht: „Wenn du Zeit hast, **dann** ruf mich an“ — dann besetzt „dann“ Position 1.
Beide Ausnahmen stehen jetzt dabei.

**`satz-klammer` ließ Test und Liste im selben Absatz auseinanderlaufen.** Der Betonungstest
(„Liegt die Betonung auf der Vorsilbe, ist sie trennbar“) galt dort ohne Einschränkung —
zwei Zeilen darunter steht `miss-` unter „Nie trennbar“. Beides stimmt für sich, zusammen
nicht: „missverstehen“ trägt den Ton auf **miss** und bleibt ungetrennt. Der Duden führt das
Verb als unregelmäßig; nur das „zu“ rutscht hinein („misszuverstehen“). Der Test gilt jetzt
ausdrücklich für die Wechselvorsilben durch-, über-, um-, unter-, wider- — genau die, die
die Beispiele zeigen.

**`gram-plural` behandelte gleiche Fälle ungleich.** Bei „Schema“ standen alle drei
zugelassenen Formen da, bei „Lexikon“ nur eine — der Duden führt „Lexika, Lexiken“. Ebenso
bei „Level“: Duden schreibt „die Level[s]“, also beides. Beide Varianten stehen jetzt dabei,
die gebräuchlichere zuerst, wie es Grundsatz 1 verlangt.

**`gram-kongruenz` behauptete eine Rangfolge.** „Mehrdeutige Bezüge sind der häufigste
Verständlichkeitsfehler in Hausarbeiten“ — dafür gibt es keine Quelle, und der Rat wird
nicht schlechter ohne sie. Jetzt steht dort, was der Leser davon hat: Ein mehrdeutiger Bezug
zwingt zum Zurücklesen und fällt beim eigenen Text kaum auf.

**`gram-akkverben` stempelte „Ich rufe dir an“ ab.** In der Regel stand ein nacktes
„(nicht: dir)“ in der Klasse `.nope`, also in Fehlerrot — während dieselbe Form an sechs
anderen Stellen sauber eingeordnet ist („südwestdeutsch und schweizerisch verbreitet“). Die
Regel sagt es jetzt auch, und `tests/inhalt.js` bewacht alle sieben Stellen.

**Drei Regeln, die etwas Richtiges zu schmal gesagt haben (15.09.2026, zweite Runde).**

Ein Prüflauf über die 40 Regeln, die bisher keinen Quellenbezug tragen, läuft noch. Diese
drei habe ich selbst nachgemessen und mit je zwei verschieden formulierten Suchen belegt:

**`gram-konjunktiv` nannte nur den seltenen Grund für „würde“.** Da stand: „würde ist dann
berechtigt, wenn die eigene Form altertümlich klingt (hülfe, stürbe)“ — und sonst nichts.
Der Hauptgrund fehlte: Bei **allen schwachen Verben** fällt der Konjunktiv II mit dem
Indikativ Präteritum zusammen. „wenn er härter trainierte“ kann das Irreale meinen oder
schlicht die Vergangenheit; „trainieren würde“ macht es eindeutig. Dasselbe gilt bei starken
Verben auf i und ie in der wir- und sie-Form („wir riefen“, „sie gingen“). Der Duden-
Sprachratgeber führt genau diese beiden Fälle, den Zusammenfall zuerst. Weil die meisten
Verben schwach sind, ist der weggelassene Fall der häufigere. Regel und Übung m06 sagen es
jetzt beide.

**`gram-reflexiv` hatte „sich setzen“ in der falschen Liste.** Es stand unter „Nur
Akkusativ“ — aber „Ich setze **mir** ein Ziel“ ist Dativ, und das ist genau das Muster, das
dieselbe Regel drei Absätze weiter oben erklärt („Akkusativobjekt da → Reflexiv wird
Dativ“). Verschoben zu „Ich wasche mich / Ich wasche mir die Hände“, wo es hingehört.

**`gram-richtung` stempelte Nils' eigene Gegend ab.** Die Übung n09 führt „Ich gehe nach dem
Arzt“ als schlicht falsche Option, und weder Regel noch Erklärung sagten dazu etwas. Die
Fallkarte „zu (Richtung)“ ordnet dieselbe Form seit dem 13.09. sauber ein: im Ruhrgebiet, im
nördlichen Rheinland und in Ostfriesland die verbreitete Form, vom Duden als norddeutsch und
nicht standardsprachlich geführt. Köln liegt im nördlichen Rheinland. Regel und Übung sagen
das jetzt auch — die Antwort bleibt dieselbe, die Einordnung kommt dazu.

**Und ein Prüfmuster, das der eigenen Regel widersprach.** `gram-genitiv` sagt wörtlich: „als
Fehler abstempeln sollte man den Dativ bei den ersten drei aber nicht“ — gemeint sind trotz,
während und statt, für die die Variantengrammatik des IDS den Dativ als regionale
Standardvariante führt. Das Muster **x02** („trotz dem“) stand trotzdem auf `hart`, also
„Klarer Fehler“, mit einem kommentarlosen „trotz verlangt den Genitiv“ — während das
Schwestermuster x03 („während dem“) längst auf `pruef` steht und die Einordnung mitführt.
Dasselbe im Fehlersuchtext kt07. Beide tragen jetzt dieselbe Einordnung wie Regel, Fallkarte
und Übungen; x02 steht auf `pruef`.

`tests/inhalt.js` bewacht das jetzt mit: Die Tabelle der eingeordneten Varianten erreicht
Fehlersuchtexte nun genau („kt07:dem“ statt nur „dem“ — das Wort gibt es mehrfach).

**Die Trefferquote maß neben der Stelle — und zwei Muster, die daraus folgten (15.09.2026).**

Die Zahl „der Textcheck findet X von 86 markierten Fehlern“ wurde **positionsblind**
gezählt: Als gefunden galt ein markierter Fehler, sobald **irgendein** Treffer im selben
Text das markierte Wort enthielt. Bei kurzen Wörtern wie „das“, „den“ oder „wie“ ist das
schnell irgendwo erfüllt, und ein Treffer auf das eine „das“ zählte für das andere mit.
Jetzt muss der Treffer die markierte Stelle wirklich überlappen — bestimmt so, wie die App
sie selbst bestimmt (`korrErrIdx`: Text an Leerraum zerlegen, das n-te gleiche Token).

Interessanterweise war die alte Zählung nicht durchweg großzügiger: Sie verlangte, dass der
**Treffertext** das markierte Wort enthält, und das scheitert an Wortgrenzen auch dann, wenn
der Treffer genau richtig sitzt. 65 locker gegen 66 streng — zwei verschieden falsche Zahlen.

Mit der sauberen Messung ließ sich die Liste der wirklich ungefundenen Fehler lesen. 20 von
86, und zwei davon kamen doppelt vor — beide mit einer Ursache, die sich beheben ließ:

**x04 („größer wie“) verlangte, dass der Komparativ unmittelbar vor „wie“ steht.** Im
wirklichen Satz liegt fast immer ein Verb dazwischen: „hat sich schneller verbessert wie die
anderen“, „weniger Anweisungen bekam wie die vordere“ — beides aus den eigenen
Fehlersuchtexten. Der Abstand ist jetzt erlaubt, mit einer Bedingung: Direkt vor „wie“ muss
ein **kleingeschriebenes** Wort stehen. Ohne diese Bedingung fängt das Muster den
attributiven Gebrauch mit, und der ist richtig: „ein kleiner Fehler wie dieser“, „ein
schneller Läufer wie er“ — dort ist „kleiner“ kein Komparativ, sondern eine Adjektivendung.
Nebenbei fiel dabei das `i`-Flag: Mit ihm war `[a-zäöüß]` auch für Großbuchstaben erfüllt,
die Bedingung also wirkungslos. Das Muster schreibt die Fälle jetzt aus.

**x39 ist neu: „der selbe“ getrennt geschrieben.** Der Duden führt das als
Falschschreibung, und die App hatte dafür kein Muster — „aus dem selben Verein“ und „nochmal
das Selbe“ liefen beide durch. Die Verbotsseite ist hier die verschmolzene Präposition: „am
selben Tag“, „im selben Atemzug“, „zur selben Zeit“ sind **richtig**, weil der Artikel im
„am“ schon steckt. Das Muster kennt deshalb nur die ausgeschriebenen Artikel. Ebenfalls
draußen: „selber“ im Sinne von „selbst“.

Damit findet der Textcheck **70 von 86** statt 66 — und die Selbstauskunft der App steht
jetzt auf „etwa vier Fünftel“ statt „drei Viertel“, nachgerechnet wie gehabt.

Die Regel `gram-derselbe` kannte bisher nur die Bedeutung (derselbe gegen der gleiche), nicht
die Schreibung. Sie trägt sie jetzt samt Ausnahme und Quelle, dazu zwei neue Übungen: **m26**
(zusammen) und **m27** (die Ausnahme als Variantenaufgabe — „am selben Tag“ und „an
demselben Tag“ sind beide richtig). Alle vier Ebenen sagen dasselbe.

**Vier Muster, die nur eine Zeitform kannten — und was die Ausgangsmessung wirklich wert war (14.09.2026, vierte Runde).**

Die Runden davor sind Funden eines Prüflaufs nachgegangen. Diese hier kommt aus eigenem
Nachmessen: Von den Mustern, die auf keiner Falschform der App greifen, hatte der Lauf
sechs gar nicht angesehen. Vier davon hatten eine Lücke:

- **x22** („kosten + Akkusativ“) kannte nur das Präsens. „Das kostete mir das Letzte“ und
  „Die Karten kosten mir zu viel“ liefen durch. Dazu fehlte „ihnen“ — eindeutig Dativ und
  damit meldbar, anders als das mehrdeutige „uns“ und „euch“. „ihr“ bleibt bewusst draußen:
  „Das kostet ihr Geld“ ist ein Possessivpronomen, kein Dativobjekt.
- **f12** verlangte ein „es“ vor „tut mir leid“ — und verpasste damit den häufigsten Fall
  überhaupt, den Satzanfang ohne „es“: „Tut mir leid, falls ich störe.“ Jetzt greift es am
  Satzanfang, nach „es“ und nach „das“. Absichtlich nicht überall: Ohne diese Schranke
  meldet es „Ein großes tut mir leid, wenn das nicht klappt“.
- **a07** (Selbstabwertung) kannte zwei Adverbien. „Ich bin einfach zu dumm für das Thema“
  und „Ich bin wohl zu blöd dafür“ liefen durch. Die Adverbienliste ist jetzt länger, bleibt
  aber geschlossen — ein freies Füllwort hätte „Ich bin für dumm verkauft worden“ mitgefangen.
- **x03** („während + Genitiv“) kannte dem, den und einem, aber nicht diesem, jedem oder ein
  Possessivpronomen. „Während meinem Praktikum“ lief durch.

**Was die Ausgangszahl wert war.** Angefangen hat alles mit der Messung „17 von 100 Mustern
greifen auf keiner Falschform der App“. Nach allen vier Runden steht sie bei **18 von 100** —
sie hat sich also nicht verbessert, und das ist richtig so. Ein Muster steht auf dieser Liste
auch dann, wenn es tadellos arbeitet und die App diesen Fehler nur nirgends als Beispiel
zeigt: „Wiederspruch“ und „widergegeben“ kommen im Bestand schlicht nicht vor. Die Zahl war
eine **Spur, kein Urteil**. Was sie ersetzt hat, ist die Zielsatztabelle in `tests/suite.js`:
**163 Sätze**, für jedes reparierte Muster die Stellungen, die es fangen muss, und die
Nachbarformen, die still bleiben müssen. Drei Muster haben die Liste verlassen, weil sie jetzt
wirklich fangen, was die App zeigt — y10, s06 und s02.

**Ein Muster, das genau das Gegenteil seiner Aufgabe tat (14.09.2026, dritte Runde).**

**y10** sollte „wo“ als Relativpronomen finden — „der Mann, wo das gesagt hat“, die
Falschoption der eigenen Übung n35. Sein Regex verlangte `, wo` + ein Wort + finites Verb,
also **Verbzweitstellung**. Ein Relativsatz hat aber Verbletztstellung. Die einzigen Sätze,
auf die das passt, sind die mit einem echten lokalen „wo“ — und die sind richtig. Gemessen:

| Satz | vorher | jetzt |
|---|---|---|
| Die Halle, wo er ist, liegt am Rand. | **gemeldet** | still |
| Das ist der Ort, wo er war. | **gemeldet** | still |
| der Mann, wo das gesagt hat | still | **gemeldet** |
| Die Frau, wo im Verein arbeitet, heißt Meier. | still | **gemeldet** |

Der Prüflauf schlug vor, weiter an der Verbstellung zu drehen. Das geht nicht: Ob „wo“
richtig ist, hängt nicht am Satzbau, sondern am **Bezugswort**. Nach einem Ort ist es
richtig, nach einer Person regional. Der Anker liegt jetzt dort — Artikel oder Possessiv
plus ein Personenwort aus einer geschlossenen Liste (Mann, Frau, Trainer, Kollege, Leute …),
dann Komma, dann „wo“. Elf Verbotssätze bleiben still, darunter jedes lokale „wo“ und jeder
indirekte Fragesatz. Die Einordnung steht jetzt auch im Prüfmuster, nicht nur in Regel und
Übung: „In Süddeutschland und Teilen des Westens“.

**Drei weitere Muster am Satzanfang und in der Wortform:**

- **x37** („Mal“) verlangte einen Begleiter vor der Ordnungszahl. „Nächstes mal bringe ich
  die Pfeife mit“ fiel damit durch — und x38 sprang nicht ein, weil ihm „nächstes“ fehlt.
  Ohne Begleiter kommen jetzt nur nächste, letzte und vorige dazu: Bei gleiche und selbe
  hätte „Das Gleiche mal zwei“ einen Fehlalarm gegeben, denn beim Rechnen ist „mal“ klein.
- **x38** kannte „jedes mal“ und „dieses mal“, aber nicht „manches mal“ — obwohl die Regel
  „manches Mal“ ausdrücklich als richtige Form führt. Die Wendung fiel zwischen beide Muster.
- **x35** (Apostroph im Plural) griff nur nach bestimmtem Artikel oder Zahlwort. „Meine
  Foto’s“, „Unsere CD’s“, „Ein paar Foto’s“ liefen durch. Die Begleiter-Pflicht bleibt — sie
  ist es, die „Andrea’s Blumenladen“ und „Newton’sche Gesetze“ draußen hält.

**Und eine Zahl, die die App über sich selbst sagte und die nicht stimmte.** a04 versprach
„Über 30 Wörter in einem Satz“ und maß in Wirklichkeit **Zeichen**, 230 davon. Gemessen
kippt es bei 43 kurzen Wörtern und schon bei 18 langen Komposita — die Wortzahl war keine
Beschreibung, sondern eine Verwechslung. Die Erklärung nennt jetzt beide Enden, und
`tests/suite.js` rechnet sie nach.

**Vier Muster, die im Hauptsatz stumm waren — und eine Aussage, die so nicht stimmt (14.09.2026, zweite Runde).**

Dieselbe Fehlerklasse wie oben, aber eine andere Ursache: Vier Muster kannten ihren Zielfall
nur in **verbletzter Stellung** — Nebensatz, Infinitiv, Partizip. Im Hauptsatz rückt das
finite Verb an Position 2, vor das Nomen, und dort waren sie still. Sie verpassten damit die
Gegenbeispiele der App selbst:

- **s06** („Sinn machen“) fing „Die Argumentation macht Sinn“ aus dem Fehlersuchtext kt10
  nicht und auch nicht die falsche Option der Übung s08.
- **s02** (Streckverben) fing „Das Verfahren kam zur Anwendung“ nicht — die falsche Option
  der Übung s02, also das Gegenbeispiel zu genau der Regel, auf die es verweist.
- **y02** und **y11** (Komma bei Infinitivgruppen) hatten Zeichenklassen ohne
  Großbuchstaben. Deutsche Substantive sind groß, also blockte fast jeder echte Satz:
  „Er hat versucht den Ball zu treffen“, „Sie hat beschlossen das Training zu verschieben“,
  „Sie plant im Sommer umzuziehen“ — alle drei liefen durch. Dazu verlangte y02 ein
  eigenständiges „zu“, traf also nie ein trennbares Verb („durchzugehen“).

Der Textcheck findet damit **65 statt 64** der 86 markierten Fehler.

**Ein Vorschlag hat die Prüfung nicht überstanden, und das ist der Punkt.** Der Prüflauf
schlug für y02 vor, auch Großbuchstaben vor „um“ zuzulassen — dann fängt es „Er trainiert
jeden Morgen um seine Ausdauer zu verbessern“, die eigene Übung k01. Der Vorschlag kam mit
einer Risikoanalyse, die sauber aussah. Sie hatte nur das präpositionale „um“ nicht geprüft.
Gemessen an zehn Sätzen: **zehn Fehlalarme**, darunter „Wir haben den Termin um zehn Minuten
zu verschieben“, „Der Streit um die Halle zu schlichten war schwer“, „Er ist um die Ecke zu
finden“. Ein Substantiv vor „um“ ist beim finalen und beim präpositionalen „um“ gleich
häufig; das Muster kann beides an der Oberfläche nicht trennen. Also **nicht eingebaut** —
k01 bleibt ungefangen, und das steht hier, damit es niemand für ein Versehen hält.

**Eine Aussage, die die App an drei Stellen glatt behauptet hat.** „Sinn machen“ stand als
„Lehnübersetzung aus dem Englischen“ da — in der Übung s08, im Fehlersuchtext kt10 und im
Prüfmuster s06. Zwei verschieden formulierte Suchen zeigen: Der Duden führt „etwas macht
[k]einen Sinn“ als umgangssprachlich und setzt „nach englisch something makes sense“ dazu —
aber Peter Eisenberg hält dagegen, dass „machen“ mit abstraktem Objekt im Deutschen alt ist
(„das macht Freude“), und hält die Herleitung für unbelegt. Jetzt steht an allen vier
Stellen dasselbe: der Duden-Befund und der Vorbehalt. Die Empfehlung ändert sich nicht.

`tests/inhalt.js`, Abschnitt G kann das jetzt prüfen: Die Tabelle der eingeordneten
Varianten reichte bisher nur an Fallkarten und Übungen heran. `textVon()` erreicht jetzt
auch Prüfmuster, Regeln und die Markierungen der Fehlersuchtexte — also alle vier Ebenen,
die CLAUDE.md verlangt.

**Und der Textcheck sagt jetzt die Wahrheit über sich selbst.** Er behauptete, „etwa zwei
Drittel“ der eingebauten Fehler zu finden, während die Messung schon bei 74 Prozent lag.
Die Zahl war nicht falsch, nur zu bescheiden — und sie wandert mit jedem geschärften Muster
weiter weg. Jetzt steht dort „etwa drei Viertel“, und `tests/suite.js` rechnet nach: Der
genannte Bruch muss der Messung am nächsten liegen.

**Elf Prüfmuster, die ihren eigenen Zielfall verpasst haben (14.09.2026).**

Ausgangspunkt war eine Messung: 17 der 100 Textcheck-Muster greifen auf **keiner einzigen**
Falschform, die die App selbst zeigt. Ein Muster kann fehlerfrei laufen, syntaktisch heil
sein, keinen Fehlalarm auslösen — und den Fall, für den es gebaut wurde, in der häufigsten
Stellung trotzdem durchlassen. Das fällt nirgends auf: Der Textcheck meldet nichts, und der
Text sieht sauber aus.

Ein Prüflauf mit sechs Findern hat die Muster durchgemessen; jeden Fund habe ich selbst
nachgemessen, bevor etwas in die Datei kam, und jede Sprachaussage mit zwei verschieden
formulierten Suchen belegt. Sieben Muster waren zu eng:

| Muster | verpasste | Beleg |
|---|---|---|
| x34 | „widergegeben“, „widergesehen“, „widergekehrt“ | die Partizipien schieben ein ge ein, und Perfekt ist die Alltagsstellung dieser Verben |
| x15 | „Wiederspruch“ (Singular) | Duden führt dafür eine eigene Falschschreibungsseite; nur der Plural wurde gefangen |
| x33 | „ich erwiedere“ | die Alternativenliste kannte jede Form außer der ersten Person |
| x32 | „Auf gut deutsch …“ am Satzanfang | „auf\|in“ stand nur klein — das Muster verpasste genau das Beispiel aus seiner eigenen Erklärung |
| y05 | „Der gleiche Fehler …“ am Satzanfang | kein i-Flag, und der Artikel nur klein |
| t10 | „laufen - Krafttraining“ | beide Zeichenklassen nur Kleinbuchstaben, nach dem Gedankenstrich steht aber meist ein Substantiv |
| t14 | „Das war es....“ | das Muster kannte nur das Zeichen …, nicht die drei getippten Punkte |

Bei t10 kam eine zweite Änderung dazu: `\s` traf auch den Zeilenumbruch, deshalb meldete das
Muster jede Aufzählung mit Spiegelstrichen. Jetzt steht dort ein Leerzeichen.

**Und eine Fehlerklasse, die dabei aufgefallen ist und schlimmer war.** `\b` liegt in
JavaScript zwischen jedem Nicht-Wortzeichen und einem Wortzeichen — ä, ö, ü und ß gehören
nicht dazu. „Brüder“ endet für JavaScript also auf einer Wortgrenze plus „der“. Ein mit `\b`
verankertes Muster springt dort mitten im Wort an. Gemessen an vier Mustern:

- x23 (**hart**, n-Deklination) meldete „Grüße aus dem Süden Herr Meier war auch da“
- y05 meldete „Alle Brüder gleiche Chancen bekommen“
- a05 meldete „Die Räder Bosch des Vereins der Stadt“
- a10 meldete „Wir haben Lügengeschichten gehabt“
- f12 meldete „Ein großes tut mir leid, wenn …“

Und weil `analyse()` den Treffer auf ganze Wörter dehnt, stand am Ende „Süden Herr“ ange-
strichen da. Alle fünf tragen jetzt `(?<![\wäöüßÄÖÜ])` statt `\b`.

**Zwei neue Prüfungen, beide gegengeprobt.** `tests/suite.js` sucht die Paarung jetzt
selbst: jede mit `\b` verankerte ASCII-Alternative gegen jedes Wort mit Umlaut aus dem
eigenen Bestand (857 Wörter). Dazu eine Tabelle mit 55 Sätzen — was jedes reparierte Muster
fangen muss und was in seiner Nähe liegt und still bleiben muss. Die Verbotsseite ist die
teurere: Bei x34 sind es die trennbaren wider-Verben, deren Partizip ein ge einschiebt und
dabei korrekt ist („hat sich widergespiegelt“, „hat widergehallt“). Wer die Lücke mit einem
breiten `/widerge/` schlösse, meldete diese Formen als harten Fehler und widerspräche dem
eigenen Regeltext.

**Der Agent hat wieder selbst geschrieben — und diesmal nach dem Abbruch.** Derselbe Vorfall
wie am 13.09., mit einer neuen Wendung: Ich hatte den Lauf gestoppt, danach committet und
gepusht, und **90 Sekunden nach dem Commit** stand eine Änderung in `Deutsch-Trainer.html`,
die ich nicht geschrieben hatte (ausgerechnet der x33-Fund). Gelandet ist wieder nichts —
`git show HEAD:Deutsch-Trainer.html` war sauber, die Arbeitskopie zurückgesetzt, die Änderung
später selbst geschrieben und selbst belegt. Die Lehre steht in CLAUDE.md: Ein sauberer
`git status` vor dem Abbruch sagt nichts; nach einem Agentenlauf noch einmal nachsehen.

**Der lange Horizont — und was die Simulation vorher gar nicht gemessen hat (14.09.2026).**

Abschnitt H von `tests/lernen.js` stellte den Lernstand Tag für Tag zurück, aber nur die
**Fälligkeit** (`d`), nicht das **Datum der letzten Antwort** (`l`). Genau daran hängt die
Sperre „höchstens ein Aufstieg am Tag“ in `grade()`. Ohne zurückgestelltes `l` greift sie
für immer: keine Karte verlässt Fach 2, fast alles bleibt dauerhaft fällig, und neuer Stoff
kommt nie an die Reihe. Der Lauf hat also 60 Tage lang eine Welt gemessen, die es nicht
gibt — 76 gesehene Karten statt 159, alles in den Fächern 1 und 2.

Behoben, und mit einer Prüfung abgesichert, die den Rückfall fängt: Die Karten müssen sich
nach 60 Tagen über **mindestens vier Fächer** verteilen (gemessen 1:14 2:22 3:30 4:39 5:54).

Derselbe Fehler steckte in meinem Messskript für die Jahresabdeckung und hat dort 77 statt
269 Karten gemeldet — er ist leicht zu machen und unauffällig, weil nichts abstürzt.

**Neu: Abschnitt L · Der lange Horizont.** Abschnitt C läuft zwar über 180 Tage und meldet
„alle Karten kommen dran“, aber mit einer **eigenen, vereinfachten Nachbildung** der
Auswahl. Die kennt weder die Drosselung neuen Stoffs bei Rückstand noch `quotenMix()` noch
die Tagessperre — sie kann gar nichts anderes melden als volle Abdeckung. Abschnitt L
treibt stattdessen `buildDaily()` und `unterwegsRunde()` der App selbst. Gemessen:

| Weg | Tag 30 | Tag 90 | Tag 120 | Tag 180 |
|---|---|---|---|---|
| nur „Heute“ | 117 | 193 | 227 | — |
| „Heute“ + eine Runde | ~236 | ~423 | ~480 | ~555 |
| „Heute“ + zwei Runden | ~378 | ~668 | **699** | — |

Von 699 Karten. Die Kurve flacht ab, bleibt aber nicht stehen — mit einer Runde am Tag
kommen zwischen Tag 150 und 180 noch rund 40 Karten neu dazu. Und sie sagt etwas
Praktisches: **Eine Runde am Tag holt den Bestand nicht durch, zwei schon** — in vier
Monaten. Das ist keine Schwäche der Auswahl, sondern der Vorrang der Wiederholung; es steht
jetzt als Zahl da, damit es niemand für einen Fehler hält.

Die Zahlen schwanken von Lauf zu Lauf um ein paar Karten, weil `unterwegsRunde()` mit
`rng(Date.now())` mischt. Die Schranken lassen entsprechend Luft.

**Eine Vermutung, die die Messung kassiert hat.** Ich hatte in den Kommentar geschrieben,
Stufe 3 von `unterwegsRunde()` („das am längsten nicht Geübte“) sei es, die die letzten
Karten hereinholt. Abgeklemmt gemessen stimmt das nicht: **Stufe 2 und Stufe 3 vertreten
einander.** Jede der beiden schafft die volle Abdeckung auch allein; erst wenn beide fehlen,
bleibt es bei 487 von 699. Die Redundanz war mir vorher nicht bewusst — und der Satz stand
schon fast im Repo.

**Fallkarten-Ablenker und die Einordnung regionaler Varianten (13.09.2026, dritte Runde).**

Ausgangspunkt war eine Messung: `tests/fallform.js` konnte **50 der 173 Ablenker gar nicht
beurteilen**, weil die richtige Option ein Substantiv trägt („des Vortrags“) oder die Form
mehrdeutig ist („den“). Ausgerechnet bei den Genitivpräpositionen wurde also nicht geprüft.

Zwei Antworten darauf, eine maschinelle und eine inhaltliche.

**Maschinell:** Der Prüflauf vergleicht jetzt auch über den **Wortstamm** — gleiche
Wortzahl, je ein Träger, Rest derselbe Stamm. Damit sind **150 statt 123** Fassungen
entscheidbar. Kein neuer Fund darunter; „zwischen#1“ bleibt zu Recht mehrdeutig.

**Inhaltlich:** Ein Durchgang mit neun Prüfern über die 50 offenen Ablenker, jeder Fund von
zwei Gegnern angegriffen. **Neun Funde**, alle behoben, jeder vorher von mir selbst mit zwei
verschieden formulierten Suchen nachgeprüft:

- **Drei Ablenker waren nicht sicher falsch.** „unter“ fragte „Ich *schiebe* die Kiste unter
  ___ Tisch“ — „schieben“ lässt auch eine Ortslesart zu, und die acht Geschwisterkarten
  benutzen alle ein Zielverb aus dem eigenen Verbtest. „hängen — wo“ fragte „an ___ Haken“,
  und „an den Haken“ ist ein gültiger Dativ Plural. „mittels einem Test“ führt der Duden als
  seltene Nebenform.
- **Sechs Karten ordneten eine Variante nicht ein** oder taten es uneinheitlich. Die
  Fallkarte „trotz“ sagte „In Österreich“, die Übung d17 „landschaftlich und in der
  Schweiz“ — zwei Landkarten für dieselbe Form. „während“ und „statt“ sagten gar nichts,
  „wegen“ dagegen an fünf Stellen dasselbe. Dazu „zwecks“ und „seitens“ (Amtsdeutsch),
  „gedenken“ und „zu (Richtung)“ („nach Aldi“).

Nachgezogen wurden dabei auch die Übungen d17, d18 und m03 und die Regel `gram-genitiv` —
alle vier Ebenen sagen jetzt dasselbe. Festgehalten in `tests/inhalt.js`, Abschnitt G: zu
jeder Variante steht, welche Stellen sie einordnen und welche Wörter dort stehen müssen.

**Eine Warnung fürs Verfahren.** Ein Agent des Laufs hat seinen Vorschlag *selbst in die
Datei geschrieben*, obwohl der Auftrag „melden“ lautete — samt einer Zahl („447
Korpusbelege“), die niemand nachgeprüft hatte. Gelandet ist davon nichts, weil ich vor dem
Commit den Diff gelesen habe; in keinem eingecheckten Stand steht Agententext. Seitdem in
CLAUDE.md unter „Fallen“: nach einem Agentenlauf nie `git add -A`, ohne den Diff zu lesen.

Ein Gegenprüfer lag inhaltlich falsch, und das ist es wert, hier zu stehen: Er hielt den
`mittels`-Fund für erfunden, weil das „selten“ im Duden-Eintrag am Genitiv hänge. Eine
dritte Suche zeigte, dass der Eintrag **zwei** „selten“-Sätze enthält und beide recht
haben. Gegenprüfung ersetzt das eigene Nachschlagen nicht.

**Außerdem in dieser Runde:** `q12` (Uhrzeit) ist geklärt — der Duden lässt Punkt und
Doppelpunkt zu, die App hatte die Zuordnung falsch herum; Regel, Übung und Spickzettel
nachgezogen, `NEU_GELERNT` gesetzt. Und der dritte Prüfkorpus in `tests/suite.js` war
in Wahrheit leer: Er verwarf jeden Fehlersuchtext, sobald eine Markierung mehrteilig
ersetzt — was auf alle zwölf zutrifft. Jetzt satzweise gerettet, 55 Sätze.

**Ablenkerlauf über alle 379 Übungen — abgeschlossen (13.09.2026).** 17 Prüfer, eine
Frage: Ist jede als falsch markierte Option auch *sicher* falsch? 14 Funde, je zwei
Gegenprüfer, 45 Agenten, kein Fehler. **1 hält, 2 geteilt, 11 fallen.** Die drei, die nicht
durchfielen, hatte ich unabhängig schon behoben — die Gegenprüfer haben zwei davon prompt
mit „steht so nicht mehr in der Datei“ widerlegt, was für die Gegenprüfung spricht: Sie
liest den Bestand, nicht den Vorschlag. Der eine echt geteilte Fund (`q12`, Uhrzeit mit
Punkt oder Doppelpunkt) ist inzwischen geklärt und behoben: Zwei eigene Suchen bestätigen
den Quellen-Gegenprüfer — der Duden lässt Punkt und Doppelpunkt nebeneinander zu,
festgelegt ist nur DIN 5008, und zwar auf den Doppelpunkt. Die alte Zuordnung stand also
falsch herum. Regel, Übung, Spickzettel nachgezogen; die Übung hat jetzt die Bauform der
anderen Variantenaufgaben und steht wegen der geänderten Antwort in `NEU_GELERNT`.

**Textcheck und Aufgabenlogik nachgeschärft (13.09.2026, zweite Runde).** Fünf Änderungen,
jede mit eigener Prüfung.

- **Zwei Aufgaben hatten zwei richtige Antworten.** `k29` zeigte beide Fassungen von „Von der
  Hitze erschöpft(,) brach sie das Training ab.“ und fragte „Welche Variante ist richtig?“ —
  beide sind richtig, das Komma bei vorangestellten Partizipgruppen ist auch nach dem
  Regelwerk 2024 freigestellt. `m19` stellte „hat“ und „haben“ nach „eine Reihe von“
  gegenüber und fragte „Was ist korrekt?“ — beides ist korrekt. Beide fragen jetzt nach dem
  strittigen Punkt und bieten Ausschlussbehauptungen an („Nur mit Komma ist richtig“), so wie
  die anderen dreizehn Aufgaben dieser Bauart es schon taten. `tests/inhalt.js`, Abschnitt E,
  hält das fest: Neben einer Sammelantwort muss jeder Ablenker Ausschließlichkeit behaupten,
  statt eine Form vorzuführen.

- **JavaScripts `\b` kennt keine Umlaute.** In „überlegen“ liegt zwischen ü und b eine
  Wortgrenze — das Kommamuster `y01` traf erst ab dem b, und der Textcheck unterstrich
  „berlegen ob“. `analyse()` dehnt Treffer jetzt über `\p{L}` auf ganze Wörter; das wirkt für
  alle Muster auf einmal und kann nur mehr markieren, nie etwas Neues melden. `y01` selbst
  bekam zusätzlich `(?<![A-Za-zÄÖÜäöüß])`, damit die Ausschlussliste nicht auf einen
  Wortrest angewandt wird. Geprüft an 2200 echten Texten der App.

- **„Mal oder mal?“ fehlte ganz** — keine Regel, keine Übung, kein Muster, obwohl „beim
  nächsten mal“ ein Klassiker ist. Neu: Regel `gross-mal`, die Übungen `g31` bis `g33`, eine
  Spickzettel-Zeile und die Muster `x36` (im großen und ganzen), `x37` (Artikel + Adjektiv +
  klein geschriebenes mal), `x38` (jedes mal, jedesmal, dieses mal). `x28` greift jetzt auch
  bei mehreren Verstärkern — „tut mir wirklich unglaublich Leid“ lief vorher durch.

- **`y09` (das/dass) kannte „meine“, aber nicht „meinte“** und „zeigt“, aber nicht „zeigen“.
  Jetzt beide Bauformen, dazu „Dabei wurde deutlich, das die …“. Die Folgerliste verlor dafür
  die Dativformen: „Ich sage das dem Trainer“ ist richtig und hatte einen Fehlalarm ausgelöst.

- **Die Vorbildtexte der Schreibwerkstatt sind jetzt Prüfkorpus.** Die 319 Bausteine,
  Gegenüberstellungen, Situationen, Schreibaufträge und korrigierten Fehlersuchtexte dürfen
  kein Muster der Stufe „prüfen“ auslösen — ein Baustein, den Nils abschreiben soll, darf
  ihm keinen Zweifel anzeigen. Das ist zugleich das Netz gegen zu weit gefasste Kommamuster.
  Auf den 529 Beispielen der Regeln darf ein Prüfhinweis nur dort stehen, wo er zur Regel
  selbst gehört.

**Trefferquote des Textchecks** auf den zwölf Fehlersuchtexten: 52 → 64 von 86 (74 %). Die
Untergrenze in `tests/suite.js` steht auf 60.

**Eine Einschränkung für die nächste Runde:** Das Suchkontingent dieser Sitzung ist
aufgebraucht (200 von 200). Alles oben ist vor dem Aufbrauchen belegt worden, jeweils mit
zwei verschieden formulierten Suchen. Ein Fund blieb deshalb liegen: ein Prüfmuster für
„dem selben“ statt „demselben“. Die Falle dabei ist, dass „am selben Tag“, „im selben
Moment“, „zur selben Zeit“ mit verschmolzener Präposition korrekt sind — das gehört belegt,
bevor ein hartes Muster entsteht. Die Regel `gram-derselbe` sagt bisher nur etwas zur
Bedeutung, nichts zur Schreibung.

**Inhaltliche Prüfung mit Quellen — abgeschlossen (13.09.2026).** Der Nachlauf hat die 55
Gegenprüfungen nachgeholt, die ins Wochenlimit gelaufen waren: **146 Agenten, kein Fehler.**
Endstand der 49 Funde: **13 halten, 36 fallen, 0 ungeprüft.**

Die fünf, die ich vorgestern eingebaut hatte, stehen jetzt unter „widerlegt“ — mit der
Begründung „steht so nicht mehr in der App“, teils samt Commit-Hash. Das ist der richtige
Ausgang und ein gutes Zeichen für die Gegenprüfung: Sie liest den Bestand, nicht den
Vorschlag.

Vor jedem Einbau habe ich die Quellenaussage selbst mit zwei verschieden formulierten
Suchen nachgeprüft — vielen Gegenprüfern war das Suchkontingent ausgegangen, sie konnten nur
den Bestand angreifen und haben das auch offen dazugeschrieben.

**Die dreizehn, nach Gewicht:**

*Falsche Aussagen:*
- **`x21` meldete „uns“ und „euch“ als klaren Fehler.** Beide lauten im Dativ und im
  Akkusativ gleich — „Das interessiert uns sehr“ ist einwandfrei und wurde mit einem
  Hinweis angezeigt, der den Akkusativ verlangt, der schon dasteht. `x22` dasselbe eine
  Stufe milder. `x20` nimmt die beiden Formen aus demselben Grund längst heraus.
- **`satz-perfekt` ließ eine ganze sein-Gruppe aus.** Drei Gruppen, und „mit haben stehen
  alle anderen“ — damit fehlten *geschehen, passieren, gelingen, misslingen, begegnen,
  folgen*. Wer der Regel folgt, landet bei „das hat passiert“. Die Fallkarte `begegnen`
  sagte längst „Perfekt mit sein“.
- **`d05` behauptete einen Dativ, den es nicht gibt.** „Mit Dativ nur in der Wendung ‚Das
  trifft sich gut‘“ — dort ist „sich“ Akkusativ, wie in „wir treffen uns“.
- **Die Fallkarte `dank` belegte ihre eigene Aussage nicht.** „Im Plural meist Genitiv:
  ‚dank guter Vorbereitung‘“ — das ist Singular, und im Femininum sind Dativ und Genitiv
  ohnehin formgleich. Jetzt „dank neuer Regeln“ mit dem Dativ danebengestellt; die Aussage
  selbst bestätigt grammis.

*Zu absolute Aussagen:*
- **`s06`**: „Passiv ist **nur** sinnvoll, wenn der Handelnde unwichtig oder unbekannt ist“
  — schneidet die zweite Aufgabe des Passivs ab, das Betroffene zum Thema zu machen. Der
  Beispielsatz der Übung nennt den Handelnden ja selbst.
- **`form-anrede`**: „Nach dem Anredekomma geht es klein weiter“, ohne Einschränkung. Groß
  bleiben Nomen, Namen und Sie/Ihre — die App weiß das in `komma-brief`, `k14` und `f05`,
  nur hier fehlte es. Wortlaut von dort übernommen.
- **`komma-nebensatz` + `k27`**: „erst bei längeren Einleitungen steht es **fest**“ — der
  Duden schreibt „sollte man ein Komma setzen“. Beide Stellen angeglichen.
- **`form-grussformel`**: „Mit freundlichen Grüßen … **nie falsch**“ — bei einem
  Kondolenzschreiben eben doch.
- **`n16`**: „**Alles** außer dem Nominativ Singular endet auf -en“ — für das im selben Satz
  genannte *Herr* ergibt das „dem Herren“ statt „dem Herrn“. Dazu „-at“ ohne den Zusatz
  *Personen*bezeichnungen, was den Salat und das Referat mitnimmt.

*Fehlende Varianten:*
- **`getrennt-verb`**: Bei *gut gehen, sitzen bleiben, stehen lassen, liegen lassen* führt
  der Duden die getrennte Form als Stichwort, die App nannte die Zusammenschreibung zuerst —
  und weil im selben Satz „der Duden empfiehlt hier die Zusammenschreibung“ für
  *kennenlernen* steht, liest sich die Reihenfolge als Empfehlung. Umgedreht.
- **`recht-bindestrich`**: „80er-Jahre“ ist die Duden-Empfehlung, „80er Jahre“ aber ebenfalls
  zulässig.
- **Fallkarte `liegen — wo`** nannte nur „hat gelegen“, während die Schwesterkarten *stehen*
  und *sitzen* die süddeutsche Variante führen und die Regel `satz-perfekt` alle drei
  ausdrücklich als „beides gilt“ aufzählt.

**Statt Einzelfix eine Prüfung** (CLAUDE.md §5): Kein Muster mit `r:"gram-akkverben"` darf
eine Form aufzählen, die laut `tests/formen.js` selbst Akkusativ sein kann. Geprüft wird
gegen dieselbe unabhängig aufgestellte Formentabelle, mit der auch die Fallkarten geprüft
werden; gegen die alte Fassung fällt sie mit „x21: uns · x21: euch · x22: uns · x22: euch“
durch.

**Zwei Dinge, die der Lauf nebenbei über das Projekt gezeigt hat:**

Der Prüflauf hat mich bei m21 erwischt: Ich hatte „die zweite Fassung“ geschrieben — ein
Positionsverweis, und Antworten werden gemischt. Genau dafür steht die Prüfung da.

Und `VARIANTE` (der Detektor für die Markierung ◆ Varianten) sucht nach **Wortfolgen**. Aus
„(Duden empfiehlt zusammen)“ wurde bei mir „hier empfiehlt der Duden …“ — und die Markierung
war weg, ohne dass etwas rot wurde. Wer einen Variantensatz umformuliert, prüft danach
`hatVarianten()`.

**Alle drei offenen Punkte aus `FUNDE-offen.md` sind entschieden** (`gross-subst`, `m10`,
`m21`). Die Datei ist neu geschrieben: Stand, die dreizehn eingebauten Funde und die 36
verworfenen mit Begründung, damit ein späterer Lauf sie nicht noch einmal meldet.

Abschluss: Rundgang im Browser bei 393×852 über alle sieben Reiter und eine volle
Unterwegs-Runde — keine Seitenfehler, kein Seitwärts-Scrollen, Runde sauber zu Ende.

**Inhaltliche Prüfung mit Quellen — erster Teil (13.09.2026).** Die Websuche ist wieder
verfügbar, und damit die Arbeit möglich, auf die `FUNDE-offen.md` gewartet hat. 51 Prüfer
sind über Regeln, Übungen, Fall- und Wortkarten, Prüfmuster und Spickzettel gegangen, jeder
mit eigener Recherche; **49 Funde** kamen zurück, jeder danach von zwei Gegnern angegriffen
(einer die Beleglage, einer den Bestand).

Eine Einschränkung vorweg, die in den Gegenprüfungen selbst steht: Bei den meisten war das
Suchkontingent der Sitzung schon aufgebraucht, sie konnten die Quellenlage also nicht
unabhängig nachschlagen und haben stattdessen den Bestand angegriffen. **Die fünf Funde
unten habe ich deshalb selbst nachrecherchiert**, bevor ich etwas geändert habe — mit je
zwei verschieden formulierten Suchen.

**1 · `recht-apostroph` machte aus einer freigestellten Schreibung eine Pflicht.** Da stand:
„Vor einem angehängten ’s gehört der Apostroph hin, sonst liest es sich schwer.“ Der Duden
führt bei enklitischem „es“ **beide** Schreibungen und hält den Apostroph dort meist für
entbehrlich — sein Sprachratgeber zeigt „Wenns (also: Wenn’s) weiter nichts ist“ und „Mir
gehts gut“. Die Begründung der App sagte also das Gegenteil dessen, was die Quelle zu genau
diesen Formen feststellt. Jetzt freigestellt, mit der Bedingung statt eines Urteils. Vier
weitere Stellen mitgezogen (`z-schraeg`, Spickzettel, die Hinweise von `x19` und `x35`),
damit die App überall dasselbe sagt. Die Regel trägt dadurch automatisch die Markierung
**◆ Varianten**.

**2 · `m10` wertete eine gültige Wörterbuchform als falsch.** „Themata“ stand als
Falschantwort, die eigene Erklärung nannte es „Nebenform … ungebräuchlich“ — eine Nebenform
ist aber keine Fehlform. Der Duden führt sie weiterhin als Plural, markiert als
*bildungssprachlich veraltend*. Grundsatz 2 verletzt. Die Frage heißt jetzt „Welcher Plural
ist heute der gebräuchliche?“, die richtige Antwort bleibt „Themen“. **Damit ist der dritte
der drei offenen Punkte aus `FUNDE-offen.md` entschieden.**

**3 · `r11` stellte eine Frage ohne Zusammenhang.** „Was stimmt? — Sie war anscheinend krank
/ Sie war scheinbar krank.“ Ohne Kontext ist der Ablenker ein korrekter Satz, und zwar in
genau der Bedeutung, die die App selbst lehrt. Die Frage nennt jetzt die Situation („Sie hat
blass ausgesehen und beim Training gefehlt“), und die Erklärung sagt ausdrücklich, was der
Ablenker bedeuten *würde*, statt ihn als Unwort hinzustellen.

**4 · „Bei Zeitangaben immer Dativ“ stimmt für die Wechselpräpositionen nicht.** „über das
Wochenende“, „auf zwei Jahre befristet“ — beides Akkusativ, formal eindeutig, ohne jede
Quelle entscheidbar. Der Satz war aus zwei Fallkartennotizen zusammengesetzt, die einzeln
richtig sind („über“ bei Themen, „vor“ bei Zeitangaben), als Regel über alle neun aber
falsch. Regel und Spickzettel angeglichen; die Fallkarten selbst bleiben, sie sind korrekt.

**5 · `gram-verbformen` gab ein Muster aus, das seine eigenen Beispiele widerlegen.** „Die
starke Form ist fast immer die ohne Objekt“ — bei `schleifen` und `bewegen` entscheidet aber
die Bedeutung, nicht das Objekt, und beide starken Formen stehen mit Objekt („das Messer
geschliffen“, „das bewog ihn“). Wer das Muster anwendet, bildet genau die Fehler, die die
Regel verhindern soll. Jetzt nach Verbpaaren getrennt.

**Dazu eine Abschwächung ohne Fund:** Der Aufzählungspunkt in `gross-subst` sagte „das meiste
bleiben klein“. Die Gegenprüfung hat den Fund zu Recht kassiert — zwei Zeilen später steht
die Einschränkung bereits, generalisiert über „Zahladjektive“. Die *offene Frage* aus
`FUNDE-offen.md` ist damit aber beantwortet: Groß ist zulässig, wenn das Substantivische
betont wird (§ 58 E4; Duden führt „das meiste oder Meiste ist bekannt“). Also ein Wort
eingefügt statt umgeschrieben — der Punkt sagt jetzt „in der Regel klein“ und verweist nach
unten. **Zweiter der drei offenen Punkte entschieden.**

Nebenbei repariert: Die Import-Prüfung in `tests/lernen.js`, Abschnitt K, hing am heutigen
Datum. Sie baute die Karte mit `d: tag(9)` und verließ sich darauf, dass die geschätzte
letzte Antwort vor dem Änderungsdatum liegt — fünf Tage später stimmte das nicht mehr, und
der Lauf wurde rot, ohne dass sich an der App etwas geändert hätte. Jetzt steht das Datum
der letzten Antwort ausdrücklich im neuen Feld `l`.

Die restlichen 44 Funde: 17 sind an der Gegenprüfung gescheitert, 27 hatten kein
vollständiges Urteil, weil die Gegenprüfer ins Wochenlimit gelaufen sind. Der Lauf ist dafür
wieder angestoßen — ungeprüft ist nicht widerlegt.

**„Sitzt sicher“ meint jetzt drei verschiedene Tage (08.09.2026).** `CLAUDE.md` benannte
diese Schwäche selbst: Der Lernstand hielt je Karte nur `{b, d, s, w}`, das Datum der letzten
Antwort fehlte, und über `unterwegsRunde()` konnte eine noch nicht fällige Karte am selben
Tag erneut drankommen und ein Fach aufsteigen.

Erst gemessen, ob das überhaupt vorkommt. Bei drei reinen Unterwegs-Runden am Tag: **nie** —
die Runde meidet Doppelungen. Im realistischen Ablauf dagegen, Tagesaufgabe plus
Unterwegs-Runde plus Fehlerrunde, an **jedem einzelnen** von 40 simulierten Tagen, 266-mal
insgesamt. Und die Wirkung ist keine Kleinigkeit:

| nach 40 Tagen | vorher | jetzt |
|---|---|---|
| „sitzt sicher“ | 350 | **288** |
| grösster Aufstieg an einem Tag | Fach 1 → Fach 3 | Fach n → Fach n+1 |

Die Zahl war also rund 22 % zu hoch, und zwar systematisch nach oben — genau die Richtung,
in der sie nicht irren darf.

`grade()` merkt sich jetzt in `c.l` das Datum der letzten Antwort und befördert nicht noch
einmal, wenn dort schon heute steht. Ein **Fehler** zählt dagegen weiter jederzeit: Er ist
Information, keine Aufblähung. Die Antworten selbst werden alle gezählt (`c.s`), nur der
Aufstieg ist gedeckelt. `letzteAntwort()` nutzt `l` jetzt direkt statt es aus Fälligkeit
minus Fachintervall zu schätzen — das macht auch `regelAenderungen()` genauer. Ältere
Sicherungen ohne `l` laden unverändert und schätzen weiter.

Der Satz im Fortschritt sagt es jetzt so: „mindestens 3 richtige Antworten nacheinander, an
3 verschiedenen Tagen — mehr als einmal am Tag steigt eine Karte nicht auf.“

`tests/lernen.js`, Abschnitt D, prüft beides: den Einzelfall (viermal am selben Tag richtig
bringt ein Fach, nicht vier; ein Fehler am selben Tag setzt trotzdem zurück) und den ganzen
Ablauf über 40 Tage — keine Karte darf an einem Tag um mehr als ein Fach steigen. Gegen die
alte Fassung fällt das durch, mit „Fach 1 → Fach 3 an Tag 2“.

**Der Textcheck findet jetzt 60 statt 52 Prozent (08.09.2026).** Erst gemessen, dann
gebaut: Die zwölf Fehlersuchtexte tragen 86 markierte Fehler mit Korrektur — eine Probe, die
sich nicht schönrechnen lässt. Der Textcheck fand davon **45 (52 %)**. Nach Fehlerklassen
sortiert war die Lücke eindeutig: **16 der 41 verpassten Stellen waren fehlende Kommas**,
und zwar in drei Formen.

Für die Arbeit daran habe ich eine Messbank gebaut (`scratchpad/komma/bank.js`, nicht im
Repo): auf der einen Seite die Fehlertexte, auf der anderen **2343 Stellen, die die App
selbst als richtig zeigt** — Regelbeispiele, Regelprosa, Übungserklärungen, richtige
Antworten, Musterformulierungen und die korrigierten Fehlersuchtexte. Ein Muster wird an
beidem gemessen, nicht nur an dem, was es finden soll.

**`y01` umgebaut.** „ob“ fehlte in der Konjunktionsliste — ausgerechnet „Ich wollte fragen
ob …“, der Satz, den Nils schreibt. Dazu darf das Wort davor jetzt großgeschrieben sein
(„Frage ob“), und hinter der Konjunktion muss ein Wort folgen. Letzteres klingt nach
Kleinkram, ist aber der Grund, warum das Muster die App-eigenen Erwähnungen nicht mehr
meldet: „der dass-Satz“, „die Konjunktion dass.“, „so dass; im Text“.

| | Treffer in den Fehlertexten | Fehlalarme im richtigen Bestand |
|---|---|---|
| y01 vorher | 1 | 7 |
| y01 jetzt | 5 | 1 |

Der eine verbliebene Fehlalarm ist der Satz „Das Regelwerk stellt sodass und so dass frei“
aus der App selbst — eine Erwähnung, keine Verwendung. In Nils' Texten kommt so etwas nicht
vor, und das Muster steht auf `pruef`, nicht auf `hart`.

**`y13` neu — vorangestellter Nebensatz ohne Komma.** „Wenn ihr Fragen habt meldet euch.“
Der Satz beginnt mit der Konjunktion und läuft ohne ein einziges Trennzeichen bis zum Punkt;
dann fehlt es sicher. Gedankenstrich und Doppelpunkt zählen als Trenner, die Kurzformeln
(„wenn möglich“) sind ausgenommen. 4 Treffer, **kein** Fehlalarm.

**`y14` neu — Datum.** „am Dienstag den 12. Mai statt“. 1 Treffer, kein Fehlalarm.

**Verworfen: „während“ als Konjunktion.** Das Muster fand die eine echte Stelle und keinen
Fehlalarm im Bestand — aber an 14 744 Wörtern Projektprosa (`HANDOVER.md`, `CLAUDE.md`,
`FUNDE-offen.md`) fiel es über „Der Bildschirm bleibt während der Runde an“. „während“ als
Präposition hat dieselbe Gestalt wie „während“ als Konjunktion; ohne Satzgliedanalyse ist
das nicht zu trennen. Also nicht eingebaut. Dieselbe Prosa hat y01, y13 und y14 ohne eine
einzige Meldung passiert — das ist die eigentliche Freigabe, weil es Text ist, den die App
nicht selbst geschrieben hat.

Ergebnis: **52 von 86 (60 %)**. Neu in `tests/suite.js`: die Quote selbst mit einer
Untergrenze von 50 (gegen Rückfall, nicht als Ziel — der Textcheck soll auf Verdachtsstellen
zeigen, nicht alles finden) und eine Sperre, dass die drei Kommamuster im korrigierten Text
nichts melden. Die Untergrenze fällt gegen die alte Fassung durch; die Sperre ist ein
Riegel nach vorn, sie hielt auch vorher schon.

Was bleibt: 34 nicht gefundene Stellen, überwiegend Klassen, die ein Muster nicht sicher
entscheiden kann — Relativsätze ohne Komma („Studien die sich …“), uneingeleitete
Nebensätze („Ich hoffe du verstehst mich“), Nominalstil, Formulierungshinweise.

**Sauberkeitsdurchgang (07.09.2026).** Nach dem Haltbarkeitslauf einmal von außen
draufgeschaut — Repo, Code, Bild.

**Repo:** 22 Dateien, nichts Verirrtes, `node_modules/` ignoriert, `.vercelignore` deckt
Prüfläufe und Projektnotizen ab. Kein `console.log`, kein `debugger`, kein TODO in der App.

**Code:** Der Rundenkopf hatte nach den Umbauten zwei getrennte `if(Q.walk)`-Blöcke mit
einer Zuweisung dazwischen — jetzt ein `if/else`. `vorherFokus` stand unter der Funktion,
die es liest, und ist hochgezogen.

**Eine echte Unsauberkeit war noch drin:** Unter der laufenden Unterwegs-Runde stand
weiterhin die ganze Heute-Ansicht — Tagesaufgabe, Tagesbausteine, Freies Üben, samt einem
„Loslegen“, das die Runde ersetzt hätte. Unterwegs zählt nur die Karte:
`body.walk .view.on > *:not(.nurRunde){display:none}`, die Marke setzt `startQuiz()`.

**Ton:** Zwei Ausrufezeichen in der eigenen Stimme der App entfernt (`satz-perfekt`
„(Akkusativobjekt!)“ und die Wortkarte `tendenziös`). Die übrigen sieben stehen in zitierten
Beispielsätzen — „Frag ihn, ob er kommt!“ in der Regel *über* das Ausrufezeichen — und
bleiben.

**Bild:** Sichtprüfung über alle sieben Reiter, hell und dunkel, 393×852 und 1280×900:
kein Seitwärts-Scrollen, kein Element über dem Rand, keine Tippfläche unter 30 px, keine
Seitenfehler.

**Der Haltbarkeitslauf ist abgearbeitet (07.09.2026).** Die 42 bestätigten Funde des
Belastungslaufs sind durch: sechs schwere, der Rest mittel und niedrig. Jeder Eintrag
darunter beschreibt, was schiefging, wie es gemessen wurde und was jetzt dagegen steht.

Was dabei an Prüfungen entstanden ist — die bleiben, das ist der eigentliche Gewinn:

| Lauf | neu |
|---|---|
| `tests/suite.js` | F2 · Suche und Textcheck · G · Bedienung ohne Maus · Riegel für Service Worker, CSS und galoppierende Prüfmuster |
| `tests/unterwegs.js` | E · Fortsetzen · F · Zwei Runden gleichzeitig · G · Wege aus einer Runde heraus · H · Rückmeldung im Bild · I · Prelltipp, Enter und Bildschirmsperre · J · Rückmeldung ohne Farbe und ohne Maus |
| `tests/lernen.js` | A2 · Unterbrochene Einstufung · G · Zweites Fenster · H · Tagesaufgabe über Wochen · I · Beschädigter Lernstand · J · Ansicht nach Import und Zurücksetzen · K · Sichern und Laden |
| `tests/setup.js` | `tippe()` gegen die Prellsperre · Sprach- und Wachhalte-Ersatz, die sich wie der Browser verhalten · `boot(null, {roh})` für beschädigte Datensätze |

Zum Schluss ein Rundgang im Browser bei 393×852 über alle sieben Reiter und eine volle
Unterwegs-Runde: keine Seitenfehler, kein Seitwärts-Scrollen in irgendeiner Ansicht, Runde
sauber zu Ende, Tagesziel und Serie gesetzt.

Zwei Punkte bleiben bewusst offen:

- Im **kurzen Querformat** klebt die Kopfzeile weiterhin nicht (`@media(max-height:480px)`).
  Auf einem 375 px hohen Schirm kosten 46 px Kopfzeile zu viel; wer dort in einer langen
  Liste steht, muss weiter nach oben wischen. Ein „nach oben“-Knopf wäre die kleinere
  Lösung — wenn es Nils stört.
- Die App kann nicht wissen, ob ein **Download** angekommen ist. Die Meldung sagt das jetzt
  ehrlich; dass `lastExport` die Mahnung 30 Tage stumm schaltet, bleibt.

Und in `FUNDE-offen.md` liegen weiterhin drei inhaltliche Punkte, die eine Sitzung mit
Web-Recherche brauchen.

**Zweimal dieselbe Arbeit (07.09.2026).** Zwei Stellen rechneten in einem Durchgang doppelt
oder dreifach.

`countDue()` geht über alle 696 Karten (gemessen 0,9 ms) und lief **dreimal** je Aufbau der
Heute-Ansicht — zweimal im Text „Es stehen … Karten an“, einmal in `renderWalkCard()`. Jetzt
einmal, weitergereicht. `renderHeute()` fällt damit von 14,7 auf 13,9 ms; der Löwenanteil
ist `buildDaily()`, nicht dieser Fund.

`openRule()` rief `drawRules()`, obwohl `go("regeln")` über `ensureRules()` schon gezeichnet
hatte — 117 Regeln, zweimal, bei jedem ersten Regelsprung. Die Filter werden jetzt vor
`go()` zurückgesetzt, und `drawRules()` läuft nur noch, wenn `ensureRules()` es nicht schon
getan hat. Der erste Regelsprung fällt in jsdom von **375 auf 215 ms**. Geprüft wird die
Anzahl der Aufrufe, nicht die Zeit — die hängt vom Rechner ab.

Und eine Ehrlichkeitskorrektur, die schon im vorigen Schritt mitkam: „Sicherung
heruntergeladen“ hieß es auch dann, wenn der Browser den Download abgebrochen hat. Die App
kann das nicht wissen; die Meldung heißt jetzt „Sicherung erstellt — schau nach, ob die
Datei angekommen ist“. Dass `lastExport` die Mahnung 30 Tage stumm schaltet, bleibt:
zuverlässiger lässt es sich von der Seite aus nicht feststellen.

**Sechs Fehler an Ansichten und Bedienung (07.09.2026).**

**1 · Eine laufende Runde verschwand beim Reiterwechsel.** Die Sperre in `go()` hing fest
an `#dailyHost`. Eine Runde in Karten, Sätzen oder Fortschritt — auch die 30 Fragen der
Einstufung — wurde beim Wechsel weggezeichnet, ohne Hinweis. Die Sperre fragt jetzt, ob der
Wirt der laufenden Runde in der Ansicht liegt, auf die gewechselt wird
(`Q.host.closest(".view")`).

**2 · Der Textcheck markierte nach dem Bearbeiten die falschen Stellen.** Die Fundstellen
sind Zeichenpositionen im **geprüften** Text; `drawCheck()` schnitt sie aber aus `TC.text`,
und das ist der **aktuelle** Feldinhalt. Wer nach dem Prüfen weiterschrieb, sah die
Markierungen auf verschobenen Wörtern (in der Gegenprobe wurde aus „Vorraus“ ein „etzt et“).
Der geprüfte Text hängt jetzt am Ergebnis (`TC.res.text`).

**3 · Das Suchfenster hielt den Fokus nicht.** Ein Shift+Tab landete unsichtbar auf der
Seite dahinter, und Enter startete dort eine Runde. Die Seite ist jetzt `inert`, solange die
Suche offen ist, und der Fokus kehrt beim Schließen dorthin zurück, wo er herkam.

**4 · Ein Wort- oder Fall-Treffer aus der Suche landete unter dem Bildschirmrand.** Der
Sprung füllte nur das Filterfeld; die Listen beginnen weit unten, der Treffer lag rund
1000 px darunter, und es sah aus, als hätte der Tipp nichts bewirkt. Jetzt wird nach dem
Entpreller auf die Liste gescrollt — so, wie `openRule()` es längst tut.

**5 · Die Eingabefelder fielen im Querformat unter 16 px.** Die Regel („sonst zoomt iOS beim
Antippen“) stand in der Breiten-Abfrage; quer gehalten ist ein iPhone breiter als 600 px.
Sie hängt jetzt an `@media(hover:none)`, also am Gerät.

**6 · Der Unterwegs-Kopf passte auf keinem Handy.** Gemessen an sechs Breiten: Die
Kategorie-Marke wurde nur unter 400 px ausgeblendet, auf einem 414-px-Schirm brauchte die
Zeile mit ihr **468 px** — der Fortschrittszähler stand über dem Rand. Aber auch ohne sie
passte es nicht: die beiden Zeichenknöpfe waren 76 px breit, und `.walktop .btn` stand im
Stylesheet **nach** der Medienabfrage, hob deren schmalere Polsterung also wieder auf.
Jetzt: Grundregel vor die Abfrage, Zeichenknöpfe 48 px breit, Marke auf allen Touchgeräten
aus, und wenn es auf 320 px trotzdem nicht reicht, rutscht der Zähler in eine zweite Zeile
statt unsichtbar zu werden. Ergebnis bei 320/375/393/414/430 px: alles im Bild.

Geprüft: `tests/suite.js`, neuer Abschnitt **F2 · Suche und Textcheck** (7 Prüfungen, vier
fallen gegen die alte Fassung durch) und zwei Riegel für die beiden CSS-Punkte (beide fallen
durch); `tests/unterwegs.js`, Abschnitt G (Reiterwechsel, eine fällt durch);
`tests/lernen.js`, Abschnitt K (die beiden Sprünge, mit aufgezeichnetem `scrollIntoView`).

**Sichern, Laden und die Reihenfolge des Stoffs (07.09.2026).** Sechs Funde rund um
Lernstand und Auswahl.

**1 · Die Sicherungsdatei trug das Datum der vorigen Sicherung.** `S.lastExport = today()`
stand *hinter* dem `JSON.stringify(S)`. Der Import-Dialog fragt später „Sicherung vom …
laden?“ und nannte damit ein Datum, an dem diese Datei noch gar nicht existierte. Eine
Zeile nach oben.

**2 · Der Widerruf der Datei-URL kam sofort.** `URL.revokeObjectURL` lief unmittelbar nach
`a.click()`; manche Browser holen den Inhalt erst danach, und dann käme eine leere Datei
an. Der Widerruf wartet jetzt eine Minute. Die Meldung heißt außerdem nicht mehr „Sicherung
heruntergeladen“ (das weiß die App nicht), sondern „Sicherung erstellt — schau nach, ob die
Datei angekommen ist“.

**3 · Nach dem Import blieb die Anzeige hell,** obwohl „dunkel“ gesichert war. Die
Anzeigeart steckt im Stand, wurde aber nur beim Start angewendet.

**4 · Eine ältere Sicherung übersprang die Regeländerungen.** `S.neu` hält fest, welche
geänderten Karten schon zurückgesetzt sind. Beim Import blieb der Merker **dieses Geräts**
stehen, weil `Object.assign` ihn aus einer alten Datei nicht überschreibt —
`regelAenderungen()` hielt die Änderungen für erledigt, und die betroffenen Karten blieben
in ihrem alten Fach. Nils hätte die geänderte Antwort erst in Wochen gesehen, obwohl er die
alte gelernt hat. Der Merker kommt jetzt aus der Datei (`S.neu = neu.neu || {}`); die
eigene Schutzregel von `regelAenderungen()` — wer nach dem Änderungsdatum geantwortet hat,
bleibt stehen — greift weiter.

**5 · Der Import überschrieb, bevor klar war, ob es gutgeht.** Der bisherige Rohtext kommt
jetzt vor dem Überschreiben zur Seite; scheitert der Aufbau der Ansicht, wird er
zurückgeschrieben und die App meldet „Die Datei ließ sich nicht laden — dein alter Stand
ist zurück“.

**6 · Zwei Reihenfolgen standen falsch herum.**
`schwacheSchluessel()` sortierte nach der Gesamtzahl der Fehler und erst dann nach dem
Fach. „Nur Fehler“ zeigte damit, was irgendwann einmal oft danebenging — auch wenn es
längst in Fach 5 sitzt —, während eine gestern auf Fach 1 gefallene Karte hinten anstand.
Jetzt entscheidet das Fach zuerst.
Und `buildDaily()` nahm in Phase 1 erst alle fälligen **Fallkarten**, dann die Übungen. Nach
einer Pause, wenn der Rückstand größer ist als die zwölf Plätze, bestand die Tagesaufgabe
tagelang aus nichts als Fallkarten (gemessen: 0 Übungen / 2 Wörter / 10 Fälle), während die
seit vierzehn Tagen fälligen Übungen liegen blieben. Jetzt entscheidet die Fälligkeit, nicht
die Sorte (dieselbe Lage: 10 / 2 / 0). Die garantierte Wortschatzquote bleibt davor.

Geprüft in `tests/lernen.js`: Abschnitt **K · Sichern und Laden** (9 Prüfungen — der Import
wird über ein echtes `File` und den `change`-Horcher gefahren, nicht nachgebaut) und zwei
neue Blöcke in Abschnitt H. Neun Prüfungen fallen gegen die alte Fassung durch.

**Die App ist ohne Maus und ohne Farbe benutzbar (07.09.2026).** Vier Funde, die
zusammengehören.

**1 · Richtig und falsch unterschieden sich nur im Farbton.** Gemessen an einer echten
Runde: Rand `rgb(47,107,82)` gegen `rgb(168,54,47)` — Helligkeitsverhältnis **1,03:1**;
Fläche 1,02:1; Randstärke und Deckkraft bei beiden gleich. In Graustufen sind die zwei
Kästen also identisch, und dieselbe Entsättigung erzeugt ein Handydisplay in der Sonne —
Nils' Standardsituation. In der Marke steht jetzt nach der Antwort ein **✓** bzw. ein **✗**
statt des Buchstabens. Vorgelesen wird an der Stelle nichts mehr, die Frage ist beantwortet.

**2 · Die Fehlersuche war ohne Zeigegerät gar nicht bedienbar.** Jedes Wort ist ein `span`
ohne `tabindex` — 84 je Text, keines in der Fokusreihenfolge, keines mit einer Taste
auslösbar. Damit war die ganze Übung (12 Texte, 86 markierte Stellen) für jeden ohne Maus
oder Finger zu; „Auswerten“ ließ sich drücken und meldete zwangsläufig null Treffer. Dass
es anders gemeint war, stand längst im Stylesheet: `.tok:focus-visible` konnte nie greifen.

84 Tabstopps je Text wären allerdings eine Zumutung. Deshalb **wandert der Tabstopp**:
einer führt in den Text, danach geht es mit den Pfeiltasten von Wort zu Wort, Leertaste und
Enter markieren, `Home`/`End` springen. Jedes Wort trägt `role="checkbox"` und ein
`aria-checked`, das mitgezogen wird. Dasselbe Muster, einfacher gelöst, bei den fünf
Selbstcheck-Haken im Schreibimpuls und den zwei Tagesbausteinen auf Heute.

**3 · Vier Knöpfe hießen für Vorlese-Software „⌕“, „◐“, „🔊“ und „⏩“.** Alle vier trugen
ein `title` mit genau dem richtigen Text — es kommt nur nie dran: die Namensberechnung
nimmt zuerst den Inhalt des Knopfes, und der ist nicht leer. Vorgelesen wurde also der
Zeichenname. Zwei davon sind die Unterwegs-Schalter, deren Funktion man ohne Beschriftung
nicht raten kann, und beide sind Ein/Aus-Schalter, deren Zustand nur in der Füllfarbe
stand. Jetzt: `aria-label` an allen vieren, `aria-pressed` an den beiden Schaltern, beim
Umschalten mitgezogen.

**4 · Eine Runde lief für Vorlese-Software stumm.** In der ganzen Datei gab es keine
einzige Live-Region, und der Fokus fiel bei jedem Schritt auf `<body>`: `check()`
deaktiviert die angetippte Fläche (ein deaktivierter Knopf verliert den Fokus), `renderQ()`
ersetzt danach den ganzen Kartenblock. Weder die Rückmeldung noch die nächste Frage wurde
je angesagt, und der Lesepunkt saß jedes Mal wieder am Seitenanfang. `#fbHost` ist jetzt
`role="status"`, und der Fokus wandert nach der Antwort auf den Weiter-Knopf
(`preventScroll`, sonst rutscht unterwegs die Frage aus dem Bild). Läuft die App-eigene
Sprachausgabe, schaltet die Region auf `aria-live="off"` — sonst redeten zwei Stimmen
gleichzeitig.

Geprüft: `tests/suite.js`, Abschnitt **G · Bedienung ohne Maus** (17 Prüfungen, 14 fallen
gegen die alte Fassung durch), und `tests/unterwegs.js`, Abschnitt **J · Rückmeldung ohne
Farbe und ohne Maus** (13 Prüfungen, 12 fallen durch).

**Vier kleinere, aber lästige Fehler (07.09.2026).**

**1 · Ein Doppeltipp beantwortete die nächste Frage.** `renderQ()` ersetzt den Karteninhalt
sofort. Ein zweiter Tipp an derselben Stelle — Nachfassen, unsicherer Daumen in Bewegung —
landet auf dem, was dort jetzt liegt, und über eine Runde von 20 Karten liegt der
Weiter-Knopf dreimal (393×852) genau über einer Antwortoption der Folgefrage. Die Karte
stand danach ungesehen als Fehler im Lernstand, im Fehlerjournal und in der
„Nur Fehler“-Runde. `check()` verwirft jetzt Antworten, die weniger als 350 ms nach dem
Rendern kommen — kürzer als jede bewusste Antwort, länger als ein Prelltipp.

Das trifft auch die Prüfläufe, die viel schneller tippen als ein Mensch: sie gehen jetzt
über `tippe(w, knopf)` aus `tests/setup.js`, das die Sperre vor dem Klick zurückstellt. Wer
eine neue Prüfung schreibt, die eine Antwort antippt, muss das auch tun (steht in
`CLAUDE.md`).

**2 · Enter bei einer Tippaufgabe blätterte sofort weiter.** Das Eingabefeld hat einen
eigenen Enter-Horcher, und der Horcher am Dokument prüfte denselben Druck noch einmal, fand
den eben entstandenen Weiter-Knopf und drückte ihn. Ein Tastendruck wertete also die
Antwort und schaltete weiter — „Richtig wäre: …“ war nie zu sehen, und bei einer
Tippaufgabe ist genau das der Ertrag. Betrifft 44 der 376 Übungen; unterwegs nichts, dort
filtert `startQuiz()` sie heraus. Der Horcher am Feld verbraucht den Druck jetzt.

**3 · Nach einem Anruf blieb der Bildschirm nicht mehr an.** Der Browser gibt die
Bildschirmsperre von selbst frei, sobald das Dokument unsichtbar wird — Anruf,
Benachrichtigung, Sperrtaste, App-Wechsel. Die App erfuhr davon nichts: `wakeSperre` blieb
gesetzt, obwohl die Sperre weg war, und genau daran scheiterte jede Neuanforderung
(`if(an && navigator.wakeLock && !wakeSperre)`). Der Bildschirm ging danach für den Rest der
Sitzung aus, obwohl in der Kartenansicht steht: „Der Bildschirm bleibt während der Runde
an.“ Jetzt vergisst ein `release`-Horcher den Sentinel, und ein `visibilitychange`-Horcher
fordert bei der Rückkehr neu an, solange eine Unterwegs-Runde läuft.

Der Ersatz in `tests/setup.js` lieferte bis eben ein nacktes Objekt ohne
`addEventListener` — kein Prüflauf konnte das sehen. Er bildet das Browserverhalten jetzt
nach (Sentinel mit `release`-Ereignis, `__wakeVerlieren()` für das Wegblenden). Das ist
dieselbe Klasse Lücke wie beim Sprach-Ersatz vor zwei Tagen.

**4 · Ein Prüfmuster fror die Oberfläche ein.** `a04` suchte lange Sätze mit
`/[A-ZÄÖÜ][^.!?]{230,}[.!?]/`. Da im Deutschen fast jedes Substantiv groß beginnt, setzt so
ein Muster alle paar Zeichen neu an, und ohne Obergrenze läuft jeder Versuch bis zum
Textende: der Aufwand vervierfacht sich, wenn der Text doppelt so lang wird. Nicht die
Länge ist das Problem, sondern **fehlende Satzpunkte** — ein zeilenweise notierter
Trainingsplan, eine Mitschrift. In genau diesen Texten kann `a04` gar nichts finden.
Gemessen über `analyse()` an 6000 Wörtern ohne Satzzeichen: **544 ms → 24 ms**. Die
Obergrenze `{230,600}` ändert an echten Fundstellen nichts (Bandwurmsätze ein- bis
fünffach: alt 1/2/3/5, neu 1/2/3/5).

Neu in `tests/suite.js`: kein Prüfmuster darf eine nach oben offene Wiederholung über einer
verneinten Zeichenklasse haben, plus eine großzügige Schranke von 250 ms für den ganzen
Textcheck über 6000 Wörter ohne Satzzeichen. Beide fallen gegen die alte Fassung durch
(442 ms). Neu in `tests/unterwegs.js`, Abschnitt **I** (12 Prüfungen, sieben fallen durch).

**Die Rückmeldung steht jetzt im Bild (07.09.2026).** Nach einer Antwort baut die App die
Erklärung und darunter den Weiter-Knopf — und scrollte nicht mit. Die `.walkbar` ist zwar
`position:sticky;bottom:0`, klebt aber nur innerhalb ihres Elternblocks, und der beginnt
erst hinter der Rückmeldung: Ist die Erklärung länger als der Rest des Schirms, kann die
Leiste gar nicht ans Schirmende gezogen werden. Genau in dem Moment, in dem Nils einhändig
beim Gehen die Erklärung braucht, stand weder sie noch der Knopf im Bild.

Im Browser gemessen, zwölf falsche Antworten je Lauf (falsch, weil die Erklärung dann am
längsten ist):

| | vorher | jetzt |
|---|---|---|
| unterwegs, 375×667 | Knopf 4/12 · Erklärung 7/12 | **12/12 · 12/12** |
| unterwegs, 393×852 | 8/12 · 10/12 | 12/12 · 12/12 |
| Tagesaufgabe, 375×667 | 0/12 · 6/12 | 12/12 · 12/12 |

`zeigeRueckmeldung()` scrollt die Rückmeldung so weit hoch, dass 70 px darüber frei
bleiben — die Frage bleibt angeschnitten sichtbar. Zwei Bedingungen halten es zurück: Steht
alles schon im Bild, passiert nichts; und hat Nils seit dem Rendern der Frage selbst
gescrollt (`scrollBeiFrage`), holt ihn die App nicht zurück.

Geprüft in `tests/unterwegs.js`, Abschnitt **H · Rückmeldung im Bild**. jsdom rechnet kein
Layout — dort sind alle Rechtecke null —, deshalb prüft der Lauf die *Entscheidung* mit
untergeschobenen Rechtecken: scrollt sie, wenn die Rückmeldung unter dem Rand liegt, und
hält sie still, wenn schon selbst gescrollt wurde. Das Verhalten selbst ist im Browser
gemessen.

Nebenbei aufgefallen: Die Zusammensetzung einer Unterwegs-Runde ist **nicht** tagesfest
(`unterwegsRunde()` sät aus `Date.now()`), und Wortkarten tragen keine Regel. Ein Prüfschritt
in Abschnitt G, der auf die erste Karte baute, war dadurch launisch — er rückt jetzt zur
ersten Karte mit Regel vor. Wer dort neue Prüfungen schreibt, sollte das im Kopf haben.

**Vier Sackgassen auf dem Handy (07.09.2026).** Alle vier sind in Chromium bei 393×852,
375×667 und 667×375 gemessen, vorher wie nachher.

**1 · Aus einer Runde führte kein Weg heraus.** Nur der Unterwegs-Kopf hatte einen
Beenden-Knopf. Wer auf Heute ein Thema antippte oder die Tagesaufgabe startete, kam nur
durch Neuladen wieder heraus — alle Reiter durchklicken half nicht, weil `go()` die
Heute-Ansicht gesperrt hält, solange dort eine Runde läuft. Als Startbildschirm-App
(`display:standalone`) gibt es keine Adressleiste und keinen Neuladen-Knopf; dort blieb nur,
die App zu beenden. Der gewöhnliche Rundenkopf hat jetzt denselben Knopf, und `startQuiz()`
merkt sich in `Q.zurueck`, aus welcher Ansicht die Runde kam.

**2 · Der Regel-Link im Unterwegs-Modus war eine Sackgasse.** `body.walk` blendet die
Reiterleiste aus; `go()` fasste `body.walk` nicht an. Ein Tipp auf „→ Regel nachlesen“
führte also in die Regelansicht ohne Reiterleiste — kein Weg zurück, dieselbe Klemme wie
oben. `go()` verlässt den Unterwegs-Modus jetzt selbst und legt die Runde ab; sie steht
danach als „Fortsetzen“ bereit.

**3 · Die Reiterleiste scrollte weg und kam nicht wieder.** `.head` ist `position:sticky`,
aber der Handy-Block setzte sie auf `relative` — laut Kommentar als Bezugsrahmen für den
Wischhinweis (`::after`). Sticky ist selbst ein Bezugsrahmen, der Verlauf hätte also
ebenso funktioniert. Auf jedem Handy verschwanden damit Kopfzeile, Reiter, Suche und der
Hell/Dunkel-Schalter beim Scrollen. Die Ansicht Sätze ist bei 393 px **18 408 px** hoch —
einundzwanzig Bildschirme zurück nach oben. Gemessen: Reiterleiste nach 3000 px Scrollen
vorher außer Sicht, jetzt bei `top 55`. Im Unterwegs-Modus und im kurzen Querformat bleibt
sie weiterhin bewusst stehen.

**4 · Der Spickzettel wurde hochkant abgeschnitten.** Rasterzellen haben von Haus aus
`min-width:auto` und wachsen auf die Mindestbreite ihres Inhalts. Die Tabellen sind breiter
als der Schirm, die Zelle stand 65–83 px über den Rand — und weil `body{overflow-x:hidden}`
gilt, wurde der Überstand abgeschnitten statt scrollbar. In der dritten Tabelle fehlte die
halbe Plural-Spalte. `.ch-2col > *{min-width:0}` lässt die Scrollfläche von `table.dt`
wieder greifen, wie im Kommentar dort ohnehin vorgesehen. Gemessen: Seitenbreite 458 auf
393 px Schirm vorher, 393 nachher; 459/375 → 375; quer 752/667 → 667. Fürs Querformat
brauchte es dieselben Regeln noch einmal, weil die 600-px-Abfrage dort nicht greift — das
war die einzige Stelle der App mit echtem Seitwärts-Scrollen.

Geprüft: `tests/unterwegs.js`, Abschnitt **G · Wege aus einer Runde heraus** (14 Prüfungen,
sechs fallen gegen die alte Fassung durch). Für die beiden CSS-Punkte steht in
`tests/suite.js` nur ein Riegel gegen Rückfall — jsdom rechnet weder Medienabfragen noch
Layout, das Verhalten selbst ist im Browser gemessen; beide Riegel fallen gegen die alte
Fassung durch.

**Fortschritt zeigt nach Import und Zurücksetzen die richtigen Zahlen (07.09.2026).**
„Sicherung laden“ und „Alles zurücksetzen“ sitzen beide in der Fortschritt-Ansicht und
riefen am Ende `renderAll()` — darin fehlte ausgerechnet `renderFortschritt()`. Die Ansicht,
auf der man steht, war damit die einzige, die stehen blieb. Nach dem Laden einer Sicherung
stand oben „🔥 21 · 4300 XP“ und der Toast „Sicherung geladen“, zwei Zeilen darunter
unverändert „0 sitzt sicher · 0 im Aufbau · 696 noch nicht dran“; beim Zurücksetzen
dasselbe rückwärts. Erst ein Reiterwechsel hin und zurück zeigte die Wahrheit.

`renderFortschritt()` ist jetzt Teil von `renderAll()`. Damit das nicht die laufende
Einstufung wegzeichnet — die rendert in `#pSub` —, kehrt `renderFortschritt()` unverrichtet
zurück, solange dort eine Runde läuft. Dieselbe Sperre hat `go()` seit jeher für
`#dailyHost`; nebenbei überlebt die Einstufung damit auch einen Reiterwechsel.

Neu in `tests/lernen.js`, Abschnitt **J** (9 Prüfungen): zurücksetzen und importieren, ohne
den Reiter zu wechseln, dazu die Sperre. Vier fallen gegen die alte Fassung durch.

**Beschädigter Lernstand wird nicht mehr stumm überschrieben (07.09.2026).** `load()` fing
jeden Fehler ab und lieferte wortlos den leeren Standardzustand. Ist der gespeicherte Stand
beschädigt — beim Schreiben abgeschnitten, Profil defekt —, startete die App also mit 0 XP
und Serie 0, ohne Warnleiste und ohne Toast, und die erste Antwort schrieb den Rest
endgültig weg. Beim **Schreib**fehler warnt die App seit jeher vorbildlich, beim
**Lese**fehler gar nicht. In der Nachstellung enthielt der auf 80 % gekürzte Datensatz noch
fast alle zwanzig Karten und die Serie 23 — von Hand rettbar, nach einer einzigen Antwort
weg.

Jetzt legt der `catch`-Zweig die Rohfassung einmalig unter `deutschtrainer.v1.defekt`
beiseite und zeigt eine eigene Leiste („Der gespeicherte Fortschritt ließ sich nicht
lesen“). Weggeräumt wird die Kopie erst auf Knopfdruck — sonst wäre sie weg, bevor jemand
sie ansehen konnte. Das Beiseitelegen steht selbst in `try/catch`: ein voller Speicher darf
den Start nicht kosten. Ein **leerer** Speicher ist kein Defekt und löst nichts aus.
Datenformat und Speicherschlüssel bleiben unverändert.

Neu in `tests/lernen.js`, Abschnitt **I · Beschädigter Lernstand** (13 Prüfungen), samt
Gegenprobe für den ersten Start und einen heilen Stand. `tests/setup.js` kann dafür jetzt
einen Rohtext statt eines Objekts in den Speicher legen (`boot(null, {roh})`) — als Objekt
lässt sich ein kaputter Datensatz nicht ausdrücken. Vier Prüfungen fallen gegen die alte
Fassung durch.

**Eine Runde greift nicht mehr in die andere (07.09.2026).** In der Heute-Ansicht liegen
zwei Wirtsbereiche übereinander: `#walkHost` und `#dailyHost`. `startQuiz()` überschrieb
nur den einen — die Karte im anderen blieb samt Antwortknöpfen stehen und bedienbar. `Q`
ist aber global, und `check()` suchte mit `$$(".opt")` und `$("#fbHost")` im **ganzen
Dokument**. Ein Tipp auf die stehengebliebene Karte bewertete damit die aktuelle Frage der
anderen Runde: gemessen wurde so `c:interessieren` auf Fach 2 gesetzt — eine Fallkarte, die
nie auf dem Schirm war. In der Gegenrichtung landete `s03` als Fehler im Lernstand. Weil
`#walkHost` im Markup vor `#dailyHost` steht, traf `$("#fbHost")` dabei zuverlässig den
falschen Wirt.

Zwei Eingriffe:

- `startQuiz()` leert den Wirt einer noch laufenden anderen Runde (`Q.host !== host`).
- Alles, was zur laufenden Runde gehört, geht durch zwei neue Helfer `qEl()` / `qAll()`,
  die im Wirt der Runde suchen statt im Dokument — dreizehn Fundstellen in `renderQ()`,
  `check()`, `autoAn()` und der Tastaturbedienung. Damit greifen auch die doppelten IDs
  (`#fbHost`, `#nextBtn`, `#fillIn`) nicht mehr ins Falsche.

Neu in `tests/unterwegs.js`, Abschnitt **F · Zwei Runden gleichzeitig** (9 Prüfungen): Zwei
Runden nacheinander in verschiedenen Wirten starten, dem verwaisten Wirt von Hand eine
Karte unterschieben und prüfen, dass die Antwort weder dort landet noch die fremden Knöpfe
einfärbt. Vier Prüfungen fallen gegen die alte Fassung durch.

**Unterbrochene Einstufung behält ihr Ergebnis (07.09.2026).** `startTest()` übergab die
Auswertung als Funktion (`opts.onDone`) an `startQuiz()`, und eine Funktion lässt sich nicht
in den `localStorage` schreiben. Wer die Einstufung unterbrach — App geschlossen, oder iOS
verwirft die Seite im Hintergrund —, bekam beim nächsten Start „Offene Runde · Du warst bei
Frage 6 von 30 · Fortsetzen“, beantwortete brav die restlichen 25 und stand danach wieder
vor „Wo stehst du gerade?“: `S.level`, `S.levelDate` und `S.plan` blieben null. Zwölf
Minuten ins Leere. Dieselbe Lücke traf `Q.daily`: eine fortgesetzte Tagesaufgabe zeigte am
Ende weder Serie noch XP-Zeile.

Gesichert wird jetzt nicht die Funktion, sondern die **Absicht**: `art` („test“) und, weil
die Auswertung den Stand von `S.cat` vor dem Test braucht, dieser Stand als `vorher`.
`sitzungFortsetzen()` baut daraus die Auswertung neu — dafür steht sie jetzt als eigene
Funktion `testAuswertung(before)` und nicht mehr als anonyme Closure in `startTest()`.
`daily` wandert genauso mit.

Zwei Dinge fielen dabei nebenbei auf und sind mit behoben: Die offene Einstufung erschien
auf der Unterwegs-Karte als „Runde läuft noch“ und wurde beim Fortsetzen in den
Unterwegs-Modus geschoben, in den sie nicht gehört — dort steht jetzt nur noch, was
tatsächlich eine Unterwegs-Runde ist (`roh.walk`); angeboten wird sie weiter unter
„Karten“. Und sie lief nach dem Fortsetzen im Karten-Reiter zu Ende, während ihre
Auswertung den Plan im Fortschritt-Reiter aufbaute — `sitzungFortsetzen()` wechselt für
`art === "test"` jetzt selbst dorthin.

Ältere Sicherungen haben kein `art`-Feld; `x.art || null` fängt das ab, sie laden
unverändert. Neu in `tests/lernen.js`, Abschnitt **A2 · Unterbrochene Einstufung**
(14 Prüfungen): Einstufung anfangen, fünf Fragen beantworten, App neu starten, fortsetzen,
zu Ende bringen — Ergebnis, Datum und Planangebot müssen da sein. Gegen die alte Fassung
fallen neun davon durch.

**Die Tagesaufgabe führt jetzt auch Wort- und Fallkarten ein (07.09.2026).** `buildDaily()`
füllte in Phase 2 erst alle zwölf Plätze mit Übungen; der Block „Neue Wortkarten, solange
Platz ist“ stand danach und fand nie Platz, und einen Block für neue Fallkarten gab es gar
nicht. Da eine Karte erst fällig werden kann, nachdem sie einmal dran war, konnten die
beiden Sorten auch über Phase 1 nie hereinkommen. `DAILY_WORDS = 2` war damit wirkungslos,
obwohl `SLOTS` so rechnete, als wären zwei Plätze reserviert.

Nachgemessen an der echten `buildDaily()` über 60 simulierte Tage (weitergestellt wird der
Lernstand, nicht die Uhr):

| | vorher | jetzt |
|---|---|---|
| 30 Tage nur „Heute“ | 360 Aufgaben · 0 Wörter · 0 Fälle | 176 · 77 · 107 |
| 60 Tage nur „Heute“ | 720 · 0 · 0 | 335 · 150 · 235 |

320 der 696 Karten (155 Wörter + 165 Fälle) waren über diesen Weg also dauerhaft
unerreichbar. Wer zusätzlich unterwegs übt, hat davon nichts gemerkt — dort greift
`quotenMix()` sauber, und einmal beantwortete Karten tauchen dann auch in der Tagesaufgabe
auf.

Behoben: Von den freien Plätzen für neuen Stoff geht höchstens die Hälfte an neue Wort- und
Fallkarten (`DAILY_WORDS`, neu `DAILY_FAELLE`, je 2). Reicht der Rest nur für eine der
beiden Sorten, entscheidet der Tagesseed — über die Wochen kommen beide dran. Die
Gesamtzahl von zwölf Karten bleibt; bestehende Lernstände bekommen keine anderen Karten,
nur eine andere Mischung.

Die Aufteilung stellt sich damit von allein auf 47 / 21 / 33 ein und liegt damit nah an der
Quote unterwegs (45 / 25 / 30) — ohne dass die eine irgendwo aus der anderen abgeleitet
wäre. Neu in `tests/lernen.js`, Abschnitt **H · Tagesaufgabe über Wochen**: der Lauf treibt
die echte `buildDaily()` und prüft, dass beide Sorten vorkommen, nicht nur vereinzelt, und
dass Übungen die größte Gruppe bleiben. Gegen die alte Fassung fallen drei Prüfungen durch.

**Fortsetzen überspringt die schon beantwortete Frage (07.09.2026).** `sitzungSichern()`
hielt nur `Q.i` fest, nicht ob die Frage an dieser Stelle bereits beantwortet und über
`grade()` verbucht war. Wer nach der Rückmeldung auf „Beenden“ tippte, bekam beim
Fortsetzen **dieselbe Frage noch einmal — samt der Lösung, die eben in der Rückmeldung
stand**. `grade()` unterscheidet nicht zwischen „auf Anhieb richtig“ und „richtig, nachdem
die Lösung dastand“: eine gerade falsch beantwortete Karte stieg dadurch auf Fach 2 und kam
erst in drei Tagen wieder statt am nächsten Tag. Denselben Zustand erzeugt iOS von allein,
wenn es die Seite im Hintergrund verwirft und neu lädt — dafür braucht es nicht einmal den
Beenden-Knopf.

Behoben mit einer Marke am laufenden Quiz: `renderQ()` setzt `Q.beantwortet = false`,
`check()` setzt sie auf `true`, `sitzungSichern()` schreibt sie als `fertig` mit. Die Marke
sitzt bewusst an `Q` und nicht als Parameter der Sicherung — der Beenden-Knopf sichert
selbst noch einmal und hätte sie sonst wieder gelöscht. `sitzungOffen()` zählt beim Lesen
`fertig` dazu und gilt als geschlossen, wenn dahinter nichts mehr kommt.

Neu in `tests/unterwegs.js`, Abschnitt **E · Fortsetzen** (13 Prüfungen): der ganze Weg
falsch antworten → beenden → in einem zweiten Fenster fortsetzen, dazu die Gegenprobe
(unbeantwortet beendet → dieselbe Frage kommt zu Recht wieder) und der Randfall hinter der
letzten Frage. Gegen die alte Fassung fallen vier davon durch, eine bricht ab.

Eine Einschränkung, die die Meldung überzeichnet hatte: Der Tageszähler kam vorher wie
nachher auf dieselbe Zahl. Doppelt gezählt wurde die *Karte*, nicht die Antwort — zwölf
Antworten deckten also elf verschiedene Karten ab. Der teure Teil war die Beförderung ins
nächste Fach, nicht die Zählung.

**Der Service Worker wartet jetzt auf den ganzen Rumpf (07.09.2026).** Beim
Durchgehen der eigenen Verpackung ist eine Fehlannahme aufgefallen: Die Frist von 2,5 s
im Worker (`seite()`) sollte den Start retten, wenn das Netz schwächelt — sie hat aber nur
vor einem *stummen* Server geschützt. Ein `fetch()` ist schon erfüllt, sobald die
**Kopfzeilen** da sind; die knapp 700 kB tröpfeln danach ohne jede Frist hinterher.

Gemessen statt vermutet: ein Testserver, der die Seite in Häppchen mit 25 kB/s ausliefert
(≈200 kbit/s, schwaches Mobilfunknetz), dazu ein Chromium, der vorher wartet, bis der
Worker die Seite wirklich steuert und `/` **vollständig** im Cache liegt.

| | alter Worker | jetzt |
|---|---|---|
| Start bei 25 kB/s, Kopie im Cache | **27 924 ms** | **2 561 ms** |

Die erste Messung log übrigens: Sie lud nach drei Sekunden neu, da war der Worker noch gar
nicht aktiv — beide Fassungen kamen auf 28 s. Erst das Warten auf `controller` und auf den
vollständigen Cache-Eintrag hat den Unterschied sichtbar gemacht. (Dieselbe Klasse Fehler
wie beim Sprach-Stub: ein Test, der grün oder rot ist, ohne das Gemeinte zu messen.)

Behoben in `sw.js`: `netzSeite()` liest den Rumpf mit `.blob()` aus und baut daraus eine
neue `Response`, bevor die Antwort als „da“ gilt — die Frist deckt damit die ganze
Übertragung. Gewinnt die Frist, kommt die Fassung aus dem Cache und der Nachschub läuft
weiter; damit der Browser den Worker dabei nicht abräumt, hängt das Netz-Versprechen im
`fetch`-Ereignis an `e.waitUntil()`. Ganz zum Schluss steht ein `fetch(anfrage)` als letzte
Rückfallebene, falls weder Netz noch Cache etwas hergeben — sonst käme ein leerer Wert bei
`respondWith` an.

Abgesichert auf zwei Ebenen:

- `tests/suite.js`, Abschnitt F: zwei Textprüfungen (der Worker liest den Rumpf aus; im
  `fetch`-Ereignis steht ein `waitUntil`). Beide fallen gegengeprüft beim alten Worker
  durch. Es sind Textprüfungen und damit nur ein Riegel gegen Rückfall, kein Beweis —
  das steht auch so im Kommentar.
- Im Browser gemessen (Playwright, nicht im Repo, weil es einen laufenden Server braucht):
  sechs Verhaltensweisen — Erststart, neue Fassung sofort nach dem Deploy, offline aus dem
  Cache, Funkloch mit greifender Frist, Nachschub landet trotzdem im Cache, danach wieder
  die neue Fassung. Der alte Worker fällt genau bei Nummer vier durch (27 942 ms statt
  2 559 ms), die anderen fünf bestehen beide — der Unterschied liegt also wirklich dort.

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
   17 Stilregeln (`stil-*`) und die 26 Formulierungsregeln (`form-*`). **Die 20 unbelegten
   `gram-` und `satz-`Regeln sind am 16.09.2026 durch** (siehe „Zuletzt geändert"); von den
   35 nennen jetzt 19 eine Quelle, der Rest ist gelesen und hat nichts hergegeben. Die
   Grundsatz-3-Frage für stil und form — sind Empfehlungen als Empfehlungen gekennzeichnet? —
   ist am 15.09.2026 beantwortet und in `tests/suite.js` festgehalten; offen sind dort nur
   noch die Belege. Vorgehen wie gehabt.

2. **Erledigt (21.09.2026): Zeichensetzung ist belegt.** Alle 17 Komma- und Zeichenregeln
   nennen eine Quelle; die letzte ohne war `komma-aufzaehlung`. Der alte Eintrag lautete:
   **Aus der alten Liste: restliche Zeichensetzung belegen.** Infinitivgruppen, Partizipgruppen,
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

**Der Service Worker, zum ersten Mal von Ende zu Ende nachgemessen.** Mit einem kleinen
Server im Kritzelordner, der auf Zuruf langsam wird oder schweigt (`srv.js`), und
`swtest3.js`. Ergebnis: Er tut genau das, was in CLAUDE.md steht.

| | |
|---|---|
| Erster Start mit Netz | Worker registriert, `/` im Cache (721 506 Zeichen) |
| Netz tot | App startet in **54 ms**, alle 379 Übungen da |
| Netz sehr langsam (Rumpf über 8 s) | Seite steht nach **2550 ms** — die Frist von 2500 ms greift auf die Millisekunde, der Cache gewinnt |
| Korrektur im Netz | beim nächsten Start da |

Der dritte Fall ist der, für den der Umbau gemacht wurde: Ein `fetch()` gilt schon als
erfüllt, wenn die Kopfzeilen da sind — deshalb liest `netzSeite()` den Rumpf aus, bevor die
Antwort als „da“ zählt. Ohne das gewann das Netz die Frist und die App startete trotz
vollständiger Kopie erst nach einer halben Minute. Die 2550 ms belegen, dass es hält.

**Wichtig beim Nachbauen:** Den Server von Node aus schalten, nicht aus der Seite heraus.
Der Worker cacht jede erfolgreiche gleiche-Herkunft-Anfrage und sucht mit
`ignoreSearch:true` — ein Steuerendpunkt in der Seite wird deshalb beim ersten Aufruf
gecacht und danach nie wieder ans Netz gereicht. Mein erster Anlauf meldete daraus
„Korrektur fehlt“, obwohl sie ankommt.

**Der Spickzettel auf Papier.** Gemessen mit Druckemulation im Browser (`emulateMedia({media:
"print"})`, Spickzettel über den Knopf im Regelwerk öffnen):

- Aus dem dunklen Theme kam er **weiß auf weiß** — behoben, der Druckblock zieht die
  Farbtokens jetzt auf helle Werte. `tests/suite.js` rechnet den Druck seitdem als eigene
  Konfiguration mit, samt der Regel „jede Schriftfarbe muss gegen reines Weiß reichen“.
- **Kein Element läuft über die Seitenbreite**, bei 10 mm wie bei 20 mm Rand.
- **Jeder Abschnitt passt auf eine Seite**, `break-inside:avoid` kann also greifen. Aber die
  Luft ist knapp: Der höchste Abschnitt ist „5 · Satzbau in Kurzformeln“ mit 835 px gegen
  972 px nutzbare Höhe bei 20 mm Rand — **137 px übrig, also etwa vier Tabellenzeilen**. Der
  Abschnitt rendert eine Zeile je Satzbaukarte; wer `SATZ` über etwa 28 Karten hinaus
  erweitert, bekommt dort einen gesplitteten Abschnitt im Ausdruck.
- Eine Prüfung dafür gibt es bewusst nicht: Die Höhe hängt am Layout, und jeder Ersatzwert
  (Zeichenzahl, Zeilenzahl) misst etwas anderes als das, worauf es ankommt. Abschnitt 1 hat
  mehr Zeichen als Abschnitt 5 und ist trotzdem kürzer. Wer `SATZ` erweitert, misst mit dem
  Skript im Kritzelordner nach.

**Messen im Browser: Touch-Emulation nicht vergessen.** Zwei Messungen dieser Runde
hätten ohne sie das Falsche gesagt. Die Tippflächen: Ohne `hasTouch:true, isMobile:true`
greift `@media(hover:none)` nicht, und die Messung meldet 91 Flächen unter 44 px, die es
auf dem Handy nicht gibt — mit Emulation sind es null. Und die Kontraste: Der erste
Extraktor schnitt den hellen Themenblock bei `:root[data-theme="dark"]` ab, im CSS steht
aber `[data-theme="dark"]` ohne `:root`; dadurch waren beide Themes dunkel und die Prüfung
meldete null Fehler bei elf Fundstellen.

**Und: das Bild ansehen, nicht nur die Zahl.** Bei 320 px sagte die Rechnung „Titel passt“
(clientWidth = scrollWidth), der Screenshot zeigte „Deutsch-Traine“. Der Grund lag eine
Ebene höher: Das `b` ragte über sein `.brand`-Elternelement und lief unter die
Serien-Kachel. Genau dieser Vergleich hat auch entschieden, dass die Kopfknöpfe bei ≤360 px
auf 38 px bleiben — mit 44 passt der Name nicht mehr daneben.

**Rauchprobe im echten Browser.** Chromium liegt in dieser Umgebung unter
`/opt/pw-browsers`, Playwright unter `/opt/node22/lib/node_modules/playwright` — beides
außerhalb des Projekts, die Datei bleibt also abhängigkeitsfrei. Ein kurzes Skript im
Kritzelordner lädt `file://…/Deutsch-Trainer.html` bei 393×852, klickt jeden der sieben
Reiter an, tippt einen Text in den Textcheck, startet eine Unterwegs-Runde und meldet
Konsolenfehler sowie waagerechtes Scrollen. Die Prüfläufe laufen unter jsdom und sehen
zwei Dinge nicht: ob moderne Regex-Teile (`\p{L}`, Lookbehind) im Browser wirklich
greifen und ob die Seite bei Handybreite überläuft. Nach dem Umbau von `analyse()` war
genau das die Bestätigung, die gefehlt hat.


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
