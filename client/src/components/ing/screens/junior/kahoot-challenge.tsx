import { useState, useEffect, useCallback, useRef } from "react";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import {
  Trophy, Users, Play, Check, X, ArrowRight, Crown,
  Smartphone, Zap, Copy, Sparkles, Medal, Star, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import lionIcon from "@/assets/lion-logo.png";
import { QRCodeSVG } from "qrcode.react";
import { useKahootSocket } from "@/lib/kahoot-client";

// --- Types ---

type GamePhase =
  | "selection"
  | "host-lobby"
  | "host-question"
  | "host-reveal"
  | "host-leaderboard"
  | "host-podium"
  | "player-join"
  | "player-lobby"
  | "player-question"
  | "player-waiting"
  | "player-feedback"
  | "player-result";

interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
  score: number;
}

interface QuestionData {
  id: number;
  text: string;
  options: string[];
  timeLimit: number;
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
}

const QUIZ_TOPICS = [
  { label: "Aktien & Börse", icon: "📈", topic: "Aktien und Börse", context: "Grundlagen des Aktienmarkts" },
  { label: "Sparen & Budget", icon: "💰", topic: "Sparen und Budgetplanung", context: "Wie man als Jugendlicher spart" },
  { label: "Krypto & Blockchain", icon: "⛓️", topic: "Kryptowährungen und Blockchain", context: "Grundlagen für Einsteiger" },
  { label: "Versicherungen", icon: "🛡️", topic: "Versicherungen", context: "Wichtige Versicherungen für junge Menschen" },
  { label: "Steuern & Gehalt", icon: "📋", topic: "Steuern und Einkommen", context: "Erster Job und Steuererklärung" },
  { label: "Investieren", icon: "🎯", topic: "Investieren und Geldanlage", context: "ETFs, Fonds und langfristiger Vermögensaufbau" },
];

const ANSWER_COLORS = [
  { bg: "bg-[#FF6200]", hex: "#FF6200", icon: "▲" },
  { bg: "bg-[#00A4CC]", hex: "#00A4CC", icon: "◆" },
  { bg: "bg-[#8B5CF6]", hex: "#8B5CF6", icon: "●" },
  { bg: "bg-[#10B981]", hex: "#10B981", icon: "■" },
];

const AVATARS = ["🦁", "🐯", "🦊", "🐻", "🐼", "🐸", "🐵", "🦄", "🐲", "🦅"];

// --- Component ---

export function KahootChallengeScreen({
  onBack,
  onNavigate,
  onLeoClick,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onLeoClick?: () => void;
}) {
  const { connected, send, onMessage } = useKahootSocket();
  const { toast } = useToast();

  const [phase, setPhase] = useState<GamePhase>("selection");
  const [selectedTopic, setSelectedTopic] = useState<typeof QUIZ_TOPICS[0] | null>(null);

  // Host state
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [questionsReady, setQuestionsReady] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  // Shared question state
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Host question extras
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Player state
  const [joinCode, setJoinCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerAvatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  const [myPlayerId, setMyPlayerId] = useState("");
  const [playerTopic, setPlayerTopic] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [lastStreak, setLastStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [rank, setRank] = useState(0);
  const [podium, setPodium] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState("");

  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- WebSocket Handler ---

  useEffect(() => {
    const cleanup = onMessage((msg) => {
      switch (msg.type) {
        // Host messages
        case "room_created":
          setRoomCode(msg.code as string);
          setPhase("host-lobby");
          break;
        case "questions_ready":
          setQuestionsReady(true);
          setQuestionCount(msg.count as number);
          break;
        case "answer_count":
          setAnsweredCount(msg.count as number);
          break;
        case "question_result":
          setCorrectIndex(msg.correctIndex as number);
          setLeaderboard(msg.leaderboard as LeaderboardEntry[]);
          setPhase("host-reveal");
          if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
          revealTimerRef.current = setTimeout(() => setPhase("host-leaderboard"), 3000);
          break;

        // Player messages
        case "joined":
          setMyPlayerId(msg.playerId as string);
          setPlayerTopic(msg.topic as string);
          setPhase("player-lobby");
          setError("");
          break;
        case "your_result": {
          setLastCorrect(msg.correct as boolean);
          setLastPoints(msg.scoreGained as number);
          setLastStreak(msg.streak as number);
          setTotalScore(msg.totalScore as number);
          const lb = msg.leaderboard as LeaderboardEntry[];
          const me = lb.find(e => e.id === myPlayerId);
          setRank(me?.rank ?? lb.length);
          setPhase("player-feedback");
          if (msg.correct) confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
          break;
        }
        case "host_disconnected":
          setPhase("player-join");
          setError("Der Host hat das Spiel verlassen.");
          break;
        case "error":
          setError(msg.message as string);
          break;

        // Shared messages
        case "player_joined": {
          const pl = msg.players as PlayerInfo[];
          setPlayers(pl);
          setPlayerCount(pl.length);
          break;
        }
        case "player_left": {
          const pl = msg.players as PlayerInfo[];
          setPlayers(pl);
          setPlayerCount(pl.length);
          break;
        }
        case "question": {
          const q = msg.question as QuestionData;
          setCurrentQuestion(q);
          setQuestionIndex(msg.questionIndex as number);
          setTotalQuestions(msg.totalQuestions as number);
          setTimeLeft(q.timeLimit);
          setAnsweredCount(0);
          setCorrectIndex(null);
          setSelectedAnswer(null);
          if (roomCode) setPhase("host-question");
          else setPhase("player-question");
          break;
        }
        case "timer_tick":
          setTimeLeft(msg.remaining as number);
          break;
        case "game_over": {
          const p = msg.podium as LeaderboardEntry[];
          setPodium(p);
          setLeaderboard(p);
          const me = p.find(e => e.id === myPlayerId);
          if (me) { setTotalScore(me.score); setRank(me.rank); }
          if (roomCode) {
            setPhase("host-podium");
          } else {
            setPhase("player-result");
          }
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ["#FF6200", "#00A4CC", "#FFD700", "#10B981"] });
          break;
        }
      }
    });
    return () => {
      cleanup();
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, [onMessage, myPlayerId, roomCode, players.length]);

  // --- Actions ---

  const resetGame = useCallback(() => {
    setPhase("selection");
    setSelectedTopic(null);
    setRoomCode("");
    setPlayers([]);
    setQuestionsReady(false);
    setQuestionCount(0);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setTotalQuestions(0);
    setCorrectIndex(null);
    setLeaderboard([]);
    setPodium([]);
    setJoinCode("");
    setPlayerName("");
    setMyPlayerId("");
    setTotalScore(0);
    setError("");
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({ title: "Kopiert!", description: "Game-Code wurde kopiert." });
  };

  const isLastQuestion = totalQuestions > 0 && questionIndex >= totalQuestions - 1;
  const joinUrl = `${window.location.origin}/kahoot/join/${roomCode}`;

  // ===================== SELECTION SCREEN =====================

  if (phase === "selection") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <ScreenHeader title="Quiz Challenge" onBack={onBack} />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Hero */}
          <div className="text-center pt-2 pb-1">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-br from-[#FF6200] to-[#FF8533] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Zap size={32} className="text-white" fill="currentColor" />
            </motion.div>
            <h1 className="text-xl font-bold text-[#333] mb-0.5">Quiz Battle</h1>
            <p className="text-gray-500 text-xs">KI-generierte Fragen • Live Multiplayer</p>
            {!connected && <p className="text-orange-500 text-[10px] mt-1"><Loader2 size={10} className="inline animate-spin mr-1" />Verbinde...</p>}
          </div>

          {/* Leo Tip */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-2xl border border-orange-100 flex gap-3">
            <div className="w-8 h-8 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
              <img src={lionIcon} alt="Leo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="font-bold text-orange-700 text-[10px] mb-0.5">Leo sagt:</div>
              <p className="text-[10px] text-orange-600 leading-relaxed">
                Wähle ein Thema und starte als Host — oder tritt einem Quiz bei! 🏆
              </p>
            </div>
          </div>

          {/* Topic Selection */}
          <div>
            <div className="font-bold text-[#333] text-xs mb-2 px-1">Thema wählen</div>
            <div className="grid grid-cols-2 gap-2">
              {QUIZ_TOPICS.map((topic) => (
                <motion.button key={topic.label} whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedTopic?.label === topic.label
                      ? "bg-[#FF6200] text-white shadow-md ring-2 ring-[#FF6200]/50"
                      : "bg-white text-[#333] shadow-sm"
                  }`}>
                  <span className="text-lg block mb-0.5">{topic.icon}</span>
                  <span className="font-bold text-[10px] block leading-tight">{topic.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mode Buttons */}
          <div className="space-y-2 pt-1">
            <motion.button whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!selectedTopic || !connected) {
                  toast({ title: "Thema wählen", description: "Bitte wähle erst ein Quiz-Thema!", variant: "destructive" });
                  return;
                }
                send({ type: "create_room", topic: selectedTopic.topic, context: selectedTopic.context });
              }}
              className="w-full bg-[#FF6200] text-white p-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2">
              <Play size={18} fill="currentColor" />
              Quiz hosten
            </motion.button>

            <motion.button whileTap={{ scale: 0.98 }}
              onClick={() => setPhase("player-join")}
              className="w-full bg-white text-[#333] p-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm border border-gray-200">
              <Smartphone size={18} />
              Quiz beitreten
            </motion.button>
          </div>
        </div>
        <BottomNav activeTab="learn" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
      </div>
    );
  }

  // ===================== HOST LOBBY =====================

  if (phase === "host-lobby") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <ScreenHeader title="Quiz Lobby" onBack={resetGame} />
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* QR + Code Card */}
          <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
            <div className="text-gray-400 text-[10px] mb-1">Spieler scannen diesen Code</div>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="bg-white p-2 rounded-xl border border-gray-100">
                <QRCodeSVG value={joinUrl} size={80} level="M" />
              </div>
              <div>
                <div className="text-gray-400 text-[9px] mb-0.5">Game Code</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-[0.15em] text-[#FF6200]">{roomCode}</span>
                  <button onClick={copyCode} className="p-1.5 bg-gray-100 rounded-lg" title="Kopieren">
                    <Copy size={14} className="text-gray-500" />
                  </button>
                </div>
                {selectedTopic && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs">{selectedTopic.icon}</span>
                    <span className="text-[10px] font-medium text-gray-500">{selectedTopic.label}</span>
                  </div>
                )}
              </div>
            </div>

            {!questionsReady ? (
              <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px]">
                <Loader2 size={12} className="animate-spin" />
                <span>KI generiert Fragen...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1 text-green-600 text-[10px]">
                <Check size={12} />
                <span className="font-bold">{questionCount} Fragen bereit</span>
              </div>
            )}
          </div>

          {/* Players List */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-[#333] text-sm">Teilnehmer</span>
              <div className="flex items-center gap-1 bg-[#FF6200]/10 px-2.5 py-1 rounded-full">
                <Users size={14} className="text-[#FF6200]" />
                <span className="font-bold text-[#FF6200] text-xs">{players.length}</span>
              </div>
            </div>
            {players.length === 0 ? (
              <div className="p-6 text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Sparkles size={32} className="text-[#FF6200] mx-auto mb-2" />
                </motion.div>
                <p className="text-gray-400 text-xs">Warte auf Spieler...</p>
              </div>
            ) : (
              <div className="p-3 grid grid-cols-4 gap-2">
                <AnimatePresence>
                  {players.map((p) => (
                    <motion.div key={p.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="bg-gray-50 p-2 rounded-xl flex flex-col items-center">
                      <span className="text-lg">{p.avatar}</span>
                      <span className="font-bold text-[#333] text-[9px] truncate w-full text-center mt-0.5">{p.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <button onClick={() => send({ type: "start_game", roomCode })}
            disabled={players.length === 0 || !questionsReady}
            className={`w-full p-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              players.length > 0 && questionsReady
                ? "bg-[#FF6200] text-white shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            <Play size={18} fill="currentColor" />
            Quiz starten ({questionCount} Fragen)
          </button>
        </div>
      </div>
    );
  }

  // ===================== HOST QUESTION =====================

  if (phase === "host-question" && currentQuestion) {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-gray-100">
          <span className="text-xs font-bold text-gray-500">Frage {questionIndex + 1}/{totalQuestions}</span>
          <span className="text-[9px] text-gray-400">{answeredCount}/{players.length} beantwortet</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          <div className="flex justify-center mb-3">
            <motion.div key={timeLeft} initial={{ scale: 1.15 }} animate={{ scale: 1 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black border-[3px] ${
                timeLeft <= 5 ? "border-red-500 text-red-500 bg-red-50" : "border-[#FF6200] text-[#FF6200] bg-orange-50"
              }`}>
              {timeLeft}
            </motion.div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm mb-3">
            <h2 className="text-base font-bold text-[#333] text-center leading-relaxed">{currentQuestion.text}</h2>
          </div>

          <div className="space-y-2 flex-1">
            {currentQuestion.options.map((option, idx) => {
              const showResult = correctIndex !== null;
              const isCorrect = idx === correctIndex;
              return (
                <div key={idx}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-white font-bold shadow-sm transition-all ${
                    showResult
                      ? isCorrect ? "bg-green-500 ring-2 ring-green-300" : `${ANSWER_COLORS[idx].bg} opacity-40`
                      : ANSWER_COLORS[idx].bg
                  }`}>
                  <span className="w-6 h-6 bg-black/20 rounded-full flex items-center justify-center text-[10px] shrink-0">
                    {showResult && isCorrect ? "✓" : ANSWER_COLORS[idx].icon}
                  </span>
                  <span className="text-xs leading-tight flex-1">{option}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3">
            <div className="w-full h-1.5 bg-gray-200 rounded-full">
              <div className="h-full bg-[#FF6200] rounded-full transition-all duration-300"
                style={{ width: players.length > 0 ? `${(answeredCount / players.length) * 100}%` : "0%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================== HOST REVEAL =====================

  if (phase === "host-reveal" && currentQuestion) {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-white px-4 py-2.5 text-center border-b border-gray-100">
          <span className="text-xs font-bold text-gray-500">Richtige Antwort</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 w-full">
            <h2 className="text-sm font-bold text-[#333] text-center">{currentQuestion.text}</h2>
          </div>
          <div className="space-y-2 w-full">
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className={`p-3 rounded-xl flex items-center gap-3 text-white font-bold transition-all ${
                idx === correctIndex ? "bg-green-500 ring-2 ring-green-300 scale-[1.02]" : "bg-gray-300 opacity-50"
              }`}>
                <span className="w-6 h-6 bg-black/20 rounded-full flex items-center justify-center text-[10px] shrink-0">
                  {idx === correctIndex ? "✓" : ANSWER_COLORS[idx].icon}
                </span>
                <span className="text-xs leading-tight">{option}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-[10px] mt-4">Rangliste wird geladen...</p>
        </div>
      </div>
    );
  }

  // ===================== HOST LEADERBOARD =====================

  if (phase === "host-leaderboard") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-white px-4 py-3 text-center border-b border-gray-100">
          <h2 className="text-base font-bold text-[#333]">Zwischenstand</h2>
          <p className="text-[10px] text-gray-400">Nach Frage {questionIndex + 1}/{totalQuestions}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {leaderboard.slice(0, 8).map((entry, idx) => (
            <motion.div key={entry.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`bg-white p-3 rounded-xl flex items-center justify-between shadow-sm ${
                idx === 0 ? "ring-2 ring-[#FF6200]" : ""
              }`}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  idx === 0 ? "bg-[#FF6200] text-white" :
                  idx === 1 ? "bg-gray-300 text-gray-700" :
                  idx === 2 ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"
                }`}>{idx + 1}</div>
                <span className="text-base">{entry.avatar}</span>
                <div>
                  <span className="font-bold text-[#333] text-xs">{entry.name}</span>
                  {entry.streak >= 2 && <span className="ml-1 text-[8px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded-full">🔥{entry.streak}</span>}
                </div>
              </div>
              <span className="font-bold text-[#333] text-sm">{entry.score}</span>
            </motion.div>
          ))}
          {leaderboard.length > 8 && (
            <div className="text-center text-[10px] text-gray-400">+{leaderboard.length - 8} weitere</div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <button onClick={() => send({ type: "next_question", roomCode })}
            className="w-full bg-[#FF6200] text-white p-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            {isLastQuestion ? (<>Ergebnisse anzeigen <Trophy size={18} /></>) : (<>Nächste Frage <ArrowRight size={18} /></>)}
          </button>
        </div>
      </div>
    );
  }

  // ===================== HOST PODIUM =====================

  if (phase === "host-podium") {
    const sorted = leaderboard.slice(0, 3);
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#FF6200] to-[#FF8533] overflow-hidden">
        <div className="pt-4 pb-2 text-center">
          <Trophy size={32} className="text-white mx-auto mb-1" />
          <h1 className="text-xl font-black text-white">Ergebnisse</h1>
          <div className="mt-1">
            <span className="bg-white/20 text-white text-[9px] font-bold px-3 py-1 rounded-full">
              {selectedTopic?.icon} {selectedTopic?.label} • {players.length} Spieler
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-end justify-center px-6 pb-4">
          <div className="flex items-end gap-2 w-full max-w-xs">
            {sorted[1] && (
              <div className="flex-1 flex flex-col items-center">
                <span className="text-2xl mb-0.5">{sorted[1].avatar}</span>
                <span className="text-white font-bold text-[10px]">{sorted[1].name}</span>
                <span className="text-white/70 text-[9px]">{sorted[1].score} Pt.</span>
                <motion.div initial={{ height: 0 }} animate={{ height: 70 }}
                  className="w-full bg-white/30 rounded-t-xl mt-1 flex items-end justify-center pb-2">
                  <Medal size={18} className="text-gray-300" />
                </motion.div>
              </div>
            )}
            {sorted[0] && (
              <div className="flex-1 flex flex-col items-center z-10">
                <Crown size={22} className="text-yellow-300" fill="currentColor" />
                <span className="text-3xl mb-0.5">{sorted[0].avatar}</span>
                <span className="text-white font-bold text-xs">{sorted[0].name}</span>
                <span className="text-white/80 text-[10px]">{sorted[0].score} Pt.</span>
                <motion.div initial={{ height: 0 }} animate={{ height: 100 }}
                  className="w-full bg-white rounded-t-xl mt-1 flex items-end justify-center pb-2 shadow-lg">
                  <Star size={20} className="text-[#FF6200]" fill="currentColor" />
                </motion.div>
              </div>
            )}
            {sorted[2] && (
              <div className="flex-1 flex flex-col items-center">
                <span className="text-2xl mb-0.5">{sorted[2].avatar}</span>
                <span className="text-white font-bold text-[10px]">{sorted[2].name}</span>
                <span className="text-white/70 text-[9px]">{sorted[2].score} Pt.</span>
                <motion.div initial={{ height: 0 }} animate={{ height: 50 }}
                  className="w-full bg-white/30 rounded-t-xl mt-1 flex items-end justify-center pb-2">
                  <Medal size={18} className="text-amber-600" />
                </motion.div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 pb-5">
          <button onClick={resetGame} className="w-full bg-white text-[#FF6200] p-3.5 rounded-xl font-bold text-sm">
            Neues Quiz starten
          </button>
        </div>
      </div>
    );
  }

  // ===================== PLAYER JOIN =====================

  if (phase === "player-join") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <ScreenHeader title="Quiz beitreten" onBack={resetGame} />
        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1.5">Game Code</label>
              <input type="text" placeholder="ABCDEF" value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="w-full bg-gray-50 text-center text-2xl font-black p-3 rounded-xl border-2 border-gray-200 focus:border-[#FF6200] outline-none uppercase tracking-[0.2em]"
                maxLength={6} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1.5">Dein Name</label>
              <input type="text" placeholder="Max" value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-gray-50 text-center text-lg font-bold p-3 rounded-xl border-2 border-gray-200 focus:border-[#FF6200] outline-none"
                maxLength={20} />
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button onClick={() => {
              if (!joinCode.trim() || !playerName.trim()) {
                setError("Bitte Code und Name eingeben.");
                return;
              }
              setError("");
              send({ type: "join_room", code: joinCode.toUpperCase(), name: playerName.trim(), avatar: playerAvatar });
            }}
              disabled={!connected}
              className="w-full bg-[#FF6200] text-white p-3.5 rounded-xl font-bold text-sm disabled:opacity-50">
              Beitreten
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===================== PLAYER LOBBY =====================

  if (phase === "player-lobby") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] items-center justify-center p-6 text-center">
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="w-20 h-20 bg-[#FF6200] rounded-full flex items-center justify-center mb-4">
          <Sparkles size={40} className="text-white" />
        </motion.div>
        <span className="text-3xl mb-2">{playerAvatar}</span>
        <h2 className="text-lg font-bold text-[#333] mb-1">{playerName}</h2>
        <p className="text-gray-500 text-xs mb-3">Warte bis das Quiz startet...</p>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm">
          <span className="text-[#FF6200] font-bold text-xs">{playerCount} Spieler im Raum</span>
        </div>
        {playerTopic && <span className="text-[10px] text-gray-400 mt-2">{playerTopic}</span>}
      </div>
    );
  }

  // ===================== PLAYER QUESTION =====================

  if (phase === "player-question" && currentQuestion) {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
        <div className="bg-white px-4 py-2.5 flex items-center justify-between shadow-sm">
          <span className="text-xs font-bold text-gray-500">Frage {questionIndex + 1}/{totalQuestions}</span>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${
            timeLeft <= 5 ? "bg-red-100 text-red-600" : "bg-[#FF6200]/10 text-[#FF6200]"
          }`}>{timeLeft}</div>
        </div>
        <div className="bg-white px-4 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-[#333] text-center leading-snug">{currentQuestion.text}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentQuestion.options.map((option, idx) => (
            <motion.button key={idx} whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (selectedAnswer !== null) return;
                setSelectedAnswer(idx);
                send({ type: "submit_answer", answerIndex: idx });
                setPhase("player-waiting");
              }}
              className={`w-full p-3.5 rounded-xl shadow-sm text-white font-bold text-left flex items-center gap-3 ${ANSWER_COLORS[idx].bg}`}>
              <span className="w-7 h-7 bg-black/20 rounded-full flex items-center justify-center text-xs shrink-0">
                {ANSWER_COLORS[idx].icon}
              </span>
              <span className="text-xs leading-snug flex-1">{option}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ===================== PLAYER WAITING =====================

  if (phase === "player-waiting") {
    return (
      <div className="flex-1 flex flex-col bg-[#F3F3F3] items-center justify-center p-6 text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-[3px] border-[#FF6200] border-t-transparent rounded-full mb-4" />
        <h2 className="text-base font-bold text-[#333]">Antwort abgeschickt!</h2>
        <p className="text-gray-500 text-xs">Warte auf die anderen...</p>
      </div>
    );
  }

  // ===================== PLAYER FEEDBACK =====================

  if (phase === "player-feedback") {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-6 ${lastCorrect ? "bg-green-500" : "bg-red-500"}`}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
          {lastCorrect ? <Check size={48} className="text-white" /> : <X size={48} className="text-white" />}
        </motion.div>
        <h2 className="text-2xl font-black text-white mb-1">{lastCorrect ? "Richtig!" : "Falsch!"}</h2>
        <p className="text-white/80 text-base font-bold mb-3">
          {lastCorrect ? `+${lastPoints} Punkte` : "Nächstes Mal!"}
        </p>
        {lastStreak >= 2 && lastCorrect && (
          <div className="bg-white/20 px-3 py-1.5 rounded-full mb-3">
            <span className="text-white font-bold text-xs">🔥 {lastStreak}er Streak!</span>
          </div>
        )}
        <div className="bg-white/10 px-4 py-2 rounded-xl">
          <span className="text-white/80 text-[10px]">Gesamt: {totalScore} Pt. — Platz {rank}</span>
        </div>
      </div>
    );
  }

  // ===================== PLAYER RESULT =====================

  if (phase === "player-result") {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#FF6200] to-[#FF8533] items-center justify-center p-6 text-center">
        <Trophy size={40} className="text-yellow-300 mb-2" fill="currentColor" />
        <h1 className="text-2xl font-black text-white mb-2">Geschafft!</h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 w-full mb-4">
          <span className="text-4xl block mb-1">{playerAvatar}</span>
          <div className="text-3xl font-black text-white">{totalScore}</div>
          <div className="text-white/80 text-xs">Punkte</div>
          <div className="text-white/60 text-[10px] mt-1">Platz {rank} von {podium.length}</div>
        </div>

        {podium.slice(0, 3).length > 0 && (
          <div className="bg-white/10 rounded-xl p-3 w-full mb-4">
            {podium.slice(0, 3).map((p) => (
              <div key={p.rank} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/60">{p.rank}.</span>
                  <span className="text-sm">{p.avatar}</span>
                  <span className="text-white font-bold text-xs">{p.name}</span>
                </div>
                <span className="text-white/80 text-xs">{p.score}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={resetGame}
          className="w-full bg-white text-[#FF6200] p-3.5 rounded-xl font-bold text-sm">
          Zurück
        </button>
      </div>
    );
  }

  return null;
}
