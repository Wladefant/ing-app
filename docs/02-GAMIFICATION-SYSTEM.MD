# Gamification System - Vollständige Spezifikation

> Dieses Dokument beschreibt das Gamification-System für Junior und Adult Profile mit Schwerpunkt auf Kahoot-ähnlichen Challenges, Ranglisten und Nutzer-Engagement.

---

## Inhaltsverzeichnis
1. [Punkte-System](#punkte-system)
2. [Achievements & Badges](#achievements--badges)
3. [Ranglisten](#ranglisten)
4. [Kahoot-Style Challenges](#kahoot-style-challenges)
5. [Schulmeisterschaften](#schulmeisterschaften)
6. [User Stories für Demo Sidebar](#user-stories-für-demo-sidebar)

---

## Punkte-System

### XP (Erfahrungspunkte) Wirtschaft

#### XP verdienen - Junior Profil

| Aktion | XP Vergabe | Frequenz-Limit |
|--------|-----------|----------------|
| **Täglicher Login** | 10 XP | Einmal/Tag |
| **Streak Bonus (7 Tage)** | 50 XP Bonus | Wöchentlich |
| **Streak Bonus (30 Tage)** | 200 XP Bonus | Monatlich |
| **Quiz abgeschlossen (Leicht)** | 25-50 XP | Pro Quiz |
| **Quiz abgeschlossen (Mittel)** | 50-100 XP | Pro Quiz |
| **Quiz abgeschlossen (Schwer)** | 100-200 XP | Pro Quiz |
| **Perfekte Quiz-Punktzahl** | +50% Bonus XP | Pro Quiz |
| **Erster virtueller Trade** | 100 XP | Einmalig |
| **Lernmodul abgeschlossen** | 50-150 XP | Pro Modul |
| **Lernvideo angesehen** | 20 XP | 5/Tag max |
| **Nachrichtenartikel gelesen** | 10 XP | 10/Tag max |
| **Aktie zur Watchlist hinzugefügt** | 15 XP | 10/Tag max |
| **Virtueller Trade durchgeführt** | 20 XP | 5/Tag max |
| **Portfolio-Meilenstein erreicht** | 100-500 XP | Pro Meilenstein |
| **Wochen-Challenge gewonnen** | 500 XP | Einmal/Woche |
| **Freund empfohlen** | 200 XP | Pro Freund |
| **Tägliche Challenge abgeschlossen** | 30-75 XP | Einmal/Tag |
| **Mitschüler geholfen (Feature erklärt)** | 25 XP | 3/Tag max |

#### XP Multiplikatoren

| Bedingung | Multiplikator |
|-----------|--------------|
| 7-Tage Streak | 1,5x |
| 14-Tage Streak | 1,75x |
| 30-Tage Streak | 2x |
| 60-Tage Streak | 2,5x |
| Wochenend-Bonus | 1,25x |
| Perfektes Quiz | 1,5x |
| Erster Versuch | 1,2x |

### Level-System

| Level | Benötigte XP | Titel | Freischaltungen |
|-------|-------------|-------|-----------------|
| 1 | 0 | Finanz-Anfänger | Basis-Features |
| 2 | 500 | Geld-Lerner | Erster Badge-Slot |
| 3 | 1.200 | Spar-Fuchs | Custom Avatar-Farbe |
| 4 | 2.500 | Budget-Held | Zweiter Badge-Slot |
| 5 | 5.000 | Finanz-Entdecker | Schwere Quizze freigeschaltet |
| 6 | 8.500 | Aktien-Kenner | Fortgeschrittene Aktien |
| 7 | 13.000 | Portfolio-Profi | Dritter Badge-Slot |
| 8 | 20.000 | Investment-Guru | Custom Titel |
| 9 | 30.000 | Finanz-Meister | Spezieller Badge-Rahmen |
| 10 | 50.000 | Leos Champion | Alle Features + VIP-Status |

### Echte Finanzbelohnungen (Keine physischen Geschenke!)

**Junior Profil - Angesammelt bis Alter 18:**

| XP Meilenstein | Belohnung mit 18 |
|----------------|------------------|
| 5.000 XP | €5 Kontobonus |
| 15.000 XP | €15 Kontobonus |
| 35.000 XP | €35 Kontobonus |
| 75.000 XP | €75 Kontobonus |
| 150.000 XP | €150 Kontobonus + 0,1% Zinsbonus (1 Jahr) |

**Adult Profil - Sofortige Belohnungen:**

| Leistung | Belohnung |
|----------|-----------|
| Finanz-Gesundheitscheck abgeschlossen | €5 Kontoguthaben |
| Erstes Investment | Kostenloser Trade |
| 6-Monate aktiver Nutzer | 0,1% Zinsbonus |
| 3 Freunde empfohlen | €25 Kontoguthaben |

---

## Achievements & Badges

### Badge-Kategorien

#### 🎓 Lern-Badges (Bildung)

| Badge | Kriterien | XP Bonus |
|-------|----------|----------|
| **Quiz Neuling** | Erstes Quiz abgeschlossen | 25 XP |
| **Quiz Stammgast** | 10 Quizze abgeschlossen | 100 XP |
| **Quiz Meister** | 50 Quizze abgeschlossen | 500 XP |
| **Perfekte 10** | 10 perfekte Quiz-Ergebnisse | 250 XP |
| **ETF Experte** | Alle ETF-Quizze abgeschlossen | 200 XP |
| **Steuer-Profi** | Alle Steuer-Quizze abgeschlossen | 200 XP |
| **Versicherungs-Insider** | Alle Versicherungs-Quizze abgeschlossen | 200 XP |
| **Aktien-Gelehrter** | Alle Aktien-Quizze abgeschlossen | 200 XP |
| **Allwissend** | 90%+ Durchschnitt über alle Quizze | 1000 XP |

#### 📈 Investment-Badges (Trading)

| Badge | Kriterien | XP Bonus |
|-------|----------|----------|
| **Erster Trade** | Ersten virtuellen Trade ausgeführt | 50 XP |
| **Trader in Ausbildung** | 10 Trades ausgeführt | 100 XP |
| **Aktiver Trader** | 50 Trades ausgeführt | 300 XP |
| **Diversifizierer** | 5 verschiedene Aktien besitzen | 150 XP |
| **Sektor-Spreizer** | Aktien aus 3 Sektoren besitzen | 200 XP |
| **Globaler Investor** | Internationale Aktien besitzen | 150 XP |
| **ETF Enthusiast** | 3 verschiedene ETFs besitzen | 200 XP |
| **Diamant Hände 💎** | Durch 20% Rückgang gehalten | 300 XP |
| **Papier Hände (Schande!)** | Panikverkauf (lerne daraus!) | 0 XP |
| **Markt geschlagen** | DAX für 1 Monat übertroffen | 500 XP |

#### 🔥 Beständigkeits-Badges (Streaks)

| Badge | Kriterien | XP Bonus |
|-------|----------|----------|
| **Wochen-Krieger** | 7-Tage Streak | 75 XP |
| **Zwei-Wochen-Kämpfer** | 14-Tage Streak | 150 XP |
| **Monats-Meister** | 30-Tage Streak | 400 XP |
| **Quartals-Champion** | 90-Tage Streak | 1000 XP |
| **Jahres-Legende** | 365-Tage Streak | 5000 XP |

#### 💰 Spar-Badges (Ziele)

| Badge | Kriterien | XP Bonus |
|-------|----------|----------|
| **Erstes Ziel** | Erstes Sparziel gesetzt | 25 XP |
| **Ziel-Erreicher** | Erstes Sparziel erreicht | 100 XP |
| **Serien-Sparer** | 5 Sparziele erreicht | 300 XP |
| **Traum finanziert** | €1.000 für ein Ziel gespart | 200 XP |
| **Geld-Berg** | €5.000 insgesamt gespart | 500 XP |

#### 🏆 Wettbewerbs-Badges (Sozial)

| Badge | Kriterien | XP Bonus |
|-------|----------|----------|
| **Top 100** | In wöchentlicher Top 100 platziert | 50 XP |
| **Top 10** | In wöchentlicher Top 10 platziert | 200 XP |
| **Wochen-Champion** | #1 für die Woche | 500 XP |
| **Klassen-Anführer** | #1 in Schul-Rangliste | 300 XP |
| **Schul-Stolz** | Schule in Top 50 geholfen | 200 XP |
| **Schul-Champion** | Schule gewinnt Monatsmeisterschaft | 500 XP |

### Badge-Anzeige System

```
┌─────────────────────────────────────┐
│  🏆 Meine Badges (24/48)            │
│                                     │
│  ──── AUSGERÜSTET (3 Slots) ────    │
│  [💎 Diamant Hände]                 │
│  [🔥 Monats-Meister]                │
│  [📈 Markt geschlagen]              │
│                                     │
│  ──── VERDIENT ────                 │
│  🎓🎓🎓🎓🎓 Lernen (5)              │
│  📈📈📈 Trading (3)                 │
│  🔥🔥🔥🔥 Streaks (4)               │
│  💰💰 Sparen (2)                    │
│  🏆🏆�� Wettbewerb (3)              │
│                                     │
│  ──── GESPERRT ────                 │
│  ⬜⬜⬜⬜ (24 weitere freischaltbar) │
│                                     │
│  🎯 Nächstes: "Quiz Meister" (45/50)│
│     [Alle Badges ansehen →]         │
└─────────────────────────────────────┘
```

---

## Ranglisten

### Ranglisten-Typen

#### 1. Wochen-Rangliste (Global)
- Setzt sich jeden Sonntag Mitternacht zurück
- Zeigt nur in dieser Woche verdiente XP
- Top 10 Gewinner werden Montag früh bekannt gegeben
- Preise für Top 3 (€25, €15, €10 Bonus mit 18)

#### 2. Allzeit-Rangliste (Global)
- Kumulative XP seit Kontoerstellung
- Zeigt Rang und Gesamt-XP
- Spezielle Flair für Allzeit Top 100

#### 3. Schul-Rangliste
- Aggregierte XP von allen Schülern einer Schule
- Erfordert 5+ Schüler von derselben Schule
- Monatliche Schulmeisterschaften mit Preisen

#### 4. Freunde-Rangliste
- Vergleich nur mit hinzugefügten Freunden
- Ermutigt freundschaftlichen Wettbewerb
- Keine Preise, nur Angeberrechte

#### 5. Klassen-Rangliste (Kahoot-Style)
- Echtzeit während Live-Quiz-Sessions
- Vom Lehrer erstellte Challenges
- Live-Updates nach jeder Frage

### Ranglisten UI Spezifikation

```
┌─────────────────────────────────────┐
│  🏆 Wochen-Rangliste                │
│  Setzt sich zurück in: 2T 14h 32m   │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🥈    🥇    🥉              │    │
│  │ [2]  [1]   [3]              │    │
│  │ Max  Lisa  Tom              │    │
│  │ 2,2k 2,5k  2,1k             │    │
│  └─────────────────────────────┘    │
│                                     │
│  4. Sarah         1.980 XP    ▲2    │
│  5. Michael       1.875 XP    ▼1    │
│  6. Emma          1.820 XP    ▲5    │
│  7. Felix         1.790 XP    ─     │
│  8. Anna          1.755 XP    ▲3    │
│  ...                                │
│  ─────────────────────────────      │
│  42. Du (GeldLerner)               │
│      840 XP    ▲15                  │
│      Brauchst 60 XP um Emma zu      │
│      überholen                      │
│  ─────────────────────────────      │
│                                     │
│  🎁 Diese Woche Preis:              │
│  1.: €25  2.: €15  3.: €10          │
│  (gutgeschrieben mit 18)            │
└─────────────────────────────────────┘
```

---

## Kahoot-Style Challenges

### Übersicht

Leo kann Live-Multiplayer-Quiz-Sessions ähnlich wie Kahoot! hosten. Diese sind konzipiert für:
1. **Klassenraum-Nutzung**: Lehrer erstellen Sessions für Schüler
2. **Freunde-Challenges**: Nutzer laden Freunde zum Wettbewerb ein
3. **Schulmeisterschaften**: Monatliche Klassen-Wettbewerbe
4. **Globale Events**: ING-gesponserte Spezial-Quizze

### Challenge erstellen (Lehrer/Host Ablauf)

```
Leo: "Bereit ein Quiz-Challenge zu hosten? 🎮"

Schritt 1: Thema wählen
[ ] ETFs & Fonds
[ ] Aktien Grundlagen  
[ ] Steuern 101
[ ] Versicherungen erklärt
[ ] Gemischte Themen
[ ] Individuell (eigene erstellen)

Schritt 2: Einstellungen
• Anzahl Fragen: [5] [10] [15] [20]
• Zeit pro Frage: [10s] [15s] [20s] [30s]
• Schwierigkeit: [Leicht] [Mittel] [Schwer] [Gemischt]
• Punkte: [Standard] [Geschwindigkeitsbonus] [Streak-Bonus]

Schritt 3: Code teilen
"Dein Spiel-Code: FINANZ-2847"
Teile diesen Code mit Teilnehmern!

[Start wenn bereit] [Auf mehr Spieler warten]

Lobby zeigt:
"8 Spieler beigetreten (warten auf mehr...)"
👤 Max
👤 Lisa  
👤 Tom
👤 Sarah
...
```

### An Challenge teilnehmen (Teilnehmer Ablauf)

```
Leo: "Nimm an einer Quiz-Challenge teil! 🎮"

Gib Spiel-Code ein: [FINANZ-2847]
                    [Spiel beitreten]

─────────────────────────────────

Wartet in Lobby...
"Spiel: Aktien Grundlagen Quiz"
"Host: Frau Müller"
"Spieler: 24/30"

Dein Avatar: 🦁 GeldLerner
Bereit! Warten auf Host zum Starten...

─────────────────────────────────

[SPIEL STARTET]

Frage 1/10                       ⏱️ 15s

"Wofür steht IPO?"

┌─────────┐  ┌─────────┐
│    A    │  │    B    │
│ Initial │  │ Internal│
│ Public  │  │ Private │
│ Offering│  │ Option  │
└─────────┘  └─────────┘
┌─────────┐  ┌─────────┐
│    C    │  │    D    │
│ Instant │  │ Inter-  │
│ Profit  │  │national │
│ Order   │  │ Purchase│
└─────────┘  └─────────┘

[Tippe deine Antwort!]

─────────────────────────────────

[NACH ANTWORT]

✅ Richtig! +100 Punkte (+20 Geschwindigkeitsbonus)

Aktuelle Platzierungen:
1. 🥇 Max      1.250
2. 🥈 Lisa     1.180  
3. 🥉 Tom      1.120
→ 4. Du        1.100 (▲2)

─────────────────────────────────

[ENDERGEBNISSE]

🏆 Spiel vorbei! 🏆

Endplatzierungen:
🥇 Lisa       2.450 (+250 XP)
🥈 Max        2.380 (+150 XP)
🥉 Du         2.290 (+100 XP)

Deine Statistiken:
• 8/10 richtige Antworten
• Bester Streak: 5 in Folge
• Schnellste Antwort: F3 (2,1s)
• +100 XP verdient

[Nochmal spielen] [Zurück zur Startseite]
```

### Echtzeit-Punktesystem

| Faktor | Punkte |
|--------|--------|
| Richtige Antwort | 100 Basis |
| Geschwindigkeitsbonus (0-20 Punkte) | Schneller = mehr |
| Streak-Bonus (2+ richtig in Folge) | +10 pro Frage im Streak |
| Perfektes Spiel Bonus | +100 |
| Erster mit richtiger Antwort | +25 |

### Sound & Visuelle Effekte

- **Frage erscheint**: Dramatische Enthüllungsanimation, Countdown-Sound
- **Antwort abgegeben**: Sperr-Sound, Button leuchtet auf
- **Richtige Antwort**: Konfetti, Erfolgs-Sound, grüner Blitz
- **Falsche Antwort**: Sanfter Buzz, roter Blitz, "Beim nächsten Mal!" Nachricht
- **Ranglisten-Update**: Swoosh-Sound, animierte Positionswechsel
- **Endergebnisse**: Sieges-Fanfare für Gewinner, Feier für alle

---

## Schulmeisterschaften

### Monatliche Meisterschaftsstruktur

**Woche 1-3**: Qualifikationsphase
- Schüler verdienen XP durch reguläre Aktivitäten
- Gesamt-XP der Schule aggregiert
- Top 50 Schulen qualifizieren sich für Finals

**Woche 4**: Meisterschaftswoche
- Spezielle Meisterschafts-Quizze freigeschaltet
- 3x XP Multiplikator auf alle Aktivitäten
- Live Inter-Schul-Challenge am Freitag

**Preise**:
- 1. Platz Schule: €1.000 für Finanzbildungsprogramm der Schule
- 2. Platz: €500
- 3. Platz: €250
- Top 10: Anerkennung auf ING Website
- Alle Teilnehmer: Digitales Zertifikat

### Schulregistrierungs-Ablauf

```
Lehrer/Admin Portal:

1. Schule registrieren
   Schulname: [Gymnasium Musterstadt]
   Schulcode: Wird generiert
   Admin E-Mail: [lehrer@schule.de]

2. Schüler beitreten
   Schüler geben Schulcode in App ein
   ODER Lehrer sendet Einladungslink

3. Klassenverwaltung
   Klassengruppen erstellen
   Klassenfortschritt verfolgen
   Klassen-Challenges einrichten

4. Eltern-Einwilligung
   Automatischer Einwilligungs-Flow für Eltern
   Erforderlich für Wettbewerbsteilnahme
```

---

## User Stories für Demo Sidebar

### Story 1: Tägliche Challenge Abschluss
```yaml
ID: gamification_taegliche_challenge
Name: "Tägliche Challenge"
Beschreibung: "Schließe Leos heutige Challenge ab"
Kategorie: junior
Dauer: ~1 Minute

Ablauf:
1. Leo Benachrichtigung: "Deine tägliche Challenge ist bereit! 🎯"
2. Nutzer öffnet App um Challenge-Karte zu sehen
3. Challenge: "Beantworte 3 Fragen über ETFs"
4. Nutzer schließt schnelles Quiz ab (3 Fragen)
5. Leo: "Super! +75 XP und 🔥 Streak verlängert!"
6. Zeige aktualisierte XP-Leiste und Streak-Zähler
7. Teaser für morgige Challenge

Demo Nachrichten:
- Leo: "Hier ist deine tägliche Challenge! 3 ETF Fragen - bereit?"
- Nutzer: "Los geht's!"
- Leo: [Quiz Widget mit 3 Fragen]
- [Nach Abschluss]
- Leo: "🎉 Perfekt! +75 XP verdient. Du bist on fire mit einem 7-Tage Streak!"
- Leo: [Achievement Widget: "Wochen-Krieger" Badge freigeschaltet]
```

### Story 2: Ranglisten-Aufstieg
```yaml
ID: gamification_ranglisten_aufstieg
Name: "Ranglisten-Aufstieg"
Beschreibung: "Sieh deinen wöchentlichen Rang und konkurriere"
Kategorie: junior
Dauer: ~45 Sekunden

Ablauf:
1. Nutzer öffnet Rangliste
2. Sieht aktuelle Position (#42)
3. Leo: "Du bist nur 60 XP davon entfernt, Emma zu überholen!"
4. Schnelles Quiz-Vorschlag um Punkte zu verdienen
5. Quiz abgeschlossen, Rang animiert nach oben

Demo Nachrichten:
- Leo: "Lass uns die Rangliste checken! Du machst das super diese Woche."
- [Zeige Rangliste mit Nutzer auf #42]
- Leo: "Emma ist nur 60 XP voraus. Ein Quiz könnte das ändern!"
- Nutzer: "Zeig mir ein schnelles Quiz"
- Leo: [Quiz Widget: 5 Fragen]
- [Nach Quiz - 85 XP verdient]
- Leo: "BOOM! 💥 Du hast Emma UND Felix überholt! Neuer Rang: #40"
- [Animierte Rangliste zeigt Aufstieg]
```

### Story 3: Achievement Freischaltung
```yaml
ID: gamification_achievement_freischaltung
Name: "Badge freigeschaltet!"
Beschreibung: "Schalte einen neuen Achievement-Badge frei"
Kategorie: junior
Dauer: ~30 Sekunden

Ablauf:
1. Nutzer schließt 10. Quiz ab
2. Screen-Blitz, Feier-Animation
3. Leo: "NEUER BADGE FREIGESCHALTET! 🏆"
4. Badge-Enthüllungs-Animation
5. Zeige Badge in Sammlung hinzugefügt
6. Hinweis auf nächsten freischaltbaren Badge

Demo Nachrichten:
- [Nach Quiz-Abschluss]
- Leo: "Moment... ist das dein 10. Quiz? 👀"
- [Dramatische Pause]
- Leo: "🎉 NEUER BADGE FREIGESCHALTET!"
- [Achievement Widget: "Quiz Stammgast" mit Feier-Animation]
- Leo: "Füge ihn deinem Profil hinzu! Du bist 40 Quizze von 'Quiz Meister' entfernt"
```

### Story 4: Kahoot-Style Klassen-Challenge
```yaml
ID: gamification_klassen_kahoot
Name: "Klassen Quiz Challenge"
Beschreibung: "Nimm an Live-Klassenraum Quiz-Wettbewerb teil"
Kategorie: junior
Dauer: ~3 Minuten

Ablauf:
1. Nutzer gibt Spiel-Code vom Lehrer ein
2. Tritt Lobby bei, sieht Mitschüler
3. Host startet Spiel
4. 10 Schnellfeuer-Fragen
5. Live-Rangliste zwischen Fragen
6. Endergebnisse und XP-Vergabe

Demo Nachrichten:
- Leo: "Bereit für die Klassen-Challenge? Gib den Code ein, den dein Lehrer geteilt hat!"
- Nutzer: "FINANZ-2847"
- Leo: "Trete 'Frau Müllers Aktien-Quiz' bei... 18 Spieler in Lobby"
- [Lobby-Animation zeigt beitretende Spieler]
- Leo: "Spiel startet in 3... 2... 1... LOS!"
- [Simuliertes Kahoot-Style Quiz mit 5 Fragen]
- [Nach jeder Frage: Ranglisten-Update]
- Leo: "ENDERGEBNISSE: Du bist 3. geworden! 🥉 +100 XP"
- Leo: "Gut gemacht! Dein Klassendurchschnitt war 72% - besser als gestern!"
```

### Story 5: Schulmeisterschafts-Eintritt
```yaml
ID: gamification_schulmeisterschaft
Name: "Schulmeisterschaft"
Beschreibung: "Tritt für deine Schule bei der Monatsmeisterschaft an"
Kategorie: junior
Dauer: ~2 Minuten

Ablauf:
1. Leo kündigt Meisterschaftswoche an
2. Zeige aktuellen Schulrang
3. Spezielles Meisterschafts-Quiz verfügbar
4. Quiz mit 3x XP Multiplikator abschließen
5. Schulrang verbessern beobachten
6. Team-Feier-Moment

Demo Nachrichten:
- Leo: "🏆 MEISTERSCHAFTSWOCHE IST DA!"
- Leo: "Deine Schule (Gymnasium Musterstadt) ist auf Rang #23. Kannst du helfen höher zu klettern?"
- Leo: "Meisterschafts-Quizze verdienen 3x XP diese Woche!"
- [Zeige spezielles Meisterschafts-Quiz Widget]
- Nutzer: "Lass uns das machen!"
- [Quiz mit 10 schwierigeren Fragen]
- Leo: "Unglaublich! +450 XP (mit 3x Bonus)"
- Leo: "Deine Schule ist auf #21 gesprungen! 2 Plätze näher an den Top 20!"
- [Animation zeigt Schule klettert Rangliste hoch]
```

### Story 6: Wochen-Gewinner Ankündigung
```yaml
ID: gamification_wochen_gewinner
Name: "Wochen-Gewinner"
Beschreibung: "Sieh wer den Wettbewerb dieser Woche gewonnen hat"
Kategorie: junior
Dauer: ~1 Minute

Ablauf:
1. Montag Morgen Benachrichtigung
2. Leo enthüllt Wochen-Gewinner
3. Zeige vergebene Preise
4. Neue Woche startet
5. Ermutigt Nutzer mitzumachen

Demo Nachrichten:
- Leo: "📣 Die Ergebnisse der letzten Woche sind da!"
- Leo: "🥇 Lisa (2.450 XP) - €25 Bonus"
- Leo: "🥈 Max (2.380 XP) - €15 Bonus"  
- Leo: "🥉 Tom (2.290 XP) - €10 Bonus"
- Leo: "Du hast #42 mit 840 XP erreicht - deine beste Woche bisher!"
- Leo: "Neue Woche, frischer Start! Erstes Quiz der Woche verdient 2x XP 🎁"
- Nutzer: "Lass uns diese Woche auf Top 10 zielen!"
- Leo: "So ist es richtig! Hier ist dein erstes Quiz..."
```

### Story 7: Streak-Rettungs-Erinnerung
```yaml
ID: gamification_streak_erinnerung
Name: "Rette deinen Streak!"
Beschreibung: "Dringende Erinnerung um Streak zu halten"
Kategorie: junior
Dauer: ~30 Sekunden

Ablauf:
1. Abend-Benachrichtigung (Streak läuft bald ab)
2. Leo zeigt Streak-Status
3. Schnelle Aktion um Streak zu retten
4. Streak verlängert Feier

Demo Nachrichten:
- Leo: "⚠️ Dein 12-Tage Streak läuft in 2 Stunden ab!"
- Leo: "Nur eine schnelle Frage um ihn am Leben zu halten?"
- Nutzer: "Ja, schnell!"
- Leo: [Einzelne Quiz-Frage]
- [Nutzer antwortet richtig]
- Leo: "🔥 STREAK GERETTET! Tag 13 beginnt morgen!"
- Leo: "Fun Fact: Du bist in den Top 5% der Streak-Halter!"
```

---

## Technische Implementierungshinweise

### Punkte & XP Speicherung

```typescript
interface UserGamification {
  userId: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  equippedBadges: string[]; // max 3
  achievements: Achievement[];
  quizHistory: QuizResult[];
  schoolCode?: string;
  lastActivityDate: Date;
}
```

### Ranglisten-Abfrage

```sql
-- Wochen-Rangliste
SELECT 
  user_id,
  username,
  weekly_xp,
  RANK() OVER (ORDER BY weekly_xp DESC) as rank
FROM user_gamification
WHERE week_start = CURRENT_WEEK()
ORDER BY weekly_xp DESC
LIMIT 100;
```

### Echtzeit-Kahoot Events

```typescript
// WebSocket Events für Live-Quiz
socket.on('game:join', { gameCode, userId });
socket.on('game:start', { questions });
socket.on('answer:submit', { questionId, answer, timestamp });
socket.on('leaderboard:update', { standings });
socket.on('game:end', { finalResults });
```

---

*Zuletzt aktualisiert: November 2025*
