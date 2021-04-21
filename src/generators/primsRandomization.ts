import {Board, RectangularDirection} from '../board';
import {MazeGenerator} from "./types";
import {CellSet} from "../utils/cellSet";

/**
 * Prim's Randomization Algorithm
 * http://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm
 *
 * Generates relatively easy to solve mazes with short dead ends
 */
export default class PrimsRandomization implements MazeGenerator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    // select a random cell and start from that cell
    const visitedCells = new CellSet();
    let randomCell = board.getRandomCell();
    const neighbourCells = new CellSet(Array.from(board.getNeighbourCells(randomCell.position).values()));

    visitedCells.add(randomCell);

    while (neighbourCells.size > 0) {
      randomCell = neighbourCells.getRandom();
      const randomCellNeighbours = new CellSet(Array.from(board.getNeighbourCells(randomCell.position).values()));

      for (let randomCellNeighbour of randomCellNeighbours.values()) {
        if (visitedCells.hasCell(randomCellNeighbour)) {
          board.removeInterWall(randomCellNeighbour.position, randomCell.position);

          neighbourCells.remove(randomCell);
          visitedCells.add(randomCell);
          neighbourCells.addAll(Array.from(randomCellNeighbours.values()));
          neighbourCells.removeAll(Array.from(visitedCells.values()));
          break;
        }
      }
    }

    return board;
  }
}
