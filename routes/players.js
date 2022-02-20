var express = require("express");
var router = express.Router();

const { addPlayerToGame } = require("./service/oldServices/playersService");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.post("/login", async (req, res, next) => {
	const username = req.body.username;
	try {
		const result = await addPlayerToGame(username);

		if (result.invalidUsername) {
			res.status(401).send({ status: 401, message: "Invalid username - Please enter different." });
		} else if (result.emptyUsername) {
			res.status(400).send({ status: 400, message: "Invalid username - empty username." });
		} else {
			res.status(200).send({ status: 200, result: result });
		}
	} catch (err) {
		next(err);
	}
});

module.exports = router;
