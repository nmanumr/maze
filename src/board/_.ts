import {BehaviorSubject, Observable} from "rxjs";
import {Board} from "./board";
import {concatMap, filter, share} from "rxjs/operators";
import generatorsManager, {Generators} from "../generators";

/*--------------
 * Interfaces
 *-------------- */

export interface BoardOptions {
  width: number;
  height: number;
  generator: Generators,
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
 * Functions
 *------------------- */

export function mountBoard(): Observable<Board> {
  return board$
    .pipe(
      filter(ev => !!ev),
      concatMap(async ({width, height, generator}) => {
        let board = new Board(width, height);
        board = (await generatorsManager.loadGenerator(generator)).generate(board);
        return board;
      }),
      share(),
    );
}
