var board = $('#board');
var TileSize = 25;
var n = 10;
var dev = false;
var cells = [];


/**
 * Initialize game board of nxn
 */
function initGame() {
    // initalize empty cell array
    cells = [];

    // set board height and width
    $("#board").height(n * TileSize);
    $("#board").width(n * TileSize);

    // initial html for board containing player element
    var boardHtml = '<div id="player"></div>';

    //itrate over each cell of game board
    var k = 0;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {

            // push a cell to initial html
            boardHtml += `<div class="cell" style="left:${j * TileSize}px;top: ${i * TileSize}px;height: ${TileSize - 1}px;width:${TileSize - 1}px" id="${j}-${i}">`;
            boardHtml += "</div>";

            // push cell to cells array
            cells.push(`#${j}-${i}`);
        }
    }

    // push board html to dom
    $(board).html(boardHtml);

    // intialize game
    initPlayer()
    generateMaze();

    writeOnConsole(`Initialized ${n}x${n} Game Board`)
    writeOnConsole(" ")
}

writeOnConsole("Maze Puzzle (c) Nauman Umer");
writeOnConsole("Info: Use Arrow keys to move Player", "rgb(97, 175, 255)");

initGame();

// handle on size select selection change
$("#size").change(() => {
    // get value current value of size select
    n = $("#size option:selected").val();    
    var dims = {
        10: 25,
        15: 20,
        20: 20,
        30: 15,
        40: 10,
        50: 10
    }

    // set tile size and reinitialize the game
    TileSize = dims[n];
    initGame();
})