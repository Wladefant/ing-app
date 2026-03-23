# Live Kahoot-Style Quiz — Design Spec

## Overview

Transform the existing single-player simulated Kahoot challenge (`kahoot-challenge.tsx`) into a real multiplayer live quiz using WebSockets. A host presents questions on a wide-screen projector view while up to 50+ audience members answer on their phones — all within the same web app.

## Routes

| Route | Purpose | View |
|-------|---------|------|
| `/kahoot/host` | Fullscreen host/projector view | Wide-screen, dark theme, big typography |
| `/kahoot/join/:code?` | Player join + game view | Mobile-optimized, existing app style |

The host route is a **standalone page** — no phone frame, no bottom nav. It's designed to fill a projector screen.

The player route lives in the web app. If `:code` is provided in the URL (from QR scan), it's pre-filled. Otherwise the player types the code manually.

## Dependencies

- `qrcode.react` — QR code rendering as React component (must be installed: `npm install qrcode.react`)

## Routing

Routes are added as **client-side routes in `App.tsx`** using `wouter`:
- `<Route path="/kahoot/host" component={KahootHostPage} />`
- `<Route path="/kahoot/join/:code?" component={KahootJoinPage} />`

These are NOT Vite entry points — they're standard React routes.

## WebSocket Connection

Client derives the WebSocket URL from `window.location`:
```typescript
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}/ws/kahoot`;
```

The server attaches the WebSocket handler to a path `/ws/kahoot` on the existing httpServer.

## Host/Player Role Tracking

The server tags each WebSocket connection with a role:
- On `create_room`: connection is tagged as `host` for that room
- On `join_room`: connection is tagged as `player`
- Only the host connection can send `start_game`, `next_question`
- Players can only send `submit_answer`

## WebSocket Protocol

### Server → Client Messages

```typescript
// Room created, host receives room info
{ type: "room_created", roomCode: string, roomId: string }

// Player joined the room
{ type: "player_joined", player: { id, name, avatar } }

// Player left
{ type: "player_left", playerId: string }

// Question broadcast to all
{ type: "question", index: number, total: number, text: string, options: string[], timeLimit: number }

// Timer tick (server is authoritative)
{ type: "timer_tick", timeLeft: number }

// Answer count update (for host progress bar)
{ type: "answer_count", answered: number, total: number }

// Question results (after timer ends) — host uses this to show reveal + leaderboard phases
// Host should: show correct answer → pause 3s → show leaderboard → wait for "next_question" (manual) or auto-advance
{ type: "question_result", correctIndex: number, scores: Array<{ playerId, name, avatar, score, delta, streak, correct }> }

// Individual player result (sent only to that player)
{ type: "your_result", correct: boolean, points: number, streak: number, totalScore: number, rank: number }

// Final podium
{ type: "game_over", podium: Array<{ rank, name, avatar, score }>, stats: { totalPlayers, totalQuestions, avgScore } }
```

### Client → Server Messages

```typescript
// Host creates a room
{ type: "create_room", topic: string, questionCount: number }

// Host starts the game
{ type: "start_game", roomCode: string }

// Host advances to next question (only valid after question_result, ignored during active timer)
{ type: "next_question", roomCode: string }

// Player joins
{ type: "join_room", roomCode: string, playerName: string }

// Player submits answer
{ type: "submit_answer", roomCode: string, answerIndex: number }
```

## Server-Side Room Manager

Located in `server/kahoot-ws.ts`:

- **Room lifecycle**: create → lobby → playing → finished
- **Room storage**: in-memory Map (no persistence needed for demo)
- **Question generation**: calls OpenAI on room creation, stores questions server-side
- **Timer**: server-authoritative countdown, broadcasts `timer_tick` every second
- **Scoring**: server calculates score = `basePoints + timeBonus` (faster answer = more points)
- **Cleanup**: rooms auto-delete 5 minutes after game ends

### Scoring Formula

```
basePoints = 1000
timeBonusFraction = timeLeft / timeLimit
score = correct ? Math.round(basePoints * (0.5 + 0.5 * timeBonusFraction)) : 0
streakBonus = streak >= 3 ? 200 : streak >= 2 ? 100 : 0
totalDelta = score + streakBonus
```

## AI Question Generation — Improvements

Current prompt generates simple questions. New prompt will:

1. **Scale difficulty** — questions get progressively harder (questions 1-2 easy, 3-5 medium, 6-7 hard)
2. **Require reasoning** — not just fact recall, but "What would happen if..." and "Which strategy is better when..."
3. **Add context/scenarios** — "Lisa hat 500€ gespart und möchte investieren. Was sollte sie zuerst tun?"
4. **Varied formats** — true/false (as 2 options), estimation, "which is NOT...", ranking
5. **German financial literacy** focused on real-world scenarios teenagers face

The prompt is improved in `server/routes.ts` at the `/api/quiz/generate` endpoint.

## Host Screen UI (`/kahoot/host`)

Fullscreen dark-themed view:

- **Lobby phase**: Room code (huge), QR code, list of joined players with avatars animating in
- **Question phase**: Timer circle (big), question text (large font), 4 colored answer blocks (2×2 grid), answer progress bar
- **Reveal phase**: Correct answer highlighted, answer distribution bar chart
- **Leaderboard phase**: Top 8 players with animated position changes, score deltas
- **Podium phase**: 1st/2nd/3rd with confetti, game stats

## Player Screen UI (`/kahoot/join/:code?`)

Mobile-optimized view in the web app:

- **Join phase**: Code input (pre-filled if from QR), name input, join button
- **Lobby phase**: "Waiting for host..." with player count
- **Question phase**: Question text, 4 colored answer buttons (stacked), timer
- **Feedback phase**: Correct/incorrect fullscreen, points earned, streak
- **Result phase**: Final score, rank, XP earned

## QR Code

Host lobby shows a QR code encoding: `{appUrl}/kahoot/join/{roomCode}`

Use `qrcode` npm package (lightweight, no canvas dependency needed — generates SVG/data URL).

## File Structure

```
server/
  kahoot-ws.ts          — WebSocket server, room manager, game logic
client/src/
  pages/
    kahoot-host.tsx     — Fullscreen host page (new route)
  components/ing/screens/junior/
    kahoot-challenge.tsx — Refactored: player-only view with real WebSocket
  lib/
    kahoot-client.ts    — Shared WebSocket client hook (useKahootSocket)
```

## What Changes in Existing Code

1. **`server/index.ts`** — attach WebSocket server to httpServer
2. **`server/routes.ts`** — improved quiz generation prompt
3. **`kahoot-challenge.tsx`** — strip out all mock player simulation, connect to WebSocket for real player flow; host mode redirects to `/kahoot/host`
4. **Routing** — add `/kahoot/host` and `/kahoot/join/:code?` routes (in Vite config or as separate entry points)

## Out of Scope

- Persistent game history
- Authentication/authorization
- Rate limiting
- Multiple concurrent rooms (nice-to-have, but one room at a time is fine for demo)
- Chat/reactions during game
