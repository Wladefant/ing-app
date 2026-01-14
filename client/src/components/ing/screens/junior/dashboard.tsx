import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { Trophy, Flame, TrendingUp, ChevronRight, Target, Brain, Play, Crown, Zap, BookOpen, PiggyBank, Medal, X, Lock, Sparkles, Copy, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getJuniorProfile, getLeaderboard, getBalance, formatCurrency, JuniorProfile, LeaderboardEntry } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useUserProgress } from "@/hooks/useUserProgress";
import { XPProgressBar, XPGainToast, LevelUpAnimation, BadgeUnlockToast, StreakCounter } from "../../gamification/xp-components";

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
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showXPGain, setShowXPGain] = useState(false);
    const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
    const { toast } = useToast();

    // Use the gamification hook
    const {
        progress,
        levelInfo,
        xpProgress,
        streakMultiplier,
        allBadges,
        unlockedBadges,
        lastXPGain,
        lastStreakResult,
        isNewDay,
        checkStreak
    } = useUserProgress();

    useEffect(() => {
        const loadedProfile = getJuniorProfile();
        setProfile(loadedProfile);

        // Get leaderboard and find user's rank
        const leaderboard = getLeaderboard("weekly");
        const myEntry = leaderboard.find(e => e.isCurrentUser);
        if (myEntry) {
            setUserRank(myEntry.rank);

            // Calculate points to next rank
            if (myEntry.rank > 1) {
                const nextUser = leaderboard.find(e => e.rank === myEntry.rank - 1);
                if (nextUser) {
                    setPointsToNextRank(nextUser.xp - myEntry.xp);
                }
            }
        }

        // Get junior balance (using extra account as junior savings)
        const balances = getBalance();
        setBalance(balances.extraKonto || 145.50);
    }, []);

    // Show level up animation when triggered
    useEffect(() => {
        if (lastXPGain?.levelUp) {
            setShowLevelUp(true);
        }
        if (lastXPGain && lastXPGain.xpGained > 0) {
            setShowXPGain(true);
            setTimeout(() => setShowXPGain(false), 3000);
        }
        if (lastXPGain?.badgesUnlocked && lastXPGain.badgesUnlocked.length > 0) {
            setShowBadgeUnlock(true);
            setTimeout(() => setShowBadgeUnlock(false), 4000);
        }
    }, [lastXPGain]);

    // Show streak notification on new day
    useEffect(() => {
        if (isNewDay && lastStreakResult) {
            if (lastStreakResult.streakBroken) {
                toast({
                    title: "😢 Streak verloren",
                    description: `Dein Streak wurde zurückgesetzt. Starte heute neu!`,
                });
            } else if (lastStreakResult.streakIncreased) {
                toast({
                    title: `🔥 ${lastStreakResult.newStreak} Tage Streak!`,
                    description: `+${lastStreakResult.xpBonus} XP verdient. Weiter so!`,
                });
            }
        }
    }, [isNewDay, lastStreakResult, toast]);

    // Use values from gamification system with fallback to profile
    const level = progress.level || profile?.level || 5;
    const levelTitle = levelInfo.title || getLevelTitle(level);
    const xp = progress.totalXP || profile?.xp || 1240;
    const streak = progress.streak || profile?.streak || 12;
    const badges = unlockedBadges.length || profile?.badges?.length || 8;
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

                {/* Flip Debit Card */}
                <div style={{ perspective: "1000px" }}>
                    <motion.div
                        className="relative w-full h-48 cursor-pointer"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                        onClick={() => setIsCardFlipped(!isCardFlipped)}
                    >
                        {/* Front of Card */}
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-[#FF6200] to-[#FF8F00] rounded-2xl p-5 text-white shadow-lg overflow-hidden"
                            style={{ backfaceVisibility: "hidden" }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-lg tracking-wider">ING</span>
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full bg-red-500 opacity-80" />
                                        <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-80 -ml-2" />
                                    </div>
                                </div>

                                <div>
                                    <div className="text-orange-100 text-[10px] uppercase tracking-wider mb-0.5">Mein Taschengeld</div>
                                    <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
                                </div>

                                <div className="flex justify-between items-end text-xs">
                                    <div>
                                        <div className="text-orange-200 text-[9px] uppercase tracking-wider">IBAN</div>
                                        <div className="font-mono">DE** •••• 1234</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-orange-200 text-[9px] uppercase tracking-wider">Gültig</div>
                                        <div className="font-mono">06/29</div>
                                    </div>
                                </div>

                                <div className="text-[9px] text-orange-200 text-center">Tippen für Details</div>
                            </div>
                        </div>

                        {/* Back of Card */}
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-[#FF8F00] to-[#FF6200] rounded-2xl text-white shadow-lg overflow-hidden"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                            {/* Magnetic Stripe */}
                            <div className="w-full h-8 bg-[#222] mt-3" />

                            {/* Signature Strip with CVV */}
                            <div className="mx-3 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-white h-7 rounded flex items-center px-2">
                                        <span className="text-gray-400 italic text-[10px] flex-1">{profile?.name || "Max Junior"}</span>
                                    </div>
                                    <div className="bg-white px-2 py-1 rounded">
                                        <div className="text-[7px] text-gray-500 uppercase">CVV</div>
                                        <div className="font-mono text-gray-900 font-bold text-sm">123</div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText("123");
                                            toast({ title: "📋 CVV kopiert!" });
                                        }}
                                        className="p-1 bg-white/20 rounded hover:bg-white/30"
                                    >
                                        <Copy size={10} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="px-3 mt-2 space-y-1.5">
                                {/* Card Number */}
                                <div className="flex items-center justify-between bg-white/15 p-1.5 rounded">
                                    <div>
                                        <div className="text-[7px] text-orange-100 uppercase">Kartennummer</div>
                                        <div className="font-mono text-[11px]">5274 1234 5678 9012</div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText("5274123456789012");
                                            toast({ title: "📋 Kartennummer kopiert!" });
                                        }}
                                        className="p-1 bg-white/20 rounded hover:bg-white/30"
                                    >
                                        <Copy size={10} />
                                    </button>
                                </div>

                                {/* IBAN */}
                                <div className="flex items-center justify-between bg-white/15 p-1.5 rounded">
                                    <div>
                                        <div className="text-[7px] text-orange-100 uppercase">IBAN</div>
                                        <div className="font-mono text-[10px]">DE89 3704 0044 0532 0130 00</div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText("DE89370400440532013000");
                                            toast({ title: "📋 IBAN kopiert!" });
                                        }}
                                        className="p-1 bg-white/20 rounded hover:bg-white/30"
                                    >
                                        <Copy size={10} />
                                    </button>
                                </div>

                                {/* Expiry & BIC */}
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-white/15 p-1.5 rounded">
                                        <div className="text-[7px] text-orange-100 uppercase">Gültig bis</div>
                                        <div className="font-mono text-[11px]">06/29</div>
                                    </div>
                                    <div className="flex-1 bg-white/15 p-1.5 rounded">
                                        <div className="text-[7px] text-orange-100 uppercase">BIC</div>
                                        <div className="font-mono text-[11px]">INGDDEFF</div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-[8px] text-orange-100 text-center mt-1">Tippen zum Zurückdrehen</div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => toast({ title: "📱 Apple Wallet", description: "Karte zu Wallet hinzugefügt! (Demo)" })}
                        className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Smartphone size={16} />
                        Zu Wallet
                    </button>
                    <button
                        onClick={() => onNavigate("savings")}
                        className="flex-1 bg-white text-[#FF6200] py-3 rounded-xl text-sm font-bold shadow-sm border border-orange-200 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Target size={16} />
                        Sparziel
                    </button>
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

                {/* Multiplayer Quiz Teaser */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => onNavigate("kahoot")}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg text-white text-left relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 font-bold">
                                <Zap size={20} className="text-yellow-400" fill="currentColor" />
                                <span>Live Quiz Battle</span>
                            </div>
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-md">NEU</span>
                        </div>
                        <p className="text-sm text-indigo-100 mb-3 pr-8">
                            Fordere deine Freunde heraus! Wer weiß mehr über Geld?
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-yellow-300">
                            <span>Jetzt spielen</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>
                </motion.button>

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
                                {unlockedBadges.length} von {allBadges.length} Badges freigeschaltet
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {allBadges.map((badge) => (
                                    <button
                                        key={badge.id}
                                        onClick={() => {
                                            if (badge.isUnlocked) {
                                                toast({ title: badge.name, description: badge.description });
                                            } else {
                                                toast({
                                                    title: "🔒 Noch nicht freigeschaltet",
                                                    description: badge.requirement
                                                });
                                            }
                                        }}
                                        className={`p-4 rounded-xl text-center transition-all ${badge.isUnlocked
                                            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 hover:scale-105'
                                            : 'bg-gray-100 border border-gray-200 opacity-50'
                                            }`}
                                    >
                                        <div className={`text-3xl mb-2 ${!badge.isUnlocked && 'grayscale'}`}>
                                            {badge.isUnlocked ? badge.icon : '🔒'}
                                        </div>
                                        <div className={`text-xs font-bold ${badge.isUnlocked ? 'text-[#333333]' : 'text-gray-400'}`}>
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

            {/* XP Gain Toast */}
            <AnimatePresence>
                {showXPGain && lastXPGain && (
                    <XPGainToast
                        amount={lastXPGain.xpGained}
                        source="Aktivität"
                        bonusAmount={lastXPGain.streakBonus}
                        isLevelUp={lastXPGain.levelUp}
                        newLevel={lastXPGain.newLevel || undefined}
                        onClose={() => setShowXPGain(false)}
                    />
                )}
            </AnimatePresence>

            {/* Level Up Animation */}
            <AnimatePresence>
                {showLevelUp && lastXPGain?.newLevel && (
                    <LevelUpAnimation
                        newLevel={lastXPGain.newLevel}
                        levelTitle={levelInfo.title}
                        levelIcon={levelInfo.icon}
                        onComplete={() => setShowLevelUp(false)}
                    />
                )}
            </AnimatePresence>

            {/* Badge Unlock Toast */}
            <AnimatePresence>
                {showBadgeUnlock && lastXPGain?.badgesUnlocked && lastXPGain.badgesUnlocked[0] && (
                    <BadgeUnlockToast
                        badgeName={lastXPGain.badgesUnlocked[0].name}
                        badgeIcon={lastXPGain.badgesUnlocked[0].icon}
                        badgeDescription={lastXPGain.badgesUnlocked[0].description}
                        xpBonus={lastXPGain.badgesUnlocked[0].xpBonus}
                        onClose={() => setShowBadgeUnlock(false)}
                    />
                )}
            </AnimatePresence>

            <BottomNav activeTab="dashboard" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
        </div>
    );
}
