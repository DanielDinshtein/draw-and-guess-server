var express = require("express");
var router = express.Router();

const { STAGES } = require("../utils/constants");

const { canChangeStage, setStagesState } = require("./service/healthService");

router.get("/", function (req, res, next) {
	res.status(200).send();
});

router.get("/wordChoosing", function (req, res, next) {
	if (canChangeStage(STAGES.WORD_CHOOSING)) {
		res.status(500).send();
	} else {
		res.status(200).send();
	}
});

router.post("/wordChoosing", function (req, res, next) {
	const { changeState } = req.body;

	if (changeState) {
		setStagesState(STAGES.WORD_CHOOSING, false);
		res.status(200).send({ status: 200, success: true });
	} else {
		res.status(400).send({ status: 400, success: false });
	}
});

router.get("/guessing", function (req, res, next) {
	if (canChangeStage(STAGES.GUESSING)) {
		res.status(500).send();
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
