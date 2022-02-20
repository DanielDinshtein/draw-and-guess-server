const GameStage = require("../../models/gameStageModel");
const GameSessions = require("../../models/gameSessionsModel");
const { ObjectId } = require("mongodb");

/****       Setter       ****/

async function setDrawStage(gameID, word, wordPoints, canvasPaths) {
	try {
		const games = await GameSessions.find({ _id: new ObjectId(gameID) });

		if (games.length === 0) {
			// TODO: What with this?
			return false;
		}

		const gameStageID = games[0].gameStage;

		const gameStage = await GameStage.findOneAndUpdate(
			{ _id: gameStageID },
			{ word: word, wordPoints: wordPoints, canvasPaths: canvasPaths },
			{ new: true }
		);

		await gameStage.save();

		return true;
	} catch (err) {
		console.log("err in /gameStageService -> setDrawStage\n", err);
		throw err;
	}
}
exports.setDrawStage = setDrawStage;

/***************************/

/****       Getter       ****/

async function getCanvasPaths(gameID, userID) {
	try {
		const games = await GameSessions.find({ _id: new ObjectId(gameID) });

		if (games.length === 0) {
			// TODO: What with this?
			return;
		}

		const gameStageID = games[0].gameStage;

		const gameStage = await GameStage.find({ _id: gameStageID });

		const canvasPaths = gameStage[0].canvasPaths;

		return canvasPaths[0];
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

		const gameStageID = games[0].gameStage;

		const gameStage = await GameStage.find({ _id: gameStageID });

		const word = gameStage[0].word;
		const wordPoints = gameStage[0].wordPoints;

		return { word: word, wordPoints: wordPoints };
	} catch (err) {
		console.log("err in /gameStageService -> getWordDetails\n", err);
		throw err;
	}
}
exports.getWordDetails = getWordDetails;
