import { useState, useEffect } from "react";
import { ScreenHeader } from "../layout";
import { Screen } from "@/pages/ing-app";
import { TrendingUp, TrendingDown, Info, Star, Bell, Share2, MessageCircle, ChevronRight, ExternalLink, X, Plus, Minus, Check, AlertTriangle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import lionIcon from "@/assets/lion-logo.png";
import { addToPortfolio, removeFromPortfolio, getPortfolio, updateBalance, addTransaction, getBalance, formatCurrency, type Holding } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { BuySellDialog } from "./junior/buy-sell-dialog";

// Generate mock price data
const generatePriceData = (days: number, basePrice: number, volatility: number) => {
    const data = [];
    let price = basePrice;
    const now = new Date();

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const change = (Math.random() - 0.5) * volatility;
        price = Math.max(price + change, basePrice * 0.5);
        data.push({
            date: date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
            price: parseFloat(price.toFixed(2)),
        });
    }
    return data;
};

const STOCK_DATA = {
    ING: {
        name: "ING Groep N.V.",
        symbol: "ING",
        price: 12.45,
        change: 0.15,
        changePercent: 1.2,
        marketCap: "47.2B",
        pe: 7.8,
        dividend: "6.2%",
        high52: 15.80,
        low52: 9.20,
        volume: "12.5M",
        logo: "🦁",
        color: "#FF6200",
        description: "ING Groep N.V. ist ein global tätiges Finanzinstitut mit Sitz in den Niederlanden.",
        news: [
            { title: "ING erhöht Dividende um 15%", time: "vor 2 Stunden", sentiment: "positive" },
            { title: "EZB-Zinsentscheidung beeinflusst Bankensektor", time: "vor 5 Stunden", sentiment: "neutral" },
            { title: "ING expandiert Digitalangebot", time: "gestern", sentiment: "positive" },
        ]
    },
    AAPL: {
        name: "Apple Inc.",
        symbol: "AAPL",
        price: 178.50,
        change: 2.30,
        changePercent: 1.3,
        marketCap: "2.8T",
        pe: 28.5,
        dividend: "0.5%",
        high52: 199.62,
        low52: 164.08,
        volume: "48.2M",
        logo: "🍎",
        color: "#A2AAAD",
        description: "Apple Inc. entwickelt und verkauft Unterhaltungselektronik, Software und Online-Dienste.",
        news: [
            { title: "iPhone 16 Verkäufe übertreffen Erwartungen", time: "vor 3 Stunden", sentiment: "positive" },
            { title: "Apple investiert in KI-Startups", time: "vor 8 Stunden", sentiment: "positive" },
        ]
    },
    TSLA: {
        name: "Tesla Inc.",
        symbol: "TSLA",
        price: 245.60,
        change: -8.30,
        changePercent: -3.3,
        marketCap: "780B",
        pe: 65.2,
        dividend: "0%",
        high52: 299.29,
        low52: 138.80,
        volume: "98.5M",
        logo: "🚗",
        color: "#CC0000",
        description: "Tesla, Inc. entwickelt und produziert Elektrofahrzeuge und Energiespeicherlösungen.",
        news: [
            { title: "Tesla Produktion in China unter Druck", time: "vor 1 Stunde", sentiment: "negative" },
            { title: "Cybertruck-Auslieferungen beginnen", time: "vor 6 Stunden", sentiment: "positive" },
        ]
    },
    MSFT: {
        name: "Microsoft Corp.",
        symbol: "MSFT",
        price: 378.90,
        change: 4.15,
        changePercent: 1.1,
        marketCap: "2.8T",
        pe: 35.2,
        dividend: "0.8%",
        high52: 420.82,
        low52: 309.45,
        volume: "22.3M",
        logo: "💻",
        color: "#00A4EF",
        description: "Microsoft Corporation entwickelt Computersoftware, Unterhaltungselektronik und verwandte Dienste.",
        news: [
            { title: "Microsoft AI Copilot erreicht 100 Mio. Nutzer", time: "vor 3 Stunden", sentiment: "positive" },
            { title: "Azure Cloud-Umsatz steigt um 29%", time: "vor 7 Stunden", sentiment: "positive" },
        ]
    },
    VUSA: {
        name: "Vanguard S&P 500 ETF",
        symbol: "VUSA",
        price: 149.94,
        change: 1.20,
        changePercent: 0.8,
        marketCap: "32.5B",
        pe: 22.5,
        dividend: "1.4%",
        high52: 155.20,
        low52: 118.40,
        volume: "2.1M",
        logo: "📈",
        color: "#8B2131",
        description: "Vanguard S&P 500 UCITS ETF bildet den S&P 500 Index nach und investiert in die 500 größten US-Unternehmen.",
        news: [
            { title: "S&P 500 erreicht neues Allzeithoch", time: "vor 2 Stunden", sentiment: "positive" },
            { title: "ETF-Zuflüsse erreichen Rekordniveau", time: "vor 1 Tag", sentiment: "positive" },
        ]
    },
    NVDA: {
        name: "NVIDIA Corp.",
        symbol: "NVDA",
        price: 420.50,
        change: 13.20,
        changePercent: 3.2,
        marketCap: "1.03T",
        pe: 58.4,
        dividend: "0.04%",
        high52: 502.66,
        low52: 222.97,
        volume: "45.8M",
        logo: "🎮",
        color: "#76B900",
        description: "NVIDIA Corporation entwirft und entwickelt Grafikprozessoren und SoC-Einheiten für Gaming und Rechenzentren.",
        news: [
            { title: "NVIDIA meldet Rekordquartal dank KI-Boom", time: "vor 1 Stunde", sentiment: "positive" },
            { title: "H100-Chips weiterhin stark nachgefragt", time: "vor 5 Stunden", sentiment: "positive" },
        ]
    },
    META: {
        name: "Meta Platforms Inc.",
        symbol: "META",
        price: 485.20,
        change: 9.80,
        changePercent: 2.1,
        marketCap: "1.24T",
        pe: 26.8,
        dividend: "0.4%",
        high52: 531.49,
        low52: 274.38,
        volume: "18.7M",
        logo: "👓",
        color: "#0866FF",
        description: "Meta Platforms betreibt soziale Netzwerke wie Facebook, Instagram und WhatsApp.",
        news: [
            { title: "Meta Reality Labs zeigt neue VR-Brille", time: "vor 4 Stunden", sentiment: "positive" },
            { title: "Threads erreicht 200 Mio. Nutzer", time: "vor 1 Tag", sentiment: "positive" },
        ]
    },
    AMZN: {
        name: "Amazon.com Inc.",
        symbol: "AMZN",
        price: 178.90,
        change: 3.15,
        changePercent: 1.8,
        marketCap: "1.87T",
        pe: 42.3,
        dividend: "0%",
        high52: 201.20,
        low52: 118.35,
        volume: "52.4M",
        logo: "📦",
        color: "#FF9900",
        description: "Amazon.com ist ein E-Commerce- und Cloud-Computing-Unternehmen mit Hauptsitz in Seattle.",
        news: [
            { title: "AWS kündigt neue KI-Services an", time: "vor 2 Stunden", sentiment: "positive" },
            { title: "Prime Day bricht Verkaufsrekorde", time: "gestern", sentiment: "positive" },
        ]
    },
    // Junior Portfolio Stocks
    GAME: {
        name: "GameTech Corp",
        symbol: "GAME",
        price: 37.52,
        change: 2.02,
        changePercent: 5.7,
        marketCap: "2.4B",
        pe: 18.5,
        dividend: "0%",
        high52: 42.80,
        low52: 28.50,
        volume: "3.2M",
        logo: "🎮",
        color: "#6366F1",
        description: "GameTech Corp entwickelt beliebte Videospiele und Gaming-Plattformen für Jugendliche.",
        news: [
            { title: "GameTech startet neues Mobile Game", time: "vor 4 Stunden", sentiment: "positive" },
            { title: "Spielerzahlen steigen um 25%", time: "gestern", sentiment: "positive" },
        ]
    },
    SNKR: {
        name: "Sneaker World",
        symbol: "SNKR",
        price: 40.10,
        change: 11.60,
        changePercent: 40.7,
        marketCap: "8.5B",
        pe: 24.2,
        dividend: "0.5%",
        high52: 45.20,
        low52: 22.30,
        volume: "5.8M",
        logo: "👟",
        color: "#10B981",
        description: "Sneaker World ist ein führender Hersteller von trendigen Sportschuhen und Streetwear.",
        news: [
            { title: "Neue Sneaker-Kollektion ausverkauft", time: "vor 2 Stunden", sentiment: "positive" },
            { title: "Partnerschaft mit bekanntem Influencer", time: "vor 1 Tag", sentiment: "positive" },
        ]
    },
    BRGR: {
        name: "Burger King",
        symbol: "BRGR",
        price: 35.08,
        change: 17.08,
        changePercent: 94.9,
        marketCap: "12.3B",
        pe: 19.8,
        dividend: "2.1%",
        high52: 38.50,
        low52: 15.20,
        volume: "8.4M",
        logo: "🍔",
        color: "#DC2626",
        description: "Burger King ist eine internationale Fast-Food-Kette bekannt für Flame-grilled Burger.",
        news: [
            { title: "Neuer Plant-Based Whopper sehr beliebt", time: "vor 3 Stunden", sentiment: "positive" },
            { title: "Expansion in neue Märkte geplant", time: "vor 1 Tag", sentiment: "positive" },
        ]
    }
};

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

export function StockDetailScreen({
    symbol = "ING",
    onBack,
    onLeoClick,
    isJunior = false,
}: {
    symbol?: string;
    onBack: () => void;
    onLeoClick?: () => void;
    isJunior?: boolean;
}) {
    const [timeRange, setTimeRange] = useState<TimeRange>("1M");
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
    const [quantity, setQuantity] = useState(1);
    const [orderStep, setOrderStep] = useState<"amount" | "confirm" | "success">("amount");
    const [selectedNews, setSelectedNews] = useState<{ title: string; time: string; sentiment: string } | null>(null);
    const { toast } = useToast();

    const stock = STOCK_DATA[symbol as keyof typeof STOCK_DATA] || STOCK_DATA.ING;
    const isPositive = stock.changePercent >= 0;

    // Generate chart data based on time range
    const chartDays = { "1D": 1, "1W": 7, "1M": 30, "3M": 90, "1Y": 365, "ALL": 730 };
    const priceData = generatePriceData(chartDays[timeRange], stock.price, stock.price * 0.02);

    const handleOpenOrder = (type: "buy" | "sell") => {
        setOrderType(type);
        setQuantity(1);
        setOrderStep("amount");
        setShowOrderModal(true);
    };

    const handleConfirmOrder = () => {
        // Actually process the trade
        if (orderType === "buy") {
            // Add to portfolio
            addToPortfolio({
                symbol: stock.symbol,
                name: stock.name,
                shares: quantity,
                avgPrice: stock.price,
                currentPrice: stock.price,
            });

            // Deduct from account balance
            if (!isJunior) {
                updateBalance("girokonto", -totalCost);
                addTransaction({
                    type: "investment",
                    amount: -totalCost,
                    currency: "EUR",
                    from: "Girokonto",
                    to: `Kauf ${quantity}x ${stock.symbol}`,
                    reference: `Aktienkauf ${stock.name}`,
                    date: new Date().toISOString().split("T")[0],
                    status: "completed",
                });
            }
        } else {
            // Sell from portfolio
            removeFromPortfolio(stock.symbol, quantity);

            // Add to account balance
            if (!isJunior) {
                updateBalance("girokonto", totalCost);
                addTransaction({
                    type: "investment",
                    amount: totalCost,
                    currency: "EUR",
                    from: `Verkauf ${quantity}x ${stock.symbol}`,
                    to: "Girokonto",
                    reference: `Aktienverkauf ${stock.name}`,
                    date: new Date().toISOString().split("T")[0],
                    status: "completed",
                });
            }
        }

        setOrderStep("success");
    };

    const handleCloseOrder = () => {
        setShowOrderModal(false);
        setOrderStep("amount");
        setQuantity(1);
    };

    const totalCost = quantity * stock.price;
    const fees = 0; // ING often has no trading fees

    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader
                title={stock.symbol}
                onBack={onBack}
                rightAction={
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsWatchlisted(!isWatchlisted)}
                            className={`p-2 rounded-full transition-colors ${isWatchlisted ? 'text-yellow-500' : 'text-gray-400'}`}
                            title={isWatchlisted ? "Von Watchlist entfernen" : "Zur Watchlist hinzufügen"}
                        >
                            <Star size={20} fill={isWatchlisted ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={() => toast({ title: "Teilen", description: `${stock.symbol} Link wurde kopiert!` })}
                            className="p-2 text-gray-400 rounded-full"
                            title="Teilen"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                }
            />

            <div className="flex-1 overflow-y-auto">
                {/* Stock Header */}
                <div className="bg-white px-4 py-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${stock.color}20` }}>
                            {stock.logo}
                        </div>
                        <div>
                            <div className="font-bold text-lg text-[#333333]">{stock.name}</div>
                            <div className="text-sm text-gray-500">{stock.symbol} • XETRA</div>
                        </div>
                    </div>

                    <div className="flex items-end gap-3">
                        <div className="text-4xl font-bold text-[#333333]">€{stock.price.toFixed(2)}</div>
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white mt-2 p-4">
                    {/* Time Range Selector */}
                    <div className="flex justify-between mb-4">
                        {(["1D", "1W", "1M", "3M", "1Y", "ALL"] as TimeRange[]).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${timeRange === range
                                    ? 'bg-[#FF6200] text-white'
                                    : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={priceData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#999' }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#999' }}
                                    width={40}
                                    tickFormatter={(v) => `€${v}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value: number) => [`€${value.toFixed(2)}`, 'Kurs']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={isPositive ? "#22c55e" : "#ef4444"}
                                    strokeWidth={2}
                                    fill="url(#colorPrice)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white mt-2 p-4 flex gap-3">
                    {isJunior ? (
                        <>
                            <button
                                onClick={() => handleOpenOrder("buy")}
                                className="flex-1 bg-[#FF6200] text-white py-3 rounded-xl font-bold hover:bg-[#e55800] transition-colors"
                            >
                                Virtuell kaufen
                            </button>
                            <button
                                onClick={() => setIsWatchlisted(!isWatchlisted)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                {isWatchlisted ? "★ In Watchlist" : "Watchlist"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleOpenOrder("buy")}
                                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
                            >
                                Kaufen
                            </button>
                            <button
                                onClick={() => handleOpenOrder("sell")}
                                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                            >
                                Verkaufen
                            </button>
                        </>
                    )}
                </div>

                {/* Key Metrics */}
                <div className="bg-white mt-2 p-4">
                    <h3 className="font-bold text-[#333333] mb-3 flex items-center gap-2">
                        Kennzahlen
                        <button className="text-gray-400" title="Info über Kennzahlen">
                            <Info size={16} />
                        </button>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <MetricItem label="Marktkapitalisierung" value={stock.marketCap} />
                        <MetricItem label="KGV" value={stock.pe.toString()} hint="Kurs-Gewinn-Verhältnis" />
                        <MetricItem label="Dividendenrendite" value={stock.dividend} />
                        <MetricItem label="Volumen" value={stock.volume} />
                        <MetricItem label="52W Hoch" value={`€${stock.high52}`} />
                        <MetricItem label="52W Tief" value={`€${stock.low52}`} />
                    </div>
                </div>

                {/* Leo AI Card */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 mx-4 mt-4 p-4 rounded-2xl border border-orange-100">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0">
                            <img src={lionIcon} alt="Leo" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-orange-700 text-sm mb-1">Leo's Einschätzung</div>
                            <p className="text-xs text-orange-600 leading-relaxed mb-3">
                                {stock.symbol} ist {isPositive ? 'heute im Plus' : 'heute im Minus'}.
                                {isJunior
                                    ? " Möchtest du ein Quiz über diese Aktie machen? 🧠"
                                    : " Soll ich dir erklären, wie diese Aktie in dein Portfolio passt?"}
                            </p>
                            <button
                                onClick={onLeoClick}
                                className="flex items-center gap-2 text-xs font-bold text-[#FF6200] hover:underline"
                            >
                                <MessageCircle size={14} />
                                {isJunior ? "Quiz starten" : "Mit Leo sprechen"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* News Section */}
                <div className="bg-white mt-4 p-4 mb-4">
                    <h3 className="font-bold text-[#333333] mb-3 flex items-center justify-between">
                        <span>News zu {stock.symbol}</span>
                        <ChevronRight size={20} className="text-gray-400" />
                    </h3>
                    <div className="space-y-3">
                        {stock.news.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedNews(item)}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl w-full text-left hover:bg-gray-100 transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${item.sentiment === 'positive' ? 'bg-green-500' :
                                    item.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                                    }`} />
                                <div className="flex-1">
                                    <div className="font-medium text-sm text-[#333333]">{item.title}</div>
                                    <div className="text-xs text-gray-400 mt-1">{item.time}</div>
                                </div>
                                <ExternalLink size={16} className="text-gray-400 shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* News Article Modal */}
            <AnimatePresence>
                {selectedNews && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setSelectedNews(null)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${selectedNews.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                    selectedNews.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                    {selectedNews.sentiment === 'positive' ? '📈 Positiv' :
                                        selectedNews.sentiment === 'negative' ? '📉 Negativ' : '📊 Neutral'}
                                </span>
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                    aria-label="Schließen"
                                >
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>

                            <h2 className="text-xl font-bold text-[#333333] mb-2">{selectedNews.title}</h2>
                            <div className="text-sm text-gray-500 mb-6">{selectedNews.time} • {stock.symbol}</div>

                            {/* Mock article content */}
                            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                <p>
                                    {selectedNews.sentiment === 'positive'
                                        ? `Die jüngsten Entwicklungen bei ${stock.name} sorgen für Optimismus an den Märkten. Analysten sehen weiteres Wachstumspotenzial und empfehlen die Aktie zum Kauf.`
                                        : selectedNews.sentiment === 'negative'
                                            ? `${stock.name} steht vor Herausforderungen. Experten raten zur Vorsicht, beobachten aber die weitere Entwicklung genau.`
                                            : `Die neuesten Nachrichten zu ${stock.name} werden von Marktteilnehmern aufmerksam verfolgt. Die Auswirkungen auf den Aktienkurs bleiben abzuwarten.`
                                    }
                                </p>
                                <p>
                                    Die Aktie notiert aktuell bei €{stock.price.toFixed(2)}, was einem {isPositive ? 'Plus' : 'Minus'} von {Math.abs(stock.changePercent).toFixed(2)}% entspricht.
                                </p>
                                <p className="text-xs text-gray-400 italic">
                                    Hinweis: Dies ist simulierter Nachrichteninhalt zu Demonstrationszwecken.
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedNews(null)}
                                className="w-full mt-6 bg-[#FF6200] text-white py-3 rounded-xl font-bold"
                            >
                                Schließen
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Order Modal */}
            {isJunior ? (
                <BuySellDialog
                    isOpen={showOrderModal}
                    onClose={handleCloseOrder}
                    mode={orderType}
                    stock={stock}
                />
            ) : (
                <AnimatePresence>
                    {showOrderModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 z-50 flex items-end"
                            onClick={handleCloseOrder}
                        >
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-white rounded-t-3xl p-6 pb-10"
                            >
                                {/* Amount Step */}
                                {orderStep === "amount" && (
                                    <>
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold text-[#333333]">
                                                {orderType === "buy" ? "Kaufen" : "Verkaufen"}
                                            </h2>
                                            <button
                                                onClick={handleCloseOrder}
                                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                                aria-label="Schließen"
                                            >
                                                <X size={18} className="text-gray-500" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                                            <span className="text-3xl">{stock.logo}</span>
                                            <div>
                                                <div className="font-bold text-[#333333]">{stock.name}</div>
                                                <div className="text-sm text-gray-500">€{stock.price.toFixed(2)} pro Aktie</div>
                                            </div>
                                        </div>

                                        <div className="text-center mb-6">
                                            <label className="text-sm text-gray-500 block mb-3">Anzahl Aktien</label>
                                            <div className="flex items-center justify-center gap-6">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                    aria-label="Weniger"
                                                >
                                                    <Minus size={20} className="text-gray-600" />
                                                </button>
                                                <div className="text-5xl font-bold text-[#333333] w-24">{quantity}</div>
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                    aria-label="Mehr"
                                                >
                                                    <Plus size={20} className="text-gray-600" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Summe</span>
                                                <span className="font-bold">€{totalCost.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Ordergebühr</span>
                                                <span className="font-bold text-green-600">€0,00</span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between">
                                                <span className="font-bold text-[#333333]">Gesamt</span>
                                                <span className="font-bold text-xl text-[#333333]">€{totalCost.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setOrderStep("confirm")}
                                            className={`w-full py-4 rounded-xl font-bold transition-colors ${orderType === "buy"
                                                ? "bg-green-500 text-white hover:bg-green-600"
                                                : "bg-red-500 text-white hover:bg-red-600"
                                                }`}
                                        >
                                            Weiter zur Bestätigung
                                        </button>
                                    </>
                                )}

                                {/* Confirm Step */}
                                {orderStep === "confirm" && (
                                    <>
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold text-[#333333]">Order bestätigen</h2>
                                            <button
                                                onClick={handleCloseOrder}
                                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                                aria-label="Schließen"
                                            >
                                                <X size={18} className="text-gray-500" />
                                            </button>
                                        </div>

                                        <div className={`p-4 rounded-xl mb-6 ${orderType === "buy" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{stock.logo}</span>
                                                <div>
                                                    <div className="font-bold text-[#333333]">
                                                        {quantity}x {stock.symbol} {orderType === "buy" ? "kaufen" : "verkaufen"}
                                                    </div>
                                                    <div className="text-2xl font-bold mt-1 text-[#333333]">
                                                        €{totalCost.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200 mb-6">
                                            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                            <p className="text-sm text-amber-700">
                                                Mit dem Klick auf "Order ausführen" bestätigst du den {orderType === "buy" ? "Kauf" : "Verkauf"}
                                                zum aktuellen Marktpreis. Der finale Preis kann leicht abweichen.
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setOrderStep("amount")}
                                                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                            >
                                                Zurück
                                            </button>
                                            <button
                                                onClick={handleConfirmOrder}
                                                className={`flex-1 py-4 rounded-xl font-bold transition-colors ${orderType === "buy"
                                                    ? "bg-green-500 text-white hover:bg-green-600"
                                                    : "bg-red-500 text-white hover:bg-red-600"
                                                    }`}
                                            >
                                                Order ausführen
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Success Step */}
                                {orderStep === "success" && (
                                    <div className="text-center py-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", delay: 0.1 }}
                                            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${orderType === "buy" ? "bg-green-100" : "bg-red-100"
                                                }`}
                                        >
                                            <Check size={40} className={orderType === "buy" ? "text-green-600" : "text-red-600"} />
                                        </motion.div>

                                        <h2 className="text-2xl font-bold text-[#333333] mb-2">
                                            Order ausgeführt!
                                        </h2>
                                        <p className="text-gray-500 mb-6">
                                            Du hast {quantity} {stock.symbol} Aktie{quantity > 1 ? "n" : ""}
                                            {orderType === "buy" ? " gekauft" : " verkauft"} für €{totalCost.toFixed(2)}.
                                        </p>

                                        <button
                                            onClick={handleCloseOrder}
                                            className="w-full bg-[#FF6200] text-white py-4 rounded-xl font-bold hover:bg-[#e55800] transition-colors"
                                        >
                                            Fertig
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}

function MetricItem({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <div className="p-3 bg-gray-50 rounded-xl">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                {label}
                {hint && (
                    <button className="text-gray-400" title={hint}>
                        <Info size={12} />
                    </button>
                )}
            </div>
            <div className="font-bold text-[#333333]">{value}</div>
        </div>
    );
}
