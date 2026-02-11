# TileClash

A real-time collaborative tile-claiming game. Click tiles to claim them — compete with everyone online.

**Live:** [deploying-soon]

## How It Works

- **Frontend:** React (Vite) + Tailwind CSS renders a 30×30 grid of interactive tiles
- **Backend:** Node.js + Express handles API requests and WebSocket connections
- **Real-time:** Socket.IO broadcasts tile claims to all connected clients instantly
- **Database:** Redis stores grid state (Hash) and leaderboard (Sorted Set)

## Real-Time Architecture

1. Client clicks tile → optimistic UI update (instant feedback)
2. `claim-tile` event sent via WebSocket to server
3. Server validates claim → updates Redis → broadcasts `tile-claimed` to ALL clients
4. All clients update their grid state from the broadcast

## Trade-offs

- **Last-writer-wins for conflicts:** Acceptable for a game. For financial apps, I'd use Redis transactions (WATCH/MULTI/EXEC)
- **Client-side leaderboard computation:** Simpler than a separate API call per update. Works fine at this scale
- **localStorage for identity:** No auth system needed. Trade-off: users can reset their identity by clearing storage
- **In-memory cooldown map:** Doesn't survive server restarts, but cooldowns are ephemeral anyway

## Run Locally

```bash

# Prerequisites: Node.js 18+, Redis

# Install

npm install
cd server && npm install
cd ../client && npm install

# Start Redis

redis-server --daemonize yes

# Run (from root)

cd ..
npm run dev

```

## Tech Stack

| Layer    | Choice                  | Rationale                                                     |
| -------- | ----------------------- | ------------------------------------------------------------- |
| Frontend | React + Vite + Tailwind | Fast dev, utility-first CSS, component model fits tile grid   |
| Backend  | Express + Socket.IO     | WebSocket support with fallbacks and rooms                    |
| Database | Redis                   | Sub-ms latency, native hash/sorted-set for grid + leaderboard |
