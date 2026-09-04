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
| Übungen | 336 |
| Regeln | 117 |
| Wortkarten | 116 |
| Fallkarten | 182, davon 164 in Satzform (173 Fassungen) |
| Satzbaukarten | 24 |
| Prüfmuster im Textcheck | 84 |
| Fehlersuchtexte | 12 mit 87 markierten Fehlern |
| Dateigröße | ~600 KB, eine Datei, kein Build |

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

**Zweiter Durchgang Zeichensetzung: sieben weitere Regeln belegt** (04.09.2026, abends).
Vorgehen: Für jede Regel zwei unabhängige Belegagenten (Faktenprüfung; Absolutheit,
Änderungen 2024, Widersprüche, Ablenker), Befunde zusammengeführt, die Kernaussagen
zusätzlich selbst per Suche geprüft, dann umgesetzt. Die gegnerische Prüfung der Funde
(drei Prüfer je Regel) lief beim Schreiben dieser Zeilen noch — Abweichungen werden
nachgetragen. Belegt sind jetzt `komma-nebensatz`, `komma-hauptsatz`, `komma-einschub`,
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

Was die Belegagenten nicht erreichen konnten: duden.de, rechtschreibrat.com, dwds.de,
grammis und Wikipedia sind aus der Umgebung nur über Suchtreffer lesbar. Die
Paragraphennummern des Regelwerks 2024 sind deshalb nur dort genannt, wo sie mehrfach
bestätigt sind (§ 73 Infinitivgruppen). Offen aus diesem Durchgang: `z-klammern`,
`z-auslassung`, `z-frage`, `z-schraeg`, `z-semikolon` (Sucher liefen noch).

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
Die 2024 neu nummerierten Paragraphen sind in der App nur bei `komma-infinitiv` zitiert.

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

1. **Restliche Zeichensetzung belegen.** Infinitivgruppen, Partizipgruppen,
   Doppelpunkt und Bis-Strich sind erledigt (siehe „Zuletzt geändert“). Offen:
   `komma-nebensatz`, `komma-hauptsatz`, `komma-einschub`, `komma-vergleich`,
   `komma-adjektive`, `komma-brief` und die übrigen `z-`-Regeln gegen das Regelwerk
   von 2024 lesen — die Kommaregeln sind dort neu nummeriert, und „Komma bei Nebensätzen
   mit und/oder“ könnte sich verschoben haben. Vorgehen wie gehabt: erst belegen, dann
   Regel, Übung, Fallkarte und Textcheck angleichen, dann „Stand der Prüfung“ nachziehen.
2. **Textcheck weiter schärfen.** Trefferquote im eigenen Fehlerkorpus ist gut,
   Fehlalarme auf sauberem Text bei null. Weitere Muster sind möglich, aber jedes
   neue Muster muss gegen sauberen Text geprüft werden.
3. **Wortschatz erweitern.** 116 Karten sind wenig für vier Semester. Kandidaten
   wären akademische Verben und Verwechslungspaare aus seinen eigenen Texten.
4. **Erledigt (04.09.2026): die zehn offenen Fassungen sind maschinell geprüft.** Die
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
