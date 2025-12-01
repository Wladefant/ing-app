# Zukunftsvision & Roadmap

> Dieses Dokument beschreibt geplante Features für zukünftige Releases, technische Überlegungen und die Langzeitvision für LEO.

---

## Inhaltsverzeichnis
1. [Implementierungsphasen](#implementierungsphasen)
2. [Zukünftige Features](#zukünftige-features)
3. [Technische Überlegungen](#technische-überlegungen)
4. [Personalisierte UI Vision](#personalisierte-ui-vision)
5. [API & Integrations-Roadmap](#api--integrations-roadmap)

---

## Implementierungsphasen

> **🎯 MVP-Anforderung**: Für die Challenge-Präsentation müssen **alle Features bis einschließlich Phase 3** implementiert werden. Phase 4 ist Zukunftsvision und wird NICHT im MVP benötigt.

### Was ist im MVP enthalten?
- ✅ Phase 1: Kern-Funktionalität
- ✅ Phase 2: Erweitertes Lernen
- ✅ Phase 3: Smart Finance
- ❌ Phase 4: Zukunfts-Features (NICHT im MVP)

---

### Phase 1: MVP Grundlagen (Monat 0-6)
**Fokus**: Kern-Funktionalität und Basic KI-Chat

| Feature | Priorität | Status |
|---------|-----------|--------|
| Leo Chat Interface | Hoch | 🟡 Teilweise |
| Basic Quiz System | Hoch | 🟡 Teilweise |
| Junior Dashboard | Hoch | 🟡 Teilweise |
| Adult Dashboard | Hoch | 🟡 Teilweise |
| Profil-Wechsel | Hoch | ✅ Fertig |
| Transaktions-Anzeige | Hoch | ✅ Fertig |
| Aktien-Ansicht | Mittel | ✅ Fertig |
| Demo Sidebar | Mittel | ✅ Fertig |

### Phase 2: Erweitertes Lernen (Monat 6-12) - **IM MVP**
**Fokus**: KI-gestütztes Lernen und Gamification

| Feature | Priorität | Status |
|---------|-----------|--------|
| KI-generierte Quizze | Hoch | 🔴 Nicht begonnen |
| Adaptive Schwierigkeit | Hoch | 🔴 Nicht begonnen |
| Kahoot-Style Challenges | Hoch | 🔴 Nicht begonnen |
| Ranglisten | Mittel | 🟡 Teilweise |
| Achievement System | Mittel | 🟡 Teilweise |
| Punkte & XP Tracking | Mittel | 🔴 Nicht begonnen |
| Schul-Registrierung | Niedrig | 🔴 Nicht begonnen |

### Phase 3: Smart Finance (Monat 12-18) - **IM MVP**
**Fokus**: Intelligente Finanzassistenz

| Feature | Priorität | Status |
|---------|-----------|--------|
| Smart Notifications | Hoch | 🔴 Nicht begonnen |
| Ausgabenanalyse | Hoch | 🟡 Teilweise |
| Abo-Erkennung | Mittel | 🟡 Teilweise |
| Dokumenten-Scanning | Mittel | 🔴 Nicht begonnen |
| Budget-Tracking | Mittel | 🔴 Nicht begonnen |
| Vertragsverhandlungs-Tipps | Niedrig | 🔴 Nicht begonnen |

### Phase 4: Fortgeschrittene Features (Monat 18-24) - **NICHT IM MVP**
**Fokus**: Premium Features und Feinschliff - Diese Features werden erst NACH dem MVP implementiert

| Feature | Priorität | Status | Hinweis |
|---------|-----------|--------|---------|
| Sprachmodus | Mittel | 🔴 Nicht begonnen | Zukunft |
| Eltern-Dashboard (vollständig) | Mittel | 🔴 Nicht begonnen | Zukunft |
| Kauf/Verkauf Flow (echt) | Hoch | 🔴 Nicht begonnen | Zukunft |
| Personalisierte UI | Niedrig | 🔴 Nicht begonnen | Zukunft |
| Offline-Modus | Niedrig | 🔴 Nicht begonnen | Zukunft |
| Drittanbieter-API | Niedrig | 🔴 Nicht begonnen | Zukunft |

---

## Zukünftige Features

### Sprachmodus (Phase 4)

**Beschreibung**: Vollständige Sprach-Interaktion mit Leo

**Komponenten**:
- Speech-to-Text (Nutzer spricht)
- Text-to-Speech (Leo antwortet hörbar)
- Sprachbefehle für Navigation
- Sprach-aktivierte Überweisungen (mit PIN-Bestätigung)

**Technische Anforderungen**:
- Whisper API für Spracherkennung
- ElevenLabs oder Google TTS für Sprachausgabe
- WebSpeech API als Fallback
- Audioverarbeitung auf Gerät für Datenschutz

**UI-Konzept**:
```
┌─────────────────────────────────────┐
│                                     │
│        🔊 Leo hört zu...           │
│                                     │
│           ┌─────────┐              │
│           │  ○○○○○  │              │
│           │ ○○○○○○○ │ ← Sprachwelle│
│           │  ○○○○○  │              │
│           └─────────┘              │
│                                     │
│     "Wie viel habe ich für..."     │
│                                     │
│        [Tippen statt sprechen]      │
└─────────────────────────────────────┘
```

**Junior-Spezifisch**:
- "Hey Leo, quiz mich!"
- "Was sind ETFs?"
- Fun Facts als Antwort

**Adult-Spezifisch**:
- "Schick €50 an Mama"
- "Wie war meine Woche?"
- Schnelle Kontostandprüfung

---

### Eltern-Dashboard (Phase 4)

**Beschreibung**: Dedizierte Ansicht für Eltern von Junior-Nutzern

**Features**:
- Echtzeit-Kontostandansicht
- Transaktions-Alerts
- Lernfortschritt-Tracking
- Ausgabelimit-Kontrollen
- Wochenberichte

**Was Eltern sehen können**:
- ✅ Kontostand mit echtem Geld
- ✅ Echte Transaktionen
- ✅ Virtuelles Portfolio-Übersicht
- ✅ Quiz-Abschlussraten
- ✅ XP und Level-Fortschritt
- ❌ Chat-Konversationen (Privatsphäre)
- ❌ Einzelne virtuelle Trades

---

### Smarte Abo-Erkennung (Phase 2-3)

**Beschreibung**: KI-gestützte Abo-Erkennung und -Verwaltung

> **Wichtig**: Abo-**Erkennung** ist MVP (Phase 2). Ungenutzte Abos erkennen via Transaktionsabwesenheit ist **nicht möglich** und wird nicht implementiert.

**Was im MVP möglich ist:**
- Mustererkennung in Transaktionen (regelmäßige Abbuchungen)
- Neue Abos automatisch erkennen
- Preiserhöhungs-Alerts
- Kündigungshilfe
- Abo-Übersicht anzeigen

**Was NICHT möglich ist:**
- Erkennen ob Netflix geschaut wird
- Erkennen ob Fitnessstudio besucht wird
- Jede Art von Nutzungsverfolgung außerhalb der ING App

**Erkennungsmethode:**
- Regelmäßige Beträge in regelmäßigen Intervallen
- Händler-Kategorie-Codes (MCC)
- Bekannte Abo-Dienste Datenbank
- Pattern: €X.99 jeden Monat = wahrscheinlich Abo

**Features (MVP):**
- Neue Abos automatisch erkennen
- Preiserhöhungs-Alerts
- Kündigungserinnerungen
- Alternative Vorschläge
- Abo-Jahreskosten-Übersicht

---

### Dokumenten-Intelligenz (Phase 3)

**Beschreibung**: Finanzdokumente scannen und verstehen

**Unterstützte Dokumente**:
- Rechnungen (Strom, Wasser, Internet)
- Versicherungsverträge
- Kontoauszüge
- Steuerdokumente
- Gehaltsabrechnungen

**Verarbeitungs-Pipeline**:
```
Kamera/Upload → OCR → Textextraktion → GPT-Analyse → Nutzer-Erklärung
```

**Features**:
- Dokumenttyp automatisch kategorisieren
- Wichtige Beträge und Daten extrahieren
- Begriffe in einfacher Sprache erklären
- Mit Marktpreisen vergleichen
- Handlungspunkte vorschlagen

---

## Personalisierte UI Vision

### Langzeit-Ziel (2-3 Jahre)

Die ultimative KI-First-Experience passt nicht nur Inhalte sondern die UI selbst an.

### Personalisierungs-Level

| Level | Was sich anpasst | Zeitraum |
|-------|------------------|----------|
| 1. Inhalt | Tipps, Quizze, News | Jetzt |
| 2. Widgets | Reihenfolge, Priorität, Sichtbarkeit | 6 Monate |
| 3. Shortcuts | Schnellaktionen basierend auf Gewohnheiten | 12 Monate |
| 4. Layout | Button-Positionen, Informationsdichte | 18 Monate |
| 5. Volle UI | Farben, Schriften, Struktur | 24 Monate |

### Wie es funktionieren würde

**Lernphase (2-4 Wochen)**:
- Verfolgen welche Features Nutzer am meisten nutzt
- Tageszeit-Muster notieren
- Navigationspfade beobachten
- Ignorierte vs. genutzte Features aufzeichnen

**Anpassungsphase**:
- Häufig genutzte Items schrittweise an prominente Positionen bewegen
- Ungenutzte Features weniger sichtbar machen
- Informationsdichte an Nutzer-Präferenz anpassen
- Farbakzente personalisieren (innerhalb ING-Richtlinien)

### Nutzerkontrolle Anforderungen

**Essentiell für Vertrauen**:
- Nutzer muss Personalisierung zustimmen
- Änderungen passieren schrittweise (keine plötzlichen Wechsel)
- "Auf Standard zurücksetzen" immer verfügbar
- Änderungen vor Anwendung vorschauen
- Erklären warum jede Änderung gemacht wurde

---

## API & Integrations-Roadmap

### Aktuell verwendete APIs

| Service | Zweck | Status |
|---------|-------|--------|
| OpenAI GPT-4 | Chat, Erklärungen | ✅ Integriert |
| ING Core Banking (mock) | Kontodaten | 🟡 Gemockt |
| Aktiendaten (mock) | Preise, Charts | 🟡 Gemockt |

### Benötigte API-Integrationen

#### Phase 2: Lern-Features

| API | Zweck | Geschätzte Kosten |
|-----|-------|-------------------|
| OpenAI GPT-4 (mehr) | Quiz-Generierung | ~€500/Monat |
| DALL-E 3 | Quiz-Bilder | ~€200/Monat |
| Finanzbildungs-API | Verifizierte Inhalte | Lizenzgebühr |

#### Phase 3: Smart Finance

| API | Zweck | Geschätzte Kosten |
|-----|-------|-------------------|
| Azure Form Recognizer | Dokument-OCR | ~€300/Monat |
| News Aggregation API | Personalisierte News | ~€100/Monat |
| Echte Aktiendaten API | Live-Preise | ~€500/Monat |

#### Phase 4: Fortgeschritten

| API | Zweck | Geschätzte Kosten |
|-----|-------|-------------------|
| Whisper API | Spracherkennung | ~€200/Monat |
| ElevenLabs | Sprachsynthese | ~€300/Monat |
| Push Notification | Alerts | ~€100/Monat |

### Datenquellen für KI

| Datentyp | Quelle | Sensitivität |
|----------|--------|--------------|
| Transaktionshistorie | ING Core | Hoch |
| Kontostand | ING Core | Hoch |
| Nutzer-Präferenzen | Lokaler Speicher | Mittel |
| Quiz-Performance | Leo Datenbank | Niedrig |
| Aktienkurse | Markt-API | Öffentlich |
| Nachrichtenartikel | News-API | Öffentlich |

### Datenschutz-Überlegungen

| Daten | Wo gespeichert | Geteilt mit |
|-------|----------------|-------------|
| Chat-Verlauf | Nutzer-Gerät | OpenAI (Verarbeitung) |
| Transaktionen | ING Server | Leo KI (Analyse) |
| Persönliche Infos | ING Server | Nie mit KI |
| Quiz-Ergebnisse | Leo Datenbank | Anonymisiert für Ranglisten |
| Präferenzen | Nutzer-Gerät | Nicht geteilt |

---

## Zeitleisten-Zusammenfassung

```
     2024                    2025                    2026
       │                       │                       │
       │   ┌─────────────────┐ │   ┌─────────────────┐ │
       │   │ Phase 1: MVP    │ │   │ Phase 3: Smart  │ │
       │   │ Basic Features  │ │   │ Finance         │ │
       │   │ KI Chat         │ │   │ Notifications   │ │
       │   │ Quiz Basics     │ │   │ Dokumente       │ │
       │   └─────────────────┘ │   │ Budgets         │ │
       │                       │   └─────────────────┘ │
       │   ┌─────────────────┐ │                       │
       │   │ Phase 2:        │ │   ┌─────────────────┐ │
       │   │ Erweitertes     │ │   │ Phase 4:        │ │
       │   │ Lernen          │ │   │ Fortgeschritten │ │
       │   │ KI Quizze       │ │   │ Sprachmodus     │ │
       │   │ Kahoot          │ │   │ Eltern-Dash     │ │
       │   │ Ranglisten      │ │   │ Personal UI     │ │
       │   └─────────────────┘ │   └─────────────────┘ │
       │                       │                       │
```

---

*Zuletzt aktualisiert: November 2025*
