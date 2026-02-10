import { motion, AnimatePresence } from "framer-motion";
import lionIcon from "@/assets/lion-logo.png";
import { BottomNav } from "@/components/ing/layout";

interface SectionProps {
  elapsed: number;
}

// Section elapsed mapping (section starts at demo sec 27):
// 0-3: hold chat from Ukrainian, 3-5: notification, 5-7: hold, 7: dismiss
// 7-8: transition, 8-10: accessible dashboard, 10-13: focus budget
// 13-15: swipe to Lernen, 15-17: chat open, 17-21: chat msg, 21-25: hold
// 25-26: banner, 26-29: banner hold + transition back to normal

function AudioWaveform() {
  return (
    <div className="flex items-center gap-1 h-6">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[#FF6200] rounded-full"
          animate={{ height: [8, 20 + Math.random() * 12, 8] }}
          transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.3, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

export function AccessibilitySection({ elapsed }: SectionProps) {
  const showChatHold = elapsed < 3;
  const showNotification = elapsed >= 3 && elapsed < 7;
  const showTransition = elapsed >= 7 && elapsed < 8;
  const showA11yDashboard = elapsed >= 8 && elapsed < 15;
  const showChat = elapsed >= 15 && elapsed < 25;
  const showBanner = elapsed >= 25 && elapsed < 29;
  const focusBudget = elapsed >= 10 && elapsed < 13;
  const focusLernen = elapsed >= 13 && elapsed < 15;

  // Chat hold from previous section
  if (showChatHold) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-[#FF6200] px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-white font-bold text-lg">🦁 LEO</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0">
              <img src={lionIcon} alt="" className="w-5 h-5 object-contain" />
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
              <p className="text-sm text-gray-800">Chat from previous section visible...</p>
            </div>
          </div>
        </div>
        <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="junior" />
      </div>
    );
  }

  // Notification
  if (showNotification) {
    return (
      <div className="flex-1 flex flex-col bg-white relative">
        <div className="bg-[#FF6200] px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-white font-bold text-lg">🦁 LEO</span>
        </div>
        <div className="flex-1 relative p-4">
          <motion.div
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute top-2 left-2 right-2 z-30"
          >
            <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-2xl border border-white/20">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">♿</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-[10px] uppercase tracking-wider">SYSTEM</div>
                  <div className="text-white font-bold text-sm">Accessibility Detected</div>
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-3 mb-2 border border-white/10">
                <p className="text-white text-sm font-medium">♿ VoiceOver is ON</p>
                <p className="text-gray-300 text-xs mt-1">Switching to Blind Accessibility Mode...</p>
              </div>
              <p className="text-[#FF6200] text-xs mb-3">
                Large tiles • High contrast • Voice guidance
              </p>
              <div className="flex gap-4">
                <span className="text-gray-400 text-xs">Dismiss</span>
                <span className="text-[#FF6200] text-xs font-bold">Settings</span>
              </div>
            </div>
          </motion.div>
        </div>
        <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="junior" />
      </div>
    );
  }

  // Transition screen
  if (showTransition) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center bg-black"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, type: "tween" }}
          className="text-6xl mb-6"
        >
          ♿
        </motion.div>
        <p className="text-white font-bold text-lg mb-6">Switching to Accessibility Mode...</p>
        <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
            className="h-full bg-[#FF6200] rounded-full"
          />
        </div>
      </motion.div>
    );
  }

  // Accessible Dashboard
  if (showA11yDashboard) {
    return (
      <div className="flex-1 flex flex-col bg-black overflow-y-auto">
        {/* Waveform bar */}
        <div className="bg-[#1a1a1a] p-3 flex items-center gap-3 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center">
            <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex-1">
            <div className="text-white text-xs font-bold">Leo spricht...</div>
            <div className="text-gray-400 text-[10px]">VoiceOver aktiv</div>
          </div>
          <AudioWaveform />
        </div>

        <div className="p-4 space-y-4 flex-1">
          {/* Balance */}
          <div className={`bg-[#1a1a1a] rounded-2xl p-6 border-4 border-[#FF6200] relative ${focusBudget ? "" : ""}`}>
            <div className="text-gray-400 text-sm mb-1">Kontostand</div>
            <div className="text-white text-4xl font-bold">€145,50</div>
          </div>

          {/* Grid tiles */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`bg-[#1a1a1a] rounded-2xl p-4 border-4 relative ${
                focusBudget ? "border-blue-400 border-dashed" : "border-green-500/50"
              }`}
            >
              {focusBudget && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-2xl"
                />
              )}
              <div className="text-2xl mb-2">💰</div>
              <div className="text-white font-bold">Budget</div>
              <div className="text-green-400 text-sm font-bold">Stabil ✓</div>
            </div>
            <div
              className={`bg-[#1a1a1a] rounded-2xl p-4 border-4 relative ${
                focusLernen ? "border-blue-400 border-dashed" : "border-purple-500/50"
              }`}
            >
              {focusLernen && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-2xl"
                />
              )}
              <div className="text-2xl mb-2">📚</div>
              <div className="text-white font-bold">Lernen</div>
              <div className="text-purple-400 text-sm font-bold">3 neue</div>
            </div>
          </div>

          {/* Swipe indicator */}
          {focusLernen && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 50, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center text-white text-2xl"
            >
              →
            </motion.div>
          )}

          {/* Streak */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4 border-4 border-amber-500/50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <div className="text-white font-bold text-lg">12 Tage Streak</div>
                <div className="text-amber-400 text-sm">Weiter so!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessible bottom nav */}
        <div className="h-16 bg-[#1a1a1a] border-t-2 border-[#FF6200] flex justify-around items-center px-4 shrink-0">
          {["🏠", "💰", "🦁", "📚", "🏆"].map((icon, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                i === 0 ? "bg-[#FF6200]" : "bg-white/10"
              }`}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Chat overlay
  if (showChat) {
    return (
      <div className="flex-1 flex flex-col bg-black">
        {/* Chat header */}
        <div className="bg-[#1a1a1a] p-4 flex items-center gap-3 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center">
            <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold">Leo</div>
            <div className="text-green-400 text-xs">Sprachausgabe aktiv</div>
          </div>
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white">
            ✕
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Audio indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <AudioWaveform />
              <span className="text-gray-400 text-sm">Wird vorgelesen...</span>
            </div>
          </motion.div>

          {/* High contrast message */}
          {elapsed >= 17 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] rounded-2xl p-5 border-2 border-white/20"
            >
              <p className="text-[#FF6200] font-bold text-lg mb-2">Navigation: Budget.</p>
              <p className="text-green-400 font-bold text-lg mb-2">Trend: stabil.</p>
              <p className="text-white text-base mb-1">Swipe right for explanation.</p>
              <p className="text-white text-base">Double tap to confirm transfer.</p>
            </motion.div>
          )}

          {/* Action buttons */}
          {elapsed >= 19 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <button className="flex-1 bg-[#FF6200] text-white py-3 rounded-xl font-bold text-sm">
                ← Swipe Left
              </button>
              <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-sm">
                Swipe Right →
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Banner + transition back
  if (showBanner) {
    const transitionProgress = Math.min(1, (elapsed - 27) / 2); // fade out over last 2s
    return (
      <div
        className="flex-1 flex flex-col transition-colors duration-1000"
        style={{
          backgroundColor: elapsed >= 27 ? "#F3F3F3" : "#000000",
        }}
      >
        <div className="flex-1 flex items-end p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full bg-[#1a1a1a]/90 rounded-2xl p-4 border-l-4 border-[#FF6200]"
          >
            <p className="text-white text-sm leading-relaxed">
              ✨ Smart Detect: Reads iOS/Android OS-level accessibility settings. Zero manual setup.
            </p>
          </motion.div>
        </div>
        <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="junior" />
      </div>
    );
  }

  return <div className="flex-1 bg-[#F3F3F3]" />;
}
