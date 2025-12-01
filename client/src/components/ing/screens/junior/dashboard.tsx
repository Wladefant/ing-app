import { useState, useEffect } from "react";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { Trophy, Flame, TrendingUp, ChevronRight, Target, Brain, Play, Crown, Zap, BookOpen, PiggyBank, Medal, X, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getJuniorProfile, getLeaderboard, getBalance, formatCurrency, JuniorProfile, LeaderboardEntry } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

// All available badges
const ALL_BADGES = [
    { id: "first_quiz", name: "Quiz-Starter", emoji: "🎯", description: "Erstes Quiz abgeschlossen", unlocked: true },
    { id: "streak_3", name: "Auf Kurs", emoji: "🔥", description: "3 Tage Streak erreicht", unlocked: true },
    { id: "streak_7", name: "Wochenmeister", emoji: "⭐", description: "7 Tage Streak erreicht", unlocked: true },
    { id: "first_save", name: "Sparfuchs", emoji: "🦊", description: "Erstes Sparziel erstellt", unlocked: true },
    { id: "investor", name: "Mini-Investor", emoji: "📈", description: "Erste virtuelle Aktie gekauft", unlocked: true },
    { id: "knowledge_1", name: "Wissensdurst", emoji: "📚", description: "5 Lektionen abgeschlossen", unlocked: true },
    { id: "leaderboard_top10", name: "Top 10", emoji: "🏆", description: "Unter den Top 10 im Leaderboard", unlocked: true },
    { id: "xp_1000", name: "XP-Sammler", emoji: "💎", description: "1.000 XP gesammelt", unlocked: true },
    { id: "streak_30", name: "Monatschampion", emoji: "👑", description: "30 Tage Streak erreicht", unlocked: false },
    { id: "knowledge_all", name: "Finanz-Guru", emoji: "🧠", description: "Alle Lektionen abgeschlossen", unlocked: false },
    { id: "xp_5000", name: "XP-Meister", emoji: "🌟", description: "5.000 XP gesammelt", unlocked: false },
    { id: "perfect_quiz", name: "Perfektionist", emoji: "💯", description: "Quiz mit 100% abgeschlossen", unlocked: false },
];

// Calculate level title based on level number
const getLevelTitle = (level: number): string => {
    const titles = [
        "Anfänger",
        "Entdecker",
        "Lerner",
        "Kenner",
        "Experte",
        "Finanz-Entdecker",
        "Finanz-Kenner",
        "Finanz-Profi",
        "Finanz-Meister",
        "Finanz-Guru"
    ];
    return titles[Math.min(level - 1, titles.length - 1)] || "Anfänger";
};

export function JuniorDashboardScreen({
    onNavigate,
    onLeoClick
}: {
    onNavigate: (screen: Screen) => void;
    onLeoClick?: () => void;
}) {
    const [profile, setProfile] = useState<JuniorProfile | null>(null);
    const [userRank, setUserRank] = useState(42);
    const [pointsToNextRank, setPointsToNextRank] = useState(60);
    const [balance, setBalance] = useState(145.50);
    const [showBadges, setShowBadges] = useState(false);
    const { toast } = useToast();
    
    useEffect(() => {
        const loadedProfile = getJuniorProfile();
        setProfile(loadedProfile);
        
        // Get leaderboard and find user's rank
        const leaderboard = getLeaderboard();
        const myEntry = leaderboard.find(e => e.name === "Du");
        if (myEntry) {
            const rank = leaderboard.indexOf(myEntry) + 1;
            setUserRank(rank);
            
            // Calculate points to next rank
            if (rank > 1) {
                const nextUser = leaderboard[rank - 2]; // -2 because array is 0-indexed and we want the one above
                setPointsToNextRank(nextUser.weeklyXp - myEntry.weeklyXp);
            }
        }
        
        // Get junior balance (using extra account as junior savings)
        const balances = getBalance();
        setBalance(balances.extraKonto || 145.50);
    }, []);
    
    // Default values if profile not loaded yet
    const level = profile?.level ?? 5;
    const levelTitle = getLevelTitle(level);
    const xp = profile?.xp ?? 1240;
    const streak = profile?.streak ?? 12;
    const badges = profile?.badges?.length ?? 8;
    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            {/* Header with Gamification */}
            <div className="bg-white px-4 py-4 pb-6 rounded-b-[30px] shadow-sm z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <motion.div 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                            className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center text-2xl shadow-sm"
                        >
                            {profile?.avatar ?? "🦁"}
                        </motion.div>
                        <div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Level {level}</div>
                            <div className="font-bold text-[#333333]">{levelTitle}</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => onNavigate("leaderboard")}
                        className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 hover:bg-orange-100 transition-colors"
                    >
                        <Flame size={18} className="text-orange-500 fill-orange-500" />
                        <span className="font-bold text-orange-600 text-sm">{streak} Tage</span>
                    </button>
                </div>

                {/* Virtual Balance Card */}
                <div className="bg-gradient-to-br from-[#FF6200] to-[#FF8F00] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-1">
                            <div className="text-orange-100 text-sm font-medium">Mein Taschengeld</div>
                            <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                                <Zap size={12} fill="currentColor" />
                                <span>{xp.toLocaleString()} XP</span>
                            </div>
                        </div>
                        <div className="text-4xl font-bold mb-4">{formatCurrency(balance)}</div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => onNavigate("invest")}
                                className="flex-1 bg-white/20 backdrop-blur-sm py-2.5 rounded-xl text-sm font-bold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                            >
                                <TrendingUp size={16} />
                                Investieren
                            </button>
                            <button 
                                onClick={() => onNavigate("savings")}
                                className="flex-1 bg-white text-[#FF6200] py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <PiggyBank size={16} />
                                Sparen
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate("leaderboard")}
                        className="bg-white p-3 rounded-xl shadow-sm text-center"
                    >
                        <div className="text-2xl mb-1">🏆</div>
                        <div className="text-lg font-bold text-[#333333]">#{userRank}</div>
                        <div className="text-[10px] text-gray-400">Rang</div>
                    </motion.button>
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowBadges(true)}
                        className="bg-white p-3 rounded-xl shadow-sm text-center"
                    >
                        <div className="text-2xl mb-1">📚</div>
                        <div className="text-lg font-bold text-[#333333]">{badges}/12</div>
                        <div className="text-[10px] text-gray-400">Badges</div>
                    </motion.button>
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate("invest")}
                        className="bg-white p-3 rounded-xl shadow-sm text-center"
                    >
                        <div className="text-2xl mb-1">📈</div>
                        <div className="text-lg font-bold text-green-500">+12%</div>
                        <div className="text-[10px] text-gray-400">Portfolio</div>
                    </motion.button>
                </div>

                {/* Daily Challenge */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg text-white"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 font-bold">
                            <Target size={20} />
                            <span>Tages-Challenge</span>
                        </div>
                        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-md">+50 XP</span>
                    </div>
                    <p className="text-sm text-blue-100 mb-3">Beantworte 3 Fragen im Finanz-Quiz richtig.</p>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "33%" }}
                            transition={{ delay: 0.5 }}
                            className="bg-white w-1/3 h-full rounded-full" 
                        />
                    </div>
                    <div className="mt-2 flex justify-between items-center text-xs">
                        <span className="text-blue-100">1/3 erledigt</span>
                        <button 
                            onClick={() => onNavigate("learn")}
                            className="flex items-center gap-1 font-bold hover:underline"
                        >
                            Quiz starten <ChevronRight size={14} />
                        </button>
                    </div>
                </motion.div>

                {/* Learning Path */}
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-[#333333] font-bold">
                            <Brain size={20} className="text-purple-500" />
                            <span>Dein Wissen</span>
                        </div>
                        <button 
                            onClick={() => onNavigate("learn")}
                            className="text-xs text-[#FF6200] font-bold flex items-center gap-1"
                        >
                            Alle ansehen <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={() => onNavigate("learn")}
                            className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors text-left"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm">
                                💰
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-sm text-[#333333]">Was sind Zinsen?</div>
                                <div className="text-xs text-gray-500">Grundlagen • 3 Min</div>
                            </div>
                            <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                                <Play size={12} className="text-purple-700 ml-0.5" fill="currentColor" />
                            </div>
                        </button>

                        <button 
                            onClick={() => onNavigate("learn")}
                            className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors text-left"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm">
                                📈
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-sm text-[#333333]">Aktien verstehen</div>
                                <div className="text-xs text-gray-500">Fortgeschritten • 5 Min</div>
                            </div>
                            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                                <Play size={12} className="text-green-700 ml-0.5" fill="currentColor" />
                            </div>
                        </button>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm grayscale">
                                🏦
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-sm text-[#333333]">ETFs erklärt</div>
                                <div className="text-xs text-gray-500">Fortgeschritten • 7 Min</div>
                            </div>
                        <button 
                            onClick={() => toast({ 
                                title: "🔒 Noch gesperrt", 
                                description: "Schließe erst 'Aktien verstehen' ab, um diese Lektion freizuschalten!" 
                            })}
                            className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-60 cursor-pointer hover:opacity-80 transition-opacity text-left"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm grayscale">
                                🏦
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-sm text-[#333333]">ETFs erklärt</div>
                                <div className="text-xs text-gray-500">Fortgeschritten • 7 Min</div>
                            </div>
                            <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                <Lock size={12} className="text-gray-400" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Leaderboard Preview */}
                <button 
                    onClick={() => onNavigate("leaderboard")}
                    className="w-full bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl shadow-sm border border-amber-100 text-left"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 font-bold text-amber-700">
                            <Crown size={20} className="text-yellow-500" fill="currentColor" />
                            <span>Wöchentliche Rangliste</span>
                        </div>
                        <ChevronRight size={20} className="text-amber-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center text-sm border-2 border-white">🦊</div>
                            <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-sm border-2 border-white">👸</div>
                            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-sm border-2 border-white">🚀</div>
                        </div>
                        <div className="text-sm text-amber-600">
                            Du bist auf <span className="font-bold">#{userRank}</span> • {pointsToNextRank} Punkte bis #{Math.max(1, userRank - 1)}!
                        </div>
                    </div>
                </button>
            </div>

            {/* Badges Modal */}
            <AnimatePresence>
                {showBadges && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => setShowBadges(false)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Medal size={24} className="text-yellow-500" />
                                    <h2 className="text-xl font-bold text-[#333333]">Meine Badges</h2>
                                </div>
                                <button
                                    onClick={() => setShowBadges(false)}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                    aria-label="Schließen"
                                >
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="text-sm text-gray-500 mb-4">
                                {ALL_BADGES.filter(b => b.unlocked).length} von {ALL_BADGES.length} Badges freigeschaltet
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {ALL_BADGES.map((badge) => (
                                    <button
                                        key={badge.id}
                                        onClick={() => {
                                            if (badge.unlocked) {
                                                toast({ title: badge.name, description: badge.description });
                                            } else {
                                                toast({ 
                                                    title: "🔒 Noch nicht freigeschaltet", 
                                                    description: badge.description 
                                                });
                                            }
                                        }}
                                        className={`p-4 rounded-xl text-center transition-all ${
                                            badge.unlocked 
                                                ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 hover:scale-105' 
                                                : 'bg-gray-100 border border-gray-200 opacity-50'
                                        }`}
                                    >
                                        <div className={`text-3xl mb-2 ${!badge.unlocked && 'grayscale'}`}>
                                            {badge.unlocked ? badge.emoji : '🔒'}
                                        </div>
                                        <div className={`text-xs font-bold ${badge.unlocked ? 'text-[#333333]' : 'text-gray-400'}`}>
                                            {badge.name}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowBadges(false)}
                                className="w-full mt-6 bg-[#FF6200] text-white py-3 rounded-xl font-bold"
                            >
                                Schließen
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav activeTab="dashboard" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
        </div>
    );
}
