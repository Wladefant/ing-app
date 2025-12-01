# GitHub Copilot Instructions for LEO Banking App

## 🏦 Project Overview

**LEO** is an AI-powered banking assistant for ING targeting German teenagers (13-29) learning financial literacy.

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js with OpenAI integration
- **Styling**: ING brand colors (#ff6200 primary orange)
- **State**: React useState + localStorage persistence
- **AI**: OpenAI GPT-4o-mini with function calling

---

## 📁 Project Structure

```
client/src/
├── pages/ing-app.tsx          # Main app router & state
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── ing/
│       ├── layout.tsx         # BottomNav, Headers
│       ├── leo/               # AI chat components
│       └── screens/           # App screens
│           ├── adult/         # Adult profile screens
│           └── junior/        # Junior profile screens
├── lib/
│   ├── storage.ts             # localStorage persistence
│   ├── openai.ts              # OpenAI client functions
│   └── utils.ts               # Utility functions
└── hooks/                     # Custom React hooks

server/
├── index.ts                   # Express server
├── routes.ts                  # API routes + OpenAI proxy
└── storage.ts                 # Server-side storage
```

---

## 🎨 Design System

### Colors
```css
--ing-orange: #ff6200;     /* Primary CTAs, highlights */
--ing-orange-hover: #e55800;
--ing-bg-light: #f4f4f4;   /* Page backgrounds */
--ing-bg-card: #ffffff;    /* Card backgrounds */
--ing-text-primary: #1f1f1f;
--ing-text-secondary: #666666;
--ing-teal: #00c4cc;       /* Junior profile accent */
--ing-success: #4caf50;
--ing-error: #f44336;
```

### Components
- Use **shadcn/ui** components (Button, Dialog, Input, Toast)
- Use **Lucide React** for icons
- Use **Framer Motion** for animations (sparingly)
- Use **Recharts** for charts and graphs

### Typography
- System fonts, 14px base
- Bold headings (font-bold)
- Keep text concise and scannable

---

## 🔧 Coding Standards

### TypeScript
```typescript
// ✅ Always type props and state
interface QuizProps {
  topic: string;
  difficulty: "einfach" | "mittel" | "schwer";
  onComplete: (score: number) => void;
}

// ✅ Use strict typing, no 'any'
const result: QuizResult = await generateQuiz(topic);

// ✅ Use const for functions
const handleSubmit = () => { ... };
```

### React Components
```typescript
// ✅ Use functional components with hooks
export function QuizScreen({ topic, onBack }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ Use useEffect for side effects
  useEffect(() => {
    loadQuestions();
  }, [topic]);
  
  // ✅ Use useMemo for expensive calculations
  const score = useMemo(() => 
    calculateScore(answers), [answers]);
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Component content */}
    </div>
  );
}
```

### API Calls
```typescript
// ✅ Use try/catch with proper error handling
async function fetchData() {
  try {
    const response = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty })
    });
    
    if (!response.ok) throw new Error("API Error");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch:", error);
    return null;
  }
}
```

### localStorage Persistence
```typescript
// ✅ Use the existing storage.ts functions
import { getJuniorProfile, addXP, updateStreak } from "@/lib/storage";

// ✅ Always provide defaults
const profile = getJuniorProfile(); // Has built-in defaults
```

---

## 🚀 Key Patterns

### Screen Navigation
```typescript
// In ing-app.tsx
const navigate = (screen: Screen) => setCurrentScreen(screen);

// In component
<Button onClick={() => navigate("quiz")}>Start Quiz</Button>
```

### Loading States
```typescript
// ✅ Always show loading feedback
{loading ? (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="animate-spin text-[#FF6200]" />
    <span className="ml-2">Wird geladen...</span>
  </div>
) : (
  <Content />
)}
```

### Error Handling
```typescript
// ✅ Use toast notifications for user feedback
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

try {
  await saveData();
  toast({ title: "Gespeichert!", description: "Deine Daten wurden gespeichert." });
} catch (error) {
  toast({ title: "Fehler", description: "Speichern fehlgeschlagen.", variant: "destructive" });
}
```

---

## 🎮 Junior Profile Features

### XP System
```typescript
import { addXP, updateLeaderboardPosition, getJuniorProfile } from "@/lib/storage";

// Add XP after quiz completion
const { levelUp, newLevel, profile } = addXP(totalXP);

// Update leaderboard with new XP
updateLeaderboardPosition(profile);

// Check for level up
if (levelUp) {
  toast({ title: `Level ${newLevel}!`, description: "Du bist aufgestiegen! 🎉" });
}
```

### Streaks
```typescript
import { updateStreak } from "@/lib/storage";

const { streakIncreased, newStreak } = updateStreak();
if (streakIncreased) {
  toast({ title: `${newStreak} Tage Streak!`, description: "Weiter so! 🔥" });
}
```

---

## 🤖 AI Integration

### Quiz Generation
```typescript
import { generateQuizQuestions } from "@/lib/openai";

const questions = await generateQuizQuestions(
  "Aktien",           // topic
  "mittel",           // difficulty
  5,                  // count
  "Grundlagen"        // context
);
```

### Chat with Leo
```typescript
import { sendMessageToOpenAI } from "@/lib/openai";

const response = await sendMessageToOpenAI(
  messages,
  "User wants to learn about ETFs",  // context
  "junior"                            // userType
);
```

---

## ✅ Best Practices

1. **Keep components small** - max 200 lines per file
2. **Use existing UI components** - check `client/src/components/ui/`
3. **Follow ING design** - match existing screen layouts
4. **Test in browser** - use http://localhost:5000
5. **German language** - all user-facing text in German
6. **No console.log** - remove before committing
7. **Atomic commits** - one feature per commit

---

## 🐛 Common Issues

### CORS errors
- All API calls go through `/api/` proxy
- Don't call OpenAI directly from client

### TypeScript errors
- Check imports from `@/lib/storage`
- Ensure props are typed

### Styling issues
- Use Tailwind classes, not inline styles
- Check existing screens for patterns

---

## 📝 Commit Messages

```bash
# Format: type: subject
feat: add AI-generated quiz questions
fix: resolve XP calculation bug
style: improve quiz loading animation
refactor: extract quiz logic to hook
docs: update copilot instructions
```

---

## 🔗 Key Files Reference

| Feature | File |
|---------|------|
| Main routing | `client/src/pages/ing-app.tsx` |
| Quiz screen | `client/src/components/ing/screens/junior/quiz.tsx` |
| XP/Gamification | `client/src/lib/storage.ts` |
| OpenAI client | `client/src/lib/openai.ts` |
| API routes | `server/routes.ts` |
| UI components | `client/src/components/ui/` |
