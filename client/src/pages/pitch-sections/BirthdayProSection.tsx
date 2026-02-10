import { motion, AnimatePresence } from "framer-motion";
import { ScreenHeader, BottomNav } from "@/components/ing/layout";
import { Search, ChevronRight, ArrowUp, PieChart, CreditCard, MoreHorizontal, Flame, Sparkles } from "lucide-react";
import lionIcon from "@/assets/lion-logo.png";

interface SectionProps {
  elapsed: number;
}

// Section elapsed (starts at demo sec 199, duration 68s):
// BIRTHDAY TRANSITION
// 0-3: Junior dashboard with age counter typewriter (15→16→17→18)
// 3-5: Cake animation with candle
// 5-7: Candle blow out
// 7-9: Screen crack effect + flash
// 9-11: Shatter + black transform screen
// 11-15: Adult dashboard reveal (clean, professional)
// LEO PRO AGENT CHAT
// 15-18: Leo Pro chat overlay slides up
// 18-24: Welcome message
// 24-30: Cashflow analysis
// 30-36: O2 contract recommendation
// 36-42: Vermieter PDF scan
// 42-50: Budget pie chart
// 50-58: Tax reserve suggestion
// 58-68: Summary + final holding

const PRO_MESSAGES = [
  {
    time: 18,
    sender: "leo" as const,
    text: "Willkommen zurück, Sofia! 🎉 Ich bin jetzt LEO Pro — dein persönlicher Finanz-Assistent für echtes Banking. Lass uns deinen monatlichen Check machen.",
  },
  {
    time: 24,
    sender: "leo" as const,
    text: "📊 Cashflow-Analyse Mai:\n\nEinnahmen: €2.150\nAusgaben: €1.780\nSparquote: 17,2%\n\n✅ Du liegst über dem Ziel von 15%.",
  },
  {
    time: 30,
    sender: "leo" as const,
    text: "📱 Dein O2-Vertrag läuft in 14 Tagen aus. Ich habe 3 günstigere Alternativen gefunden — bis zu €8,50/Monat Ersparnis. Soll ich die vergleichen?",
  },
  {
    time: 36,
    sender: "leo" as const,
    text: "📄 Vermieter-Brief gescannt: Deine Nebenkostenabrechnung enthält einen Fehler bei den Heizkosten (§556 BGB). Potenzielle Rückerstattung: €127,40. Soll ich ein Widerspruchsschreiben erstellen?",
  },
  {
    time: 42,
    sender: "leo" as const,
    text: "📈 Budget-Optimierung:\n\n🏠 Wohnen: 38% (€680)\n🍕 Essen: 22% (€390)\n🚗 Mobilität: 12% (€215)\n🎮 Freizeit: 15% (€270)\n💰 Sparen: 13% (€225)\n\nTipp: Essen liegt 4% über Benchmark.",
  },
  {
    time: 50,
    sender: "leo" as const,
    text: "🏦 Steuer-Rücklage: Du solltest €200/Monat für die Einkommenssteuer-Nachzahlung zurücklegen. Soll ich einen automatischen Dauerauftrag einrichten?",
  },
  {
    time: 58,
    sender: "leo" as const,
    text: "✅ Monatlicher Check abgeschlossen.\n\n3 Aktionspunkte erstellt:\n1. O2-Vertrag kündigen\n2. Nebenkosten-Widerspruch\n3. Steuer-Dauerauftrag\n\nAlles unter Kontrolle, Sofia! 💪",
  },
];

function QuickActionAdult({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-[#33307E] flex items-center justify-center shadow-md">{icon}</div>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  );
}

export function BirthdayProSection({ elapsed }: SectionProps) {
  // Phase determination
  const isAgeCounter = elapsed < 3;
  const isCake = elapsed >= 3 && elapsed < 5;
  const isCandleBlow = elapsed >= 5 && elapsed < 7;
  const isScreenCrack = elapsed >= 7 && elapsed < 9;
  const isTransform = elapsed >= 9 && elapsed < 11;
  const isAdultDashboard = elapsed >= 11 && elapsed < 15;
  const isProChat = elapsed >= 15;

  // Age counter value (typewriter effect)
  const age = isAgeCounter ? Math.min(18, 15 + Math.floor(elapsed)) : 18;

  // Visible messages based on elapsed
  const visibleMessages = PRO_MESSAGES.filter((m) => elapsed >= m.time);

  // ---- PHASE 1: Age Counter ----
  if (isAgeCounter) {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-gradient-to-r from-[#FF6200] to-[#FF8534] px-4 py-3 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">🦁</div>
              <div>
                <div className="font-bold">Sofia</div>
                <div className="text-xs text-white/80">Level 12 • Finanz-Profi</div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <Flame size={14} className="text-yellow-300" />
              <span className="text-sm font-bold">42</span>
            </div>
          </div>
          <div className="bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full w-[85%]" />
          </div>
          <div className="text-xs text-white/60 mt-1">2,450 / 3,000 XP</div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div key={age} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="text-center">
            <div className="text-8xl font-black text-[#FF6200]">{age}</div>
            <div className="text-gray-500 text-lg mt-2">Jahre alt</div>
          </motion.div>
        </div>

        <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="junior" />
      </div>
    );
  }

  // ---- PHASE 2: Cake ----
  if (isCake || isCandleBlow) {
    const candleBlown = elapsed >= 5;
    return (
      <div className="flex-1 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ["#FF6200", "#FFD700", "#FF69B4", "#00CED1", "#9370DB"][i % 5],
                left: `${Math.random() * 100}%`,
                top: -20,
              }}
              animate={{ y: [0, 900], x: [0, (Math.random() - 0.5) * 100], rotate: [0, 360 * 3] }}
              transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 2, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }} className="relative">
          <div className="text-[150px] leading-none">🎂</div>
          {!candleBlown && (
            <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2" animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }} transition={{ repeat: Infinity, duration: 0.5, type: "tween" }}>
              <div className="text-4xl">🔥</div>
            </motion.div>
          )}
          {candleBlown && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [1, 0], scale: [1, 2] }} transition={{ duration: 0.8 }} className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="text-4xl">💨</div>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-white text-center mt-8">
          <div className="text-4xl font-bold mb-2">18!</div>
          <div className="text-lg text-white/80">Du bist jetzt erwachsen</div>
        </motion.div>
      </div>
    );
  }

  // ---- PHASE 3: Screen Crack ----
  if (isScreenCrack) {
    return (
      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#FF6200] to-[#E55800]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-40 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 375 812">
            <motion.path d="M187 0 L200 150 L250 200 L220 300 L280 400 L240 500 L300 600 L260 700 L187 812" stroke="white" strokeWidth="4" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
            <motion.path d="M187 300 L100 350 L50 400" stroke="white" strokeWidth="3" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.2 }} />
            <motion.path d="M220 300 L300 280 L350 350" stroke="white" strokeWidth="3" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.3 }} />
            <motion.path d="M240 500 L150 520 L80 600" stroke="white" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.4 }} />
          </svg>
          <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.4, delay: 0.5 }} />
        </motion.div>
      </div>
    );
  }

  // ---- PHASE 4: Transform ----
  if (isTransform) {
    return (
      <div className="flex-1 relative overflow-hidden">
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 z-30 bg-gradient-to-b from-[#FF6200] to-[#E55800]">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 bg-gradient-to-b from-[#FF6200] to-[#E55800]"
              style={{ left: `${(i % 4) * 25}%`, top: `${Math.floor(i / 4) * 33}%`, clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400, rotate: Math.random() * 360, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute inset-0 flex items-center justify-center z-50 bg-black">
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ delay: 0.2, duration: 0.5, type: "tween" }} className="text-6xl mb-4">⚡</motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-white text-xl font-bold">Transformation...</motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---- PHASE 5: Adult Dashboard ----
  if (isAdultDashboard) {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="px-4 py-3 flex justify-between items-center bg-white shadow-sm z-10">
          <span className="font-bold text-lg tracking-tight text-[#FF6200]">Meine Konten</span>
          <div className="flex gap-4 text-[#FF6200]">
            <Search size={24} strokeWidth={2.5} />
            <MoreHorizontal size={24} strokeWidth={2.5} className="rotate-90" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white px-4 pt-6 pb-4 mb-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <span>Gesamt</span>
              <ChevronRight size={16} />
            </div>
            <div className="text-3xl font-bold text-[#333333]">2.897,50 EUR</div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <Sparkles size={16} />
              <span>+50€ Startbonus aktiviert!</span>
            </motion.div>
          </motion.div>

          <div className="bg-white px-4 pb-6 mb-4 grid grid-cols-4 gap-2">
            <QuickActionAdult icon={<ArrowUp size={20} className="text-white rotate-45" strokeWidth={3} />} label="Überweisen" />
            <QuickActionAdult icon={<PieChart size={20} className="text-white" />} label="Statistik" />
            <QuickActionAdult icon={<CreditCard size={20} className="text-white" />} label="Karte" />
            <QuickActionAdult icon={<MoreHorizontal size={20} className="text-white" />} label="Mehr" />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Girokonto</div>
            <div className="bg-white mx-2 rounded-xl shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF6200] rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">🦁</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-[#333]">Girokonto</div>
                <div className="text-xs text-gray-400">DE** •••• •••• 1234</div>
              </div>
              <div className="font-bold text-[#333]">2.847,50 EUR</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className="mx-4 mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎓</div>
              <div>
                <div className="font-bold text-green-800">Skills übertragen!</div>
                <div className="text-sm text-green-600">245 Trades • 12 Kurse • Level 12</div>
              </div>
            </div>
          </motion.div>
        </div>

        <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="adult" />
      </div>
    );
  }

  // ---- PHASE 6: Leo Pro Agent Chat ----
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden relative">
      {/* Adult dashboard behind (dimmed) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="px-4 py-3 flex justify-between items-center bg-white shadow-sm">
          <span className="font-bold text-lg text-[#FF6200]">Meine Konten</span>
        </div>
        <div className="bg-white px-4 pt-6 pb-4">
          <div className="text-3xl font-bold text-[#333333]">2.897,50 EUR</div>
        </div>
      </div>

      {/* Chat overlay */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute inset-0 bg-white flex flex-col z-20 rounded-t-3xl"
        style={{ top: "0px" }}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#33307E] to-[#4A47A3] px-4 py-3 flex items-center gap-3 shrink-0 rounded-t-0">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <img src={lionIcon} alt="Leo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="text-white font-bold flex items-center gap-2">
              LEO Pro
              <span className="bg-yellow-400 text-[10px] font-black text-gray-900 px-1.5 py-0.5 rounded-full">PRO</span>
            </div>
            <div className="text-white/60 text-xs">Dein Finanz-Assistent</div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2, type: "tween" }} className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-white/50 text-xs">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* System message */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
            <span className="bg-gray-100 text-gray-500 text-[10px] px-3 py-1 rounded-full">LEO Pro aktiviert — Monatlicher Check</span>
          </motion.div>

          {visibleMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-end gap-2"
            >
              <div className="w-7 h-7 bg-[#33307E] rounded-full flex items-center justify-center shrink-0">
                <img src={lionIcon} alt="Leo" className="w-5 h-5 object-contain" />
              </div>
              <div className="bg-gradient-to-br from-[#33307E]/5 to-[#33307E]/10 border border-[#33307E]/20 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{msg.text}</p>
                <div className="text-[9px] text-gray-400 mt-1.5 flex items-center gap-1">
                  {new Date(2025, 4, 15, 10, 30 + index * 2, 0).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                  <span className="text-[#33307E]">✓✓</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator for next message */}
          {elapsed < 58 && visibleMessages.length < PRO_MESSAGES.length && (
            <AnimatePresence>
              {(() => {
                const nextMsg = PRO_MESSAGES[visibleMessages.length];
                const showTyping = nextMsg && elapsed >= nextMsg.time - 2;
                if (!showTyping) return null;
                return (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
                    <div className="w-7 h-7 bg-[#33307E] rounded-full flex items-center justify-center shrink-0">
                      <img src={lionIcon} alt="Leo" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="flex gap-1.5 px-4 py-3 bg-[#33307E]/5 rounded-2xl rounded-bl-md w-fit">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-2 h-2 bg-[#33307E] rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          )}
        </div>

        {/* Chat Input (static) */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5">
            <span className="text-gray-400 text-sm flex-1">Nachricht an LEO Pro...</span>
            <div className="w-8 h-8 bg-[#33307E] rounded-full flex items-center justify-center">
              <ArrowUp size={16} className="text-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
