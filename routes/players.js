var express = require("express");
var router = express.Router();

const { addPlayerToGame } = require('./model/playersModel');

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});


router.post("/login", async (req, res, next) => {

	const username = req.body.username;

	const result = addPlayerToGame(username);

	if (result.invalidUsername) {
		res.send({ success: false, message: "Invalid username - Please enter different." });
	} else {
		res.send({ success: true, newGame: result.newGame });
	}

});

module.exports = router;
