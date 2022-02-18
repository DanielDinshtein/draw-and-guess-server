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
		default: true,
	},
	gameSession: {
		type: Schema.Types.ObjectId,
		ref: "gameSessions",
	},
	role: {
		type: String,
		enum: ["draw", "guess"],
	},
});

module.exports = User = mongoose.model("users", UserSchema);
