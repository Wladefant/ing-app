import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { getOpenAIClient } from "./routes";

// ── Types ──────────────────────────────────────────────────────────────────

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  ws: WebSocket;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
}

type RoomPhase = "lobby" | "question" | "leaderboard" | "finished";

interface Room {
  code: string;
  hostWs: WebSocket;
  players: Map<string, Player>;
  questions: Question[];
  currentQuestionIndex: number;
  phase: RoomPhase;
  /** Map of playerId → chosen option index for current question */
  answers: Map<string, { answerIndex: number; timestamp: number }>;
  questionStartTime: number;
  timer: ReturnType<typeof setInterval> | null;
  topic: string;
}

// ── Fallback questions ─────────────────────────────────────────────────────

const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Was ist ein ETF?",
    options: [
      "Ein börsengehandelter Fonds",
      "Ein Bankkonto mit Zinsen",
      "Eine Kryptowährung",
      "Ein Versicherungsprodukt",
    ],
    correctIndex: 0,
    timeLimit: 20,
  },
  {
    id: 2,
    text: "Was bedeutet Inflation?",
    options: [
      "Die Preise steigen und Geld verliert an Kaufkraft",
      "Die Preise sinken dauerhaft",
      "Zinsen werden erhöht",
      "Aktien steigen im Wert",
    ],
    correctIndex: 0,
    timeLimit: 20,
  },
  {
    id: 3,
    text: "Was ist der Zinseszins-Effekt?",
    options: [
      "Zinsen werden nur auf das Startkapital berechnet",
      "Man zahlt doppelt so viel Zinsen",
      "Zinsen werden auf Kapital plus bereits erhaltene Zinsen berechnet",
      "Zinsen werden jährlich gestrichen",
    ],
    correctIndex: 2,
    timeLimit: 20,
  },
  {
    id: 4,
    text: "Was ist Diversifikation beim Investieren?",
    options: [
      "Alles in eine Aktie investieren",
      "Geld auf verschiedene Anlagen verteilen um Risiko zu senken",
      "Nur in Immobilien investieren",
      "Möglichst oft kaufen und verkaufen",
    ],
    correctIndex: 1,
    timeLimit: 20,
  },
  {
    id: 5,
    text: "Was ist ein Girokonto?",
    options: [
      "Ein Konto nur für Spareinlagen",
      "Ein Konto für den täglichen Zahlungsverkehr",
      "Ein Aktiendepot",
      "Ein Kreditkonto",
    ],
    correctIndex: 1,
    timeLimit: 20,
  },
];

// ── Room storage ───────────────────────────────────────────────────────────

const rooms = new Map<string, Room>();

/** Generate a random 6-character room code */
function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let code: string;
  do {
    code = Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  } while (rooms.has(code));
  return code;
}

/** Generate a unique player id */
function generatePlayerId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── AI question generation ─────────────────────────────────────────────────

async function generateQuestions(
  topic: string,
  context?: string
): Promise<Question[]> {
  try {
    const openai = getOpenAIClient();

    const prompt = `Du bist ein Quiz-Generator für eine Banking-App für Jugendliche.
Erstelle genau 7 Multiple-Choice-Fragen zum Thema "${topic}".
${context ? `Zusätzlicher Kontext: ${context}` : ""}

REGELN:
- Progressive Schwierigkeit: Fragen 1-2 einfach, 3-5 mittel, 6-7 schwer
- Szenario-basiert: Nutze alltagsnahe Beispiele (z.B. "Dein Freund will...")
- Plausible Distraktoren: Falsche Antworten sollen logisch klingen
- Für Jugendliche (13-29 Jahre) verständlich
- Zeitlimit: 20 Sekunden pro Frage

Antworte NUR mit einem JSON-Array in diesem Format:
[
  {
    "id": 1,
    "text": "Frage hier",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "timeLimit": 20
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: `Erstelle 7 Quiz-Fragen zum Thema: ${topic}`,
        },
      ],
      temperature: 0.8,
      max_completion_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || "[]";
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]) as Question[];
    // Validate structure
    if (
      !Array.isArray(parsed) ||
      parsed.length === 0 ||
      !parsed[0].text ||
      !parsed[0].options
    ) {
      throw new Error("Invalid question structure from AI");
    }

    // Ensure every question has timeLimit
    return parsed.map((q, i) => ({
      ...q,
      id: i + 1,
      timeLimit: q.timeLimit || 20,
    }));
  } catch (err) {
    console.error("[Kahoot WS] AI question generation failed, using fallback:", err);
    return [...FALLBACK_QUESTIONS];
  }
}

// ── Broadcast helpers ──────────────────────────────────────────────────────

function send(ws: WebSocket, data: Record<string, unknown>): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function broadcastToRoom(room: Room, data: Record<string, unknown>): void {
  send(room.hostWs, data);
  for (const player of Array.from(room.players.values())) {
    send(player.ws, data);
  }
}

function broadcastToPlayers(room: Room, data: Record<string, unknown>): void {
  for (const player of Array.from(room.players.values())) {
    send(player.ws, data);
  }
}

function getPlayerList(room: Room) {
  return Array.from(room.players.values()).map((p) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    score: p.score,
  }));
}

// ── Game logic ─────────────────────────────────────────────────────────────

function startNextQuestion(room: Room): void {
  const qi = room.currentQuestionIndex;
  if (qi >= room.questions.length) {
    endGame(room);
    return;
  }

  const question = room.questions[qi];
  room.phase = "question";
  room.answers.clear();
  room.questionStartTime = Date.now();

  // Send question to everyone WITHOUT correctIndex
  const questionPayload = {
    type: "question",
    questionIndex: qi,
    totalQuestions: room.questions.length,
    question: {
      id: question.id,
      text: question.text,
      options: question.options,
      timeLimit: question.timeLimit,
    },
  };
  broadcastToRoom(room, questionPayload);

  // Server-authoritative timer
  let remaining = question.timeLimit;
  room.timer = setInterval(() => {
    remaining--;
    broadcastToRoom(room, { type: "timer_tick", remaining });
    if (remaining <= 0) {
      endQuestion(room);
    }
  }, 1000);
}

function endQuestion(room: Room): void {
  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }

  if (room.phase !== "question") return;
  room.phase = "leaderboard";

  const question = room.questions[room.currentQuestionIndex];
  const timeLimit = question.timeLimit;
  const results: Array<{
    playerId: string;
    name: string;
    correct: boolean;
    scoreGained: number;
    streak: number;
    totalScore: number;
  }> = [];

  for (const player of Array.from(room.players.values())) {
    const answer = room.answers.get(player.id);
    const correct = answer !== undefined && answer.answerIndex === question.correctIndex;

    let scoreGained = 0;
    if (correct) {
      const elapsed = (answer!.timestamp - room.questionStartTime) / 1000;
      const timeBonusFraction = Math.max(0, (timeLimit - elapsed) / timeLimit);
      scoreGained = Math.round(1000 * (0.5 + 0.5 * timeBonusFraction));
      player.streak++;
      const streakBonus = player.streak >= 3 ? 200 : player.streak >= 2 ? 100 : 0;
      scoreGained += streakBonus;
    } else {
      player.streak = 0;
    }

    player.score += scoreGained;

    results.push({
      playerId: player.id,
      name: player.name,
      correct,
      scoreGained,
      streak: player.streak,
      totalScore: player.score,
    });
  }

  // Sort leaderboard by score descending
  const leaderboard = Array.from(room.players.values())
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({
      rank: i + 1,
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      streak: p.streak,
    }));

  // Send question_result to host (includes all results + correct answer)
  send(room.hostWs, {
    type: "question_result",
    questionIndex: room.currentQuestionIndex,
    correctIndex: question.correctIndex,
    results,
    leaderboard,
  });

  // Send your_result to each player (their own result + leaderboard)
  for (const player of Array.from(room.players.values())) {
    const myResult = results.find((r) => r.playerId === player.id);
    send(player.ws, {
      type: "your_result",
      questionIndex: room.currentQuestionIndex,
      correctIndex: question.correctIndex,
      correct: myResult?.correct ?? false,
      scoreGained: myResult?.scoreGained ?? 0,
      streak: myResult?.streak ?? 0,
      totalScore: myResult?.totalScore ?? 0,
      leaderboard,
    });
  }

  room.currentQuestionIndex++;
}

function endGame(room: Room): void {
  room.phase = "finished";
  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }

  const podium = Array.from(room.players.values())
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({
      rank: i + 1,
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      streak: p.streak,
    }));

  broadcastToRoom(room, { type: "game_over", podium });
}

function destroyRoom(code: string): void {
  const room = rooms.get(code);
  if (!room) return;
  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }
  rooms.delete(code);
}

// ── WebSocket server setup ─────────────────────────────────────────────────

/** Attach the Kahoot-style WebSocket server to the HTTP server */
export function setupKahootWebSocket(server: Server): void {
  const wss = new WebSocketServer({ server, path: "/ws/kahoot" });

  console.log("[Kahoot WS] WebSocket server attached at /ws/kahoot");

  wss.on("connection", (ws: WebSocket) => {
    // Track which room/role this connection belongs to
    let myRoomCode: string | null = null;
    let myPlayerId: string | null = null;
    let isHost = false;

    ws.on("message", (raw) => {
      let msg: Record<string, any>;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        send(ws, { type: "error", message: "Invalid JSON" });
        return;
      }

      switch (msg.type) {
        // ── Host creates a room ──────────────────────────────────────
        case "create_room": {
          const code = generateRoomCode();
          const topic = (msg.topic as string) || "Finanzen";
          const room: Room = {
            code,
            hostWs: ws,
            players: new Map(),
            questions: [],
            currentQuestionIndex: 0,
            phase: "lobby",
            answers: new Map(),
            questionStartTime: 0,
            timer: null,
            topic,
          };
          rooms.set(code, room);
          myRoomCode = code;
          isHost = true;

          send(ws, { type: "room_created", code, topic });

          // Generate questions asynchronously
          generateQuestions(topic, msg.context as string | undefined).then(
            (questions) => {
              room.questions = questions;
              send(ws, {
                type: "questions_ready",
                count: questions.length,
              });
            }
          );
          break;
        }

        // ── Player joins a room ──────────────────────────────────────
        case "join_room": {
          const code = (msg.code as string || "").toUpperCase();
          const room = rooms.get(code);
          if (!room) {
            send(ws, { type: "error", message: "Raum nicht gefunden" });
            return;
          }
          if (room.phase !== "lobby") {
            send(ws, { type: "error", message: "Spiel hat bereits begonnen" });
            return;
          }

          const playerId = generatePlayerId();
          const player: Player = {
            id: playerId,
            name: (msg.name as string) || "Anonym",
            avatar: (msg.avatar as string) || "🦁",
            score: 0,
            streak: 0,
            ws,
          };
          room.players.set(playerId, player);
          myRoomCode = code;
          myPlayerId = playerId;
          isHost = false;

          send(ws, {
            type: "joined",
            playerId,
            roomCode: code,
            topic: room.topic,
          });

          // Broadcast updated player list to everyone in room
          broadcastToRoom(room, {
            type: "player_joined",
            players: getPlayerList(room),
          });
          break;
        }

        // ── Host starts the game ─────────────────────────────────────
        case "start_game": {
          if (!isHost || !myRoomCode) {
            send(ws, { type: "error", message: "Nur der Host kann starten" });
            return;
          }
          const room = rooms.get(myRoomCode);
          if (!room) return;
          if (room.questions.length === 0) {
            send(ws, {
              type: "error",
              message: "Fragen werden noch generiert, bitte warten...",
            });
            return;
          }
          startNextQuestion(room);
          break;
        }

        // ── Host advances to next question ───────────────────────────
        case "next_question": {
          if (!isHost || !myRoomCode) return;
          const room = rooms.get(myRoomCode);
          if (!room || room.phase !== "leaderboard") return;
          startNextQuestion(room);
          break;
        }

        // ── Player submits answer ────────────────────────────────────
        case "submit_answer": {
          if (!myPlayerId || !myRoomCode) return;
          const room = rooms.get(myRoomCode);
          if (!room || room.phase !== "question") return;

          // Don't allow double answers
          if (room.answers.has(myPlayerId)) return;

          room.answers.set(myPlayerId, {
            answerIndex: msg.answerIndex as number,
            timestamp: Date.now(),
          });

          // Broadcast answer count to everyone
          broadcastToRoom(room, {
            type: "answer_count",
            count: room.answers.size,
            total: room.players.size,
          });

          // End question early if all players answered
          if (room.answers.size >= room.players.size) {
            endQuestion(room);
          }
          break;
        }

        default:
          send(ws, { type: "error", message: `Unknown message type: ${msg.type}` });
      }
    });

    ws.on("close", () => {
      if (!myRoomCode) return;
      const room = rooms.get(myRoomCode);
      if (!room) return;

      if (isHost) {
        // Host disconnected — notify all players and destroy room
        broadcastToPlayers(room, { type: "host_disconnected" });
        destroyRoom(myRoomCode);
      } else if (myPlayerId) {
        // Player disconnected
        room.players.delete(myPlayerId);
        broadcastToRoom(room, {
          type: "player_left",
          playerId: myPlayerId,
          players: getPlayerList(room),
        });

        // If during a question and all remaining players have answered, end it
        if (
          room.phase === "question" &&
          room.players.size > 0 &&
          room.answers.size >= room.players.size
        ) {
          endQuestion(room);
        }
      }
    });
  });

  // ── Stale room cleanup (every 5 minutes) ──────────────────────────────
  setInterval(() => {
    for (const [code, room] of Array.from(rooms.entries())) {
      if (room.phase === "finished") {
        destroyRoom(code);
      }
    }
  }, 5 * 60 * 1000);
}
