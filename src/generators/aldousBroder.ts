import {Board, RectangularDirection} from '../board';
import {MazeGenerator} from "./types";
import {CellSet} from "../utils/cellSet";

/**
 * https://weblog.jamisbuck.org/2011/1/17/maze-generation-aldous-broder-algorithm
 */
export default class AldousBroder implements MazeGenerator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    // select a random cell and start from that cell
    let currentCell = board.getRandomCell();
    const visitedCells = new CellSet();
    visitedCells.add(currentCell);

    let movingTowards;

    while (visitedCells.size < board.size.height * board.size.width) {
      const cellNeighbours = Array.from(board.getNeighbourCells(currentCell.position).values());

      const unvisitedNeighbours = cellNeighbours.filter((cell) => {
        return !visitedCells.hasCell(cell);
      })

      // If there are some unvisited neighbours choose any random neighbour and visit it
      if (unvisitedNeighbours.length > 0) {
        let randomCell = cellNeighbours[Math.round((cellNeighbours.length - 1) * Math.random())];
        if (!visitedCells.hasCell(randomCell)) {
          board.removeInterWall(randomCell.position, currentCell.position)
          visitedCells.add(randomCell);
          movingTowards = null;
        }

        currentCell = randomCell;
      } else {
        // else just find random unvisited cell and move towards that cell
        // until you hit some cell which has some unvisited neighbours
        // NOTE: its not from actual algorithm but doing make this algorithm to always end in finite time

        if (!movingTowards) {
          const unvisitedCells = board.cells.filter((cell) => {
            return !visitedCells.hasCell(cell);
          });

          movingTowards = unvisitedCells[Math.round((unvisitedCells.length - 1) * Math.random())]
        }

        let dx = Math.sign(movingTowards.position.x - currentCell.position.x);
        let dy = dx === 0 ? Math.sign(movingTowards.position.y - currentCell.position.y) : 0;
        currentCell = board.getCell({x: currentCell.position.x + dx, y: currentCell.position.y + dy});
      }
    }

    return board;
  }
}
