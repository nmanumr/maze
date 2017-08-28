var board = $('#board');
var TileSize = 25;
var size = 10;
var dev = false;
var cells = [];

function initGame() {
    cells = [];
    $("#board").height(size * TileSize);
    $("#board").width(size * TileSize);

    var boardHtml = '<div id="player"></div>';
    var n = 0,
        k = 0;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {

            boardHtml += `<div class="cell" style="left:${j * TileSize}px;top: ${i * TileSize}px;height: ${TileSize - 1}px;width:${TileSize - 1}px" id="${j}-${i}">`;
            boardHtml += "</div>";

            cells.push(`#${j}-${i}`);
            n++;
        }
    }

    $(board).html(boardHtml);

    initPlayer()
    generateMaze();

    writeOnConsole(`Initialized ${size}x${size} Game Board`)
    writeOnConsole(" ")
}

writeOnConsole("Maze Puzzle (c) Nauman Umer");
writeOnConsole("Info: Use Arrow keys to move Player", "rgb(97, 175, 255)");

initGame();

$("#size").change(() => {
    size = $("#size option:selected").val();
    var dims = {
        10: 25,
        15: 20,
        20: 20,
        30: 15,
        40: 10,
        50: 10
    }
    TileSize = dims[size];
    initGame();
})