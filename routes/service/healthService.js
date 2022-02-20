const User = require("../../models/userModel");
const CheckStage = require("../../models/checkStageModel");
const GameSessions = require("../../models/gameSessionsModel");
const Health = require("../../models/healthModel");

const { ObjectId } = require("mongodb");

/************************   NEW  *********************************/

/****  State Checker   ****/

async function checkStageStatues(userID, stage) {
	const userStatues = await CheckStage.find({ user: new ObjectId(userID), gameStage: stage });

	if (userStatues.length === 0) {
		// TODO: What with this?
		return;
	}

	const canChange = userStatues[0].canChangeStage;

	return canChange;
}
exports.checkStageStatues = checkStageStatues;

/****  Health Checkers   ****/

async function checkHealth(gameID, userID) {
	const ObjectGameID = new ObjectId(gameID);
	const ObjectUserID = new ObjectId(userID);

	let sessionHealth;

	const healthStatues = await Health.find({ gameSession: ObjectGameID });

	if (healthStatues.length !== 0) {
		sessionHealth = healthStatues[0];

		if (sessionHealth.notifyCancel) {
			return false;
		}

		if (sessionHealth.user1 && sessionHealth.user2) {
			if (JSON.stringify(sessionHealth.user1) == JSON.stringify(ObjectUserID)) {
				const timeElapsed_1 = parseInt((new Date() - new Date(sessionHealth.user2_lastHealthCheck)) / 1000);

				if (timeElapsed_1 > 20) {
					await setNotifyCancel(sessionHealth._id);
					await setUserInactive(ObjectGameID);
					await setUserInactive(ObjectUserID);
					return false;
				}

				const updatedHealth = await Health.findOneAndUpdate({ _id: sessionHealth._id }, { user1_lastHealthCheck: new Date() }, { new: true });
				await updatedHealth.save();
			} else if (JSON.stringify(sessionHealth.user2) == JSON.stringify(ObjectUserID)) {
				const timeElapsed_2 = parseInt((new Date() - new Date(sessionHealth.user1_lastHealthCheck)) / 1000);

				if (timeElapsed_2 > 20) {
					await setNotifyCancel(sessionHealth._id);
					await setUserInactive(ObjectGameID);
					await setUserInactive(ObjectUserID);
					return false;
				}

				const updatedHealth = await Health.findOneAndUpdate({ _id: sessionHealth._id }, { user2_lastHealthCheck: new Date() }, { new: true });

				await updatedHealth.save();
			}
		}
	}
	return true;
}
exports.checkHealth = checkHealth;

async function checkHealthByUser(userID) {
	const users = await User.find({ _id: userID });

	if (!users[0].inActiveSession) {
		return false;
	}

	return true;
}
exports.checkHealthByUser = checkHealthByUser;

async function checkHealthByGame(gameID) {
	const gameSession = await GameSessions.find({ _id: gameID });

	if (!gameSession[0].isActive) {
		return false;
	}

	return true;
}
exports.checkHealthByGame = checkHealthByGame;

/***************************/

/****  State Updates   ****/

async function updateUserStage(user, toStage, canChangeStage = true) {
	const userStageStatues = await CheckStage.findOneAndUpdate({ user: user }, { gameStage: toStage, canChangeStage: canChangeStage }, { new: true });

	await userStageStatues.save();
}
exports.updateUserStage = updateUserStage;

/****  Setter In Active   ****/

async function setNotifyCancel(healthID) {
	const updatedHealth = await Health.findOneAndUpdate({ _id: healthID }, { notifyCancel: true }, { new: true });
	await updatedHealth.save();
}
exports.setNotifyCancel = setNotifyCancel;

async function setGameInactive(gameID) {
	const gameSession = await GameSessions.findOneAndUpdate({ _id: gameID }, { isActive: false }, { new: true });
	await gameSession.save();
}
exports.setGameInactive = setGameInactive;

async function setUserInactive(userID) {
	const users = await User.findOneAndUpdate({ _id: userID }, { inActiveSession: false }, { new: true });
	await users.save();
}
exports.setUserInactive = setUserInactive;
