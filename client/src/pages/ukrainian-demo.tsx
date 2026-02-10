import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout, BottomNav } from "@/components/ing/layout";
import { Globe, Languages, ChevronDown, Send, Paperclip, Image, Mic, Volume2, Eye, EyeOff } from "lucide-react";
import lionIcon from "@/assets/lion-logo.png";
import { JuniorDashboardScreen } from "@/components/ing/screens/junior/dashboard";
import { Screen } from "@/pages/ing-app";

type DemoStep = 
  | "splash"
  | "dashboard"
  | "notification"
  | "chat-open"
  | "chat-welcome"
  | "term-card"
  | "sofia-response";

interface TermCard {
  germanTerm: string;
  ukrainianExplanation: string;
  germanExplanation: string;
  showOriginal: boolean;
}

export function UkrainianDemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("splash");
  const [showNotification, setShowNotification] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [termCard, setTermCard] = useState<TermCard>({
    germanTerm: "Kapitalertragsteuer",
    ukrainianExplanation: "Податок на прибуток з інвестицій — це податок, який ви платите, коли заробляєте гроші на акціях, облігаціях чи інших інвестиціях. У Німеччині це близько 25%.",
    germanExplanation: "Steuer auf Gewinne aus Kapitalanlagen wie Aktien, Anleihen oder Zinserträgen. In Deutschland beträgt sie ca. 25%.",
    showOriginal: false,
  });
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showExtras, setShowExtras] = useState(true); // Toggle for recording mode
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentStep]);

  // Auto-advance through demo steps
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const timings: Record<DemoStep, number> = {
      "splash": 2500,
      "dashboard": 2000,
      "notification": 3000,
      "chat-open": 1500,
      "chat-welcome": 3000,
      "term-card": 4000,
      "sofia-response": 6000,
    };

    const timer = setTimeout(() => {
      switch (currentStep) {
        case "splash":
          setCurrentStep("dashboard");
          break;
        case "dashboard":
          setShowNotification(true);
          setCurrentStep("notification");
          break;
        case "notification":
          setShowNotification(false);
          setIsChatOpen(true);
          setCurrentStep("chat-open");
          break;
        case "chat-open":
          setCurrentStep("chat-welcome");
          break;
        case "chat-welcome":
          setCurrentStep("term-card");
          break;
        case "term-card":
          setCurrentStep("sofia-response");
          break;
        case "sofia-response":
          setIsAutoPlaying(false);
          break;
      }
    }, timings[currentStep]);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying, isPaused]);

  const restartDemo = () => {
    setCurrentStep("splash");
    setShowNotification(false);
    setIsChatOpen(false);
    setTermCard(prev => ({ ...prev, showOriginal: false }));
    setIsAutoPlaying(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleTermLanguage = () => {
    setTermCard(prev => ({ ...prev, showOriginal: !prev.showOriginal }));
  };

  // Dummy navigation handler for the dashboard
  const handleNavigate = (screen: Screen) => {
    // In demo mode, we don't actually navigate
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 font-sans bg-white">
      <div className="w-full max-w-[375px] h-[812px] bg-[#F3F3F3] shadow-2xl overflow-hidden relative flex flex-col rounded-[30px] border-8 border-orange-500">
        {/* Status Bar */}
        <div className="h-8 bg-[#F3F3F3] flex justify-between items-center px-6 text-xs font-medium text-gray-500 shrink-0 z-50">
          <span>09:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-4 rounded-full bg-gray-300/50" />
            <div className="w-4 h-4 rounded-full bg-gray-300/50" />
            <div className="w-6 h-3 rounded-sm bg-gray-400/50" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* SPLASH SCREEN */}
            {currentStep === "splash" && (
              <motion.div
                key="splash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-gradient-to-b from-[#FF6200] to-[#E55800] flex flex-col items-center justify-center px-8"
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
                  className="text-white/80 mt-2"
                >
                  Dein Finanzassistent
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
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* DASHBOARD + CHAT OVERLAY */}
            {currentStep !== "splash" && (
              <motion.div
                key="main-app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col relative overflow-hidden"
              >
                {/* Junior Dashboard Content (simplified version) */}
                <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
                  {/* Header */}
                  <div className="bg-white px-4 py-4 pb-6 rounded-b-[30px] shadow-sm z-10">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                          className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center text-2xl shadow-sm"
                        >
                          🦁
                        </motion.div>
                        <div>
                          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Level 5</div>
                          <div className="font-bold text-[#333333]">Finanz-Entdecker</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                        <span className="text-orange-500">🔥</span>
                        <span className="font-bold text-orange-600 text-sm">12 Tage</span>
                      </div>
                    </div>

                    {/* Debit Card */}
                    <div className="bg-gradient-to-br from-[#FF6200] to-[#FF8F00] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <span className="font-bold text-lg tracking-wider">ING</span>
                          <div className="flex items-center">
                            <div className="w-5 h-5 rounded-full bg-red-500 opacity-80" />
                            <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-80 -ml-2" />
                          </div>
                        </div>
                        <div className="text-orange-100 text-[10px] uppercase tracking-wider mb-0.5">Mein Taschengeld</div>
                        <div className="text-3xl font-bold">€145,50</div>
                        <div className="flex justify-between items-end text-xs mt-4">
                          <div>
                            <div className="text-orange-200 text-[9px] uppercase tracking-wider">Sofia M.</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono">06/29</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="px-4 pt-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                        <div className="text-2xl mb-1">🏆</div>
                        <div className="text-lg font-bold text-[#333333]">#42</div>
                        <div className="text-[10px] text-gray-400">Rang</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                        <div className="text-2xl mb-1">📚</div>
                        <div className="text-lg font-bold text-[#333333]">8/12</div>
                        <div className="text-[10px] text-gray-400">Badges</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                        <div className="text-2xl mb-1">📈</div>
                        <div className="text-lg font-bold text-green-500">+12%</div>
                        <div className="text-[10px] text-gray-400">Portfolio</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <BottomNav
                  activeTab="dashboard"
                  onNavigate={handleNavigate}
                  onLeoClick={() => setIsChatOpen(true)}
                  profile="junior"
                />

                {/* Chat Overlay - Original LEO Style */}
                <AnimatePresence>
                  {isChatOpen && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/30 z-40"
                      />

                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 h-[90%] bg-[#F8F8F8] z-50 rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
                      >
                        {/* Chat Header */}
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
                            {/* Language indicator */}
                            <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full text-xs text-blue-700 font-medium">
                              <Globe className="w-3 h-3" />
                              <span>UA</span>
                            </div>

                            <button 
                              onClick={() => setIsChatOpen(false)} 
                              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                              title="Schließen"
                            >
                              <ChevronDown size={24} />
                            </button>
                          </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          <div className="flex justify-center py-2">
                            <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                              Heute
                            </span>
                          </div>

                          {/* Leo's Welcome Message */}
                          {(currentStep === "chat-welcome" || currentStep === "term-card" || currentStep === "sofia-response") && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className="max-w-[85%] flex flex-col gap-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-6 h-6 rounded-lg overflow-hidden shadow-sm">
                                    <img src={lionIcon} alt="Leo" className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs font-medium text-gray-500">Leo</span>
                                </div>
                                <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-[#333333] rounded-tl-sm border border-gray-100">
                                  <p>Willkommen, Sofia! 🇺🇦</p>
                                  <p className="mt-2">
                                    I've detected your system language is Ukrainian. I'll explain complex German terms — like <span className="font-bold text-[#FF6200]">'Einkommensteuererklärung'</span> — in simple Ukrainian so nothing gets lost in translation.
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                  <span className="text-[10px] text-gray-400">09:41</span>
                                  <button className="text-gray-300 hover:text-[#FF6200] transition-colors" title="Vorlesen">
                                    <Volume2 size={12} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Term Card Widget */}
                          {(currentStep === "term-card" || currentStep === "sofia-response") && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 }}
                              className="ml-8"
                            >
                              <div className="bg-gradient-to-br from-blue-50 to-yellow-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <Languages className="w-5 h-5 text-blue-600" />
                                  <span className="text-xs font-medium text-blue-600">Finanz-Vokabular</span>
                                </div>
                                
                                <div className="bg-white rounded-xl p-3 mb-3">
                                  <p className="text-xs text-gray-500 mb-1">Deutscher Begriff:</p>
                                  <p className="text-lg font-bold text-gray-900">{termCard.germanTerm}</p>
                                </div>

                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={termCard.showOriginal ? "german" : "ukrainian"}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-xl p-3"
                                  >
                                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                      {termCard.showOriginal ? (
                                        <>🇩🇪 Einfache Erklärung:</>
                                      ) : (
                                        <>🇺🇦 Просте пояснення:</>
                                      )}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {termCard.showOriginal ? termCard.germanExplanation : termCard.ukrainianExplanation}
                                    </p>
                                  </motion.div>
                                </AnimatePresence>

                                {/* Toggle Button */}
                                <button
                                  onClick={toggleTermLanguage}
                                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg text-xs font-medium text-gray-700 hover:from-blue-200 hover:to-yellow-200 transition-colors"
                                >
                                  <Languages className="w-4 h-4" />
                                  {termCard.showOriginal ? "Українською" : "Auf Deutsch"}
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {/* Sofia's Response */}
                          {currentStep === "sofia-response" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="flex justify-end"
                            >
                              <div className="max-w-[85%] flex flex-col gap-1 items-end">
                                <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm bg-[#FF6200] text-white rounded-tr-sm">
                                  Das ist super! Endlich verstehe ich dieses 'Behördendeutsch' 😅
                                </div>
                                <span className="text-[10px] text-gray-400 px-1">09:42</span>
                              </div>
                            </motion.div>
                          )}

                          <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions */}
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                          {["Was bedeutet Sparerpauschbetrag?", "Erkläre mir ETFs", "Steuern auf Deutsch"].map((suggestion, i) => (
                            <button
                              key={i}
                              className="shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-[#FF6200] hover:text-[#FF6200] transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>

                        {/* Input Area */}
                        <div className="bg-white p-4 border-t border-gray-100 shrink-0 pb-8">
                          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200">
                            <button className="p-2 text-gray-400 hover:text-[#FF6200] transition-colors rounded-full hover:bg-gray-100" title="Anhängen">
                              <Paperclip size={20} />
                            </button>
                            <input
                              type="text"
                              placeholder="Frag Leo..."
                              className="flex-1 bg-transparent outline-none text-[#333333] placeholder:text-gray-400"
                              readOnly
                            />
                            <button className="p-2 text-gray-400 hover:text-[#FF6200] transition-colors rounded-full hover:bg-gray-100" title="Bild">
                              <Image size={20} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-[#FF6200] transition-colors rounded-full hover:bg-gray-100" title="Spracheingabe">
                              <Mic size={20} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* iOS-style Notification Overlay */}
                <AnimatePresence>
                  {showNotification && (
                    <motion.div
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      className="absolute top-0 left-0 right-0 p-3 z-50"
                    >
                      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center gap-3 p-3 pb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">SYSTEM</p>
                            <p className="text-sm font-bold text-gray-900">Sprache erkannt</p>
                          </div>
                          <span className="text-xs text-gray-400">jetzt</span>
                        </div>
                        
                        <div className="px-3 pb-3">
                          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">🌐</span>
                              <p className="text-sm font-semibold text-gray-800">
                                System Language Detected: Українська (Ukrainian)
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              LEO has adapted: German financial terms will be explained in your native language.
                            </p>
                          </div>
                        </div>

                        <div className="flex border-t border-gray-200">
                          <button className="flex-1 py-3 text-center text-sm font-medium text-gray-500 hover:bg-gray-50">
                            Schließen
                          </button>
                          <div className="w-px bg-gray-200" />
                          <button className="flex-1 py-3 text-center text-sm font-medium text-[#FF6200] hover:bg-orange-50">
                            Einstellungen
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recording Mode Toggle - Always visible */}
      <button
        onClick={() => setShowExtras(!showExtras)}
        className="fixed top-4 right-4 z-[100] p-3 bg-black/80 backdrop-blur rounded-full text-white hover:bg-black transition-colors"
        title={showExtras ? "Hide controls (Recording mode)" : "Show controls"}
      >
        {showExtras ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      {/* Demo Controls - Fixed to bottom right corner */}
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
            onClick={togglePause}
            className="text-white text-xs font-medium hover:text-[#FF6200] transition-colors px-2"
          >
            {isPaused ? "▶ Play" : "⏸ Pause"}
          </button>
          {showExtras && (
            <>
              <div className="w-px bg-white/30" />
              <span className="text-white/60 text-xs px-2">
                {currentStep}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Feature Description Card - Only when showExtras is true */}
      {showExtras && (
        <div className="hidden lg:block ml-8 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🇺🇦</span>
              Language Barrier Breaker
            </h2>
            <p className="text-gray-600 mb-4">
              LEO automatically detects the system language and adapts explanations for German financial terms in the user's native language.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Auto-Detection</p>
                  <p className="text-sm text-gray-500">Detects system language on first launch</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Languages className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Smart Translation</p>
                  <p className="text-sm text-gray-500">Plain-language explanations in native language</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">"Behördendeutsch" Made Easy</p>
                  <p className="text-sm text-gray-500">Complex German bureaucratic terms simplified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
