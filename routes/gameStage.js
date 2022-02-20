var express = require("express");
var router = express.Router();

const User = require("../models/userModel");
const CheckStage = require("../models/checkStageModel");

const { setDrawStage, removeUserStage } = require("./service/gameStageService");
const { updateUserRole } = require("./service/usersService");
const { updateUserStage } = require("./service/healthService");
const { setWordPoints } = require("./service/gameSessionsService");
const { ObjectId } = require("mongodb");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

//* ------------------------------ /login ------------------------------ *//

router.post("/draw", async (req, res, next) => {
	const { gameID, userID, word, wordPoints, canvasPaths } = req.body;
	try {
		const result = await setDrawStage(gameID, word, wordPoints, canvasPaths);

		if (!result) {
			res.status(400).send({ status: 400 });
			return;
		}

		const users = await User.find({ gameSession: new ObjectId(gameID), role: "guess" });

		const secondUser = users[0];

		const user = await updateUserRole(userID, "guess");

		const checkStage = new CheckStage({ user: user, gameStage: "guessing" });
		await checkStage.save();

		await updateUserStage(secondUser, "guessing", true);

		res.status(200).send({ status: 200 });
	} catch (err) {
		next(err);
	}
});

router.post("/guess", async (req, res, next) => {
	const { gameID, userID, wordPoints } = req.body;
	try {
		const updatedGamePoints = await setWordPoints(gameID, wordPoints);

		if (!updatedGamePoints) {
			res.status(400).send({ status: 400 });
			return;
		}

		await updateUserRole(userID, "draw");

		await removeUserStage(userID);

		res.status(200).send({ status: 200, totalPoints: updatedGamePoints });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
