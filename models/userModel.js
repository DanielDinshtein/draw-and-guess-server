const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	inActiveSession: {
		type: Boolean,
		default: false,
	},
	gameSession: {
		type: Schema.Types.ObjectId,
		ref: "gameSessions",
	},
	stage: {
		type: Schema.Types.ObjectId,
		ref: "gameStage",
	},
});

module.exports = User = mongoose.model("users", UserSchema);
