import { useState, useEffect } from "react";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import {
  Trophy, Users, Play, Check, X,
  ArrowRight, Crown, Smartphone, Monitor, Zap,
  Copy, Sparkles, Medal, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import lionIcon from "@/assets/lion-logo.png";
import { addXP, updateStreak } from "@/lib/storage";

// --- Types & Mock Data ---

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

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Was ist ein ETF?",
    options: ["Ein börsengehandelter Fonds", "Eine neue Kryptowährung", "Ein Fußballverein", "Eine Eissorte"],
    correctIndex: 0,
    timeLimit: 15
  },
  {
    id: 2,
    text: "Was bedeutet 'Diversifikation'?",
    options: ["Alles auf Rot setzen", "Risikostreuung", "Geld verstecken", "Nur Tech-Aktien kaufen"],
    correctIndex: 1,
    timeLimit: 15
  },
  {
    id: 3,
    text: "Was ist der Zinseszinseffekt?",
    options: ["Zinsen auf Zinsen", "Eine Bankgebühr", "Ein Steuergesetz", "Ein Börsencrash"],
    correctIndex: 0,
    timeLimit: 15
  },
  {
    id: 4,
    text: "Wie nennt man den Gewinnanteil einer Aktie?",
    options: ["Bonus", "Dividende", "Gehalt", "Miete"],
    correctIndex: 1,
    timeLimit: 15
  },
  {
    id: 5,
    text: "Was ist ein Bärenmarkt?",
    options: ["Steigende Kurse", "Fallende Kurse", "Ein Zoo", "Ein Markt für Honig"],
    correctIndex: 1,
    timeLimit: 15
  }
];

const MOCK_PLAYERS_NAMES = ["Lisa", "Tom", "Max", "Sarah", "Felix", "Emma", "Paul", "Mia"];
const AVATARS = ["🦊", "🐼", "🐨", "🐯", "🐸", "🐙", "🦄", "🐱"];

// Answer button colors matching ING style - using Tailwind classes to avoid inline styles
const ANSWER_COLORS = [
  { bgClass: "bg-[#FF6200]", hoverClass: "hover:bg-[#e55800]", icon: "▲" },  // ING Orange
  { bgClass: "bg-[#00A4CC]", hoverClass: "hover:bg-[#0093b8]", icon: "◆" },  // Teal
  { bgClass: "bg-[#8B5CF6]", hoverClass: "hover:bg-[#7c3aed]", icon: "●" },  // Purple
  { bgClass: "bg-[#10B981]", hoverClass: "hover:bg-[#059669]", icon: "■" },  // Green
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState<number | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [hostTimer, setHostTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // --- Host Logic ---

  const generateGameCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    code += "-";
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const startHostMode = () => {
    const code = generateGameCode();
    setGameCode(code);
    setPhase("host-lobby");
    setPlayers([]);

    // Simulate players joining
    let playerCount = 0;
    const joinInterval = setInterval(() => {
      if (playerCount < 5) {
        const newPlayer: Player = {
          id: `p-${Date.now()}-${playerCount}`,
          name: MOCK_PLAYERS_NAMES[playerCount],
          score: 0,
          streak: 0,
          avatar: AVATARS[playerCount],
          hasAnswered: false
        };
        setPlayers(prev => [...prev, newPlayer]);
        playerCount++;
      } else {
        clearInterval(joinInterval);
      }
    }, 1500);
  };

  const startHostGame = () => {
    setCurrentQuestionIndex(0);
    startQuestion(0);
  };

  const startQuestion = (index: number) => {
    setPhase("host-question");
    setTimeLeft(MOCK_QUESTIONS[index].timeLimit);
    setPlayers(prev => prev.map(p => ({ ...p, hasAnswered: false, lastAnswerCorrect: undefined })));

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endQuestion();
          return 0;
        }

        // Simulate random player answers
        if (Math.random() > 0.4) {
          setPlayers(prev => {
            const unAnswered = prev.filter(p => !p.hasAnswered);
            if (unAnswered.length > 0) {
              const randomPlayer = unAnswered[Math.floor(Math.random() * unAnswered.length)];
              return prev.map(p => p.id === randomPlayer.id ? { ...p, hasAnswered: true } : p);
            }
            return prev;
          });
        }

        return prev - 1;
      });
    }, 1000);
    setHostTimer(timer);
  };

  const endQuestion = () => {
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
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      startQuestion(currentQuestionIndex + 1);
    } else {
      setPhase("host-podium");
      fireConfetti();
    }
  };

  // --- Player Logic ---

  const joinGame = () => {
    if (gameCode.length < 4) {
      toast({ title: "Ungültiger Code", description: "Bitte gib einen gültigen Game-Code ein.", variant: "destructive" });
      return;
    }
    if (!playerName.trim()) {
      toast({ title: "Name fehlt", description: "Bitte gib deinen Namen ein.", variant: "destructive" });
      return;
    }
    setPhase("player-lobby");

    // Simulate waiting for host to start
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

    const isCorrect = index === MOCK_QUESTIONS[currentQuestionIndex].correctIndex;
    const timeBonus = Math.floor(timeLeft * 5);
    const points = isCorrect ? 100 + timeBonus : 0;

    if (isCorrect) {
      fireConfetti();
      setPlayerScore(prev => prev + points);
      setPlayerStreak(prev => prev + 1);
    } else {
      setPlayerStreak(0);
    }

    // Move to next question or result
    setTimeout(() => {
      if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setPlayerAnswer(null);
        setPhase("player-question");
        setTimeLeft(15);
        startPlayerTimer();
      } else {
        // Award XP for completing the challenge
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
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(gameCode);
    toast({ title: "Kopiert!", description: "Game-Code wurde kopiert." });
  };

  useEffect(() => {
    return () => {
      if (hostTimer) clearInterval(hostTimer);
    };
  }, [hostTimer]);

  // --- Renders ---

  // Selection Screen
  if (phase === "selection") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <ScreenHeader title="Quiz Challenge" onBack={onBack} />

        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-[#FF6200] to-[#FF8533] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Zap size={48} className="text-white" fill="currentColor" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[#333333] mb-2">Quiz Battle</h1>
            <p className="text-gray-500">Tritt gegen deine Freunde oder Klasse an!</p>
          </div>

          {/* Leo Tip */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100 flex gap-3 mb-8">
            <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0">
              <img src={lionIcon} alt="Leo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="font-bold text-orange-700 text-sm mb-1">Leo sagt:</div>
              <p className="text-xs text-orange-600 leading-relaxed">
                Teste dein Finanzwissen im Multiplayer-Modus! Sammle Punkte, zeige was du gelernt hast und werde zum Finanz-Champion! 🏆
              </p>
            </div>
          </div>

          {/* Mode Buttons */}
          <div className="space-y-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPhase("player-join")}
              className="w-full bg-[#FF6200] text-white p-5 rounded-2xl font-bold text-lg shadow-md flex items-center justify-center gap-3"
            >
              <Smartphone size={24} />
              <span>Quiz beitreten</span>
            </motion.button>
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
        <ScreenHeader title="Quiz Lobby" onBack={() => setPhase("selection")} />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Game Code Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <div className="text-gray-500 text-sm mb-2">Game Code</div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-3xl font-black tracking-[0.2em] text-[#FF6200]">{gameCode}</span>
              <button
                onClick={copyCode}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Code kopieren"
              >
                <Copy size={18} className="text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-400">Teile diesen Code mit deinen Teilnehmern</p>
          </div>

          {/* Players List */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-[#333333]">Teilnehmer</span>
              <div className="flex items-center gap-1 bg-[#FF6200]/10 px-3 py-1 rounded-full">
                <Users size={16} className="text-[#FF6200]" />
                <span className="font-bold text-[#FF6200]">{players.length}</span>
              </div>
            </div>

            {players.length === 0 ? (
              <div className="p-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-3"
                >
                  <Sparkles size={48} className="text-[#FF6200]" />
                </motion.div>
                <p className="text-gray-500">Warte auf Spieler...</p>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-2 gap-3">
                <AnimatePresence>
                  {players.map((player) => (
                    <motion.div
                      key={player.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gray-50 p-3 rounded-xl flex items-center gap-3"
                    >
                      <span className="text-2xl">{player.avatar}</span>
                      <span className="font-bold text-[#333333] truncate">{player.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Start Button */}
        <div className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={startHostGame}
            disabled={players.length === 0}
            className={`w-full p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${players.length > 0
              ? "bg-[#FF6200] text-white shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Play size={20} fill="currentColor" />
            Quiz starten
          </button>
        </div>
      </div>
    );
  }

  // Host Question Display
  if (phase === "host-question") {
    const question = MOCK_QUESTIONS[currentQuestionIndex];
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-white px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-500">
            Frage {currentQuestionIndex + 1}/{MOCK_QUESTIONS.length}
          </span>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500">{players.filter(p => p.hasAnswered).length}/{players.length}</span>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          {/* Timer */}
          <div className="flex justify-center mb-6">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 ${timeLeft <= 5 ? 'border-red-500 text-red-500 bg-red-50' : 'border-[#FF6200] text-[#FF6200] bg-orange-50'
                }`}
            >
              {timeLeft}
            </motion.div>
          </div>

          {/* Question */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
            <h2 className="text-xl font-bold text-[#333333] text-center leading-relaxed">{question.text}</h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl flex items-center gap-3 text-white font-bold shadow-md ${ANSWER_COLORS[idx].bgClass}`}
              >
                <span className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-sm">
                  {ANSWER_COLORS[idx].icon}
                </span>
                <span className="text-sm leading-tight">{option}</span>
              </div>
            ))}
          </div>

          {/* Skip Button */}
          <button
            onClick={endQuestion}
            className="mt-4 text-gray-500 text-sm hover:text-gray-700"
          >
            Überspringen →
          </button>
        </div>
      </div>
    );
  }

  // Host Leaderboard
  if (phase === "host-leaderboard") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-white px-4 py-4 text-center border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#333333]">Zwischenstand</h2>
          <p className="text-sm text-gray-500">Nach Frage {currentQuestionIndex + 1}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {players.slice(0, 5).map((player, idx) => (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white p-4 rounded-xl flex items-center justify-between shadow-sm ${idx === 0 ? 'ring-2 ring-[#FF6200]' : ''
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-[#FF6200] text-white' :
                  idx === 1 ? 'bg-gray-300 text-gray-700' :
                    idx === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-100 text-gray-600'
                  }`}>
                  {idx + 1}
                </div>
                <span className="text-xl">{player.avatar}</span>
                <div>
                  <span className="font-bold text-[#333333]">{player.name}</span>
                  {player.streak > 2 && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">🔥 {player.streak}</span>
                  )}
                </div>
              </div>
              <span className="font-bold text-lg text-[#333333]">{player.score}</span>
            </motion.div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={nextQuestion}
            className="w-full bg-[#FF6200] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {currentQuestionIndex < MOCK_QUESTIONS.length - 1 ? (
              <>Nächste Frage <ArrowRight size={20} /></>
            ) : (
              <>Ergebnisse anzeigen <Trophy size={20} /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Host Podium
  if (phase === "host-podium") {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#FF6200] to-[#FF8533] overflow-hidden">
        <div className="pt-8 pb-4 text-center">
          <Trophy size={48} className="text-white mx-auto mb-2" />
          <h1 className="text-3xl font-black text-white">Ergebnisse</h1>
        </div>

        {/* Podium */}
        <div className="flex-1 flex items-end justify-center px-4 pb-8">
          <div className="flex items-end gap-2 w-full max-w-sm">
            {/* 2nd Place */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-3xl mb-2">{sorted[1]?.avatar}</span>
              <span className="text-white font-bold text-sm mb-2">{sorted[1]?.name}</span>
              <span className="text-white/80 text-xs mb-2">{sorted[1]?.score} Punkte</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 100 }}
                className="w-full bg-white/30 rounded-t-xl flex items-end justify-center pb-3"
              >
                <Medal size={24} className="text-gray-300" />
              </motion.div>
            </div>

            {/* 1st Place */}
            <div className="flex-1 flex flex-col items-center z-10">
              <Crown size={32} className="text-yellow-300 mb-1" fill="currentColor" />
              <span className="text-4xl mb-2">{sorted[0]?.avatar}</span>
              <span className="text-white font-bold mb-2">{sorted[0]?.name}</span>
              <span className="text-white/80 text-sm mb-2">{sorted[0]?.score} Punkte</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 140 }}
                className="w-full bg-white rounded-t-xl flex items-end justify-center pb-3 shadow-lg"
              >
                <Star size={28} className="text-[#FF6200]" fill="currentColor" />
              </motion.div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-3xl mb-2">{sorted[2]?.avatar}</span>
              <span className="text-white font-bold text-sm mb-2">{sorted[2]?.name}</span>
              <span className="text-white/80 text-xs mb-2">{sorted[2]?.score} Punkte</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 70 }}
                className="w-full bg-white/30 rounded-t-xl flex items-end justify-center pb-3"
              >
                <Medal size={24} className="text-amber-600" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-4 pb-8">
          <button
            onClick={() => setPhase("selection")}
            className="w-full bg-white text-[#FF6200] p-4 rounded-xl font-bold"
          >
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
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <div>
              <label className="text-sm font-bold text-gray-500 block mb-2">Game Code</label>
              <input
                type="text"
                placeholder="XXXX-XXXX"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full bg-gray-50 text-center text-2xl font-black p-4 rounded-xl border-2 border-gray-200 focus:border-[#FF6200] outline-none uppercase tracking-widest"
                maxLength={9}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-500 block mb-2">Dein Name</label>
              <input
                type="text"
                placeholder="Max Mustermann"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-gray-50 text-center text-xl font-bold p-4 rounded-xl border-2 border-gray-200 focus:border-[#FF6200] outline-none"
              />
            </div>

            <button
              onClick={joinGame}
              className="w-full bg-[#FF6200] text-white p-4 rounded-xl font-bold text-lg"
            >
              Beitreten
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Player Lobby (waiting)
  if (phase === "player-lobby") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] items-center justify-center p-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-24 h-24 bg-[#FF6200] rounded-full flex items-center justify-center mb-6"
        >
          <Sparkles size={48} className="text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#333333] mb-2">Du bist dabei!</h2>
        <p className="text-gray-500 mb-6">Warte bis das Quiz startet...</p>
        <div className="bg-white px-6 py-3 rounded-full shadow-sm">
          <span className="font-mono text-lg text-[#FF6200] font-bold">{gameCode}</span>
        </div>
      </div>
    );
  }

  // Player Question Screen
  if (phase === "player-question") {
    const question = MOCK_QUESTIONS[currentQuestionIndex];
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        {/* Header with timer */}
        <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
          <span className="text-sm font-bold text-gray-500">
            Frage {currentQuestionIndex + 1}/{MOCK_QUESTIONS.length}
          </span>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${timeLeft <= 5 ? 'bg-red-100 text-red-600' : 'bg-[#FF6200]/10 text-[#FF6200]'
            }`}>
            {timeLeft}
          </div>
        </div>

        {/* Question Text */}
        <div className="bg-white px-4 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#333333] text-center leading-snug">{question.text}</h2>
        </div>

        {/* Answer Buttons - Vertical List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {question.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.98 }}
              onClick={() => submitAnswer(idx)}
              className={`w-full p-4 rounded-xl shadow-md text-white font-bold text-left flex items-center gap-3 ${ANSWER_COLORS[idx].bgClass} ${ANSWER_COLORS[idx].hoverClass}`}
            >
              <span className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-sm shrink-0">
                {ANSWER_COLORS[idx].icon}
              </span>
              <span className="text-base leading-snug">{option}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Player Feedback Screen
  if (phase === "player-feedback") {
    const isCorrect = playerAnswer === MOCK_QUESTIONS[currentQuestionIndex].correctIndex;
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-6 ${isCorrect ? 'bg-green-500' : 'bg-red-500'
        }`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6"
        >
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

  // Player Result Screen
  if (phase === "player-result") {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#FF6200] to-[#FF8533] items-center justify-center p-6 text-center">
        <Trophy size={64} className="text-yellow-300 mb-4" fill="currentColor" />
        <h1 className="text-4xl font-black text-white mb-2">Geschafft!</h1>
        <p className="text-white/80 text-lg mb-8">{playerName || "Du"} hat das Quiz beendet</p>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 w-full max-w-xs mb-8">
          <div className="text-5xl font-black text-white mb-2">{playerScore}</div>
          <div className="text-white/80">Punkte</div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 mb-8">
          <span className="text-white font-bold">+{Math.floor(playerScore / 10)} XP erhalten! 🎉</span>
        </div>

        <button
          onClick={() => setPhase("selection")}
          className="w-full max-w-xs bg-white text-[#FF6200] p-4 rounded-xl font-bold"
        >
          Nochmal spielen
        </button>
      </div>
    );
  }

  return null;
}
