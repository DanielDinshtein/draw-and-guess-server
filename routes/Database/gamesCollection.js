const { getDB, closeConnection } = require("./DBConnector");


async function getGamesByPlayer(player) {

    try {

        const db = await getDB();

        // execute find query
        const collection = await db.collection("game-sessions");
        const itemsByFirst = await collection.find({ firstPlayer: player }).toArray();
        const itemsBySecond = await collection.find({ secondPlayer: player }).toArray();

        const result = [...itemsByFirst, ...itemsBySecond];

        return result;

    } catch (err) {
        console.log("Error in getGamesByPlayer()");
        throw err;

    } finally {
        // close connection
        await closeConnection();
    }
}


module.exports = {
    getGamesByPlayer: getGamesByPlayer,
}