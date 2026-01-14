import { useState, useEffect } from "react";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { TrendingUp, TrendingDown, Info, RefreshCw, Search, Plus, Wallet } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { StockSearchModal } from "@/components/ui/stock-search-modal";
import { getJuniorPortfolio, type JuniorPortfolio } from "@/lib/storage";

const MOCK_DATA = [
    { name: 'Mo', value: 100 },
    { name: 'Di', value: 105 },
    { name: 'Mi', value: 102 },
    { name: 'Do', value: 108 },
    { name: 'Fr', value: 115 },
    { name: 'Sa', value: 112 },
    { name: 'So', value: 120 },
];

export function JuniorInvestmentScreen({
    onBack,
    onNavigate,
    onLeoClick
}: {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
    onLeoClick?: () => void;
}) {
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [portfolio, setPortfolio] = useState<JuniorPortfolio | null>(null);

    useEffect(() => {
        const loadPortfolio = () => {
            const data = getJuniorPortfolio();
            setPortfolio(data);
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
        localStorage.setItem("selectedStock", symbol);
        onNavigate("stock-detail");
    };

    // Calculate portfolio stats
    const totalValue = portfolio?.holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0) || 0;
    const totalInvested = portfolio?.holdings.reduce((sum, h) => sum + (h.shares * h.buyPrice), 0) || 0;
    const totalGain = totalValue - totalInvested;
    const gainPercent = totalInvested > 0 ? ((totalGain / totalInvested) * 100) : 0;

    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader
                title="Mein Portfolio"
                onBack={onBack}
                rightAction={
                    <button
                        onClick={() => setShowSearchModal(true)}
                        className="w-10 h-10 rounded-full bg-[#FF6200]/10 hover:bg-[#FF6200]/20 flex items-center justify-center transition-colors"
                        title="Aktie suchen"
                    >
                        <Search size={20} className="text-[#FF6200]" />
                    </button>
                }
            />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Play Money Badge */}
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 rounded-xl text-white shadow-md">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🎮</span>
                        <span className="text-sm font-medium opacity-90">Spielgeld</span>
                    </div>
                    <div className="text-xl font-bold font-mono">
                        v€{(portfolio?.cashBalance || 500).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                {/* Portfolio Value */}
                <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                    <div className="text-gray-500 text-sm mb-1">Portfolio Gesamtwert</div>
                    <div className="text-4xl font-bold text-[#333333] mb-2">
                        €{totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${gainPercent >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {gainPercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(1)}% ({totalGain >= 0 ? '+' : ''}€{totalGain.toFixed(2)})</span>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-4 rounded-2xl shadow-sm h-48">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-[#333333]">Verlauf (7 Tage)</span>
                        <button
                            className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                            title="Aktualisieren"
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_DATA}>
                            <Line type="monotone" dataKey="value" stroke="#FF6200" strokeWidth={3} dot={{ r: 4, fill: '#FF6200', strokeWidth: 2, stroke: '#fff' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                labelStyle={{ color: '#999' }}
                                formatter={(value: number) => [`€${value.toFixed(2)}`, 'Wert']}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Holdings */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <div className="font-bold text-[#333333]">Deine Investments</div>
                        <button
                            onClick={() => setShowSearchModal(true)}
                            className="text-xs text-[#FF6200] font-bold flex items-center gap-1"
                        >
                            <Plus size={14} /> Kaufen
                        </button>
                    </div>

                    {(!portfolio?.holdings || portfolio.holdings.length === 0) ? (
                        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                            <div className="text-4xl mb-3">📈</div>
                            <p className="text-gray-500 mb-4">Noch keine Investments vorhanden</p>
                            <button
                                onClick={() => setShowSearchModal(true)}
                                className="text-[#FF6200] font-bold"
                            >
                                Erste Aktie kaufen
                            </button>
                        </div>
                    ) : (
                        portfolio.holdings.map((holding) => {
                            const holdingValue = holding.shares * holding.currentPrice;
                            const holdingGain = (holding.currentPrice - holding.buyPrice) * holding.shares;
                            const holdingGainPercent = ((holding.currentPrice - holding.buyPrice) / holding.buyPrice) * 100;

                            return (
                                <InvestmentCard
                                    key={holding.id}
                                    icon={holding.icon}
                                    name={holding.name}
                                    shares={holding.shares}
                                    value={`€${holdingValue.toFixed(2)}`}
                                    change={`${holdingGain >= 0 ? '+' : ''}${holdingGainPercent.toFixed(1)}%`}
                                    isPositive={holdingGain >= 0}
                                    onClick={() => {
                                        localStorage.setItem("selectedStock", holding.symbol);
                                        onNavigate("stock-detail");
                                    }}
                                />
                            );
                        })
                    )}
                </div>

                {/* Learning Tip */}
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                    <Info className="text-blue-500 shrink-0" size={24} />
                    <div>
                        <div className="font-bold text-blue-700 text-sm mb-1">Wusstest du schon?</div>
                        <p className="text-xs text-blue-600 leading-relaxed">
                            Wenn du Aktien kaufst, gehört dir ein kleiner Teil der Firma. Wenn die Firma Gewinn macht, steigt oft auch der Wert deiner Aktie!
                        </p>
                    </div>
                </div>
            </div>

            <BottomNav activeTab="invest" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />

            {/* Stock Search Modal */}
            <StockSearchModal
                open={showSearchModal}
                onOpenChange={setShowSearchModal}
                onSelectStock={handleSelectStock}
            />
        </div>
    );
}

function InvestmentCard({ icon, name, shares, value, change, isPositive, onClick }: { icon: string, name: string, shares?: number, value: string, change: string, isPositive: boolean, onClick?: () => void }) {
    return (
        <div
            className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">
                    {icon}
                </div>
                <div>
                    <div className="font-bold text-[#333333] text-sm">{name}</div>
                    <div className="text-xs text-gray-400">{shares || 0} Anteile</div>
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold text-[#333333]">{value}</div>
                <div className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {change}
                </div>
            </div>
        </div>
    );
}
