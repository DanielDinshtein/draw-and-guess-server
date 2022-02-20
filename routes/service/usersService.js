const { ObjectId } = require("mongodb");
const User = require("../../models/userModel");
const CheckStage = require("../../models/checkStageModel");

const { addUserToGame } = require("./gameSessionsService");
const { setUserInactive, setGameInactive } = require("./healthService");

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

async function updateUserRole(userID, role) {
	try {
		const user = await User.findOneAndUpdate({ _id: new ObjectId(userID) }, { role: role }, { new: true });

		await user.save();

		return user;
	} catch (err) {
		console.log("err in /users -> updateUserRole\n", err);
		throw err;
	}
}
exports.updateUserRole = updateUserRole;

async function logout(gameID, userID) {
	try {
		await setGameInactive(gameID);
		await setUserInactive(userID);
	} catch (err) {
		console.log("err in /users -> updateUserRole\n", err);
		throw err;
	}
}
exports.logout = logout;
