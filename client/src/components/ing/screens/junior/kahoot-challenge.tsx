import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { Zap, Play, Smartphone, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import lionIcon from "@/assets/lion-logo.png";

const QUIZ_TOPICS = [
  { label: "Aktien & Börse", icon: "📈" },
  { label: "Sparen & Budget", icon: "💰" },
  { label: "Krypto & Blockchain", icon: "⛓️" },
  { label: "Versicherungen", icon: "🛡️" },
  { label: "Steuern & Gehalt", icon: "📋" },
  { label: "Investieren", icon: "🎯" },
];

export function KahootChallengeScreen({
  onBack,
  onNavigate,
  onLeoClick,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onLeoClick?: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <ScreenHeader title="Quiz Challenge" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Hero */}
        <div className="text-center pt-2 pb-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-[#FF6200] to-[#FF8533] rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Zap size={40} className="text-white" fill="currentColor" />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#333] mb-1">Quiz Battle</h1>
          <p className="text-gray-500 text-sm">Live Kahoot-Style Quiz mit Freunden!</p>
        </div>

        {/* Leo Tip */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-2xl border border-orange-100 flex gap-3">
          <div className="w-9 h-9 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            <img src={lionIcon} alt="Leo" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <div className="font-bold text-orange-700 text-xs mb-1">Leo sagt:</div>
            <p className="text-[11px] text-orange-600 leading-relaxed">
              Starte ein Live-Quiz und lass deine Freunde mit ihren Handys beitreten!
              Der Host zeigt die Fragen auf dem großen Bildschirm. 🏆
            </p>
          </div>
        </div>

        {/* Topics Preview */}
        <div>
          <div className="font-bold text-[#333] text-sm mb-3 px-1">Verfügbare Themen</div>
          <div className="grid grid-cols-3 gap-2">
            {QUIZ_TOPICS.map((topic) => (
              <div key={topic.label} className="bg-white p-2 rounded-xl text-center shadow-sm">
                <span className="text-xl block mb-1">{topic.icon}</span>
                <span className="text-[10px] font-bold text-gray-600">{topic.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <motion.button whileTap={{ scale: 0.98 }}
            onClick={() => window.open("/kahoot/host", "_blank")}
            className="w-full bg-gradient-to-r from-[#FF6200] to-[#FF8533] text-white p-4 rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-3">
            <Play size={22} fill="currentColor" />
            <span>Quiz hosten</span>
            <ExternalLink size={14} className="opacity-60" />
          </motion.button>

          <motion.button whileTap={{ scale: 0.98 }}
            onClick={() => window.open("/kahoot/join", "_blank")}
            className="w-full bg-white text-[#333] p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm border border-gray-200">
            <Smartphone size={18} />
            Quiz beitreten
          </motion.button>
        </div>
      </div>
      <BottomNav activeTab="learn" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
    </div>
  );
}
