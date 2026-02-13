import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getORCreateUser } from "../utils/user";

const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:3001";

export function useSocket() {
	const socketRef = useRef(null);
	const [isConnected, setIsConnected] = useState(false);
	const [onlineCount, setOnlineCount] = useState(0);
	const user = useRef(getORCreateUser());

	useEffect(() => {
		const socket = io(SERVER_URL, {
			auth: { user: user.current },
		});
		socketRef.current = socket;

		socket.on("connect", () => {
			console.log("Connected to server");
			setIsConnected(true);
		});

		socket.on("disconnect", () => {
			console.log("Disconnected");
			setIsConnected(false);
		});

		socket.on("online-count", (count) => {
			setOnlineCount(count);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return {
		socket: socketRef,
		isConnected,
		onlineCount,
		user: user.current,
	};
}
