import {Board, RectangularDirection} from '../board';
import {Generator} from "./types";
import {shuffle, stringifyPosition} from "../utils";
import {PathSet, PathSetGenerator} from "./_pathSetGenerator";

/**
 * https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm
 */
export default class Eller extends PathSetGenerator implements Generator {
  generate(board: Board): Board {
    board = board.clone();

    // open top-left and bottom-right walls
    board.cells[0].removeWall(RectangularDirection.LEFT);
    board.cells[board.cells.length - 1].removeWall(RectangularDirection.RIGHT);

    const pathSets: PathSet[] = [];

    for (let x = 0; x < board.size.width; x++) {
      const cell = board.getCell({x, y: 0});
      pathSets.push({
        [stringifyPosition(cell.position)]: cell,
      });
    }

    for (let y = 0; y < board.size.height - 1; y++) {
      this.visitRow(y, false, board, pathSets);
      this.visitNextRow(y, board, pathSets);
    }

    this.visitRow(board.size.height - 1, true, board, pathSets);
    return board;
  }

  private visitRow(index: number, mergeAll: boolean, board: Board, pathSets: PathSet[]) {
    for (let x = 1; x < board.size.width; x++) {
      const cell1 = board.getCell({y: index, x: x - 1});
      const cell2 = board.getCell({y: index, x});

      if (this.isFromSameSet(cell1, cell2, pathSets)) {
        continue;
      }

      if (Math.random() > 0.5 || mergeAll) {
        board.removeInterWall(cell1.position, cell2.position);
        this.joinCellSets(cell1, cell2, pathSets);
      } else if (this.getSetFromCell(cell1, pathSets) == null) {
        pathSets.push({
          [stringifyPosition(cell1.position)]: cell1,
        })
      } else if (this.getSetFromCell(cell2, pathSets) == null) {
        pathSets.push({
          [stringifyPosition(cell2.position)]: cell2,
        })
      }
    }
  }

  private visitNextRow(index: number, board: Board, pathSets: PathSet[]) {
    for (let set of pathSets) {
      let setCells = Object.entries(set)
        .filter(([key, cell]) => {
          return cell.position.y === index;
        })
        .map(([key, cell]) => cell);

      setCells = shuffle(setCells);
      let n = 1 + Math.round(Math.random() * (setCells.length - 1));
      for (let i = 0; i < n; i++) {
        const cell = setCells[i];
        const nextCell = board.getCell({x: cell.position.x, y: cell.position.y + 1});
        // const previousCell = cell.position.x > 0 ? board.getCell({
        //   x: cell.position.x - 1,
        //   y: cell.position.y + 1
        // }) : null;
        //
        // if (previousCell && this.isFromSameSet(cell, previousCell, pathSets)) {
        //   continue;
        // }

        board.removeInterWall(cell.position, nextCell.position);
        set[stringifyPosition(nextCell.position)] = nextCell;
      }
    }
  }
}
