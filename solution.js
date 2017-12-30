/** Maze - solution.js
 * Automatic Maze Soluting Algorithm
 *
 * (c) 2016, 2017 Nauman Umer
 * This file is released under the MIT License.
 */


var lastMove = "";
var moves = '';

var restorePoints = [];
var inverseMoves = {
    "l": "r",
    "r": "l",
    "b": "t",
    "t": "b"
}

/**
 * Main solution function
 */
function solve() {
    // get current pos of player in Maze
    var pos = player.position();
    var tileUnderPlayer = `#${pos.left/TileSize}-${pos.top/TileSize}`;

    // run main solution loop
    solveLoop(tileUnderPlayer);
}


/**
 * Main solution loop
 * 
 * @param crnt - Current player cell
 */
function solveLoop(crnt) {
    // check if game is solved
    if (crnt == cells[cells.length - 1]) {
        move("r");
        writeOnConsole(" ");
        writeOnConsole("Solved");
        writeOnConsole(" ");
        return false;
    }

    // get possible direction where we can move
    var possibleMoves = getPossibleDirs(crnt)
    // remove dir from where we can to avoid backward motion
    possibleMoves = removeCellFromArray(possibleMoves, inverseMoves[lastMove]);

    // check if we can move in more then one dir
    if (possibleMoves.length > 1){
        // create a restore point
        createRestorePoint(crnt, possibleMoves[0], player.position(), JSON.parse(JSON.stringify(possibleMoves)));
    }

    // check if we have no option
    else if (possibleMoves.length == 0) {
        // retore most recent restore point
        var data = restoreLast();
        crnt = data.crnt;
        possibleMoves = data.possibleMoves;
    }

    // pick first move and apply
    var m = possibleMoves[0];
    move(m);

    // add move to moves and last move
    moves += lastMove = m;
    // update crnt cell
    crnt = getNextCell(crnt, m);

    // loop the funtion after 200 ms
    setTimeout(() => solveLoop(crnt), 200);
}


/**
 * Create a restore point of current state of game
 * 
 * @param crnt - current cell of player
 * @param move - move we are going to make
 * @param pos - current position of player
 * @param possibleMoves - possible moves we have
 */
function createRestorePoint(crnt, move, pos, possibleMoves) {
    writeOnConsole(`Found ${possibleMoves.length} possible ways. Testing first.`)
    restorePoints.push({
        "crnt": crnt,
        "moves": moves,
        "lastMove": lastMove,
        "crntMove": move,
        "possibleMoves": removeCellFromArray(possibleMoves, move),
        "pos": pos
    })
}


/**
 * Restore most recent restore point
 */
function restoreLast() {
    writeOnConsole("Way locked. Testing other.");
    // get last element from restorePoints array
    var data = restorePoints.pop();
    //reset everything
    moves = data.moves;
    lastMove = data.lastMove;
    player.css(data.pos);

    // return restored game state
    return data;
}