import {MazeGenerator} from "./types";
import {Board, RectangularDirection} from "../board";
import {getRandomInt} from "./utils";

/**
 * https://weblog.jamisbuck.org/2011/2/3/maze-generation-sidewinder-algorithm#
 */
export class Sidewinder implements MazeGenerator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    for (let x = 1; x < board.size.width; x++) {
      board.removeInterWall({y: 0, x: x}, {y: 0, x: x-1})
    }

    for (let y = 1; y < board.size.height; y++) {
      this.visitRow(y, board);
    }

    return board;
  }

  private visitRow(y: number, board: Board) {
    let joinedCells = 0;
    for (let x = 1; x < board.size.width; x++) {
      if (Math.random() > .5) {
        board.removeInterWall({y, x: x - 1}, {y, x})
        joinedCells++;
      } else {
        const h = getRandomInt(x - 1 - joinedCells, x);
        board.removeInterWall({y, x: h}, {y: y - 1, x: h})
        joinedCells = 0;
      }
    }

    const h = getRandomInt(board.size.width - joinedCells - 1, board.size.width);
    board.removeInterWall({y, x: h}, {y: y - 1, x: h})
  }
}
