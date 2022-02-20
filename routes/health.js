var express = require("express");
var router = express.Router();

const { STAGES } = require("../utils/constants");

const { checkStageStatues } = require("./service/healthService");
const { getCanvasPaths, getWordDetails } = require("./service/gameStageService");
const { getGameStartTime } = require("./service/gameSessionsService");

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
		res.status(200).send({status: 202});
	} else {
		res.status(202).send({status: 200});
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
	const gameID = req.header("gameID");

	const canChange = await checkStageStatues(userID);

	if (canChange) {
		const canvasPaths = await getCanvasPaths(gameID);

		res.status(204).send({ canvasPaths: canvasPaths });
	} else {
		res.status(202).send({status: 202});
	}
});

router.post("/guessing", async function (req, res, next) {
	const { gameID, userID, changeState } = req.body;

	if (changeState) {
		// TODO: Update or Remove
		const wordDetails = await getWordDetails(gameID);

		res.status(200).send({ status: 200, ...wordDetails });
	} else {
		res.status(400).send({ status: 400, success: false });
	}
});

module.exports = router;
