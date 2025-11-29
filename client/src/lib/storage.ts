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
  createdAt: string;
  targetDate?: string;
  icon?: string;
}

// Portfolio Holding
export interface Holding {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

// Storage Keys
const STORAGE_KEYS = {
  TRANSACTIONS: "ing_transactions",
  INVESTMENT_ORDERS: "ing_investment_orders",
  SAVINGS_GOALS: "ing_savings_goals",
  PORTFOLIO: "ing_portfolio",
  WATCHLIST: "ing_watchlist",
  BALANCE: "ing_balance",
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
  const today = new Date();
  return [
    {
      id: "demo-1",
      type: "payment",
      amount: -40.0,
      currency: "EUR",
      from: "Girokonto",
      to: "Tankstelle Nord",
      reference: "Tankfüllung",
      date: formatDate(today),
      status: "completed",
      category: "Transport",
    },
    {
      id: "demo-2",
      type: "payment",
      amount: -22.45,
      currency: "EUR",
      from: "Girokonto",
      to: "Einkaufszentrum-Süd",
      reference: "Einkauf",
      date: formatDate(today),
      status: "completed",
      category: "Einkaufen",
    },
    {
      id: "demo-3",
      type: "savings",
      amount: -150.0,
      currency: "EUR",
      from: "Girokonto",
      to: "Extra-Konto Sparen",
      reference: "Monatliches Sparen",
      date: formatDate(today),
      status: "completed",
      category: "Sparen",
    },
    {
      id: "demo-4",
      type: "income",
      amount: 2850.0,
      currency: "EUR",
      from: "Arbeitgeber GmbH",
      to: "Girokonto",
      reference: "Gehalt Februar",
      date: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
      status: "completed",
      category: "Gehalt",
    },
  ];
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
