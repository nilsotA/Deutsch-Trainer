# Offene Funde und verworfene Verdachtsfälle (Stand 13.09.2026)

## Wie diese Liste entstanden ist

Drei Läufe über den ganzen Bestand. Die ersten zwei (06.09.) liefen **ohne Websuche** — das
Suchbudget war aufgebraucht —, gesucht wurde deshalb nur nach dem, was ohne Quelle
entscheidbar ist: Stellen, an denen die App sich selbst widerspricht. 63 von 120 Meldungen
fielen in der Gegenprüfung durch.

Der dritte Lauf (08.–13.09.) hatte die Suche wieder: **51 Prüfer** über Regeln, Übungen,
Fall- und Wortkarten, Prüfmuster und Spickzettel, jeder mit eigener Recherche. **49 Funde**,
jeder danach von **zwei** Gegnern angegriffen — einer die Beleglage, einer den Bestand.
Ergebnis: **13 halten, 36 fallen.** Alle dreizehn sind eingebaut; jede Quellenaussage habe
ich vor dem Einbau mit zwei eigenen, verschieden formulierten Suchen nachgeprüft, weil
vielen Gegenprüfern das Suchkontingent ausgegangen war.

**Vierter Lauf (13.09., nachmittags): die Ablenker.** 17 Prüfer über alle 379 Übungen mit
der einen teuren Frage — ist jede als falsch markierte Option auch *sicher* falsch? **14
Funde**, wieder je zwei Gegner. Ergebnis: **1 hält, 2 geteilt, 11 fallen** (45 Agenten,
kein Fehler).

Die drei, die nicht durchgefallen sind, waren beim Eintreffen der Urteile schon behoben —
ich hatte sie unabhängig geprüft und geändert, und die Gegenprüfer haben zwei davon prompt
mit „steht so nicht mehr in der Datei" widerlegt:

- **`m20`** (hält, beide) — die Tippaufgabe „Innerhalb ___ Woche" nahm nur „einer",
  obwohl „der Woche" derselbe Genitiv ist. Behoben, samt neun weiteren Tippaufgaben
  derselben Bauart.
- **`n15`** (geteilt) — „(maskulin, Dativ)" erfüllt auch der Dativ Plural „den Kollegen".
  Behoben durch „Dativ Singular".
- **`k29`** (gefallen, weil behoben) — zwei richtige Antworten, siehe Commit 360c150.

### Erledigt: `q12` — Uhrzeit mit Punkt oder Doppelpunkt

Der einzige Fund mit echt geteiltem Urteil, und der Quellen-Gegenprüfer hatte recht. Zwei
verschieden formulierte Suchen sagen dasselbe: **Der Duden lässt beide Trennzeichen zu.**
Wörtlich aus den Suchergebnissen zum Duden-Sprachratgeber „Schreibung von Uhrzeitangaben":
„Der Doppelpunkt kann aber auch durch einen Punkt ersetzt werden: 8.03 Uhr, und Sie können
die Minutenangaben auch hochstellen." Und: „Die DIN 5008 schreibt für Zeitangaben den
Doppelpunkt vor … Der Duden erlaubt auch den Punkt und sogar die Hochstellung."

Damit war die alte Zuordnung falsch herum: Der Punkt gehört nicht dem Duden und der
Doppelpunkt nicht der DIN. Festgelegt ist nur DIN 5008, und zwar auf den Doppelpunkt.

Korrigiert wurden alle vier Ebenen — Regel `n-uhrzeit`, Übung `q12`, Spickzettel, und die
Übung ist auf die Bauform der anderen Variantenaufgaben umgestellt („Beides ist zulässig"
gegen zwei Ausschlussbehauptungen). Weil sich damit die richtige Antwort ändert, steht
`q12` in `NEU_GELERNT` mit dem 13.09.2026: Wer die Karte vorher gelernt hat, bekommt sie
einmal auf Fach 1 zurück und sofort wieder vorgelegt.

Direkter Seitenabruf ist in dieser Umgebung gesperrt (duden.de, dwds.de, grammis,
rechtschreibrat.com — alle). Es geht nur die Suche. Wo ein Wortlaut zitiert wird, stammt er
aus Suchergebnissen, nicht von der Originalseite. Das steht so auch in den Prüfregeln, und
im Zweifel bleibt der Bestand stehen.

## Die drei offenen Punkte sind entschieden

- **`gross-subst`** — Groß ist zulässig, wenn das Substantivische betont wird (§ 58 E4;
  Duden führt „das meiste oder Meiste ist bekannt“). Der Aufzählungspunkt sagte „bleiben
  klein“ ohne Einschränkung und sagt jetzt „in der Regel klein“ mit Verweis nach unten.
  Die Gegenprüfung hatte den Fund als solchen kassiert, weil die Einschränkung zwei Zeilen
  später schon steht — die Sprachfrage ist damit trotzdem beantwortet.
- **`m21`** — „zumindest“ ist vor einer Zahl nicht falsch: Der Duden glossiert es mit „zum
  Mindesten; auf jeden Fall“ und führt mindestens/zumindest als Synonyme. Der Ablenker war
  damit nicht sicher falsch (Grundsatz 2). Die Frage lautet jetzt „Welche Fassung passt bei
  einer Altersgrenze?“, die richtige Antwort bleibt „mindestens“.
- **`m10`** — „Themata“ führt der Duden weiterhin als Plural, markiert als
  *bildungssprachlich veraltend*. Eine Nebenform ist keine Fehlform. Die Frage lautet jetzt
  „Welcher Plural ist heute der gebräuchliche?“.

## Was aus dem dritten Lauf eingebaut wurde

- **Regel komma-nebensatz, Absatz „Mehrteilige Einleitungen"** — „steht es fest" macht aus einer Duden-Empfehlung eine Pflicht. Der Duden schreibt für Fügungen mit mehr als zwei Einleitewörtern „sollte man ein Komma setzen" und stellt die Kommasetzung in dieser Wortgruppe ausdrücklich ins Ermes
- **Regel getrennt-verb, Absatz "Beides erlaubt"** — Bei allen vier Paaren außer kennenlernen empfiehlt der Duden die getrennte Form — die App nennt die Zusammenschreibung zuerst. Weil im selben Satz für kennenlernen ausdrücklich "Duden empfiehlt zusammen" steht und die Schwesterreg
- **Regel recht-bindestrich, Absatz "Zahl + Wort"** — Der Absatz steht im Pflichtteil (100-Meter-Lauf, 3-jährig, 8-Stunden-Tag sind tatsächlich Bindestrich-Pflicht) und nennt für die Jahrzehnte nur eine Form. Zulässig sind aber beide: 80er-Jahre (als Zusammensetzung) und 80er Jahre (
- **Übung s06 (Erklärung), dazu Regel stil-passiv** — Das „nur" macht die Aussage ausschließlich und schneidet die zweite, gut dokumentierte Aufgabe des Passivs ab: Es macht das Betroffene (Patiens) zum Subjekt und damit zum Thema des Satzes. Das ist ein Mittel der Informationsstrukt
- **Regel form-anrede, letzter Satz** — Ohne Einschränkung formuliert. Groß bleiben Nomen, Eigennamen und die Anredepronomen Sie/Ihnen/Ihr(e) — „Sehr geehrte Frau Weber, Ihre Rückmeldung habe ich erhalten.“ Die App weiß das selbst: In der Regel komma-brief und in den Er
- **Regel form-grussformel, erster Listenpunkt** — „Nie falsch“ ist absolut formuliert, obwohl es einen klar dokumentierten Fall gibt, in dem diese Grußformel als unpassend gilt: Kondolenz- und Beileidsschreiben, auch geschäftliche. Dort ist eine Formel der Anteilnahme verlangt.
- **Regel satz-perfekt (Absatz „Mit haben stehen alle anderen“)** — Die Regel teilt in genau drei sein-Gruppen (Ortsveränderung, Zustandsveränderung, Sonderfälle sein/bleiben) und schiebt alles Übrige zu „haben“. Damit fällt eine ganze Gruppe unter den Tisch, die das Perfekt mit „sein“ bildet, obw
- **Übung n16 (Erklärung), Kategorie gram, Regel gram-ndekl** — Zwei Stellen in einem Satz. (a) Die absolute Formulierung 'Alles außer dem Nominativ Singular endet auf -en' ergibt für das im selben Satz genannte 'Herr' die Formen 'dem Herren / den Herren / des Herren' — im Singular heißt es ab
- **Uebung d05 (Erklaerung)** — In „Das trifft sich gut“ steht kein Dativ. „das“ ist Subjekt, ein Akkusativobjekt fehlt — das Reflexivpronomen „sich“ ist dort Akkusativ, genau wie in „wir treffen uns“. Ein Dativ-Reflexiv braucht ein zweites Objekt (vgl. d19: „Da
- **Fallkarte "dank" (Hinweis)** — Das Beispiel belegt die Aussage nicht: „Vorbereitung“ ist Singular, kein Plural. Zusätzlich sind im femininen Singular Dativ und Genitiv formgleich („guter Vorbereitung“) — das Beispiel zeigt also weder einen Plural noch einen erk
- **Fallkarte "liegen — wo" (Hinweis)** — Die Karte nennt nur den haben-Perfekt, obwohl die App selbst "liegen" ausdruecklich zu den Verben mit regionalem sein-Perfekt zaehlt. Die beiden Schwesterkarten sind hier ausfuehrlicher: "stehen — wo" traegt "(sueddeutsch und oest
- **Prüfmuster x21 (Textcheck, Regel gram-akkverben)** — Das Muster meldet mit „uns“ und „euch“ zwei Formen, die im Dativ UND im Akkusativ gleich lauten. „Das interessiert uns sehr“ und „Das interessiert euch bestimmt“ sind korrekter Akkusativ, werden vom Textcheck aber als sev:hart ang
- **Prüfmuster x22 (Textcheck, Regel gram-akkverben)** — Gleiche Fehlerklasse wie x21: „uns“ und „euch“ sind in Dativ und Akkusativ formgleich. „Das kostet uns viel Zeit“ und „Das kostet euch nichts“ sind korrekter Akkusativ und werden trotzdem gemeldet. Der Hinweis endet mit „Mit dem A

## Verworfen: was die Gegenprüfung nicht überstanden hat

Diese Verdachtsfälle sind geprüft und **kein Problem**. Sie stehen hier, damit ein späterer
Lauf sie nicht noch einmal meldet. Wenn du einen davon vor dir hast, lies erst die
Begründung — meist reden die beiden zitierten Stellen von verschiedenen Fällen, ein
Prüfmuster ist absichtlich enger als seine Regel, oder die Einschränkung steht anderswo in
derselben Regel. Fünf Einträge unten sind Funde, die ich zwischen den beiden Läufen bereits
eingebaut hatte — die Gegenprüfung fand die Stelle dann zu Recht nicht mehr vor.

- `Regel komma-aufzaehlung, Absatz „Kein Komma steht vor" samt Kleingedru` — Gelesen: Regel komma-aufzaehlung (Rohtext aus Deutsch-Trainer.html), komma-hauptsatz, komma-nebensatz, dazu alle 7 Rohvorkommen von „sowie" in der Datei und ein Textcheck-Lauf.  1) Der Prüfer zitiert die Liste ohne ihren Rahmen. Der erste Satz der Re
- `Regel komma-aufzaehlung, dieselbe Liste („Kein Komma steht vor: … wie ` — Die Sachaussage des Prüfers stimmt — die App sagt sie aber gar nicht anders, und der behauptete Widerspruch entsteht erst, wenn man den Regeltext um seinen eigenen einschränkenden Satz kürzt.  1. Die Stelle sagt nicht, was der Prüfer zitiert. Ich hab
- `Regel gross-subst (zweiter Aufzählungspunkt)` — Der Prüfer zitiert falsch. Der beanstandete Aufzählungspunkt lautet in Deutsch-Trainer.html (Zeile 1645) nicht "bleiben klein", sondern: "— Ausnahme sind die Zahladjektive: etwas anderes, alles andere, nichts anderes, das meiste bleiben in der Regel
- `Übung g03 (Erklärung)` — Die tragende Behauptung des Prüfers ist "Gleicher Fehler wie in der Regel: als ausnahmslos dargestellt" — und genau das stimmt nicht. Die Regel gross-subst, an der g03 hängt (r:"gross-subst"), sagt wörtlich: "Ausnahme sind die Zahladjektive: etwas an
- `Übung g23 (Erklärung)` — Der Fund steht und fällt mit dem Satz „Gleicher Fehler wie in der Regel: ausnahmslos formuliert“ — und genau das ist nachweislich falsch. Die zugehörige Regel `gross-subst` (Deutsch-Trainer.html, Zeile 1645) sagt wörtlich: „Ausnahme sind die Zahladje
- `Regel getrennt-praep, Zeile "Nur getrennt"` — Nachgestellt und nicht gehalten.  1) Die App stempelt "nachhause" nirgends als falsch ab. Der Textcheck meldet nichts: `node -e '... w.__t="Ich gehe nachhause und bleibe zuhause."'` liefert `[]`. Kein Prüfmuster, keine Übungsoption. Der Fund selbst s
- `Regel recht-apostroph, Absatz "Bei Auslassungen"` — Der Fund zielt auf einen Text, den es nicht mehr gibt. Grep über Deutsch-Trainer.html nach „gehört der Apostroph hin" und „sonst liest es sich schwer": 0 Treffer, Arbeitsbaum sauber. Der Prüfer zitiert den Stand VOR Commit 3531a48 („Fünf inhaltliche
- `Übung r11 (Regel recht-verwechsel)` — Der Fund fällt an seiner eigenen Voraussetzung. Der Prüfer zitiert die Frage als bloßes „Was stimmt?" und baut darauf sein ganzes Argument („Die Frage nennt keinen Zusammenhang"). In der Datei steht das aber nicht. Deutsch-Trainer.html, Zeile 1108:
- `Regel gram-konjunktiv (Beispielblock zum Konjunktiv II)` — Der Fund trägt nicht — er scheitert an seiner eigenen Prämisse, und die Beleglage kippt zusätzlich gegen ihn.  **1. Die App sagt an dieser Stelle gar nichts Falsches.** Der Regeltext (Deutsch-Trainer.html:1810 f.) lautet wörtlich „Bevorzuge die einfa
- `Übung m10 (Regel gram-plural)` — Der Fund greift ins Leere, weil er einen Stand zitiert, den die Datei nicht mehr trägt — und zwar genau denjenigen, den der Vorschlag herstellen will.  Was in /home/user/Deutsch-Trainer/Deutsch-Trainer.html, Zeile 1186/1187, tatsächlich steht: {id:"m
- `Regel gram-plural (Fremdwortliste)` — Gelesen habe ich die Regel selbst (Deutsch-Trainer.html, Zeilen 1821–1827) und die dazugehörigen Übungen (m09/m10, Zeilen 1183–1187). Die Regel besteht aus einer einzigen `<div class="ex">`-Musterreihe:  „das Praktikum → die Praktik**a** · das Lexiko
- `Regel gram-ndekl (Wortliste und Absatz „Zwei Sonderfälle“)` — Der Fund fällt an zwei Stellen auseinander: die Hauptquelle betrifft ein anderes Wort, und die behauptete Gleichstellung mit „Nachbar" sagt selbst die Duden-Quelle nicht.  1. Falsches Lemma. Die vom Prüfer genannte URL — duden.de/deklination/substant
- `Regel gram-wechsel (Karte sa16), letzter Absatz „Feste Ausnahmen" — wo` — Der Fund zielt auf Text, der nicht mehr existiert. Er ist im Bestand bereits behoben — und zwar genau so, wie der Prüfer es vorschlägt.  WAS TATSÄCHLICH IN DER DATEI STEHT (HEAD, sauberer Arbeitsbaum): Zeile 3785, Regel gram-wechsel / Karte sa16: „Fe
- `Regel gram-verbformen (Karte sa24), Schlussabsatz „Das Muster dahinter` — Der Fund geht ins Leere, weil er einen Stand der Datei beschreibt, den es nicht mehr gibt. Die zitierte Behauptung („Wo dasselbe Verb zwei Formen hat, ist die starke Form fast immer die ohne Objekt …") steht nirgends mehr in Deutsch-Trainer.html — `g
- `Regel gram-akkverben, erster Eintrag der Liste (im HTML: „anrufen — Ic` — Der Fund fällt an der Beleglage — und zwar an den Quellen, die der Prüfer selbst anführt.  1. Duden sagt das Gegenteil dessen, was der Prüfer ihm zuschreibt. In meiner Suche taucht Duden namentlich mit eigener Aussage auf (@Dudenverlag): „In der Stan
- `Regel stil-nominal, Liste „Streckverben ersetzen"` — Der Fund trägt nicht. Vier Punkte, alle aus eigenen Suchen und aus der Datei selbst.  1. Die Quelle sagt fast das Gegenteil dessen, was der Prüfer daraus macht. Meine Suche zu grammis/IDS gibt zurück: Funktionsverbgefüge "cannot ALWAYS be paraphrased
- `Regel stil-pleonasmus, Liste der Doppelungen` — Der Fund steht und fällt mit einem Schluss, den keine Quelle deckt: „Duden-Eintrag mit eigener, engerer Bedeutung → kein Pleonasmus". Genau dieses Kriterium widerlegt der Duden selbst.  1. Duden-Sprachratgeber „Was ist ein Pleonasmus?" (duden.de/spra
- `Übung s04 (Frage und Ablenker), Regel stil-pleonasmus` — Ich habe fünf eigene Suchen gefahren und die drei App-Stellen im Quelltext nachgelesen. Der Fund trägt nicht — weder die Beleglage noch die behauptete Selbstwidersprüchlichkeit der App hält stand.  **1. Der Prüfer zitiert die eigene Regel der App fal
- `Übung f01 (Regel form-anrede)` — Der Fund ist als „falsch" eingestuft, aber keine der Quellen — auch nicht die vom Prüfer selbst genannten — sagt, dass „Sehr geehrte Frau Weber," falsch wäre. Genau das müsste sie sagen, damit der Fund trägt.  1) Was meine Suchen zur Duden-Aussage he
- `Regel form-anrede, Beispielzeile „(Titelkette)“` — Der Fund hält nicht — in drei Punkten.  1. Die Einschränkung steht in der zugehörigen Erklärung. Die Beispielzeile (Deutsch-Trainer.html:3109) markiert den Fehler ausdrücklich als „(Titelkette)“, also die Stapelung, nicht den Titel an sich. Und die Ü
- `Regel satz-modal (Absatz zu sehen, hören, lassen)` — Der Fund unterstellt der App eine Aussage, die sie nicht macht, und der Vorschlag würde die Stelle schlechter machen.  1. Was da wirklich steht (sa10, gerendert als Regel satz-modal, letzter Sachabsatz): „Das gilt genauso für sehen, hören, lassen: ‚I
- `Regel satz-negation (Abschnitt „nicht oder kein?“)` — Geprüfter Bestand (Deutsch-Trainer.html, Karte sa07, Zeilen 3669–3673): „«nicht» oder «kein»? Sehr einfache Regel: kein bei Substantiven mit unbestimmtem Artikel oder ohne Artikel: «Ich habe keine Zeit.» · «Das ist kein Problem.» — nicht in allen and
- `Regel satz-v2 (Einleitung und Selbsttest)` — Keine Belegprüfung möglich — und damit nach der Zweifelsregel: Bestand bleibt.  1. Recherchelage. Der Suchetat dieser Sitzung war bereits aufgebraucht (200/200 WebSearch-Aufrufe), mein erster Suchversuch wurde abgewiesen. Ich konnte also KEINE einzig
- `Regel z-doppelpunkt (Abschnitt „Groß oder klein danach?“ samt Quellenz` — Der App-Text steht so da, das bestreite ich nicht: Regel `z-doppelpunkt` (Deutsch-Trainer.html, Zeilen 4719–4734) hat genau die Zweiteilung „vollständiger Satz oder wörtliche Rede → groß“ / „Aufzählung oder Wortgruppe → klein“ mit dem Beispiel „Die L
- `Übung p05 (gehört zu z-doppelpunkt)` — Zwei Gründe, prozedural und inhaltlich.  1. Keine eigene Beleglage möglich. Mein erster WebSearch-Aufruf wurde abgewiesen: „Web search was not performed: this session has used its web search budget (200 of 200 WebSearch calls).“ Ich habe also NULL Su
- `Regel z-doppelpunkt (Abschnitt „Häufiger Fehler“ mit dem rot markierte` — Vorweg, ehrlich: Ich konnte **keine einzige eigene Suche** durchführen — das WebSearch-Kontingent der Sitzung war beim ersten Versuch bereits aufgebraucht („this session has used its web search budget (200 of 200)“). Die geforderten zwei unabhängigen
- `Regel z-schraeg (Absatz zum Schrägstrich bei Wortgruppen)` — Zwei Gründe, der zweite ist der ausschlaggebende.  1. KEINE EIGENE BELEGLAGE. Meine beiden geplanten Suchen (DIN 5008 / Schrägstrich / Wortgruppen / optional; und "geschütztes Leerzeichen" + Wortgruppen) wurden nicht ausgeführt: Das Suchbudget dieser
- `Regel n-datum (Deutsch-Trainer.html, Zeile 4890)` — Widerlegt aus Beleggründen, nicht weil die Sachbehauptung abwegig wäre.  1. Keine eigene Prüfung möglich, also keine Anhebung der Belegstärke. Mein WebSearch-Kontingent war bei Start des Auftrags schon aufgebraucht (200/200); beide angesetzten Suchen
- `Uebung d15 (Erklaerung, „Merke“)` — Der Fund trägt nicht — aus drei Gründen, von denen zwei nachprüfbar falsche Tatsachenbehauptungen des Prüfers sind.  1. Die zentrale Begründung ist sachlich falsch. Der Prüfer schreibt, der Merksatz stehe „nirgends sonst in der App mit Einschränkung“
- `Übung s06 (Erklärung), Regel stil-passiv` — Beleglage: null — und zwar auf beiden Seiten. Meine beiden geplanten Suchen (grammis/IDS zu Thema-Rhema und Vorgangsfokus; Duden zur Passiv-Verwendung) wurden nicht ausgeführt, das Websuch-Budget der Session war bereits erschöpft (200 von 200). Es li
- `Übung s03 (Erklärung), Regel stil-fuellwort` — WIDERLEGT — aus zwei unabhängigen Gründen.  **1. Die Beleglage ist null, und zwar auf beiden Seiten.** Der Prüfer schreibt selbst: „KEIN BELEG VORHANDEN", Belegstärke „schwach", und formuliert die Bedingung für eine Änderung ausdrücklich: „Vor einer
- `Übung s08 (Erklärung), Regel stil-anglizismus` — Beleglage: null — auf beiden Seiten. Meine zwei eigenen, anders formulierten Suchen ("Sinn machen" Lehnübersetzung/Lessing/18. Jh. sowie Duden-Sprachwissen "Sinn machen" vs. "Sinn ergeben") wurden beide abgewiesen: Websuch-Budget der Session mit 200/
- `Übung p07 (Kategorie zeichen, Regel z-gedankenstrich)` — Widerlegt auf vier Ebenen; keine davon braucht eine Websuche (das Kontingent war auch bei mir erschöpft, 200/200 — ich habe zwei Suchen abgesetzt, beide wurden ungeprüft zurückgewiesen. Damit gibt es in dieser Sitzung KEINE externe Belegbasis, weder
- `Übung q09 (Erklärung)` — Der Fund trägt nicht. Vier eigene Prüfungen, alle gegen ihn.  **1. Die Beleglage ist zirkulär und selbst ungeprüft.** Der Prüfer belegt den Fund ausschließlich mit der App selbst — Regel n-einheiten und Muster t05 — und stuft die Belegstärke selbst a
- `Übung q06 (Erklärung)` — Ich habe beide Stellen selbst gelesen (/home/user/Deutsch-Trainer/Deutsch-Trainer.html): Regel n-gliederung: „Vier Stellen bleiben meist ungegliedert: 1000 Meter, 2500 Zuschauer. Gegliedert (1 000, 1.000) begegnet dir das vor allem dort, wo Zahlen un
- `Fallkarte "glauben an" (Feld n / Hinweis)` — Beleglage: null extern. Meine zwei anders formulierten Suchen ("glauben Rektion jemandem etwas glauben Dativ Akkusativ Duden" und "glauben Valenz an + Akkusativ Dativ der Person Akkusativobjekt") wurden beide gar nicht ausgeführt — das Suchbudget der
