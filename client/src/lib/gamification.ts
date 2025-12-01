/**
 * Gamification System for ING LEO App
 * Provides XP tracking, levels, badges, streaks, and achievements
 */

// ============ TYPES ============

export interface UserProgress {
  totalXP: number;
  weeklyXP: number;
  monthlyXP: number;
  level: number;
  streak: number;
  longestStreak: number;
  badges: string[];
  equippedBadges: string[]; // max 3
  lastLoginDate: string;
  lastActivityDate: string;
  quizHistory: QuizResult[];
  totalQuizCorrect: number;
  totalQuizPlayed: number;
  tradesCount: number;
  savingsGoalsCompleted: number;
}

export interface QuizResult {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  total: number;
  xpEarned: number;
  timestamp: string;
  isPerfect: boolean;
}

export interface LevelInfo {
  level: number;
  xp: number;
  title: string;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "learning" | "trading" | "streak" | "savings" | "competition";
  requirement: string;
  xpBonus: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface XPEvent {
  type: XPSource;
  amount: number;
  multiplier: number;
  timestamp: string;
  description: string;
}

// ============ XP SOURCES ============

export type XPSource =
  | "daily_login"
  | "streak_bonus_7"
  | "streak_bonus_30"
  | "quiz_easy"
  | "quiz_medium"
  | "quiz_hard"
  | "quiz_perfect"
  | "first_trade"
  | "virtual_trade"
  | "learning_module"
  | "learning_video"
  | "news_article"
  | "watchlist_add"
  | "savings_goal_created"
  | "savings_goal_completed"
  | "weekly_challenge_won"
  | "daily_challenge"
  | "friend_referral";

export const XP_VALUES: Record<XPSource, number> = {
  daily_login: 10,
  streak_bonus_7: 50,
  streak_bonus_30: 200,
  quiz_easy: 25,
  quiz_medium: 50,
  quiz_hard: 100,
  quiz_perfect: 50, // Bonus on top of quiz XP
  first_trade: 100,
  virtual_trade: 20,
  learning_module: 75,
  learning_video: 20,
  news_article: 10,
  watchlist_add: 15,
  savings_goal_created: 25,
  savings_goal_completed: 100,
  weekly_challenge_won: 500,
  daily_challenge: 50,
  friend_referral: 200,
};

// Daily limits for certain activities
export const DAILY_LIMITS: Partial<Record<XPSource, number>> = {
  learning_video: 5,
  news_article: 10,
  watchlist_add: 10,
  virtual_trade: 5,
};

// ============ LEVEL SYSTEM ============

export const LEVELS: LevelInfo[] = [
  { level: 1, xp: 0, title: "Finanz-Anfänger", icon: "🌱" },
  { level: 2, xp: 500, title: "Geld-Lerner", icon: "📚" },
  { level: 3, xp: 1200, title: "Spar-Fuchs", icon: "🦊" },
  { level: 4, xp: 2500, title: "Budget-Held", icon: "🦸" },
  { level: 5, xp: 5000, title: "Finanz-Entdecker", icon: "🔍" },
  { level: 6, xp: 8500, title: "Aktien-Kenner", icon: "📈" },
  { level: 7, xp: 13000, title: "Portfolio-Profi", icon: "💼" },
  { level: 8, xp: 20000, title: "Investment-Guru", icon: "🧙" },
  { level: 9, xp: 30000, title: "Finanz-Meister", icon: "🏆" },
  { level: 10, xp: 50000, title: "Leos Champion", icon: "👑" },
];

// ============ BADGES ============

export const ALL_BADGES: Badge[] = [
  // Learning Badges
  {
    id: "quiz_newbie",
    name: "Quiz Neuling",
    description: "Erstes Quiz abgeschlossen",
    icon: "🎯",
    category: "learning",
    requirement: "Erstes Quiz abschließen",
    xpBonus: 25,
    isUnlocked: false,
  },
  {
    id: "quiz_regular",
    name: "Quiz-Stammgast",
    description: "10 Quizze abgeschlossen",
    icon: "🔥",
    category: "learning",
    requirement: "10 Quizze abschließen",
    xpBonus: 100,
    isUnlocked: false,
  },
  {
    id: "quiz_master",
    name: "Quiz-Meister",
    description: "50 Quizze abgeschlossen",
    icon: "🏆",
    category: "learning",
    requirement: "50 Quizze abschließen",
    xpBonus: 500,
    isUnlocked: false,
  },
  {
    id: "perfect_10",
    name: "Perfekte 10",
    description: "10 perfekte Quiz-Ergebnisse",
    icon: "⭐",
    category: "learning",
    requirement: "10 Quizze mit 100% abschließen",
    xpBonus: 250,
    isUnlocked: false,
  },
  {
    id: "knowledge_seeker",
    name: "Wissensdurst",
    description: "3 Lernmodule abgeschlossen",
    icon: "📚",
    category: "learning",
    requirement: "3 Lernmodule abschließen",
    xpBonus: 150,
    isUnlocked: false,
  },
  {
    id: "all_knowing",
    name: "Allwissend",
    description: "90%+ Durchschnitt über alle Quizze",
    icon: "🧠",
    category: "learning",
    requirement: "90%+ Durchschnitt erreichen",
    xpBonus: 1000,
    isUnlocked: false,
  },
  // Trading Badges
  {
    id: "first_trade",
    name: "Erster Trade",
    description: "Ersten virtuellen Trade ausgeführt",
    icon: "📈",
    category: "trading",
    requirement: "Ersten Trade ausführen",
    xpBonus: 50,
    isUnlocked: false,
  },
  {
    id: "active_trader",
    name: "Aktiver Trader",
    description: "50 Trades ausgeführt",
    icon: "💹",
    category: "trading",
    requirement: "50 Trades ausführen",
    xpBonus: 300,
    isUnlocked: false,
  },
  {
    id: "diversifier",
    name: "Diversifizierer",
    description: "5 verschiedene Aktien besitzen",
    icon: "🎯",
    category: "trading",
    requirement: "5 verschiedene Aktien kaufen",
    xpBonus: 150,
    isUnlocked: false,
  },
  {
    id: "diamond_hands",
    name: "Diamant Hände",
    description: "Durch 20% Rückgang gehalten",
    icon: "💎",
    category: "trading",
    requirement: "Bei Rückgang nicht verkaufen",
    xpBonus: 300,
    isUnlocked: false,
  },
  // Streak Badges
  {
    id: "week_warrior",
    name: "Wochen-Krieger",
    description: "7-Tage Streak",
    icon: "🔥",
    category: "streak",
    requirement: "7 Tage in Folge aktiv",
    xpBonus: 75,
    isUnlocked: false,
  },
  {
    id: "two_week_fighter",
    name: "Zwei-Wochen-Kämpfer",
    description: "14-Tage Streak",
    icon: "⚔️",
    category: "streak",
    requirement: "14 Tage in Folge aktiv",
    xpBonus: 150,
    isUnlocked: false,
  },
  {
    id: "month_master",
    name: "Monats-Meister",
    description: "30-Tage Streak",
    icon: "🌟",
    category: "streak",
    requirement: "30 Tage in Folge aktiv",
    xpBonus: 400,
    isUnlocked: false,
  },
  {
    id: "quarter_champion",
    name: "Quartals-Champion",
    description: "90-Tage Streak",
    icon: "🎖️",
    category: "streak",
    requirement: "90 Tage in Folge aktiv",
    xpBonus: 1000,
    isUnlocked: false,
  },
  // Savings Badges
  {
    id: "first_goal",
    name: "Erstes Ziel",
    description: "Erstes Sparziel gesetzt",
    icon: "🎯",
    category: "savings",
    requirement: "Erstes Sparziel erstellen",
    xpBonus: 25,
    isUnlocked: false,
  },
  {
    id: "goal_achiever",
    name: "Ziel-Erreicher",
    description: "Erstes Sparziel erreicht",
    icon: "✅",
    category: "savings",
    requirement: "Erstes Sparziel erreichen",
    xpBonus: 100,
    isUnlocked: false,
  },
  {
    id: "serial_saver",
    name: "Serien-Sparer",
    description: "5 Sparziele erreicht",
    icon: "💰",
    category: "savings",
    requirement: "5 Sparziele erreichen",
    xpBonus: 300,
    isUnlocked: false,
  },
  {
    id: "money_mountain",
    name: "Geld-Berg",
    description: "€5.000 insgesamt gespart",
    icon: "🏔️",
    category: "savings",
    requirement: "5000€ sparen",
    xpBonus: 500,
    isUnlocked: false,
  },
  // Competition Badges
  {
    id: "top_100",
    name: "Top 100",
    description: "In wöchentlicher Top 100 platziert",
    icon: "🏅",
    category: "competition",
    requirement: "Top 100 erreichen",
    xpBonus: 50,
    isUnlocked: false,
  },
  {
    id: "top_10",
    name: "Top 10",
    description: "In wöchentlicher Top 10 platziert",
    icon: "🥇",
    category: "competition",
    requirement: "Top 10 erreichen",
    xpBonus: 200,
    isUnlocked: false,
  },
  {
    id: "weekly_champion",
    name: "Wochen-Champion",
    description: "#1 für die Woche",
    icon: "👑",
    category: "competition",
    requirement: "Platz 1 erreichen",
    xpBonus: 500,
    isUnlocked: false,
  },
  {
    id: "class_leader",
    name: "Klassen-Anführer",
    description: "#1 in Schul-Rangliste",
    icon: "🎓",
    category: "competition",
    requirement: "Platz 1 in Schule",
    xpBonus: 300,
    isUnlocked: false,
  },
];

// ============ STORAGE ============

const STORAGE_KEY = "leo_gamification_progress";

export function getDefaultProgress(): UserProgress {
  return {
    totalXP: 0,
    weeklyXP: 0,
    monthlyXP: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    badges: [],
    equippedBadges: [],
    lastLoginDate: "",
    lastActivityDate: "",
    quizHistory: [],
    totalQuizCorrect: 0,
    totalQuizPlayed: 0,
    tradesCount: 0,
    savingsGoalsCompleted: 0,
  };
}

export function getUserProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...getDefaultProgress(), ...parsed };
    }
  } catch (error) {
    console.error("Error reading gamification progress:", error);
  }
  return getDefaultProgress();
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving gamification progress:", error);
  }
}

// ============ STREAK MULTIPLIERS ============

export function getStreakMultiplier(streak: number): number {
  if (streak >= 60) return 2.5;
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.75;
  if (streak >= 7) return 1.5;
  return 1.0;
}

export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function getWeekendMultiplier(): number {
  return isWeekend() ? 1.25 : 1.0;
}

// ============ LEVEL CALCULATIONS ============

export function calculateLevel(xp: number): LevelInfo {
  let currentLevel = LEVELS[0];
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) {
      currentLevel = LEVELS[i];
      break;
    }
  }
  
  return currentLevel;
}

export function getXPToNextLevel(xp: number): { current: number; required: number; progress: number } {
  const currentLevel = calculateLevel(xp);
  const currentLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  const nextLevel = LEVELS[currentLevelIndex + 1];
  
  if (!nextLevel) {
    // Max level reached
    return { current: xp, required: xp, progress: 100 };
  }
  
  const xpInCurrentLevel = xp - currentLevel.xp;
  const xpNeededForNext = nextLevel.xp - currentLevel.xp;
  const progress = Math.floor((xpInCurrentLevel / xpNeededForNext) * 100);
  
  return {
    current: xpInCurrentLevel,
    required: xpNeededForNext,
    progress: Math.min(progress, 100),
  };
}

// ============ XP OPERATIONS ============

export interface AddXPResult {
  progress: UserProgress;
  xpGained: number;
  levelUp: boolean;
  newLevel: number | null;
  badgesUnlocked: Badge[];
  streakBonus: number;
}

export function addXP(
  source: XPSource,
  customAmount?: number
): AddXPResult {
  const progress = getUserProgress();
  const baseAmount = customAmount ?? XP_VALUES[source];
  
  // Calculate multipliers
  const streakMultiplier = getStreakMultiplier(progress.streak);
  const weekendMultiplier = getWeekendMultiplier();
  const totalMultiplier = streakMultiplier * weekendMultiplier;
  
  // Calculate final XP
  const streakBonus = Math.floor(baseAmount * (totalMultiplier - 1));
  const xpGained = Math.floor(baseAmount * totalMultiplier);
  
  // Update XP values
  const oldLevel = progress.level;
  progress.totalXP += xpGained;
  progress.weeklyXP += xpGained;
  progress.monthlyXP += xpGained;
  progress.lastActivityDate = new Date().toISOString().split("T")[0];
  
  // Calculate new level
  const newLevelInfo = calculateLevel(progress.totalXP);
  progress.level = newLevelInfo.level;
  const levelUp = newLevelInfo.level > oldLevel;
  
  // Check for new badges
  const badgesUnlocked = checkAndUnlockBadges(progress);
  
  // Save progress
  saveUserProgress(progress);
  
  return {
    progress,
    xpGained,
    levelUp,
    newLevel: levelUp ? newLevelInfo.level : null,
    badgesUnlocked,
    streakBonus,
  };
}

// ============ QUIZ XP ============

export function calculateQuizXP(
  correctAnswers: number,
  totalQuestions: number,
  difficulty: "easy" | "medium" | "hard"
): { baseXP: number; perfectBonus: number; total: number } {
  const xpPerQuestion: Record<string, number> = {
    easy: 5,
    medium: 10,
    hard: 20,
  };
  
  const baseXP = correctAnswers * xpPerQuestion[difficulty];
  const isPerfect = correctAnswers === totalQuestions;
  const perfectBonus = isPerfect ? XP_VALUES.quiz_perfect : 0;
  
  return {
    baseXP,
    perfectBonus,
    total: baseXP + perfectBonus,
  };
}

export function recordQuizResult(
  topic: string,
  difficulty: "easy" | "medium" | "hard",
  score: number,
  total: number
): AddXPResult {
  const progress = getUserProgress();
  const isPerfect = score === total;
  
  // Calculate XP
  const xpCalc = calculateQuizXP(score, total, difficulty);
  
  // Record quiz result
  const quizResult: QuizResult = {
    id: `quiz-${Date.now()}`,
    topic,
    difficulty,
    score,
    total,
    xpEarned: xpCalc.total,
    timestamp: new Date().toISOString(),
    isPerfect,
  };
  
  progress.quizHistory.push(quizResult);
  progress.totalQuizCorrect += score;
  progress.totalQuizPlayed += total;
  
  // Save before adding XP (so badge checks have updated quiz stats)
  saveUserProgress(progress);
  
  // Add XP
  const quizType: XPSource = `quiz_${difficulty}` as XPSource;
  return addXP(quizType, xpCalc.total);
}

// ============ STREAK MANAGEMENT ============

export interface StreakResult {
  streakIncreased: boolean;
  newStreak: number;
  streakBroken: boolean;
  xpBonus: number;
  badgeUnlocked: Badge | null;
}

export function updateStreak(): StreakResult {
  const progress = getUserProgress();
  const today = new Date().toISOString().split("T")[0];
  const lastLogin = progress.lastLoginDate;
  
  let streakIncreased = false;
  let streakBroken = false;
  let xpBonus = 0;
  let badgeUnlocked: Badge | null = null;
  
  if (lastLogin !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    if (lastLogin === yesterdayStr || lastLogin === "") {
      // Continue or start streak
      progress.streak++;
      streakIncreased = true;
      
      // Check for streak milestones
      if (progress.streak === 7) {
        xpBonus = XP_VALUES.streak_bonus_7;
        progress.totalXP += xpBonus;
        progress.weeklyXP += xpBonus;
      } else if (progress.streak === 30) {
        xpBonus = XP_VALUES.streak_bonus_30;
        progress.totalXP += xpBonus;
        progress.weeklyXP += xpBonus;
      }
      
      // Update longest streak
      if (progress.streak > progress.longestStreak) {
        progress.longestStreak = progress.streak;
      }
    } else if (lastLogin && lastLogin !== today) {
      // Streak broken
      progress.streak = 1;
      streakBroken = true;
    }
    
    progress.lastLoginDate = today;
    
    // Add daily login XP
    progress.totalXP += XP_VALUES.daily_login;
    progress.weeklyXP += XP_VALUES.daily_login;
    
    saveUserProgress(progress);
    
    // Check for streak badges
    const badges = checkAndUnlockBadges(progress);
    badgeUnlocked = badges.find(b => b.category === "streak") || null;
  }
  
  return {
    streakIncreased,
    newStreak: progress.streak,
    streakBroken,
    xpBonus: xpBonus + XP_VALUES.daily_login,
    badgeUnlocked,
  };
}

// ============ BADGE MANAGEMENT ============

export function checkAndUnlockBadges(progress: UserProgress): Badge[] {
  const newBadges: Badge[] = [];
  const now = new Date().toISOString();
  
  // Quiz badges
  const quizCount = progress.quizHistory.length;
  const perfectQuizCount = progress.quizHistory.filter(q => q.isPerfect).length;
  const avgScore = progress.totalQuizPlayed > 0 
    ? (progress.totalQuizCorrect / progress.totalQuizPlayed) * 100 
    : 0;
  
  const badgeChecks: { id: string; condition: boolean }[] = [
    { id: "quiz_newbie", condition: quizCount >= 1 },
    { id: "quiz_regular", condition: quizCount >= 10 },
    { id: "quiz_master", condition: quizCount >= 50 },
    { id: "perfect_10", condition: perfectQuizCount >= 10 },
    { id: "all_knowing", condition: avgScore >= 90 && quizCount >= 10 },
    { id: "first_trade", condition: progress.tradesCount >= 1 },
    { id: "active_trader", condition: progress.tradesCount >= 50 },
    { id: "week_warrior", condition: progress.streak >= 7 },
    { id: "two_week_fighter", condition: progress.streak >= 14 },
    { id: "month_master", condition: progress.streak >= 30 },
    { id: "quarter_champion", condition: progress.streak >= 90 },
    { id: "goal_achiever", condition: progress.savingsGoalsCompleted >= 1 },
    { id: "serial_saver", condition: progress.savingsGoalsCompleted >= 5 },
  ];
  
  for (const check of badgeChecks) {
    if (check.condition && !progress.badges.includes(check.id)) {
      progress.badges.push(check.id);
      const badge = ALL_BADGES.find(b => b.id === check.id);
      if (badge) {
        const unlockedBadge = { ...badge, isUnlocked: true, unlockedAt: now };
        newBadges.push(unlockedBadge);
        // Award badge XP bonus
        progress.totalXP += badge.xpBonus;
        progress.weeklyXP += badge.xpBonus;
      }
    }
  }
  
  if (newBadges.length > 0) {
    saveUserProgress(progress);
  }
  
  return newBadges;
}

export function getUserBadges(): Badge[] {
  const progress = getUserProgress();
  return ALL_BADGES.map(badge => ({
    ...badge,
    isUnlocked: progress.badges.includes(badge.id),
  }));
}

export function getUnlockedBadges(): Badge[] {
  const progress = getUserProgress();
  return ALL_BADGES
    .filter(badge => progress.badges.includes(badge.id))
    .map(badge => ({ ...badge, isUnlocked: true }));
}

export function getEquippedBadges(): Badge[] {
  const progress = getUserProgress();
  return ALL_BADGES
    .filter(badge => progress.equippedBadges.includes(badge.id))
    .map(badge => ({ ...badge, isUnlocked: true }));
}

export function equipBadge(badgeId: string): boolean {
  const progress = getUserProgress();
  
  if (!progress.badges.includes(badgeId)) {
    return false; // Badge not unlocked
  }
  
  if (progress.equippedBadges.includes(badgeId)) {
    return true; // Already equipped
  }
  
  if (progress.equippedBadges.length >= 3) {
    // Remove oldest equipped badge
    progress.equippedBadges.shift();
  }
  
  progress.equippedBadges.push(badgeId);
  saveUserProgress(progress);
  return true;
}

export function unequipBadge(badgeId: string): void {
  const progress = getUserProgress();
  progress.equippedBadges = progress.equippedBadges.filter(id => id !== badgeId);
  saveUserProgress(progress);
}

// ============ TRADING TRACKING ============

export function recordTrade(): AddXPResult {
  const progress = getUserProgress();
  const isFirstTrade = progress.tradesCount === 0;
  
  progress.tradesCount++;
  saveUserProgress(progress);
  
  if (isFirstTrade) {
    return addXP("first_trade");
  }
  return addXP("virtual_trade");
}

// ============ SAVINGS TRACKING ============

export function recordSavingsGoalCreated(): AddXPResult {
  const progress = getUserProgress();
  
  // Check for first goal badge
  if (!progress.badges.includes("first_goal")) {
    progress.badges.push("first_goal");
    const badge = ALL_BADGES.find(b => b.id === "first_goal");
    if (badge) {
      progress.totalXP += badge.xpBonus;
    }
  }
  
  saveUserProgress(progress);
  return addXP("savings_goal_created");
}

export function recordSavingsGoalCompleted(): AddXPResult {
  const progress = getUserProgress();
  progress.savingsGoalsCompleted++;
  saveUserProgress(progress);
  return addXP("savings_goal_completed");
}

// ============ WEEKLY RESET ============

export function checkWeeklyReset(): boolean {
  const progress = getUserProgress();
  const now = new Date();
  const lastActivity = progress.lastActivityDate ? new Date(progress.lastActivityDate) : null;
  
  if (!lastActivity) return false;
  
  // Check if we're in a new week (week starts Sunday)
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  const currentWeek = getWeekNumber(now);
  const lastWeek = getWeekNumber(lastActivity);
  
  if (currentWeek !== lastWeek || now.getFullYear() !== lastActivity.getFullYear()) {
    progress.weeklyXP = 0;
    saveUserProgress(progress);
    return true;
  }
  
  return false;
}

// ============ RESET PROGRESS (FOR TESTING) ============

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ============ INITIALIZE ============

export function initializeGamification(): { isNewDay: boolean; streakResult: StreakResult | null } {
  checkWeeklyReset();
  
  const progress = getUserProgress();
  const today = new Date().toISOString().split("T")[0];
  const isNewDay = progress.lastLoginDate !== today;
  
  let streakResult: StreakResult | null = null;
  
  if (isNewDay) {
    streakResult = updateStreak();
  }
  
  return { isNewDay, streakResult };
}
