const User = require("../../models/userModel");
const CheckStage = require("../../models/CheckStageModel");
const GameSessions = require("../../models/gameSessionsModel");

const { ObjectId } = require("mongodb");

/************************   NEW  *********************************/

/****  State Checker   ****/

async function checkStageStatues(userID) {
	const userStatues = await CheckStage.find({ user: new ObjectId(userID) });

	if (userStatues.length === 0) {
		// TODO: What with this?
		return;
	}

	const canChange = userStatues[0].canChangeStage;

	return canChange;
}
exports.checkStageStatues = checkStageStatues;

/***************************/

/****  State Updates   ****/

async function updateUserStage(userID, toStage) {
	const userStageStatues = await CheckStage.findOneAndUpdate({ user: userID }, { gameStage: toStage, canChangeStage: true }, { new: true });

	// TODO:  Maybe check if updated
	await userStageStatues.save();
}
exports.updateUserStage = updateUserStage;

/**************************old*********************************/

/**************************************************************/
/*  Data Structure  */

// const stagesState = {
// 	wordChoosing: false,
// 	guessing: false,
// };
// exports.stagesState = stagesState;

/**************************************************************/

/****   Health Checks - Helpers   ****/

// function canChangeStage(stage) {
// 	return stagesState[stage];
// }
// exports.canChangeStage = canChangeStage;

// function setStagesState(stage, newState) {
// 	stagesState[stage] = newState;
// }
// exports.setStagesState = setStagesState;
