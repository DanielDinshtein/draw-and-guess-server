class DrawDetails {
	constructor(currentWord = "", wordPoints = 0, canvasPaths = []) {
		this.currentWord = currentWord;
		this.wordPoints = wordPoints;
		this.canvasPaths = canvasPaths;
	}
}

exports.DrawDetails = DrawDetails;
