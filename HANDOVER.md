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

Alle sechs Prüfläufe sind grün. Sie sind inzwischen einmal vollständig gelaufen —
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
| Übungen | 372, davon 44 Tippaufgaben (unterwegs abfragbar: 328) |
| Regeln | 117 |
| Wortkarten | 116 |
| Fallkarten | 182, davon 164 in Satzform (173 Fassungen); abfragbar 165 |
| Satzbaukarten | 24 |
| Prüfmuster im Textcheck | 82 |
| Fehlersuchtexte | 12 mit 87 markierten Fehlern |
| Kartenbestand (`alleSchluessel()`) | 653 |
| Dateigröße | ~596 KB, eine Datei, kein Build |

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

1. **Belege für die Zeichensetzung — Teil zwei.** Die **neun Kommaregeln** sind
   durch (siehe „Zuletzt geändert“), abgesichert durch `tests/normen.js`. Offen sind
   die **acht `z-`Regeln**. Beim Durchlesen sind vier Stellen aufgefallen, die ich
   *nicht* geprüft habe — sie sind Kandidaten, keine bestätigten Fehler:

   - `z-auslassung`: „Die Auslassungspunkte sind ein Zeichen (…), nicht drei Punkte
     hintereinander.“ Typografisch stimmt das, aber das Regelwerk spricht von drei
     Punkten. Die Aussage ist womöglich zu scharf.
   - `z-doppelpunkt`: „Häufiger Fehler: Doppelpunkt nach einem Wort, das die Aufzählung
     schon einleitet („bestehend aus: …“).“ Das ist vermutlich eine Stilempfehlung, kein
     Fehler — dann verstößt die Formulierung gegen Grundsatz 3.
   - `z-frage`: Ausrufezeichen nach der Briefanrede sei „veraltet“. Das Regelwerk lässt
     es zu; „unüblich“ wäre vermutlich richtiger als „veraltet“.
   - `komma-adjektive`: Die Und-Probe steht als eindeutiger Test da („die neue, rote
     Trainingsjacke“ → Komma falsch). In Grenzfällen ist die Gleichrangigkeit aber
     Auslegungssache. Prüfen, ob das ein `◆ Varianten`-Fall ist.

   Vorgehen wie gehabt: erst belegen, dann Regel, Übung, Fallkarte und Textcheck
   angleichen, dann „Stand der Prüfung“ nachziehen — und die Fundstelle in
   `tests/normen.js` eintragen.
2. **Textcheck weiter schärfen.** Trefferquote im eigenen Fehlerkorpus ist gut,
   Fehlalarme auf sauberem Text bei null. Weitere Muster sind möglich, aber jedes
   neue Muster muss gegen sauberen Text geprüft werden.
3. **Wortschatz erweitern.** 116 Karten sind wenig für vier Semester. Kandidaten
   wären akademische Verben und Verwechslungspaare aus seinen eigenen Texten.
4. **Satzformen für die zehn offenen Fassungen.** `bis`, `wider`, `je`, `pro`, `samt`
   und `zwecks` fragen über Adjektivendungen ab, `danken` und `zuhören` über „ihr“ —
   die Formentabelle in `tests/formen.js` kennt diese Formen nicht, sie sind also nur
   von Hand geprüft. Entweder die Tabelle erweitern oder die Sätze auf Artikelformen
   umstellen.

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
