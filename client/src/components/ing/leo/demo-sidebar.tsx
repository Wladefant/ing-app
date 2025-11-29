import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Play, Zap, FileText, TrendingUp, AlertCircle, PiggyBank, Newspaper, Target, Trophy, BookOpen, DollarSign, Building, CreditCard, Bell, BarChart3 } from "lucide-react";
import { DemoScenarioId, DEMO_SCENARIOS } from "@/lib/demo-scenarios";

interface DemoSidebarProps {
    onTriggerScenario: (id: DemoScenarioId) => void;
    currentProfile: "adult" | "junior";
    onToggleProfile: (profile: "adult" | "junior") => void;
}

const SCENARIO_ICONS: Record<string, React.ReactNode> = {
    rent_alert: <Building size={16} />,
    spending_insight: <BarChart3 size={16} />,
    doc_scan: <FileText size={16} />,
    stock_inquiry: <TrendingUp size={16} />,
    subscription_check: <CreditCard size={16} />,
    junior_salary: <DollarSign size={16} />,
    quiz_trigger: <Zap size={16} />,
    savings_goal: <Target size={16} />,
    investment_advice: <TrendingUp size={16} />,
    tax_explanation: <FileText size={16} />,
    portfolio_analysis: <BarChart3 size={16} />,
    bill_negotiation: <DollarSign size={16} />,
    proactive_tip: <Bell size={16} />,
    market_news: <Newspaper size={16} />,
    budget_alert: <AlertCircle size={16} />,
    achievement_unlock: <Trophy size={16} />,
    junior_quiz_stocks: <BookOpen size={16} />,
    junior_quiz_taxes: <BookOpen size={16} />,
    junior_first_trade: <Target size={16} />,
    smart_transfer: <DollarSign size={16} />,
    investment_walkthrough: <BookOpen size={16} />,
    savings_challenge: <Trophy size={16} />,
};

const SCENARIO_COLORS: Record<string, string> = {
    rent_alert: "bg-red-50 text-red-600 border-red-100 hover:bg-red-100",
    spending_insight: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
    doc_scan: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100",
    stock_inquiry: "bg-green-50 text-green-600 border-green-100 hover:bg-green-100",
    subscription_check: "bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100",
    junior_salary: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
    quiz_trigger: "bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100",
    savings_goal: "bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100",
    investment_advice: "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100",
    tax_explanation: "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100",
    portfolio_analysis: "bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100",
    bill_negotiation: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100",
    proactive_tip: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
    market_news: "bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100",
    budget_alert: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100",
    achievement_unlock: "bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100",
    junior_quiz_stocks: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100",
    junior_quiz_taxes: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
    junior_first_trade: "bg-green-50 text-green-600 border-green-100 hover:bg-green-100",
    smart_transfer: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
    investment_walkthrough: "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100",
    savings_challenge: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
};

export function DemoSidebar({ onTriggerScenario, currentProfile, onToggleProfile }: DemoSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Filter scenarios by profile
    const filteredScenarios = Object.values(DEMO_SCENARIOS).filter(
        scenario => scenario.category === currentProfile || scenario.category === "both"
    );

    return (
        <>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: isOpen ? 0 : "-95%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-20 bottom-20 w-72 bg-white shadow-2xl z-[60] rounded-r-2xl border border-gray-200 flex flex-col overflow-hidden"
            >
                <div
                    className="absolute right-0 top-0 bottom-0 w-6 cursor-pointer hover:bg-gray-50 flex items-center justify-center group"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="w-1 h-12 bg-gray-300 rounded-full group-hover:bg-[#FF6200] transition-colors" />
                </div>

                <div className="p-4 pr-8 h-full overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4 text-[#FF6200]">
                        <Zap size={20} fill="currentColor" />
                        <span className="font-bold text-lg">AI Demo Center</span>
                    </div>

                    <div className="mb-4 p-1 bg-gray-100 rounded-lg flex">
                        <button
                            onClick={() => onToggleProfile("adult")}
                            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${currentProfile === "adult" ? "bg-white shadow-sm text-[#FF6200]" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            🧑 Adult
                        </button>
                        <button
                            onClick={() => onToggleProfile("junior")}
                            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${currentProfile === "junior" ? "bg-white shadow-sm text-[#FF6200]" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            🎮 Junior
                        </button>
                    </div>

                    <div className="text-xs text-gray-500 mb-3 font-medium">
                        {filteredScenarios.length} Demo-Szenarien verfügbar
                    </div>

                    <div className="space-y-2">
                        {filteredScenarios.map((scenario) => (
                            <DemoButton
                                key={scenario.id}
                                icon={SCENARIO_ICONS[scenario.id] || <Play size={16} />}
                                label={scenario.name}
                                description={scenario.description}
                                onClick={() => onTriggerScenario(scenario.id)}
                                color={SCENARIO_COLORS[scenario.id] || "bg-gray-50 text-gray-600 border-gray-100"}
                            />
                        ))}
                    </div>

                    <div className="mt-6 p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2 text-orange-600 font-bold text-sm mb-2">
                            <Zap size={14} fill="currentColor" />
                            Anleitung
                        </div>
                        <p className="text-xs text-orange-700 leading-relaxed">
                            Klicke auf ein Szenario, um eine KI-Interaktion auszulösen. Die KI antwortet basierend auf dem Kontext!
                        </p>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

function DemoButton({ icon, label, description, onClick, color }: { 
    icon: React.ReactNode; 
    label: string; 
    description: string;
    onClick: () => void; 
    color: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 text-left ${color}`}
        >
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <span className="font-medium text-sm block">{label}</span>
                <span className="text-[10px] opacity-70 block truncate">{description}</span>
            </div>
            <Play size={12} className="mt-1 opacity-50 shrink-0" />
        </button>
    );
}
