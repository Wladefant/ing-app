import { useState, useEffect } from "react";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { Trophy, Medal, TrendingUp, TrendingDown, Users, School, Crown, Flame, Star, ChevronRight, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { getJuniorProfile, getLeaderboard, type LeaderboardEntry, type JuniorProfile } from "@/lib/storage";

type Tab = "weekly" | "alltime" | "school";

export function JuniorLeaderboardScreen({
    onBack,
    onNavigate,
    onLeoClick
}: {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
    onLeoClick?: () => void;
}) {
    const [activeTab, setActiveTab] = useState<Tab>("weekly");
    const [profile, setProfile] = useState<JuniorProfile | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [schoolLeaderboard, setSchoolLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const loadData = () => {
            setProfile(getJuniorProfile());
            setLeaderboard(getLeaderboard(activeTab === "alltime" ? "allTime" : "weekly"));
            setSchoolLeaderboard(getLeaderboard("school"));
        };
        loadData();
    }, [activeTab]);

    // Calculate countdown to next reset
    const getTimeUntilReset = () => {
        const now = new Date();
        const nextMonday = new Date(now);
        nextMonday.setDate(now.getDate() + ((7 - now.getDay() + 1) % 7 || 7));
        nextMonday.setHours(0, 0, 0, 0);
        const diff = nextMonday.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `${days} Tage ${hours} Std übrig`;
    };

    // Calculate points needed for next rank
    const getPointsToNextRank = () => {
        if (!profile) return 0;
        const higherRanked = leaderboard.filter(e => e.rank < profile.rank);
        if (higherRanked.length === 0) return 0;
        const nextUp = higherRanked[higherRanked.length - 1];
        return Math.max(0, nextUp.xp - profile.weeklyXp + 1);
    };

    if (!profile) return null;

    const topThree = leaderboard.slice(0, 3);

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
                            {getTimeUntilReset()}
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
                            +15 seit gestern
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold">#{profile.rank}</div>
                        <div className="flex-1">
                            <div className="font-bold">{profile.weeklyXp} Punkte</div>
                            <div className="text-sm text-orange-100">{profile.school}</div>
                        </div>
                        <div className="flex items-center gap-1 text-2xl">
                            <Flame size={20} fill="currentColor" className="text-yellow-300" />
                            <span className="font-bold">{profile.streak}</span>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-orange-100">
                        Noch <span className="font-bold text-white">{getPointsToNextRank()} Punkte</span> bis Platz #{profile.rank - 1}!
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
                                    {topThree[1] && (
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="text-3xl mb-2">{topThree[1].avatar}</div>
                                        <div className="w-16 h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg flex flex-col items-center justify-end pb-2">
                                            <div className="text-xl mb-1">🥈</div>
                                            <div className="text-[10px] font-bold text-white text-center px-1 truncate w-full">
                                                {topThree[1].name}
                                            </div>
                                            <div className="text-[8px] text-white/80">{topThree[1].xp.toLocaleString()}</div>
                                        </div>
                                    </motion.div>
                                    )}

                                    {/* 1st Place */}
                                    {topThree[0] && (
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <Crown size={24} className="text-yellow-500 mb-1" fill="currentColor" />
                                        <div className="text-4xl mb-2">{topThree[0].avatar}</div>
                                        <div className="w-20 h-28 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-t-lg flex flex-col items-center justify-end pb-2">
                                            <div className="text-2xl mb-1">🥇</div>
                                            <div className="text-xs font-bold text-white text-center px-1 truncate w-full">
                                                {topThree[0].name}
                                            </div>
                                            <div className="text-[10px] text-white/80">{topThree[0].xp.toLocaleString()}</div>
                                        </div>
                                    </motion.div>
                                    )}

                                    {/* 3rd Place */}
                                    {topThree[2] && (
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="text-3xl mb-2">{topThree[2].avatar}</div>
                                        <div className="w-16 h-16 bg-gradient-to-b from-orange-300 to-orange-400 rounded-t-lg flex flex-col items-center justify-end pb-2">
                                            <div className="text-xl mb-1">🥉</div>
                                            <div className="text-[10px] font-bold text-white text-center px-1 truncate w-full">
                                                {topThree[2].name}
                                            </div>
                                            <div className="text-[8px] text-white/80">{topThree[2].xp.toLocaleString()}</div>
                                        </div>
                                    </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Rest of Leaderboard */}
                            <div className="divide-y divide-gray-100">
                                {leaderboard.slice(3).map((entry) => (
                                    <LeaderboardRow key={entry.rank} user={{
                                        rank: entry.rank,
                                        name: entry.name,
                                        points: entry.xp,
                                        change: "up",
                                        avatar: entry.avatar,
                                        school: entry.school,
                                        isCurrentUser: entry.isCurrentUser
                                    }} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {schoolLeaderboard.map((school, idx) => (
                                <div key={school.rank} className="p-4 flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                                        idx === 1 ? 'bg-gray-100 text-gray-600' :
                                        idx === 2 ? 'bg-orange-100 text-orange-600' :
                                        'bg-gray-50 text-gray-500'
                                    }`}>
                                        {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1}
                                    </div>
                                    <div className="text-2xl">🏫</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[#333333] text-sm">{school.school}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            <Users size={12} />
                                            {school.level || 0} Schüler
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-[#333333]">{school.xp.toLocaleString()}</div>
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
                                    i < profile.badges.length ? 'bg-yellow-100' : 'bg-gray-100 grayscale opacity-50'
                                }`}
                            >
                                {emoji}
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                        {profile.badges.length}/12 freigeschaltet
                    </div>
                </div>
            </div>
            
            <BottomNav activeTab="leaderboard" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
        </div>
    );
}

interface LeaderboardUser {
    rank: number;
    name: string;
    points: number;
    change: string;
    avatar: string;
    school: string;
    isCurrentUser?: boolean;
}

function LeaderboardRow({ user }: { user: LeaderboardUser }) {
    return (
        <div className={`p-4 flex items-center gap-3 ${user.isCurrentUser ? 'bg-orange-50' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                user.isCurrentUser ? 'bg-[#FF6200] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
                {user.rank}
            </div>
            <div className="text-2xl">{user.avatar}</div>
            <div className="flex-1">
                <div className="font-bold text-[#333333] text-sm">{user.isCurrentUser ? 'Du' : user.name}</div>
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
