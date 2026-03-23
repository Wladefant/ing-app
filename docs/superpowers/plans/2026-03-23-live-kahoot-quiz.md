# Live Kahoot-Style Quiz — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the simulated single-player Kahoot quiz into a real multiplayer live quiz using WebSockets, with a fullscreen host view for projectors and mobile player views.

**Architecture:** WebSocket server (`ws`) attached to the existing Express httpServer manages rooms, questions, timers, and scoring server-side. Two new routes: `/kahoot/host` (fullscreen projector view) and `/kahoot/join/:code?` (mobile player view). The existing `kahoot-challenge.tsx` becomes the in-app entry point that redirects to these routes or opens them.

**Tech Stack:** React 19, wouter, ws 8.18, qrcode.react (new dep), OpenAI GPT for question generation, Framer Motion, canvas-confetti

**Spec:** `docs/superpowers/specs/2026-03-23-live-kahoot-quiz-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `server/kahoot-ws.ts` | WebSocket server, room manager, game loop, scoring |
| `client/src/lib/kahoot-client.ts` | `useKahootSocket` hook — shared WebSocket client logic |
| `client/src/pages/kahoot-host.tsx` | Fullscreen host page (lobby, question, leaderboard, podium) |
| `client/src/pages/kahoot-join.tsx` | Player join + game page (join, lobby, answer, feedback, result) |

### Modified Files
| File | Changes |
|------|---------|
| `server/index.ts` | Attach WebSocket server to httpServer |
| `server/routes.ts` | Improved AI quiz generation prompt |
| `client/src/App.tsx` | Add `/kahoot/host` and `/kahoot/join/:code?` routes |
| `client/src/components/ing/screens/junior/kahoot-challenge.tsx` | Simplify to entry point that links to host/join routes |
| `package.json` | Add `qrcode.react` dependency |

---

## Task 1: Install dependency and set up WebSocket server skeleton

**Files:**
- Modify: `package.json`
- Create: `server/kahoot-ws.ts`
- Modify: `server/index.ts`

- [ ] **Step 1: Install qrcode.react**

```bash
npm install qrcode.react
```

- [ ] **Step 2: Create `server/kahoot-ws.ts` with types and room manager skeleton**

```typescript
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { getOpenAIClient } from "./routes";

// --- Types ---

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

interface Room {
  code: string;
  hostWs: WebSocket;
  players: Map<string, Player>;
  questions: Question[];
  currentQuestionIndex: number;
  phase: "lobby" | "question" | "leaderboard" | "finished";
  answers: Map<string, { answerIndex: number; timestamp: number }>;
  questionStartTime: number;
  timer: NodeJS.Timeout | null;
  topic: string;
}

// --- Room Storage ---

const rooms = new Map<string, Room>();

/** Generate a short room code like "ABCD" */
function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const AVATARS = ["🦊", "🐼", "🐨", "🐯", "🐸", "🐙", "🦄", "🐱", "🦁", "🐻", "🐵", "🐷", "🐲", "🦅", "🐺", "🦋", "🐢", "🐬", "🦀", "🐝", "🦎", "🐠", "🦩", "🐧"];

/** Send JSON to a WebSocket */
function send(ws: WebSocket, data: Record<string, unknown>): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

/** Broadcast to all players in a room */
function broadcastToRoom(room: Room, data: Record<string, unknown>): void {
  for (const player of room.players.values()) {
    send(player.ws, data);
  }
}

/** Broadcast to all (host + players) */
function broadcastToAll(room: Room, data: Record<string, unknown>): void {
  send(room.hostWs, data);
  broadcastToRoom(room, data);
}

const FALLBACK_QUESTIONS: Question[] = [
  { id: 1, text: "Was ist ein ETF?", options: ["Ein börsengehandelter Fonds", "Eine Kryptowährung", "Ein Fußballverein", "Eine Eissorte"], correctIndex: 0, timeLimit: 15 },
  { id: 2, text: "Was bedeutet Diversifikation?", options: ["Alles auf Rot setzen", "Risikostreuung", "Geld verstecken", "Nur Tech-Aktien kaufen"], correctIndex: 1, timeLimit: 15 },
  { id: 3, text: "Was ist der Zinseszinseffekt?", options: ["Zinsen auf Zinsen", "Eine Bankgebühr", "Ein Steuergesetz", "Ein Börsencrash"], correctIndex: 0, timeLimit: 15 },
  { id: 4, text: "Wie nennt man den Gewinnanteil einer Aktie?", options: ["Bonus", "Dividende", "Gehalt", "Miete"], correctIndex: 1, timeLimit: 15 },
  { id: 5, text: "Was ist ein Bärenmarkt?", options: ["Steigende Kurse", "Fallende Kurse", "Ein Zoo", "Ein Honigmarkt"], correctIndex: 1, timeLimit: 15 },
];

/** Generate quiz questions server-side via OpenAI */
async function generateQuestions(topic: string, context?: string): Promise<Question[]> {
  try {
    const openai = getOpenAIClient();
    const difficultyInstructions = "Fragen sollten Zusammenhänge erfordern. 'Was passiert wenn...', 'Welche Strategie ist besser wenn...'";
    const quizPrompt = `Du bist ein Quiz-Master für ein Live-Kahoot-Spiel über Finanzen. Die Teilnehmer sind junge Erwachsene (16-29 Jahre).

Erstelle 7 Multiple-Choice-Fragen zum Thema "${topic}".
${context ? `Kontext: ${context}` : ""}

SCHWIERIGKEIT: mittel
${difficultyInstructions}

WICHTIG — Qualitätsregeln:
1. PROGRESSIVE SCHWIERIGKEIT: Die ersten 2 Fragen einfacher, dann steigend
2. SZENARIO-BASIERT: Mindestens 3 Fragen mit konkreten Szenarien ("Lisa hat 500€ und möchte...")
3. PLAUSIBLE FALSCHANTWORTEN: Falsche Antworten müssen auf den ersten Blick richtig klingen
4. ABWECHSLUNG: Mix aus Definitionen, Szenarien, "Was stimmt NICHT?", Berechnungen
5. KEINE trivialen Fragen — jede Frage soll zum Nachdenken anregen
6. PRAXISBEZUG: Fragen zu echten Situationen die Jugendliche erleben

Antworte NUR mit einem JSON-Array:
[{"id":1,"question":"Die Frage","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Erklärung"}]

correctAnswer = Index (0-3) der richtigen Option.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: quizPrompt },
        { role: "user", content: `Erstelle 7 Quiz-Fragen zum Thema: ${topic}` },
      ],
      temperature: 0.8,
      max_completion_tokens: 3000,
    });

    const responseText = completion.choices[0]?.message?.content || "[]";
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    if (parsed.length > 0) {
      return parsed.map((q: Record<string, unknown>, i: number) => ({
        id: i + 1,
        text: q.question as string,
        options: q.options as string[],
        correctIndex: q.correctAnswer as number,
        timeLimit: 15,
      }));
    }
  } catch (err) {
    console.error("Kahoot question generation failed:", err);
  }
  return FALLBACK_QUESTIONS;
}

/** Clean up a room */
function destroyRoom(code: string): void {
  const room = rooms.get(code);
  if (room?.timer) clearInterval(room.timer);
  rooms.delete(code);
}

export function setupKahootWebSocket(server: Server): void {
  const wss = new WebSocketServer({ server, path: "/ws/kahoot" });

  wss.on("connection", (ws: WebSocket) => {
    let assignedRoom: string | null = null;
    let assignedPlayerId: string | null = null;
    let isHost = false;

    ws.on("message", (raw: Buffer) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      const type = msg.type as string;

      switch (type) {
        case "create_room": {
          const code = generateRoomCode();
          const topic = (msg.topic as string) || "Finanzen";
          const context = (msg.context as string) || "";
          const room: Room = {
            code,
            hostWs: ws,
            players: new Map(),
            questions: [],
            currentQuestionIndex: -1,
            phase: "lobby",
            answers: new Map(),
            questionStartTime: 0,
            timer: null,
            topic,
          };
          rooms.set(code, room);
          assignedRoom = code;
          isHost = true;
          send(ws, { type: "room_created", roomCode: code });

          // Generate questions server-side (async, non-blocking)
          generateQuestions(topic, context).then((questions) => {
            room.questions = questions;
            send(ws, { type: "questions_ready", count: questions.length });
          });
          break;
        }

        case "join_room": {
          const code = (msg.roomCode as string || "").toUpperCase();
          const room = rooms.get(code);
          if (!room || room.phase !== "lobby") {
            send(ws, { type: "error", message: "Raum nicht gefunden oder Spiel läuft bereits" });
            return;
          }
          const playerId = `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          const avatar = AVATARS[room.players.size % AVATARS.length];
          const player: Player = {
            id: playerId,
            name: (msg.playerName as string) || "Anonym",
            avatar,
            score: 0,
            streak: 0,
            ws,
          };
          room.players.set(playerId, player);
          assignedRoom = code;
          assignedPlayerId = playerId;

          // Confirm to player
          send(ws, { type: "joined", playerId, avatar, playerCount: room.players.size });

          // Notify host + all players
          broadcastToAll(room, {
            type: "player_joined",
            player: { id: playerId, name: player.name, avatar },
            playerCount: room.players.size,
          });
          break;
        }

        case "start_game": {
          if (!isHost || !assignedRoom) return;
          const room = rooms.get(assignedRoom);
          if (!room || room.questions.length === 0) return;
          startNextQuestion(room);
          break;
        }

        case "next_question": {
          if (!isHost || !assignedRoom) return;
          const room = rooms.get(assignedRoom);
          if (!room || room.phase !== "leaderboard") return;
          startNextQuestion(room);
          break;
        }

        case "submit_answer": {
          if (!assignedPlayerId || !assignedRoom) return;
          const room = rooms.get(assignedRoom);
          if (!room || room.phase !== "question") return;
          if (room.answers.has(assignedPlayerId)) return; // already answered

          room.answers.set(assignedPlayerId, {
            answerIndex: msg.answerIndex as number,
            timestamp: Date.now(),
          });

          // Notify host of answer count
          send(room.hostWs, {
            type: "answer_count",
            answered: room.answers.size,
            total: room.players.size,
          });

          // If all answered, end question early
          if (room.answers.size >= room.players.size) {
            if (room.timer) clearInterval(room.timer);
            endQuestion(room);
          }
          break;
        }

        default:
          break;
      }
    });

    ws.on("close", () => {
      if (assignedRoom) {
        const room = rooms.get(assignedRoom);
        if (!room) return;

        if (isHost) {
          // Host disconnected — end game
          broadcastToRoom(room, { type: "host_disconnected" });
          destroyRoom(assignedRoom);
        } else if (assignedPlayerId) {
          const player = room.players.get(assignedPlayerId);
          room.players.delete(assignedPlayerId);
          if (player) {
            broadcastToAll(room, {
              type: "player_left",
              playerId: assignedPlayerId,
              playerCount: room.players.size,
            });
          }
        }
      }
    });
  });

  // Auto-cleanup stale rooms every 5 minutes
  setInterval(() => {
    for (const [code, room] of rooms) {
      if (room.phase === "finished") {
        destroyRoom(code);
      }
    }
  }, 5 * 60 * 1000);
}

// --- Game Logic ---

function startNextQuestion(room: Room): void {
  room.currentQuestionIndex++;
  if (room.currentQuestionIndex >= room.questions.length) {
    // Game over
    endGame(room);
    return;
  }

  room.phase = "question";
  room.answers.clear();
  room.questionStartTime = Date.now();

  const q = room.questions[room.currentQuestionIndex];

  // Broadcast question (without correctIndex!)
  broadcastToAll(room, {
    type: "question",
    index: room.currentQuestionIndex,
    total: room.questions.length,
    text: q.text,
    options: q.options,
    timeLimit: q.timeLimit,
  });

  // Server-authoritative timer
  let timeLeft = q.timeLimit;
  room.timer = setInterval(() => {
    timeLeft--;
    broadcastToAll(room, { type: "timer_tick", timeLeft });

    if (timeLeft <= 0) {
      if (room.timer) clearInterval(room.timer);
      endQuestion(room);
    }
  }, 1000);
}

function endQuestion(room: Room): void {
  room.phase = "leaderboard";
  const q = room.questions[room.currentQuestionIndex];

  // Score each player
  for (const [playerId, answer] of room.answers) {
    const player = room.players.get(playerId);
    if (!player) continue;

    const correct = answer.answerIndex === q.correctIndex;
    if (correct) {
      const elapsed = (answer.timestamp - room.questionStartTime) / 1000;
      const timeBonusFraction = Math.max(0, (q.timeLimit - elapsed) / q.timeLimit);
      const baseScore = Math.round(1000 * (0.5 + 0.5 * timeBonusFraction));
      player.streak++;
      const streakBonus = player.streak >= 3 ? 200 : player.streak >= 2 ? 100 : 0;
      const delta = baseScore + streakBonus;
      player.score += delta;
    } else {
      player.streak = 0;
    }
  }

  // Build sorted scores
  const sortedPlayers = [...room.players.values()]
    .sort((a, b) => b.score - a.score)
    .map((p, idx) => {
      const answer = room.answers.get(p.id);
      const correct = answer ? answer.answerIndex === q.correctIndex : false;
      const elapsed = answer ? (answer.timestamp - room.questionStartTime) / 1000 : q.timeLimit;
      const timeBonusFraction = Math.max(0, (q.timeLimit - elapsed) / q.timeLimit);
      const baseScore = correct ? Math.round(1000 * (0.5 + 0.5 * timeBonusFraction)) : 0;
      const streakBonus = correct && p.streak >= 3 ? 200 : correct && p.streak >= 2 ? 100 : 0;
      return {
        playerId: p.id,
        name: p.name,
        avatar: p.avatar,
        score: p.score,
        delta: correct ? baseScore + streakBonus : 0,
        streak: p.streak,
        correct,
        rank: idx + 1,
      };
    });

  // Send question_result to host
  send(room.hostWs, {
    type: "question_result",
    correctIndex: q.correctIndex,
    scores: sortedPlayers,
  });

  // Send individual your_result to each player
  for (const entry of sortedPlayers) {
    const player = room.players.get(entry.playerId);
    if (player) {
      send(player.ws, {
        type: "your_result",
        correct: entry.correct,
        points: entry.delta,
        streak: entry.streak,
        totalScore: entry.score,
        rank: entry.rank,
        correctIndex: q.correctIndex,
      });
    }
  }
}

function endGame(room: Room): void {
  room.phase = "finished";

  const podium = [...room.players.values()]
    .sort((a, b) => b.score - a.score)
    .map((p, idx) => ({
      rank: idx + 1,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
    }));

  const avgScore = podium.length > 0
    ? Math.round(podium.reduce((sum, p) => sum + p.score, 0) / podium.length)
    : 0;

  broadcastToAll(room, {
    type: "game_over",
    podium,
    stats: {
      totalPlayers: podium.length,
      totalQuestions: room.questions.length,
      avgScore,
    },
  });

  // Auto-destroy after 5 minutes
  setTimeout(() => destroyRoom(room.code), 5 * 60 * 1000);
}
```

- [ ] **Step 3: Attach WebSocket server in `server/index.ts`**

Add import at the top of `server/index.ts` (after the other imports, around line 5):
```typescript
import { setupKahootWebSocket } from "./kahoot-ws";
```

Then **inside the async IIFE** (around line 64), add the call **after** `await registerRoutes(httpServer, app);`:
```typescript
  await registerRoutes(httpServer, app);
  setupKahootWebSocket(httpServer);
```

IMPORTANT: This must be inside the `(async () => { ... })()` block, NOT at the top-level after `const httpServer = createServer(app);`.

- [ ] **Step 4: Verify server starts without errors**

```bash
npx tsx server/index.ts
```
Expected: Server starts, no TypeScript errors. Kill it after confirming.

- [ ] **Step 5: Commit**

```bash
git add server/kahoot-ws.ts server/index.ts package.json package-lock.json
git commit -m "feat: add WebSocket server for live Kahoot quiz rooms

- Room creation, player join/leave, game loop with server-authoritative timer
- Scoring with time bonus and streak multiplier
- Auto-cleanup of stale rooms"
```

---

## Task 2: Create shared WebSocket client hook

**Files:**
- Create: `client/src/lib/kahoot-client.ts`

- [ ] **Step 1: Create `useKahootSocket` hook**

```typescript
import { useState, useEffect, useCallback, useRef } from "react";

type MessageHandler = (msg: Record<string, unknown>) => void;

interface UseKahootSocketReturn {
  connected: boolean;
  send: (data: Record<string, unknown>) => void;
  onMessage: (handler: MessageHandler) => void;
  disconnect: () => void;
}

export function useKahootSocket(): UseKahootSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Set<MessageHandler>>(new Set());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/kahoot`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        for (const handler of handlersRef.current) {
          handler(msg);
        }
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, []);

  const send = useCallback((data: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const onMessage = useCallback((handler: MessageHandler) => {
    handlersRef.current.add(handler);
    return () => { handlersRef.current.delete(handler); };
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  return { connected, send, onMessage, disconnect };
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/lib/kahoot-client.ts
git commit -m "feat: add useKahootSocket hook for WebSocket client"
```

---

## Task 3: Improve AI quiz generation

**Files:**
- Modify: `server/routes.ts` (lines 492-517, the quiz prompt)

- [ ] **Step 1: Export `getOpenAIClient` and replace the quiz generation prompt**

In `server/routes.ts`, first export `getOpenAIClient` (line 8): change `const getOpenAIClient = () => {` to `export const getOpenAIClient = () => {`.

Then replace the `quizPrompt` variable (lines 492-517) with an improved prompt that scales difficulty, uses scenarios, and generates harder questions:

```typescript
      const difficultyInstructions: Record<string, string> = {
        einfach: "Fragen sollten grundlegende Konzepte abfragen. Einfache Definitionen und Ja/Nein-Wissen.",
        mittel: "Fragen sollten Zusammenhänge erfordern. 'Was passiert wenn...', 'Welche Strategie ist besser wenn...'",
        schwer: "Fragen sollten kritisches Denken erfordern. Szenarien mit Berechnungen, Vergleiche zwischen Strategien, Fallstricke erkennen.",
      };

      const quizPrompt = `
Du bist ein Quiz-Master für ein Live-Kahoot-Spiel über Finanzen. Die Teilnehmer sind junge Erwachsene (16-29 Jahre).

Erstelle ${count} Multiple-Choice-Fragen zum Thema "${topic || 'Finanzen allgemein'}".
${context ? `Kontext: ${context}` : ''}

SCHWIERIGKEIT: ${difficulty || 'mittel'}
${difficultyInstructions[difficulty || 'mittel'] || difficultyInstructions.mittel}

WICHTIG — Qualitätsregeln:
1. PROGRESSIVE SCHWIERIGKEIT: Die ersten 2 Fragen einfacher, dann steigend
2. SZENARIO-BASIERT: Mindestens 3 Fragen mit konkreten Szenarien ("Lisa hat 500€ und möchte...")
3. PLAUSIBLE FALSCHANTWORTEN: Falsche Antworten müssen auf den ersten Blick richtig klingen
4. ABWECHSLUNG: Mix aus Definitionen, Szenarien, "Was stimmt NICHT?", Berechnungen
5. KEINE trivialen Fragen wie "Was ist Geld?" — jede Frage soll zum Nachdenken anregen
6. PRAXISBEZUG: Fragen zu echten Situationen die Jugendliche erleben (erster Job, Taschengeld investieren, Handyvertrag)

Antworte NUR mit einem JSON-Array:
[
  {
    "id": 1,
    "question": "Die Frage",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Kurze Erklärung (1-2 Sätze)"
  }
]

correctAnswer = Index (0-3) der richtigen Option.
`;
```

Also increase `max_completion_tokens` from 1500 to 3000 (line 526) and change `count` default from 3 to 7 (line 490):

```typescript
      const { topic, difficulty, count = 7, context } = req.body;
```

```typescript
        max_completion_tokens: 3000,
```

- [ ] **Step 2: Verify the server still compiles**

```bash
npx tsx server/index.ts
```

- [ ] **Step 3: Commit**

```bash
git add server/routes.ts
git commit -m "feat: improve AI quiz generation with harder questions and scenarios

- Progressive difficulty scaling
- Scenario-based questions with real-world context
- Better distractors and question variety
- Increased token limit for longer question sets"
```

---

## Task 4: Create the fullscreen host page

**Files:**
- Create: `client/src/pages/kahoot-host.tsx`
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Create `client/src/pages/kahoot-host.tsx`**

This is a standalone fullscreen page (no phone frame, no bottom nav). It shows:
- **Lobby**: room code (huge), QR code, player list
- **Question**: timer circle, question text, 4 colored answer blocks (2x2), answer progress
- **Leaderboard**: top 8 with animated positions
- **Podium**: 1st/2nd/3rd with confetti

```typescript
import { useState, useEffect, useCallback, useRef } from "react";
import { useKahootSocket } from "@/lib/kahoot-client";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Crown, Medal, Star, Play, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

const QUIZ_TOPICS = [
  { label: "Aktien & Börse", icon: "📈", topic: "Aktien und Börse", context: "Grundlagen des Aktienmarkts" },
  { label: "Sparen & Budget", icon: "💰", topic: "Sparen und Budgetplanung", context: "Wie man als Jugendlicher spart" },
  { label: "Krypto & Blockchain", icon: "⛓️", topic: "Kryptowährungen und Blockchain", context: "Grundlagen für Einsteiger" },
  { label: "Versicherungen", icon: "🛡️", topic: "Versicherungen", context: "Wichtige Versicherungen für junge Menschen" },
  { label: "Steuern & Gehalt", icon: "📋", topic: "Steuern und Einkommen", context: "Erster Job und Steuererklärung" },
  { label: "Investieren", icon: "🎯", topic: "Investieren und Geldanlage", context: "ETFs, Fonds und langfristiger Vermögensaufbau" },
];

const ANSWER_COLORS = [
  { bg: "#FF6200", icon: "▲" },
  { bg: "#00A4CC", icon: "◆" },
  { bg: "#8B5CF6", icon: "●" },
  { bg: "#10B981", icon: "■" },
];

type HostPhase = "topic-select" | "lobby" | "question" | "reveal" | "leaderboard" | "podium";

interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
}

interface ScoreEntry {
  playerId: string;
  name: string;
  avatar: string;
  score: number;
  delta: number;
  streak: number;
  correct: boolean;
  rank: number;
}

interface PodiumEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
}

export function KahootHostPage() {
  const { connected, send, onMessage } = useKahootSocket();
  const [phase, setPhase] = useState<HostPhase>("topic-select");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<typeof QUIZ_TOPICS[0] | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsReady, setQuestionsReady] = useState(false);

  // Question state
  const [questionText, setQuestionText] = useState("");
  const [questionOptions, setQuestionOptions] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionTotal, setQuestionTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);

  // Results state
  const [correctIndex, setCorrectIndex] = useState(-1);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [podium, setPodium] = useState<PodiumEntry[]>([]);
  const [gameStats, setGameStats] = useState({ totalPlayers: 0, totalQuestions: 0, avgScore: 0 });

  // Handle WebSocket messages
  useEffect(() => {
    const cleanup = onMessage((msg) => {
      switch (msg.type) {
        case "room_created":
          setRoomCode(msg.roomCode as string);
          setPhase("lobby");
          break;

        case "player_joined":
          setPlayers(prev => [...prev, msg.player as PlayerInfo]);
          break;

        case "player_left":
          setPlayers(prev => prev.filter(p => p.id !== msg.playerId));
          break;

        case "questions_ready":
          setQuestionsReady(true);
          setIsLoadingQuestions(false);
          break;

        case "question":
          setPhase("question");
          setQuestionText(msg.text as string);
          setQuestionOptions(msg.options as string[]);
          setQuestionIndex(msg.index as number);
          setQuestionTotal(msg.total as number);
          setTimeLeft(msg.timeLimit as number);
          setAnswerCount(0);
          setCorrectIndex(-1);
          break;

        case "timer_tick":
          setTimeLeft(msg.timeLeft as number);
          break;

        case "answer_count":
          setAnswerCount(msg.answered as number);
          break;

        case "question_result":
          setCorrectIndex(msg.correctIndex as number);
          setScores(msg.scores as ScoreEntry[]);
          setPhase("reveal");
          // Auto-transition to leaderboard after 3 seconds
          setTimeout(() => setPhase("leaderboard"), 3000);
          break;

        case "game_over":
          setPodium(msg.podium as PodiumEntry[]);
          setGameStats(msg.stats as typeof gameStats);
          setPhase("podium");
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
          break;
      }
    });
    return cleanup;
  }, [onMessage]);

  const startGame = () => {
    send({ type: "start_game", roomCode });
  };

  const nextQuestion = () => {
    send({ type: "next_question", roomCode });
  };

  const joinUrl = `${window.location.origin}/kahoot/join/${roomCode}`;

  // --- TOPIC SELECT ---
  if (phase === "topic-select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-white mb-2">LEO Quiz Battle</h1>
            <p className="text-xl text-white/60">Wähle ein Thema für das Live-Quiz</p>
            {!connected && <p className="text-red-400 text-sm mt-2">Verbindung wird hergestellt...</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {QUIZ_TOPICS.map((topic) => (
              <button
                key={topic.label}
                onClick={() => setSelectedTopic(topic)}
                className={`p-6 rounded-2xl text-left transition-all ${
                  selectedTopic?.label === topic.label
                    ? "bg-[#FF6200] text-white ring-4 ring-[#FF6200]/50 scale-105"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span className="text-3xl block mb-2">{topic.icon}</span>
                <span className="font-bold text-lg">{topic.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (!selectedTopic || !connected) return;
              setIsLoadingQuestions(true);
              send({ type: "create_room", topic: selectedTopic.topic, context: selectedTopic.context });
            }}
            disabled={!selectedTopic || !connected}
            className="w-full bg-[#FF6200] text-white p-5 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e55800] transition-colors"
          >
            <Play className="inline mr-3" size={24} fill="currentColor" />
            Quiz erstellen
          </button>
        </div>
      </div>
    );
  }

  // --- LOBBY ---
  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex flex-col p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">LEO Quiz Battle</h1>
            <p className="text-white/60">{selectedTopic?.icon} {selectedTopic?.label}</p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
            <Users size={20} className="text-[#FF6200]" />
            <span className="text-white font-bold text-xl">{players.length}</span>
          </div>
        </div>

        <div className="flex-1 flex gap-8">
          {/* QR Code + Room Code */}
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="bg-white p-6 rounded-3xl">
              <QRCodeSVG value={joinUrl} size={200} level="M" />
            </div>
            <div className="text-center">
              <div className="text-white/50 text-sm mb-1">Game Code</div>
              <div className="text-6xl font-black text-[#FF6200] tracking-widest">{roomCode}</div>
            </div>
            <div className="text-white/40 text-sm text-center max-w-[220px]">
              Scanne den QR-Code oder gib den Code ein
            </div>
            {isLoadingQuestions && (
              <div className="flex items-center gap-2 text-white/60">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">KI generiert Fragen...</span>
              </div>
            )}
            {questionsReady && (
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-sm font-bold">✓ Fragen bereit</span>
              </div>
            )}
          </div>

          {/* Players Grid */}
          <div className="flex-1 bg-white/5 rounded-3xl p-6 overflow-y-auto">
            {players.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white/40">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Warte auf Spieler...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                <AnimatePresence>
                  {players.map((player) => (
                    <motion.div
                      key={player.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white/10 p-3 rounded-xl text-center"
                    >
                      <span className="text-2xl block">{player.avatar}</span>
                      <span className="text-white font-bold text-sm truncate block mt-1">{player.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-6">
          <button
            onClick={startGame}
            disabled={players.length === 0 || !questionsReady}
            className="w-full bg-[#FF6200] text-white p-5 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e55800] transition-colors"
          >
            <Play className="inline mr-3" size={24} fill="currentColor" />
            Quiz starten ({players.length} Spieler)
          </button>
        </div>
      </div>
    );
  }

  // --- QUESTION ---
  if (phase === "question") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <span className="text-[#FF6200] font-bold text-xl">LEO Quiz</span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
              {selectedTopic?.icon} {selectedTopic?.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>Frage {questionIndex + 1}/{questionTotal}</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users className="inline mr-1" size={14} /> {players.length}
            </span>
          </div>
        </div>

        {/* Timer + Question */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black border-4 mb-8 ${
              timeLeft <= 5 ? "border-red-500 text-red-500 bg-red-500/10" : "border-[#FF6200] text-[#FF6200] bg-[#FF6200]/10"
            }`}
          >
            {timeLeft}
          </motion.div>

          <div className="bg-white/10 backdrop-blur-sm px-12 py-8 rounded-3xl max-w-4xl w-full mb-8">
            <h2 className="text-3xl font-bold text-white text-center leading-relaxed">{questionText}</h2>
          </div>

          {/* 2x2 Answer Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-4xl w-full">
            {questionOptions.map((option, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: ANSWER_COLORS[idx % 4].bg }}
                className="p-5 rounded-2xl flex items-center gap-4 text-white font-bold text-lg shadow-lg"
              >
                <span className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-base shrink-0">
                  {ANSWER_COLORS[idx % 4].icon}
                </span>
                <span className="leading-snug">{option}</span>
              </div>
            ))}
          </div>

          {/* Answer Progress */}
          <div className="mt-8 text-center">
            <span className="text-white/50 text-sm">{answerCount} von {players.length} haben geantwortet</span>
            <div className="w-64 h-2 bg-white/10 rounded-full mt-2 mx-auto">
              <div
                className="h-full bg-[#FF6200] rounded-full transition-all duration-300"
                style={{ width: players.length > 0 ? `${(answerCount / players.length) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- REVEAL ---
  if (phase === "reveal") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex flex-col items-center justify-center px-8">
        <h2 className="text-2xl font-bold text-white/60 mb-6">Frage {questionIndex + 1}/{questionTotal}</h2>
        <div className="bg-white/10 px-12 py-6 rounded-3xl max-w-4xl w-full mb-8">
          <h2 className="text-2xl font-bold text-white text-center">{questionText}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-4xl w-full">
          {questionOptions.map((option, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl flex items-center gap-4 text-white font-bold text-lg transition-all ${
                idx === correctIndex
                  ? "bg-green-500 ring-4 ring-green-300 scale-105"
                  : "bg-white/10 opacity-50"
              }`}
            >
              <span className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-base shrink-0">
                {idx === correctIndex ? "✓" : ANSWER_COLORS[idx % 4].icon}
              </span>
              <span className="leading-snug">{option}</span>
            </div>
          ))}
        </div>
        <p className="text-white/40 mt-6">Gleich kommt die Rangliste...</p>
      </div>
    );
  }

  // --- LEADERBOARD ---
  if (phase === "leaderboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex flex-col p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">Zwischenstand</h2>
          <p className="text-white/50">Nach Frage {questionIndex + 1}/{questionTotal}</p>
        </div>
        <div className="flex-1 max-w-2xl mx-auto w-full space-y-3 overflow-y-auto">
          {scores.slice(0, 10).map((entry, idx) => (
            <motion.div
              key={entry.playerId}
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white/10 p-4 rounded-xl flex items-center justify-between ${
                idx === 0 ? "ring-2 ring-[#FF6200] bg-white/15" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? "bg-[#FF6200] text-white" :
                  idx === 1 ? "bg-gray-300 text-gray-700" :
                  idx === 2 ? "bg-amber-500 text-white" : "bg-white/20 text-white"
                }`}>{idx + 1}</div>
                <span className="text-2xl">{entry.avatar}</span>
                <div>
                  <span className="text-white font-bold">{entry.name}</span>
                  {entry.streak >= 2 && <span className="ml-2 text-xs bg-orange-500/30 text-orange-300 px-2 py-0.5 rounded-full">🔥{entry.streak}</span>}
                </div>
              </div>
              <div className="text-right">
                <span className="text-white font-bold text-xl">{entry.score}</span>
                {entry.delta > 0 && <span className="block text-green-400 text-xs font-bold">+{entry.delta}</span>}
              </div>
            </motion.div>
          ))}
          {scores.length > 10 && (
            <div className="text-center text-white/30 text-sm">+{scores.length - 10} weitere</div>
          )}
        </div>
        <div className="mt-6 max-w-2xl mx-auto w-full">
          <button
            onClick={nextQuestion}
            className="w-full bg-[#FF6200] text-white p-4 rounded-2xl font-bold text-lg hover:bg-[#e55800] transition-colors"
          >
            {questionIndex < questionTotal - 1 ? "Nächste Frage →" : "Ergebnisse anzeigen 🏆"}
          </button>
        </div>
      </div>
    );
  }

  // --- PODIUM ---
  if (phase === "podium") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FF6200] to-[#FF8533] flex flex-col items-center justify-center p-8">
        <Trophy size={64} className="text-yellow-300 mb-4" fill="currentColor" />
        <h1 className="text-5xl font-black text-white mb-2">Ergebnisse</h1>
        <p className="text-white/70 mb-8">
          {selectedTopic?.icon} {selectedTopic?.label} — {gameStats.totalPlayers} Spieler — {gameStats.totalQuestions} Fragen
        </p>

        {/* Podium */}
        <div className="flex items-end gap-4 mb-8 max-w-lg w-full">
          {/* 2nd */}
          {podium[1] && (
            <div className="flex-1 text-center">
              <span className="text-3xl">{podium[1].avatar}</span>
              <p className="text-white font-bold mt-1">{podium[1].name}</p>
              <p className="text-white/70 text-sm">{podium[1].score} Pt.</p>
              <motion.div initial={{ height: 0 }} animate={{ height: 100 }}
                className="w-full bg-white/30 rounded-t-2xl mt-2 flex items-end justify-center pb-3">
                <Medal size={24} className="text-gray-300" />
              </motion.div>
            </div>
          )}
          {/* 1st */}
          {podium[0] && (
            <div className="flex-1 text-center z-10">
              <Crown size={36} className="text-yellow-300 mx-auto" fill="currentColor" />
              <span className="text-4xl">{podium[0].avatar}</span>
              <p className="text-white font-bold text-lg mt-1">{podium[0].name}</p>
              <p className="text-white/80">{podium[0].score} Pt.</p>
              <motion.div initial={{ height: 0 }} animate={{ height: 150 }}
                className="w-full bg-white rounded-t-2xl mt-2 flex items-end justify-center pb-3 shadow-2xl">
                <Star size={32} className="text-[#FF6200]" fill="currentColor" />
              </motion.div>
            </div>
          )}
          {/* 3rd */}
          {podium[2] && (
            <div className="flex-1 text-center">
              <span className="text-3xl">{podium[2].avatar}</span>
              <p className="text-white font-bold mt-1">{podium[2].name}</p>
              <p className="text-white/70 text-sm">{podium[2].score} Pt.</p>
              <motion.div initial={{ height: 0 }} animate={{ height: 70 }}
                className="w-full bg-white/30 rounded-t-2xl mt-2 flex items-end justify-center pb-3">
                <Medal size={24} className="text-amber-600" />
              </motion.div>
            </div>
          )}
        </div>

        <button
          onClick={() => { setPhase("topic-select"); setPlayers([]); setRoomCode(""); setQuestionsReady(false); }}
          className="bg-white text-[#FF6200] px-8 py-4 rounded-2xl font-bold text-lg"
        >
          Neues Quiz starten
        </button>
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 2: Add routes to `client/src/App.tsx`**

Add the import and route:

```typescript
// Add import at top
import { KahootHostPage } from "@/pages/kahoot-host";
import { KahootJoinPage } from "@/pages/kahoot-join";

// Add routes before the 404 catch-all
<Route path="/kahoot/host" component={KahootHostPage} />
<Route path="/kahoot/join/:code?" component={KahootJoinPage} />
```

- [ ] **Step 3: Verify the app compiles (host page will show, join page not yet created)**

```bash
npm run dev
```
Open `http://localhost:5000/kahoot/host` — should show topic selection.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/kahoot-host.tsx client/src/App.tsx
git commit -m "feat: add fullscreen Kahoot host page with QR code and live game flow

- Topic selection, lobby with QR code, question display, leaderboard, podium
- Connected to WebSocket server for real-time game management
- Designed for projector display (dark theme, large typography)"
```

---

## Task 5: Create the player join page

**Files:**
- Create: `client/src/pages/kahoot-join.tsx`

- [ ] **Step 1: Create `client/src/pages/kahoot-join.tsx`**

Mobile-optimized player view with join, lobby, answer, feedback, and result phases:

```typescript
import { useState, useEffect, useCallback } from "react";
import { useKahootSocket } from "@/lib/kahoot-client";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Trophy, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

const ANSWER_COLORS = [
  { bg: "#FF6200", icon: "▲" },
  { bg: "#00A4CC", icon: "◆" },
  { bg: "#8B5CF6", icon: "●" },
  { bg: "#10B981", icon: "■" },
];

type PlayerPhase = "join" | "lobby" | "question" | "waiting" | "feedback" | "result";

interface PodiumEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
}

export function KahootJoinPage() {
  const [, params] = useRoute("/kahoot/join/:code?");
  const { connected, send, onMessage } = useKahootSocket();

  const [phase, setPhase] = useState<PlayerPhase>("join");
  const [roomCode, setRoomCode] = useState(params?.code || "");
  const [playerName, setPlayerName] = useState("");
  const [playerAvatar, setPlayerAvatar] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [error, setError] = useState("");

  // Question state
  const [questionText, setQuestionText] = useState("");
  const [questionOptions, setQuestionOptions] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionTotal, setQuestionTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Feedback state
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [lastStreak, setLastStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [rank, setRank] = useState(0);

  // Final state
  const [podium, setPodium] = useState<PodiumEntry[]>([]);

  useEffect(() => {
    if (params?.code) {
      setRoomCode(params.code.toUpperCase());
    }
  }, [params?.code]);

  // Handle messages
  useEffect(() => {
    const cleanup = onMessage((msg) => {
      switch (msg.type) {
        case "joined":
          setPlayerAvatar(msg.avatar as string);
          setPlayerCount(msg.playerCount as number);
          setPhase("lobby");
          break;

        case "error":
          setError(msg.message as string);
          break;

        case "player_joined":
          setPlayerCount(msg.playerCount as number);
          break;

        case "player_left":
          setPlayerCount(msg.playerCount as number);
          break;

        case "question":
          setPhase("question");
          setQuestionText(msg.text as string);
          setQuestionOptions(msg.options as string[]);
          setQuestionIndex(msg.index as number);
          setQuestionTotal(msg.total as number);
          setTimeLeft(msg.timeLimit as number);
          break;

        case "timer_tick":
          setTimeLeft(msg.timeLeft as number);
          break;

        case "your_result":
          setLastCorrect(msg.correct as boolean);
          setLastPoints(msg.points as number);
          setLastStreak(msg.streak as number);
          setTotalScore(msg.totalScore as number);
          setRank(msg.rank as number);
          setPhase("feedback");
          if (msg.correct) confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
          break;

        case "game_over":
          setPodium(msg.podium as PodiumEntry[]);
          setPhase("result");
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
          break;

        case "host_disconnected":
          setError("Der Host hat das Spiel beendet.");
          setPhase("join");
          break;
      }
    });
    return cleanup;
  }, [onMessage]);

  const handleJoin = () => {
    if (!roomCode.trim()) { setError("Bitte gib einen Game-Code ein."); return; }
    if (!playerName.trim()) { setError("Bitte gib deinen Namen ein."); return; }
    setError("");
    send({ type: "join_room", roomCode: roomCode.toUpperCase(), playerName: playerName.trim() });
  };

  const handleAnswer = (index: number) => {
    send({ type: "submit_answer", roomCode, answerIndex: index });
    setPhase("waiting");
  };

  // --- JOIN ---
  if (phase === "join") {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6200] to-[#FF8533] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">⚡</span>
            </div>
            <h1 className="text-2xl font-black text-[#333]">Quiz Battle</h1>
            <p className="text-gray-500 text-sm">Tritt dem Live-Quiz bei!</p>
            {!connected && <p className="text-orange-500 text-xs mt-2"><Loader2 size={12} className="inline animate-spin mr-1" />Verbinde...</p>}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-500 block mb-2">Game Code</label>
              <input
                type="text"
                placeholder="ABCD"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full bg-gray-50 text-center text-3xl font-black p-4 rounded-xl border-2 border-gray-200 focus:border-[#FF6200] outline-none uppercase tracking-[0.3em]"
                maxLength={4}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-500 block mb-2">Dein Name</label>
              <input
                type="text"
                placeholder="Max"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-gray-50 text-center text-xl font-bold p-4 rounded-xl border-2 border-gray-200 focus:border-[#FF6200] outline-none"
                maxLength={20}
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={!connected}
              className="w-full bg-[#FF6200] text-white p-4 rounded-xl font-bold text-lg disabled:opacity-50"
            >
              Beitreten
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOBBY ---
  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-24 h-24 bg-[#FF6200] rounded-full flex items-center justify-center mb-6"
        >
          <Sparkles size={48} className="text-white" />
        </motion.div>
        <span className="text-4xl mb-3">{playerAvatar}</span>
        <h2 className="text-2xl font-bold text-[#333] mb-1">{playerName}</h2>
        <p className="text-gray-500 mb-4">Warte bis das Quiz startet...</p>
        <div className="bg-white px-6 py-3 rounded-full shadow-sm">
          <span className="text-[#FF6200] font-bold">{playerCount} Spieler im Raum</span>
        </div>
      </div>
    );
  }

  // --- QUESTION ---
  if (phase === "question") {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex flex-col">
        <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
          <span className="text-sm font-bold text-gray-500">Frage {questionIndex + 1}/{questionTotal}</span>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
            timeLeft <= 5 ? "bg-red-100 text-red-600" : "bg-[#FF6200]/10 text-[#FF6200]"
          }`}>{timeLeft}</div>
        </div>
        <div className="bg-white px-4 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#333] text-center leading-snug">{questionText}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {questionOptions.map((option, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAnswer(idx)}
              style={{ backgroundColor: ANSWER_COLORS[idx % 4].bg }}
              className="w-full p-4 rounded-xl shadow-md text-white font-bold text-left flex items-center gap-3"
            >
              <span className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-sm shrink-0">
                {ANSWER_COLORS[idx % 4].icon}
              </span>
              <span className="text-base leading-snug flex-1">{option}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // --- WAITING ---
  if (phase === "waiting") {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#FF6200] border-t-transparent rounded-full mb-6"
        />
        <h2 className="text-xl font-bold text-[#333]">Antwort abgeschickt!</h2>
        <p className="text-gray-500">Warte auf die anderen Spieler...</p>
      </div>
    );
  }

  // --- FEEDBACK ---
  if (phase === "feedback") {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${lastCorrect ? "bg-green-500" : "bg-red-500"}`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6"
        >
          {lastCorrect ? <Check size={56} className="text-white" /> : <X size={56} className="text-white" />}
        </motion.div>
        <h2 className="text-4xl font-black text-white mb-2">{lastCorrect ? "Richtig!" : "Falsch!"}</h2>
        <p className="text-white/80 text-xl font-bold mb-4">
          {lastCorrect ? `+${lastPoints} Punkte` : "Nächstes Mal!"}
        </p>
        {lastStreak >= 2 && lastCorrect && (
          <div className="bg-white/20 px-4 py-2 rounded-full mb-4">
            <span className="text-white font-bold">🔥 {lastStreak}er Streak!</span>
          </div>
        )}
        <div className="bg-white/10 px-6 py-3 rounded-xl">
          <span className="text-white/80 text-sm">Gesamt: {totalScore} Pt. — Platz {rank}</span>
        </div>
      </div>
    );
  }

  // --- RESULT ---
  if (phase === "result") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FF6200] to-[#FF8533] flex flex-col items-center justify-center p-6 text-center">
        <Trophy size={56} className="text-yellow-300 mb-3" fill="currentColor" />
        <h1 className="text-3xl font-black text-white mb-2">Geschafft!</h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 w-full max-w-xs mb-4">
          <span className="text-5xl block mb-2">{playerAvatar}</span>
          <div className="text-3xl font-black text-white">{totalScore}</div>
          <div className="text-white/80">Punkte</div>
          <div className="text-white/60 text-sm mt-1">Platz {rank} von {podium.length}</div>
        </div>

        {/* Mini podium */}
        {podium.slice(0, 3).length > 0 && (
          <div className="bg-white/10 rounded-xl p-4 w-full max-w-xs mb-6">
            {podium.slice(0, 3).map((p) => (
              <div key={p.rank} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white/60">{p.rank}.</span>
                  <span>{p.avatar}</span>
                  <span className="text-white font-bold text-sm">{p.name}</span>
                </div>
                <span className="text-white/80 text-sm">{p.score}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => { window.location.href = "/kahoot/join"; }}
          className="w-full max-w-xs bg-white text-[#FF6200] p-4 rounded-xl font-bold"
        >
          Nochmal spielen
        </button>
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 2: Verify both host and join pages load**

```bash
npm run dev
```
- Open `http://localhost:5000/kahoot/host` — topic selection should work
- Open `http://localhost:5000/kahoot/join` — join form should appear
- Open `http://localhost:5000/kahoot/join/TEST` — code should be pre-filled

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/kahoot-join.tsx
git commit -m "feat: add player join page for live Kahoot quiz

- Join screen with room code and name input
- Pre-fills code from URL params (QR code flow)
- Question answering with colored buttons
- Feedback with correct/incorrect and points
- Final result with podium display"
```

---

## Task 6: Simplify the in-app kahoot-challenge.tsx entry point

**Files:**
- Modify: `client/src/components/ing/screens/junior/kahoot-challenge.tsx`

- [ ] **Step 1: Replace kahoot-challenge.tsx with a simplified entry point**

The 952-line file becomes a simple screen that offers to open the host or join page. The real game logic is now in the host/join pages.

Replace the entire file content with:

```typescript
import { useState } from "react";
import { ScreenHeader, BottomNav } from "../../layout";
import { Screen } from "@/pages/ing-app";
import { Zap, Play, Smartphone, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import lionIcon from "@/assets/lion-logo.png";

const QUIZ_TOPICS = [
  { label: "Aktien & Börse", icon: "📈" },
  { label: "Sparen & Budget", icon: "💰" },
  { label: "Krypto & Blockchain", icon: "⛓️" },
  { label: "Versicherungen", icon: "🛡️" },
  { label: "Steuern & Gehalt", icon: "📋" },
  { label: "Investieren", icon: "🎯" },
];

export function KahootChallengeScreen({
  onBack,
  onNavigate,
  onLeoClick,
}: {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onLeoClick?: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col bg-[#F3F3F3] overflow-hidden">
      <ScreenHeader title="Quiz Challenge" onBack={onBack} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Hero */}
        <div className="text-center pt-2 pb-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-[#FF6200] to-[#FF8533] rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg"
          >
            <Zap size={40} className="text-white" fill="currentColor" />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#333] mb-1">Quiz Battle</h1>
          <p className="text-gray-500 text-sm">Live Kahoot-Style Quiz mit Freunden!</p>
        </div>

        {/* Leo Tip */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-2xl border border-orange-100 flex gap-3">
          <div className="w-9 h-9 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            <img src={lionIcon} alt="Leo" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <div className="font-bold text-orange-700 text-xs mb-1">Leo sagt:</div>
            <p className="text-[11px] text-orange-600 leading-relaxed">
              Starte ein Live-Quiz und lass deine Freunde mit ihren Handys beitreten!
              Der Host zeigt die Fragen auf dem großen Bildschirm. 🏆
            </p>
          </div>
        </div>

        {/* Topics Preview */}
        <div>
          <div className="font-bold text-[#333] text-sm mb-3 px-1">Verfügbare Themen</div>
          <div className="grid grid-cols-3 gap-2">
            {QUIZ_TOPICS.map((topic) => (
              <div key={topic.label} className="bg-white p-2 rounded-xl text-center shadow-sm">
                <span className="text-xl block mb-1">{topic.icon}</span>
                <span className="text-[10px] font-bold text-gray-600">{topic.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open("/kahoot/host", "_blank")}
            className="w-full bg-gradient-to-r from-[#FF6200] to-[#FF8533] text-white p-4 rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-3"
          >
            <Play size={22} fill="currentColor" />
            <span>Quiz hosten</span>
            <ExternalLink size={14} className="opacity-60" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open("/kahoot/join", "_blank")}
            className="w-full bg-white text-[#333] p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm border border-gray-200"
          >
            <Smartphone size={18} />
            Quiz beitreten
          </motion.button>
        </div>
      </div>

      <BottomNav activeTab="learn" onNavigate={onNavigate} onLeoClick={onLeoClick} profile="junior" />
    </div>
  );
}
```

- [ ] **Step 2: Verify the in-app Kahoot screen renders and links work**

```bash
npm run dev
```
Navigate to Junior profile → Quiz Challenge. Buttons should open host/join pages in new tabs.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/ing/screens/junior/kahoot-challenge.tsx
git commit -m "refactor: simplify kahoot-challenge to entry point for live quiz

- Replaced 952-line simulated multiplayer with clean entry point
- Opens /kahoot/host and /kahoot/join in new tabs
- Shows available topics and Leo tip"
```

---

## Task 7: End-to-end integration test

**Files:**
- All files from tasks 1-6

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test the full flow manually**

1. Open `http://localhost:5000/kahoot/host` in one browser window
2. Select a topic, click "Quiz erstellen"
3. Copy the room code shown on screen
4. Open `http://localhost:5000/kahoot/join/{code}` in another browser window (or phone on same network)
5. Enter a name and click "Beitreten"
6. Verify: player appears on host lobby
7. Host clicks "Quiz starten"
8. Verify: question appears on both host and player screens
9. Player answers — verify feedback shows
10. Host sees answer count update, then leaderboard
11. Host clicks "Nächste Frage" — repeat
12. After last question — verify podium/results show on both

- [ ] **Step 3: Test QR code flow**

1. On host lobby, scan the QR code with a phone
2. Verify it opens the join page with code pre-filled

- [ ] **Step 4: Test edge cases**

- Player joins with no name → should show error
- Player joins with wrong code → should show error
- Host closes tab → players should see "Host hat das Spiel beendet"
- Multiple players joining simultaneously (open 3-4 tabs)

- [ ] **Step 5: Fix any issues found during testing**

Address bugs discovered during manual testing.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "fix: address integration issues from end-to-end testing"
```

---

## Summary

| Task | Description | Estimated Steps |
|------|-------------|-----------------|
| 1 | WebSocket server + room manager | 5 steps |
| 2 | Shared client WebSocket hook | 2 steps |
| 3 | Improved AI quiz generation | 3 steps |
| 4 | Fullscreen host page | 4 steps |
| 5 | Player join page | 3 steps |
| 6 | Simplify in-app entry point | 3 steps |
| 7 | End-to-end integration test | 6 steps |

**Total: 7 tasks, 26 steps**

Tasks 1-3 can be done in parallel (server + client hook + AI prompt are independent).
Tasks 4-5 depend on tasks 1-2.
Task 6 is independent.
Task 7 depends on all previous tasks.
