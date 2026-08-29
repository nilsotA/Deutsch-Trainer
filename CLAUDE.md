# Deutsch-Trainer — Arbeitsanweisung

Einzeldatei-Lernapp für Nils (Lehramt Sport, Deutsche Sporthochschule Köln, deutscher
Muttersprachler). Ziel ist **sichere Alltagssprache**: Kasus, Satzbau, Komma,
Formulierungen — mündlich wie schriftlich. Kein DaF-Material.

**Die wichtigste Regel des Projekts:** Nils lernt mit dieser App. Eine falsche Regel ist
schlimmer als eine fehlende. Im Zweifel nachschlagen oder die Aussage abschwächen —
nie raten.

---

## 1 · Was hier liegt

```
Deutsch-Trainer.html      die komplette App (~627 KB, eine Datei, kein Build)
CLAUDE.md                 diese Datei
HANDOVER.md               Stand der Arbeit, offene Punkte, Ideenliste
tests/                    Prüfläufe (Node + jsdom); tests/formen.js ist die geteilte
                          Formentabelle, unabhängig von der App aufgestellt
package.json              npm-Skripte für die Prüfläufe
```

Die App läuft ohne Server: Datei im Browser öffnen. Kein Netzwerk, keine externen
Skripte, keine Abhängigkeiten. Alles läuft offline, auch auf dem Handy.

## 2 · Aufbau der App

Eine HTML-Datei mit drei Blöcken: `<style>`, Markup, ein einziges `<script>`.
Im Skript zuerst die **Daten**, dann ab dem Kommentarbanner
`ANWENDUNGSLOGIK` die **Logik**. Die Prüfläufe schneiden an genau dieser Stelle,
also nicht umbenennen.

### Datenbestände (Reihenfolge im Skript)

| Konstante | Inhalt | Schema |
|---|---|---|
| `EX_A … EX_E` → `ALL` | 372 Übungen (44 davon Tippaufgaben) | `{id, c, q, o[], a, e, r}` · `t:"fill"` + `a:[akzeptiert]` für Tippaufgaben |
| `WORDS` | 143 Wortschatzkarten | `{w, p, d, ex, s, t}` |
| `RULES`, `RULES_FORM`, `RULES_SATZ`, `RULES_ZEICHEN` → `RULES_ALL` | 117 Regeln | `{id, c, t, b}` — `b` ist HTML |
| `SATZ` | 24 Satzbaukarten | `{id, t, short, b, c}` — speisen über `SATZ_RULEMAP` die Satzregeln |
| `CASEREF` | 182 Fallkarten | `{w, t, k, ex, n?, fall?, s?}` · `t`: praep/wechsel/verb/verb2/verbpraep · `s` = Satzform |
| `TABLES` | 10 Tabellen | `{id, t, b}` |
| `KORREKTUR` | 12 Fehlersuchtexte / 87 Fehler | `{txt, errs:[{w, nth?, ok, k, r, c}]}` |
| `CHECKS`, `CHECKS_Z`, `CHECKS_N` → `CHECKS_ALL` | 82 Prüfmuster für den Textcheck | `{id, sev, re, t, k, r}` · `sev`: hart/pruef/stil/form |
| `PROMPTS`, `PHRASES`, `PAIRS`, `SCENES` | Schreibwerkstatt, Bausteine, Situationen | |

**Auszeichnung in Beispielen**: drei Stufen — `ok` (standardsprachlich), `ugs`
(umgangssprachlich oder regional, verbreitet aber nicht für geschriebene Texte) und
`nope` (falsch). `ugs` ist kein Fehler; wer eine regionale Form rot markiert, verstößt
gegen Grundsatz 4 und bricht die Widerspruchsprüfung in `tests/suite.js`.

**Kategorien (`c`)**: komma, gross, getrennt, recht, gram, stil, form, satz, zeichen, zahlen.

**ID-Präfixe der Übungen**: k, g, t, r, m, s, f, n, z, p, q, v, x, d.
Neue Blöcke bekommen ein neues Präfix. IDs sind Kartenschlüssel im Lernstand —
**niemals vergeben, umbenennen oder wiederverwenden**, sonst verliert Nils Fortschritt.

**HTML nur dort, wo es hingehört.** Regeltexte (`RULES.b`) und Satzkarten (`SATZ.b`)
sind HTML. Fast alles andere geht bei der Ausgabe durch `esc()` — Wortkarten, Fallkarten,
Regel- und Satzkartentitel. Eine Auszeichnung in einem solchen Feld erscheint wörtlich auf
dem Bildschirm; `tests/suite.js` prüft das. Welche Felder betroffen sind, lässt sich im
Skript an den `esc(...)`-Aufrufen ablesen.

### Kartenschlüssel

Drei Sorten, überall einheitlich:
- `k07` — Übung aus `ALL`
- `w:lapidar` — Wortkarte
- `c:helfen` — Fallkarte

`frageZuSchluessel(k, r)` löst jeden Schlüssel in eine Frage auf. **Jede neue Stelle,
die aus Schlüsseln Fragen macht, muss darüber gehen** — sonst verschwindet wieder eine
Kartensorte (ist zweimal passiert).

### Fallkarten in Satzform

Fallkarten fragen nach der **Form im Satz**, nicht nach dem Namen des Falls:
„Ich helfe ___ beim Aufbau“ statt „Welchen Fall verlangt helfen?“. Das ist näher am
Sprechen und der Regelfall — 164 der 165 abfragbaren Karten.

Das Feld `s` trägt die Aufgabe: `s:[Satz mit genau einer Lücke, richtige Form, falsche Form …]`.
Die **erste Option ist die richtige**; `caseQuestion()` mischt mit Tagesseed, damit sie nicht
immer vorn steht. Karten ohne `s` bleiben bei der Etikettfrage.

**Zwei Fassungen** trägt eine Karte als Liste von Listen: `s:[[Satz, richtig, falsch], […]]`.
Der Tagesseed entscheidet, welche drankommt; über die Wochen kommen beide dran. Das brauchen
die neun Wechselpräpositionen, weil eine Karte nur eine Richtung auf einmal abfragen kann.
**Die Reihenfolge ist Absprache: erst wohin (Akkusativ), dann wo (Dativ).** `tests/fallform.js`
leitet den erwarteten Fall daraus ab und prüft ihn — wer die Reihenfolge dreht, bricht die Prüfung.

Ohne Satzform bleibt nur noch **`lehren`** (der Dativ der Person „kommt vor, gilt aber als
schwächer“ — kein sicher falscher Ablenker möglich). Die Ausnahmenliste steht auch in
`tests/fallform.js`; wächst sie, muss sie dort mitwachsen.

**Beim Schreiben neuer Satzformen** ist die eine teure Frage: Ist der Ablenker *sicher*
falsch? Der Prüflauf hält mit `tests/formen.js` dagegen — einer unabhängig aufgestellten
Tabelle, welche Artikelform zu welchem Fall passt. Sie fängt aber nur, was maschinell
entscheidbar ist. Drei Fallen bleiben deine:
- **Femininum und Plural**: Dativ und Genitiv sehen gleich aus („der Verletzung“). Ein
  Genitiv-Item darf dort keinen Dativ-Ablenker haben — den Akkusativ nehmen („die Verletzung“).
- **Dokumentierte Ausnahmen**: Bei den Genitivpräpositionen ist der Dativ artikellos im
  Singular und im Plural ohne erkennbare Genitivform korrekt („wegen Umbau“, „trotz Beweisen“).
  Satz also immer mit Artikel bauen.
- **Mehrdeutige Formen**: „den“ ist Akkusativ Singular und Dativ Plural. Die Prüfung kann
  solche Ablenker nicht beurteilen und sagt das auch — sie zählt sie als ungeprüft.

### Lernlogik

- Leitner, `BOXES = [1,3,7,16,35]` Tage. Auf Anhieb richtig → Fach 2 statt 1.
- Speicher: `localStorage["deutschtrainer.v1"]`, bei Fehlschlag Fallback in den Arbeitsspeicher
  plus sichtbare Warnung (`#saveWarn`).
- `TAGESZIEL = 12` Karten für die Serie, gezählt in `tagesZiel()` aus `grade()` heraus —
  **nicht** am Rundenende. Egal ob Tagesaufgabe oder unterwegs.
- `SRS_RUNDE = 20` Karten pro Unterwegs-Runde.
- `buildDaily()` drosselt neuen Stoff bei Rückstand (`neuProTag()`), sonst explodiert der Stapel.
- `unterwegsRunde()` füllt in drei Stufen — fällig → neu → am längsten nicht geübt —
  und zieht auf jeder Stufe über `quotenMix()` im Verhältnis **45 % Aufgaben / 25 % Wörter /
  30 % Fälle**. Läuft ein Lernplan, kommt neuer Stoff bevorzugt aus dem Wochenschwerpunkt.
- Deterministischer Zufall: `hash()` + `rng()` für alles, was tagesstabil sein soll.
  Antwortoptionen werden in `exQuestion()` gemischt (`hash(id + "|" + today())`).
- `alleSchluessel()` liefert den Gesamtbestand (680 Karten: Aufgaben, Wörter, Fälle).
  **Jede Stelle, die eine Gesamtzahl nennt, muss darüber gehen**, sonst nennen zwei
  Ansichten verschiedene Zahlen.

### Was sitzt — die Retentionszahl

`retention()` teilt den Bestand in **sitzt sicher** (Fach ≥ `SICHER_AB` = 4), **im Aufbau**
und **noch nicht dran**. Der Fortschritt zeigt das als drei Zahlen mit Stapelbalken.

Die Zahl ist bewusst zurückhaltend. Fach 4 ist erreichbar, weil eine falsche Antwort auf
Fach 1 zurücksetzt — wer dort steht, hat also mindestens drei richtige Antworten in Folge.
Genau das steht auch in der App, und `tests/lernen.js` rechnet es über `grade()` nach,
statt es zu glauben.

**Was sie nicht sagt:** nichts über den *Abstand* zwischen den Antworten. Der Lernstand
hält je Karte nur `{b, d, s, w}` fest; das Datum der vorletzten Antwort fehlt. Über
`unterwegsRunde()` kann eine noch nicht fällige Karte am selben Tag erneut drankommen und
ein Fach aufsteigen. Wer die Zahl strenger machen will, braucht ein zusätzliches Feld im
Kartenzustand — und muss dann Export und Import mitziehen.

### Unterwegs-Modus (der Hauptanwendungsfall)

Nils übt **beim Spazierengehen, einhändig, oft mit Vorlesen**. Alles hier hat Vorrang:

- `startQuiz(list, host, {walk:true})` filtert Tippaufgaben raus, setzt `body.walk`,
  hält den Bildschirm wach, sichert die Sitzung (36 h fortsetzbar).
- Vorlesen über `sprechFrage(q)` → `sprechbar()`. **`hoerHinweis()` ist Pflicht:**
  Antworten, die sich nur in Schreibung oder Zeichensetzung unterscheiden, klingen gleich
  („des Weiteren“ / „des weiteren“). Der Hinweis benennt den Unterschied
  („Weiteren groß“, „Komma nach größer“, „mit Bindestrich“).
- Nach richtiger Antwort schaltet die App selbst weiter (`autoAn`/`autoAus`), beim Vorlesen
  erst nach dem Satzende. Abbrechen per Tipp, abschaltbar über ⏩.
- Rundenende zeigt die Fehler nach Regel gebündelt, antippbar ins Regelwerk.
- „Nur Fehler“-Runde über `schwachRunde()` aus `schwacheSchluessel()`.

## 3 · Inhaltliche Grundsätze

Diese sind über Monate erarbeitet und teuer bezahlt — bitte einhalten:

1. **Varianten kennzeichnen.** Wo Duden oder das amtliche Regelwerk mehrere Formen zulassen,
   steht das da, mit der empfohlenen Form zuerst. Die Regel bekommt dadurch automatisch die
   Markierung `◆ Varianten`.
2. **Kein Ablenker darf richtig sein.** Häufigster Inhaltsfehler. Vor jeder neuen
   Aufgabe: Ist die falsche Option *sicher* falsch? („im Stande“ war es nicht.)
3. **Stil ist keine Regel.** Füllwörter, Nominalstil, doppeltes „würde“ sind Empfehlungen,
   keine Fehler. Nicht als „falsch“ ausgeben.
4. **Regional statt falsch.** „ich bin gestanden“, „ruf mir an“, „brauchen“ ohne „zu“:
   einordnen, nicht abstempeln. Und **überall gleich** einordnen — Regel, Übung, Textcheck,
   Spickzettel.
5. **Keine absoluten Aussagen ohne Prüfung.** „immer“, „nie“, „ausschließlich“ sind
   Warnsignale. Meist gibt es eine Ausnahme.
6. **Gesprochen ≠ geschrieben.** Wo sich beides unterscheidet, beides benennen.
7. **Regeln veralten.** Das amtliche Regelwerk wird fortgeschrieben — die Fassung 2024
   hat die Kommaregel bei Infinitivgruppen geändert und die Paragrafen neu durchgezählt.
   Wer eine Paragrafennummer nennt, schreibt die Fassung dazu. Wer eine Kann-Regel
   schreibt, nennt die Quelle. `tests/normen.js` erzwingt beides für die Zeichensetzung.
8. Quellen: Duden, DWDS, Rat für deutsche Rechtschreibung, DIN 5008 (für Zahlen/Datum).
   Belegte Aussagen dürfen im Text die Quelle nennen. Der Absatz „Stand der Prüfung“ im
   Regelwerk beschreibt ehrlich, was geprüft ist und was nicht — **aktuell halten**.

### Ton

Deutsch, per du, sachlich, knapp. Keine Emojis in Regeltexten. Keine Ausrufezeichen.
Beispiele aus Nils' Welt: Sport, Uni, Schule, Training, Praktikum.

## 4 · Arbeitsweise beim Ändern

**Bearbeitung.** Für Textänderungen das Edit-Werkzeug mit eindeutigem Kontext.
Für größere Umbauten ein Skript — aber:

- **Nach jedem einzelnen Schritt schreiben, nicht am Ende.** Ein Abbruch mitten im Skript
  hat schon zweimal dazu geführt, dass gemeldete Änderungen nie in der Datei landeten.
- **In Python nur rohe Strings (`r"..."`) für alles mit Regex.** `\b` wird sonst zum
  Steuerzeichen und macht Prüfmuster stumm, ohne dass die Syntax bricht. Genau so sind vier
  Textcheck-Muster tot in die Datei gekommen.
- Nach jeder Änderung: `npm run syntax`, dann `npm test`.

**Handy zuerst.** Nils übt unterwegs. `viewport-fit=cover` im Viewport-Meta ist die
Voraussetzung dafür, dass `env(safe-area-inset-*)` überhaupt Werte liefert — ohne das
sind alle Safe-Area-Regeln still wirkungslos. `tests/mobil.js` prüft das und dazu, dass
jeder Inset auf seiner eigenen Seite steht (bei `padding` mit drei Werten ist der dritte
unten, nicht oben). Das App-Symbol ist als PNG eingebettet; es gibt kein Werkzeug dafür
im Repo.

**Niemals ändern ohne Grund:**
- Übungs-IDs, Wort- und Fallkartenschlüssel (= Lernstand)
- den Kommentarbanner `ANWENDUNGSLOGIK` (Schnittstelle der Prüfläufe)
- den Speicherschlüssel `deutschtrainer.v1`
- Export- und Importformat, ohne die Prüfung im Import mitzuziehen

## 5 · Prüfläufe

```bash
npm install        # einmalig, holt jsdom
npm test           # alle Prüfläufe
npm run syntax     # nur Syntaxprüfung des Skriptblocks
node tests/suite.js       # Daten, Widersprüche, Ansichten, Textcheck
node tests/unterwegs.js   # Kartenmix, Automatik, Rückblick, Fehlerrunde
node tests/lernen.js      # Erststart, Einstufung, Lernplan, Langzeitverlauf
node tests/inhalt.js      # Fallbeispiele, doppelte Optionen, Hörbarkeit
node tests/fallform.js    # Satzform der Fallkarten: Fall, Ablenker, Hörbarkeit, Abdeckung
node tests/normen.js      # absolute Aussagen, Kann-Regeln, Jahreszahlen, Spickzettel
node tests/mobil.js       # sichere Ränder, Web-App-Auszeichnung, Touchbedienung
```

Jeder Lauf endet mit „Alles bestanden.“ oder einer Fehlerliste und Exitcode 1.

**Neue Prüfung statt Einzelfix.** Wenn ein Fehler gefunden wird, erst die *Fehlerklasse*
benennen, dann eine Prüfung dafür schreiben, dann alle Fundstellen beheben. Die Prüfung
bleibt. So sind die vorhandenen Prüfläufe entstanden.

## 6 · Fallen, die schon zugeschnappt sind

| Falle | Was passiert ist |
|---|---|
| Antwort immer an Position A | 99 % der richtigen Antworten standen vorn. Seitdem wird gemischt — aber Aufgaben dürfen **nicht** auf Positionen verweisen („die zweite Fassung“). |
| Rückbezug auf die vorige Aufgabe | „Und hier?“ ergibt in gemischten Runden keinen Sinn. |
| Kartensorte verschwindet | Fallkarten wurden bewertet, aber nie wieder gezeigt; später fiel der Mix in Randfällen auf 100 % Aufgaben zurück. |
| Beim Hören identisch | 39 Aufgaben klangen gleich. `hoerHinweis()` löst das — bei neuen Aufgaben mitprüfen. |
| Stiller Speicherfehler | Fortschritt weg ohne Meldung. Jetzt Warnbanner. |
| Test misst das Falsche | Ein Test suchte „Speicher“ und fand das Wort woanders auf der Seite — grün, obwohl kaputt. Immer am konkreten Element prüfen, nicht an `body.textContent`. |
| Patch landet nicht | Siehe Abschnitt 4. |
| `\b` in Python | Siehe Abschnitt 4. |

## 7 · Wenn Nils etwas ergänzt haben will

Ablauf, der sich bewährt hat:

1. Prüfen, ob es die Regel schon gibt (`RULES_ALL`, `SATZ`, `CASEREF` durchsuchen).
2. Fakten belegen — Duden/DWDS/Regelwerk — **bevor** Text entsteht.
3. Regel schreiben oder erweitern, dann Übungen dazu, dann Fallkarten, dann Textcheck-Muster.
   Alle vier Ebenen müssen dasselbe sagen.
4. Spickzettel prüfen: Er wiederholt Teile des Bestands teils handgeschrieben.
5. Prüfläufe.
