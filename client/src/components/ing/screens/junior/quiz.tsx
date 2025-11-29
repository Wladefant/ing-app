import { useState, useEffect } from "react";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { Check, X, Trophy, ArrowRight, Zap, BookOpen, TrendingUp, PiggyBank, CreditCard, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateQuizQuestions, QuizQuestion } from "@/lib/openai";

// Quiz Topics with icons and colors
const QUIZ_TOPICS = [
    { id: "grundlagen", name: "Finanz-Grundlagen", icon: BookOpen, color: "from-blue-500 to-blue-600", description: "Zinsen, Konten & Sparen" },
    { id: "investieren", name: "Investieren", icon: TrendingUp, color: "from-green-500 to-emerald-600", description: "Aktien, ETFs & Fonds" },
    { id: "sparen", name: "Clever Sparen", icon: PiggyBank, color: "from-purple-500 to-violet-600", description: "Tipps & Strategien" },
    { id: "karten", name: "Karten & Zahlungen", icon: CreditCard, color: "from-orange-500 to-red-500", description: "EC, Kredit & Mobile Pay" },
];

// Difficulty levels
const DIFFICULTY_LEVELS = [
    { id: "einfach", name: "Einfach", emoji: "🌱", xpMultiplier: 1 },
    { id: "mittel", name: "Mittel", emoji: "🌿", xpMultiplier: 1.5 },
    { id: "schwer", name: "Schwer", emoji: "🌳", xpMultiplier: 2 },
];

// Fallback questions when AI is unavailable
const FALLBACK_QUESTIONS: Record<string, QuizQuestion[]> = {
    "grundlagen": [
        { id: 1, question: "Was ist ein 'Zins'?", options: ["Eine Gebühr für das Ausleihen von Geld", "Eine Art von Steuer", "Ein Geschenk der Bank", "Der Name einer Währung"], correctAnswer: 0, explanation: "Zinsen sind Gebühren, die man zahlt wenn man Geld leiht, oder erhält wenn man Geld verleiht." },
        { id: 2, question: "Was bedeutet 'Sparen'?", options: ["Geld sofort ausgeben", "Geld für später zurücklegen", "Geld verschenken", "Geld verbrennen"], correctAnswer: 1, explanation: "Sparen bedeutet, Geld nicht sofort auszugeben, sondern für die Zukunft aufzubewahren." },
        { id: 3, question: "Was ist ein Girokonto?", options: ["Ein Sparbuch", "Ein Konto für tägliche Zahlungen", "Eine Kreditkarte", "Ein Depot"], correctAnswer: 1, explanation: "Ein Girokonto ist dein Hauptkonto für den täglichen Zahlungsverkehr." },
    ],
    "investieren": [
        { id: 1, question: "Was bedeutet 'Diversifikation' beim Investieren?", options: ["Alles in eine Aktie stecken", "Geld auf verschiedene Anlagen verteilen", "Geld nur sparen", "Schulden machen"], correctAnswer: 1, explanation: "Diversifikation bedeutet 'nicht alle Eier in einen Korb legen' - das Risiko wird verteilt." },
        { id: 2, question: "Was ist ein ETF?", options: ["Ein einzelne Aktie", "Ein Fonds, der einen Index abbildet", "Ein Bankkonto", "Eine Versicherung"], correctAnswer: 1, explanation: "ETFs sind Fonds, die automatisch einen Aktienindex wie den DAX nachbilden." },
        { id: 3, question: "Was ist eine Dividende?", options: ["Eine Schuld", "Gewinnausschüttung an Aktionäre", "Eine Steuer", "Eine Gebühr"], correctAnswer: 1, explanation: "Dividenden sind Gewinnanteile, die Unternehmen an ihre Aktionäre ausschütten." },
    ],
    "sparen": [
        { id: 1, question: "Was ist ein Notgroschen?", options: ["Geld für Party", "Rücklage für unerwartete Ausgaben", "Taschengeld", "Schulden"], correctAnswer: 1, explanation: "Ein Notgroschen ist Geld, das du für unerwartete Ausgaben wie Reparaturen zurücklegst." },
        { id: 2, question: "Wie viel sollte man vom Gehalt sparen?", options: ["0%", "10-20%", "100%", "Nur Münzen"], correctAnswer: 1, explanation: "Experten empfehlen, 10-20% des Einkommens zu sparen - aber jeder Betrag hilft!" },
        { id: 3, question: "Was ist ein Sparplan?", options: ["Einmalzahlung", "Regelmäßiges automatisches Sparen", "Kredit", "Schuldenplan"], correctAnswer: 1, explanation: "Ein Sparplan ist eine regelmäßige, automatische Einzahlung - z.B. monatlich 50€." },
    ],
    "karten": [
        { id: 1, question: "Was ist der Unterschied zwischen EC und Kreditkarte?", options: ["Kein Unterschied", "EC-Karte bucht sofort ab, Kreditkarte später", "EC-Karte ist teurer", "Kreditkarte nur online"], correctAnswer: 1, explanation: "Bei der EC-Karte wird sofort abgebucht, bei Kreditkarten erst am Monatsende." },
        { id: 2, question: "Was ist 'kontaktloses Bezahlen'?", options: ["Per Brief zahlen", "Karte ans Terminal halten", "Bar zahlen", "Nicht zahlen"], correctAnswer: 1, explanation: "Kontaktloses Bezahlen funktioniert per NFC - Karte oder Handy ans Terminal halten." },
        { id: 3, question: "Warum sollte man seine PIN nie teilen?", options: ["Ist egal", "Zum Schutz vor Diebstahl", "PIN ist unwichtig", "Alle teilen sie"], correctAnswer: 1, explanation: "Die PIN schützt dein Geld - wer sie kennt, kann auf dein Konto zugreifen!" },
    ],
};

export function JuniorQuizScreen({
    onBack,
    onNavigate,
    onLeoClick
}: {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
    onLeoClick?: () => void;
}) {
    const [phase, setPhase] = useState<"topic" | "difficulty" | "loading" | "quiz" | "result">("topic");
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<typeof DIFFICULTY_LEVELS[0] | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isAIGenerated, setIsAIGenerated] = useState(false);

    const handleTopicSelect = (topicId: string) => {
        setSelectedTopic(topicId);
        setPhase("difficulty");
    };

    const handleDifficultySelect = async (difficulty: typeof DIFFICULTY_LEVELS[0]) => {
        setSelectedDifficulty(difficulty);
        setPhase("loading");

        const topic = QUIZ_TOPICS.find(t => t.id === selectedTopic);
        
        // Try to generate AI questions
        try {
            const aiQuestions = await generateQuizQuestions(
                topic?.name || "Finanzen",
                difficulty.id as "einfach" | "mittel" | "schwer",
                3,
                topic?.description
            );

            if (aiQuestions && aiQuestions.length > 0) {
                setQuestions(aiQuestions);
                setIsAIGenerated(true);
            } else {
                // Use fallback questions
                setQuestions(FALLBACK_QUESTIONS[selectedTopic || "grundlagen"] || FALLBACK_QUESTIONS["grundlagen"]);
                setIsAIGenerated(false);
            }
        } catch (error) {
            console.error("Failed to generate AI questions:", error);
            setQuestions(FALLBACK_QUESTIONS[selectedTopic || "grundlagen"] || FALLBACK_QUESTIONS["grundlagen"]);
            setIsAIGenerated(false);
        }

        setPhase("quiz");
    };

    const handleOptionClick = (index: number) => {
        if (selectedOption !== null) return;

        setSelectedOption(index);
        const correct = index === questions[currentQuestion].correctAnswer;
        setIsCorrect(correct);
        
        if (correct) {
            setScore(score + 1);
            setStreak(streak + 1);
        } else {
            setStreak(0);
        }

        // Show explanation
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setShowExplanation(false);
        } else {
            setPhase("result");
        }
    };

    const handleRestart = () => {
        setPhase("topic");
        setSelectedTopic(null);
        setSelectedDifficulty(null);
        setQuestions([]);
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setShowExplanation(false);
        setScore(0);
        setStreak(0);
        setIsAIGenerated(false);
    };

    // Topic Selection Phase
    if (phase === "topic") {
        return (
            <div className="flex-1 flex flex-col bg-gradient-to-b from-[#F3F3F3] to-white overflow-hidden">
                <ScreenHeader title="Finanz-Quiz" onBack={onBack} />
                
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Zap size={32} className="text-white" fill="currentColor" />
                        </div>
                        <h2 className="text-xl font-bold text-[#333333] mb-2">Wähle ein Thema</h2>
                        <p className="text-gray-500 text-sm">Teste dein Wissen und sammle XP!</p>
                    </div>

                    <div className="space-y-3">
                        {QUIZ_TOPICS.map((topic) => {
                            const Icon = topic.icon;
                            return (
                                <motion.button
                                    key={topic.id}
                                    onClick={() => handleTopicSelect(topic.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full p-4 bg-gradient-to-r ${topic.color} rounded-2xl text-white text-left shadow-lg`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-lg">{topic.name}</div>
                                            <div className="text-white/80 text-sm">{topic.description}</div>
                                        </div>
                                        <ArrowRight size={20} className="text-white/60" />
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex items-center gap-2 text-orange-600 font-bold mb-1">
                            <Sparkles size={16} />
                            <span>KI-Powered Quiz</span>
                        </div>
                        <p className="text-sm text-orange-700">
                            Die Fragen werden von Leo's KI für dich erstellt - jedes Quiz ist einzigartig! 🦁
                        </p>
                    </div>
                </div>
                <BottomNav activeTab="learn" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
            </div>
        );
    }

    // Difficulty Selection Phase
    if (phase === "difficulty") {
        return (
            <div className="flex-1 flex flex-col bg-gradient-to-b from-[#F3F3F3] to-white overflow-hidden">
                <ScreenHeader 
                    title="Schwierigkeit" 
                    onBack={() => setPhase("topic")} 
                />
                
                <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-[#333333] mb-2">Wie schwer soll's sein?</h2>
                        <p className="text-gray-500 text-sm">Schwerer = mehr XP! 💪</p>
                    </div>

                    <div className="space-y-4">
                        {DIFFICULTY_LEVELS.map((level) => (
                            <motion.button
                                key={level.id}
                                onClick={() => handleDifficultySelect(level)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full p-5 bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-[#FF6200] transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl">{level.emoji}</span>
                                        <div className="text-left">
                                            <div className="font-bold text-lg text-[#333333]">{level.name}</div>
                                            <div className="text-sm text-gray-500">XP Multiplikator: x{level.xpMultiplier}</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="text-gray-400" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
                <BottomNav activeTab="learn" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
            </div>
        );
    }

    // Loading Phase
    if (phase === "loading") {
        return (
            <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 bg-gradient-to-br from-[#FF6200] to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                    >
                        <Loader2 size={32} className="text-white" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-[#333333] mb-2">Leo erstellt dein Quiz...</h2>
                    <p className="text-gray-500 text-sm text-center">
                        Die KI generiert einzigartige Fragen für dich! 🦁✨
                    </p>
                </div>
                <BottomNav activeTab="learn" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
            </div>
        );
    }

    // Result Phase
    if (phase === "result") {
        const baseXP = score * 50;
        const multiplier = selectedDifficulty?.xpMultiplier || 1;
        const totalXP = Math.round(baseXP * multiplier);
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                                percentage >= 70 ? "bg-yellow-100" : percentage >= 40 ? "bg-blue-100" : "bg-gray-100"
                            }`}
                        >
                            <Trophy size={48} className={
                                percentage >= 70 ? "text-yellow-500" : percentage >= 40 ? "text-blue-500" : "text-gray-500"
                            } fill="currentColor" />
                        </motion.div>
                        
                        <h2 className="text-2xl font-bold text-[#333333] mb-2">
                            {percentage >= 70 ? "Super gemacht! 🎉" : percentage >= 40 ? "Gut gemacht!" : "Weiter üben!"}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Du hast {score} von {questions.length} Fragen richtig beantwortet ({percentage}%)
                        </p>

                        {isAIGenerated && (
                            <div className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-4">
                                ✨ KI-generiertes Quiz
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl mb-6 border border-orange-200">
                            <div className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-1">Belohnung</div>
                            <div className="text-3xl font-bold text-[#FF6200]">+ {totalXP} XP</div>
                            {multiplier > 1 && (
                                <div className="text-xs text-orange-500 mt-1">
                                    inkl. {selectedDifficulty?.name} Bonus (x{multiplier})
                                </div>
                        )}
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleRestart}
                                className="w-full bg-[#FF6200] text-white py-3 rounded-xl font-bold hover:bg-[#e55800] transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Neues Quiz starten
                            </button>
                            <button
                                onClick={onBack}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Zurück zum Dashboard
                            </button>
                        </div>
                    </motion.div>
                </div>
                <BottomNav activeTab="learn" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
            </div>
        );
    }

    // Quiz Phase
    const currentQ = questions[currentQuestion];
    if (!currentQ) return null;

    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader 
                title={`${QUIZ_TOPICS.find(t => t.id === selectedTopic)?.name || "Quiz"}`} 
                onBack={() => {
                    if (confirm("Quiz wirklich abbrechen?")) handleRestart();
                }}
                rightAction={
                    streak >= 2 && (
                        <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                            <Zap size={14} className="text-orange-500" fill="currentColor" />
                            <span className="text-sm font-bold text-orange-600">{streak}x</span>
                        </div>
                    )
                }
            />

            <div className="flex-1 p-6 flex flex-col">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
                        <span>Frage {currentQuestion + 1} von {questions.length}</span>
                        <span className="text-[#FF6200]">Score: {score}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-[#FF6200] to-orange-400 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col"
                    >
                        <h2 className="text-xl font-bold text-[#333333] mb-6 leading-relaxed">
                            {currentQ.question}
                        </h2>

                        {/* Options */}
                        <div className="space-y-3 flex-1">
                            {currentQ.options.map((option, index) => {
                                const isSelected = selectedOption === index;
                                const isCorrectOption = index === currentQ.correctAnswer;
                                const showCorrect = selectedOption !== null && isCorrectOption;

                                return (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleOptionClick(index)}
                                        disabled={selectedOption !== null}
                                        whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                                        whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                                        className={`w-full p-4 rounded-xl text-left font-medium transition-all border-2 ${
                                            isSelected
                                                ? isCorrect
                                                    ? "bg-green-50 border-green-500 text-green-700"
                                                    : "bg-red-50 border-red-500 text-red-700"
                                                : showCorrect
                                                    ? "bg-green-50 border-green-500 text-green-700"
                                                    : "bg-white border-transparent text-gray-600 shadow-sm"
                                        } ${selectedOption === null ? "hover:border-gray-200" : ""}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{option}</span>
                                            {isSelected && (
                                                isCorrect 
                                                    ? <Check size={20} className="text-green-600" /> 
                                                    : <X size={20} className="text-red-600" />
                                            )}
                                            {!isSelected && showCorrect && (
                                                <Check size={20} className="text-green-600" />
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                            {showExplanation && currentQ.explanation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className={`mt-4 p-4 rounded-xl ${
                                        isCorrect ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
                                    }`}
                                >
                                    <div className={`font-bold text-sm mb-1 ${isCorrect ? "text-green-700" : "text-orange-700"}`}>
                                        {isCorrect ? "🎉 Richtig!" : "💡 Erklärung:"}
                                    </div>
                                    <p className={`text-sm ${isCorrect ? "text-green-600" : "text-orange-600"}`}>
                                        {currentQ.explanation}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Next Button */}
                        {showExplanation && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handleNextQuestion}
                                className="mt-4 w-full bg-[#FF6200] text-white py-3 rounded-xl font-bold hover:bg-[#e55800] transition-colors flex items-center justify-center gap-2"
                            >
                                {currentQuestion < questions.length - 1 ? (
                                    <>
                                        Nächste Frage
                                        <ArrowRight size={18} />
                                    </>
                                ) : (
                                    <>
                                        Ergebnis anzeigen
                                        <Trophy size={18} />
                                    </>
                                )}
                            </motion.button>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            <BottomNav activeTab="learn" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
        </div>
    );
}
