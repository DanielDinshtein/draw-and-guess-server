const { getGamesByPlayer, clearGamesData } = require("../data/gamesData");

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
