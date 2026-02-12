import { motion, AnimatePresence } from "framer-motion";
import { User, GraduationCap } from "lucide-react";

interface ProfileSwitcherProps {
  currentProfile: "junior" | "adult";
  onSwitch: (profile: "junior" | "adult") => void;
}

export function ProfileSwitcherBar({ currentProfile, onSwitch }: ProfileSwitcherProps) {
  return (
    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[60]">
      <div className="bg-black/70 backdrop-blur-md rounded-full p-1 flex gap-1 shadow-lg border border-white/10">
        <button
          onClick={() => onSwitch("junior")}
          className="relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200"
        >
          {currentProfile === "junior" && (
            <motion.div
              layoutId="profile-pill"
              className="absolute inset-0 bg-[#00C4CC] rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative z-10 flex items-center gap-1.5 ${currentProfile === "junior" ? "text-white" : "text-white/50"}`}>
            <GraduationCap size={12} />
            Junior
          </span>
        </button>
        <button
          onClick={() => onSwitch("adult")}
          className="relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200"
        >
          {currentProfile === "adult" && (
            <motion.div
              layoutId="profile-pill"
              className="absolute inset-0 bg-[#FF6200] rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative z-10 flex items-center gap-1.5 ${currentProfile === "adult" ? "text-white" : "text-white/50"}`}>
            <User size={12} />
            Erwachsen
          </span>
        </button>
      </div>
    </div>
  );
}
