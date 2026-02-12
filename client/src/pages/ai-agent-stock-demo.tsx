import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, TrendingUp, AlertCircle, Shield, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/ing/layout";
import { JuniorDashboardScreen } from "@/components/ing/screens/junior/dashboard";
import { LeoChatOverlay } from "@/components/ing/leo/chat-overlay";
import { ChatMessage } from "@/lib/demo-scenarios";
import lionIcon from "@/assets/lion-logo.png";

type DemoStep = "splash" | "chat-open" | "stock-question" | "stock-response" | "done";

export function AIAgentStockDemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("splash");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showExtras, setShowExtras] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const pushMessage = (message: Omit<ChatMessage, "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        timestamp: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const timings: Record<DemoStep, number> = {
      splash: 1800,
      "chat-open": 750,
      "stock-question": 2850,
      "stock-response": 4200,
      done: 750,
    };

    const timer = setTimeout(() => {
      switch (currentStep) {
        case "splash":
          setIsChatOpen(true);
          setCurrentStep("chat-open");
          break;
        case "chat-open":
          pushMessage({
            id: "stock-user",
            sender: "user",
            text: "Jetzt moechte ich das Geld investieren. Was ist mit dem Automobilsektor?",
          });
          setIsTyping(true);
          setCurrentStep("stock-question");
          break;
        case "stock-question":
          pushMessage({
            id: "stock-leo",
            sender: "leo",
            text: "Smart Agent Analyse: Ich habe 200 Nachrichtenberichte gescannt. Der Sektor ist derzeit instabil wegen Lieferkettenproblemen. Mein Vorschlag: Abwarten.",
            widget: <StockAnalysisWidget />,
          });
          setIsTyping(false);
          setCurrentStep("stock-response");
          break;
        case "stock-response":
          setCurrentStep("done");
          break;
        case "done":
          setIsAutoPlaying(false);
          break;
      }
    }, timings[currentStep]);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying, isPaused]);

  const restartDemo = () => {
    setCurrentStep("splash");
    setMessages([]);
    setIsAutoPlaying(true);
    setIsPaused(false);
    setIsChatOpen(false);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 font-sans bg-white">
      <MobileLayout>
        <JuniorDashboardScreen onNavigate={() => {}} onLeoClick={() => setIsChatOpen(true)} />

        <LeoChatOverlay
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          onSendMessage={() => {}}
          isTyping={isTyping}
        />

        <AnimatePresence mode="wait">
          {currentStep === "splash" && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-[#FF6200] to-[#E55800] flex flex-col items-center justify-center px-8 z-50"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
              >
                <img src={lionIcon} alt="Leo" className="w-20 h-20 object-contain" />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-3xl font-bold mt-6"
              >
                LEO
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 mt-2 text-center"
              >
                Aktien Agent
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2, type: "tween" }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </MobileLayout>

      <button
        onClick={() => setShowExtras(!showExtras)}
        className="fixed top-4 right-4 z-[100] p-3 bg-black/80 backdrop-blur rounded-full text-white hover:bg-black transition-colors"
        title={showExtras ? "Hide controls (Recording mode)" : "Show controls"}
      >
        {showExtras ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      <div className="fixed bottom-4 right-4 z-[60]">
        <div className="flex gap-2 bg-black/80 backdrop-blur rounded-full px-4 py-2">
          <button
            onClick={restartDemo}
            className="text-white text-xs font-medium hover:text-[#FF6200] transition-colors px-2"
          >
            ↺ Restart
          </button>
          <div className="w-px bg-white/30" />
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-white text-xs font-medium hover:text-[#FF6200] transition-colors px-2"
          >
            {isPaused ? "▶ Play" : "⏸ Pause"}
          </button>
          {showExtras && (
            <>
              <div className="w-px bg-white/30" />
              <span className="text-white/60 text-xs px-2">{currentStep}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StockAnalysisWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp size={14} className="text-[#FF6200]" />
        <span className="text-xs font-bold text-gray-700">Smart Agent Analyse</span>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">Automobilsektor: Instabil</p>
            <ul className="text-xs text-amber-700 mt-2 space-y-1">
              <li>• Lieferkettenprobleme</li>
              <li>• Ruecklaeufige EV-Subventionen</li>
              <li>• Hohe Volatilitaet</li>
            </ul>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] text-amber-700">Risiko-Level:</span>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">HOCH</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={12} className="text-green-600" />
          <span className="text-xs font-bold text-green-700">Empfehlung: Abwarten</span>
        </div>
        <div className="text-xs text-green-700 space-y-1">
          {"Erneuerbare Energien, Healthcare Tech, Cloud Computing".split(", ").map((sector) => (
            <div key={sector} className="flex items-center gap-1">
              <ChevronRight size={12} />
              <span>{sector}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
