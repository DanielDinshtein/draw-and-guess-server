const { setStagesState } = require("./healthService");

const { getPendingGame, addPendingGame, setActiveGame } = require("../data/gamesData");

const { Game } = require("../../models/gameModel");
const { Player } = require("../../models/playerModel");
const { GameTimes } = require("../../models/gameTimesModel");

const { STAGES } = require("../../utils/constants");

async function addPlayerToGame(username) {
	if (!username) {
		return { emptyUsername: true };
	}

	let result;
	let resultFromData;

	let player;
	let gameID;
	let game = getPendingGame();

	// New Game & Player
	if (Object.keys(game).length == 0) {
		player = new Player(username, "draw");
		game = new Game(player, new Player(), new GameTimes());
		resultFromData = await addPendingGame(game);

		console.log("1");
		console.log(game);
	} else if (Object.keys(game).length != 0 && game.firstPlayer.username != username) {
		// New Player - start Game
		console.log("2");
		console.log(game);

		player = new Player(username, "guess");
		game["secondPlayer"] = player;
		game.gameTimes = new GameTimes();

		console.log("3");
		console.log(game);
		resultFromData = await setActiveGame(game);
	} else {
		return { invalidUsername: true };
	}

	if (resultFromData.acknowledged) {
		console.log("4");
		console.log(game);
		gameID = resultFromData.gameID;
		result = {
			gameID: gameID,
			player: player,
		};
		if (player.playerRole === "guess") {
			setStagesState(STAGES.WORD_CHOOSING, true);
		}

		console.log("end");
		console.log(game);
	}

	return { result: result };
}
exports.addPlayerToGame = addPlayerToGame;
