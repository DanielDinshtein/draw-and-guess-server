const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const HealthSchema = new Schema({
	gameSession: {
		type: Schema.Types.ObjectId,
		ref: "gameSessions",
	},
	user1: {
		type: Schema.Types.ObjectId,
		ref: "users",
		default: null,
	},
	user1_lastHealthCheck: {
		type: Date,
		default: Date.now,
	},
	user2: {
		type: Schema.Types.ObjectId,
		ref: "users",
		default: null,
	},
	user2_lastHealthCheck: {
		type: Date,
		default: Date.now,
	},
	notifyCancel: {
		type: Boolean,
		default: false,
	},
});

module.exports = Health = mongoose.model("health", HealthSchema);
