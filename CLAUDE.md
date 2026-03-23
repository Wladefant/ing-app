# Claude Opus 4.5 - LEO Banking App Development Context

**This is your VS Code Agent working file. Claude has full autonomy within this context.**

---

## 📋 PROJECT IDENTITY

**App**: LEO - AI-Powered Banking Assistant for ING
**Type**: Web application (NOT a native app — runs in the browser, accessible to anyone with the URL)
**Status**: 50% complete - half of screens/features working
**Target**: German teenagers (13-29) learning financial literacy
**Tech Stack**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
**Mode**: DEMO PROJECT - should feel cool, look polished, work smoothly

---

## 🎯 YOUR PRIMARY GOALS (IN ORDER)

1. **Complete unfinished screens and features** from existing codebase
2. **Make everything work** - every button should do something
3. **Keep ING app design integrity** - match existing color scheme, typography, spacing
4. **Polish interactions** - smooth animations, clear feedback, no broken states
5. **Test with Playwright** before every commit
6. **Commit to GitHub** frequently with atomic, descriptive commits
7. **Work autonomously** - I (Claude) should handle entire feature implementation end-to-end

---

## 🏗️ CODEBASE STATUS

### WORKING ✅ (70%)
- Bottom navigation, profile switcher, core routing
- Adult Dashboard with accounts/balance display
- Investment screen with portfolio chart
- Statistics screen with spending breakdown
- Subscription manager
- Junior Dashboard with level/streak display
- Junior Leaderboard (visual)
- Stock detail view with charts
- Leo AI Chat with OpenAI integration
- Setup flow (complete onboarding)
- Demo sidebar for scenario testing

### PARTIALLY WORKING ⚠️ (20%)
- Quiz system (static questions only - needs AI generation)
- Transfer flow (no "Weiter" button working)
- Buttons on many screens (non-functional)
- Gamification display (no real XP tracking)
- Junior investment screen (no trading flow)

### NOT WORKING ❌ (10%)
- Quiz generation from Leo chat
- Stock search functionality
- Buy/Sell order flow
- Document scanning (OCR)
- Voice input/output
- Transfer completion
- Many navigation handlers

---

## 🎨 DESIGN SYSTEM TO FOLLOW

**Colors** (from existing ING app):
- Primary Orange: `#ff6200` (CTAs, highlights)
- Backgrounds: Light grey `#f4f4f4`, `#fafafa`
- Text: Dark grey `#1f1f1f`, `#666666`
- Accent: Teal for Junior profile (`#00c4cc`)
- Status: Green success `#4caf50`, Red error `#f44336`

**Spacing**: Tailwind default scale (4px base)  
**Typography**: System fonts, 14px base  
**Components**: shadcn/ui button/input/dialog/toast  
**Icons**: Lucide React or emoji  
**Animations**: Framer Motion for important moments (only!)  

**Key Principle**: ING app has sophisticated, minimal design. Keep it clean, not flashy.

---

## 📂 PROJECT STRUCTURE

```
ing-app/
├── client/src/
│   ├── pages/ing-app.tsx                    # MAIN - Router & state
│   ├── components/ing/
│   │   ├── layout.tsx                       # BottomNav, Headers
│   │   ├── leo/
│   │   │   ├── chat-overlay.tsx            # Leo AI chat (WORKING)
│   │   │   └── demo-sidebar.tsx            # Demo scenarios
│   │   └── screens/
│   │       ├── dashboard.tsx               # Adult dashboard (WORKING)
│   │       ├── invest.tsx                  # Portfolio view
│   │       ├── transfer.tsx                # NEEDS WORK
│   │       ├── service.tsx                 # Settings menu
│   │       ├── stock-detail.tsx            # Stock view
│   │       ├── adult/
│   │       │   ├── statistics.tsx          # Spending charts
│   │       │   └── subscriptions.tsx       # Abo manager
│   │       └── junior/
│   │           ├── dashboard.tsx           # Junior hub
│   │           ├── invest.tsx              # Virtual portfolio
│   │           ├── quiz.tsx                # STATIC - NEEDS AI
│   │           └── leaderboard.tsx         # Ranking
│   ├── lib/
│   │   ├── openai.ts                       # OpenAI client
│   │   ├── demo-scenarios.ts               # Chat scenarios
│   │   └── utils.ts                        # Helpers
│   └── hooks/use-toast.ts                  # Toast notifications
├── server/
│   ├── index.ts                            # Express + Vite
│   └── routes.ts                           # OpenAI proxy
└── package.json
```

---

## 🚀 YOUR WORKING ENVIRONMENT

### For Testing Features:
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run Playwright tests
npx playwright test
# Or specific test:
npx playwright test features/quiz.spec.ts
```

### For Committing:
```bash
# Make small, atomic commits
git add src/components/ing/screens/junior/quiz.tsx
git commit -m "feat: implement AI-generated quiz questions with difficulty levels

- Use OpenAI to generate 5-10 questions per session
- Support easy/medium/hard difficulty
- Store quiz history for XP tracking
- Add visual progress bar for quiz completion"

git push
```

### With Playwright (IMPORTANT):
```bash
# Before every commit, test the feature:
npx playwright test --headed  # See browser automation
# Or record:
npx playwright codegen http://localhost:5173
```

---

## 📝 FEATURE CHECKLIST - WHAT TO BUILD

### PRIORITY 1 (Complete ASAP)
- [ ] **Quiz AI Generation**: Generate questions via OpenAI, not static
- [ ] **XP/Gamification System**: Track points, levels, streaks
- [ ] **Fix Non-Functional Buttons**: Make every button on every screen work
- [ ] **Transfer Flow Complete**: "Weiter" button should proceed, test mock backend

### PRIORITY 2 (Nice to Have)
- [ ] **Stock Search**: Find stocks by symbol/name
- [ ] **Buy/Sell Trading**: Complete order flow (mock)
- [ ] **Savings Goals**: Set and track savings targets
- [ ] **Achievements Gallery**: View all badges

### PRIORITY 3 (Polish)
- [ ] **Voice Support**: Speech-to-text for Leo
- [ ] **Document Scanner**: Camera-based OCR
- [ ] **Parent Dashboard**: Junior account oversight

---

## 🔄 YOUR WORKFLOW (REPEAT THIS FOR EACH FEATURE)

### Step 1: Plan
```
You: "I'm implementing [FEATURE]. Here's what needs to happen:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Where should I start?"
```

### Step 2: Implement
```
Claude makes changes, creates components, updates types
```

### Step 3: Test with Playwright
```bash
# I write test that verifies the feature works
npx playwright test features/[feature-name].spec.ts --headed
```

### Step 4: Review & Iterate
```
If test passes → commit
If test fails → adjust code
Repeat until working
```

### Step 5: Commit
```bash
git add .
git commit -m "feat: [feature name] 

- What changed
- How it works
- Related tests pass"

git push
```

---

## ⚡ CRITICAL CONTEXT FOR CLAUDE

### You Have Full Autonomy To:
✅ Modify any existing component  
✅ Create new components/screens  
✅ Add new utility functions  
✅ Change routes and navigation  
✅ Modify styling and layout  
✅ Update types and interfaces  

### You MUST Do:
✅ Follow ING app design patterns  
✅ Keep TypeScript strict (no `any`)  
✅ Add JSDoc comments to functions  
✅ Test with Playwright before committing  
✅ Make atomic, logical git commits  
✅ Follow existing code style  

### You Must NOT:
❌ Break existing working features  
❌ Remove or significantly refactor working code  
❌ Add new dependencies without discussing  
❌ Commit untested changes  
❌ Add console.log statements in production code  

---

## 🧪 PLAYWRIGHT TESTING PATTERN

### Test Structure (Example):
```typescript
// features/quiz.spec.ts
import { test, expect } from '@playwright/test';

test('quiz: generate AI questions for easy mode', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Switch to junior profile
  await page.click('[data-testid="demo-sidebar-toggle"]');
  await page.click('text=Junior Profil');
  
  // Start quiz
  await page.click('text=Quiz starten');
  
  // Verify first question appears
  const question = await page.textContent('[data-testid="quiz-question"]');
  expect(question).toBeTruthy();
  expect(question).toHaveLength(greaterThan(10));
  
  // Verify 4 options
  const options = await page.locator('[data-testid="quiz-option"]');
  expect(await options.count()).toBe(4);
  
  // Select answer
  await options.first().click();
  
  // Verify feedback appears
  await expect(page.locator('[data-testid="quiz-feedback"]')).toBeVisible();
  
  // Verify next button works
  await page.click('text=Nächste');
  
  // Verify progress updated
  const progress = await page.getAttribute('[data-testid="quiz-progress"]', 'aria-valuenow');
  expect(parseInt(progress)).toBeGreaterThan(0);
});
```

### Before Committing:
```bash
# Run test with UI
npx playwright test features/quiz.spec.ts --headed

# Record new interaction if needed
npx playwright codegen http://localhost:5173
```

---

## 📊 ARCHITECTURE DECISIONS YOU NEED TO KNOW

### State Management
- Using React `useState` for screen state
- Leo chat messages stored in component state
- TODO: Consider Zustand for global state (user profile, settings)

### API Integration
- OpenAI calls proxied through `/api/openai` Express route
- No authentication yet (demo mode)
- Error handling: Try/catch with toast notifications

### Routing
- Using `wouter` library (simple, lightweight)
- Routes in `ing-app.tsx` switch statement
- No URL params (all state in component)

### Styling
- Tailwind CSS + shadcn/ui components
- Custom ING colors in `tailwind.config.ts`
- No CSS modules (all Tailwind)

### Type Safety
- Strict TypeScript enabled
- All data structures typed
- No `any` types allowed

---

## 🎓 ING APP DESIGN PHILOSOPHY TO MAINTAIN

From docs/01-AI-FIRST-PHILOSOPHY.md:

**Adult Profile**: "Leo is your financial copilot"
- Contextual, proactive insights
- Smart suggestions for recurring transactions
- Document scanning & explanation
- One-tap actions (not multi-step)

**Junior Profile**: "Leo is your finance mentor + friend"
- Educational focus on every interaction
- Gamified learning (XP, badges, streaks)
- Virtual money for safe exploration
- Encouragement and empathy

**Key Principle**: Every screen should be a learning opportunity. Every interaction should feel natural and helpful, not like navigating a traditional bank app.

---

## 🔗 IMPORTANT FILES TO REFERENCE

1. **docs/01-AI-FIRST-PHILOSOPHY.md** - Full design principles
2. **docs/02-GAMIFICATION-SYSTEM.md** - XP/badge/leaderboard specs
3. **CODEBASE_ANALYSIS.md** - Detailed status of each screen
4. **07-IMPLEMENTATION-GUIDE.MD** - Technical details

---

## ✅ DEFINITION OF "DONE" FOR FEATURES

A feature is done when:

1. ✅ Feature works end-to-end (no broken states)
2. ✅ Playwright test passes (with `--headed` validation)
3. ✅ Design matches ING app (colors, spacing, typography)
4. ✅ No console errors or warnings
5. ✅ Code is typed (no `any`)
6. ✅ JSDoc comments added
7. ✅ Committed with atomic, clear message
8. ✅ Related buttons/navigation all work



## 🚀 READY?

Claude is now ready to:
1. Understand the full project scope
2. Work on features with maximum autonomy
3. Test changes with Playwright
4. Commit to GitHub
5. Keep design consistent with ING app

**Next step**: Tell me which feature to build first, and I'll implement it end-to-end with tests and commits!