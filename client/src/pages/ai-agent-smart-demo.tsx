import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, CheckCircle } from "lucide-react";
import { MobileLayout } from "@/components/ing/layout";
import { JuniorDashboardScreen } from "@/components/ing/screens/junior/dashboard";
import { LeoChatOverlay } from "@/components/ing/leo/chat-overlay";
import { ChatMessage } from "@/lib/demo-scenarios";
import lionIcon from "@/assets/lion-logo.png";

type DemoStep =
  | "splash"
  | "chat-open"
  | "cancel-question"
  | "cancel-draft"
  | "cancel-sent"
  | "done";

export function AIAgentSmartDemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("splash");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showExtras, setShowExtras] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
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
      "cancel-question": 2550,
      "cancel-draft": 3450,
      "cancel-sent": 2700,
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
            id: "cancel-user-1",
            sender: "user",
            text: "Oh nein! Ich habe vergessen, den alten zu kuendigen!",
          });
          setIsTyping(true);
          setCurrentStep("cancel-question");
          break;
        case "cancel-question":
          pushMessage({
            id: "cancel-leo",
            sender: "leo",
            text: "Ich habe die Kuendigungs-E-Mail vorbereitet. Klicke zum Senden.",
            widget: <CancellationDraftWidget sent={emailSent} onSend={() => setEmailSent(true)} />,
          });
          setIsTyping(false);
          setCurrentStep("cancel-draft");
          break;
        case "cancel-draft":
          setEmailSent(true);
          pushMessage({
            id: "cancel-user-2",
            sender: "user",
            text: "Gesendet. Das spart mir €15 im Monat.",
          });
          setCurrentStep("cancel-sent");
          break;
        case "cancel-sent":
          setCurrentStep("done");
          break;
        case "done":
          setIsAutoPlaying(false);
          break;
      }
    }, timings[currentStep]);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying, isPaused, emailSent]);

  const restartDemo = () => {
    setCurrentStep("splash");
    setMessages([]);
    setEmailSent(false);
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
                Intelligenter Agent
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

function CancellationDraftWidget({ sent, onSend }: { sent: boolean; onSend: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Mail size={14} className="text-gray-400" />
        <span className="text-xs text-gray-500">E-Mail Entwurf</span>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs space-y-2">
        <div className="flex gap-2">
          <span className="text-gray-400 w-12">An:</span>
          <span className="text-gray-700">kuendigung@o2online.de</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 w-12">Betreff:</span>
          <span className="text-gray-700 font-medium">Kuendigung Mobilfunkvertrag</span>
        </div>
        <div className="h-px bg-gray-200 my-2" />
        <div className="text-gray-600 leading-relaxed">
          Sehr geehrte Damen und Herren,<br /><br />
          hiermit kuendige ich meinen Mobilfunkvertrag zum naechstmoeglichen Zeitpunkt...<br /><br />
          Mit freundlichen Gruessen,<br />
          Sofiia
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.button
            key="send"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={onSend}
            className="w-full bg-[#FF6200] text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Senden ✉️
          </motion.button>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-green-500 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle size={14} />
            Erfolgreich gesendet
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
