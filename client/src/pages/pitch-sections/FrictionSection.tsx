import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenHeader, BottomNav } from "@/components/ing/layout";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { Search } from "lucide-react";
import lionIcon from "@/assets/lion-logo.png";

interface SectionProps {
  elapsed: number;
}

// Section elapsed (starts at demo sec 120, duration 21s):
// 0-2: rapid trades (3 quick buy/sell toasts)
// 2-3: screen freezes with red overlay
// 3-7: friction alert popup
// 7-10: learn button + quote
// 10-13: timer pulse
// 13-16: note at bottom
// 16-21: popup fades, portfolio returns with lock icon

const CHART_DATA = [
  { name: "Mo", value: 100 }, { name: "Di", value: 105 }, { name: "Mi", value: 102 },
  { name: "Do", value: 108 }, { name: "Fr", value: 115 }, { name: "Sa", value: 112 },
  { name: "So", value: 120 },
];

export function FrictionSection({ elapsed }: SectionProps) {
  const showTrades = elapsed < 2;
  const tradeCount = Math.min(3, Math.floor(elapsed / 0.6));
  const showRedOverlay = elapsed >= 2 && elapsed < 16;
  const showFrictionAlert = elapsed >= 3 && elapsed < 16;
  const showLearnButton = elapsed >= 7;
  const showTimerPulse = elapsed >= 10 && elapsed < 13;
  const showNote = elapsed >= 13 && elapsed < 16;
  const alertFading = elapsed >= 16;
  const showLockIcon = elapsed >= 16;

  // Timer countdown display
  const timerMinutes = 23;
  const timerSeconds = Math.max(55, 60 - Math.floor(elapsed - 3));

  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden relative">
      <ScreenHeader
        title="Mein Portfolio"
        rightAction={
          <div className="flex items-center gap-2">
            {showLockIcon && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500">
                🔒
              </motion.span>
            )}
            <button className="w-10 h-10 rounded-full bg-[#FF6200]/10 flex items-center justify-center" title="Suche">
              <Search size={20} className="text-[#FF6200]" />
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Play Money Badge */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 rounded-xl text-white shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span className="text-sm font-medium opacity-90">Spielgeld</span>
          </div>
          <div className="text-xl font-bold font-mono">v€325,40</div>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded-2xl shadow-sm h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CHART_DATA}>
              <Line type="monotone" dataKey="value" stroke="#FF6200" strokeWidth={3} dot={{ r: 4, fill: "#FF6200", strokeWidth: 2, stroke: "#fff" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} formatter={(value: number) => [`v€${value}`, "Wert"]} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings */}
        <div className="space-y-3">
          {[
            { icon: "🍎", name: "Apple (AAPL)", shares: 2, value: "v€145,20", change: "+3,2%", positive: true },
            { icon: "💻", name: "Microsoft (MSFT)", shares: 1, value: "v€98,50", change: "+1,5%", positive: true },
            { icon: "🚗", name: "Tesla (TSLA)", shares: 1, value: "v€81,70", change: "−5,8%", positive: false },
          ].map((stock) => (
            <div key={stock.name} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">{stock.icon}</div>
                <div>
                  <div className="font-bold text-sm text-[#333333]">{stock.name}</div>
                  <div className="text-xs text-gray-400">{stock.shares} Anteile</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#333333]">{stock.value}</div>
                <div className={`text-xs font-bold ${stock.positive ? "text-green-500" : "text-red-500"}`}>{stock.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav activeTab="invest" onNavigate={() => {}} profile="junior" />

      {/* Trade execution toasts */}
      <AnimatePresence>
        {showTrades && tradeCount >= 1 && (
          <motion.div
            key={`trade-${tradeCount}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-24 left-4 right-4 z-20"
          >
            <div className="bg-green-500 text-white py-2 px-4 rounded-xl text-center text-sm font-bold shadow-lg">
              ⚡ Trade {tradeCount} ausgeführt
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Red freeze overlay */}
      <AnimatePresence>
        {showRedOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: alertFading ? 2 : 0.3 }}
            className="absolute inset-0 bg-red-500/20 z-30"
          />
        )}
      </AnimatePresence>

      {/* Friction Alert Popup */}
      <AnimatePresence>
        {showFrictionAlert && !alertFading && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute inset-0 z-40 flex items-center justify-center px-6"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-[320px] border-2 border-red-200">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="text-red-600 font-black text-lg">FRICTION DESIGN AKTIVIERT</h3>
              </div>

              {/* Body */}
              <p className="text-sm text-gray-700 text-center mb-4 leading-relaxed">
                Du hast <span className="font-bold">3 Trades in 1 Minute</span> gemacht. Dieses
                Muster ähnelt impulsivem Handeln.
              </p>

              {/* Lock */}
              <div className="bg-red-50 rounded-xl p-3 text-center mb-4 border border-red-100">
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-sm font-bold text-red-700">
                  Trading-Funktionen sind für 24 Stunden gesperrt.
                </p>
                <motion.p
                  animate={showTimerPulse ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: showTimerPulse ? Infinity : 0, duration: 1, type: "tween" }}
                  className="text-lg font-mono font-bold text-red-600 mt-2"
                >
                  ⏱️ {timerMinutes}:59:{timerSeconds > 55 ? "58" : "55"}
                </motion.p>
              </div>

              {/* Learn button */}
              {showLearnButton && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.button
                    animate={showTimerPulse ? { scale: [1, 1.03, 1] } : {}}
                    transition={{ repeat: showTimerPulse ? Infinity : 0, duration: 1.5, type: "tween" }}
                    className="w-full bg-blue-50 border-2 border-blue-200 text-blue-700 py-3 rounded-xl text-sm font-bold mb-3"
                  >
                    📚 Erfahre mehr über Slow Finance →
                  </motion.button>

                  {/* Quote */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 italic text-center leading-relaxed">
                      &quot;Der Aktienmarkt überträgt Geld von den Ungeduldigen zu den
                      Geduldigen.&quot;
                    </p>
                    <p className="text-[10px] text-gray-400 text-center mt-1">— Warren Buffett</p>
                  </div>
                </motion.div>
              )}

              {/* Note */}
              {showNote && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 text-center mt-3"
                >
                  So lehrt Leo Slow Finance: Geduld statt Impuls.
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
