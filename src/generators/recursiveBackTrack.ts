import {Board, Cell, RectangularDirection} from '../board';
import {Generator} from "./types";
import {stringifyPosition} from "../utils";

/**
 * Depth first recursive backtrack maze generation algorithm
 * https://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
 *
 * Generates long dead ends making the solution little difficult
 */
export default class RecursiveBacktrack implements Generator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    // select a random cell and start from that cell
    const visitedCells = new Set<string>();
    const randomCell = board.getRandomCell();

    this.visitCell(randomCell, visitedCells, board);
    return board;
  }

  visitCell(cell: Cell, visitedCells: Set<string>, board: Board) {
    visitedCells.add(stringifyPosition(cell.position));
    const neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());

    while (neighbourCells.length !== 0) {
      // select a random neighbour
      const i = Math.round(Math.random() * (neighbourCells.length - 1));
      const randomCell = neighbourCells[i];

      // if random neighbour is not already visited remove wall between
      // random neighbour and current cell and recursively visit that neighbour
      if (!visitedCells.has(stringifyPosition(randomCell.position))) {
        board.removeInterWall(cell.position, randomCell.position);
        this.visitCell(randomCell, visitedCells, board);
      }

      // after visit remove random neighbour from neighbourCells
      neighbourCells.splice(i, 1);
    }
  }
}
