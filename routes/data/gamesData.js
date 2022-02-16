const localStorage = require("localStorage");
const { ObjectId } = require("mongodb");
const { getDB, closeConnection } = require("./DBConnector");

/****   Testing & Helpers   ****/

async function clearGamesData(all = false) {
	let result;
	try {
		localStorage.removeItem("pendingGame");

		if (!all) {
			return;
		}
		const db = await getDB();

		// execute find query
		const collection = await db.collection("game-sessions");
		result = await collection.remove({});
	} catch (err) {
		console.log("Error in clearGamesData");
		console.log(err);
		throw err;
	} finally {
		// close connection
		await closeConnection();
	}

	return true;
}
exports.clearGamesData = clearGamesData;

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

async function getGameByID(gameID) {
	let result;

	try {
		const db = await getDB();

		// execute find query
		const collection = await db.collection("game-sessions");
		const gameDetails = await collection.find({ _id: new ObjectId(gameID) }).toArray();

		if (gameDetails.length !== 0) {
			result = gameDetails[0];
		}
	} catch (err) {
		console.log("Error in getGamesByPlayer()");
		throw err;
	} finally {
		// close connection
		await closeConnection();
	}
	return result;
}
exports.getGameByID = getGameByID;

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

async function addPendingGame(game) {
	let result;
	try {
		const db = await getDB();

		// execute find query
		const collection = await db.collection("game-sessions");
		result = await collection.insertOne(game);

		if (result.acknowledged) {
			let gameID = JSON.parse(JSON.stringify(result.insertedId));

			// game["_id"] = gameID;
			result["gameID"] = gameID;

			localStorage.setItem("pendingGame", JSON.stringify(game));
		}
	} catch (err) {
		console.log("Error in addPendingGame");
		console.log(err);
		throw err;
	} finally {
		// close connection
		await closeConnection();
	}

	return result;
}
exports.addPendingGame = addPendingGame;

/****   Active Game   ****/

async function setActiveGame(game, unsetPending = true) {
	let result;
	try {
		localStorage.setItem("activeGame", JSON.stringify(game));
		if (unsetPending) {
			localStorage.removeItem("pendingGame");
		}

		const db = await getDB();
		// execute find query
		const collection = await db.collection("game-sessions");

		game._id = new ObjectId(game._id);

		result = await collection.updateOne({ _id: game._id }, { $set: game });

		if (result.acknowledged) {
			result["gameID"] = game._id;
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
