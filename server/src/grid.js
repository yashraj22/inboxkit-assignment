import { redis } from "./redis.js";

const GRID_KEY = "tileclash:grid";
const SCORES_KEY = "tileclash:scores";

export const GRID_SIZE = 30;

export async function getGrid() {
	const raw = await redis.hGetAll(GRID_KEY);
	const grid = {};
	for (const [key, value] of Object.entries(raw)) {
		grid[key] = JSON.parse(value);
	}

	return grid;
}

export async function claimTile(x, y, user) {
	if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
		return { success: false, reason: "Out of bounds" };
	}

	const key = `${x}:${y}`;

	const tile = {
		owner: user.id,
		username: user.username,
		color: user.color,
		claimedAt: Date.now(),
	};

	const existing = await redis.hGet(GRID_KEY, key);

	if (existing) {
		const parsed = JSON.parse(existing);
		if (parsed.owner == user.id) {
			return { success: false, reason: "Already yours", tile: parsed, key };
		}

		return { success: false, reason: "Already taken", tile: parsed, key };
		// await redis.zIncrBy(SCORES_KEY, -1, parsed.owner);
	}

	await redis.hSet(GRID_KEY, key, JSON.stringify(tile));
	await redis.zIncrBy(SCORES_KEY, 1, user.id);

	return { success: true, tile, key };
}

export async function getLeaderboard() {
	const results = await redis.zRangeWithScores(SCORES_KEY, 0, 9, { REV: true });
	return results
		.filter((r) => r.score > 0)
		.map((r, i) => ({ rank: i + 1, userId: r.value, score: r.score }));
}
