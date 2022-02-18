const User = require("../../models/userModel");

const { addUserToGame } = require("./gameSessionsService");

async function loginUser(username) {
	try {
		if (!username) {
			return { emptyUsername: true };
		}

		const users = await User.find({ name: username, inActiveSession: true });

		if (users.length !== 0) {
			return { invalidUsername: true };
		}

		const user = new User({ name: username });

		await addUserToGame(user);
		await user.save();

		return { user: user };
	} catch (err) {
		console.log("err in /users -> loginUser\n", err);
		throw err;
	}
}
exports.loginUser = loginUser;
