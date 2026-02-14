import { useMemo } from "react";

export default function Leaderboard({ currentUser, tiles }) {
    const leaders = useMemo(() => {
        const scores = {};
        if (Object.values(tiles)[0]) {
            return [];
        } else {
            for (const tile of Object.values(tiles)) {
                scores[tile.owner] ??= {
                    username: tile.username,
                    color: tile.color,
                    score: 0,
                }
                scores[tile.owner].score++;
            }

            return Object.entries(scores).map(
                ([id, data]) => ({ userId: id, ...data })
            ).sort((a, b) => b.score - a.score).slice(0, 10);
        }
    }, [tiles]);

    return (
        <div className="bg-[#16162a] rounded-xl p-4">
            <h3 className="text-sm font-bold text-[#a29bfe] mb-3">Leaderboard</h3>
            {leaders.length === 0 && (
                <p className="text-gray-600 text-xs">No claims yet</p>
            )}
            <ul className="space-y-0">{
                leaders.map((leader, i) => {
                    return (
                        <li key={leader.userId} className={`flex items-center gap-2 py-1.5 text-xs border-b border-[#1a1a2e] last:border-b-0 ${leaders.userId === currentUser.id ? "text-yellow-300 font-bold" : ""}`}>
                            <span className="text-gray-500 w-6 font-semibold">
                                #{i + 1}
                            </span >
                            <span className="w-2.5 h-2.5 rounded-full shink-0" style={{ background: leader.color }}></span>
                            <span className=" flex-1 truncate">
                                {leader.username}
                                {leader.userId === currentUser.id && "(you)"}
                            </span>
                            <span className="font-bold text-[#6c5CE7]">{leader.score}</span>
                        </li>

                    )
                })
            }</ul >
        </div >
    )
}