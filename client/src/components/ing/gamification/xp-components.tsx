/**
 * XP Progress Bar Component
 * Displays user's XP progress towards the next level
 */

import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPProgressBarProps {
  currentXP: number;
  requiredXP: number;
  percentage: number;
  level: number;
  levelTitle: string;
  levelIcon: string;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function XPProgressBar({
  currentXP,
  requiredXP,
  percentage,
  level,
  levelTitle,
  levelIcon,
  showDetails = true,
  size = "md",
  className,
}: XPProgressBarProps) {
  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{levelIcon}</span>
            <div>
              <div className="text-sm font-bold text-gray-900">Level {level}</div>
              <div className="text-xs text-gray-500">{levelTitle}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-[#FF6200]">{currentXP} XP</div>
            <div className="text-xs text-gray-500">von {requiredXP} XP</div>
          </div>
        </div>
      )}
      
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", heights[size])}>
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF6200] to-[#FF8534] rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {percentage > 20 && (
            <motion.div
              className="absolute right-1 top-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {showDetails && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{percentage}%</span>
          <span className="text-xs text-gray-400">
            {requiredXP - currentXP} XP bis Level {level + 1}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact XP display for headers
 */
interface XPBadgeProps {
  xp: number;
  className?: string;
}

export function XPBadge({ xp, className }: XPBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#FF6200] to-[#FF8534] rounded-full",
      className
    )}>
      <Zap className="w-3 h-3 text-white" />
      <span className="text-xs font-bold text-white">{xp} XP</span>
    </div>
  );
}

/**
 * Level Badge Component
 */
interface LevelBadgeProps {
  level: number;
  title: string;
  icon: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LevelBadge({ level, title, icon, size = "md", className }: LevelBadgeProps) {
  const sizes = {
    sm: "text-lg p-1",
    md: "text-2xl p-2",
    lg: "text-3xl p-3",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "bg-gradient-to-br from-[#FF6200] to-[#FF8534] rounded-full flex items-center justify-center",
        sizes[size]
      )}>
        <span>{icon}</span>
      </div>
      <div>
        <div className={cn("font-bold text-gray-900", textSizes[size])}>Level {level}</div>
        <div className={cn("text-gray-500", size === "sm" ? "text-[10px]" : "text-xs")}>{title}</div>
      </div>
    </div>
  );
}

/**
 * Streak Counter Component
 */
interface StreakCounterProps {
  streak: number;
  longestStreak?: number;
  showLongest?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakCounter({
  streak,
  longestStreak,
  showLongest = false,
  size = "md",
  className,
}: StreakCounterProps) {
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const isOnFire = streak >= 7;

  return (
    <motion.div
      className={cn("flex items-center gap-2", className)}
      animate={isOnFire ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <div className={cn(
        "flex items-center justify-center rounded-full p-1.5",
        isOnFire ? "bg-orange-100" : "bg-gray-100"
      )}>
        <span className={cn(iconSizes[size], "flex items-center justify-center")}>
          {isOnFire ? "🔥" : "📅"}
        </span>
      </div>
      <div>
        <div className={cn("font-bold", textSizes[size], isOnFire ? "text-orange-600" : "text-gray-900")}>
          {streak} {streak === 1 ? "Tag" : "Tage"}
        </div>
        {showLongest && longestStreak && longestStreak > streak && (
          <div className="text-xs text-gray-500">
            Bester: {longestStreak} Tage
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * XP Gain Animation/Toast
 */
interface XPGainToastProps {
  amount: number;
  source: string;
  bonusAmount?: number;
  isLevelUp?: boolean;
  newLevel?: number;
  onClose?: () => void;
}

export function XPGainToast({
  amount,
  source,
  bonusAmount,
  isLevelUp,
  newLevel,
  onClose,
}: XPGainToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[200px]">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6200] to-[#FF8534] flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <motion.div
              className="text-2xl font-bold text-[#FF6200]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              +{amount} XP
            </motion.div>
            <div className="text-sm text-gray-600">{source}</div>
            {bonusAmount && bonusAmount > 0 && (
              <div className="text-xs text-green-600 font-medium">
                +{bonusAmount} Streak-Bonus
              </div>
            )}
          </div>
        </div>
        
        {isLevelUp && newLevel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-gray-100 text-center"
          >
            <div className="text-lg font-bold text-[#FF6200]">
              🎉 Level Up!
            </div>
            <div className="text-sm text-gray-600">
              Du bist jetzt Level {newLevel}!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Level Up Animation Overlay
 */
interface LevelUpAnimationProps {
  newLevel: number;
  levelTitle: string;
  levelIcon: string;
  onComplete?: () => void;
}

export function LevelUpAnimation({
  newLevel,
  levelTitle,
  levelIcon,
  onComplete,
}: LevelUpAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-7xl mb-4"
        >
          {levelIcon}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-3xl font-bold text-[#FF6200] mb-2">
            Level {newLevel}!
          </div>
          <div className="text-lg text-gray-600 mb-4">{levelTitle}</div>
          <div className="text-sm text-gray-500">
            Tippe um fortzufahren
          </div>
        </motion.div>
        
        {/* Confetti-like particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: i % 2 === 0 ? "#FF6200" : "#FFD700",
              left: "50%",
              top: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * 150,
              y: Math.sin((i * 30 * Math.PI) / 180) * 150,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/**
 * Achievement/Badge Unlock Animation
 */
interface BadgeUnlockToastProps {
  badgeName: string;
  badgeIcon: string;
  badgeDescription: string;
  xpBonus: number;
  onClose?: () => void;
}

export function BadgeUnlockToast({
  badgeName,
  badgeIcon,
  badgeDescription,
  xpBonus,
  onClose,
}: BadgeUnlockToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.5 }}
      onClick={onClose}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-gradient-to-br from-[#FF6200] to-[#FF8534] rounded-2xl p-1">
        <div className="bg-white rounded-xl p-4 min-w-[280px]">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center text-3xl shadow-lg"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5 }}
            >
              {badgeIcon}
            </motion.div>
            <div>
              <div className="text-xs text-[#FF6200] font-bold uppercase tracking-wide">
                Neuer Badge!
              </div>
              <div className="text-lg font-bold text-gray-900">{badgeName}</div>
              <div className="text-sm text-gray-600">{badgeDescription}</div>
              <div className="text-xs text-green-600 font-medium mt-1">
                +{xpBonus} XP Bonus
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Compact Weekly XP Progress
 */
interface WeeklyXPProgressProps {
  weeklyXP: number;
  rank: number;
  className?: string;
}

export function WeeklyXPProgress({ weeklyXP, rank, className }: WeeklyXPProgressProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 bg-gradient-to-r from-[#FF6200]/10 to-[#FF8534]/10 rounded-xl",
      className
    )}>
      <div className="flex items-center gap-2">
        <span className="text-xl">📊</span>
        <div>
          <div className="text-sm font-bold text-gray-900">{weeklyXP} XP</div>
          <div className="text-xs text-gray-500">Diese Woche</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl">🏆</span>
        <div>
          <div className="text-sm font-bold text-gray-900">#{rank}</div>
          <div className="text-xs text-gray-500">Rang</div>
        </div>
      </div>
    </div>
  );
}
