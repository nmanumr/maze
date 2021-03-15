import {Observable, Subject} from "rxjs";
import {Board} from "./board";
import {BoardOptions} from "./types";
import {concatMap, map, share, take} from "rxjs/operators";
import generatorsManager from "../generators";

interface MountOptions {
  board$: Observable<BoardOptions>;
}


const board$ = new Subject<BoardOptions>()

/**
 * Reset board with last board settings
 */
export function resetBoard() {
  board$
    .pipe(take(1))
    .subscribe((options) => {
      board$.next(options);
    });
}

/**
 * generate a new board with given board `options`
 */
export function newBoard(options: BoardOptions) {
  board$.next(options);
}


/**
 *
 */
export function mountBoard(): Observable<Board> {
  return board$
    .pipe(
      concatMap(async ({width, height, generator}) => {
        let board = new Board(width, height);
        board = (await generatorsManager.loadGenerator(generator)).generate(board);
        return board;
      }),
      share(),
    );
}
