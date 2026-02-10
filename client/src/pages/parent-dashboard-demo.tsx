import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Bell, Settings, TrendingUp, BookOpen, Shield, ChevronRight, Users } from "lucide-react";
import lionIcon from "@/assets/lion-logo.png";

type DemoStep = 
  | "splash"
  | "dashboard"
  | "tap-rules"
  | "pocket-money-rules";

type TabType = "progress" | "rules" | "limits" | "notifications";

export function ParentDashboardDemoPage() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("splash");
  const [activeTab, setActiveTab] = useState<TabType>("progress");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showExtras, setShowExtras] = useState(true);
  const [riskLevel, setRiskLevel] = useState(50); // 0-100, 50 is medium

  // Auto-advance through demo steps
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const timings: Record<DemoStep, number> = {
      "splash": 2500,
      "dashboard": 4000,
      "tap-rules": 1500,
      "pocket-money-rules": 8000,
    };

    const timer = setTimeout(() => {
      switch (currentStep) {
        case "splash":
          setCurrentStep("dashboard");
          break;
        case "dashboard":
          setCurrentStep("tap-rules");
          break;
        case "tap-rules":
          setActiveTab("rules");
          setCurrentStep("pocket-money-rules");
          break;
        case "pocket-money-rules":
          setIsAutoPlaying(false);
          break;
      }
    }, timings[currentStep]);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying, isPaused]);

  const restartDemo = () => {
    setCurrentStep("splash");
    setActiveTab("progress");
    setIsAutoPlaying(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getRiskLabel = () => {
    if (riskLevel <= 33) return "Niedrig";
    if (riskLevel <= 66) return "Mittel";
    return "Hoch";
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
                  Eltern-Dashboard
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

            {/* MAIN DASHBOARD */}
            {currentStep !== "splash" && (
              <motion.div
                key="main-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden"
              >
                {/* Header */}
                <div className="bg-white px-4 py-4 pb-5 rounded-b-[24px] shadow-sm z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-sm">
                        <Users size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Eltern-Account</div>
                        <div className="font-bold text-[#333333]">Familie Müller</div>
                      </div>
                    </div>
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center" title="Benachrichtigungen">
                      <Bell size={20} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Child Card */}
                  <div className="bg-gradient-to-br from-[#FF6200] to-[#FF8F00] rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                          👧
                        </div>
                        <div>
                          <div className="font-bold text-lg">Sofia</div>
                          <div className="text-orange-100 text-sm">15 Jahre</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
                  <AnimatePresence mode="wait">
                    {activeTab === "progress" && (
                      <motion.div
                        key="progress-tab"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {/* Learning Progress */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <BookOpen size={20} className="text-[#FF6200]" />
                              <span className="font-bold text-[#333333]">Lernfortschritt</span>
                            </div>
                            <span className="text-[#FF6200] font-bold text-lg">72%</span>
                          </div>
                          <div className="text-sm text-gray-500 mb-2">Financial Literacy Score</div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "72%" }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full bg-gradient-to-r from-[#FF6200] to-[#FF8F00] rounded-full"
                            />
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="text-3xl mb-2">📝</div>
                            <div className="text-2xl font-bold text-[#333333]">48</div>
                            <div className="text-xs text-gray-500">Quizze abgeschlossen</div>
                          </div>
                          <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="text-3xl mb-2">📈</div>
                            <div className="text-2xl font-bold text-green-500">3</div>
                            <div className="text-xs text-gray-500">Aktive Investments (virtuell)</div>
                          </div>
                        </div>

                        {/* Risk Level Setting */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield size={20} className="text-purple-500" />
                            <span className="font-bold text-[#333333]">Risiko-Einstellung</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            <span>Niedrig</span>
                            <span className="font-bold text-[#333333]">{getRiskLabel()}</span>
                            <span>Hoch</span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={riskLevel}
                              onChange={(e) => setRiskLevel(Number(e.target.value))}
                              title="Risiko-Einstellung"
                              aria-label="Risiko-Einstellung"
                              className="w-full h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#FF6200] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Von Eltern eingestellt</p>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "rules" && (
                      <motion.div
                        key="rules-tab"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        {/* Pocket Money Card */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xl">💰</span>
                            </div>
                            <div>
                              <div className="font-bold text-[#333333]">Wöchentliches Taschengeld</div>
                              <div className="text-sm text-gray-500">Wird jeden Montag überwiesen</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-3 border-t border-gray-100">
                            <span className="text-gray-600">Echtes Geld</span>
                            <span className="text-2xl font-bold text-[#333333]">€30</span>
                          </div>
                        </div>

                        {/* Virtual Budget Card */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xl">🎮</span>
                            </div>
                            <div>
                              <div className="font-bold text-[#333333]">Virtuelles Bonus-Budget</div>
                              <div className="text-sm text-gray-500">Für Lern-Investitionen</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-3 border-t border-gray-100">
                            <span className="text-gray-600">Virtuelles Geld</span>
                            <span className="text-2xl font-bold text-purple-600">€100</span>
                          </div>
                        </div>

                        {/* Approval Settings */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Settings size={20} className="text-[#FF6200]" />
                            </div>
                            <div>
                              <div className="font-bold text-[#333333]">Genehmigung erforderlich</div>
                              <div className="text-sm text-gray-500">Für bestimmte Aktionen</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-3 border-t border-gray-100">
                            <span className="text-gray-600">Virtuelle Investments über</span>
                            <span className="font-bold text-[#FF6200]">€50</span>
                          </div>
                        </div>

                        {/* Privacy Notice */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <Lock size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-bold text-blue-800 mb-1">Datenschutz-Hinweis</div>
                              <p className="text-sm text-blue-700 leading-relaxed">
                                Sie können Lernfortschritt und Regeln einsehen — <span className="font-bold">NICHT</span> private Fragen, die Sofia an Leo stellt.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {activeTab === "limits" && (
                      <motion.div
                        key="limits-tab"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <Shield size={20} className="text-purple-500" />
                            <span className="font-bold text-[#333333]">Risiko-Limits</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Max. Einzelinvestment</span>
                              <span className="font-bold text-[#333333]">€25</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Tägliches Limit</span>
                              <span className="font-bold text-[#333333]">€50</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-gray-600">Nur stabile Aktien</span>
                              <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                                <div className="w-4 h-4 bg-white rounded-full shadow" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "notifications" && (
                      <motion.div
                        key="notifications-tab"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <Bell size={20} className="text-[#FF6200]" />
                            <span className="font-bold text-[#333333]">Benachrichtigungen</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Quiz abgeschlossen</span>
                              <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                                <div className="w-4 h-4 bg-white rounded-full shadow" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Neues Investment</span>
                              <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                                <div className="w-4 h-4 bg-white rounded-full shadow" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-gray-600">Wöchentlicher Report</span>
                              <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                                <div className="w-4 h-4 bg-white rounded-full shadow" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Tab Bar */}
                <div className="bg-white border-t border-gray-200 px-2 py-3 shrink-0">
                  <div className="flex justify-around">
                    <TabButton
                      icon={<TrendingUp size={20} />}
                      label="Fortschritt"
                      active={activeTab === "progress"}
                      onClick={() => setActiveTab("progress")}
                      highlight={currentStep === "tap-rules" && activeTab !== "rules"}
                    />
                    <TabButton
                      icon={<span className="text-lg">💰</span>}
                      label="Taschengeld"
                      active={activeTab === "rules"}
                      onClick={() => setActiveTab("rules")}
                      highlight={currentStep === "tap-rules"}
                    />
                    <TabButton
                      icon={<Settings size={20} />}
                      label="Limits"
                      active={activeTab === "limits"}
                      onClick={() => setActiveTab("limits")}
                    />
                    <TabButton
                      icon={<Bell size={20} />}
                      label="Meldungen"
                      active={activeTab === "notifications"}
                      onClick={() => setActiveTab("notifications")}
                    />
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
              <span className="text-3xl">👨‍👩‍👧</span>
              Eltern-Dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              Eltern können den Lernfortschritt ihrer Kinder verfolgen und Regeln für Taschengeld und Investitionen festlegen.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Lernfortschritt</p>
                  <p className="text-sm text-gray-500">Financial Literacy Score & abgeschlossene Quizze</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">💰</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Taschengeld-Regeln</p>
                  <p className="text-sm text-gray-500">Wöchentliches Budget & virtuelles Bonus-Geld</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Datenschutz</p>
                  <p className="text-sm text-gray-500">Private Gespräche mit Leo bleiben privat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ 
  icon, 
  label, 
  active, 
  onClick, 
  highlight 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all relative ${
        active 
          ? "text-[#FF6200] bg-orange-50" 
          : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {highlight && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF6200] rounded-full"
        />
      )}
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
