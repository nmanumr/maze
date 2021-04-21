import {Board, RectangularDirection} from '../board';
import {Generator} from "./types";
import {stringifyPosition} from "../utils";
import {PathSet, PathSetGenerator} from "./_pathSetGenerator";

/**
 * https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm
 */
export default class Kruskal extends PathSetGenerator implements Generator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    const pathSets: PathSet[] = [];

    for (let cell of board.cells) {
      pathSets.push({
        [stringifyPosition(cell.position)]: cell,
      });
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
