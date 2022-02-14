const { getGame, setGame } = require("../Database/gameStorage");

const { getNewGame } = require("../../utils/helpers");

function addPlayerToGame(player) {
	if (!player) {
		return { newGame: null, invalidUsername: true };
	}

	let newGame = true;
	let invalidUsername = false;

	let game = getGame();

	if (Object.keys(game).length == 0) {
		game = getNewGame();

		game.firstPlayer.username = player;
		game.firstPlayer.role = "draw";
	} else if ((Object.keys(game).length != 0 && game.firstPlayer, username != player)) {
		game.secondPlayer.username = player;
		game.firstPlayer.role = "guess";

		newGame = false;
	} else {
		invalidUsername = true;
	}

	//  Update Game Details
	if (!invalidUsername) {
		setGame(game);
	}

	return { newGame: newGame, invalidUsername: invalidUsername };
}
exports.addPlayerToGame = addPlayerToGame;
