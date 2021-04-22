import {MazeGenerator} from "./types";
import {Board, Cell, RectangularDirection} from "../board";
import {CellSet} from "../utils/cellSet";
import {getRandomFrom, getUnvisitedCell, randomWalkUntil} from "./utils";

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

    // mark a random cell a visited
    const visitedCells = new CellSet();
    visitedCells.add(board.getRandomCell());

    // loop until not all the cells are visited
    while (visitedCells.size < board.size.height * board.size.width) {
      // get a visited cell -- just a fun fact its not random its first unvisited cell ;)
      let randomCell = getUnvisitedCell(board, visitedCells);

      // make random walk until not reached some visited cell
      let path = randomWalkUntil(randomCell, board, (cell, path) => {
        if (path.includes(cell)) {
          const i = path.indexOf(cell);
          path.splice(i, path.length);
        }

        return !visitedCells.hasCell(cell);
      });

      // remove wall between cells of path
      for (let i = 1; i < path.length; i++) {
        board.removeInterWall(path[i - 1].position, path[i].position);
      }

      // mark all the path cells as visited
      visitedCells.addAll(path);
    }

    return board;
  }
}
