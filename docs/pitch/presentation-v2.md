# ING Leo — Presentation v2
*Tech-first structure. Show how, then show what.*

---

## STRUCTURE

| Block | Time | Who | What |
|-------|------|-----|------|
| 1. The Problem | 2 min | Berkay, Mateo, Sofia | Why we built this |
| 2. How We Built It | 5 min | Vladimir | Vibe coding, stack, AI architecture |
| 3. Junior — Live Demo + Tech | 8 min | Vova + Vladimir | Show features, explain the tech behind each |
| 4. Transition + Adult — Live Demo + Tech | 10 min | Sofia + Vladimir | Real ING app + AI agents, tech layer by layer |
| 5. Trust & Compliance | 2 min | Mateo, Berkay | GDPR, AI Act — short and direct |
| 6. What This Means for ING | 2 min | Vladimir | Implementation path |
| 7. Close | 1 min | Berkay | |
| **Total** | **~30 min** | | |

**The idea:** Vladimir is the technical co-pilot throughout. After each feature demo, he jumps in for 30-60 seconds to explain what just happened under the hood. This keeps the technical managers engaged and connects every feature to something concrete.

---

# PART 1: THE PROBLEM (2 min)

## Berkay

> In Germany, one in five young people is in debt before 25.
> 90% of teenagers say they never got financial education in school.
>
> So they learn from TikTok. From finfluencers. From people selling hype, not knowledge.

## Mateo

> There is a gap between what people need to know about money — and what anyone actually teaches them.

## Sofia

> We built something to close that gap.
>
> **ING Leo** — an AI assistant inside the ING app.
> It has two modes: **Junior** for learning with virtual money, **Pro** for real banking.
> They connect at the user's 18th birthday.
>
> But before we show it — let us explain how it works.

---

# PART 2: HOW WE BUILT IT (5 min)

## Vladimir

### Vibe Coding (1.5 min)

> We did not use Figma. We did not make static mockups.
>
> We used an approach called **vibe coding** — you describe what you want, AI helps you build it, and you have a working prototype the same day.
>
> Everything you will see today is not a design. It is a running application. Every button works. Every AI response is live.
>
> Traditional flow: design → review → code → review → test. Weeks.
> Our flow: describe → build → test. Hours.
>
> The tools: **Claude Code** for AI-assisted development, **React 19** for the interface, **Node.js** on the backend. All standard, nothing exotic.

### The AI Architecture (2 min)

> Leo is not a chatbot. It is an **AI agent**.
>
> The difference: a chatbot gives text answers. An agent can **do things** inside the app.
>
> Here is how it works:

**[SHOW architecture diagram]**

```
User message
    → Backend
    → AI model (OpenAI GPT with function calling)
    → AI decides: do I need data? do I need to show something?
    → Calls tools: get_balance, get_transactions, show_chart...
    → Returns response + interactive widgets
    → Frontend renders it
```

> The key concept is **function calling**. We gave the AI 10 tools — things like "show a stock widget", "fetch transactions", "start a quiz", "initiate a transfer".
>
> The AI reads the user's message, understands the intent, and picks which tools to use. We do not program "if user says X, do Y." The AI figures it out.
>
> You will see this in action during the demo.

### Two Modes, One Engine (1 min)

> Junior and Adult use the **same AI engine**. The difference is a system prompt.
>
> For juniors: simple language, virtual money, gamification.
> For adults: professional tone, real data, banking actions.
>
> Same code. Same tools. Different personality. Configurable without code changes.

### Tech Stack — Quick Overview (30 sec)

> Frontend: **React 19, TypeScript, TailwindCSS, Framer Motion** for animations, **Recharts** for financial charts.
>
> Backend: **Express.js, PostgreSQL, OpenAI API**.
>
> All standard. Your engineers already know this stack.
>
> Now let us see it in action.

---

# PART 3: JUNIOR — LIVE DEMO + TECH (8 min)

## Vova

> This is Leo Junior. A 15-year-old named Lili opens the app.

**[SHOW junior dashboard]**

> No bank interface. A financial simulator. XP bar, level, badges, leaderboard. She is currently Level 4 — "Sparfuchs".

---

### Salary & Taxes

**[SHOW salary screen]**

> Lili gets a virtual salary. Taxes are immediately deducted. She sees the breakdown — income tax, social contributions.
>
> She asks Leo: *"Why did I lose money?"*
>
> Leo explains it in one paragraph. No jargon.

**[DEMO: ask Leo about taxes]**

## Vladimir — Tech Note (30 sec)

> What just happened: Lili's message went to GPT. The AI recognized a tax question, pulled her salary data using `get_account_balance`, and generated an explanation calibrated to a 15-year-old's vocabulary. The system prompt controls the language level.

---

### Investment Simulator

## Vova

> Lili can invest — with virtual money. Real stock prices. Apple, Tesla, Deutsche Bank.

**[DEMO: buy a stock]**

> She buys Apple. The price is real. If it drops tomorrow, she sees it. And Leo explains why.
>
> *"Apple dropped 2% — new tariff news from the US is affecting tech stocks."*

**[DEMO: Leo explains stock movement]**

## Vladimir — Tech Note (30 sec)

> Here Leo used `show_stock_widget` — it fetched live market data and the AI scanned recent news articles to connect the price movement to a cause. The AI did not just report the number. It explained the reason. That is the agent behavior — it connects data sources the user would never check on their own.

---

### Quizzes & Gamification

## Vova

> To keep it engaging — quizzes. AI-generated. New questions every time.

**[DEMO: start a quiz, answer 2-3 questions]**

> Three difficulty levels. Topics: stocks, ETFs, taxes, savings. XP for every correct answer. Badges for milestones. A leaderboard to compete with friends.

**[SHOW leaderboard + badges]**

> And — we built live quiz battles. Like Kahoot. Let us try one.

**[→ OPTIONAL: Run live quiz with audience — 2 min]**

## Vladimir — Tech Note (30 sec)

> The quiz questions are generated by GPT on the fly — we send the topic and difficulty, it returns questions with correct answers and explanations. No question database. Every session is unique. The gamification layer — XP, levels, badges — is a separate system that listens to events from across the app. Any action can trigger XP.

---

### Savings Goals

## Vova

> Lili sets a goal — new laptop, 800 euros. The app tracks progress. Leo sends encouragement at milestones.

**[SHOW savings goal screen]**

> Kids learn by doing. Real data. Real decisions. No risk.
>
> Now — what happens when Lili turns 18?

---

# PART 4: TRANSITION + ADULT — LIVE DEMO + TECH (10 min)

### The 18th Birthday

## Sofia

**[TRIGGER birthday transition animation]**

> Game mode becomes real mode. The interface changes. The accounts are real.

**[PAUSE — let animation finish]**

> And now — this looks familiar. Because this is the ING app. Your app. We just added Leo on top.

## Vladimir — Tech Note (30 sec)

> Technically, the transition is a Framer Motion animation sequence. But the real change is in the system prompt — Leo switches from junior mode to adult mode. Same AI, same tools, different behavior. The user's learning history carries over — Leo knows what Lili already understands about investing, taxes, budgeting.

---

### Dashboard & Transaction Analysis

## Sofia

**[SHOW adult dashboard — Girokonto, Extra Konto, Depot]**

> Standard ING view. But Leo adds transaction analysis. Every transaction is auto-categorized — food, transport, subscriptions, entertainment.

**[SHOW spending categories / pie chart]**

> Leo finds patterns: *"3x Lieferando this week — 47 euros."*
> It does not judge. It shows you what you might not notice yourself.

## Vladimir — Tech Note (30 sec)

> The categorization uses the AI model. We send transaction descriptions, the AI classifies them. For ING, you could also use your existing categorization — Leo just needs the labeled data. The spending chart is rendered by `show_spending_chart`, one of the 10 function-calling tools.

---

### Subscription Manager

## Sofia

**[SHOW subscription screen]**

> Leo detects subscriptions you pay for but do not use.
> *"Spotify Family — unused for 3 months. 45 euros. Want me to draft a cancellation?"*

**[SHOW AI-generated cancellation email]**

> One click. Email written. User sends it.

## Vladimir — Tech Note (20 sec)

> The cancellation email is generated by GPT with the subscription details injected as context. It knows the provider, the plan, the user's name. The email is a draft — the user always reviews and sends it themselves.

---

### AI Chat — Smart Widgets

## Sofia

> The most interesting part. The chat is not just text. It can show interactive elements inside the conversation.

**[OPEN Leo chat]**

**Widget 1 — Transfer:**

> *"Send 50 euros to Ben."*

**[DEMO: transfer widget appears in chat]**

> No menus. No forms. One message. One confirmation tap.

**Widget 2 — Spending:**

> *"How did I spend my money this month?"*

**[DEMO: spending chart appears in chat]**

**Widget 3 — Portfolio:**

> *"How are my investments doing?"*

**[DEMO: portfolio analysis widget]**

> Leo reads the portfolio, checks the market, gives recommendations — all inside the chat.

## Vladimir — Tech Note (1 min)

> This is where function calling really shows its power.
>
> For the transfer: the AI called `show_transfer_widget` with the amount and recipient. The widget is a React component rendered inline. The user confirms, and only then does the transaction go through.
>
> For spending: `get_recent_transactions` → AI analyzes → `show_spending_chart` renders the result.
>
> For investments: `get_portfolio_data` → AI cross-references with market news → `show_stock_widget` with recommendations.
>
> The AI chains these tools together on its own. We did not hard-code any of these flows. The model decides the sequence based on what the user asked.
>
> That is the difference between a chatbot and an agent. A chatbot responds. An agent acts.

---

### Investment Deep Dive

## Sofia

**[SHOW stock detail screen]**

> Leo scans real-time market news. Sector analysis. Risk assessment.
>
> *"Your portfolio is 60% tech. There is regulatory uncertainty in the sector. Consider diversifying."*
>
> Data-driven. Not emotional.

## Vladimir — Tech Note (20 sec)

> The AI processes news data and correlates it with the user's holdings. For ING, this could connect to your existing market data feeds. The recommendation engine is the same function-calling pattern — just with richer input data.

---

# PART 5: TRUST & COMPLIANCE (2 min)

## Mateo

> Three rules.
>
> **One.** Leo uses only your data. No third-party sharing. No internet training.
>
> **Two.** Leo suggests. You decide. It never acts without your confirmation.
>
> **Three.** Fully aligned with GDPR and the EU AI Act. Every recommendation is explainable.

## Berkay

> For minors: parental consent required. Age verification. Simplified language.
>
> Parents see learning progress. Not private conversations.

---

# PART 6: WHAT THIS MEANS FOR ING (2 min)

## Vladimir

> The architecture is modular. Leo is a layer on top — it does not replace anything.

**[SHOW or describe]**

```
Existing ING App
    └── Existing APIs (accounts, transactions, portfolio)
            └── NEW: AI Layer (model + function calling)
                    └── NEW: Chat UI (floating overlay)
```

> **To add Leo to ING:**
> 1. Add a chat component as an overlay — one floating button
> 2. Connect the AI layer to your existing APIs — read access only
> 3. All user actions still go through your existing confirmation flows
>
> The junior app is even simpler — no connection to real banking. Virtual data plus public market APIs. Could launch as a standalone product.
>
> **About the AI model:** We used OpenAI for speed. For production, swap it with a self-hosted model inside ING infrastructure. The architecture is model-agnostic — change the endpoint, everything else stays the same. No customer data leaves ING servers.
>
> **About development speed:** This entire application was built using vibe coding. Working prototype — not a concept. The same approach works for any new ING feature.

---

# PART 7: CLOSE (1 min)

## Berkay

> One in five young people in Germany is in debt.
>
> We built something that can change that — and it fits inside the app you already have.
>
> Thank you. We are ready for your questions.

---

# Q&A CHEAT SHEET

**Cost?** → Modular. Start with just the chat layer. Junior app is standalone. AI API costs: ~1-3 cents per conversation at current scale. Enterprise pricing or self-hosted model at ING scale.

**Hallucinations?** → Leo works with the user's own data, not imagination. Actions require confirmation. Junior mode is virtual — mistakes are the point.

**Works with ING backend?** → Yes. API layer. Read access to accounts/transactions. No changes to core banking.

**Why OpenAI?** → Prototyping speed. For production: any model works. Llama, Mistral, ING-hosted. Function calling interface is model-agnostic.

**Data security?** → Prototype uses OpenAI API. Production recommendation: self-hosted model within ING. No customer data leaves the building.

**When AI is wrong?** → Leo shows reasoning. User can ask "why." No auto-execution. Junior mode: mistakes are learning.

**Parental controls?** → Consent required. Parents see progress, not private chats.

**Languages?** → Leo responds in whatever language you write in. Tested with Ukrainian demo for international users.

**Voice?** → Supported. Speak → transcribe → Leo responds.

**Scaling?** → Dedicated model deployment (Azure OpenAI or self-hosted). Current architecture handles concurrent users through standard API patterns.
