class Game {
	constructor(firstPlayer, secondPlayer, gameTimes, canvasPath = [], currentWord = "", totalPoints = 0) {
		this._id = null;
		this.firstPlayer = firstPlayer;
		this.secondPlayer = secondPlayer;
		this.gameTimes = gameTimes;
		this.canvasPath = canvasPath;
		this.currentWord = currentWord;
		this.totalPoints = totalPoints;
	}
}

exports.Game = Game;
