const { getPendingGame, setPendingGame, setActiveGame } = require("../data/gamesData");

const { Game } = require("../../models/gameModel");
const { Player } = require("../../models/playerModel");
const { GameTimes } = require("../../models/gameTimesModel");

//  DELETE

async function addPlayerToGame(username) {
	if (!username) {
		return { emptyUsername: true };
	}

	let result;
	let resultFromData;

	let player;
	let gameID;
	let game = getPendingGame();

	if (Object.keys(game).length == 0) {
		player = new Player(username, "draw");

		// Init new Game
		game = new Game(player, new Player(), new GameTimes());

		resultFromData = await setPendingGame(game);

		//  TODO: Save user / gameID for health check
	} else if (Object.keys(game).length != 0 && game.firstPlayer.username != username) {
		player = new Player(username, "guess");
		game.secondPlayer = new Player(username, "guess");

		//  TODO: Notify to user / gameID for health check
		resultFromData = await setActiveGame(game);
	} else {
		return { invalidUsername: true };
	}

	if (resultFromData.acknowledged) {
		gameID = resultFromData.gameID;

		result = {
			gameID: gameID,
			player: player,
		};
	} // TODO: What if not acknowledged

	return { result: result };
}
exports.addPlayerToGame = addPlayerToGame;
