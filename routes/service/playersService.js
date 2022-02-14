const { getActiveGame, setActiveGame } = require("../data/gamesData");

const { Player } = require("../../models/playerModel");
const { Game } = require("../../models/gameModel");

//  DELETE
// const { getNewGame } = require("../../utils/helpers");

function addPlayerToGame(username) {
	if (!username) {
		return { newGame: null, invalidUsername: true };
	}

	let newGame = true;
	let invalidUsername = false;

	let game = getActiveGame();

	if (Object.keys(game).length == 0) {
		const player = new Player(username, "draw");

		// Init new Game
		game = new Game(player);
	} else if (Object.keys(game).length != 0 && game.firstPlayer.username != username) {
		const player = new Player(username, "guess");
		game.secondPlayer = player;
		newGame = false;
	} else {
		return { invalidUsername: true };
	}

	//  Update Game Details
	if (!invalidUsername) {
		setActiveGame(game);
	}

	return { newGame: newGame, invalidUsername: invalidUsername };
}
exports.addPlayerToGame = addPlayerToGame;

// TODO: Remove - Test
async function testSetGame(username) {
	console.log("1 ", username);
	let res;
	try {
		const player = new Player(username, "draw");
		console.log("2");
		// Init new Game
		let game = new Game(player, new Player());
		console.log("3");
		res = await setActiveGame(game);
	} catch (err) {
		console.log(err);
	}

	return res;
}
exports.testSetGame = testSetGame;
