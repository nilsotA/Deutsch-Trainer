# Übergabe an Claude Code

## Was du zuerst tun solltest

```bash
npm install
npm run syntax
npm test
```

**Wichtig:** Die Prüfläufe unter `tests/` sind neu geschrieben. Die ursprünglichen
Skripte lagen in einer Sandbox, die am Ende der letzten Sitzung ausgefallen ist
(kein Speicherplatz). Inhaltlich prüfen sie dasselbe, aber sie sind **noch nie
gelaufen**. Rechne mit ein bis zwei Anpassungen an der Verdrahtung — falsche
Selektoren, andere Rückgabewerte —, nicht mit inhaltlichen Fehlern in der App.

Ebenfalls offen: Die letzten drei Textänderungen an der App (siehe unten,
„Zuletzt geändert“) sind aus demselben Grund ungetestet.

## Stand der App

| | |
|---|---|
| Übungen | 331 |
| Regeln | 117 |
| Wortkarten | 116 |
| Fallkarten | 182 |
| Satzbaukarten | 24 |
| Prüfmuster im Textcheck | 82 |
| Fehlersuchtexte | 12 mit 87 markierten Fehlern |
| Dateigröße | ~550 KB, eine Datei, kein Build |

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

## Zuletzt geändert (ungetestet)

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

Der übrige Bestand beruht auf allgemeinem Sprachwissen und hat die maschinellen
Prüfungen bestanden, ist aber nicht einzeln belegt. Der Absatz „Stand der Prüfung“
im Regelwerk sagt das dem Nutzer auch so — **bitte aktuell halten**, wenn du
weiter belegst.

## Ideenliste

Nach Nutzen sortiert, nichts davon ist angefangen:

1. **Fallkarten in Produktionsform.** Die 182 Fallkarten fragen nach dem *Namen*
   des Falls („Welchen Fall verlangt helfen?“). Näher am Sprechen wäre die Form im
   Satz („Ich helfe ___ Trainer“). 24 solche Aufgaben gibt es schon (`d01`–`d24`),
   die Fallkarten selbst sind noch im Etikettformat. Achtung: Ablenker automatisch
   zu erzeugen ist riskant, weil bei manchen Genera zwei Formen gleich aussehen.
2. **Weitere Belege.** Die reichweitenstärksten Regeln sind geprüft; als Nächstes
   lohnen `gram-praep` (feste Verbpräpositionen), `gram-kasus` (Dativverben) und
   die Zeichensetzungsregeln.
3. **Retention messen.** Die App weiß, wie oft eine Karte richtig war, zeigt aber
   nirgends, was wirklich sitzt. Eine ehrliche Kennzahl („davon sicher: 214“)
   wäre motivierender als XP.
4. **Textcheck weiter schärfen.** Trefferquote im eigenen Fehlerkorpus ist gut,
   Fehlalarme auf sauberem Text bei null. Weitere Muster sind möglich, aber jedes
   neue Muster muss gegen sauberen Text geprüft werden.
5. **Wortschatz erweitern.** 116 Karten sind wenig für vier Semester. Kandidaten
   wären akademische Verben und Verwechslungspaare aus seinen eigenen Texten.

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
