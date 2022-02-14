const localStorage = require("localStorage");

function getGame() {
	let gameDetails;
	let game = localStorage.getItem("game");

	if (game) {
		gameDetails = JSON.parse(game);
	} else {
		gameDetails = {};
	}

	return gameDetails;
}
exports.getGame = getGame;

function setGame(game) {
	localStorage.setItem("game", JSON.stringify(game));
}
exports.setGame = setGame;
