import { useState } from "react";
import { ScreenHeader } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { TrendingUp, TrendingDown, Info, RefreshCw } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

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
    onNavigate
}: {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
}) {
    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader title="Mein Portfolio" onBack={onBack} />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Portfolio Value */}
                <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                    <div className="text-gray-500 text-sm mb-1">Gesamtwert (Spielgeld)</div>
                    <div className="text-4xl font-bold text-[#333333] mb-2">1.240,50 €</div>
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                        <TrendingUp size={16} />
                        <span>+12,5% diese Woche</span>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-4 rounded-2xl shadow-sm h-64">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-[#333333]">Verlauf</span>
                        <button className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                            <RefreshCw size={16} />
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_DATA}>
                            <Line type="monotone" dataKey="value" stroke="#FF6200" strokeWidth={3} dot={{ r: 4, fill: '#FF6200', strokeWidth: 2, stroke: '#fff' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                labelStyle={{ color: '#999' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Holdings */}
                <div className="space-y-3">
                    <div className="font-bold text-[#333333] px-2">Deine Investments</div>

                    <InvestmentCard
                        icon="🎮"
                        name="GameTech Corp"
                        value="450,20 €"
                        change="+5,2%"
                        isPositive={true}
                    />
                    <InvestmentCard
                        icon="👟"
                        name="Sneaker World"
                        value="320,80 €"
                        change="-2,1%"
                        isPositive={false}
                    />
                    <InvestmentCard
                        icon="🍔"
                        name="Burger King"
                        value="210,50 €"
                        change="+1,5%"
                        isPositive={true}
                    />
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
        </div>
    );
}

function InvestmentCard({ icon, name, value, change, isPositive }: { icon: string, name: string, value: string, change: string, isPositive: boolean }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">
                    {icon}
                </div>
                <div>
                    <div className="font-bold text-[#333333] text-sm">{name}</div>
                    <div className="text-xs text-gray-400">12 Anteile</div>
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
