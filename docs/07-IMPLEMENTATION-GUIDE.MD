# Implementierungsleitfaden für ING-App

> Dieses Dokument liefert spezifische Implementierungsvorschläge für das [ing-app Repository](https://github.com/Wladefant/ing-app) basierend auf den LEO Spezifikationen.

---

## Inhaltsverzeichnis
1. [Aktueller Implementierungsstatus](#aktueller-implementierungsstatus)
2. [Hochprioritäre Änderungen](#hochprioritäre-änderungen)
3. [Datei-für-Datei Vorschläge](#datei-für-datei-vorschläge)
4. [Neue zu erstellende Dateien](#neue-zu-erstellende-dateien)
5. [Demo Sidebar User Stories](#demo-sidebar-user-stories)

---

## Aktueller Implementierungsstatus

Basierend auf Analyse der ing-app Codebasis:

### ✅ Funktionierende Features
- Bottom Navigation
- Profil-Wechsel (Adult/Junior)
- Leo Chat Overlay mit Basic KI
- Quiz Widget Anzeige
- Aktien-Detailansicht
- Demo-Szenario-Trigger
- Basic Dashboard-Ansichten

### ⚠️ Teilweise Features
- Quiz-System (nur statische Fragen)
- Gamification-Anzeige (kein echtes XP-Tracking)
- Aktien-Widgets (nur visuell)
- Überweisungs-Flow (unvollständig)

### ❌ Fehlende Features (MVP)
- KI-generierte Quiz-Fragen
- Echtes XP/Punkte-System
- Kahoot-Style Multiplayer
- Smart Notifications
- Dokumenten-Scanning
- Abo-Erkennung und -Verwaltung

### 🔮 Zukunfts-Features (NICHT im MVP)
- Sprachmodus
- Eltern-Dashboard (vollständig)

---

## Hochprioritäre Änderungen

### 1. Quiz-System Überarbeitung

**Aktuelles Problem**: Quiz verwendet hardcodierte statische Fragen in `junior/quiz.tsx`

**Lösung**: KI-generierten Quiz-Service erstellen

**Zu erstellende Datei**: `client/src/lib/quiz-generator.ts`

```typescript
import OpenAI from 'openai';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GeneratedQuiz {
  topic: string;
  questions: QuizQuestion[];
  estimatedXP: number;
}

const QUIZ_PROMPT = \`
Du bist Leo, ein freundlicher Finanz-Assistent für junge Menschen.
Erstelle ein Quiz zum Thema: {topic}

Anforderungen:
- {count} Fragen
- Schwierigkeit: {difficulty}
- Sprache: Einfaches Deutsch, keine Fachbegriffe
- Jede Frage hat 4 Antwortmöglichkeiten
- Erkläre nach jeder Antwort warum sie richtig/falsch ist

Antworte im JSON-Format:
{
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "..."
    }
  ]
}
\`;

export async function generateQuiz(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count: number = 5
): Promise<GeneratedQuiz> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = QUIZ_PROMPT
    .replace('{topic}', topic)
    .replace('{count}', count.toString())
    .replace('{difficulty}', difficulty);

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content || '{}');
  
  const xpMap = { easy: 10, medium: 15, hard: 25 };
  const estimatedXP = count * xpMap[difficulty];

  return {
    topic,
    questions: parsed.questions,
    estimatedXP
  };
}
```

### 2. Punkte/XP System hinzufügen

**Zu erstellende Datei**: `client/src/lib/gamification.ts`

```typescript
interface UserProgress {
  totalXP: number;
  weeklyXP: number;
  level: number;
  streak: number;
  badges: string[];
  quizHistory: QuizResult[];
}

interface QuizResult {
  topic: string;
  score: number;
  total: number;
  xpEarned: number;
  timestamp: Date;
}

// Level-Schwellen
const LEVELS = [
  { level: 1, xp: 0, title: 'Finanz-Anfänger' },
  { level: 2, xp: 500, title: 'Geld-Lerner' },
  { level: 3, xp: 1200, title: 'Spar-Fuchs' },
  { level: 4, xp: 2500, title: 'Budget-Held' },
  { level: 5, xp: 5000, title: 'Finanz-Entdecker' },
  // ...etc
];

export function calculateLevel(xp: number): { level: number; title: string; progress: number } {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
      break;
    }
  }
  
  const progress = nextLevel.xp === currentLevel.xp ? 100 :
    ((xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100;
  
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    progress
  };
}

export function calculateQuizXP(
  correctAnswers: number,
  totalQuestions: number,
  difficulty: string,
  streakMultiplier: number
): number {
  const baseXP = { easy: 10, medium: 15, hard: 25 }[difficulty] || 15;
  const xp = correctAnswers * baseXP;
  
  // Perfekte Punktzahl Bonus
  const perfectBonus = correctAnswers === totalQuestions ? 50 : 0;
  
  // Streak Multiplikator
  const finalXP = Math.floor((xp + perfectBonus) * streakMultiplier);
  
  return finalXP;
}

// In localStorage speichern (sollte Backend in Produktion sein)
export function getUserProgress(): UserProgress {
  const stored = localStorage.getItem('leo_user_progress');
  if (stored) return JSON.parse(stored);
  
  return {
    totalXP: 0,
    weeklyXP: 0,
    level: 1,
    streak: 0,
    badges: [],
    quizHistory: []
  };
}

export function saveUserProgress(progress: UserProgress): void {
  localStorage.setItem('leo_user_progress', JSON.stringify(progress));
}

export function addXP(amount: number, source: string): UserProgress {
  const progress = getUserProgress();
  progress.totalXP += amount;
  progress.weeklyXP += amount;
  
  const levelInfo = calculateLevel(progress.totalXP);
  progress.level = levelInfo.level;
  
  saveUserProgress(progress);
  return progress;
}
```

### 3. Quiz Widget mit echtem Quiz verbinden

**Zu modifizierende Datei**: `client/src/components/ing/leo/chat-overlay.tsx`

**Änderung**:

```typescript
// In chat-overlay.tsx, QuizWidget render Abschnitt finden

// Vorher:
function QuizWidget({ topic, questions, xp, difficulty, onStart }: { ... }) {
  return (
    <div>
      ...
      <button onClick={onStart}>Quiz starten</button>
    </div>
  );
}

// Nachher - mit State verbinden und echtes Quiz starten:
function QuizWidget({ topic, questions, xp, difficulty, onStart }: { ... }) {
  const handleStartQuiz = async () => {
    if (onStart) {
      // Wenn KI-generiertes Quiz bereit, nutzen
      onStart();
    } else {
      // Neues Quiz bei Bedarf generieren
      try {
        const quiz = await generateQuiz(topic, difficulty);
        // Quiz-State triggern
        setQuizState({
          isActive: true,
          topic,
          difficulty,
          questions: quiz.questions,
          currentQuestion: 0,
          score: 0,
          answered: false,
          selectedAnswer: null,
          showExplanation: false,
          completed: false
        });
      } catch (error) {
        console.error('Quiz-Generierung fehlgeschlagen:', error);
      }
    }
  };
  
  return (
    <div>
      ...
      <button onClick={handleStartQuiz}>Quiz starten</button>
    </div>
  );
}
```

### 4. Nicht-funktionale Buttons reparieren

**Zu modifizierende Datei**: `client/src/pages/ing-app.tsx`

Navigations-Handler für fehlende Buttons hinzufügen:

```typescript
// Diese Handler zur Haupt ing-app Komponente hinzufügen

const handleNavigate = (screen: string, params?: any) => {
  switch (screen) {
    case 'stock-search':
      setCurrentScreen('invest');
      // Such-Modal öffnen: Modal mit Sucheingabefeld zeigen,
      // passende Aktien während Eingabe anzeigen, Aktie auswählen
      // um zu Detailansicht zu navigieren
      setShowSearchModal(true);
      break;
    case 'savings-goals':
      setCurrentScreen('junior-savings');
      break;
    case 'achievements':
      setCurrentScreen('achievements'); // Diesen Screen erstellen
      break;
    case 'buy-stock':
      setCurrentScreen('stock-detail');
      setSelectedStock(params?.symbol);
      // Kauf-Modal öffnen: Aktienkurs anzeigen, Mengen-Eingabe (Stücke oder Euro),
      // Gesamtkosten berechnen, Portfolio-Auswirkung zeigen, mit Leo-Erklärung bestätigen
      // Für Junior: virtueller Kauf mit V€ Währung
      // Für Adult: echter Kauf-Flow mit Bestätigung
      setShowBuyModal(true);
      break;
    // ... etc
  }
};

// An Kind-Komponenten weitergeben
<JuniorDashboard 
  onNavigate={handleNavigate}
  userProgress={userProgress}
/>
```

---

## Demo Sidebar User Stories

Hier sind vollständige User Story Konfigurationen zum Hinzufügen zu demo-scenarios.ts:

```typescript
// Zu DEMO_SCENARIOS in client/src/lib/demo-scenarios.ts hinzufügen

// STORY 1: Komplette Quiz Journey (Junior)
complete_quiz_journey: {
  id: 'complete_quiz_journey',
  name: '📚 Quiz Komplettablauf',
  description: 'Vollständiger Quiz von Start bis XP',
  category: 'junior',
  messages: [
    { id: 'cqj1', sender: 'leo', text: 'Zeit für dein tägliches Quiz! 🎯', timestamp: new Date() },
    { id: 'cqj2', sender: 'leo', text: 'Heute: ETF Grundlagen - 5 Fragen', timestamp: new Date(), widgetType: 'quiz', widgetData: { topic: 'ETFs', questions: 5, xp: 100, difficulty: 'mittel' } },
    { id: 'cqj3', sender: 'user', text: 'Quiz starten!', timestamp: new Date() },
    { id: 'cqj4', sender: 'leo', text: 'Frage 1: Was bedeutet ETF?\\n\\nA) Exchange Traded Fund\\nB) European Tax Form\\nC) Extra Trading Fee\\nD) End-Term Financing', timestamp: new Date() },
    { id: 'cqj5', sender: 'user', text: 'A', timestamp: new Date() },
    { id: 'cqj6', sender: 'leo', text: '✅ Richtig! +20 XP\\n\\nETF steht für Exchange Traded Fund - ein börsengehandelter Fonds.', timestamp: new Date() },
    { id: 'cqj_final', sender: 'leo', text: '🎉 Quiz abgeschlossen!\\n\\n5/5 richtig\\n+100 XP (+50 Bonus für Perfektion!)\\n\\nDu bist jetzt auf Level 6!', timestamp: new Date(), widgetType: 'achievement', widgetData: { name: 'Perfekte Punktzahl', xp: 150, description: 'Alle Fragen richtig!' } }
  ]
},

// STORY 2: Erstes Investment (Junior)
first_virtual_investment: {
  id: 'first_virtual_investment',
  name: '📈 Erster Trade',
  description: 'Junior kauft erste virtuelle Aktie',
  category: 'junior',
  messages: [
    { id: 'fvi1', sender: 'user', text: 'Ich will Apple kaufen!', timestamp: new Date() },
    { id: 'fvi2', sender: 'leo', text: 'Super Wahl für den Anfang! 🍎\\n\\nApple ist ein Tech-Gigant, der iPhones, Macs und mehr herstellt.', timestamp: new Date(), widgetType: 'stock', widgetData: { symbol: 'AAPL', price: 178.50, change: 1.5 } },
    { id: 'fvi3', sender: 'leo', text: 'Bevor du kaufst - lass mich erklären:\\n\\n• Aktien können steigen ODER fallen\\n• Apple ist relativ stabil (Blue Chip)\\n• Du hast V€2.450 virtuelles Geld\\n\\nWie viel möchtest du investieren?', timestamp: new Date() },
    { id: 'fvi4', sender: 'user', text: '500 Euro', timestamp: new Date() },
    { id: 'fvi5', sender: 'leo', text: 'V€500 = ca. 2,8 Apple Aktien (aufgerundet auf 3)\\n\\nDas wäre 20% deines Portfolios. Gute Startgröße!\\n\\n⚠️ Zur Erinnerung: Das ist virtuelles Geld zum Lernen.', timestamp: new Date() },
    { id: 'fvi6', sender: 'leo', text: '✅ Trade ausgeführt!\\n\\n3x Apple (AAPL)\\nKaufpreis: €178,50\\nGesamt: V€535,50\\n\\n+100 XP für deinen ersten Trade! 🎉', timestamp: new Date(), widgetType: 'achievement', widgetData: { name: 'Erster Trade', xp: 100, description: 'Dein erster virtueller Aktienkauf!' } }
  ]
},

// STORY 3: Smart Transfer (Adult)
smart_transfer_complete: {
  id: 'smart_transfer_complete',
  name: '💸 Smart Transfer',
  description: 'KI-unterstützte Überweisung',
  category: 'adult',
  messages: [
    { id: 'stc1', sender: 'leo', text: '🏠 Erinnerung: Heute ist der 1.!\\n\\nMiete ist fällig. Soll ich €800 an deinen Vermieter senden?', timestamp: new Date() },
    { id: 'stc2', sender: 'leo', text: '', timestamp: new Date(), widgetType: 'transfer', widgetData: { recipient: 'Max Mustermann', amount: 800, reference: 'Miete Dezember' } },
    { id: 'stc3', sender: 'user', text: 'Ja, senden', timestamp: new Date() },
    { id: 'stc4', sender: 'leo', text: '✅ €800 an Max Mustermann gesendet!\\n\\nReferenz: Miete Dezember\\n\\nSoll ich das als monatlich wiederkehrend speichern?', timestamp: new Date() },
    { id: 'stc5', sender: 'user', text: 'Ja bitte', timestamp: new Date() },
    { id: 'stc6', sender: 'leo', text: '📅 Erledigt! Ich erinnere dich jeden Monat am 1. an die Miete.\\n\\nDu kannst die Erinnerung jederzeit in den Einstellungen anpassen.', timestamp: new Date() }
  ]
},

// STORY 4: Ausgaben-Insight (Adult)
spending_deep_dive: {
  id: 'spending_deep_dive',
  name: '📊 Ausgabenanalyse',
  description: 'Detaillierte Ausgabenübersicht',
  category: 'adult',
  messages: [
    { id: 'sdd1', sender: 'user', text: 'Wo geht mein Geld hin?', timestamp: new Date() },
    { id: 'sdd2', sender: 'leo', text: 'Lass mich das analysieren... 🔍', timestamp: new Date() },
    { id: 'sdd3', sender: 'leo', text: 'November 2025 Zusammenfassung:', timestamp: new Date(), widgetType: 'spending_chart', widgetData: { category: 'Monat November', amount: 2145.67, percentChange: -9.8, breakdown: [{ name: 'Wohnen', amount: 850 }, { name: 'Essen', amount: 420 }, { name: 'Transport', amount: 280 }] } },
    { id: 'sdd4', sender: 'leo', text: '💡 Auffälligkeiten:\\n\\n1. Essen: +€67 mehr als üblich (12 Restaurant-Besuche)\\n2. Shopping: €0 - gut gespart!\\n3. Abos: €61,87 (Netflix nicht genutzt seit 45 Tagen)\\n\\nMöchtest du Spartipps?', timestamp: new Date() },
    { id: 'sdd5', sender: 'user', text: 'Was ist mit Netflix?', timestamp: new Date() },
    { id: 'sdd6', sender: 'leo', text: 'Du zahlst €17,99/Monat für Netflix, aber hast seit 45 Tagen nichts geschaut.\\n\\nDas sind €215,88 pro Jahr!\\n\\nOptionen:\\n• Kündigen (spart €215,88/Jahr)\\n• Pausieren (spart bis du wieder schauen willst)\\n• Behalten (kein Urteil!)', timestamp: new Date(), widgetType: 'subscription_card', widgetData: { name: 'Netflix', amount: 17.99, lastUsed: '45 Tage', action: 'Kündigen empfohlen' } }
  ]
}
```

---

## Zusammenfassung der Implementierungsaufgaben

> **Hinweis**: Sprachmodus und vollständiges Eltern-Dashboard sind **Phase 4 Features** und gehören NICHT in den MVP.

### Sofort (Woche 1)
1. `quiz-generator.ts` erstellen
2. `gamification.ts` erstellen
3. Quiz Widget mit echtem Quiz-State verbinden
4. XP-Anzeige im Junior Dashboard hinzufügen

### Kurzfristig (Woche 2-3)
1. Achievements Screen erstellen
2. Sparziele Screen erstellen
3. Nicht-funktionale Buttons reparieren
4. Demo Sidebar User Stories hinzufügen

### Mittelfristig (Woche 4-6) - Noch im MVP
1. Echte Rangliste implementieren
2. Streak-Tracking hinzufügen
3. Abo-Erkennung implementieren
4. Dokumenten-Scanning (Basic)
5. Smart Notifications

### Zukunft (Phase 4) - NICHT im MVP
1. Sprachmodus
2. Vollständiges Eltern-Dashboard
3. Personalisierte UI
4. Offline-Modus

---

*Zuletzt aktualisiert: November 2025*
