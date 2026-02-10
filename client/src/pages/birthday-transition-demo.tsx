import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenHeader, BottomNav } from "@/components/ing/layout";
import { Eye, EyeOff, Trophy, Flame, TrendingUp, Search, ChevronRight, ArrowUp, PieChart, CreditCard, MoreHorizontal, Target, Sparkles } from "lucide-react";
import lionIcon from "@/assets/lion-logo.png";
import { Screen } from "@/pages/ing-app";

type DemoStep = 
  | "splash"
  | "junior-dashboard"
  | "birthday-notification"
  | "cake-animation"
  | "candle-blow"
  | "screen-crack"
  | "transform"
  | "adult-dashboard"
  | "final-overlay";

export function BirthdayTransitionDemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("splash");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showExtras, setShowExtras] = useState(true);
  const [candleBlown, setCandleBlown] = useState(false);
  const [showCracks, setShowCracks] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Auto-advance through demo steps
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const timings: Record<DemoStep, number> = {
      "splash": 1800,
      "junior-dashboard": 2500,
      "birthday-notification": 2000,
      "cake-animation": 2500,
      "candle-blow": 1500,
      "screen-crack": 1000,
      "transform": 1500,
      "adult-dashboard": 3000,
      "final-overlay": 5000,
    };

    const timer = setTimeout(() => {
      switch (currentStep) {
        case "splash":
          setCurrentStep("junior-dashboard");
          break;
        case "junior-dashboard":
          setCurrentStep("birthday-notification");
          break;
        case "birthday-notification":
          setCurrentStep("cake-animation");
          break;
        case "cake-animation":
          setCandleBlown(true);
          setCurrentStep("candle-blow");
          break;
        case "candle-blow":
          setShowCracks(true);
          setCurrentStep("screen-crack");
          break;
        case "screen-crack":
          setCurrentStep("transform");
          break;
        case "transform":
          setCurrentStep("adult-dashboard");
          break;
        case "adult-dashboard":
          setShowOverlay(true);
          setCurrentStep("final-overlay");
          break;
        case "final-overlay":
          setIsAutoPlaying(false);
          break;
      }
    }, timings[currentStep]);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying, isPaused]);

  const restartDemo = () => {
    setCurrentStep("splash");
    setCandleBlown(false);
    setShowCracks(false);
    setShowOverlay(false);
    setIsAutoPlaying(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleNavigate = (screen: Screen) => {
    // In demo mode, we don't actually navigate
  };

  const isJuniorPhase = ["splash", "junior-dashboard", "birthday-notification"].includes(currentStep);
  const isCakePhase = ["cake-animation", "candle-blow"].includes(currentStep);
  const isTransitionPhase = ["screen-crack", "transform"].includes(currentStep);
  const isAdultPhase = ["adult-dashboard", "final-overlay"].includes(currentStep);

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 font-sans bg-white">
      <div className="w-full max-w-[375px] h-[812px] bg-[#F3F3F3] shadow-2xl overflow-hidden relative flex flex-col rounded-[30px] border-8 border-orange-500">
        {/* Status Bar */}
        <div className={`h-8 flex justify-between items-center px-6 text-xs font-medium shrink-0 z-50 transition-colors duration-500 ${isAdultPhase ? 'bg-white text-gray-500' : 'bg-[#F3F3F3] text-gray-500'}`}>
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
                  LEO Junior
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/80 mt-2"
                >
                  17 Jahre, 364 Tage alt
                </motion.p>
              </motion.div>
            )}

            {/* JUNIOR DASHBOARD */}
            {(currentStep === "junior-dashboard" || currentStep === "birthday-notification") && (
              <motion.div
                key="junior-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden"
              >
                {/* Junior Header with XP */}
                <div className="bg-gradient-to-r from-[#FF6200] to-[#FF8534] px-4 py-3 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        🦁
                      </div>
                      <div>
                        <div className="font-bold">Sofia</div>
                        <div className="text-xs text-white/80">Level 12 • Finanz-Profi</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                        <Flame size={14} className="text-yellow-300" />
                        <span className="text-sm font-bold">42</span>
                      </div>
                    </div>
                  </div>
                  {/* XP Bar */}
                  <div className="bg-white/20 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-yellow-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "85%" }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
                  </div>
                  <div className="text-xs text-white/60 mt-1">2,450 / 3,000 XP</div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Virtual Money Card */}
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-4 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🎮</span>
                      <span className="text-sm font-medium opacity-90">Virtuelles Geld</span>
                    </div>
                    <div className="text-3xl font-bold font-mono">v€2.847,50</div>
                    <div className="text-sm text-white/70 mt-1">+12% diesen Monat</div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-lg font-bold text-[#333]">#7</div>
                      <div className="text-[10px] text-gray-400">Rang</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                      <div className="text-2xl mb-1">📚</div>
                      <div className="text-lg font-bold text-[#333]">8/12</div>
                      <div className="text-[10px] text-gray-400">Badges</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                      <div className="text-2xl mb-1">📈</div>
                      <div className="text-lg font-bold text-green-500">+24%</div>
                      <div className="text-[10px] text-gray-400">Portfolio</div>
                    </div>
                  </div>

                  {/* Virtual Portfolio */}
                  <div className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="font-bold text-[#333] mb-3">Dein Lern-Portfolio</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">🍎</div>
                          <div>
                            <div className="font-medium text-sm">Apple</div>
                            <div className="text-xs text-gray-400">5 Anteile</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">v€892,50</div>
                          <div className="text-xs text-green-500">+18.2%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">🎮</div>
                          <div>
                            <div className="font-medium text-sm">Nintendo</div>
                            <div className="text-xs text-gray-400">3 Anteile</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">v€456,00</div>
                          <div className="text-xs text-green-500">+8.4%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <BottomNav activeTab="dashboard" onNavigate={handleNavigate} onLeoClick={() => {}} profile="junior" />

                {/* Birthday Notification */}
                <AnimatePresence>
                  {currentStep === "birthday-notification" && (
                    <motion.div
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      className="absolute top-12 left-4 right-4 z-50"
                    >
                      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-4 shadow-xl text-white">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">🎂</div>
                          <div className="flex-1">
                            <div className="font-bold text-lg">Happy 18th Birthday! 🎉</div>
                            <div className="text-sm text-white/80">Es ist Zeit für den nächsten Schritt...</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* CAKE ANIMATION */}
            {isCakePhase && (
              <motion.div
                key="cake"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center"
              >
                {/* Celebration confetti background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        background: ['#FF6200', '#FFD700', '#FF69B4', '#00CED1', '#9370DB'][i % 5],
                        left: `${Math.random() * 100}%`,
                        top: -20,
                      }}
                      animate={{
                        y: [0, 900],
                        x: [0, (Math.random() - 0.5) * 100],
                        rotate: [0, 360 * 3],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        delay: Math.random() * 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="relative"
                >
                  {/* Birthday Cake */}
                  <div className="text-[150px] leading-none">🎂</div>
                  
                  {/* Candle Flame */}
                  {!candleBlown && (
                    <motion.div
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      <div className="text-4xl">🔥</div>
                    </motion.div>
                  )}
                  
                  {/* Blown out effect */}
                  {candleBlown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [1, 0], scale: [1, 2] }}
                      transition={{ duration: 0.8 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                      <div className="text-4xl">💨</div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white text-center mt-8"
                >
                  <div className="text-4xl font-bold mb-2">18!</div>
                  <div className="text-lg text-white/80">Du bist jetzt erwachsen</div>
                </motion.div>
              </motion.div>
            )}

            {/* SCREEN CRACK & TRANSFORM */}
            {isTransitionPhase && (
              <motion.div
                key="transition"
                className="flex-1 relative overflow-hidden"
              >
                {/* Cracking Effect */}
                {showCracks && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-40 pointer-events-none"
                  >
                    {/* SVG Cracks */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 375 812">
                      <motion.path
                        d="M187 0 L200 150 L250 200 L220 300 L280 400 L240 500 L300 600 L260 700 L187 812"
                        stroke="white"
                        strokeWidth="4"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.path
                        d="M187 300 L100 350 L50 400"
                        stroke="white"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      />
                      <motion.path
                        d="M220 300 L300 280 L350 350"
                        stroke="white"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      />
                      <motion.path
                        d="M240 500 L150 520 L80 600"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      />
                    </svg>
                    
                    {/* Flash effect */}
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    />
                  </motion.div>
                )}

                {/* Shattering pieces animation */}
                {currentStep === "transform" && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-30 bg-gradient-to-b from-[#FF6200] to-[#E55800]"
                  >
                    {/* Shatter pieces */}
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-24 h-24 bg-gradient-to-b from-[#FF6200] to-[#E55800]"
                        style={{
                          left: `${(i % 4) * 25}%`,
                          top: `${Math.floor(i / 4) * 33}%`,
                          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        }}
                        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                        animate={{
                          x: (Math.random() - 0.5) * 400,
                          y: (Math.random() - 0.5) * 400,
                          rotate: Math.random() * 360,
                          opacity: 0,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Text overlay during transform */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center z-50 bg-black"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-6xl mb-4"
                    >
                      ⚡
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-white text-xl font-bold"
                    >
                      Transformation...
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ADULT DASHBOARD */}
            {isAdultPhase && (
              <motion.div
                key="adult-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden"
              >
                {/* Adult Header - Clean, Professional */}
                <div className="px-4 py-3 flex justify-between items-center bg-white shadow-sm z-10">
                  <div className="flex items-center gap-2 text-[#FF6200]">
                    <span className="font-bold text-lg tracking-tight">Meine Konten</span>
                  </div>
                  <div className="flex gap-4 text-[#FF6200]">
                    <Search size={24} strokeWidth={2.5} />
                    <MoreHorizontal size={24} strokeWidth={2.5} className="rotate-90" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pb-4">
                  {/* Total Balance - Real Money */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white px-4 pt-6 pb-4 mb-2"
                  >
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <span>Gesamt</span>
                      <ChevronRight size={16} />
                    </div>
                    <div className="text-3xl font-bold text-[#333333]">
                      2.897,50 EUR
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2 mt-2 text-sm text-green-600"
                    >
                      <Sparkles size={16} />
                      <span>+50€ Startbonus aktiviert!</span>
                    </motion.div>
                  </motion.div>

                  {/* Quick Actions - Professional Style */}
                  <div className="bg-white px-4 pb-6 mb-4 grid grid-cols-4 gap-2">
                    <QuickActionAdult icon={<ArrowUp size={20} className="text-white rotate-45" strokeWidth={3} />} label="Überweisen" />
                    <QuickActionAdult icon={<PieChart size={20} className="text-white" />} label="Statistik" />
                    <QuickActionAdult icon={<CreditCard size={20} className="text-white" />} label="Karte" />
                    <QuickActionAdult icon={<MoreHorizontal size={20} className="text-white" />} label="Mehr" />
                  </div>

                  {/* Real Accounts */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Girokonto
                    </div>
                    <div className="bg-white mx-2 rounded-xl shadow-sm p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#FF6200] rounded-xl flex items-center justify-center">
                        <span className="text-white text-2xl">🦁</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#333]">Girokonto</div>
                        <div className="text-xs text-gray-400">DE** •••• •••• 1234</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#333]">2.847,50 EUR</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Transfer Notice */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mx-4 mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🎓</div>
                      <div>
                        <div className="font-bold text-green-800">Skills übertragen!</div>
                        <div className="text-sm text-green-600">245 Trades • 12 Kurse • Level 12</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <BottomNav activeTab="dashboard" onNavigate={handleNavigate} onLeoClick={() => {}} profile="adult" />

                {/* Final Overlay */}
                <AnimatePresence>
                  {showOverlay && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="text-center px-8"
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="text-6xl mb-6"
                        >
                          ⚙️
                        </motion.div>
                        <div className="text-2xl font-bold text-white mb-2">
                          Simulator Ended.
                        </div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-3xl font-bold text-[#FF6200]"
                        >
                          Reality Mode Active.
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                          className="mt-6 text-white/60 text-sm"
                        >
                          Dein Wissen. Dein Geld. Deine Zukunft.
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recording Mode Toggle */}
      <button
        onClick={() => setShowExtras(!showExtras)}
        className="fixed top-4 right-4 z-[100] p-3 bg-black/80 backdrop-blur rounded-full text-white hover:bg-black transition-colors"
        title={showExtras ? "Hide controls (Recording mode)" : "Show controls"}
      >
        {showExtras ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      {/* Demo Controls */}
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

      {/* Feature Description Card */}
      {showExtras && (
        <div className="hidden lg:block ml-8 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🎂</span>
              18th Birthday Transition
            </h2>
            <p className="text-gray-600 mb-4">
              When Sofia turns 18, LEO seamlessly transforms from a learning simulator to a real banking experience—preserving all her skills and knowledge.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  🎮
                </div>
                <div>
                  <p className="font-medium text-gray-900">Junior Mode</p>
                  <p className="text-sm text-gray-500">Virtual money, gamification, learning</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  ⚡
                </div>
                <div>
                  <p className="font-medium text-gray-900">Seamless Transition</p>
                  <p className="text-sm text-gray-500">Skills and knowledge transfer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  💼
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pro Mode</p>
                  <p className="text-sm text-gray-500">Real banking, real investments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickActionAdult({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-[#33307E] flex items-center justify-center shadow-md">
        {icon}
      </div>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  );
}
