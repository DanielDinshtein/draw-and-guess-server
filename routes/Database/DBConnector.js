const { MongoClient } = require('mongodb');
require("dotenv").config();


const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function closeConnection() {
    await client.close();
}


async function getDB() {

    try {
        // connect to your cluster
        client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // specify the DB's name
        const db = client.db(dbName);
        return db;

    } catch (err) {
        console.log("Error in getDB()");
        throw err;
    }
}


module.exports = {
    getDB: getDB,
    closeConnection: closeConnection,
}