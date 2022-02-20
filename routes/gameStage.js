var express = require("express");
var router = express.Router();

const CheckStage = require("../models/checkStageModel");

const { setDrawStage } = require("./service/gameStageService");
const { updateUserRole } = require("./service/usersService");
const { updateUserStage } = require("./service/healthService");
const { getGame } = require("./service/gameSessionsService");

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

		const user = await updateUserRole(userID, "guess");

		const checkStage = new CheckStage({ user: user, gameStage: "guessing" });
		await checkStage.save();

		const game = await getGame(gameID);

		let secondUser;
		if (JSON.stringify(game.users[0]._id) === userID) {
			secondUser = game.users[0];
		} else {
			secondUser = game.users[1];
		}

		await updateUserStage(secondUser, "guessing", true);

		res.status(200).send({ status: 200 });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
