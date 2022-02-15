var express = require("express");
var router = express.Router();

const { STAGES } = require("../utils/constants");

const { canChangeStage } = require("./service/healthService");

let username;
router.use(async function (req, res, next) {
	username = req.query?.username;
	next();
});

router.get("/", function (req, res, next) {
	res.status(200).send();
});

router.get("/waiting", function (req, res, next) {
	if (canChangeStage(STAGES.WAITING, username)) {
		res.status(500).send();
	} else {
		res.status(200).send();
	}
});

router.get("/wordChoosing", function (req, res, next) {
	if (canChangeStage(STAGES.WORD_CHOOSING, username)) {
		res.status(500).send();
	} else {
		res.status(200).send();
	}
});

router.get("/drawing", function (req, res, next) {
	if (canChangeStage(STAGES.DRAWING, username)) {
		res.status(500).send();
	} else {
		res.status(200).send();
	}
});

router.get("/guessing", function (req, res, next) {
	if (canChangeStage(STAGES.GUESSING, username)) {
		res.status(500).send();
	} else {
		res.status(200).send();
	}
});

module.exports = router;
