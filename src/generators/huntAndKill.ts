import {Board, RectangularDirection} from '../board';
import {MazeGenerator} from "./types";
import {PathSetGenerator} from "./_pathSetGenerator";
import {randomWalkUntil} from "./utils";
import {CellSet} from "../utils/cellSet";
import {stringifyPosition} from "../utils";

/**
 * https://weblog.jamisbuck.org/2011/1/24/maze-generation-hunt-and-kill-algorithm
 */
export default class HuntAndKill extends PathSetGenerator implements MazeGenerator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    // select a random cell and mark as visited to start from that cell
    const visitedCells = new CellSet();
    let cell = board.getRandomCell();
    // visitedCells.add(cell);

    while (cell) {
      // start a random walk from this cell until there is a dead end
      let path = randomWalkUntil(cell, board, (cell, path) => {
        if (visitedCells.hasCell(cell)) return false;
        visitedCells.add(cell);
        let neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());
        return neighbourCells.some((cell) => {
          return !visitedCells.hasCell(cell);
        });
      }, visitedCells);

      // remove wall between cells of path
      for (let i = 1; i < path.length; i++) {
        board.removeInterWall(path[i - 1].position, path[i].position);
      }
      visitedCells.addAll(path);

      cell = this.hunt(board, visitedCells);
    }
    return board;
  }

  private hunt(board: Board, visitedCells: CellSet) {
    for (let cell of board.cells) {
      if (visitedCells.hasCell(cell)) continue;

      const neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());
      for (let neighbourCell of neighbourCells) {
        if (visitedCells.hasCell(neighbourCell)) {
          board.removeInterWall(cell.position, neighbourCell.position);
          return cell;
        }
      }
    }
  }
}
