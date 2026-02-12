import { useState, useEffect, useCallback, useRef } from "react";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import {
  Trophy, Users, Play, Check, X,
  ArrowRight, Crown, Smartphone, Zap,
  Copy, Sparkles, Medal, Star, Loader2, Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import lionIcon from "@/assets/lion-logo.png";
import { addXP, updateStreak } from "@/lib/storage";
import { generateQuizQuestions } from "@/lib/openai";

// --- Types ---

type GamePhase =
  | "selection"
  | "host-setup"
  | "host-lobby"
  | "host-question"
  | "host-leaderboard"
  | "host-podium"
  | "player-join"
  | "player-lobby"
  | "player-question"
  | "player-feedback"
  | "player-result";

interface Player {
  id: string;
  name: string;
  score: number;
  streak: number;
  avatar: string;
  hasAnswered: boolean;
  lastAnswerCorrect?: boolean;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
}

// Fallback questions in case AI generation fails
const FALLBACK_QUESTIONS: Question[] = [
  { id: 1, text: "Was ist ein ETF?", options: ["Ein börsengehandelter Fonds", "Eine neue Kryptowährung", "Ein Fußballverein", "Eine Eissorte"], correctIndex: 0, timeLimit: 15 },
  { id: 2, text: "Was bedeutet 'Diversifikation'?", options: ["Alles auf Rot setzen", "Risikostreuung", "Geld verstecken", "Nur Tech-Aktien kaufen"], correctIndex: 1, timeLimit: 15 },
  { id: 3, text: "Was ist der Zinseszinseffekt?", options: ["Zinsen auf Zinsen", "Eine Bankgebühr", "Ein Steuergesetz", "Ein Börsencrash"], correctIndex: 0, timeLimit: 15 },
  { id: 4, text: "Wie nennt man den Gewinnanteil einer Aktie?", options: ["Bonus", "Dividende", "Gehalt", "Miete"], correctIndex: 1, timeLimit: 15 },
  { id: 5, text: "Was ist ein Bärenmarkt?", options: ["Steigende Kurse", "Fallende Kurse", "Ein Zoo", "Ein Markt für Honig"], correctIndex: 1, timeLimit: 15 },
];

const QUIZ_TOPICS = [
  { label: "Aktien & Börse", icon: "📈", topic: "Aktien und Börse", context: "Grundlagen des Aktienmarkts" },
  { label: "Sparen & Budget", icon: "💰", topic: "Sparen und Budgetplanung", context: "Wie man als Jugendlicher spart" },
  { label: "Krypto & Blockchain", icon: "⛓️", topic: "Kryptowährungen und Blockchain", context: "Grundlagen für Einsteiger" },
  { label: "Versicherungen", icon: "🛡️", topic: "Versicherungen", context: "Wichtige Versicherungen für junge Menschen" },
  { label: "Steuern & Gehalt", icon: "📋", topic: "Steuern und Einkommen", context: "Erster Job und Steuererklärung" },
  { label: "Investieren", icon: "🎯", topic: "Investieren und Geldanlage", context: "ETFs, Fonds und langfristiger Vermögensaufbau" },
];

const MOCK_PLAYERS_NAMES = [
  "Lisa", "Tom", "Max", "Sarah", "Felix", "Emma", "Paul", "Mia",
  "Lukas", "Anna", "Ben", "Laura", "Niklas", "Sophie", "Jan", "Marie",
  "Tim", "Lea", "Moritz", "Lena", "Erik", "Clara", "Finn", "Julia"
];
const AVATARS = ["🦊", "🐼", "🐨", "🐯", "🐸", "🐙", "🦄", "🐱", "🦁", "🐻", "🐵", "🐷", "🐲", "🦅", "🐺", "🦋", "🐢", "🐬", "🦀", "🐝", "🦎", "🐠", "🦩", "🐧"];

const ANSWER_COLORS = [
  { bgClass: "bg-[#FF6200]", hoverClass: "hover:bg-[#e55800]", icon: "▲" },
  { bgClass: "bg-[#00A4CC]", hoverClass: "hover:bg-[#0093b8]", icon: "◆" },
  { bgClass: "bg-[#8B5CF6]", hoverClass: "hover:bg-[#7c3aed]", icon: "●" },
  { bgClass: "bg-[#10B981]", hoverClass: "hover:bg-[#059669]", icon: "■" },
];

// --- Component ---

export function KahootChallengeScreen({
  onBack,
  onNavigate,
  onLeoClick
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onLeoClick?: () => void;
}) {
  const [phase, setPhase] = useState<GamePhase>("selection");
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState<number | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [hostTimer, setHostTimer] = useState<NodeJS.Timeout | null>(null);
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<typeof QUIZ_TOPICS[0] | null>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // --- AI Question Generation ---

  const loadAIQuestions = useCallback(async (topic: string, context: string) => {
    setIsLoadingQuestions(true);
    try {
      const aiQuestions = await generateQuizQuestions(topic, "mittel", 7, context);
      if (aiQuestions.length > 0) {
        const mapped: Question[] = aiQuestions.map((q, i) => ({
          id: i + 1,
          text: q.question,
          options: q.options,
          correctIndex: q.correctAnswer,
          timeLimit: 15,
        }));
        setQuestions(mapped);
        return mapped;
      }
    } catch {
      // Fall through to fallback
    }
    setQuestions(FALLBACK_QUESTIONS);
    setIsLoadingQuestions(false);
    return FALLBACK_QUESTIONS;
  }, []);

  // --- Host Logic ---

  const generateGameCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    code += "-";
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const startHostMode = useCallback(async (topic: typeof QUIZ_TOPICS[0], autoDemo: boolean) => {
    setSelectedTopic(topic);
    setIsAutoDemo(autoDemo);
    const code = generateGameCode();
    setGameCode(code);
    setPhase("host-lobby");
    setPlayers([]);
    setCurrentQuestionIndex(0);

    // Load AI questions
    const loadedQuestions = await loadAIQuestions(topic.topic, topic.context);
    setIsLoadingQuestions(false);

    // Simulate players joining
    const playerCount = autoDemo ? 12 + Math.floor(Math.random() * 8) : 5;
    let joined = 0;
    const joinInterval = setInterval(() => {
      if (joined < playerCount) {
        const newPlayer: Player = {
          id: `p-${Date.now()}-${joined}`,
          name: MOCK_PLAYERS_NAMES[joined % MOCK_PLAYERS_NAMES.length],
          score: 0,
          streak: 0,
          avatar: AVATARS[joined % AVATARS.length],
          hasAnswered: false
        };
        setPlayers(prev => [...prev, newPlayer]);
        joined++;
      } else {
        clearInterval(joinInterval);
        // In auto-demo mode, auto-start after all players joined
        if (autoDemo && loadedQuestions.length > 0) {
          setTimeout(() => {
            startHostGameWithQuestions(loadedQuestions);
          }, 1500);
        }
      }
    }, autoDemo ? 400 : 1500);
  }, [loadAIQuestions]);

  const startHostGameWithQuestions = (qs: Question[]) => {
    setCurrentQuestionIndex(0);
    startQuestion(0, qs);
  };

  const startHostGame = () => {
    setCurrentQuestionIndex(0);
    startQuestion(0, questions);
  };

  const startQuestion = (index: number, qs: Question[]) => {
    if (index >= qs.length) {
      setPhase("host-podium");
      fireConfetti();
      return;
    }

    setPhase("host-question");
    setTimeLeft(qs[index].timeLimit);
    setPlayers(prev => prev.map(p => ({ ...p, hasAnswered: false, lastAnswerCorrect: undefined })));

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endQuestion(index, qs);
          return 0;
        }

        // Simulate random player answers
        if (Math.random() > 0.3) {
          setPlayers(prev => {
            const unAnswered = prev.filter(p => !p.hasAnswered);
            if (unAnswered.length > 0) {
              // Answer 1-3 players at once for realism
              const answerCount = Math.min(1 + Math.floor(Math.random() * 2), unAnswered.length);
              const newPlayers = [...prev];
              for (let i = 0; i < answerCount; i++) {
                const randomIdx = Math.floor(Math.random() * unAnswered.length);
                const playerId = unAnswered[randomIdx].id;
                const pIdx = newPlayers.findIndex(p => p.id === playerId);
                if (pIdx >= 0) newPlayers[pIdx] = { ...newPlayers[pIdx], hasAnswered: true };
                unAnswered.splice(randomIdx, 1);
              }
              return newPlayers;
            }
            return prev;
          });
        }

        return prev - 1;
      });
    }, 1000);
    setHostTimer(timer);
  };

  const endQuestion = (questionIndex: number, qs: Question[]) => {
    setPlayers(prev => prev.map(p => {
      const isCorrect = Math.random() > 0.35;
      const points = isCorrect ? 100 + Math.floor(Math.random() * 50) : 0;
      return {
        ...p,
        score: p.score + points,
        streak: isCorrect ? p.streak + 1 : 0,
        lastAnswerCorrect: isCorrect,
        hasAnswered: true
      };
    }).sort((a, b) => b.score - a.score));

    setPhase("host-leaderboard");

    // Auto-demo: auto-advance to next question
    if (isAutoDemo) {
      autoTimerRef.current = setTimeout(() => {
        const nextIdx = questionIndex + 1;
        if (nextIdx < qs.length) {
          setCurrentQuestionIndex(nextIdx);
          startQuestion(nextIdx, qs);
        } else {
          setPhase("host-podium");
          fireConfetti();
        }
      }, 2500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      startQuestion(nextIdx, questions);
    } else {
      setPhase("host-podium");
      fireConfetti();
    }
  };

  // --- Player Logic ---

  const joinGame = async () => {
    if (gameCode.length < 4) {
      toast({ title: "Ungültiger Code", description: "Bitte gib einen gültigen Game-Code ein.", variant: "destructive" });
      return;
    }
    if (!playerName.trim()) {
      toast({ title: "Name fehlt", description: "Bitte gib deinen Namen ein.", variant: "destructive" });
      return;
    }

    // Load AI questions for player mode
    if (questions.length === 0) {
      const randomTopic = QUIZ_TOPICS[Math.floor(Math.random() * QUIZ_TOPICS.length)];
      setSelectedTopic(randomTopic);
      await loadAIQuestions(randomTopic.topic, randomTopic.context);
      setIsLoadingQuestions(false);
    }

    setPhase("player-lobby");

    setTimeout(() => {
      setPhase("player-question");
      setTimeLeft(15);
      startPlayerTimer();
    }, 3000);
  };

  const startPlayerTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setHostTimer(timer);
  };

  const submitAnswer = (index: number) => {
    if (hostTimer) clearInterval(hostTimer);
    setPlayerAnswer(index);
    setPhase("player-feedback");

    const currentQs = questions.length > 0 ? questions : FALLBACK_QUESTIONS;
    const isCorrect = index === currentQs[currentQuestionIndex].correctIndex;
    const timeBonus = Math.floor(timeLeft * 5);
    const points = isCorrect ? 100 + timeBonus : 0;

    if (isCorrect) {
      fireConfetti();
      setPlayerScore(prev => prev + points);
      setPlayerStreak(prev => prev + 1);
    } else {
      setPlayerStreak(0);
    }

    setTimeout(() => {
      if (currentQuestionIndex < currentQs.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setPlayerAnswer(null);
        setPhase("player-question");
        setTimeLeft(15);
        startPlayerTimer();
      } else {
        const result = addXP(Math.floor(playerScore / 10));
        updateStreak();
        if (result.levelUp) {
          toast({ title: `🎉 Level ${result.newLevel}!`, description: "Du bist aufgestiegen!" });
        }
        setPhase("player-result");
      }
    }, 2500);
  };

  // --- Utilities ---

  const fireConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(gameCode);
    toast({ title: "Kopiert!", description: "Game-Code wurde kopiert." });
  };

  useEffect(() => {
    return () => {
      if (hostTimer) clearInterval(hostTimer);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [hostTimer]);

  // Get current questions (loaded or fallback)
  const currentQuestions = questions.length > 0 ? questions : FALLBACK_QUESTIONS;

  // --- RENDERS ---

  // Selection Screen
  if (phase === "selection") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <ScreenHeader title="Quiz Challenge" onBack={onBack} />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Hero */}
          <div className="text-center pt-2 pb-2">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-[#FF6200] to-[#FF8533] rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Zap size={40} className="text-white" fill="currentColor" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[#333] mb-1">Quiz Battle</h1>
            <p className="text-gray-500 text-sm">KI-generierte Fragen • Multiplayer</p>
          </div>

          {/* Leo Tip */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-2xl border border-orange-100 flex gap-3">
            <div className="w-9 h-9 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
              <img src={lionIcon} alt="Leo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <div className="font-bold text-orange-700 text-xs mb-1">Leo sagt:</div>
              <p className="text-[11px] text-orange-600 leading-relaxed">
                Wähle ein Thema und ich erstelle mit KI einzigartige Quizfragen!
                Im Auto-Demo siehst du ein komplettes Spiel mit Spielern. 🏆
              </p>
            </div>
          </div>

          {/* Topic Selection */}
          <div>
            <div className="font-bold text-[#333] text-sm mb-3 px-1">Thema wählen</div>
            <div className="grid grid-cols-2 gap-2">
              {QUIZ_TOPICS.map((topic) => (
                <motion.button
                  key={topic.label}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedTopic?.label === topic.label
                      ? "bg-[#FF6200] text-white shadow-md ring-2 ring-[#FF6200]/50"
                      : "bg-white text-[#333] shadow-sm hover:shadow-md"
                  }`}
                >
                  <span className="text-xl block mb-1">{topic.icon}</span>
                  <span className="font-bold text-xs block leading-tight">{topic.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mode Buttons */}
          <div className="space-y-3 pt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (selectedTopic) {
                  startHostMode(selectedTopic, true);
                } else {
                  toast({ title: "Thema wählen", description: "Bitte wähle erst ein Quiz-Thema!", variant: "destructive" });
                }
              }}
              className="w-full bg-gradient-to-r from-[#33307E] to-[#4A47A3] text-white p-4 rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
              <Bot size={22} />
              <span>Auto-Demo starten</span>
              <span className="bg-white/20 text-[10px] font-black px-2 py-0.5 rounded-full">KI</span>
            </motion.button>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (selectedTopic) {
                    startHostMode(selectedTopic, false);
                  } else {
                    toast({ title: "Thema wählen", description: "Bitte wähle erst ein Quiz-Thema!", variant: "destructive" });
                  }
                }}
                className="flex-1 bg-[#FF6200] text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Play size={18} fill="currentColor" />
                Hosten
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setPhase("player-join")}
                className="flex-1 bg-white text-[#333] p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm border border-gray-200"
              >
                <Smartphone size={18} />
                Beitreten
              </motion.button>
            </div>
          </div>
        </div>

        <BottomNav activeTab="learn" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
      </div>
    );
  }

  // --- HOST VIEWS ---

  // Host Lobby
  if (phase === "host-lobby") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <ScreenHeader title="Quiz Lobby" onBack={() => { setIsAutoDemo(false); setPhase("selection"); }} />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Game Code Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
            <div className="text-gray-500 text-xs mb-2">Game Code</div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl font-black tracking-[0.2em] text-[#FF6200]">{gameCode}</span>
              <button onClick={copyCode} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="Code kopieren">
                <Copy size={18} className="text-gray-600" />
              </button>
            </div>
            {selectedTopic && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>{selectedTopic.icon}</span>
                <span className="font-medium">{selectedTopic.label}</span>
                {isAutoDemo && <span className="bg-[#33307E] text-white text-[9px] font-black px-2 py-0.5 rounded-full ml-1">AUTO-DEMO</span>}
              </div>
            )}
          </div>

          {/* AI Question Loading */}
          {isLoadingQuestions && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-[#33307E] to-[#4A47A3] p-4 rounded-2xl text-white text-center">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              <p className="text-sm font-bold">Leo generiert Quizfragen mit KI...</p>
              <p className="text-xs text-white/70 mt-1">{selectedTopic?.topic}</p>
            </motion.div>
          )}
          {!isLoadingQuestions && questions.length > 0 && (
            <div className="bg-green-50 p-3 rounded-xl border border-green-200 flex items-center gap-2">
              <Check size={16} className="text-green-600" />
              <span className="text-xs font-bold text-green-700">{questions.length} KI-Fragen generiert</span>
              <span className="text-[9px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full ml-auto font-bold">KI</span>
            </div>
          )}

          {/* Players List */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-[#333]">Teilnehmer</span>
              <div className="flex items-center gap-1 bg-[#FF6200]/10 px-3 py-1 rounded-full">
                <Users size={16} className="text-[#FF6200]" />
                <span className="font-bold text-[#FF6200]">{players.length}</span>
              </div>
            </div>

            {players.length === 0 ? (
              <div className="p-8 text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 mx-auto mb-3">
                  <Sparkles size={48} className="text-[#FF6200]" />
                </motion.div>
                <p className="text-gray-500">Warte auf Spieler...</p>
              </div>
            ) : (
              <div className="p-3 grid grid-cols-3 gap-2">
                <AnimatePresence>
                  {players.map((player) => (
                    <motion.div key={player.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="bg-gray-50 p-2 rounded-xl flex flex-col items-center text-center">
                      <span className="text-xl">{player.avatar}</span>
                      <span className="font-bold text-[#333] text-[10px] truncate w-full mt-1">{player.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Start Button - only if not auto-demo */}
        {!isAutoDemo && (
          <div className="p-4 bg-white border-t border-gray-100">
            <button onClick={startHostGame}
              disabled={players.length === 0 || isLoadingQuestions}
              className={`w-full p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                players.length > 0 && !isLoadingQuestions
                  ? "bg-[#FF6200] text-white shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              <Play size={20} fill="currentColor" />
              Quiz starten ({currentQuestions.length} Fragen)
            </button>
          </div>
        )}
      </div>
    );
  }

  // Host Question Display
  if (phase === "host-question") {
    const question = currentQuestions[currentQuestionIndex];
    if (!question) return null;
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-white px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-500">Frage {currentQuestionIndex + 1}/{currentQuestions.length}</span>
          <div className="flex items-center gap-3">
            {isAutoDemo && <span className="bg-[#33307E] text-white text-[8px] font-black px-2 py-0.5 rounded-full">AUTO</span>}
            <div className="flex items-center gap-1">
              <Users size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">{players.filter(p => p.hasAnswered).length}/{players.length}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          {/* Timer */}
          <div className="flex justify-center mb-4">
            <motion.div key={timeLeft} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-4 ${
                timeLeft <= 5 ? 'border-red-500 text-red-500 bg-red-50' : 'border-[#FF6200] text-[#FF6200] bg-orange-50'
              }`}>
              {timeLeft}
            </motion.div>
          </div>

          {/* Question */}
          <div className="bg-white p-5 rounded-2xl shadow-md mb-4">
            <h2 className="text-lg font-bold text-[#333] text-center leading-relaxed">{question.text}</h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-2 flex-1">
            {question.options.map((option, idx) => (
              <div key={idx} className={`p-3 rounded-xl flex items-center gap-2 text-white font-bold shadow-md ${ANSWER_COLORS[idx % 4].bgClass}`}>
                <span className="w-7 h-7 bg-black/20 rounded-full flex items-center justify-center text-xs shrink-0">
                  {ANSWER_COLORS[idx % 4].icon}
                </span>
                <span className="text-xs leading-tight">{option}</span>
              </div>
            ))}
          </div>

          {!isAutoDemo && (
            <button onClick={() => endQuestion(currentQuestionIndex, currentQuestions)} className="mt-3 text-gray-500 text-sm hover:text-gray-700">
              Überspringen →
            </button>
          )}
        </div>
      </div>
    );
  }

  // Host Leaderboard
  if (phase === "host-leaderboard") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-white px-4 py-4 text-center border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#333]">Zwischenstand</h2>
          <p className="text-sm text-gray-500">
            Nach Frage {currentQuestionIndex + 1}
            {isAutoDemo && <span className="ml-2 text-[9px] bg-[#33307E] text-white px-2 py-0.5 rounded-full align-middle">AUTO-DEMO</span>}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {players.slice(0, 8).map((player, idx) => (
            <motion.div key={player.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`bg-white p-3 rounded-xl flex items-center justify-between shadow-sm ${idx === 0 ? 'ring-2 ring-[#FF6200]' : ''}`}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  idx === 0 ? 'bg-[#FF6200] text-white' :
                  idx === 1 ? 'bg-gray-300 text-gray-700' :
                  idx === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>{idx + 1}</div>
                <span className="text-lg">{player.avatar}</span>
                <div>
                  <span className="font-bold text-[#333] text-sm">{player.name}</span>
                  {player.streak > 2 && (
                    <span className="ml-1 text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">🔥{player.streak}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#333]">{player.score}</span>
                {player.lastAnswerCorrect !== undefined && (
                  <span className={`block text-[9px] font-bold ${player.lastAnswerCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {player.lastAnswerCorrect ? '+' + (100 + Math.floor(Math.random() * 50)) : '+0'}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          {players.length > 8 && (
            <div className="text-center text-xs text-gray-400 py-2">
              +{players.length - 8} weitere Spieler
            </div>
          )}
        </div>

        {!isAutoDemo && (
          <div className="p-4 bg-white border-t border-gray-100">
            <button onClick={nextQuestion}
              className="w-full bg-[#FF6200] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
              {currentQuestionIndex < currentQuestions.length - 1 ? (
                <>Nächste Frage <ArrowRight size={20} /></>
              ) : (
                <>Ergebnisse anzeigen <Trophy size={20} /></>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Host Podium
  if (phase === "host-podium") {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#FF6200] to-[#FF8533] overflow-hidden">
        <div className="pt-6 pb-3 text-center">
          <Trophy size={40} className="text-white mx-auto mb-1" />
          <h1 className="text-2xl font-black text-white">Ergebnisse</h1>
          {isAutoDemo && (
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                {selectedTopic?.icon} {selectedTopic?.label} • {players.length} Spieler • {currentQuestions.length} Fragen
              </span>
            </div>
          )}
        </div>

        {/* Podium */}
        <div className="flex-1 flex items-end justify-center px-4 pb-6">
          <div className="flex items-end gap-2 w-full max-w-sm">
            {/* 2nd Place */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-2xl mb-1">{sorted[1]?.avatar}</span>
              <span className="text-white font-bold text-xs mb-1">{sorted[1]?.name}</span>
              <span className="text-white/80 text-[10px] mb-1">{sorted[1]?.score} Pt.</span>
              <motion.div initial={{ height: 0 }} animate={{ height: 90 }}
                className="w-full bg-white/30 rounded-t-xl flex items-end justify-center pb-2">
                <Medal size={20} className="text-gray-300" />
              </motion.div>
            </div>
            {/* 1st Place */}
            <div className="flex-1 flex flex-col items-center z-10">
              <Crown size={28} className="text-yellow-300 mb-1" fill="currentColor" />
              <span className="text-3xl mb-1">{sorted[0]?.avatar}</span>
              <span className="text-white font-bold text-sm mb-1">{sorted[0]?.name}</span>
              <span className="text-white/80 text-xs mb-1">{sorted[0]?.score} Pt.</span>
              <motion.div initial={{ height: 0 }} animate={{ height: 130 }}
                className="w-full bg-white rounded-t-xl flex items-end justify-center pb-2 shadow-lg">
                <Star size={24} className="text-[#FF6200]" fill="currentColor" />
              </motion.div>
            </div>
            {/* 3rd Place */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-2xl mb-1">{sorted[2]?.avatar}</span>
              <span className="text-white font-bold text-xs mb-1">{sorted[2]?.name}</span>
              <span className="text-white/80 text-[10px] mb-1">{sorted[2]?.score} Pt.</span>
              <motion.div initial={{ height: 0 }} animate={{ height: 60 }}
                className="w-full bg-white/30 rounded-t-xl flex items-end justify-center pb-2">
                <Medal size={20} className="text-amber-600" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-4 pb-3 flex gap-2">
          <div className="flex-1 bg-white/20 rounded-xl p-3 text-center">
            <div className="text-white/70 text-[9px]">Spieler</div>
            <div className="text-white font-black text-lg">{players.length}</div>
          </div>
          <div className="flex-1 bg-white/20 rounded-xl p-3 text-center">
            <div className="text-white/70 text-[9px]">Fragen</div>
            <div className="text-white font-black text-lg">{currentQuestions.length}</div>
          </div>
          <div className="flex-1 bg-white/20 rounded-xl p-3 text-center">
            <div className="text-white/70 text-[9px]">Top Score</div>
            <div className="text-white font-black text-lg">{sorted[0]?.score || 0}</div>
          </div>
        </div>

        <div className="p-4 pb-6">
          <button onClick={() => { setPhase("selection"); setIsAutoDemo(false); setQuestions([]); setSelectedTopic(null); }}
            className="w-full bg-white text-[#FF6200] p-4 rounded-xl font-bold">
            Beenden
          </button>
        </div>
      </div>
    );
  }

  // --- PLAYER VIEWS ---

  // Player Join Screen
  if (phase === "player-join") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <ScreenHeader title="Quiz beitreten" onBack={() => setPhase("selection")} />
        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-5">
            <div>
              <label className="text-sm font-bold text-gray-500 block mb-2">Game Code</label>
              <input type="text" placeholder="XXXX-XXXX" value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full bg-gray-50 text-center text-2xl font-black p-4 rounded-xl border-2 border-gray-200 focus:border-[#FF6200] outline-none uppercase tracking-widest"
                maxLength={9} />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-500 block mb-2">Dein Name</label>
              <input type="text" placeholder="Max Mustermann" value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-gray-50 text-center text-xl font-bold p-4 rounded-xl border-2 border-gray-200 focus:border-[#FF6200] outline-none" />
            </div>
            <button onClick={joinGame}
              className="w-full bg-[#FF6200] text-white p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
              {isLoadingQuestions ? <><Loader2 size={20} className="animate-spin" /> Laden...</> : "Beitreten"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Player Lobby
  if (phase === "player-lobby") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] items-center justify-center p-6 text-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
          className="w-24 h-24 bg-[#FF6200] rounded-full flex items-center justify-center mb-6">
          <Sparkles size={48} className="text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#333] mb-2">Du bist dabei!</h2>
        <p className="text-gray-500 mb-4">Warte bis das Quiz startet...</p>
        <div className="bg-white px-6 py-3 rounded-full shadow-sm mb-2">
          <span className="font-mono text-lg text-[#FF6200] font-bold">{gameCode}</span>
        </div>
        {selectedTopic && (
          <span className="text-xs text-gray-400">{selectedTopic.icon} {selectedTopic.label}</span>
        )}
      </div>
    );
  }

  // Player Question
  if (phase === "player-question") {
    const question = currentQuestions[currentQuestionIndex];
    if (!question) return null;
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
          <span className="text-sm font-bold text-gray-500">Frage {currentQuestionIndex + 1}/{currentQuestions.length}</span>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
            timeLeft <= 5 ? 'bg-red-100 text-red-600' : 'bg-[#FF6200]/10 text-[#FF6200]'
          }`}>{timeLeft}</div>
        </div>
        <div className="bg-white px-4 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#333] text-center leading-snug">{question.text}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {question.options.map((option, idx) => (
            <motion.button key={idx} whileTap={{ scale: 0.98 }} onClick={() => submitAnswer(idx)}
              className={`w-full p-4 rounded-xl shadow-md text-white font-bold text-left flex items-center gap-3 ${ANSWER_COLORS[idx % 4].bgClass} ${ANSWER_COLORS[idx % 4].hoverClass}`}>
              <span className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-sm shrink-0">
                {ANSWER_COLORS[idx % 4].icon}
              </span>
              <span className="text-base leading-snug">{option}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Player Feedback
  if (phase === "player-feedback") {
    const isCorrect = playerAnswer === currentQuestions[currentQuestionIndex]?.correctIndex;
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-6 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
          {isCorrect ? <Check size={56} className="text-white" /> : <X size={56} className="text-white" />}
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-2">{isCorrect ? "Richtig!" : "Falsch"}</h2>
        <p className="text-white/80 text-lg font-bold mb-4">
          {isCorrect ? `+${100 + Math.floor(timeLeft * 5)} Punkte` : "Kopf hoch!"}
        </p>
        {playerStreak > 1 && isCorrect && (
          <div className="bg-white/20 px-4 py-2 rounded-full">
            <span className="text-white font-bold">🔥 {playerStreak}er Streak!</span>
          </div>
        )}
      </div>
    );
  }

  // Player Result
  if (phase === "player-result") {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#FF6200] to-[#FF8533] items-center justify-center p-6 text-center">
        <Trophy size={56} className="text-yellow-300 mb-3" fill="currentColor" />
        <h1 className="text-3xl font-black text-white mb-2">Geschafft!</h1>
        <p className="text-white/80 text-lg mb-6">{playerName || "Du"} hat das Quiz beendet</p>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 w-full max-w-xs mb-6">
          <div className="text-4xl font-black text-white mb-1">{playerScore}</div>
          <div className="text-white/80">Punkte</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 mb-6">
          <span className="text-white font-bold">+{Math.floor(playerScore / 10)} XP erhalten! 🎉</span>
        </div>
        <button onClick={() => { setPhase("selection"); setQuestions([]); setSelectedTopic(null); }}
          className="w-full max-w-xs bg-white text-[#FF6200] p-4 rounded-xl font-bold">
          Nochmal spielen
        </button>
      </div>
    );
  }

  return null;
}
