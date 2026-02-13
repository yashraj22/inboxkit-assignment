import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { redis, connectRedis } from "./redis.js";
import { getGrid, claimTile, getLeaderboard } from "./grid.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
	cors: { origin: "*" },
});

const PORT = 3001;
const userCooldowns = new Map();
const COOLDOWN_MS = 200;

app.get("/api/grid", async (req, res) => {
	const grid = await getGrid();
	res.json(grid);
});

app.get("/api/leaderboard", async (req, res) => {
	const leaderboard = await getLeaderboard();
	res.json(leaderboard);
});

app.get("/health", (req, res) => {
	return res.json({ status: "ok", time: new Date().toISOString() });
});

app.post("/api/reset", async (req, res) => {
	await redis.del("tileclash:grid");
	await redis.del("tileclash:scores");
	io.emit("grid-reset");
	res.json({ success: true });
});

const onlineUsers = new Map();

function broadcastOnlineCount() {
	io.emit("online-count", onlineUsers.size);
}

io.on("connection", (socket) => {
	const user = socket.handshake.auth.user;
	if (!user || !user.id) {
		socket.disconnect();
		return;
	}
	console.log(`${user.username} connected ${socket.id}`);
	onlineUsers.set(socket.id, user);
	broadcastOnlineCount();

	socket.on("claim-tile", async ({ x, y }) => {
		const now = Date.now();
		const lastClaim = userCooldowns.get(user.id) ?? 0;

		if (now - lastClaim < COOLDOWN_MS) {
			socket.emit("claim-rejected", {
				key: `${x}:${y}`,
				reason: "Too fast! Wait a moment.",
			});
			return;
		}
		userCooldowns.set(user.id, now);

		const result = await claimTile(x, y, user);
		if (result.success) {
			io.emit("tile-claimed", {
				key: result.key,
				tile: result.tile,
			});
		} else {
			socket.emit("claim-rejected", {
				key: `${x}:${y}`,
				reason: result.reason,
			});
		}
	});

	socket.on("disconnect", () => {
		console.log(`${user.username} disconnected ${socket.id}`);
		onlineUsers.delete(socket.id);
		broadcastOnlineCount();
	});
});

await connectRedis();
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} `);
});
