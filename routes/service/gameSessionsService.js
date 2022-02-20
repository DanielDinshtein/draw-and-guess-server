const GameStage = require("../../models/gameStageModel");
const CheckStage = require("../../models/CheckStageModel");
const GameSessions = require("../../models/gameSessionsModel");

const { updateUserStage } = require("./healthService");
const { ObjectId } = require("mongodb");

async function addUserToGame(user) {
	try {
		let gameStage;
		let gameSession;
		let checkStage;

		const pendingGames = await GameSessions.find({ isActive: true, users: { $size: 1 } });

		if (pendingGames.length === 0) {
			user.role = "draw";
			gameStage = new GameStage();

			gameSession = new GameSessions({ users: [user], gameStage: gameStage });
			user.gameSession = gameSession;

			checkStage = new CheckStage({ user: user, gameStage: "waiting" });

			await gameStage.save();
			await checkStage.save();
		} else {
			user.role = "guess";

			gameSession = pendingGames[0];
			gameSession.users.push(user);

			user.gameSession = gameSession;

			checkStage = new CheckStage({ user: user, gameStage: "guessing" });
			await checkStage.save();

			await updateUserStage(gameSession.users[0]);
		}

		await gameSession.save();
	} catch (err) {
		console.log("err in /gameSessions -> addUserToGame\n", err);
		throw err;
	}
}
exports.addUserToGame = addUserToGame;

async function getGameStartTime(gameID, userID) {
	try {
		const games = await GameSessions.find({ _id: new ObjectId(gameID) });

		if (games.length === 0) {
			// TODO: What with this?
			return;
		}

		const gameStartTime = games[0].startTime;

		return gameStartTime;
	} catch (err) {
		console.log("err in /gameSessions -> getGameStartTime\n", err);
		throw err;
	}
}
exports.getGameStartTime = getGameStartTime;
