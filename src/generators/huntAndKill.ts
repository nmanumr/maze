import {Board, Cell, RectangularDirection} from '../board';
import {MazeGenerator} from "./types";
import {stringifyPosition} from "../utils";
import {PathSetGenerator} from "./_pathSetGenerator";
import {getUnvisitedCell} from "./utils";
import {CellSet} from "../utils/cellSet";

/**
 * https://weblog.jamisbuck.org/2011/1/24/maze-generation-hunt-and-kill-algorithm
 */
export default class HuntAndKill extends PathSetGenerator implements MazeGenerator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    // select a random cell and start from that cell
    const visitedCells = new CellSet();
    let cell = getUnvisitedCell(board, visitedCells);

    while (cell) {
      const neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());
      for (let neighbourCell of neighbourCells) {
        if (visitedCells.has(stringifyPosition(neighbourCell.position))) {
          board.removeInterWall(cell.position, neighbourCell.position);
          break;
        }
      }

      this.randomWalk(cell, board, visitedCells);
      cell = getUnvisitedCell(board, visitedCells);
    }

    return board;
  }

  private randomWalk(cell: Cell, board: Board, visitedCells: CellSet) {
    visitedCells.add(cell);

    let neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());
    neighbourCells = neighbourCells.filter((cell) => {
      return !visitedCells.hasCell(cell);
    });
    if (neighbourCells.length === 0) return;

    const randomCell = neighbourCells[Math.round(Math.random() * (neighbourCells.length - 1))];
    if (!visitedCells.hasCell(randomCell)) {
      board.removeInterWall(cell.position, randomCell.position);
      visitedCells.add(randomCell);

      this.randomWalk(randomCell, board, visitedCells);
    }
  }
}
