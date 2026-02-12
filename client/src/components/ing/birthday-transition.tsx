import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/ing/layout";
import { Flame, Sparkles, Search, ChevronRight, ArrowUp, PieChart, CreditCard, MoreHorizontal } from "lucide-react";

interface BirthdayTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export function BirthdayTransitionOverlay({ isActive, onComplete }: BirthdayTransitionProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= 11) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return prev;
        }
        return prev + 0.05;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const isAgeCounter = elapsed < 3;
  const isCake = elapsed >= 3 && elapsed < 5;
  const isCandleBlow = elapsed >= 5 && elapsed < 7;
  const isScreenCrack = elapsed >= 7 && elapsed < 9;
  const isTransform = elapsed >= 9;
  const age = isAgeCounter ? Math.min(18, 15 + Math.floor(elapsed)) : 18;

  return (
    <motion.div
      className="absolute inset-0 z-[70] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* PHASE 1: Age Counter on Junior Dashboard */}
      {isAgeCounter && (
        <div className="flex-1 flex flex-col h-full bg-[#F3F3F3]">
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
            <div className="text-xs text-white/60 mt-1">2.450 / 3.000 XP</div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              key={age}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
              className="text-center"
            >
              <div className="text-8xl font-black text-[#FF6200]">{age}</div>
              <div className="text-gray-500 text-lg mt-2">Jahre alt</div>
            </motion.div>
          </div>

          <BottomNav activeTab="dashboard" onNavigate={() => {}} profile="junior" />
        </div>
      )}

      {/* PHASE 2: Cake + Candle */}
      {(isCake || isCandleBlow) && (
        <div className="flex-1 h-full bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden">
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

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative"
          >
            <div className="text-[150px] leading-none">🎂</div>
            {!isCandleBlow && (
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 0.5, type: "tween" }}
              >
                <div className="text-4xl">🔥</div>
              </motion.div>
            )}
            {isCandleBlow && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [1, 0], scale: [1, 2] }}
                transition={{ duration: 0.8 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2"
              >
                <div className="text-4xl">💨</div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white text-center mt-8"
          >
            <div className="text-4xl font-bold mb-2">18!</div>
            <div className="text-lg text-white/80">Du bist jetzt erwachsen</div>
          </motion.div>
        </div>
      )}

      {/* PHASE 3: Screen Crack */}
      {isScreenCrack && (
        <div className="flex-1 h-full relative overflow-hidden bg-gradient-to-b from-[#FF6200] to-[#E55800]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 pointer-events-none"
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 375 812">
              <motion.path
                d="M187 0 L200 150 L250 200 L220 300 L280 400 L240 500 L300 600 L260 700 L187 812"
                stroke="white" strokeWidth="4" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.path
                d="M187 300 L100 350 L50 400"
                stroke="white" strokeWidth="3" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              <motion.path
                d="M220 300 L300 280 L350 350"
                stroke="white" strokeWidth="3" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              />
              <motion.path
                d="M240 500 L150 520 L80 600"
                stroke="white" strokeWidth="2" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              />
            </svg>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.4, delay: 0.5 }}
            />
          </motion.div>
        </div>
      )}

      {/* PHASE 4: Transform */}
      {isTransform && (
        <div className="flex-1 h-full relative overflow-hidden">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-30 bg-gradient-to-b from-[#FF6200] to-[#E55800]"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-24 h-24 bg-gradient-to-b from-[#FF6200] to-[#E55800]"
                style={{
                  left: `${(i % 4) * 25}%`,
                  top: `${Math.floor(i / 4) * 33}%`,
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  rotate: Math.random() * 360,
                  opacity: 0,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-black"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.5, type: "tween" }}
                className="text-6xl mb-4"
              >
                ⚡
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white text-xl font-bold"
              >
                Willkommen im Erwachsenen-Modus
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-3"
              >
                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <Sparkles size={14} className="text-yellow-400" />
                  Skills uebertragen • Level 12 • 2.450 XP
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
