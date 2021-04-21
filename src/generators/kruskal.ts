import {Board, RectangularDirection} from '../board';
import {MazeGenerator} from "./types";
import {PathSetGenerator} from "./_pathSetGenerator";
import {CellSet} from "../utils/cellSet";

/**
 * https://weblog.jamisbuck.org/2011/1/3/maze-generation-kruskal-s-algorithm
 */
export default class Kruskal extends PathSetGenerator implements MazeGenerator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    const pathSets: CellSet[] = [];

    for (let cell of board.cells) {
      pathSets.push(new CellSet([cell]));
    }

    while (pathSets.length > 1) {
      const randomCell = board.getRandomCell();
      const neighbours = Array.from(board.getNeighbourCells(randomCell.position).values());
      const randomNeighbour = neighbours[Math.round((neighbours.length - 1) * Math.random())]

      if (this.isFromSameSet(randomCell, randomNeighbour, pathSets)) continue;

      board.removeInterWall(randomCell.position, randomNeighbour.position);
      this.joinCellSets(randomCell, randomNeighbour, pathSets);
    }

    return board;
  }
}
