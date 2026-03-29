export const Gamemodes = [
	{
		teams: 2,
		playersPerTeam: 3,
		maxPlayers: 20,
		expToScore: true,
		label: "Tribes",
		image: "/modes/sandbox-icon.png",
		description:
			"Sandbox mode recommended for beginners. Buildings and extra content are disabled in this mode.",
	},
	{
		teams: 2,
		maxPlayers: 30,
		expToScore: true,
		advancedContent: true,
		label: "Castles",
		image: "/modes/castle-icon.png",
		description:
			"Sandbox mode recommended for advanced players. In this mode you can build fortifications and grow plants.",
	},
	{ maxPlayers: 30, label: "Domination", image: "/modes/castle-mode.png", disabled: true },
	{
		ffa: true,
		maxPlayers: 20,
		shrinkSpeed: 2,
		unlimitedRecruits: true,
		label: "Battle Royale",
		disabled: true,
	},
];

export const GamemodeKeys = ["TRIBES", "CASTLES", "DOMINATION", "BATTLE_ROYALE"]

export const TRIBES = Gamemodes[0];
export const CASTLES = Gamemodes[1];
export const DOMINATION = Gamemodes[2];
export const BATTLE_ROYALE = Gamemodes[3];
