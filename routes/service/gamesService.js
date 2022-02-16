const { setStagesState } = require("./healthService");

const { getGameByID, getGamesByPlayer, clearGamesData, setActiveGame } = require("../data/gamesData");

const { STAGES } = require("../../utils/constants");

async function clearGameDetails(all) {
	return await clearGamesData(all);
}
exports.clearGameDetails = clearGameDetails;

async function getPlayersGames(playerName) {
	try {
		const playerGames = await getGamesByPlayer(playerName);

		return { playerGames: playerGames };
	} catch (err) {
		console.log("Error in getPlayersGames()");
		throw err;
	}
}
exports.getPlayersGames = getPlayersGames;

async function updateReceivedDraw(playerName) {
	try {
		const playerGames = await getGamesByPlayer(playerName);

		return { playerGames: playerGames };
	} catch (err) {
		console.log("Error in getPlayersGames()");
		throw err;
	}
}
exports.updateReceivedDraw = updateReceivedDraw;

async function initGameSession(gameID, username) {
	let result;
	try {
		const gameDetails = await getGameByID(gameID);

		if (gameDetails.length == 0) {
			return { gameNotFound: true };
		}
		result = {
			id: gameDetails._id,
			timeStarted: gameDetails.gameTimes.timeStarted,
		};
	} catch (err) {
		console.log("Error in initGameSession()");
		throw err;
	}
	return result;
}
exports.initGameSession = initGameSession;

async function updateReceivedWordDetails(gameID, word, wordPoints) {
	try {
		const gameDetails = await getGameByID(gameID);

		if (gameDetails.length === 0) {
			return { gameNotFound: true };
		}

		gameDetails["drawingSessionDetails"]["currentWord"] = word;
		gameDetails["drawingSessionDetails"]["wordPoints"] = wordPoints;

		let resultFromData = await setActiveGame(gameDetails, false);

		if (!resultFromData.acknowledged || resultFromData.modifiedCount !== 1) {
			return { gameNotUpdated: true };
		}

		return { succuss: true };
	} catch (err) {
		console.log("Error in updateReceivedWordDetails()");
		throw err;
	}
}
exports.updateReceivedWordDetails = updateReceivedWordDetails;

async function updateReceivedCanvasPaths(gameID, wordPoints, canvasPaths) {
	try {
		const gameDetails = await getGameByID(gameID);

		if (gameDetails.length === 0) {
			return { gameNotFound: true };
		}

		gameDetails["drawingSessionDetails"]["canvasPaths"] = canvasPaths;

		let resultFromData = await setActiveGame(gameDetails, false);

		if (!resultFromData.acknowledged || resultFromData.modifiedCount !== 1) {
			return { gameNotUpdated: true };
		}

		setStagesState(STAGES.GUESSING, true);

		return { succuss: true };
	} catch (err) {
		console.log("Error in updateReceivedCanvasPaths()");
		throw err;
	}
}
exports.updateReceivedCanvasPaths = updateReceivedCanvasPaths;

async function getCanvasPaths(gameID) {
	try {
		const gameDetails = await getGameByID(gameID);

		if (gameDetails.length === 0) {
			return { gameNotFound: true };
		}
		const { canvasPaths } = gameDetails["drawingSessionDetails"];
		const { currentWord } = gameDetails["drawingSessionDetails"];


		return { canvasPaths, currentWord };
	} catch (err) {
		console.log("Error in getCanvasPaths()");
		throw err;
	}
}
exports.getCanvasPaths = getCanvasPaths;
