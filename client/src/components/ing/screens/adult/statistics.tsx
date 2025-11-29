import { useState, useEffect, useMemo } from "react";
import { ScreenHeader } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { getTransactions, getSpendingByCategory, getMonthlySpending, getBalance, formatCurrency, type Transaction } from "@/lib/storage";

// Category colors for spending breakdown
const CATEGORY_COLORS: Record<string, string> = {
    "Wohnen": "#FF6200",
    "Miete": "#FF6200",
    "Essen": "#FF8F00",
    "Restaurant": "#FF8F00",
    "Lebensmittel": "#FF8F00",
    "Transport": "#FFB74D",
    "Mobilität": "#FFB74D",
    "Freizeit": "#FFD54F",
    "Entertainment": "#FFD54F",
    "Shopping": "#8B5CF6",
    "Gehalt": "#22C55E",
    "Einkommen": "#22C55E",
    "Investment": "#3B82F6",
    "Überweisung": "#6B7280",
    "Sonstiges": "#9CA3AF",
};

const getColorForCategory = (category: string): string => {
    return CATEGORY_COLORS[category] || "#9CA3AF";
};

export function AdultStatisticsScreen({
    onBack
}: {
    onBack: () => void
}) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState({ girokonto: 0, extraKonto: 0, depot: 0 });
    
    useEffect(() => {
        const loadData = () => {
            setTransactions(getTransactions());
            setBalance(getBalance());
        };
        loadData();
        
        // Refresh on focus
        window.addEventListener("focus", loadData);
        return () => window.removeEventListener("focus", loadData);
    }, []);
    
    // Calculate spending by category from real transactions
    const spendingData = useMemo(() => {
        const categoryTotals = getSpendingByCategory();
        return Object.entries(categoryTotals)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({
                name,
                value: Math.round(value),
                color: getColorForCategory(name),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6); // Top 6 categories
    }, [transactions]);
    
    // Calculate monthly data from real transactions
    const monthlyData = useMemo(() => {
        const monthly = getMonthlySpending();
        const months = Object.keys(monthly).sort().slice(-4); // Last 4 months
        return months.map(month => {
            const data = monthly[month] || { income: 0, expense: 0 };
            return {
                name: new Date(month + "-01").toLocaleDateString('de-DE', { month: 'short' }),
                income: Math.round(data.income),
                expense: Math.round(data.expense),
            };
        });
    }, [transactions]);
    
    // Calculate financial score based on savings rate
    const financialScore = useMemo(() => {
        const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
        const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);
        if (totalIncome === 0) return 75; // Default score if no data
        const savingsRate = (totalIncome - totalExpense) / totalIncome;
        // Score: 50-100 based on savings rate (0-30% or more)
        return Math.min(100, Math.max(50, Math.round(50 + savingsRate * 166)));
    }, [monthlyData]);
    
    const totalSpending = spendingData.reduce((sum, item) => sum + item.value, 0);
    const currentMonth = new Date().toLocaleDateString('de-DE', { month: 'long' });
    
    // Generate dynamic tip based on spending
    const leoTip = useMemo(() => {
        if (spendingData.length === 0) {
            return "Erfasse deine Ausgaben, damit ich dir personalisierte Tipps geben kann! 📊";
        }
        const topCategory = spendingData[0];
        const tips: Record<string, string> = {
            "Essen": "Deine Ausgaben für Essen sind am höchsten. Vielleicht öfter mal selber kochen? 🍳",
            "Restaurant": "Viele Restaurant-Besuche! Probier mal einen Kochabend mit Freunden. 👨‍🍳",
            "Shopping": "Shopping macht Spaß, aber hast du alles wirklich gebraucht? 🛍️",
            "Freizeit": "Freizeit ist wichtig! Aber check mal kostenlose Events in deiner Stadt. 🎭",
            "Transport": "Hohe Mobilitätskosten? Manchmal ist das Fahrrad schneller! 🚴",
        };
        return tips[topCategory?.name] || `Deine größte Ausgabe ist ${topCategory?.name} mit ${formatCurrency(topCategory?.value || 0)}. Überlege, ob du hier sparen kannst! 💡`;
    }, [spendingData]);
    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader title="Finanz-Check" onBack={onBack} />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Financial Health Score */}
                <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-gray-500 text-sm font-medium mb-1">Finanz-Score</div>
                        <div className="text-4xl font-bold text-[#333333]">{financialScore}<span className="text-lg text-gray-400">/100</span></div>
                        <div className={`text-xs font-bold mt-1 ${
                            financialScore >= 80 ? "text-green-500" :
                            financialScore >= 60 ? "text-yellow-500" :
                            "text-red-500"
                        }`}>
                            {financialScore >= 80 ? "Gut aufgestellt!" : 
                             financialScore >= 60 ? "Verbesserungspotenzial" : 
                             "Achtung: Ausgaben zu hoch!"}
                        </div>
                    </div>
                    <div className="w-20 h-20 relative">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="#f3f3f3" strokeWidth="8" fill="none" />
                            <circle cx="40" cy="40" r="36" stroke="#FF6200" strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset={226 - (226 * financialScore / 100)} strokeLinecap="round" />
                        </svg>
                    </div>
                </div>

                {/* Spending Breakdown */}
                <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-[#333333] mb-4">Ausgaben im {currentMonth}</h3>
                    {spendingData.length > 0 ? (
                        <div className="h-48 flex">
                            <div className="w-1/2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={spendingData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                            {spendingData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 flex flex-col justify-center gap-2">
                                {spendingData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2 text-xs">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-gray-600 truncate">{item.name}</span>
                                        <span className="font-bold ml-auto">{item.value}€</span>
                                    </div>
                                ))}
                                <div className="border-t pt-2 mt-1 flex items-center gap-2 text-xs">
                                    <span className="text-gray-600 font-bold">Gesamt</span>
                                    <span className="font-bold ml-auto text-[#FF6200]">{totalSpending}€</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                            Noch keine Ausgaben erfasst
                        </div>
                    )}
                </div>

                {/* Monthly Comparison */}
                <div className="bg-white p-5 rounded-2xl shadow-sm h-64">
                    <h3 className="font-bold text-[#333333] mb-4">Einnahmen vs. Ausgaben</h3>
                    {monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                <Tooltip cursor={{ fill: '#f3f3f3' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <Bar dataKey="income" fill="#4CAF50" radius={[4, 4, 0, 0]} name="Einnahmen" />
                                <Bar dataKey="expense" fill="#FF6200" radius={[4, 4, 0, 0]} name="Ausgaben" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                            Noch keine monatlichen Daten verfügbar
                        </div>
                    )}
                </div>

                {/* AI Insight */}
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                        🦁
                    </div>
                    <div>
                        <div className="font-bold text-orange-700 text-sm mb-1">Leo's Tipp</div>
                        <p className="text-xs text-orange-600 leading-relaxed">
                            {leoTip}
                        </p>
                    </div>
                </div>
                
                {/* Account Overview */}
                <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-[#333333] mb-4">Kontoübersicht</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-600">Girokonto</span>
                            <span className="font-bold text-[#333333]">{formatCurrency(balance.girokonto)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-600">Extra-Konto</span>
                            <span className="font-bold text-[#333333]">{formatCurrency(balance.extraKonto)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                            <span className="font-bold text-orange-700">Gesamt</span>
                            <span className="font-bold text-[#FF6200]">{formatCurrency(balance.girokonto + balance.extraKonto)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
