import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenHeader, BottomNav } from "@/components/ing/layout";
import { AlertTriangle, Clock, BookOpen, Eye, EyeOff, Lock, TrendingUp, TrendingDown, ArrowRight, X, RefreshCw, Search, Plus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import lionIcon from "@/assets/lion-logo.png";
import { Screen } from "@/pages/ing-app";

type DemoStep = 
  | "splash"
  | "portfolio"
  | "trade-attempt"
  | "friction-alert"
  | "learn-tap"
  | "educational-card";

const CHART_DATA = [
  { name: 'Mo', value: 100 },
  { name: 'Di', value: 105 },
  { name: 'Mi', value: 102 },
  { name: 'Do', value: 108 },
  { name: 'Fr', value: 115 },
  { name: 'Sa', value: 112 },
  { name: 'So', value: 120 },
];

export function FrictionDemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("splash");
  const [showFrictionAlert, setShowFrictionAlert] = useState(false);
  const [showEducationalCard, setShowEducationalCard] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showExtras, setShowExtras] = useState(true);

  // Auto-advance through demo steps
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const timings: Record<DemoStep, number> = {
      "splash": 1800,
      "portfolio": 1800,
      "trade-attempt": 1800,
      "friction-alert": 3000,
      "learn-tap": 1000,
      "educational-card": 5000,
    };

    const timer = setTimeout(() => {
      switch (currentStep) {
        case "splash":
          setCurrentStep("portfolio");
          break;
        case "portfolio":
          setCurrentStep("trade-attempt");
          break;
        case "trade-attempt":
          setShowFrictionAlert(true);
          setCurrentStep("friction-alert");
          break;
        case "friction-alert":
          setCurrentStep("learn-tap");
          break;
        case "learn-tap":
          setShowFrictionAlert(false);
          setShowEducationalCard(true);
          setCurrentStep("educational-card");
          break;
        case "educational-card":
          setIsAutoPlaying(false);
          break;
      }
    }, timings[currentStep]);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying, isPaused]);

  const restartDemo = () => {
    setCurrentStep("splash");
    setShowFrictionAlert(false);
    setShowEducationalCard(false);
    setIsAutoPlaying(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleNavigate = (screen: Screen) => {
    // In demo mode, we don't actually navigate
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 font-sans">
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

            {/* PORTFOLIO SCREEN - USING ORIGINAL UI */}
            {(currentStep === "portfolio" || currentStep === "trade-attempt" || currentStep === "friction-alert" || currentStep === "learn-tap" || currentStep === "educational-card") && (
              <motion.div
                key="main-app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden"
              >
                {/* Screen Header - Original Style */}
                <ScreenHeader
                  title="Mein Portfolio"
                  onBack={() => {}}
                  rightAction={
                    <button
                      className="w-10 h-10 rounded-full bg-[#FF6200]/10 hover:bg-[#FF6200]/20 flex items-center justify-center transition-colors"
                      title="Aktie suchen"
                    >
                      <Search size={20} className="text-[#FF6200]" />
                    </button>
                  }
                />

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Play Money Badge - Original Style */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 rounded-xl text-white shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎮</span>
                      <span className="text-sm font-medium opacity-90">Spielgeld</span>
                    </div>
                    <div className="text-xl font-bold font-mono">v€325,40</div>
                  </div>

                  {/* Recent Trades Warning - Friction specific */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Clock size={20} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-amber-800 text-sm">3 Trades heute</div>
                      <div className="text-xs text-amber-600">In der letzten Minute</div>
                    </div>
                  </motion.div>

                  {/* Portfolio Value - Original Style */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                    <div className="text-gray-500 text-sm mb-1">Portfolio Gesamtwert</div>
                    <div className="text-4xl font-bold text-[#333333] mb-2">v€1.015,10</div>
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-green-50 text-green-600">
                      <TrendingUp size={16} />
                      <span>+8.2% (+v€76,80)</span>
                    </div>
                  </div>

                  {/* Chart - Original Style */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm h-48">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-[#333333]">Verlauf (7 Tage)</span>
                      <button className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200" title="Aktualisieren">
                        <RefreshCw size={16} />
                      </button>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={CHART_DATA}>
                        <Line type="monotone" dataKey="value" stroke="#FF6200" strokeWidth={3} dot={{ r: 4, fill: '#FF6200', strokeWidth: 2, stroke: '#fff' }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          labelStyle={{ color: '#999' }}
                          formatter={(value: number) => [`v€${value.toFixed(2)}`, 'Wert']}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Holdings - Original Style */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <div className="font-bold text-[#333333]">Deine Investments</div>
                      <button className="text-xs text-[#FF6200] font-bold flex items-center gap-1">
                        <Plus size={14} /> Kaufen
                      </button>
                    </div>

                    {/* Investment Cards - Original Style */}
                    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">🍎</div>
                        <div>
                          <div className="font-bold text-[#333333] text-sm">Apple Inc.</div>
                          <div className="text-xs text-gray-400">2 Anteile</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#333333]">v€357,00</div>
                        <div className="text-xs font-bold text-green-500">+5.2%</div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">🪟</div>
                        <div>
                          <div className="font-bold text-[#333333] text-sm">Microsoft</div>
                          <div className="text-xs text-gray-400">1 Anteil</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#333333]">v€412,50</div>
                        <div className="text-xs font-bold text-green-500">+3.1%</div>
                      </div>
                    </div>

                    {/* Recent Purchase - highlighted */}
                    <div className="bg-orange-50 p-4 rounded-xl shadow-sm flex items-center justify-between border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">🚗</div>
                        <div>
                          <div className="font-bold text-[#333333] text-sm">Tesla</div>
                          <div className="text-xs text-orange-500 font-medium">Gerade gekauft</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#333333]">v€245,60</div>
                        <div className="text-xs font-bold text-red-500">-0.3%</div>
                      </div>
                    </div>
                  </div>

                  {/* Buy Button - Triggers friction */}
                  <motion.button
                    animate={currentStep === "trade-attempt" ? { scale: [1, 0.95, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${
                      currentStep === "trade-attempt" 
                        ? "bg-red-500" 
                        : "bg-[#FF6200] hover:bg-[#e55800]"
                    } shadow-sm`}
                  >
                    <Plus size={20} />
                    {currentStep === "trade-attempt" ? "Versuche zu kaufen..." : "Neue Aktie kaufen"}
                  </motion.button>
                </div>

                {/* Bottom Navigation - Original Component */}
                <BottomNav
                  activeTab="invest"
                  onNavigate={handleNavigate}
                  onLeoClick={() => {}}
                  profile="junior"
                />

                {/* Friction Alert Modal */}
                <AnimatePresence>
                  {showFrictionAlert && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 z-40"
                      />
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="absolute inset-4 flex items-center justify-center z-50"
                      >
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-[340px] w-full">
                          {/* Alert Header */}
                          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-center">
                            <motion.div
                              animate={{ rotate: [0, -10, 10, -10, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                              <AlertTriangle size={40} className="text-white" />
                            </motion.div>
                            <h2 className="text-white text-2xl font-bold">⚠️ Friction Alert</h2>
                          </div>

                          {/* Alert Content */}
                          <div className="p-6">
                            <p className="text-gray-700 text-center mb-4 leading-relaxed">
                              You've made <span className="font-bold text-[#FF6200]">3 trades</span> in 1 minute. 
                              This pattern resembles <span className="font-bold">impulsive trading</span>.
                            </p>
                            
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                              <Lock size={24} className="text-red-500 flex-shrink-0" />
                              <div>
                                <div className="font-bold text-red-700 text-sm">Trading Locked</div>
                                <div className="text-xs text-red-600">For 24 hours</div>
                              </div>
                              <div className="ml-auto text-right">
                                <div className="font-mono text-red-700 font-bold">23:59:42</div>
                              </div>
                            </div>

                            {/* Learn Button */}
                            <motion.button
                              animate={currentStep === "learn-tap" ? { scale: [1, 1.05, 1] } : {}}
                              transition={{ repeat: currentStep === "learn-tap" ? Infinity : 0, duration: 0.5 }}
                              className="w-full bg-[#FF6200] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e55800] transition-colors"
                            >
                              <BookOpen size={20} />
                              Learn about Slow Finance
                              <ArrowRight size={18} />
                            </motion.button>

                            <button className="w-full text-gray-400 text-sm mt-3 py-2">
                              Remind me later
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Educational Card */}
                <AnimatePresence>
                  {showEducationalCard && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 z-40"
                      />
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 z-50"
                      >
                        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
                          {/* Card Header */}
                          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 relative">
                            <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-full" title="Schließen">
                              <X size={20} className="text-white" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <BookOpen size={24} className="text-white" />
                              </div>
                              <div>
                                <div className="text-purple-200 text-xs font-medium">LEO ACADEMY</div>
                                <div className="text-white font-bold text-lg">Slow Finance</div>
                              </div>
                            </div>
                          </div>

                          {/* Educational Content */}
                          <div className="p-6 space-y-4">
                            {/* Stat Card */}
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="bg-red-50 border border-red-200 rounded-xl p-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                                  <span className="text-3xl font-bold text-red-600">90%</span>
                                </div>
                                <div>
                                  <div className="font-bold text-red-700">of day-traders</div>
                                  <div className="text-red-600 text-sm">lose money</div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Insight */}
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              className="bg-green-50 border border-green-200 rounded-xl p-4"
                            >
                              <div className="text-green-700 font-medium text-sm leading-relaxed">
                                Successful investors think in <span className="font-bold">years</span>, not minutes.
                              </div>
                            </motion.div>

                            {/* Quote */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                              className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5"
                            >
                              <div className="text-4xl text-amber-400 mb-2">"</div>
                              <p className="text-gray-700 italic text-base leading-relaxed -mt-4">
                                The stock market transfers money from the impatient to the patient.
                              </p>
                              <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-lg">
                                  🧓
                                </div>
                                <div>
                                  <div className="font-bold text-gray-800 text-sm">Warren Buffett</div>
                                  <div className="text-xs text-gray-500">Investor & CEO, Berkshire Hathaway</div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Action Button */}
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 }}
                              className="w-full bg-[#FF6200] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                              Got it! I'll think long-term
                              <ArrowRight size={20} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </>
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
              <span className="text-3xl">⚠️</span>
              Friction Alert
            </h2>
            <p className="text-gray-600 mb-4">
              LEO detects impulsive trading patterns and enforces cooling-off periods to protect young investors from common mistakes.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pattern Detection</p>
                  <p className="text-sm text-gray-500">Identifies impulsive trading behavior</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cooling Period</p>
                  <p className="text-sm text-gray-500">24-hour lock to prevent losses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Education First</p>
                  <p className="text-sm text-gray-500">Learn why patience pays off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
