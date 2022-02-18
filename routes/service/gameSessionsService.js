const GameSessions = require("../../models/gameSessionsModel");
const GameStage = require("../../models/gameStageModel");

async function addUserToGame(user) {
	try {
		let gameStage;
		let gameSession;

		const pendingGames = await GameSessions.find({ isActive: true, users: { $size: 1 } });

		if (pendingGames.length === 0) {
			user.role = "draw";
			gameStage = new GameStage();

			gameSession = new GameSessions({ users: [user], gameStage: gameStage });
			user.gameSession = gameSession;

			await gameStage.save();
		} else {
			user.role = "guess";

			gameSession = pendingGames[0];
			gameSession.users.push(user);

			user.gameSession = gameSession;
		}

		await gameSession.save();
	} catch (err) {
		console.log("err in /gameSessions -> addUserToGame\n", err);
		throw err;
	}
}
exports.addUserToGame = addUserToGame;
