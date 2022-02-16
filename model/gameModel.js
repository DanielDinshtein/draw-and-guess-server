class Game {
	constructor(firstPlayer, secondPlayer, gameTimes, drawingSessionDetails, totalPoints = 0) {
		this._id = null;
		this.firstPlayer = firstPlayer;
		this.secondPlayer = secondPlayer;
		this.gameTimes = gameTimes;
		this.drawingSessionDetails = drawingSessionDetails;
		this.totalPoints = totalPoints;
	}
}

exports.Game = Game;
