

> **Core Principle**: Every interaction in the LEO ecosystem starts and ends with AI. Leo is not a feature—it is THE interface.

### What "AI-First" Means for LEO

| Traditional Banking App | LEO AI-First Approach |
|------------------------|----------------------|
| User navigates menus to find features | User asks Leo, Leo navigates for them |
| Static screens with fixed information | Dynamic screens generated based on context |
| User must learn app structure | App learns user's habits and preferences |
| Reactive (user initiates actions) | Proactive (AI suggests actions before usefr thinks of them) |
| One-size-fits-all UI | Personalized UI based on user profile and behavior |

### AI-First for ING Junior Profile (Ages 13-17)
- **Learning is Primary**: Every screen is a learning opportunity
- **Leo Guides Everything**: No dead-ends; Leo is always available to explain
- **Proactive Education**: Leo notices when user is confused and offers help
- **Gamified AI**: Leo turns financial concepts into challenges
- **Safe Exploration**: Virtual money + real AI guidance = risk-free learning
- **Natural Language First**: Teens can type/speak naturally; no banking jargon required

### AI-First for ING Adult Profile (Ages 18-29)
- **Intelligent Automation**: Leo predicts and suggests recurring transactions
- **Contextual Insights**: Real-time analysis appears when relevant (not hidden in reports)
- **Document Intelligence**: Scan any financial document, Leo explains it instantly
- **Conversational Banking**: Complete banking tasks through natural conversation
- **Proactive Financial Health**: Leo alerts about unusual spending, opportunities, risks
- **Smart Notifications**: Not just alerts—actionable AI-powered suggestions

---

## Project Context & Challenge

### The ING Assignment
Based on the [ING Assignment Document](./ING%20assignment%20english%20version.pdf), the challenge involves:
- Exploring how AI can appropriately address young target groups in the banking app
- Building financial education and asset-building capabilities
- Creating a realistic prototype that could be implemented within 1.5-2 years

### Evaluation Criteria
From the [Important Criteria Document](./important%20criteria.pdf):

| Criterion | Description |
|-----------|-------------|
| **Social Relevance** | How well does the solution address the described problem? |
| **Future Viability** | Does it account for technological trends and long-term effectiveness? |
| **Feasibility** | Based on realistic assumptions and achievable framework conditions |
| **Multi-perspectivity** | Technology, ethics, law, economics perspectives included |
| **Social Inclusion** | Accessibility, diversity, and fair distribution considered |
| **Overall Impression** | Clear, compelling, and responsible approach to digitalization |

### ING Context from Q&A Session
Key insights from the [ING Q&A Transcript](https://github.com/Wladefant/leo/issues/19#issuecomment-3547965718):
- ING is **risk-averse** with strict regulatory requirements
- No physical gifts for gamification; digital rewards preferred
- Solution must be **integrated into existing app**, not standalone
- ~5% of customers currently opt-in to data analysis features (growing trend)
- ~11% of customer base is aged 20-29
- All user data can be accessed by the AI for personalization (with proper privacy controls)

---

## Target User Profiles

### Primary Target: ING Junior Profile (Ages 13-17)
**Related Issues**: [#32](https://github.com/Wladefant/leo/issues/32), [#34](https://github.com/Wladefant/leo/issues/34), [#5](https://github.com/Wladefant/leo/issues/5)

| Attribute | Description |
|-----------|-------------|
| **Age Range** | 13-17 years old |
| **Account Type** | Girokonto Junior (requires parental consent) |
| **Key Features** | Investment simulator, financial quizzes, virtual money |
| **Access Model** | 1 month free trial → requires parent-approved card |
| **UI Treatment** | Simplified interface with gamified elements |

**Pain Points** ([Issue #30](https://github.com/Wladefant/leo/issues/30)):
- Lack of practical financial knowledge before entering workforce
- Anxiety about taxes, investments, insurance
- No safe environment to learn about money management
- Traditional financial education is boring and not engaging

### Secondary Target: Young Adults (Ages 18-29)
**Related Issues**: [#46](https://github.com/Wladefant/leo/issues/46), [#32](https://github.com/Wladefant/leo/issues/32)

| Attribute | Description |
|-----------|-------------|
| **Age Range** | 18-29 years old |
| **Account Type** | Full ING Girokonto + Depot |
| **Key Features** | Real investments, full AI assistant, transaction analysis |
| **Demographics** | Students, "Azubis" (apprentices), young professionals, young families |

**Pain Points**:
- First time dealing with taxes, salary deductions
- Overwhelmed by financial product choices (insurance, investments)
- Need guidance on budgeting and subscription management
- Desire for personalized, trustworthy financial advice

---

## Core Features Overview

### 1. Leo AI Agent Chatbot
**Issues**: [#44](https://github.com/Wladefant/leo/issues/44), [#45](https://github.com/Wladefant/leo/issues/45), [#28](https://github.com/Wladefant/leo/issues/28), [#35](https://github.com/Wladefant/leo/issues/35)

The central AI assistant that provides:
- **General Mode**: Financial Q&A, explanations, personalized insights
- **Quiz Mode**: Interactive learning with adaptive difficulty
- **Voice Mode**: Text-to-speech and speech-to-text capabilities
- **Document Analysis**: Camera/file upload for contract/document explanation

**Key Characteristics** (from [ING Leo Important Considerations](./ING%20Leo%20important%20considerations.pdf)):
- Friendly, non-judgmental, empathetic tone
- Accurate, objective, free from manipulation
- Aligned with user's best interests
- **Must be clearly labeled as AI** (EU AI Act requirement)
- **Strictly finance-related** - cannot discuss non-financial topics

### 2. Investment Simulator (ING Junior)
**Issues**: [#5](https://github.com/Wladefant/leo/issues/5), [#34](https://github.com/Wladefant/leo/issues/34), [#36](https://github.com/Wladefant/leo/issues/36)

"Beat the Market" - Learn investing by trading virtual money with real market data.

| Feature | Description |
|---------|-------------|
| **Virtual Salary** | Weekly simulated salary (no reset option) |
| **Tax Simulation** | Taxes deducted from salary to teach netto/brutto concepts |
| **Real Market Data** | Live stock prices for realistic experience |
| **Portfolio View** | Track virtual holdings and performance |
| **Cash Display** | Show uninvested funds available for trading |

### 3. Smart AI Statistics & Analytics
**Issues**: [#47](https://github.com/Wladefant/leo/issues/47), [#43](https://github.com/Wladefant/leo/issues/43)

Intelligent transaction analysis featuring:
- **Automatic Categorization**: Company/subscription detection
- **Natural Language Queries**: "How much money did I make the last 6 months?"
- **Spending Insights**: Visual pie charts and trend analysis
- **AI-Powered Summaries**: Personalized financial health overview

### 4. Subscription Optimization
**Issues**: [#42](https://github.com/Wladefant/leo/issues/42), [#6](https://github.com/Wladefant/leo/issues/6)

- **Kreisdiagramm (Pie Chart)**: Visual representation of subscriptions
- **Savings Calculator**: "You will have €X more if you cancel this subscription"
- **Usage Detection** (Optional): Cookie-based suggestion to cancel unused services

### 5. Savings Goal Planner
**Issue**: [#6](https://github.com/Wladefant/leo/issues/6)

AI-assisted goal setting and tracking:
- Set personalized savings targets
- Track progress with visual indicators
- Receive AI recommendations for achieving goals faster

### 6. Interactive Quizzes
**Issues**: [#33](https://github.com/Wladefant/leo/issues/33), [#39](https://github.com/Wladefant/leo/issues/39), [#9](https://github.com/Wladefant/leo/issues/9)

**Topics**:
- Investments & Stocks
- Insurance Scenarios
- Taxes & Salary Deductions

**Features**:
- Accessible from any screen via Leo button
- Two modes: General Mode and Quiz Mode
- AI-generated questions based on user performance ([#17](https://github.com/Wladefant/leo/issues/17), [#18](https://github.com/Wladefant/leo/issues/18))
- Adaptive difficulty algorithm
- On-the-fly image generation for scenarios

### 7. Gamification & Rewards System
**Issues**: [#15](https://github.com/Wladefant/leo/issues/15), [#37](https://github.com/Wladefant/leo/issues/37)

| Element | Description |
|---------|-------------|
| **Points** | Earned for completing quizzes, learning modules |
| **Achievements** | Duolingo-style badges (e.g., "5 Quizzes Starter") |
| **Leaderboard** | Weekly competitions between students/schools |
| **Weekly Prizes** | Cash prizes for leaderboard leaders |
| **Financial Benefits** | Interest rate bonuses when turning 18 |
| **School Championships** | Inter-school competitions with leaderboards |

**Important**: No physical merchandise (ING policy from Q&A)

### 8. Personalized News Feed
**Issue**: [#16](https://github.com/Wladefant/leo/issues/16)

- **Stock News**: Bottom of stock view with company-specific news
- **Daily Notifications**: Click to open summarized news in chat
- **For You Page**: Perplexity-style personalized news based on watchlist/portfolio
- **Link Integration**: Opens browser for full article access

### 9. Smart Action Transfers (Notifications)
**Issues**: [#52](https://github.com/Wladefant/leo/issues/52), [#53](https://github.com/Wladefant/leo/issues/53)

**Scenario Example**: "It's the first of the month. Rent is usually due today. Send €800 to Landlord?"

**Visual Design**:
- Slim, focused card interface
- Recipient avatar, name, pre-filled amount
- Single slide-to-confirm or large violet [Send €800 now] button
- Removes friction for recurring transactions

---

## UI Creator Specifications

> **Purpose**: This section provides copy-paste ready specifications for app builders and UI tools. Each screen is described with exact elements, behaviors, and AI integrations.

### Global UI Components

#### 1. Leo Floating Action Button (FAB)
**Present on ALL screens**

```
Component: LeoFAB
Position: Bottom-right corner, 16dp margin
Size: 56dp diameter
Icon: Leo lion mascot (animated idle state)
Background: #ff6200 (ING Orange)
Shadow: Elevation 6dp
Animation: 
  - Idle: Subtle breathing animation
  - Attention: Gentle bounce when Leo has suggestion
  - Active: Scales to 1.1x when pressed
Behavior:
  - Tap: Opens Leo Chat Overlay
  - Long press: Shows quick actions menu
  - Badge: Shows notification dot when Leo has proactive suggestion
```

#### 2. Leo Chat Overlay
**Modal that appears over any screen**

```
Component: LeoChatOverlay
Type: Bottom sheet (expandable to full screen)
Initial height: 60% of screen
Max height: 95% of screen (drag to expand)
Background: White with rounded top corners (16dp radius)

Header:
  - Leo avatar (40dp)
  - "Leo" text label
  - Mode toggle: [General] [Quiz] (pill buttons)
  - Close button (X icon)

Chat Area:
  - ScrollView with message bubbles
  - User messages: Right-aligned, #f4f4f4 background
  - Leo messages: Left-aligned, white background with #e0e0e0 border
  - Typing indicator: Three animated dots

Input Bar:
  - Text field (rounded, placeholder: "Ask Leo anything...")
  - Voice button (microphone icon)
  - Camera button (opens document scanner)
  - Attachment button (file picker)
  - Send button (#ff6200 when active)

Inline Widgets (appear in chat):
  - StockWidget: Mini stock chart + price + change%
  - GraphWidget: Line/bar chart visualization
  - DiagramWidget: Pie chart for spending
  - TransferPrompt: Quick send money card
  - QuizCard: Multiple choice question card
```

#### 3. Smart Notification Cards
**AI-triggered notifications**

```
Component: SmartNotificationCard
Type: Push notification + In-app card
Background: White
Border-left: 4dp #ff6200 accent

Structure:
  - Leo icon (24dp)
  - Title (bold, 16sp): "Leo suggests..."
  - Message (14sp): AI-generated suggestion
  - Action buttons (0-2 buttons):
    - Primary: #ff6200 background, white text
    - Secondary: Outlined, #ff6200 border
  - Dismiss button (X)

Examples:
  - "Rent is due today. Send €800 to Landlord?" [Send Now] [Later]
  - "You spent €50 more on dining this week. Want to see the breakdown?" [Show Me]
  - "Your Netflix trial ends tomorrow. Cancel subscription?" [Yes] [Keep It]
```

---

### Screen Specifications for ING Junior Profile

#### Screen J1: Junior Home Dashboard
**First screen after login for Junior users**

```
Screen: JuniorHomeDashboard
Navigation: Bottom tab "Home" (house icon)

Header Section:
  - Greeting: "Hey [Name]! 👋" (dynamic, time-based)
  - Leo speech bubble: AI-generated daily tip or challenge
  - Streak counter: "🔥 5 day streak!" (gamification)

Virtual Balance Card:
  - Background: Gradient #ff6200 to #ff8533
  - Virtual balance: "€2,450.00" (large, white)
  - Label: "Virtual Money" with info tooltip
  - Subtext: "Next salary: Monday (+€200)"
  - Leo mini-avatar corner badge

Quick Stats Row:
  - Portfolio value: "€1,200" with trend arrow
  - This week's gains: "+€45.20" (green) or "-€12.50" (red)
  - Points earned: "🏆 340 pts"

AI Insights Card:
  - Title: "Leo's Insight"
  - Dynamic content: AI-generated observation about user's activity
  - Example: "You've been researching tech stocks. Want a quiz about ETFs?"
  - Action button: [Take Quiz] or [Learn More]

Recent Activity Section:
  - List of last 5 virtual transactions
  - Each row: Icon, description, amount, time
  - Tap to expand with Leo explanation

Bottom Navigation:
  - Home (active)
  - Invest
  - Learn
  - Profile
```

#### Screen J2: Junior Investment Simulator
**Virtual stock trading interface**

```
Screen: JuniorInvestmentSimulator
Navigation: Bottom tab "Invest" (chart icon)

Tab Bar (top):
  - [Portfolio] [Watchlist] [News] [Discover]

Portfolio View (default tab):
  Header:
    - "My Portfolio"
    - Total value: "€1,234.56"
    - Daily change: "+€23.45 (+1.9%)" with color coding
    - Leo FAB shows "?" when user hovers over unfamiliar term

  Holdings List:
    - Each stock card:
      - Company logo (48dp)
      - Company name + ticker
      - Shares owned: "5 shares"
      - Current value + change %
      - Mini sparkline chart (7 days)
      - Tap to open Stock Detail Screen

  Cash Available Card:
    - "💰 Cash: €500.00"
    - "Available to invest"
    - [+ Add Funds] button (simulated)

  Leo Integration:
    - FAB pulsates when portfolio drops >5%
    - Tap shows: "Your tech stocks dropped. This is normal! Want to learn why?"

Discover Tab:
  - AI-curated stock suggestions
  - "Leo's Picks for You" section
  - Categories: Tech, Green Energy, Gaming, etc.
  - Each with Leo's explanation of why it fits user's profile
```

#### Screen J3: Junior Quiz Mode
**Gamified learning interface**

```
Screen: JuniorQuizMode
Navigation: From Leo FAB → Quiz Mode OR Learn tab

Quiz Selection:
  - Topic cards (swipeable):
    - 📈 Investing Basics (completion %)
    - 💼 Taxes 101 (completion %)
    - 🏠 Insurance Explained (completion %)
    - 💳 Smart Spending (completion %)
  - Each shows: Icon, title, progress bar, points available

Active Quiz View:
  Header:
    - Topic name
    - Progress: "Question 3/10"
    - Points at stake: "+15 pts"
    - Streak multiplier: "2x"

  Question Card:
    - AI-generated question text
    - Optional: Generated scenario image
    - Answer options (A, B, C, D) - large tap targets
    - 60-second timer (visual countdown ring)

  Answer Feedback:
    - Correct: Confetti animation + "+15 pts" toast
    - Wrong: Leo explanation appears
    - "Leo explains:" card with simple breakdown
    - [Got it!] button to continue

  Quiz Complete Screen:
    - Score summary
    - Points earned
    - Streak update
    - Leo message: "Great job! You now know more about..."
    - [Share Result] [Play Again] [Back to Learning]
```

#### Screen J4: Junior Leaderboard
**Social competition interface**

```
Screen: JuniorLeaderboard
Navigation: Profile tab → Leaderboards

Tab Bar:
  - [Weekly] [All-Time] [My School]

Leaderboard List:
  - Current user highlighted in #ff6200 background
  - Each row:
    - Rank (#1, #2, #3 have medal icons 🥇🥈🥉)
    - Avatar
    - Username (or anonymous option)
    - Points
    - Trend arrow (up/down from last week)

Weekly Prize Card (top):
  - "🏆 This Week's Prize"
  - Prize description: "€25 bonus to your real ING account at 18!"
  - Time remaining: "3 days 14 hours"
  - Current leader preview

My Stats Card:
  - Your rank: #42
  - Points: 1,240
  - "Need 60 more points to reach #40"
  - Leo tip: "Complete 2 more quizzes to climb 5 spots!"

School Championship Section:
  - School name + logo
  - School rank among all schools
  - [Invite classmates] button
```

#### Screen J5: Junior Salary/Taxes View
**Educational salary breakdown**

```
Screen: JuniorSalaryView
Trigger: Automatic popup when weekly "salary" arrives

Initial Popup:
  - "💰 Your Weekly Salary Arrived!"
  - Amount: "€200.00"
  - [See Breakdown] [Later]

Full View:
  Receipt-style card:
    - "SALARY RECEIPT" header
    - Gross salary: €200.00
    - Deductions section:
      - Income tax: -€30.00 (tap for Leo explanation)
      - Social security: -€15.00 (tap for Leo explanation)
      - Health insurance: -€10.00 (tap for Leo explanation)
    - Net salary: €145.00 (highlighted, green)
    
  Leo Education Card:
    - "This is how real salaries work!"
    - Animated infographic showing money flow
    - "In real life, these taxes pay for..."
    - [Take the Tax Quiz] button

  Historical View:
    - Chart showing weekly salary over time
    - "Your total earned: €2,400"
    - "Taxes paid: €440"
```

---

### Screen Specifications for ING Adult Profile

#### Screen A1: Adult Home Dashboard
**Main banking screen for adult users**

```
Screen: AdultHomeDashboard
Navigation: Bottom tab "Konten" (wallet icon)

Header:
  - "Good morning, [Name]" (time-based greeting)
  - Leo icon with notification badge if suggestion available

Accounts Overview:
  - Girokonto card:
    - Balance: €3,456.78 (large)
    - Account number (masked): •••• 4523
    - Quick actions: [Transfer] [Cards]
  - Extra-Konto card (savings):
    - Balance: €12,340.00
    - Interest rate badge: "1.5% p.a."
  - Depot card (investments):
    - Portfolio value: €8,234.56
    - Daily change indicator

Leo AI Insights Widget:
  - Position: Below accounts, above transactions
  - Background: Light blue (#e3f2fd)
  - Content: AI-generated insight
  - Examples:
    - "You have 3 subscriptions you haven't used this month"
    - "Your spending on dining increased 23% this week"
    - "You could save €200/month by refinancing your..."
  - [Tell Me More] button → Opens Leo chat with context

Recent Transactions:
  - Smart categorization (AI-assigned icons)
  - Each row: Merchant logo, name, amount, category
  - Tap transaction → Leo explains category + similar past transactions

Smart Actions Bar (AI-triggered):
  - Appears when Leo detects action opportunity
  - Example: "Rent due tomorrow → [Pay €800 now]"
  - Dismiss with swipe
```

#### Screen A2: Adult Leo Chat (Full Feature)
**Comprehensive AI assistant interface**

```
Screen: AdultLeoChat
Navigation: Leo FAB from any screen

Chat Interface:
  Header:
    - Leo avatar + name
    - Online status indicator
    - [Voice Mode] toggle
    - Settings gear icon

  Pre-populated Suggestions:
    - "How much did I spend on food this month?"
    - "Explain my last electricity bill"
    - "Should I invest in ETFs?"
    - "Analyze my subscriptions"

  Conversation Features:
    - Inline stock charts when discussing investments
    - Inline pie charts for spending breakdowns
    - Transaction cards with "Pay Now" buttons
    - Document preview cards (when scanning)

  Voice Mode:
    - Full screen takeover
    - Large Leo avatar (animated speaking)
    - Voice waveform visualization
    - "Listening..." / "Thinking..." / "Speaking..." states
    - Tap to interrupt

  Document Analysis Mode:
    - Camera opens with document frame guide
    - Auto-capture when document detected
    - Processing animation
    - Results in chat with highlighted key terms
    - Follow-up: "This insurance costs €50/month. Want me to find cheaper options?"
```

#### Screen A3: Adult Smart Statistics
**AI-powered financial analytics**

```
Screen: AdultSmartStatistics
Navigation: Konten → Statistics OR Ask Leo "Show my statistics"

Overview Card:
  - "Your Financial Health"
  - Score (1-100) with colored ring (red→yellow→green)
  - Leo-generated summary: "You're doing well! Spending is 5% under budget"

Spending Breakdown:
  - Animated pie chart
  - Categories: Housing, Food, Transport, Shopping, Subscriptions, Other
  - Tap category to drill down
  - Compare to: Last month / Last year / Average user

Income vs Expenses Graph:
  - Line chart with dual axis
  - Income line (green)
  - Expenses line (red)
  - Net savings area (blue fill)
  - Toggle: Weekly / Monthly / Yearly

AI Insights Section:
  - "🔍 Leo Found..."
  - List of discoveries:
    - "You paid for Spotify twice in November"
    - "Your grocery spending drops on weekends"
    - "You have €500 sitting idle - consider investing?"
  - Each with [Fix It] or [Learn More] action

Natural Language Query:
  - Search bar at top
  - "Ask about your finances..."
  - Voice input option
  - Example queries shown as chips
```

#### Screen A4: Adult Subscription Manager
**AI-powered subscription tracking**

```
Screen: AdultSubscriptionManager
Navigation: Konten → Subscriptions OR Ask Leo "Show my subscriptions"

Summary Card:
  - Total monthly: €89.99
  - Active subscriptions: 8
  - Leo flag: "2 potential issues found"

Subscription List:
  - Each card:
    - Service logo
    - Name
    - Monthly cost
    - Last charged date
    - AI flag (if unused/duplicate detected)

  AI Flags:
    - 🟡 "Not used in 30 days" (Netflix)
    - 🔴 "Duplicate service" (Spotify + Apple Music)
    - 🟢 "Good value" (no action needed)

  Tap subscription for detail:
    - Usage analysis (if detectable)
    - Total spent lifetime
    - Leo recommendation
    - [Cancel via Leo] [Keep]

Optimization Card:
  - "💡 Leo's Suggestions"
  - "Cancel these to save €35/month:"
  - List with one-tap cancel buttons
  - Total savings calculator
```

#### Screen A5: Adult Investment View
**Real investment portfolio with AI guidance**

```
Screen: AdultInvestmentView
Navigation: Bottom tab "Investieren"

Portfolio Summary:
  - Total value: €15,234.56
  - Daily change: +€123.45 (+0.82%)
  - Performance chart (1D/1W/1M/1Y/ALL)

Holdings List:
  - Each holding:
    - Logo + Name + Ticker
    - Shares × Price = Value
    - Gain/Loss (% and €)
    - Allocation percentage bar

Leo Investment Advisor:
  - Persistent card at bottom
  - "Based on your profile:"
  - Suggestions like:
    - "Your portfolio is tech-heavy. Diversify?"
    - "This ETF matches your sustainability preference"
  - [Ask Leo More] expands to full chat

Trade Actions:
  - [Buy] → Opens order flow with Leo guidance
  - [Sell] → Shows tax implications via Leo
  - Leo explains each step if user hesitates

News Integration:
  - "News affecting your portfolio"
  - AI-summarized articles
  - Relevance explained: "This news is about Apple (10% of your portfolio)"
```

---

### Shared Screen Specifications (Both Profiles)

#### Screen S1: Stock Detail View
**Individual stock information**

```
Screen: StockDetailView
Navigation: Tap any stock from portfolio/watchlist/search

Header:
  - Company logo (large, 64dp)
  - Company name
  - Ticker symbol
  - Current price (large)
  - Change: +€2.34 (+1.5%) with color

Price Chart:
  - Interactive line chart
  - Time range selector: [1D] [1W] [1M] [3M] [1Y] [ALL]
  - Touch to see price at point in time
  - Volume bars below

Key Metrics Grid:
  - Market cap
  - P/E ratio
  - 52-week high/low
  - Dividend yield
  - Each with (?) icon → Leo explains on tap

Leo Integration (Corner Overlay):
  - Leo avatar (small)
  - Expandable panel
  - Default text: "Want me to explain this stock?"
  - Junior: "Take a quiz about [Company]?"
  - Adult: "How does this fit your portfolio?"

Action Buttons:
  - Junior: [Add to Watchlist] [Practice Trade]
  - Adult: [Buy] [Sell] [Add to Watchlist]

News Section:
  - "Latest News about [Company]"
  - AI-summarized headlines
  - Sentiment indicator (positive/neutral/negative)
```

#### Screen S2: Onboarding Flow
**First-time user experience**

```
Flow: OnboardingFlow
Screens: 5-step wizard

Step 1: Welcome
  - Leo animation (friendly wave)
  - "Hi! I'm Leo, your AI financial assistant"
  - "I'll help you learn and manage money"
  - [Let's Start] button

Step 2: Profile Type
  - "Tell me about yourself"
  - Options:
    - "I'm new to finance" → Junior path emphasis
    - "I want to manage my money better" → Adult path emphasis
    - "I want to learn investing" → Both
  - Leo adapts future content based on selection

Step 3: Goals
  - "What are your financial goals?"
  - Multi-select cards:
    - 🎓 Save for education
    - 🏠 Save for a home
    - 🚗 Buy a car
    - 💼 Build emergency fund
    - 📈 Grow wealth
    - 🎮 Just explore
  - Leo: "Great choices! I'll remember these"

Step 4: Risk Preference
  - "How do you feel about risk?"
  - Visual slider with descriptions:
    - Conservative: "I prefer safety over high returns"
    - Moderate: "Balance of safety and growth"
    - Aggressive: "I'm okay with ups and downs for higher potential"
  - Leo shows example scenarios for each level

Step 5: Notifications
  - "How should I reach you?"
  - Toggles:
    - Daily tip from Leo
    - Weekly financial summary
    - Smart action suggestions
    - Quiz reminders (Junior only)
    - Market alerts (if invested)
  - [Complete Setup] button

Completion:
  - Confetti animation
  - "You're all set!"
  - "Your first tip: [AI-generated based on profile]"
  - [Go to Home]
```

#### Screen S3: Settings & Privacy
**User preferences and data control**

```
Screen: SettingsPrivacy
Navigation: Profile tab → Settings

Profile Section:
  - Photo
  - Name
  - Email
  - Phone
  - [Edit Profile]

Leo Preferences:
  - Personality: [Friendly] [Professional] slider
  - Proactivity: [More suggestions] ← → [Less suggestions]
  - Voice: Male/Female/Off
  - Language: German/English

Privacy & Data:
  - "What Leo can access:"
    - ✅ Transaction history
    - ✅ Account balances
    - ⬜ Location data
    - ✅ Document scans (temporary)
  - [View my data] → Export option
  - [Delete my data] → Confirmation flow

Notifications:
  - Master toggle
  - Individual toggles for each type
  - Quiet hours setting

Accessibility:
  - High contrast mode
  - Font size slider
  - Screen reader optimization
  - Reduce animations

Security:
  - Biometric login toggle
  - Change PIN
  - Login history
  - Active sessions

Legal:
  - Terms of service
  - Privacy policy
  - AI transparency information
  - "How Leo works" explainer
```

### 1. Login Screen
**Issue**: [#32](https://github.com/Wladefant/leo/issues/32)

| Element | Description |
|---------|-------------|
| **ING Deposit Users** | Standard login for adult accounts |
| **ING Kids Login** | Separate entry point for junior profiles |
| **UI Treatment** | If no Girokonto Junior, balance is greyed out |

### 2. General Account View (Konten)
**Issues**: [#47](https://github.com/Wladefant/leo/issues/47), [#54](https://github.com/Wladefant/leo/issues/54)

**Mockup Reference**: [`mockups/general_account_view.png`](./mockups/general_account_view.png)

**Elements**:
- Account balance display
- Recent transactions list
- Leo AI button (floating action button)
- Smart AI statistics widget integration
- Quick action buttons (Transfer, Cards, etc.)

### 3. Single Account View
**Mockup Reference**: [`mockups/single_account_view.png`](./mockups/single_account_view.png)

Detailed view of individual account with:
- Transaction history
- Category breakdown
- Leo integration for transaction queries

### 4. Leo Agent Chat View
**Issues**: [#44](https://github.com/Wladefant/leo/issues/44), [#45](https://github.com/Wladefant/leo/issues/45), [#28](https://github.com/Wladefant/leo/issues/28)

**Mockup Reference**: [`mockups/chat_view.png`](./mockups/chat_view.png)

**UI Elements**:
| Element | Description |
|---------|-------------|
| **Chat Interface** | Message bubbles with Leo responses |
| **Mode Toggle** | Switch between General/Quiz mode |
| **Input Bar** | Text input with file/camera/voice buttons |
| **Stock Widget** | Embedded stock charts in conversation |
| **Graph Widget** | Inline financial graphs |
| **Diagram Widget** | Pie charts and visualizations |
| **Settings Dialog** | Quick settings changes from chat |
| **Transaction Prompt** | Quick money transfer dialogs |

**Capabilities**:
- Voice reading of messages (accessibility)
- Automation: transactions, dark mode toggle, settings from chat
- Document analysis via camera/file upload

### 5. Stock View (Individual Stock)
**Issues**: [#36](https://github.com/Wladefant/leo/issues/36), [#51](https://github.com/Wladefant/leo/issues/51)

**Mockup References**: [`mockups/stock1.png`](./mockups/stock1.png), [`mockups/stock2.png`](./mockups/stock2.png)

**Elements**:
- Stock price chart (1D, 1W, 1M, 1Y, All time)
- Buy/Sell buttons
- Company news section at bottom
- Leo integration for stock explanations
- Analyst ratings and recommendations

**Leo Integration**: Chatbot overlay showing:
- Stock explanations
- Risk analysis
- "Do a quiz about this stock" speech bubble

### 6. Stock List View / Portfolio View
**Issue**: [#11](https://github.com/Wladefant/leo/issues/11)

- Search icon at top (Apple-style search UX)
- Portfolio and News tabs
- Watchlist integration
- Cash balance display (uninvested funds)

**ING Trading Features Reference**: See [`ING Trading Features/`](./ING%20Trading%20Features/) folder containing:
- Depot-Übersicht (Depot Overview)
- Watchlist
- Wertpapier-Portraits (Securities Portraits)
- Wertpapier-Suche (Securities Search) with filters

### 7. Investment Dashboard
**Related Files**: [`ING Trading Features/Investieren Dashboard/`](./ING%20Trading%20Features/Investieren%20Dashboard/)

Main investment screen with:
- Portfolio summary
- News and Stocks tabs at top
- Personalized summarized news (Perplexity-style)
- Same experience in Junior and ING app

### 8. Salary / Taxes View
**Issue**: [#40](https://github.com/Wladefant/leo/issues/40)

**Trigger**: Weekly salary arrival (first occurrence shows popup)

**UI Elements**:
- Receipt-style breakdown of gross to net salary
- Tax deduction itemization
- Leo speech bubble: "Do a quiz about taxes"
- Educational explanations of each deduction

### 9. Quizzes View
**Issue**: [#33](https://github.com/Wladefant/leo/issues/33)

**Access**: From any screen via Leo button

**UI Flow**:
1. Open Leo
2. Select: General Mode or Quiz Mode
3. Quiz Mode opens Duolingo-style interface
4. Topics: Investment, Insurance, Taxes

**Features**:
- Adaptive difficulty based on performance
- Progress tracking
- Points/achievement integration

### 10. Leaderboard View
**Issue**: [#37](https://github.com/Wladefant/leo/issues/37)

- Weekly point collection display
- School/user rankings
- Prize announcements
- Achievement badges

### 11. Statistics View
**Issue**: [#47](https://github.com/Wladefant/leo/issues/47)

**Mockup Reference**: [`mockups/statistics.png`](./mockups/statistics.png)

- Spending category breakdown
- Income vs. expenses visualization
- Trend analysis over time
- AI-generated insights

### 12. Savings Planner View
**Issue**: [#6](https://github.com/Wladefant/leo/issues/6)

**Mockup Reference**: [`mockups/savings_planner.png.png`](./mockups/savings_planner.png.png)

- Goal setting interface
- Progress visualization
- AI recommendations for savings optimization

### 13. Products / Insurance View
**Issue**: [#9](https://github.com/Wladefant/leo/issues/9)

**Mockup Reference**: [`mockups/products_view.png`](./mockups/products_view.png)

**ING App**: Can purchase insurance products
**ING Junior**: Can read about and do quizzes on insurance

### 14. Personal Questions Onboarding
**Issue**: [#38](https://github.com/Wladefant/leo/issues/38)

Initial setup flow asking about:
- Financial goals (short-term and long-term)
- Risk preferences
- Current financial situation
- Interests and learning preferences

### 15. Virtual Money Dashboard (ING Junior)
**Issue**: [#34](https://github.com/Wladefant/leo/issues/34)

- Virtual balance display
- Simulated transaction history
- Investment portfolio (virtual)
- Weekly "salary" deposits

### 16. High Contrast / Accessibility View
**Mockup Reference**: [`mockups/high_contrast_general_account_view.png`](./mockups/high_contrast_general_account_view.png)

- High contrast mode for visual accessibility
- Screen reader compatible elements
- Simplified navigation for cognitive accessibility

---

## AI Agent "Leo" Specifications

### Personality & Tone
**Issue**: [#45](https://github.com/Wladefant/leo/issues/45)

Based on [ING Leo Important Considerations](./ING%20Leo%20important%20considerations.pdf):

| Attribute | Description |
|-----------|-------------|
| **Tone** | Friendly, non-judgmental, empathetic, motivating |
| **Language** | Simple, jargon-free, easy to understand |
| **Examples** | Real-life scenarios that resonate with young users |
| **Emotional Support** | Helps users deal with fears (risks, debt, investments) |
| **Feeling Created** | Empathy, understanding, support |

### Core Capabilities

1. **Financial Knowledge Adaptation**
   - Knows user's short- and long-term goals
   - Understands risk preferences
   - Aligns advice with personal tradeoffs

2. **Query Understanding**
   - Natural language processing for financial questions
   - SQL-like data queries on user transactions
   - Context-aware responses based on conversation history

3. **Content Generation**
   - Quiz questions adapted to user level
   - Personalized insights and recommendations
   - Document explanations in plain language

### Technical Constraints
**Issue**: [#35](https://github.com/Wladefant/leo/issues/35)

- **Strictly Finance-Related**: Cannot discuss non-financial topics
- **Closed Environment**: Does not scrape open internet (prevents fake news/hallucinations)
- **Two Memory Types**:
  - **Shared Memory**: General financial knowledge (accessible to all)
  - **Closed Memory**: Private user data (never leaked between users)

### Interaction Modes

1. **Text Chat**: Standard messaging interface
2. **Voice Input**: Speech-to-text for questions
3. **Voice Output**: Text-to-speech for responses
4. **Camera/File Upload**: Document analysis capability

### Widgets (Inline in Chat)
**Issue**: [#48](https://github.com/Wladefant/leo/issues/48)

| Widget | Description |
|--------|-------------|
| **Stock Widget** | Live stock chart with key metrics |
| **Graph Widget** | Line/bar charts for financial data |
| **Diagram Widget** | Pie charts for spending breakdown |
| **Transfer Prompt** | Quick money transfer dialog |
| **Settings Dialog** | Quick settings changes |

---

## Design System & UI Guidelines

### Color Palette
**Issue**: [#25](https://github.com/Wladefant/leo/issues/25)

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Main (Orange)** | `#ff6200` | Primary actions, highlights, ING branding |
| **Background (Light Grey)** | `#f4f4f4` | Screen backgrounds |
| **Text (Dark Grey)** | `#1f1f1f` | Body text, headings |
| **Violet** | (accent) | Secondary actions (e.g., Send button) |

### Design Principles

1. **Consistency with ING App**: Follow existing ING design patterns
2. **Simplified for Junior**: Less complex UI for younger users
3. **Accessibility First**: WCAG compliance, high contrast mode
4. **Mobile-First**: Optimized for smartphone interactions

### UI Elements

**Leo Button**: 
- Floating action button present on all screens
- Lion mascot icon ([`mockups/Leo.png`](./mockups/Leo.png))
- Opens chat interface

**Navigation**:
- Bottom tab bar (Konten, Investieren, Products, Settings)
- Leo button accessible from all tabs

---

## Legal & Compliance Considerations

### EU AI Act Classification
**Issue**: [#50](https://github.com/Wladefant/leo/issues/50)

Based on legal analysis in Issue #50:

| Classification | Rationale |
|---------------|-----------|
| **Limited Risk** | General financial advice, spending analysis, saving potential insights |
| **NOT High-Risk** | Not used for creditworthiness evaluation, insurance pricing, or essential benefits eligibility |

**Primary Obligation - Transparency (Article 50)**:
- Users must be informed they're interacting with AI
- AI-generated content must be machine-readable and detectable
- Staff must have sufficient AI literacy

### GDPR Compliance
**Issue**: [#50](https://github.com/Wladefant/leo/issues/50)

| Requirement | Implementation |
|-------------|----------------|
| **DPIA** | Data Protection Impact Assessment required for sensitive data processing |
| **Explicit Consent** | Cannot use "legitimate interest" for sensitive financial data |
| **Enhanced Security** | Encryption, strict access controls |
| **Data Minimization** | Collect only necessary data |

### Minors Protection (Under 18)
**Issue**: [#50](https://github.com/Wladefant/leo/issues/50)

| Requirement | Implementation |
|-------------|----------------|
| **Age Verification** | Reasonable efforts to verify consent (not just Y/N) |
| **Parental Consent** | Required for users under 16 in Germany |
| **Child-Friendly Transparency** | Clear, plain language explanations |
| **No Profiling-Based Ads** | Prohibited for minors |
| **Highest Privacy Settings** | Default configuration |
| **No Dark Patterns** | No manipulative or addictive design |

### Prohibited Practices
From [ING Leo Important Considerations](./ING%20Leo%20important%20considerations.pdf):

❌ **Manipulation Tactics**:
- Pressure tactics
- Disguised sales pushes
- Emotional manipulation to upsell products

✅ **Required Practices**:
- Human oversight for critical decisions
- Privacy-by-design
- Transparency and explainability
- Ethical neutrality

### Data Usage Boundaries
**Issue**: [#50](https://github.com/Wladefant/leo/issues/50)

**Allowed**:
- System improvement (aggregated, anonymized)
- Security purposes
- Educational analytics

**Prohibited**:
- Marketing/cross-selling using simulator data
- Bundled consent ("play simulator" ≠ "open bank account")

### Implementation Examples

**Transparency Popup**:
```
"Let's face it: managing subscriptions is boring stuff. Ever bought the 
same service twice or forgot to cancel a free trial? 🤦‍♂️

To help you avoid that, we analyze your transaction data to spot 
duplicates and wasted money. We do this to give you personalized 
savings tips.

Read the full [Privacy Policy] to see exactly how we crunch the numbers."
```

**Opt-Out Option**:
```
☐ Allow personalized insights based on my spending data.
```

---


### AI-First Features (Priority: High)

#### NEW: Leo Proactive Conversation Starters
**Labels**: feature, ING APP, ING Junior, AiChat
```
Description: Leo shouldn't wait for users to ask questions. Based on user behavior and context, 
Leo should proactively start conversations.

Examples:
- "I noticed you viewed Apple stock 3 times this week. Want me to explain what's happening?"
- "You've been saving consistently! Have you thought about where this money could grow?"
- "Your rent payment bounced last month. Want help setting up a buffer fund?"

AI-First Principle: Leo is proactive, not reactive.
```

#### NEW: Leo Voice Personality Settings
**Labels**: feature, ING APP, ING Junior, AiChat
```
Description: Users should be able to customize Leo's voice and personality.

Options:
- Voice: Male / Female / Non-binary
- Tone: Friendly / Professional / Casual
- Emoji usage: On / Off / Minimal
- Verbosity: Detailed / Concise
- Language: German / English

Junior-specific: More playful tone, more emojis, simpler vocabulary
Adult-specific: More professional options, business terminology available
```

#### NEW: Leo Learning Mode Detection
**Labels**: feature, ING Junior, AiChat
```
Description: Leo detects when user is confused or struggling and automatically offers help.

Signals:
- User scrolling back and forth on same screen
- User opening and closing same feature repeatedly
- User typing questions but deleting them
- Long pauses during quiz

Response: Leo gently appears: "Looks like you might have questions. Can I help explain something?"
```

#### NEW: Leo Context Memory Across Sessions
**Labels**: feature, ING APP, ING Junior, AiChat
```
Description: Leo remembers conversations across sessions and references previous discussions.

Examples:
- "Last week you asked about ETFs. Ready to take the next step?"
- "Remember when you set that savings goal? You're 60% there!"
- "You were curious about Tesla. It's up 5% since we talked."

Privacy: User can clear conversation history anytime.
```

### Junior Profile Features (Priority: High)

#### NEW: Parent Dashboard
**Labels**: feature, ING Junior, Screens/View
```
Description: Parents of Junior users need visibility into their child's learning progress.

Features:
- View child's quiz scores and topics covered
- See virtual portfolio performance
- Approve/deny simulated purchases over certain amounts
- Set weekly screen time limits
- Receive weekly progress reports via email

NOT included:
- Cannot see chat conversations (privacy for teens)
- Cannot make investment decisions for child
```

#### NEW: Teen-to-Adult Transition Flow
**Labels**: feature, ING Junior, ING APP, Screens/View
```
Description: When Junior user turns 18, they transition to adult profile with celebration.

Flow:
1. On 18th birthday: Special Leo message + animation
2. "You're officially an adult now! Let's unlock your full account."
3. Show earned achievements and points
4. Convert virtual portfolio learnings to real suggestions
5. Optionally convert accumulated points to welcome bonus
6. Full ING features unlock

No data loss: All learning progress, quiz history preserved
```

#### NEW: School Registration Portal
**Labels**: feature, ING Junior, Screens/View
```
Description: Schools can register for Leo Education Program.

Features:
- School admin creates class groups
- Teachers track class progress
- Inter-class competitions
- School leaderboard
- Curriculum alignment tools
- Parent consent management

Partnership opportunity for ING.
```

### Adult Profile Features (Priority: Medium)

#### NEW: Bill Negotiation Assistant
**Labels**: feature, ING APP, AiChat
```
Description: Leo helps users negotiate bills and subscriptions.

Features:
- Identify bills that could be reduced (electricity, internet, insurance)
- Generate negotiation scripts
- Track negotiation outcomes
- Suggest competitors with better rates
- (Future) Actually negotiate on user's behalf via API

Example: "Your electricity bill is €50/month higher than average. Want me to draft a 
message to your provider asking for a better rate?"
```

#### NEW: Financial Goal Collaboration
**Labels**: feature, ING APP, Screens/View
```
Description: Couples/families can set shared savings goals.

Features:
- Invite partner to shared goal
- Combined progress tracking
- Split contributions automatically
- Leo celebrates joint milestones
- Individual contribution visibility

Example: "House fund: €12,000 / €50,000 (Lisa: €7,000, Max: €5,000)"
```

#### NEW: Investment Decision Explainer
**Labels**: feature, ING APP, AiChat
```
Description: Before any trade, Leo explains the decision in simple terms.

Features:
- Tax implications: "If you sell now, you'll owe €X in taxes"
- Portfolio impact: "This will make Apple 30% of your portfolio"
- Risk assessment: "This stock is more volatile than average"
- Alternative suggestions: "Have you considered this similar ETF?"
- Historical context: "The last time you sold during a dip, you regretted it"
```

### Technical Features (Priority: Medium)

#### NEW: Leo Offline Mode
**Labels**: feature, ING APP, ING Junior
```
Description: Basic Leo functionality when internet unavailable.

Available offline:
- View cached account balances
- See recent transactions
- Access downloaded quiz content
- Read saved financial tips

Not available offline:
- New AI conversations
- Real-time stock prices
- Send money

Sync: Automatically syncs when connection restored
```

#### NEW: Leo Widget for Home Screen
**Labels**: feature, ING APP, ING Junior
```
Description: iOS/Android home screen widget showing Leo insights.

Widget sizes:
- Small: Daily tip from Leo
- Medium: Account balance + tip
- Large: Balance + recent transactions + AI insight

Tap to expand: Opens app to relevant screen
Privacy: Can hide balance on widget
```

#### NEW: Leo API for Third-Party Integration
**Labels**: feature, ING APP, documentation
```
Description: Allow approved third-party apps to query Leo (with user consent).

Use cases:
- Budgeting apps asking "What's my spending category breakdown?"
- Tax software asking "What's my investment income this year?"
- Financial planning apps getting personalized insights

Security: OAuth 2.0, user explicit consent, audit logs
```

### Accessibility Features (Priority: High)

#### NEW: Leo Sign Language Mode
**Labels**: feature, ING APP, ING Junior, accessibility
```
Description: Leo avatar can communicate using sign language animations.

Implementation:
- Pre-rendered sign language animations for common phrases
- Real-time generation for custom responses
- German Sign Language (DGS) primary
- Optional subtitles alongside

Inclusive design: Makes Leo accessible to deaf/hard-of-hearing users
```

#### NEW: Simplified Language Mode
**Labels**: feature, ING APP, ING Junior, accessibility
```
Description: Ultra-simplified language for users with cognitive disabilities.

Features:
- Maximum 10 words per sentence
- Common words only (no financial jargon)
- Large, clear fonts
- Pictographic support
- Slower animations
- Repetition options

WCAG compliance: AAA level support
```

---

## Existing Issue Expansion Details

> **Purpose**: Copy-paste these detailed descriptions as comments to existing issues to expand them with full specifications.

---

### Issue #44: General Chatbot View - EXPANDED DESCRIPTION

```markdown
## Complete Feature Specification: Leo AI Chat Interface

### Overview
The Leo Chat View is the central AI interaction point for both ING Junior and ING Adult profiles. 
This is an AI-FIRST interface - users should be able to accomplish any banking task through conversation.

### Visual Design Specification

#### Chat Container
- **Type**: Bottom sheet overlay (expandable to fullscreen)
- **Initial Height**: 60% of screen
- **Max Height**: 95% of screen (drag handle to expand)
- **Background**: White with 16dp rounded top corners
- **Animation**: Smooth spring animation on open/close

#### Header Bar
- Leo avatar: 40dp circular, animated idle state
- Title: "Leo" (16sp, bold)
- Mode toggle: Pill buttons [General] [Quiz]
- Close button: X icon, top-right

#### Message Area
- ScrollView with smooth scrolling
- User messages: Right-aligned, #f4f4f4 background, 12dp rounded corners
- Leo messages: Left-aligned, white with #e0e0e0 border, Leo avatar beside
- Typing indicator: Three animated dots when Leo is "thinking"
- Timestamp: Small, grey, below message groups

#### Inline Widgets
Widgets appear within the chat flow when Leo needs to display rich content:

1. **Stock Widget**
   - Mini chart (sparkline, 7-day default)
   - Current price + change %
   - Company logo + ticker
   - Tap to open full Stock View

2. **Graph Widget**
   - Line or bar chart for financial data
   - Labeled axes
   - Touch to see exact values

3. **Diagram Widget**
   - Pie chart for spending/portfolio breakdown
   - Labeled segments with %
   - Tap segment for details

4. **Transfer Prompt Widget**
   - Recipient avatar + name
   - Amount input (pre-filled if contextual)
   - [Send Now] primary button
   - [Cancel] secondary button

5. **Quiz Card Widget**
   - Question text
   - 4 answer options (A, B, C, D)
   - 60-second countdown timer
   - Tap answer to submit

#### Input Bar
- Text field: Rounded, full width
- Placeholder: "Ask Leo anything about money..."
- Left icons: 📎 (attach) | 📷 (camera) | 🎤 (voice)
- Right icon: Send arrow (orange when text present)
- Voice mode: Hold microphone for voice input

### AI-First Capabilities

#### Natural Language Understanding
Leo understands and responds to:
- "How much did I spend on food last week?"
- "Transfer €50 to Mom"
- "What is an ETF?"
- "Should I buy Apple stock?"
- "Cancel my Netflix subscription"
- "Take a quiz about taxes"

#### Contextual Actions
Leo can perform actions directly from chat:
- Execute transfers (with confirmation)
- Toggle dark mode
- Open specific screens
- Generate quizzes on any topic
- Analyze uploaded documents

#### Document Analysis Mode
- User taps camera icon
- Camera opens with document frame guide
- Auto-capture when document aligned
- OCR processing (1-2 seconds)
- Leo explains document in plain language
- Follow-up questions supported

#### Voice Mode
- User holds microphone or taps voice toggle
- Full-screen voice interface
- Large animated Leo avatar
- Voice waveform visualization
- "Listening..." → "Thinking..." → "Speaking..." states
- Text transcript appears below

### Differences by Profile

| Feature | ING Junior | ING Adult |
|---------|------------|-----------|
| Default tone | Playful, more emojis | Professional, concise |
| Quiz prompts | Frequent, encouraged | Optional, suggested |
| Trade actions | Virtual only | Real with confirmation |
| Document scan | Explain only | Explain + suggest action |
| Voice | Available | Available |

### Related Issues
- #45 (Emotional access points)
- #28 (Files/camera/voice)
- #48 (Widgets)
- #35 (Finance-only constraint)
```

---

### Issue #5: Investment Simulator - EXPANDED DESCRIPTION

```markdown
## Complete Feature Specification: Investment Simulator ("Beat the Market")

### Overview
The Investment Simulator allows ING Junior users to learn investing using virtual money 
with real-time market data. This creates a safe, consequence-aware learning environment.

### Core Mechanics

#### Virtual Money System
- **Starting Balance**: €1,000 virtual
- **Weekly Salary**: €200 added every Monday (simulates income)
- **No Reset Option**: Once spent/lost, money is gone until next salary
- **Tax Deductions**: 15% withheld from virtual salary (teaches netto/brutto)
- **Net Weekly Income**: €170 after taxes

#### Why No Reset?
The lack of reset is intentional to prevent:
- Gambling mentality (no consequences = bad learning)
- Unrealistic risk-taking
- Disconnection from real financial behavior

Instead, users learn:
- Money is finite
- Losses hurt
- Recovery takes time
- Patience is rewarded

### Trading Features

#### Buy Flow
1. User selects stock from search/watchlist
2. Sees current price + mini chart
3. Leo appears: "Before you buy, let me explain this stock..."
4. User enters quantity or € amount
5. Order preview shows total cost + remaining cash
6. Leo note: "This will be 25% of your portfolio"
7. Confirm button executes "purchase"
8. Celebration animation + points earned

#### Sell Flow
1. User selects owned stock
2. Sees purchase price vs current price (P/L)
3. Leo appears: "If you sell now, here's what happens..."
4. Shows gain/loss calculation
5. Simulated tax calculation (Kapitalertragssteuer)
6. Confirm button executes "sale"
7. Cash added to balance

### Leo AI Integration

#### Pre-Trade Education
Before every trade, Leo offers context:
- "Apple is a tech company that makes iPhones..."
- "This stock went up 50% last year but also dropped 30% once"
- "Based on your quiz results, you understand risk levels"

#### Risk Warnings
Leo intervenes when detecting risky behavior:
- "You're putting 80% in one stock. Diversification tip: ..."
- "This stock is very volatile. Are you sure?"
- "You've been checking prices every hour. Try setting alerts instead."

#### Learning Opportunities
Leo turns every event into education:
- Stock drops: "Markets go up and down. Here's why this happened..."
- Dividend received: "Congratulations! This is called a dividend. Quiz time?"
- Portfolio milestone: "Your portfolio hit €2,000! You've learned..."

### Portfolio Dashboard

#### Header
- Total portfolio value (large)
- Daily/weekly change (% and €)
- Cash available to invest

#### Holdings List
Each stock shows:
- Company logo (48dp)
- Company name + ticker
- Shares owned
- Current value
- Gain/loss (color-coded)
- Mini sparkline chart

#### Performance Chart
- Line graph of portfolio value over time
- Benchmark comparison option (DAX, S&P 500)
- Time range selector: 1W, 1M, 3M, 6M, ALL

### Gamification Elements

#### Points for Actions
- First purchase: +50 pts
- Correct quiz about owned stock: +25 pts
- Holding through volatility: +10 pts/week
- Portfolio diversification bonus: +100 pts

#### Achievements
- "First Trade" - Complete first purchase
- "Diamond Hands" - Hold through 20% drop
- "Diversifier" - Own 5+ different stocks
- "Tax Expert" - Complete tax quiz with 100%

#### Leaderboard Integration
- Compare virtual portfolio performance with peers
- Weekly competitions (who gains most %)
- School rankings

### UI Screens

#### Main Portfolio View
Navigation: Bottom tab "Invest"

```
┌─────────────────────────────────────┐
│  My Virtual Portfolio               │
│  €1,847.23  ▲ +€123.45 (+7.2%)     │
│  ───────────────────────────────── │
│  Cash: €423.00                     │
│                                     │
│  📈 Holdings                        │
│  ┌─────────────────────────────┐   │
│  │ 🍎 Apple        5 shares    │   │
│  │    €847.50     +€47.50      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🚗 Tesla        2 shares    │   │
│  │    €576.73     -€23.27      │   │
│  └─────────────────────────────┘   │
│                                     │
│  [+ Buy More]                       │
│                                     │
│  💡 Leo says: "Good diversification!│
│     Ready for a portfolio quiz?"   │
│                     [Take Quiz]     │
└─────────────────────────────────────┘
```

#### Stock Search
- Search bar at top
- Categories: Popular, Tech, Green, Local
- AI suggestions: "Based on your interests..."

### API Requirements
- Real-time stock prices (15-min delay acceptable)
- Historical price data (5 years)
- Company information (name, logo, sector)
- News API for stock-specific news

### Compliance Notes
- Clearly labeled as "VIRTUAL" / "SIMULATION"
- Cannot be converted to real money
- Educational purpose disclaimer
- Parental visibility into activity
```

---

### Issue #33: QuizzesView - EXPANDED DESCRIPTION

```markdown
## Complete Feature Specification: Interactive Quiz System

### Overview
The Quiz System is Leo's primary teaching tool, accessible from any screen via the Leo button.
Quizzes are AI-generated, adaptive, and deeply integrated with user activity.

### Access Points

#### Primary Access
1. Tap Leo FAB → Select "Quiz Mode"
2. Quiz topic selection appears

#### Contextual Access (AI-Triggered)
- After viewing stock: "Want to test your knowledge about this company?"
- After salary arrives: "Quiz time! What did you learn about taxes?"
- After reading news: "Quick quiz: What does this news mean for investors?"

### Quiz Categories

#### 1. Investment Quizzes
- What is a stock?
- ETFs vs individual stocks
- Risk and return relationship
- Portfolio diversification
- Bull vs bear markets
- Reading stock charts
- Dividend basics
- Market capitalization

#### 2. Insurance Quizzes
- Types of insurance (health, liability, car)
- Why insurance matters
- Deductibles explained
- Reading insurance contracts
- When to file a claim
- Insurance vs savings

#### 3. Tax Quizzes
- Income tax basics
- Gross vs net salary
- Tax deductions for students
- Capital gains tax
- Tax filing basics
- Social security contributions

#### 4. Smart Spending Quizzes
- Budgeting basics
- Needs vs wants
- Subscription management
- Comparison shopping
- Emergency fund importance
- Debt awareness

### Quiz Interface

#### Topic Selection Screen
```
┌─────────────────────────────────────┐
│  Choose a Topic                     │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 📈       │  │ 🛡️       │        │
│  │Investing │  │Insurance │        │
│  │ ████░░░░ │  │ ██░░░░░░ │        │
│  │ 65%      │  │ 20%      │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 💰       │  │ 💳       │        │
│  │ Taxes    │  │ Spending │        │
│  │ ░░░░░░░░ │  │ ███░░░░░ │        │
│  │ 0%       │  │ 35%      │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  🔥 5-day streak! Keep it up!      │
└─────────────────────────────────────┘
```

#### Active Quiz Screen
```
┌─────────────────────────────────────┐
│  Investing Quiz      Q3/10    ⏱️45s │
│  ─────────────────────────────────  │
│  +15 pts at stake    🔥 2x streak   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ What happens when you buy   │   │
│  │ a stock?                    │   │
│  │                             │   │
│  │ [AI-generated illustration] │   │
│  └─────────────────────────────┘   │
│                                     │
│  A) You own part of the company    │
│                                     │
│  B) You lend money to the company  │
│                                     │
│  C) You become an employee         │
│                                     │
│  D) Nothing, it's just a number    │
│                                     │
└─────────────────────────────────────┘
```

#### Correct Answer Feedback
```
┌─────────────────────────────────────┐
│  ✅ Correct!              +15 pts   │
│  🎉 [confetti animation]           │
│                                     │
│  Leo explains:                      │
│  "When you buy a stock, you        │
│   literally own a tiny piece of    │
│   that company! If Apple has       │
│   1 billion shares and you own 1,  │
│   you own 0.0000001% of Apple."    │
│                                     │
│              [Got it! Next →]       │
└─────────────────────────────────────┘
```

#### Wrong Answer Feedback
```
┌─────────────────────────────────────┐
│  ❌ Not quite!             +0 pts   │
│                                     │
│  The correct answer is A.          │
│                                     │
│  Leo explains:                      │
│  "Buying a stock is different from │
│   lending money (that's a bond).   │
│   When you buy stock, you become   │
│   a shareholder - an actual owner  │
│   of a piece of the company!"      │
│                                     │
│  💡 Tip: Think "stock = share =    │
│     ownership"                      │
│                                     │
│              [Got it! Next →]       │
└─────────────────────────────────────┘
```

### AI-Generated Questions

#### Adaptive Difficulty
Leo tracks performance and adjusts:
- Below 50% correct → Easier questions, more explanation
- 50-80% correct → Standard difficulty
- Above 80% correct → Advanced questions, less hints

#### Contextual Questions
Leo generates questions based on user activity:
- User just bought Tesla: "What sector is Tesla in?"
- User looking at dividends: "How often does Apple pay dividends?"
- User's portfolio dropped: "When markets drop, what's usually the best action?"

#### Image Generation
For scenario-based questions, Leo can generate illustrations:
- Car accident scenario (insurance)
- Salary paycheck visualization (taxes)
- Stock chart patterns (investing)

### Gamification

#### Points System
- Correct answer (easy): +10 pts
- Correct answer (medium): +15 pts
- Correct answer (hard): +25 pts
- Perfect quiz (10/10): +50 bonus pts
- Streak bonus: 2x multiplier after 5 days

#### Achievements
- "Quiz Newbie" - Complete first quiz
- "Tax Whiz" - 100% on tax quiz
- "Investor Brain" - Complete all investing quizzes
- "Streak Master" - 30-day quiz streak
- "Know-It-All" - 90% overall accuracy

### Integration with Other Features

#### Stock View
- "Quiz about [Company]" button on every stock page

#### Salary View
- Quiz prompt when salary arrives

#### News Feed
- "Test your understanding" button on articles

#### Leaderboard
- Quiz performance contributes to ranking
```

---

### Issue #15: Gamification System - EXPANDED DESCRIPTION

```markdown
## Complete Feature Specification: Gamification & Rewards System

### Overview
The gamification system motivates users through points, achievements, leaderboards, and 
financial rewards - WITHOUT physical merchandise (per ING policy).

### Points Economy

#### Earning Points
| Action | Points | Profile |
|--------|--------|---------|
| Complete first quiz | +50 | Both |
| Correct answer (easy) | +10 | Both |
| Correct answer (medium) | +15 | Both |
| Correct answer (hard) | +25 | Both |
| Perfect quiz (10/10) | +50 bonus | Both |
| Daily login streak | +5/day | Both |
| First virtual trade | +50 | Junior |
| Portfolio diversification | +100 | Junior |
| Hold through volatility | +10/week | Junior |
| Complete onboarding | +100 | Both |
| Refer a friend | +200 | Both |

#### Streak System (Duolingo-style)
- Day 1-7: 1x multiplier
- Day 8-14: 1.5x multiplier
- Day 15-30: 2x multiplier
- Day 31+: 2.5x multiplier
- Freeze available: 1 free freeze per week

### Achievement Badges

#### Learning Achievements
- 🎓 "First Steps" - Complete first quiz
- 📚 "Bookworm" - Complete 10 quizzes
- 🧠 "Finance Brain" - Complete all quiz categories
- 💯 "Perfectionist" - Get 100% on any quiz
- 🔥 "On Fire" - 7-day streak
- ⚡ "Unstoppable" - 30-day streak

#### Trading Achievements (Junior)
- 📈 "First Trade" - Execute first virtual trade
- 💎 "Diamond Hands" - Hold through 20% drop
- 🎯 "Diversifier" - Own 5+ different stocks
- 🏆 "Beat the Market" - Outperform DAX for 1 month
- 💰 "Virtual Millionaire" - Reach €10,000 virtual

#### Community Achievements
- 👥 "Social Butterfly" - Join school leaderboard
- 🏅 "Top 10" - Rank in top 10 weekly
- 👑 "Weekly Champion" - #1 for the week
- 🏫 "School Pride" - Help school reach top 100

### Leaderboard System

#### Individual Leaderboard
- Weekly reset (Sunday midnight)
- Shows: Rank, Avatar, Username, Points, Trend
- Top 3 get special badges
- Own rank always visible

#### School Leaderboard
- Schools registered in system
- Aggregate points of all students
- Inter-school competition
- Monthly school champion announcement

#### Privacy Options
- Display real name vs anonymous
- Opt-out of leaderboard entirely
- Show to friends only

### Financial Rewards (No Physical Gifts!)

#### Junior Rewards
- At 1,000 pts: €5 bonus to real account at 18
- At 5,000 pts: €15 bonus
- At 10,000 pts: €25 bonus
- At 25,000 pts: 0.1% extra interest rate for first year

#### Adult Rewards
- At 5,000 pts: €10 account credit
- At 10,000 pts: 0.1% interest bonus for 3 months
- At 25,000 pts: Free premium feature access

### School Championship Program

#### Registration
- Teacher/admin creates school account
- Students join via school code
- Parental consent required for minors

#### Competition Structure
- Weekly mini-competitions
- Monthly championship
- Annual grand championship

#### School Prizes (for school, not individuals)
- #1 School: €1,000 to school's financial literacy program
- Top 10 Schools: Recognition on ING website
- All participants: Certificate of participation

### UI Screens

#### Achievement Gallery
```
┌─────────────────────────────────────┐
│  🏆 My Achievements                 │
│                                     │
│  ──── Earned (12/36) ────          │
│                                     │
│  🎓  📚  💯  🔥  📈  💎            │
│                                     │
│  ──── Locked (24/36) ────          │
│                                     │
│  ⬜  ⬜  ⬜  ⬜  ⬜  ⬜            │
│  ⬜  ⬜  ⬜  ⬜  ⬜  ⬜            │
│                                     │
│  🎯 Next achievement:               │
│  "Diversifier" - Own 2 more stocks │
│                                     │
└─────────────────────────────────────┘
```

#### Weekly Leaderboard
```
┌─────────────────────────────────────┐
│  🏆 This Week's Leaders             │
│  Resets in: 2d 14h                  │
│                                     │
│  🥇 MaxMustermann    2,450 pts  ▲   │
│  🥈 FinanceQueen     2,230 pts  ▼   │
│  🥉 InvestorKid      2,100 pts  ▲   │
│  4. TaxExpert        1,980 pts  ─   │
│  5. StockNerd        1,875 pts  ▲   │
│  ...                                │
│  ─────────────────────────────────  │
│  42. You (MoneyLearner) 840 pts    │
│      ▲ 15 spots since yesterday    │
│                                     │
│  🎁 Weekly Prize: €25 bonus at 18  │
│                                     │
└─────────────────────────────────────┘
```

---

### Issue #47: Smart AI Statistics (Konten View) - EXPANDED DESCRIPTION

```markdown
## Complete Feature Specification: Smart AI Statistics

### Overview
The Smart AI Statistics feature transforms the boring "Konten" (Accounts) view into an 
intelligent financial insights dashboard. Leo proactively analyzes transactions and 
surfaces actionable insights.

### AI Insights Widget

#### Widget Design
- Position: Between accounts list and transactions
- Background: Light blue (#e3f2fd) or gradient
- Icon: Leo avatar with lightbulb
- Height: Auto-expanding based on content

#### Insight Types

1. **Spending Alerts**
   - "Your dining spending is up 34% this week (€87 → €117)"
   - "You spent €45 on Starbucks this month - that's €540/year!"
   
2. **Subscription Warnings**
   - "You have Netflix AND Disney+ - do you need both?"
   - "Gym membership unused for 45 days - €39/month"
   
3. **Savings Opportunities**
   - "Move €500 from Girokonto to Extra-Konto for 1.5% interest"
   - "You have €1,200 sitting idle - consider investing?"
   
4. **Positive Reinforcement**
   - "Great job! You spent 12% less than last month"
   - "You've saved €340 towards your vacation goal"

5. **Actionable Suggestions**
   - "Rent due tomorrow - send €800 to Landlord?" [Send Now]
   - "You paid for Spotify twice - want me to investigate?"

### Transaction Categorization

#### AI-Powered Categories
Leo automatically categorizes every transaction:
- 🏠 Housing (rent, utilities, insurance)
- 🍔 Food & Dining (groceries, restaurants)
- 🚗 Transportation (fuel, public transit, car)
- 🛒 Shopping (clothing, electronics, general)
- 🎬 Entertainment (streaming, events, hobbies)
- 💊 Health (pharmacy, doctor, gym)
- 📱 Subscriptions (recurring charges)
- 💼 Income (salary, freelance, transfers in)
- ❓ Uncategorized (user can manually assign)

#### Category Accuracy
- 90%+ accuracy for known merchants
- User can correct → Leo learns
- Shared learning across all users (anonymized)

### Natural Language Queries

Users can ask Leo anything about their finances:

| Query | Leo Response |
|-------|--------------|
| "How much did I spend last month?" | €2,340.56 - here's the breakdown... |
| "What's my average grocery spending?" | €287/month over the last 6 months |
| "Show me all Amazon purchases" | [List with dates and amounts] |
| "When did I pay rent last?" | October 1st, €800 to Max Mustermann |
| "How much do I spend on subscriptions?" | €89.97/month across 8 services |

### Spending Analytics Dashboard

#### Overview Card
```
┌─────────────────────────────────────┐
│  November 2025 Spending             │
│                                     │
│  €2,145.67 spent                    │
│  ████████████░░░░░ 78% of budget   │
│                                     │
│  vs October: ▼ €234 (-9.8%)        │
│                                     │
│  🎯 On track to meet your goal!    │
└─────────────────────────────────────┘
```

#### Category Breakdown (Pie Chart)
```
        Housing 42%
           🏠
     ┌─────────────┐
   🍔│             │🚗
Food │             │ Transport
 23% │             │ 12%
     │             │
     └─────────────┘
    Shopping  Entertainment
      15%         8%
       🛒          🎬
```

#### Trend Graph
- Line chart showing spending over time
- Compare to previous periods
- Highlight anomalies (sudden spikes)
- Forecast based on current trajectory

### Proactive Notifications

Leo doesn't wait for users to check - it pushes insights:

#### Morning Summary (Optional)
"Good morning! Yesterday you spent €45.20. 
Your biggest expense was €22 at Restaurant XYZ."

#### Weekly Report (Sunday)
"📊 Your week in review:
- Total spent: €312.45
- Top category: Food (€98)
- Saved vs last week: €45
- 🌟 You stayed under budget!"

#### Real-Time Alerts
- Large transaction detected (>€200)
- Unusual merchant (first time)
- Duplicate charge suspected
- Budget threshold approaching

### Screen Layout

```
┌─────────────────────────────────────┐
│  Good morning, Max! 👋              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Girokonto         €3,456.78 │   │
│  │ •••• 4523                   │   │
│  │ [Transfer] [Cards] [More]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💡 Leo's Insight            │   │
│  │                             │   │
│  │ You've spent €145 on dining │   │
│  │ this week - 28% more than   │   │
│  │ usual. Want to see details? │   │
│  │                             │   │
│  │         [Show Me]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Recent Transactions               │
│                                     │
│  Today                             │
│  🛒 Amazon          -€34.99        │
│  🍔 Lieferando      -€22.50        │
│                                     │
│  Yesterday                         │
│  💼 Salary          +€2,800.00     │
│  🏠 Rent            -€800.00       │
│                                     │
└─────────────────────────────────────┘
```

---

### Issue #52: Smart Action Transfer Widget - EXPANDED DESCRIPTION

```markdown
## Complete Feature Specification: Smart Action Transfers

### Overview
Smart Action Transfers use AI to predict and suggest recurring transactions, 
reducing friction for routine payments to a single tap.

### AI Pattern Learning

#### What Leo Learns
- Recurring payments (rent, subscriptions, allowances)
- Typical amounts for each recipient
- Usual timing (1st of month, every Friday, etc.)
- Successful vs declined patterns

#### Triggers
1. **Calendar-Based**: "It's the 1st - rent usually due"
2. **Behavior-Based**: "You usually transfer to Mom on Fridays"
3. **Balance-Based**: "Salary arrived - time for savings transfer?"
4. **Event-Based**: "Birthday coming up - gift for Dad?"

### Notification Flow

#### Push Notification
```
┌─────────────────────────────────────┐
│ 🦁 Leo Suggestion                   │
│                                     │
│ Rent is usually due today.         │
│ Send €800 to Max Mustermann?       │
│                                     │
│ [Send Now]  [Not Today]  [Dismiss] │
└─────────────────────────────────────┘
```

#### In-App Card
When user opens app after notification:
```
┌─────────────────────────────────────┐
│  💡 Leo Suggests                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  👤 Max Mustermann          │   │
│  │     Rent - December         │   │
│  │                             │   │
│  │     €800.00                 │   │
│  │                             │   │
│  │  ┌─────────────────────┐   │   │
│  │  │   Send €800 now     │   │   │
│  │  │   ══════════════▶   │   │   │
│  │  └─────────────────────┘   │   │
│  │                             │   │
│  │  [Change Amount] [Not Now] │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Widget Interactions

#### Slide-to-Send
- Inspired by iPhone "slide to unlock"
- Prevents accidental sends
- Satisfying animation on complete
- Haptic feedback

#### Quick Modifications
- Tap amount to edit
- Change recipient (dropdown of frequents)
- Add note/reference
- Schedule for later

#### Confirmation
After send:
```
┌─────────────────────────────────────┐
│           ✅ Sent!                   │
│                                     │
│  €800.00 to Max Mustermann         │
│  Reference: Rent December          │
│                                     │
│  Leo: "I'll remind you again       │
│        next month. 👍"              │
│                                     │
│           [Done]                    │
└─────────────────────────────────────┘
```

### Learning & Adaptation

#### Positive Signals
- User accepts suggestion → Strengthen pattern
- User sends same amount → Confirm prediction
- User sends on suggested day → Confirm timing

#### Negative Signals
- User dismisses repeatedly → Stop suggesting
- User changes amount often → Offer range
- User sends different day → Adjust timing

#### User Controls
- "Never suggest this payment"
- "Remind me every [X] instead"
- "Don't use smart suggestions" (global off)

### Example Scenarios

#### Scenario 1: Monthly Rent
- Pattern: €800 to "Landlord" on 1st of month
- Trigger: December 1st arrives
- Action: Push notification + in-app card
- After 3 successful months: High confidence suggestion

#### Scenario 2: Weekly Allowance (Parent)
- Pattern: €50 to "Son" every Friday
- Trigger: Friday 6pm (detected usual time)
- Action: "Weekly allowance to Tim?"
- Personalization: "Your son might be waiting! 😊"

#### Scenario 3: Savings Transfer
- Pattern: €200 to Extra-Konto after salary
- Trigger: Salary detected (€2,800 deposit)
- Action: "Move €200 to savings like usual?"
- Smart suggestion: "You have €300 extra this month - save more?"

### Privacy & Control

#### User Controls
- See all learned patterns
- Delete specific patterns
- Pause learning temporarily
- Export pattern data
- Full opt-out option

#### Data Handling
- Patterns stored locally first
- Encrypted sync to ING servers
- No sharing with third parties
- Auto-delete after 2 years of inactivity
```

---
