import { useState } from "react";
import { ScreenHeader } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { Check, X, Trophy, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "Was ist ein 'Zins'?",
        options: [
            "Eine Gebühr für das Ausleihen von Geld",
            "Eine Art von Steuer",
            "Ein Geschenk der Bank",
            "Der Name einer Währung"
        ],
        correctAnswer: 0
    },
    {
        id: 2,
        question: "Was bedeutet 'Diversifikation' beim Investieren?",
        options: [
            "Alles Geld in eine Aktie stecken",
            "Geld auf verschiedene Anlagen verteilen",
            "Geld nur auf dem Konto lassen",
            "Geld schnell ausgeben"
        ],
        correctAnswer: 1
    }
];

export function JuniorQuizScreen({
    onBack,
    onNavigate
}: {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
}) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleOptionClick = (index: number) => {
        if (selectedOption !== null) return; // Prevent multiple clicks

        setSelectedOption(index);
        const correct = index === QUIZ_QUESTIONS[currentQuestion].correctAnswer;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);

        setTimeout(() => {
            if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    if (showResult) {
        return (
            <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm"
                >
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy size={48} className="text-yellow-500" fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333] mb-2">Gut gemacht!</h2>
                    <p className="text-gray-500 mb-6">Du hast {score} von {QUIZ_QUESTIONS.length} Fragen richtig beantwortet.</p>

                    <div className="bg-orange-50 p-4 rounded-xl mb-6">
                        <div className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-1">Belohnung</div>
                        <div className="text-3xl font-bold text-[#FF6200]">+ {score * 50} XP</div>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full bg-[#FF6200] text-white py-3 rounded-xl font-bold hover:bg-[#e55800] transition-colors"
                    >
                        Zurück zum Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
            <ScreenHeader title="Finanz-Quiz" onBack={onBack} />

            <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="mb-8">
                    <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
                        <span>Frage {currentQuestion + 1} von {QUIZ_QUESTIONS.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="bg-[#FF6200] h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                        />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-[#333333] mb-8 leading-relaxed">
                    {QUIZ_QUESTIONS[currentQuestion].question}
                </h2>

                <div className="space-y-3">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(index)}
                            disabled={selectedOption !== null}
                            className={`w-full p-4 rounded-xl text-left font-medium transition-all border-2 ${selectedOption === index
                                    ? isCorrect
                                        ? "bg-green-50 border-green-500 text-green-700"
                                        : "bg-red-50 border-red-500 text-red-700"
                                    : "bg-white border-transparent hover:border-gray-200 text-gray-600 shadow-sm"
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{option}</span>
                                {selectedOption === index && (
                                    isCorrect ? <Check size={20} /> : <X size={20} />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
