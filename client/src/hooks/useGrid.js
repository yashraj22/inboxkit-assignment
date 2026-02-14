import { useState, useEffect, useCallback } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3001";

export function useGrid(socketRef, user) {
	const [tiles, setTiles] = useState({});
	const [cooldown, setCooldown] = useState(false);
	const [reason, setReason] = useState(null);

	useEffect(() => {
		const initilizeGrid = async () => {
			try {
				const response = await fetch(`${SERVER_URL}/api/grid`);
				const data = await response.json();
				setTiles(data);
			} catch (err) {
				console.error("Failed to load grid", err);
			}
		};

		initilizeGrid();
	}, []);

	useEffect(() => {
		const socket = socketRef.current;
		if (!socket) return;

		const handleTileClaimed = ({ key, tile }) => {
			if (tile) {
				setTiles((prev) => ({ ...prev, [key]: tile }));
			} else {
				// remove the clicked tile
				setTiles((prev) => {
					const { [key]: _, ...rest } = prev;
					return rest;
				});
			}
		};

		const handleClaimRejected = ({ reason }) => {
			setReason(reason);

			setTimeout(() => {
				setReason(null);
			}, 1000);
		};

		const handleGridReset = () => {
			setTiles({});
		};

		socket.on("tile-claimed", handleTileClaimed);
		socket.on("claim-rejected", handleClaimRejected);
		socket.on("grid-reset", handleGridReset);

		return () => {
			socket.off("tile-claimed", handleTileClaimed);
			socket.off("claim-rejected", handleClaimRejected);
			socket.off("grid-reset", handleGridReset);
		};
	}, [socketRef]);

	const claimTile = useCallback(
		(x, y) => {
			if (cooldown) return;
			const socket = socketRef.current;
			if (!socket) return;

			const key = `${x}:${y}`;

			if (Object.keys(tiles).includes(key)) {
				// no optimistic update when key is already present in tiles
			} else {
				setTiles((prev) => ({
					...prev,
					[key]: {
						owner: user.id,
						username: user.username,
						color: user.color,
						claimedAt: Date.now(),
					},
				}));
			}

			socket.emit("claim-tile", { x, y });

			setCooldown(true);
			setTimeout(() => setCooldown(false), 100);
		},
		[socketRef, user, cooldown, tiles],
	);

	return { tiles, claimTile, cooldown, reason };
}
