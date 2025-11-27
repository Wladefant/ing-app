import { useState } from "react";
import { ScreenHeader } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { Trophy, Medal, TrendingUp, TrendingDown, Users, School, Crown, Flame, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const WEEKLY_LEADERBOARD = [
    { rank: 1, name: "MaxMustermann", points: 2450, change: "up", avatar: "🦊", school: "Gymnasium Berlin" },
    { rank: 2, name: "FinanceQueen", points: 2230, change: "down", avatar: "👸", school: "Realschule München" },
    { rank: 3, name: "InvestorKid", points: 2100, change: "up", avatar: "🚀", school: "Gesamtschule Hamburg" },
    { rank: 4, name: "TaxExpert", points: 1980, change: "same", avatar: "📊", school: "Gymnasium Köln" },
    { rank: 5, name: "StockNerd", points: 1875, change: "up", avatar: "🤓", school: "Realschule Frankfurt" },
    { rank: 6, name: "SavingsHero", points: 1720, change: "down", avatar: "💪", school: "Gymnasium Berlin" },
    { rank: 7, name: "QuizMaster", points: 1650, change: "up", avatar: "🧠", school: "Gesamtschule Düsseldorf" },
    { rank: 8, name: "BudgetBoss", points: 1580, change: "same", avatar: "💼", school: "Realschule Stuttgart" },
];

const USER_DATA = {
    rank: 42,
    name: "Du",
    points: 840,
    change: "up",
    changeAmount: 15,
    avatar: "🦁",
    school: "Gymnasium Berlin",
    streak: 12,
    achievements: 8,
};

const SCHOOL_LEADERBOARD = [
    { rank: 1, name: "Gymnasium Berlin", points: 45200, students: 234, avatar: "🏫" },
    { rank: 2, name: "Realschule München", points: 42100, students: 198, avatar: "🏫" },
    { rank: 3, name: "Gesamtschule Hamburg", points: 38500, students: 312, avatar: "🏫" },
];

type Tab = "weekly" | "alltime" | "school";

export function JuniorLeaderboardScreen({
    onBack,
    onNavigate,
}: {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
}) {
    const [activeTab, setActiveTab] = useState<Tab>("weekly");

    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader title="Leaderboard" onBack={onBack} />

            <div className="flex-1 overflow-y-auto">
                {/* Prize Card */}
                <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 rounded-2xl text-white shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Trophy size={24} className="text-yellow-100" fill="currentColor" />
                            <span className="font-bold">Wöchentlicher Preis</span>
                        </div>
                        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            3 Tage 14 Std übrig
                        </div>
                    </div>
                    <div className="text-2xl font-bold mb-1">€25 Bonus</div>
                    <div className="text-white/80 text-sm">wird deinem echten ING-Konto gutgeschrieben, wenn du 18 wirst!</div>
                </div>

                {/* Tab Bar */}
                <div className="flex mx-4 mt-4 p-1 bg-white rounded-xl shadow-sm">
                    {[
                        { id: "weekly", label: "Wöchentlich", icon: <Flame size={14} /> },
                        { id: "alltime", label: "Gesamt", icon: <Crown size={14} /> },
                        { id: "school", label: "Schulen", icon: <School size={14} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                activeTab === tab.id
                                    ? "bg-[#FF6200] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Your Position Card */}
                <div className="mx-4 mt-4 p-4 bg-[#FF6200] rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-orange-100">Dein Platz</div>
                        <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                            <TrendingUp size={12} />
                            +{USER_DATA.changeAmount} seit gestern
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold">#{USER_DATA.rank}</div>
                        <div className="flex-1">
                            <div className="font-bold">{USER_DATA.points} Punkte</div>
                            <div className="text-sm text-orange-100">{USER_DATA.school}</div>
                        </div>
                        <div className="flex items-center gap-1 text-2xl">
                            <Flame size={20} fill="currentColor" className="text-yellow-300" />
                            <span className="font-bold">{USER_DATA.streak}</span>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-orange-100">
                        Noch <span className="font-bold text-white">60 Punkte</span> bis Platz #40!
                    </div>
                </div>

                {/* Leaderboard List */}
                <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
                    {activeTab !== "school" ? (
                        <>
                            {/* Top 3 Podium */}
                            <div className="p-4 bg-gradient-to-b from-amber-50 to-white">
                                <div className="flex items-end justify-center gap-2 h-32">
                                    {/* 2nd Place */}
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="text-3xl mb-2">{WEEKLY_LEADERBOARD[1].avatar}</div>
                                        <div className="w-16 h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg flex flex-col items-center justify-end pb-2">
                                            <div className="text-xl mb-1">🥈</div>
                                            <div className="text-[10px] font-bold text-white text-center px-1 truncate w-full">
                                                {WEEKLY_LEADERBOARD[1].name}
                                            </div>
                                            <div className="text-[8px] text-white/80">{WEEKLY_LEADERBOARD[1].points}</div>
                                        </div>
                                    </motion.div>

                                    {/* 1st Place */}
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <Crown size={24} className="text-yellow-500 mb-1" fill="currentColor" />
                                        <div className="text-4xl mb-2">{WEEKLY_LEADERBOARD[0].avatar}</div>
                                        <div className="w-20 h-28 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-t-lg flex flex-col items-center justify-end pb-2">
                                            <div className="text-2xl mb-1">🥇</div>
                                            <div className="text-xs font-bold text-white text-center px-1 truncate w-full">
                                                {WEEKLY_LEADERBOARD[0].name}
                                            </div>
                                            <div className="text-[10px] text-white/80">{WEEKLY_LEADERBOARD[0].points}</div>
                                        </div>
                                    </motion.div>

                                    {/* 3rd Place */}
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="text-3xl mb-2">{WEEKLY_LEADERBOARD[2].avatar}</div>
                                        <div className="w-16 h-16 bg-gradient-to-b from-orange-300 to-orange-400 rounded-t-lg flex flex-col items-center justify-end pb-2">
                                            <div className="text-xl mb-1">🥉</div>
                                            <div className="text-[10px] font-bold text-white text-center px-1 truncate w-full">
                                                {WEEKLY_LEADERBOARD[2].name}
                                            </div>
                                            <div className="text-[8px] text-white/80">{WEEKLY_LEADERBOARD[2].points}</div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Rest of Leaderboard */}
                            <div className="divide-y divide-gray-100">
                                {WEEKLY_LEADERBOARD.slice(3).map((user, idx) => (
                                    <LeaderboardRow key={user.rank} user={user} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {SCHOOL_LEADERBOARD.map((school) => (
                                <div key={school.rank} className="p-4 flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        school.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                                        school.rank === 2 ? 'bg-gray-100 text-gray-600' :
                                        school.rank === 3 ? 'bg-orange-100 text-orange-600' :
                                        'bg-gray-50 text-gray-500'
                                    }`}>
                                        {school.rank <= 3 ? ['🥇', '🥈', '🥉'][school.rank - 1] : school.rank}
                                    </div>
                                    <div className="text-2xl">{school.avatar}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[#333333] text-sm">{school.name}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            <Users size={12} />
                                            {school.students} Schüler
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-[#333333]">{school.points.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">Punkte</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Achievements Preview */}
                <div className="mx-4 mb-4 p-4 bg-white rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-[#333333] flex items-center gap-2">
                            <Star size={18} className="text-yellow-500" fill="currentColor" />
                            Deine Achievements
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {["🎓", "📚", "💯", "🔥", "📈", "💎", "🏆", "⭐"].map((emoji, i) => (
                            <div 
                                key={i}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                                    i < USER_DATA.achievements ? 'bg-yellow-100' : 'bg-gray-100 grayscale opacity-50'
                                }`}
                            >
                                {emoji}
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                        {USER_DATA.achievements}/12 freigeschaltet
                    </div>
                </div>
            </div>
        </div>
    );
}

function LeaderboardRow({ user }: { user: typeof WEEKLY_LEADERBOARD[0] }) {
    return (
        <div className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-500">
                {user.rank}
            </div>
            <div className="text-2xl">{user.avatar}</div>
            <div className="flex-1">
                <div className="font-bold text-[#333333] text-sm">{user.name}</div>
                <div className="text-xs text-gray-400">{user.school}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="font-bold text-[#333333]">{user.points.toLocaleString()}</div>
                {user.change === "up" && <TrendingUp size={14} className="text-green-500" />}
                {user.change === "down" && <TrendingDown size={14} className="text-red-500" />}
            </div>
        </div>
    );
}
