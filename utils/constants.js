const ROLES = {
	DRAW: "draw",
	GUESS: "guess",
};
exports.ROLES = ROLES;

const PLAYER_ROLE = {
	role: ROLES.DRAW,
};
exports.PLAYER_ROLE = PLAYER_ROLE;

const STAGES = {
	WAITING: "waiting",
	WORD_CHOOSING: "wordChoosing",
	DRAWING: "drawing",
	GUESSING: "guessing",
};
exports.STAGES = STAGES;

const GAME_STAGE = {
	stage: STAGES.WAITING,
};
exports.GAME_STAGE = GAME_STAGE;
