var express = require("express");
var router = express.Router();

const { addPlayerToGame } = require('./model/playersModel');

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});


router.post("/login", async (req, res, next) => {

	const username = req.body.username;
	try {
		const result = addPlayerToGame(username);
		
		if (result.invalidUsername) {
			res.status(401).send({ status: 401, message: "Invalid username - Please enter different." });

		} else {
			res.send({ success: true, newGame: result.newGame });
		}

	} catch (err) {
		next(err);
	}
});

module.exports = router;
