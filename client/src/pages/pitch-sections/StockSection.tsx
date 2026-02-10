import { motion, AnimatePresence } from "framer-motion";
import { ScreenHeader, BottomNav } from "@/components/ing/layout";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import lionIcon from "@/assets/lion-logo.png";

interface SectionProps {
  elapsed: number;
}

// Section elapsed (starts at demo sec 95, duration 25s):
// 0-2: portfolio screen
// 2-5: hold
// 5-6: tap Tesla
// 6-8: typing analysis
// 8-12: LEO analysis with news
// 12-13: emotion check appears
// 13-15: emotion buttons
// 15-16: tap "Neugierig"
// 16-20: LEO response
// 20-25: hold + fade

const PORTFOLIO = [
  { name: "MSCI World ETF", value: "€500", change: "+1,8%", changeVal: "+€9,00", positive: true, icon: "🌍" },
  { name: "Tesla (TSLA)", value: "€300", change: "−10,3%", changeVal: "−€30,90", positive: false, icon: "🔴", pulse: true },
  { name: "SAP", value: "€200", change: "+0,2%", changeVal: "+€0,40", positive: true, icon: "🟡" },
];

const TESLA_CHART = [
  { d: "1", v: 334 }, { d: "2", v: 328 }, { d: "3", v: 320 },
  { d: "4", v: 315 }, { d: "5", v: 308 }, { d: "6", v: 304 }, { d: "7", v: 299 },
];

const NEWS_ITEMS = [
  "Tesla Q4-Ergebnisse verfehlen Erwartungen um 12%",
  "EU-EV-Subventionen um 15% gekürzt",
  "Lieferkettenkosten gestiegen",
];

const EMOTIONS = [
  { emoji: "😰", label: "Ängstlich" },
  { emoji: "😤", label: "Frustriert" },
  { emoji: "🤔", label: "Neugierig" },
  { emoji: "😎", label: "Alles gut" },
];

export function StockSection({ elapsed }: SectionProps) {
  const showPortfolio = elapsed < 5;
  const showTeslaDetail = elapsed >= 5 && elapsed < 20;
  const showTyping = elapsed >= 6 && elapsed < 8;
  const showAnalysis = elapsed >= 8;
  const showEmotionCheck = elapsed >= 12 && elapsed < 16;
  const emotionTapped = elapsed >= 15;
  const showLeoResponse = elapsed >= 16;

  // Portfolio view
  if (showPortfolio) {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <ScreenHeader
          title="Mein Portfolio"
          rightAction={
            <button className="w-10 h-10 rounded-full bg-[#FF6200]/10 flex items-center justify-center">
              <Search size={20} className="text-[#FF6200]" />
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Play Money Badge */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 rounded-xl text-white shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎮</span>
              <span className="text-sm font-medium opacity-90">Spielgeld</span>
            </div>
            <div className="text-xl font-bold font-mono">v€1.400,00</div>
          </div>

          {/* Portfolio header */}
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <div className="text-gray-500 text-sm mb-1">Gesamt</div>
            <div className="text-2xl font-bold text-[#333333]">v€1.000,00</div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-red-50 text-red-600">
              <TrendingDown size={16} />
              −1,5% (−€21,60)
            </div>
          </div>

          {/* Holdings */}
          <div className="space-y-3">
            {PORTFOLIO.map((stock) => (
              <motion.div
                key={stock.name}
                animate={
                  stock.pulse
                    ? { backgroundColor: ["#ffffff", "#fee2e2", "#ffffff"] }
                    : {}
                }
                transition={stock.pulse ? { repeat: Infinity, duration: 2 } : {}}
                className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">
                    {stock.icon}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#333333]">{stock.name}</div>
                    <div className="text-xs text-gray-400">{stock.value}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${stock.positive ? "text-green-500" : "text-red-500"}`}>
                    {stock.change}
                  </div>
                  <div className={`text-xs ${stock.positive ? "text-green-400" : "text-red-400"}`}>
                    {stock.changeVal}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cash & total */}
          <div className="bg-white rounded-xl p-3 flex justify-between text-sm">
            <span className="text-gray-500">💵 Bargeld: €400</span>
            <span className="font-bold text-gray-700">📊 Gesamt: −€21,60</span>
          </div>
        </div>
        <BottomNav activeTab="invest" onNavigate={() => {}} profile="junior" />
      </div>
    );
  }

  // Tesla detail view
  if (showTeslaDetail) {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <ScreenHeader title="🔴 TESLA (TSLA)" onBack={() => {}} />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Price info */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-xs mb-1">Virtuelle Position</div>
            <div className="flex justify-between text-sm mb-2">
              <span>Kaufkurs: €334,00</span>
              <span>Jetzt: €299,58</span>
            </div>
            <div className="text-red-500 font-bold">Veränderung: −10,3% | Verlust: −€30,90</div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-4 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TESLA_CHART}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1000}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  formatter={(value: number) => [`€${value}`, "Kurs"]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Why fallen */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-bold text-[#333333] mb-3">📰 WARUM IST SIE GEFALLEN?</h3>

            {/* Typing dots */}
            {showTyping && !showAnalysis && (
              <div className="flex gap-1.5 py-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-[#FF6200] rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  />
                ))}
              </div>
            )}

            {/* Analysis */}
            {showAnalysis && (
              <div className="space-y-2">
                {NEWS_ITEMS.map((news, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="flex items-start gap-2"
                  >
                    <span>📰</span>
                    <span className="text-sm text-gray-700">{news}</span>
                  </motion.div>
                ))}

                {/* Lesson box */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3"
                >
                  <p className="text-sm text-yellow-800">
                    💡 Aktienkurse reagieren auf echte Nachrichten. Das nennt man
                    &apos;Ergebnisvolatilität.&apos; Langfristige Investoren bleiben ruhig und
                    analysieren.
                  </p>
                </motion.div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-2 rounded-xl border-2 border-blue-400 text-blue-600 text-xs font-bold">
                    Halten
                  </button>
                  <button className="flex-1 py-2 rounded-xl border-2 border-red-400 text-red-600 text-xs font-bold">
                    Verkaufen
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-[#FF6200] text-white text-xs font-bold">
                    Mehr erfahren
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Emotion check */}
          <AnimatePresence>
            {showEmotionCheck && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white/95 rounded-3xl shadow-2xl p-5"
              >
                <h3 className="font-bold text-[#333333] text-center mb-1">🧠 EMOTIONS-CHECK</h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  Wie fühlst du dich bei diesem Verlust?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {EMOTIONS.map((emo, i) => {
                    const isSelected = emotionTapped && i === 2; // Neugierig
                    const isOther = emotionTapped && i !== 2;
                    return (
                      <motion.div
                        key={emo.label}
                        animate={isSelected ? { scale: [1, 0.95, 1] } : {}}
                        transition={{ duration: 0.25, type: "tween" }}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${
                          isSelected
                            ? "bg-orange-50 border-[#FF6200]"
                            : isOther
                            ? "opacity-40 border-gray-200"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="text-3xl mb-1">{emo.emoji}</div>
                        <div className="text-xs font-bold text-gray-700">{emo.label}</div>
                        {isSelected && <span className="text-[#FF6200]">✓</span>}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leo response after emotion */}
          {showLeoResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <div className="w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0">
                <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                <p className="text-sm text-gray-800 leading-relaxed">
                  Tolle Einstellung! Neugier schlägt Panik. Die meisten Erwachsenen würden jetzt
                  panisch verkaufen und Verluste realisieren. Du denkst bereits wie ein Investor.
                </p>
              </div>
            </motion.div>
          )}
        </div>
        <BottomNav activeTab="invest" onNavigate={() => {}} profile="junior" />
      </div>
    );
  }

  return <div className="flex-1 bg-[#F3F3F3]" />;
}
