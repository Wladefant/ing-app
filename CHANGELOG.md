# Changelog - ING LEO AI Banking App

All notable changes to this project will be documented in this file.

## [2.1.1] - 2025-11-29

### 🐛 Bug Fixes

#### Investment Screen Fixes
- **TabButton Component**: Added missing TabButton component definition to invest.tsx
- **Leo Chat Access**: Added onLeoClick prop to InvestScreen for Leo chat functionality
- **BottomNav Integration**: Properly pass onLeoClick to BottomNav in InvestScreen

#### Stock Detail Enhancements
- **Dynamic Navigation**: StockDetailScreen now reads selectedStock from localStorage
- **More Stocks**: Added data for MSFT, VUSA, NVDA, META, AMZN in stock-detail.tsx

---

## [2.1.0] - 2025-11-29

### 🚀 New Features

#### Investment Screen Enhancement
- **Tab Navigation**: Portfolio, Watchlist, News tabs
- **Holdings List**: See all positions with P/L calculation
- **Watchlist Management**: Add/remove stocks to track
- **Market News**: AI-generated news summaries with sentiment indicators
- **Top Movers**: Quick view of biggest price changes

#### Transaction Persistence
- **Storage Service**: New `lib/storage.ts` with localStorage backend
- **Transfer Persistence**: All transfers saved automatically
- **Transaction History**: Dynamic list from stored data
- **Balance Updates**: Account balances update on transactions

#### Junior Navigation Fix
- **Bottom Bar**: Added to all Junior screens (Invest, Quiz, Leaderboard, Savings)
- **Leo Button**: Central lion button accessible everywhere
- **Consistent UX**: Same navigation experience across all screens

#### AI Demo Center Improvements
- **3 New Scenarios**: Smart Transfer, Investment Walkthrough, Savings Challenge
- **Multi-Step Flows**: Conversational interactions with context
- **22 Total Scenarios**: Comprehensive demo coverage

#### Leo Logo
- **SVG Logo**: New custom lion logo at `/leo-logo.svg`
- **Animated**: Bouncing animation in chat mode

---

## [2.0.0] - 2025-11-29

### 🚀 Major Features

#### AI Agent System (Leo)
- **Full Function Calling**: Leo can now execute 10+ different actions
  - `show_stock_widget` - Display stock prices with charts
  - `show_transfer_widget` - Pre-filled transfer forms
  - `start_quiz` - Interactive quizzes on any topic
  - `show_achievement` - Display badges and rewards
  - `show_savings_goal` - Track savings progress
  - `show_spending_chart` - Visualize spending
  - `navigate_to_screen` - Navigate to any screen
  - `get_portfolio_data` - Access investment portfolio
  - `get_account_balance` - Retrieve account balances
  - `get_recent_transactions` - Show transaction history
- **Context Awareness**: Leo knows user's accounts, transactions, and portfolio
- **Markdown Rendering**: Proper formatting in chat (bold, lists, etc.)
- **Voice Input**: Speech-to-text using Web Speech API

#### Interactive Quiz System
- **Multiple Choice Interface**: A, B, C, D answer buttons
- **Instant Feedback**: Green checkmark for correct, red X for wrong
- **Explanations**: Learn why the answer is correct/incorrect
- **Progress Tracking**: Question counter, score, XP earned
- **Topic Categories**: ETFs, Aktien, Sparen, Steuern, Zinsen
- **Adaptive Difficulty**: Easy (3 questions), Medium (4), Hard (5)

#### Investment Interface (Adult)
- **Full Portfolio View**: Holdings list with P/L
- **Watchlist**: Track favorite stocks
- **Stock Detail**: Price chart, metrics, buy/sell
- **Stock Search**: Find and add new stocks
- **Market News**: AI-summarized news feed

#### Transfer System
- **4-Step Flow**: Recipient → Amount → Reference → Confirm
- **Saved Transfers**: Persistent storage of all transfers
- **Transaction History**: View all past transactions
- **Smart Suggestions**: AI-powered recurring payment reminders

#### Navigation Improvements
- **Screen Navigation**: Leo can navigate to any screen on command
- **Adult Nav**: Konten, Investieren, Leo, Produkte, Profil
- **Junior Nav**: Always visible bottom bar

### 🎨 UI/UX Improvements

#### Leo Chat Overlay
- **Leo Logo**: Custom orange lion icon
- **Smooth Animations**: Framer Motion transitions
- **Widget Cards**: Stock, Transfer, Quiz, Achievement widgets
- **Typing Indicator**: Animated dots while Leo thinks
- **Voice Mode**: Visual feedback when listening

#### AI Demo Center
- **Multi-Step Scenarios**: Simulate full user journeys
- **13 Demo Scenarios**: Rent Alert, Spending Insight, Document Scan, etc.
- **Progress Tracking**: See which scenarios completed
- **Junior/Adult Toggle**: Switch between profiles

### 🐛 Bug Fixes
- Fixed Markdown rendering (asterisks now show as bold)
- Fixed Quiz not starting when clicking "Quiz starten"
- Fixed Transfer flow not completing
- Fixed Subscription cancel button not working
- Fixed Stock buy/sell buttons not responding

### 📦 Dependencies Added
- `react-markdown` - Markdown rendering in chat
- `dotenv` - Environment variable management

### 🔧 Technical Changes
- OpenAI function calling with `gpt-4o-mini`
- Server-side tool execution for AI actions
- Mock user data for realistic demo
- Enhanced error handling

---

## [1.0.0] - Initial Release

### Features
- Basic ING banking interface
- Junior and Adult profiles
- Dashboard with account overview
- Basic Leo chat (text only)
- Static screens

---

## Upcoming Features (Roadmap)

### v2.1.0
- [ ] Document scanning with AI analysis
- [ ] Leo voice output (text-to-speech)
- [ ] Parent dashboard for Junior accounts
- [ ] School leaderboard system

### v2.2.0
- [ ] Bill negotiation assistant
- [ ] Investment decision explainer
- [ ] Financial goal collaboration
- [ ] Leo offline mode

### v3.0.0
- [ ] Real banking API integration
- [ ] Biometric authentication
- [ ] Push notifications
- [ ] Multi-language support
