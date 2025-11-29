/**
 * Local Storage Service for ING App
 * Provides persistent storage for transactions, savings, and user preferences
 */

// Transaction Types
export interface Transaction {
  id: string;
  type: "transfer" | "payment" | "income" | "investment" | "savings";
  amount: number;
  currency: string;
  from: string;
  to: string;
  reference: string;
  date: string;
  status: "pending" | "completed" | "failed";
  category?: string;
}

// Investment Order Types
export interface InvestmentOrder {
  id: string;
  type: "buy" | "sell";
  symbol: string;
  name: string;
  shares: number;
  price: number;
  total: number;
  date: string;
  status: "pending" | "executed" | "cancelled";
}

// Savings Goal Types
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt?: string;
  targetDate?: string;
  dueDate?: string;
  icon?: string;
  category?: string;
  weeklyContribution?: number;
}

// Portfolio Holding
export interface Holding {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

// Junior Profile Data
export interface JuniorProfile {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  rank: number;
  school: string;
  totalQuizCorrect: number;
  totalQuizPlayed: number;
  weeklyXp: number;
  monthlyXp: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: "quiz" | "savings" | "invest" | "streak" | "social";
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  school: string;
  level: number;
  isCurrentUser?: boolean;
}

export interface JuniorSavingsGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  weeklyTarget: number;
  createdAt: string;
  contributions: { amount: number; date: string }[];
}

export interface JuniorPortfolio {
  totalValue: number;
  totalInvested: number;
  holdings: JuniorHolding[];
  trades: JuniorTrade[];
}

export interface JuniorHolding {
  id: string;
  name: string;
  icon: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
}

export interface JuniorTrade {
  id: string;
  type: "buy" | "sell";
  holdingId: string;
  holdingName: string;
  shares: number;
  price: number;
  date: string;
}

// Storage Keys
const STORAGE_KEYS = {
  TRANSACTIONS: "ing_transactions",
  INVESTMENT_ORDERS: "ing_investment_orders",
  SAVINGS_GOALS: "ing_savings_goals",
  PORTFOLIO: "ing_portfolio",
  WATCHLIST: "ing_watchlist",
  BALANCE: "ing_balance",
  // Junior specific
  JUNIOR_PROFILE: "ing_junior_profile",
  JUNIOR_SAVINGS: "ing_junior_savings",
  JUNIOR_PORTFOLIO: "ing_junior_portfolio",
  LEADERBOARD: "ing_leaderboard",
  SPENDING_CATEGORIES: "ing_spending_categories",
  RECURRING_PAYMENTS: "ing_recurring_payments",
};

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
}

// ============ TRANSACTIONS ============

export function getTransactions(): Transaction[] {
  return getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, getDefaultTransactions());
}

export function addTransaction(transaction: Omit<Transaction, "id">): Transaction {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
  };
  setToStorage(STORAGE_KEYS.TRANSACTIONS, [newTransaction, ...transactions]);
  return newTransaction;
}

export function updateTransaction(id: string, updates: Partial<Transaction>): void {
  const transactions = getTransactions();
  const updated = transactions.map((t) => (t.id === id ? { ...t, ...updates } : t));
  setToStorage(STORAGE_KEYS.TRANSACTIONS, updated);
}

// Default transactions for demo
function getDefaultTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();
  let idCounter = 1;
  
  // Helper to create a transaction
  const createTx = (
    daysAgo: number, 
    type: Transaction["type"], 
    amount: number, 
    from: string, 
    to: string, 
    reference: string, 
    category: string
  ): Transaction => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return {
      id: `tx-${idCounter++}`,
      type,
      amount,
      currency: "EUR",
      from,
      to,
      reference,
      date: formatDate(date),
      status: "completed",
      category,
    };
  };
  
  // Generate 12 months of data
  for (let month = 0; month < 12; month++) {
    const daysOffset = month * 30;
    
    // Monthly salary (around 1st-5th of each month)
    const salaryDay = daysOffset + Math.floor(Math.random() * 5) + 1;
    const salaryAmount = 2850 + Math.floor(Math.random() * 200) - 100; // 2750-2950
    transactions.push(createTx(salaryDay, "income", salaryAmount, "Arbeitgeber GmbH", "Girokonto", `Gehalt ${new Date(today.getTime() - daysOffset * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}`, "Gehalt"));
    
    // Rent (around 1st-3rd of each month)
    const rentDay = daysOffset + Math.floor(Math.random() * 3) + 1;
    transactions.push(createTx(rentDay, "payment", -850, "Girokonto", "Hausverwaltung Schmidt", "Miete + NK", "Miete"));
    
    // Electricity/Gas (quarterly, every 3rd month)
    if (month % 3 === 0) {
      transactions.push(createTx(daysOffset + 10, "payment", -95 - Math.floor(Math.random() * 30), "Girokonto", "Stadtwerke München", "Strom/Gas Abschlag", "Haushalt"));
    }
    
    // Internet/Phone (monthly)
    transactions.push(createTx(daysOffset + 15, "payment", -49.99, "Girokonto", "Telekom Deutschland", "Mobilfunk + Internet", "Haushalt"));
    
    // Streaming subscriptions
    transactions.push(createTx(daysOffset + 5, "payment", -12.99, "Girokonto", "Netflix", "Streaming Abo", "Entertainment"));
    transactions.push(createTx(daysOffset + 8, "payment", -9.99, "Girokonto", "Spotify", "Premium Abo", "Entertainment"));
    
    // Insurance (monthly)
    transactions.push(createTx(daysOffset + 1, "payment", -89.50, "Girokonto", "Allianz Versicherung", "Haftpflicht + Hausrat", "Versicherung"));
    
    // Gym membership
    transactions.push(createTx(daysOffset + 1, "payment", -29.90, "Girokonto", "FitX Studio", "Mitgliedschaft", "Gesundheit"));
    
    // Monthly savings transfer
    transactions.push(createTx(daysOffset + 5, "savings", -200, "Girokonto", "Extra-Konto", "Monatliches Sparen", "Sparen"));
    
    // Weekly grocery shopping (4 times per month)
    for (let week = 0; week < 4; week++) {
      const groceryDay = daysOffset + (week * 7) + Math.floor(Math.random() * 3);
      const groceryAmount = -45 - Math.floor(Math.random() * 40); // 45-85€
      const stores = ["REWE", "EDEKA", "Aldi Süd", "Lidl", "dm Drogerie"];
      const store = stores[Math.floor(Math.random() * stores.length)];
      transactions.push(createTx(groceryDay, "payment", groceryAmount, "Girokonto", store, "Einkauf Lebensmittel", "Lebensmittel"));
    }
    
    // Restaurant visits (2-4 times per month)
    const restaurantVisits = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < restaurantVisits; i++) {
      const restDay = daysOffset + Math.floor(Math.random() * 28);
      const restAmount = -18 - Math.floor(Math.random() * 35); // 18-53€
      const restaurants = ["Vapiano", "L'Osteria", "Hans im Glück", "Block House", "Sushi Circle", "Pizza Hut"];
      const rest = restaurants[Math.floor(Math.random() * restaurants.length)];
      transactions.push(createTx(restDay, "payment", restAmount, "Girokonto", rest, "Restaurant", "Restaurant"));
    }
    
    // Coffee shops (4-8 times per month)
    const coffeeVisits = 4 + Math.floor(Math.random() * 5);
    for (let i = 0; i < coffeeVisits; i++) {
      const coffeeDay = daysOffset + Math.floor(Math.random() * 28);
      const coffeeAmount = -3.5 - Math.floor(Math.random() * 6); // 3.50-9.50€
      const shops = ["Starbucks", "Café Extrablatt", "Balzac Coffee", "Einstein Kaffee"];
      const shop = shops[Math.floor(Math.random() * shops.length)];
      transactions.push(createTx(coffeeDay, "payment", coffeeAmount, "Girokonto", shop, "Kaffee & Snack", "Restaurant"));
    }
    
    // Transport - fuel/public transport (3-5 times per month)
    const transportTimes = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < transportTimes; i++) {
      const transDay = daysOffset + Math.floor(Math.random() * 28);
      const isFuel = Math.random() > 0.5;
      if (isFuel) {
        const fuelAmount = -45 - Math.floor(Math.random() * 35); // 45-80€
        const stations = ["Shell", "Aral", "Total", "Esso", "Jet"];
        const station = stations[Math.floor(Math.random() * stations.length)];
        transactions.push(createTx(transDay, "payment", fuelAmount, "Girokonto", station, "Tankfüllung", "Transport"));
      } else {
        transactions.push(createTx(transDay, "payment", -2.90, "Girokonto", "MVV München", "Einzelfahrt", "Transport"));
      }
    }
    
    // Shopping (1-3 times per month)
    const shoppingTimes = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < shoppingTimes; i++) {
      const shopDay = daysOffset + Math.floor(Math.random() * 28);
      const shopAmount = -25 - Math.floor(Math.random() * 75); // 25-100€
      const shops = ["Amazon", "Zalando", "MediaMarkt", "H&M", "Zara", "IKEA", "Saturn"];
      const shop = shops[Math.floor(Math.random() * shops.length)];
      transactions.push(createTx(shopDay, "payment", shopAmount, "Girokonto", shop, "Online-Bestellung", "Shopping"));
    }
    
    // ATM withdrawals (1-2 times per month)
    const atmTimes = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < atmTimes; i++) {
      const atmDay = daysOffset + Math.floor(Math.random() * 28);
      const atmAmount = -50 * (1 + Math.floor(Math.random() * 4)); // 50, 100, 150, or 200€
      transactions.push(createTx(atmDay, "payment", atmAmount, "Girokonto", "Geldautomat", "Bargeldabhebung", "Bargeld"));
    }
    
    // Entertainment (cinema, concerts, etc.) - 1-2 times per month
    if (Math.random() > 0.3) {
      const entDay = daysOffset + Math.floor(Math.random() * 28);
      const entAmount = -12 - Math.floor(Math.random() * 50); // 12-62€
      const venues = ["CinemaxX", "UCI Kino", "Eventim", "Ticketmaster"];
      const venue = venues[Math.floor(Math.random() * venues.length)];
      transactions.push(createTx(entDay, "payment", entAmount, "Girokonto", venue, "Tickets/Events", "Entertainment"));
    }
    
    // Medical expenses (occasionally)
    if (Math.random() > 0.7) {
      const medDay = daysOffset + Math.floor(Math.random() * 28);
      const medAmount = -15 - Math.floor(Math.random() * 40); // 15-55€
      const places = ["Apotheke", "Arztpraxis", "Optiker"];
      const place = places[Math.floor(Math.random() * places.length)];
      transactions.push(createTx(medDay, "payment", medAmount, "Girokonto", place, "Gesundheit", "Gesundheit"));
    }
    
    // Random bonus income (occasionally)
    if (Math.random() > 0.85 && month > 0) {
      const bonusDay = daysOffset + Math.floor(Math.random() * 28);
      const bonusAmount = 50 + Math.floor(Math.random() * 200); // 50-250€
      transactions.push(createTx(bonusDay, "income", bonusAmount, "Rückerstattung/Bonus", "Girokonto", "Rückerstattung", "Sonstiges"));
    }
    
    // Investment purchase (monthly)
    if (month > 0 && month % 2 === 0) {
      const investDay = daysOffset + 15;
      const investAmount = -100 - Math.floor(Math.random() * 150); // 100-250€
      transactions.push(createTx(investDay, "investment", investAmount, "Girokonto", "Direkt-Depot", "ETF Sparplan", "Investment"));
    }
  }
  
  // Sort by date (most recent first)
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return transactions;
}

// ============ INVESTMENT ORDERS ============

export function getInvestmentOrders(): InvestmentOrder[] {
  return getFromStorage<InvestmentOrder[]>(STORAGE_KEYS.INVESTMENT_ORDERS, getDefaultOrders());
}

export function addInvestmentOrder(order: Omit<InvestmentOrder, "id">): InvestmentOrder {
  const orders = getInvestmentOrders();
  const newOrder: InvestmentOrder = {
    ...order,
    id: generateId(),
  };
  setToStorage(STORAGE_KEYS.INVESTMENT_ORDERS, [newOrder, ...orders]);
  return newOrder;
}

export function updateInvestmentOrder(id: string, updates: Partial<InvestmentOrder>): void {
  const orders = getInvestmentOrders();
  const updated = orders.map((o) => (o.id === id ? { ...o, ...updates } : o));
  setToStorage(STORAGE_KEYS.INVESTMENT_ORDERS, updated);
}

function getDefaultOrders(): InvestmentOrder[] {
  return [
    {
      id: "order-1",
      type: "buy",
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 5,
      price: 175.50,
      total: 877.50,
      date: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
      status: "executed",
    },
    {
      id: "order-2",
      type: "buy",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      shares: 3,
      price: 370.00,
      total: 1110.00,
      date: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
      status: "executed",
    },
  ];
}

// ============ SAVINGS GOALS ============

export function getSavingsGoals(): SavingsGoal[] {
  return getFromStorage<SavingsGoal[]>(STORAGE_KEYS.SAVINGS_GOALS, getDefaultSavingsGoals());
}

export function addSavingsGoal(goal: Omit<SavingsGoal, "id" | "createdAt">): SavingsGoal {
  const goals = getSavingsGoals();
  const newGoal: SavingsGoal = {
    ...goal,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  setToStorage(STORAGE_KEYS.SAVINGS_GOALS, [...goals, newGoal]);
  return newGoal;
}

export function updateSavingsGoal(id: string, updates: Partial<SavingsGoal>): void {
  const goals = getSavingsGoals();
  const updated = goals.map((g) => (g.id === id ? { ...g, ...updates } : g));
  setToStorage(STORAGE_KEYS.SAVINGS_GOALS, updated);
}

export function addToSavingsGoal(id: string, amount: number): void {
  const goals = getSavingsGoals();
  const updated = goals.map((g) =>
    g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
  );
  setToStorage(STORAGE_KEYS.SAVINGS_GOALS, updated);
}

function getDefaultSavingsGoals(): SavingsGoal[] {
  return [
    {
      id: "goal-1",
      name: "Urlaub 2025",
      targetAmount: 2000,
      currentAmount: 850,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      targetDate: "2025-07-01",
      icon: "✈️",
    },
    {
      id: "goal-2",
      name: "Neues Fahrrad",
      targetAmount: 500,
      currentAmount: 320,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      icon: "🚴",
    },
  ];
}

// ============ PORTFOLIO ============

export function getPortfolio(): Holding[] {
  return getFromStorage<Holding[]>(STORAGE_KEYS.PORTFOLIO, getDefaultPortfolio());
}

export function updatePortfolio(holdings: Holding[]): void {
  setToStorage(STORAGE_KEYS.PORTFOLIO, holdings);
}

export function addToPortfolio(holding: Holding): void {
  const portfolio = getPortfolio();
  const existingIndex = portfolio.findIndex((h) => h.symbol === holding.symbol);

  if (existingIndex >= 0) {
    // Update existing holding
    const existing = portfolio[existingIndex];
    const totalShares = existing.shares + holding.shares;
    const newAvgPrice =
      (existing.shares * existing.avgPrice + holding.shares * holding.avgPrice) / totalShares;
    portfolio[existingIndex] = {
      ...existing,
      shares: totalShares,
      avgPrice: newAvgPrice,
      currentPrice: holding.currentPrice,
    };
  } else {
    portfolio.push(holding);
  }

  setToStorage(STORAGE_KEYS.PORTFOLIO, portfolio);
}

export function removeFromPortfolio(symbol: string, shares: number): void {
  const portfolio = getPortfolio();
  const updated = portfolio
    .map((h) => {
      if (h.symbol === symbol) {
        const newShares = h.shares - shares;
        if (newShares <= 0) return null;
        return { ...h, shares: newShares };
      }
      return h;
    })
    .filter(Boolean) as Holding[];
  setToStorage(STORAGE_KEYS.PORTFOLIO, updated);
}

function getDefaultPortfolio(): Holding[] {
  return [
    { symbol: "AAPL", name: "Apple Inc.", shares: 15, avgPrice: 145.2, currentPrice: 178.5 },
    { symbol: "MSFT", name: "Microsoft Corp.", shares: 10, avgPrice: 320.0, currentPrice: 378.9 },
    { symbol: "ING", name: "ING Groep N.V.", shares: 200, avgPrice: 11.2, currentPrice: 12.45 },
    { symbol: "VUSA", name: "Vanguard S&P 500", shares: 25, avgPrice: 72.5, currentPrice: 149.94 },
  ];
}

// ============ WATCHLIST ============

export function getWatchlist(): string[] {
  return getFromStorage<string[]>(STORAGE_KEYS.WATCHLIST, ["TSLA", "NVDA", "AMZN", "META"]);
}

export function addToWatchlist(symbol: string): void {
  const watchlist = getWatchlist();
  if (!watchlist.includes(symbol)) {
    setToStorage(STORAGE_KEYS.WATCHLIST, [...watchlist, symbol]);
  }
}

export function removeFromWatchlist(symbol: string): void {
  const watchlist = getWatchlist();
  setToStorage(
    STORAGE_KEYS.WATCHLIST,
    watchlist.filter((s) => s !== symbol)
  );
}

// ============ BALANCE ============

interface AccountBalance {
  girokonto: number;
  extraKonto: number;
  depot: number;
}

export function getBalance(): AccountBalance {
  return getFromStorage<AccountBalance>(STORAGE_KEYS.BALANCE, {
    girokonto: 2101.1,
    extraKonto: 5420.0,
    depot: 12704.96,
  });
}

export function updateBalance(account: keyof AccountBalance, amount: number): void {
  const balance = getBalance();
  balance[account] += amount;
  setToStorage(STORAGE_KEYS.BALANCE, balance);
}

export function setBalance(balance: AccountBalance): void {
  setToStorage(STORAGE_KEYS.BALANCE, balance);
}

// ============ HELPERS ============

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Clear all stored data (for testing)
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// ============ JUNIOR PROFILE ============

export function getJuniorProfile(): JuniorProfile {
  return getFromStorage<JuniorProfile>(STORAGE_KEYS.JUNIOR_PROFILE, getDefaultJuniorProfile());
}

export function updateJuniorProfile(updates: Partial<JuniorProfile>): JuniorProfile {
  const profile = getJuniorProfile();
  const updated = { ...profile, ...updates };
  setToStorage(STORAGE_KEYS.JUNIOR_PROFILE, updated);
  return updated;
}

export function addXP(amount: number): { levelUp: boolean; newLevel: number; profile: JuniorProfile } {
  const profile = getJuniorProfile();
  let newXp = profile.xp + amount;
  let newLevel = profile.level;
  let levelUp = false;
  let xpToNext = profile.xpToNextLevel;

  // Check for level up
  while (newXp >= xpToNext) {
    newXp -= xpToNext;
    newLevel++;
    levelUp = true;
    xpToNext = calculateXpToNextLevel(newLevel);
  }

  const updated = updateJuniorProfile({
    xp: newXp,
    level: newLevel,
    xpToNextLevel: xpToNext,
    weeklyXp: profile.weeklyXp + amount,
    monthlyXp: profile.monthlyXp + amount,
  });

  return { levelUp, newLevel, profile: updated };
}

// Alias for addXP
export const addXpToProfile = (amount: number) => addXP(amount);

function calculateXpToNextLevel(level: number): number {
  // XP required increases by 100 each level
  return 500 + (level - 1) * 100;
}

export function updateStreak(): { streakIncreased: boolean; newStreak: number } {
  const profile = getJuniorProfile();
  const today = new Date().toISOString().split("T")[0];
  const lastActive = profile.lastActiveDate;
  
  let newStreak = profile.streak;
  let streakIncreased = false;

  if (lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastActive === yesterdayStr) {
      newStreak++;
      streakIncreased = true;
    } else if (lastActive !== today) {
      newStreak = 1; // Reset streak
    }

    updateJuniorProfile({ streak: newStreak, lastActiveDate: today });
  }

  return { streakIncreased, newStreak };
}

export function addQuizResult(correct: number, total: number): void {
  const profile = getJuniorProfile();
  updateJuniorProfile({
    totalQuizCorrect: profile.totalQuizCorrect + correct,
    totalQuizPlayed: profile.totalQuizPlayed + total,
  });
}

export function unlockAchievement(achievement: Achievement): boolean {
  const profile = getJuniorProfile();
  if (profile.badges.includes(achievement.id)) return false;
  
  updateJuniorProfile({
    badges: [...profile.badges, achievement.id],
    achievements: [...profile.achievements, achievement],
  });
  return true;
}

function getDefaultJuniorProfile(): JuniorProfile {
  return {
    name: "Max Junior",
    avatar: "🦁",
    level: 5,
    xp: 240,
    xpToNextLevel: 900,
    streak: 12,
    lastActiveDate: new Date().toISOString().split("T")[0],
    badges: ["first_quiz", "saver_bronze", "investor_start", "streak_week", "quiz_master", "learning_3", "daily_1", "social_1"],
    rank: 42,
    school: "Gymnasium Berlin",
    totalQuizCorrect: 67,
    totalQuizPlayed: 85,
    weeklyXp: 340,
    monthlyXp: 1240,
    achievements: [
      { id: "first_quiz", name: "Erste Schritte", description: "Erstes Quiz abgeschlossen", icon: "🎓", earnedAt: "2025-10-01", category: "quiz" },
      { id: "saver_bronze", name: "Sparfuchs", description: "Erstes Sparziel erreicht", icon: "📚", earnedAt: "2025-10-15", category: "savings" },
      { id: "investor_start", name: "Mini-Investor", description: "Erste Investition getätigt", icon: "💯", earnedAt: "2025-10-20", category: "invest" },
      { id: "streak_week", name: "Wochenstreak", description: "7 Tage in Folge aktiv", icon: "🔥", earnedAt: "2025-11-01", category: "streak" },
      { id: "quiz_master", name: "Quiz-Meister", description: "50 Fragen richtig beantwortet", icon: "📈", earnedAt: "2025-11-10", category: "quiz" },
      { id: "learning_3", name: "Wissenshungrig", description: "3 Lernmodule abgeschlossen", icon: "💎", earnedAt: "2025-11-15", category: "quiz" },
      { id: "daily_1", name: "Tägliche Routine", description: "30 Tages-Challenges gemeistert", icon: "🏆", earnedAt: "2025-11-20", category: "streak" },
      { id: "social_1", name: "Team Player", description: "Einem Freund geholfen", icon: "⭐", earnedAt: "2025-11-25", category: "social" },
    ],
  };
}

// ============ LEADERBOARD ============

export function getLeaderboard(type: "weekly" | "monthly" | "allTime" | "school"): LeaderboardEntry[] {
  const leaderboard = getFromStorage<Record<string, LeaderboardEntry[]>>(STORAGE_KEYS.LEADERBOARD, getDefaultLeaderboard());
  return leaderboard[type] || leaderboard.weekly;
}

export function updateLeaderboardRank(newRank: number): void {
  const profile = getJuniorProfile();
  updateJuniorProfile({ rank: newRank });
  
  // Update in leaderboard data
  const leaderboard = getFromStorage<Record<string, LeaderboardEntry[]>>(STORAGE_KEYS.LEADERBOARD, getDefaultLeaderboard());
  
  Object.keys(leaderboard).forEach(key => {
    leaderboard[key] = leaderboard[key].map(entry => 
      entry.isCurrentUser ? { ...entry, rank: newRank, xp: profile.weeklyXp } : entry
    );
  });
  
  setToStorage(STORAGE_KEYS.LEADERBOARD, leaderboard);
}

// Update leaderboard position based on new XP - recalculates rank
export function updateLeaderboardPosition(profile: JuniorProfile): void {
  const leaderboard = getFromStorage<Record<string, LeaderboardEntry[]>>(STORAGE_KEYS.LEADERBOARD, getDefaultLeaderboard());
  
  // Get all entries as flat array, update current user's XP
  Object.keys(leaderboard).forEach(key => {
    const entries = leaderboard[key];
    
    // Update current user's entry with new XP
    entries.forEach(entry => {
      if (entry.isCurrentUser) {
        entry.xp = profile.weeklyXp;
        entry.level = profile.level;
      }
    });
    
    // Sort by XP to determine new ranks
    entries.sort((a, b) => b.xp - a.xp);
    
    // Reassign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    leaderboard[key] = entries;
  });
  
  // Find new rank for current user
  const globalLeaderboard = leaderboard['global'] || [];
  const currentUserEntry = globalLeaderboard.find(e => e.isCurrentUser);
  const newRank = currentUserEntry?.rank || profile.rank;
  
  // Update profile rank
  updateJuniorProfile({ rank: newRank });
  
  setToStorage(STORAGE_KEYS.LEADERBOARD, leaderboard);
}

function getDefaultLeaderboard(): Record<string, LeaderboardEntry[]> {
  const baseLeaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "MaxMustermann", avatar: "🦊", xp: 2450, school: "Gymnasium München", level: 12 },
    { rank: 2, name: "FinanceQueen", avatar: "👸", xp: 2230, school: "Realschule Hamburg", level: 11 },
    { rank: 3, name: "InvestorKid", avatar: "🚀", xp: 2100, school: "Gymnasium Berlin", level: 10 },
    { rank: 4, name: "TaxExpert", avatar: "📊", xp: 1980, school: "Gymnasium Köln", level: 9 },
    { rank: 5, name: "StockNerd", avatar: "🤓", xp: 1875, school: "Realschule Frankfurt", level: 9 },
    { rank: 6, name: "SavingsHero", avatar: "💪", xp: 1720, school: "Gymnasium Berlin", level: 8 },
    { rank: 7, name: "QuizMaster", avatar: "🧠", xp: 1650, school: "Gesamtschule Düsseldorf", level: 8 },
    { rank: 8, name: "BudgetBoss", avatar: "💼", xp: 1580, school: "Realschule Stuttgart", level: 7 },
    { rank: 42, name: "Max Junior", avatar: "🦁", xp: 840, school: "Gymnasium Berlin", level: 5, isCurrentUser: true },
  ];

  return {
    weekly: baseLeaderboard,
    monthly: baseLeaderboard.map(e => ({ ...e, xp: e.xp * 4 })),
    allTime: baseLeaderboard.map(e => ({ ...e, xp: e.xp * 12 })),
    school: baseLeaderboard.filter(e => e.school === "Gymnasium Berlin"),
  };
}

// ============ JUNIOR SAVINGS ============

export function getJuniorSavings(): JuniorSavingsGoal[] {
  return getFromStorage<JuniorSavingsGoal[]>(STORAGE_KEYS.JUNIOR_SAVINGS, getDefaultJuniorSavings());
}

export function addJuniorSavingsGoal(goal: Omit<JuniorSavingsGoal, "id" | "createdAt" | "contributions">): JuniorSavingsGoal {
  const goals = getJuniorSavings();
  const newGoal: JuniorSavingsGoal = {
    ...goal,
    id: generateId(),
    createdAt: new Date().toISOString(),
    contributions: [],
  };
  setToStorage(STORAGE_KEYS.JUNIOR_SAVINGS, [...goals, newGoal]);
  return newGoal;
}

export function contributeToJuniorSavings(goalId: string, amount: number): void {
  const goals = getJuniorSavings();
  const updated = goals.map(g => {
    if (g.id === goalId) {
      return {
        ...g,
        currentAmount: g.currentAmount + amount,
        contributions: [...g.contributions, { amount, date: new Date().toISOString() }],
      };
    }
    return g;
  });
  setToStorage(STORAGE_KEYS.JUNIOR_SAVINGS, updated);
}

export function deleteJuniorSavingsGoal(goalId: string): void {
  const goals = getJuniorSavings();
  setToStorage(STORAGE_KEYS.JUNIOR_SAVINGS, goals.filter(g => g.id !== goalId));
}

function getDefaultJuniorSavings(): JuniorSavingsGoal[] {
  return [
    {
      id: "js-1",
      name: "PlayStation 5",
      icon: "🎮",
      targetAmount: 500,
      currentAmount: 325,
      weeklyTarget: 15,
      createdAt: "2025-09-01",
      contributions: [
        { amount: 50, date: "2025-09-01" },
        { amount: 75, date: "2025-10-01" },
        { amount: 100, date: "2025-10-15" },
        { amount: 50, date: "2025-11-01" },
        { amount: 50, date: "2025-11-15" },
      ],
    },
    {
      id: "js-2",
      name: "AirPods Pro",
      icon: "🎧",
      targetAmount: 280,
      currentAmount: 180,
      weeklyTarget: 10,
      createdAt: "2025-10-01",
      contributions: [
        { amount: 80, date: "2025-10-01" },
        { amount: 50, date: "2025-10-20" },
        { amount: 50, date: "2025-11-10" },
      ],
    },
  ];
}

// ============ JUNIOR PORTFOLIO ============

export function getJuniorPortfolio(): JuniorPortfolio {
  return getFromStorage<JuniorPortfolio>(STORAGE_KEYS.JUNIOR_PORTFOLIO, getDefaultJuniorPortfolio());
}

export function buyJuniorStock(holdingId: string, shares: number, price: number): void {
  const portfolio = getJuniorPortfolio();
  const holding = portfolio.holdings.find(h => h.id === holdingId);
  
  if (holding) {
    holding.shares += shares;
    holding.buyPrice = ((holding.buyPrice * (holding.shares - shares)) + (price * shares)) / holding.shares;
  }
  
  const trade: JuniorTrade = {
    id: generateId(),
    type: "buy",
    holdingId,
    holdingName: holding?.name || "Unknown",
    shares,
    price,
    date: new Date().toISOString(),
  };
  
  portfolio.trades.unshift(trade);
  portfolio.totalInvested += shares * price;
  portfolio.totalValue = portfolio.holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  
  setToStorage(STORAGE_KEYS.JUNIOR_PORTFOLIO, portfolio);
}

export function sellJuniorStock(holdingId: string, shares: number, price: number): void {
  const portfolio = getJuniorPortfolio();
  const holding = portfolio.holdings.find(h => h.id === holdingId);
  
  if (holding && holding.shares >= shares) {
    holding.shares -= shares;
    
    const trade: JuniorTrade = {
      id: generateId(),
      type: "sell",
      holdingId,
      holdingName: holding.name,
      shares,
      price,
      date: new Date().toISOString(),
    };
    
    portfolio.trades.unshift(trade);
    portfolio.totalValue = portfolio.holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
    
    setToStorage(STORAGE_KEYS.JUNIOR_PORTFOLIO, portfolio);
  }
}

function getDefaultJuniorPortfolio(): JuniorPortfolio {
  return {
    totalValue: 1240.50,
    totalInvested: 1100,
    holdings: [
      { id: "jh-1", name: "GameTech Corp", icon: "🎮", shares: 12, buyPrice: 35.50, currentPrice: 37.52 },
      { id: "jh-2", name: "Sneaker World", icon: "👟", shares: 8, buyPrice: 28.50, currentPrice: 40.10 },
      { id: "jh-3", name: "Burger King", icon: "🍔", shares: 6, buyPrice: 18.00, currentPrice: 35.08 },
    ],
    trades: [
      { id: "jt-1", type: "buy", holdingId: "jh-1", holdingName: "GameTech Corp", shares: 5, price: 35.50, date: "2025-09-15" },
      { id: "jt-2", type: "buy", holdingId: "jh-2", holdingName: "Sneaker World", shares: 8, price: 28.50, date: "2025-10-01" },
      { id: "jt-3", type: "buy", holdingId: "jh-3", holdingName: "Burger King", shares: 6, price: 18.00, date: "2025-10-20" },
      { id: "jt-4", type: "buy", holdingId: "jh-1", holdingName: "GameTech Corp", shares: 7, price: 36.00, date: "2025-11-10" },
    ],
  };
}

// ============ SPENDING ANALYTICS ============

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
  trend: number; // percentage change from last month
}

export function getSpendingByCategory(): SpendingCategory[] {
  const transactions = getTransactions();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  // Filter expenses from this month
  const expenses = transactions.filter(t => {
    const date = new Date(t.date);
    return t.amount < 0 && date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });
  
  // Category mappings
  const categoryConfig: Record<string, { icon: string; color: string }> = {
    "Transport": { icon: "🚗", color: "#FF6B6B" },
    "Einkaufen": { icon: "🛒", color: "#4ECDC4" },
    "Restaurant": { icon: "🍽️", color: "#FFE66D" },
    "Entertainment": { icon: "🎬", color: "#95E1D3" },
    "Haushalt": { icon: "🏠", color: "#DDA0DD" },
    "Sparen": { icon: "💰", color: "#98D8C8" },
    "Gesundheit": { icon: "💊", color: "#F7DC6F" },
    "Gehalt": { icon: "💵", color: "#82E0AA" },
    "Sonstiges": { icon: "📦", color: "#AED6F1" },
  };
  
  // Group by category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(t => {
    const cat = t.category || "Sonstiges";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
  });
  
  const totalSpending = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  
  // Convert to array with percentages
  const categories: SpendingCategory[] = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    amount,
    percentage: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0,
    icon: categoryConfig[name]?.icon || "📦",
    color: categoryConfig[name]?.color || "#AED6F1",
    trend: Math.random() * 20 - 10, // Random trend for demo (-10% to +10%)
  }));
  
  return categories.sort((a, b) => b.amount - a.amount);
}

export function getMonthlySpending(months: number = 6): { month: string; amount: number }[] {
  const transactions = getTransactions();
  const result: { month: string; amount: number }[] = [];
  
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleDateString("de-DE", { month: "short" });
    const year = date.getFullYear();
    const monthNum = date.getMonth();
    
    const monthSpending = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.amount < 0 && tDate.getMonth() === monthNum && tDate.getFullYear() === year;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    result.unshift({ month, amount: monthSpending });
  }
  
  return result;
}

// ============ RECURRING PAYMENTS ============

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  frequency: "monthly" | "yearly" | "weekly";
  category: string;
  nextDate: string;
  icon: string;
  active: boolean;
}

export function getRecurringPayments(): RecurringPayment[] {
  return getFromStorage<RecurringPayment[]>(STORAGE_KEYS.RECURRING_PAYMENTS, getDefaultRecurringPayments());
}

export function addRecurringPayment(payment: Omit<RecurringPayment, "id">): RecurringPayment {
  const payments = getRecurringPayments();
  const newPayment: RecurringPayment = { ...payment, id: generateId() };
  setToStorage(STORAGE_KEYS.RECURRING_PAYMENTS, [...payments, newPayment]);
  return newPayment;
}

export function toggleRecurringPayment(id: string): void {
  const payments = getRecurringPayments();
  const updated = payments.map(p => p.id === id ? { ...p, active: !p.active } : p);
  setToStorage(STORAGE_KEYS.RECURRING_PAYMENTS, updated);
}

export function deleteRecurringPayment(id: string): void {
  const payments = getRecurringPayments();
  setToStorage(STORAGE_KEYS.RECURRING_PAYMENTS, payments.filter(p => p.id !== id));
}

function getDefaultRecurringPayments(): RecurringPayment[] {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);
  
  return [
    { id: "rp-1", name: "Miete", amount: 850, frequency: "monthly", category: "Haushalt", nextDate: nextMonth.toISOString().split("T")[0], icon: "🏠", active: true },
    { id: "rp-2", name: "Netflix", amount: 12.99, frequency: "monthly", category: "Entertainment", nextDate: "2025-12-15", icon: "📺", active: true },
    { id: "rp-3", name: "Spotify", amount: 9.99, frequency: "monthly", category: "Entertainment", nextDate: "2025-12-10", icon: "🎵", active: true },
    { id: "rp-4", name: "Fitnessstudio", amount: 29.90, frequency: "monthly", category: "Gesundheit", nextDate: "2025-12-01", icon: "💪", active: true },
    { id: "rp-5", name: "Handyvertrag", amount: 39.99, frequency: "monthly", category: "Sonstiges", nextDate: "2025-12-05", icon: "📱", active: true },
    { id: "rp-6", name: "Amazon Prime", amount: 89.90, frequency: "yearly", category: "Entertainment", nextDate: "2026-03-15", icon: "📦", active: true },
    { id: "rp-7", name: "Haftpflicht", amount: 120, frequency: "yearly", category: "Versicherung", nextDate: "2026-01-01", icon: "🛡️", active: true },
  ];
}

// ============ DEPOSIT / WITHDRAW MONEY ============

export function depositMoney(account: "girokonto" | "extraKonto", amount: number, reference: string = "Einzahlung"): Transaction {
  updateBalance(account, amount);
  
  return addTransaction({
    type: "income",
    amount: amount,
    currency: "EUR",
    from: "Einzahlung",
    to: account === "girokonto" ? "Girokonto" : "Extra-Konto",
    reference,
    date: new Date().toISOString().split("T")[0],
    status: "completed",
    category: "Einzahlung",
  });
}

export function withdrawMoney(account: "girokonto" | "extraKonto", amount: number, reference: string = "Auszahlung"): Transaction | null {
  const balance = getBalance();
  if (balance[account] < amount) return null;
  
  updateBalance(account, -amount);
  
  return addTransaction({
    type: "payment",
    amount: -amount,
    currency: "EUR",
    from: account === "girokonto" ? "Girokonto" : "Extra-Konto",
    to: "Auszahlung",
    reference,
    date: new Date().toISOString().split("T")[0],
    status: "completed",
    category: "Auszahlung",
  });
}

export function transferBetweenAccounts(
  from: "girokonto" | "extraKonto",
  to: "girokonto" | "extraKonto",
  amount: number,
  reference: string = "Umbuchung"
): Transaction | null {
  const balance = getBalance();
  if (balance[from] < amount) return null;
  
  updateBalance(from, -amount);
  updateBalance(to, amount);
  
  return addTransaction({
    type: "transfer",
    amount: -amount,
    currency: "EUR",
    from: from === "girokonto" ? "Girokonto" : "Extra-Konto",
    to: to === "girokonto" ? "Girokonto" : "Extra-Konto",
    reference,
    date: new Date().toISOString().split("T")[0],
    status: "completed",
    category: "Umbuchung",
  });
}

// ============ PORTFOLIO ORDERS ============

export function executeBuyOrder(symbol: string, name: string, shares: number, price: number): { success: boolean; order?: InvestmentOrder; error?: string } {
  const total = shares * price;
  const balance = getBalance();
  
  if (balance.girokonto < total) {
    return { success: false, error: "Nicht genügend Guthaben" };
  }
  
  // Deduct from Girokonto
  updateBalance("girokonto", -total);
  
  // Add to portfolio
  addToPortfolio({
    symbol,
    name,
    shares,
    avgPrice: price,
    currentPrice: price,
  });
  
  // Create order record
  const order = addInvestmentOrder({
    type: "buy",
    symbol,
    name,
    shares,
    price,
    total,
    date: new Date().toISOString().split("T")[0],
    status: "executed",
  });
  
  // Add transaction
  addTransaction({
    type: "investment",
    amount: -total,
    currency: "EUR",
    from: "Girokonto",
    to: `Kauf ${shares}x ${symbol}`,
    reference: `Aktienkauf ${name}`,
    date: new Date().toISOString().split("T")[0],
    status: "completed",
    category: "Investment",
  });
  
  return { success: true, order };
}

export function executeSellOrder(symbol: string, name: string, shares: number, price: number): { success: boolean; order?: InvestmentOrder; error?: string } {
  const portfolio = getPortfolio();
  const holding = portfolio.find(h => h.symbol === symbol);
  
  if (!holding || holding.shares < shares) {
    return { success: false, error: "Nicht genügend Anteile" };
  }
  
  const total = shares * price;
  
  // Add to Girokonto
  updateBalance("girokonto", total);
  
  // Remove from portfolio
  removeFromPortfolio(symbol, shares);
  
  // Create order record
  const order = addInvestmentOrder({
    type: "sell",
    symbol,
    name,
    shares,
    price,
    total,
    date: new Date().toISOString().split("T")[0],
    status: "executed",
  });
  
  // Add transaction
  addTransaction({
    type: "investment",
    amount: total,
    currency: "EUR",
    from: `Verkauf ${shares}x ${symbol}`,
    to: "Girokonto",
    reference: `Aktienverkauf ${name}`,
    date: new Date().toISOString().split("T")[0],
    status: "completed",
    category: "Investment",
  });
  
  return { success: true, order };
}

// ============ DEMO DATA INITIALIZATION ============

export function initializeDemoData(): void {
  // Check if data already exists
  const existingTransactions = getTransactions();
  if (existingTransactions.length > 10) {
    return; // Already has demo data
  }
  
  // Add demo transactions for the last 3 months
  const today = new Date();
  const demoTransactions: Omit<Transaction, "id">[] = [
    // Monthly income
    { type: "transfer", amount: 2500, currency: "EUR", from: "Arbeitgeber GmbH", to: "Girokonto", reference: "Gehalt November", date: getDateDaysAgo(5), status: "completed", category: "Gehalt" },
    { type: "transfer", amount: 2500, currency: "EUR", from: "Arbeitgeber GmbH", to: "Girokonto", reference: "Gehalt Oktober", date: getDateDaysAgo(35), status: "completed", category: "Gehalt" },
    { type: "transfer", amount: 2500, currency: "EUR", from: "Arbeitgeber GmbH", to: "Girokonto", reference: "Gehalt September", date: getDateDaysAgo(65), status: "completed", category: "Gehalt" },
    
    // Recurring expenses
    { type: "transfer", amount: -800, currency: "EUR", from: "Girokonto", to: "Vermieter GmbH", reference: "Miete November", date: getDateDaysAgo(3), status: "completed", category: "Wohnen" },
    { type: "transfer", amount: -800, currency: "EUR", from: "Girokonto", to: "Vermieter GmbH", reference: "Miete Oktober", date: getDateDaysAgo(33), status: "completed", category: "Wohnen" },
    { type: "transfer", amount: -800, currency: "EUR", from: "Girokonto", to: "Vermieter GmbH", reference: "Miete September", date: getDateDaysAgo(63), status: "completed", category: "Wohnen" },
    
    // Food & Restaurants
    { type: "transfer", amount: -45, currency: "EUR", from: "Girokonto", to: "REWE", reference: "Einkauf", date: getDateDaysAgo(2), status: "completed", category: "Lebensmittel" },
    { type: "transfer", amount: -32, currency: "EUR", from: "Girokonto", to: "Lieferando", reference: "Pizza", date: getDateDaysAgo(4), status: "completed", category: "Restaurant" },
    { type: "transfer", amount: -28, currency: "EUR", from: "Girokonto", to: "Vapiano", reference: "Mittagessen", date: getDateDaysAgo(7), status: "completed", category: "Restaurant" },
    { type: "transfer", amount: -65, currency: "EUR", from: "Girokonto", to: "EDEKA", reference: "Wocheneinkauf", date: getDateDaysAgo(9), status: "completed", category: "Lebensmittel" },
    { type: "transfer", amount: -18, currency: "EUR", from: "Girokonto", to: "Starbucks", reference: "Kaffee", date: getDateDaysAgo(1), status: "completed", category: "Restaurant" },
    
    // Subscriptions
    { type: "transfer", amount: -17.99, currency: "EUR", from: "Girokonto", to: "Netflix", reference: "Abo", date: getDateDaysAgo(10), status: "completed", category: "Entertainment" },
    { type: "transfer", amount: -9.99, currency: "EUR", from: "Girokonto", to: "Spotify", reference: "Premium", date: getDateDaysAgo(12), status: "completed", category: "Entertainment" },
    { type: "transfer", amount: -45, currency: "EUR", from: "Girokonto", to: "Vodafone", reference: "Internet", date: getDateDaysAgo(15), status: "completed", category: "Mobilität" },
    
    // Shopping
    { type: "transfer", amount: -89, currency: "EUR", from: "Girokonto", to: "Amazon", reference: "Kopfhörer", date: getDateDaysAgo(8), status: "completed", category: "Shopping" },
    { type: "transfer", amount: -45, currency: "EUR", from: "Girokonto", to: "Zalando", reference: "Schuhe", date: getDateDaysAgo(20), status: "completed", category: "Shopping" },
    
    // Transport
    { type: "transfer", amount: -89, currency: "EUR", from: "Girokonto", to: "BVG", reference: "Monatskarte", date: getDateDaysAgo(6), status: "completed", category: "Transport" },
    { type: "transfer", amount: -35, currency: "EUR", from: "Girokonto", to: "Shell Tankstelle", reference: "Tanken", date: getDateDaysAgo(14), status: "completed", category: "Transport" },
    
    // Entertainment
    { type: "transfer", amount: -25, currency: "EUR", from: "Girokonto", to: "CineStar", reference: "Kino", date: getDateDaysAgo(11), status: "completed", category: "Freizeit" },
    { type: "transfer", amount: -80, currency: "EUR", from: "Girokonto", to: "Fitness First", reference: "Gym", date: getDateDaysAgo(2), status: "completed", category: "Freizeit" },
  ];
  
  // Add each transaction
  demoTransactions.forEach(tx => {
    addTransaction(tx);
  });
  
  // Add demo savings goals for Junior
  const existingGoals = getSavingsGoals();
  if (existingGoals.length === 0) {
    addSavingsGoal({
      name: "PlayStation 5",
      targetAmount: 500,
      currentAmount: 325,
      category: "gaming",
      weeklyContribution: 15,
      dueDate: "2025-03-01",
    });
    addSavingsGoal({
      name: "AirPods Pro",
      targetAmount: 280,
      currentAmount: 180,
      category: "music",
      weeklyContribution: 10,
      dueDate: "2025-02-15",
    });
  }
}

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
}

// Auto-initialize demo data on first load
if (typeof window !== "undefined") {
  // Run after a short delay to not block initial render
  setTimeout(() => {
    initializeDemoData();
  }, 100);
}
