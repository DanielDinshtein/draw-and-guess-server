var express = require("express");
var router = express.Router();

const CheckStage = require("../models/checkStageModel");

const { checkStageStatues, checkHealth } = require("./service/healthService");
const { getCanvasPaths, getWordDetails, removeUserStage } = require("./service/gameStageService");
const { getGameStartTime, getGamePoints } = require("./service/gameSessionsService");

router.get("/", async function (req, res, next) {
	try {
		const userID = req.header("userID");
		const gameID = req.header("gameID");

		const active = await checkHealth(gameID, userID);

		if (active) {
			res.status(202).send({ statues: 202 });
		} else {
			res.status(406).send({ statues: 406 });
		}
	} catch (err) {
		next(err);
	}
});

router.get("/wordChoosing", async function (req, res, next) {
	const userID = req.header("userID");

	const canChange = await checkStageStatues(userID, "waiting");

	if (canChange) {
		res.status(200).send({ status: 202 });
	} else {
		res.status(202).send({ status: 200 });
	}
});

router.post("/wordChoosing", async function (req, res, next) {
	const { gameID, userID, changeState } = req.body;

	if (changeState) {
		await removeUserStage(userID);
		const startTime = await getGameStartTime(gameID);
		res.status(200).send({ status: 200, startTime: startTime });
	} else {
		res.status(400).send({ status: 400, success: false });
	}
});

router.get("/guessing", async function (req, res, next) {
	const userID = req.header("userID");
	const gameID = req.header("gameID");

	const canChange = await checkStageStatues(userID, "guessing");

	if (canChange) {
		res.status(204).send({ status: 204 });
	} else {
		const points = await getGamePoints(gameID);
		res.status(202).send({ status: 202, points: points });
	}
});

router.post("/guessing", async function (req, res, next) {
	const { gameID, userID, changeState } = req.body;

	if (changeState) {
		// TODO: Update or Remove
		const wordDetails = await getWordDetails(gameID);

		const canvasPaths = await getCanvasPaths(gameID);

		res.status(200).send({ status: 200, ...wordDetails, canvasPaths: canvasPaths });
	} else {
		res.status(400).send({ status: 400, success: false });
	}
});

module.exports = router;
