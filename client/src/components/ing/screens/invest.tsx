import { useState } from "react";
import { ScreenHeader, BottomNav } from "../layout";
import { Screen } from "@/pages/ing-app";
import { PieChart, ArrowRightLeft, Search, Info, User, TrendingUp, Lightbulb, X, Clock, Star, Plus, Eye, Minus, ShoppingCart, Newspaper, Briefcase, Bookmark, MoreVertical } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const data = [
  { name: 'Jan', value: 5630 },
  { name: 'Feb', value: 8000 },
  { name: 'Mar', value: 10000 },
  { name: 'Apr', value: 9500 },
  { name: 'May', value: 11000 },
  { name: 'Jun', value: 12963 },
  { name: 'Jul', value: 12704 },
];

// Portfolio Holdings
const PORTFOLIO_HOLDINGS = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 15, avgPrice: 145.20, currentPrice: 178.50, change: 1.3, value: 2677.50 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 10, avgPrice: 320.00, currentPrice: 378.90, change: 1.1, value: 3789.00 },
  { symbol: "ING", name: "ING Groep N.V.", shares: 200, avgPrice: 11.20, currentPrice: 12.45, change: 1.2, value: 2490.00 },
  { symbol: "VUSA", name: "Vanguard S&P 500", shares: 25, avgPrice: 72.50, currentPrice: 149.94, change: 0.8, value: 3748.46 },
];

// Watchlist
const WATCHLIST = [
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.60, change: -3.3 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 420.50, change: 3.2 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.90, change: 1.8 },
  { symbol: "META", name: "Meta Platforms", price: 485.20, change: 2.1 },
];

// Market News
const MARKET_NEWS = [
  { id: 1, title: "Apple kündigt neues iPhone 16 an", source: "Reuters", time: "vor 2 Std", sentiment: "positive" },
  { id: 2, title: "EZB erhöht Leitzins erneut", source: "Handelsblatt", time: "vor 4 Std", sentiment: "neutral" },
  { id: 3, title: "NVIDIA meldet Rekordgewinn", source: "Bloomberg", time: "vor 6 Std", sentiment: "positive" },
  { id: 4, title: "Tesla Aktie unter Druck nach Gewinnwarnung", source: "CNBC", time: "vor 8 Std", sentiment: "negative" },
];

// Available stocks for search
const SEARCHABLE_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.50, change: 1.3 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 138.20, change: -1.1 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.90, change: 1.1 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.60, change: -3.3 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.90, change: 1.8 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 420.50, change: 3.2 },
  { symbol: "META", name: "Meta Platforms", price: 485.20, change: 2.1 },
  { symbol: "ING", name: "ING Groep N.V.", price: 12.45, change: 1.2 },
  { symbol: "SAP", name: "SAP SE", price: 178.30, change: 0.5 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 485.20, change: -1.0 },
];

const RECENT_SEARCHES = ["Apple", "Tesla", "ETF Welt"];

type InvestTab = "portfolio" | "watchlist" | "news";

// Tab Button Component
function TabButton({ 
  label, 
  icon, 
  active, 
  onClick 
}: { 
  label: string; 
  icon: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors border-b-2",
        active 
          ? "text-[#FF6200] border-[#FF6200]" 
          : "text-gray-500 border-transparent hover:text-gray-700"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function InvestScreen({
  onBack,
  onNavigate,
  onLeoClick
}: {
  onBack: () => void,
  onNavigate: (s: Screen) => void,
  onLeoClick?: () => void
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [activeTab, setActiveTab] = useState<InvestTab>("portfolio");
  const [watchlist, setWatchlist] = useState(WATCHLIST);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  const filteredStocks = searchQuery.length > 0 
    ? SEARCHABLE_STOCKS.filter(s => 
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectStock = (symbol: string) => {
    // Add to recent searches
    if (!recentSearches.includes(symbol)) {
      setRecentSearches([symbol, ...recentSearches.slice(0, 2)]);
    }
    // Navigate to stock detail
    setShowSearch(false);
    setSearchQuery("");
    // Use the stock-detail screen (stored in localStorage for now)
    localStorage.setItem("selectedStock", symbol);
    onNavigate("stock-detail");
  };

  const handleBuySell = (stock: any, type: "buy" | "sell") => {
    setSelectedStock(stock);
    setOrderType(type);
    setShowOrderModal(true);
  };

  const addToWatchlist = (stock: any) => {
    if (!watchlist.find(w => w.symbol === stock.symbol)) {
      setWatchlist([...watchlist, stock]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(w => w.symbol !== symbol));
  };

  // Calculate total portfolio value and performance
  const totalValue = PORTFOLIO_HOLDINGS.reduce((sum, h) => sum + h.value, 0);
  const totalCost = PORTFOLIO_HOLDINGS.reduce((sum, h) => sum + (h.shares * h.avgPrice), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = ((totalGain / totalCost) * 100).toFixed(2);

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      {/* Header with Tabs */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="font-bold text-lg text-[#FF6200]">Investieren</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSearch(true)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              title="Suchen"
            >
              <Search size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Tab Bar */}
        <div className="flex border-b border-gray-100">
          <TabButton 
            label="Portfolio" 
            icon={<Briefcase size={16} />} 
            active={activeTab === "portfolio"} 
            onClick={() => setActiveTab("portfolio")} 
          />
          <TabButton 
            label="Watchlist" 
            icon={<Bookmark size={16} />} 
            active={activeTab === "watchlist"} 
            onClick={() => setActiveTab("watchlist")} 
          />
          <TabButton 
            label="News" 
            icon={<Newspaper size={16} />} 
            active={activeTab === "news"} 
            onClick={() => setActiveTab("news")} 
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="p-4 space-y-4">
            {/* Portfolio Summary Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FF6200] rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xl">🦁</span>
                </div>
                <div>
                  <div className="font-bold text-[#333333]">Direkt-Depot</div>
                  <div className="text-xs text-gray-400">1234567890</div>
                </div>
              </div>

              <div className="mb-1 text-xs text-gray-500">Gesamtwert</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-[#333333]">{totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className={`text-sm font-bold ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalGain >= 0 ? '+' : ''}{totalGain.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € ({totalGain >= 0 ? '+' : ''}{totalGainPercent}%)
              </div>

              {/* Chart */}
              <div className="h-32 w-full mt-4 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line type="monotone" dataKey="value" stroke="#33307E" strokeWidth={2} dot={false} />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Time Selectors */}
              <div className="bg-gray-100 rounded-lg p-1 flex justify-between">
                <TimeSelector label="1T" />
                <TimeSelector label="1W" />
                <TimeSelector label="1M" />
                <TimeSelector label="1J" active />
                <TimeSelector label="Max" />
              </div>
            </div>

            {/* Holdings List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-[#333333]">Meine Positionen</span>
                <span className="text-xs text-gray-500">{PORTFOLIO_HOLDINGS.length} Werte</span>
              </div>
              <div className="divide-y divide-gray-100">
                {PORTFOLIO_HOLDINGS.map((holding) => {
                  const gain = (holding.currentPrice - holding.avgPrice) * holding.shares;
                  const gainPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice * 100).toFixed(1);
                  return (
                    <div 
                      key={holding.symbol}
                      onClick={() => handleSelectStock(holding.symbol)}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-[#33307E] text-xs">
                          {holding.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-[#333333] text-sm">{holding.symbol}</div>
                          <div className="text-xs text-gray-500">{holding.shares} Stk. × {holding.currentPrice.toFixed(2)}€</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#333333]">{holding.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</div>
                        <div className={`text-xs font-bold ${gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {gain >= 0 ? '+' : ''}{gain.toFixed(2)}€ ({gain >= 0 ? '+' : ''}{gainPercent}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSearch(true)}
                className="flex-1 bg-[#33307E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Kaufen
              </button>
              <button 
                onClick={() => onNavigate("orders")}
                className="flex-1 bg-white text-[#333333] py-3 rounded-xl font-bold border border-gray-200 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft size={18} />
                Orders
              </button>
            </div>
          </div>
        )}

        {/* Watchlist Tab */}
        {activeTab === "watchlist" && (
          <div className="p-4 space-y-4">
            {watchlist.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Eye size={32} className="text-gray-400" />
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Watchlist leer</h3>
                <p className="text-sm text-gray-500 mb-4">Füge Aktien hinzu, die du beobachten möchtest.</p>
                <button 
                  onClick={() => setShowSearch(true)}
                  className="bg-[#FF6200] text-white px-6 py-2 rounded-xl font-bold"
                >
                  Aktie suchen
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-[#333333]">Beobachtete Werte</span>
                  <button 
                    onClick={() => setShowSearch(true)}
                    className="text-xs text-[#FF6200] font-bold flex items-center gap-1"
                  >
                    <Plus size={14} /> Hinzufügen
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {watchlist.map((stock) => (
                    <div 
                      key={stock.symbol}
                      className="p-4 flex items-center justify-between"
                    >
                      <button
                        onClick={() => handleSelectStock(stock.symbol)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-[#33307E] text-xs">
                          {stock.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-[#333333] text-sm">{stock.symbol}</div>
                          <div className="text-xs text-gray-500">{stock.name}</div>
                        </div>
                      </button>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="font-bold text-[#333333]">{stock.price.toFixed(2)} €</div>
                          <div className={`text-xs font-bold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(1)}%
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromWatchlist(stock.symbol)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                          title="Entfernen"
                        >
                          <X size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Market Overview */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="font-bold text-[#333333] mb-3">Top Movers heute</div>
              <div className="space-y-3">
                {SEARCHABLE_STOCKS.slice(0, 3).sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).map((stock) => (
                  <MoverRow 
                    key={stock.symbol}
                    name={stock.name} 
                    change={`${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(1)}%`} 
                    isPositive={stock.change >= 0} 
                    price={`${stock.price.toFixed(2)} €`} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === "news" && (
          <div className="p-4 space-y-4">
            {/* Leo AI Summary */}
            <div className="bg-gradient-to-br from-[#33307E] to-[#4A47A3] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <Lightbulb className="text-yellow-400" size={20} />
                <span className="font-bold text-sm">Leo's Markt-Update</span>
              </div>
              <p className="text-sm leading-relaxed text-blue-100 relative z-10">
                Dein Portfolio ist gut diversifiziert! 🌍 Tech-Aktien sind diese Woche um 2,4% gestiegen. 
                NVIDIA meldet Rekordgewinne, Tesla unter Druck.
              </p>
            </div>

            {/* News List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <span className="font-bold text-[#333333]">Aktuelle Nachrichten</span>
              </div>
              <div className="divide-y divide-gray-100">
                {MARKET_NEWS.map((news) => (
                  <button 
                    key={news.id}
                    className="p-4 w-full text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2 shrink-0",
                        news.sentiment === "positive" && "bg-green-500",
                        news.sentiment === "negative" && "bg-red-500",
                        news.sentiment === "neutral" && "bg-gray-400"
                      )} />
                      <div>
                        <div className="font-bold text-[#333333] text-sm mb-1">{news.title}</div>
                        <div className="text-xs text-gray-500">{news.source} • {news.time}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav activeTab="invest" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="adult" />

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50 flex flex-col"
          >
            {/* Search Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Schließen"
                >
                  <X size={24} className="text-gray-500" />
                </button>
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Aktie, ETF oder Fonds suchen..."
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#33307E]/20"
                  />
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto">
              {searchQuery.length === 0 ? (
                <>
                  {/* Recent Searches */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-500">Letzte Suchen</span>
                      <button 
                        onClick={() => setRecentSearches([])}
                        className="text-xs text-[#FF6200] font-bold"
                      >
                        Löschen
                      </button>
                    </div>
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchQuery(search)}
                        className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-xl"
                      >
                        <Clock size={18} className="text-gray-400" />
                        <span className="text-[#333333]">{search}</span>
                      </button>
                    ))}
                  </div>

                  {/* Popular */}
                  <div className="p-4 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-500 block mb-3">Beliebt</span>
                    <div className="flex flex-wrap gap-2">
                      {["Apple", "Tesla", "Microsoft", "NVIDIA", "ETF Welt"].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-2 bg-gray-100 rounded-full text-sm text-[#333333] hover:bg-gray-200 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredStocks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Keine Ergebnisse für "{searchQuery}"
                    </div>
                  ) : (
                    filteredStocks.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => handleSelectStock(stock.symbol)}
                        className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#33307E] border border-gray-200">
                            {stock.symbol.substring(0, 2)}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-[#333333]">{stock.symbol}</div>
                            <div className="text-xs text-gray-500">{stock.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#333333]">€{stock.price.toFixed(2)}</div>
                          <div className={`text-xs font-bold ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(1)}%
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InvestAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-full bg-[#33307E] flex items-center justify-center text-white shadow-md active:scale-95 transition-transform">
        {icon}
      </div>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </button>
  );
}

function TimeSelector({ label, active }: { label: string; active?: boolean }) {
  return (
    <button className={cn(
      "px-4 py-1 rounded-md text-sm font-medium transition-colors flex-1",
      active ? "bg-[#33307E] text-white" : "text-gray-500 hover:bg-gray-200"
    )}>
      {label}
    </button>
  );
}

function MoverRow({ name, change, isPositive, price }: { name: string, change: string, isPositive: boolean, price: string }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          <TrendingUp size={16} className={isPositive ? '' : 'rotate-180'} />
        </div>
        <span className="font-medium text-sm text-[#333333]">{name}</span>
      </div>
      <div className="text-right">
        <div className="font-bold text-sm text-[#333333]">{price}</div>
        <div className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</div>
      </div>
    </div>
  );
}
