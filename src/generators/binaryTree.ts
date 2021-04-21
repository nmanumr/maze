import {Board, RectangularDirection} from '../board';
import {Generator} from "./types";

/**
 * http://weblog.jamisbuck.org/2011/2/1/maze-generation-binary-tree-algorithm
 */
export default class BinaryTree implements Generator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    const topBias = Math.random() > 0.5;
    const rightBias = Math.random() > 0.5;

    for (let currentCell of board.cells) {
      let neighbourCells = Array.from(board.getNeighbourCells(currentCell.position).values());
      neighbourCells = neighbourCells.filter((cell) => {
        const dir = board.getRelativeDirection(currentCell.position, cell.position);

        return (rightBias && dir == RectangularDirection.LEFT) ||
          (!rightBias && dir == RectangularDirection.RIGHT) ||
          (topBias && dir == RectangularDirection.DOWN) ||
          (!topBias && dir == RectangularDirection.UP);
      });

      if (neighbourCells.length > 0) {
        const randomCell = neighbourCells[Math.round((neighbourCells.length - 1) * Math.random())];
        board.removeInterWall(randomCell.position, currentCell.position)
      }
    }

    return board;
  }
}
