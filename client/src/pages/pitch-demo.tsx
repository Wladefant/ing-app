import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { UkrainianSection } from "./pitch-sections/UkrainianSection";
import { AccessibilitySection } from "./pitch-sections/AccessibilitySection";
import { SalaryTaxSection } from "./pitch-sections/SalaryTaxSection";
import { QuizSection } from "./pitch-sections/QuizSection";
import { StockSection } from "./pitch-sections/StockSection";
import { FrictionSection } from "./pitch-sections/FrictionSection";
import { ParentSection } from "./pitch-sections/ParentSection";
import { TrustIdleSection } from "./pitch-sections/TrustIdleSection";
import { BirthdayProSection } from "./pitch-sections/BirthdayProSection";
import { OutroSection } from "./pitch-sections/OutroSection";

const TOTAL_DURATION = 277;

interface SectionDef {
  id: string;
  start: number;
  end: number;
  Component: React.ComponentType<{ elapsed: number }>;
}

const SECTIONS: SectionDef[] = [
  { id: "ukrainian", start: 0, end: 27, Component: UkrainianSection },
  { id: "accessibility", start: 27, end: 56, Component: AccessibilitySection },
  { id: "salary", start: 56, end: 78, Component: SalaryTaxSection },
  { id: "quiz", start: 78, end: 95, Component: QuizSection },
  { id: "stock", start: 95, end: 120, Component: StockSection },
  { id: "friction", start: 120, end: 141, Component: FrictionSection },
  { id: "parent", start: 141, end: 162, Component: ParentSection },
  { id: "trust", start: 162, end: 199, Component: TrustIdleSection },
  { id: "birthday-pro", start: 199, end: 267, Component: BirthdayProSection },
  { id: "outro", start: 267, end: 277, Component: OutroSection },
];

export function PitchDemoVideo() {
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showExtras, setShowExtras] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= TOTAL_DURATION) {
          setIsPlaying(false);
          return prev;
        }
        return +(prev + 0.1).toFixed(1);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeSection = useMemo(() => {
    return SECTIONS.find((s) => elapsed >= s.start && elapsed < s.end) || SECTIONS[SECTIONS.length - 1];
  }, [elapsed]);

  const sectionElapsed = activeSection ? +(elapsed - activeSection.start).toFixed(1) : 0;

  // Dynamic status bar styling
  const isA11yDark = activeSection?.id === "accessibility" && sectionElapsed > 7;
  const isDarkBg =
    activeSection?.id === "trust" ||
    activeSection?.id === "outro" ||
    (activeSection?.id === "birthday-pro" && sectionElapsed < 12);

  const darkStatusBar = isA11yDark || isDarkBg;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const restart = () => {
    setElapsed(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 font-sans bg-white">
      {/* Phone Frame */}
      <div className="w-full max-w-[375px] h-[812px] bg-[#F3F3F3] shadow-2xl overflow-hidden relative flex flex-col rounded-[30px] border-8 border-orange-500">
        {/* Status Bar */}
        <div
          className={`h-8 flex justify-between items-center px-6 text-xs font-medium shrink-0 z-50 transition-colors duration-300 ${
            darkStatusBar ? "bg-black text-white" : "bg-[#F3F3F3] text-gray-500"
          }`}
        >
          <span>09:41</span>
          <div className="flex gap-1.5">
            <div className={`w-4 h-4 rounded-full ${darkStatusBar ? "bg-white/30" : "bg-gray-300/50"}`} />
            <div className={`w-4 h-4 rounded-full ${darkStatusBar ? "bg-white/30" : "bg-gray-300/50"}`} />
            <div className={`w-6 h-3 rounded-sm ${darkStatusBar ? "bg-white/50" : "bg-gray-400/50"}`} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeSection && (
              <motion.div
                key={activeSection.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col"
              >
                <activeSection.Component elapsed={sectionElapsed} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Eye toggle - always visible */}
      <button
        onClick={() => setShowExtras(!showExtras)}
        className="fixed top-4 right-4 z-[100] p-3 bg-black/80 backdrop-blur rounded-full text-white hover:bg-black transition-colors"
        title={showExtras ? "Hide controls (Recording mode)" : "Show controls"}
      >
        {showExtras ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      {/* Controls bar */}
      {showExtras && (
        <div className="fixed bottom-4 right-4 z-[60]">
          <div className="flex gap-2 bg-black/80 backdrop-blur rounded-full px-4 py-2 items-center">
            <button
              onClick={restart}
              className="text-white text-xs font-medium hover:text-[#FF6200] transition-colors px-2"
            >
              ↺ Restart
            </button>
            <div className="w-px h-4 bg-white/30" />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white text-xs font-medium hover:text-[#FF6200] transition-colors px-2"
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <div className="w-px h-4 bg-white/30" />
            <span className="text-white text-xs font-mono px-2">
              {formatTime(elapsed)} / {formatTime(TOTAL_DURATION)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
