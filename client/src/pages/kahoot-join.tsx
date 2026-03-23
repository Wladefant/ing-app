import { useState, useEffect, useRef } from "react";
import { useKahootSocket } from "@/lib/kahoot-client";
import { useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, Trophy, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

// ── Types ───────────────────────────────────────────────────────────────────

type Phase = "join" | "lobby" | "question" | "waiting" | "feedback" | "result";

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

// ── Constants ───────────────────────────────────────────────────────────────

const ANSWER_COLORS = ["#FF6200", "#00A4CC", "#8B5CF6", "#10B981"];

const AVATARS = ["🦁", "🐯", "🦊", "🐻", "🐼", "🐸", "🐵", "🦄", "🐲", "🦅"];

// ── Component ───────────────────────────────────────────────────────────────

export function KahootJoinPage() {
  const { connected, send, onMessage } = useKahootSocket();
  const [, params] = useRoute("/kahoot/join/:code?");

  // Join state
  const [phase, setPhase] = useState<Phase>("join");
  const [roomCode, setRoomCode] = useState(params?.code?.toUpperCase() ?? "");
  const [playerName, setPlayerName] = useState("");
  const [avatar] = useState(
    () => AVATARS[Math.floor(Math.random() * AVATARS.length)]
  );
  const [error, setError] = useState("");

  // Lobby state
  const [topic, setTopic] = useState("");
  const [playerCount, setPlayerCount] = useState(0);

  // Question state
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Feedback state
  const [correct, setCorrect] = useState(false);
  const [scoreGained, setScoreGained] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [rank, setRank] = useState(0);

  // Result state
  const [podium, setPodium] = useState<LeaderboardEntry[]>([]);
  const [myPlayerId, setMyPlayerId] = useState("");

  // Ref for auto-advancing from feedback
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── WebSocket message handler ───────────────────────────────────────────

  useEffect(() => {
    const cleanup = onMessage((msg) => {
      switch (msg.type) {
        case "joined": {
          setMyPlayerId(msg.playerId as string);
          setTopic(msg.topic as string);
          setPhase("lobby");
          setError("");
          break;
        }

        case "error": {
          setError(msg.message as string);
          break;
        }

        case "player_joined": {
          const players = msg.players as Array<Record<string, unknown>>;
          setPlayerCount(players.length);
          break;
        }

        case "player_left": {
          const players = msg.players as Array<Record<string, unknown>>;
          setPlayerCount(players.length);
          break;
        }

        case "question": {
          const q = msg.question as QuestionData;
          setCurrentQuestion(q);
          setQuestionIndex(msg.questionIndex as number);
          setTotalQuestions(msg.totalQuestions as number);
          setTimeLeft(q.timeLimit);
          setSelectedAnswer(null);
          setPhase("question");
          break;
        }

        case "timer_tick": {
          setTimeLeft(msg.remaining as number);
          break;
        }

        case "your_result": {
          setCorrect(msg.correct as boolean);
          setScoreGained(msg.scoreGained as number);
          setStreak(msg.streak as number);
          setTotalScore(msg.totalScore as number);

          // Derive rank from leaderboard
          const lb = msg.leaderboard as LeaderboardEntry[];
          const myEntry = lb.find((e) => e.id === myPlayerId);
          setRank(myEntry?.rank ?? lb.length);

          setPhase("feedback");

          // Clear any existing timer
          if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
          break;
        }

        case "game_over": {
          const finalPodium = msg.podium as LeaderboardEntry[];
          setPodium(finalPodium);

          // Get final rank
          const me = finalPodium.find((e) => e.id === myPlayerId);
          if (me) {
            setTotalScore(me.score);
            setRank(me.rank);
          }

          setPhase("result");

          // Fire confetti for top 3
          if (me && me.rank <= 3) {
            setTimeout(() => {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ["#FF6200", "#00A4CC", "#FFD700", "#10B981"],
              });
            }, 400);
          }
          break;
        }

        case "host_disconnected": {
          setPhase("join");
          setError("Der Host hat das Spiel verlassen.");
          break;
        }
      }
    });

    return () => {
      cleanup();
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, [onMessage, myPlayerId]);

  // ── Actions ─────────────────────────────────────────────────────────────

  function handleJoin() {
    if (!roomCode.trim() || !playerName.trim()) return;
    setError("");
    send({
      type: "join_room",
      code: roomCode.toUpperCase(),
      name: playerName.trim(),
      avatar,
    });
  }

  function handleSubmitAnswer(answerIndex: number) {
    if (selectedAnswer !== null) return; // prevent double submit
    setSelectedAnswer(answerIndex);
    send({ type: "submit_answer", answerIndex });
    setPhase("waiting");
  }

  function handlePlayAgain() {
    setPhase("join");
    setRoomCode("");
    setPlayerName("");
    setError("");
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setPodium([]);
    setTotalScore(0);
    setStreak(0);
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#1f1f1f] flex flex-col">
      <AnimatePresence mode="wait">
        {phase === "join" && (
          <JoinPhase
            key="join"
            connected={connected}
            roomCode={roomCode}
            playerName={playerName}
            avatar={avatar}
            error={error}
            onRoomCodeChange={setRoomCode}
            onPlayerNameChange={setPlayerName}
            onJoin={handleJoin}
          />
        )}

        {phase === "lobby" && (
          <LobbyPhase
            key="lobby"
            avatar={avatar}
            playerName={playerName}
            topic={topic}
            playerCount={playerCount}
          />
        )}

        {phase === "question" && currentQuestion && (
          <QuestionPhase
            key={`q-${questionIndex}`}
            question={currentQuestion}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            timeLeft={timeLeft}
            onAnswer={handleSubmitAnswer}
          />
        )}

        {phase === "waiting" && (
          <WaitingPhase key="waiting" />
        )}

        {phase === "feedback" && (
          <FeedbackPhase
            key="feedback"
            correct={correct}
            scoreGained={scoreGained}
            streak={streak}
            totalScore={totalScore}
          />
        )}

        {phase === "result" && (
          <ResultPhase
            key="result"
            podium={podium}
            totalScore={totalScore}
            rank={rank}
            myPlayerId={myPlayerId}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Join Phase ──────────────────────────────────────────────────────────────

function JoinPhase({
  connected,
  roomCode,
  playerName,
  avatar,
  error,
  onRoomCodeChange,
  onPlayerNameChange,
  onJoin,
}: {
  connected: boolean;
  roomCode: string;
  playerName: string;
  avatar: string;
  error: string;
  onRoomCodeChange: (v: string) => void;
  onPlayerNameChange: (v: string) => void;
  onJoin: () => void;
}) {
  const canJoin = connected && roomCode.trim().length >= 4 && playerName.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex items-center justify-center p-6"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-2">🦁</span>
          <h1 className="text-2xl font-bold text-[#FF6200]">LEO Quiz Battle</h1>
          <p className="text-sm text-[#666666] mt-1">Tritt einem Quiz bei!</p>
        </div>

        {/* Connection status */}
        <div className="flex items-center justify-center gap-2 mb-6 text-sm">
          <span
            className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-[#666666]">
            {connected ? "Verbunden" : "Verbinde..."}
          </span>
        </div>

        {/* Room code input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#666666] mb-1">
            Raum-Code
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) =>
              onRoomCodeChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
            }
            maxLength={6}
            placeholder="ABCD12"
            className="w-full text-center text-3xl font-mono font-bold tracking-[0.3em] uppercase px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF6200] focus:outline-none transition-colors"
          />
        </div>

        {/* Name input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#666666] mb-1">
            Dein Name
          </label>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{avatar}</span>
            <input
              type="text"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              maxLength={20}
              placeholder="Name eingeben"
              className="flex-1 text-lg px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF6200] focus:outline-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && canJoin) onJoin();
              }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm text-center mb-4"
          >
            {error}
          </motion.p>
        )}

        {/* Join button */}
        <motion.button
          whileHover={canJoin ? { scale: 1.02 } : {}}
          whileTap={canJoin ? { scale: 0.98 } : {}}
          disabled={!canJoin}
          onClick={onJoin}
          className="w-full py-4 bg-[#FF6200] text-white text-lg font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {!connected ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Verbinde...
            </span>
          ) : (
            "Beitreten"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Lobby Phase ─────────────────────────────────────────────────────────────

function LobbyPhase({
  avatar,
  playerName,
  topic,
  playerCount,
}: {
  avatar: string;
  playerName: string;
  topic: string;
  playerCount: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center"
    >
      {/* Pulsing avatar circle */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-32 h-32 rounded-full bg-[#FF6200]/10 flex items-center justify-center mb-6"
      >
        <span className="text-6xl">{avatar}</span>
      </motion.div>

      <h2 className="text-2xl font-bold mb-1">{playerName}</h2>
      <p className="text-[#666666] mb-6">Thema: {topic}</p>

      <div className="flex items-center gap-2 text-[#FF6200] mb-8">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-lg font-medium">Warte auf Start...</span>
      </div>

      <div className="bg-white rounded-xl px-6 py-3 shadow-sm">
        <span className="text-[#666666] text-sm">Spieler im Raum: </span>
        <span className="text-[#FF6200] font-bold text-lg">{playerCount}</span>
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
  onAnswer,
}: {
  question: QuestionData;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  onAnswer: (index: number) => void;
}) {
  const timerFraction =
    question.timeLimit > 0 ? timeLeft / question.timeLimit : 0;
  const timerColor =
    timeLeft <= 5 ? "#f44336" : timeLeft <= 10 ? "#FFB800" : "#4caf50";
  const circumference = 2 * Math.PI * 22;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <span className="text-sm font-medium text-[#666666]">
          Frage {questionIndex + 1}/{totalQuestions}
        </span>
        {/* Mini timer circle */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="#e5e7eb"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke={timerColor}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - timerFraction)}
              style={{ transition: "stroke-dashoffset 0.5s linear" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Question text */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-center leading-snug">
          {question.text}
        </h2>
      </div>

      {/* Answer buttons (stacked for mobile) */}
      <div className="flex-1 flex flex-col gap-3 px-4 pb-6">
        {question.options.map((opt, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAnswer(i)}
            className="flex-1 min-h-[60px] rounded-xl px-5 py-4 text-white text-lg font-semibold text-left transition-transform active:scale-[0.97]"
            style={{ backgroundColor: ANSWER_COLORS[i] }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Waiting Phase ───────────────────────────────────────────────────────────

function WaitingPhase() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center"
    >
      <Loader2 className="w-16 h-16 text-[#FF6200] animate-spin mb-6" />
      <h2 className="text-2xl font-bold mb-2">Antwort abgeschickt!</h2>
      <p className="text-[#666666] text-lg">Warte auf andere Spieler...</p>
    </motion.div>
  );
}

// ── Feedback Phase ──────────────────────────────────────────────────────────

function FeedbackPhase({
  correct,
  scoreGained,
  streak,
  totalScore,
}: {
  correct: boolean;
  scoreGained: number;
  streak: number;
  totalScore: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center text-white"
      style={{
        backgroundColor: correct ? "#4caf50" : "#f44336",
      }}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6"
      >
        {correct ? (
          <Check className="w-14 h-14" />
        ) : (
          <X className="w-14 h-14" />
        )}
      </motion.div>

      <h2 className="text-3xl font-bold mb-2">
        {correct ? "Richtig!" : "Leider falsch"}
      </h2>

      {scoreGained > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2"
        >
          +{scoreGained} Punkte
        </motion.p>
      )}

      {streak >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-bold">
            {streak}er Streak!
          </span>
        </motion.div>
      )}

      <p className="text-white/80 text-lg mt-4">
        Gesamt: {totalScore.toLocaleString()} Punkte
      </p>
    </motion.div>
  );
}

// ── Result Phase ────────────────────────────────────────────────────────────

function ResultPhase({
  podium,
  totalScore,
  rank,
  myPlayerId,
  onPlayAgain,
}: {
  podium: LeaderboardEntry[];
  totalScore: number;
  rank: number;
  myPlayerId: string;
  onPlayAgain: () => void;
}) {
  const top3 = podium.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-white"
      style={{
        background: "linear-gradient(135deg, #FF6200 0%, #FFB800 100%)",
      }}
    >
      {/* Trophy */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <Trophy className="w-16 h-16 text-white mb-4" />
      </motion.div>

      <h2 className="text-3xl font-bold mb-1">Spiel beendet!</h2>
      <p className="text-white/80 text-lg mb-6">
        Platz {rank} von {podium.length}
      </p>

      {/* Score */}
      <div className="bg-white/20 rounded-2xl px-8 py-4 mb-8 text-center">
        <p className="text-4xl font-bold">{totalScore.toLocaleString()}</p>
        <p className="text-white/70 text-sm">Punkte</p>
      </div>

      {/* Mini podium */}
      {top3.length > 0 && (
        <div className="w-full max-w-xs space-y-2 mb-8">
          {top3.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                entry.id === myPlayerId ? "bg-white/30" : "bg-white/15"
              }`}
            >
              <span className="text-lg font-bold w-6 text-center">
                {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
              </span>
              <span className="text-xl">{entry.avatar}</span>
              <span className="flex-1 font-medium truncate">{entry.name}</span>
              <span className="font-bold">
                {entry.score.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayAgain}
        className="px-8 py-4 bg-white text-[#FF6200] text-lg font-bold rounded-xl shadow-lg transition-all"
      >
        Nochmal spielen
      </motion.button>
    </motion.div>
  );
}
