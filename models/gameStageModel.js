const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const GameStageSchema = new Schema({
	name: {
		type: String,
        required: true
	},
	word: {
		type: String,
	},
	wordPoints: {
		type: Number,
	},
	canvasPaths: {
		type: Array,
	},
});

module.exports = GameStage = mongoose.model("gameStage", GameStageSchema);
