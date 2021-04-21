import {BehaviorSubject, Observable} from "rxjs";
import {Board} from "./board";
import {concatMap, filter, share} from "rxjs/operators";
import {MazeGenerator} from "../generators";
import {Position} from "../utils";

/*--------------
 * Interfaces
 *-------------- */

export interface BoardOptions {
  width: number;
  height: number;
  generator: MazeGenerator,
}

/*-------------------
 * Reactive instance
 *------------------- */

const board$ = new BehaviorSubject<BoardOptions>(null)


/*-------------------
 * Actions
 *------------------- */

/**
 * Reset board with last board settings
 */
export function resetBoard() {
  board$.next(board$.getValue());
}

/**
 * generate a new board with given board `options`
 */
export function newBoard(options: BoardOptions) {
  board$.next(options);
}

/*-------------------
 * Helpers
 *------------------- */

/**
 * Checks if the given position is last position of cell
 * useful to test game win state
 */
export function isLastCell({x, y}: Position): boolean {
  const {width, height} = board$.getValue();
  return x === width - 1 && y === height - 1;
}

/*-------------------
 * Functions
 *------------------- */

export function mountBoard(): Observable<Board> {
  return board$
    .pipe(
      filter(ev => !!ev),
      concatMap(async ({width, height, generator}) => {
        let board = new Board(width, height);
        return generator.generate(board);
      }),
      share(),
    );
}
