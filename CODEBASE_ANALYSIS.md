# ING App - Codebase Analysis & Implementation Status

> **Document Purpose**: Comprehensive analysis of the current codebase, implemented features, missing functionality, and action items for completing the LEO AI-powered banking app prototype.

---

## 📊 Executive Summary

| Category | Status |
|----------|--------|
| **Total Screens Implemented** | ~20 screens |
| **Total Screens Missing** | ~8-10 screens |
| **Core Navigation** | ✅ Fully Working |
| **Leo AI Chat** | ⚠️ Partially Working (OpenAI integration exists, but quiz is static) |
| **Junior Profile** | ⚠️ 60% Complete |
| **Adult Profile** | ⚠️ 70% Complete |
| **Quiz System** | ❌ Needs Major Overhaul (static, no AI generation) |
| **Buttons/Actions Status** | ⚠️ Many non-functional |

---

## 🏗️ Project Architecture

### Technology Stack
```
├── Frontend: React + Vite + TypeScript
├── Styling: Tailwind CSS + shadcn/ui
├── State Management: React useState (local state)
├── Routing: wouter (simple router)
├── Charts: Recharts
├── Animations: Framer Motion
├── AI Integration: OpenAI API (via server proxy)
└── Backend: Express.js (minimal, serves static files)
```

### Key Files Structure
```
client/
├── src/
│   ├── App.tsx                    # Root component with router
│   ├── pages/
│   │   └── ing-app.tsx            # Main app container with all navigation logic
│   ├── components/
│   │   ├── ing/
│   │   │   ├── layout.tsx         # Shared layouts (BottomNav, ScreenHeader, etc.)
│   │   │   ├── leo/
│   │   │   │   ├── chat-overlay.tsx    # Leo chat interface
│   │   │   │   └── demo-sidebar.tsx    # Demo scenario selector
│   │   │   └── screens/
│   │   │       ├── dashboard.tsx       # Adult dashboard
│   │   │       ├── invest.tsx          # Adult investment screen
│   │   │       ├── transfer.tsx        # Transfer money screen
│   │   │       ├── service.tsx         # Settings/service menu
│   │   │       ├── products.tsx        # Products/insurance view
│   │   │       ├── orders.tsx          # Orders screen (empty state)
│   │   │       ├── stock-detail.tsx    # Individual stock view
│   │   │       ├── transactions.tsx    # Transaction list
│   │   │       ├── welcome.tsx         # Welcome/login screen
│   │   │       ├── login.tsx           # Login screen
│   │   │       ├── adult/
│   │   │       │   ├── statistics.tsx      # Financial stats
│   │   │       │   └── subscriptions.tsx   # Subscription manager
│   │   │       ├── junior/
│   │   │       │   ├── dashboard.tsx       # Junior gamified dashboard
│   │   │       │   ├── invest.tsx          # Junior virtual portfolio
│   │   │       │   ├── quiz.tsx            # Junior quiz (STATIC)
│   │   │       │   └── leaderboard.tsx     # Weekly leaderboard
│   │   │       ├── settings/
│   │   │       │   ├── account-overview.tsx
│   │   │       │   ├── app-settings.tsx
│   │   │       │   └── personal-data.tsx
│   │   │       ├── setup/
│   │   │       │   ├── index.tsx           # Setup flow orchestrator
│   │   │       │   ├── welcome.tsx
│   │   │       │   ├── identification.tsx
│   │   │       │   ├── id-verification.tsx
│   │   │       │   ├── scanning-flow.tsx
│   │   │       │   ├── login-setup.tsx
│   │   │       │   ├── pin-flow.tsx
│   │   │       │   └── biometrics.tsx
│   │   │       └── cards/
│   │   │           ├── cards-list.tsx
│   │   │           └── card-details.tsx
│   │   └── ui/                    # shadcn/ui components
│   ├── lib/
│   │   ├── demo-scenarios.ts      # Demo conversation scenarios
│   │   ├── openai.ts              # OpenAI API client
│   │   └── utils.ts               # Utility functions
│   └── hooks/
│       └── use-toast.ts           # Toast notifications
└── server/
    ├── index.ts                   # Express server entry
    ├── routes.ts                  # API routes (OpenAI proxy)
    └── vite.ts                    # Vite dev middleware
```

---

## ✅ IMPLEMENTED FEATURES

### 1. Core Navigation & Layout
| Feature | Status | Notes |
|---------|--------|-------|
| Bottom Navigation Bar | ✅ Working | 4 tabs: Dashboard, Invest, Orders, Service |
| Screen Headers | ✅ Working | Back buttons, titles, right actions |
| Mobile Layout Container | ✅ Working | Proper mobile viewport sizing |
| Profile Switcher | ✅ Working | Toggle between Adult/Junior in demo sidebar |

### 2. Adult Profile Screens

#### 2.1 Dashboard (`dashboard.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Account overview | ✅ Working | Shows Girokonto, Extra-Konto, Depot |
| Total balance | ✅ Working | €21,341.58 displayed |
| Quick actions (4 buttons) | ⚠️ Partial | Überweisen→Transfer, Statistik→Stats, Abos→Subscriptions, Mehr→Service |
| Leo FAB button | ✅ Working | Opens chat overlay |
| Settings menu | ✅ Working | Opens AccountOverviewSettings |

#### 2.2 Investment Screen (`invest.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Depot overview card | ✅ Working | Shows portfolio value €12,704.96 |
| Portfolio chart | ✅ Working | Step line chart with time selectors |
| Top actions (Search, Orders, Analyse) | ❌ Not Working | Buttons do nothing |
| AI Investment Advisor card | ⚠️ Visual Only | "Sparplan optimieren" button does nothing |
| Top Movers section | ✅ Visual Only | Displays static data |

#### 2.3 Statistics Screen (`statistics.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Financial Health Score | ✅ Working | Shows 85/100 with ring chart |
| Spending pie chart | ✅ Working | Wohnen, Essen, Transport, Freizeit |
| Income vs Expenses bar chart | ✅ Working | Monthly comparison |
| Leo's Tip | ✅ Visual Only | Static tip about food spending |

#### 2.4 Subscriptions Screen (`subscriptions.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Monthly total | ✅ Working | €61.87 displayed |
| Subscription list | ✅ Working | Netflix, Spotify, Fitness Studio, Amazon |
| AI unused alert | ⚠️ Visual Only | "Jetzt kündigen" button does nothing |
| Cancel functionality | ❌ Not Working | Buttons are visual only |

#### 2.5 Transfer Screen (`transfer.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Recipient input | ✅ Working | Text input fields |
| IBAN input | ✅ Working | Text input with character counter |
| Transfer options | ⚠️ Partial | Templates works, others do nothing |
| Templates list | ✅ Working | Shows saved recipients |
| Photo/file upload | ❌ Not Working | Buttons are non-functional |
| "Weiter" button | ❌ Not Working | Does not proceed to next step |

#### 2.6 Service Screen (`service.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Post-Box | ❌ Not Working | Visual only |
| Karten (Cards) | ❌ Not Working | Visual only |
| Persönliche Daten | ✅ Working | Opens PersonalDataScreen |
| App-Einstellungen | ✅ Working | Opens AppSettingsScreen |
| Konto verwalten | ❌ Not Working | Visual only |
| Login und Sicherheit | ❌ Not Working | Visual only |
| Überweisungsvorlagen | ❌ Not Working | Visual only |
| Fotoüberweisung | ❌ Not Working | Visual only |
| Logout button | ✅ Working | Returns to welcome screen |

### 3. Junior Profile Screens

#### 3.1 Junior Dashboard (`junior/dashboard.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Level & streak display | ✅ Working | Level 5, Finanz-Entdecker |
| Virtual balance card | ✅ Working | €145.50 with XP counter |
| "Investieren" button | ✅ Working | Navigates to junior invest |
| "Sparen" button | ❌ Not Working | Does nothing |
| Quick stats (Rang, Badges, Portfolio) | ⚠️ Partial | Only some navigate correctly |
| Daily Challenge card | ⚠️ Visual | "Quiz starten" navigates to learn |
| Learning Path cards | ⚠️ Partial | First two navigate, third locked |
| Leaderboard preview | ✅ Working | Navigates to leaderboard |

#### 3.2 Junior Investment Screen (`junior/invest.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Portfolio value | ✅ Working | €1,240.50 displayed |
| Chart | ✅ Working | Line chart with animation |
| Holdings list | ✅ Visual Only | Static investment cards |
| Buy/Sell functionality | ❌ Not Working | No trading flow implemented |
| Learning tip | ✅ Working | Educational info box |

#### 3.3 Junior Quiz Screen (`junior/quiz.tsx`) ⚠️ NEEDS MAJOR OVERHAUL
| Element | Status | Notes |
|---------|--------|-------|
| Static questions | ✅ Working | Only 2 hardcoded questions |
| Answer selection | ✅ Working | Correct/incorrect feedback |
| Progress bar | ✅ Working | Animates correctly |
| Results screen | ✅ Working | Shows score and XP earned |
| **AI-Generated Questions** | ❌ NOT IMPLEMENTED | Uses static QUIZ_QUESTIONS array |
| **Image Generation** | ❌ NOT IMPLEMENTED | No images in quiz |
| **Topic Selection** | ❌ NOT IMPLEMENTED | No topic selection UI |
| **Adaptive Difficulty** | ❌ NOT IMPLEMENTED | All questions same difficulty |
| **Multiple Choice from AI** | ❌ NOT IMPLEMENTED | Hardcoded options |

#### 3.4 Junior Leaderboard (`junior/leaderboard.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Weekly prize card | ✅ Working | Shows €25 bonus |
| Tab switching (Weekly/All-time/Schools) | ✅ Working | Switches views |
| User position card | ✅ Working | Shows #42 with progress |
| Top 3 podium | ✅ Working | Animated podium display |
| Leaderboard list | ✅ Working | Shows rankings 4-8 |
| School leaderboard | ✅ Working | Shows school rankings |
| Achievements preview | ⚠️ Visual Only | Shows 8/12 but not clickable |

### 4. Leo AI Chat System

#### 4.1 Chat Overlay (`leo/chat-overlay.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Open/close animation | ✅ Working | Smooth spring animation |
| Message display | ✅ Working | User/Leo messages styled |
| Typing indicator | ✅ Working | Animated dots when Leo thinking |
| Chat/Quiz mode toggle | ⚠️ Visual Only | Does not change behavior |
| Stock Widget | ✅ Working | Shows price, change, buy/watchlist |
| Transfer Widget | ✅ Working | Shows recipient, amount, send button |
| Quiz Widget | ⚠️ Visual Only | "Quiz starten" does nothing |
| Achievement Widget | ✅ Working | Celebration animation |
| Voice button | ❌ Not Working | No voice input/output |
| Camera button | ❌ Not Working | No document scanning |
| Paperclip button | ❌ Not Working | No file attachment |
| Quick suggestions | ✅ Working | Sends message on click |
| Text input | ✅ Working | Sends to OpenAI |
| OpenAI integration | ✅ Working | Real AI responses |

#### 4.2 Demo Sidebar (`leo/demo-sidebar.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Scenario list | ✅ Working | Shows all demo scenarios |
| Trigger scenario | ✅ Working | Loads messages into chat |
| Toast notifications | ✅ Working | Shows notification cards |
| Profile toggle | ✅ Working | Switches Adult/Junior |

### 5. Stock Detail Screen (`stock-detail.tsx`)
| Element | Status | Notes |
|---------|--------|-------|
| Stock header | ✅ Working | Shows ING with logo |
| Price chart | ✅ Working | Interactive line chart |
| Time selectors | ✅ Working | 1T, 1W, 1M, 1J, MAX tabs |
| Key metrics | ✅ Working | Opens/Close, High/Low, Volume |
| Buy/Sell buttons | ❌ Not Working | Buttons do nothing |
| Watchlist button | ❌ Not Working | Button does nothing |
| Leo's insight card | ⚠️ Partial | Click opens chat but no context |
| News section | ✅ Visual Only | Static news articles |

### 6. Setup Flow (`setup/`)
| Screen | Status | Notes |
|--------|--------|-------|
| Welcome | ✅ Working | Intro screen |
| Identification | ✅ Working | Method selection |
| ID Verification | ✅ Working | Upload ID card |
| Scanning Flow | ✅ Working | Simulated scan animation |
| Login Setup | ✅ Working | Username/password entry |
| PIN Flow | ✅ Working | 5-digit PIN entry |
| Biometrics | ✅ Working | Face ID/Fingerprint setup |

---

## ❌ MISSING FEATURES (To Implement)

### HIGH PRIORITY - Quiz System Overhaul

#### 1. AI-Generated Quiz Questions
**Current State**: Static array with 2 hardcoded questions
**Required Features**:
- [ ] Generate questions dynamically based on topic
- [ ] Generate questions based on current screen context (e.g., stock page → stock quiz)
- [ ] Support multiple topics (Investments, Taxes, Insurance, Budgeting)
- [ ] Adaptive difficulty based on user performance
- [ ] Store quiz history for personalization

#### 2. Quiz with Images
**Current State**: No images in quiz
**Required Features**:
- [ ] Generate scenario images using AI (cheap/fast model like DALL-E Mini or Stable Diffusion)
- [ ] Display images within question cards
- [ ] Support chart/graph visualizations in questions
- [ ] Cache generated images for reuse

#### 3. Quiz from Leo Chat
**Current State**: Quiz widget in chat is visual only
**Required Features**:
- [ ] "Quiz starten" button in QuizWidget should start actual quiz
- [ ] Inline quiz questions in chat flow
- [ ] A/B/C/D selection within chat messages
- [ ] Real-time feedback in chat
- [ ] XP awards shown in chat

### MEDIUM PRIORITY - Non-Functional Buttons

#### Dashboard Buttons
- [ ] **Adult Dashboard**: "Mehr" should show more options, not just service
- [ ] **Quick Stats**: All 3 boxes should navigate correctly

#### Investment Screen Buttons
- [ ] **Search button**: Open stock search
- [ ] **Orders button**: Navigate to orders
- [ ] **Analyse button**: Show portfolio analysis
- [ ] **"Sparplan optimieren"**: Open savings plan dialog
- [ ] **Stock row clicks**: Navigate to stock-detail with correct symbol

#### Junior Dashboard Buttons
- [ ] **"Sparen" button**: Open savings goal screen
- [ ] **"Badges" button**: Open achievements gallery
- [ ] **Locked learning items**: Show "Coming soon" or unlock mechanism

#### Transfer Screen
- [ ] **"Weiter" button**: Proceed to amount entry step
- [ ] **Camera button**: Open document scanner
- [ ] **File upload button**: Open file picker

#### Service Screen
- [ ] **Post-Box**: Open document inbox
- [ ] **Karten (Cards)**: Navigate to cards screen
- [ ] **Konto verwalten**: Open account management
- [ ] **Login und Sicherheit**: Open security settings
- [ ] **Überweisungsvorlagen**: Open templates
- [ ] **Fotoüberweisung**: Open photo transfer
- [ ] **Freistellungsauftrag**: Open tax exemption
- [ ] **Hilfe**: Open help center
- [ ] **Feedback**: Open feedback form

#### Stock Detail Screen
- [ ] **Kaufen (Buy)**: Open buy order flow
- [ ] **Verkaufen (Sell)**: Open sell order flow
- [ ] **Watchlist**: Add to/remove from watchlist
- [ ] **News articles**: Open article in browser

#### Subscription Screen
- [ ] **"Jetzt kündigen"**: Cancel subscription flow
- [ ] **Subscription rows**: Open subscription detail

### LOW PRIORITY - Missing Screens

1. [ ] **Savings Goal Screen** - Set and track savings targets
2. [ ] **Achievements Gallery** - View all unlocked/locked badges
3. [ ] **Stock Search** - Search and filter stocks
4. [ ] **Buy/Sell Order Flow** - Complete trading flow
5. [ ] **Document Scanner** - Camera-based document analysis
6. [ ] **Voice Mode** - Voice input/output for Leo
7. [ ] **Parent Dashboard** (Junior) - Parent oversight features
8. [ ] **Onboarding Personalization** - Goal setting, risk profile

---

## 🔧 TECHNICAL DEBT

### 1. State Management
- Currently using local React state everywhere
- Consider Zustand or Redux for:
  - User profile (adult/junior)
  - Quiz state/history
  - Chat messages
  - Notification preferences

### 2. API Integration
- OpenAI calls work but error handling is minimal
- Need image generation API integration
- Consider caching AI responses

### 3. Type Safety
- Some `any` types used in widget data
- ChatMessage type could be more specific
- Navigation types could be stricter

### 4. Testing
- No tests currently
- Need unit tests for quiz logic
- Need E2E tests for critical flows

---

## 🎯 RECOMMENDED ACTION PLAN

### Phase 1: Quiz System Overhaul (Highest Priority)
1. Create quiz generation service using OpenAI
2. Add topic selection UI
3. Integrate image generation for scenarios
4. Connect quiz mode in chat to actual quiz
5. Add XP/points tracking

### Phase 2: Fix Non-Functional Buttons
1. Map all buttons to appropriate navigation/actions
2. Implement missing navigation handlers
3. Add placeholder screens where needed

### Phase 3: Complete Missing Features
1. Implement buy/sell order flow
2. Add stock search functionality
3. Create savings goal screen
4. Build achievements gallery

### Phase 4: Polish & Enhancement
1. Add voice mode
2. Implement document scanner
3. Add parent dashboard
4. Complete onboarding personalization

---

## 📝 BUTTON INVENTORY (Comprehensive List)

### Buttons That Work ✅
| Screen | Button | Action |
|--------|--------|--------|
| Welcome | "Ich bin Kunde" | Navigate to login |
| Welcome | "Ich bin Kunde (NEU)" | Start setup flow |
| Login | "Anmelden" | Navigate to dashboard |
| Dashboard | "Überweisen" | Navigate to transfer |
| Dashboard | "Statistik" | Navigate to statistics |
| Dashboard | "Abos" | Navigate to subscriptions |
| Dashboard | "Mehr" | Navigate to service |
| Dashboard | Account rows | Navigate to transactions |
| Dashboard | Depot row | Navigate to invest |
| Dashboard | Settings icon | Open account overview settings |
| Service | "Persönliche Daten" | Open personal data |
| Service | "App-Einstellungen" | Open app settings |
| Service | Logout | Return to welcome |
| Junior Dashboard | "Investieren" | Navigate to junior invest |
| Junior Dashboard | Leaderboard preview | Navigate to leaderboard |
| Junior Dashboard | Learning cards (1,2) | Navigate to quiz |
| Junior Dashboard | Quick stats (partial) | Navigate appropriately |
| Leaderboard | Tab buttons | Switch tabs |
| Leo Chat | Quick suggestions | Send message |
| Leo Chat | Send button | Send message |
| Leo Chat | Close button | Close chat |
| Transfer | Templates option | Show templates |
| Transfer | Back button | Return to dashboard |

### Buttons That Don't Work ❌
| Screen | Button | Needed Action |
|--------|--------|---------------|
| Welcome | "Girokonto eröffnen" | Could open info/setup |
| Dashboard | Search icon | Open search |
| Invest | Search button | Open stock search |
| Invest | Orders button | Navigate to orders |
| Invest | Analyse button | Open analysis |
| Invest | "Sparplan optimieren" | Open savings plan |
| Invest | Stock rows | Navigate to stock detail |
| Statistics | Leo tip | Open chat with context |
| Subscriptions | "Jetzt kündigen" | Cancel subscription |
| Subscriptions | Subscription rows | Open detail |
| Transfer | "Weiter" | Proceed to amount step |
| Transfer | Camera option | Open camera |
| Transfer | File upload option | Open file picker |
| Transfer | "An eigenes Konto" | Pre-fill own account |
| Service | Post-Box | Open inbox |
| Service | Karten | Open cards |
| Service | Konto verwalten | Open management |
| Service | Login und Sicherheit | Open security |
| Service | Überweisungsvorlagen | Open templates |
| Service | Fotoüberweisung | Open photo transfer |
| Service | Freistellungsauftrag | Open tax form |
| Service | Hilfe | Open help |
| Service | Feedback | Open feedback |
| Service | Rechtliches | Open legal |
| Junior Dashboard | "Sparen" | Open savings goals |
| Junior Dashboard | Portfolio stat | Navigate correctly |
| Junior Dashboard | Badges stat | Open achievements |
| Junior Dashboard | Locked learning card | Show unlock info |
| Junior Invest | Holdings | Open stock detail |
| Leaderboard | Achievements row | Open gallery |
| Stock Detail | "Kaufen" | Open buy flow |
| Stock Detail | "Verkaufen" | Open sell flow |
| Stock Detail | Watchlist toggle | Toggle watchlist |
| Stock Detail | News items | Open article |
| Leo Chat | Camera button | Open scanner |
| Leo Chat | Paperclip button | Open file picker |
| Leo Chat | Mic button | Start voice input |
| Leo Chat | Volume button | Play audio |
| Leo Chat | Quiz mode toggle | Change to quiz mode |
| Quiz Widget | "Quiz starten" | Start actual quiz |
| Stock Widget | "Kaufen" | Open buy flow |
| Stock Widget | "Watchlist" | Add to watchlist |
| Transfer Widget | "Jetzt senden" | Complete transfer |

---

## 📋 FILES TO MODIFY FOR QUIZ ENHANCEMENT

### 1. New Files Needed
```
client/src/lib/quiz-generator.ts          # AI quiz generation logic
client/src/lib/image-generator.ts         # AI image generation
client/src/components/ing/screens/junior/enhanced-quiz.tsx  # New quiz component
client/src/hooks/use-quiz.ts              # Quiz state management
```

### 2. Files to Modify
```
client/src/pages/ing-app.tsx              # Add quiz state handling
client/src/components/ing/leo/chat-overlay.tsx  # Connect quiz widget
client/src/lib/demo-scenarios.ts          # Update quiz scenarios
server/routes.ts                          # Add image generation endpoint
```

---

*Document generated: November 28, 2025*
*Last updated: November 28, 2025*
