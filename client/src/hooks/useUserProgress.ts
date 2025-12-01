import { useState, useEffect, useCallback } from "react";
import {
  UserProgress,
  Badge,
  AddXPResult,
  StreakResult,
  XPSource,
  LevelInfo,
  getUserProgress,
  saveUserProgress,
  addXP as addXPToStorage,
  recordQuizResult as recordQuizResultToStorage,
  updateStreak as updateStreakInStorage,
  recordTrade as recordTradeToStorage,
  recordSavingsGoalCreated as recordSavingsGoalCreatedToStorage,
  recordSavingsGoalCompleted as recordSavingsGoalCompletedToStorage,
  getUserBadges,
  getUnlockedBadges,
  equipBadge as equipBadgeInStorage,
  unequipBadge as unequipBadgeInStorage,
  initializeGamification,
  calculateLevel,
  getXPToNextLevel,
  getStreakMultiplier,
  LEVELS,
  checkAndUnlockBadges,
} from "@/lib/gamification";

export interface UseUserProgressReturn {
  // Progress data
  progress: UserProgress;
  levelInfo: LevelInfo;
  xpProgress: { current: number; required: number; progress: number };
  streakMultiplier: number;
  
  // Badge data
  allBadges: Badge[];
  unlockedBadges: Badge[];
  lockedBadges: Badge[];
  
  // Actions
  addXP: (source: XPSource, customAmount?: number) => AddXPResult;
  recordQuizResult: (
    topic: string,
    difficulty: "easy" | "medium" | "hard",
    score: number,
    total: number
  ) => AddXPResult;
  checkStreak: () => StreakResult;
  recordTrade: () => AddXPResult;
  recordSavingsGoalCreated: () => AddXPResult;
  recordSavingsGoalCompleted: () => AddXPResult;
  equipBadge: (badgeId: string) => boolean;
  unequipBadge: (badgeId: string) => void;
  refreshProgress: () => void;
  
  // State
  isLoading: boolean;
  lastXPGain: AddXPResult | null;
  lastStreakResult: StreakResult | null;
  isNewDay: boolean;
}

export function useUserProgress(): UseUserProgressReturn {
  const [progress, setProgress] = useState<UserProgress>(getUserProgress);
  const [allBadges, setAllBadges] = useState<Badge[]>(getUserBadges);
  const [isLoading, setIsLoading] = useState(true);
  const [lastXPGain, setLastXPGain] = useState<AddXPResult | null>(null);
  const [lastStreakResult, setLastStreakResult] = useState<StreakResult | null>(null);
  const [isNewDay, setIsNewDay] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const init = () => {
      const result = initializeGamification();
      setIsNewDay(result.isNewDay);
      if (result.streakResult) {
        setLastStreakResult(result.streakResult);
      }
      setProgress(getUserProgress());
      setAllBadges(getUserBadges());
      setIsLoading(false);
    };
    
    init();
  }, []);

  // Refresh progress from storage
  const refreshProgress = useCallback(() => {
    setProgress(getUserProgress());
    setAllBadges(getUserBadges());
  }, []);

  // Calculate derived values
  const levelInfo = calculateLevel(progress.totalXP);
  const xpProgress = getXPToNextLevel(progress.totalXP);
  const streakMultiplier = getStreakMultiplier(progress.streak);
  const unlockedBadges = allBadges.filter(b => b.isUnlocked);
  const lockedBadges = allBadges.filter(b => !b.isUnlocked);

  // Add XP
  const addXP = useCallback((source: XPSource, customAmount?: number): AddXPResult => {
    const result = addXPToStorage(source, customAmount);
    setProgress(result.progress);
    setLastXPGain(result);
    setAllBadges(getUserBadges());
    return result;
  }, []);

  // Record quiz result
  const recordQuizResult = useCallback(
    (
      topic: string,
      difficulty: "easy" | "medium" | "hard",
      score: number,
      total: number
    ): AddXPResult => {
      const result = recordQuizResultToStorage(topic, difficulty, score, total);
      setProgress(result.progress);
      setLastXPGain(result);
      setAllBadges(getUserBadges());
      return result;
    },
    []
  );

  // Check and update streak
  const checkStreak = useCallback((): StreakResult => {
    const result = updateStreakInStorage();
    setProgress(getUserProgress());
    setLastStreakResult(result);
    setAllBadges(getUserBadges());
    return result;
  }, []);

  // Record trade
  const recordTrade = useCallback((): AddXPResult => {
    const result = recordTradeToStorage();
    setProgress(result.progress);
    setLastXPGain(result);
    setAllBadges(getUserBadges());
    return result;
  }, []);

  // Record savings goal created
  const recordSavingsGoalCreated = useCallback((): AddXPResult => {
    const result = recordSavingsGoalCreatedToStorage();
    setProgress(result.progress);
    setLastXPGain(result);
    setAllBadges(getUserBadges());
    return result;
  }, []);

  // Record savings goal completed
  const recordSavingsGoalCompleted = useCallback((): AddXPResult => {
    const result = recordSavingsGoalCompletedToStorage();
    setProgress(result.progress);
    setLastXPGain(result);
    setAllBadges(getUserBadges());
    return result;
  }, []);

  // Equip badge
  const equipBadge = useCallback((badgeId: string): boolean => {
    const success = equipBadgeInStorage(badgeId);
    if (success) {
      setProgress(getUserProgress());
    }
    return success;
  }, []);

  // Unequip badge
  const unequipBadge = useCallback((badgeId: string): void => {
    unequipBadgeInStorage(badgeId);
    setProgress(getUserProgress());
  }, []);

  return {
    progress,
    levelInfo,
    xpProgress,
    streakMultiplier,
    allBadges,
    unlockedBadges,
    lockedBadges,
    addXP,
    recordQuizResult,
    checkStreak,
    recordTrade,
    recordSavingsGoalCreated,
    recordSavingsGoalCompleted,
    equipBadge,
    unequipBadge,
    refreshProgress,
    isLoading,
    lastXPGain,
    lastStreakResult,
    isNewDay,
  };
}

// Export convenience hooks for specific use cases
export function useXPDisplay() {
  const { progress, levelInfo, xpProgress, streakMultiplier } = useUserProgress();
  
  return {
    totalXP: progress.totalXP,
    weeklyXP: progress.weeklyXP,
    level: levelInfo.level,
    levelTitle: levelInfo.title,
    levelIcon: levelInfo.icon,
    xpCurrent: xpProgress.current,
    xpRequired: xpProgress.required,
    xpPercentage: xpProgress.progress,
    streak: progress.streak,
    streakMultiplier,
  };
}

export function useStreak() {
  const { progress, checkStreak, lastStreakResult, isNewDay } = useUserProgress();
  
  return {
    streak: progress.streak,
    longestStreak: progress.longestStreak,
    checkStreak,
    lastStreakResult,
    isNewDay,
  };
}

export function useBadges() {
  const { allBadges, unlockedBadges, lockedBadges, equipBadge, unequipBadge, progress } = useUserProgress();
  
  return {
    allBadges,
    unlockedBadges,
    lockedBadges,
    equippedBadges: progress.equippedBadges,
    equipBadge,
    unequipBadge,
    totalBadges: allBadges.length,
    unlockedCount: unlockedBadges.length,
  };
}

export function useQuizProgress() {
  const { progress, recordQuizResult, lastXPGain } = useUserProgress();
  
  return {
    totalQuizzes: progress.quizHistory.length,
    totalCorrect: progress.totalQuizCorrect,
    totalPlayed: progress.totalQuizPlayed,
    averageScore: progress.totalQuizPlayed > 0 
      ? Math.round((progress.totalQuizCorrect / progress.totalQuizPlayed) * 100)
      : 0,
    perfectQuizzes: progress.quizHistory.filter(q => q.isPerfect).length,
    recordQuizResult,
    lastXPGain,
  };
}
