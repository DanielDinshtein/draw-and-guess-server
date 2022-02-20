const User = require("../../models/userModel");
const CheckStage = require("../../models/checkStageModel");
const GameStage = require("../../models/gameStageModel");
const GameSessions = require("../../models/gameSessionsModel");
const { ObjectId } = require("mongodb");

/****       Setters       ****/

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

async function removeUserStage(userID) {
	try {
		const users = await User.find({ _id: new ObjectId(userID) });

		const user = users[0];

		CheckStage.findOneAndRemove({ user: user }, function (err) {
			if (err) console.log(err);
			console.log("Successful deletion");
		});
	} catch (err) {
		console.log("err in /gameStageService -> removeUserStage\n", err);
		throw err;
	}
}
exports.removeUserStage = removeUserStage;

/***************************/

/****       Getters       ****/

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
