import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenHeader, BottomNav } from "@/components/ing/layout";
import { Zap, ArrowRight, Crown, Flame, School, Users } from "lucide-react";

interface SectionProps {
  elapsed: number;
}

// Section elapsed (section starts at demo sec 78, duration 17s):
// 0-2: quiz transition
// 2-4: quiz answers shown, timer counting down
// 4-5: tap C (correct), XP gain
// 5-7: leaderboard
// 7-10: kahoot battle
// 10-14: teacher dashboard overlay
// 14-17: hold + fade

const QUIZ_OPTIONS = [
  { text: "Brutto = nach Steuern", letter: "A" },
  { text: "Netto = vor Steuern", letter: "B" },
  { text: "Brutto = vor Abzügen", letter: "C" },
  { text: "Sie sind gleich", letter: "D" },
];

const LEADERBOARD = [
  { rank: 1, name: "Max", xp: 1580, emoji: "🦊" },
  { rank: 2, name: "Lena", xp: 1350, emoji: "👸" },
  { rank: 3, name: "Sofia ⭐", xp: 1240, emoji: "🦁", isUser: true },
  { rank: 4, name: "Tim", xp: 1100, emoji: "🚀" },
  { rank: 5, name: "Mia", xp: 980, emoji: "🐱" },
];

const KAHOOT_ANSWERS = [
  { label: "A", count: 14, percent: 58, color: "bg-red-500" },
  { label: "B", count: 4, percent: 17, color: "bg-gray-400" },
  { label: "C ✅", count: 6, percent: 25, color: "bg-green-500" },
];

const TEACHER_GRID = [
  ["green", "green", "yellow", "green"],
  ["yellow", "red", "green", "green"],
  ["green", "yellow", "green", "yellow"],
];

export function QuizSection({ elapsed }: SectionProps) {
  const showQuiz = elapsed < 5;
  const showLeaderboard = elapsed >= 5 && elapsed < 7;
  const showKahoot = elapsed >= 7 && elapsed < 14;
  const showTeacherOverlay = elapsed >= 10 && elapsed < 14;
  const answered = elapsed >= 4;
  const timerValue = Math.max(0, 10 - Math.floor(elapsed));

  // Quiz screen
  if (showQuiz) {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-white px-4 py-3 flex items-center justify-between shrink-0">
          <span className="font-bold text-[#333333]">🧠 TÄGLICHES FINANZQUIZ</span>
          <span className="text-sm text-gray-500">⏱️ 0:{timerValue.toString().padStart(2, "0")}</span>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
              <span>Frage 3 von 5</span>
              <span className="text-[#FF6200]">Score: 100</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#FF6200] to-orange-400 h-full rounded-full w-3/5" />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-lg font-bold text-[#333333] mb-6 leading-relaxed">
            Was ist der Unterschied zwischen Brutto und Netto?
          </h2>

          {/* Options */}
          <div className="space-y-3 flex-1">
            {QUIZ_OPTIONS.map((opt, i) => {
              const isC = i === 2;
              const isSelected = answered && isC;
              const isWrong = answered && !isC;
              return (
                <motion.div
                  key={opt.letter}
                  animate={
                    answered && isC ? { scale: [1, 0.95, 1] } : {}
                  }
                  transition={{ duration: 0.25, type: "tween" }}
                  className={`p-4 rounded-xl text-left font-medium border-2 transition-all ${
                    isSelected
                      ? "bg-green-50 border-green-500 text-green-700"
                      : isWrong
                      ? "bg-red-50 border-red-200 text-red-400"
                      : "bg-white border-transparent text-gray-600 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {opt.letter}) {opt.text}
                    </span>
                    {isSelected && <span>✅</span>}
                    {isWrong && answered && <span className="text-red-400">✗</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* XP gain animation */}
          {answered && (
            <motion.div
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -80, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute right-8 top-1/2 text-[#FF6200] font-black text-xl"
            >
              +50 XP
            </motion.div>
          )}

          {/* Confetti dots */}
          {answered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    opacity: 0,
                  }}
                  transition={{ duration: 1 }}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#FF6200" : "#ffffff",
                  }}
                />
              ))}
            </>
          )}
        </div>
        <BottomNav activeTab="learn" onNavigate={() => {}} profile="junior" />
      </div>
    );
  }

  // Leaderboard screen
  if (showLeaderboard) {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden"
      >
        <div className="bg-white px-4 py-3 flex items-center justify-between shrink-0">
          <span className="font-bold text-[#333333]">🏆 FREUNDE-RANGLISTE</span>
          <div className="text-xs text-[#FF6200] font-bold border-b-2 border-[#FF6200] pb-0.5">
            Diese Woche
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {LEADERBOARD.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`bg-white p-3 rounded-xl flex items-center gap-3 ${
                entry.isUser ? "bg-orange-50 border-l-4 border-[#FF6200]" : ""
              }`}
            >
              <span className="text-lg">
                {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `${entry.rank}.`}
              </span>
              <span className="text-xl">{entry.emoji}</span>
              <span className="flex-1 font-bold text-sm text-[#333333]">{entry.name}</span>
              <span className="text-sm font-bold text-gray-600">
                {entry.xp.toLocaleString()} XP
              </span>
            </motion.div>
          ))}

          {/* Badges */}
          <div className="mt-4 bg-white rounded-xl p-3">
            <div className="text-xs font-bold text-gray-500 mb-2">DEINE BADGES:</div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-yellow-100 rounded-full text-xs">🏅 Steuer-Experte</span>
              <span className="px-2 py-1 bg-yellow-100 rounded-full text-xs">🏅 Budget Boss</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-400">🔒 ???</span>
            </div>
          </div>
        </div>
        <BottomNav activeTab="leaderboard" onNavigate={() => {}} profile="junior" />
      </motion.div>
    );
  }

  // Kahoot battle screen
  if (showKahoot) {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden relative"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            <span className="font-bold text-white">LIVE QUIZ BATTLE</span>
          </div>
          <span className="text-white/80 text-xs">Raum: Klasse 9b</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Info */}
          <div className="bg-white rounded-xl p-3 space-y-1">
            <div className="text-sm text-gray-600">👩‍🏫 Lehrerin: Frau Schmidt</div>
            <div className="text-sm text-gray-600">👥 24 Schüler verbunden</div>
            <div className="text-sm text-gray-600">⏱️ Runde 3 von 8</div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#333333] text-center">
              Wie beeinflusst Inflation dein Sparkonto?
            </h3>
          </div>

          {/* Response bars */}
          <div className="space-y-3">
            {KAHOOT_ANSWERS.map((ans, i) => (
              <motion.div
                key={ans.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.3 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm font-bold text-gray-600 w-12">{ans.label}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ans.percent}%` }}
                    transition={{ duration: 1, delay: i * 0.3 }}
                    className={`h-full ${ans.color} rounded-full flex items-center justify-end pr-3`}
                  >
                    <span className="text-white text-xs font-bold">
                      {ans.count} ({ans.percent}%)
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Current leader */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
            <span className="text-sm font-bold text-yellow-700">
              🏆 Aktuell Erste: Sofia — 2.450 Pkt.
            </span>
          </div>
        </div>

        {/* Teacher dashboard overlay */}
        <AnimatePresence>
          {showTeacherOverlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-16 right-3 bg-white rounded-xl shadow-lg p-3 w-40 z-20 border border-gray-200"
            >
              <div className="text-xs font-bold text-gray-700 mb-2">Klassenübersicht</div>
              <div className="grid grid-cols-4 gap-1">
                {TEACHER_GRID.flat().map((color, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded ${
                      color === "green"
                        ? "bg-green-400"
                        : color === "yellow"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-2 text-[8px] text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded" /> Stark
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded" /> Mittel
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-400 rounded" /> Schwach
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav activeTab="learn" onNavigate={() => {}} profile="junior" />
      </motion.div>
    );
  }

  return <div className="flex-1 bg-[#F3F3F3]" />;
}
