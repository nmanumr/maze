import {Board, Cell, RectangularDirection} from '../board';
import {Generator} from "./types";
import {stringifyPosition} from "../utils";
import {PathSetGenerator} from "./_pathSetGenerator";

/**
 * https://weblog.jamisbuck.org/2011/1/24/maze-generation-hunt-and-kill-algorithm
 */
export default class HuntAndKill extends PathSetGenerator implements Generator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    // select a random cell and start from that cell
    const visitedCells = new Set<string>();
    let cell = this.getUnvisitedCell(board, visitedCells);

    while (cell) {
      const neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());
      for (let neighbourCell of neighbourCells) {
        if (visitedCells.has(stringifyPosition(neighbourCell.position))) {
          board.removeInterWall(cell.position, neighbourCell.position);
          break;
        }
      }

      this.randomWalk(cell, board, visitedCells);
      cell = this.getUnvisitedCell(board, visitedCells);
    }

    return board;
  }

  private getUnvisitedCell(board: Board, visitedCells: Set<string>) {
    for (let cell of board.cells) {
      if (!visitedCells.has(stringifyPosition(cell.position))) {
        return cell;
      }
    }
  }

  private randomWalk(cell: Cell, board: Board, visitedCells: Set<string>) {
    visitedCells.add(stringifyPosition(cell.position));

    let neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());
    neighbourCells = neighbourCells.filter((cell) => {
      return !visitedCells.has(stringifyPosition(cell.position));
    });
    if (neighbourCells.length === 0) return;

    const randomCell = neighbourCells[Math.round(Math.random() * (neighbourCells.length - 1))];
    if (!visitedCells.has(stringifyPosition(randomCell.position))) {
      board.removeInterWall(cell.position, randomCell.position);
      visitedCells.add(stringifyPosition(randomCell.position));

      this.randomWalk(randomCell, board, visitedCells);
    }
  }
}
