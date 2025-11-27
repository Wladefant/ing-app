import { useState } from "react";
import { ScreenHeader } from "../layout";
import { Screen } from "@/pages/ing-app";
import { TrendingUp, TrendingDown, Info, Star, Bell, Share2, MessageCircle, ChevronRight, ExternalLink } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import lionIcon from "@assets/generated_images/minimalist_orange_app_icon_with_white_lion.png";

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
    
    const stock = STOCK_DATA[symbol as keyof typeof STOCK_DATA] || STOCK_DATA.ING;
    const isPositive = stock.changePercent >= 0;
    
    // Generate chart data based on time range
    const chartDays = { "1D": 1, "1W": 7, "1M": 30, "3M": 90, "1Y": 365, "ALL": 730 };
    const priceData = generatePriceData(chartDays[timeRange], stock.price, stock.price * 0.02);

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
                        >
                            <Star size={20} fill={isWatchlisted ? "currentColor" : "none"} />
                        </button>
                        <button className="p-2 text-gray-400 rounded-full">
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
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${
                            isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
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
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    timeRange === range 
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
                                        <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
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
                            <button className="flex-1 bg-[#FF6200] text-white py-3 rounded-xl font-bold hover:bg-[#e55800] transition-colors">
                                Virtuell kaufen
                            </button>
                            <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                Watchlist
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">
                                Kaufen
                            </button>
                            <button className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">
                                Verkaufen
                            </button>
                        </>
                    )}
                </div>

                {/* Key Metrics */}
                <div className="bg-white mt-2 p-4">
                    <h3 className="font-bold text-[#333333] mb-3 flex items-center gap-2">
                        Kennzahlen
                        <button className="text-gray-400">
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
                            <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain brightness-0 invert" />
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
                            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                    item.sentiment === 'positive' ? 'bg-green-500' :
                                    item.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                                }`} />
                                <div className="flex-1">
                                    <div className="font-medium text-sm text-[#333333]">{item.title}</div>
                                    <div className="text-xs text-gray-400 mt-1">{item.time}</div>
                                </div>
                                <ExternalLink size={16} className="text-gray-400 shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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
