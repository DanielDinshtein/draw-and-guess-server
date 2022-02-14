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

function getActiveGame() {
	try {
		let activeGame = localStorage.getItem("activeGame");

		if (activeGame) {
			activeGame = JSON.parse(activeGame);
			localStorage.removeItem("activeGame");
		} else {
			activeGame = {};
		}

		return activeGame;
	} catch (err) {
		throw err;
	}
}
exports.getActiveGame = getActiveGame;

async function setActiveGame(game) {
	let result;
	try {
		const db = await getDB();

		console.log(game);
		// execute find query
		const collection = await db.collection("game-sessions");
		result = await collection.insertOne(game);

		if (result.acknowledged) {
			let gameID = JSON.parse(JSON.stringify(result.insertedId));

			game._id = gameID;
			console.log("game Object -   ");
			console.log(game);
			result["game"] = game;

			localStorage.setItem("activeGame", JSON.stringify(game));
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
exports.setActiveGame = setActiveGame;
