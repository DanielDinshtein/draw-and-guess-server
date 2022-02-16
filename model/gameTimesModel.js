class GameTimes {
	constructor() {
		let nowTime = new Date();
		this.timeStarted = nowTime;
		this.timeEnded = nowTime;
		this.totalTimePlayed = nowTime;
	}
}

exports.GameTimes = GameTimes;
