import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Image, Paperclip, Send, ChevronDown, Trophy, Zap, TrendingUp, ArrowRight, Check, Volume2 } from "lucide-react";
import { ChatMessage } from "@/lib/demo-scenarios";
import lionIcon from "@assets/generated_images/minimalist_orange_app_icon_with_white_lion.png";

interface LeoChatOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isTyping?: boolean;
}

// Stock Widget Component
function StockWidget({ symbol, price, change }: { symbol: string; price: number; change: number }) {
    const isPositive = change >= 0;
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
                    {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">€{price.toFixed(2)}</div>
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
function TransferWidget({ recipient, amount, reference }: { recipient: string; amount: number; reference: string }) {
    const [isSent, setIsSent] = useState(false);
    
    if (isSent) {
        return (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={24} className="text-green-600" />
                </div>
                <div className="font-bold text-green-700">Überweisung geplant!</div>
                <div className="text-sm text-green-600">€{amount} an {recipient}</div>
            </div>
        );
    }
    
    return (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold">
                    {recipient.charAt(0)}
                </div>
                <div>
                    <div className="font-bold text-gray-800">{recipient}</div>
                    <div className="text-xs text-gray-500">{reference}</div>
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-3">€{amount.toFixed(2)}</div>
            <button 
                onClick={() => setIsSent(true)}
                className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
            >
                <Send size={16} />
                Jetzt senden
            </button>
        </div>
    );
}

// Quiz Widget Component
function QuizWidget({ topic, questions, xp }: { topic: string; questions: number; xp: number }) {
    return (
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Zap size={20} fill="currentColor" />
                    <span className="font-bold">Quiz Challenge</span>
                </div>
                <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                    +{xp} XP
                </div>
            </div>
            <div className="text-lg font-bold mb-1">{topic}</div>
            <div className="text-white/80 text-sm mb-3">{questions} Fragen</div>
            <button className="w-full bg-white text-violet-600 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Quiz starten
            </button>
        </div>
    );
}

// Achievement Widget Component
function AchievementWidget({ name, xp }: { name: string; xp: number }) {
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
            <div className="text-white/80 text-sm">+{xp} XP erhalten!</div>
        </div>
    );
}

export function LeoChatOverlay({ isOpen, onClose, messages, onSendMessage, isTyping }: LeoChatOverlayProps) {
    const [inputValue, setInputValue] = useState("");
    const [mode, setMode] = useState<"general" | "quiz">("general");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue("");
        }
    };

    const renderWidget = (msg: ChatMessage) => {
        if (!msg.widgetType || !msg.widgetData) return null;
        
        switch (msg.widgetType) {
            case "stock":
                return <StockWidget {...msg.widgetData} />;
            case "transfer":
                return <TransferWidget {...msg.widgetData} />;
            case "quiz":
                return <QuizWidget {...msg.widgetData} />;
            case "achievement":
                return <AchievementWidget {...msg.widgetData} />;
            default:
                return null;
        }
    };

    // Quick suggestion chips
    const suggestions = mode === "general" 
        ? ["Wie viel habe ich ausgegeben?", "Zeig mir mein Portfolio", "Erkläre ETFs"]
        : ["Quiz starten", "Aktien-Grundlagen", "Steuern lernen"];

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
                                    className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center shadow-lg shadow-orange-200"
                                >
                                    <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain brightness-0 invert" />
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
                                <div className="flex bg-gray-100 rounded-full p-1">
                                    <button 
                                        onClick={() => setMode("general")}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${mode === "general" ? "bg-white text-[#333333] shadow-sm" : "text-gray-500"}`}
                                    >
                                        💬 Chat
                                    </button>
                                    <button 
                                        onClick={() => setMode("quiz")}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${mode === "quiz" ? "bg-white text-[#333333] shadow-sm" : "text-gray-500"}`}
                                    >
                                        🧠 Quiz
                                    </button>
                                </div>

                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    <ChevronDown size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                                                <div className="w-6 h-6 bg-[#FF6200] rounded-full flex items-center justify-center shadow-sm">
                                                    <img src={lionIcon} alt="Leo" className="w-3 h-3 object-contain brightness-0 invert" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-500">Leo</span>
                                            </div>
                                        )}

                                        <div
                                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === "user"
                                                ? "bg-[#FF6200] text-white rounded-tr-sm"
                                                : "bg-white text-[#333333] rounded-tl-sm border border-gray-100"
                                                }`}
                                            style={{ whiteSpace: "pre-wrap" }}
                                        >
                                            {msg.text}
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
                                                <button className="text-gray-300 hover:text-[#FF6200] transition-colors">
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
                                            <div className="w-6 h-6 bg-[#FF6200] rounded-full flex items-center justify-center shadow-sm">
                                                <img src={lionIcon} alt="Leo" className="w-3 h-3 object-contain brightness-0 invert" />
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
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-[#FF6200] focus-within:ring-2 focus-within:ring-[#FF6200]/20 transition-all">
                                <button className="p-2 text-gray-400 hover:text-[#FF6200] transition-colors rounded-full hover:bg-gray-100">
                                    <Paperclip size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={mode === "quiz" ? "Deine Antwort..." : "Frag Leo..."}
                                    className="flex-1 bg-transparent outline-none text-[#333333] placeholder:text-gray-400"
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
                                        <button className="p-2 text-gray-400 hover:text-[#FF6200] transition-colors rounded-full hover:bg-gray-100">
                                            <Image size={20} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-[#FF6200] transition-colors rounded-full hover:bg-gray-100">
                                            <Mic size={20} />
                                        </button>
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
