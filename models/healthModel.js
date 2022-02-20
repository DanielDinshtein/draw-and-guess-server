const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const HealthSchema = new Schema({
	gameSession: {
		type: Schema.Types.ObjectId,
		ref: "gameSessions",
	},
	lastHealthCheck: {
		type: Date,
		default: Date.now,
	},
    notifyCancel: {
        type: Boolean,
        default: false
    },
});

module.exports = Health = mongoose.model("health", HealthSchema);