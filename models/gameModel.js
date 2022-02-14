class Game {
	constructor(firstPlayer, secondPlayer) {
		this._id = null;
		this.firstPlayer = firstPlayer;
		this.secondPlayer = secondPlayer;
		this.gameTimes = { timeStarted: "0", timeEnded: "0", totalTimePlayed: "0" };
		this.canvasPath = [];
		this.currentWord = "";
		this.totalPoints = 0;
	}
}

exports.Game = Game;
