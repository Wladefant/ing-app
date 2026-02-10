import { motion } from "framer-motion";

interface SectionProps {
  elapsed: number;
}

// Section elapsed (starts at demo sec 267, duration 10s):
// 0-2: fade to black
// 2-4: QR code appears with pulsing orange ring
// 4-6: "Scan the code" text appears
// 6-8: "Start the simulation" text appears
// 8-10: hold, gentle pulse on QR

export function OutroSection({ elapsed }: SectionProps) {
  const showQR = elapsed >= 2;
  const showScanText = elapsed >= 4;
  const showSimText = elapsed >= 6;
  const pulseQR = elapsed >= 8;

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

      <div className="relative z-10 flex flex-col items-center px-8">
        {/* QR Code placeholder */}
        {showQR && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative mb-8"
          >
            {/* Pulsing orange ring */}
            <motion.div
              animate={pulseQR ? {
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 0 0 rgba(255,98,0,0.4)",
                  "0 0 0 12px rgba(255,98,0,0)",
                  "0 0 0 0 rgba(255,98,0,0.4)"
                ]
              } : {}}
              transition={{ repeat: Infinity, duration: 2, type: "tween" }}
              className="w-48 h-48 rounded-2xl border-4 border-[#FF6200] flex items-center justify-center bg-white p-4"
            >
              {/* QR Code visual (simplified grid pattern) */}
              <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-0.5">
                {Array.from({ length: 49 }).map((_, i) => {
                  // Generate a QR-like pattern
                  const row = Math.floor(i / 7);
                  const col = i % 7;
                  const isCornerBlock = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
                  const isCenter = row === 3 && col === 3;
                  const isRandom = [5, 8, 12, 15, 19, 22, 26, 29, 33, 36, 40, 43, 47].includes(i);
                  const isFilled = isCornerBlock || isCenter || isRandom;

                  return (
                    <div
                      key={i}
                      className={`rounded-[1px] ${isFilled ? "bg-black" : "bg-white"}`}
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* ING logo under QR */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF6200] text-white text-[10px] font-black px-3 py-1 rounded-full"
            >
              ING LEO
            </motion.div>
          </motion.div>
        )}

        {/* Scan text */}
        {showScanText && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-xl font-bold text-center mb-2"
          >
            Scan the code
          </motion.p>
        )}

        {/* Simulation text */}
        {showSimText && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#FF6200] text-lg font-medium text-center"
          >
            Start the simulation
          </motion.p>
        )}

        {/* Bottom text */}
        {showSimText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 text-xs">LEO — Dein Finanzassistent</p>
            <p className="text-gray-700 text-[10px] mt-1">Powered by ING</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
