const localStorage = require("localStorage");
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
		console.log("Error in setPendingGame");
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

/****   Active Game   ****/

async function setActiveGame(game, unsetPending = true) {
	let result;
	try {
		const db = await getDB();

		// execute find query
		const collection = await db.collection("game-sessions");
		result = await collection.replaceOne({ _id: game._id }, game);

		if (result.acknowledged) {
			result["gameID"] = game._id;

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
