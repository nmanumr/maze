/**
 * Depth first recursive backtrack maze generation algorithm
 * https://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
 *
 * Generates long dead ends making the solution little difficult
 */
class RecursiveBacktrack {
    generate(board) {
        board = board.clone();
        const visitedCells = new Map();
        const randomCell = board.getRandomCell();
        board.cells[0].removeWall("left" /* LEFT */);
        board.cells[board.cells.length - 1].removeWall("right" /* RIGHT */);
        this.visitCell(randomCell, visitedCells, board);
        return board;
    }
    visitCell(cell, visitedCells, board) {
        visitedCells.set(cell.position.stringify(), cell);
        const cells = Array.from(board.getNeighbourCells(cell.position).values());
        while (cells.length !== 0) {
            const i = Math.round(Math.random() * (cells.length - 1));
            const randomCell = cells[i];
            if (!visitedCells.has(randomCell.position.stringify())) {
                board.removeInterWall(cell.position, randomCell.position);
                this.visitCell(randomCell, visitedCells, board);
            }
            cells.splice(i, 1);
        }
    }
}

export default RecursiveBacktrack;
//# sourceMappingURL=recursiveBackTrack.es.js.map
