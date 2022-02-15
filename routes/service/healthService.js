const { GAME_STAGE, STAGES } = require("../../utils/constants");

/**************************************************************/
/*  Data Structure  */

const stagesState = {
	wordChoosing: false,
	guessing: false,
};
exports.stagesState = stagesState;

/**************************************************************/

/****   Health Checks - Helpers   ****/

function canChangeStage(stage) {
	return stagesState[stage];
}
exports.canChangeStage = canChangeStage;

function setStagesState(stage, newState) {
	stagesState[stage] = newState;
}
exports.setStagesState = setStagesState;
