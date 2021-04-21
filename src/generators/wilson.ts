import {MazeGenerator} from "./types";
import {Board, Cell, RectangularDirection} from "../board";
import {CellSet} from "../utils/cellSet";
import {getRandomFrom, getUnvisitedCell} from "./utils";

/**
 * Wilson's Maze Generation Algorithm
 * https://weblog.jamisbuck.org/2011/1/20/maze-generation-wilson-s-algorithm
 *
 * It unlike many other algorithms generate generate mazes of unbiased complexity
 */
export class Wilson implements MazeGenerator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    const visitedCells = new CellSet();
    visitedCells.add(board.getRandomCell());

    while (visitedCells.size < board.size.height * board.size.width) {
      let randomCell = getUnvisitedCell(board, visitedCells);
      let path: Cell[] = [randomCell];

      while (!visitedCells.hasCell(randomCell)) {
        // TODO: getNeighbourCells
        const neighbourCells = Array.from(board.getNeighbourCells(randomCell.position).values());
        randomCell = getRandomFrom(neighbourCells);

        if (path.includes(randomCell)) {
          path = path.slice(0, path.indexOf(randomCell));

        }
        path.push(randomCell);
      }

      for (let i = 1; i < path.length; i++) {
        board.removeInterWall(path[i - 1].position, path[i].position);
      }

      visitedCells.addAll(path);
    }

    return board;
  }

}
