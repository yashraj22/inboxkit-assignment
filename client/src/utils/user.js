const COLORS = [
	"#6C5CE7",
	"#00CEC9",
	"#E17055",
	"#FDCB6E",
	"#E84393",
	"#00B894",
	"#0984E3",
	"#D63031",
	"#A29BFE",
	"#55EFC4",
	"#FAB1A0",
	"#74B9FF",
];

const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const STORAGE_KEY = "tileclash_user";

export function getORCreateUser() {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) return JSON.parse(stored);

	const user = {
		id: crypto.randomUUID(),
		username: `Player_${crypto.randomUUID().slice(0, 4)}`,
		color: randomColor(),
	};
	localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
	return user;
}

export function updateUsername(name) {
	const user = getORCreateUser();
	user.username = name;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
	return user;
}
