var express = require("express");
var router = express.Router();

const { loginUser } = require("./service/usersService");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

//* ------------------------------ /login ------------------------------ *//

router.post("/login", async (req, res, next) => {
	const { username } = req.body;
	try {
		const result = await loginUser(username);

		if (result.invalidUsername) {
			res.status(401).send({ status: 401, message: "Invalid username - Please enter different." });
		} else if (result.emptyUsername) {
			res.status(400).send({ status: 400, message: "Invalid username - empty username." });
		} else if (result.user) {
			// Set cookie
			req.session.user_id = JSON.stringify(result.user._id);

			res.status(200).send({ status: 200, ...result });
		}
	} catch (err) {
		next(err);
	}
});

//* ------------------------------ Testing ------------------------------ *//

// TODO: Remove
const GameSessions = require("../models/gameSessionsModel");
const GameStage = require("../models/gameStageModel");
const User = require("../models/userModel");

router.post("/delete", async (req, res, next) => {
	try {
		await GameSessions.remove({});
		await GameStage.remove({});
		await User.remove({});
		res.status(200).send({ status: 200 });
	} catch (err) {
		next(err);
	}
});

//* ------------------------------ /logout ------------------------------ *//

router.post("/logout", function (req, res) {
	// TODO: What about this?

	req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
	console.log(req.session);
	res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
