import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import lionIcon from "@/assets/lion-logo.png";
import { BottomNav, ScreenHeader } from "@/components/ing/layout";

interface SectionProps {
  elapsed: number;
}

// Section elapsed mapping (section starts at demo sec 56, duration 22s):
// 0-2: dashboard transition to payday view
// 2-4: paycheck envelope drops
// 4-5: tax 1 (Lohnsteuer -30)
// 5-6: tax 2 (Krankenversicherung -15)
// 6-7: tax 3 (Rentenversicherung -12)
// 7-8: tax 4 (Solidaritätszuschlag -3)
// 8-9: Netto result
// 9-12: LEO message
// 12-13: pie tap
// 13-17: pie chart
// 17-20: pie hold
// 20-22: fade

const TAXES = [
  { label: "Lohnsteuer", amount: 30, emoji: "🔻" },
  { label: "Krankenversicherung", amount: 15, emoji: "🔻" },
  { label: "Rentenversicherung", amount: 12, emoji: "🔻" },
  { label: "Solidaritätszuschlag", amount: 3, emoji: "🔻" },
];

function AnimatedCounter({ target, duration = 0.5 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    setValue(target);
  }, [target]);
  return <span>€{value.toFixed(2).replace(".", ",")}</span>;
}

const PIE_SEGMENTS = [
  { label: "Bildung & Schulen", percent: 35, color: "#FF6200" },
  { label: "Gesundheit", percent: 25, color: "#3B82F6" },
  { label: "Infrastruktur", percent: 20, color: "#22C55E" },
  { label: "Soziales", percent: 12, color: "#EAB308" },
  { label: "Sonstiges", percent: 8, color: "#9CA3AF" },
];

export function SalaryTaxSection({ elapsed }: SectionProps) {
  const showPaycheck = elapsed >= 2;
  const taxCount = Math.min(4, Math.max(0, Math.floor(elapsed - 4)));
  const showNetto = elapsed >= 8;
  const showLeoMsg = elapsed >= 9;
  const showPieButton = elapsed >= 9 && elapsed < 13;
  const showPie = elapsed >= 13 && elapsed < 20;
  const isFading = elapsed >= 20;

  // Calculate running balance
  const grossAmount = 200;
  const deducted = TAXES.slice(0, taxCount).reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = grossAmount - deducted;
  const nettoAmount = 140;

  // Pie chart fade
  if (isFading) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="flex-1 flex flex-col bg-[#F3F3F3]"
      >
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Wird fortgesetzt...</p>
        </div>
        <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="junior" />
      </motion.div>
    );
  }

  // Pie chart view
  if (showPie) {
    const pieProgress = Math.min(1, (elapsed - 13) / 3);
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3]">
        <ScreenHeader title="Wohin gehen deine Steuern?" />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Simple pie chart representation */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {PIE_SEGMENTS.map((seg, i) => {
                  const offset = PIE_SEGMENTS.slice(0, i).reduce((s, p) => s + p.percent, 0);
                  const dashLength = seg.percent * 3.14159;
                  const dashOffset = offset * 3.14159;
                  const totalCirc = 100 * 3.14159;
                  const animatedDash = dashLength * Math.min(1, pieProgress * (PIE_SEGMENTS.length / (i + 1)));
                  return (
                    <circle
                      key={seg.label}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="20"
                      strokeDasharray={`${animatedDash} ${totalCirc}`}
                      strokeDashoffset={-dashOffset * 1}
                      style={{ transition: "stroke-dasharray 0.5s ease" }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#333333]">€60</div>
                  <div className="text-xs text-gray-500">Steuern</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {PIE_SEGMENTS.map((seg, i) => (
                <motion.div
                  key={seg.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: pieProgress > (i / PIE_SEGMENTS.length) ? 1 : 0, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-sm text-gray-700 flex-1">{seg.label}</span>
                  <span className="text-sm font-bold text-gray-900">{seg.percent}%</span>
                </motion.div>
              ))}
            </div>
          </div>

          {elapsed >= 17 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 rounded-xl p-3 border border-blue-100"
            >
              <p className="text-sm text-blue-700 text-center">
                Jetzt weißt du, wo deine €60 hingehen.
              </p>
            </motion.div>
          )}
        </div>
        <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="junior" />
      </div>
    );
  }

  // Main salary view
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🦁</span>
          <span className="font-bold text-[#333333]">LEO JUNIOR</span>
        </div>
        <span className="text-xs text-gray-500">Montag, 10. Feb 2026</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-2"
        >
          <h2 className="text-xl font-bold text-[#333333]">Guten Morgen, Sofia! 💰</h2>
        </motion.div>

        {/* Paycheck envelope */}
        <AnimatePresence>
          {showPaycheck && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white rounded-2xl shadow-sm p-5"
            >
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-5xl mb-2"
                >
                  ✉️
                </motion.div>
                <div className="text-green-500 text-3xl font-bold">
                  💰 Virtuelles Gehalt: €200,00
                </div>
              </div>

              {/* Tax deductions */}
              <div className="space-y-2 mt-4">
                {TAXES.slice(0, taxCount).map((tax, i) => (
                  <motion.div
                    key={tax.label}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-between items-center px-3 py-2 bg-red-50 rounded-xl"
                  >
                    <span className="text-sm text-red-600">
                      {tax.emoji} {tax.label}
                    </span>
                    <span className="text-sm font-bold text-red-600">−€{tax.amount.toFixed(2).replace(".", ",")}</span>
                  </motion.div>
                ))}
              </div>

              {/* Running balance */}
              {taxCount > 0 && (
                <div className="mt-3 text-center">
                  <span className="text-gray-500 text-sm">Kontostand: </span>
                  <span className="text-lg font-bold text-[#333333]">
                    €{currentBalance.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}

              {/* Netto result */}
              {showNetto && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 pt-4 border-t-2 border-gray-200"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-[#FF6200] text-3xl font-bold">
                      ✅ Netto: €{nettoAmount.toFixed(2).replace(".", ",")}
                    </span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ type: "tween", duration: 0.5 }}
                      className="text-2xl"
                    >
                      😤
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEO message */}
        {showLeoMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2"
          >
            <div className="w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0">
              <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex-1">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl rounded-bl-md px-4 py-3">
                <p className="text-sm text-gray-800 leading-relaxed">
                  Richtig — denn das echte Leben ist auch nervig. Und jetzt verstehst du Netto vs.
                  Brutto ohne Schulbuch.
                </p>
              </div>
              {showPieButton && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2"
                >
                  <motion.div
                    animate={elapsed >= 12.5 ? { scale: [1, 0.93, 1] } : {}}
                    transition={{ duration: 0.3, type: "tween" }}
                    className="px-4 py-2 border-2 border-[#FF6200] rounded-full text-[#FF6200] text-sm font-bold w-fit"
                  >
                    📊 Wohin gehen deine Steuern?
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="junior" />
    </div>
  );
}
