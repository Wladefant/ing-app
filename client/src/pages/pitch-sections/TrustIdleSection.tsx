import { motion } from "framer-motion";
import lionIcon from "@/assets/lion-logo.png";

interface SectionProps {
  elapsed: number;
}

// Section elapsed (starts at demo sec 162, duration 37s):
// This is a simple trust/idle screen that holds for ~35 seconds.
// Orange gradient background, breathing lion icon, "Leo wartet..." text.
// 0-2: fade in
// 2-35: breathing animation on lion
// 35-37: fade starts (handled by master component exit animation)

export function TrustIdleSection({ elapsed }: SectionProps) {
  const breathScale = 1 + Math.sin(elapsed * 1.2) * 0.05;
  const showSubtitle = elapsed > 3;
  const showDots = elapsed > 5;

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#FF6200] via-[#FF8F00] to-[#E55800] relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ repeat: Infinity, duration: 6, type: "tween" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ repeat: Infinity, duration: 8, delay: 2, type: "tween" }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full translate-x-1/2 translate-y-1/2"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Lion icon with breathing animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: breathScale, opacity: 1 }}
          transition={{ type: "spring", duration: 1 }}
          className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl mb-8 border-2 border-white/30"
        >
          <img src={lionIcon} alt="Leo" className="w-24 h-24 object-contain drop-shadow-lg" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-white text-3xl font-black tracking-wider mb-3"
        >
          LEO
        </motion.h1>

        {/* Subtitle */}
        {showSubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-white/80 text-lg font-medium"
          >
            Leo wartet...
          </motion.p>
        )}

        {/* Breathing dots */}
        {showDots && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 mt-8"
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white/40 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.4,
                  ease: "easeInOut",
                  type: "tween",
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Timer indicator (subtle) */}
        {elapsed > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="mt-12 text-white/40 text-xs font-mono"
          >
            Trust builds with patience
          </motion.div>
        )}
      </div>
    </div>
  );
}
