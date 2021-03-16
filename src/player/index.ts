import {animationFrameScheduler, BehaviorSubject, merge, Observable} from "rxjs";
import {IPosition} from "../utils";
import {Keyboard, Swipe} from "../browser$";
import {distinctUntilChanged, map, observeOn, tap, withLatestFrom} from "rxjs/operators";
import {Board, RectangularDirection} from "../board";
import confetti from 'canvas-confetti';

export interface MountOptions {
  keyboard$: Observable<Keyboard>;
  board$: Observable<Board>;
  swipe$: Observable<Swipe>;
}

export interface Player {
  visible: boolean;
  position: IPosition;
}

interface Control {
  dir: RectangularDirection
}

const keyMap = {
  'ArrowRight': RectangularDirection.RIGHT,
  'ArrowLeft': RectangularDirection.LEFT,
  'ArrowUp': RectangularDirection.UP,
  'ArrowDown': RectangularDirection.DOWN,
}

export function mountPlayer(
  {keyboard$, swipe$, board$}: MountOptions
): Observable<Player> {
  const player$ = new BehaviorSubject<Player>({
    visible: true,
    position: {x: 0, y: 0}
  });

  board$
    .pipe(
      withLatestFrom(player$),
      tap(([_, {position}]) => {
        if (position.x !== 0 || position.y !== 0) {
          player$.next({
            visible: true,
            position: {x: 0, y: 0}
          })
        }
      })
    ).subscribe()

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
      withLatestFrom(player$, board$),
      tap(([{dir}, player, board]) => {
        let assistedPlayer = true;
        let {x, y} = player.position;
        if (x >= board.size.width || y >= board.size.height || board.hasWall({x, y}, dir)) {
          return;
        }

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
        } while (assistedPlayer);

        if (x === board.size.width - 1 && y === board.size.height - 1) {
          // extract out this logic
          setTimeout(() => {
            player$.next({
              visible: true,
              position: {x: x + 1, y}
            });
            confetti({origin: {y: 0.8}, particleCount: 100}).then();
          }, 250);
        }

        player$.next({
          visible: true,
          position: {x, y}
        });
      })
    ).subscribe();

  return player$.pipe(
    observeOn(animationFrameScheduler),
    distinctUntilChanged((a, b) => {
      return a.visible === b.visible
        && a.position.x === b.position.x
        && a.position.y === b.position.y;
    })
  )
}
