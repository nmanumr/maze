import {Board} from "../board";
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
