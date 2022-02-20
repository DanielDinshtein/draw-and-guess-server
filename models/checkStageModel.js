const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const CheckStageSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	gameStage: {
		type: String,
		enum: ["waiting", "guessing"],
		default: "waiting",
	},
	canChangeStage: {
		type: Boolean,
		default: false,
	},
});

module.exports = CheckStage = mongoose.model("checkStage", CheckStageSchema);
