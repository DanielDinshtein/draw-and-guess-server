const { setStagesState } = require("./healthService");

const { getPendingGame, addPendingGame, setActiveGame } = require("../data/gamesData");

const { Game } = require("../../model/gameModel");
const { Player } = require("../../model/playerModel");
const { GameTimes } = require("../../model/gameTimesModel");
const { DrawDetails } = require("../../model/drawDetails");

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
		game = new Game(player, new Player(), new GameTimes(), new DrawDetails());
		resultFromData = await addPendingGame(game);
	} else if (Object.keys(game).length != 0 && game["firstPlayer"]["username"] != username) {
		// New Player - start Game

		player = new Player(username, "guess");
		game["secondPlayer"] = new Player(username, "guess");
		game["gameTimes"] = new GameTimes();

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
		if (player.playerRole === "guess") {
			setStagesState(STAGES.WORD_CHOOSING, true);
		}
	}

	return { result: result };
}
exports.addPlayerToGame = addPlayerToGame;
