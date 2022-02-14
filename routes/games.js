var express = require("express");
var router = express.Router();

const { getPlayersGames, clearGameDetails } = require("./service/gamesService");

router.post("/draw", async (req, res, next) => {
	const { username, word, wordPoints, canvasPath } = req.body;
	try {
		clearGameDetails();
		res.status(200).send({ status: 200, message: "Game Deleted" });
	} catch (err) {
		console.log(err);
	}
});

router.post("/deleteGame", async (req, res, next) => {
	try {
		clearGameDetails();
		res.status(200).send({ status: 200, message: "Game Deleted" });
	} catch (err) {
		console.log(err);
	}
});

router.get("/playerName", async (req, res, next) => {
	const username = req.body.username;
	try {
		const games = await getPlayersGames(username);

		res.status(200).send(games);
	} catch (err) {
		console.log("Hey err");
		next(err);
	}
});

module.exports = router;
