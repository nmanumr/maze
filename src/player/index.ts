import {animationFrameScheduler, BehaviorSubject, merge, Observable} from "rxjs";
import {Keyboard, Swipe} from "../browser";
import {Board, RectangularDirection} from "../board";
import {Position} from "../utils";
import {filter, map, observeOn, withLatestFrom} from "rxjs/operators";

/*------------------
 * Types
 *------------------*/

export interface MountOptions {
  keyboard$: Observable<Keyboard>;
  swipe$: Observable<Swipe>;
  board$: Observable<Board>;
}

export interface Player {
  state: 'active' | 'inactive' | 'hidden';
  position: Position;
}

export interface Control {
  dir: RectangularDirection
}

/*------------------
 * Maps
 *------------------*/

export const keyMap = {
  'ArrowRight': RectangularDirection.RIGHT,
  'ArrowLeft': RectangularDirection.LEFT,
  'ArrowUp': RectangularDirection.UP,
  'ArrowDown': RectangularDirection.DOWN,
}

/*--------------------
 * Reactive instance
 *--------------------*/

const player$ = new BehaviorSubject<Player>({
  state: 'active',
  position: {x: 0, y: 0}
});


/*--------------------
 * Actions
 *--------------------*/

/**
 * Set player Position
 */
export function setPlayerPosition(position: Position) {
  const {state} = player$.getValue();
  player$.next({
    state,
    position,
  })
}

/**
 * Set player Position
 */
export function setPlayerState(state: 'active' | 'inactive' | 'hidden') {
  const {position} = player$.getValue();
  player$.next({
    state,
    position,
  })
}

/**
 * Move player in given direction
 */
export function moveInDirection(dir: RectangularDirection, board: Board) {
  let {position: {x, y}} = player$.getValue();

  // continue to moving player in the direction until cell is a passage
  do {
    if (dir === 'right' && x < (board.size.width - 1)) {
      x++;
    } else if (dir === 'left' && x > 0) {
      x--;
    } else if (dir === 'up' && y > 0) {
      y--;
    } else if (dir === 'down' && y < (board.size.height - 1)) {
      y++;
    }

    const visitable = board.getNeighbourCells({x, y}, true);
    if (!visitable.has(dir) || visitable.size > 2) {
      break;
    }
  } while (true);

  setPlayerPosition({x, y});
}

/*--------------------
 * Functions
 *--------------------*/

/**
 * Mount player to game logic
 *
 * returns a observable player
 */
export function mountPlayer(
  {keyboard$, swipe$, board$}: MountOptions
): Observable<Player> {

  // reset player whenever new board is emitted
  board$.subscribe(() => {
    const {position: {x, y}} = player$.getValue();
    if (x !== 0 || y !== 0) {
      setPlayerPosition({x: 0, y: 0})
    }
  })

  // combine touch and keyboard events
  const control$: Observable<Control> = merge(
    keyboard$,
    swipe$,
  ).pipe(
    map((dir) => {
      if ((dir as Keyboard).type) {
        // @ts-ignore
        return {dir: keyMap[dir.type]}
      }
      return dir as Swipe;
    })
  )

  control$
    .pipe(
      withLatestFrom(board$),
      // don't move player if there is a wall in control direction
      // or player is not active
      filter(([{dir}, board]) => {
        const {position: {x, y}, state} = player$.getValue();
        return state === 'active' && !board.hasWall({x, y}, dir);
      })
    )
    .subscribe(([{dir}, board]) => {
      moveInDirection(dir, board)
    });

  // use animationFrameScheduler to ensure smooth animations
  return player$.pipe(
    observeOn(animationFrameScheduler)
  )
}
