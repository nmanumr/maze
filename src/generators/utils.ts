import {Board, Cell} from "../board";
import {stringifyPosition} from "../utils";
import {CellSet} from "../utils/cellSet";

export function getUnvisitedCell(board: Board, visitedCells: CellSet) {
  for (let cell of board.cells) {
    if (!visitedCells.has(stringifyPosition(cell.position))) {
      return cell;
    }
  }
}

export function getRandomFrom<T>(list: T[]): T {
  return list[Math.round(Math.random() * (list.length - 1))];
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

// may be we should move it somewhere else
// wilson, hunt&kill, aldousBroder, backtrack
/**
 * Do a random walk in the board until some condition is fulfilled
 */
export function randomWalkUntil(
  cell: Cell,
  board: Board,
  until: (cell: Cell, path: Cell[]) => boolean,
  visitedCells: CellSet = null,
  path: Cell[] = [],
): Cell[] {
  while (until(cell, path)) {
    path.push(cell);
    let neighbourCells = Array.from(board.getNeighbourCells(cell.position).values());
    if (visitedCells) {
      neighbourCells = neighbourCells.filter((cell) => {
        return !visitedCells.hasCell(cell);
      })
    }
    cell = getRandomFrom(neighbourCells);
  }

  path.push(cell);
  return path;
}
