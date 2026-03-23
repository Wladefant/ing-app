import { useState, useEffect, useCallback, useRef } from "react";
import { useKahootSocket } from "@/lib/kahoot-client";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Users,
  Crown,
  Medal,
  Star,
  Play,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";

// ── Constants ───────────────────────────────────────────────────────────────

const QUIZ_TOPICS = [
  {
    label: "Aktien & Börse",
    icon: "📈",
    topic: "Aktien und Börse",
    context: "Grundlagen des Aktienmarkts",
  },
  {
    label: "Sparen & Budget",
    icon: "💰",
    topic: "Sparen und Budgetplanung",
    context: "Wie man als Jugendlicher spart",
  },
  {
    label: "Krypto & Blockchain",
    icon: "⛓️",
    topic: "Kryptowährungen und Blockchain",
    context: "Grundlagen für Einsteiger",
  },
  {
    label: "Versicherungen",
    icon: "🛡️",
    topic: "Versicherungen",
    context: "Wichtige Versicherungen für junge Menschen",
  },
  {
    label: "Steuern & Gehalt",
    icon: "📋",
    topic: "Steuern und Einkommen",
    context: "Erster Job und Steuererklärung",
  },
  {
    label: "Investieren",
    icon: "🎯",
    topic: "Investieren und Geldanlage",
    context: "ETFs, Fonds und langfristiger Vermögensaufbau",
  },
];

const ANSWER_COLORS = [
  { bg: "#FF6200", icon: "▲" },
  { bg: "#00A4CC", icon: "◆" },
  { bg: "#8B5CF6", icon: "●" },
  { bg: "#10B981", icon: "■" },
];

// ── Types ───────────────────────────────────────────────────────────────────

type Phase =
  | "topic-select"
  | "lobby"
  | "question"
  | "reveal"
  | "leaderboard"
  | "podium";

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

interface ResultEntry {
  playerId: string;
  name: string;
  correct: boolean;
  scoreGained: number;
  streak: number;
  totalScore: number;
}

// ── Component ───────────────────────────────────────────────────────────────

export function KahootHostPage() {
  const { connected, send, onMessage } = useKahootSocket();

  // Game state
  const [phase, setPhase] = useState<Phase>("topic-select");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [questionsReady, setQuestionsReady] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  // Question state
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);

  // Result state
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [results, setResults] = useState<ResultEntry[]>([]);

  // Podium state
  const [podium, setPodium] = useState<LeaderboardEntry[]>([]);

  // Reveal auto-transition timer
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── WebSocket message handler ───────────────────────────────────────────

  useEffect(() => {
    const cleanup = onMessage((msg) => {
      switch (msg.type) {
        case "room_created": {
          setRoomCode(msg.code as string);
          setPhase("lobby");
          break;
        }

        case "player_joined": {
          const playerList = msg.players as PlayerInfo[];
          setPlayers(playerList);
          break;
        }

        case "player_left": {
          const playerList = msg.players as PlayerInfo[];
          setPlayers(playerList);
          break;
        }

        case "questions_ready": {
          setQuestionsReady(true);
          setQuestionCount(msg.count as number);
          break;
        }

        case "question": {
          const q = msg.question as QuestionData;
          setCurrentQuestion(q);
          setQuestionIndex(msg.questionIndex as number);
          setTotalQuestions(msg.totalQuestions as number);
          setTimeLeft(q.timeLimit);
          setAnsweredCount(0);
          setTotalPlayers(players.length);
          setCorrectIndex(null);
          setPhase("question");
          break;
        }

        case "timer_tick": {
          setTimeLeft(msg.remaining as number);
          break;
        }

        case "answer_count": {
          setAnsweredCount(msg.count as number);
          setTotalPlayers(msg.total as number);
          break;
        }

        case "question_result": {
          setCorrectIndex(msg.correctIndex as number);
          setLeaderboard(msg.leaderboard as LeaderboardEntry[]);
          setResults(msg.results as ResultEntry[]);
          setPhase("reveal");

          // Auto-transition to leaderboard after 3 seconds
          if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
          revealTimerRef.current = setTimeout(() => {
            setPhase("leaderboard");
          }, 3000);
          break;
        }

        case "game_over": {
          setPodium(msg.podium as LeaderboardEntry[]);
          setPhase("podium");

          // Fire confetti
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.6 },
              colors: ["#FF6200", "#00A4CC", "#FFD700", "#10B981"],
            });
          }, 500);
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 120,
              origin: { y: 0.5 },
              colors: ["#FF6200", "#00A4CC", "#FFD700", "#10B981"],
            });
          }, 1500);
          break;
        }

        case "error": {
          console.error("[KahootHost] Server error:", msg.message);
          break;
        }
      }
    });

    return () => {
      cleanup();
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, [onMessage, players.length]);

  // ── Actions ─────────────────────────────────────────────────────────────

  const handleCreateRoom = useCallback(() => {
    if (selectedTopic === null) return;
    const topic = QUIZ_TOPICS[selectedTopic];
    send({ type: "create_room", topic: topic.topic, context: topic.context });
  }, [selectedTopic, send]);

  const handleStartGame = useCallback(() => {
    send({ type: "start_game", roomCode });
  }, [send, roomCode]);

  const handleNextQuestion = useCallback(() => {
    send({ type: "next_question", roomCode });
  }, [send, roomCode]);

  const handleNewGame = useCallback(() => {
    setPhase("topic-select");
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
    setResults([]);
    setPodium([]);
  }, []);

  const isLastQuestion =
    totalQuestions > 0 && questionIndex >= totalQuestions - 1;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "topic-select" && (
          <TopicSelectPhase
            key="topic-select"
            connected={connected}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            onCreateRoom={handleCreateRoom}
          />
        )}

        {phase === "lobby" && (
          <LobbyPhase
            key="lobby"
            roomCode={roomCode}
            players={players}
            questionsReady={questionsReady}
            questionCount={questionCount}
            onStartGame={handleStartGame}
          />
        )}

        {(phase === "question" || phase === "reveal") && currentQuestion && (
          <QuestionPhase
            key={`question-${questionIndex}`}
            question={currentQuestion}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            timeLeft={timeLeft}
            answeredCount={answeredCount}
            totalPlayers={totalPlayers}
            correctIndex={correctIndex}
            isReveal={phase === "reveal"}
            playerCount={players.length}
            topicLabel={
              selectedTopic !== null
                ? QUIZ_TOPICS[selectedTopic].label
                : "Quiz"
            }
          />
        )}

        {phase === "leaderboard" && (
          <LeaderboardPhase
            key="leaderboard"
            leaderboard={leaderboard}
            results={results}
            isLastQuestion={isLastQuestion}
            onNext={handleNextQuestion}
          />
        )}

        {phase === "podium" && (
          <PodiumPhase
            key="podium"
            podium={podium}
            onNewGame={handleNewGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Topic Select Phase ──────────────────────────────────────────────────────

function TopicSelectPhase({
  connected,
  selectedTopic,
  onSelectTopic,
  onCreateRoom,
}: {
  connected: boolean;
  selectedTopic: number | null;
  onSelectTopic: (index: number) => void;
  onCreateRoom: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-5xl">🦁</span>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#FF6200] to-[#FFB800] bg-clip-text text-transparent">
          LEO Quiz Battle
        </h1>
      </div>
      <p className="text-xl text-gray-400 mb-12">
        Wähle ein Thema für das Quiz
      </p>

      <div className="grid grid-cols-3 gap-4 max-w-3xl w-full mb-10">
        {QUIZ_TOPICS.map((t, i) => (
          <motion.button
            key={t.topic}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectTopic(i)}
            className={`p-6 rounded-2xl text-left transition-all ${
              selectedTopic === i
                ? "bg-[#FF6200] ring-4 ring-[#FFB800]/50 shadow-lg shadow-[#FF6200]/30"
                : "bg-white/10 hover:bg-white/15"
            }`}
          >
            <span className="text-4xl block mb-3">{t.icon}</span>
            <span className="text-lg font-semibold block">{t.label}</span>
            <span className="text-sm text-gray-300 mt-1 block">
              {t.context}
            </span>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={selectedTopic === null || !connected}
        onClick={onCreateRoom}
        className="px-10 py-4 bg-[#FF6200] rounded-full text-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-[#FF6200]/30"
      >
        {!connected ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Verbinde...
          </span>
        ) : (
          "Quiz erstellen"
        )}
      </motion.button>
    </motion.div>
  );
}

// ── Lobby Phase ─────────────────────────────────────────────────────────────

function LobbyPhase({
  roomCode,
  players,
  questionsReady,
  questionCount,
  onStartGame,
}: {
  roomCode: string;
  players: PlayerInfo[];
  questionsReady: boolean;
  questionCount: number;
  onStartGame: () => void;
}) {
  const joinUrl = `${window.location.origin}/kahoot/join/${roomCode}`;
  const canStart = players.length > 0 && questionsReady;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦁</span>
          <span className="text-2xl font-bold text-[#FF6200]">
            LEO Quiz Battle
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-5 h-5" />
            <span className="text-lg">{players.length} Spieler</span>
          </div>
          {questionsReady && (
            <span className="text-sm text-green-400">
              {questionCount} Fragen bereit
            </span>
          )}
          {!questionsReady && (
            <span className="text-sm text-yellow-400 flex items-center gap-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Fragen werden generiert...
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center gap-16 px-8">
        {/* Left: QR + Code */}
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-2xl">
            <QRCodeSVG value={joinUrl} size={200} />
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Raum-Code:</p>
            <p className="text-6xl font-mono font-bold tracking-[0.3em] text-[#FF6200]">
              {roomCode}
            </p>
          </div>
          <p className="text-gray-500 text-sm max-w-xs text-center">
            Scanne den QR-Code oder gehe zu{" "}
            <span className="text-gray-300">{joinUrl}</span>
          </p>
        </div>

        {/* Right: Player grid */}
        <div className="flex-1 max-w-xl">
          {players.length === 0 ? (
            <div className="text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl">Warte auf Spieler...</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              <AnimatePresence>
                {players.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="bg-white/10 rounded-xl p-3 text-center"
                  >
                    <span className="text-3xl block">{p.avatar}</span>
                    <span className="text-sm font-medium mt-1 block truncate">
                      {p.name}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Start button */}
      <div className="p-8 flex justify-center">
        <motion.button
          whileHover={canStart ? { scale: 1.05 } : {}}
          whileTap={canStart ? { scale: 0.95 } : {}}
          disabled={!canStart}
          onClick={onStartGame}
          className="px-12 py-4 bg-[#FF6200] rounded-full text-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3 transition-all hover:shadow-lg hover:shadow-[#FF6200]/30"
        >
          <Play className="w-6 h-6" />
          Quiz starten
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Question Phase ──────────────────────────────────────────────────────────

function QuestionPhase({
  question,
  questionIndex,
  totalQuestions,
  timeLeft,
  answeredCount,
  totalPlayers,
  correctIndex,
  isReveal,
  playerCount,
  topicLabel,
}: {
  question: QuestionData;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  answeredCount: number;
  totalPlayers: number;
  correctIndex: number | null;
  isReveal: boolean;
  playerCount: number;
  topicLabel: string;
}) {
  const timerFraction =
    question.timeLimit > 0 ? timeLeft / question.timeLimit : 0;
  const timerColor =
    timeLeft <= 5 ? "#f44336" : timeLeft <= 10 ? "#FFB800" : "#4caf50";
  const circumference = 2 * Math.PI * 54;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Top bar */}
      <div className="p-4 flex items-center justify-between bg-black/30">
        <span className="text-gray-300">{topicLabel}</span>
        <span className="text-gray-300 font-medium">
          Frage {questionIndex + 1} / {totalQuestions}
        </span>
        <div className="flex items-center gap-2 text-gray-300">
          <Users className="w-4 h-4" />
          <span>{playerCount}</span>
        </div>
      </div>

      {/* Center: Timer + Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Timer circle */}
        <div className="relative w-32 h-32 mb-8">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={isReveal ? "#4caf50" : timerColor}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={
                isReveal ? 0 : circumference * (1 - timerFraction)
              }
              style={{ transition: "stroke-dashoffset 0.5s linear" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
            {isReveal ? "✓" : timeLeft}
          </span>
        </div>

        {/* Question card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl w-full text-center mb-8">
          <h2 className="text-3xl font-bold leading-snug">{question.text}</h2>
        </div>

        {/* Progress bar */}
        {!isReveal && totalPlayers > 0 && (
          <div className="w-full max-w-md mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Antworten</span>
              <span>
                {answeredCount} / {totalPlayers}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FF6200] rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(answeredCount / totalPlayers) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Answer grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {question.options.map((opt, i) => {
          const color = ANSWER_COLORS[i];
          const isCorrect = correctIndex === i;
          const isDimmed = isReveal && correctIndex !== null && !isCorrect;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isDimmed ? 0.3 : 1,
                y: 0,
                scale: isReveal && isCorrect ? 1.03 : 1,
              }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-5 flex items-center gap-4"
              style={{
                backgroundColor: isReveal && isCorrect ? "#4caf50" : color.bg,
              }}
            >
              <span className="text-2xl font-bold opacity-60">
                {color.icon}
              </span>
              <span className="text-xl font-semibold">{opt}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Leaderboard Phase ───────────────────────────────────────────────────────

function LeaderboardPhase({
  leaderboard,
  results,
  isLastQuestion,
  onNext,
}: {
  leaderboard: LeaderboardEntry[];
  results: ResultEntry[];
  isLastQuestion: boolean;
  onNext: () => void;
}) {
  const top10 = leaderboard.slice(0, 10);

  /** Get the score delta for a player from the results */
  function getScoreDelta(playerId: string): number {
    const r = results.find((x) => x.playerId === playerId);
    return r?.scoreGained ?? 0;
  }

  function getRankBadge(rank: number) {
    if (rank === 1)
      return <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3)
      return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
    return (
      <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">
        {rank}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-8"
    >
      <h2 className="text-4xl font-bold mb-10">Rangliste</h2>

      <div className="w-full max-w-xl space-y-2">
        {top10.map((entry, i) => {
          const delta = getScoreDelta(entry.id);
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 bg-white/10 rounded-xl px-5 py-3"
            >
              {getRankBadge(entry.rank)}
              <span className="text-2xl">{entry.avatar}</span>
              <span className="flex-1 text-lg font-medium">{entry.name}</span>
              {delta > 0 && (
                <span className="text-green-400 text-sm font-medium">
                  +{delta}
                </span>
              )}
              <span className="text-xl font-bold text-[#FF6200]">
                {entry.score.toLocaleString()}
              </span>
              {entry.streak >= 2 && (
                <span className="text-sm text-yellow-400">
                  🔥{entry.streak}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="mt-10 px-10 py-4 bg-[#FF6200] rounded-full text-xl font-bold hover:shadow-lg hover:shadow-[#FF6200]/30 transition-all"
      >
        {isLastQuestion ? (
          <span className="flex items-center gap-2">
            Ergebnisse anzeigen <Trophy className="w-5 h-5" />
          </span>
        ) : (
          "Nächste Frage →"
        )}
      </motion.button>
    </motion.div>
  );
}

// ── Podium Phase ────────────────────────────────────────────────────────────

function PodiumPhase({
  podium,
  onNewGame,
}: {
  podium: LeaderboardEntry[];
  onNewGame: () => void;
}) {
  const first = podium[0];
  const second = podium[1];
  const third = podium[2];

  const podiumEntries = [
    { entry: second, rank: 2, height: "h-32", delay: 0.3 },
    { entry: first, rank: 1, height: "h-48", delay: 0 },
    { entry: third, rank: 3, height: "h-24", delay: 0.5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mb-4"
      >
        <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
      </motion.div>

      <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-yellow-400 to-[#FF6200] bg-clip-text text-transparent">
        Ergebnisse
      </h2>

      {/* Podium bars */}
      <div className="flex items-end gap-6 mb-12">
        {podiumEntries.map(({ entry, rank, height, delay }) => {
          if (!entry) return <div key={rank} className="w-36" />;
          return (
            <motion.div
              key={rank}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, type: "spring" }}
              className="flex flex-col items-center"
            >
              <span className="text-5xl mb-2">{entry.avatar}</span>
              <span className="text-lg font-bold mb-1">{entry.name}</span>
              <span className="text-[#FF6200] font-bold text-xl mb-3">
                {entry.score.toLocaleString()}
              </span>
              <div
                className={`w-36 ${height} rounded-t-xl flex items-start justify-center pt-4 ${
                  rank === 1
                    ? "bg-gradient-to-t from-yellow-500 to-yellow-400"
                    : rank === 2
                      ? "bg-gradient-to-t from-gray-400 to-gray-300"
                      : "bg-gradient-to-t from-amber-700 to-amber-600"
                }`}
              >
                <span className="text-3xl font-bold text-white/90">
                  {rank === 1 && <Crown className="w-10 h-10" />}
                  {rank === 2 && <Star className="w-8 h-8" />}
                  {rank === 3 && <Medal className="w-8 h-8" />}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats summary */}
      <div className="flex gap-8 mb-10 text-center">
        <div>
          <p className="text-3xl font-bold text-[#FF6200]">{podium.length}</p>
          <p className="text-gray-400 text-sm">Spieler</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-[#FF6200]">
            {first?.score.toLocaleString() ?? 0}
          </p>
          <p className="text-gray-400 text-sm">Höchste Punktzahl</p>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNewGame}
        className="px-10 py-4 bg-[#FF6200] rounded-full text-xl font-bold hover:shadow-lg hover:shadow-[#FF6200]/30 transition-all"
      >
        Neues Quiz starten
      </motion.button>
    </motion.div>
  );
}
