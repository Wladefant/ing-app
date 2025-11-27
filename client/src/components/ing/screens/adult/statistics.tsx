import { ScreenHeader } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const SPENDING_DATA = [
    { name: 'Wohnen', value: 800, color: '#FF6200' },
    { name: 'Essen', value: 400, color: '#FF8F00' },
    { name: 'Transport', value: 150, color: '#FFB74D' },
    { name: 'Freizeit', value: 200, color: '#FFD54F' },
];

const MONTHLY_DATA = [
    { name: 'Jun', income: 2500, expense: 2100 },
    { name: 'Jul', income: 2500, expense: 2300 },
    { name: 'Aug', income: 2600, expense: 1900 },
    { name: 'Sep', income: 2500, expense: 2400 },
];

export function AdultStatisticsScreen({
    onBack
}: {
    onBack: () => void
}) {
    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader title="Finanz-Check" onBack={onBack} />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Financial Health Score */}
                <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-gray-500 text-sm font-medium mb-1">Finanz-Score</div>
                        <div className="text-4xl font-bold text-[#333333]">85<span className="text-lg text-gray-400">/100</span></div>
                        <div className="text-green-500 text-xs font-bold mt-1">Gut aufgestellt!</div>
                    </div>
                    <div className="w-20 h-20 relative">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="#f3f3f3" strokeWidth="8" fill="none" />
                            <circle cx="40" cy="40" r="36" stroke="#FF6200" strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset="34" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>

                {/* Spending Breakdown */}
                <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-[#333333] mb-4">Ausgaben im September</h3>
                    <div className="h-48 flex">
                        <div className="w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={SPENDING_DATA} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                        {SPENDING_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 flex flex-col justify-center gap-2">
                            {SPENDING_DATA.map((item) => (
                                <div key={item.name} className="flex items-center gap-2 text-xs">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-gray-600">{item.name}</span>
                                    <span className="font-bold ml-auto">{item.value}€</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Comparison */}
                <div className="bg-white p-5 rounded-2xl shadow-sm h-64">
                    <h3 className="font-bold text-[#333333] mb-4">Einnahmen vs. Ausgaben</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MONTHLY_DATA}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                            <Tooltip cursor={{ fill: '#f3f3f3' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                            <Bar dataKey="income" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#FF6200" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* AI Insight */}
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                        🦁
                    </div>
                    <div>
                        <div className="font-bold text-orange-700 text-sm mb-1">Leo's Tipp</div>
                        <p className="text-xs text-orange-600 leading-relaxed">
                            Deine Ausgaben für "Essen" sind diesen Monat 15% höher als sonst. Vielleicht öfter mal selber kochen? 🍳
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
