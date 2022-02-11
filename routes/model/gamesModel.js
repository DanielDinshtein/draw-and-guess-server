const { getGamesByPlayer } = require('../Database/gamesHistoryCollection');



async function getPlayersGames(playerName) {

    try {

        const playerGames = await getGamesByPlayer(playerName);

        return { playerGames: playerGames };

    } catch (err) {
        console.log("Error in getPlayersGames()");
        throw err;
    }
};
exports.getPlayersGames = getPlayersGames;