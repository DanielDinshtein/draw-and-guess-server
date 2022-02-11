const { getGame, setGame } = require('../Database/gameStorage');


function addPlayerToGame(player) {


    if (!player) {
        return { newGame: null, invalidUsername: true };
    }

    let newGame = true;
    let invalidUsername = false;

    let game = getGame();

    if (Object.keys(game).length == 0) {

        game = {
            firstPlayer: player,
            secondPlayer: "",
            points: 0,
            timePlayed: 0
        };

    } else if (Object.keys(game).length != 0 && game["firstPlayer"] != player) {

        game["secondPlayer"] = player;
        newGame = false;

    } else {
        invalidUsername = true;
    }

    //  Update Game Details
    if (!invalidUsername) {
        setGame(game);
    }

    return { newGame: newGame, invalidUsername: invalidUsername };
}
exports.addPlayerToGame = addPlayerToGame;