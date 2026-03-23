# ING Leo — Live Demo Guide
*Step-by-step walkthrough matching v1 presentation structure*

---

## Before the Demo

### Setup Checklist
- [ ] App running locally or on demo server
- [ ] Browser open, loaded on Junior dashboard
- [ ] Leo chat closed (open during demo)
- [ ] Screen shared / projector connected
- [ ] Stable internet (AI responses + stock data)
- [ ] Quiz battle link ready (if doing live quiz)
- [ ] Mic working on demo device (voice input demo)
- [ ] Architecture diagram ready for Vladimir's tech section
- [ ] Backup: pre-loaded demo scenarios if API is slow

### Demo Accounts
- **Junior**: "Lili", age 15, some XP/badges, savings goal in progress
- **Adult**: Real ING interface, transaction history with patterns (delivery spending, unused subscriptions), tech-heavy portfolio

---

## PART 2: LEO JUNIOR (8 min) — Vova

**Step 1 — Dashboard + Dual System (1 min)**
1. Show junior dashboard
2. Point out: XP bar, level, streak counter, badges
3. Explain dual system: *"Lili has a real ING debit card — for real purchases. And virtual money — for learning. Two systems, side by side. Real money is safe."*
4. Point to real card display + virtual balance (v€)

**Step 2 — Salary & Taxes (1 min)**
1. Navigate to salary screen
2. Show virtual salary received, tax deductions appearing
3. Open Leo → ask *"Why are taxes taken from my salary?"*
4. Show Leo's explanation in simple language
5. Say: *"Most adults cannot explain this clearly. Leo can — in seconds."*

**Step 3 — Investment Simulator (1.5 min)**
1. Navigate to investment screen
2. Show real stocks with real prices (Apple, Tesla, Deutsche Bank)
3. Buy a stock with virtual money
4. Show portfolio view
5. Click **"Leo fragen"** on a stock
6. Show Leo opening with full AI analysis of that stock
7. Ask a follow-up: *"Should I buy more?"* or *"What does this company do?"*
8. Say: *"It is a conversation. She digs as deep as she wants. Leo explains at her level."*

**Step 4 — Quiz + Achievements + Leaderboard (1 min)**
1. Start a quiz (AI-generated), answer 2-3 questions
2. Show XP earned
3. Flash badges briefly — *"13 badges, from Quiz-Starter to Finanz-Guru"*
4. Show leaderboard — switch to weekly, all-time, **school** tab
5. Mention: *"Weekly winner gets 25 euros added to their real account at 18"*

**Step 5 — Live Quiz Battle (2-3 min) [DO THIS]**
1. Open Kahoot-style quiz host page
2. Share join link / QR code with the audience — *"You can join right now"*
3. Wait for people to join (show participant count)
4. Run 3-4 quick questions — let the room compete
5. Show live leaderboard after each question
6. Say: *"This is what makes financial education stick. It is not a lecture — it is a game."*

> **FALLBACK**: If WiFi fails, show the screen and describe: *"Everyone joins with their phone, competes in real time."*

**Step 6 — Savings Goal + Voice (45 sec)**
1. Show savings goal screen (laptop, 800€, progress bar)
2. Tap mic button — quick voice demo or just show the button
3. Say: *"She does not have to type. She talks to Leo."*

**Junior wrap-up (15 sec):**
> *"Real card. Virtual money. AI that teaches. Now — she turns 18."*

---

## PART 3: BIRTHDAY TRANSITION + LEO PRO (9 min) — Sofia

**Step 7 — Birthday Transition (30 sec)**
1. Trigger the birthday transition animation
2. **DO NOT TALK** — let the full animation play (age counter → cake → candle blow → confetti → screen crack → dashboard transform)
3. After it finishes: *"Game mode becomes real mode. This is no longer a simulation."*
4. Pause — *"This should look familiar. This is your app — the ING app — with Leo added."*

**Step 8 — Dashboard + Anomaly Detection (1.5 min)**
1. Show adult dashboard — Girokonto, Extra Konto, Depot
2. Show categorized spending (pie chart)
3. Point out anomaly detection: *"Leo does not just categorize — it finds problems. Duplicate subscriptions. Charges three times higher than normal. Sudden spending spikes. You do not go looking — Leo finds them."*

**Step 9 — Proactive Coaching (1 min)**
1. Show or describe Leo's proactive messages:
   - *"Rent due in 3 days, balance lower than usual"*
   - *"Delivery 4 times this week — 62 euros. Last week it was 15"*
   - *"You hit your savings goal early — set a higher target?"*
2. Key line: *"Leo does not wait for questions. It reaches out when something matters."*

**Step 10 — Subscription Manager (1 min)**
1. Navigate to subscriptions
2. Show unused subscription detected
3. Show AI-generated cancellation email
4. Say: *"One click. Email written. User sends it."*

**Step 11 — AI Chat Widgets (2.5 min)**

Open Leo chat. Three scenarios:

**Smart Transfer:**
1. Type: *"Send 50 euros to Ben"*
2. Show transfer widget — contact lookup, IBAN confirmation, amount
3. Say: *"No menus. No forms. Leo finds the contact, confirms the details. One tap."*

**Spending Analysis:**
1. Type: *"How did I spend my money this month?"*
2. Show spending chart widget in chat

**Portfolio Analysis:**
1. Type: *"How are my investments doing?"*
2. Show portfolio analysis widget with recommendations

**Voice (quick):**
1. Tap mic, speak a question — or just show the button
2. Say: *"You can also just speak."*

**Step 12 — Stock Deep Dive (30 sec)**
1. Navigate to stock detail page
2. Show AI analysis panel
3. Say: *"Leo scans hundreds of articles. Recommendations based on data, not emotions."*

**Adult wrap-up (15 sec):**
> *"Your accountant. Your investor. Your coach. Inside the app you already know."*

---

## PART 4: PARENT DASHBOARD (1.5 min) — Sofia or Berkay

**Step 13 — Parent View (1.5 min)**
1. Switch to parent dashboard
2. Show: learning progress, quiz scores, achievements, savings goals
3. Show rules tab: daily limits, category restrictions, max per purchase, risk profile slider
4. Say: *"Parents control the boundaries. Kids learn within them. Parents see progress — not private conversations."*

---

## PART 6: TECH DEEP DIVE (8 min) — Vladimir

**Three separate blocks. Do not mix them. Finish one before starting the next.**

Vladimir opens with: *"I will cover three things — each one separate. How we built it. How the AI works. And how ING could use this."*

---

### Block A — How We Built It (2 min)

**Step 14 — Vibe Coding**
1. Explain the concept: no Figma, no mockups. Describe → build → test. Hours not weeks.
2. Mention Claude Code: *"An AI coding agent. You give it a task in plain language. It writes the code, runs tests, fixes problems."*
3. Mention the stack: React 19, Node.js, PostgreSQL — standard tech
4. Key line: *"Everything you saw is a running application. Not a design. Not a Figma file."*

**Stay on this topic. Do not mention agents, function calling, or MCP here. This block is only about development process.**

---

### Block B — How Leo Works (3 min)

**Step 15 — Chatbot vs Agent**
1. Key distinction: chatbot = text in, text out. Agent = thinks, decides, acts.
2. Say: *"A chatbot is like a search engine. An agent is like an employee — it understands what you need, gets the data, does the work, comes back with the result."*
3. Connect to demo: *"Everything you saw — transfers, charts, coaching — the AI decided what to do. We did not program those flows."*

**Step 16 — Architecture + Function Calling**
1. Show architecture diagram:
```
User message → Backend → AI model → decides tools → calls them → response + widget → Frontend
```
2. Explain function calling: 10 tools defined, AI picks which to use
3. Give the concrete example: *"Sofia asked about investments — AI called get_portfolio_data, checked market news, called show_stock_widget. Three tools, chained automatically."*
4. List the 10 tools briefly
5. Explain system prompts: same AI, same tools, different personality for junior vs adult

**Stay on this topic. Do not mention MCP, implementation, or enterprise here. This block is only about how the AI inside Leo works.**

---

### Block C — Enterprise AI: How a Large Company Can Use This (3 min)

**This block zooms out. No more app demo. No more Leo. Talk about the pattern for any large organization.**

**Step 17 — Implementation Pattern**
1. Show the generic layered diagram:
```
Existing App → Existing APIs → NEW: AI Layer → NEW: Interface
```
2. Three steps: add interface, connect AI to existing APIs (read only), actions go through existing security
3. Model is swappable — self-hosted in production, no data leaves your servers
4. Key line: *"You do not rebuild. You add a layer on top."*

**Step 18 — MCP: Universal Plug**
1. Explain MCP: *"Model Context Protocol. Open standard. A universal plug for connecting AI to any system."*
2. Monitoring, tickets, customer data, compliance, HR — all through the same standard interface
3. Key line: *"One agent architecture. Plug in as many data sources as you need."*

**Step 19 — Enterprise Safety: Skills + Hooks**
1. Skills: reusable procedures stored as files. Standardize agent behavior across the organization.
2. Hooks: policy enforcement — approve/deny actions, log everything, full audit trail.
3. Key line: *"In a regulated environment, every agent action is logged and controllable."*

**This block is only about enterprise patterns. Do not reference the app, Leo, or the demo. Keep it general and organizational.**

---

## Demo Recovery Plans

### AI is slow:
- *"Leo is analyzing your data in real time."*
- Move to next feature, come back

### AI gives unexpected response:
- *"Live AI — every response generated in real time."*
- Ask a different question

### Internet drops:
- Switch to pre-loaded demo scenarios (25+ built in)
- *"Let me show you a saved example."*

### Quiz battle fails:
- Solo quiz instead. Skip audience participation.

### Voice not working:
- Skip. Just mention: *"Voice input is also supported."*

### Parent dashboard not ready:
- Describe verbally: *"Parents see progress, set limits, control risk levels."*

---

## Language Guide

Simple and clear for German-speaking audience:

| Instead of... | Say... |
|--------------|--------|
| "Machine learning model" | "The AI" or "Leo" |
| "Function calling" | "Leo can take actions inside the app" |
| "MCP" | "A universal plug for connecting AI to systems" |
| "Natural language processing" | "You just type or speak" |
| "System prompt" | "Instructions that change Leo's personality" |
| "Anomaly detection" | "Leo finds problems automatically" |
| "Proactive coaching" | "Leo reaches out before you ask" |
| "Gamification" | "Points, levels, and rewards" |
| "Portfolio diversification" | "Spreading money across investments" |
| "Skills and hooks" | "Rules and controls for the AI" |

---

## Timing Markers

| Time | You should be at... |
|------|-------------------|
| 0:00 | Problem & Vision (Berkay, Mateo, Sofia) |
| 3:00 | Junior dashboard — dual system |
| 4:00 | Salary & taxes |
| 5:00 | Investment simulator + "Leo fragen" |
| 6:30 | Quiz + leaderboard + achievements |
| 7:30 | **Live quiz battle with audience** |
| 10:00 | Savings + voice |
| 10:30 | Birthday transition |
| 11:00 | Adult dashboard — anomaly detection |
| 12:30 | Proactive coaching |
| 13:30 | Subscription manager |
| 14:30 | AI chat widgets (transfer, spending, portfolio, voice) |
| 17:00 | Stock deep dive |
| 17:30 | Parent dashboard |
| 19:00 | Legal & trust (Mateo, Berkay) |
| 20:30 | **Block A** — Vibe coding (Vladimir) |
| 22:30 | **Block B** — How Leo works: agents + function calling |
| 25:30 | **Block C** — Enterprise: ING implementation, MCP, skills, hooks |
| 28:30 | Closing |

> Without live quiz: gain ~2-3 min buffer.
