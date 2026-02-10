import { motion, AnimatePresence } from "framer-motion";
import lionIcon from "@/assets/lion-logo.png";
import { BottomNav } from "@/components/ing/layout";

interface SectionProps {
  elapsed: number;
}

function TypingDots() {
  return (
    <div className="flex gap-1.5 px-4 py-3 bg-orange-50 rounded-2xl rounded-bl-md w-fit">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 bg-[#FF6200] rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function LeoBubble({ children, timestamp }: { children: React.ReactNode; timestamp?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
      <div className="w-7 h-7 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0">
        <img src={lionIcon} alt="Leo" className="w-5 h-5 object-contain" />
      </div>
      <div className="bg-orange-50 border border-orange-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
        {children}
        {timestamp && (
          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">{timestamp}</div>
        )}
      </div>
    </motion.div>
  );
}

export function UkrainianSection({ elapsed }: SectionProps) {
  // Timeline: 0-2 splash, 2-4 chat loads, 4-9 notification, 9-10 typing, 10-17 msg1+hold,
  // 17-18 typing2, 18-20 msg2, 20-21 card button, 21-25 example card, 25-26 german, 26-27 back
  const isSplash = elapsed < 2;
  const showNotification = elapsed >= 4 && elapsed < 9;
  const showTyping1 = elapsed >= 9 && elapsed < 10;
  const showMsg1 = elapsed >= 10;
  const showTyping2 = elapsed >= 17 && elapsed < 18;
  const showMsg2 = elapsed >= 18;
  const showCardButton = elapsed >= 20;
  const showExampleCard = elapsed >= 21;
  const isGermanMode = elapsed >= 25 && elapsed < 26;

  if (isSplash) {
    return (
      <motion.div
        className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#FF6200] to-[#E55800]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-8"
        >
          <img src={lionIcon} alt="Leo" className="w-20 h-20 object-contain" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-white tracking-wider mb-2"
        >
          LEO
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-orange-100 text-lg"
        >
          Dein Finanzassistent
        </motion.p>
        <motion.div
          className="flex gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-white/60 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
            />
          ))}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white relative">
      {/* Chat Header */}
      <div className="bg-[#FF6200] px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
        </div>
        <span className="text-white font-bold text-lg">🦁 LEO</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {/* Notification overlay */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -120, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute top-2 left-2 right-2 z-30"
            >
              <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-2xl border border-white/20">
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-2xl">🌐</span>
                  <div className="flex-1">
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider">SYSTEM</div>
                    <div className="text-white font-bold text-sm">Sprache erkannt</div>
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 mb-2 border border-white/10">
                  <p className="text-white text-sm font-medium">
                    System Language Detected: Українська (Ukrainian)
                  </p>
                </div>
                <p className="text-[#FF6200] text-xs mb-3">
                  LEO has adapted: German financial terms will be explained in your native language.
                </p>
                <div className="flex gap-4">
                  <span className="text-gray-400 text-xs">Dismiss</span>
                  <span className="text-[#FF6200] text-xs font-bold">Settings</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typing 1 */}
        <AnimatePresence>
          {showTyping1 && !showMsg1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-7 h-7 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0">
                <img src={lionIcon} alt="" className="w-5 h-5 object-contain" />
              </div>
              <TypingDots />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message 1 */}
        {showMsg1 && (
          <LeoBubble timestamp="10:23 🇺🇦">
            <p className="text-sm text-gray-800 leading-relaxed">
              System alert. I have detected your phone system language is Ukrainian. I've automatically
              adapted my interface to explain German financial terms in your native language.
            </p>
          </LeoBubble>
        )}

        {/* Typing 2 */}
        <AnimatePresence>
          {showTyping2 && !showMsg2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-7 h-7 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0">
                <img src={lionIcon} alt="" className="w-5 h-5 object-contain" />
              </div>
              <TypingDots />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message 2 */}
        {showMsg2 && (
          <LeoBubble>
            <p className="text-sm text-gray-800 leading-relaxed">
              I translate the complex German &apos;<span className="font-bold">Behördendeutsch</span>
              &apos; into your native language automatically — so the meaning stays correct, not
              simplified wrong.
            </p>
          </LeoBubble>
        )}

        {/* Card button */}
        {showCardButton && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-9">
            <motion.div
              animate={elapsed >= 20.8 && elapsed < 21.2 ? { scale: [1, 0.93, 1] } : {}}
              transition={{ duration: 0.3, type: "tween" }}
              className="px-4 py-2 border-2 border-[#FF6200] rounded-full text-[#FF6200] text-sm font-bold w-fit cursor-pointer"
            >
              📄 See Example ↓
            </motion.div>
          </motion.div>
        )}

        {/* Example Card */}
        <AnimatePresence>
          {showExampleCard && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg ml-4"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🇩🇪</span>
                  <span className="font-bold text-[#333333]">Kapitalertragsteuer</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🇺🇦</span>
                  <span className="text-blue-600 font-medium">Податок на приріст капіталу</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 min-h-[48px]">
                  {isGermanMode ? (
                    <p className="text-xs leading-relaxed text-gray-500 italic">
                      Steuer auf Erträge aus Kapitalvermögen gemäß §20 EStG
                    </p>
                  ) : (
                    <p className="leading-relaxed text-sm">
                      When you earn money from investments, this tax is automatically deducted.
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <div
                    className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isGermanMode ? "bg-[#FF6200] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    🇩🇪 Original
                  </div>
                  <div
                    className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      !isGermanMode ? "bg-[#FF6200] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    🇺🇦 Simplified
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="junior" />
    </div>
  );
}
