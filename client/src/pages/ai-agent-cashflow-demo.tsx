import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertTriangle, TrendingUp } from "lucide-react";
import { MobileLayout } from "@/components/ing/layout";
import { JuniorDashboardScreen } from "@/components/ing/screens/junior/dashboard";
import { LeoChatOverlay } from "@/components/ing/leo/chat-overlay";
import { ChatMessage } from "@/lib/demo-scenarios";
import lionIcon from "@/assets/lion-logo.png";

type DemoStep = "splash" | "chat-open" | "cashflow-question" | "cashflow-response" | "done";

export function AIAgentCashFlowDemoPage() {
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
      "cashflow-question": 2700,
      "cashflow-response": 3900,
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
            id: "cashflow-user",
            sender: "user",
            text: "Leo, ich muss meinen Cash Flow verstehen.",
          });
          setIsTyping(true);
          setCurrentStep("cashflow-question");
          break;
        case "cashflow-question":
          pushMessage({
            id: "cashflow-leo",
            sender: "leo",
            text: "Analyse abgeschlossen. Warnung: Du hast zwei Mobilfunkvertraege aktiv. Einer O2, einer Telekom. Du zahlst doppelt.",
            widget: <CashFlowAnalysisWidget />,
          });
          setIsTyping(false);
          setCurrentStep("cashflow-response");
          break;
        case "cashflow-response":
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
                Cash Flow Analyse
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

function CashFlowAnalysisWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Monatliches Einkommen</span>
        <span className="font-bold text-green-600">€1.200</span>
      </div>
      <div className="text-xs text-gray-400">Freelance</div>
      <div className="h-px bg-gray-100" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Monatliche Ausgaben</span>
        <span className="font-bold text-gray-700">€980</span>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-700">Doppelte Mobilfunkvertraege</p>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-red-600">O2</span>
                <span className="font-bold text-red-700">€19,99/Monat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Telekom</span>
                <span className="font-bold text-red-700">€24,99/Monat</span>
              </div>
            </div>
            <p className="text-xs text-red-700 font-bold mt-2">Du zahlst doppelt.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <TrendingUp size={12} className="text-[#FF6200]" />
        Moegliche Ersparnis: €15/Monat
      </div>
    </div>
  );
}
