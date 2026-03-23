# Features Missing from the Presentation
*Built and working in the codebase — not mentioned in any presentation version*

---

## PRIORITY 1 — Should definitely be in the presentation

### 1. Parent Dashboard
**What it does:** Parents get their own view. They see their child's learning progress, quiz scores, achievement timeline, savings goals. They set spending rules — daily limits, category restrictions, max per purchase. They control the risk profile with a slider.

**Why it matters for ING:** This is a killer feature for the audience. Parents are the actual customers who open accounts. Showing them control and visibility over their child's financial learning is the trust bridge. ING managers will immediately ask "how do parents interact with this?" — have the answer ready.

**Where in the app:** `parent-dashboard-demo.tsx` — fully built with tabs for Progress, Notifications, Limits, Rules.

---

### 2. Friction / Educational Safety Flows
**What it does:** Before a risky trade, the app shows an educational popup — not a blocker, but a learning moment. "Before you buy, here is what you should know about this stock." Includes a "Learn More" button that expands into a full explanation card.

**Why it matters for ING:** This is exactly what regulators and compliance teams want to hear. It shows the app is not encouraging risky behavior — it is actively educating at the moment of decision. For technical managers: this is a UI pattern that could apply to any ING product (loans, credit, investing).

**Where in the app:** `friction-demo.tsx`

---

### 3. Ukrainian / Multilingual Support
**What it does:** The app can switch languages. The Ukrainian demo shows financial vocabulary cards — German term on one side, Ukrainian translation + explanation on the other. Leo responds in whatever language you write in.

**Why it matters for ING:** Germany has 1.1 million Ukrainian refugees. ING serves international customers. Showing that Leo naturally adapts to languages — without any extra development — is a strong signal. For managers: this is not a feature we built, it is built into the AI. Zero extra cost.

**Where in the app:** `ukrainian-demo.tsx` with term translation cards

---

### 4. Accessibility Mode
**What it does:** Toggle accessible mode — changes status bar, enables text-to-speech, shows audio waveform during voice interaction. Designed for visually impaired or low-literacy users.

**Why it matters for ING:** Accessibility is a legal requirement (EAA — European Accessibility Act takes effect June 2025). Showing this proactively tells ING: we already thought about compliance before you asked.

**Where in the app:** `accessibility-demo.tsx`

---

### 5. Document Scanning / Bill Analysis
**What it does:** Leo can analyze uploaded documents — bills, receipts, contracts. It reads the document, explains charges, compares to market rates, and suggests if you are overpaying.

**Why it matters for ING:** This is a concrete "wow" moment in a demo. Upload a phone bill → Leo tells you the charges are 15% above market rate → suggests negotiation. It shows AI doing something a human financial advisor would charge for.

**Where in the app:** Demo scenario "document-scan" in `demo-scenarios.ts`

---

### 6. Proactive AI Coaching
**What it does:** Leo does not wait for questions. It sends proactive notifications:
- "Your rent is due in 3 days but your balance is low"
- "You have a double subscription — Netflix on two accounts"
- "You hit your savings goal early — want to set a higher target?"

**Why it matters for ING:** This shifts Leo from reactive (answer questions) to proactive (anticipate needs). For managers: this is the difference between a search engine and an advisor. The AI monitors and alerts — users do not need to remember to check.

**Where in the app:** Demo scenarios "rent-alert", "proactive-tip", "budget-alert" in `demo-scenarios.ts`. Also in the system prompt for adult mode.

---

## PRIORITY 2 — Worth a quick mention or visual

### 7. Leaderboard with School Rankings
**What it does:** Junior leaderboard has three views — weekly, all-time, and **school-based**. Kids compete with classmates. Weekly winner gets a €25 bonus added to their real account when they turn 18.

**Why it matters:** The school ranking makes it social. The real-money prize at 18 creates a bridge between virtual and real. Worth one sentence: "The weekly leaderboard winner gets 25 euros added to their real ING account when they turn 18."

---

### 8. Smart Transfer via Chat
**What it does:** Not just "send 50 to Ben." Leo does contact lookup, confirms the recipient, shows amount + IBAN, and asks for confirmation. Multi-step conversational flow — feels like talking to a person at the bank counter.

**Why it matters:** This is conversational banking at its clearest. One demo of this and every manager in the room understands why an AI chat is better than a form.

---

### 9. Card Management
**What it does:** View debit card (girocard) and VISA. Set card limits. Report disputed transactions ("Umsatz beanstanden"). Google Pay integration settings. Add new cards.

**Why it matters:** This shows the adult app is not just AI features — it is a full banking experience. Worth showing the card screen for 5 seconds to say: "We did not just build Leo — we built the complete ING experience around it."

---

### 10. Birthday Transition — Full 4-Phase Animation
**What it does:** The transition is more elaborate than described. Four phases:
1. Age counter counts up: 15... 16... 17... 18
2. Birthday cake appears with animated candle
3. User "blows out" the candle — confetti explosion
4. Screen cracks and shatters — white flash — adult dashboard appears

**Why it matters:** This is already in the presentation — but the description undersells it. This is a 15-second emotional moment. Let it play fully. Do not talk over it. The visual impact speaks for itself.

---

### 11. Bill Negotiation
**What it does:** Leo compares your bills to market rates. If your phone plan costs €40/month but similar plans cost €25, Leo suggests renegotiation and helps draft the message.

**Why it matters:** Saves users real money. Concrete, tangible value. One sentence in the demo is enough.

---

### 12. 21 Pre-Built Demo Scenarios
**What it does:** The app has 21 distinct demo conversations — rent alert, spending insight, document scan, stock inquiry, subscription check, quiz trigger, portfolio analysis, bill negotiation, market news, achievement unlock, and more.

**Why it matters for the presentation:** These are your safety net. If a live AI response is slow or weird, you can switch to a pre-built scenario instantly. Know they exist. Have 3-4 favorites ready as backup.

---

## PRIORITY 3 — Nice to have, mention if time allows

### 13. Voice Input in Chat
Leo supports voice — tap the mic, speak, Leo transcribes and responds. Worth showing for 10 seconds.

### 14. Achievement System — 13 Badges
Badges like "Mini-Investor", "Sparfuchs", "Finanz-Guru" — each unlocked by specific actions. Visual badge unlock animation with toast notification.

### 15. Spending Anomaly Detection
AI detects unusual transactions — duplicate subscriptions, unusually large purchases, sudden spending spikes. Flags them proactively.

### 16. XP Multiplier System
7+ day streak gives bonus XP multiplier. Pulsing fire animation on the streak counter. Rewards consistency.

### 17. Recurring Payments / Standing Orders
Adult app manages standing orders. Tracks recurring payments. Leo can identify and flag changes.

---

## HOW TO FIT THESE INTO THE PRESENTATION

**Option A — Weave into existing demo (recommended):**
- Parent dashboard: 30 seconds after junior demo — "And here is what the parents see"
- Friction flow: show during investment simulator — "Watch what happens before Lili trades"
- Document scan: one quick demo during adult chat widgets
- Proactive coaching: mention when showing transaction analysis
- Multilingual + Accessibility: 30 seconds — "Leo also works in other languages and has an accessible mode"

**Option B — Create a "And there is more" slide:**
After the main demo, before the technical close:
> "We showed you the core features. But Leo also does:
> - Parent dashboard with spending controls
> - Document scanning and bill analysis
> - Proactive coaching — Leo alerts you before problems happen
> - Works in any language — tested with Ukrainian
> - Accessible mode for all users
>
> All of this is built and working."

**Option C — Save for Q&A:**
When someone asks "what else can it do?" — pull out these features as answers. Shows depth without cramming the presentation.
