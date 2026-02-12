import { useState, useEffect, useCallback } from "react";
import { ScreenHeader, BottomNav } from "../layout";
import { Screen } from "@/pages/ing-app";
import { PieChart, ArrowRightLeft, Search, Info, User, TrendingUp, Lightbulb, X, Plus, Eye, Minus, ShoppingCart, Newspaper, Briefcase, Bookmark, MoreVertical, Calendar, BarChart3, Target, Repeat, MessageCircle, Loader2, Sparkles, Send } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPortfolio, addToPortfolio, removeFromPortfolio, updateBalance, addTransaction, type Holding, formatCurrency } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { StockSearchModal } from "@/components/ui/stock-search-modal";
import { STOCK_DATABASE } from "@/lib/stock-data";
import { sendMessageToOpenAI } from "@/lib/openai";
import lionIcon from "@/assets/lion-logo.png";

const data = [
  { name: 'Jan', value: 5630 },
  { name: 'Feb', value: 8000 },
  { name: 'Mar', value: 10000 },
  { name: 'Apr', value: 9500 },
  { name: 'May', value: 11000 },
  { name: 'Jun', value: 12963 },
  { name: 'Jul', value: 12704 },
];

// Watchlist
// Watchlist
const WATCHLIST_SYMBOLS = ["TSLA", "NVDA", "AMZN", "META"];
const INITIAL_WATCHLIST = STOCK_DATABASE.filter(s => WATCHLIST_SYMBOLS.includes(s.symbol));

// Market News
const MARKET_NEWS = [
  { id: 1, title: "Apple kündigt neues iPhone 16 an", source: "Reuters", time: "vor 2 Std", sentiment: "positive" },
  { id: 2, title: "EZB erhöht Leitzins erneut", source: "Handelsblatt", time: "vor 4 Std", sentiment: "neutral" },
  { id: 3, title: "NVIDIA meldet Rekordgewinn", source: "Bloomberg", time: "vor 6 Std", sentiment: "positive" },
  { id: 4, title: "Tesla Aktie unter Druck nach Gewinnwarnung", source: "CNBC", time: "vor 8 Std", sentiment: "negative" },
];

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
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeTab, setActiveTab] = useState<InvestTab>("portfolio");
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);
  const [portfolioHoldings, setPortfolioHoldings] = useState<Holding[]>([]);
  const [showSparplanModal, setShowSparplanModal] = useState(false);
  const [showAnalyseModal, setShowAnalyseModal] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  // Load portfolio from storage on mount
  useEffect(() => {
    const loadPortfolio = () => {
      const holdings = getPortfolio();
      setPortfolioHoldings(holdings);
    };

    loadPortfolio();

    // Refresh on focus
    const handleFocus = () => loadPortfolio();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleFocus);
    };
  }, []);

  const handleSelectStock = (symbol: string) => {
    // Navigate to stock detail screen
    localStorage.setItem("selectedStock", symbol);
    onNavigate("stock-detail");
  };



  const addToWatchlist = (stock: any) => {
    if (!watchlist.find(w => w.symbol === stock.symbol)) {
      setWatchlist([...watchlist, stock]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(w => w.symbol !== symbol));
  };

  const { toast } = useToast();

  // Calculate total portfolio value and performance from storage data
  const totalValue = portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalCost = portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.avgPrice), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : "0.00";

  // AI Portfolio Analysis
  const generateAIAnalysis = useCallback(async () => {
    setAiAnalysisLoading(true);
    setAiAnalysis("");
    try {
      const holdingsSummary = portfolioHoldings.map(h =>
        `${h.symbol}: ${h.shares} Stk., EK ${h.avgPrice.toFixed(2)}€, Aktuell ${h.currentPrice.toFixed(2)}€, ${((h.currentPrice - h.avgPrice) / h.avgPrice * 100).toFixed(1)}%`
      ).join("\n");

      const response = await sendMessageToOpenAI(
        [{ id: "analysis", sender: "user", text: `Analysiere mein Portfolio:\n${holdingsSummary}\n\nGesamtwert: ${totalValue.toFixed(2)}€, Gewinn/Verlust: ${totalGain.toFixed(2)}€ (${totalGainPercent}%)\n\nGib eine kurze professionelle Einschätzung auf Deutsch: Diversifikation, Risiken, Chancen und 2-3 konkrete Empfehlungen. Nutze Emojis sparsam.`, timestamp: Date.now() }],
        "Du bist ein erfahrener Finanzberater bei ING. Analysiere das Portfolio professionell aber verständlich. Antworte auf Deutsch, kurz und prägnant.",
        "adult"
      );
      setAiAnalysis(response.response);
    } catch {
      setAiAnalysis("Die KI-Analyse ist momentan nicht verfügbar. Bitte versuche es später erneut.");
    } finally {
      setAiAnalysisLoading(false);
    }
  }, [portfolioHoldings, totalValue, totalGain, totalGainPercent]);

  // AI Chat for invest questions
  const handleSendInvestAI = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setAiMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setAiTyping(true);
    try {
      const holdingsSummary = portfolioHoldings.map(h => `${h.symbol}: ${h.shares} Stk., ${h.currentPrice.toFixed(2)}€`).join(", ");
      const context = `Der Nutzer hat ein Depot mit Gesamtwert ${totalValue.toFixed(2)}€ (${totalGainPercent}% P/L). Holdings: ${holdingsSummary || "keine"}. Beantworte Investment-Fragen auf Deutsch, kurz und hilfreich.`;
      const response = await sendMessageToOpenAI(
        [{ id: "q", sender: "user", text: userMsg, timestamp: Date.now() }],
        context,
        "adult"
      );
      setAiMessages(prev => [...prev, { role: "ai", text: response.response }]);
    } catch {
      setAiMessages(prev => [...prev, { role: "ai", text: "Entschuldigung, da ist etwas schiefgelaufen. Bitte versuche es erneut." }]);
    } finally {
      setAiTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      {/* Header with Tabs */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="font-bold text-lg text-[#FF6200]">Investieren</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSearchModal(true)}
              className="w-10 h-10 rounded-full bg-[#FF6200]/10 hover:bg-[#FF6200]/20 flex items-center justify-center transition-colors"
              title="Aktie suchen"
              aria-label="Aktie suchen"
            >
              <Search size={20} className="text-[#FF6200]" />
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
                <span className="text-xs text-gray-500">{portfolioHoldings.length} Werte</span>
              </div>
              <div className="divide-y divide-gray-100">
                {portfolioHoldings.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-3">📈</div>
                    <p>Noch keine Positionen vorhanden.</p>
                    <button
                      onClick={() => setShowSearchModal(true)}
                      className="mt-4 text-[#FF6200] font-bold"
                    >
                      Erste Aktie kaufen
                    </button>
                  </div>
                ) : (
                  portfolioHoldings.map((holding) => {
                    const value = holding.shares * holding.currentPrice;
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
                          <div className="font-bold text-[#333333]">{value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</div>
                          <div className={`text-xs font-bold ${gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {gain >= 0 ? '+' : ''}{gain.toFixed(2)}€ ({gain >= 0 ? '+' : ''}{gainPercent}%)
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowSearchModal(true)}
                className="bg-[#33307E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Kaufen
              </button>
              <button
                onClick={() => onNavigate("orders")}
                className="bg-white text-[#333333] py-3 rounded-xl font-bold border border-gray-200 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft size={18} />
                Orders
              </button>
              <button
                onClick={() => setShowSparplanModal(true)}
                className="bg-white text-[#333333] py-3 rounded-xl font-bold border border-gray-200 flex items-center justify-center gap-2"
              >
                <Repeat size={18} />
                Sparplan
              </button>
              <button
                onClick={() => { setShowAnalyseModal(true); if (!aiAnalysis && !aiAnalysisLoading) generateAIAnalysis(); }}
                className="bg-white text-[#333333] py-3 rounded-xl font-bold border border-gray-200 flex items-center justify-center gap-2"
              >
                <BarChart3 size={18} />
                KI-Analyse
              </button>
            </div>

            {/* Leo Smart Agent Card */}
            <div className="bg-gradient-to-br from-[#33307E] to-[#4A47A3] p-4 rounded-2xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                  <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
                </div>
                <span className="font-bold text-sm">Leo Investment-Berater</span>
                <span className="bg-white/20 text-[10px] font-black px-2 py-0.5 rounded-full ml-auto">KI</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed mb-3 relative z-10">
                {portfolioHoldings.length > 0
                  ? `Dein Portfolio hat ${portfolioHoldings.length} Positionen mit ${totalGain >= 0 ? 'einem Gewinn' : 'einem Verlust'} von ${totalGain.toFixed(2)}€. Soll ich analysieren?`
                  : "Du hast noch keine Positionen. Soll ich dir beim Einstieg helfen?"}
              </p>
              <div className="flex gap-2 relative z-10">
                <button
                  onClick={() => {
                    setShowAIChat(true);
                    if (aiMessages.length === 0) {
                      setAiMessages([{ role: "ai", text: portfolioHoldings.length > 0
                        ? `Ich habe dein Portfolio analysiert: ${portfolioHoldings.length} Positionen, Gesamtwert ${totalValue.toFixed(2)}€. Was möchtest du wissen? Ich kann dir bei Diversifikation, Risikobewertung oder neuen Investment-Ideen helfen.`
                        : "Willkommen beim Investment-Bereich! Ich bin Leo, dein KI-Berater. Hast du Fragen zu Aktien, ETFs oder zum Einstieg in den Aktienmarkt?"
                      }]);
                    }
                  }}
                  className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-white/30 transition-colors"
                >
                  <MessageCircle size={12} />
                  Leo fragen
                </button>
                <button
                  onClick={() => { setShowAnalyseModal(true); if (!aiAnalysis && !aiAnalysisLoading) generateAIAnalysis(); }}
                  className="bg-[#FF6200] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Sparkles size={12} />
                  KI-Analyse
                </button>
              </div>
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
                  onClick={() => setShowSearchModal(true)}
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
                    onClick={() => setShowSearchModal(true)}
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
                          <div className={`text-xs font-bold ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
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
                {STOCK_DATABASE.slice(0, 3).sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).map((stock) => (
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
                {totalGain >= 0
                  ? "Dein Portfolio ist gut diversifiziert! 🌍 Tech-Aktien sind diese Woche gestiegen. NVIDIA meldet Rekordgewinne."
                  : "Die Märkte sind aktuell etwas volatil. 📉 Aber keine Sorge, langfristig zahlt sich Geduld aus. Sparpläne nutzen den Cost-Average-Effekt."}
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

      {/* Stock Search Modal */}
      <StockSearchModal
        open={showSearchModal}
        onOpenChange={setShowSearchModal}
        onSelectStock={handleSelectStock}
      />

      {/* Sparplan Modal */}
      <AnimatePresence>
        {showSparplanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowSparplanModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Repeat size={24} className="text-[#FF6200]" />
                  <h2 className="text-xl font-bold text-[#333333]">Sparplan erstellen</h2>
                </div>
                <button
                  onClick={() => setShowSparplanModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                  aria-label="Schließen"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center text-white shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-orange-700 text-sm mb-1">Automatisch investieren</div>
                    <p className="text-xs text-orange-600 leading-relaxed">
                      Mit einem Sparplan investierst du regelmäßig einen festen Betrag - ganz automatisch!
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="text-sm text-gray-500 block mb-2">Wertpapier auswählen</label>
                  <button
                    onClick={() => { setShowSparplanModal(false); setShowSearchModal(true); }}
                    className="w-full p-3 bg-white rounded-lg border border-gray-200 text-left flex items-center justify-between"
                  >
                    <span className="text-gray-400">ETF oder Aktie suchen...</span>
                    <Search size={18} className="text-gray-400" />
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="text-sm text-gray-500 block mb-2">Sparbetrag</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="50"
                      className="flex-1 p-3 bg-white rounded-lg border border-gray-200 font-bold text-lg"
                    />
                    <span className="text-lg font-bold text-gray-500">€ / Monat</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="text-sm text-gray-500 block mb-2">Ausführung</label>
                  <div className="flex gap-2">
                    {["1.", "15."].map((day) => (
                      <button key={day} className="flex-1 p-3 bg-white rounded-lg border border-gray-200 font-bold">
                        {day} des Monats
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  toast({ title: "Sparplan erstellt!", description: "Dein Sparplan ist nun aktiv." });
                  setShowSparplanModal(false);
                }}
                className="w-full bg-[#FF6200] text-white py-4 rounded-xl font-bold"
              >
                Sparplan starten
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyse Modal - AI Powered */}
      <AnimatePresence>
        {showAnalyseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowAnalyseModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <BarChart3 size={24} className="text-[#33307E]" />
                  <h2 className="text-xl font-bold text-[#333]">KI Portfolio-Analyse</h2>
                  <span className="bg-[#33307E] text-white text-[9px] font-black px-2 py-0.5 rounded-full">KI</span>
                </div>
                <button onClick={() => setShowAnalyseModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Portfolio Summary */}
              <div className={`p-4 rounded-xl border mb-4 ${totalGain >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${totalGain >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`font-bold ${totalGain >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {totalGain >= 0 ? 'Portfolio im Plus' : 'Portfolio im Minus'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gesamtwert</span>
                  <span className="font-bold">{totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Gewinn/Verlust</span>
                  <span className={`font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalGain >= 0 ? '+' : ''}{totalGain.toFixed(2)} € ({totalGainPercent}%)
                  </span>
                </div>
              </div>

              {/* Allocation from actual holdings */}
              {portfolioHoldings.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
                  <h3 className="font-bold text-[#333] mb-3">Deine Positionen</h3>
                  <div className="space-y-2">
                    {portfolioHoldings.map((h) => {
                      const holdingValue = h.shares * h.currentPrice;
                      const holdingPercent = totalValue > 0 ? ((holdingValue / totalValue) * 100).toFixed(1) : "0";
                      const holdingGain = ((h.currentPrice - h.avgPrice) / h.avgPrice * 100).toFixed(1);
                      return (
                        <div key={h.symbol} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-[#33307E]">
                              {h.symbol.substring(0, 2)}
                            </div>
                            <div>
                              <span className="font-bold text-sm text-[#333]">{h.symbol}</span>
                              <span className="text-xs text-gray-400 ml-2">{holdingPercent}%</span>
                            </div>
                          </div>
                          <span className={`text-xs font-bold ${Number(holdingGain) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {Number(holdingGain) >= 0 ? '+' : ''}{holdingGain}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              <div className="bg-gradient-to-br from-[#33307E]/5 to-[#4A47A3]/10 p-4 rounded-xl border border-[#33307E]/20 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center overflow-hidden">
                    <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="font-bold text-sm text-[#333]">Leo's KI-Einschätzung</span>
                </div>
                {aiAnalysisLoading ? (
                  <div className="flex items-center gap-3 py-4">
                    <Loader2 size={20} className="animate-spin text-[#FF6200]" />
                    <span className="text-sm text-gray-500">Leo analysiert dein Portfolio...</span>
                  </div>
                ) : aiAnalysis ? (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{aiAnalysis}</p>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-3">Lass Leo dein Portfolio mit KI analysieren</p>
                    <button onClick={generateAIAnalysis}
                      className="bg-[#FF6200] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mx-auto">
                      <Sparkles size={14} /> Analyse starten
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setAiAnalysis(""); generateAIAnalysis(); }}
                  disabled={aiAnalysisLoading}
                  className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  <Repeat size={16} /> Neu analysieren
                </button>
                <button onClick={() => setShowAnalyseModal(false)}
                  className="flex-1 bg-[#33307E] text-white py-3.5 rounded-xl font-bold">
                  Schließen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Investment Chat */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-50 flex items-end">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full bg-white rounded-t-3xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center overflow-hidden">
                    <img src={lionIcon} alt="Leo" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#333]">Leo Investment-Berater</div>
                    <div className="text-[10px] text-gray-400">KI-gestützte Anlageberatung</div>
                  </div>
                </div>
                <button onClick={() => setShowAIChat(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {aiMessages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-[#FF6200] text-white rounded-br-md" : "bg-gray-100 text-[#333] rounded-bl-md"
                    }`}>{msg.text}</div>
                  </motion.div>
                ))}
                {aiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity, type: "tween" }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
                {["ETF-Empfehlung?", "Risiko senken?", "Mehr diversifizieren?", "Sparplan sinnvoll?"].map(q => (
                  <button key={q} onClick={() => setAiInput(q)}
                    className="bg-gray-100 text-xs text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
                <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendInvestAI(); }}
                  placeholder="Frage zum Investieren..."
                  className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6200]/20" />
                <button onClick={handleSendInvestAI} disabled={!aiInput.trim()}
                  className="w-10 h-10 bg-[#FF6200] rounded-xl flex items-center justify-center disabled:opacity-40 transition-opacity">
                  <Send size={18} className="text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
