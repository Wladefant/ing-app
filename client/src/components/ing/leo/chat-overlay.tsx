import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Image, Paperclip, Send, ChevronDown, Trophy, Zap, TrendingUp, ArrowRight, Check, Volume2, Target, PieChart, Loader2, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { ChatMessage } from "@/lib/demo-scenarios";
import { WidgetAction, generateQuizQuestions as generateQuizQuestionsAPI } from "@/lib/openai";
import lionIcon from "@/assets/lion-logo.png";
import ReactMarkdown from 'react-markdown';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from "recharts";

// Quiz Question interface
interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

// Quiz State interface
interface QuizState {
    isActive: boolean;
    topic: string;
    difficulty: string;
    questions: QuizQuestion[];
    currentQuestion: number;
    score: number;
    answered: boolean;
    selectedAnswer: number | null;
    showExplanation: boolean;
    completed: boolean;
    isLoading?: boolean;
}

interface LeoChatOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isTyping?: boolean;
    onNavigate?: (screen: string) => void;
    onStartQuiz?: (topic: string, difficulty?: string) => void;
    pendingWidgets?: WidgetAction[];
}

// Stock Widget Component
function StockWidget({ symbol, price, change, analysis }: { symbol: string; price?: number; change?: number; analysis?: string }) {
    const isPositive = (change || 0) >= 0;
    const displayPrice = price || (symbol === "AAPL" ? 178.50 : symbol === "ING" ? 12.45 : symbol === "TSLA" ? 245.60 : 100);
    const displayChange = change || (symbol === "AAPL" ? 1.5 : symbol === "ING" ? 1.2 : symbol === "TSLA" ? -3.3 : 0.5);

    return (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center">
                        <TrendingUp size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-gray-800">{symbol}</span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(displayChange)}%
                </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">€{displayPrice.toFixed(2)}</div>
            {analysis && (
                <p className="text-xs text-gray-500 mt-2">{analysis}</p>
            )}
            <div className="mt-2 flex gap-2">
                <button className="flex-1 bg-[#FF6200] text-white text-xs py-2 rounded-lg font-bold hover:bg-[#e55800] transition-colors">
                    Kaufen
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                    Watchlist
                </button>
            </div>
        </div>
    );
}

// Transfer Widget Component
function TransferWidget({ recipient, amount, reference }: { recipient: string; amount: number; reference?: string }) {
    const [step, setStep] = useState<"review" | "confirm" | "sent">("review");
    // Generate a fake IBAN based on recipient name
    const iban = `DE89 3704 0044 ${Math.abs(recipient.charCodeAt(0) * 100 + recipient.charCodeAt(1) * 10).toString().padStart(4, '0')} ${Math.floor(Math.random() * 9000 + 1000)} 00`;
    const altRecipient = recipient.includes("Ben") ? "Benjamin Müller" : recipient.includes("Max") ? "Maximilian Weber" : null;

    if (step === "sent") {
        return (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={24} className="text-green-600" />
                </div>
                <div className="font-bold text-green-700">Überweisung ausgeführt!</div>
                <div className="text-sm text-green-600">€{amount.toFixed(2)} an {recipient}</div>
                <div className="text-[10px] text-green-500 mt-1">IBAN: {iban}</div>
            </div>
        );
    }

    if (step === "confirm") {
        return (
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
                <div className="text-center mb-3">
                    <div className="font-bold text-gray-800 text-sm">Überweisung bestätigen</div>
                    <div className="text-[10px] text-gray-500">Bitte überprüfe die Daten</div>
                </div>
                <div className="bg-white rounded-lg p-3 space-y-2 mb-3 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Empfänger</span><span className="font-bold">{recipient}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">IBAN</span><span className="font-mono text-[10px]">{iban}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Betrag</span><span className="font-bold text-[#FF6200]">€{amount.toFixed(2)}</span></div>
                    {reference && <div className="flex justify-between"><span className="text-gray-500">Verwendung</span><span className="font-bold">{reference}</span></div>}
                </div>
                <button onClick={() => setStep("sent")}
                    className="w-full bg-[#FF6200] text-white py-3 rounded-xl font-bold hover:bg-[#e55800] transition-colors flex items-center justify-center gap-2">
                    <Send size={16} /> Jetzt senden
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold">
                    {recipient.charAt(0)}
                </div>
                <div>
                    <div className="font-bold text-gray-800">{recipient}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{iban}</div>
                    {reference && <div className="text-[10px] text-gray-500">{reference}</div>}
                </div>
            </div>
            {altRecipient && (
                <div className="bg-violet-100/50 rounded-lg p-2 mb-2 flex items-center gap-2">
                    <span className="text-[10px] text-violet-600">Meintest du <strong>{altRecipient}</strong>?</span>
                    <button className="text-[9px] bg-white text-violet-600 px-2 py-0.5 rounded font-bold border border-violet-200">Wechseln</button>
                </div>
            )}
            <div className="text-2xl font-bold text-gray-900 mb-3">€{amount.toFixed(2)}</div>
            <button onClick={() => setStep("confirm")}
                className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
                <ArrowRight size={16} /> Weiter
            </button>
        </div>
    );
}

// Quiz Widget Component - Preview card before starting
function QuizWidget({ topic, questions, xp, difficulty, onStart }: { topic: string; questions?: number; xp?: number; difficulty?: string; onStart?: () => void }) {
    return (
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Zap size={20} fill="currentColor" />
                    <span className="font-bold">Quiz Challenge</span>
                </div>
                <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                    +{xp || 50} XP
                </div>
            </div>
            <div className="text-lg font-bold mb-1">{topic}</div>
            <div className="text-white/80 text-sm mb-1">{questions || 3} Fragen</div>
            {difficulty && <div className="text-white/60 text-xs mb-3">Schwierigkeit: {difficulty}</div>}
            <button
                onClick={onStart}
                className="w-full bg-white text-violet-600 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
                Quiz starten
            </button>
        </div>
    );
}

// Interactive Quiz Interface Component - The actual quiz with questions
function InteractiveQuiz({
    quizState,
    onAnswer,
    onNext,
    onFinish,
    onExit
}: {
    quizState: QuizState;
    onAnswer: (answerIndex: number) => void;
    onNext: () => void;
    onFinish: () => void;
    onExit: () => void;
}) {
    const { questions, currentQuestion, score, answered, selectedAnswer, showExplanation, completed, topic, difficulty, isLoading } = quizState;

    // Show loading state
    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-8 text-white text-center flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 size={40} className="animate-spin mb-4" />
                <div className="text-xl font-bold mb-2">Quiz wird generiert...</div>
                <div className="text-white/80">Leo denkt sich knifflige Fragen aus! 🦁</div>
            </div>
        );
    }

    const question = questions?.[currentQuestion];

    if (!question && !completed) return null;

    if (completed) {
        const totalQuestions = questions.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        const xpEarned = score * 20 + (percentage === 100 ? 50 : 0);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-5 text-white text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                >
                    {percentage >= 70 ? (
                        <Trophy size={40} className="text-yellow-300" fill="currentColor" />
                    ) : (
                        <Sparkles size={40} className="text-white" />
                    )}
                </motion.div>

                <h3 className="text-xl font-bold mb-2">Quiz abgeschlossen!</h3>
                <p className="text-white/80 mb-4">{topic} - {difficulty}</p>

                <div className="bg-white/20 rounded-xl p-4 mb-4">
                    <div className="text-4xl font-bold mb-1">{score}/{totalQuestions}</div>
                    <div className="text-sm text-white/80">Richtige Antworten</div>
                    <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="h-full bg-green-400 rounded-full"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                    <Zap size={20} fill="currentColor" className="text-yellow-300" />
                    <span className="font-bold text-lg">+{xpEarned} XP verdient!</span>
                </div>

                <button
                    onClick={onFinish}
                    className="w-full bg-white text-violet-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                    Fertig
                </button>
            </motion.div>
        );
    }

    if (!question) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-4 text-white"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Zap size={18} fill="currentColor" />
                    <span className="font-bold text-sm">{topic}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                        Frage {currentQuestion + 1}/{questions.length}
                    </div>
                    <button onClick={onExit} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors" title="Quiz beenden">
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-white/20 rounded-full mb-4 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + (answered ? 1 : 0)) / questions.length) * 100}%` }}
                    className="h-full bg-white rounded-full"
                />
            </div>

            {/* Question */}
            <div className="text-lg font-bold mb-4 leading-snug">
                {question.question}
            </div>

            {/* Answer Options */}
            <div className="space-y-2 mb-4">
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === question.correctAnswer;
                    const showResult = answered;

                    let buttonClass = "w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ";

                    if (showResult) {
                        if (isCorrect) {
                            buttonClass += "bg-green-500 text-white border-2 border-green-300";
                        } else if (isSelected && !isCorrect) {
                            buttonClass += "bg-red-500/80 text-white border-2 border-red-300";
                        } else {
                            buttonClass += "bg-white/10 text-white/50 border-2 border-transparent";
                        }
                    } else {
                        buttonClass += isSelected
                            ? "bg-white text-violet-600 border-2 border-white"
                            : "bg-white/20 text-white hover:bg-white/30 border-2 border-transparent";
                    }

                    return (
                        <motion.button
                            key={index}
                            onClick={() => !answered && onAnswer(index)}
                            disabled={answered}
                            className={buttonClass}
                            whileHover={!answered ? { scale: 1.02 } : {}}
                            whileTap={!answered ? { scale: 0.98 } : {}}
                        >
                            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1">{option}</span>
                            {showResult && isCorrect && (
                                <CheckCircle2 size={20} className="shrink-0" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                                <XCircle size={20} className="shrink-0" />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Explanation after answering */}
            <AnimatePresence>
                {showExplanation && question.explanation && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/10 rounded-xl p-3 mb-4"
                    >
                        <div className="text-xs font-bold text-white/70 mb-1">Erklärung:</div>
                        <div className="text-sm text-white/90">{question.explanation}</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Score and Next button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-300" />
                    <span className="text-sm font-bold">{score} Punkte</span>
                </div>

                {answered && (
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onNext}
                        className="bg-white text-violet-600 px-5 py-2 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        {currentQuestion < questions.length - 1 ? "Weiter" : "Ergebnis"}
                        <ArrowRight size={16} />
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

// Achievement Widget Component
function AchievementWidget({ name, xp, description }: { name: string; xp: number; description?: string }) {
    return (
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 text-white text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2"
            >
                <Trophy size={32} className="text-yellow-100" fill="currentColor" />
            </motion.div>
            <div className="font-bold text-lg">{name}</div>
            {description && <div className="text-white/80 text-sm">{description}</div>}
            <div className="text-white/90 text-sm mt-1">+{xp} XP erhalten!</div>
        </div>
    );
}

// Savings Goal Widget Component
function SavingsGoalWidget({ goalName, targetAmount, currentAmount, weeksRemaining }: { goalName: string; targetAmount: number; currentAmount: number; weeksRemaining?: number }) {
    const progress = Math.min((currentAmount / targetAmount) * 100, 100);

    return (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Target size={20} className="text-emerald-600" />
                </div>
                <div>
                    <div className="font-bold text-gray-800">{goalName}</div>
                    <div className="text-xs text-gray-500">Sparziel</div>
                </div>
            </div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">€{currentAmount.toFixed(0)} gespart</span>
                <span className="font-bold text-emerald-600">€{targetAmount.toFixed(0)}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
                <span>{progress.toFixed(0)}% erreicht</span>
                {weeksRemaining && <span>~{weeksRemaining} Wochen bis zum Ziel</span>}
            </div>
        </div>
    );
}

// Spending Chart Widget Component
function PortfolioWidget({ holdings, totalValue, totalGain }: { holdings?: Array<{ symbol: string; name: string; shares: number; currentPrice: number; avgPrice: number }>; totalValue?: number; totalGain?: number }) {
    const items = holdings || [];
    const total = totalValue || items.reduce((s, h) => s + h.shares * h.currentPrice, 0);
    const gain = totalGain || items.reduce((s, h) => s + h.shares * (h.currentPrice - h.avgPrice), 0);
    const gainPercent = total > 0 ? ((gain / (total - gain)) * 100) : 0;

    return (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <TrendingUp size={16} className="text-emerald-600" />
                </div>
                <div>
                    <div className="font-bold text-gray-800 text-sm">Dein Portfolio</div>
                    <div className="text-[10px] text-gray-500">{items.length} Positionen</div>
                </div>
                <div className="ml-auto text-right">
                    <div className="font-bold text-gray-900">€{total.toFixed(0)}</div>
                    <div className={`text-[10px] font-bold ${gain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {gain >= 0 ? '+' : ''}{gain.toFixed(0)}€ ({gainPercent.toFixed(1)}%)
                    </div>
                </div>
            </div>
            {items.length > 0 && (
                <div className="space-y-1.5">
                    {items.slice(0, 5).map((h, i) => {
                        const value = h.shares * h.currentPrice;
                        const itemGain = h.shares * (h.currentPrice - h.avgPrice);
                        return (
                            <div key={i} className="flex items-center justify-between bg-white/60 rounded-lg px-2.5 py-1.5">
                                <div>
                                    <span className="font-bold text-xs text-gray-800">{h.symbol}</span>
                                    <span className="text-[9px] text-gray-400 ml-1">{h.shares}x</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-xs">€{value.toFixed(0)}</span>
                                    <span className={`text-[9px] ml-1 ${itemGain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {itemGain >= 0 ? '+' : ''}{itemGain.toFixed(0)}€
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const PIE_COLORS = ["#FF6200", "#00A4CC", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

function SpendingChartWidget({ category, amount, percentChange, breakdown }: { category: string; amount: number; percentChange?: number; breakdown?: Array<{ name: string; amount: number }> }) {
    const isUp = (percentChange || 0) > 0;
    const pieData = breakdown?.map(b => ({ name: b.name, value: b.amount })) || [];

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <PieChart size={16} className="text-blue-600" />
                </div>
                <div>
                    <div className="font-bold text-gray-800 text-sm">{category}</div>
                    <div className="text-[10px] text-gray-500">Ausgabenanalyse</div>
                </div>
                <div className="ml-auto text-right">
                    <span className="text-lg font-bold text-gray-900">€{amount.toFixed(0)}</span>
                    {percentChange !== undefined && (
                        <span className={`block text-[10px] font-medium ${isUp ? 'text-red-500' : 'text-green-500'}`}>
                            {isUp ? '↑' : '↓'} {Math.abs(percentChange)}%
                        </span>
                    )}
                </div>
            </div>
            {pieData.length > 0 && (
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-24 h-24 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                                <Pie data={pieData} innerRadius={20} outerRadius={36} paddingAngle={3} dataKey="value">
                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                            </RechartsPie>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1">
                        {breakdown?.slice(0, 5).map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px]">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                <span className="text-gray-600 truncate">{item.name}</span>
                                <span className="font-bold ml-auto">€{item.amount.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function LeoChatOverlay({ isOpen, onClose, messages, onSendMessage, isTyping, onNavigate, onStartQuiz, pendingWidgets }: LeoChatOverlayProps) {
    const [inputValue, setInputValue] = useState("");
    const [mode, setMode] = useState<"general" | "quiz">("general");
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [quizState, setQuizState] = useState<QuizState>({
        isActive: false,
        topic: "",
        difficulty: "mittel",
        questions: [],
        currentQuestion: 0,
        score: 0,
        answered: false,
        selectedAnswer: null,
        showExplanation: false,
        completed: false
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Generate quiz questions based on topic
    const generateQuizQuestions = (topic: string, difficulty: string): QuizQuestion[] => {
        const quizBank: Record<string, QuizQuestion[]> = {
            "ETFs": [
                {
                    question: "Was bedeutet ETF?",
                    options: ["Exchange Traded Fund", "Electronic Transfer Fee", "European Trading Framework", "Equity Trust Fund"],
                    correctAnswer: 0,
                    explanation: "ETF steht für Exchange Traded Fund - ein börsengehandelter Fonds, der einen Index nachbildet."
                },
                {
                    question: "Welcher Vorteil hat ein ETF gegenüber Einzelaktien?",
                    options: ["Höhere Rendite garantiert", "Automatische Diversifikation", "Keine Gebühren", "Immer steuerfrei"],
                    correctAnswer: 1,
                    explanation: "ETFs investieren in viele verschiedene Wertpapiere gleichzeitig, was das Risiko durch Streuung reduziert."
                },
                {
                    question: "Was ist ein thesaurierender ETF?",
                    options: ["Ein ETF der nur in Tech-Aktien investiert", "Ein ETF der Dividenden automatisch reinvestiert", "Ein ETF mit monatlicher Auszahlung", "Ein ETF nur für institutionelle Anleger"],
                    correctAnswer: 1,
                    explanation: "Bei thesaurierenden ETFs werden Dividenden automatisch reinvestiert, was den Zinseszinseffekt nutzt."
                },
                {
                    question: "Was ist der TER bei ETFs?",
                    options: ["Die Tracking Error Rate", "Die Total Expense Ratio (Gesamtkostenquote)", "Der Tax Efficiency Rating", "Die Trading Exchange Rate"],
                    correctAnswer: 1,
                    explanation: "TER (Total Expense Ratio) zeigt die jährlichen Gesamtkosten eines ETFs in Prozent."
                },
                {
                    question: "Welcher Index wird vom beliebtesten ETF der Welt abgebildet?",
                    options: ["DAX", "S&P 500", "MSCI World", "Nikkei 225"],
                    correctAnswer: 1,
                    explanation: "Der S&P 500 Index mit den 500 größten US-Unternehmen ist die Basis für die meisten ETF-Investments weltweit."
                }
            ],
            "Aktien": [
                {
                    question: "Was ist eine Aktie?",
                    options: ["Ein Kredit an ein Unternehmen", "Ein Anteil an einem Unternehmen", "Eine Versicherung", "Ein Sparvertrag"],
                    correctAnswer: 1,
                    explanation: "Eine Aktie ist ein Wertpapier, das einen Anteil am Grundkapital einer Aktiengesellschaft verbrieft."
                },
                {
                    question: "Was ist eine Dividende?",
                    options: ["Eine Steuer auf Aktien", "Eine Gewinnbeteiligung für Aktionäre", "Eine Gebühr beim Aktienkauf", "Ein Verlustausgleich"],
                    correctAnswer: 1,
                    explanation: "Die Dividende ist eine Gewinnausschüttung, die ein Unternehmen an seine Aktionäre zahlt."
                },
                {
                    question: "Was bedeutet 'Blue Chip'?",
                    options: ["Eine günstige Aktie", "Ein Tech-Startup", "Eine etablierte Qualitätsaktie", "Eine risikoreiche Aktie"],
                    correctAnswer: 2,
                    explanation: "Blue Chips sind Aktien von großen, etablierten Unternehmen mit stabiler Geschichte und guter Bonität."
                },
                {
                    question: "Was ist das KGV (Kurs-Gewinn-Verhältnis)?",
                    options: ["Aktienkurs geteilt durch Gewinn pro Aktie", "Gewinn geteilt durch Aktienkurs", "Umsatz geteilt durch Aktienkurs", "Aktienkurs mal Gewinn"],
                    correctAnswer: 0,
                    explanation: "Das KGV zeigt, wie viele Jahre es dauern würde, bis der Gewinn den Aktienkurs erreicht hat."
                },
                {
                    question: "Was passiert bei einem Aktiensplit 2:1?",
                    options: ["Man erhält die Hälfte der Aktien", "Man erhält doppelt so viele Aktien zum halben Preis", "Der Aktienkurs verdoppelt sich", "Man muss Aktien abgeben"],
                    correctAnswer: 1,
                    explanation: "Bei einem 2:1 Split erhält jeder Aktionär doppelt so viele Aktien, wobei sich der Kurs halbiert."
                }
            ],
            "Sparen": [
                {
                    question: "Was ist der Zinseszinseffekt?",
                    options: ["Zinsen werden nur auf das Startkapital berechnet", "Zinsen werden auch auf bereits erhaltene Zinsen berechnet", "Zinsen werden von der Bank einbehalten", "Zinsen werden jährlich ausgezahlt"],
                    correctAnswer: 1,
                    explanation: "Beim Zinseszinseffekt werden Zinsen reinvestiert und im nächsten Jahr mitverzinst - so wächst das Vermögen exponentiell."
                },
                {
                    question: "Was ist ein Notgroschen?",
                    options: ["Ein Cent-Stück", "Eine Rücklage für unerwartete Ausgaben", "Ein Sparschwein", "Eine Anlageform"],
                    correctAnswer: 1,
                    explanation: "Ein Notgroschen ist eine finanzielle Reserve (meist 3-6 Monatsgehälter) für unvorhergesehene Ausgaben."
                },
                {
                    question: "Wie viel Prozent des Einkommens sollte man sparen?",
                    options: ["1-5%", "10-20%", "50-60%", "Es gibt keine Empfehlung"],
                    correctAnswer: 1,
                    explanation: "Finanzexperten empfehlen, etwa 10-20% des Nettoeinkommens zu sparen - die 50-30-20 Regel ist ein guter Richtwert."
                },
                {
                    question: "Was ist ein Dauerauftrag?",
                    options: ["Eine einmalige Überweisung", "Eine regelmäßig wiederkehrende Überweisung", "Ein Kredit", "Eine Lastschrift"],
                    correctAnswer: 1,
                    explanation: "Ein Dauerauftrag führt automatisch regelmäßige Überweisungen durch - ideal zum Sparen!"
                },
                {
                    question: "Was bedeutet 'Pay yourself first'?",
                    options: ["Luxusausgaben priorisieren", "Zuerst die Sparrate überweisen, dann ausgeben", "Zuerst Schulden tilgen", "Sich selbst Geschenke machen"],
                    correctAnswer: 1,
                    explanation: "Diese Strategie empfiehlt, direkt nach Gehaltseingang die Sparrate wegzulegen, bevor man konsumiert."
                }
            ],
            "Steuern": [
                {
                    question: "Was ist der Sparerpauschbetrag in Deutschland 2024?",
                    options: ["500€", "801€", "1.000€", "2.000€"],
                    correctAnswer: 2,
                    explanation: "Der Sparerpauschbetrag beträgt seit 2023 1.000€ für Singles (2.000€ für Verheiratete)."
                },
                {
                    question: "Wie hoch ist die Kapitalertragssteuer in Deutschland?",
                    options: ["19%", "25%", "30%", "42%"],
                    correctAnswer: 1,
                    explanation: "Die Abgeltungssteuer auf Kapitalerträge beträgt pauschal 25% (plus Soli und ggf. Kirchensteuer)."
                },
                {
                    question: "Was ist ein Freistellungsauftrag?",
                    options: ["Eine Steuererklärung", "Ein Antrag um Kapitalerträge steuerfrei zu erhalten", "Ein Kreditantrag", "Eine Versicherung"],
                    correctAnswer: 1,
                    explanation: "Mit einem Freistellungsauftrag weist man die Bank an, den Sparerpauschbetrag zu berücksichtigen."
                },
                {
                    question: "Was ist das FIFO-Prinzip bei Aktien?",
                    options: ["First In, First Out - zuerst gekaufte Aktien werden zuerst verkauft", "Final Investment For Options", "Fixed Income For Orders", "Financial Investment Fund Order"],
                    correctAnswer: 0,
                    explanation: "Bei FIFO werden steuerlich die zuerst gekauften Aktien als zuerst verkauft betrachtet."
                },
                {
                    question: "Wie lange ist die Spekulationsfrist für Aktien?",
                    options: ["1 Jahr", "Es gibt keine mehr seit 2009", "5 Jahre", "10 Jahre"],
                    correctAnswer: 1,
                    explanation: "Seit 2009 gibt es keine Spekulationsfrist mehr für Aktien - die Abgeltungssteuer gilt immer."
                }
            ],
            "Zinsen": [
                {
                    question: "Was ist der Leitzins?",
                    options: ["Der Zinssatz für Privatkredite", "Der Zinssatz der Zentralbank für Geschäftsbanken", "Der Zinssatz für Sparkonten", "Der höchste erlaubte Zinssatz"],
                    correctAnswer: 1,
                    explanation: "Der Leitzins ist der Zinssatz, zu dem sich Geschäftsbanken bei der Zentralbank Geld leihen können."
                },
                {
                    question: "Was ist der effektive Jahreszins?",
                    options: ["Nur die Zinsen ohne Gebühren", "Der Gesamtpreis eines Kredits inklusive aller Kosten", "Der Zinssatz nach Steuern", "Der Zinssatz für ein Jahr ohne Zinseszins"],
                    correctAnswer: 1,
                    explanation: "Der effektive Jahreszins enthält alle Kosten eines Kredits und ermöglicht den Vergleich verschiedener Angebote."
                },
                {
                    question: "Was passiert mit Anleihen wenn die Zinsen steigen?",
                    options: ["Ihr Kurs steigt", "Ihr Kurs fällt", "Sie bleiben gleich", "Sie werden automatisch verkauft"],
                    correctAnswer: 1,
                    explanation: "Wenn die Zinsen steigen, werden bestehende Anleihen mit niedrigeren Zinsen weniger attraktiv - der Kurs fällt."
                },
                {
                    question: "Was bedeutet 'negativer Zinssatz'?",
                    options: ["Man bekommt Zinsen geschenkt", "Man zahlt für das Halten von Geld", "Ein Fehler im System", "Zinsen werden nicht ausgezahlt"],
                    correctAnswer: 1,
                    explanation: "Bei negativen Zinsen zahlt man dafür, Geld anzulegen - das soll zum Ausgeben und Investieren anregen."
                },
                {
                    question: "Wie berechnet man die Verdopplungszeit bei einem Zinssatz (72er-Regel)?",
                    options: ["72 mal Zinssatz", "72 geteilt durch Zinssatz", "Zinssatz geteilt durch 72", "72 plus Zinssatz"],
                    correctAnswer: 1,
                    explanation: "Die 72er-Regel: 72 geteilt durch den Zinssatz ergibt ungefähr die Jahre bis zur Verdopplung des Kapitals."
                }
            ]
        };

        // Default questions if topic not found
        const defaultQuestions: QuizQuestion[] = [
            {
                question: `Was ist ${topic}?`,
                options: ["Eine Investmentform", "Eine Versicherung", "Eine Steuerart", "Ein Sparprodukt"],
                correctAnswer: 0,
                explanation: "Lerne mehr über dieses Thema in unseren Finanz-Guides!"
            },
            {
                question: "Warum ist Finanzwissen wichtig?",
                options: ["Um reich zu werden", "Um bessere Entscheidungen zu treffen", "Um Steuern zu sparen", "Um Banken zu verstehen"],
                correctAnswer: 1,
                explanation: "Gutes Finanzwissen hilft dir, informierte Entscheidungen für deine finanzielle Zukunft zu treffen."
            },
            {
                question: "Was sollte man vor jeder Investition tun?",
                options: ["Einfach kaufen", "Sich informieren und Risiken verstehen", "Freunde fragen", "Auf Glück hoffen"],
                correctAnswer: 1,
                explanation: "Vor jeder Investition sollte man das Produkt verstehen und die Risiken kennen."
            }
        ];

        let questions = quizBank[topic] || defaultQuestions;

        // Adjust number of questions based on difficulty
        const numQuestions = difficulty === "einfach" ? 3 : difficulty === "schwer" ? 5 : 4;

        // Shuffle and limit questions
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, numQuestions);
    };

    // Start a quiz
    const handleStartQuiz = async (topic: string, difficulty: string = "mittel") => {
        // Initial state with loading
        setQuizState({
            isActive: true,
            isLoading: true,
            topic,
            difficulty,
            questions: [],
            currentQuestion: 0,
            score: 0,
            answered: false,
            selectedAnswer: null,
            showExplanation: false,
            completed: false
        });

        // Try to generate questions from API
        try {
            // Count based on difficulty
            const count = difficulty === "einfach" ? 3 : difficulty === "schwer" ? 5 : 4;
            const apiQuestions = await generateQuizQuestionsAPI(topic, difficulty as any, count);

            if (apiQuestions && apiQuestions.length > 0) {
                setQuizState(prev => ({
                    ...prev,
                    isLoading: false,
                    questions: apiQuestions
                }));
                return;
            }
        } catch (error) {
            console.error("Failed to generate quiz questions:", error);
        }

        // Fallback to local questions if API fails
        const fallbackQuestions = generateQuizQuestions(topic, difficulty);
        setQuizState(prev => ({
            ...prev,
            isLoading: false,
            questions: fallbackQuestions
        }));
    };

    // Handle quiz answer
    const handleQuizAnswer = (answerIndex: number) => {
        const question = quizState.questions[quizState.currentQuestion];
        const isCorrect = answerIndex === question.correctAnswer;

        setQuizState(prev => ({
            ...prev,
            answered: true,
            selectedAnswer: answerIndex,
            score: isCorrect ? prev.score + 1 : prev.score,
            showExplanation: true
        }));
    };

    // Move to next question
    const handleNextQuestion = () => {
        if (quizState.currentQuestion < quizState.questions.length - 1) {
            setQuizState(prev => ({
                ...prev,
                currentQuestion: prev.currentQuestion + 1,
                answered: false,
                selectedAnswer: null,
                showExplanation: false
            }));
        } else {
            setQuizState(prev => ({
                ...prev,
                completed: true
            }));
        }
    };

    // Finish quiz
    const handleFinishQuiz = () => {
        setQuizState(prev => ({
            ...prev,
            isActive: false
        }));
        // Send completion message
        onSendMessage(`Ich habe das ${quizState.topic} Quiz mit ${quizState.score}/${quizState.questions.length} Punkten abgeschlossen!`);
    };

    // Exit quiz early
    const handleExitQuiz = () => {
        setQuizState(prev => ({
            ...prev,
            isActive: false
        }));
    };

    // Check for speech recognition support
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setSpeechSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'de-DE';

            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('');
                setInputValue(transcript);

                // If it's a final result, send the message
                if (event.results[0].isFinal) {
                    setIsListening(false);
                    if (transcript.trim()) {
                        onSendMessage(transcript.trim());
                        setInputValue("");
                    }
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, [onSendMessage]);

    const toggleVoice = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping, pendingWidgets]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue("");
        }
    };

    // Render widget based on type (from demo scenarios or AI-generated)
    const renderWidget = (msg: ChatMessage) => {
        if (!msg.widgetType || !msg.widgetData) return null;

        switch (msg.widgetType) {
            case "stock":
                return <StockWidget {...msg.widgetData} />;
            case "transfer":
                return <TransferWidget {...msg.widgetData} />;
            case "quiz":
                // Use handleStartQuiz for interactive quiz
                return <QuizWidget {...msg.widgetData} onStart={() => handleStartQuiz(msg.widgetData.topic, msg.widgetData.difficulty)} />;
            case "achievement":
                return <AchievementWidget {...msg.widgetData} />;
            case "savings_goal":
                return <SavingsGoalWidget {...msg.widgetData} />;
            case "spending_chart":
                return <SpendingChartWidget {...msg.widgetData} />;
            default:
                return null;
        }
    };

    // Render AI-generated widget actions
    const renderAgentWidget = (widget: WidgetAction) => {
        switch (widget.action) {
            case "show_stock_widget":
                return <StockWidget symbol={widget.data.symbol} analysis={widget.data.analysis} />;
            case "show_transfer_widget":
                return <TransferWidget recipient={widget.data.recipient} amount={widget.data.amount} reference={widget.data.reference} />;
            case "start_quiz":
                // Start quiz directly with interactive interface
                return <QuizWidget topic={widget.data.topic} difficulty={widget.data.difficulty} questions={widget.data.questions} onStart={() => handleStartQuiz(widget.data.topic, widget.data.difficulty)} />;
            case "show_achievement":
                return <AchievementWidget name={widget.data.name} xp={widget.data.xp} description={widget.data.description} />;
            case "show_savings_goal":
                return <SavingsGoalWidget goalName={widget.data.goalName} targetAmount={widget.data.targetAmount} currentAmount={widget.data.currentAmount} weeksRemaining={widget.data.weeksRemaining} />;
            case "show_spending_chart":
                return <SpendingChartWidget category={widget.data.category} amount={widget.data.amount} percentChange={widget.data.percentChange} breakdown={widget.data.breakdown} />;
            case "get_portfolio_data":
                return <PortfolioWidget holdings={widget.data.holdings} totalValue={widget.data.totalValue} totalGain={widget.data.totalGain} />;
            case "navigate_to_screen":
                // Show a navigation button
                return (
                    <button
                        onClick={() => onNavigate?.(widget.data.screen)}
                        className="w-full bg-[#FF6200] text-white py-3 rounded-xl font-bold hover:bg-[#e55800] transition-colors flex items-center justify-center gap-2"
                    >
                        Zu {widget.data.screen} gehen
                        <ArrowRight size={16} />
                    </button>
                );
            default:
                return null;
        }
    };

    // Quick suggestion chips
    const suggestions = ["Wie viel habe ich ausgegeben?", "Zeig mir mein Portfolio", "Erkläre ETFs"];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/30 z-40"
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 h-[90%] bg-[#F8F8F8] z-50 rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-orange-200"
                                >
                                    <img src={lionIcon} alt="Leo" className="w-full h-full object-cover" />
                                </motion.div>
                                <div>
                                    <div className="font-bold text-[#333333]">Leo</div>
                                    <div className="text-xs text-[#FF6200] font-medium flex items-center gap-1">
                                        <motion.span
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="w-2 h-2 bg-green-500 rounded-full"
                                        />
                                        Online • Powered by AI
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500" title="Schließen">
                                    <ChevronDown size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Active Quiz Interface */}
                            {quizState.isActive && (
                                <InteractiveQuiz
                                    quizState={quizState}
                                    onAnswer={handleQuizAnswer}
                                    onNext={handleNextQuestion}
                                    onFinish={handleFinishQuiz}
                                    onExit={handleExitQuiz}
                                />
                            )}

                            {/* Regular Chat when no quiz is active */}
                            {!quizState.isActive && (
                                <>
                                    <div className="flex justify-center py-2">
                                        <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                            Heute
                                        </span>
                                    </div>

                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`max-w-[85%] ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                                                {msg.sender === "leo" && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-6 h-6 rounded-lg overflow-hidden shadow-sm">
                                                            <img src={lionIcon} alt="Leo" className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-500">Leo</span>
                                                    </div>
                                                )}

                                                <div
                                                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === "user"
                                                        ? "bg-[#FF6200] text-white rounded-tr-sm"
                                                        : "bg-white text-[#333333] rounded-tl-sm border border-gray-100"
                                                        }`}
                                                >
                                                    {msg.sender === "leo" ? (
                                                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-[#FF6200] prose-ul:my-1 prose-li:my-0">
                                                            <div className="max-h-[300px] overflow-y-auto">
                                                            <ReactMarkdown
                                                                components={{
                                                                    p: ({ children }) => <p className="my-1">{children}</p>,
                                                                    strong: ({ children }) => <strong className="font-bold text-[#FF6200]">{children}</strong>,
                                                                    ul: ({ children }) => <ul className="list-disc list-inside my-1 space-y-0.5">{children}</ul>,
                                                                    ol: ({ children }) => <ol className="list-decimal list-inside my-1 space-y-0.5">{children}</ol>,
                                                                    li: ({ children }) => <li className="my-0">{children}</li>,
                                                                    h1: ({ children }) => <h1 className="font-bold text-sm mt-2 mb-1">{children}</h1>,
                                                                    h2: ({ children }) => <h2 className="font-bold text-sm mt-2 mb-1">{children}</h2>,
                                                                    h3: ({ children }) => <h3 className="font-bold text-xs mt-1.5 mb-0.5 text-[#FF6200]">{children}</h3>,
                                                                    code: ({ children, className }) => className ? (
                                                                        <pre className="bg-gray-100 p-2 rounded text-[10px] overflow-x-auto my-1"><code>{children}</code></pre>
                                                                    ) : (
                                                                        <code className="bg-gray-100 px-1 rounded text-xs">{children}</code>
                                                                    ),
                                                                    pre: ({ children }) => <>{children}</>,
                                                                    hr: () => <hr className="my-2 border-gray-200" />,
                                                                    blockquote: ({ children }) => <blockquote className="border-l-2 border-[#FF6200] pl-2 my-1 text-gray-600 italic">{children}</blockquote>,
                                                                }}
                                                            >
                                                                {msg.text}
                                                            </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        msg.text
                                                    )}
                                                </div>

                                                {/* Render widget if present */}
                                                {msg.widgetType && msg.widgetData && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="mt-2 w-full"
                                                    >
                                                        {renderWidget(msg)}
                                                    </motion.div>
                                                )}

                                                {msg.widget && (
                                                    <div className="mt-2 w-full">
                                                        {msg.widget}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 px-1">
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {msg.sender === "leo" && (
                                                        <button className="text-gray-300 hover:text-[#FF6200] transition-colors" title="Vorlesen">
                                                            <Volume2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-6 h-6 rounded-lg overflow-hidden shadow-sm">
                                                        <img src={lionIcon} alt="Leo" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500">Leo denkt nach...</span>
                                                </div>
                                                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex gap-1">
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                                        className="w-2 h-2 bg-[#FF6200] rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                                                        className="w-2 h-2 bg-[#FF6200] rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                                                        className="w-2 h-2 bg-[#FF6200] rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Render AI-generated widgets */}
                                    {pendingWidgets && pendingWidgets.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-start"
                                        >
                                            <div className="max-w-[85%] flex flex-col gap-2">
                                                {pendingWidgets.map((widget, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.1 * idx }}
                                                    >
                                                        {renderAgentWidget(widget)}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions */}
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                            {suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSendMessage(suggestion)}
                                    className="shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-[#FF6200] hover:text-[#FF6200] transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="bg-white p-4 border-t border-gray-100 shrink-0 pb-8">
                            {isListening && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-center gap-2 mb-2 text-[#FF6200]"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="w-2 h-2 bg-[#FF6200] rounded-full"
                                    />
                                    <span className="text-sm font-medium">Ich höre zu...</span>
                                </motion.div>
                            )}
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-[#FF6200] focus-within:ring-2 focus-within:ring-[#FF6200]/20 transition-all">
                                <button
                                    className="p-2 text-gray-400 hover:text-[#FF6200] transition-colors rounded-full hover:bg-gray-100"
                                    title="Datei anhängen"
                                >
                                    <Paperclip size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={isListening ? "Sprich jetzt..." : (mode === "quiz" ? "Deine Antwort..." : "Frag Leo...")}
                                    className={`flex-1 bg-transparent outline-none text-[#333333] placeholder:text-gray-400 ${isListening ? 'placeholder:text-[#FF6200]' : ''}`}
                                    readOnly={isListening}
                                />
                                {inputValue ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSend}
                                        className="p-2 bg-[#FF6200] text-white rounded-xl hover:bg-[#e55800] transition-colors"
                                    >
                                        <Send size={18} />
                                    </motion.button>
                                ) : (
                                    <>
                                        <button
                                            className="p-2 text-gray-400 hover:text-[#FF6200] transition-colors rounded-full hover:bg-gray-100"
                                            title="Bild anhängen"
                                        >
                                            <Image size={20} />
                                        </button>
                                        {speechSupported && (
                                            <motion.button
                                                onClick={toggleVoice}
                                                className={`p-2 transition-colors rounded-full ${isListening
                                                    ? 'bg-[#FF6200] text-white'
                                                    : 'text-gray-400 hover:text-[#FF6200] hover:bg-gray-100'
                                                    }`}
                                                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                                                transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                                                title={isListening ? "Aufnahme stoppen" : "Sprachaufnahme starten"}
                                            >
                                                <Mic size={20} />
                                            </motion.button>
                                        )}
                                        {!speechSupported && (
                                            <button
                                                className="p-2 text-gray-300 cursor-not-allowed rounded-full"
                                                title="Spracheingabe nicht unterstützt"
                                                disabled
                                            >
                                                <Mic size={20} />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
