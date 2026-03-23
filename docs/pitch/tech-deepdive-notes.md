# ING Leo — Technical Deep Dive Notes
*Speaker notes for Vladimir's 10-minute technical section*

---

## Goal of This Section

Show ING's technical managers:
1. **What vibe coding is** and why it is faster than traditional development
2. **How Leo's AI actually works** (architecture, function calling, data flow)
3. **How ING could implement this** in their existing infrastructure

---

## Slide-by-Slide Speaker Notes

### Slide 1: What is Vibe Coding? (2 min)

**Key message:** We built a working product, not a design file.

> The traditional way to build software looks like this:
>
> Designers make screens in Figma → Developers turn them into code → Product reviews → Problems found → Back to Figma → Repeat.
>
> This cycle takes weeks. Sometimes months.
>
> We used a different approach: **vibe coding**.
>
> Instead of designing first, we **build first**.
> We use AI tools to generate working code directly — and then we refine it.

**Show comparison:**

| Traditional | Vibe Coding |
|-------------|-------------|
| 2-4 weeks design | Skip to code |
| Static Figma screens | Working prototype |
| Designer → Developer handoff | One step |
| Cannot test until coded | Test immediately |
| Looks right, might not work | Works — you can try it now |

> **The key difference:** What you saw in the demo is not a design.
> It is a real application. You can click every button. Every AI response is live.

**For ING context:**
> This approach could dramatically speed up how ING prototypes new features.
> Instead of months of design review, you can have a working prototype in days — and test it with real users immediately.

---

### Slide 2: Tech Stack (2 min)

**Key message:** Standard, well-supported technology — nothing exotic.

**Draw or show this diagram:**

```
┌─────────────────────────────────┐
│          FRONTEND               │
│  React 19 + TypeScript + Vite   │
│  TailwindCSS + Framer Motion    │
│  Recharts (financial charts)    │
└──────────────┬──────────────────┘
               │ REST API
┌──────────────▼──────────────────┐
│          BACKEND                │
│  Node.js + Express              │
│  PostgreSQL (via Drizzle ORM)   │
│  Session management             │
└──────────────┬──────────────────┘
               │ API calls
┌──────────────▼──────────────────┐
│          AI LAYER               │
│  OpenAI API (GPT models)        │
│  Function Calling (10 tools)    │
│  System prompts per user type   │
└─────────────────────────────────┘
```

**Important points to make:**
- React is the industry standard — used by Meta, Netflix, Airbnb
- TypeScript adds type safety — catches bugs before they reach users
- PostgreSQL is enterprise-grade — ING likely already uses it
- The AI layer is **separate** — it can be swapped without touching the rest

> **For ING:** None of this technology is new or risky. Your engineering teams already know React and Node.js. The only new piece is the AI integration — and that is one API layer.

---

### Slide 3: How Leo's AI Works (3 min)

**Key message:** Leo is not a chatbot — it is an AI agent with tools.

**Show this flow:**

```
User types: "How did I spend my money this month?"
         │
         ▼
    ┌─────────┐
    │ Backend  │ ← receives message
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ OpenAI   │ ← AI reads the message
    │ (GPT)    │ ← decides: "I need transaction data"
    └────┬─────┘
         │
         ▼  FUNCTION CALL: get_recent_transactions()
    ┌──────────┐
    │ Database │ ← fetches user's transactions
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ OpenAI   │ ← AI analyzes the data
    │ (GPT)    │ ← generates response + chart widget
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ Frontend │ ← renders text + interactive chart
    └──────────┘
```

**Explain function calling simply:**

> The AI has a list of **10 tools** it can use. Think of them like buttons it can press.
>
> When a user asks a question, the AI decides:
> - Do I know the answer already? → Just respond with text.
> - Do I need data? → Call a function to get it.
> - Should I show something visual? → Use a widget tool.
>
> The AI makes this decision **on its own**. We do not program "if user says X, do Y."
> The AI understands the intent and picks the right tool.

**List the 10 tools (show on screen):**

| Tool | What it does |
|------|-------------|
| `show_stock_widget` | Display stock price and analysis |
| `show_transfer_widget` | Start a money transfer |
| `start_quiz` | Launch a quiz |
| `show_achievement` | Show a badge or reward |
| `show_savings_goal` | Display savings progress |
| `show_spending_chart` | Visualize spending |
| `navigate_to_screen` | Go to a specific screen |
| `get_portfolio_data` | Fetch investment data |
| `get_account_balance` | Get account balances |
| `get_recent_transactions` | Get transaction history |

> This is what makes Leo an **agent**, not a chatbot.
> A chatbot answers questions. An agent **takes actions**.

---

### Slide 4: Two User Modes — One AI (1 min)

**Key message:** Same AI engine, different behavior based on user type.

> We use **system prompts** to change how Leo behaves.
>
> For a junior user, Leo:
> - Uses simple language
> - Talks about virtual money
> - Focuses on teaching and explaining
> - Adds gamification (XP, badges)
>
> For an adult user, Leo:
> - Uses professional language
> - Works with real financial data
> - Gives investment advice with disclaimers
> - Can execute banking actions (with confirmation)
>
> Same AI. Same tools. Different personality.
> This is configurable — no code changes needed to adjust the behavior.

---

### Slide 5: How ING Could Implement This (2 min)

**Key message:** This is an add-on, not a replacement.

> The most important thing for your technical teams:
>
> **Leo does not replace anything. It adds a layer on top.**

**Show this architecture:**

```
┌─────────────────────────────────────────┐
│           EXISTING ING APP              │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐  │
│  │Accounts │ │Transfers │ │Investing│  │
│  └─────────┘ └──────────┘ └─────────┘  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     EXISTING ING APIs           │    │
│  │  (accounts, transactions, etc.) │    │
│  └──────────────┬──────────────────┘    │
│                 │                        │
│  ┌──────────────▼──────────────────┐    │
│  │     NEW: LEO AI LAYER           │    │ ← Only new component
│  │  (AI model + function calling)  │    │
│  └──────────────┬──────────────────┘    │
│                 │                        │
│  ┌──────────────▼──────────────────┐    │
│  │     NEW: CHAT UI COMPONENT      │    │ ← Overlay on existing app
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

> **Step 1:** Add the chat UI as an overlay — just like we showed in the demo. One floating button.
>
> **Step 2:** Connect the AI layer to your existing APIs. Leo only needs **read access** to accounts and transactions.
>
> **Step 3:** Leo never writes directly to accounts. All actions (transfers, investments) go through the existing confirmation flow.
>
> **For the junior app:** Even simpler. No connection to real banking needed. It runs on simulated data with real market prices from public APIs.
>
> **About the AI model:**
> - For this prototype, we used OpenAI (GPT models)
> - For production at ING, you would use a **self-hosted model** inside your infrastructure
> - The architecture is model-agnostic — swap the API endpoint, everything else stays the same
> - This means: **no customer data leaves ING servers**

---

### Closing Technical Point

> One final thought.
>
> We built this entire application — both modes, all AI features, all animations — using AI-assisted development.
>
> The tools exist today. The technology is ready.
>
> The question is not "can we build this?" — the question is "when do we start?"

---

## Technical Q&A Cheat Sheet

**Q: What model do you use?**
> GPT-4o via OpenAI API. But the architecture supports any model — Llama, Mistral, or ING's own hosted model.

**Q: How fast are the AI responses?**
> Typically 1-3 seconds for text. Widget generation adds about 1 second. Streaming is supported for real-time display.

**Q: What about rate limits and scaling?**
> The current prototype uses standard API rate limits. At ING scale, you would use a dedicated model deployment — either through Azure OpenAI Service or a self-hosted solution.

**Q: How do you handle conversation context?**
> We send conversation history with each request. The system prompt sets Leo's personality. Context window is large enough for full banking conversations.

**Q: What about testing?**
> We have 25+ pre-built demo scenarios that test all widget types and AI behaviors. For production, you would add automated testing of AI responses against expected outputs.

**Q: Can Leo access data from multiple accounts?**
> Yes — the function calling interface supports any data source. If ING has an API for it, Leo can use it.

**Q: What if the AI model changes or gets updated?**
> The function calling interface is stable across model versions. You update the model, the tools stay the same. This is by design.
