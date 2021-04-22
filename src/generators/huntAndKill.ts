import {Board, Cell, RectangularDirection} from '../board';
import {MazeGenerator} from "./types";
import {stringifyPosition} from "../utils";
import {PathSetGenerator} from "./_pathSetGenerator";
import {getUnvisitedCell, randomWalkUntil} from "./utils";
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
    visitedCells.add(cell);

    while (cell) {
      const neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());
      for (let neighbourCell of neighbourCells) {
        if (visitedCells.hasCell(neighbourCell)) {
          board.removeInterWall(cell.position, neighbourCell.position);

          let path = randomWalkUntil(cell, board, (cell, path) => {
            visitedCells.add(cell);
            let neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());
            return neighbourCells.some((cell) => {
              return !visitedCells.hasCell(cell);
            })
          }, visitedCells);

          // remove wall between cells of path
          for (let i = 1; i < path.length; i++) {
            board.removeInterWall(path[i - 1].position, path[i].position);
          }

          break;
        }
      }

      cell = getUnvisitedCell(board, visitedCells);
    }

    return board;
  }
}
