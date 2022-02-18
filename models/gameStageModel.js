const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const GameStageSchema = new Schema({
	word: {
		type: String,
		default: "",
	},
	wordPoints: {
		type: Number,
		default: 0,
	},
	canvasPaths: {
		type: Array,
		default: [],
	},
});

module.exports = GameStage = mongoose.model("gameStage", GameStageSchema);
