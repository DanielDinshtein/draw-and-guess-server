var express = require("express");
var router = express.Router();

const { getBestGame } = require("./service/gameSessionsService");

/* GET gameSession. */
router.get("/", async function (req, res, next) {
	const bestGame = await getBestGame();
	res.status(200).send({ statues: 200, bestGame });
});

module.exports = router;
