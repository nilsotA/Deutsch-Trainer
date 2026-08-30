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

Alle sieben Prüfläufe sind grün. Sie sind inzwischen einmal vollständig gelaufen —
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
| Übungen | 375, davon 44 Tippaufgaben (unterwegs abfragbar: 331) |
| Regeln | 117 |
| Wortkarten | 143 |
| Fallkarten | 182, davon 164 in Satzform (173 Fassungen); abfragbar 165 |
| Satzbaukarten | 24 |
| Prüfmuster im Textcheck | 85 |
| Fehlersuchtexte | 12 mit 87 markierten Fehlern |
| Kartenbestand (`alleSchluessel()`) | 683 |
| Dateigröße | ~625 KB, eine Datei, kein Build (davon 8 KB App-Symbol) |

Die Zahl 331 stand hier lange für die Übungen und stimmte nicht — `ALL.length` war schon
vorher 371. Die Zahlen oben sind aus der laufenden App gerechnet, nicht abgeschrieben.
Der Langzeitlauf erreicht 609 statt 653 Karten: Die Differenz sind genau die 44
Tippaufgaben, die unterwegs herausgefiltert werden. Das ist so gewollt.

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

**Der Textcheck an Nils' eigenem Text gemessen** (30.08.2026). Bis hierher war jedes
Muster an konstruierten Sätzen geprüft — 73 richtige, 31 falsche, 85 Varianten, alle
von mir geschrieben. Diese Runde hat den Textcheck zum ersten Mal über einen echten,
zusammenhängenden Text von Nils laufen lassen: sein BFP-Portfolio, 862 Wörter.

**Ergebnis vorher: null Meldungen.** Beim Lesen stehen sieben fehlende Kommas darin.

```
übersehen  „… besser einschätzen kann wie man mit Schüler*innen umgeht.“
übersehen  „… möchte ich lernen Gruppendynamiken besser erkennen zu können.“
übersehen  „… und zu beobachten wie die Betreuer*innen … umgehen.“
übersehen  „… und diese animiert auch Freunden davon zu erzählen.“
übersehen  „… am besten lernen die Konflikte unter sich zu lösen.“
übersehen  „… Konflikte am besten lernen unter sich zu lösen.“
übersehen  „… helfen mir meine Lehrer-Persönlichkeit aufzubauen.“
```

Drei Ursachen, alle vom selben Typ:

- **`y11` kannte die falschen Verben.** In der Liste standen *versucht, beschlossen,
  vorgeschlagen* — allgemeine Verben, die ich beim Schreiben des Musters im Kopf hatte.
  Nils schreibt *lernen*, *helfen*, *animiert*. Kein einziges davon war drin.
- **`y11` konnte trennbare Infinitive nicht treffen.** `zu\s+[a-zäöüß]+en` findet
  „zu lösen“, aber nicht „aufzubauen“ — dort steckt das *zu* im Wort. Dabei steht
  „hereinzulassen“ als Beispiel in der eigenen Regel.
- **Für die fehlende indirekte Frage gab es überhaupt kein Muster.** „einschätzen kann
  wie man …“ ist ein Nebensatz ohne Komma und kommt bei ihm zweimal vor.

Dazu zwei Lücken, die erst die Trefferquotenreihe gezeigt hat: `-ern`/`-eln`-Infinitive
(*verlängern*, *sammeln*) fielen durch, und `y12` ließ kein Wort zwischen Verb und
Fragewort zu („zeigt **uns** wie man …“, „verstehe **nicht** wieso …“).

**Nachher: sieben Meldungen, alle sieben echt, kein Fehlalarm.** Gegengeprüft an
73 richtigen Sätzen, 297 Regelbeispielen und 21.792 Wörtern App-Text — dort meldet
keines der beiden Muster etwas.

Zwei Fehlalarme hat die Gegenprobe unterwegs abgefangen, bevor etwas in die Datei kam:

```
„die Kinder zu animieren und dafür zu sorgen“      zwei koordinierte Infinitivgruppen,
                                                   kein Komma dazwischen
„helfen steht mit Dativ — im Gegensatz zu unterstützen“   „zu“ ist hier Präposition
```

Der erste ist mit einem Rückblick `(?<!\bzu\s)` erledigt: Steht *zu* vor dem Verb, ist
das Verb selbst ein Infinitiv und nicht das regierende Verb. Den zweiten löst der
Gedankenstrich in der Sperrliste der Zwischenzeichen — ein Halbgeviertstrich trennt
Teilsätze genauso wie ein Komma.

**Neue Prüfung: Abschnitt „Fließtext“ in `tests/suite.js`.** Sieben echte Sätze, die
gefunden werden müssen, und 19 richtig gesetzte, bei denen nichts anschlagen darf.
Geprüft werden dort nur `hart` und `pruef` — `ugs`, `stil` und `form` beschreiben Ton
und Register und dürfen auf einem persönlich gehaltenen Praktikumsbericht ansprechen.

**Drei neue Aufgaben** zu genau diesen beiden Fehlern: `k42` (indirekte Frage),
`k43` (Vergleich mit *wie* ohne Verb — die Gegenprobe) und `k44` (erweiterte
Infinitivgruppe mit trennbarem Verb).

**Was das grundsätzlich heißt:** Prüfsätze, die derselbe Kopf schreibt wie das Muster,
verwenden dieselben Wörter — und finden deshalb genau die Lücken nicht, die zählen.
Fremder Text ist die einzige ehrliche Messung. Wenn Nils weitere eigene Texte hat,
sind sie das wertvollste Prüfmaterial im Projekt.

**Alle 84 Prüfmuster sind durchgeprüft** (29.08.2026). Die letzten 29 — 15 `stil`, 14
`form` — waren anders gelagert: Ein Fehlalarm ist dort begrifflich nicht möglich, weil
Stilhinweise auf korrektem Text ansprechen **sollen**. Geprüft wurde deshalb Trefferquote
und **Streubreite**.

**Streubreite, gemessen an 12.679 Wörtern echtem Fließtext** (den Regeltexten der App):

```
a04  3,6 Meldungen je 1000 Wörter   (sehr lange Sätze)
s01  1,8                            (Füllwörter)
s08  0,9                            (vage Mengenangaben)
alle übrigen  unter 0,9
```

Zwei Muster hatte ich vorab im Verdacht, zu breit zu streuen — `s08` („deutlich, mehrere,
oft“) und `f13` („Ich versuche“). **Beide Verdachtsmomente waren falsch.** Das breiteste
Muster ist `a04`, und 6,6 Prozent aller Sätze als „sehr lang“ zu melden ist für einen
Hinweis dieser Art angemessen. Kein Muster streut zu breit.

**Trefferquote: 28 von 29.** `s02` nicht:

```
still  „Das Verfahren kommt im Training zur Anwendung.“
```

Das Muster verlangte die Reihenfolge „zur Anwendung kommt“ — das ist die
**Nebensatzstellung**. Im Hauptsatz steht das gebeugte Verb an zweiter Stelle und das
Streckverb am Ende, und das ist die häufigere Form. Beide Stellungen sind jetzt erfasst,
dazu „findet Anwendung“ neben „Anwendung findet“. „Er findet die Anwendung gut“ bleibt
still — dort ist *Anwendung* ein gewöhnliches Objekt.

Korpora: **73 richtige Sätze, 85 Varianten.**

**Eine Warnung aus eigener Erfahrung:** Meine erste Probe für `s02` löste keinen Fehler
aus — die Mutation hatte gar nicht gegriffen, weil der Anker nicht passte. Das sah aus
wie eine bestandene Probe und war keine. **Eine Mutation, die still fehlschlägt, ist kein
Beleg.** Jedes Probeskript sollte prüfen, dass sein Anker genau einmal vorkommt, und sonst
abbrechen — wie die Patch-Skripte es tun.


**Die 22 `pruef`-Muster durchgeprüft — vier Befunde** (29.08.2026).

**`y08` war in beide Richtungen falsch:**

```
pruef y08  „Sie sprach etwas leise.“          ← korrekt, Adverb
pruef y08  „Er hat viel bessere Chancen.“     ← korrekt, Adjektiv vor Substantiv
still      „Er hat etwas neues ausprobiert.“  ← der eigentliche Fehler
```

Ursache: Das Muster verlangte **vier Zeichen vor der Endung** — „neu“ hat drei, also fiel
der Hauptfall durch. Und es nahm die Endung `-e` mit, die bei Adverbien und attributiven
Adjektiven steht. Substantivierte Adjektive nach *etwas, nichts, alles* tragen **`-es`**;
das trennt sauber. Dazu den Satzanfang geöffnet, sonst wäre „Alles wichtiges …“ weiter
durchgelaufen.

`y07` meldete „Im weiteren Verlauf“ und „Im folgenden Kapitel“ — dort ist das Wort ein
Adjektiv vor einem Substantiv. Folgt ein großgeschriebenes Wort, ist es keine
Substantivierung.

`t12` meldete jede direkte Frage mit „fragte“: **„Wer fragte das?“ ist korrekt.** Die
indirekte Frage hat ein Komma vor dem Fragewort.

`a06` meldete „Das Obst ist **faul** geworden“ — wörtliche Bedeutung, kein Etikett für
Menschen. Die übrigen vier Wörter der Liste gibt es nur über Personen.

Die übrigen 18 `pruef`-Muster sind in beiden Richtungen geprüft und sauber.

Korpora: **71 richtige Sätze, 80 Varianten.**


**Drei Muster verwechselten Dativ und Akkusativ** (29.08.2026). Die letzte Runde durch die
harten Muster fand noch drei Fehlalarmklassen, alle mit derselben Ursache: **„uns“ und
„euch“ sind Dativ und Akkusativ zugleich.**

```
hart  x21  „Das interessiert uns sehr.“        ← korrekt, uns ist Akkusativ
pruef x22  „Das kostet uns viel Zeit.“         ← korrekt
ugs   x20  „Er ruft uns zu, dass es losgeht.“  ← korrekt, zurufen + Dativ
```

*interessieren* und *kosten* verlangen den **Akkusativ** der Person — und genau der steht
in diesen Sätzen. Eindeutig dativisch sind nur *mir, dir, ihm, ihnen*.

`x20` hatte zusätzlich ein Verbproblem: Es prüfte nur „rufen + Dativ“ und traf damit
*zurufen* und *nachrufen*, die den Dativ zu Recht verlangen. Gemeint ist *anrufen* — bei
den finiten Formen erkennbar am abgetrennten „an“, beim Partizip an der Wortstellung.
**Nebenwirkung: Das Muster fängt jetzt auch den Imperativ „Ruf mir an!“**, die häufigste
Form dieses Fehlers, die vorher durchlief.

Die übrigen zwölf Muster (`x05`–`x07`, `x11`–`x13`, `x15`, `x16`, `x25`, `x27`, `t01`–`t04`,
`t06`, `a01`) sind in beiden Richtungen durchgeprüft und **sauber**. Damit ist die Suche
auf der Ebene der harten und umgangssprachlichen Muster ausgeschöpft.

Korpora: **61 richtige Sätze, 69 Varianten.**

### Bilanz der Textcheck-Runden

Sechs Anläufe, und das Bild ist vollständig genug für eine Aussage:

| Fund | Muster |
|---|---|
| Meldete korrektes Deutsch als Fehler | `x18`, `x17`, `x24`, `x26`, `x21`, `x22`, `x20` |
| Zu scharfer Schärfegrad (ugs als „Fehler“) | `x01`, `x02`, `x03`, `x04`, `x05`, `x20` |
| Übersah den Fehler am Satzanfang | `y03`, `x20`–`x24`, `t06`, `y05`, `x23` |
| Übersah gebeugte Formen | `x08`, `x09`, `x10`, `x14` |
| Fand die eigene Musterformulierung nicht | `y10` |
| Kannte die Wörter nicht, die Nils wirklich schreibt | `y11` |

**Die Ursache ist immer dieselbe:** Ein Regex keilt auf ein Wort, ohne den Kontext zu
prüfen. „seit ihr“, „seid dem“, „in 2000“, „mass“, „uns“ — jedes davon ist in einer Lesart
ein Fehler und in einer anderen einwandfrei. Wer ein Muster schreibt, sollte zuerst fragen:
**In welchem korrekten Satz kommt diese Zeichenfolge auch vor?** Und seit der
sechsten Runde die Gegenfrage dazu: **Welche Wörter benutzt Nils für diesen Fehler —
und nicht ich?** Die erste Frage verhindert Fehlalarme, die zweite verhindert Lücken.
Nur die zweite lässt sich an konstruierten Sätzen nicht beantworten.


**Zwei weitere Fehlalarme, vier Beugungslücken** (29.08.2026). Die Suche in den übrigen
harten Mustern hat wieder in beide Richtungen etwas gefunden.

```
hart x24  „Das Trainingslager fand in 2000 Metern Höhe statt.“   ← korrekt
hart x26  „Er mass die Strecke sorgfältig aus.“                  ← korrekt
```

`x24` sollte den Anglizismus „in 2026“ fangen und nahm **jede Zahl zwischen 1900 und
2099 nach „in“** — auch Höhenangaben, die im Sport nicht selten sind. Folgt ein
großgeschriebenes Wort, ist es eine Menge und kein Jahr; das schließt Maßangaben aus,
ohne „In 2026 beginnt …“ zu verlieren.

`x26` führte **„mass“ als Schweizer Schreibung** — es ist aber das Präteritum von
*messen*. Als Schweizer Form käme es großgeschrieben als Substantiv; das ist den
Fehlalarm nicht wert, also gestrichen.

**Beugungslücken:** Vier Muster endeten auf `\b` und übersahen jede gebeugte Form —
„Standarts“, „seperate“, „vorraussichtlich“, „Rückrads“. Alle vier geöffnet.

Bei *Standart* bleibt es bewusst bei der s-Form: **„Standarte“ und „Standarten“ sind
eigene, richtige Wörter.** Das wäre beim ersten Entwurf beinahe ein neuer Fehlalarm
geworden — der Isolationstest hat ihn vor dem Einbau gefangen. Das ist der Grund, warum
neue Muster erst isoliert geprüft und dann eingebaut werden.

Korpora: **50 richtige Sätze, 51 Varianten.**

**Zwischenstand der Fehlalarmsuche.** Fünf harte Muster haben Nils korrektes Deutsch als
Fehler angezeigt: `x18` (seit ihr), `x17` (Ihr seid dem …), `x24` (in 2000 Metern),
`x26` (er mass) — dazu vier Muster mit zu scharfem Schärfegrad. Vier Anläufe, jedes Mal
ein Fund. Wer weitersucht, wird vermutlich weiter fündig.


**Trefferquote: Sechs Muster fanden die Hälfte ihrer Fälle nicht** (29.08.2026).

```
x01 wegen      2/8      x04 Komparativ  3/14
x02 trotz      2/5      x17 seid        2/7
x03 während    2/5      x23 n-Dekl      2/10
```

Die Genitivpräpositionen fingen nur `dem/den/einem` — **„wegen meinem Bruder“, die
häufigere Form, lief durch.** `x04` kannte 18 Komparative, die Hälfte der geläufigen
fehlte. `x23` kannte 28 schwache Maskulina ohne *Nachbar*, *Dozent*, *Referent*.

**Schwerer wiegt `x17`.** Das Muster meldete fünf korrekte Sätze als klaren Fehler:

```
hart x17  „Ihr seid dem Verein beigetreten.“    ← korrektes Deutsch
hart x17  „Ihr seid der Einladung gefolgt.“     ← korrektes Deutsch
hart x17  „Ihr seid Anfang Mai dabei gewesen.“  ← korrektes Deutsch
```

Dort ist „seid“ die **Verbform** und „dem“ ein Dativobjekt, keine Zeitangabe. Dasselbe
Muster wie bei `x18`: auf ein Wort gekeilt, ohne den Kontext zu prüfen. Neu blockt ein
Rückblick auf ein vorangehendes „ihr“ die Verbform aus; die verwechselte Präposition am
Satzanfang bleibt erfasst. Gegen elf Fälle geprüft.

Alle sechs Muster jetzt vollständig: **47 von 47 Varianten.** Bewusst draußen geblieben:
„trotz allem“ (standardsprachlich) und *Erbe* (»dem Erbe« ist als Neutrum korrekt).

**Zwei neue Absicherungen:** eine Trefferquotenprüfung mit 39 Varianten — wer eine
Wortliste in einem Muster erweitert, erweitert die Reihe mit — und sechs Sätze mehr im
sauberen Korpus, darunter die `x17`-Falle.

**Damit ist ein Bild vollständig:** Drei harte Muster — `x18`, `x17` und (als Schärfegrad)
`x01`/`x04`/`x05`/`x20` — haben Nils korrektes oder bloß umgangssprachliches Deutsch als
Fehler angezeigt. Alle drei Befunde kamen erst heraus, als jemand gezielt danach suchte;
keiner davon wäre im Betrieb aufgefallen, weil ein Textcheck, der zu viel meldet, wie ein
gründlicher Textcheck aussieht.


**Der Textcheck bekommt die dritte Stufe** (29.08.2026). Beim Prüfen der Trefferquote kam
etwas Grundsätzlicheres heraus: Die App kennt in Beispielen drei Stufen — `ok`, `ugs`,
`nope` —, der Textcheck kannte sie nicht. Dort stand alles Nichtstandardsprachliche als
**„Klarer Fehler“**.

Damit widersprach sich die App an vier Stellen selbst. Sie zeichnet „wegen dem Wetter“,
„größer wie“, „als wie“ und „Ich rufe dir an“ **orange als verbreitet und nicht falsch**
aus — und meldete dieselben Formen im Textcheck als klaren Fehler. Bei `x20` stand der
Widerspruch sogar **im eigenen Hinweistext**: „Der Dativ ist südwestdeutsch und
schweizerisch verbreitet“, Schärfegrad `hart`.

Neu ist die Stufe **`ugs` („Umgangssprachlich“)** in `--gold`, mit eigener Markierung im
Text, eigener Karte und eigenem Filterknopf. Sechs Muster umgestuft: `x01` (wegen), `x02`
(trotz), `x03` (während), `x04` (größer wie), `x05` (als wie), `x20` (anrufen + Dativ).

Für *trotz* und *während* gab es keinen App-internen Beleg, also nachgeschlagen: Der Duden
führt den Dativ bei beiden als umgangssprachlich beziehungsweise landschaftlich, besonders
süddeutsch — nicht als falsch. Bei Pluralen ohne erkennbaren Genitiv ist der Dativ sogar
standardsprachlich nötig.

**Neue Prüfung:** Kein hartes Muster darf eine Form melden, die in einer Regel oder
Satzkarte orange ausgezeichnet ist. Die Fehlalarmprüfung deckt die neue Stufe mit ab —
eine `ugs`-Meldung auf korrektem Standarddeutsch wäre genauso falsch wie eine harte.

**Nebenbefund:** Der Erklärtext des Textchecks nannte fest verdrahtet „78 Muster“; es sind
84. Die Zahl wird jetzt aus dem Bestand gerechnet.

**Was das über die Trefferquote sagt:** Ich bin losgezogen, um zu prüfen, ob die harten
Muster genug Varianten desselben Fehlers finden — und habe stattdessen festgestellt, dass
sechs von ihnen den falschen Schärfegrad hatten. Die eigentliche Trefferquote ist damit
**weiterhin ungeprüft**; sie steht in der Ideenliste.


**Alle 84 Prüfmuster sind als wirksam belegt** (29.08.2026). Nach dem `x18`-Befund war
offen, ob die übrigen Muster überhaupt greifen. Sie tun es größtenteils — und das ließ
sich ohne Handarbeit zeigen: **Die Ablenker der Aufgaben und die Fehlersuchtexte sind
bewusst fehlerhaftes Deutsch.** 60 der 84 Muster belegen sich daran von selbst, ohne
Pflege.

Für die übrigen 19 habe ich je einen Satz geschrieben und vor dem Einbau getestet.
18 griffen sofort. Einer nicht:

```
y10 alt:  /,\s*wo\s+[a-zäöüß]+\s+(hat|ist|war|kann|…)\b/g
still bei „Der Trainer, wo das gesagt hat, ist neu.“
```

Zwischen „wo“ und dem gebeugten Verb war nur **ein** Wort erlaubt; die häufigste Form ist
aber das Perfekt. Das Bemerkenswerte: **Genau dieser Satz steht als Beispiel in der Regel
`gram-relkasus`.** Das Muster fand die eigene Musterformulierung der App nicht. Jetzt ist
ein Partizip dazwischen erlaubt — „wo wir trainieren“ und „wo die Halle steht“ bleiben
weiter still.

**Neue Prüfung:** Jedes Prüfmuster muss irgendwo etwas finden — im eigenen falschen
Material oder im Handkorpus. Die Hauptquelle pflegt sich selbst mit; nur was dort nicht
vorkommt, braucht einen Satz von Hand. Der Handkorpus ist von 12 auf **31 Sätze**
gewachsen.

Damit stehen im Textcheck jetzt drei Prüfungen nebeneinander, die sich ergänzen:

| Prüfung | Frage | Quelle |
|---|---|---|
| Fehlalarm eigener Bestand | Meldet ein Muster auf eigenem korrektem Text? | 653 Einträge |
| Fehlalarm fremder Text | Meldet es auf Deutsch, das die App nie sah? | 40 Sätze von Hand |
| Wirksamkeit | Findet es überhaupt irgendwo etwas? | Ablenker + Fehlersuchtexte + 31 Sätze |


**Ein hartes Muster stand genau verkehrt herum** (29.08.2026). Die zwei Kandidaten aus
meiner eigenen Ideenliste — *seit/seid* und n-Deklination — gab es längst (`x17`, `x18`,
`x23`). Die Notiz war geraten, nicht nachgesehen. Beim Nachsehen kam Schlimmeres heraus:

```
x18 alt:  /\bseit\s+ihr\b/g        (ohne i-Flag)

  hart x18  „Das ist so, seit ihr gewonnen habt.“        ← korrektes Deutsch
  hart x18  „Es geht bergauf, seit ihr Vater trainiert.“ ← korrektes Deutsch
  still     „Seit ihr schon da?“                          ← der echte Fehler
```

Der Fehler steht fast immer am Satzanfang, also groß — kein Treffer. Getroffen hat es nur
die Kleinschreibung mitten im Satz, und dort ist „seit ihr“ in aller Regel richtig. Ein
**hartes** Muster, das korrektes Deutsch anklagt und den Fehler durchlässt.

Neu: `/\bseit\s+ihr\b[^,.!?;—–]*\?/gi` — nur die Frageform ohne trennendes Zeichen. Vor
dem Einbau isoliert gegen elf Fälle geprüft. **Eine Lücke bleibt bewusst:** „Seit ihr
sicher, dass …?“ wird vom Komma abgeschnitten. Bei einem harten Muster ist Genauigkeit
wichtiger als Vollständigkeit — ein falscher Vorwurf kostet mehr als ein übersehener Fehler.

**Es war kein Einzelfall.** Acht weitere Muster hatten dieselbe blinde Stelle: `y03`
(„Weil ich hab keine Zeit“), `x24` („In 2026“), `t06` („Von 1990–1995“), `y05` („Der
gleiche Fehler“), `x23` („Dem Kollege“), `x21`, `x22`, `x20`. Alle geöffnet — jeweils nur
der erste Buchstabe, etwa `[Ww]eil`. **Ein pauschales `i`-Flag wäre falsch:** `a05`
(Genitivkette) und `x23` (Substantivliste) sind auf Großschreibung angewiesen und würden
damit unbrauchbar.

**Warum das überleben konnte — und was jetzt dagegen steht.** Der Fehlalarmkorpus bestand
aus dem *eigenen Bestand* und deckt nur ab, was die App ohnehin enthält. „seit ihr“ kam
nirgends vor, also fiel nichts auf. Zwei neue Korpora in `suite.js` ergänzen sich:

- **40 richtige Sätze**, von Hand geschrieben, die die App nie gesehen hat. Kein Satz darf
  eine Meldung auslösen.
- **12 falsche Sätze** mit dem Muster, das sie fangen muss — jeweils **am Satzanfang**, in
  der Schreibung, in der sie am ehesten vorkommen. Ein Muster, das nichts findet, fällt
  sonst nirgends auf.

Beide gegen eingebaute Fehler geprüft. **Wer ein Muster ergänzt, schreibt in beide Korpora
einen Satz**: einen, der knapp danebenliegt, und einen, der getroffen werden muss.


**Textcheck: erst das Netz, dann die Muster** (29.08.2026). `tests/suite.js` prüfte bis
dahin nur die **harten** Muster gegen den eigenen korrekten Bestand. Die 23 `pruef`- und
14 `form`-Muster liefen ohne Absicherung — wer dort ein Muster ergänzte, arbeitete ohne
Netz.

**Die angekündigte Ausweitung „auf alle weichen Muster“ wäre so falsch gewesen.** Beim
Messen zeigte sich: Stilhinweise *sollen* auf korrektem Text ansprechen. „man muss“,
Füllwörter und „Es gibt“ am Satzanfang sind einwandfreies Deutsch, über das die App
trotzdem etwas sagen will. Sie einzubeziehen hieße, die App entgegen Grundsatz 3
umzuschreiben. Die Prüfung deckt jetzt **hart, pruef und form** ab und lässt **stil**
bewusst aus — mit dieser Begründung im Test, damit es niemand später „repariert“.

Die drei verbliebenen Treffer sind **Lehrstücke**: Karten, die das Phänomen selbst
behandeln und es enthalten müssen. Die Wortkarte zu *scheinbar/anscheinend* kommt ohne
„scheinbar“ nicht aus. Sie stehen einzeln in `LEHRSTUECK`, je mit Grund; löst ein Eintrag
nichts mehr aus, meldet der Lauf ihn als Karteileiche.

**Zwei neue Prüfmuster** (82 → 84), beide an dem, was in dieser Sitzung dazukam:

- **`y11`** (pruef) erkennt eine erweiterte Infinitivgruppe ohne Komma. Vorher fing nur
  `y02` den Fall „um … zu“ — die eigentliche Änderung von 2024 war ungedeckt. Vor dem
  Einbau **isoliert gegen zwölf Fälle geprüft**: trifft „Er hat versucht die Prüfung zu
  bestehen“, bleibt still bei gesetztem Komma, bei bloßem *zu* + Infinitiv und bei den
  Ausnahmen nach *brauchen* und *scheinen*.
- **`x27`** (hart) erkennt „Reflektion“.

Beide lösen auf dem eigenen korrekten Bestand nichts aus — geprüft durch das Netz von
oben, das genau dafür zuerst gespannt wurde.

**`normen.js` hat dabei mein eigenes Muster gefangen:** Der Hinweis von `y11` enthält
„immer“ und „2024“. Beides ist belegt und eingetragen, statt die Prüfung zu umgehen. Die
Registrierpflicht greift also auch gegen den, der sie geschrieben hat.


**Die zehn ungeprüften Satzformen geschlossen** (29.08.2026). Acht von zehn sind jetzt
maschinell abgedeckt, **163 → 171 von 173 Fassungen**. Die letzten zwei sind gar kein Fall
für eine Formentabelle.

Adjektive und Pronomen tragen dieselben Endungen wie die Artikel. `tests/formen.js` leitet
sie deshalb jetzt aus **Stamm und Endung** ab, statt sie einzeln aufzuzählen:

| Endung | Fälle | warum |
|---|---|---|
| `-em` | Dativ | stark, maskulin und neutrum |
| `-en` | alle vier | Akk. mask., Dat. Plural, Nom. Plural schwach, Gen. Sing. schwach |
| `-er` | N, D, G | **nie Akkusativ** |
| `-es` | N, A, G | Nom./Akk. neutrum, dazu Genitiv |
| `-e` | N, A | Dativ wäre -en oder -er, Genitiv -er oder -en |

**Die Stämme stehen einzeln da** (`nächst`, `besser`, `angefangen`, `all`) — mit Absicht.
Eine reine Endungsregel würde auf gewöhnliche Substantive zugreifen: „Trainer“ endet auf
-er, ist aber keine Fallform. Wer eine Karte mit neuem Adjektiv schreibt, trägt den Stamm
nach und bekommt sonst einen Fehler.

Dazu die Personalpronomen: `ihr` ist Dativ feminin, zugleich Possessiv und zweite Person
Plural (also N/A/D); `sie` ist **nie** Dativ. Damit sind `danken` und `zuhören` abgedeckt.

**Offen bleiben zwei Fassungen — und das ist keine Lücke:** `nach (Richtung)` und
`bei (Ort)`. Dort steht nicht eine Fallform gegen eine andere, sondern eine **Präposition
gegen eine andere**. Beide regieren den Dativ; über den Fall entscheidet das nicht, also
kann keine Formentabelle es beurteilen. Sie stehen namentlich in `PRAEPWAHL`, damit eine
neue unbeurteilbare Fassung auffällt, statt in derselben Zahl zu verschwinden — und die
Liste muss aktuell bleiben, sonst meldet der Lauf eine Karteileiche.

Gegen drei eingebaute Fehler geprüft: Dativform als richtige Antwort bei einem
Akkusativ-Item, zweiter Dativ als Ablenker, „sie“ als Dativ. Alle drei fallen auf — **die
Erweiterung deckt nicht nur ab, sie entscheidet auch.**

Nebenwirkung: `tests/inhalt.js` teilt dieselbe Tabelle und prüft jetzt 121 statt 115
Fallkarten gegen ihre Beispiele.


**Wortschatz von 116 auf 143 Karten** (29.08.2026). Gewählt entlang dessen, was Nils
tatsächlich schreibt — Hausarbeiten, Praktikums- und Forschungsberichte, Reflexionen:

- **Neun Verwechslungspaare.** Die verhindern Fehler, nicht nur Lücken:
  Reflexion/reflektieren, Korrelation/Kausalität, Hypothese/These, wieder/wider,
  seit/seid, Effekt/Affekt, Prävention/Intervention, quantitativ/qualitativ,
  Methode/Methodik.
- **Zehn Verben des Argumentierens:** verorten, erörtern, darlegen, herleiten, abgrenzen,
  gegenüberstellen, veranschaulichen, gewichten, präzisieren, aufgreifen.
- **Acht Begriffe der empirischen Arbeit:** Befund, Stichprobe, Konstrukt, Implikation,
  Spannungsfeld, Indikator, Genese, Evidenz.

Zwei Karten sind belegt statt behauptet. **„Reflektion“ ist laut Duden eine
Falschschreibung** — das Substantiv kommt über das französische *réflexion* von *reflexio*,
das Verb von *reflectere*, daher x gegen kt. Für ein Portfolio voller Reflexionen die
nützlichste Karte des Stapels. Und **„Evidenz“ hat zwei Bedeutungen**: bildungssprachlich
die unmittelbare Einsichtigkeit, daneben — über das englische *evidence* — den empirischen
Beleg. Der Duden führt die zweite für Medizin und Pharmazie; manchen gilt sie als
Anglizismus, in der Wissenschaft ist sie samt „evidenzbasiert“ etabliert. Beides steht auf
der Karte, nichts davon als falsch.

Bei *qualitativ* steht bewusst ein **Stilhinweis statt eines Verbots**: „qualitativ
hochwertig“ ist verbreitet, „hochwertig“ genügt — Empfehlung, kein Fehler (Grundsatz 3).

**Dabei ein stiller Anzeigefehler gefunden.** Die Karte „kompliziert / komplex“ trug HTML
im Tücken-Feld. Das Feld geht bei der Ausgabe durch `esc()`, also stand dort wörtlich
`<b>fachliche</b>` auf dem Bildschirm. Kein Fehler, den ein Syntaxlauf sieht — und mir wäre
er beinahe selbst passiert, weil ich in einer neuen Karte dasselbe getan hatte.

Neue Prüfung in `suite.js`: **Kein Feld, das escapet ausgegeben wird, darf HTML enthalten.**
Geprüft werden Wortkarten, Fallkarten, Regeltitel und Satzkarten-Titel. Regeltexte (`r.b`)
und Satzkarten-Rümpfe (`x.b`) sind ausgenommen — die sind absichtlich HTML und werden nicht
escapet. Welche Felder escapet werden, lässt sich im Skript an den `esc(...)`-Aufrufen
ablesen; wer ein Feld neu escapet ausgibt, sollte es in die Liste aufnehmen.


**Der Lernstand auf dem iPhone** (29.08.2026). Nils benutzt die App über ein **Lesezeichen
in Safari**. Damit fällt sie unter die Sieben-Tage-Regel: Safari löscht seit iOS 13.4 den
gesamten skriptbeschreibbaren Speicher einer Seite, die sieben Tage lang nicht besucht
wurde — localStorage eingeschlossen.

Das ist für diese App der schlimmste denkbare Fall, und der bestehende Schutz greift dabei
**nicht**: Die Schreibwarnung (`#saveWarn`) meldet nur, wenn das *Schreiben* fehlschlägt.
Nach einer Löschung schreibt der Browser weiterhin einwandfrei — er hat nur nichts mehr zu
lesen. Die App sähe aus wie beim allerersten Start, ohne jede Meldung.

Zwei Vorkehrungen:

- `speicherBitten()` fragt beim Start `navigator.storage.persist()`. Abgesichert und still;
  wo es die Schnittstelle nicht gibt, passiert nichts.
- Der Datenbereich im Fortschritt sagt jetzt die Wahrheit über den Speicherzustand. Ohne
  Zusage nennt er die Frist und den Ausweg: **Teilen → Zum Home-Bildschirm.** Eine dort
  abgelegte Web-App zählt ihre eigenen Nutzungstage und fällt nicht unter die Frist
  (so beschreibt es WebKit selbst). Ohne Zusage erinnert die App außerdem früher ans
  Sichern — nach 5 statt 14 Übungstagen, und alle 14 statt alle 30 Tage.

**Der Haken beim Umzug auf den Startbildschirm:** Eine Web-App dort bekommt einen **eigenen
Speicher**, getrennt von Safari. Der bisherige Lernstand ist dort nicht vorhanden. Der Weg
ist also: in Safari sichern, auf dem Startbildschirm ablegen, dort die Sicherung laden.
Genau das steht auch im Hinweis.

**Beim Prüfen selbst in die Falle getappt** (Abschnitt 6 der Arbeitsanweisung). Mein erster
Probelauf griff auf `#v-fort` zu — die ID heißt `v-fortschritt`. Der Fallback war
`document.body`, und dessen `textContent` enthält den **Quelltext des Skripts**. Der Test
meldete den Hinweis als vorhanden und zeigte rohe Verkettungszeichen (`'+`) im „Text“. Der
Prüflauf misst jetzt an `#statHost` und hat eine eigene Prüfung dagegen, dass keine rohe
Verkettung im angezeigten Text landet.


**Handy und Web-App** (29.08.2026). Die App war schon ordentlich für das Handy gebaut —
44-px-Tippflächen, `100dvh`, Querlage-Abfragen, Eingabefelder mit 16 px gegen den
iOS-Zoom. Zwei Dinge waren trotzdem kaputt, und beide unsichtbar:

> Die App hatte **sechs Regeln mit `env(safe-area-inset-…)` — und keine davon wirkte.**

Die Insets liefern konstant 0, solange im Viewport-Meta `viewport-fit=cover` fehlt. Das
fehlte. Auf dem iPhone lag die Unterwegs-Leiste damit unter dem Home-Indikator, obwohl die
Regel dafür längst dastand. Beim Scharfschalten kam der zweite Fehler heraus:

```css
.srch input{padding:16px 16px calc(16px + env(safe-area-inset-top))}
```

Bei drei Werten ist der dritte das **untere** Padding — der Top-Inset saß also unten.
Beides behoben, dazu neu: `.head` hält Abstand zur Statusleiste, `.wrap` weicht in Querlage
seitlich der Notch aus.

**Touchbedienung beim Gehen.** Drei Ärgernisse, die einhändig besonders stören:
`overscroll-behavior` verhindert das versehentliche Neuladen mitten in der Runde,
`-webkit-tap-highlight-color` den grauen Blitz auf jedem Tipp, `user-select` die
Auswahllupe, wenn der Finger auf einer Antwort liegen bleibt. **Die Sperre liegt nur auf
Bedienelementen** — Regeltexte und Beispiele bleiben markierbar, und der Prüflauf hält das
fest.

**Web-App-Auszeichnung.** `theme-color` (folgt dem hellen und dunklen Thema über
`themeFarbe()`), die Apple- und die allgemeinen Meta-Angaben, Kurzname, Symbol.

Das Symbol ist ein weißes Komma auf dem Grün der App, 512×512, als PNG von Hand erzeugt und
eingebettet (5,7 KB). Vollflächiger Hintergrund, damit iOS und Android ihre eigene Maske
darüberlegen können. **Der Generator liegt bewusst nicht im Repo** — das Bild ist das
Ergebnis, nicht das Werkzeug; wer es ändern will, zeichnet neu.

Das **Manifest entsteht zur Laufzeit als Blob**. Eine eigene Datei würde die
Einzeldatei-Regel brechen; ein `data:`-Manifest kann `start_url` nicht auflösen, eine
Blob-URL hat denselben Ursprung wie die Seite und kann es. Vom Dateisystem aus (`file:`)
passiert bewusst nichts. Alles steht in einem `try` — die Auszeichnung ist Beiwerk.

**Was noch fehlt, und warum es nicht an der App liegt:** Zum Installieren muss die Datei
über **HTTPS ausgeliefert** werden. Aus dem Dateisystem heraus lässt sich weder unter iOS
noch unter Android etwas zum Startbildschirm hinzufügen, was sich wie eine App verhält.
Das ist eine Entscheidung über das Hosting, keine Codefrage — siehe Ideenliste.

**Neuer Prüflauf `tests/mobil.js`.** Kern ist Abschnitt A: **Jeder Inset muss auf seiner
eigenen Seite stehen.** Der Lauf zerlegt dafür auch Kurzschreibweisen (`padding` mit zwei,
drei oder vier Werten) und sagt offen, was er nicht beurteilen kann. Dazu die
Web-App-Angaben samt Gültigkeit von Manifest und PNG, die Touchregeln und die Feldgrößen.
Gegen vier eingebaute Fehler geprüft.

`setup.js` schreibt Blobs jetzt mit (`w.__blobs`), damit Prüfläufe hineinsehen können —
Export und Manifest entstehen beide als Blob.


**Dritte Farbstufe: umgangssprachlich ist nicht falsch** (29.08.2026). Die App kannte in
Beispielen nur zwei Auszeichnungen — `ok` (grün, richtig) und `nope` (rot, falsch). Alles
dazwischen stand zwangsläufig in Rot. Grundsatz 4 verlangt aber, Regionales und
Umgangssprachliches **einzuordnen statt abzustempeln, und überall gleich**.

Das hatte echte Widersprüche zur Folge:

- In `sa17` stand „das Auto von meinem Bruder“ in Rot und wurde **in derselben Zeile** als
  umgangssprachlich bezeichnet.
- „wegen dem Wetter“ stand in Rot, während `c:wegen`, `m01` und `satz-sprechen` es als
  verbreitet einordnen. Der Duden führt den Dativ nach *wegen* als umgangssprachlich und
  landschaftlich — ausdrücklich **nicht** als falsch.

Neu ist die Stufe `.ugs` in der Farbe `--warn`, in beiden Themes definiert. Sechs Formen
sind umgestellt (sieben Fundstellen). **Nicht** umgestellt, weil es echte Fehler sind:
„mit dem Kollege“ (n-Deklination), „mehr besser“ (doppelter Komparativ), „von 1990–1995“.
Die Regelansicht erklärt die drei Stufen jetzt in der Legende.

**Warum es niemandem aufgefallen ist.** Die Widerspruchsprüfung in `tests/suite.js` liest
nur *Worte* („ist falsch“), nicht *Auszeichnungen* — `strip()` entfernt die Tags. Die App
fällt ihr Urteil aber auf beiden Wegen. Zwei neue Prüfungen schließen das: Eine rot
markierte Form darf im unmittelbaren Umfeld nicht als umgangssprachlich bezeichnet werden,
und umgekehrt darf keine `ugs`-Form anderswo „ist falsch“ heißen.

**Alle 25 Variantenregeln sind belegt, `VAR_OFFEN` ist leer.** Dabei kam ein echter
Kasusfehler heraus:

> `gram-praepdat` führte **`ab`** unter „Diese Präpositionen verlangen immer den Dativ“.

Das stimmt nicht. Mit Artikelwort steht der Dativ („ab dem nächsten Montag“), ohne Artikel
gehen **beide** — der Duden führt „ab kommendem/auch kommenden Montag“. In Deutschland ist
dort der Akkusativ üblich, in der Schweiz der Dativ. `ab` steht jetzt bei den schwankenden
Fällen. Die waren ohnehin zu grob („dank, laut und binnen gehen mit Dativ und Genitiv —
beides ist korrekt“) und sagen jetzt, welcher Fall wann üblich ist: *dank* im Plural meist
Genitiv, *laut* heute meist Dativ und bei bloßem Plural zwingend („laut Berichten“),
*binnen* mit Dativ üblich und Genitiv gehoben.

`grammis`, `IDS Mannheim` und die `Variantengrammatik` zählen in `normen.js` jetzt als
anerkannte Quellen — für regionale Fragen sind sie oft besser als der Duden.

**Eine Falle beim Belegen selbst.** Mein eigener Belegsatz zu stehen/sitzen/liegen hat die
Widerspruchsprüfung ausgelöst: „Keine der beiden Formen **ist falsch**“ enthält „ist falsch“,
und die Wortliste sah die Verneinung nicht. Ein Freispruch ist kein Urteil — „nicht falsch“,
„nie falsch“ und „keine … ist falsch“ zählen jetzt nicht mehr mit. „nicht korrekt“ bleibt
bewusst ein hartes Urteil.


**Die acht `z-`Regeln durchgesehen** (29.08.2026). Damit sind alle 17 Regeln der
Zeichensetzung geprüft. Die vier Verdachtsfälle aus der letzten Ideenliste haben sich
alle bestätigt — und zwei davon waren ernster als gedacht.

**`p20` verstieß gegen Grundsatz 2 (kein Ablenker darf richtig sein).**

> „Was steht heute nach der Anrede im Brief?“ — Ablenker: *Ein Ausrufezeichen*, *Nichts*

Beide sind nicht sicher falsch: Der Duden lässt das Ausrufezeichen weiterhin zu (es wirkt
nur aus der Zeit gefallen), und in der Schweiz steht nach der Anredezeile gewöhnlich gar
kein Zeichen. Zwei von drei Optionen waren also vertretbar. Die Aufgabe fragt jetzt nach
der DIN 5008 für Geschäftsbriefe — dort ist das Komma eindeutig vorgesehen — und die
Ablenker sind *Ausrufezeichen* und *Punkt*, wobei der Punkt in keiner Fassung richtig ist.
`z-frage` und `komma-brief` sagen die Variante jetzt beide dazu, samt Schweizer Gebrauch.

**`k17` markierte eine zulässige Fassung als falsch.**

> „Er trug die neue, rote Trainingsjacke.“ — als falsch markiert

Der Duden sagt aber ausdrücklich, dass die Schreibende in Zweifelsfällen *durch Setzen oder
Weglassen verdeutlichen kann, was gemeint ist*. „neue rote Jacke“ ist genau so ein Fall:
ohne Komma die neue unter den roten, mit Komma neu und rot. Die Aufgabe steht jetzt auf
`das neue akademische Jahr` — ein fester Begriff, bei dem die Und-Probe eindeutig scheitert.
`komma-adjektive` beschreibt den Auslegungsbereich jetzt und trägt dafür das ◆ Varianten.

**Zwei Stellen waren Stil, die als Regel dastanden** (Grundsatz 3):

- `z-auslassung`: „Die Auslassungspunkte sind ein Zeichen (…), nicht drei Punkte
  hintereinander.“ Das amtliche Regelwerk spricht in § 99 selbst von **drei Punkten** und
  regelt ihren Gebrauch, nicht ihre Kodierung. Dass … ein eigenes Zeichen ist, ist eine
  typografische Empfehlung — richtig, aber keine Rechtschreibregel. Drei getippte Punkte
  sind kein Fehler, nur die schlechtere Form. `p17` und das Prüfmuster nachgezogen.
- `z-doppelpunkt`: „Häufiger Fehler: Doppelpunkt nach einem Wort, das die Aufzählung schon
  einleitet.“ Eine Regel, die ihn dort verbietet, gibt es nicht — die Suche fand keine.
  Steht jetzt als Stilhinweis da. `p06` fragt weiter „Was ist hier überflüssig?“, was schon
  vorher die richtige Formulierung war.

**Neuer Abschnitt E in `tests/normen.js`: Variantenregeln nennen eine Quelle.** Er gilt für
den **ganzen Bestand**, nicht nur die Zeichensetzung. Begründung: Wenn die App ein
◆ Varianten an eine Regel heftet, behauptet sie „hier gilt mehr als eine Form“ — die
schärfste Aussage, die sie über eine Streitfrage machen kann. Geprüft wird genau die Menge,
die die App selbst mit `hatVarianten()` auszeichnet.

Dabei kam eine Altlast heraus: **Sieben von 25 Variantenregeln stehen ohne Quelle da** —
`gram-kongruenz`, `gram-alswie`, `satz-perfekt`, `satz-sprechen`, `gram-relkasus`,
`gram-genalltag`, `gram-praepdat`. Sie stehen in `VAR_OFFEN` als sichtbare Schuld. Die Liste
**darf schrumpfen, aber nicht wachsen**: Eine neue Variantenregel ohne Beleg fällt auf, und
wer eine der sieben belegt, muss sie austragen — sonst meldet der Lauf eine Karteileiche.
Beide Richtungen sind gegen eingebaute Fehler geprüft.

Das ist die naheliegendste nächste Arbeit: sieben Regeln, klar benannt, mit einem Prüflauf,
der den Fortschritt selbst nachhält.


**Kommaregeln auf die Fassung 2024 gebracht** (29.08.2026). Das amtliche Regelwerk gilt
seit dem **1. Juli 2024** in neuer Fassung, und im Kapitel Zeichensetzung hat sich die
Kommaregel bei Infinitivgruppen geändert. Die App stand noch auf dem alten Stand.

Neu (§ 73 der Fassung 2024): Eine **erweiterte** Infinitivgruppe — `zu` + Infinitiv und
mindestens ein weiteres Wort — wird **immer** mit Komma abgetrennt, auch ohne Einleitewort
und ohne hinweisendes Wort. Freigestellt bleibt das Komma nur bei der nicht erweiterten
Gruppe, also bei bloßem `zu` + Infinitiv. Keine Kommas nach *brauchen, pflegen, scheinen*.

- **`k20` lehrte die falsche Antwort.** Die Aufgabe „Er hat versucht(,) pünktlich zu sein“
  hatte „Komma ist erlaubt, aber nicht zwingend“ als richtig markiert. „pünktlich zu sein“
  ist erweitert — das Komma ist Pflicht. Die als falsch markierte Option war die richtige.
- `komma-infinitiv` neu geschrieben: Unterscheidung erweitert / nicht erweitert, Datum der
  Änderung, Ausnahme, Quelle im Text.
- `k41` neu als Gegenprobe („Er hat versucht(,) zu kommen“ — nicht erweitert, freigestellt).
  Ohne den Kontrast liegt Überkorrektur nahe.
- Spickzettel und der Hinweistext von `y02` nachgezogen.

**Die alte Terminologie war der eigentliche Fehler.** Die App nannte den freigestellten Fall
„einfache Infinitivgruppe ohne Einleitewort“ und meinte damit das Fehlen des Einleitewortes.
Das amtliche Kriterium ist aber die *Erweiterung*, nicht das Einleitewort. Wer das
verwechselt, kommt bei „pünktlich zu sein“ zwangsläufig auf das falsche Ergebnis.

**Neuer Prüflauf `tests/normen.js`.** Die Fehlerklasse: Eine normative Aussage steht an vier
Stellen — Regel, Übung, Spickzettel, Textcheck — und veraltet an einer davon, ohne dass es
auffällt. Der Lauf erzwingt keine Richtigkeit, sondern Bewusstheit:

- Jede **absolute Aussage** (immer, nie, stets, grundsätzlich, ausnahmslos) in der
  Zeichensetzung muss in `ABS_OK` eingetragen sein, mit Begründung. „fast immer“ zählt nicht.
- Jede Regel mit **Kann-Aussage** muss eine Quelle nennen. Übungen und Prüfmuster erben den
  Beleg über ihren Regelverweis.
- Jede **Jahreszahl** in normativem Zusammenhang muss in `JAHR_OK` stehen. Beispielsätze wie
  der Bis-Strich „1990–1995“ bleiben außen vor — der Kontext entscheidet.
- Der **Spickzettel** wird gegen die Regeln gehalten, weil er von Hand wiederholt. Genau dort
  hatte die alte Einteilung überlebt, nachdem die Regel schon ersetzt war.

Gegen vier eingebaute Fehler geprüft: unbelegte Kann-Regel, alte Spickzettel-Einteilung,
neue absolute Aussage, undatierte Jahresbehauptung. Alle vier fallen auf. Der Lauf hat beim
Einschalten sofort zwei Fundstellen gemeldet, die vorher niemand angesehen hatte (`t06`,
`y02`) — beide geprüft und eingetragen.

**Weiter berichtigt und belegt:**

- `komma-partizip` und `k29` sagten „seit 2006“. Die Freistellung stammt aus der Reform von
  **1996**; die Fassung 2024 ändert daran nichts. Datum berichtigt, Beleg dazu.
- `komma-nebensatz` hieß „Nebensätze werden **immer** abgetrennt“. Ergänzt sind die zwei
  Fälle, die das Raster sprengen: der **uneingeleitete** Nebensatz („Er sagte, er komme
  später“ — Verb an zweiter Stelle, Komma trotzdem) und die **formelhafte Verkürzung**, bei
  der das Komma wegfallen darf (§ 76: „Sag(,) wenn möglich(,) vorher Bescheid“). Faustregel
  laut Duden: ab etwa vier Wörtern Kommas setzen.
- `komma-hauptsatz` sagte „Komma Pflicht“ zwischen zwei Hauptsätzen. **Semikolon und Punkt
  gehen genauso** — nur gar kein Zeichen geht nicht. `k37` nachgezogen.
- `komma-hauptsatz` und `k09` tragen den Beleg zur Freistellung von 1996.
- `k19` sagte „Nebensätze werden immer abgetrennt“ — umformuliert.

**Achtung bei Paragrafennummern.** Die Zählung des Regelwerks wurde 2024 neu vergeben. Ältere
Fundstellen im Netz zitieren § 71–73 für die gleichrangigen Teilsätze, in der Fassung 2024 ist
§ 73 die Infinitivregel. Wer eine Nummer übernimmt, muss die Fassung dazuschreiben. Steht auch
als Hinweis in `komma-hauptsatz`.


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
Stapelbalken über den ganzen Bestand von 652 Karten.

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
jetzt von beiden Läufen geteilt. Damit sind **163 der 173 Fassungen maschinell gegen ihren
Fall geprüft** und 66 Ablenker als eindeutig falsch bestätigt. Die restlichen zehn sind
Adjektivformen und die drei Karten zur Präpositionswahl; der Lauf sagt das offen dazu,
statt Deckung vorzutäuschen.

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
- **Zeichensetzung (neu):** Komma bei erweiterten Infinitivgruppen Pflicht seit 1.7.2024
  (Regelwerk 2024, § 73); Ausnahme nach *brauchen, pflegen, scheinen*; Freistellung bei
  Partizipgruppen seit der Reform von **1996**, nicht 2006; Freistellung vor *und/oder*
  zwischen Hauptsätzen seit 1996; formelhafte verkürzte Nebensätze dürfen ohne Komma
  stehen (§ 76); „von 1990–1995“ mischt zwei Schreibweisen und bleibt falsch

Der übrige Bestand beruht auf allgemeinem Sprachwissen und hat die maschinellen
Prüfungen bestanden, ist aber nicht einzeln belegt. Der Absatz „Stand der Prüfung“
im Regelwerk sagt das dem Nutzer auch so — **bitte aktuell halten**, wenn du
weiter belegst.

## Ideenliste

Nach Nutzen sortiert, nichts davon ist angefangen:

1. **Die App über HTTPS ausliefern, damit sie installierbar wird.** Die Auszeichnung ist
   fertig, es fehlt nur der Ort. Aus dem Dateisystem heraus kann weder iOS noch Android
   etwas zum Startbildschirm hinzufügen, was sich wie eine App verhält. GitHub Pages wäre
   der kurze Weg — das Repo ist allerdings privat, Pages für private Repos setzt einen
   bezahlten Plan voraus. Sobald ein Ort feststeht, lohnt zusätzlich ein Service Worker
   für echtes Offline-Caching; der braucht eine zweite Datei und bricht damit die
   Einzeldatei-Regel — das ist bewusst zu entscheiden, nicht nebenbei.

2. **Wortschatz weiter ausbauen.** 143 Karten sind ein guter Grundstock, aber der
   Bestand ist stark auf wissenschaftliches Schreiben ausgerichtet. Was fehlt, sind
   Wörter aus dem *mündlichen* Register — Nils unterrichtet und spricht in Praktika, und
   die App ist auf Alltagssprache angelegt. Am ergiebigsten wären Verwechslungspaare aus
   seinen eigenen Texten; dafür müsste er ein paar davon beisteuern, sonst rät man am
   Bedarf vorbei. Das BFP-Portfolio taugt dafür nur bedingt — es ist zu kurz und zu
   sauber im Wortschatz; die Fehler darin sind Zeichensetzung, keine Wortwahl.

3. **Mehr eigene Texte von Nils.** Das ist inzwischen der mit Abstand ergiebigste
   Punkt der Liste, und er kostet ihn wenig: eine Hausarbeit, ein Bericht, ein längerer
   Chatverlauf. Das BFP-Portfolio allein hat zwei blinde Stellen im Textcheck aufgedeckt
   und drei Aufgaben hervorgebracht — nach fünf Runden Prüfung an konstruierten Sätzen,
   die alle grün waren. Ein zweiter echter Text findet mit hoher Wahrscheinlichkeit
   wieder etwas, das kein Prüfsatz je gefunden hätte. Die Auswertung ist Routine
   geworden: Text durch `analyse()`, Funde gegenlesen, Lücken benennen, Muster
   nachziehen, Sätze in den Abschnitt „Fließtext“ in `tests/suite.js` aufnehmen.

4. **Textcheck: neue Muster ergänzen.** Alle 85 vorhandenen Muster sind in beide
   Richtungen durchgeprüft; die Absicherung steht (73 richtige Sätze, 101 Varianten,
   26 Fließtextsätze, Wirksamkeit, Stufenabgleich). Neue Muster sind damit billig
   geworden — was fehlt, ist nicht Technik, sondern Material. Siehe Punkt 3.

**Erledigt und deshalb hier gestrichen:** die Belege für die Zeichensetzung (alle 17
Regeln), die sieben unbelegten Variantenregeln, die zehn ungeprüften Satzformen und die
Web-App-Auszeichnung fürs Handy. Was davon offen blieb, steht oben in „Zuletzt geändert“
jeweils mit Begründung.

## Werkzeug, das nützlich war

- `nils-schreibstil` — Skill mit Nils' Schreibstil, abgeleitet aus seinem
  BFP-Portfolio. Nützlich, wenn Texte nach ihm klingen sollen.
- Web-Recherche für jede normative Aussage. Duden und DWDS liefern klare
  Variantenangaben, `grammis.ids-mannheim.de` gute Begründungen.
- **Achtung in der Cloud-Sitzung:** Dort war der direkte Seitenabruf gesperrt
  (`rechtschreibrat.com`, `duden.de`, `dwds.de`, `grammis`, Wikipedia — alle geblockt).
  Nur die Websuche ging. Das reicht zum Belegen, kostet aber mehr Runden: mehrere
  Suchen mit unterschiedlicher Formulierung, bis sich zwei bis drei unabhängige
  Quellen decken. Lieber eine Suche mehr als eine Aussage geraten.

## Was schiefgehen kann

Steht ausführlich in `CLAUDE.md`, Abschnitt 4 und 6. Die zwei teuersten Fallen:

- **Skript bricht ab, bevor geschrieben wird** — Änderungen gelten als erledigt,
  sind aber nie in der Datei gelandet. Nach jedem Schritt schreiben.
- **`\b` in nicht-rohen Python-Strings** — wird zum Steuerzeichen und macht
  Prüfmuster stumm, ohne dass die Syntax bricht. Vier Textcheck-Muster waren so
  eine Weile tot.
