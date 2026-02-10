import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings, TrendingUp, BookOpen, Shield, Lock, Users } from "lucide-react";
import lionIcon from "@/assets/lion-logo.png";

interface SectionProps {
  elapsed: number;
}

type TabType = "progress" | "rules" | "limits" | "notifications";

// Section elapsed (starts at demo sec 141, duration 21s):
// 0-2: splash transition
// 2-6: dashboard with progress tab
// 6-7: highlight "Taschengeld" tab
// 7: auto-tap to "Taschengeld"
// 7-13: rules tab content (pocket money, virtual budget, approval settings, privacy notice)
// 13-14: highlight "Limits" tab
// 14: auto-tap to "Limits"
// 14-17: limits tab content
// 17-18: highlight "Meldungen" tab
// 18: auto-tap to "Meldungen"
// 18-21: notifications tab content

function TabButton({ icon, label, active, highlight }: {
  icon: React.ReactNode; label: string; active: boolean; highlight?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all relative ${
      active ? "text-[#FF6200] bg-orange-50" : "text-gray-400"
    }`}>
      {highlight && (
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, type: "tween" }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF6200] rounded-full"
        />
      )}
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}

export function ParentSection({ elapsed }: SectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("progress");

  // Auto-advance tabs based on elapsed
  useEffect(() => {
    if (elapsed >= 18) setActiveTab("notifications");
    else if (elapsed >= 14) setActiveTab("limits");
    else if (elapsed >= 7) setActiveTab("rules");
    else setActiveTab("progress");
  }, [elapsed]);

  const isSplash = elapsed < 2;
  const highlightRules = elapsed >= 6 && elapsed < 7;
  const highlightLimits = elapsed >= 13 && elapsed < 14;
  const highlightNotifications = elapsed >= 17 && elapsed < 18;

  if (isSplash) {
    return (
      <motion.div
        className="flex-1 bg-gradient-to-b from-[#FF6200] to-[#E55800] flex flex-col items-center justify-center px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
        >
          <img src={lionIcon} alt="Leo" className="w-20 h-20 object-contain" />
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-white text-3xl font-bold mt-6">LEO</motion.h1>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/80 mt-2">Eltern-Dashboard</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-2 h-2 bg-white rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2, type: "tween" }} />
          ))}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
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
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">👧</div>
            <div>
              <div className="font-bold text-lg">Sofia</div>
              <div className="text-orange-100 text-sm">15 Jahre</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <AnimatePresence mode="wait">
          {activeTab === "progress" && (
            <motion.div key="progress" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
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
                  <motion.div initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-[#FF6200] to-[#FF8F00] rounded-full" />
                </div>
              </div>
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
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={20} className="text-purple-500" />
                  <span className="font-bold text-[#333333]">Risiko-Einstellung</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Niedrig</span>
                  <span className="font-bold text-[#333333]">Mittel</span>
                  <span>Hoch</span>
                </div>
                <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#FF6200] rounded-full shadow-md" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "rules" && (
            <motion.div key="rules" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><span className="text-xl">💰</span></div>
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
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"><span className="text-xl">🎮</span></div>
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
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"><Settings size={20} className="text-[#FF6200]" /></div>
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
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
            <motion.div key="limits" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
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
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={20} className="text-orange-500" />
                  <span className="font-bold text-[#333333]">Schutzregeln</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Krypto erlaubt</span>
                    <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Hebel-Produkte</span>
                    <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Bell size={20} className="text-[#FF6200]" />
                  <span className="font-bold text-[#333333]">Benachrichtigungen</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Quiz abgeschlossen", on: true },
                    { label: "Neues Investment", on: true },
                    { label: "Wöchentlicher Report", on: true },
                    { label: "Friction Alert", on: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{item.label}</span>
                      <div className={`w-10 h-6 ${item.on ? "bg-green-500" : "bg-gray-300"} rounded-full flex items-center ${item.on ? "justify-end" : ""} px-1`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📬</span>
                  <span className="font-bold text-[#333333]">Letzte Aktivität</span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>✅ <span className="font-medium">Quiz bestanden:</span> Brutto vs Netto (heute)</p>
                  <p>📈 <span className="font-medium">Investment:</span> MSCI World ETF gekauft (gestern)</p>
                  <p>⚠️ <span className="font-medium">Friction Alert:</span> 3 schnelle Trades (Mo)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar */}
      <div className="bg-white border-t border-gray-200 px-2 py-3 shrink-0">
        <div className="flex justify-around">
          <TabButton icon={<TrendingUp size={20} />} label="Fortschritt" active={activeTab === "progress"} />
          <TabButton icon={<span className="text-lg">💰</span>} label="Taschengeld" active={activeTab === "rules"} highlight={highlightRules} />
          <TabButton icon={<Settings size={20} />} label="Limits" active={activeTab === "limits"} highlight={highlightLimits} />
          <TabButton icon={<Bell size={20} />} label="Meldungen" active={activeTab === "notifications"} highlight={highlightNotifications} />
        </div>
      </div>
    </motion.div>
  );
}
