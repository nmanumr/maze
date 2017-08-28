/**
 * Generate maze using Recursive backtracker Algorithm
 */
function generateMaze() {
    // Recursive backtracker Algorithm
    // https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker

    // Marking all the cell as unvisited
    var unvisitedCells = JSON.parse(JSON.stringify(cells));

    // removing first cell from unvisited cells
    // & marking it as current
    var current = unvisitedCells[0];
    unvisitedCells = removeCellFromArray(unvisitedCells, current);
    removeCellBorder(current, "l");

    // Initializing stack
    var stack = [];

    // Loop until there is no unvisited cell
    while (unvisitedCells.length > 0) {
        // get all the unvisited neighbors of current cell
        var unvisitedNeighbors = getUnvisitedNeighbors(current, unvisitedCells);

        // if there are some unvisited neighbors of current cell
        if (unvisitedNeighbors.length > 0) {
            // choose a random neighbor from neighbors array
            var nextCell = unvisitedNeighbors[randomIntFromInterval(0, unvisitedNeighbors.length - 1)];
            // pushing this to stack
            stack.push(current);
            // removing walls between current cell and randomly chosen neighbor
            removeWallsBetween(current, nextCell);

            // mark randomly chosen neighbor as current
            current = nextCell;
            // remove it from unvisited cells array
            unvisitedCells = removeCellFromArray(unvisitedCells, nextCell);
        } else if (stack.length > 0) {
            // take a cell from stack, mark it active and remove it from stack
            current = stack.pop();
        }
    }

    // remove right border of last cell
    removeCellBorder(cells[cells.length - 1], 'r');

    writeOnConsole("Generated Maze")
}


/** Chose a random number in a range */
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/** Remove an element from array */
function removeCellFromArray(arry, e) {
    var index = arry.indexOf(e);
    if (index > -1) arry.splice(index, 1);
    return arry;
}

/** Remove cells border */
function removeCellBorder(cell, borders) {
    $(cell).addClass(borders);
}


/** Returns an array of all unvisited neighbors */
function getUnvisitedNeighbors(cell, unvisitedCells) {
    var dirs = ['l', 'r', 't', 'b'];
    var unvisitedNeighbors = [];

    for (var dir of dirs) {
        var nextCell = getNextCell(cell, dir);
        if (unvisitedCells.indexOf(nextCell) > -1)
            unvisitedNeighbors.push(nextCell);
    }

    return unvisitedNeighbors;
}


/** convert id to position */
function getPosFromCellAddr(addr) {
    var temp = addr.replace("#", '').split("-")
    return [parseInt(temp[0]), parseInt(temp[1])];
}


/** Get next cell id in a certain direction */
function getNextCell(cell, dir) {
    var crntPos = getPosFromCellAddr(cell);
    var nextCellPos = [];
    switch (dir) {
        case 't':
            nextCellPos = [crntPos[0], crntPos[1] - 1];
            break;
        case 'b':
            nextCellPos = [crntPos[0], crntPos[1] + 1];
            break;
        case 'l':
            nextCellPos = [crntPos[0] - 1, crntPos[1]];
            break;
        case 'r':
            nextCellPos = [crntPos[0] + 1, crntPos[1]];
            break;
        default:
            return false;
    }

    if (nextCellPos[0] < 0 || nextCellPos[1] < 0) return false;
    return "#" + nextCellPos.join("-");
}


/** Remove wall between two cell from id's */
function removeWallsBetween(cell1, cell2) {
    cell1Pos = getPosFromCellAddr(cell1);
    cell2Pos = getPosFromCellAddr(cell2);
    var dif = getCellsDif(cell1Pos, cell2Pos)

    if (dif[0] == 1 && dif[1] == 0) {
        removeCellBorder(cell2, "l");
        removeCellBorder(cell1, "r");
    } else if (dif[0] == -1 && dif[1] == 0) {
        removeCellBorder(cell1, "l");
        removeCellBorder(cell2, "r");
    } else if (dif[0] == 0 && dif[1] == 1) {
        removeCellBorder(cell1, "b");
        removeCellBorder(cell2, "t");
    } else if (dif[0] == 0 && dif[1] == -1) {
        removeCellBorder(cell2, "b");
        removeCellBorder(cell1, "t");
    }
}

/** Get cell position difference from cell position */
function getCellsDif(cell1, cell2) {
    return [cell2[0] - cell1[0], cell2[1] - cell1[1]];
}