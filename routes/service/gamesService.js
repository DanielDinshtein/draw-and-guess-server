const { getGameByID, getGamesByPlayer, clearGamesData } = require("../data/gamesData");

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
