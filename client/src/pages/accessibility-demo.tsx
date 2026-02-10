import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/ing/layout";
import { Accessibility, Volume2, Eye, EyeOff, ChevronDown, Send, Paperclip, Image, Mic, Home, PieChart, BookOpen, Trophy } from "lucide-react";
import lionIcon from "@/assets/lion-logo.png";
import { Screen } from "@/pages/ing-app";

type DemoStep = 
  | "splash"
  | "dashboard"
  | "notification"
  | "transition"
  | "accessible-dashboard"
  | "chat-open"
  | "chat-message";

export function AccessibilityDemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("splash");
  const [showNotification, setShowNotification] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showExtras, setShowExtras] = useState(true);
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
      "notification": 3500,
      "transition": 2000,
      "accessible-dashboard": 2500,
      "chat-open": 1500,
      "chat-message": 6000,
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
          setCurrentStep("transition");
          break;
        case "transition":
          setCurrentStep("accessible-dashboard");
          break;
        case "accessible-dashboard":
          setIsChatOpen(true);
          setCurrentStep("chat-open");
          break;
        case "chat-open":
          setCurrentStep("chat-message");
          break;
        case "chat-message":
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
    setIsAutoPlaying(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleNavigate = (screen: Screen) => {
    // In demo mode, we don't actually navigate
  };

  // Audio waveform animation component
  const AudioWaveform = () => (
    <div className="flex items-center gap-1 h-6">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[#FF6200] rounded-full"
          animate={{
            height: [8, 20 + Math.random() * 12, 8],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.5 + Math.random() * 0.3,
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );

  const isAccessibleMode = currentStep === "accessible-dashboard" || currentStep === "chat-open" || currentStep === "chat-message";

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 font-sans bg-white">
      <div className="w-full max-w-[375px] h-[812px] bg-[#F3F3F3] shadow-2xl overflow-hidden relative flex flex-col rounded-[30px] border-8 border-orange-500">
        {/* Status Bar */}
        <div className={`h-8 flex justify-between items-center px-6 text-xs font-medium shrink-0 z-50 ${isAccessibleMode ? 'bg-black text-white' : 'bg-[#F3F3F3] text-gray-500'}`}>
          <span>09:41</span>
          <div className="flex gap-1.5 items-center">
            {isAccessibleMode && <Accessibility size={14} className="text-[#FF6200]" />}
            <div className={`w-4 h-4 rounded-full ${isAccessibleMode ? 'bg-white/30' : 'bg-gray-300/50'}`} />
            <div className={`w-4 h-4 rounded-full ${isAccessibleMode ? 'bg-white/30' : 'bg-gray-300/50'}`} />
            <div className={`w-6 h-3 rounded-sm ${isAccessibleMode ? 'bg-white/50' : 'bg-gray-400/50'}`} />
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

            {/* NORMAL DASHBOARD */}
            {currentStep === "dashboard" && (
              <motion.div
                key="normal-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden"
              >
                {/* Normal Header */}
                <div className="bg-white px-4 py-4 pb-6 rounded-b-[30px] shadow-sm z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center text-2xl shadow-sm">
                        🦁
                      </div>
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

                  {/* Normal Debit Card */}
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

                <div className="flex-1" />

                <BottomNav
                  activeTab="dashboard"
                  onNavigate={handleNavigate}
                  onLeoClick={() => setIsChatOpen(true)}
                  profile="junior"
                />
              </motion.div>
            )}

            {/* TRANSITION SCREEN */}
            {currentStep === "transition" && (
              <motion.div
                key="transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-black flex flex-col items-center justify-center px-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-20 h-20 bg-[#FF6200] rounded-full flex items-center justify-center mb-6"
                >
                  <Accessibility size={40} className="text-white" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-xl font-bold text-center"
                >
                  Switching to Accessibility Mode...
                </motion.p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                  className="h-1 bg-[#FF6200] rounded-full mt-6 max-w-[200px]"
                />
              </motion.div>
            )}

            {/* ACCESSIBLE DASHBOARD + CHAT */}
            {(currentStep === "accessible-dashboard" || currentStep === "chat-open" || currentStep === "chat-message") && (
              <motion.div
                key="accessible-app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col bg-black overflow-hidden"
              >
                {/* Audio Waveform Bar - Leo Speaking */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b-2 border-[#FF6200]"
                >
                  <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center overflow-hidden">
                    <img src={lionIcon} alt="Leo" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm">Leo spricht...</div>
                    <div className="text-[#FF6200] text-xs">VoiceOver aktiv</div>
                  </div>
                  <AudioWaveform />
                </motion.div>

                {/* Accessible Dashboard Content */}
                {!isChatOpen && (
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {/* Large High-Contrast Balance Tile */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#1a1a1a] rounded-3xl p-6 border-4 border-[#FF6200]"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#FF6200] rounded-2xl flex items-center justify-center">
                          <Home size={28} strokeWidth={3} className="text-white" />
                        </div>
                        <span className="text-white text-2xl font-bold">Kontostand</span>
                      </div>
                      <div className="text-[#FF6200] text-5xl font-bold">€145,50</div>
                      <div className="text-white/60 text-lg mt-2">Verfügbar</div>
                    </motion.div>

                    {/* Large Action Tiles */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#1a1a1a] rounded-3xl p-5 border-4 border-white/30 aspect-square flex flex-col items-center justify-center"
                      >
                        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-3">
                          <PieChart size={36} strokeWidth={3} className="text-white" />
                        </div>
                        <span className="text-white text-lg font-bold text-center">Budget</span>
                        <span className="text-green-400 text-sm font-bold mt-1">Stabil ✓</span>
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#1a1a1a] rounded-3xl p-5 border-4 border-white/30 aspect-square flex flex-col items-center justify-center"
                      >
                        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-3">
                          <BookOpen size={36} strokeWidth={3} className="text-white" />
                        </div>
                        <span className="text-white text-lg font-bold text-center">Lernen</span>
                        <span className="text-purple-400 text-sm font-bold mt-1">3 neue</span>
                      </motion.div>
                    </div>

                    {/* Streak Tile */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-[#1a1a1a] rounded-3xl p-5 border-4 border-amber-500 flex items-center gap-4"
                    >
                      <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center">
                        <Trophy size={32} strokeWidth={3} className="text-white" />
                      </div>
                      <div>
                        <span className="text-white text-xl font-bold">12 Tage Streak</span>
                        <div className="text-amber-400 text-sm">Weiter so!</div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Accessible Bottom Navigation */}
                {!isChatOpen && (
                  <div className="bg-[#1a1a1a] border-t-4 border-[#FF6200] p-4">
                    <div className="flex justify-around">
                      <button className="flex flex-col items-center gap-2 p-3 bg-[#FF6200] rounded-2xl">
                        <Home size={28} strokeWidth={3} className="text-white" />
                        <span className="text-white text-xs font-bold">Home</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-3">
                        <PieChart size={28} strokeWidth={3} className="text-white/50" />
                        <span className="text-white/50 text-xs font-bold">Invest</span>
                      </button>
                      <button 
                        onClick={() => setIsChatOpen(true)}
                        className="w-16 h-16 bg-[#FF6200] rounded-full flex items-center justify-center -mt-8 border-4 border-black"
                      >
                        <img src={lionIcon} alt="Leo" className="w-12 h-12 object-contain" />
                      </button>
                      <button className="flex flex-col items-center gap-2 p-3">
                        <BookOpen size={28} strokeWidth={3} className="text-white/50" />
                        <span className="text-white/50 text-xs font-bold">Lernen</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-3">
                        <Trophy size={28} strokeWidth={3} className="text-white/50" />
                        <span className="text-white/50 text-xs font-bold">Punkte</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Accessible Chat Overlay */}
                <AnimatePresence>
                  {isChatOpen && (
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="absolute bottom-0 left-0 right-0 h-[85%] bg-black z-50 rounded-t-3xl overflow-hidden flex flex-col border-t-4 border-[#FF6200]"
                    >
                      {/* Chat Header */}
                      <div className="bg-[#1a1a1a] px-4 py-4 flex items-center justify-between border-b-2 border-[#FF6200] shrink-0">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FF6200]">
                            <img src={lionIcon} alt="Leo" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-lg">Leo</div>
                            <div className="text-[#FF6200] font-medium flex items-center gap-2 text-sm">
                              <Volume2 size={14} />
                              Sprachausgabe aktiv
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => setIsChatOpen(false)} 
                          className="p-3 bg-white/10 rounded-2xl text-white border-2 border-white/30"
                          title="Schließen"
                        >
                          <ChevronDown size={28} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Chat Messages Area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Leo's Accessibility Message */}
                        {currentStep === "chat-message" && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-3"
                          >
                            {/* Audio indicator */}
                            <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-2xl p-3 border-2 border-[#FF6200]">
                              <div className="w-10 h-10 bg-[#FF6200] rounded-xl flex items-center justify-center">
                                <Volume2 size={24} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <AudioWaveform />
                              </div>
                              <span className="text-white/60 text-sm">Wird vorgelesen...</span>
                            </div>

                            {/* Message content - large, high contrast */}
                            <div className="bg-[#1a1a1a] rounded-3xl p-5 border-4 border-white/30">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl overflow-hidden">
                                  <img src={lionIcon} alt="Leo" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-white/60 font-medium">Leo</span>
                              </div>
                              <p className="text-white text-xl font-medium leading-relaxed">
                                <span className="text-[#FF6200] font-bold">Navigation:</span> Budget.
                              </p>
                              <p className="text-white text-xl font-medium leading-relaxed mt-2">
                                <span className="text-green-400 font-bold">Trend:</span> stabil.
                              </p>
                              <p className="text-white/80 text-lg mt-4">
                                Swipe right for explanation.
                              </p>
                              <p className="text-white/80 text-lg">
                                Double tap to confirm transfer.
                              </p>
                            </div>

                            {/* Action buttons - large and accessible */}
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              <button className="bg-[#FF6200] text-white py-4 rounded-2xl font-bold text-lg border-4 border-[#FF6200]">
                                ← Swipe Left
                              </button>
                              <button className="bg-green-600 text-white py-4 rounded-2xl font-bold text-lg border-4 border-green-400">
                                Swipe Right →
                              </button>
                            </div>
                          </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Accessible Input Area */}
                      <div className="bg-[#1a1a1a] p-4 border-t-2 border-[#FF6200] shrink-0">
                        <div className="flex items-center gap-3">
                          <button className="p-4 bg-white/10 rounded-2xl text-white border-2 border-white/30" title="Anhängen">
                            <Paperclip size={24} strokeWidth={3} />
                          </button>
                          <div className="flex-1 bg-white/10 rounded-2xl px-4 py-4 text-white/50 text-lg font-medium border-2 border-white/30">
                            Tippen oder sprechen...
                          </div>
                          <button className="p-4 bg-[#FF6200] rounded-2xl text-white border-2 border-[#FF6200]" title="Spracheingabe">
                            <Mic size={24} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
                <div className="bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-[#FF6200] overflow-hidden">
                  <div className="flex items-center gap-3 p-3 pb-2">
                    <div className="w-12 h-12 bg-[#FF6200] rounded-xl flex items-center justify-center">
                      <Accessibility className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/60 font-medium">SYSTEM</p>
                      <p className="text-sm font-bold text-white">Accessibility Detected</p>
                    </div>
                    <span className="text-xs text-white/40">now</span>
                  </div>
                  
                  <div className="px-3 pb-3">
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">♿</span>
                        <p className="text-base font-bold text-white">
                          VoiceOver is ON
                        </p>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Switching to Blind Accessibility Mode...
                      </p>
                      <p className="text-xs text-[#FF6200] mt-2 font-medium">
                        Large tiles • High contrast • Voice guidance
                      </p>
                    </div>
                  </div>

                  <div className="flex border-t border-white/20">
                    <button className="flex-1 py-3 text-center text-sm font-medium text-white/50 hover:bg-white/10">
                      Dismiss
                    </button>
                    <div className="w-px bg-white/20" />
                    <button className="flex-1 py-3 text-center text-sm font-bold text-[#FF6200] hover:bg-white/10">
                      Settings
                    </button>
                  </div>
                </div>
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
              <span className="text-3xl">♿</span>
              Blind Accessibility Mode
            </h2>
            <p className="text-gray-600 mb-4">
              LEO automatically detects VoiceOver and switches to a fully accessible interface with voice guidance.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Accessibility className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Auto-Detection</p>
                  <p className="text-sm text-gray-500">Detects VoiceOver/TalkBack on launch</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Voice Guidance</p>
                  <p className="text-sm text-gray-500">Leo speaks all navigation & content</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">High Contrast UI</p>
                  <p className="text-sm text-gray-500">Large tiles, thick borders, simple layout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
