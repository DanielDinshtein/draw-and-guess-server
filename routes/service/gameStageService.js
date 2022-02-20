const GameStage = require("../../models/gameStageModel");
const GameSessions = require("../../models/gameSessionsModel");

async function getCanvasPaths(gameID, userID) {
	try {
		const games = await GameSessions.find({ _id: new ObjectId(gameID) });

		if (games.length === 0) {
			// TODO: What with this?
			return;
		}

		const gameStage = games[0].gameStage;

		const canvasPaths = gameStage.canvasPaths;

		return canvasPaths;
	} catch (err) {
		console.log("err in /gameStageService -> getCanvasPaths\n", err);
		throw err;
	}
}
exports.getCanvasPaths = getCanvasPaths;

async function getWordDetails(gameID, userID) {
	try {
		const games = await GameSessions.find({ _id: new ObjectId(gameID) });

		if (games.length === 0) {
			// TODO: What with this?
			return;
		}

		const gameStage = games[0].gameStage;

		const word = gameStage.word;
		const wordPoints = gameStage.wordPoints;

		return { word: word, wordPoints: wordPoints };
	} catch (err) {
		console.log("err in /gameStageService -> getWordDetails\n", err);
		throw err;
	}
}
exports.getWordDetails = getWordDetails;
