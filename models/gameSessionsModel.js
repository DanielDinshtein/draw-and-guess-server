const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const GameSessionsSchema = new Schema({
	isActive: {
		type: Boolean,
		default: true,
	},
	users: {
		type: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: "users",
				},
			},
		],
		default: [],
	},
	gameStage: {
		type: Schema.Types.ObjectId,
		ref: "gameStage",
	},
	totalPoints: {
		type: Number,
		default: 0,
	},
	startTime: {
		type: Date,
		default: Date.now,
	},
	endTime: {
		type: Date,
		default: Date.now,
	},
});

module.exports = GameSession = mongoose.model("gameSessions", GameSessionsSchema);
