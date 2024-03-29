const { ObjectId } = require("mongodb");
const User = require("../../models/userModel");

const { addUserToGame } = require("./gameSessionsService");
const { removeUserStage, removeGameStage } = require("./gameStageService");
const { setUserInactive, setGameInactive, setNotifyCancel } = require("./healthService");

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
		await setNotifyCancel("", gameID);
		await setGameInactive(gameID);
		await setUserInactive(userID);
		await removeUserStage(userID);
		await removeGameStage(gameID);
	} catch (err) {
		console.log("err in /users -> logout\n", err);
		throw err;
	}
}
exports.logout = logout;

/***************************/

/****       Getters       ****/

async function getUsername(gameID) {
	try {
		let usernames = [];
		const users2 = await User.find({});

		for (const user in users2) {
			if (JSON.stringify(users2[user].gameSession) == JSON.stringify(gameID)) {
				usernames.push(users2[user].name);
			}
		}

		if (usernames.length === 0) {
			return;
		}
		return usernames;
	} catch (err) {
		console.log("err in /users -> getUsername\n", err);
		throw err;
	}
}
exports.getUsername = getUsername;
