import { useState, useEffect } from "react";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { Target, PiggyBank, Plus, ChevronRight, Sparkles, TrendingUp, Check, Gift, Gamepad2, Headphones, Plane, Laptop, Trophy, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSavingsGoals, addSavingsGoal, updateSavingsGoal, type SavingsGoal } from "@/lib/storage";

// Pre-defined savings goal categories for teenagers
const GOAL_CATEGORIES = [
    { id: "gaming", name: "Gaming", icon: Gamepad2, color: "from-purple-500 to-indigo-600", emoji: "🎮" },
    { id: "tech", name: "Technik", icon: Laptop, color: "from-blue-500 to-cyan-600", emoji: "💻" },
    { id: "music", name: "Musik & Audio", icon: Headphones, color: "from-pink-500 to-rose-600", emoji: "🎧" },
    { id: "travel", name: "Reisen", icon: Plane, color: "from-teal-500 to-emerald-600", emoji: "✈️" },
    { id: "gift", name: "Geschenke", icon: Gift, color: "from-amber-500 to-orange-600", emoji: "🎁" },
    { id: "other", name: "Anderes", icon: Target, color: "from-gray-500 to-slate-600", emoji: "🎯" },
];

// Get color for a category
const getCategoryColor = (categoryId: string): string => {
    const cat = GOAL_CATEGORIES.find(c => c.id === categoryId);
    return cat?.color || "from-gray-500 to-slate-600";
};

// Get emoji for a category
const getCategoryEmoji = (categoryId: string): string => {
    const cat = GOAL_CATEGORIES.find(c => c.id === categoryId);
    return cat?.emoji || "🎯";
};

export function JuniorSavingsScreen({
    onBack,
    onNavigate,
    onLeoClick
}: {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
    onLeoClick?: () => void;
}) {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [showNewGoalModal, setShowNewGoalModal] = useState(false);
    const [newGoalStep, setNewGoalStep] = useState<"category" | "details" | "amount" | "confirm">("category");
    const [selectedCategory, setSelectedCategory] = useState<typeof GOAL_CATEGORIES[0] | null>(null);
    const [newGoalName, setNewGoalName] = useState("");
    const [newGoalAmount, setNewGoalAmount] = useState("");
    const [newGoalWeekly, setNewGoalWeekly] = useState("10");

    // Load goals from storage on mount
    useEffect(() => {
        const loadGoals = () => {
            const storedGoals = getSavingsGoals();
            setGoals(storedGoals);
        };
        loadGoals();

        // Refresh on focus
        window.addEventListener("focus", loadGoals);
        return () => window.removeEventListener("focus", loadGoals);
    }, []);

    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0) || 1; // Avoid division by zero

    const handleCreateGoal = () => {
        if (!selectedCategory || !newGoalName || !newGoalAmount) return;

        const newGoal: SavingsGoal = {
            id: Date.now().toString(),
            name: newGoalName,
            category: selectedCategory.id,
            targetAmount: parseFloat(newGoalAmount),
            currentAmount: 0,
            weeklyContribution: parseFloat(newGoalWeekly),
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };

        addSavingsGoal(newGoal);
        setGoals([...goals, newGoal]);
        resetNewGoalForm();
    };

    const resetNewGoalForm = () => {
        setShowNewGoalModal(false);
        setNewGoalStep("category");
        setSelectedCategory(null);
        setNewGoalName("");
        setNewGoalAmount("");
        setNewGoalWeekly("10");
    };

    const handleAddToGoal = (goalId: string, amount: number) => {
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return;

        const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        updateSavingsGoal(goalId, { currentAmount: newAmount });

        setGoals(goals.map(g =>
            g.id === goalId
                ? { ...g, currentAmount: newAmount }
                : g
        ));
    };

    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader
                title="Sparziele"
                onBack={onBack}
                rightAction={
                    <button
                        onClick={() => setShowNewGoalModal(true)}
                        className="w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center text-white"
                    >
                        <Plus size={18} />
                    </button>
                }
            />

            {/* Overview Card */}
            <div className="px-4 pt-2 pb-4">
                <div className="bg-gradient-to-br from-[#FF6200] to-[#FF8F00] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-orange-100 text-sm font-medium mb-2">
                            <PiggyBank size={16} />
                            <span>Gesamt gespart</span>
                        </div>
                        <div className="text-3xl font-bold mb-3">{totalSaved.toFixed(2)} €</div>
                        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(totalSaved / totalTarget) * 100}%` }}
                                className="bg-white h-full rounded-full"
                            />
                        </div>
                        <div className="text-sm text-orange-100">
                            {Math.round((totalSaved / totalTarget) * 100)}% von {totalTarget.toFixed(2)} €
                        </div>
                    </div>
                </div>
            </div>

            {/* Goals List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-[#333333]">Deine Sparziele</h2>
                    <span className="text-sm text-gray-500">{goals.length} Ziele</span>
                </div>

                {goals.map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const remaining = goal.targetAmount - goal.currentAmount;
                    const weeklyContribution = goal.weeklyContribution || 10;
                    const weeksLeft = Math.ceil(remaining / weeklyContribution);
                    const isComplete = progress >= 100;
                    const goalColor = getCategoryColor(goal.category || "other");
                    const goalEmoji = getCategoryEmoji(goal.category || "other");

                    return (
                        <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm overflow-hidden"
                        >
                            <div className={`bg-gradient-to-r ${goalColor} p-4 text-white`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{goalEmoji}</span>
                                        <div>
                                            <div className="font-bold">{goal.name}</div>
                                            <div className="text-sm text-white/80">
                                                {isComplete ? "Ziel erreicht! 🎉" : `Noch ${weeksLeft} Wochen`}
                                            </div>
                                        </div>
                                    </div>
                                    {isComplete && (
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <Trophy size={20} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Fortschritt</span>
                                    <span className="font-bold text-[#333333]">
                                        {goal.currentAmount.toFixed(2)} € / {goal.targetAmount.toFixed(2)} €
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className={`bg-gradient-to-r ${goalColor} h-full rounded-full`}
                                    />
                                </div>

                                {!isComplete && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToGoal(goal.id, 5)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            + 5 €
                                        </button>
                                        <button
                                            onClick={() => handleAddToGoal(goal.id, 10)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            + 10 €
                                        </button>
                                        <button
                                            onClick={() => handleAddToGoal(goal.id, weeklyContribution)}
                                            className="flex-1 bg-[#FF6200] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#e55800] transition-colors"
                                        >
                                            + {weeklyContribution} €
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {/* Add Goal Card */}
                <button
                    onClick={() => setShowNewGoalModal(true)}
                    className="w-full bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#FF6200] hover:bg-orange-50 transition-all"
                >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus size={24} className="text-gray-400" />
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-gray-600">Neues Sparziel</div>
                        <div className="text-sm text-gray-400">Wofür möchtest du sparen?</div>
                    </div>
                </button>
            </div>

            {/* New Goal Modal */}
            <AnimatePresence>
                {showNewGoalModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 z-50 flex items-end"
                        onClick={() => resetNewGoalForm()}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[80%] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#333333]">
                                    {newGoalStep === "category" && "Kategorie wählen"}
                                    {newGoalStep === "details" && "Details eingeben"}
                                    {newGoalStep === "amount" && "Betrag festlegen"}
                                    {newGoalStep === "confirm" && "Bestätigen"}
                                </h2>
                                <button
                                    onClick={resetNewGoalForm}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                >
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Category Selection */}
                            {newGoalStep === "category" && (
                                <div className="grid grid-cols-2 gap-3">
                                    {GOAL_CATEGORIES.map((cat) => {
                                        const Icon = cat.icon;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setNewGoalStep("details");
                                                }}
                                                className={`p-4 bg-gradient-to-br ${cat.color} rounded-2xl text-white text-left`}
                                            >
                                                <span className="text-3xl mb-2 block">{cat.emoji}</span>
                                                <div className="font-bold">{cat.name}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Details Step */}
                            {newGoalStep === "details" && selectedCategory && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <span className="text-3xl">{selectedCategory.emoji}</span>
                                        <div>
                                            <div className="text-sm text-gray-500">Kategorie</div>
                                            <div className="font-bold">{selectedCategory.name}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-2">
                                            Wofür sparst du?
                                        </label>
                                        <input
                                            type="text"
                                            value={newGoalName}
                                            onChange={(e) => setNewGoalName(e.target.value)}
                                            placeholder="z.B. PlayStation 5, iPhone, Konzerttickets"
                                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#FF6200] focus:ring-2 focus:ring-[#FF6200]/20 outline-none"
                                        />
                                    </div>

                                    <button
                                        onClick={() => newGoalName && setNewGoalStep("amount")}
                                        disabled={!newGoalName}
                                        className="w-full bg-[#FF6200] text-white py-4 rounded-xl font-bold hover:bg-[#e55800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Weiter <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Amount Step */}
                            {newGoalStep === "amount" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-2">
                                            Wie viel kostet es? (€)
                                        </label>
                                        <input
                                            type="number"
                                            value={newGoalAmount}
                                            onChange={(e) => setNewGoalAmount(e.target.value)}
                                            placeholder="z.B. 500"
                                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#FF6200] focus:ring-2 focus:ring-[#FF6200]/20 outline-none text-2xl font-bold text-center"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-600 block mb-2">
                                            Wie viel sparst du pro Woche?
                                        </label>
                                        <div className="flex gap-2">
                                            {["5", "10", "15", "20"].map((amount) => (
                                                <button
                                                    key={amount}
                                                    onClick={() => setNewGoalWeekly(amount)}
                                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${newGoalWeekly === amount
                                                            ? "bg-[#FF6200] text-white"
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {amount} €
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {newGoalAmount && newGoalWeekly && (
                                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                            <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                                                <Sparkles size={16} />
                                                <span>Voraussichtliches Zieldatum</span>
                                            </div>
                                            <p className="text-green-600">
                                                In ca. {Math.ceil(parseFloat(newGoalAmount) / parseFloat(newGoalWeekly))} Wochen
                                                ({new Date(Date.now() + Math.ceil(parseFloat(newGoalAmount) / parseFloat(newGoalWeekly)) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })})
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => newGoalAmount && setNewGoalStep("confirm")}
                                        disabled={!newGoalAmount}
                                        className="w-full bg-[#FF6200] text-white py-4 rounded-xl font-bold hover:bg-[#e55800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Weiter <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Confirm Step */}
                            {newGoalStep === "confirm" && selectedCategory && (
                                <div className="space-y-4">
                                    <div className={`bg-gradient-to-br ${selectedCategory.color} rounded-2xl p-6 text-white text-center`}>
                                        <span className="text-5xl mb-3 block">{selectedCategory.emoji}</span>
                                        <div className="text-2xl font-bold mb-1">{newGoalName}</div>
                                        <div className="text-white/80">Ziel: {parseFloat(newGoalAmount).toFixed(2)} €</div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                            <span className="text-gray-500">Wöchentlich sparen</span>
                                            <span className="font-bold">{newGoalWeekly} €</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                            <span className="text-gray-500">Geschätzte Dauer</span>
                                            <span className="font-bold">{Math.ceil(parseFloat(newGoalAmount) / parseFloat(newGoalWeekly))} Wochen</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCreateGoal}
                                        className="w-full bg-[#FF6200] text-white py-4 rounded-xl font-bold hover:bg-[#e55800] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} />
                                        Sparziel erstellen
                                    </button>
                                </div>
                            )}

                            {/* Step indicator */}
                            <div className="flex justify-center gap-2 mt-6">
                                {["category", "details", "amount", "confirm"].map((step, i) => (
                                    <div
                                        key={step}
                                        className={`w-2 h-2 rounded-full transition-colors ${["category", "details", "amount", "confirm"].indexOf(newGoalStep) >= i
                                                ? "bg-[#FF6200]"
                                                : "bg-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav activeTab="savings" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
        </div>
    );
}
