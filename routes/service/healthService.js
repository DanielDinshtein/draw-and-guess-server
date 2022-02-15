const { GAME_STAGE, STAGES } = require("../../utils/constants");

/**************************************************************/
/*  Data Structures  */

const playersData = {
	username: "daniel",
	stage: { current: STAGES.WAITING, canChangeStage: false },
};

const stagesData = {
	waiting: { canChange: false, currentUser: "" },
	wordChoosing: { canChange: false, currentUser: "" },
	drawing: { canChange: false, currentUser: "" },
	guessing: { canChange: false, currentUser: "" },
	// waiting: { firstPlayer: {} },
};
/**************************************************************/

/*  Initial States  */

const playersState = {};
exports.playersState = playersState;

const stagesState = {
	waiting: { username: false, currentUser: "" },
	wordChoosing: { canChange: false, currentUser: "" },
	drawing: { canChange: false, currentUser: "" },
	guessing: { canChange: false, currentUser: "" },
};
exports.stagesState = stagesState;
/**************************************************************/

/****   Health Checks   ****/

function canChangeStage(stage, name) {
	return stagesState[stage].canChange;
}
exports.canChangeStage = canChangeStage;

/****   Player State & Stages   ****/

//  Login -  firstPlayer Login
function onNewPendingGame(username, stage = STAGES.WAITING) {
	// Stages State -
	stagesState[stage].currentUser = username;

	// Player State -
	playersState[username] = {
		stage: {
			current: stage,
			canChangeStage: false,
		},
	};
}
exports.onNewPendingGame = onNewPendingGame;

//  Login -  secondPlayer Login
function onNewActiveGame(username, stage = STAGES.WAITING) {
	const firstPlayer = stagesState[stage].currentUser;

	stagesData[stage].currentUser = username;
	stagesData[STAGES.WORD_CHOOSING].canChange = firstPlayer;

	playersState[firstPlayer].state.canChange = true;
	playersState[username] = {
		stage: {
			current: stage,
			canChangeStage: false,
		},
	};

	stagesState[stage].currentUser = username;

	playersState[username] = {
		stage: {
			current: stage,
			canChangeStage: false,
		},
	};
}
exports.onNewActiveGame = onNewActiveGame;
