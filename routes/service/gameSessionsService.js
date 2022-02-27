const GameStage = require("../../models/gameStageModel");
const CheckStage = require("../../models/checkStageModel");
const GameSessions = require("../../models/gameSessionsModel");
const Health = require("../../models/healthModel");
const User = require("../../models/userModel");

const { ObjectId } = require("mongodb");
const { updateUserStage } = require("./healthService");

/****       Setters       ****/

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

			await updateUserStage(gameSession.users[0], "waiting", true);

			const healthChecker = new Health({ gameSession: gameSession, user1: gameSession.users[0], user2: user });
			await healthChecker.save();
		}

		await gameSession.save();
	} catch (err) {
		console.log("err in /gameSessionsService -> addUserToGame\n", err);
		throw err;
	}
}
exports.addUserToGame = addUserToGame;

async function setWordPoints(gameID, wordPoints) {
	try {
		const games = await GameSessions.find({ _id: new ObjectId(gameID) });

		if (games.length === 0) {
			// TODO: What with this?
			return false;
		}

		const updatedGamePoints = games[0].totalPoints + parseInt(wordPoints);

		const updatedGame = await GameSessions.findOneAndUpdate({ _id: games[0]._id }, { totalPoints: updatedGamePoints }, { new: true });

		await updatedGame.save();
		return updatedGamePoints;
	} catch (err) {
		console.log("err in /gameSessionsService -> setWordPoints\n", err);
		throw err;
	}
}
exports.setWordPoints = setWordPoints;

/***************************/

/****       Getters       ****/

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

async function getGame(gameID) {
	try {
		const games = await GameSessions.find({ _id: new ObjectId(gameID) });

		if (games.length === 0) {
			// TODO: What with this?
			return;
		}

		const game = games[0];

		return game;
	} catch (err) {
		console.log("err in /gameSessions -> getGame\n", err);
		throw err;
	}
}
exports.getGame = getGame;

async function getGamePoints(gameID) {
	try {
		const games = await GameSessions.find({ _id: new ObjectId(gameID) });

		if (games.length === 0) {
			// TODO: What with this?
			return;
		}

		const points = games[0].totalPoints;

		return points;
	} catch (err) {
		console.log("err in /gameSessions -> getGamePoints\n", err);
		throw err;
	}
}
exports.getGamePoints = getGamePoints;

async function getBestGame() {
	try {
		const games = await GameSessions.find({ isActive: false });

		if (games.length === 0) {
			// TODO: What with this?
			return;
		}

		var maxPoints = -1;
		var bestGame;
		var bestTime = 0;

		for (const game in games) {
			if (games[game].totalPoints > maxPoints) {
				maxPoints = games[game].totalPoints;
				bestGame = games[game];
				bestTime = parseInt((new Date(games[game].endTime) - new Date(games[game].startTime)) / 1000);
			} else if (games[game].totalPoints === maxPoints) {
				gameTime = parseInt((new Date(games[game].endTime) - new Date(games[game].startTime)) / 1000);
				if (gameTime < bestTime) {
					bestTime = gameTime;
					maxPoints = games[game].totalPoints;
					bestGame = games[game];
				}
			}
		}

		let users = [];
		const users2 = await User.find({});

		for (const user in users2) {
			if (JSON.stringify(users2[user].gameSession) == JSON.stringify(bestGame._id)) {
				users.push(users2[user].name);
			}
		}

		const result = {
			totalPoints: bestGame.totalPoints,
			gameTime: bestTime,
			users,
		};
		return result;
	} catch (err) {
		console.log("err in /gameSessions -> getGamePoints\n", err);
		throw err;
	}
}
exports.getBestGame = getBestGame;

/***************************/
