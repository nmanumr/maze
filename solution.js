var lastMove = "";
var moves = '';

var restorePoints = [];

var inverseMoves = {
    "l": "r",
    "r": "l",
    "b": "t",
    "t": "b"
}

function solve() {
    var pos = player.position();
    var tileUnderPlayer = `#${pos.left/TileSize}-${pos.top/TileSize}`;
    solveLoop(tileUnderPlayer);
}

function solveLoop(crnt) {
    if (crnt == cells[cells.length - 1]) {
        move("r");
        writeOnConsole(" ");
        writeOnConsole("Solved");
        writeOnConsole(" ");
        return false;
    }
    var m;
    var possibleMoves = getPossibleDirs(crnt)
    possibleMoves = removeCellFromArray(possibleMoves, inverseMoves[lastMove]);

    if (possibleMoves.length > 1)
        createRestorePoint(crnt, possibleMoves[0], player.position(), JSON.parse(JSON.stringify(possibleMoves)));

    else if (possibleMoves.length == 0) {
        var data = restoreLast();
        crnt = data.crnt;
        possibleMoves = data.possibleMoves;
    }
    m = possibleMoves[0];

    move(m);
    moves += lastMove = m;
    crnt = getNextCell(crnt, m);

    setTimeout(() => solveLoop(crnt), 200);
}

function createRestorePoint(crnt, move, pos, possibleMove) {
    writeOnConsole(`Found ${possibleMove.length} possible ways. Testing first.`)
    restorePoints.push({
        "crnt": crnt,
        "moves": moves,
        "lastMove": lastMove,
        "crntMove": move,
        "possibleMoves": removeCellFromArray(possibleMove, move),
        "pos": pos
    })
}

function restoreLast() {
    writeOnConsole("Way locked. Testing other.");
    var data = restorePoints.pop();
    moves = data.moves;
    lastMove = data.lastMove;
    player.css(data.pos);

    return data;
}

function arrangeArray(arry) {
    var arry = [];
    arry.sort(function (e) {
        return e != "b" || e != "r";
    })

    return arry;
}