var express = require("express");
var router = express.Router();

const { STAGES } = require("../utils/constants");

const { getGameStartTime } = require("./service/gameSessionsService");
const { checkStageStatues } = require("./service/healthService");

router.get("/", function (req, res, next) {
	const userID = req.header("userID");

	if (req.user_id === req.session.user_id) {
		res.status(200).send();
	} else {
		res.status(500).send();
	}
});

router.get("/wordChoosing", async function (req, res, next) {
	const userID = req.header("userID");

	const canChange = await checkStageStatues(userID);

	if (canChange) {
		res.status(204).send();
	} else {
		res.status(200).send();
	}
});

router.post("/wordChoosing", async function (req, res, next) {
	const { gameID, userID, changeState } = req.body;

	if (changeState) {
		// TODO: Update or Remove
		const startTime = await getGameStartTime(gameID);
		res.status(200).send({ status: 200, startTime: startTime });
	} else {
		res.status(400).send({ status: 400, success: false });
	}
});

router.get("/guessing", async function (req, res, next) {
	const userID = req.header("userID");

	const canChange = await checkStageStatues(userID);

	if (canChange) {
		res.status(204).send();
	} else {
		res.status(200).send();
	}
});

router.post("/guessing", function (req, res, next) {
	const { changeState } = req.body;

	if (changeState) {
		setStagesState(STAGES.GUESSING, false);
		res.status(200).send({ status: 200, success: true });
	} else {
		res.status(400).send({ status: 400, success: false });
	}
});

module.exports = router;
