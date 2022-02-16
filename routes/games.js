var express = require("express");
var router = express.Router();

const { initGameSession, getPlayersGames, clearGameDetails, updateReceivedWordDetails, updateReceivedCanvasPaths } = require("./service/gamesService");

router.post("/", async (req, res, next) => {
	const { gameID, username } = req.body;
	try {
		const result = await initGameSession(gameID, username);

		if (result.gameNotFound) {
			res.status(400).send({ status: 400, message: "Invalid gameID" });
		} else {
			res.status(200).send({ status: 200, result });
		}
	} catch (err) {
		console.log("Hey err");
		next(err);
	}
});

router.post("/chosenWord", async (req, res, next) => {
	const { gameID, word, wordPoints } = req.body;
	try {
		const result = await updateReceivedWordDetails(gameID, word, wordPoints);

		if (result.gameNotFound) {
			res.status(404).send({ status: 404, message: "Game not found. Please try again" });
		} else if (result.gameNotUpdated) {
			res.status(400).send({ status: 400, message: "Game not updated. Something went wrong" });
		} else if (result.succuss) {
			res.status(200).send({ status: 200, message: "Game details updated" });
		}
	} catch (err) {
		console.log(err);
	}
});

router.post("/draw", async (req, res, next) => {
	const { gameID, wordPoints, canvasPaths } = req.body;
	try {
		const result = await updateReceivedCanvasPaths(gameID, wordPoints, canvasPaths);

		if (result.gameNotFound) {
			res.status(404).send({ status: 404, message: "Game not found. Please try again" });
		} else if (result.gameNotUpdated) {
			res.status(400).send({ status: 400, message: "Game not updated. Something went wrong" });
		} else if (result.succuss) {
			res.status(200).send({ status: 200, message: "Game details updated" });
		}
	} catch (err) {
		console.log(err);
	}
});

router.post("/deleteGame", async (req, res, next) => {
	const { all } = req.body;
	try {
		const result = await clearGameDetails(all);
		res.status(200).send({ status: 200, message: "Games Deleted", result: result });
	} catch (err) {
		console.log(err);
		throw err;
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
