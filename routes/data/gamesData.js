const localStorage = require("localStorage");
const { getDB, closeConnection } = require("./DBConnector");

async function getGamesByPlayer(player) {
	let result;
	try {
		const db = await getDB();

		// execute find query
		const collection = await db.collection("game-sessions");
		const itemsByFirst = await collection.find({ "firstPlayer.username": player }).toArray();
		const itemsBySecond = await collection.find({ "secondPlayer.username": player }).toArray();

		result = [...itemsByFirst, ...itemsBySecond];
	} catch (err) {
		console.log("Error in getGamesByPlayer()");
		throw err;
	} finally {
		// close connection
		await closeConnection();
	}
	return result;
}
exports.getGamesByPlayer = getGamesByPlayer;

/****   Pending Game   ****/

function getPendingGame() {
	try {
		let pendingGame = localStorage.getItem("pendingGame");

		if (pendingGame) {
			pendingGame = JSON.parse(pendingGame);
		} else {
			pendingGame = {};
		}

		return pendingGame;
	} catch (err) {
		throw err;
	}
}
exports.getPendingGame = getPendingGame;

async function setPendingGame(game) {
	let result;
	try {
		const db = await getDB();

		// execute find query
		const collection = await db.collection("game-sessions");
		result = await collection.insertOne(game);

		if (result.acknowledged) {
			let gameID = JSON.parse(JSON.stringify(result.insertedId));

			game._id = gameID;
			result["gameID"] = gameID;

			localStorage.setItem("pendingGame", JSON.stringify(game));
		}
	} catch (err) {
		console.log("Error in setPendingGame");
		console.log(err);
		throw err;
	} finally {
		// close connection
		await closeConnection();
	}

	return result;
}
exports.setPendingGame = setPendingGame;

async function deletePendingGame(game = "") {
	let result;
	try {
		localStorage.removeItem("pendingGame");

		if (!game) {
			return;
		}
		const db = await getDB();

		// execute find query
		const collection = await db.collection("game-sessions");
		result = await collection.insertOne(game);

		if (result.acknowledged) {
			let gameID = JSON.parse(JSON.stringify(result.insertedId));

			game._id = gameID;
			result["gameID"] = gameID;

			localStorage.setItem("pendingGame", JSON.stringify(game));
		}
	} catch (err) {
		console.log("Error in setPendingGame");
		console.log(err);
		throw err;
	} finally {
		// close connection
		await closeConnection();
	}

	return result;
}
exports.deletePendingGame = deletePendingGame;

/****   Active Game   ****/

async function setActiveGame(game, unsetPending = true) {
	let result;
	try {
		const db = await getDB();

		console.log(" ID Before replace : ");
		console.log(game._id);

		// execute find query
		const collection = await db.collection("game-sessions");
		//  NOTE: save vs. replaceOne ??
		result = await collection.replaceOne({ _id: game._id }, game);

		console.log(result);

		if (result.acknowledged) {
			let gameID = JSON.parse(JSON.stringify(result.insertedId));

			if (gameID !== game._id) {
				throw new Error("collection.save ->  not same gameID");
			}
			result["gameID"] = gameID;

			localStorage.setItem("activeGame", JSON.stringify(game));
			if (unsetPending) {
				localStorage.removeItem("pendingGame");
			}
		}
	} catch (err) {
		console.log("Error in setActiveGame");
		console.log(err);
		throw err;
	} finally {
		// close connection
		await closeConnection();
	}

	return result;
}
exports.setActiveGame = setActiveGame;
