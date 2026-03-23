# ING Leo — Presentation v2 (Updated)
*Tech-first structure. Show how, then show what. With missing features + enterprise AI concepts.*

---

## STRUCTURE

| Block | Time | Who | What |
|-------|------|-----|------|
| 1. The Problem | 2 min | Berkay, Mateo, Sofia | Why we built this |
| 2. How We Built It | 6 min | Vladimir | Vibe coding, agents, MCP, architecture |
| 3. Junior — Live Demo + Tech | 8 min | Vova + Vladimir | Features + tech behind each |
| 4. Transition + Adult — Live Demo + Tech | 10 min | Sofia + Vladimir | Real ING app + AI agents, tech layer by layer |
| 5. Parent Dashboard | 1 min | Sofia or Berkay | What parents see and control |
| 6. Trust & Compliance | 1.5 min | Mateo, Berkay | GDPR, AI Act |
| 7. What This Means for ING | 2 min | Vladimir | Implementation path |
| 8. Close | 30 sec | Berkay | |
| **Total** | **~31 min** | | |

**The idea:** Vladimir is the technical co-pilot throughout. After each feature demo, he jumps in for 30-60 seconds to explain what happened under the hood. Technical managers stay engaged. Every feature connects to something concrete.

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

# PART 2: HOW WE BUILT IT (6 min)

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
> The tool: **Claude Code** — an AI coding agent. You give it a task in natural language, it writes the code, runs the tests, and iterates until it works. We used it to build this entire application.
>
> The rest of the stack: **React 19** for the interface, **Node.js** on the backend, **PostgreSQL** for data. All standard. Your engineers already know it.

### What is an AI Agent? (1.5 min)

> Before we show the app, let me explain the core concept.
>
> Leo is not a chatbot. It is an **AI agent**.
>
> A chatbot gives you text. You ask, it answers. That is it.
>
> An agent can **think, decide, and act**. It has tools. It picks which tool to use based on what you need. It chains tools together to solve complex problems.
>
> Think of it like this: a chatbot is a search engine. An agent is an employee who can actually do things.
>
> In Leo's case, the agent has **10 tools**:
> - Fetch your account balance
> - Read your transaction history
> - Show a stock chart with analysis
> - Start a money transfer
> - Launch a quiz
> - Display a spending breakdown
> - And more
>
> The AI reads your message, understands what you need, and picks the right tools — on its own. We do not program "if user says X, do Y." The AI figures it out.

### How It Connects — MCP and Function Calling (1.5 min)

> Now — how does the agent actually connect to data and services?
>
> Two key concepts:
>
> **Function calling** — this is how the AI uses tools. We define what each tool does, what inputs it needs, what it returns. The AI model decides when to call which tool. It can chain multiple tools in one response.

**[SHOW architecture diagram]**

```
User message
    → Backend
    → AI model + function calling
    → AI decides: what tools do I need?
    → Calls: get_transactions, show_spending_chart
    → Returns: text + interactive widget
    → Frontend renders it
```

> **MCP — Model Context Protocol** — this is the open standard for connecting AI agents to external systems. Think of it as a universal plug for AI. Instead of building custom integrations for every data source, you use MCP to give the agent standardized access to tools and data.
>
> Why this matters for ING: if you already have internal systems — a ticket tracker, a monitoring dashboard, a customer data platform — you can connect them to an AI agent through MCP without rebuilding anything. It is a plug-and-play standard.
>
> In our case, Leo connects to banking data, market data, and user profiles through this pattern. The same approach scales to any enterprise system.

### Two Modes, One Engine (30 sec)

> One more thing. Junior and Adult use the **same AI engine**. The difference is a **system prompt** — a set of instructions that change Leo's personality.
>
> Junior: simple language, virtual money, gamification.
> Adult: professional tone, real data, banking actions.
>
> Same code. Same tools. Configurable without code changes.
>
> Now let us see it work.

---

# PART 3: JUNIOR — LIVE DEMO + TECH (8 min)

## Vova

> This is Leo Junior. A 15-year-old named Lili opens the app.

**[SHOW junior dashboard]**

> No bank interface. A financial simulator. XP bar, level, badges, streak counter. She is Level 4 — "Sparfuchs".

### Real Card, Virtual Money

> But first — an important detail.
>
> Lili has a **real ING debit card**. She can pay in shops, use ATMs — a real card.
>
> But inside the app, she also has **virtual money** — a separate balance for learning. She can invest it, save it, experiment with it.
>
> Real money is safe. Virtual money is for learning. Two systems, side by side.

---

### Salary & Taxes

**[SHOW salary screen]**

> Lili gets a virtual salary. Taxes are immediately deducted. She sees the breakdown.
>
> She asks Leo: *"Why did I lose money?"*
>
> Leo explains it. Income tax, social contributions. Simple language. No jargon.

**[DEMO: ask Leo about taxes]**

## Vladimir — Tech Note (30 sec)

> Lili's message went to the AI model. The agent recognized a tax question, called `get_account_balance` to pull her salary data, and generated an explanation calibrated to a 15-year-old's vocabulary. The system prompt controls the language level — same tool, different output depending on user age.

---

### Investment Simulator

## Vova

> Lili can invest — with virtual money. Real stock prices. Apple, Tesla, Deutsche Bank.

**[DEMO: buy a stock]**

> She buys Apple. The price is real. If it drops, Leo explains why.
>
> *"Apple dropped 2% — new tariff news from the US is affecting tech stocks."*

**[DEMO: Leo explains stock movement]**

## Vladimir — Tech Note (30 sec)

> Here the agent used `show_stock_widget` — fetched live market data, then scanned recent news to connect the price to a cause. This is the agent behavior: it does not just report a number, it connects data sources. Market price API plus news analysis plus user context — chained automatically.

---

### Quizzes, Achievements & Leaderboard

## Vova

**[DEMO: start a quiz, answer 2-3 questions]**

> Quizzes — AI-generated. Topics: stocks, ETFs, taxes, savings. Three difficulty levels. Every session is unique — you cannot memorize answers.
>
> XP for every correct answer. 13 different badges — "Quiz-Starter", "Mini-Investor", "Finanz-Guru". Streak bonuses if you come back daily.

**[SHOW badges briefly]**

> The leaderboard — weekly, all-time, and **school-based** rankings. Kids compete with classmates.
>
> The weekly winner gets **25 euros added to their real ING account when they turn 18**.

**[SHOW leaderboard — weekly + school tab]**

> And — live quiz battles. Like Kahoot.

**[→ OPTIONAL: Run live quiz with audience — 2 min]**

## Vladimir — Tech Note (30 sec)

> Quiz questions are generated by the AI on the fly — we send topic and difficulty, it returns questions with answers and explanations. No question database. Every session unique. The gamification layer is a separate event system — any action in the app can trigger XP. The AI generates content, the gamification system rewards engagement. Two independent systems working together.

---

### Savings Goals + Voice

## Vova

> Lili sets a savings goal — new laptop, 800 euros. Weekly contributions. Leo tracks progress and sends encouragement.

**[SHOW savings goal screen]**

> And she does not have to type. She can **talk to Leo**.

**[SHOW mic button — quick voice demo]**

> Tap, speak, Leo understands. Works in both Junior and Adult.
>
> Real card, virtual money, AI that teaches. Now — what happens when Lili turns 18?

---

# PART 4: TRANSITION + ADULT — LIVE DEMO + TECH (10 min)

### The 18th Birthday

## Sofia

**[TRIGGER birthday transition animation — age counter → cake → candle blow → confetti → screen crack → dashboard transform]**

**[DO NOT TALK — let the animation play fully]**

> Game mode becomes real mode. The accounts are real. The money is real.
>
> And now — this looks familiar. This is the ING app. Your app. We added Leo on top.

**[PAUSE — let them recognize the ING interface]**

## Vladimir — Tech Note (30 sec)

> The transition is a Framer Motion animation. But the real change is in the system prompt — Leo switches from junior to adult mode. Same AI, same tools, different behavior. The user's learning history carries over — Leo knows what Lili already understands.

---

### Dashboard & Spending Anomaly Detection

## Sofia

**[SHOW adult dashboard — Girokonto, Extra Konto, Depot]**

> Standard ING view. Leo adds transaction analysis. Every transaction auto-categorized — food, transport, subscriptions, entertainment.

**[SHOW spending categories / pie chart]**

> But the important part: **anomaly detection**.
>
> Leo does not just categorize — it finds problems. Duplicate subscriptions. Charges that are three times higher than normal. Sudden spending spikes.
>
> It flags them automatically. You do not go looking for problems — Leo finds them.

## Vladimir — Tech Note (30 sec)

> The agent calls `get_recent_transactions`, then analyzes the data against the user's own spending history. It compares patterns — weekly averages, recurring amounts, category trends. When something deviates, it flags it. The categorization itself uses the AI model — we send raw transaction descriptions, it classifies them. For ING, you could feed your existing categorization — Leo just needs the labeled data.

---

### Proactive AI Coaching

## Sofia

> Leo does not wait for you to ask. This is **proactive coaching**.
>
> *"Your rent is due in 3 days, but your balance is lower than usual."*
>
> *"You ordered delivery 4 times this week — 62 euros. Last week it was 15."*
>
> *"You hit your savings goal early. Want to set a higher target?"*
>
> Leo monitors and reaches out. That is the difference between a search engine and a financial advisor.

## Vladimir — Tech Note (20 sec)

> The system prompt instructs Leo to analyze transaction patterns at session start. It compares current spending against historical averages and surfaces anomalies proactively. For time-based alerts — like rent due dates — it reads recurring transaction patterns. No separate notification system needed — the agent intelligence handles it.

---

### Subscription Manager

## Sofia

**[SHOW subscription screen]**

> Leo detects subscriptions you pay for but do not use.
> *"Spotify Family — unused for 3 months. 45 euros. Want me to draft a cancellation?"*

**[SHOW AI-generated cancellation email]**

> One click. Email written. User sends it.

## Vladimir — Tech Note (20 sec)

> Cancellation email is generated by the AI with subscription details as context — provider, plan, user name. The email is always a draft. User reviews and sends. Leo suggests, never acts alone.

---

### AI Chat — Smart Widgets

## Sofia

> The chat is where everything comes together. Not just text — **interactive widgets** inside the conversation.

**[OPEN Leo chat]**

**Smart Transfer:**

> *"Send 50 euros to Ben."*

**[DEMO: transfer widget appears]**

> Leo looks up the contact. Confirms the name, IBAN, amount. You tap confirm. No menus. No forms. A conversation.

**Spending Analysis:**

> *"How did I spend my money this month?"*

**[DEMO: spending chart widget]**

**Portfolio Analysis:**

> *"How are my investments doing?"*

**[DEMO: portfolio analysis widget]**

> Leo reads the portfolio, checks the market, gives recommendations. All inside the chat.
>
> And you can just **speak** — tap the mic, ask your question.

## Vladimir — Tech Note (1 min)

> This is where you see the agent architecture in action.
>
> For the transfer: the AI called `show_transfer_widget` with amount and recipient. The widget is a React component rendered inline in the chat. Confirmation goes through the standard flow.
>
> For spending: `get_recent_transactions` → AI analyzes → `show_spending_chart` renders.
>
> For investments: `get_portfolio_data` → AI cross-references market news → `show_stock_widget` with recommendations.
>
> The AI chains these tools on its own. No hard-coded flows. The model decides the sequence.
>
> And this is exactly the pattern that scales in an enterprise. Each tool is an **MCP-style connection** to a data source or action. Add a new tool — the agent can use it immediately. Connect a new system — the agent integrates it without code changes to the chat logic.

---

### Investment Deep Dive

## Sofia

**[SHOW stock detail screen]**

> Leo scans real-time market news. Sector analysis. Risk assessment.
>
> *"Your portfolio is 60% tech. Regulatory uncertainty in the sector. Consider diversifying."*
>
> Data-driven. Not emotional.

## Vladimir — Tech Note (20 sec)

> The AI processes news data and correlates with user holdings. For ING, this connects to your existing market data feeds. Same function-calling pattern, richer input data.

---

# PART 5: PARENT DASHBOARD (1 min)

## Sofia or Berkay

> The parents.

**[SHOW parent dashboard]**

> Parents get their own view:
> - Child's **learning progress** — topics completed, quiz scores, achievements
> - **Savings goals** and progress
>
> And they **set the rules**:
> - **Daily spending limits** on the real debit card
> - **Category restrictions** — no online gambling
> - **Maximum per purchase**
> - **Risk profile** for the investment simulator

**[SHOW rules/limits tabs]**

> Parent controls the boundaries. Child learns within them. Parents see progress — not private conversations. Trust both ways.

---

# PART 6: TRUST & COMPLIANCE (1.5 min)

## Mateo

> Three rules.
>
> **One.** Leo uses only your data. No third-party sharing. No open internet training.
>
> **Two.** Leo suggests. You decide. It never acts without confirmation.
>
> **Three.** GDPR and EU AI Act compliant. Every recommendation is explainable.

## Berkay

> For minors: parental consent required. Age verification. Simplified language.
>
> Parents control limits, spending rules, and risk levels — as we showed.

---

# PART 7: WHAT THIS MEANS FOR ING (2 min)

## Vladimir

> The architecture is modular. Leo is a layer on top.

```
Existing ING App
    └── Existing APIs (accounts, transactions, portfolio)
            └── NEW: AI Layer (model + function calling + MCP)
                    └── NEW: Chat UI (floating overlay)
```

> **To add Leo to ING:**
> 1. Chat overlay — one floating button on the existing app
> 2. AI layer connects to your existing APIs — read access only
> 3. All actions go through your existing confirmation flows
>
> The junior app needs no banking connection at all. Virtual data plus public market APIs. Standalone product.
>
> **The AI model:** We used OpenAI for prototyping speed. For production, swap it with a self-hosted model inside ING infrastructure. The architecture is model-agnostic. Change the endpoint — everything else stays. **No customer data leaves ING servers.**
>
> **The bigger picture:** The agent pattern we showed — function calling, MCP connections, system prompts — is not just for Leo. This is how modern AI integrates with enterprise systems.
>
> Connect your ticket tracker. Your monitoring. Your compliance tools. Same pattern. Same architecture. The agent connects to them through standardized tool interfaces.
>
> And the development approach — vibe coding with AI agents like Claude Code — works for any new feature. We built this entire application in a fraction of the time traditional development takes.

---

# PART 8: CLOSE (30 sec)

## Berkay

> One in five young people in Germany is in debt.
>
> We built something that fits inside the app you already have.
>
> Thank you. We are ready for your questions.

---

# Q&A CHEAT SHEET

**Cost?** → Modular. Start with just the chat. Junior is standalone. AI: ~1-3 cents per conversation. Enterprise pricing or self-hosted at scale.

**Hallucinations?** → Leo works with user's own data. Actions require confirmation. Junior mode is virtual — mistakes are the point.

**Works with ING backend?** → Yes. API layer. Read access. No core banking changes.

**Why OpenAI?** → Prototyping speed. Production: any model. Llama, Mistral, ING-hosted. Function calling is model-agnostic.

**Data security?** → Prototype: OpenAI API. Production: self-hosted within ING. No data leaves the building.

**What is MCP?** → Model Context Protocol. Open standard for connecting AI agents to external tools and data. Like a universal plug — connect any system without custom integration code.

**What are AI agents vs chatbots?** → Chatbot: text in, text out. Agent: understands intent, picks tools, takes actions, chains multiple steps. Leo decides what to do, not just what to say.

**Proactive coaching — how?** → System prompt instructs Leo to analyze patterns at session start. Compares current spending vs history. Flags anomalies. Reads recurring transaction patterns for date-based alerts.

**Anomaly detection?** → Compares each transaction against user's history. Duplicate subscriptions, above-average charges, category spikes, unexpected recurring amount changes.

**Voice?** → Browser speech-to-text → text message to Leo. No extra AI cost.

**Parental controls?** → Parents see progress, not private chats. Set limits, rules, risk profile.

**Leaderboard cheating?** → XP from verifiable actions. AI generates unique questions. School rankings need verification.

**Languages?** → Leo responds in whatever language you write. Built into the AI. Zero extra development.

**Scaling?** → Dedicated model deployment. Azure OpenAI or self-hosted. Standard API patterns for concurrency.

**Can this approach work for other ING features?** → Yes. The agent + MCP + function calling pattern is general-purpose. Connect any internal system. The vibe coding approach speeds up development of any new feature.
