const { onNewPendingGame } = require("./healthService");

const { getPendingGame, addPendingGame, setActiveGame } = require("../data/gamesData");

const { Game } = require("../../models/gameModel");
const { Player } = require("../../models/playerModel");
const { GameTimes } = require("../../models/gameTimesModel");

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
		// New Game & Player

		player = new Player(username, "draw");
		game = new Game(player, new Player(), new GameTimes());

		resultFromData = await addPendingGame(game);

		onNewPendingGame(username);
	} else if (Object.keys(game).length != 0 && game.firstPlayer.username != username) {
		// New Player - start Game

		player = new Player(username, "guess");
		game.secondPlayer = new Player(username, "guess");
		game.gameTimes = new GameTimes();

		resultFromData = await setActiveGame(game);

		onNewActiveGame(username);
	} else {
		return { invalidUsername: true };
	}

	if (resultFromData.acknowledged) {
		gameID = resultFromData.gameID;

		result = {
			gameID: gameID,
			player: player,
		};
	}

	return { result: result };
}
exports.addPlayerToGame = addPlayerToGame;
