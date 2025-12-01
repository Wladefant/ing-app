// Mock stock data for search functionality
// Includes German stocks and popular international stocks

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  exchange: string;
  sector: string;
  country: string;
}

// Comprehensive list of ~50 stocks for search
export const STOCK_DATABASE: Stock[] = [
  // German DAX stocks
  { symbol: "SAP", name: "SAP SE", price: 178.30, change: 0.89, changePercent: 0.50, currency: "EUR", exchange: "XETRA", sector: "Technology", country: "DE" },
  { symbol: "SIE", name: "Siemens AG", price: 168.50, change: 2.30, changePercent: 1.38, currency: "EUR", exchange: "XETRA", sector: "Industrials", country: "DE" },
  { symbol: "ALV", name: "Allianz SE", price: 248.90, change: -1.20, changePercent: -0.48, currency: "EUR", exchange: "XETRA", sector: "Financials", country: "DE" },
  { symbol: "DTE", name: "Deutsche Telekom AG", price: 22.45, change: 0.15, changePercent: 0.67, currency: "EUR", exchange: "XETRA", sector: "Telecom", country: "DE" },
  { symbol: "BAS", name: "BASF SE", price: 45.20, change: -0.65, changePercent: -1.42, currency: "EUR", exchange: "XETRA", sector: "Chemicals", country: "DE" },
  { symbol: "BAY", name: "Bayer AG", price: 28.50, change: 0.42, changePercent: 1.50, currency: "EUR", exchange: "XETRA", sector: "Healthcare", country: "DE" },
  { symbol: "BMW", name: "BMW AG", price: 98.20, change: 1.10, changePercent: 1.13, currency: "EUR", exchange: "XETRA", sector: "Automotive", country: "DE" },
  { symbol: "MBG", name: "Mercedes-Benz Group AG", price: 64.30, change: 0.85, changePercent: 1.34, currency: "EUR", exchange: "XETRA", sector: "Automotive", country: "DE" },
  { symbol: "VOW3", name: "Volkswagen AG", price: 112.40, change: -2.10, changePercent: -1.83, currency: "EUR", exchange: "XETRA", sector: "Automotive", country: "DE" },
  { symbol: "ADS", name: "Adidas AG", price: 215.60, change: 3.40, changePercent: 1.60, currency: "EUR", exchange: "XETRA", sector: "Consumer", country: "DE" },
  { symbol: "DBK", name: "Deutsche Bank AG", price: 14.85, change: 0.22, changePercent: 1.50, currency: "EUR", exchange: "XETRA", sector: "Financials", country: "DE" },
  { symbol: "DPW", name: "Deutsche Post AG", price: 42.30, change: 0.55, changePercent: 1.32, currency: "EUR", exchange: "XETRA", sector: "Logistics", country: "DE" },
  { symbol: "IFX", name: "Infineon Technologies AG", price: 32.40, change: 0.68, changePercent: 2.14, currency: "EUR", exchange: "XETRA", sector: "Technology", country: "DE" },
  { symbol: "MRK", name: "Merck KGaA", price: 152.30, change: -0.90, changePercent: -0.59, currency: "EUR", exchange: "XETRA", sector: "Healthcare", country: "DE" },
  { symbol: "HEN3", name: "Henkel AG", price: 72.80, change: 0.45, changePercent: 0.62, currency: "EUR", exchange: "XETRA", sector: "Consumer", country: "DE" },
  
  // Dutch/European stocks
  { symbol: "ING", name: "ING Groep N.V.", price: 12.45, change: 0.15, changePercent: 1.22, currency: "EUR", exchange: "AMS", sector: "Financials", country: "NL" },
  { symbol: "ASML", name: "ASML Holding N.V.", price: 685.40, change: 12.30, changePercent: 1.83, currency: "EUR", exchange: "AMS", sector: "Technology", country: "NL" },
  { symbol: "PHI", name: "Philips N.V.", price: 24.60, change: -0.35, changePercent: -1.40, currency: "EUR", exchange: "AMS", sector: "Healthcare", country: "NL" },
  { symbol: "NESN", name: "Nestlé S.A.", price: 98.50, change: 0.75, changePercent: 0.77, currency: "CHF", exchange: "SWX", sector: "Consumer", country: "CH" },
  { symbol: "NOVN", name: "Novartis AG", price: 92.30, change: 0.95, changePercent: 1.04, currency: "CHF", exchange: "SWX", sector: "Healthcare", country: "CH" },
  
  // US Tech Giants (Magnificent 7 + more)
  { symbol: "AAPL", name: "Apple Inc.", price: 178.50, change: 2.30, changePercent: 1.30, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 378.90, change: 4.20, changePercent: 1.12, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 138.20, change: -1.50, changePercent: -1.07, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.90, change: 3.20, changePercent: 1.82, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 420.50, change: 13.50, changePercent: 3.31, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "META", name: "Meta Platforms Inc.", price: 485.20, change: 10.20, changePercent: 2.15, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.60, change: -8.10, changePercent: -3.19, currency: "USD", exchange: "NASDAQ", sector: "Automotive", country: "US" },
  
  // Other US stocks
  { symbol: "NFLX", name: "Netflix Inc.", price: 485.20, change: -4.80, changePercent: -0.98, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "DIS", name: "The Walt Disney Company", price: 92.30, change: 1.10, changePercent: 1.21, currency: "USD", exchange: "NYSE", sector: "Entertainment", country: "US" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 185.40, change: 2.80, changePercent: 1.53, currency: "USD", exchange: "NYSE", sector: "Financials", country: "US" },
  { symbol: "V", name: "Visa Inc.", price: 275.60, change: 3.40, changePercent: 1.25, currency: "USD", exchange: "NYSE", sector: "Financials", country: "US" },
  { symbol: "MA", name: "Mastercard Inc.", price: 458.20, change: 5.60, changePercent: 1.24, currency: "USD", exchange: "NYSE", sector: "Financials", country: "US" },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 158.90, change: -0.45, changePercent: -0.28, currency: "USD", exchange: "NYSE", sector: "Healthcare", country: "US" },
  { symbol: "PG", name: "Procter & Gamble Co.", price: 162.30, change: 0.85, changePercent: 0.53, currency: "USD", exchange: "NYSE", sector: "Consumer", country: "US" },
  { symbol: "KO", name: "The Coca-Cola Company", price: 59.80, change: 0.25, changePercent: 0.42, currency: "USD", exchange: "NYSE", sector: "Consumer", country: "US" },
  { symbol: "PEP", name: "PepsiCo Inc.", price: 172.40, change: 0.95, changePercent: 0.55, currency: "USD", exchange: "NASDAQ", sector: "Consumer", country: "US" },
  { symbol: "MCD", name: "McDonald's Corporation", price: 295.60, change: 1.80, changePercent: 0.61, currency: "USD", exchange: "NYSE", sector: "Consumer", country: "US" },
  { symbol: "NKE", name: "Nike Inc.", price: 98.40, change: 1.20, changePercent: 1.24, currency: "USD", exchange: "NYSE", sector: "Consumer", country: "US" },
  { symbol: "WMT", name: "Walmart Inc.", price: 165.80, change: 2.10, changePercent: 1.28, currency: "USD", exchange: "NYSE", sector: "Retail", country: "US" },
  { symbol: "HD", name: "The Home Depot Inc.", price: 345.20, change: 4.50, changePercent: 1.32, currency: "USD", exchange: "NYSE", sector: "Retail", country: "US" },
  { symbol: "CRM", name: "Salesforce Inc.", price: 265.40, change: 3.80, changePercent: 1.45, currency: "USD", exchange: "NYSE", sector: "Technology", country: "US" },
  { symbol: "ORCL", name: "Oracle Corporation", price: 118.60, change: 1.40, changePercent: 1.19, currency: "USD", exchange: "NYSE", sector: "Technology", country: "US" },
  { symbol: "AMD", name: "Advanced Micro Devices Inc.", price: 142.80, change: 4.20, changePercent: 3.03, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "INTC", name: "Intel Corporation", price: 42.30, change: -0.85, changePercent: -1.97, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", price: 62.40, change: 0.95, changePercent: 1.55, currency: "USD", exchange: "NASDAQ", sector: "Financials", country: "US" },
  { symbol: "UBER", name: "Uber Technologies Inc.", price: 68.90, change: 1.20, changePercent: 1.77, currency: "USD", exchange: "NYSE", sector: "Technology", country: "US" },
  { symbol: "ABNB", name: "Airbnb Inc.", price: 142.60, change: 2.30, changePercent: 1.64, currency: "USD", exchange: "NASDAQ", sector: "Technology", country: "US" },
  { symbol: "SPOT", name: "Spotify Technology S.A.", price: 298.40, change: 5.60, changePercent: 1.91, currency: "USD", exchange: "NYSE", sector: "Technology", country: "US" },
  { symbol: "SQ", name: "Block Inc.", price: 72.80, change: 1.45, changePercent: 2.03, currency: "USD", exchange: "NYSE", sector: "Financials", country: "US" },
  { symbol: "COIN", name: "Coinbase Global Inc.", price: 178.50, change: 8.20, changePercent: 4.82, currency: "USD", exchange: "NASDAQ", sector: "Financials", country: "US" },
];

// Search function with case-insensitive matching
export function searchStocks(query: string): Stock[] {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return STOCK_DATABASE.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm) ||
    stock.name.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limit to 10 results
}

// Get popular stocks for suggestions
export function getPopularStocks(): Stock[] {
  const popularSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "SAP", "ING"];
  return STOCK_DATABASE.filter(stock => popularSymbols.includes(stock.symbol));
}

// Get German stocks
export function getGermanStocks(): Stock[] {
  return STOCK_DATABASE.filter(stock => stock.country === "DE");
}

// Get stock by symbol
export function getStockBySymbol(symbol: string): Stock | undefined {
  return STOCK_DATABASE.find(stock => stock.symbol.toUpperCase() === symbol.toUpperCase());
}

// Format price with currency
export function formatStockPrice(price: number, currency: string): string {
  const symbols: Record<string, string> = {
    EUR: "€",
    USD: "$",
    CHF: "CHF ",
  };
  const symbol = symbols[currency] || currency + " ";
  
  if (currency === "EUR") {
    return `${price.toFixed(2)} ${symbol}`;
  }
  return `${symbol}${price.toFixed(2)}`;
}
