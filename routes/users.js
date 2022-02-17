var express = require("express");
var router = express.Router();

const { loginUser } = require("./service/usersService");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.post("/login", async (req, res, next) => {
	const { username } = req.body;
	try {
		const result = await loginUser(username);

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

// TODO: Remove - This is Example

// const userModel = require("./models/userModel");
// const gameSessionsModel = require("./models/gameSessionsModel");

// app.post("/add_game", async (request, response) => {
// 	const gameSession = new gameSessionsModel(request.body);

// 	try {
// 		await gameSession.save();
// 		response.send(gameSession);
// 	} catch (error) {
// 		response.status(500).send(error);
// 	}
// });

// app.post("/add_user", async (request, response) => {
// 	const user = new userModel(request.body);

// 	try {
// 		await user.save();
// 		response.send(user);
// 	} catch (error) {
// 		response.status(500).send(error);
// 	}
// });

// app.get("/users", async (request, response) => {
// 	const users = await userModel.find({});

// 	try {
// 		response.send(users);
// 	} catch (error) {
// 		response.status(500).send(error);
// 	}
// });
